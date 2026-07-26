import { EGamepadKeys } from "@common/shared/data/gamepad/EGamepadKeys"
import { Dependency } from "@flamework/core";
import React, { useEffect, useState } from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm";
import { ContextActionService, TweenService } from "@rbxts/services";
import { usePx } from "../hooks/usePx"
import { Palette } from "@common/shared/Palette"
import { EController } from "@common/shared/data/player/EController"
import { gamepadData as GamepadData } from "@common/shared/data/gamepad/Gamepad.data"
import { ESounds } from "@common/shared/data/sounds/ESounds"
import { GenerateUUID } from "@common/shared/utils/GenerateUUID.utils"

interface AnimatedButtonProps extends React.InstanceProps<TextButton> {
	borderSize?: number;
	borderColor?: Color3;
	borderTransparency?: number;
	aspectRatio?: number;
	buttonChilds?: React.ReactNode;
	clickBackgroundColor?: Color3;
	backgroundColorSequence?: ColorSequence;
	gamepadShortcut?: {
		key: EGamepadKeys,
		priority?: number,
		actionName?: string,
	}
	playerInputDevice?: EController;
	playClientSound?: (soundName: ESounds) => void;
}

export const AnimatedButton = React.forwardRef<TextButton, AnimatedButtonProps>((props, ref) => {
	const propsClone = { ...props }
	const scaleRef = React.useRef<UIScale>();
	const buttonRef = React.useRef<TextButton>();
	const px = usePx();

	const children = propsClone.children;
	delete propsClone.children;

	const borderSize = propsClone.borderSize;
	delete propsClone.borderSize;

	const borderColor = propsClone.borderColor;
	delete propsClone.borderColor;

	const borderTransparency = propsClone.borderTransparency;
	delete propsClone.borderTransparency;

	const clickBackgroundColor = propsClone.clickBackgroundColor;
	delete propsClone.clickBackgroundColor;

	const backgroundColorSequence = propsClone.backgroundColorSequence;
	delete propsClone.backgroundColorSequence;

	const aspectRatio = propsClone.aspectRatio;
	delete propsClone.aspectRatio;

	const buttonChilds = propsClone.buttonChilds;
	delete propsClone.buttonChilds;

	const gamepadShortcut = propsClone.gamepadShortcut;
	delete propsClone.gamepadShortcut;

	const playerInputDevice = propsClone.playerInputDevice;
	delete propsClone.playerInputDevice;

	const playClientSound = propsClone.playClientSound;
	delete propsClone.playClientSound;

	const [isPressed, setIsPressed] = useState(false);

	const frameColor = clickBackgroundColor !== undefined && isPressed
		? clickBackgroundColor
		: (props.BackgroundColor3 ?? Palette.Colors.white);

	const tweenScale = (target: number, time = 0.15) => {
		const s = scaleRef.current;
		if (!s) return;
		TweenService.Create(s, new TweenInfo(time, Enum.EasingStyle.Quad), { Scale: target }).Play();
	};

	const mouseEnter = propsClone.Event?.MouseEnter;
	const mouseLeave = propsClone.Event?.MouseLeave;
	const mouseButton1Up = propsClone.Event?.MouseButton1Up;
	const mouseButton1Down = propsClone.Event?.MouseButton1Down;
	const inputBegan = propsClone.Event?.InputBegan;
	const inputEnded = propsClone.Event?.InputEnded;
	const activated = propsClone.Event?.Activated;


	const setButtonRef = (instance: TextButton | undefined) => {
		buttonRef.current = instance;
		if (typeIs(ref, "function")) {
			ref(instance);
			return;
		}
		if (ref) {
			ref.current = instance;
		}
	};

	useEffect(() => {
		const buttonRefCurrent = buttonRef.current
		if (activated && gamepadShortcut && playerInputDevice === EController.GAMEPAD && !!buttonRefCurrent) {
			const actionName = gamepadShortcut.actionName ?? `Button-gamepadShortcut-${GenerateUUID.generateHexSegment()}`;
			ContextActionService.BindActionAtPriority(
				actionName,
				(_actionName, inputState, inputObject) => {
					if (inputObject.KeyCode !== GamepadData[gamepadShortcut.key].robloxKey) return Enum.ContextActionResult.Pass;
					if (inputState === Enum.UserInputState.Begin) {
						activated(buttonRefCurrent, inputObject, 1);
						return Enum.ContextActionResult.Sink;
					}
					return Enum.ContextActionResult.Pass;
				},
				false,
				gamepadShortcut.priority ?? Enum.ContextActionPriority.High.Value + 1,
				GamepadData[gamepadShortcut.key].robloxKey
			)

			return () => {
				ContextActionService.UnbindAction(actionName);
			};
		}
	}, [gamepadShortcut, playerInputDevice, buttonRef?.current, activated]);


	return (
		<textbutton
			{...propsClone}
			ref={setButtonRef}
			BackgroundTransparency={1}
			Text={""}
			Event={{
				...propsClone.Event,
				MouseEnter: (arg1, arg2, arg3) => {
					if (propsClone.Active === false) return
					tweenScale(1.03)
					mouseEnter?.(arg1, arg2, arg3);
				},
				MouseLeave: (arg1, arg2, arg3) => {
					if (propsClone.Active === false) return
					tweenScale(1)
					setIsPressed(false);
					mouseLeave?.(arg1, arg2, arg3);
				},
				MouseButton1Up: (arg1, arg2, arg3) => {
					if (propsClone.Active === false) return
					tweenScale(1)
					setIsPressed(false);
					mouseButton1Up?.(arg1, arg2, arg3);
				},
				MouseButton1Down: (rbx: TextButton, x: number, y: number) => {
					if (propsClone.Active === false) return
					tweenScale(0.95, 0.2);
					setIsPressed(true);
					mouseButton1Down?.(rbx, x, y);
				},
				InputBegan: (rbx, input) => {
					if (propsClone.Active === false) return
					if (input.UserInputType === Enum.UserInputType.Touch) setIsPressed(true);
					if (input.UserInputType === Enum.UserInputType.Gamepad1 && input.KeyCode === Enum.KeyCode.ButtonA) setIsPressed(true);
					inputBegan?.(rbx, input);
				},
				InputEnded: (rbx, input) => {
					if (propsClone.Active === false) return
					if (input.UserInputType === Enum.UserInputType.Touch) setIsPressed(false);
					if (input.UserInputType === Enum.UserInputType.Gamepad1 && input.KeyCode === Enum.KeyCode.ButtonA) setIsPressed(false);
					inputEnded?.(rbx, input);
				},
				Activated: (rbx: TextButton, inputObject: InputObject, clickCount: number) => {
					playClientSound?.(ESounds.CLICK);
					if (activated) activated(rbx, inputObject, clickCount);
				},
			}}
		>
			{buttonChilds}
			{aspectRatio !== undefined && (<uiaspectratioconstraint AspectRatio={aspectRatio} />)}


			<frame
				Size={UDim2.fromScale(1, 1)}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={props.BackgroundTransparency ?? 0}
				BackgroundColor3={frameColor}
			>
				<uiscale ref={scaleRef} Scale={1} />
				{backgroundColorSequence && (<uigradient
					Color={backgroundColorSequence}
					Rotation={90}
				/>)}
				<uistroke
					Color={borderColor ?? Palette.Colors.black}
					Thickness={borderSize ?? px(5)}
					BorderStrokePosition={Enum.BorderStrokePosition.Inner}
					Transparency={borderTransparency ?? 0}
				/>
				{children}
			</frame>

			{gamepadShortcut && playerInputDevice === EController.GAMEPAD && (
				<imagelabel
					Size={new UDim2(0.4, 0, 1, 0)}
					Position={new UDim2(0.5, 0, 1, px(10))}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Image={GamepadData[gamepadShortcut.key].icon}
					BackgroundTransparency={1}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</imagelabel>
			)}
		</textbutton>
	);
}
)