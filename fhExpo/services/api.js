// API service for communicating with Django backend
import { getApiUrl } from '../config/api';

// Helper function to handle API responses
async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const error = await response.json().catch(() => ({}));
      errorMessage = error.detail || error.message || errorMessage;
    } catch (e) {
      // If response is not JSON, try to get text
      try {
        const text = await response.text();
        if (text) errorMessage = text;
      } catch (e2) {
        // Ignore
      }
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

// Helper to convert duration format for Django
// Django expects ISO 8601 format (PT15M) or seconds
// Frontend uses "0:15:00" format, convert to seconds
const convertDurationForBackend = (durationStr) => {
  if (!durationStr) return null;
  if (typeof durationStr === 'number') return durationStr;
  // Parse "0:15:00" format to seconds
  const parts = durationStr.split(':');
  if (parts.length === 3) {
    const hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    const seconds = parseInt(parts[2]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  }
  return null;
};

// Helper to format recipe data for backend
const formatRecipeForBackend = (recipe) => {
  return {
    title: recipe.title,
    description: recipe.description || null,
    servings: recipe.servings || null,
    prep_time: convertDurationForBackend(recipe.prep_time),
    cook_time: convertDurationForBackend(recipe.cook_time),
    total_time: convertDurationForBackend(recipe.total_time),
    meal_type: recipe.meal_type || null,
    cuisine_type: recipe.cuisine_type || null,
    difficulty: recipe.difficulty || null,
    source_name: recipe.source_name || null,
    source_url: recipe.source_url || null,
    rating: recipe.rating ? parseFloat(recipe.rating) : null,
    times_cooked: recipe.times_cooked || 0,
    person: recipe.person || null,
    country: recipe.country || null,
  };
};

// Recipe API calls
export const recipeAPI = {
  getAll: async () => {
    const response = await fetch(getApiUrl('recipes'));
    return handleResponse(response);
  },
  
  getById: async (id) => {
    const response = await fetch(getApiUrl(`recipes/${id}`));
    return handleResponse(response);
  },
  
  create: async (data) => {
    const formattedData = formatRecipeForBackend(data);
    const response = await fetch(getApiUrl('recipes'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });
    return handleResponse(response);
  },
  
  update: async (id, data) => {
    const formattedData = formatRecipeForBackend(data);
    const response = await fetch(getApiUrl(`recipes/${id}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });
    return handleResponse(response);
  },
  
  delete: async (id) => {
    const response = await fetch(getApiUrl(`recipes/${id}`), {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete recipe: ${response.statusText}`);
    }
    return true;
  },
};

// Person API calls
export const personAPI = {
  getAll: async () => {
    const response = await fetch(getApiUrl('people'));
    return handleResponse(response);
  },
  
  getById: async (id) => {
    const response = await fetch(getApiUrl(`people/${id}`));
    return handleResponse(response);
  },
  
  create: async (data) => {
    const response = await fetch(getApiUrl('people'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: data.first_name,
        last_name: data.last_name || null,
        birth_date: data.birth_date || null,
        death_date: data.death_date || null,
        notes: data.notes || null,
      }),
    });
    return handleResponse(response);
  },
  
  update: async (id, data) => {
    const response = await fetch(getApiUrl(`people/${id}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: data.first_name,
        last_name: data.last_name || null,
        birth_date: data.birth_date || null,
        death_date: data.death_date || null,
        notes: data.notes || null,
      }),
    });
    return handleResponse(response);
  },
  
  delete: async (id) => {
    const response = await fetch(getApiUrl(`people/${id}`), {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete person: ${response.statusText}`);
    }
    return true;
  },
};

// Country API calls
export const countryAPI = {
  getAll: async () => {
    const response = await fetch(getApiUrl('countries'));
    return handleResponse(response);
  },
  
  getById: async (id) => {
    const response = await fetch(getApiUrl(`countries/${id}`));
    return handleResponse(response);
  },
  
  create: async (data) => {
    const response = await fetch(getApiUrl('countries'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        region: data.region || null,
      }),
    });
    return handleResponse(response);
  },
};

// Ingredient API calls
export const ingredientAPI = {
  getAll: async () => {
    const response = await fetch(getApiUrl('ingredients'));
    return handleResponse(response);
  },
  
  getById: async (id) => {
    const response = await fetch(getApiUrl(`ingredients/${id}`));
    return handleResponse(response);
  },
  
  create: async (data) => {
    const response = await fetch(getApiUrl('ingredients'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        unit: data.unit || null,
        notes: data.notes || null,
      }),
    });
    return handleResponse(response);
  },
  
  update: async (id, data) => {
    const response = await fetch(getApiUrl(`ingredients/${id}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        unit: data.unit || null,
        notes: data.notes || null,
      }),
    });
    return handleResponse(response);
  },
  
  delete: async (id) => {
    const response = await fetch(getApiUrl(`ingredients/${id}`), {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete ingredient: ${response.statusText}`);
    }
    return true;
  },
};

// RecipeIngredient API calls
export const recipeIngredientAPI = {
  getAll: async () => {
    const response = await fetch(getApiUrl('recipe-ingredients'));
    return handleResponse(response);
  },
  
  getById: async (id) => {
    const response = await fetch(getApiUrl(`recipe-ingredients/${id}`));
    return handleResponse(response);
  },
  
  create: async (data) => {
    const response = await fetch(getApiUrl('recipe-ingredients'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipe: data.recipe,
        ingredient: data.ingredient,
        quantity: data.quantity || null,
      }),
    });
    return handleResponse(response);
  },
  
  update: async (id, data) => {
    const response = await fetch(getApiUrl(`recipe-ingredients/${id}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipe: data.recipe,
        ingredient: data.ingredient,
        quantity: data.quantity || null,
      }),
    });
    return handleResponse(response);
  },
  
  delete: async (id) => {
    const response = await fetch(getApiUrl(`recipe-ingredients/${id}`), {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete recipe ingredient: ${response.statusText}`);
    }
    return true;
  },
  
  // Get all recipe ingredients for a specific recipe
  getByRecipe: async (recipeId) => {
    const all = await recipeIngredientAPI.getAll();
    return all.filter(ri => ri.recipe === recipeId);
  },
};

