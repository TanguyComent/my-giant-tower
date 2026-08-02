import { Networking } from "@flamework/networking"
import { ETowerPart } from "../data/tower-parts/ETowerPart"
import { EWorkshops } from "../data/workshops/EWorkshops";

interface ClientToServerEvents {
    syncerLoaded: () => void;
    towerPartStand: {
        drawTowerPart: () => void,
        buyCurrentTowerPart: () => void,
        deleteInHandTowerPart: () => void,
    }
    workshops: {
        unlockNextWorkshopStand: (workshopName: EWorkshops) => void,
    }
}

interface ServerToClientEvents {
    dispatch: (payload: unknown) => void,
    towerPartStand: {
        setStandContent: (towerPartName: ETowerPart | undefined) => void,
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
