/* ==========================================================================
   JOURNAL / EDITORIAL DATASET
   In-depth engineering features and design studio deep-dives
   Distinct, non-duplicated technical photography & Stitch AURA cutaways
   ========================================================================== */

import { AURA_ASSETS } from './assets';

export const JOURNAL_STORIES = [
  {
    id: 'design-studio-aerodynamics',
    category: 'DESIGN ATELIER',
    date: 'OCT 2026',
    title: 'Inside the Design Studio: The Aerodynamics of Form',
    excerpt: 'How our chief aerodynamicists sculpted the Valkyrie Vision using scale smoke tunnels and computational fluid dynamics to achieve 850 kg of downforce without creating drag penalties.',
    readTime: '6 MIN READ',
    image: AURA_ASSETS.valkyrieVision.rear,
    content: `
      Speed is not merely a product of brute horsepower; it is an intimate negotiation between solid carbon composites and fluid atmosphere. Inside our advanced aerodynamic wind tunnels in Zurich, our engineering team embarked on an 18-month quest to eliminate conventional parasitic drag while multiplying high-speed ground effects.
      
      By integrating an active venturi underbody channel with automated front stall diffusers, the Valkyrie Vision remains glued to the asphalt through 280 km/h sweepers without requiring an oversized rear wing that disrupts its clean sculptural silhouette.
    `
  },
  {
    id: 'future-hybrid-supercars',
    category: 'PROPULSION',
    date: 'SEP 2026',
    title: 'The Future of Hybrid Supercars: 800V Silicon Carbide',
    excerpt: 'Examining why silicon carbide inverters and dual axial-flux motors are replacing traditional lithium packs to deliver unrelenting transient power without thermal throttling.',
    readTime: '8 MIN READ',
    image: AURA_ASSETS.valkyrieVision.powertrain,
    content: `
      The combustion engine has reached its thermodynamic pinnacle. By pairing a flat-plane crankshaft 4.0L V8 with high-efficiency axial flux electric motors, our powertrain achieves instant 0 RPM torque fills during turbo spool.
      
      The 800-volt silicon carbide architecture reduces resistance and dissipation losses by 62%, permitting continuous flat-out circuit laps without thermal power derating.
    `
  },
  {
    id: 'track-engineering-explained',
    category: 'ENGINEERING',
    date: 'AUG 2026',
    title: 'Track Engineering Explained: Magnetorheological Dynamics',
    excerpt: 'A deep exploration into synthetic iron particle suspension fluid that changes damping stiffness in 1.2 milliseconds for telepathic road contact.',
    readTime: '5 MIN READ',
    image: AURA_ASSETS.engineering.monocoque,
    content: `
      Every bump, curb strike, and lateral roll moment generates vertical energy that destabilizes tire contact patches. Our 4th-generation magnetorheological damping system incorporates high-speed accelerometers at each wheel hub.
      
      By energizing magnetic coils around the damper valves 1,000 times per second, the damping rate shifts between cloud-like compliance and rock-hard circuit stiffness instantaneously.
    `
  },
  {
    id: 'synthesizing-sound',
    category: 'ACOUSTICS',
    date: 'JUL 2026',
    title: 'Acoustic Masterwork: The Harmonics of a Flat-Plane V8',
    excerpt: 'Why the 180-degree flat-plane crankshaft produces the unmistakable European racing scream that echoes across Monaco and Le Mans.',
    readTime: '4 MIN READ',
    image: AURA_ASSETS.velarisX1.rear,
    content: `
      A cross-plane V8 produces a low-frequency muscular burble, but a flat-plane crankshaft fires evenly between cylinder banks (left, right, left, right). The result is an acoustic signature that mimics a high-strung Formula machine, singing up to an ear-piercing 9,000 RPM crescendo through equal-length inconel headers.
    `
  }
];
