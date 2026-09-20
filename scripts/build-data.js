import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.join(__dirname, '..', 'public', 'assets', 'products');

const productConfigs = [
  // Cooling Fans / Mobile Coolers
  {
    id: 'piva-b2',
    folder: 'PIVA B2',
    name: 'PIVA B2 Magnetic Semiconductor Mobile Cooler',
    shortName: 'PIVA B2',
    price: 3850,
    originalPrice: 4800,
    category: 'Cooling',
    subCategory: 'Mobile Coolers',
    badge: '20W ULTRA FREEZE',
    featured: true,
    rating: 4.9,
    reviewCount: 184,
    description: 'Engineered for competitive PUBG Mobile and high-FPS gaming. The PIVA B2 features a 20W high-power semiconductor Peltier cooling engine that drops phone temperature down to freezing levels within seconds, preventing frame drops, thermal throttling, and battery degradation during intense tournament play.',
    features: [
      '20W High-Efficiency Semiconductor Peltier Cooling',
      'Aircraft-Grade Aluminum Heat Dissipation Fins',
      'Magnetic & Clip-On Dual Mounting System',
      'RGB Cyber Esports Ambient Halo Lighting',
      'Ultra-Low Noise Hydraulic Fan (<25dB) for crystal-clear voice comms',
      'Universal compatibility with iPhone, iPad & all Android smartphones'
    ],
    specs: {
      'Cooling Power': '20W Overclocked Peltier',
      'Temperature Drop': 'Up to 25°C Reduction',
      'Mounting': 'Magnetic Ring & Clamp Included',
      'Power Input': 'Type-C 5V/3A or 9V/2.2A',
      'RGB Effects': 'Cyber Neon Halo Cycle',
      'Weight': 'Lightweight 68g'
    },
    inTheBox: ['PIVA B2 Cooler Unit', 'Type-C Braided Fast Cable', 'Magnetic Adhesive Ring', 'Anti-Scratch Silicon Clamps', 'User Manual']
  },
  {
    id: 'piva-x30',
    folder: 'PIVA X30',
    name: 'PIVA X30 Dual-Engine Pro Mobile Radiator',
    shortName: 'PIVA X30',
    price: 4000,
    originalPrice: 5200,
    category: 'Cooling',
    subCategory: 'Mobile Coolers',
    badge: 'PRO TOURNAMENT GEAR',
    featured: true,
    rating: 4.9,
    reviewCount: 156,
    description: 'Built for esports athletes demanding relentless 90FPS and 120FPS stability. PIVA X30 delivers extreme cooling architecture with an enlarged cooling contact plate that covers major phone CPU and battery zones for instantaneous heat transfer.',
    features: [
      'Enlarged Semiconductor Cooling Contact Plate',
      'Aerospace-Grade Thermal Conductive Cold Plate',
      'Dual-Speed Silent Turbo Airflow System',
      'Zero-Interference Grip Design for comfortable esports grip',
      'Real-time temperature control to prevent condensation',
      'Works with all modern flagship gaming phones'
    ],
    specs: {
      'Cooling Area': '2800mm² High-Conductivity Surface',
      'Fan Speed': 'Up to 7500 RPM Silent Turbine',
      'Noise Level': 'Below 22dB (Voice Chat Friendly)',
      'Connector': 'USB Type-C Fast Input',
      'Weight': '74g Balanced Center'
    },
    inTheBox: ['PIVA X30 Radiator', 'Type-C High-Speed Cable', 'Magnetic Plate', 'Protective Film', 'Warranty Card']
  },
  {
    id: 'piva-b3',
    folder: 'PIVA B3',
    name: 'PIVA B3 Extreme Semiconductor Cooling Radiator',
    shortName: 'PIVA B3',
    price: 4350,
    originalPrice: 5600,
    category: 'Cooling',
    subCategory: 'Mobile Coolers',
    badge: 'EXTREME COOLING',
    featured: true,
    rating: 5.0,
    reviewCount: 209,
    description: 'The pinnacle of mobile thermoelectric cooling. PIVA B3 is tuned specifically for competitive Pakistani scrims and tournament heatwaves, keeping your device icy cold even during multi-hour marathon tournaments.',
    features: [
      'Next-Gen High-Density Semiconductor Cooling Core',
      'Dual-Blade High Static Pressure Airflow Turbine',
      'Instant Ice Formation in room temperature tests',
      'Matte Black Esports Finish with Cyan Accent Ring',
      'Ergonomic clip design with zero button occlusion'
    ],
    specs: {
      'Cooling Core': 'High-Efficiency Peltier Matrix',
      'RPM': '8000 RPM Max Speed',
      'Interface': 'USB Type-C',
      'Noise': '<24dB',
      'Compatibility': 'iOS & Android (Universal)'
    },
    inTheBox: ['PIVA B3 Cooling Unit', 'Heavy-Duty Type-C Cable', 'Clip Adapter', 'Documentation']
  },

  // Gaming Audio / Headphones
  {
    id: 'hyperx-cloud-kingston-2',
    folder: 'Hyperx Cloud Kingston 2',
    name: 'HyperX Cloud II Kingston Esports Gaming Headset',
    shortName: 'HyperX Cloud II Kingston',
    price: 12500,
    originalPrice: 15500,
    category: 'Gaming Audio',
    subCategory: 'Headphones',
    badge: 'LEGENDARY ESPORTS AUDIO',
    featured: true,
    rating: 5.0,
    reviewCount: 342,
    description: 'The gold standard of competitive esports audio. Trusted by international PUBG Mobile champions and PMNC winners. Features massive 53mm neodymium drivers, hardware-driven 7.1 virtual surround sound, and iconic memory foam comfort for 8+ hour tournament grinds.',
    features: [
      'Custom 53mm Neodymium Drivers for pinpoint footstep placement',
      'Hardware-Driven 7.1 Virtual Surround Sound USB Soundcard',
      'Signature HyperX 100% Memory Foam Headband & Ear Cushions',
      'Detachable Noise-Cancelling Esports Microphone (TeamSpeak & Discord Certified)',
      'Durable Aluminum Frame built to withstand intensive tournament travel',
      'Multi-Platform Compatibility: PC, PS5, Xbox, iPad, iPhone, and Android'
    ],
    specs: {
      'Driver Size': '53mm with Neodymium Magnets',
      'Frequency Response': '15Hz – 25,000 Hz',
      'Impedance': '60 Ω',
      'Audio Controls': 'Advanced USB Audio Control Box with DSP',
      'Weight with Mic': '350g',
      'Cable Length': '1m Headset + 2m USB Extension Box'
    },
    inTheBox: ['HyperX Cloud II Headset', 'Detachable Noise-Cancelling Mic', 'USB Advanced Audio Control Box', 'Velour Ear Cushions Pair', 'Leatherette Ear Cushions Pair', 'Airplane Adapter', 'Mesh Travel Pouch']
  },
  {
    id: 'hyperx-cloud-alpha-s',
    folder: 'HyperXCloud Alpha S',
    name: 'HyperX Cloud Alpha S Pro Surround Gaming Headset',
    shortName: 'HyperX Cloud Alpha S',
    price: 15000,
    originalPrice: 18500,
    category: 'Gaming Audio',
    subCategory: 'Headphones',
    badge: 'DUAL CHAMBER TECH',
    featured: true,
    rating: 4.9,
    reviewCount: 215,
    description: 'Revolutionary dual-chamber driver technology separates bass frequencies from mids and highs, giving competitive players surgical audio clarity. Custom 3-level physical bass adjustment sliders allow instant on-the-fly tuning for PUBG and COD steps.',
    features: [
      'HyperX Dual Chamber Drivers reduce audio distortion',
      'Three-Level Bass Adjustment Sliders directly on earcups',
      'Custom-Tuned HyperX 7.1 Surround Sound via USB Mixer',
      'Game and Chat Audio Balance Control on hardware audio mixer',
      'Breathable Leatherette & Extra Fabric Ear Cushions included',
      'Durable Solid Aluminum Frame with Laser-Etched Branding'
    ],
    specs: {
      'Driver Type': 'Custom 50mm Dynamic Dual Chamber',
      'Frequency Response': '13Hz – 27,000 Hz',
      'Impedance': '65 Ω',
      'Sound Pressure Level': '99dBSPL/mW at 1kHz',
      'Weight': '321g',
      'Microphone': 'Bi-directional, Noise-cancelling condenser'
    },
    inTheBox: ['HyperX Cloud Alpha S Headset', 'Detachable Microphone', 'USB Audio Control Mixer', 'Extra Fabric Ear Cushions', 'Detachable 3.5mm Cable', 'Travel Bag']
  },
  {
    id: 'hyperx-cloud-3',
    folder: 'HyperX Cloud 3',
    name: 'HyperX Cloud III Next-Gen Wired Gaming Headset',
    shortName: 'HyperX Cloud III',
    price: 16000,
    originalPrice: 19500,
    category: 'Gaming Audio',
    subCategory: 'Headphones',
    badge: 'NEXT-GEN FLAGSHIP',
    featured: true,
    rating: 5.0,
    reviewCount: 178,
    description: 'The latest evolution of the iconic Cloud headset. Engineered with re-angled 53mm drivers tuned for razor-sharp spatial awareness, an upgraded 10mm broadcast-quality noise-cancelling mic with internal mesh pop filter, and lifetime DTS Headphone:X Spatial Audio.',
    features: [
      'Re-engineered 53mm Angled Drivers for unmatched positional audio',
      'Upgraded 10mm Ultra-Clear Microphone with LED Mute Indicator',
      'Lifetime DTS Headphone:X Spatial Audio Activation',
      'Full Steel & Aluminum Core Framework for ultimate durability',
      'Plush HyperX Signature Memory Foam with Premium Soft Leatherette',
      'USB-C, USB-A, and 3.5mm Universal Connectivity'
    ],
    specs: {
      'Drivers': '53mm Angled Neodymium',
      'Audio Spatialization': 'DTS Headphone:X Spatial Audio',
      'Mic': '10mm Noise-Cancelling with Internal Mesh',
      'Controls': 'Onboard Volume Wheel & Mic Mute Button',
      'Connection': '3.5mm / USB-C / USB-A Dongle included',
      'Weight': '308g'
    },
    inTheBox: ['HyperX Cloud III Headset', 'Detachable Mic with LED indicator', 'USB-C to USB-A Adapter Dongle', 'Quick Start Guide']
  },
  {
    id: 'g-gaming-handsfree',
    folder: 'G GAMING HAND FREE',
    name: 'G Gaming Pro In-Ear Handsfree with Dual Mic',
    shortName: 'G Gaming Handsfree',
    price: 2250,
    originalPrice: 3200,
    category: 'Gaming Audio',
    subCategory: 'Handsfree',
    badge: 'BEST BUDGET CHOICE',
    featured: true,
    rating: 4.8,
    reviewCount: 260,
    description: 'Designed specifically for competitive mobile gamers on a budget. Features high-sensitivity dynamic acoustic chambers that amplify player footsteps and gunfire direction, paired with a detachable high-gain boom microphone for crystal-clear squad calls.',
    features: [
      'Dual Microphone Setup: Detachable Long Boom Mic + Inline Mic',
      'Enhanced Sub-Bass Tuning for realistic grenade explosions and footsteps',
      'Ergonomic 45-Degree Angled Shark Fin Ear Hooks for secure fit',
      'Anti-Tangle TPE Flat Ribbon Cable',
      '3.5mm Gold-Plated L-Shaped Plug for zero grip discomfort'
    ],
    specs: {
      'Driver Unit': '10mm Dynamic Driver',
      'Frequency Response': '20Hz - 20,000Hz',
      'Connector': '3.5mm L-Shape Jack',
      'Cable Length': '1.2m',
      'Microphone': 'Omnidirectional Detachable Boom + Inline'
    },
    inTheBox: ['G Gaming Handsfree', 'Detachable Boom Mic', '3 Pairs Silicone Ear Tips (S/M/L)', 'Shark Fin Ear Hooks', 'Wire Clip']
  },
  {
    id: 'hyperx-cloud-earbuds-2',
    folder: 'HyperX Cloud Earbuds 2',
    name: 'HyperX Cloud Earbuds II Mobile Gaming Earphones',
    shortName: 'HyperX Cloud Earbuds 2',
    price: 8500,
    originalPrice: 11000,
    category: 'Gaming Audio',
    subCategory: 'Earbuds',
    badge: 'PRO MOBILE AUDIO',
    featured: true,
    rating: 4.9,
    reviewCount: 195,
    description: 'Optimized for mobile gameplay and handheld consoles. With large 14.3mm drivers, redesigned comfort-fit silicone ear tips in 4 sizes, and a low-profile 90-degree audio connector, the Cloud Earbuds II are the premier choice for serious PUBG Mobile athletes who prefer lightweight in-ear audio.',
    features: [
      'Custom 14.3mm Audio Drivers tuned for mobile gaming audio',
      '4 Sizes of Redesigned Ergonomic Silicone Ear Tips included',
      'Low-Profile 90° L-Plug avoids interfering with hand grip',
      'Built-in Low-Profile Microphone with Multi-Function Button',
      'Hard Shell Protective Travel Case with Carabiner',
      'Tangle-Resistant Flat Ribbon Cable in HyperX Red'
    ],
    specs: {
      'Driver': '14.3mm Neodymium',
      'Sensitivity': '105dBSPL/mW at 1kHz',
      'Cable': '1.2m Flat Tangle-Free',
      'Mic': 'Electret Condenser Mic',
      'Plug': '3.5mm 4-Pole 90-degree Angle'
    },
    inTheBox: ['HyperX Cloud Earbuds II', '4 Pairs Redesigned Ear Tips', 'Hard Shell Carrying Case', 'Documentation']
  },
  {
    id: 'piva-s6-pro',
    folder: 'PIVA S6 PRO',
    name: 'PIVA S6 Pro High-End Esports In-Ear Gaming Earphones',
    shortName: 'PIVA S6 Pro',
    price: 9500,
    originalPrice: 12500,
    category: 'Gaming Audio',
    subCategory: 'Handsfree',
    badge: 'TOURNAMENT GRADE',
    featured: true,
    rating: 5.0,
    reviewCount: 144,
    description: 'The flagship handsfree used by tier-1 esports competitors. Engineered with military-grade titanium dynamic composite drivers that isolate audio layers, letting you separate enemy reloading, vehicle movement, and distant sniper fire with surgical accuracy.',
    features: [
      'Titanium Composite Acoustic Diaphragm for ultra-fast transient response',
      'Precision CNC Machined Acoustic Metal Chamber',
      'Hi-Res Audio Certified with enhanced spatial imaging',
      'Silver-Plated Oxygen-Free Copper (OFC) Core Cable for zero signal loss',
      'Professional Grade Noise-Isolating In-Ear Fit'
    ],
    specs: {
      'Diaphragm': 'Titanium Composite Dynamic',
      'Frequency Range': '10Hz – 40,000Hz (Hi-Res Audio)',
      'Impedance': '32 Ω',
      'Housing': 'Aviation Aluminum CNC',
      'Cable': 'Braided Silver-Plated OFC'
    },
    inTheBox: ['PIVA S6 Pro Earphones', '3 Pairs Memory Foam Tips', '3 Pairs Silicone Tips', 'Metal Storage Tin', 'Shirt Clip']
  },
  {
    id: 'piva-s6-esports-falcon',
    folder: 'Piva S6 Esports Falcon',
    name: 'PIVA S6 Esports Falcon High-Performance Handsfree',
    shortName: 'PIVA S6 Falcon',
    price: 4500,
    originalPrice: 6000,
    category: 'Gaming Audio',
    subCategory: 'Handsfree',
    badge: 'FALCON AUDIO ENGINE',
    featured: false,
    rating: 4.8,
    reviewCount: 112,
    description: 'Custom tuned for the South Asian esports meta. The Falcon series emphasizes footstep clarity in close-quarters combat while smoothing harsh high-frequency gunfire to prevent ear fatigue during long scrim blocks.',
    features: [
      'Falcon Custom Acoustic Engine for distinct audio separation',
      'Laser-Etched Falcon Esports Emblem on metal housing',
      'Dual-Cavity Sound Structure for punchy, controlled bass',
      'In-Line HD Microphone with Squad Mute Switch',
      'Reinforced Strain-Relief Joints for extended lifespan'
    ],
    specs: {
      'Driver': '11mm High-Performance Neodymium',
      'Frequency': '18Hz – 22,000Hz',
      'Plug': '3.5mm Gold-Plated Straight Plug',
      'Cable': 'Reinforced Kevlar Core 1.25m'
    },
    inTheBox: ['PIVA S6 Falcon Handsfree', 'Extra Ear Tips', 'Protective Travel Pouch', 'Warranty Card']
  },

  // Splitters / Adapters
  {
    id: 'piva-gs1-pro-type-c',
    folder: 'Piva GS1 Pro Type C',
    name: 'PIVA GS1 Pro Type-C 2-in-1 Fast Charging Audio Adapter',
    shortName: 'PIVA GS1 Pro',
    price: 5500,
    originalPrice: 7000,
    category: 'Splitters & Adapters',
    subCategory: 'Splitters & Adapters',
    badge: '60W PD CHARGE + DAC',
    featured: true,
    rating: 4.9,
    reviewCount: 198,
    description: 'Play and charge simultaneously without drop in frame rate, touch lag, or audio static. Features a 32-bit/384kHz Hi-Res digital sound chip and up to 60W Power Delivery fast charging bypass.',
    features: [
      'Up to 60W USB-PD Fast Charging Pass-Through',
      '32-bit/384kHz Realtek DAC Audio Decoding Chip',
      'Zero Static, Zero Hum, Zero Current Buzzing Sound',
      'Supports In-Line Microphone & PUBG Team Voice Chat',
      'Compact Bending Design for ergonomic finger grip'
    ],
    specs: {
      'DAC Chip': '32-bit / 384kHz High-Res Audio Decoder',
      'Charging Protocol': 'PD 3.0 / QC 3.0 up to 60W',
      'Ports': 'Type-C Audio/Data + Type-C Fast Power Input',
      'Housing': 'Anodized Aluminum Alloy',
      'Compatibility': 'iPad Pro/Air, iPhone 15/16, Samsung, ROG, Poco, Xiaomi'
    },
    inTheBox: ['PIVA GS1 Pro Adapter', 'Silicone Cable Organizer', 'User Guide']
  },
  {
    id: 'plextone-gs1-type-c',
    folder: 'Plextone GS1 Type C',
    name: 'Plextone GS1 Type-C 2-in-1 Gaming Audio & Charge Adapter',
    shortName: 'Plextone GS1 Type C',
    price: 3500,
    originalPrice: 4500,
    category: 'Splitters & Adapters',
    subCategory: 'Splitters & Adapters',
    badge: 'POPULAR CHOICE',
    featured: true,
    rating: 4.8,
    reviewCount: 230,
    description: 'The proven favorite for mobile esports grinders. Enables simultaneous fast charging and 3.5mm or Type-C headphone connectivity with zero audio delay and crystal-clear microphone communication.',
    features: [
      'Supports 27W/60W PD Fast Charging during live gameplay',
      'Custom Gaming Sound Processor with Footstep Boost',
      'Dual Port Layout: Type-C Charger + Audio Port',
      'Curved 90° plug design keeps wire away from gaming fingers',
      'Lightweight aluminum alloy case with LED charge indicator'
    ],
    specs: {
      'Power Protocol': 'PD 2.0 / 3.0 / QC',
      'Audio Resolution': '24-bit / 96kHz Lossless',
      'Cable Length': '6cm Braided Reinforced',
      'Weight': '13g'
    },
    inTheBox: ['Plextone GS1 Type-C Adapter', 'Cable Clip', 'Instruction Sheet']
  },
  {
    id: 'piva-g71',
    folder: 'Piva G71',
    name: 'PIVA G71 Ultra Gaming External Soundcard & Fast Adapter',
    shortName: 'PIVA G71 Soundcard',
    price: 11500,
    originalPrice: 14000,
    category: 'Splitters & Adapters',
    subCategory: 'Splitters & Adapters',
    badge: 'PRO ESPORTS SOUNDCARD',
    featured: true,
    rating: 5.0,
    reviewCount: 87,
    description: 'The ultimate weapon for professional esports players and mobile creators. The PIVA G71 is a studio-grade DSP external soundcard that boosts footsteps, eliminates microphone background noise, and charges your device at full speed.',
    features: [
      'Dual DSP Gaming Audio Processing Chips onboard',
      'Footstep Equalizer Mode switchable at the touch of a button',
      'Studio Noise-Reduction Algorithm for live broadcast comms',
      'Simultaneous 65W PD Fast Charging pass-through',
      'Independent Volume Controls for Game Sound and Squad Chat'
    ],
    specs: {
      'DSP': 'Dual 32-bit Studio Audio Engine',
      'Power Input': 'Up to 65W PD Pass-Through',
      'Input/Output': 'Type-C Host, Type-C Power, 3.5mm Headphone, 3.5mm Mic',
      'Controls': 'Volume Wheel, Footstep Boost Button, Mute Switch'
    },
    inTheBox: ['PIVA G71 Soundcard Hub', 'Heavy Duty Braided Type-C Link', 'Pouch', 'Manual']
  },
  {
    id: 'plextone-gs1-mark-iii',
    folder: 'Plextone GS1 Mark III',
    name: 'Plextone GS1 Mark III 3-in-1 Type-C Gaming Adapter',
    shortName: 'Plextone GS1 Mark III',
    price: 5000,
    originalPrice: 6500,
    category: 'Splitters & Adapters',
    subCategory: 'Splitters & Adapters',
    badge: '60W 3-IN-1 FAST DOCK',
    featured: false,
    rating: 4.9,
    reviewCount: 148,
    description: 'Third-generation gaming connector featuring 60W fast charge bypass, magnetic back fixation, and dual audio support (3.5mm + Type-C) for versatile squad tournaments.',
    features: [
      '60W High-Speed Fast Charging Bypass',
      'Dual Audio Interface: 3.5mm Jack + Type-C Audio Port',
      'Magnetic Back Plate snaps directly to the rear of your phone',
      'No latency, no crackle, uninterrupted squad calls',
      'Sturdy braided cord with gold-plated connectors'
    ],
    specs: {
      'Power': '60W Fast Charge PD 3.0',
      'Audio': 'Hi-Fi 24-bit/96kHz',
      'Mounting': 'Built-in Magnetic Pad',
      'Weight': '16g'
    },
    inTheBox: ['Plextone GS1 Mark III Connector', 'Magnetic Adhesive Pad', 'Manual']
  },
  {
    id: 'piva-gs3-pro',
    folder: 'Piva GS3 Pro',
    name: 'PIVA GS3 Pro Esports Soundcard & Splitter Hub',
    shortName: 'PIVA GS3 Pro',
    price: 6500,
    originalPrice: 8200,
    category: 'Splitters & Adapters',
    subCategory: 'Splitters & Adapters',
    badge: 'LIVE MONITORING',
    featured: true,
    rating: 4.9,
    reviewCount: 162,
    description: 'Engineered for tournament players who need live microphone monitoring and separate volume regulation. The PIVA GS3 Pro prevents audio dropouts during clutch tournament moments.',
    features: [
      'Built-In Hardware DSP with Real-Time Mic Sidetone Monitoring',
      '60W Power Delivery Fast Charging Pass-Through',
      'Dual Output Ports with separate impedance matching',
      'Tactile Cyber Mechanical Dial for on-the-fly volume changes',
      'Anti-interference shielded casing'
    ],
    specs: {
      'DAC': 'Hi-Res 32-bit DAC',
      'Power Delivery': '60W Maximum Bypass',
      'Controls': 'Rotary Volume Knob & Mic Kill Switch',
      'Body': 'Matte Alloy Shield'
    },
    inTheBox: ['PIVA GS3 Pro Hub', 'Type-C Connection Cable', 'Guide']
  },
  {
    id: 'piva-ds7',
    folder: 'Piva DS7',
    name: 'PIVA DS7 Flagship Dual-Engine Gaming Audio Dock',
    shortName: 'PIVA DS7 Dock',
    price: 8200,
    originalPrice: 10500,
    category: 'Splitters & Adapters',
    subCategory: 'Splitters & Adapters',
    badge: 'FLAGSHIP DOCK',
    featured: false,
    rating: 5.0,
    reviewCount: 94,
    description: 'The flagship desktop and mobile audio interface. PIVA DS7 features high-grade digital-to-analog converters, multi-band frequency control, and full compatibility with tablets and smartphones.',
    features: [
      'Audiophile-Grade DAC with 118dB Signal-to-Noise Ratio',
      'Independent Bass and Treble enhancement toggles',
      'Fast 65W charging bypass with intelligent thermal regulation',
      'Dual headset ports for duo scrims and co-op coaching',
      'Futuristic cyber glowing LED indicator'
    ],
    specs: {
      'SNR': '118dB Lossless SNR',
      'Power': '65W PD Compatible',
      'Ports': 'USB-C In, USB-C Charge, 2x 3.5mm Out',
      'Chassis': 'Aero-Grade Zinc Alloy'
    },
    inTheBox: ['PIVA DS7 Audio Dock', 'Type-C Braided Cable', 'Rubber Desk Feet', 'Manual']
  },
  {
    id: 'joyroom-type-c',
    folder: 'JOYROOM',
    name: 'JOYROOM Dual Type-C Fast Audio & Charge Splitter',
    shortName: 'JOYROOM Fast Adapter',
    price: 3100,
    originalPrice: 4200,
    category: 'Splitters & Adapters',
    subCategory: 'Splitters & Adapters',
    badge: 'COMPACT & RELIABLE',
    featured: false,
    rating: 4.8,
    reviewCount: 175,
    description: 'Sleek, ultra-durable dual Type-C adapter from JOYROOM. Allows high-resolution digital audio output while delivering fast charging speeds to keep your gaming phone topped up all day.',
    features: [
      'Dual Type-C Design (Type-C Audio + Type-C Fast Charging)',
      '60W PD Fast Charging compatible with modern flagships',
      'High-purity enameled copper core for distortion-free sound',
      'Compact 180° bending design ensures zero finger strain during matches',
      'Durable braided nylon jacket prevents bending damage'
    ],
    specs: {
      'Protocol': 'PD 60W / QC 3.0',
      'Chipset': 'Digital Hi-Fi DAC',
      'Finish': 'Space Grey Alloy + Braided Cable',
      'Weight': '11g'
    },
    inTheBox: ['JOYROOM Dual Type-C Adapter', 'User Card']
  },
  {
    id: 'belkin-audio-charge',
    folder: 'BELKIN',
    name: 'BELKIN USB-C Audio + Charge High-Fidelity Adapter',
    shortName: 'BELKIN USB-C Adapter',
    price: 1500,
    originalPrice: 2200,
    category: 'Splitters & Adapters',
    subCategory: 'Splitters & Adapters',
    badge: 'GENUINE BELKIN',
    featured: false,
    rating: 4.7,
    reviewCount: 210,
    description: 'Certified Belkin engineering delivering clean, pass-through audio and up to 60W power pass-through. Perfect for gamers and streamers who value renowned Belkin reliability and clean acoustic output.',
    features: [
      'Official Belkin Clean-Audio Architecture',
      'Up to 60W Pass-Through Power Delivery for all USB-C devices',
      'Crystal-clear 3.5mm headphone and squad mic compatibility',
      'Slim and portable profile fits in any pocket or gear case',
      'Tested to withstand over 10,000 cable bends'
    ],
    specs: {
      'Power': 'Up to 60W PD Pass-Through',
      'Audio': '3.5mm Auxiliary Output',
      'Build': 'High-Durability Flexible TPE',
      'Color': 'Clean White / Grey'
    },
    inTheBox: ['Belkin USB-C to 3.5mm + Charge Adapter', 'Safety Manual']
  },

  // Accessories / Finger Sleeves
  {
    id: 'esports-sleeves-5pack',
    folder: 'SLEEVES',
    name: 'ShopXzetio Esports Carbon-Silver Finger Sleeves (Pack of 5 Pairs)',
    shortName: 'Esports Sleeves (5 Pairs)',
    price: 2000,
    originalPrice: 2800,
    category: 'Accessories',
    subCategory: 'Finger Sleeves',
    badge: 'PACK OF 5 PAIRS (10 PCS)',
    featured: true,
    rating: 5.0,
    reviewCount: 420,
    description: 'Essential gear for high-tier mobile gamers. Crafted with 24-needle ultra-dense carbon silver conductive fiber that guarantees zero palm sweat interference, silky smooth swipe consistency, and instantaneous touch registration across all phone screens.',
    features: [
      'Ultra-Dense 24-Needle Silver Conductive Fiber Weave',
      'Zero Palm & Thumb Sweat Sensitivity Drop - 100% Consistent Glide',
      'Pack contains 5 Pairs (10 individual finger sleeves) for full squad rotation',
      'Seamless thermal fuse edges prevent fraying and slipping',
      'Ultra-thin 0.3mm breathable fabric keeps fingers cool under pressure'
    ],
    specs: {
      'Quantity': '5 Pairs (10 Pieces Total)',
      'Material': 'Conductive Silver Fiber + Spandex Elastic',
      'Thickness': '0.3mm Ultra-Thin',
      'Compatibility': 'All Capacitive Touchscreens (iPhone, iPad, Android)'
    },
    inTheBox: ['10x ShopXzetio Esports Finger Sleeves (5 Pairs)', 'Protective Storage Case']
  },

  // Fans
  {
    id: 'sogo-fan-mini',
    folder: 'SOGO FAN',
    name: 'SOGO Rechargeable High-Speed Handheld & Desk Gaming Fan',
    shortName: 'SOGO Mini Fan',
    price: 4999,
    originalPrice: 6200,
    category: 'Cooling',
    subCategory: 'Desk Fans',
    badge: 'RECHARGEABLE TURBO',
    featured: false,
    rating: 4.8,
    reviewCount: 96,
    description: 'Portable, powerful, and whisper-quiet. The SOGO Mini Fan delivers targeted cooling airflow for your hands, device, and face during long summer gaming sessions in Pakistan. Equipped with long-life rechargeable battery.',
    features: [
      'Multi-Speed High RPM Turbo Airflow Motor',
      'High-Capacity Built-In Rechargeable Lithium Battery',
      'Dual-Use: Stable Desk Stand & Handheld Ergonomic Grip',
      'Type-C Fast Charging port',
      'Ultra-Quiet Aerodynamic 5-Blade Design'
    ],
    specs: {
      'Battery Life': 'Up to 6-8 Hours Continuous',
      'Charging': 'USB Type-C',
      'Speeds': '3 Adjustable Airflow Modes',
      'Weight': '180g'
    },
    inTheBox: ['SOGO Mini Fan', 'Desk Base Stand', 'USB Charging Cable', 'User Manual']
  },
  {
    id: 'sogo-table-fan',
    folder: 'SOGO TABLE FAN',
    name: 'SOGO Oscillating Multi-Speed Table Gaming Fan',
    shortName: 'SOGO Table Fan',
    price: 5500,
    originalPrice: 7000,
    category: 'Cooling',
    subCategory: 'Desk Fans',
    badge: 'OSCILLATING DESK FAN',
    featured: false,
    rating: 4.9,
    reviewCount: 115,
    description: 'Keep your entire gaming setup cool without ambient motor noise bleeding into your gaming microphone. Features wide 90-degree automatic oscillation and strong aerodynamic airflow.',
    features: [
      'Automatic 90-Degree Horizontal Oscillation',
      'High Efficiency Low-Noise Brushless Motor (<28dB)',
      'Large Aerodynamic Blades for wide room air distribution',
      'Heavy-duty non-slip desktop stabilization base',
      'Energy efficient design with rechargeable backup'
    ],
    specs: {
      'Oscillation': '90° Wide Angle Auto-Swing',
      'Blades': '3 Large Aerodynamic Pitch Blades',
      'Noise': 'Under 28dB (Mic-Safe)',
      'Power': 'Dual AC/DC Rechargeable'
    },
    inTheBox: ['SOGO Table Fan', 'AC Power Charging Cord', 'Manual']
  },
  {
    id: 'sogo-table-fan-2',
    folder: 'SOGO TABLE FAN 2',
    name: 'SOGO Table Fan V2 High-Power Desk Fan',
    shortName: 'SOGO Table Fan V2',
    price: 6000,
    originalPrice: 7800,
    category: 'Cooling',
    subCategory: 'Desk Fans',
    badge: 'POWERFUL AIRFLOW V2',
    featured: false,
    rating: 4.9,
    reviewCount: 132,
    description: 'Upgraded version 2 of the renowned SOGO Table Fan. Features dual battery capacity, enhanced pitch fan blades for maximum wind throw, and integrated night-mode LED indicator.',
    features: [
      'Upgraded High-Torque Turbo Motor for maximum CFM airflow',
      'Dual Extended-Capacity Rechargeable Battery System',
      'Touch-sensitive 4-speed control panel',
      'Adjustable tilt angle up to 60 degrees',
      'Silent operation ideal for competitive gamers and streamers'
    ],
    specs: {
      'Speeds': '4 Precision Speed Settings',
      'Tilt': '60° Vertical Tilt Adjustment',
      'Battery': 'Enhanced Dual Lithium Cells',
      'Charge Time': '3 Hours Quick Charge'
    },
    inTheBox: ['SOGO Table Fan V2', 'Charging Cable', 'Manual']
  }
];

