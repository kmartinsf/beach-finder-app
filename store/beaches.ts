import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { Beach } from "../types/beaches";

type BeachState = {
  beaches: Beach[];
  setBeaches: (beaches: Beach[]) => void;
  favouriteBeaches: Beach[];
  setFavouriteBeaches: (favouriteBeaches: Beach[]) => void;
  toggleFavouriteBeach: (beach: Beach) => void;
};

const STORAGE_KEY = "@favouriteBeaches";

export const useBeachStore = create<BeachState>((set, get) => ({
  beaches: [],
  setBeaches: (beaches) => set({ beaches }),
  favouriteBeaches: [],
  setFavouriteBeaches: (favouriteBeaches) => {
    set({ favouriteBeaches });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favouriteBeaches));
  },
  toggleFavouriteBeach: (beach) => {
    const currentFavourites = get().favouriteBeaches;
    const isFavourite = currentFavourites.some((b) => b.id === beach.id);

    const newFavourites = isFavourite
      ? currentFavourites.filter((b) => b.id !== beach.id)
      : [...currentFavourites, beach];

    set({ favouriteBeaches: newFavourites });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFavourites));
  },
}));

const initializeStore = async () => {
  try {
    const storedFavourites = await AsyncStorage.getItem(STORAGE_KEY);
    if (storedFavourites) {
      useBeachStore
        .getState()
        .setFavouriteBeaches(JSON.parse(storedFavourites));
    }
  } catch (error) {
    throw error;
  }
};

initializeStore();
