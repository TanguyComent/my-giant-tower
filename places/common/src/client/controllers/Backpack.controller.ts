import { Controller, OnStart } from "@flamework/core";
import { Players, StarterGui, UserInputService } from "@rbxts/services";
import { BackpackAtom, IBackpackItem } from "../states/Backpack.atom";
import { computed, effect, peek, subscribe } from "@rbxts/charm";
import { Icon } from "@rbxts/topbar-plus";
import { CommonEvents } from "../Networking"
import { EController } from "@common/shared/data/player/EController"
import { controllerAtom } from "../states/ControllerAtom"
import { BACKPACK_ICON_CLOSED, BACKPACK_ICON_OPENED } from "@common/shared/Assets"
import { GenerateUUID } from "@common/shared/utils/GenerateUUID.utils"
import Signal from "@rbxts/signal"
import { BackpackUI } from "../interfaces/backpack"
import { Tags } from "@common/shared/Tags";

const player = Players.LocalPlayer;

@Controller()
export class BackpackController implements OnStart {
    public readonly onEquippedToolChanged: Signal<(newTool: Tool | undefined, oldTool: Tool | undefined) => void> = new Signal();
    public readonly hotbarItemsCount = UserInputService.KeyboardEnabled ? 10 : 6
    private icon: Icon | undefined;
    private openBackpackKey = Enum.KeyCode.Backquote;
    private backpackUI = new BackpackUI(this);
    private hotbarKeys: { icon: string, keycode: Enum.KeyCode }[] = [
        { icon: "1", keycode: Enum.KeyCode.One },
        { icon: "2", keycode: Enum.KeyCode.Two },
        { icon: "3", keycode: Enum.KeyCode.Three },
        { icon: "4", keycode: Enum.KeyCode.Four },
        { icon: "5", keycode: Enum.KeyCode.Five },
        { icon: "6", keycode: Enum.KeyCode.Six },
        { icon: "7", keycode: Enum.KeyCode.Seven },
        { icon: "8", keycode: Enum.KeyCode.Eight },
        { icon: "9", keycode: Enum.KeyCode.Nine },
        { icon: "0", keycode: Enum.KeyCode.Zero },
    ]

    private destroyConnection?: RBXScriptConnection;

