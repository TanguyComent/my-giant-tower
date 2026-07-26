import React from "@rbxts/react"
import ReactRoblox from "@rbxts/react-roblox"
import { InferProps } from "@rbxts/ui-labs"
import { App } from "./components/App"
import { EffectsProvider } from "@common/shared/interfaces/components/context/EffectsContext"

const controls = {
}

const story = {
    react: React,
    reactRoblox: ReactRoblox,
    controls: controls,
    story: (props: InferProps<typeof controls>) => {
        const [shown] = React.createBinding(true);
        return (
            <EffectsProvider container={props.target}>
                <App
                    shown={shown}
                />
            </EffectsProvider>
        )
    }
}

export = story
