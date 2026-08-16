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
    [ETowerParts.CARDBOARD_TOWER_FUNDATION]: {
        displayName: "Cardboard Tower Foundation",
        price: 1000,
        workshipProcessor: EWorkshops.ARCHITECT,
        timeToProcess: 10,
    },
    [ETowerParts.CARDBOARD_TOWER_FLOOR1]: {
        displayName: "Cardboard Tower Floor 1",
        price: 2000,
        workshipProcessor: EWorkshops.ARCHITECT,
        timeToProcess: 20,
    },
    [ETowerParts.CARDBOARD_TOWER_FLOOR2]: {
        displayName: "Cardboard Tower Floor 2",
        price: 3000,
        workshipProcessor: EWorkshops.ARCHITECT,
        timeToProcess: 30,
    },
    [ETowerParts.CARDBOARD_TOWER_ROOF]: {
        displayName: "Cardboard Tower Roof",
        price: 4000,
        workshipProcessor: EWorkshops.ARCHITECT,
        timeToProcess: 40,
    },
    [ETowerParts.WOODEN_TOWER_FUNDATION]: {
        displayName: "Wooden Tower Foundation",
        price: 5000,
        workshipProcessor: EWorkshops.WORKER,
        timeToProcess: 50,
    },
    [ETowerParts.WOODEN_TOWER_FLOOR1]: {
        displayName: "Wooden Tower Floor 1",
        price: 6000,
        workshipProcessor: EWorkshops.WORKER,
        timeToProcess: 60,
    },
    [ETowerParts.WOODEN_TOWER_FLOOR2]: {
        displayName: "Wooden Tower Floor 2",
        price: 7000,
        workshipProcessor: EWorkshops.WORKER,
        timeToProcess: 70,
    },
    [ETowerParts.WOODEN_TOWER_ROOF]: {
        displayName: "Wooden Tower Roof",
        price: 8000,
        workshipProcessor: EWorkshops.WORKER,
        timeToProcess: 80,
    },
}

export const TowerPartsData: Record<ETowerParts, TTowerPartData> = Object.values(ETowerParts).reduce((acc, towerPartName) => {
    acc[towerPartName] = {
        ...ManualTowerPartsData[towerPartName],
        ...getAutomaticTowerPartData(towerPartName),
    }

    return acc;
}, {} as Record<ETowerParts, TTowerPartData>)