import { StrictMode } from "@rbxts/react";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import React from "@rbxts/react";
import { ScreenPanelsOrder } from "@common/shared/data/screenPanels/ScreenPanels.data"
import { EScreenPanels } from "@common/shared/data/screenPanels/EScreenPanels"
import { EffectsProvider } from "@common/shared/interfaces/components/context/EffectsContext"
import { App } from "./components/App"

const player = Players.LocalPlayer;

export class Hud {
	private root: ReturnType<typeof createRoot>;
	private screenGui: ScreenGui;

	private shown: React.Binding<boolean>;
	public readonly setShown: (shown: boolean) => void;

	constructor(

	) {
		[this.shown, this.setShown] = React.createBinding(true);

		const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

		this.screenGui = new Instance("ScreenGui");
		this.screenGui.Name = "HudGui";
		this.screenGui.Parent = playerGui;
		this.screenGui.ResetOnSpawn = false;
		this.screenGui.IgnoreGuiInset = true;
		this.screenGui.AutoLocalize = true;
		this.screenGui.ScreenInsets = Enum.ScreenInsets.DeviceSafeInsets;
		this.screenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
		this.screenGui.DisplayOrder = ScreenPanelsOrder.indexOf(EScreenPanels.HUD);

		this.root = createRoot(this.screenGui);
		this.root.render(
			<StrictMode>
				<EffectsProvider container={this.screenGui}>
					{createPortal(
						<App
							shown={this.shown}
						/>,
						this.screenGui
					)}
				</EffectsProvider>
			</StrictMode>,
		);
	}
}
