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
 * Builds and maintains the visual tower model for a plot, on top of `baseCFrame`.
 * `build` lays out a full array bottom-to-top in the given order (index 0 = bottom).
 * `addTowerPart`/its animated variant always slot the new part in underground, directly below
 * the fixed `baseCFrame` floor, then move the whole tower model (new part included, since it's
 * parented under it first) up by that part's height in one `Model.PivotTo` call - the model container
 * carries every existing part along rigidly, so nothing needs repositioning individually.
 * Assumes each tower part model's pivot sits at the base of the part, so parts can be stacked purely by summing heights.
 * Capped at MAX_TOWER_PARTS, mirroring the server: once reached, adding a part first removes the current top part.
 */
export class PlayerTower {
    private static readonly upliftDuration = 0.6;

    private readonly model = new Instance("Model");
    private readonly patchQueue = new AsyncQueue();
    private towerPartEntries: TowerPartEntry[] = [];
    private towerHeight = 0;
    private destroyed = false;

    constructor(
        private readonly baseCFrame: CFrame,
        parent: Instance,
    ) {
        this.model.Name = "Tower";
        this.model.PivotTo(baseCFrame);
        this.model.Parent = parent;
    }

    public build(towerParts: ETowerParts[]): void {
        if (this.destroyed) return;

        this.clear();
        towerParts.forEach((towerPart) => this.stackOnTop(towerPart));
    }

    public addTowerPart(towerPart: ETowerParts): Model | undefined {
        if (this.destroyed) return undefined;

        this.removeTopPartIfAtLimit();

        const towerPartModel = TowerPartsUtils.getTowerPartModelClone(towerPart);
        const height = towerPartModel.GetExtentsSize().Y;

        towerPartModel.PivotTo(this.baseCFrame.mul(new CFrame(0, -height / 2, 0)));
        towerPartModel.Parent = this.model;
        this.model.PivotTo(this.model.GetPivot().mul(new CFrame(0, height, 0)));

        this.towerPartEntries.unshift({ model: towerPartModel, height });
        this.towerHeight += height;
        return towerPartModel;
    }

    public enqueueTowerPartWithAnimation(towerPart: ETowerParts): Promise<void> {
        if (this.destroyed) return Promise.resolve();
        return this.patchQueue.enqueue(() => this.addTowerPartWithAnimationAsync(towerPart));
    }

    public destroy(): void {
        this.destroyed = true;
        this.model.Destroy();
    }

    private async addTowerPartWithAnimationAsync(towerPart: ETowerParts): Promise<void> {
        if (this.destroyed) return;

        this.removeTopPartIfAtLimit();

        const towerPartModel = TowerPartsUtils.getTowerPartModelClone(towerPart);
        const height = towerPartModel.GetExtentsSize().Y;

        towerPartModel.PivotTo(this.baseCFrame.mul(new CFrame(0, -height / 2, 0)));
        towerPartModel.Parent = this.model;

        const targetPivot = this.model.GetPivot().mul(new CFrame(0, height, 0));
        await AnimationsUtils.riseFromGroundAsync(this.model, targetPivot, PlayerTower.upliftDuration, {
            shakeMagnitude: 1,
            shouldCancel: () => this.destroyed,
        });

        if (this.destroyed) return;

        this.towerPartEntries.unshift({ model: towerPartModel, height });
        this.towerHeight += height;
    }

    private stackOnTop(towerPart: ETowerParts): Model {
        const towerPartModel = TowerPartsUtils.getTowerPartModelClone(towerPart);
        const height = towerPartModel.GetExtentsSize().Y;
        towerPartModel.PivotTo(this.getTopCFrame().add(new Vector3(0, height / 2, 0)));
        towerPartModel.Parent = this.model;

        this.towerPartEntries.push({ model: towerPartModel, height });
        this.towerHeight += height;
        return towerPartModel;
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
        this.model.PivotTo(this.baseCFrame);
        this.towerPartEntries = [];
        this.towerHeight = 0;
    }
}
