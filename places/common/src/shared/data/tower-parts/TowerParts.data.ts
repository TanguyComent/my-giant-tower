import Object from "@rbxts/object-utils";
import { ETowerPart } from "./ETowerPart";
import { TowerPartInstance } from "../components-instances/TowerPart.instance";
import { PKG_GameData } from "@common/shared/GlobalConfig";

interface IAutomaticTowerPartData {
    model: TowerPartInstance;
}

interface IManualTowerPartData {
    price: number;
}

export type TTowerPartData = IAutomaticTowerPartData & IManualTowerPartData;

function getAutomaticTowerPartData(towerPart: ETowerPart): IAutomaticTowerPartData {
    return {
        model: PKG_GameData.WaitForChild("TowerParts").WaitForChild(towerPart) as TowerPartInstance,
    };
}

const ManualTowerPartsData: Record<ETowerPart, IManualTowerPartData> = {
    [ETowerPart.TOWER_PART_1]: {
        price: 1000,
    },
    [ETowerPart.TOWER_PART_2]: {
        price: 2000,
    },
    [ETowerPart.TOWER_PART_3]: {
        price: 3000,
    },
    [ETowerPart.TOWER_PART_4]: {
        price: 4000,
    },
    [ETowerPart.TOWER_PART_5]: {
        price: 5000,
    },
}

export const TowerPartsData: Record<ETowerPart, TTowerPartData> = Object.values(ETowerPart).reduce((acc, towerPartName) => {
    acc[towerPartName] = {
        ...ManualTowerPartsData[towerPartName],
        ...getAutomaticTowerPartData(towerPartName),
    }

    return acc;
}, {} as Record<ETowerPart, TTowerPartData>)