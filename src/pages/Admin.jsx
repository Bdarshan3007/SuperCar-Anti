/* ==========================================================================
   ADMIN MANAGEMENT DEMO PAGE
   Overview metrics, Fleet CRUD (Add/Edit/Delete), Test Drive Approvals, and Users
   ========================================================================== */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, 
  Calendar, 
  Users, 
  Bookmark, 
  Heart, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Search,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCars } from '../context/CarContext';
import { useFavorites } from '../context/FavoriteContext';
import { storage } from '../utils/storage';
import { formatCurrency, formatPower } from '../utils/formatters';

export default function Admin() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Route protection: unauthenticated -> /login, authenticated non-admin -> /profile
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    } else if (!isAdmin) {
      navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const { cars, addCar, updateCar, deleteCar, resetCars } = useCars();
  const { favoritesCount } = useFavorites();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'cars', 'requests', 'users'
  const [testDrives, setTestDrives] = useState(() => storage.getTestDrives());
  const [configs] = useState(() => storage.getConfigurations());

  // Prevent rendering if unauthorized or session is invalid
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  // Edit / Add Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [carForm, setCarForm] = useState({
    name: '',
    category: 'Supercar',
    horsepower: 800,
    torque: 900,
    acceleration: 2.8,
    topSpeed: 335,
    price: 450000,
    engine: '4.0L V8 Twin Turbo',
    drive: 'AWD',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1280&q=80',
    description: 'High performance racing engineering.'
  });

  // Test Drive Actions
  const handleStatusChange = (id, newStatus) => {
    const updated = storage.updateTestDriveStatus(id, newStatus);
    setTestDrives(updated);
  };

  // Car CRUD
  const handleOpenAdd = () => {
    setEditingCar(null);
    setCarForm({
      name: '',
      category: 'Supercar',
      horsepower: 800,
      torque: 900,
      acceleration: 2.8,
      topSpeed: 335,
      price: 450000,
      engine: '4.0L V8 Twin Turbo',
      drive: 'AWD',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1280&q=80',
      description: 'High performance racing engineering.'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (car) => {
    setEditingCar(car);
    setCarForm({
      name: car.name,
      category: car.category,
      horsepower: car.horsepower,
      torque: car.torque,
      acceleration: car.acceleration,
      topSpeed: car.topSpeed,
      price: car.price,
      engine: car.engine,
      drive: car.drive,
      image: car.image,
      description: car.description
    });
    setIsModalOpen(true);
  };

  const handleSaveCar = (e) => {
    e.preventDefault();
    if (!carForm.name.trim()) return;

    if (editingCar) {
      updateCar(editingCar.id, carForm);
    } else {
      addCar({
        ...carForm,
        id: carForm.name.toLowerCase().replace(/\s+/g, '-')
      });
    }
    setIsModalOpen(false);
  };

  const demoUsers = [
    { id: 'USR-01', name: 'Julian Sterling', email: 'sterling@vanguard.io', tier: 'Allocation Member #094', status: 'ACTIVE' },
    { id: 'USR-02', name: 'Elena Rostova', email: 'rostova@atelier.mc', tier: 'VIP Reserve #031', status: 'ACTIVE' },
    { id: 'USR-03', name: 'Marc Van Der Berg', email: 'marc@vanderberg.ch', tier: 'Circuit Member #108', status: 'PENDING' }
  ];

  return (
    <div style={{ paddingTop: '8rem', paddingBottom: '7rem', backgroundColor: '#06070a', minHeight: '100vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          <div>
            <div className="telemetry-badge" style={{ marginBottom: '1rem' }}>
              <span className="telemetry-dot online" />
              <span>COMMAND SYSTEM // ATELIER MANAGEMENT</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 800 }}>
              ADMINISTRATION SUITE
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--color-hairline)', padding: '0.35rem' }}>
            {[
              { id: 'overview', label: 'OVERVIEW' },
              { id: 'cars', label: `FLEET (${cars.length})` },
              { id: 'requests', label: `TEST DRIVES (${testDrives.length})` },
              { id: 'users', label: 'USERS' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.65rem 1.25rem',
                  backgroundColor: activeTab === tab.id ? 'var(--accent-red)' : 'transparent',
                  color: activeTab === tab.id ? '#ffffff' : 'var(--color-secondary)',
                  border: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            {/* Metric Tiles */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3.5rem'
            }}>
              {[
                { label: 'FLEET VEHICLES', val: cars.length, icon: Car },
                { label: 'SAVED FAVORITES', val: favoritesCount, icon: Heart },
                { label: 'CONFIGURATIONS', val: configs.length, icon: Bookmark },
                { label: 'TEST DRIVE REQUESTS', val: testDrives.length, icon: Calendar },
                { label: 'REGISTERED CLIENTS', val: demoUsers.length, icon: Users }
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <div
                    key={m.label}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--color-hairline)',
                      padding: '2rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className="label-caps" style={{ color: 'var(--color-muted)' }}>{m.label}</span>
                      <Icon size={18} style={{ color: 'var(--accent-red)' }} />
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 800, color: '#ffffff' }}>
                      {m.val.toString().padStart(2, '0')}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Summary Table of Recent Requests */}
            <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--color-hairline)', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>
                  RECENT CLIENT REQUESTS
                </h3>
                <button
                  onClick={() => setActiveTab('requests')}
                  className="btn-secondary"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.6875rem' }}
                >
                  VIEW ALL REQUESTS
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-hairline)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-muted)' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>CLIENT</th>
                      <th style={{ padding: '0.75rem 1rem' }}>MODEL</th>
                      <th style={{ padding: '0.75rem 1rem' }}>DATE</th>
                      <th style={{ padding: '0.75rem 1rem' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testDrives.slice(0, 3).map((td) => (
                      <tr key={td.id} style={{ borderBottom: '1px solid var(--color-hairline)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                        <td style={{ padding: '1rem' }}>{td.name}</td>
                        <td style={{ padding: '1rem', color: '#fff' }}>{td.modelName}</td>
                        <td style={{ padding: '1rem', color: 'var(--color-secondary)' }}>{td.date}</td>
                        <td style={{ padding: '1rem' }}>
                          <span className="telemetry-badge" style={{
                            color: td.status === 'Confirmed' ? 'var(--accent-emerald)' : 'var(--accent-gold)',
                            borderColor: td.status === 'Confirmed' ? 'var(--accent-emerald)' : 'var(--accent-gold)'
                          }}>
                            {td.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FLEET CRUD */}
        {activeTab === 'cars' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <span className="label-caps">MANAGED FLEET MATRIX</span>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={resetCars}
                  className="btn-secondary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.6875rem' }}
                >
                  <RotateCcw size={14} />
                  <span>RESET DEFAULT FLEET</span>
                </button>
                <button
                  onClick={handleOpenAdd}
                  className="btn-accent chamfer-btn"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.6875rem' }}
                >
                  <Plus size={16} />
                  <span>ADD NEW SUPERCAR</span>
                </button>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--color-hairline)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-surface-low)', borderBottom: '1px solid var(--color-hairline)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-muted)' }}>
                    <th style={{ padding: '1rem 1.5rem' }}>VEHICLE</th>
                    <th style={{ padding: '1rem 1.5rem' }}>CATEGORY</th>
                    <th style={{ padding: '1rem 1.5rem' }}>POWER</th>
                    <th style={{ padding: '1rem 1.5rem' }}>TOP SPEED</th>
                    <th style={{ padding: '1rem 1.5rem' }}>PRICE</th>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car) => (
                    <tr key={car.id} style={{ borderBottom: '1px solid var(--color-hairline)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <img src={car.image} alt={car.name} style={{ width: '60px', height: '40px', objectFit: 'cover' }} />
                          <span style={{ fontWeight: 600, color: '#fff' }}>{car.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>{car.category}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>{formatPower(car.horsepower)}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>{car.topSpeed} KM/H</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--accent-red)', fontWeight: 600 }}>{formatCurrency(car.price)}</td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.75rem' }}>
                          <button
                            onClick={() => handleOpenEdit(car)}
                            style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', cursor: 'pointer' }}
                            title="Edit vehicle"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => deleteCar(car.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer' }}
                            title="Delete vehicle"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: REQUESTS */}
        {activeTab === 'requests' && (
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--color-hairline)', padding: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              PROVING GROUND REQUEST DISPATCH
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '750px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-surface-low)', borderBottom: '1px solid var(--color-hairline)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-muted)' }}>
                    <th style={{ padding: '1rem' }}>ID</th>
                    <th style={{ padding: '1rem' }}>CLIENT</th>
                    <th style={{ padding: '1rem' }}>CONTACT</th>
                    <th style={{ padding: '1rem' }}>MODEL</th>
                    <th style={{ padding: '1rem' }}>LOCATION</th>
                    <th style={{ padding: '1rem' }}>DATE</th>
                    <th style={{ padding: '1rem' }}>STATUS</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>DECISION</th>
                  </tr>
                </thead>
                <tbody>
                  {testDrives.map((td) => (
                    <tr key={td.id} style={{ borderBottom: '1px solid var(--color-hairline)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                      <td style={{ padding: '1rem', color: 'var(--color-muted)' }}>{td.id}</td>
                      <td style={{ padding: '1rem', fontWeight: 600, color: '#fff' }}>{td.name}</td>
                      <td style={{ padding: '1rem', color: 'var(--color-secondary)' }}>
                        <div>{td.email}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--color-muted)' }}>{td.phone}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>{td.modelName}</td>
                      <td style={{ padding: '1rem', color: 'var(--color-secondary)' }}>{td.location}</td>
                      <td style={{ padding: '1rem' }}>{td.date}</td>
                      <td style={{ padding: '1rem' }}>
                        <span className="telemetry-badge" style={{
                          color: td.status === 'Confirmed' ? 'var(--accent-emerald)' : (td.status === 'Rejected' ? 'var(--accent-red)' : 'var(--accent-gold)'),
                          borderColor: td.status === 'Confirmed' ? 'var(--accent-emerald)' : (td.status === 'Rejected' ? 'var(--accent-red)' : 'var(--accent-gold)')
                        }}>
                          {td.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleStatusChange(td.id, 'Confirmed')}
                            style={{
                              background: 'rgba(16, 185, 129, 0.1)',
                              border: '1px solid var(--accent-emerald)',
                              color: 'var(--accent-emerald)',
                              padding: '0.35rem 0.65rem',
                              cursor: 'pointer',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.6875rem'
                            }}
                          >
                            APPROVE
                          </button>
                          <button
                            onClick={() => handleStatusChange(td.id, 'Rejected')}
                            style={{
                              background: 'rgba(255, 56, 71, 0.1)',
                              border: '1px solid var(--accent-red)',
                              color: 'var(--accent-red)',
                              padding: '0.35rem 0.65rem',
                              cursor: 'pointer',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.6875rem'
                            }}
                          >
                            REJECT
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: USERS */}
        {activeTab === 'users' && (
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--color-hairline)', padding: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              REGISTERED CLIENTS & COLLECTORS
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-surface-low)', borderBottom: '1px solid var(--color-hairline)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-muted)' }}>
                    <th style={{ padding: '1rem' }}>CLIENT ID</th>
                    <th style={{ padding: '1rem' }}>NAME</th>
                    <th style={{ padding: '1rem' }}>EMAIL</th>
                    <th style={{ padding: '1rem' }}>TIER</th>
                    <th style={{ padding: '1rem' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {demoUsers.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--color-hairline)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                      <td style={{ padding: '1rem', color: 'var(--color-muted)' }}>{u.id}</td>
                      <td style={{ padding: '1rem', fontWeight: 600, color: '#fff' }}>{u.name}</td>
                      <td style={{ padding: '1rem', color: 'var(--color-secondary)' }}>{u.email}</td>
                      <td style={{ padding: '1rem' }}>{u.tier}</td>
                      <td style={{ padding: '1rem' }}>
                        <span className="telemetry-badge" style={{ color: 'var(--accent-emerald)', borderColor: 'var(--accent-emerald)' }}>
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Car Add / Edit Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99995,
          backgroundColor: 'rgba(6, 7, 10, 0.9)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '620px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--color-hairline)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid var(--color-hairline)', backgroundColor: 'var(--bg-surface-low)' }}>
              <span className="label-caps">{editingCar ? 'EDIT VEHICLE TELEMETRY' : 'ADD NEW SPECIFICATION'}</span>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCar} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label-caps" style={{ display: 'block', marginBottom: '0.35rem' }}>MODEL NAME</label>
                <input
                  type="text"
                  value={carForm.name}
                  onChange={(e) => setCarForm({ ...carForm, name: e.target.value })}
                  placeholder="e.g. Stratos GT"
                  className="input-dark"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label-caps" style={{ display: 'block', marginBottom: '0.35rem' }}>CATEGORY</label>
                  <select
                    value={carForm.category}
                    onChange={(e) => setCarForm({ ...carForm, category: e.target.value })}
                    className="input-dark"
                  >
                    <option value="Supercar">Supercar</option>
                    <option value="Hypercar">Hypercar</option>
                    <option value="Grand Tourer">Grand Tourer</option>
                    <option value="Track Machine">Track Machine</option>
                    <option value="Electric Performance">Electric Performance</option>
                  </select>
                </div>
                <div>
                  <label className="label-caps" style={{ display: 'block', marginBottom: '0.35rem' }}>STARTING PRICE ($)</label>
                  <input
                    type="number"
                    value={carForm.price}
                    onChange={(e) => setCarForm({ ...carForm, price: parseInt(e.target.value, 10) || 0 })}
                    className="input-dark"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="label-caps" style={{ display: 'block', marginBottom: '0.35rem' }}>HORSEPOWER</label>
                  <input
                    type="number"
                    value={carForm.horsepower}
                    onChange={(e) => setCarForm({ ...carForm, horsepower: parseInt(e.target.value, 10) || 0 })}
                    className="input-dark"
                  />
                </div>
                <div>
                  <label className="label-caps" style={{ display: 'block', marginBottom: '0.35rem' }}>0-100 (SEC)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={carForm.acceleration}
                    onChange={(e) => setCarForm({ ...carForm, acceleration: parseFloat(e.target.value) || 0 })}
                    className="input-dark"
                  />
                </div>
                <div>
                  <label className="label-caps" style={{ display: 'block', marginBottom: '0.35rem' }}>TOP SPEED (KM/H)</label>
                  <input
                    type="number"
                    value={carForm.topSpeed}
                    onChange={(e) => setCarForm({ ...carForm, topSpeed: parseInt(e.target.value, 10) || 0 })}
                    className="input-dark"
                  />
                </div>
              </div>

              <div>
                <label className="label-caps" style={{ display: 'block', marginBottom: '0.35rem' }}>ENGINE ARCHITECTURE</label>
                <input
                  type="text"
                  value={carForm.engine}
                  onChange={(e) => setCarForm({ ...carForm, engine: e.target.value })}
                  placeholder="e.g. 4.0L Twin-Turbo Flat-Plane V8"
                  className="input-dark"
                />
              </div>

              <div>
                <label className="label-caps" style={{ display: 'block', marginBottom: '0.35rem' }}>HIGH-RES IMAGE URL</label>
                <input
                  type="url"
                  value={carForm.image}
                  onChange={(e) => setCarForm({ ...carForm, image: e.target.value })}
                  className="input-dark"
                />
              </div>

              <div>
                <label className="label-caps" style={{ display: 'block', marginBottom: '0.35rem' }}>DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={carForm.description}
                  onChange={(e) => setCarForm({ ...carForm, description: e.target.value })}
                  className="input-dark"
                  style={{ resize: 'none' }}
                />
              </div>

              <button
                type="submit"
                className="btn-accent chamfer-btn"
                style={{ width: '100%', padding: '0.875rem', marginTop: '0.5rem' }}
              >
                {editingCar ? 'COMMIT VEHICLE CHANGES' : 'CREATE SUPERCAR SPEC'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
