import { useMountEffect } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { TweenService } from "@rbxts/services";

export namespace GradientUtils {
    export interface IGradient {
        Color: ColorSequence;
        Rotation: number;
        RotationSpeed?: number;
    }

    export const Gradients = {
        Black: {
            Color: new ColorSequence(new Color3(0, 0, 0)),
            Rotation: 0,
        },
        White: {
            Color: new ColorSequence(new Color3(1, 1, 1)),
            Rotation: 0,
        },
        Green: {
            Color: new ColorSequence([
                new ColorSequenceKeypoint(0, Color3.fromRGB(180, 255, 180)),  
                new ColorSequenceKeypoint(0.5, Color3.fromRGB(100, 230, 120)),
                new ColorSequenceKeypoint(1, Color3.fromRGB(60, 200, 100)),   
            ]),
            Rotation: 90,
        },
        Yellow: {
            Color: new ColorSequence([
                new ColorSequenceKeypoint(0, Color3.fromHex("#EFFF3C")),
                new ColorSequenceKeypoint(0.22, Color3.fromHex("#EFFF3C")),
                new ColorSequenceKeypoint(1, Color3.fromHex("#FFAE00")),
            ]),
            Rotation: 90,
        },
        Rainbow: {
            Color: new ColorSequence([
                new ColorSequenceKeypoint(0, Color3.fromRGB(255, 0, 4)),
                new ColorSequenceKeypoint(0.20700000000000002, Color3.fromRGB(234, 0, 255)),
                new ColorSequenceKeypoint(0.425, Color3.fromRGB(0, 55, 255)),
                new ColorSequenceKeypoint(0.648, Color3.fromRGB(0, 255, 247)),
                new ColorSequenceKeypoint(0.841, Color3.fromRGB(68, 255, 0)),
                new ColorSequenceKeypoint(1, Color3.fromRGB(255, 238, 0))
            ]),
            Rotation: 20,
        },
        Diamond: {
            Color: new ColorSequence([
                new ColorSequenceKeypoint(0, Color3.fromRGB(0, 255, 255)),
                new ColorSequenceKeypoint(0.434, Color3.fromRGB(17, 255, 254)),
                new ColorSequenceKeypoint(0.585, Color3.fromRGB(213, 255, 251)),
                new ColorSequenceKeypoint(0.76, Color3.fromRGB(0, 129, 141)),
                new ColorSequenceKeypoint(1, Color3.fromRGB(0, 93, 93))
            ]),
            Rotation: 90,
        },
        Gold: {
            Color: new ColorSequence([
                new ColorSequenceKeypoint(0, Color3.fromHex("#ff8000")),
                new ColorSequenceKeypoint(0.282, Color3.fromHex("#ff9500")),
                new ColorSequenceKeypoint(0.494, Color3.fromHex("#ffee00")),
                new ColorSequenceKeypoint(0.696, Color3.fromHex("#ff9600")),
                new ColorSequenceKeypoint(1, Color3.fromHex("#ff8800")),
            ]),
            Rotation: 90,
        },
        Red: {
            Color: new ColorSequence(Color3.fromHex("#FF8A30"), Color3.fromHex("#F70000")),
            Rotation: 90,
        },
        Purple: {
            Color: new ColorSequence([
                new ColorSequenceKeypoint(0, Color3.fromHex("#FF00D0")),
                new ColorSequenceKeypoint(0.26, Color3.fromHex("#FF00D0")),
                new ColorSequenceKeypoint(0.73, Color3.fromHex("#A600FF")),
                new ColorSequenceKeypoint(1, Color3.fromHex("#A600FF")),
            ]),
            Rotation: 90,
        },

        Transmuted: {
            Color: new ColorSequence([
                new ColorSequenceKeypoint(0, Color3.fromHex("#171717")),
                new ColorSequenceKeypoint(0.21, Color3.fromHex("#171717")),
                new ColorSequenceKeypoint(0.51, Color3.fromHex("#6B6B6B")),
                new ColorSequenceKeypoint(0.8, Color3.fromHex("#000000")),
                new ColorSequenceKeypoint(1, Color3.fromHex("#000000")),
            ]),
            Rotation: 90,
        }
    }

    function RotatingGradient(props: IGradient & { children?: React.ReactNode }) {
        const gradientRef = React.useRef<UIGradient>();
        const rotationSpeed = props.RotationSpeed ?? 0;

        useMountEffect(() => {
            const gradient = gradientRef.current;
            if (!gradient || rotationSpeed <= 0) {
                return;
            }

            let cancelled = false;
            let currentTween: Tween | undefined;

            const rotate = () => {
                if (cancelled || !gradientRef.current) {
                    return;
                }

                const tween = TweenService.Create(
                    gradientRef.current,
                    new TweenInfo(360 / rotationSpeed, Enum.EasingStyle.Linear),
                    { Rotation: gradientRef.current.Rotation + 360 },
                );

                currentTween = tween;

                tween.Completed.Connect(() => {
                    if (cancelled || currentTween !== tween) {
                        tween.Destroy();
                        return;
                    }

                    tween.Destroy();
                    rotate();
                });

                tween.Play();
            };

            rotate();

            return () => {
                cancelled = true;
                currentTween?.Cancel();
                currentTween?.Destroy();
            };
        });

        return (
            <uigradient
                ref={gradientRef}
                Color={props.Color}
                Rotation={props.Rotation}
            >
                {props.children}
            </uigradient>
        );
    }

    export function createGradient(gradient: IGradient, children?: React.ReactNode) {
        return (
            <RotatingGradient
                Color={gradient.Color}
                Rotation={gradient.Rotation}
                RotationSpeed={gradient.RotationSpeed}
            >
                {children}
            </RotatingGradient>
        )
    }
}