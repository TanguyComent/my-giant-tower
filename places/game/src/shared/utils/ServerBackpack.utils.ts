import { ETowerPart } from "../data/tower-parts/ETowerPart";
import { TowerPartsUtils } from "./TowerParts.utils";

export namespace ServerBackpackUtils {

    /**
     * Create a tower part tool and add it to the player's backpack.
     * Return the created tool if successful, or undefined if the player backpack could not be found.
     * @param player The player to whom the tower part tool will be added
     * @param towerPartName The tower part name to be added to the player's backpack
     */
    export function addTowerPartToolToBackpack(player: Player, towerPartName: ETowerPart): Tool | undefined {
        const backpack = player.FindFirstChildOfClass("Backpack");
        assert(backpack, "Backpack not found");

        const towerPartTool = TowerPartsUtils.getTowerPartTool(towerPartName);
        towerPartTool.Parent = backpack;
        return towerPartTool;
    }
}