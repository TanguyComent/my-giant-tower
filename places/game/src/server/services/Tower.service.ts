import { Dependency, OnStart, Service } from "@flamework/core";
import { Components } from "@flamework/components";
import { AssignedPlotComponent } from "../components/plot/AssignedPlot.component";
import { EPlotAttributes } from "@common/shared/data/components-instances/Plot.instance";
import { Events } from "../Networking";
import { UserId } from "@common/shared/utils/TypeWrapper.utils";
import { PlotsService } from "./Plots.service";
import { Players } from "@rbxts/services";

@Service()
export class TowerService implements OnStart {

    constructor(
        private readonly plotsService: PlotsService,
    ) {}

    onStart(): void {
        Events.tower.requestSync.connect((player, ownerId) => this.syncPlotTower(player, ownerId));
    }

    private async syncPlotTower(player: Player, ownerId: UserId) {
        const owner = Players.GetPlayerByUserId(ownerId);
        if (!owner) {
            warn(`[TowerService.syncPlotTower] - Owner not found for owner ${ownerId}`);
            return;
        }
        const plotComponent = await this.plotsService.getPlayerPlot(owner);
        if (!plotComponent) {
            warn(`[TowerService.syncPlotTower] - Assigned plot not found for owner ${ownerId}`);
            return;
        }

        Events.tower.sync.fire(player, ownerId, plotComponent.getTowerParts());
    }
}
