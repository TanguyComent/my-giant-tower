import { Networking } from "@flamework/networking"
import { ETowerParts } from "../data/tower-parts/ETowerPart"
import { EWorkshops, EWorkshopsStands } from "../data/workshops/EWorkshops";

interface ClientToServerEvents {
    syncerLoaded: () => void;
    tower: {
        requestSync: () => void,
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
        sync: (towerParts: ETowerParts[]) => void,
        patch: (towerPart: ETowerParts) => void,
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
