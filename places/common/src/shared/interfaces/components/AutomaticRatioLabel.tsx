import React from "@rbxts/react";
import { TextService } from "@rbxts/services";
import { useBindingState } from "@rbxts/pretty-react-hooks";
import { DefaultTextLabel } from "./DefaultTextLabel"

interface IAutomaticRatioLabelProps extends React.InstanceProps<TextLabel> {

}

export function AutomaticRatioLabel(props: IAutomaticRatioLabelProps) {
    const [aspectRatio, setAspectRatio] = React.useState(1);
    const text = useBindingState(props.Text)

    React.useEffect(() => {
        if (!text) return;
        const textSize = TextService.GetTextSize(text, 100, Enum.Font.FredokaOne, new Vector2(10000, 10000));
        setAspectRatio(textSize.X / textSize.Y);
    }, [text])
    
    return (
        <DefaultTextLabel
            {...props}
        >
            {props.children}
            <uiaspectratioconstraint AspectRatio={aspectRatio} />
        </DefaultTextLabel>
    )
}