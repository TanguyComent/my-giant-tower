import React from "@rbxts/react";
import { AnimatedButton } from "./AnimatedButton";
import { EGamepadKeys } from "@common/shared/data/gamepad/EGamepadKeys"

interface RoundedButtonProps extends React.InstanceProps<TextButton> {
    backgroundColorSequence?: ColorSequence;
    clickBackgroundColor?: Color3;
    aspectRatio?: number;
    buttonChilds?: React.ReactNode;
    cornerRadius?: UDim;
    gamepadShortcut?: {
        key: EGamepadKeys,
        priority?: number,
        actionName?: string,
    }
}

export const RoundedButton = React.forwardRef<TextButton, RoundedButtonProps>((props, ref) => {
    const propsClone = { ...props };

    const gamepadShortcut = propsClone.gamepadShortcut;
    delete propsClone.gamepadShortcut;

    const backgroundColorSequence = propsClone.backgroundColorSequence;
    delete propsClone.backgroundColorSequence;

    const clickBackgroundColor = propsClone.clickBackgroundColor;
    delete propsClone.clickBackgroundColor;

    const aspectRatio = propsClone.aspectRatio;
    delete propsClone.aspectRatio;

    const buttonChilds = propsClone.buttonChilds;
    delete propsClone.buttonChilds;

    const cornerRadius = propsClone.cornerRadius;
    delete propsClone.cornerRadius;



    return (
        <AnimatedButton
            {...propsClone}
            ref={ref}
            gamepadShortcut={gamepadShortcut}
            backgroundColorSequence={backgroundColorSequence}
            clickBackgroundColor={clickBackgroundColor}
            BackgroundColor3={propsClone.BackgroundColor3}
            aspectRatio={aspectRatio}
            borderSize={0}
            buttonChilds={buttonChilds}
        >
            <uicorner CornerRadius={cornerRadius ?? new UDim(0.2, 0)} />
            {propsClone.children}
        </AnimatedButton>
    )
})