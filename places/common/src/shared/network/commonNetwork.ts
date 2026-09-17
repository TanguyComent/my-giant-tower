import { Networking } from "@flamework/networking"
import { IPlayerSession } from "../profileStore/model/IPlayerSession";

interface CommonClientToServerEvents {

}

interface CommonServerToClientEvents {
    onProfileLoaded(session: IPlayerSession): void;
    onFieldUpdated(field: string[], value: unknown): void;
    onFieldsUpdated(fields: Array<{ field: string[], value: unknown }>): void;
    backpack: {
        equipTool: (tool: Tool) => void;
    }
}

interface CommonClientToServerFunctions {
    isProfileLoaded(): boolean;
    getSession(): IPlayerSession | undefined;
}

interface CommonServerToClientFunctions {
    getUtcOffset(): number
}

export const CommonEventsDeclaration = Networking.createEvent<CommonClientToServerEvents, CommonServerToClientEvents>()
export const CommonFunctionsDeclaration = Networking.createFunction<CommonClientToServerFunctions, CommonServerToClientFunctions>()