import { Wrapper } from "@common/shared/interfaces/components/Wrapper"
import { useBindingState } from "@rbxts/pretty-react-hooks"
import React from "@rbxts/react"

interface Props {
	shown: React.Binding<boolean>;
}

export function App({ shown }: Props) {
	const shownValue = useBindingState(shown);
    
    return shownValue && (
        <Wrapper>
            
        </Wrapper>
    )
}
