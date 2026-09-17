import { Controller, OnStart } from "@flamework/core";
import { CommonEvents, CommonFunctions } from "../Networking";
import { LocalSessionAtom } from "../states/LocalSession.atom";
import { PathsUtils } from "@common/shared/utils/Paths.utils";
import { IPlayerSession } from "@common/shared/profileStore/model/IPlayerSession";
import { computed, subscribe } from "@rbxts/charm";
import Object from "@rbxts/object-utils";
import { EGamePasses } from "@common/shared/marketplace/EGamePasses";
import { LocalSettingsAtom } from "../states/LocalSettings.atom"

@Controller()
export class LocalSessionController implements OnStart {

    onStart(): void {
        CommonEvents.onProfileLoaded.connect((session) => this.setSession(session));
        CommonEvents.onFieldUpdated.connect((field, value) => this.onFieldUpdated(field as PathsUtils.AnySessionPath, value as PathsUtils.AnySessionPathValue));
        CommonEvents.onFieldsUpdated.connect((fields) => this.onFieldsUpdated(fields as Array<{ field: PathsUtils.AnySessionPath, value: PathsUtils.AnySessionPathValue }>));
    }

    private onFieldsUpdated<P extends PathsUtils.Path<IPlayerSession>>(
        fields: Array<{
            field: P, 
            value: PathsUtils.PathValue<IPlayerSession, P> 
        }>
    ) {
        LocalSessionAtom(prev => {
            const newSession = { ...prev }
            fields.forEach(({ field, value }) => {
                PathsUtils.set(newSession, field, value)
            })
            return newSession;
        })
    }

    private onFieldUpdated<P extends PathsUtils.Path<IPlayerSession>>(
        field: P, 
        value: PathsUtils.PathValue<IPlayerSession, P>
    ) {
        LocalSessionAtom(prev => {
            const newSession = { ...prev }
            PathsUtils.set(newSession, field, value)
            return newSession;
        })
    }

    private setSession(session: IPlayerSession) {
        session.boughtGamePasses = Object.entries(session.boughtGamePasses).reduce((acc, [gamePass, data]) => {
            acc[tonumber(gamePass) as EGamePasses] = data;
            return acc;
        }, {} as Partial<Record<string, { owned: boolean }>>);

        LocalSessionAtom(session);
        LocalSettingsAtom(session.settings);
    }
}