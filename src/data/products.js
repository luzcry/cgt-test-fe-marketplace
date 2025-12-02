import pictureA from '../a.jpg';
import pictureB from '../b.jpg';

/**
 * Available categories for filtering
 */
export const CATEGORIES = [
  'Characters',
  'Vehicles',
  'Props',
  'Architecture',
  'Nature',
  'Sci-Fi',
];

/**
 * Available file formats for filtering
 */
export const FILE_FORMATS = ['FBX', 'OBJ', 'GLTF', 'BLEND', 'MAX'];

/**
 * Price range bounds
 */
export const PRICE_RANGE = { min: 0, max: 500 };

/**
 * Polygon count range bounds
 */
export const POLY_COUNT_RANGE = { min: 0, max: 100000 };

/**
 * Product catalog with enhanced metadata for the marketplace
 * Each product includes filtering attributes and SEO-friendly data
 */
export const products = [
  {
    id: 'cyber-warrior',
    name: 'Cyber Warrior',
    price: 89,
    currency: 'USD',
    image: pictureA,
    description: 'Highly detailed cyberpunk character model with modular armor pieces and multiple texture sets.',
    category: 'Characters',
    rating: 4.8,
    previewColor: 'linear-gradient(135deg, #4A90E2, #357ABD)',
    polyCount: 45000,
    fileFormat: ['FBX', 'OBJ', 'BLEND'],
    tags: ['cyberpunk', 'character', 'game-ready', 'rigged'],
    featured: true,
  },
  {
    id: 'hover-bike',
    name: 'Hover Bike X-7',
    price: 129,
    currency: 'USD',
    image: pictureB,
    description: 'Futuristic hover bike with animated hover effects and PBR materials.',
    category: 'Vehicles',
    rating: 4.9,
    previewColor: 'linear-gradient(135deg, #E94B8A, #C73E75)',
    polyCount: 32000,
    fileFormat: ['FBX', 'GLTF', 'MAX'],
    tags: ['vehicle', 'sci-fi', 'animated', 'game-ready'],
    featured: true,
  },
  {
    id: 'crystal-formation',
    name: 'Crystal Formation Pack',
    price: 45,
    currency: 'USD',
    image: pictureA,
    description: 'Collection of 12 unique crystal formations with emission maps for magical environments.',
    category: 'Nature',
    rating: 4.7,
    previewColor: 'linear-gradient(135deg, #9B59B6, #8E44AD)',
    polyCount: 8500,
    fileFormat: ['FBX', 'OBJ', 'GLTF'],
    tags: ['nature', 'fantasy', 'props', 'low-poly'],
    featured: false,
  },
  {
    id: 'space-station',
    name: 'Orbital Station Alpha',
    price: 249,
    currency: 'USD',
    image: pictureB,
    description: 'Modular space station with detailed interiors, docking bays, and animated components.',
    category: 'Architecture',
    rating: 5.0,
    previewColor: 'linear-gradient(135deg, #1ABC9C, #16A085)',
    polyCount: 85000,
    fileFormat: ['FBX', 'BLEND', 'MAX'],
    tags: ['architecture', 'sci-fi', 'modular', 'animated'],
    featured: true,
  },
  {
    id: 'medieval-knight',
    name: 'Medieval Knight',
    price: 75,
    currency: 'USD',
    image: pictureA,
    description: 'Fully rigged medieval knight with interchangeable weapons and armor variants.',
    category: 'Characters',
    rating: 4.6,
    previewColor: 'linear-gradient(135deg, #E67E22, #D35400)',
    polyCount: 38000,
    fileFormat: ['FBX', 'OBJ'],
    tags: ['character', 'medieval', 'rigged', 'fantasy'],
    featured: false,
  },
  {
    id: 'alien-flora',
    name: 'Alien Flora Bundle',
    price: 59,
    currency: 'USD',
    image: pictureB,
    description: 'Exotic alien plant collection with bioluminescent materials and wind animation.',
    category: 'Nature',
    rating: 4.8,
    previewColor: 'linear-gradient(135deg, #27AE60, #2ECC71)',
    polyCount: 15000,
    fileFormat: ['FBX', 'GLTF', 'BLEND'],
    tags: ['nature', 'sci-fi', 'animated', 'environment'],
    featured: false,
  },
  {
    id: 'mech-suit',
    name: 'Industrial Mech Suit',
    price: 189,
    currency: 'USD',
    image: pictureA,
    description: 'Heavy industrial mech with cockpit interior, animated joints, and damage variants.',
    category: 'Vehicles',
    rating: 4.9,
    previewColor: 'linear-gradient(135deg, #34495E, #2C3E50)',
    polyCount: 72000,
    fileFormat: ['FBX', 'MAX', 'BLEND'],
    tags: ['mech', 'vehicle', 'rigged', 'game-ready'],
    featured: true,
  },
  {
    id: 'neon-props',
    name: 'Neon City Props',
    price: 35,
    currency: 'USD',
    image: pictureB,
    description: '20+ cyberpunk street props including signs, vending machines, and trash elements.',
    category: 'Props',
    rating: 4.5,
    previewColor: 'linear-gradient(135deg, #FF6B9D, #C44569)',
    polyCount: 12000,
    fileFormat: ['FBX', 'OBJ', 'GLTF'],
    tags: ['props', 'cyberpunk', 'urban', 'low-poly'],
    featured: false,
  },
  {
    id: 'sci-fi-corridor',
    name: 'Sci-Fi Corridor Kit',
    price: 149,
    currency: 'USD',
    image: pictureA,
    description: 'Modular corridor system with doors, panels, lighting, and damage variations.',
    category: 'Architecture',
    rating: 4.7,
    previewColor: 'linear-gradient(135deg, #3498DB, #2980B9)',
    polyCount: 55000,
    fileFormat: ['FBX', 'GLTF', 'MAX'],
    tags: ['architecture', 'sci-fi', 'modular', 'interior'],
    featured: false,
  },
  {
    id: 'robot-companion',
    name: 'Robot Companion',
    price: 65,
    currency: 'USD',
    image: pictureB,
    description: 'Cute robot companion with expressive animations and customizable parts.',
    category: 'Characters',
    rating: 4.9,
    previewColor: 'linear-gradient(135deg, #F39C12, #F1C40F)',
    polyCount: 18000,
    fileFormat: ['FBX', 'BLEND', 'GLTF'],
    tags: ['character', 'robot', 'animated', 'stylized'],
    featured: true,
  },
  {
    id: 'ancient-temple',
    name: 'Ancient Temple Ruins',
    price: 199,
    currency: 'USD',
    image: pictureA,
    description: 'Detailed temple ruins with vegetation overgrowth and multiple LOD levels.',
    category: 'Architecture',
    rating: 4.8,
    previewColor: 'linear-gradient(135deg, #795548, #5D4037)',
    polyCount: 68000,
    fileFormat: ['FBX', 'OBJ', 'MAX'],
    tags: ['architecture', 'ancient', 'ruins', 'environment'],
    featured: false,
  },
  {
    id: 'sci-fi-weapons',
    name: 'Sci-Fi Weapon Pack',
    price: 79,
    currency: 'USD',
    image: pictureB,
    description: '8 detailed sci-fi weapons with reload animations and customizable attachments.',
    category: 'Props',
    rating: 4.6,
    previewColor: 'linear-gradient(135deg, #607D8B, #455A64)',
    polyCount: 25000,
    fileFormat: ['FBX', 'GLTF', 'BLEND'],
    tags: ['props', 'weapons', 'sci-fi', 'animated'],
    featured: false,
  },
];

