// --- File: app/store.jsx ---
import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { persistenceMiddleware, loadPersistedData } from '../utils/persistence';
import { 
  recipeAPI, 
  personAPI, 
  countryAPI, 
  ingredientAPI, 
  recipeIngredientAPI 
} from '../services/api';

// ========== RECIPE ASYNC THUNKS ==========
export const fetchRecipes = createAsyncThunk('recipes/fetchAll', async () => {
  return await recipeAPI.getAll();
});

export const fetchRecipe = createAsyncThunk('recipes/fetchOne', async (id) => {
  return await recipeAPI.getById(id);
});

export const createRecipe = createAsyncThunk('recipes/create', async (data) => {
  return await recipeAPI.create(data);
});

export const updateRecipe = createAsyncThunk('recipes/update', async ({ id, data }) => {
  return await recipeAPI.update(id, data);
});

export const deleteRecipe = createAsyncThunk('recipes/delete', async (id) => {
  await recipeAPI.delete(id);
  return id;
});

export const incrementTimesCooked = createAsyncThunk('recipes/incrementTimesCooked', async (id) => {
  // Get current recipe, increment, and update
  const recipe = await recipeAPI.getById(id);
  const updated = { ...recipe, times_cooked: (recipe.times_cooked || 0) + 1 };
  return await recipeAPI.update(id, updated);
});

// ========== RECIPE SLICE ==========
const recipeSlice = createSlice({
  name: 'recipes',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all recipes
    builder.addCase(fetchRecipes.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRecipes.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchRecipes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    
    // Create recipe
    builder.addCase(createRecipe.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createRecipe.fulfilled, (state, action) => {
      state.loading = false;
      state.items.push(action.payload);
    });
    builder.addCase(createRecipe.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    
    // Update recipe
    builder.addCase(updateRecipe.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateRecipe.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.items.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });
    builder.addCase(updateRecipe.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    
    // Delete recipe
    builder.addCase(deleteRecipe.fulfilled, (state, action) => {
      state.items = state.items.filter(r => r.id !== action.payload);
    });
    
    // Increment times cooked
    builder.addCase(incrementTimesCooked.fulfilled, (state, action) => {
      const index = state.items.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });
  },
});

// ========== PERSON ASYNC THUNKS ==========
export const fetchPeople = createAsyncThunk('people/fetchAll', async () => {
  return await personAPI.getAll();
});

export const fetchPerson = createAsyncThunk('people/fetchOne', async (id) => {
  return await personAPI.getById(id);
});

export const createPerson = createAsyncThunk('people/create', async (data) => {
  return await personAPI.create(data);
});

export const updatePerson = createAsyncThunk('people/update', async ({ id, data }) => {
  return await personAPI.update(id, data);
});

export const deletePerson = createAsyncThunk('people/delete', async (id) => {
  await personAPI.delete(id);
  return id;
});

// ========== PERSON SLICE ==========
const personSlice = createSlice({
  name: 'people',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPeople.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPeople.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchPeople.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    
    builder.addCase(createPerson.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });
    
    builder.addCase(updatePerson.fulfilled, (state, action) => {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });
    
    builder.addCase(deletePerson.fulfilled, (state, action) => {
      state.items = state.items.filter(p => p.id !== action.payload);
    });
  },
});

// ========== COUNTRY ASYNC THUNKS ==========
export const fetchCountries = createAsyncThunk('countries/fetchAll', async () => {
  return await countryAPI.getAll();
});

export const createCountry = createAsyncThunk('countries/create', async (data) => {
  return await countryAPI.create(data);
});

// ========== COUNTRY SLICE ==========
const countrySlice = createSlice({
  name: 'countries',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCountries.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCountries.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchCountries.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    
    builder.addCase(createCountry.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });
  },
});

// ========== INGREDIENT ASYNC THUNKS ==========
export const fetchIngredients = createAsyncThunk('ingredients/fetchAll', async () => {
  return await ingredientAPI.getAll();
});

export const createIngredient = createAsyncThunk('ingredients/create', async (data) => {
  return await ingredientAPI.create(data);
});

export const updateIngredient = createAsyncThunk('ingredients/update', async ({ id, data }) => {
  return await ingredientAPI.update(id, data);
});

export const deleteIngredient = createAsyncThunk('ingredients/delete', async (id) => {
  await ingredientAPI.delete(id);
  return id;
});

// ========== INGREDIENT SLICE ==========
const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchIngredients.fulfilled, (state, action) => {
      state.items = action.payload;
    });
    
    builder.addCase(createIngredient.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });
    
    builder.addCase(updateIngredient.fulfilled, (state, action) => {
      const index = state.items.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });
    
    builder.addCase(deleteIngredient.fulfilled, (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    });
  },
});

// ========== RECIPE INGREDIENT ASYNC THUNKS ==========
export const fetchRecipeIngredients = createAsyncThunk('recipeIngredients/fetchAll', async () => {
  return await recipeIngredientAPI.getAll();
});

export const createRecipeIngredient = createAsyncThunk('recipeIngredients/create', async (data) => {
  return await recipeIngredientAPI.create(data);
});

export const updateRecipeIngredient = createAsyncThunk('recipeIngredients/update', async ({ id, data }) => {
  return await recipeIngredientAPI.update(id, data);
});

export const deleteRecipeIngredient = createAsyncThunk('recipeIngredients/delete', async (id) => {
  await recipeIngredientAPI.delete(id);
  return id;
});

export const deleteRecipeIngredientsByRecipe = createAsyncThunk('recipeIngredients/deleteByRecipe', async (recipeId) => {
  const recipeIngredients = await recipeIngredientAPI.getByRecipe(recipeId);
  await Promise.all(recipeIngredients.map(ri => recipeIngredientAPI.delete(ri.id)));
  return recipeId;
});

// ========== RECIPE INGREDIENT SLICE ==========
const recipeIngredientSlice = createSlice({
  name: 'recipeIngredients',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRecipeIngredients.fulfilled, (state, action) => {
      state.items = action.payload;
    });
    
    builder.addCase(createRecipeIngredient.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });
    
    builder.addCase(updateRecipeIngredient.fulfilled, (state, action) => {
      const index = state.items.findIndex(ri => ri.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });
    
    builder.addCase(deleteRecipeIngredient.fulfilled, (state, action) => {
      state.items = state.items.filter(ri => ri.id !== action.payload);
    });
    
    builder.addCase(deleteRecipeIngredientsByRecipe.fulfilled, (state, action) => {
      state.items = state.items.filter(ri => ri.recipe !== action.payload);
    });
  },
});

// Export reducer actions
export const { clearError: clearRecipeError } = recipeSlice.actions;
export const { clearError: clearPersonError } = personSlice.actions;
export const { clearError: clearCountryError } = countrySlice.actions;
export const { clearError: clearIngredientError } = ingredientSlice.actions;
export const { clearError: clearRecipeIngredientError } = recipeIngredientSlice.actions;

// Load persisted data asynchronously
export const initializeStore = async () => {
  const persistedData = await loadPersistedData();
  return persistedData;
};

export const store = configureStore({
  reducer: {
    recipes: recipeSlice.reducer,
    people: personSlice.reducer,
    countries: countrySlice.reducer,
    ingredients: ingredientSlice.reducer,
    recipeIngredients: recipeIngredientSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistenceMiddleware),
});

export type AppDispatch = typeof store.dispatch;