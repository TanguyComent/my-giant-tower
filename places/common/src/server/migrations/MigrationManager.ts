import { IPlayerDataRemoteV1 } from "@common/server/migrations/V1/IPlayerDataRemoteV1"
import { MigrationManager } from "./MigrationManager.class"

export type LastRemoteDataType = IPlayerDataRemoteV1;
export const Migrator = new MigrationManager<LastRemoteDataType>();