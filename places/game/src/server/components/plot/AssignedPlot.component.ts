import { Tags } from "@common/shared/Tags"
import { BaseComponent, Component } from "@flamework/components"
import { OnStart } from "@flamework/core"
import { AssignedPlotAttributes, EPlotAttributes, PlotInstance } from "@common/shared/data/components-instances/Plot.instance"
import { ProfilesService } from "../../services/Profile.service"
import { Players } from "@rbxts/services"
import { ETowerPartStandAttributes } from "@common/shared/data/components-instances/TowerPartStand.instance"
import { EWorkshops, EWorkshopsStands, EWorkshopStandState } from "@common/shared/data/workshops/EWorkshops"
import { WorkshopsUtils } from "@common/shared/utils/Workshops.utils"
import { WorkshopStandsData } from "@common/shared/data/workshops/WorkshopStands.data"
import Object from "@rbxts/object-utils"
import { IUserSession } from "@common/shared/profileStore/model/IUserSession"
import { WorkshopsData } from "@common/shared/data/workshops/Workshops.data"
import { EWorkshopStandAttributes, IWorkshopStandInstance } from "@common/shared/data/components-instances/WorkshopStand.instance"
import { ETowerParts } from "@common/shared/data/tower-parts/ETowerPart"

@Component({
    tag: Tags.ASSIGNED_PLOT_TAG
})
export class AssignedPlotComponent extends BaseComponent<AssignedPlotAttributes, PlotInstance> implements OnStart {
    private workshopFolders = new Instance("Folder");
    private translucentWorkshopsRef: Partial<Record<EWorkshops, IWorkshopStandInstance>> = {}
    
    constructor(
        private readonly profilesService: ProfilesService,
    ) {
        super()
    }
    
    onStart(): void {
        print(`[AssignedPlotComponent.onStart] - Plot ${this.instance.Name} assigned to player ${this.attributes[EPlotAttributes.OWNER_ID]}`);
        this.workshopFolders.Name = "WorkshopFolders";
        this.workshopFolders.Parent = this.instance;
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
        Object.entries(playerData.workshops).forEach(([workshopName, workshopStands]) => {
            const unlockedStands = Object.entries(workshopStands).filter(([_, workshopStand]) => workshopStand.state !== EWorkshopStandState.LOCKED);
            unlockedStands.forEach(([workshopStandName, workshopStand]) => {
                if (workshopStand.state !== EWorkshopStandState.UNLOCKED) return;
                this.createWorkshopStandModel(
                    workshopName, 
                    workshopStandName,
                    workshopStand.processingTowerPart ? {
                        name: workshopStand.processingTowerPart.towerPartName,
                        initialProgress: workshopStand.processingTowerPart.processingInitialProgress
                    } : undefined
                );
            })
        })

        Object.values(EWorkshops).forEach((workshopName) => this.tryCreateWorkshopTranslucentModel(workshopName, playerData))
    }

    public unassign() {
        print(`[AssignedPlotComponent.unassign] - Plot ${this.instance.Name} unassigned from player ${this.attributes[EPlotAttributes.OWNER_ID]}`);
        
        /// Plot cleanups
        this.instance.RemoveTag(Tags.ASSIGNED_PLOT_TAG);
        this.instance.RemoveTag(Tags.PLAYER_ASSIGNED_PLOT_TAG(this.attributes[EPlotAttributes.OWNER_ID]));
        this.instance.SetAttribute(EPlotAttributes.OWNER_ID, undefined);
        
        /// Tower part stand cleanup
        this.instance.Stand.RemoveTag(Tags.ASSIGNED_TOWER_PART_STAND_TAG);
        this.instance.Stand.RemoveTag(Tags.PLAYER_ASSIGNED_TOWER_PART_STAND_TAG(this.attributes[EPlotAttributes.OWNER_ID]));
        this.instance.Stand.SetAttribute(ETowerPartStandAttributes.OWNER_ID, undefined);
        
        const player = Players.GetPlayerByUserId(this.attributes[EPlotAttributes.OWNER_ID]);
        if (player) {
            this.instance.RemovePersistentPlayer(player);
        }
        
        /// Cleanup work here
        this.workshopFolders.Destroy();

        this.instance.AddTag(Tags.UNASSIGNED_PLOT_TAG);
    }

