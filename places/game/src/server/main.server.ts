import { Flamework } from "@flamework/core"
import { GAME_VERSION, IS_STUDIO } from "@common/shared/GlobalConfig";
import { Workspace } from "@rbxts/services"
import { EPlotAttributes, PlotInstance as IPlotInstance } from "@common/shared/data/components-instances/Plot.instance"
import { Tags } from "@common/shared/Tags"
import { GenerateUUID } from "@common/shared/utils/GenerateUUID.utils";
import { IWorkshopStandInstance } from "@common/shared/data/components-instances/WorkshopStand.instance";
import Object from "@rbxts/object-utils";
import { WorkshopStandsData } from "@common/shared/data/workshops/WorkshopStands.data";
import { WorkshopsData } from "@common/shared/data/workshops/Workshops.data";
import { TowerPartInstance as ITowerPartInstance } from "@common/shared/data/components-instances/TowerPart.instance";
import { TowerPartsData } from "@common/shared/data/tower-parts/TowerParts.data";

print(`Server stating in version ${GAME_VERSION}`)

const plotsFolder = Workspace.WaitForChild("Plots") as Folder
const typeGuard = Flamework.createGuard<IPlotInstance>()
for (const plot of plotsFolder.GetChildren()) {
    if (!typeGuard(plot)) {
        warn(`[main.server] - Plot instance ${plot.Name} is not of type PlotInstance. Please check the instance.`);
    }

    const typedPlot = plot as IPlotInstance /// Safe because of the type guard above
    typedPlot.ModelStreamingMode = Enum.ModelStreamingMode.PersistentPerPlayer
    typedPlot.SetAttribute(EPlotAttributes.PLOT_ID, GenerateUUID.generateHexSegment())
    typedPlot.AddTag(Tags.PLOT_TAG);
    typedPlot.AddTag(Tags.UNASSIGNED_PLOT_TAG);
}

/// Data instances type verification
if (IS_STUDIO) {
    const stackTraces: string[] = []

    const workshopStandsTypeGuard = Flamework.createGuard<IWorkshopStandInstance>()
    Object.entries(WorkshopsData).forEach(([k, v]) => {
        if (!workshopStandsTypeGuard(v.model)) {
            stackTraces.push(`[main.server] - Workshop model ${k} is not of type IWorkshopStandInstance. Please check the instance.`);
        }
    })

    const towerPartTypeGuard = Flamework.createGuard<ITowerPartInstance>()
    Object.entries(TowerPartsData).forEach(([k, v]) => {
        if (!towerPartTypeGuard(v.model)) {
            stackTraces.push(`[main.server] - Tower part model ${k} is not of type ITowerPartInstance. Please check the instance.`);
        }
    })

    if (stackTraces.size() > 0) {
        for (const trace of stackTraces) {
            warn(trace)
        }
        error(`[main.server] - Data instances type verification failed. Please check the warnings above.`);
    }
}

/// Flamework initialization
Flamework.addPaths("places/game/src/server/services")
Flamework.addPaths("places/game/src/server/components")
Flamework.addPaths("places/common/src/server/services")
Flamework.addPaths("places/common/src/server/components")
Flamework.addPaths("places/common/src/shared/components")

Flamework.ignite()
