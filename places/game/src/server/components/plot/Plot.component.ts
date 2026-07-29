import { Tags } from "@common/shared/Tags";
import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { EPlotAttributes, PlotAttributes, PlotInstance } from "@common/shared/data/components-instances/Plot.instance";
import { ETowerPartStandAttributes } from "@common/shared/data/components-instances/TowerPartStand.instance";

@Component({
    tag: Tags.PLOT_TAG,
})
export class PlotComponent extends BaseComponent<PlotAttributes, PlotInstance> implements OnStart {
    
    onStart(): void {
        this.instance.Stand.SetAttribute(ETowerPartStandAttributes.PLOT_ID, this.attributes[EPlotAttributes.PLOT_ID]);
        this.instance.Stand.AddTag(Tags.TOWER_PART_STAND_TAG);    
    }
}