    onStart() {
        CommonEvents.backpack.equipTool.connect((tool) => {
            this.equipTool(tool);
        })
        UserInputService.InputBegan.Connect((input, processed) => {
            if (processed) return;

            if (input.KeyCode === this.openBackpackKey) {
                if (peek(BackpackAtom()).dragContext !== undefined) return; /// Prevent closing backpack while dragging an item
                BackpackAtom((old) => {
                    return {
                        ...old,
                        isOpened: !old.isOpened,
                    }
                })
                return;
            }

            if (input.KeyCode === Enum.KeyCode.DPadLeft) {
                this.toggleAdjacentHotbarTool(-1);
                return;
            }

            if (input.KeyCode === Enum.KeyCode.DPadRight) {
                this.toggleAdjacentHotbarTool(1);
                return;
            }

            const hotbarIndex = this.hotbarKeys.findIndex(hotbarKey => hotbarKey.keycode === input.KeyCode);
            if (hotbarIndex === -1) return;

            const item = peek(BackpackAtom().hotBarItems)[hotbarIndex];
            if (!item || item === "empty") return;

            this.toggleTool(item.tool);
        })

        this.icon = new Icon()
        this.icon.align("Right")
        this.icon.setImageScale(1)
        this.icon.setImage(BACKPACK_ICON_OPENED, "Selected");
        this.icon.setImage(BACKPACK_ICON_CLOSED, "Deselected");
        this.icon.setCaption("Backpack");

        subscribe(controllerAtom, (controller) => {
            if (controller === EController.GAMEPAD) {
                this.icon?.setLabel('L3', "Deselected");
                this.icon?.setLabel('L3', "Selected");
                this.icon?.bindToggleKey(Enum.KeyCode.ButtonL3)
            } else {
                this.icon?.setLabel('', "Deselected");
                this.icon?.setLabel('', "Selected");
                this.icon?.unbindToggleKey(Enum.KeyCode.ButtonL3)
            }
        })

        this.icon.toggled.Connect((selected: boolean) => {
            if (peek(BackpackAtom()).dragContext !== undefined) return;
            BackpackAtom((old) => {
                return {
                    ...old,
                    isOpened: selected,
                }
            })
        })

        effect(() => {
            const isOpened = peek(BackpackAtom()).isOpened;
            if (this.icon) {
                if (isOpened) {
                    this.icon.select();
                } else {
                    this.icon.deselect();
                }
            }
        })

        if (player.Character) this.onCharacterAdded(player.Character);
        player.CharacterAdded.Connect((character) => this.onCharacterAdded(character));

        try {
            StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);
        } catch (e) {
            warn(e);
        }
    }

    public setBackpackUIVisibility(visible: boolean) {
        this.backpackUI.setVisibility(visible);
        if (!visible) {
            BackpackAtom((old) => ({
                ...old,
                hoveredItem: undefined,
            }))
        }
    }

    private onToolAddedInBackpack(tool: Tool) {
        if (tool.HasTag(Tags.TOWER_PART_TOOL_TAG)) return

        const hotbarItems = peek(BackpackAtom().hotBarItems);
        const toolAlreadyExistsInBackpack = hotbarItems.find((item) => item !== "empty" && item.tool === tool) || peek(BackpackAtom().items).find((item) => item.tool === tool);
        if (toolAlreadyExistsInBackpack) return;

        if (hotbarItems.filter((item) => item !== "empty").size() < this.hotbarItemsCount) {
            BackpackAtom((old) => {
                const emptyIndex = old.hotBarItems.findIndex((item) => item === "empty");
                if (emptyIndex === -1) return old;
                old.hotBarItems[emptyIndex] = { tool, uuid: GenerateUUID.generateHexSegment() };

                return {
                    ...old,
                    hotBarItems: [...old.hotBarItems],
                }
            })
        } else {
            BackpackAtom((old) => {
                return {
                    ...old,
                    items: [...old.items, { tool, uuid: GenerateUUID.generateHexSegment() }],
                }
            })
        }
    }

    private onToolRemovedFromBackpack(tool: Tool) {
        const character = player.Character;
        if (!character) return;

        const backpack = player.FindFirstChildOfClass("Backpack");
        if (!backpack) return;
        if (tool.Parent === character || tool.Parent === backpack) return; /// The tool is being equipped or unequipped, not removed from backpack

        BackpackAtom((old) => {
            const newHotbar = [...old.hotBarItems]
            const hotbarIndex = newHotbar.findIndex((item) => item !== "empty" && item.tool === tool);
            if (hotbarIndex !== -1) {
                newHotbar[hotbarIndex] = "empty";
            }

            return {
                ...old,
                hotBarItems: newHotbar,
                items: old.items.filter((item) => item.tool !== tool),
            }
        })
    }

    private initializeBackpackChanges() {
        const backpack = player.FindFirstChildOfClass("Backpack");

        assert(backpack, "Backpack not found");

        for (const child of backpack.GetChildren()) {
            if (!child.IsA("Tool")) continue;
            this.onToolAddedInBackpack(child);
        }

        backpack.ChildAdded.Connect((child) => {
            if (!child.IsA("Tool")) return;
            this.onToolAddedInBackpack(child);
        })

        backpack.ChildRemoved.Connect((child) => {
            if (!child.IsA("Tool")) return;
            this.onToolRemovedFromBackpack(child);
        })
    }

    private onCharacterAdded(character: Model) {
        const onToolEquipped = (tool: Tool) => {
            this.onToolAddedInBackpack(tool);
            BackpackAtom((old) => {
                return {
                    ...old,
                    equippedItem: {
                        tool,
                        uuid: GenerateUUID.generateHexSegment()
                    }
                }
            })
        }

        BackpackAtom((old) => {
            const hotbarItems: ("empty")[] = [];
            while (hotbarItems.size() < this.hotbarItemsCount) {
                hotbarItems.push("empty");
            }

            return {
                ...old,
                items: [],
                hotBarItems: hotbarItems,
            }
        })

        for (const child of character.GetChildren()) {
            if (child.IsA("Tool")) {
                onToolEquipped(child);
            }
        }

        character.ChildAdded.Connect((child) => {
            if (child.IsA("Tool")) {
                this.onEquippedToolChanged.Fire(child, this.getInHandTool());
                onToolEquipped(child)
            };
        })

        character.ChildRemoved.Connect((child) => {
            if (child.IsA("Tool")) {
                BackpackAtom((old) => {
                    return {
                        ...old,
                        equippedItem: undefined,
                    }
                })

                /// The event will be fired by ChildAdded.
                const newEquippedTool = character.FindFirstChildOfClass("Tool");
                if (!newEquippedTool) {
                    this.onEquippedToolChanged.Fire(undefined, child);
                }
                this.onToolRemovedFromBackpack(child);
            }
        })
        this.initializeBackpackChanges();
    }

    public getHotbarKey(index: number): { icon: string, keycode: Enum.KeyCode } | undefined {
        return this.hotbarKeys[index]
    }

    public getHotbarMaxItemsCount(): number {
        return this.hotbarItemsCount;
    }

    private getEquippedHotbarIndex(): number | undefined {
        const equippedTool = peek(BackpackAtom().equippedItem)?.tool;
        if (!equippedTool) return undefined;

        const hotbarItems = peek(BackpackAtom().hotBarItems);
        const index = hotbarItems.findIndex((item) => item !== "empty" && item.tool === equippedTool);
        return index === -1 ? undefined : index;
    }

    private toggleAdjacentHotbarTool(direction: -1 | 1) {
        const hotbarItems = peek(BackpackAtom().hotBarItems);
        const hotbarSize = hotbarItems.size();
        if (hotbarSize === 0) return;

        const hasItemInHotbar = hotbarItems.find((item) => item !== "empty") !== undefined;
        if (!hasItemInHotbar) return;

        const equippedHotbarIndex = this.getEquippedHotbarIndex();
        let cursor = equippedHotbarIndex !== undefined ? equippedHotbarIndex : (direction === 1 ? -1 : hotbarSize);

        for (let i = 0; i < hotbarSize; i++) {
            cursor = (cursor + direction + hotbarSize) % hotbarSize;
            const nextItem = hotbarItems[cursor];
            if (nextItem !== "empty") {
                this.toggleTool(nextItem.tool);
                return;
            }
        }
    }

    private equipTool(tool: Tool) {
        const character = player.Character;
        if (!character) return;

        const humanoid = character.FindFirstChildOfClass("Humanoid");
        if (!humanoid) return;

        character.SetAttribute("hasEquippedBackpackTool", true);
        humanoid.EquipTool(tool);
    }

    public toggleTool(tool: Tool) {
        const character = player.Character;
        if (!character) return;

        const humanoid = character.FindFirstChildOfClass("Humanoid");
        if (!humanoid) return;

        const equippedTool = peek(BackpackAtom().equippedItem);

        if (equippedTool?.tool === tool) {
            humanoid.UnequipTools();
            this.destroyConnection?.Disconnect();
        } else {
            this.destroyConnection?.Disconnect();
            this.destroyConnection = undefined;
            character.SetAttribute("hasEquippedBackpackTool", true);
            humanoid.EquipTool(tool);
        }
    }

    public moveItemToInventory(item: { context: "hotbar", index: number }) {
        BackpackAtom((old) => {
            const targetIndex = old.items.size();
            const newInventory = [...old.items];
            const itemToMove = old.hotBarItems[item.index];
            if (!itemToMove || itemToMove === "empty") return old;

            old.hotBarItems[item.index] = "empty";
            newInventory.insert(targetIndex, itemToMove);

            return {
                ...old,
                items: newInventory,
                hotBarItems: [...old.hotBarItems],
            }
        })
    }

    public swapItemsByUUID(itemA: { context: "hotbar", index: number } | { context: "inventory", uuid: string }, itemB: { context: "hotbar", index: number } | { context: "inventory", uuid: string }) {
        const findItem = (context: "hotbar" | "inventory", uuid: string): { index: number, context: "hotbar" | "inventory" } | undefined => {
            const arrayToSearch = context === "hotbar" ? peek(BackpackAtom().hotBarItems) : peek(BackpackAtom().items);

            for (let i = 0; i < arrayToSearch.size(); i++) {
                const item = arrayToSearch[i];
                if (item === "empty") continue;
                if (item.uuid === uuid) {
                    return { index: i, context };
                }
            }

            return undefined;
        }

        const foundItemA = itemA.context === "hotbar" ? itemA : findItem(itemA.context, itemA.uuid);
        const foundItemB = itemB.context === "hotbar" ? itemB : findItem(itemB.context, itemB.uuid);
        if (!foundItemA || !foundItemB) return;

        this.swapItems(foundItemA, foundItemB);
    }

    private swapItems(itemA: { context: "hotbar" | "inventory", index: number }, itemB: { context: "hotbar" | "inventory", index: number }) {
        BackpackAtom((old) => {
            const newInventory: IBackpackItem[] = [];
            const newHotbar: (IBackpackItem | "empty")[] = [];

            for (let i = 0; i < old.hotBarItems.size(); i++) {
                if (itemA.context === "hotbar" && i === itemA.index) {
                    const itemBToSwap = itemB.context === "hotbar" ? old.hotBarItems[itemB.index] : old.items[itemB.index];
                    newHotbar.push(itemBToSwap);
                    continue;
                }

                if (itemB.context === "hotbar" && i === itemB.index) {
                    const itemAToSwap = itemA.context === "hotbar" ? old.hotBarItems[itemA.index] : old.items[itemA.index];
                    newHotbar.push(itemAToSwap);
                    continue;
                }

                newHotbar.push(old.hotBarItems[i]);
            }

            for (let i = 0; i < old.items.size(); i++) {
                if (itemA.context === "inventory" && i === itemA.index) {
                    const itemBToSwap = itemB.context === "hotbar" ? old.hotBarItems[itemB.index] : old.items[itemB.index];
                    if (itemBToSwap !== "empty") {
                        newInventory.push(itemBToSwap);
                    }
                    continue;
                }

                if (itemB.context === "inventory" && i === itemB.index) {
                    const itemAToSwap = itemA.context === "hotbar" ? old.hotBarItems[itemA.index] : old.items[itemA.index];
                    if (itemAToSwap !== "empty") {
                        newInventory.push(itemAToSwap);
                    }
                    continue;
                }

                newInventory.push(old.items[i]);
            }

            return {
                ...old,
                items: newInventory,
                hotBarItems: newHotbar
            }
        })
    }

    public getItemAt(context: "hotbar" | "inventory", index: number): IBackpackItem | undefined {
        const state = peek(BackpackAtom());
        if (context === "hotbar") {
            const item = state.hotBarItems[index];
            return item === "empty" ? undefined : item;
        } else {
            return state.items[index];
        }
    }

    public getInHandTool(): Tool | undefined {
        return peek(BackpackAtom().equippedItem)?.tool;
    }
}
