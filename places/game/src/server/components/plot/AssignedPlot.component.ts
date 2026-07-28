import { Tags } from "@common/shared/Tags"
import { BaseComponent, Component } from "@flamework/components"
import { OnStart } from "@flamework/core"
import { AssignedPlotAttributes, EPlotAttributes, PlotInstance } from "@game/shared/data/components-instances/Plot.instance"
import { ProfilesService } from "../../services/Profile.service"
import { Players } from "@rbxts/services"
import { ETowerPartStandAttributes } from "@game/shared/data/components-instances/TowerPartStand.instance"

@Component({
    tag: Tags.ASSIGNED_PLOT_TAG
})
export class AssignedPlotComponent extends BaseComponent<AssignedPlotAttributes, PlotInstance> implements OnStart {
    
    constructor(
        private readonly profilesService: ProfilesService,
    ) {
        super()
    }
    
    onStart(): void {
        print(`[AssignedPlotComponent.onStart] - Plot ${this.instance.Name} assigned to player ${this.attributes[EPlotAttributes.OWNER_ID]}`);
        const playerData = this.profilesService.getPlayerSession(this.attributes[EPlotAttributes.OWNER_ID]);
        if (!playerData) {
            const player = Players.GetPlayerByUserId(this.attributes[EPlotAttributes.OWNER_ID]);
            player?.Kick("Data error: Please rejoin");
            throw "[AssignedPlotComponent.onStart] - Plot assigned before data initialisation.";
        }

        /// Tower part stand initialisation
        this.instance.Stand.SetAttribute(ETowerPartStandAttributes.OWNER_ID, this.attributes[EPlotAttributes.OWNER_ID]);
        this.instance.Stand.AddTag(Tags.ASSIGNED_TOWER_PART_STAND_TAG)
        this.instance.Stand.AddTag(Tags.PLAYER_ASSIGNED_TOWER_PART_STAND_TAG(this.attributes[EPlotAttributes.OWNER_ID]))

        /// Plot initialisation work here
    }

    public unassign() {
        print(`[AssignedPlotComponent.unassign] - Plot ${this.instance.Name} unassigned from player ${this.attributes[EPlotAttributes.OWNER_ID]}`);
        
        /// Plot cleanup
        this.instance.RemoveTag(Tags.ASSIGNED_PLOT_TAG);
        this.instance.RemoveTag(Tags.PLAYER_ASSIGNED_PLOT_TAG(this.attributes[EPlotAttributes.OWNER_ID]));
        this.instance.SetAttribute(EPlotAttributes.OWNER_ID, undefined);
        this.instance.AddTag(Tags.UNASSIGNED_PLOT_TAG);

        /// Tower part stand cleanup
        this.instance.Stand.RemoveTag(Tags.ASSIGNED_TOWER_PART_STAND_TAG);
        this.instance.Stand.RemoveTag(Tags.PLAYER_ASSIGNED_TOWER_PART_STAND_TAG(this.attributes[EPlotAttributes.OWNER_ID]));
        this.instance.Stand.SetAttribute(ETowerPartStandAttributes.OWNER_ID, undefined);

        const player = Players.GetPlayerByUserId(this.attributes[EPlotAttributes.OWNER_ID]);
        if (player) {
            this.instance.RemovePersistentPlayer(player);
        }

        /// Cleanup work here
    }
}