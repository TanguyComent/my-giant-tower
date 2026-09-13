import { EWorkshopsStands } from "./EWorkshops";

export interface IWorkshipStandData {
    unlockPrice: number;
}

export const WorkshopStandsData: Record<EWorkshopsStands, IWorkshipStandData> = {
    [EWorkshopsStands.ARCHITECT_1]: {
        unlockPrice: 0,
    },
    [EWorkshopsStands.ARCHITECT_2]: {
        unlockPrice: 1000,
    },
    [EWorkshopsStands.ARCHITECT_3]: {
        unlockPrice: 2000,
    },
    [EWorkshopsStands.ARCHITECT_4]: {
        unlockPrice: 3000,
    },
    [EWorkshopsStands.ARCHITECT_5]: {
        unlockPrice: 4000,
    },

    [EWorkshopsStands.WORKER_1]: {
        unlockPrice: 0,
    },
    [EWorkshopsStands.WORKER_2]: {
        unlockPrice: 1000,
    },
    [EWorkshopsStands.WORKER_3]: {
        unlockPrice: 2000,
    },
    [EWorkshopsStands.WORKER_4]: {
        unlockPrice: 3000,
    },
    [EWorkshopsStands.WORKER_5]: {
        unlockPrice: 4000,
    },
}