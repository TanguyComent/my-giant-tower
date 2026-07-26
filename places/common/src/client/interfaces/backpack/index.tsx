import React, { StrictMode } from "@rbxts/react"
import ReactRoblox, { createRoot, createPortal } from "@rbxts/react-roblox"
import { Players } from "@rbxts/services"
import { App } from "./components/App"
import { BackpackController } from "@common/client/controllers/Backpack.controller"
import { EffectsProvider } from "@common/shared/interfaces/components/context/EffectsContext"
import { ScreenPanelsOrder } from "@common/shared/data/screenPanels/ScreenPanels.data"
import { EScreenPanels } from "@common/shared/data/screenPanels/EScreenPanels"

export class BackpackUI {
    private root: ReactRoblox.Root;
    private screenGui: ScreenGui;

    constructor(
        backpackController: BackpackController,
    ) {
        const player = Players.LocalPlayer;
        const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

        this.screenGui = new Instance("ScreenGui");
        this.screenGui.Name = "Backpack";
        this.screenGui.Parent = playerGui;
        this.screenGui.ResetOnSpawn = false;
        this.screenGui.IgnoreGuiInset = true;
        this.screenGui.AutoLocalize = true;
        this.screenGui.ScreenInsets = Enum.ScreenInsets.DeviceSafeInsets;
        this.screenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
        this.screenGui.DisplayOrder = ScreenPanelsOrder.indexOf(EScreenPanels.BACKPACK);

        this.root = createRoot(this.screenGui);
        this.root.render(
            <StrictMode>
                <EffectsProvider container={this.screenGui}>
                    {createPortal(<App backpackController={backpackController} />, this.screenGui)}
                </EffectsProvider>
            </StrictMode>,
        );
    }

    setVisibility(visible: boolean) {
        this.screenGui.Enabled = visible;
    }

    destroy() {
        this.root.unmount();
        this.screenGui.Destroy();
    }
}