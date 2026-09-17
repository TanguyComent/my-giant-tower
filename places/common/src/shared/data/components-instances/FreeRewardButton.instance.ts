import { UserId } from "@common/shared/utils/TypeWrapper.utils";

export interface FreeRewardButtonInstance extends Model {
    Zone: BasePart;
    Button: BasePart;
    BillboardPart: BasePart;
}

export enum EFreeRewardButtonAttributes {
    OWNER_ID = "ownerId",
}

export interface FreeRewardButtonAttributes {
    [EFreeRewardButtonAttributes.OWNER_ID]: UserId;
}
