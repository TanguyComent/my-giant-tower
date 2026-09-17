import { ISettings } from "@common/shared/profileStore/model/IPlayerSession"
import { Atom, atom } from "@rbxts/charm"

export const LocalSettingsAtom: Atom<ISettings> = atom<ISettings>({
    musicVolume: 1,
    sfxVolume: 1,
    autoReconnectEnabled: true,
})