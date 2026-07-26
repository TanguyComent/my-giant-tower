import { BaseInterface } from "@common/shared/interfaces/components/BaseInterface";
import { Controller, OnStart } from "@flamework/core";
import { MessagesHandler } from "../interfaces/messages-handler";
import { EInterfaces } from "@game/shared/data/interfaces/EInterfaces";
import { CameraController } from "./Camera.controller";
import { CommonEvents } from "@common/client/Networking";
import { UserInputService } from "@rbxts/services"
import { controllerAtom } from "../states/ControllerAtom"
import { EController } from "@common/shared/data/player/EController"
import { Hud } from "../interfaces/gui/screens/hud"

@Controller()
export class UserInterfaceController implements OnStart {
    public readonly messagesHandler: MessagesHandler = new MessagesHandler();
    public hud: Hud | undefined = undefined;

    private openedInterface?: {
        name: EInterfaces,
        instance: BaseInterface
    }

    private interfacesConstructors: Record<EInterfaces, () => BaseInterface> = {
        
    }

    constructor(
        private cameraController: CameraController,
    ) {}
    
    onStart(): void {
        CommonEvents.onProfileLoaded.connect((session) => {
            this.hud = new Hud();
        })

		UserInputService.LastInputTypeChanged.Connect((lastInputType) => this.onLastInputTypeChanged(lastInputType));
        this.onLastInputTypeChanged(UserInputService.GetLastInputType());
    }

    public openInterface(interfaceName: EInterfaces, options?: {fovFactor?: number; blurSize?: number}) {
        if (this.openedInterface?.name === interfaceName) return; /// Already opened
        if (this.openedInterface) this.closeCurrentInterface(); /// Close current interface if any

        const interfaceConstructor = this.interfacesConstructors[interfaceName];
        this.openedInterface = {
            name: interfaceName,
            instance: interfaceConstructor(),
        }
        
        this.cameraController.setInInterfaceMode(true, options);
    }

    public closeCurrentInterface(specificInterface?: EInterfaces) {
        if (!this.openedInterface) return;
        if (specificInterface && this.openedInterface.name !== specificInterface) return;

        this.openedInterface.instance.destroy();
        this.openedInterface = undefined;

        this.cameraController.setInInterfaceMode(false);
    }

    private onLastInputTypeChanged(lastInputType: Enum.UserInputType) {
		if (lastInputType === Enum.UserInputType.Gamepad1 || lastInputType === Enum.UserInputType.Gamepad2 || lastInputType === Enum.UserInputType.Gamepad3 || lastInputType === Enum.UserInputType.Gamepad4) {
			controllerAtom(EController.GAMEPAD);
		} else if (lastInputType === Enum.UserInputType.Keyboard || lastInputType === Enum.UserInputType.MouseButton1 || lastInputType === Enum.UserInputType.MouseButton2) {
			controllerAtom(EController.KEYBOARD);
		} else if (lastInputType === Enum.UserInputType.Touch) {
			controllerAtom(EController.TOUCH);
		}
    }
}
