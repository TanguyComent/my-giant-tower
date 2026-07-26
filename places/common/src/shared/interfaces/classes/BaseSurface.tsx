import React from "@rbxts/react";
import { StrictMode } from "@rbxts/react";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import { EffectsProvider } from "../components/context/EffectsContext"

export abstract class BaseSurface {
    protected surfaceGui: SurfaceGui;
    private root: ReactRoblox.Root;
    protected effectsContainer: ScreenGui;

    private isDestroyed = false;
 
    constructor(
        adornee: BasePart,
        surfaceGuiName: string,
    ) {
        const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;
        this.surfaceGui = new Instance("SurfaceGui");
        this.surfaceGui.Name = surfaceGuiName;
        this.surfaceGui.Parent = playerGui;
        this.surfaceGui.Adornee = adornee;
        this.surfaceGui.Active = true;
        this.surfaceGui.Enabled = true;
        this.surfaceGui.ResetOnSpawn = false;

        const container = new Instance("ScreenGui");
        container.Name = `${surfaceGuiName}_EffectsContainer`;
        container.Parent = playerGui;
        container.ResetOnSpawn = false;
        container.IgnoreGuiInset = true;
        container.AutoLocalize = true;
        container.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
        container.DisplayOrder = 1;

        this.effectsContainer = container;
        this.root = createRoot(this.surfaceGui);
    }

    public render(app: React.ReactNode) {
        this.root.unmount();
        this.root.render(
            <StrictMode>
                <EffectsProvider container={this.effectsContainer}>
                    {createPortal(app, this.surfaceGui)}
                </EffectsProvider>
            </StrictMode>
        );
    }

    public destroy() {
        if (this.isDestroyed) return;
        this.isDestroyed = true;
        this.root.unmount();
        this.surfaceGui.Destroy();
    }
}