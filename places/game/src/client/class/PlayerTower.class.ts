import { AsyncQueue } from "@common/shared/class/AsyncQueue.class";
import { ETowerParts } from "@common/shared/data/tower-parts/ETowerPart";
import { TowerPartsUtils } from "@common/shared/utils/TowerParts.utils";
import { AnimationsUtils } from "@common/shared/utils/AnimationsUtils";
import { MAX_TOWER_PARTS } from "@common/shared/GlobalConfig";

interface TowerPartEntry {
    model: Model;
    height: number;
}

/**
 * Builds and maintains the visual tower model for a plot, from a flat array of ETowerParts.
 * Tower parts are stacked bottom-to-top in array order, on top of `baseCFrame`.
 * Assumes each tower part model's pivot sits at the base of the part, so parts can be stacked purely by summing heights.
 * Capped at MAX_TOWER_PARTS, mirroring the server: once reached, adding a part first removes the current top part.
 */
export class PlayerTower {
    private static readonly upliftDuration = 0.6;

    private readonly model = new Instance("Model");
    private readonly patchQueue = new AsyncQueue();
    private towerPartEntries: TowerPartEntry[] = [];
    private towerHeight = 0;

    constructor(
        private readonly baseCFrame: CFrame,
        parent: Instance,
    ) {
        this.model.Name = "Tower";
        this.model.Parent = parent;
    }

    public build(towerParts: ETowerParts[]): void {
        this.clear();
        towerParts.forEach((towerPart) => this.addTowerPart(towerPart));
    }

    public addTowerPart(towerPart: ETowerParts): Model {
        this.removeTopPartIfAtLimit();

        const towerPartModel = TowerPartsUtils.getTowerPartModelClone(towerPart);
        const height = towerPartModel.GetExtentsSize().Y;
        towerPartModel.PivotTo(this.getTopCFrame());
        towerPartModel.Parent = this.model;

        this.towerPartEntries.push({ model: towerPartModel, height });
        this.towerHeight += height;
        return towerPartModel;
    }

    public enqueueTowerPartWithAnimation(towerPart: ETowerParts): Promise<void> {
        return this.patchQueue.enqueue(() => this.addTowerPartWithAnimationAsync(towerPart));
    }

    public destroy(): void {
        this.model.Destroy();
    }

    private async addTowerPartWithAnimationAsync(towerPart: ETowerParts): Promise<void> {
        this.removeTopPartIfAtLimit();

        const towerPartModel = TowerPartsUtils.getTowerPartModelClone(towerPart);
        const height = towerPartModel.GetExtentsSize().Y;
        const targetCFrame = this.getTopCFrame();

        towerPartModel.PivotTo(this.baseCFrame);
        towerPartModel.Parent = this.model;

        await AnimationsUtils.bringModelInCurveToAsync(towerPartModel, targetCFrame, PlayerTower.upliftDuration);
        await AnimationsUtils.shakeModelAsync(towerPartModel);

        this.towerPartEntries.push({ model: towerPartModel, height });
        this.towerHeight += height;
    }

    private removeTopPartIfAtLimit(): void {
        if (this.towerPartEntries.size() < MAX_TOWER_PARTS) return;

        const topEntry = this.towerPartEntries.pop();
        if (!topEntry) return;

        topEntry.model.Destroy();
        this.towerHeight -= topEntry.height;
    }

    private getTopCFrame(): CFrame {
        return this.baseCFrame.mul(new CFrame(0, this.towerHeight, 0));
    }

    private clear(): void {
        this.model.ClearAllChildren();
        this.towerPartEntries = [];
        this.towerHeight = 0;
    }
}
