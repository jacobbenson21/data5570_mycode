import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Provider, useDispatch } from 'react-redux';
import { store, initializeStore } from './store';
import type { AppDispatch } from './store';
import { 
  fetchRecipes, 
  fetchPeople, 
  fetchCountries, 
  fetchIngredients, 
  fetchRecipeIngredients 
} from './store';

function AppContent() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load persisted data first (for offline support)
    initializeStore().then(async (data) => {
      // Then fetch fresh data from backend
      try {
        await Promise.all([
          dispatch(fetchRecipes()).unwrap(),
          dispatch(fetchPeople()).unwrap(),
          dispatch(fetchCountries()).unwrap(),
          dispatch(fetchIngredients()).unwrap(),
          dispatch(fetchRecipeIngredients()).unwrap(),
        ]);
      } catch (error) {
        console.error('Error fetching data from backend:', error);
        // If backend fails, use persisted data if available
        // (This would require updating the store structure, but for now we'll just log)
      }
      setIsLoading(false);
    });
  }, [dispatch]);

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="recipes/[id]" options={{ title: 'Recipe' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
