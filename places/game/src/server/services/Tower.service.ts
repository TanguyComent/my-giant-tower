import { Dependency, OnStart, Service } from "@flamework/core";
import { Components } from "@flamework/components";
import { AssignedPlotComponent } from "../components/plot/AssignedPlot.component";
import { EPlotAttributes } from "@common/shared/data/components-instances/Plot.instance";
import { Events } from "../Networking";

@Service()
export class TowerService implements OnStart {
    onStart(): void {
        Events.tower.requestSync.connect((player) => this.syncPlayerTower(player));
    }

    private syncPlayerTower(player: Player): void {
        const plotComponent = this.getPlayerPlotComponent(player);
        if (!plotComponent) {
            warn(`[TowerService.syncPlayerTower] - Assigned plot not found for player ${player.Name}`);
            return;
        }

        Events.tower.sync.fire(player, plotComponent.getTowerParts());
    }

    private getPlayerPlotComponent(player: Player): AssignedPlotComponent | undefined {
        return Dependency<Components>().getAllComponents<AssignedPlotComponent>().find((c) => c.attributes[EPlotAttributes.OWNER_ID] === player.User.Id);
    }
}
