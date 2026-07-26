import { UserInputService } from "@rbxts/services";
import { EGamepadKeys } from "./EGamepadKeys";


export interface IGamepadData {
    icon: string;
    robloxKey: Enum.KeyCode;

}

export const gamepadData: Record<EGamepadKeys, IGamepadData> = {
    [EGamepadKeys.A]: {
        icon: 'rbxassetid://71999533089949',
        // icon: UserInputService.GetImageForKeyCode(Enum.KeyCode.ButtonA),
        robloxKey: Enum.KeyCode.ButtonA,
    },
    [EGamepadKeys.B]: {
        icon: "rbxassetid://82030750865443",
        // icon: UserInputService.GetImageForKeyCode(Enum.KeyCode.ButtonB),
        robloxKey: Enum.KeyCode.ButtonB,
    },
    [EGamepadKeys.X]: {
        icon: "rbxassetid://82729064080125",
        // icon: UserInputService.GetImageForKeyCode(Enum.KeyCode.ButtonX),
        robloxKey: Enum.KeyCode.ButtonX,
    },
    [EGamepadKeys.Y]: {
        icon: "rbxassetid://112635275415799",
        // icon: UserInputService.GetImageForKeyCode(Enum.KeyCode.ButtonY),
        robloxKey: Enum.KeyCode.ButtonY,
    },
    [EGamepadKeys.R1]: {
        icon: "rbxassetid://110036004409412",
        // icon: UserInputService.GetImageForKeyCode(Enum.KeyCode.ButtonR1),
        robloxKey: Enum.KeyCode.ButtonR1,
    },
    [EGamepadKeys.R2]: {
        icon: "rbxassetid://131874989022069",
        // icon: UserInputService.GetImageForKeyCode(Enum.KeyCode.ButtonR2),
        robloxKey: Enum.KeyCode.ButtonR2,
    },
    [EGamepadKeys.R3]: {
        icon: "rbxassetid://97926372339095",
        // icon: UserInputService.GetImageForKeyCode(Enum.KeyCode.ButtonR3),
        robloxKey: Enum.KeyCode.ButtonR3,
    },
    [EGamepadKeys.L1]: {
        icon: "rbxassetid://103156859075686",
        // icon: UserInputService.GetImageForKeyCode(Enum.KeyCode.ButtonL1),
        robloxKey: Enum.KeyCode.ButtonL1,
    },
    [EGamepadKeys.L2]: {
        icon: "rbxassetid://101643592285001",
        // icon: UserInputService.GetImageForKeyCode(Enum.KeyCode.ButtonL2),
        robloxKey: Enum.KeyCode.ButtonL2,
    },
    [EGamepadKeys.L3]: {
        icon: "rbxassetid://104229966512442",
        // icon: UserInputService.GetImageForKeyCode(Enum.KeyCode.ButtonL3),
        robloxKey: Enum.KeyCode.ButtonL3,
    },
    [EGamepadKeys.DPAD_UP]: {
        icon: "rbxassetid://82007677995536",
        // icon: UserInputService.GetImageForKeyCode(Enum.KeyCode.DPadUp),
        robloxKey: Enum.KeyCode.DPadUp,
    },
    [EGamepadKeys.DPAD_DOWN]: {
        icon: "rbxassetid://89236927839168",
        // icon: UserInputService.GetImageForKeyCode(Enum.KeyCode.DPadDown),
        robloxKey: Enum.KeyCode.DPadDown,
    },
    [EGamepadKeys.DPAD_LEFT]: {
        icon: "rbxassetid://139490677732095",
        // icon: UserInputService.GetImageForKeyCode(Enum.KeyCode.DPadLeft),
        robloxKey: Enum.KeyCode.DPadLeft,
    },
    [EGamepadKeys.DPAD_RIGHT]: {
        icon: "rbxassetid://140249926912266",
        // icon: UserInputService.GetImageForKeyCode(Enum.KeyCode.DPadRight),
        robloxKey: Enum.KeyCode.DPadRight,
    },

}