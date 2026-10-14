/* ==========================================================================
   SUPERCAR FLEET DATASET
   High-fidelity specifications, images, colorways, and interactive options
   Mapped cleanly to unique, verified automotive photography & Stitch AURA renders
   ========================================================================== */

import { AURA_ASSETS } from './assets.js';

export const INITIAL_CARS = [
  {
    id: 'valkyrie-vision',
    name: 'Valkyrie Vision',
    category: 'Hypercar',
    tagline: 'THE HYBRID MEGACAR MANIFESTO',
    description: 'An uncompromising aerodynamic sculpture built upon an autoclaved carbon-fiber monocoque. Combining a twin-turbocharged flat-plane V8 with dual axial flux electric propulsion for instant torque vectoring.',
    price: 1250000,
    horsepower: 1180,
    torque: 1150,
    acceleration: 2.1,
    topSpeed: 405,
    engine: '4.0L Twin-Turbo Flat-Plane V8 + Dual Axial Flux',
    transmission: '8-Speed Seamless Dual-Clutch (35ms)',
    drive: 'Torque-Vectoring AWD',
    weight: '1,320 kg (2,910 lbs)',
    powerToWeight: '894 HP / Ton',
    downforce: '850 kg @ 250 km/h',
    soundType: 'v8',
    isHero: true,
    image: AURA_ASSETS.valkyrieVision.hero,
    gallery: [
      {
        id: 'front',
        title: 'Front Lateral 3/4 Stance',
        url: AURA_ASSETS.valkyrieVision.front
      },
      {
        id: 'rear',
        title: 'Continuous Laser LED Blade & Venturi Diffuser',
        url: AURA_ASSETS.valkyrieVision.rear
      },
      {
        id: 'interior',
        title: 'Tactile Monocoque Driver Cockpit',
        url: AURA_ASSETS.valkyrieVision.cockpit
      },
      {
        id: 'powertrain',
        title: 'Exposed V8 Twin-Turbo & Inverter Architecture',
        url: AURA_ASSETS.valkyrieVision.powertrain
      }
    ],
    // Authentic coherent exterior azimuth views of the single AURA vehicle
    angles360: [
      AURA_ASSETS.valkyrieVision.front,
      AURA_ASSETS.valkyrieVision.hero,
      AURA_ASSETS.valkyrieVision.rear,
      AURA_ASSETS.valkyrieVision.rearAlt
    ],
    features: [
      'Carbon Fiber Monocoque Chassis',
      '800V Silicon Carbide Inverter Architecture',
      'Active Aerodynamic Venturi Ground-Effects',
      'Continuous Matrix Laser Headlight Blade',
      'Carbon-Ceramic Rotors with 10-Piston Calipers',
      'Magnetorheological Dynamic Dampers'
    ]
  },
  {
    id: 'velaris-x1',
    name: 'Velaris X1',
    category: 'Supercar',
    tagline: 'SCULPTED BY VELOCITY',
    description: 'The definitive track-bred predator. A relentless balance of lightweight carbon composite engineering and twin-turbocharged violence delivering 820 horsepower straight to all four wheels.',
    price: 480000,
    horsepower: 820,
    torque: 920,
    acceleration: 2.6,
    topSpeed: 340,
    engine: '4.0L V8 Twin Turbo',
    transmission: '7-Speed Dual-Clutch F1 Sequential',
    drive: 'AWD with E-Diff',
    weight: '1,380 kg (3,042 lbs)',
    powerToWeight: '594 HP / Ton',
    downforce: '640 kg @ 250 km/h',
    soundType: 'v8',
    image: AURA_ASSETS.velarisX1.hero,
    gallery: [
      {
        id: 'front',
        title: 'Velaris X1 Dynamic Track Stance',
        url: AURA_ASSETS.velarisX1.hero
      },
      {
        id: 'rear',
        title: 'Rear Wing & Titanium Quad Exhaust',
        url: AURA_ASSETS.velarisX1.rear
      },
      {
        id: 'interior',
        title: 'Alcantara Racing Cockpit',
        url: AURA_ASSETS.velarisX1.interior
      }
    ],
    angles360: [
      AURA_ASSETS.velarisX1.hero,
      AURA_ASSETS.velarisX1.rear
    ],
    features: [
      'Active Dynamic Rear Airbrake',
      'Launch Control with 4-Wheel Torque Distribution',
      'Titanium Inconel Exhaust System',
      'Carbon Bucket Seats with FIA Harness Prep',
      'Track Telemetry Logging & GPS Lap Timer'
    ]
  },
  {
    id: 'nero-r',
    name: 'Nero R',
    category: 'Hypercar',
    tagline: 'THE NATURALLY ASPIRATED PURIST',
    description: 'An ode to raw internal combustion extremity. A screaming 6.5-liter V12 revving to 9,500 RPM, augmented by lightweight hybrid supercapacitors for savage transient response.',
    price: 720000,
    horsepower: 910,
    torque: 880,
    acceleration: 2.4,
    topSpeed: 355,
    engine: '6.5L Naturally Aspirated V12 + KERS',
    transmission: '8-Speed Graziano Dual-Clutch',
    drive: 'AWD',
    weight: '1,420 kg (3,130 lbs)',
    powerToWeight: '640 HP / Ton',
    downforce: '720 kg @ 250 km/h',
    soundType: 'v12',
    image: AURA_ASSETS.neroR.hero,
    gallery: [
      {
        id: 'front',
        title: 'Nero R Dramatic Front Profile',
        url: AURA_ASSETS.neroR.hero
      },
      {
        id: 'side',
        title: 'Low Drag Monocoque Silhouette',
        url: AURA_ASSETS.neroR.side
      },
      {
        id: 'engine',
        title: 'Gold-Foil Insulated V12 Engine Bay',
        url: AURA_ASSETS.neroR.engine
      },
      {
        id: 'cockpit',
        title: 'Monocoque Driver Cockpit',
        url: AURA_ASSETS.neroR.cockpit
      }
    ],
    angles360: [
      AURA_ASSETS.neroR.hero,
      AURA_ASSETS.neroR.side
    ],
    features: [
      '9,500 RPM Naturally Aspirated V12 Redline',
      'Ultra-Fast Supercapacitor Energy Recovery',
      'Exposed Forged Carbon Aerokit',
      'Brembo CCM-R Carbon Ceramic Brake System',
      'Pirelli P-Zero Trofeo RS Bespoke Compounds'
    ]
  },
  {
    id: 'aurelia-gt',
    name: 'Aurelia GT',
    category: 'Grand Tourer',
    tagline: 'CONTINENTAL VELOCITY & LUXURY',
    description: 'Redefining the grand touring paradigm. Unrivaled long-distance comfort enveloped in hand-stitched Connolly leather, effortless twin-turbocharged acceleration, and active noise-cancelling acoustic glass.',
    price: 410000,
    horsepower: 760,
    torque: 900,
    acceleration: 2.9,
    topSpeed: 325,
    engine: '4.2L Twin Turbo V8',
    transmission: '8-Speed Quickshift Automatic',
    drive: 'RWD with Limited Slip Differential',
    weight: '1,590 kg (3,505 lbs)',
    powerToWeight: '477 HP / Ton',
    downforce: '380 kg @ 250 km/h',
    soundType: 'v8',
    image: AURA_ASSETS.aureliaGT.hero,
    gallery: [
      {
        id: 'front',
        title: 'Aurelia GT Elegant Grand Tourer Stance',
        url: AURA_ASSETS.aureliaGT.hero
      },
      {
        id: 'rear',
        title: 'Sculpted Fastback Tail & Dual Titanium Exhausts',
        url: AURA_ASSETS.aureliaGT.rear
      },
      {
        id: 'interior',
        title: 'Handcrafted Poltrona Frau Leather Interior',
        url: AURA_ASSETS.aureliaGT.interior
      }
    ],
    angles360: [
      AURA_ASSETS.aureliaGT.hero,
      AURA_ASSETS.aureliaGT.rear
    ],
    features: [
      'Active Air Suspension with Road-Scanning Cameras',
      'Handcrafted Poltrona Frau Leather Interior',
      'Naim 2,200W Spatial Surround Sound',
      'Rear-Wheel Steering for High-Speed Stability',
      'Night Vision Thermal Pedestrian Detection'
    ]
  },
  {
    id: 'stratos-rs',
    name: 'Stratos RS',
    category: 'Track Machine',
    tagline: 'PRECISION AT THE RAZOR EDGE',
    description: 'Stripped of every superfluous gram. Built for apex hunting with a rear-engine layout, twin-turbo flat-six, lightweight plexiglass, and manual aero adjustments tuned in Stuttgart wind-tunnels.',
    price: 365000,
    horsepower: 680,
    torque: 770,
    acceleration: 3.0,
    topSpeed: 310,
    engine: '3.8L Twin-Turbo Flat-6',
    transmission: '7-Speed Dual-Clutch PDK',
    drive: 'RWD Pure',
    weight: '1,280 kg (2,822 lbs)',
    powerToWeight: '531 HP / Ton',
    downforce: '910 kg @ 250 km/h',
    soundType: 'v8',
    image: AURA_ASSETS.stratosRS.hero,
    gallery: [
      {
        id: 'track',
        title: 'Stratos RS High Downforce Wing Stance',
        url: AURA_ASSETS.stratosRS.hero
      },
      {
        id: 'front',
        title: 'Aero Hood Vents & Carbon Splitter',
        url: AURA_ASSETS.stratosRS.front
      },
      {
        id: 'interior',
        title: 'Stripped Titanium Competition Cockpit',
        url: AURA_ASSETS.stratosRS.interior
      }
    ],
    angles360: [
      AURA_ASSETS.stratosRS.hero,
      AURA_ASSETS.stratosRS.front
    ],
    features: [
      'Adjustable Carbon Fiber Swan-Neck Wing',
      'Titanium Roll Cage (FIA Homologated)',
      'Hydraulic Front Axle Lift System',
      'Integrated Pneumatic Air Jacks for Pitstops',
      'Center-Lock Forged Magnesium Wheels'
    ]
  },
  {
    id: 'solstice-ev',
    name: 'Solstice EV',
    category: 'Electric Performance',
    tagline: 'THE SILENT SOUND BARRIER',
    description: 'Zero emissions, unearthly acceleration. Quad permanent-magnet axial flux motors orchestrate 1,020 HP with individual wheel torque vectoring operating at 1,000 recalculations per second.',
    price: 540000,
    horsepower: 1020,
    torque: 1350,
    acceleration: 2.2,
    topSpeed: 350,
    engine: 'Quad Axial Flux Permanent Magnet Motors',
    transmission: 'Single-Speed Direct Drive per Axle',
    drive: 'Independent Quad-Motor AWD',
    weight: '1,680 kg (3,703 lbs)',
    powerToWeight: '607 HP / Ton',
    downforce: '620 kg @ 250 km/h',
    soundType: 'v12',
    image: AURA_ASSETS.solsticeEV.hero,
    gallery: [
      {
        id: 'front',
        title: 'Solstice EV Aerodynamic Blade Silhouette',
        url: AURA_ASSETS.solsticeEV.hero
      },
      {
        id: 'interior',
        title: 'Minimalist Digital Glass Cockpit',
        url: AURA_ASSETS.solsticeEV.cockpit
      },
      {
        id: 'powertrain',
        title: 'Structural Battery Architecture & Inverters',
        url: AURA_ASSETS.solsticeEV.powertrain
      }
    ],
    angles360: [
      AURA_ASSETS.solsticeEV.hero,
      AURA_ASSETS.solsticeEV.cockpit
    ],
    features: [
      '95 kWh 800V Structural Battery Architecture',
      '350 kW DC Ultra-Fast Charging (10-80% in 14 min)',
      'Sub-Millisecond Active Torque Vectoring',
      'Active Aerodynamic Venturi Ground-Effects',
      'Carbon-Ceramic Regenerative Braking System'
    ]
  },
  {
    id: 'chimera-spyder',
    name: 'AURA Chimera Spyder',
    category: 'Supercar',
    tagline: 'OPEN-TOP KINETIC SCULPTURE',
    description: 'A roadster engineered without compromise. Dual sculpted flying buttresses channel vortex-stabilized air to an active rear diffuser, paired with a high-revving 4.0L twin-turbo flat-plane V8 delivering visceral acoustic open-air fury.',
    price: 520000,
    horsepower: 840,
    torque: 890,
    acceleration: 2.7,
    topSpeed: 335,
    engine: '4.0L Twin-Turbo Flat-Plane V8',
    transmission: '8-Speed Seamless Dual-Clutch',
    drive: 'RWD with Dynamic Torque Vectoring',
    weight: '1,360 kg (2,998 lbs)',
    powerToWeight: '618 HP / Ton',
    downforce: '580 kg @ 250 km/h',
    soundType: 'v8',
    image: AURA_ASSETS.chimeraSpyder.hero,
    gallery: [
      {
        id: 'front',
        title: 'Chimera Spyder Open-Top Stance',
        url: AURA_ASSETS.chimeraSpyder.hero
      },
      {
        id: 'rear',
        title: 'Aerodynamic Flying Buttresses & Dual Exhaust',
        url: AURA_ASSETS.chimeraSpyder.rear
      },
      {
        id: 'cockpit',
        title: 'Wind-Tunnel Sculpted Open Cockpit',
        url: AURA_ASSETS.chimeraSpyder.cockpit
      }
    ],
    angles360: [
      AURA_ASSETS.chimeraSpyder.hero,
      AURA_ASSETS.chimeraSpyder.rear
    ],
    features: [
      'Ultra-Rigid Monocoque with Integrated Roll Hoops',
      'Deployable Carbon Active Aero Wind Deflector',
      'Bespoke Inconel Open-Header Exhaust Tuning',
      'Lightweight Forged Magnesium Centerlock Wheels',
      'Adaptive Aero Ducts with Thermal Venting'
    ]
  },
  {
    id: 'spectre-sb',
    name: 'AURA Spectre SB',
    category: 'Grand Tourer',
    tagline: 'THE AVANT-GARDE SHOOTING BRAKE',
    description: 'A bold synthesis of shooting-brake architecture and hypercar proportions. Featuring an extended autoclaved carbon composite roofline, active aerodynamic tailgate, and an effortless twin-turbo V8 mild-hybrid powertrain for intercontinental voyages.',
    price: 460000,
    horsepower: 780,
    torque: 940,
    acceleration: 2.8,
    topSpeed: 330,
    engine: '4.4L Twin-Turbo V8 Mild-Hybrid',
    transmission: '8-Speed Quickshift Automatic',
    drive: 'Intelligent All-Wheel Drive',
    weight: '1,620 kg (3,571 lbs)',
    powerToWeight: '481 HP / Ton',
    downforce: '420 kg @ 250 km/h',
    soundType: 'v8',
    image: AURA_ASSETS.spectreSB.hero,
    gallery: [
      {
        id: 'front',
        title: 'Spectre SB Avant-Garde Profile',
        url: AURA_ASSETS.spectreSB.hero
      },
      {
        id: 'rear',
        title: 'Sculpted Shooting Brake Tailgate & Aero Wing',
        url: AURA_ASSETS.spectreSB.rear
      },
      {
        id: 'interior',
        title: 'Bespoke Saddle Leather Executive Cockpit',
        url: AURA_ASSETS.spectreSB.interior
      }
    ],
    angles360: [
      AURA_ASSETS.spectreSB.hero,
      AURA_ASSETS.spectreSB.rear
    ],
    features: [
      'Extended Carbon Composite Fastback Monocoque',
      'Dual-Chamber Air Suspension with Road Scanning',
      'Active Variable Roof Spoiler & Rear Venturi',
      'Hand-Stitched Italian Semi-Aniline Leather Interior',
      'Electrochromic Variable-Opacity Panoramic Glass'
    ]
  },
  {
    id: 'apex-zero',
    name: 'AURA Apex-0',
    category: 'Track Machine',
    tagline: 'PURPOSE-BUILT CIRCUIT DOMINANCE',
    description: 'A dedicated track weapon conceived for uncompromising lap times. Featuring an FIA-homologated LMP-style aerodynamic dorsal fin, high-mount swan-neck carbon fiber rear wing, and forged composite monocoque chassis tuned to generate over 1,150 kg of downforce.',
    price: 890000,
    horsepower: 960,
    torque: 980,
    acceleration: 2.3,
    topSpeed: 360,
    engine: '5.2L Naturally Aspirated V10 Race-Spec',
    transmission: '6-Speed Pneumatic Sequential Paddle Shift',
    drive: 'Rear-Wheel Drive with Mechanical Limited-Slip',
    weight: '1,180 kg (2,601 lbs)',
    powerToWeight: '814 HP / Ton',
    downforce: '1,150 kg @ 250 km/h',
    soundType: 'v12',
    image: AURA_ASSETS.apexZero.hero,
    gallery: [
      {
        id: 'front',
        title: 'Apex-0 Aggressive Track Attack Stance',
        url: AURA_ASSETS.apexZero.hero
      },
      {
        id: 'wing',
        title: 'Carbon Swan-Neck High Downforce Wing',
        url: AURA_ASSETS.apexZero.wing
      },
      {
        id: 'cockpit',
        title: 'Stripped Carbon Monocoque Telemetry Cockpit',
        url: AURA_ASSETS.apexZero.cockpit
      }
    ],
    angles360: [
      AURA_ASSETS.apexZero.hero,
      AURA_ASSETS.apexZero.wing
    ],
    features: [
      'Full Aerodynamic Le Mans Dorsal Fin Stabilizer',
      'Adjustable Dual-Element Swan-Neck Carbon Wing',
      'Onboard Pneumatic Airjack System for Pit Stops',
      'FIA-Spec Carbon Monocoque with Steel Roll Cage',
      'Motorsport Bosch MS6 ECU with 12-Stage Traction Control'
    ]
  },
  {
    id: 'pulsar-ev',
    name: 'AURA Pulsar EV',
    category: 'Electric Performance',
    tagline: 'SUB-SECOND AERODYNAMIC VECTORING',
    description: 'Pure electric hyper-performance engineered with liquid mercury aerodynamics. Quad axial-flux electric motors with liquid nitrogen stator cooling deliver 1,280 instantaneous horsepower through zero-delay telemetry and individual wheel torque vectoring.',
    price: 1100000,
    horsepower: 1280,
    torque: 1500,
    acceleration: 1.9,
    topSpeed: 412,
    engine: 'Quad Stator-Cooled Axial Flux Motors',
    transmission: 'Independent Dual-Ratio Planetary Units',
    drive: 'Vectoring All-Wheel Drive (1,000Hz Refresh)',
    weight: '1,590 kg (3,505 lbs)',
    powerToWeight: '805 HP / Ton',
    downforce: '790 kg @ 250 km/h',
    soundType: 'v12',
    image: AURA_ASSETS.pulsarEV.hero,
    gallery: [
      {
        id: 'front',
        title: 'Pulsar EV Liquid Mercury Blade Aerodynamics',
        url: AURA_ASSETS.pulsarEV.hero
      },
      {
        id: 'cockpit',
        title: 'Digital Holographic Glass Cockpit',
        url: AURA_ASSETS.pulsarEV.cockpit
      },
      {
        id: 'powertrain',
        title: 'Immersion-Cooled 800V Silicon Carbide Pack',
        url: AURA_ASSETS.pulsarEV.powertrain
      }
    ],
    angles360: [
      AURA_ASSETS.pulsarEV.hero,
      AURA_ASSETS.pulsarEV.cockpit
    ],
    features: [
      'Quad Axial Flux Motors Delivering 1,280 HP',
      'Sub-2.0s 0-100 km/h Sprint Acceleration',
      'Liquid Immersion Battery Cell Thermal System',
      'Active Aerodynamic Venturi Ground-Effects',
      'Carbon Ceramic Regenerative Dynamic Braking'
    ]
  }
];

