import { UserId } from "@common/shared/utils/TypeWrapper.utils"

export interface PlotInstance extends Model {
    Spawn: BasePart;
}

export enum EPlotAttributes {
    OWNER_ID = "ownerId",
}

interface PlotAttributes {

}

export interface UnassignedPlotAttributes extends PlotAttributes {

}

export interface AssignedPlotAttributes extends PlotAttributes {
    [EPlotAttributes.OWNER_ID]: UserId;
}