import { EScreenPanels } from "./EScreenPanels";

export const ScreenPanelsOrder: EScreenPanels[] = [
    EScreenPanels.MANUALLY_SPECIFIED,
    EScreenPanels.HUD,
    EScreenPanels.BACKPACK,

    EScreenPanels.LOADING_SCREEN,
]

const _: Record<EScreenPanels, {}> = {
    [EScreenPanels.LOADING_SCREEN]: {},
    [EScreenPanels.MANUALLY_SPECIFIED]: {},
    [EScreenPanels.HUD]: {},
    [EScreenPanels.BACKPACK]: {},
}