import Object from "@rbxts/object-utils";
import { ETowerPart } from "./ETowerPart";
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

function getAutomaticTowerPartData(towerPart: ETowerPart): IAutomaticTowerPartData {
    return {
        model: PKG_GameData.WaitForChild("TowerParts").WaitForChild(towerPart) as TowerPartInstance,
    };
}

const ManualTowerPartsData: Record<ETowerPart, IManualTowerPartData> = {
    [ETowerPart.TOWER_PART_1]: {
        displayName: "Tower Part 1",
        price: 1000,
        workshipProcessor: EWorkshops.ARCHITECT,
        timeToProcess: 10,
    },
    [ETowerPart.TOWER_PART_2]: {
        displayName: "Tower Part 2",
        price: 2000,
        workshipProcessor: EWorkshops.ARCHITECT,
        timeToProcess: 20,
    },
    [ETowerPart.TOWER_PART_3]: {
        displayName: "Tower Part 3",
        price: 3000,
        workshipProcessor: EWorkshops.ARCHITECT,
        timeToProcess: 30,
    },
    [ETowerPart.TOWER_PART_4]: {
        displayName: "Tower Part 4",
        price: 4000,
        workshipProcessor: EWorkshops.WORKER,
        timeToProcess: 40,
    },
    [ETowerPart.TOWER_PART_5]: {
        displayName: "Tower Part 5",
        price: 5000,
        workshipProcessor: EWorkshops.WORKER,
        timeToProcess: 50,
    },
}

export const TowerPartsData: Record<ETowerPart, TTowerPartData> = Object.values(ETowerPart).reduce((acc, towerPartName) => {
    acc[towerPartName] = {
        ...ManualTowerPartsData[towerPartName],
        ...getAutomaticTowerPartData(towerPartName),
    }

    return acc;
}, {} as Record<ETowerPart, TTowerPartData>)