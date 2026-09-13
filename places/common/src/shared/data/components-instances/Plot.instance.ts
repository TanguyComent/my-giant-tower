import { UserId } from "@common/shared/utils/TypeWrapper.utils"
import { TowerPartStandInstance } from "./TowerPartStand.instance";
import { TowerCurrencyButtonInstance } from "./TowerCurrencyButton.instance";
import { EWorkshopsStands } from "../workshops/EWorkshops"

export interface PlotInstance extends Model {
    Spawn: BasePart;
    Lever: Model & {
        Pivot: BasePart;
    }
    Stand: TowerPartStandInstance;
    Origin: BasePart;
    TowerOrigin: BasePart;
    TowerCurrencyButton: TowerCurrencyButtonInstance;
    WorkshopPositions: Folder & Record<EWorkshopsStands, BasePart>;
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