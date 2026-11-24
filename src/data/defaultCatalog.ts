import { FurnitureItem, SaleRecord, ShowroomBranch, SiteMediaConfig } from '../types/furniture';

export const WHATSAPP_NUMBER = '254706276318';
export const DISPLAY_PHONE = '0706 276 318';

export const DEFAULT_FURNITURE_ITEMS: FurnitureItem[] = [
  {
    id: 'eslis-ruiru-sectional',
    slotNumber: '01',
    title: 'Ruiru L-Shaped Sectional',
    category: 'Sofas',
    priceKes: 72000,
    dimensions: '285 × 175 × 78 cm',
    material: 'Kiln-dried hardwood frame · Forest textured bouclé',
    description:
      'Deep-seated architectural L-sectional built over solid seasoned timber with high-resilience cushions and a low oiled walnut plinth.',
    imageUrl: '/src/assets/images/ruiru_sectional_sofa_1795535951225.jpg',
    inStock: true,
    featured: true,
    quantityOnHand: 6,
    updatedAt: '2026-11-24T08:00:00.000Z',
  },
  {
    id: 'eslis-savannah-chair',
    slotNumber: '02',
    title: 'Savannah Lounge Chair',
    category: 'Chairs',
    priceKes: 26500,
    dimensions: '76 × 82 × 79 cm',
    material: 'Solid East African oak · Cognac woven linen',
    description:
      'Hand-shaped curved armrests joined with traditional mortise-and-tenon timber craft, angled for unhurried afternoon reading.',
    imageUrl: '/src/assets/images/savannah_lounge_chair_1795535952457.jpg',
    inStock: true,
    featured: true,
    quantityOnHand: 11,
    updatedAt: '2026-11-24T08:00:00.000Z',
  },
  {
    id: 'eslis-wingback-bed',
    slotNumber: '03',
    title: 'Upholstered Wingback Bed',
    category: 'Bedroom',
    priceKes: 48000,
    dimensions: '180 × 205 × 126 cm (King)',
    material: 'Oatmeal Belgian linen · Solid walnut turned feet',
    description:
      'Tall vertically channeled headboard with gently wrapping wing sides, silent slatted support, and generous under-frame clearance.',
    imageUrl: '/src/assets/images/wingback_upholstered_bed_1795535952475.jpg',
    inStock: true,
    featured: true,
    quantityOnHand: 5,
    updatedAt: '2026-11-24T08:00:00.000Z',
  },
  {
    id: 'eslis-fluted-sideboard',
    slotNumber: '04',
    title: 'Fluted Timber Sideboard / TV Console',
    category: 'Storage',
    priceKes: 22500,
    dimensions: '180 × 45 × 62 cm',
    material: 'Oiled walnut veneer & solid hardwood · Brushed brass base',
    description:
      'Rounded tambour-fluted cabinet doors concealing soft-close shelving and discreet cable routing for living and dining spaces.',
    imageUrl: '/src/assets/images/fluted_timber_sideboard_1795535953586.jpg',
    inStock: true,
    featured: true,
    quantityOnHand: 9,
    updatedAt: '2026-11-24T08:00:00.000Z',
  },
];

export const DEFAULT_SITE_MEDIA: SiteMediaConfig = {
  heroImageUrl: '/src/assets/images/hero_eslis_sofa_1795535950742.jpg',
  heroTagline: 'Furniture that holds the room.',
  heroSubTagline: 'Shaped by hand. Finished by light.',
  craftSpotlightTitle: 'Ruiru L-Shaped Sectional',
  craftSpotlightMaterial: 'Kiln-dried East African hardwood · Forest bouclé',
  craftSpotlightImageUrl: '/src/assets/images/ruiru_sectional_sofa_1795535951225.jpg',
  rooms: [
    {
      id: 'room-01',
      label: 'Room 01',
      title: 'The Morning Courtyard Living Room',
      location: 'Runda · Northern Bypass',
      featuredPiece: 'Ruiru L-Shaped Sectional',
      imageUrl: '/src/assets/images/room_living_lookbook_1795536007902.jpg',
    },
    {
      id: 'room-02',
      label: 'Room 02',
      title: 'Calm Timber & Linen Sanctuary',
      location: 'Membley · Ruiru',
      featuredPiece: 'Upholstered Wingback Bed',
      imageUrl: '/src/assets/images/room_bedroom_lookbook_1795535955946.jpg',
    },
    {
      id: 'room-03',
      label: 'Room 03',
      title: 'Warm Limewash Dining & Reading Corner',
      location: 'Kamakis · Eastern Bypass',
      featuredPiece: 'Savannah Lounge Chair & Fluted Sideboard',
      imageUrl: '/src/assets/images/room_lounge_lookbook_1795535956998.jpg',
    },
  ],
};

