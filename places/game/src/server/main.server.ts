import { Flamework } from "@flamework/core"
import { GAME_VERSION } from "@common/shared/GlobalConfig";
import { Workspace } from "@rbxts/services"
import { PlotInstance } from "@game/shared/data/components-instances/Plot.instance"
import { Tags } from "@common/shared/Tags"

print(`Server stating in version ${GAME_VERSION}`)

const plotsFolder = Workspace.WaitForChild("Plots") as Folder
const typeGuard = Flamework.createGuard<PlotInstance>()
for (const plot of plotsFolder.GetChildren()) {
    if (!typeGuard(plot)) {
        warn(`[main.server] - Plot instance ${plot.Name} is not of type PlotInstance. Please check the instance.`);
    }

    const typedPlot = plot as PlotInstance /// Safe because of the type guard above
    typedPlot.ModelStreamingMode = Enum.ModelStreamingMode.PersistentPerPlayer
    typedPlot.AddTag(Tags.UNASSIGNED_PLOT_TAG);
}

/// Flamework initialization
Flamework.addPaths("places/game/src/server/services")
Flamework.addPaths("places/game/src/server/components")
Flamework.addPaths("places/common/src/server/services")
Flamework.addPaths("places/common/src/server/components")
Flamework.addPaths("places/common/src/shared/components")

Flamework.ignite()
