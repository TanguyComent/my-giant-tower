import { usePx } from "@common/shared/interfaces/hooks/usePx";
import { Palette } from "@common/shared/Palette";
import { FormatUtils } from "@common/shared/utils/Format.utils";
import { GradientUtils } from "@common/shared/utils/Gradient.utils";
import React from "@rbxts/react";

interface CurrencyDiffProps {
	amount: number;
	LayoutOrder: number;
	onFinish: () => void;
}

export function CurrencyDiff({ amount, onFinish, LayoutOrder }: CurrencyDiffProps) {
	const px = usePx();
	const textLabelRef = React.useRef<TextLabel>(undefined);
	const scaleRef = React.useRef<UIScale>(undefined);
	const text = React.useMemo(() => {
		return amount > 0
			? `+ ${FormatUtils.formatCurrency(amount)}`
			: `- ${FormatUtils.formatCurrency(math.abs(amount))}`;
	}, [amount]);
	const textColor = React.useMemo(() => {
		return amount > 0 ? GradientUtils.Gradients.Green : GradientUtils.Gradients.Red;
	}, [amount]);

	const scaleTo = (targetScale: number, duration: number) => {
		if (!scaleRef.current) return;

		const tweenInfo = new TweenInfo(duration, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0);
		const tween = game.GetService("TweenService").Create(scaleRef.current, tweenInfo, { Scale: targetScale });
		tween.Play();
	};

	React.useEffect(() => {
		scaleTo(1, 0.2);

		task.delay(1, () => {
			scaleTo(0, 0.2);
			task.delay(0.2, () => onFinish());
		});
	}, [scaleRef.current]);

	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
			<textlabel
				ref={textLabelRef}
				LayoutOrder={LayoutOrder}
				Size={UDim2.fromScale(1, 1)}
				AnchorPoint={new Vector2(0, 1)}
				Position={UDim2.fromScale(0, 1)}
				Text={text}
				TextScaled={true}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextColor3={Palette.Colors.white}
				Font={Enum.Font.SourceSansBold}
				BackgroundTransparency={1}
			>
				<uistroke Thickness={px(3)} />
				<uiscale Scale={0} ref={scaleRef} />
				{GradientUtils.createGradient(textColor)}
			</textlabel>
		</frame>
	);
}
