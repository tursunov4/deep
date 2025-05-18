import {components} from "./schema";
import {VNodeRef} from "vue";

export type HeaderCollections = {
    visible: boolean,
    selectedCollectionId: number,
    collections: components["schemas"]["RetrieveCollection"][],
    needsScroll: boolean
}

export type InspirationFilters = {
    authors:{
        collapsed: boolean,
        list: components["schemas"]["Author"][],
        element: VNodeRef | undefined,
        selected: number[]
    },
    styles:{
        collapsed: boolean,
        list: components["schemas"]["InspirationStyle"][],
        element: VNodeRef | undefined,
        selected: number[]
    },
    rooms:{
        collapsed: boolean,
        list: components["schemas"]["Room"][],
        element: VNodeRef | undefined,
        selected: number[]
    },
    building:{
        collapsed: boolean,
        list: components["schemas"]["BuildingType"][],
        element: VNodeRef | undefined,
        selected: number[]
    }
}
