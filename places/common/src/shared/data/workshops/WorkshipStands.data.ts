import { EWorkshipsStands } from "./EWorkships";

export interface IWorkshipStandData {
    plotRelativePosition: Vector3;
    unlockPrice: number;
}

export const WorkshipStandsData: Record<EWorkshipsStands, IWorkshipStandData> = {
    [EWorkshipsStands.ARCHITECT_1]: {
        plotRelativePosition: new Vector3(0, 0, 0),
        unlockPrice: 0,
    },
    [EWorkshipsStands.ARCHITECT_2]: {
        plotRelativePosition: new Vector3(0, 0, 0),
        unlockPrice: 1000,
    },
    [EWorkshipsStands.ARCHITECT_3]: {
        plotRelativePosition: new Vector3(0, 0, 0),
        unlockPrice: 2000,
    },
    [EWorkshipsStands.ARCHITECT_4]: {
        plotRelativePosition: new Vector3(0, 0, 0),
        unlockPrice: 3000,
    },
    [EWorkshipsStands.ARCHITECT_5]: {
        plotRelativePosition: new Vector3(0, 0, 0),
        unlockPrice: 4000,
    },

    [EWorkshipsStands.WORKER_1]: {
        plotRelativePosition: new Vector3(0, 0, 0),
        unlockPrice: 0,
    },
    [EWorkshipsStands.WORKER_2]: {
        plotRelativePosition: new Vector3(0, 0, 0),
        unlockPrice: 1000,
    },
    [EWorkshipsStands.WORKER_3]: {
        plotRelativePosition: new Vector3(0, 0, 0),
        unlockPrice: 2000,
    },
    [EWorkshipsStands.WORKER_4]: {
        plotRelativePosition: new Vector3(0, 0, 0),
        unlockPrice: 3000,
    },
    [EWorkshipsStands.WORKER_5]: {
        plotRelativePosition: new Vector3(0, 0, 0),
        unlockPrice: 4000,
    },
}