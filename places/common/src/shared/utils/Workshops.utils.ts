import Object from "@rbxts/object-utils";
import { EWorkshops, EWorkshopsStands, EWorkshopStandState } from "../data/workshops/EWorkshops";
import { WorkshopsData } from "../data/workshops/Workshops.data";
import { IUserSession } from "../profileStore/model/IUserSession";

export namespace WorkshopsUtils {
    export function getWorkshopModel(workshopName: EWorkshops) {
        return WorkshopsData[workshopName].model.Clone();
    }

    export function getNextWorkshopStandToUnlock(workshopName: EWorkshops, sessionWorkshopDatum: IUserSession["workshops"]): EWorkshopsStands | undefined {
        const workshopDatum = WorkshopsData[workshopName];
        const amountOfUnlockedStands = Object.values(sessionWorkshopDatum[workshopName]).filter((v) => v.state !== EWorkshopStandState.LOCKED).size();
        return workshopDatum.standsOrder[amountOfUnlockedStands]
    }
}