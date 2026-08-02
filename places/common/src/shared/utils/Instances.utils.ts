export namespace InstancesUtils {
    export function inhert<T extends Instance>(instance: T, settings?: Partial<{ Anchored: boolean; CanCollide: boolean; CanQuery: boolean }>): T {
        for (const descendant of instance.GetDescendants()) {
            if (descendant.IsA("BasePart")) {
                descendant.Anchored = settings?.Anchored !== undefined ? settings.Anchored : true;
                descendant.CanCollide = settings?.CanCollide !== undefined ? settings.CanCollide : false;
                descendant.CanQuery = settings?.CanQuery !== undefined ? settings.CanQuery : false;
                descendant.CanTouch = false;
                descendant.AudioCanCollide = false;
            }
        }

        if (instance.IsA("BasePart")) {
            instance.Anchored = settings?.Anchored !== undefined ? settings.Anchored : true;
            instance.CanCollide = settings?.CanCollide !== undefined ? settings.CanCollide : false;
            instance.CanQuery = settings?.CanQuery !== undefined ? settings.CanQuery : false;
            instance.CanTouch = false;
            instance.AudioCanCollide = false;
        }

        return instance;
    }

    /**
     * Rescale a model to fit within a bounding box 
     * @param model The model to rescale.
     * @param targetSize The maximum size of the model after rescale. The model will be resized to fit within a box of this size, while keeping its proportions.
     */
    export function rescaleModel(model: Model, targetSize: Vector3): Model {
        const modelSize = model.GetExtentsSize();
        const scale = math.min(targetSize.X / modelSize.X, targetSize.Y / modelSize.Y, targetSize.Z / modelSize.Z);
        model.ScaleTo(model.GetScale() * scale);
        return model;
    }

    /**
     * Rescale the model from a specific point.
     * @param model The model to rescale.
     * @param scale The scale factor to apply to the model.
     * @param scalingCenter The point from which the model should be rescale. Work as a pivot, (0, 0, 0) is the center of the model, (0.5, 0.5, 0.5) is a corner, etc. 
     */
    export function scaleModelFrom(model: Model, scale: number, scalingCenter: Vector3): Model {
        const modelSize = model.GetExtentsSize();
        const modelPivot = model.GetPivot();
        const pivotPosition = modelPivot.Rotation.add(modelPivot.mul(modelSize.mul(scalingCenter))); 
        
        const oldPrimaryPart = model.PrimaryPart;
        const tempPrimaryPart = new Instance("Part");
        tempPrimaryPart.CanCollide = false;
        tempPrimaryPart.Transparency = 1;
        tempPrimaryPart.Size = Vector3.one.mul(0.01);
        tempPrimaryPart.Anchored = true;
        tempPrimaryPart.CFrame = pivotPosition;
        tempPrimaryPart.Parent = model
        model.PrimaryPart = tempPrimaryPart;
        model.ScaleTo(scale);
        model.PrimaryPart = oldPrimaryPart;
        tempPrimaryPart.Destroy();

        return model;
    }

    export function normalizeScale(model: Model): Model {
        const newModel = new Instance("Model");
        newModel.Name = model.Name;
        const pp = model.PrimaryPart;

        for (const child of model.GetChildren()) {
            child.Parent = newModel;
        }

        newModel.PrimaryPart = pp;
        return newModel;
    }

    export function initHideShow(instance: Instance): void {
        for (const descendant of instance.GetDescendants()) {
            if (
                descendant.IsA("BasePart") || 
                descendant.IsA("Decal") || 
                descendant.IsA("Texture")
            ) {
                if (descendant.GetAttribute("originalTransparency") === undefined) {
                    descendant.SetAttribute("originalTransparency", descendant.Transparency);
                }
            }
        }
    }

    export function hide<T extends Instance>(instance: T): T {
        initHideShow(instance);
        for (const descendant of instance.GetDescendants()) {
            if (
                descendant.IsA("BasePart") || 
                descendant.IsA("Decal") || 
                descendant.IsA("Texture")
            ) {
                descendant.Transparency = 1;
            }

            if (descendant.IsA("SurfaceGui")) {
                descendant.Enabled = false;
            }
        }

        return instance;
    }

    export function show<T extends Instance>(instance: T): T {
        for (const descendant of instance.GetDescendants()) {
            if (
                descendant.IsA("BasePart") || 
                descendant.IsA("Decal") || 
                descendant.IsA("Texture")
            ) {
                if (descendant.Transparency !== 1) continue;
                const originalTransparency = descendant.GetAttribute("originalTransparency");
                assert(originalTransparency === undefined || typeIs(originalTransparency, "number"));
                descendant.Transparency = originalTransparency ?? 0;
            }

            if (descendant.IsA("SurfaceGui")) {
                descendant.Enabled = true;
            }
        }

        return instance;
    }

    /**
     * Weld all the BasePart descendants of the instance to the primary part, so they move as one.
     * @param instance The instance to weld
     * @param primaryPart The part to weld all the other parts to. Usually the primary part of the model or at least a member of the instance tree.
     * @returns the welded instance
     */
    export function weld<T extends Instance>(instance: T, primaryPart: BasePart): T {
        for (const descendant of instance.GetDescendants()) {
            if (descendant.IsA("BasePart") && descendant !== primaryPart) {
                const weldConstraint = new Instance("WeldConstraint");
                weldConstraint.Part0 = primaryPart;
                weldConstraint.Part1 = descendant;
                weldConstraint.Parent = descendant;
            }
        }

        return instance;
    }

    export function createDummyPart(): Part {
        const part = new Instance("Part");
        part.Size = Vector3.one;
        part.Transparency = 1;
        inhert(part);
        return part
    }

    export function hasAtLeastOneTag(instance: Instance, ...tags: string[]) {
        for (const tag of tags) {
            if (instance.HasTag(tag)) return true;
        }
        return false;
    }
}