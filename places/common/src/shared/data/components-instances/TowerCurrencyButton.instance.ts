import { UserId } from "@common/shared/utils/TypeWrapper.utils";

export interface TowerCurrencyButtonInstance extends Model {
    Button: BasePart;
}

export enum ETowerCurrencyButtonAttributes {
    OWNER_ID = "ownerId",
}

export interface TowerCurrencyButtonAttributes {
    [ETowerCurrencyButtonAttributes.OWNER_ID]: UserId;
}
