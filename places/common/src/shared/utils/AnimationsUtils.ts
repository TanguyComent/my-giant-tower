import { RunService } from "@rbxts/services";

export namespace AnimationsUtils {
    export namespace Easing {
        export const SmoothStep = (t: number) => t * t * (3 - 2 * t);
    }

    export async function bringModelInCurveToAsync(model: Model, targetCFrame: CFrame, duration: number, options?: { easingFunction?: (t: number) => number }): Promise<Model> {
        const easingFunction = options?.easingFunction ?? AnimationsUtils.Easing.SmoothStep;
        const animationDuration = duration;
        const initialCFrame = model.GetPivot();
        const baseHeightDifference = initialCFrame.Y - targetCFrame.Y;
        const maximumAditionalHeight = 8
        const horizontalVector = new Vector3(1, 0, 1);
        let elapsedTime = 0;

        while (elapsedTime < animationDuration) {
            elapsedTime += RunService.PreRender.Wait()[0]
            const alpha = easingFunction(math.clamp(elapsedTime / animationDuration, 0, 1));
            const horizontalPosition = initialCFrame.Position.mul(horizontalVector).Lerp(targetCFrame.Position.mul(horizontalVector), alpha);
            const verticalPosition = math.sin(alpha * math.pi) * maximumAditionalHeight + (1 - alpha) * baseHeightDifference

            const newPosition = new Vector3(horizontalPosition.X, targetCFrame.Y + verticalPosition, horizontalPosition.Z);
            const newOrientation = initialCFrame.Rotation.Lerp(targetCFrame.Rotation, alpha);
            model.PivotTo(newOrientation.add(newPosition));
        }
        
        return model;
    }

    export async function scaleModelToAsync(model: Model, targetScale: number, duration: number, options?: { easingFunction?: (t: number) => number, initialScale?: number }): Promise<Model> {
        const easingFuncton = options?.easingFunction ?? ((t: number) => t);
        const initialScale = options?.initialScale ?? model.GetScale();

        let elapsedTime = 0;
        while (elapsedTime < duration) {
            const deltaTime = task.wait();
            elapsedTime += deltaTime;
            const t = math.clamp(elapsedTime / duration, 0, 1);
            const easedT = easingFuncton(t);
            model.ScaleTo(initialScale + (targetScale - initialScale) * easedT);
        }

        model.ScaleTo(targetScale);
        return model;
    }

    /**
     * Rises `model` straight up from its current position to `targetCFrame`, shaking on the local X/Z
     * axes throughout (decaying to nothing by the end). Meant for a model growing up out of the ground.
     * `shouldCancel` is polled every frame; when it returns true the loop stops immediately without
     * snapping to `targetCFrame`, for callers that need to abandon the animation early (e.g. the model
     * being destroyed mid-flight).
     */
    export async function riseFromGroundAsync(model: Model, targetCFrame: CFrame, duration: number, options?: { easingFunction?: (t: number) => number, shakeMagnitude?: number, shakeFrequency?: number, shouldCancel?: () => boolean }): Promise<Model> {
        const easingFunction = options?.easingFunction ?? AnimationsUtils.Easing.SmoothStep;
        const shakeMagnitude = options?.shakeMagnitude ?? 0.15;
        const shakeFrequency = options?.shakeFrequency ?? 20;
        const shouldCancel = options?.shouldCancel ?? (() => false);
        const initialY = model.GetPivot().Y;

        let elapsedTime = 0;
        while (elapsedTime < duration) {
            if (shouldCancel()) return model;

            elapsedTime += RunService.PreRender.Wait()[0];
            const t = math.clamp(elapsedTime / duration, 0, 1);
            const alpha = easingFunction(t);
            const decay = 1 - t;

            const currentY = initialY + (targetCFrame.Y - initialY) * alpha;
            const shakeX = math.sin(elapsedTime * shakeFrequency) * shakeMagnitude * decay;
            const shakeZ = math.cos(elapsedTime * shakeFrequency * 0.7) * shakeMagnitude * decay;

            const verticalCFrame = new CFrame(new Vector3(targetCFrame.X, currentY, targetCFrame.Z)).mul(targetCFrame.Rotation);
            model.PivotTo(verticalCFrame.mul(new CFrame(shakeX, 0, shakeZ)));
        }

        if (!shouldCancel()) {
            model.PivotTo(targetCFrame);
        }
        return model;
    }
}