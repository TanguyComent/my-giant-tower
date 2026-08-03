import Object from "@rbxts/object-utils";
import { EWorkshops, EWorkshopsStands, EWorkshopStandState } from "../data/workshops/EWorkshops";
import { WorkshopsData } from "../data/workshops/Workshops.data";
import { IUserSession } from "../profileStore/model/IUserSession";
import { UserId } from "./TypeWrapper.utils";
import { EWorkshopStandAttributes } from "../data/components-instances/WorkshopStand.instance";
import { Tags } from "../Tags";
import { ETowerParts } from "../data/tower-parts/ETowerPart";

export namespace WorkshopsUtils {
    export function getWorkshopModel(workshopName: EWorkshops) {
        return WorkshopsData[workshopName].model.Clone();
    }

    /**
     * @param workshopName 
     * @param attributes 
     * @returns a workshop model that includes all the required attributes.
     **/
    export function getWorkshopStandModelComponent(
        workshopName: EWorkshops, 
        attributes: {
            workshopStandName: EWorkshopsStands; 
            ownerId: UserId;
            processedTowerPart?: {
                name: ETowerParts;
                initialProgress: number;
            }
        }) {
        const model = getWorkshopModel(workshopName);
        model.SetAttribute(EWorkshopStandAttributes.WORKSHOP_NAME, workshopName);
        model.SetAttribute(EWorkshopStandAttributes.WORKSHOP_STAND_NAME, attributes.workshopStandName);
        model.SetAttribute(EWorkshopStandAttributes.OWNER_ID, attributes.ownerId);

        if (attributes.processedTowerPart) {
            model.SetAttribute(EWorkshopStandAttributes.PROCESSING_TOWER_PART_NAME, attributes.processedTowerPart.name);
            model.SetAttribute(EWorkshopStandAttributes.PROCESSING_INITIAL_PROGRESS, attributes.processedTowerPart.initialProgress);
        }

        return model;
    }

    export function getNextWorkshopStandToUnlock(workshopName: EWorkshops, sessionWorkshopDatum: IUserSession["workshops"]): EWorkshopsStands | undefined {
        const workshopDatum = WorkshopsData[workshopName];
        const amountOfUnlockedStands = Object.values(sessionWorkshopDatum[workshopName]).filter((v) => v.state !== EWorkshopStandState.LOCKED).size();
        return workshopDatum.standsOrder[amountOfUnlockedStands]
    }
}