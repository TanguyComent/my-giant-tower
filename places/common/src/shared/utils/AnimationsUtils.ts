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

    export async function shakeModelAsync(model: Model, options?: { duration?: number; magnitude?: number; frequency?: number }): Promise<Model> {
        const duration = options?.duration ?? 0.3;
        const magnitude = options?.magnitude ?? 0.15;
        const frequency = options?.frequency ?? 20;
        const settledCFrame = model.GetPivot();

        let elapsedTime = 0;
        while (elapsedTime < duration) {
            elapsedTime += RunService.PreRender.Wait()[0];
            const decay = 1 - math.clamp(elapsedTime / duration, 0, 1);
            const offset = math.sin(elapsedTime * frequency) * magnitude * decay;
            model.PivotTo(settledCFrame.mul(new CFrame(offset, 0, 0)));
        }

        model.PivotTo(settledCFrame);
        return model;
    }
}