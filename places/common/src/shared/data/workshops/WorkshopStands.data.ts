import { EWorkshopsStands } from "./EWorkshops";

export interface IWorkshipStandData {
    plotRelativeCFrame: CFrame;
    unlockPrice: number;
}

export const WorkshopStandsData: Record<EWorkshopsStands, IWorkshipStandData> = {
    [EWorkshopsStands.ARCHITECT_1]: {
        plotRelativeCFrame: new CFrame(-14.142, 3.5, -12.889).mul(CFrame.Angles(0, math.rad(-89.582), 0)),
        unlockPrice: 0,
    },
    [EWorkshopsStands.ARCHITECT_2]: {
        plotRelativeCFrame: new CFrame(-14.081, 3.5, -4.664).mul(CFrame.Angles(0, math.rad(-89.582), 0)),
        unlockPrice: 1000,
    },
    [EWorkshopsStands.ARCHITECT_3]: {
        plotRelativeCFrame: new CFrame(-14.016, 3.5, 4.389).mul(CFrame.Angles(0, math.rad(-89.582), 0)),
        unlockPrice: 2000,
    },
    [EWorkshopsStands.ARCHITECT_4]: {
        plotRelativeCFrame: new CFrame(-13.962, 3.5, 11.754).mul(CFrame.Angles(0, math.rad(-89.582), 0)),
        unlockPrice: 3000,
    },
    [EWorkshopsStands.ARCHITECT_5]: {
        plotRelativeCFrame: new CFrame(-13.903, 3.5, 19.773).mul(CFrame.Angles(0, math.rad(-89.582), 0)),
        unlockPrice: 4000,
    },

    [EWorkshopsStands.WORKER_1]: {
        plotRelativeCFrame: new CFrame(14.308, 3.5, -13.096).mul(CFrame.Angles(0, math.rad(90.418), 0)),
        unlockPrice: 0,
    },
    [EWorkshopsStands.WORKER_2]: {
        plotRelativeCFrame: new CFrame(14.366, 3.5, -5.077).mul(CFrame.Angles(0, math.rad(90.418), 0)),
        unlockPrice: 1000,
    },
    [EWorkshopsStands.WORKER_3]: {
        plotRelativeCFrame: new CFrame(14.419, 3.5, 2.288).mul(CFrame.Angles(0, math.rad(90.418), 0)),
        unlockPrice: 2000,
    },
    [EWorkshopsStands.WORKER_4]: {
        plotRelativeCFrame: new CFrame(14.486, 3.5, 11.34).mul(CFrame.Angles(0, math.rad(90.418), 0)),
        unlockPrice: 3000,
    },
    [EWorkshopsStands.WORKER_5]: {
        plotRelativeCFrame: new CFrame(14.546, 3.5, 19.565).mul(CFrame.Angles(0, math.rad(90.418), 0)),
        unlockPrice: 4000,
    },
}