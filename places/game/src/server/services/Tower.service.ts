import { Dependency, OnStart, Service } from "@flamework/core";
import { Components } from "@flamework/components";
import { AssignedPlotComponent } from "../components/plot/AssignedPlot.component";
import { EPlotAttributes } from "@common/shared/data/components-instances/Plot.instance";
import { Events } from "../Networking";
import { UserId } from "@common/shared/utils/TypeWrapper.utils";

@Service()
export class TowerService implements OnStart {
    onStart(): void {
        Events.tower.requestSync.connect((player, ownerId) => this.syncPlotTower(player, ownerId));
    }

    private syncPlotTower(player: Player, ownerId: UserId): void {
        const plotComponent = this.getPlotComponent(ownerId);
        if (!plotComponent) {
            warn(`[TowerService.syncPlotTower] - Assigned plot not found for owner ${ownerId}`);
            return;
        }

        Events.tower.sync.fire(player, ownerId, plotComponent.getTowerParts());
    }

    private getPlotComponent(ownerId: UserId): AssignedPlotComponent | undefined {
        return Dependency<Components>().getAllComponents<AssignedPlotComponent>().find((c) => c.attributes[EPlotAttributes.OWNER_ID] === ownerId);
    }
}
