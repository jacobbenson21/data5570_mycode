// Persistence utility for Redux store
// Use localStorage for web (works in browser)
// For native apps, you'd need to install @react-native-async-storage/async-storage
const getStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return {
      getItem: async (key) => window.localStorage.getItem(key),
      setItem: async (key, value) => window.localStorage.setItem(key, value),
      removeItem: async (key) => window.localStorage.removeItem(key),
    };
  }
  // Fallback for native (would need AsyncStorage package)
  return {
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
  };
};

const storage = getStorage();

const STORAGE_KEYS = {
  RECIPES: 'family_recipes',
  PEOPLE: 'family_people',
  COUNTRIES: 'family_countries',
  INGREDIENTS: 'family_ingredients',
  RECIPE_INGREDIENTS: 'family_recipe_ingredients',
};

// Load all data from storage
export const loadPersistedData = async () => {
  try {
    const [recipes, people, countries, ingredients, recipeIngredients] = await Promise.all([
      storage.getItem(STORAGE_KEYS.RECIPES),
      storage.getItem(STORAGE_KEYS.PEOPLE),
      storage.getItem(STORAGE_KEYS.COUNTRIES),
      storage.getItem(STORAGE_KEYS.INGREDIENTS),
      storage.getItem(STORAGE_KEYS.RECIPE_INGREDIENTS),
    ]);

    return {
      recipes: recipes ? JSON.parse(recipes) : [],
      people: people ? JSON.parse(people) : [],
      countries: countries ? JSON.parse(countries) : [],
      ingredients: ingredients ? JSON.parse(ingredients) : [],
      recipeIngredients: recipeIngredients ? JSON.parse(recipeIngredients) : [],
    };
  } catch (error) {
    console.error('Error loading persisted data:', error);
    return {
      recipes: [],
      people: [],
      countries: [],
      ingredients: [],
      recipeIngredients: [],
    };
  }
};

// Save data to storage
export const saveToStorage = async (key, data) => {
  try {
    await storage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};

// Create middleware to persist state changes
export const persistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();

  // Save each slice to storage after state changes
  saveToStorage(STORAGE_KEYS.RECIPES, state.recipes);
  saveToStorage(STORAGE_KEYS.PEOPLE, state.people);
  saveToStorage(STORAGE_KEYS.COUNTRIES, state.countries);
  saveToStorage(STORAGE_KEYS.INGREDIENTS, state.ingredients);
  saveToStorage(STORAGE_KEYS.RECIPE_INGREDIENTS, state.recipeIngredients);

  return result;
};