export const DEFAULT_SALES: SaleRecord[] = [
  {
    id: 'sale-101',
    itemTitle: 'Ruiru L-Shaped Sectional',
    quantity: 2,
    totalKes: 144000,
    branch: 'Northern Bypass (near Venus Complex)',
    channel: 'Showroom',
    createdAt: '2026-11-21T14:20:00.000Z',
  },
  {
    id: 'sale-102',
    itemTitle: 'Upholstered Wingback Bed',
    quantity: 1,
    totalKes: 48000,
    branch: 'Ruiru Main Workshop',
    channel: 'WhatsApp',
    createdAt: '2026-11-22T10:15:00.000Z',
  },
  {
    id: 'sale-103',
    itemTitle: 'Savannah Lounge Chair',
    quantity: 2,
    totalKes: 53000,
    branch: 'Eastern Bypass (near Kamakis)',
    channel: 'Showroom',
    createdAt: '2026-11-23T16:40:00.000Z',
  },
];

export const ESLIS_SHOWROOMS: ShowroomBranch[] = [
  {
    id: 'ruiru',
    name: 'Ruiru Flagship & Workshop',
    landmark: 'Off Thika Superhighway, Ruiru Town',
    hours: 'Mon – Sat · 8:30 AM – 6:30 PM',
    phone: DISPLAY_PHONE,
  },
  {
    id: 'northern-bypass',
    name: 'Northern Bypass Showroom',
    landmark: 'Near Venus Complex, Northern Bypass',
    hours: 'Mon – Sun · 9:00 AM – 7:00 PM',
    phone: DISPLAY_PHONE,
  },
  {
    id: 'eastern-bypass',
    name: 'Eastern Bypass Showroom',
    landmark: 'Near Kamakis, Eastern Bypass',
    hours: 'Mon – Sun · 9:00 AM – 7:00 PM',
    phone: DISPLAY_PHONE,
  },
  {
    id: 'kahawa-wendani',
    name: 'Kahawa Wendani Gallery',
    landmark: 'Magunas / Wendani Road Frontage',
    hours: 'Mon – Sat · 9:00 AM – 6:30 PM',
    phone: DISPLAY_PHONE,
  },
];

export const MATERIAL_CARDS = [
  {
    id: 'mat-timber',
    eyebrow: '01 / Timber',
    title: 'Kiln & Air-Dried Timber',
    description:
      'Seasoned East African hardwood milled, planed, and joinery-pinned in our Ruiru workshop to resist warping across seasons.',
    imageUrl: '/src/assets/images/material_kiln_timber_1795535954102.jpg',
  },
  {
    id: 'mat-boucle',
    eyebrow: '02 / Textiles',
    title: 'Upholstery & Bouclé',
    description:
      'Heavy-rub performance bouclé, cotton-linen weaves, and velvet selected for deep tactile grain and easy Kenyan home care.',
    imageUrl: '/src/assets/images/material_boucle_fabric_1795535953900.jpg',
  },
  {
    id: 'mat-stone',
    eyebrow: '03 / Hardware & Stone',
    title: 'Lacquered & Stone Finishes',
    description:
      'Hand-rubbed matte oils, fluted timber profiling, brushed brass plinths, and honed natural stone accents.',
    imageUrl: '/src/assets/images/material_lacquer_stone_1795535954892.jpg',
  },
];

export const CUSTOMER_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Wanjiku Njoroge',
    role: 'Interior Architect · Runda',
    quote:
      'We specified the Ruiru L-Shaped Sectional for a client courtyard home off Northern Bypass. Eslis matched our timber stain within twelve days and the tailoring holds its crisp silhouette.',
  },
  {
    id: 'rev-2',
    name: 'David & Brenda Ochieng',
    role: 'Homeowners · Membley, Ruiru',
    quote:
      'Our Upholstered Wingback Bed and Fluted Console arrived exactly as displayed in the Kahawa Wendani gallery. Solid weight, zero creaks, and effortless delivery.',
  },
  {
    id: 'rev-3',
    name: 'Brian Mutua',
    role: 'Creative Director · Kilimani',
    quote:
      'Two Savannah Lounge Chairs transformed our reading corner. You feel the hand-sanded oak curve the moment you sit down.',
  },
];
