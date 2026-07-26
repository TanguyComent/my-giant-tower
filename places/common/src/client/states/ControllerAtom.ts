import { EController } from "@common/shared/data/player/EController"
import { atom } from "@rbxts/charm";

export const controllerAtom = atom<EController>(EController.KEYBOARD);
