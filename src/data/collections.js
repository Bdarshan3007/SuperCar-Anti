/* ==========================================================================
   COLLECTIONS DATASET
   Curated vehicle categories and philosophical design manifestos
   Distinct, non-duplicated automotive imagery per category
   ========================================================================== */

import { AURA_ASSETS } from './assets.js';

export const COLLECTIONS = [
  {
    id: 'supercars',
    title: 'SUPERCARS',
    subtitle: 'The Core of Pure Combustion',
    description: 'Precision engineered mid-engine predators born for the open road and visceral driver engagement.',
    image: AURA_ASSETS.velarisX1.hero,
    count: '2 Models',
    stat: 'Sub-3.0s 0-100',
    slug: 'Supercar'
  },
  {
    id: 'hypercars',
    title: 'HYPERCARS',
    subtitle: 'Beyond Physics & Compromise',
    description: 'Billion-dollar engineering limits shattered. Megawatt powertrains, autoclaved monocoques, and 400+ km/h horizons.',
    image: AURA_ASSETS.valkyrieVision.hero,
    count: '2 Models',
    stat: '1,000+ HP',
    slug: 'Hypercar'
  },
  {
    id: 'grand-tourers',
    title: 'GRAND TOURERS',
    subtitle: 'Continental Velocity & Splendor',
    description: 'Unapologetic luxury meeting devastating cross-country speed. Hand-stitched elegance with long-legged V8 torque.',
    image: AURA_ASSETS.aureliaGT.hero,
    count: '2 Models',
    stat: 'V8 Twin-Turbo',
    slug: 'Grand Tourer'
  },
  {
    id: 'track-machines',
    title: 'TRACK MACHINES',
    subtitle: 'Forged in the Wind Tunnel',
    description: 'Aero-obsessed, lightweight apex hunters. Massive downforce wings, slick tire compounds, and stripped interiors.',
    image: AURA_ASSETS.stratosRS.hero,
    count: '2 Models',
    stat: '900+ kg Downforce',
    slug: 'Track Machine'
  },
  {
    id: 'electric-performance',
    title: 'ELECTRIC PERFORMANCE',
    subtitle: 'Silent Instantaneous Destruction',
    description: '800V silicon carbide inverters commanding sub-millisecond quad-motor torque vectoring into uncharted g-force territory.',
    image: AURA_ASSETS.solsticeEV.hero,
    count: '2 Models',
    stat: '1,350 NM Torque',
    slug: 'Electric Performance'
  }
];
