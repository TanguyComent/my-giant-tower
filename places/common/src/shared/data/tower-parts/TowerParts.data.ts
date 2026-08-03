import Object from "@rbxts/object-utils";
import { ETowerParts } from "./ETowerPart";
import { TowerPartInstance } from "../components-instances/TowerPart.instance";
import { PKG_GameData } from "@common/shared/GlobalConfig";
import { EWorkshops } from "../workshops/EWorkshops";

interface IAutomaticTowerPartData {
    model: TowerPartInstance;
}

interface IManualTowerPartData {
    price: number;
    displayName: string;
    workshipProcessor: EWorkshops;
    timeToProcess: number;
}

export type TTowerPartData = IAutomaticTowerPartData & IManualTowerPartData;

function getAutomaticTowerPartData(towerPart: ETowerParts): IAutomaticTowerPartData {
    return {
        model: PKG_GameData.WaitForChild("TowerParts").WaitForChild(towerPart) as TowerPartInstance,
    };
}

const ManualTowerPartsData: Record<ETowerParts, IManualTowerPartData> = {
    [ETowerParts.TOWER_PART_1]: {
        displayName: "Tower Part 1",
        price: 1000,
        workshipProcessor: EWorkshops.ARCHITECT,
        timeToProcess: 10,
    },
    [ETowerParts.TOWER_PART_2]: {
        displayName: "Tower Part 2",
        price: 2000,
        workshipProcessor: EWorkshops.ARCHITECT,
        timeToProcess: 20,
    },
    [ETowerParts.TOWER_PART_3]: {
        displayName: "Tower Part 3",
        price: 3000,
        workshipProcessor: EWorkshops.ARCHITECT,
        timeToProcess: 30,
    },
    [ETowerParts.TOWER_PART_4]: {
        displayName: "Tower Part 4",
        price: 4000,
        workshipProcessor: EWorkshops.WORKER,
        timeToProcess: 40,
    },
    [ETowerParts.TOWER_PART_5]: {
        displayName: "Tower Part 5",
        price: 5000,
        workshipProcessor: EWorkshops.WORKER,
        timeToProcess: 50,
    },
}

export const TowerPartsData: Record<ETowerParts, TTowerPartData> = Object.values(ETowerParts).reduce((acc, towerPartName) => {
    acc[towerPartName] = {
        ...ManualTowerPartsData[towerPartName],
        ...getAutomaticTowerPartData(towerPartName),
    }

    return acc;
}, {} as Record<ETowerParts, TTowerPartData>)