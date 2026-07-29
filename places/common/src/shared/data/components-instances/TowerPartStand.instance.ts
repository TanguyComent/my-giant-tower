import { UserId } from "@common/shared/utils/TypeWrapper.utils";

export interface TowerPartStandInstance extends Model {
    ItemPosition: BasePart;
}

export enum ETowerPartStandAttributes {
    PLOT_ID = "plotId",
    OWNER_ID = "ownerId",
}

export interface TowerPartStandAttributes {
    [ETowerPartStandAttributes.PLOT_ID]: string;
}

export interface AssignedTowerPartStandAttributes extends TowerPartStandAttributes {
    [ETowerPartStandAttributes.OWNER_ID]: UserId;
}