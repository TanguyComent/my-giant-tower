import { ReplicatedStorage, RunService } from "@rbxts/services"

export const RELEASE_PLACE_ID = 99736064347580 /// Replace with your actual release place ID
export const DEVELOP_PLACE_ID = 104271707786564 /// Replace with your actual develop place ID
export const GAME_GROUP_ID = 1086611711; /// Replace with your actual game group ID

export const GAME_VERSION = "0.0.1"

export const IS_STUDIO = RunService.IsStudio()
export const IS_RELEASE = !IS_STUDIO && (game.PlaceId === RELEASE_PLACE_ID)
export const IS_DEVELOP = IS_STUDIO || (game.PlaceId === DEVELOP_PLACE_ID)

export const BACKPACK_CAPACITY = 300;
export const MAX_TOWER_PARTS = 100;
export const TOWER_CURRENCY_GENERATION_INTERVAL = 0.25;
export const TOWER_CURRENCY_SYNC_INTERVAL = 1;
export const PKG_GameData = ReplicatedStorage.WaitForChild("PKG_GameData") as Folder;

export const FREE_REWARD_CLAIM_COOLDOWN = 10 * 60;