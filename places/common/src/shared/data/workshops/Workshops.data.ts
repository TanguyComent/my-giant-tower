import { PKG_GameData } from "@common/shared/GlobalConfig";
import { EWorkshops, EWorkshopsStands } from "./EWorkshops";
import Object from "@rbxts/object-utils";
import { IWorkshopStandInstance } from "../components-instances/WorkshopStand.instance";

interface IManualWorkshipData {
    standsOrder: EWorkshopsStands[];
}

interface IAutomaticWorkshipData {
    model: IWorkshopStandInstance;
}

export type TWorkshipData = IManualWorkshipData & IAutomaticWorkshipData;

function getAutomaticWorkshipData(workshipName: EWorkshops): IAutomaticWorkshipData {
    const workshipModels = PKG_GameData.WaitForChild("WorkshopModels") as Folder;

    return {
        model: workshipModels.WaitForChild(workshipName) as IWorkshopStandInstance,
    }
}

const ManualWorkshipData: Record<EWorkshops, IManualWorkshipData> = {
    [EWorkshops.ARCHITECT]: {
        standsOrder: [
            EWorkshopsStands.ARCHITECT_1,
            EWorkshopsStands.ARCHITECT_2,
            EWorkshopsStands.ARCHITECT_3,
            EWorkshopsStands.ARCHITECT_4,
            EWorkshopsStands.ARCHITECT_5,
        ]
    },
    [EWorkshops.WORKER]: {
        standsOrder: [
            EWorkshopsStands.WORKER_1,
            EWorkshopsStands.WORKER_2,
            EWorkshopsStands.WORKER_3,
            EWorkshopsStands.WORKER_4,
            EWorkshopsStands.WORKER_5,
        ]
    },
}

export const WorkshopsData: Record<EWorkshops, TWorkshipData> = Object.values(EWorkshops).reduce((acc, workshipName) => {
    const manualData = ManualWorkshipData[workshipName];
    const automaticData = getAutomaticWorkshipData(workshipName);
    
    acc[workshipName] = {
        ...manualData,
        ...automaticData,
    }

    return acc;
}, {} as Record<EWorkshops, TWorkshipData>)