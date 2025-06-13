import { components } from "./schema";
import { VNodeRef } from "vue";

export type HeaderCollections = {
  visible: boolean;
  selectedCollectionId: number;
  collections: components["schemas"]["RetrieveCollection"][];
  needsScroll: boolean;
};
export type MainSeo = {
  meta_title_ru: string;
  meta_title_eng: string;
  meta_description_ru: string;
  meta_description_eng: string;
  meta_keywords_ru: string;
  meta_keywords_eng: string;
  og_title_ru: string;
  og_title_eng: string;
  og_description_ru: string;
  og_description_eng: string;
  og_image: string | null;
  canonical_url: string;
  robots_content: string;
};

export type InspirationFilters = {
  authors: {
    collapsed: boolean;
    list: components["schemas"]["Author"][];
    element: VNodeRef | undefined;
    selected: number[];
  };
  styles: {
    collapsed: boolean;
    list: components["schemas"]["InspirationStyle"][];
    element: VNodeRef | undefined;
    selected: number[];
  };
  rooms: {
    collapsed: boolean;
    list: components["schemas"]["Room"][];
    element: VNodeRef | undefined;
    selected: number[];
  };
  building: {
    collapsed: boolean;
    list: components["schemas"]["BuildingType"][];
    element: VNodeRef | undefined;
    selected: number[];
  };
};
