import { UserId } from "@common/shared/utils/TypeWrapper.utils";
import { EWorkshops, EWorkshopsStands } from "../workshops/EWorkshops";
import { ETowerParts } from "../tower-parts/ETowerPart";

export interface IWorkshopStandInstance extends Model {
    ProximityPromptAnchor: Attachment;
}

export enum EWorkshopStandAttributes {
    WORKSHOP_NAME = "workshopName",
    WORKSHOP_STAND_NAME = "workshopStandName",
    OWNER_ID = "ownerId",
    PROCESSING_TOWER_PART_NAME = "processingTowerPartName",
    PROCESSING_INITIAL_PROGRESS = "processingInitialProgress",
}

interface IWorkshopStandAttributes {
    [EWorkshopStandAttributes.WORKSHOP_NAME]: EWorkshops;
    [EWorkshopStandAttributes.WORKSHOP_STAND_NAME]: EWorkshopsStands;
    [EWorkshopStandAttributes.OWNER_ID]: UserId;
}

export interface IUnlockedWorkshopStandAttributes extends IWorkshopStandAttributes {

}

export interface IUnlockableWorkshopStandAttributes extends IWorkshopStandAttributes {

}

export interface IProcessingWorkshopStandAttributes extends IWorkshopStandAttributes {
    [EWorkshopStandAttributes.PROCESSING_TOWER_PART_NAME]: ETowerParts;
    [EWorkshopStandAttributes.PROCESSING_INITIAL_PROGRESS]: number;
}