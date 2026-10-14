/* ==========================================================================
   FAVORITE CONTEXT
   Reactive favorites state with LocalStorage persistence
   ========================================================================== */

import React, { createContext, useContext, useState } from 'react';
import { storage } from '../utils/storage';

const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState(() => storage.getFavorites());

  const toggleFavorite = (carId) => {
    const updated = storage.toggleFavorite(carId);
    setFavorites(updated);
  };

  const isFavorite = (carId) => {
    return favorites.includes(carId);
  };

  const removeFavorite = (carId) => {
    const updated = favorites.filter(id => id !== carId);
    storage.setFavorites(updated);
    setFavorites(updated);
  };

  return (
    <FavoriteContext.Provider value={{
      favorites,
      favoritesCount: favorites.length,
      toggleFavorite,
      isFavorite,
      removeFavorite
    }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
}