    public createWorkshopStandModel(workshopName: EWorkshops, workshopStandName: EWorkshopsStands, processingTowerPart?: { name: ETowerParts, initialProgress: number }) {
        const workshopStandModel = WorkshopsUtils.getWorkshopStandModelComponent(workshopName, {
            workshopStandName: workshopStandName,
            ownerId: this.attributes[EPlotAttributes.OWNER_ID],
            processedTowerPart: processingTowerPart
        });
        const standDatum = WorkshopStandsData[workshopStandName];

        const standPivot = this.instance.Origin.CFrame.ToWorldSpace(standDatum.plotRelativeCFrame);
        workshopStandModel.PivotTo(standPivot);
        workshopStandModel.Parent = this.workshopFolders;

        workshopStandModel.AddTag(Tags.UNLOCKED_WORKSHOP_STAND_TAG);
        workshopStandModel.AddTag(Tags.PLAYER_UNLOCKED_WORKSHOP_STAND_TAG(this.attributes[EPlotAttributes.OWNER_ID]));
        if (processingTowerPart) {
            workshopStandModel.AddTag(Tags.PROCESSING_WORKSHOP_STAND_TAG);
            workshopStandModel.AddTag(Tags.PLAYER_PROCESSING_WORKSHOP_STAND_TAG(this.attributes[EPlotAttributes.OWNER_ID]));
        }
    }

    public tryCreateWorkshopTranslucentModel(workshopName: EWorkshops, playerSessionRef?: IUserSession) {
        const playerSession = playerSessionRef ?? this.profilesService.getPlayerSession(this.attributes[EPlotAttributes.OWNER_ID]);
        assert(playerSession, "[AssignedPlotComponent.tryCreateWorkshopTranslucentModel] - Player session not found.");

        const nextWorkshopStandName = WorkshopsUtils.getNextWorkshopStandToUnlock(workshopName, playerSession.workshops);
        if (nextWorkshopStandName) {
            this.createTranslucentWorkshopStandModel(workshopName, nextWorkshopStandName);
        }
    }

    public destroyTranslucentWorkshopStandModel(workshopName: EWorkshops) {
        const translucentWorkshopModel = this.translucentWorkshopsRef[workshopName];
        if (translucentWorkshopModel) {
            translucentWorkshopModel.Destroy();
            this.translucentWorkshopsRef[workshopName] = undefined;
        }
    }

    private createTranslucentWorkshopStandModel(workshopName: EWorkshops, workshopStandName: EWorkshopsStands) {
        const workshopStandModel = WorkshopsUtils.getWorkshopStandModelComponent(workshopName, {
            workshopStandName: workshopStandName,
            ownerId: this.attributes[EPlotAttributes.OWNER_ID]
        });
        const standDatum = WorkshopStandsData[workshopStandName];

        workshopStandModel.GetDescendants().forEach((descendant) => {
            if (descendant.IsA("BasePart")) {
                descendant.Transparency = 0.8;
                descendant.CanCollide = false;
            }
        })

        this.translucentWorkshopsRef[workshopName] = workshopStandModel;
        const standPivot = this.instance.Origin.CFrame.ToWorldSpace(standDatum.plotRelativeCFrame);
        workshopStandModel.PivotTo(standPivot);
        workshopStandModel.Parent = this.workshopFolders;
        workshopStandModel.AddTag(Tags.UNLOCKABLE_WORKSHOP_STAND_TAG);
        workshopStandModel.AddTag(Tags.PLAYER_UNLOCKABLE_WORKSHOP_STAND_TAG(this.attributes[EPlotAttributes.OWNER_ID]));
    }
}