export const CONFIGURATOR_OPTIONS = {
  colors: [
    { id: 'obsidian', name: 'Obsidian Black', hex: '#0a0c10', tint: 'rgba(0, 0, 0, 0.45)', price: 0 },
    { id: 'glacier', name: 'Glacier White', hex: '#e8edf5', tint: 'rgba(235, 240, 255, 0.25)', price: 12000 },
    { id: 'racing-red', name: 'Racing Red', hex: '#e63946', tint: 'rgba(230, 57, 70, 0.35)', price: 18000 },
    { id: 'titanium', name: 'Titanium Silver', hex: '#8e939c', tint: 'rgba(142, 147, 156, 0.3)', price: 15000 },
    { id: 'electric-blue', name: 'Electric Blue', hex: '#0066ff', tint: 'rgba(0, 102, 255, 0.35)', price: 22000 }
  ],
  wheels: [
    { id: 'performance', name: 'Performance Cast 20"', price: 0, desc: 'Forged lightweight multi-spoke' },
    { id: 'carbon', name: 'Carbon Weave 21"', price: 28000, desc: 'Ultra-rigid full carbon hollow-rims' },
    { id: 'forged', name: 'Forged Aero Blades 21"', price: 18500, desc: 'Turbine-assisted brake cooling' },
    { id: 'aero', name: 'Aero Monoblock 20"', price: 14000, desc: 'Maximum drag reduction profile' }
  ],
  interior: [
    { id: 'black-leather', name: 'Obsidian Alcantara', price: 0, desc: 'Non-reflective matte race spec' },
    { id: 'red-leather', name: 'Corsa Crimson Nappa', price: 16000, desc: 'Perforated thermal-treated leather' },
    { id: 'tan-leather', name: 'Saddle Tan Heritage', price: 14500, desc: 'Semi-aniline artisan hide' },
    { id: 'carbon', name: 'Exposed Carbon Tub', price: 24000, desc: 'Stripped lightweight competition spec' }
  ],
  packages: [
    { id: 'street', name: 'Street Comfort', price: 0, desc: 'Adaptive dampers, active noise cancellation, lifter system' },
    { id: 'track', name: 'Track Aero Pack', price: 35000, desc: 'Carbon swan-neck wing, telemetry data logger, harnesses' },
    { id: 'performance', name: 'Apex Competition', price: 65000, desc: 'Titanium roll-cage, titanium exhaust, ceramic aero ducts' }
  ]
};
