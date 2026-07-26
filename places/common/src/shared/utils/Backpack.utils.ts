import { BACKPACK_CAPACITY } from "../GlobalConfig"

export namespace BackpackUtils {
    export const STACK_SIZE_ATTRIBUTE = "StackSize";

    export function getBackpackItemsLimit(): number {
        let limit = BACKPACK_CAPACITY;
        return limit;
    }

    export function getEquippedTool(player: Player): Tool | undefined {
        const character = player.Character;
        if (!character) return undefined;
        return character.FindFirstChildOfClass("Tool");
    }
}