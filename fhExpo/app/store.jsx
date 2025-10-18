// --- File: app/store.jsx ---
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Recipe slice
const recipeSlice = createSlice({
  name: 'recipes',
  initialState: [],
  reducers: {
    addRecipe: (state, action) => {
        // Redux Toolkit uses Immer, so direct push is safe here
        state.push(action.payload);
    },
    updateRecipe: (state, action) => {
      const index = state.findIndex(r => String(r.id) === String(action.payload.id));
      if (index !== -1) state[index] = action.payload;
    },
    deleteRecipe: (state, action) => {
        // 🚀 FIX: Convert both IDs to strings for comparison
        return state.filter(r => String(r.id) !== String(action.payload));
    },
  },
});

export const { addRecipe, updateRecipe, deleteRecipe } = recipeSlice.actions;

export const store = configureStore({
  reducer: {
    recipes: recipeSlice.reducer,
  },
});