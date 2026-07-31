import { PKG_GameData } from "@common/shared/GlobalConfig";
import { EWorkships, EWorkshipsStands } from "./EWorkships";
import Object from "@rbxts/object-utils";

interface IManualWorkshipData {
    standsOrder: EWorkshipsStands[];
}

interface IAutomaticWorkshipData {
    model: Model;
}

export type TWorkshipData = IManualWorkshipData & IAutomaticWorkshipData;

function getAutomaticWorkshipData(workshipName: EWorkships): IAutomaticWorkshipData {
    const workshipModels = PKG_GameData.WaitForChild("WorkshipModels") as Folder;

    return {
        model: workshipModels.WaitForChild(workshipName) as Model,
    }
}

const ManualWorkshipData: Record<EWorkships, IManualWorkshipData> = {
    [EWorkships.ARCHITECT]: {
        standsOrder: [
            EWorkshipsStands.ARCHITECT_1,
            EWorkshipsStands.ARCHITECT_2,
            EWorkshipsStands.ARCHITECT_3,
            EWorkshipsStands.ARCHITECT_4,
            EWorkshipsStands.ARCHITECT_5,
        ]
    },
    [EWorkships.WORKER]: {
        standsOrder: [
            EWorkshipsStands.WORKER_1,
            EWorkshipsStands.WORKER_2,
            EWorkshipsStands.WORKER_3,
            EWorkshipsStands.WORKER_4,
            EWorkshipsStands.WORKER_5,
        ]
    },
}

export const WorkshipData: Record<EWorkships, TWorkshipData> = Object.values(EWorkships).reduce((acc, workshipName) => {
    const manualData = ManualWorkshipData[workshipName];
    const automaticData = getAutomaticWorkshipData(workshipName);
    
    acc[workshipName] = {
        ...manualData,
        ...automaticData,
    }

    return acc;
}, {} as Record<EWorkships, TWorkshipData>)