/**
 * Find a product by its ID
 * @param {string} id - The product ID to search for
 * @returns {Object|undefined} The product object or undefined if not found
 */
export const getProductById = (id) => {
  return products.find((product) => product.id === id);
};

/**
 * Get unique categories from products
 * @returns {string[]} Array of unique category names
 */
export const getCategories = () => {
  return [...new Set(products.map((product) => product.category))];
};

/**
 * Get all unique file formats from products
 * @returns {string[]} Array of unique file format names
 */
export const getFileFormats = () => {
  return [...new Set(products.flatMap((product) => product.fileFormat))];
};

/**
 * Get featured products
 * @returns {Object[]} Array of featured products
 */
export const getFeaturedProducts = () => {
  return products.filter((product) => product.featured);
};

/**
 * Filter products based on criteria
 * @param {Object} filters - Filter criteria
 * @returns {Object[]} Filtered products array
 */
export const filterProducts = (filters = {}) => {
  const {
    searchTerm = '',
    categories = [],
    priceRange = [PRICE_RANGE.min, PRICE_RANGE.max],
    polyCountRange = [POLY_COUNT_RANGE.min, POLY_COUNT_RANGE.max],
    fileFormats = [],
  } = filters;

  return products.filter((product) => {
    // Search filter
    const matchesSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Category filter
    const matchesCategory =
      categories.length === 0 || categories.includes(product.category);

    // Price filter
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    // Polygon count filter
    const matchesPolyCount =
      product.polyCount >= polyCountRange[0] &&
      product.polyCount <= polyCountRange[1];

    // File format filter
    const matchesFormat =
      fileFormats.length === 0 ||
      product.fileFormat.some((format) => fileFormats.includes(format));

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice &&
      matchesPolyCount &&
      matchesFormat
    );
  });
};
