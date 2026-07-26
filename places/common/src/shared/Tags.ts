import { UserId } from "./utils/TypeWrapper.utils"

export namespace Tags {
    export const INVENTORY_SLOT_TAG = "InventorySlot"

    export const PLOT_TAG = "Plot"
    export const ASSIGNED_PLOT_TAG = `Assigned_${PLOT_TAG}`
    export const UNASSIGNED_PLOT_TAG = `Unassigned_${PLOT_TAG}`
    export const PLAYER_ASSIGNED_PLOT_TAG = (playerId: UserId) => `Player_${playerId}_${ASSIGNED_PLOT_TAG}`

    
}