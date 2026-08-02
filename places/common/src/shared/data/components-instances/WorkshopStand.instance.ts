import { EWorkshops, EWorkshopsStands } from "../workshops/EWorkshops";

export interface IWorkshopStandInstance extends Model {
    ProximityPromptAnchor: Attachment;
}

export enum EWorkshopStandAttributes {
    WORKSHOP_NAME = "workshopName",
    WORKSHOP_STAND_NAME = "workshopStandName",
}

interface IWorkshopStandAttributes {
    [EWorkshopStandAttributes.WORKSHOP_NAME]: EWorkshops;
    [EWorkshopStandAttributes.WORKSHOP_STAND_NAME]: EWorkshopsStands;
}

export interface IUnlockedWorkshopStandAttributes extends IWorkshopStandAttributes {

}

export interface iUnlockableWorkshopStandAttributes extends IWorkshopStandAttributes {

}