const finalProducts = productConfigs.map(p => {
  const folderPath = path.join(baseDir, p.folder);
  if (!fs.existsSync(folderPath)) {
    return { ...p, images: [], mainImage: '' };
  }
  const files = fs.readdirSync(folderPath).filter(f => !f.startsWith('.'));
  
  // Format clean relative path for web
  const imagePaths = files.map(file => 'assets/products/' + p.folder + '/' + file);
  
  let mainImage = imagePaths[0];
  const heroMatch = imagePaths.find(img => /hero|main|1_|front|angle_2|S1813/i.test(img));
  if (heroMatch) {
    mainImage = heroMatch;
  }

  return {
    ...p,
    images: imagePaths,
    mainImage: mainImage
  };
});

const content = `/**
 * ShopXzetio Official Product Catalog Data
 * Total Products: ${finalProducts.length}
 * Scanned from actual assets preserving formats and filenames
 */
const SHOPXZETIO_PRODUCTS = ${JSON.stringify(finalProducts, null, 2)};

if (typeof window !== 'undefined') {
  window.SHOPXZETIO_PRODUCTS = SHOPXZETIO_PRODUCTS;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SHOPXZETIO_PRODUCTS;
}
export default SHOPXZETIO_PRODUCTS;
`;

fs.writeFileSync(path.join(__dirname, '..', 'js', 'products-data.js'), content, 'utf8');
console.log(`Generated js/products-data.js with ${finalProducts.length} products successfully.`);
