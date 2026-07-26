import { ESounds } from "./ESounds"

export interface ISoundData {
    soundId: string;
    volume: number;
}

export const SoundsData: Record<ESounds, ISoundData> = {
    [ESounds.CLICK]: {
        soundId: "rbxassetid://1234567890",
        volume: 1,
    },
    [ESounds.MAIN_THEME_MUSIC]: {
        soundId: "rbxassetid://0987654321",
        volume: 0.5,
    },
}