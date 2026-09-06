import { LocalSessionAtom, TowerCurrencySelector } from "@common/client/states/LocalSession.atom"
import { Fonts } from "@common/shared/Fonts"
import { TOWER_CURRENCY_SYNC_INTERVAL } from "@common/shared/GlobalConfig"
import { Palette } from "@common/shared/Palette"
import { AnimationsUtils } from "@common/shared/utils/AnimationsUtils"
import { FormatUtils } from "@common/shared/utils/Format.utils"
import { computed } from "@rbxts/charm"
import { Janitor } from "@rbxts/janitor"
import React, { useBinding, useEffect, useMemo } from "@rbxts/react"
import { useAtom } from "@rbxts/react-charm"
import { RunService } from "@rbxts/services"

interface Props {
}

export function App({  }: Props) {
    const amount = useAtom(TowerCurrencySelector);
    const [shownAmount, setShownAmount] = useBinding(amount)
    const currentAnimationJanitorRef = React.useRef(new Janitor());

    useEffect(() => {
        currentAnimationJanitorRef.current.Cleanup();
        if (amount === 0) {
            setShownAmount(0);
            return;
        }

        const initial = shownAmount.getValue();
        const diff = amount - initial
        if (diff === 0) return;

        const duration = TOWER_CURRENCY_SYNC_INTERVAL / 3;
        let elapsedTime = 0;

        const connection = RunService.RenderStepped.Connect((dt) => {
            elapsedTime += dt;
            const progress = math.clamp(elapsedTime / duration, 0, 1);
            const easedProgress = AnimationsUtils.Easing.SmoothStep(progress);
            setShownAmount(initial + easedProgress * diff);
        })
        currentAnimationJanitorRef.current.Add(connection, "Disconnect");
    }, [amount]);

    return (
        <textlabel
            Size={UDim2.fromScale(1, 1)}
            BackgroundTransparency={1}
            Text={shownAmount.map((currency) => `$${FormatUtils.formatCurrency(currency)}`)}
            TextScaled={true}
            TextColor3={Palette.Colors.white}
            FontFace={Fonts.FredokaOne}
        >
            <uistroke Thickness={2} />
        </textlabel>
    );
}