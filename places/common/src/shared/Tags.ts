import { UserId } from "./utils/TypeWrapper.utils"

export namespace Tags {
    export const INVENTORY_SLOT_TAG = "InventorySlot"
    export const TOWER_PART_TOOL_TAG = "TowerPartTool"

    export const PLOT_TAG = "Plot"
    export const ASSIGNED_PLOT_TAG = `Assigned_${PLOT_TAG}`
    export const UNASSIGNED_PLOT_TAG = `Unassigned_${PLOT_TAG}`
    export const PLAYER_ASSIGNED_PLOT_TAG = (playerId: UserId) => `Player_${playerId}_${ASSIGNED_PLOT_TAG}`

    export const TOWER_PART_STAND_TAG = "TowerPartStand"
    export const ASSIGNED_TOWER_PART_STAND_TAG = `Assigned_${TOWER_PART_STAND_TAG}`
    export const PLAYER_ASSIGNED_TOWER_PART_STAND_TAG = (playerId: UserId) => `Player_${playerId}_${ASSIGNED_TOWER_PART_STAND_TAG}`

    export const UNLOCKED_WORKSHOP_STAND_TAG = "WorkshopStand";
    export const UNLOCKABLE_WORKSHOP_STAND_TAG = "UnlockableWorkshopStand";
    export const PLAYER_UNLOCKED_WORKSHOP_STAND_TAG = (playerId: UserId) => `Player_${playerId}_${UNLOCKED_WORKSHOP_STAND_TAG}`;
    export const PLAYER_UNLOCKABLE_WORKSHOP_STAND_TAG = (playerId: UserId) => `Player_${playerId}_${UNLOCKABLE_WORKSHOP_STAND_TAG}`;
}