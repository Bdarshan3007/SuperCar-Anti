/* ==========================================================================
   LOCALSTORAGE CENTRAL UTILITY
   Clean abstraction for demo persistence across sessions
   ========================================================================== */

const STORAGE_KEYS = {
  FAVORITES: 'supercar_favorites_v1',
  CONFIGURATIONS: 'supercar_saved_configs_v1',
  TEST_DRIVES: 'supercar_test_drives_v1',
  USER: 'supercar_user_session_v1',
  CARS: 'supercar_custom_fleet_v1',
  COMPARISON: 'supercar_compare_ids_v1'
};

export const storage = {
  // Favorites
  getFavorites: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (!data) return ['valkyrie-vision', 'velaris-x1'];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : ['valkyrie-vision', 'velaris-x1'];
    } catch {
      return ['valkyrie-vision', 'velaris-x1'];
    }
  },
  setFavorites: (favorites) => {
    try {
      const safe = Array.isArray(favorites) ? favorites : [];
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(safe));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  },
  toggleFavorite: (carId) => {
    const favs = storage.getFavorites();
    const exists = favs.includes(carId);
    const updated = exists ? favs.filter(id => id !== carId) : [...favs, carId];
    storage.setFavorites(updated);
    return updated;
  },

  // Saved Configurations
  getConfigurations: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONFIGURATIONS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  saveConfiguration: (config) => {
    const current = storage.getConfigurations();
    const newEntry = {
      id: `CFG-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...config
    };
    const updated = [newEntry, ...current];
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIGURATIONS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return newEntry;
  },
  deleteConfiguration: (configId) => {
    const current = storage.getConfigurations();
    const updated = current.filter(c => c && c.id !== configId);
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIGURATIONS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return updated;
  },

  // Test Drive Inquiries
  getTestDrives: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEST_DRIVES);
      if (!data) {
        return [
          {
            id: 'TD-901',
            name: 'Julian Sterling',
            email: 'sterling@vanguard.io',
            phone: '+41 79 123 4567',
            modelId: 'valkyrie-vision',
            modelName: 'AURA Valkyrie Vision',
            location: 'Zurich Atelier',
            date: '2026-10-18',
            status: 'Confirmed',
            notes: 'Collector allocation test drive with lead engineer'
          }
        ];
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  saveTestDrive: (inquiry) => {
    const current = storage.getTestDrives();
    const newEntry = {
      id: `TD-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      status: 'Pending',
      ...inquiry
    };
    const updated = [newEntry, ...current];
    try {
      localStorage.setItem(STORAGE_KEYS.TEST_DRIVES, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return newEntry;
  },
  updateTestDriveStatus: (id, status) => {
    const current = storage.getTestDrives();
    const updated = current.map(item => item && item.id === id ? { ...item, status } : item);
    try {
      localStorage.setItem(STORAGE_KEYS.TEST_DRIVES, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return updated;
  },

  // User Demo Session
  getUser: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.error(e);
    }
  },

  // Comparison Selection
  getComparisonIds: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPARISON);
      if (!data) return ['velaris-x1', 'nero-r'];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : ['velaris-x1', 'nero-r'];
    } catch {
      return ['velaris-x1', 'nero-r'];
    }
  },
  setComparisonIds: (ids) => {
    try {
      const safe = Array.isArray(ids) ? ids : [];
      localStorage.setItem(STORAGE_KEYS.COMPARISON, JSON.stringify(safe));
    } catch (e) {
      console.error(e);
    }
  },

  // Cars Custom Fleet (For Admin CRUD demo)
  getCustomCars: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CARS);
      if (!data) return null;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  },
  setCustomCars: (cars) => {
    try {
      const safe = Array.isArray(cars) ? cars : null;
      if (safe) {
        localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(safe));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CARS);
      }
    } catch (e) {
      console.error(e);
    }
  },

  // Persistent Deletion of Canonical Vehicles (DATA-01)
  getDeletedCanonicalIds: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DELETED_CANONICAL);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  setDeletedCanonicalIds: (ids) => {
    try {
      const safe = Array.isArray(ids) ? ids.filter(id => typeof id === 'string') : [];
      localStorage.setItem(STORAGE_KEYS.DELETED_CANONICAL, JSON.stringify(safe));
    } catch (e) {
      console.error('Storage write error (deleted canonical IDs):', e);
    }
  },
  recordDeletedCanonicalId: (id) => {
    if (!id || typeof id !== 'string') return [];
    const current = storage.getDeletedCanonicalIds();
    if (!current.includes(id)) {
      const updated = [...current, id];
      storage.setDeletedCanonicalIds(updated);
      return updated;
    }
    return current;
  },
  removeDeletedCanonicalId: (id) => {
    const current = storage.getDeletedCanonicalIds();
    const updated = current.filter(item => item !== id);
    storage.setDeletedCanonicalIds(updated);
    return updated;
  },
  clearDeletedCanonicalIds: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.DELETED_CANONICAL);
    } catch (e) {
      console.error('Storage clear error (deleted canonical IDs):', e);
    }
  },

  // Fleet Schema Version Tracking (DATA-02)
  getFleetSchemaVersion: () => {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.FLEET_SCHEMA);
      return val ? parseInt(val, 10) || 0 : 0;
    } catch {
      return 0;
    }
  },
  setFleetSchemaVersion: (version) => {
    try {
      localStorage.setItem(STORAGE_KEYS.FLEET_SCHEMA, String(version));
    } catch (e) {
      console.error('Storage write error (fleet schema version):', e);
    }
  }
};
