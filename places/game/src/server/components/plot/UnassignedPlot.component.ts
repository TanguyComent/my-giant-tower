import { Tags } from "@common/shared/Tags"
import { BaseComponent, Component } from "@flamework/components"
import { EPlotAttributes, PlotInstance, UnassignedPlotAttributes } from "@common/shared/data/components-instances/Plot.instance"

@Component({
    tag: Tags.UNASSIGNED_PLOT_TAG,
})
export class UnassignedPlotComponent extends BaseComponent<UnassignedPlotAttributes, PlotInstance> {
    private isAssigning = false;

    public assign(player: Player) {
        this.isAssigning = true;

        this.instance.SetAttribute(EPlotAttributes.OWNER_ID, player.User.Id);
        this.instance.AddTag(Tags.ASSIGNED_PLOT_TAG);
        this.instance.AddTag(Tags.PLAYER_ASSIGNED_PLOT_TAG(player.User.Id))
        this.instance.RemoveTag(Tags.UNASSIGNED_PLOT_TAG);
        this.instance.AddPersistentPlayer(player);

        this.isAssigning = false;
    }

    public isAvailable = () => !this.isAssigning;
}