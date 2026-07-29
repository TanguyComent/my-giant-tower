import React, { useMemo } from "@rbxts/react";
import { TweenService } from "@rbxts/services";
import { CurrencyDiff } from "./CurrencyDiff";
import { useAtom } from "@rbxts/react-charm";
import { Atom } from "@rbxts/charm";
import { GradientUtils } from "@common/shared/utils/Gradient.utils";
import { usePx } from "@common/shared/interfaces/hooks/usePx";
import { Palette } from "@common/shared/Palette";
import { PileComponent } from "@common/shared/interfaces/components/PileComponent";
import { Fonts } from "@common/shared/Fonts";
import { FormatUtils } from "@common/shared/utils/Format.utils";

interface CurrencyDisplayProps {
	currencySelector: Atom<number>;
	Position: UDim2;
	AnchorPoint: Vector2;
	icon: string;
	textGradient: GradientUtils.IGradient;
}

export function CurrencyDisplay({ currencySelector, Position, AnchorPoint, icon, textGradient }: CurrencyDisplayProps) {
	const scaleRef = React.useRef<UIScale>(undefined);
	const labelRef = React.useRef<TextLabel>(undefined);
	const diffsManagerRef = React.useRef<{ createChild: (childDatum: { diff: number; layoutOrder: number }) => void }>();
	const px = usePx();

	const animateScale = (peakScale: number, totalDuration: number) => {
		if (!scaleRef.current) return;
		const halfDuration = totalDuration / 2;

		// Create tweens to scale up to peakScale then back to 1
		const upInfo = new TweenInfo(halfDuration, Enum.EasingStyle.Linear, Enum.EasingDirection.Out, 0, false, 0);
		const downInfo = new TweenInfo(halfDuration, Enum.EasingStyle.Linear, Enum.EasingDirection.In, 0, false, 0);

		const tweenUp = TweenService.Create(scaleRef.current, upInfo, { Scale: peakScale });
		const tweenDown = TweenService.Create(scaleRef.current, downInfo, { Scale: 1 });

		tweenUp.Completed.Connect(() => {
			tweenDown.Play();
		});

		tweenUp.Play();
	};

	const animateColor = (targetColor: Color3, totalDuration: number) => {
		if (!labelRef.current) return;
		const halfDuration = totalDuration / 2;

		// Capture current color to restore later
		const upInfo = new TweenInfo(halfDuration, Enum.EasingStyle.Linear, Enum.EasingDirection.Out, 0, false, 0);
		const downInfo = new TweenInfo(halfDuration, Enum.EasingStyle.Linear, Enum.EasingDirection.In, 0, false, 0);

		const tweenUp = TweenService.Create(labelRef.current, upInfo, { TextColor3: targetColor });
		const tweenDown = TweenService.Create(labelRef.current, downInfo, { TextColor3: Color3.fromHex("#3ced00") });

		tweenUp.Completed.Connect(() => {
			tweenDown.Play();
		});

		tweenUp.Play();
	};

	const playMoneyAddedAnimation = () => {
		animateScale(1.2, 0.35);
		animateColor(Palette.Colors.white, 0.35);
	};

	const playMoneyRemovedAnimation = () => {
		animateScale(0.8, 0.35);
		animateColor(Palette.Colors.red300, 0.35);
	};

	const currency = useAtom(currencySelector);
	const onPileReady = React.useCallback((manager: { createChild: (childDatum: { diff: number; layoutOrder: number }) => void }) => {
		diffsManagerRef.current = manager;
	}, []);

	return (
		<PileComponent<{ diff: number; layoutOrder: number }>
			parentComponent={(children) => (
				<frame
					Size={new UDim2(0, px(100 + 250), 0, px(100))}
					Position={Position}
					AnchorPoint={AnchorPoint}
					BackgroundTransparency={1}
				>
					<frame
						key={"diffs"}
						Size={new UDim2(1, 0, 0, px(50))}
						AnchorPoint={new Vector2(0, 1)}
						BackgroundTransparency={1}
					>
						<uilistlayout
							FillDirection={Enum.FillDirection.Vertical}
							VerticalAlignment={Enum.VerticalAlignment.Bottom}
							SortOrder={Enum.SortOrder.LayoutOrder}
						/>
						{children}
					</frame>
					<frame
						Size={new UDim2(1, 0, 1, 0)}
						BackgroundTransparency={1}
					>
						<uilistlayout 
							FillDirection={Enum.FillDirection.Horizontal}
							HorizontalAlignment={Enum.HorizontalAlignment.Left}
							VerticalAlignment={Enum.VerticalAlignment.Bottom}
							SortOrder={Enum.SortOrder.LayoutOrder}
						/>
						<imagelabel
							LayoutOrder={0}
							Image={icon}
							Size={new UDim2(1, 0, 1, 0)}
							BackgroundTransparency={1}
						>
							<uiaspectratioconstraint AspectRatio={1} />
						</imagelabel>
						<textlabel
							LayoutOrder={1}
							key={"currency_display"}
							ref={labelRef}
							Text={`${FormatUtils.formatCurrency(currency)}`}
							Position={new UDim2(0, px(140), 1, -px(50))}
							Size={new UDim2(0, px(250), 0, px(100))}
							AnchorPoint={new Vector2(0, 1)}
							BackgroundTransparency={1}
							TextColor3={Palette.Colors.white}
							TextScaled={true}
							FontFace={Fonts.FredokaOne}
							TextXAlignment={Enum.TextXAlignment.Left}
						>
							{GradientUtils.createGradient(textGradient)}
							<uistroke Thickness={px(4)} />
							<uiscale Scale={1} ref={scaleRef} />
						</textlabel>
					</frame>
				</frame>
			)}
			childComponent={(childDatum, destroySelf) => (
				<CurrencyDiff
					LayoutOrder={childDatum.layoutOrder}
					amount={childDatum.diff}
					onFinish={destroySelf}
				/>
			)}
			onReady={onPileReady}
		/>
	);
}
