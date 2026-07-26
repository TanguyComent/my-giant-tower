import { EScreenPanels } from "@common/shared/data/screenPanels/EScreenPanels"
import { ScreenPanelsOrder } from "@common/shared/data/screenPanels/ScreenPanels.data"
import React from "@rbxts/react";
import { StrictMode } from "@rbxts/react";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import Signal from "@rbxts/signal"
import { EffectsProvider } from "../components/context/EffectsContext"

export abstract class BaseInterface {
    protected screenGui: ScreenGui;
    protected root: ReactRoblox.Root;

    protected isDestroyed = false;
    public readonly destroyedEvent = new Signal();

    constructor(
        interfaceName: EScreenPanels,
    ) {
        const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

        this.screenGui = new Instance("ScreenGui");
        this.screenGui.Name = interfaceName;
        this.screenGui.Parent = playerGui;
        this.screenGui.ResetOnSpawn = false;
        this.screenGui.IgnoreGuiInset = true;
        this.screenGui.AutoLocalize = true;
        this.screenGui.ScreenInsets = Enum.ScreenInsets.DeviceSafeInsets;
        this.screenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
        this.screenGui.DisplayOrder = ScreenPanelsOrder.indexOf(interfaceName);

        this.root = createRoot(this.screenGui);
    }

    protected render(app: React.ReactNode) {
        this.root.unmount();
        this.root.render(
            <StrictMode>
                {createPortal(
                    <EffectsProvider container={this.screenGui}>
                        {app}
                    </EffectsProvider>, this.screenGui
                )}
            </StrictMode>,
        );
    }

    public destroy() {
        if (this.isDestroyed) return;
        this.isDestroyed = true;
        this.destroyedEvent.Fire();
        this.root.unmount();
        this.screenGui.Destroy();
    }
}