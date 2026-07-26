import React, { Children, useMemo } from "@rbxts/react"
import { useAtom } from "@rbxts/react-charm"
import { GuiService, Players, StarterGui, TweenService } from "@rbxts/services"
import { VisualItem } from "./VisualItem"
import { BackpackAtom, backpackDragInformationsSelector, backpackEquippedItemSelector, backpackOpenedSelector, IBackpackItem } from "@common/client/states/Backpack.atom"
import { BackpackController } from "@common/client/controllers/Backpack.controller"
import { UUID } from "@common/shared/utils/TypeWrapper.utils"
import { Tags } from "@common/shared/Tags"

const player = Players.LocalPlayer;

interface BackpackItemProps {
    Position?: UDim2
    Size?: UDim2
    backpackItem?: IBackpackItem;
    index: number;
    context: "hotbar" | "inventory";
    children?: React.ReactNode;
    backpackController: BackpackController;
    uuid: UUID;
    visible?: boolean
}

export function BackpackItem({ index, children, backpackItem, Position, Size, context, backpackController, uuid, visible = true }: BackpackItemProps) {
    const isBackpackOpened = useAtom(backpackOpenedSelector);
    const [isHovered, setIsHovered] = React.useState(false);
    const imageButtonRef = React.useRef<ImageButton>(undefined);
    const equippedItem = useAtom(backpackEquippedItemSelector);
    const isEquipped = backpackItem && backpackItem.tool === equippedItem?.tool;
    const dragInformations = useAtom(backpackDragInformationsSelector);
    const isDragged = useMemo(() => {
        if (!dragInformations?.item || !backpackItem) return false;
        return dragInformations?.item.tool === backpackItem?.tool;
    }, [dragInformations?.item, backpackItem]);

    React.useEffect(() => {
        if (!imageButtonRef.current) return;
        imageButtonRef.current.SetAttribute("index", index);
        imageButtonRef.current.SetAttribute("context", context);
        imageButtonRef.current.SetAttribute("uuid", uuid);
        imageButtonRef.current.AddTag(Tags.INVENTORY_SLOT_TAG)
    }, [imageButtonRef.current, uuid, context, index])

    const [position, setPosition] = React.useBinding<UDim2>(Position ?? new UDim2(0, 0, 0, 0));
    React.useEffect(() => {
        setPosition(Position ?? new UDim2(0, 0, 0, 0));
    }, [Position, setPosition])

    return (
        <imagebutton
            key={`backpack-item-${backpackItem?.uuid ?? `empty-${index}`}`}
            ref={imageButtonRef}
            Position={position}
            Size={Size}
            BackgroundTransparency={1}
            BorderSizePixel={0}
            LayoutOrder={index}
            Selectable={true}
            Visible={visible}

            Event={{
                MouseEnter: () => {
                    setIsHovered(true)
                    // Dependency<SoundManagerController>().playClientSound(ESounds.HUD_HOVER)
                    BackpackAtom((old) => {
                        if (!backpackItem || !imageButtonRef.current) return old;
                        return {
                            ...old,
                            hoveredItem: {
                                item: backpackItem,
                                instance: imageButtonRef.current,
                            }
                        }
                    })
                },
                MouseLeave: () => {
                    setIsHovered(false)
                    BackpackAtom((old) => {
                        if (old.hoveredItem?.instance !== imageButtonRef.current) return old;
                        return {
                            ...old,
                            hoveredItem: undefined,
                        }
                    })
                },
                Activated: () => {
                    if (!backpackItem) return;
                    backpackController.toggleTool(backpackItem.tool);
                },
            }}
        >
            <uidragdetector
                Enabled={isBackpackOpened && backpackItem !== undefined}
                CursorIcon={""}
                Event={{
                    DragStart: () => {
                        if (!backpackItem || !imageButtonRef.current) return;
                        BackpackAtom((old) => {
                            if (!imageButtonRef.current) return old;
                            const guiInset = GuiService.GetGuiInset();
                            const mousePosition = new Vector2(Players.LocalPlayer.GetMouse().X, Players.LocalPlayer.GetMouse().Y);
                            return {
                                ...old,
                                draggedItem: {
                                    item: backpackItem,
                                    draggedItemChildren: Children.toArray(children),
                                    dragAnchorPoint: imageButtonRef.current.AbsolutePosition.sub(mousePosition)
                                },
                                dragContext: context,
                            }
                        })
                        imageButtonRef.current.ZIndex = 10
                    },
                    DragEnd: () => {
                        if (!imageButtonRef.current) return;

                        BackpackAtom((old) => {
                            return {
                                ...old,
                                draggedItem: undefined,
                                dragContext: undefined,
                            }
                        })

                        const element = imageButtonRef.current;
                        element.Position = position.getValue() ?? new UDim2(0, 0, 0, 0);
                        element.ZIndex = 1
                        if (!backpackItem) return;

                        const mouse = player.GetMouse();
                        const absolutePosition = element.AbsolutePosition
                        const absoluteSize = element.AbsoluteSize
                        const isUnderOwnSlot = mouse.X >= absolutePosition.X && mouse.X <= (absolutePosition.X + absoluteSize.X)
                            && mouse.Y >= absolutePosition.Y && mouse.Y <= (absolutePosition.Y + absoluteSize.Y);
                        if (isUnderOwnSlot) {
                            if (!backpackItem.tool) return;
                            backpackController.toggleTool(backpackItem.tool);
                            return;
                        }

                        const playerGui = player.FindFirstChildOfClass("PlayerGui") as PlayerGui;
                        const guisUnder = playerGui.GetGuiObjectsAtPosition(mouse.X, mouse.Y);
                        for (const gui of guisUnder) {
                            if (!gui.HasTag(Tags.INVENTORY_SLOT_TAG) || gui === imageButtonRef.current) continue;
                            const targetIndex = gui.GetAttribute("index") as number;
                            const targetContext = gui.GetAttribute("context") as "hotbar" | "inventory";
                            const targetUUID = gui.GetAttribute("uuid") as UUID;

                            backpackController.swapItemsByUUID((
                                context === "hotbar" ? { context: "hotbar", index } : { context: "inventory", uuid }
                            ), (
                                targetContext === "hotbar" ? { context: "hotbar", index: targetIndex } : { context: "inventory", uuid: targetUUID }
                            ))

                            const newHoveredItem = backpackController.getItemAt(targetContext, targetIndex);
                            if (!newHoveredItem) return;
                            BackpackAtom((old) => {
                                return {
                                    ...old,
                                    hoveredItem: {
                                        item: newHoveredItem,
                                        instance: gui
                                    }
                                }
                            })
                            return
                        }

                        /// Dragged outside any slot, putting item in inventory
                        if (context === "hotbar") {
                            backpackController.moveItemToInventory({ context, index });
                        }
                    }
                }}
            />
            {!isDragged && (
                <VisualItem
                    backpackItem={backpackItem}
                    isHovered={isHovered}
                    isEquipped={isEquipped === true}
                    backpackOpened={isBackpackOpened}
                    Size={new UDim2(1, 0, 1, 0)}
                >
                    {children}
                </VisualItem>
            )}
        </imagebutton>
    )
}