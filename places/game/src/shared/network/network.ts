import { Networking } from "@flamework/networking"
import { ETowerParts } from "../data/tower-parts/ETowerPart"
import { EWorkshops, EWorkshopsStands } from "../data/workshops/EWorkshops";
import { UserId } from "@common/shared/utils/TypeWrapper.utils"

interface ClientToServerEvents {
    syncerLoaded: () => void;
    tower: {
        requestSync: (ownerId: UserId) => void,
    }
    towerPartStand: {
        drawTowerPart: () => void,
        buyCurrentTowerPart: () => void,
        deleteInHandTowerPart: () => void,
    }
    workshops: {
        unlockNextWorkshopStand: (workshopName: EWorkshops) => void,
        depositInHandTowerPart: (workshopName: EWorkshops, workshopStandName: EWorkshopsStands) => void,
    }
}

interface ServerToClientEvents {
    dispatch: (payload: unknown) => void,
    tower: {
        sync: (ownerId: UserId, towerParts: ETowerParts[]) => void,
        patch: (ownerId: UserId, towerPart: ETowerParts) => void,
    }
    towerPartStand: {
        setStandContent: (towerPartName: ETowerParts | undefined) => void,
    }
    messages: {
        createSuccess: (message: string) => void,
        createError: (message: string) => void,
    }
}

interface ClientToServerFunctions {
}

interface ServerToClientFunctions {
}

export const EventsDeclaration = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>()
export const FunctionsDeclaration = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>()
