import { Tags } from "@common/shared/Tags";
import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { AssignedPlotAttributes, EPlotAttributes, PlotInstance } from "@common/shared/data/components-instances/Plot.instance";
import { DestroyableComponent } from "@common/shared/components/BaseComponents";
import { Events } from "../../Networking";
import { PlayerTower } from "../../class/PlayerTower.class";

/**
 * Tagged generically (not per-local-player), so this attaches on every client for every assigned plot,
 * letting each plot's tower replicate to all players instead of only its owner.
 */
@Component({
    tag: Tags.ASSIGNED_PLOT_TAG
})
export class AssignedPlotComponent extends DestroyableComponent<AssignedPlotAttributes, PlotInstance> implements OnStart {
    private tower!: PlayerTower;

    onStart(): void {
        const ownerId = this.attributes[EPlotAttributes.OWNER_ID];
        this.tower = new PlayerTower(this.instance.TowerOrigin.CFrame, this.instance);

        const c1 = Events.tower.sync.connect((syncedOwnerId, towerParts) => {
            if (syncedOwnerId !== ownerId) return;
            this.tower.build(towerParts);
        });
        this.janitor.Add(c1, "Disconnect");

        const c2 = Events.tower.patch.connect((patchedOwnerId, towerPart) => {
            if (patchedOwnerId !== ownerId) return;
            this.tower.enqueueTowerPartWithAnimation(towerPart);
        });
        this.janitor.Add(c2, "Disconnect");

        this.janitor.Add(() => this.tower.destroy());

        Events.tower.requestSync(ownerId);
    }
}
