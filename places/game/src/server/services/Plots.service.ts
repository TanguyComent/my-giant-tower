import { Dependency, OnStart, Service } from "@flamework/core"
import { ProfilesService } from "./Profile.service"
import { PlotInstance } from "@common/shared/data/components-instances/Plot.instance"
import { UnassignedPlotComponent } from "../components/plot/UnassignedPlot.component"
import { Components } from "@flamework/components"
import { AssignedPlotComponent } from "../components/plot/AssignedPlot.component"
import Signal from "@rbxts/signal"
import { Events } from "../Networking"

@Service()
export class PlotsService implements OnStart {

    public readonly onPlotAssigned = new Signal<(player: Player, plotInstance: PlotInstance) => void>()

    constructor(
        private readonly profilesService: ProfilesService,
    ) {}

    onStart(): void {
        this.profilesService.onProfileLoaded.Connect((player) => this.assignPlotToPlayer(player))
        this.profilesService.onLastSave.Connect((player) => this.removePlotFromPlayer(player))
        Events.collectTowerCurrency.connect((player) => this.collectTowerCurrency(player))
    }

    private collectTowerCurrency(player: Player): void {
        const towerCurrency = this.profilesService.getField(player.User.Id, ["towerCurrency"]);
        if (!towerCurrency) return;

        this.profilesService.updateFields(player.User.Id, [
            {
                path: ["currency"],
                provider: (old) => old + towerCurrency,
            },
            {
                path: ["towerCurrency"],
                provider: () => 0,
            },
        ])
    }

    private async assignPlotToPlayer(player: Player) {
        try {
            const availablePlot = await Promise.try(() => this.findAvailablePlot());
            const plotInstance = availablePlot.instance;
            availablePlot.assign(player);

            player.CharacterAdded.Connect(() => this.teleportPlayerToPlot(player, plotInstance));
            player.LoadCharacterAsync()
        } catch (e) {
            player.Kick("Error while assigning plot, please rejoin.")
            throw `[PlotsService.assignPlotToPlayer] - Error while assigning plot\n${e}`
        }
    }

    private async removePlotFromPlayer(player: Player) {
        try {
            const playerPlot = await this.getPlayerPlot(player);
            playerPlot.unassign();
        } catch (e) {
            throw `[PlotsService.removePlotFromPlayer] - Error while removing plot\n${e}`
        }
    }

    private teleportPlayerToPlot(player: Player, plotInstance: PlotInstance) {
		const character = player.Character;
		if (!character) return;
		character.PivotTo(plotInstance.Spawn.CFrame);
	}

    private async findAvailablePlot(): Promise<UnassignedPlotComponent> {
        let elapsedTime = 0
        let availablePlot: UnassignedPlotComponent | undefined

        do {
            const availablePlots = Dependency<Components>().getAllComponents<UnassignedPlotComponent>().filter((p) => p.isAvailable());
            availablePlot = availablePlots[0];
            if (!availablePlot) {
                elapsedTime += task.wait(0.5);
                if (elapsedTime > 30) {
                    throw "[PlotsService.findAvailablePlot] - No available plot found after 30 seconds.";
                }
            }
        } while (!availablePlot)

        return availablePlot;
    }

    public async getPlayerPlot(player: Player): Promise<AssignedPlotComponent> {
        let elapsedTime = 0
        let playerPlot: AssignedPlotComponent | undefined

        do {
            const availablePlots = Dependency<Components>().getAllComponents<AssignedPlotComponent>().filter((p) => p.attributes.ownerId === player.User.Id);
            playerPlot = availablePlots[0];
            if (!playerPlot) {
                elapsedTime += task.wait(0.5);
                if (elapsedTime > 30) {
                    throw "[PlotsService.getPlayerPlot] - Player assigned plot not found after 30 seconds.";
                }
            }
        } while (!playerPlot)

        return playerPlot;
    }
}