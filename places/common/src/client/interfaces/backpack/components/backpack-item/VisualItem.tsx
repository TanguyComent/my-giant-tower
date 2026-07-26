import { backpackDragInformationsSelector, IBackpackItem } from "@common/client/states/Backpack.atom"
import { Fonts } from "@common/shared/Fonts"
import { usePx } from "@common/shared/interfaces/hooks/usePx"
import { Palette } from "@common/shared/Palette"
import { BackpackUtils } from "@common/shared/utils/Backpack.utils"
import React, { useMemo } from "@rbxts/react"
import { useAtom } from "@rbxts/react-charm"
import { TweenService } from "@rbxts/services"

interface VisualItemProps {
    isHovered: boolean;
    isEquipped: boolean;
    backpackOpened: boolean;
    backpackItem?: IBackpackItem;

    Size?: UDim2;
    Position?: UDim2;
    AnchorPoint?: Vector2;
    children?: React.ReactNode;
}

export function VisualItem({ backpackItem, isHovered, isEquipped, backpackOpened, Position, Size, AnchorPoint, children }: VisualItemProps) {
    const frameRef = React.useRef<Frame>(undefined);
    const px = usePx();
    const dragInformations = useAtom(backpackDragInformationsSelector);

    const [stackSize, setStackSize] = React.useState(backpackItem ? backpackItem.tool.GetAttribute(BackpackUtils.STACK_SIZE_ATTRIBUTE) as number : undefined);
    
    React.useEffect(() => {
        if (!backpackItem) return;

        const connection2 = backpackItem.tool.GetAttributeChangedSignal(BackpackUtils.STACK_SIZE_ATTRIBUTE).Connect(() => {
            const newValue = backpackItem.tool.GetAttribute(BackpackUtils.STACK_SIZE_ATTRIBUTE) as number;
            setStackSize(newValue);
        })

        return () => {
            connection2.Disconnect();
        }
    }, [backpackItem])


    React.useEffect(() => {
        if (!frameRef.current) return;
        const targetColor = isHovered ? new Color3(0.8, 0.8, 0.8) : Palette.Colors.white;

        const tween = TweenService.Create(
            frameRef.current,
            new TweenInfo(0.22, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
            { BackgroundColor3: targetColor },
        )

        tween.Play();

        return () => tween.Pause();
    }, [isHovered, frameRef.current]);

    const backgroundColor = useMemo(() => {
        return new ColorSequence(Color3.fromHex("#283035"), Color3.fromHex("#2a434c"));
    }, [])
    return (
        <frame
            ref={frameRef}
            Position={Position}
            Size={Size}
            AnchorPoint={AnchorPoint}
            BackgroundTransparency={0.3}
            BackgroundColor3={Palette.Colors.white}
            BorderSizePixel={0}
            Active={false}
            Selectable={false}
        >
            <uicorner CornerRadius={new UDim(0.15, 0)} />
            {isEquipped && (
                <uistroke
                    Color={Color3.fromHex("#17e0ff")}
                    Thickness={px(5)}
                    ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
                    BorderStrokePosition={Enum.BorderStrokePosition.Outer}
                />
            )}
            {backpackItem && (
                <imagelabel
                    Image={backpackItem.tool.TextureId}
                    Size={new UDim2(0.8, 0, 0.8, 0)}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundTransparency={1}
                    ZIndex={1}
                />
            )}
            {stackSize !== undefined && (
                <textlabel
                    Text={`x${stackSize}`}
                    BackgroundTransparency={1}
                    TextColor3={Palette.Colors.white}
                    FontFace={Fonts.FredokaOne}
                    Position={new UDim2(1, 0, 1, 0)}
                    AnchorPoint={new Vector2(1, 1)}
                    TextScaled={true}
                    TextXAlignment={Enum.TextXAlignment.Right}
                    TextYAlignment={Enum.TextYAlignment.Bottom}
                    Size={new UDim2(0.3, 0, 0.3, 0)}
                >
                    <uistroke Thickness={px(5)} Color={Palette.Colors.black} />
                </textlabel>
            )}
            {children}

        </frame>
    )
}