/* ==========================================================================
   CAR CONTEXT
   Global fleet state, filtering, search, and Admin CRUD operations
   ========================================================================== */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CARS } from '../data/cars';
import { storage } from '../utils/storage';

const CarContext = createContext();

// Helper to sanitize stored fleet, removing malformed items and duplicate IDs
function sanitizeFleet(fleetList) {
  if (!Array.isArray(fleetList)) return [];
  const seenIds = new Set();
  const validCars = [];
  for (const car of fleetList) {
    if (!car || typeof car !== 'object' || typeof car.id !== 'string' || !car.id.trim()) {
      continue;
    }
    const cleanId = car.id.trim();
    if (seenIds.has(cleanId)) {
      continue; // Skip duplicate ID
    }
    seenIds.add(cleanId);
    validCars.push({ ...car, id: cleanId });
  }
  return validCars;
}

// Initialization and synchronization logic (DATA-01 & DATA-02)
function initializeFleet() {
  const deletedCanonicalIds = new Set(storage.getDeletedCanonicalIds());
  const rawSaved = storage.getCustomCars();
  const canonicalIdSet = new Set(INITIAL_CARS.map(c => c.id));

  // Case 1: Fresh visitor with no stored fleet data
  if (!rawSaved || !Array.isArray(rawSaved) || rawSaved.length === 0) {
    const initial = INITIAL_CARS.filter(c => !deletedCanonicalIds.has(c.id));
    storage.setCustomCars(initial);
    storage.setFleetSchemaVersion(2);
    return initial;
  }

  // Case 2: Stored fleet data exists
  const saved = sanitizeFleet(rawSaved);
  const customCars = saved.filter(c => !canonicalIdSet.has(c.id));
  const savedCanonicalMap = new Map(
    saved.filter(c => canonicalIdSet.has(c.id)).map(c => [c.id, c])
  );

  const syncedCanonicalCars = [];
  for (const canonical of INITIAL_CARS) {
    // If explicitly marked as deleted, respect the deletion across reloads (DATA-01)
    if (deletedCanonicalIds.has(canonical.id)) {
      continue;
    }

    const savedCar = savedCanonicalMap.get(canonical.id);
    if (!savedCar) {
      // Vehicle is canonical, not in storage, and not marked as deleted -> add it
      syncedCanonicalCars.push(canonical);
    } else if (savedCar._customized === true && Array.isArray(savedCar._customizedFields)) {
      // Vehicle was customized by admin: preserve customized fields, sync latest canonical definition for the rest (DATA-02)
      const merged = { ...canonical };
      for (const field of savedCar._customizedFields) {
        if (savedCar[field] !== undefined) {
          merged[field] = savedCar[field];
        }
      }
      merged._customized = true;
      merged._customizedFields = savedCar._customizedFields;
      syncedCanonicalCars.push(merged);
    } else {
      // Vehicle is canonical and not explicitly customized -> sync latest canonical definitions (DATA-02)
      syncedCanonicalCars.push(canonical);
    }
  }

  // Preserve custom vehicles created by user alongside synchronized canonical fleet
  const mergedFleet = [...syncedCanonicalCars, ...customCars];
  storage.setCustomCars(mergedFleet);
  storage.setFleetSchemaVersion(2);
  return mergedFleet;
}

export function CarProvider({ children }) {
  const [cars, setCars] = useState(() => initializeFleet());

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'hp-desc', 'price-desc', 'accel-asc'

  useEffect(() => {
    storage.setCustomCars(cars);
  }, [cars]);

  // Admin CRUD
  const addCar = (newCar) => {
    const cleanName = (newCar.name || 'Custom Vehicle').trim();
    const baseId = newCar.id || cleanName.toLowerCase().replace(/\s+/g, '-');
    let uniqueId = baseId;
    let counter = 1;
    // Prevent ID collision with existing cars in state AND canonical fleet definitions
    while (cars.some(c => c && c.id === uniqueId) || INITIAL_CARS.some(c => c.id === uniqueId)) {
      uniqueId = `${baseId}-${counter}`;
      counter++;
    }

    const car = {
      ...newCar,
      id: uniqueId,
      gallery: newCar.gallery || [{ id: 'hero', title: 'Main View', url: newCar.image }],
      angles360: newCar.angles360 || [newCar.image],
      features: newCar.features || ['Carbon Monocoque', 'Active Aero']
    };
    setCars(prev => [car, ...prev]);
    return car;
  };

  const updateCar = (id, updatedFields) => {
    const canonicalCar = INITIAL_CARS.find(init => init.id === id);
    const isCanonical = Boolean(canonicalCar);
    setCars(prev => prev.map(c => {
      if (c.id !== id) return c;

      let customizedFields;
      if (isCanonical) {
        const existingCustomized = new Set(c._customizedFields || []);
        Object.keys(updatedFields).forEach(key => {
          if (updatedFields[key] !== canonicalCar[key]) {
            existingCustomized.add(key);
          } else {
            existingCustomized.delete(key);
          }
        });
        customizedFields = Array.from(existingCustomized);
      }

      return {
        ...c,
        ...updatedFields,
        ...(isCanonical ? { 
          _customized: customizedFields.length > 0, 
          _customizedFields: customizedFields 
        } : {})
      };
    }));
  };

  const deleteCar = (id) => {
    const isCanonical = INITIAL_CARS.some(init => init.id === id);
    if (isCanonical) {
      storage.recordDeletedCanonicalId(id);
    }
    setCars(prev => prev.filter(c => c && c.id !== id));
  };

  const resetCars = () => {
    // Clear persistent canonical deletion markers
    storage.clearDeletedCanonicalIds();
    // Preserve any user-created custom cars while restoring canonical fleet to default
    const canonicalIdSet = new Set(INITIAL_CARS.map(c => c.id));
    const customCars = cars.filter(c => c && !canonicalIdSet.has(c.id));
    const restoredFleet = [...INITIAL_CARS, ...customCars];
    setCars(restoredFleet);
    storage.setCustomCars(restoredFleet);
  };

  const getCarById = (id) => {
    return cars.find(c => c && c.id === id) || null;
  };

  // Filtered & sorted cars
  const filteredCars = cars.filter(c => {
    const matchesSearch = searchQuery === '' || 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.engine.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || 
      c.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'hp-desc') return b.horsepower - a.horsepower;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'accel-asc') return a.acceleration - b.acceleration;
    if (sortBy === 'speed-desc') return b.topSpeed - a.topSpeed;
    return 0; // featured order
  });

  return (
    <CarContext.Provider value={{
      cars,
      filteredCars,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      sortBy,
      setSortBy,
      getCarById,
      addCar,
      updateCar,
      deleteCar,
      resetCars
    }}>
      {children}
    </CarContext.Provider>
  );
}

export function useCars() {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCars must be used within a CarProvider');
  }
  return context;
}
