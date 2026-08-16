import Object, { deepCopy } from "@rbxts/object-utils";
import { ETowerParts } from "../data/tower-parts/ETowerPart";
import { WeightUtils } from "./Weight.utils";
import { TowerPartsData } from "../data/tower-parts/TowerParts.data";
import { TowerPartInstance } from "../data/components-instances/TowerPart.instance";
import { ToolsUtils } from "./Tools.utils";
import { Tags } from "../Tags";
import { IUserSession } from "../profileStore/model/IUserSession";
import { MAX_TOWER_PARTS } from "../GlobalConfig";

export namespace TowerPartsUtils {
    export function getTowerPartTool(towerPartName: ETowerParts): Tool {
        const model = getTowerPartModelClone(towerPartName, 0.5);
        const tool = ToolsUtils.createToolFromModel(model);
        tool.AddTag(Tags.TOWER_PART_TOOL_TAG);
        tool.Name = towerPartName;
        return tool;
    }

    export function getTowerPartModelClone(towerPartName: ETowerParts, scaleFactor: number = 1): TowerPartInstance {
        const towerPartDatum = TowerPartsData[towerPartName];
        const modelClone = towerPartDatum.model.Clone();
        modelClone.ScaleTo(modelClone.GetScale() * scaleFactor);
        return modelClone;
    }

    export function getTowerPartCurrencyGeneration(towerPart: ETowerParts): number {
        return TowerPartsData[towerPart].currencyGeneration;
    }

    export function getRandomTowerPart(): ETowerParts {
        const weightedTowerParts = getWeightedTowerParts();
        return WeightUtils.getRandomDraw(weightedTowerParts).towerPartName;
    }

    export function getWeightedTowerParts(): { towerPartName: ETowerParts; weight: number }[] {
        return Object.values(ETowerParts).map((towerPartName) => ({
            weight: 1,
            towerPartName,
        }))
    }

    export function getInitialTowerFromSession(towerParts: IUserSession["towerParts"]): ETowerParts[] {
        const towerPartsArray: ETowerParts[] = [];
        
        let towerPartsCopy = deepCopy(towerParts);
        let weightedTowerParts = getWeightedTowerPartsFromSession(towerPartsCopy);
        while (towerPartsArray.size() < MAX_TOWER_PARTS && weightedTowerParts.size() > 0) {
            const drawnTowerPart = WeightUtils.getRandomDraw(weightedTowerParts);
            towerPartsArray.push(drawnTowerPart.towerPartName);
            towerPartsCopy[drawnTowerPart.towerPartName].amount -= 1;
            weightedTowerParts = getWeightedTowerPartsFromSession(towerPartsCopy);
        }

        return towerPartsArray;
    }

    function getWeightedTowerPartsFromSession(towerParts: IUserSession["towerParts"]): { towerPartName: ETowerParts; weight: number }[] {
        return Object.entries(towerParts).map(([towerPartName, towerPartData]) => {
            if (towerPartData.amount <= 0) return undefined;
            const towerPartDatum = TowerPartsData[towerPartName];
            return {
                towerPartName,
                weight: towerPartData.amount * towerPartDatum.price,
            }
        }).filterUndefined();
    }
}