import { BACKPACK_ICON_OPENED } from "@common/shared/Assets"
import { EBackpackCategories } from "./EBackpackCategories";

export interface IBackpackCategoryData {
    icon: string;
    displayName: string;
    isToolInCategory: (item: Tool) => boolean;
}

export const OrderedBackpackCategories: EBackpackCategories[] = [
    EBackpackCategories.ALL,
]

export const BackpackCategoriesData: Record<EBackpackCategories, IBackpackCategoryData> = {
    [EBackpackCategories.ALL]: {
        icon: BACKPACK_ICON_OPENED,
        displayName: "All",
        isToolInCategory: () => true,
    },
}