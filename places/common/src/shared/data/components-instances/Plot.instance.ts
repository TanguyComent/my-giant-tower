import { UserId } from "@common/shared/utils/TypeWrapper.utils"
import { TowerPartStandInstance } from "./TowerPartStand.instance";

export interface PlotInstance extends Model {
    Spawn: BasePart;
    Lever: Model & {
        Pivot: BasePart;
    }
    Stand: TowerPartStandInstance;
    Origin: BasePart;
}

export enum EPlotAttributes {
    OWNER_ID = "ownerId",
    PLOT_ID = "plotId",
}

export interface PlotAttributes {
    [EPlotAttributes.PLOT_ID]: string;
}

export interface UnassignedPlotAttributes extends PlotAttributes {
    
}

export interface AssignedPlotAttributes extends PlotAttributes {
    [EPlotAttributes.OWNER_ID]: UserId;
}