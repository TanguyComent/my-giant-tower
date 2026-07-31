import Object from "@rbxts/object-utils";
import { ETowerPart } from "../data/tower-parts/ETowerPart";
import { WeightUtils } from "./Weight.utils";
import { TowerPartsData } from "../data/tower-parts/TowerParts.data";
import { TowerPartInstance } from "../data/components-instances/TowerPart.instance";
import { ToolsUtils } from "./Tools.utils";
import { Tags } from "../Tags";

export namespace TowerPartsUtils {
    export function getTowerPartTool(towerPartName: ETowerPart): Tool {
        const model = getTowerPartModelClone(towerPartName, 0.5);
        const tool = ToolsUtils.createToolFromModel(model);
        tool.AddTag(Tags.TOWER_PART_TOOL_TAG);
        tool.Name = towerPartName;
        return tool;
    }

    export function getTowerPartModelClone(towerPartName: ETowerPart, scaleFactor: number = 1): TowerPartInstance {
        const towerPartDatum = TowerPartsData[towerPartName];
        const modelClone = towerPartDatum.model.Clone();
        modelClone.ScaleTo(modelClone.GetScale() * scaleFactor);
        return modelClone;
    }

    export function getRandomTowerPart(): ETowerPart {
        const weightedTowerParts = getWeightedTowerParts();
        return WeightUtils.getRandomDraw(weightedTowerParts).towerPartName;
    }

    export function getWeightedTowerParts(): { towerPartName: ETowerPart; weight: number }[] {
        return Object.values(ETowerPart).map((towerPartName) => ({
            weight: 1,
            towerPartName,
        }))
    }
}