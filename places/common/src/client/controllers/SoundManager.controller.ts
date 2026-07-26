import { PriorityHandler } from "@common/shared/class/PriorityHandler.class"
import { ESounds } from "@common/shared/data/sounds/ESounds"
import { Controller, OnStart } from "@flamework/core"
import { Janitor } from "@rbxts/janitor"
import { CommonEvents } from "../Networking"
import { SoundsData } from "@common/shared/data/sounds/Sounds.data"
import { RunService, SoundService, Workspace } from "@rbxts/services"
import { computed, peek, subscribe } from "@rbxts/charm"
import { LocalSettingsAtom } from "../states/LocalSettings.atom"

export enum EMusicPriorities {
    MAIN_THEME,
}

@Controller()
export class SoundManagerController implements OnStart {
    private musicsQueue: PriorityHandler<{ priority: number; soundName: ESounds }> = new PriorityHandler();
    private currentMusic: { instance: Sound; musicName: ESounds } | undefined;
    private currentMusicJanitor = new Janitor()

    private soundsInstancesFolder = new Instance("Folder");
    private spacialSoundsFolder = new Instance("Folder");

    onStart(): void {
        this.soundsInstancesFolder.Name = "SoundsInstances";
        this.soundsInstancesFolder.Parent = Workspace;

        this.spacialSoundsFolder.Name = "SpacialSounds";
        this.spacialSoundsFolder.Parent = Workspace;
        this.createSoundsInstances();

        this.musicsQueue.onActiveItemChanged.Connect((item) => {
            this.startMusic(item.soundName);
        })

        CommonEvents.onProfileLoaded.connect((session) => {
            this.musicsQueue.addItem({ priority: EMusicPriorities.MAIN_THEME, soundName: ESounds.MAIN_THEME_MUSIC });
        })

        subscribe(computed(() => LocalSettingsAtom().musicVolume), (musicVolume) => {
            if (this.currentMusic) {
                const musicDatum = SoundsData[this.currentMusic.musicName];
                this.currentMusic.instance.Volume = musicDatum.volume * musicVolume;
            }
        })
    }

	public playClientSound(soundName: ESounds) {
		const sfxVolume = peek(LocalSettingsAtom).sfxVolume;
        const soundDatum = SoundsData[soundName];
        const soundInstance = this.soundsInstancesFolder.FindFirstChild(soundName) as Sound | undefined;
		if (soundInstance) {
			const initialVolume = soundDatum.volume;
			soundInstance.Volume = initialVolume * sfxVolume;
			SoundService.PlayLocalSound(soundInstance);
		}
	}

	public playClientSpacialSound(soundName: ESounds, position: Vector3, options?: { RollOffMaxDistance?: number, RollOffMinDistance?: number, RollOffMode?: Enum.RollOffMode }) {
		const sfxVolume = peek(LocalSettingsAtom).sfxVolume;
		const uiSound = this.soundsInstancesFolder.FindFirstChild(soundName) as Sound | undefined;

		if (!uiSound) return;
		const soundClone = uiSound.Clone();
		soundClone.RollOffMaxDistance = options?.RollOffMaxDistance ?? uiSound.RollOffMaxDistance;
		soundClone.RollOffMinDistance = options?.RollOffMinDistance ?? uiSound.RollOffMinDistance;
		soundClone.RollOffMode = options?.RollOffMode ?? uiSound.RollOffMode;

		const attachment = new Instance("Attachment");
		attachment.WorldPosition = position;
		attachment.Parent = this.spacialSoundsFolder;

        const soundDatum = SoundsData[soundName];
		soundClone.Parent = attachment;
		soundClone.Volume = soundDatum.volume * sfxVolume;
		soundClone.Ended.Connect(() => {
			attachment.Destroy();
			soundClone.Destroy();
		})

		soundClone.Play();
	}

    public requestMusicChange(priority: EMusicPriorities, musicName: ESounds) {
        this.musicsQueue.addItem({ priority, soundName: musicName });
    }

    private createSoundsInstances() {
        for (const [soundName, soundDatum] of pairs(SoundsData)) {
            const instance = new Instance("Sound");
            instance.SoundId = soundDatum.soundId;
            instance.Name = soundName;
            instance.Parent = this.soundsInstancesFolder;
        }
    }

    private startMusic(musicName: ESounds) {
        this.currentMusicJanitor.Cleanup();
        const musicDatum = SoundsData[musicName];

        const instance = this.soundsInstancesFolder.FindFirstChild(musicName) as Sound | undefined;
        if (!instance) {
            warn(`Sound instance for ${musicName} not found!`);
            return;
        }

        this.currentMusic = { instance, musicName };
        instance.Volume = 0;
        instance.Looped = true;
        instance.Play();
        let targetVolume = musicDatum.volume;
        let elapsedTime = 0;
        const fadeDuration = 0.5;

        const fadinConnection = RunService.RenderStepped.Connect((dt) => {
            elapsedTime += dt;
            const progress = math.clamp(elapsedTime / fadeDuration, 0, 1);
            instance.Volume = targetVolume * progress * peek(LocalSettingsAtom).musicVolume;

            if (progress >= 1) {
                fadinConnection.Disconnect();
            }
        })

        this.currentMusicJanitor.Add(fadinConnection, "Disconnect");
        this.currentMusicJanitor.Add(() => {
            instance.Stop();
            instance.Volume = targetVolume;
            instance.Looped = false;
        })
    }
} 