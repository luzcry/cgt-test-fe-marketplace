/**
 * Base URLs for 3D model sources (all free/CC licensed)
 */
const GLTF_SAMPLES =
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0';
const THREEJS_EXAMPLES = 'https://threejs.org/examples/models/gltf';

/**
 * 3D Model library - organized by category
 * Each model has a name for display and url for loading
 *
 * Scale values normalize models to appear consistently sized (~2 units tall)
 * in the viewer. These values were determined empirically based on each model's
 * native dimensions:
 * - Values < 1: Model is natively large (e.g., architectural scenes, large animals)
 * - Values = 1: Model is already properly sized
 * - Values > 1: Model is natively small (e.g., small props, accessories)
 *
 * The wide range (0.006 to 80) reflects the diverse source model dimensions
 * from different 3D libraries and artists.
 */
export const MODEL_LIBRARY = {
  // === THREE.JS EXAMPLES (Higher quality, some animated) ===
  littlestTokyo: {
    name: 'Littlest Tokyo',
    url: `${THREEJS_EXAMPLES}/LittlestTokyo.glb`,
    scale: 0.004,
  },
  soldier: {
    name: 'Soldier',
    url: `${THREEJS_EXAMPLES}/Soldier.glb`,
    scale: 1.2,
  },
  robotExpressive: {
    name: 'Robot Expressive',
    url: `${THREEJS_EXAMPLES}/RobotExpressive/RobotExpressive.glb`,
    scale: 0.7,
  },
  horse: { name: 'Horse', url: `${THREEJS_EXAMPLES}/Horse.glb`, scale: 0.01 },
  flamingo: {
    name: 'Flamingo',
    url: `${THREEJS_EXAMPLES}/Flamingo.glb`,
    scale: 0.02,
  },
  stork: { name: 'Stork', url: `${THREEJS_EXAMPLES}/Stork.glb`, scale: 0.02 },
  parrot: {
    name: 'Parrot',
    url: `${THREEJS_EXAMPLES}/Parrot.glb`,
    scale: 0.03,
  },
  materialsBall: {
    name: 'Materials Ball',
    url: `${THREEJS_EXAMPLES}/MaterialsVariantsShoe/glTF/MaterialsVariantsShoe.gltf`,
    scale: 8,
  },
  nefertiti: {
    name: 'Nefertiti',
    url: `${THREEJS_EXAMPLES}/Nefertiti/Nefertiti.glb`,
    scale: 0.04,
  },
  flower: {
    name: 'Flower',
    url: `${THREEJS_EXAMPLES}/Flower/Flower.glb`,
    scale: 1,
  },

  // === KHRONOS SAMPLES (Reliable, well-tested) ===
  damagedHelmet: {
    name: 'Damaged Helmet',
    url: `${GLTF_SAMPLES}/DamagedHelmet/glTF-Binary/DamagedHelmet.glb`,
    scale: 1.5,
  },
  flightHelmet: {
    name: 'Flight Helmet',
    url: `${GLTF_SAMPLES}/FlightHelmet/glTF/FlightHelmet.gltf`,
    scale: 5,
  },
  fox: {
    name: 'Fox',
    url: `${GLTF_SAMPLES}/Fox/glTF-Binary/Fox.glb`,
    scale: 0.02,
  },
  duck: {
    name: 'Duck',
    url: `${GLTF_SAMPLES}/Duck/glTF-Binary/Duck.glb`,
    scale: 0.015,
  },
  boomBox: {
    name: 'Boom Box',
    url: `${GLTF_SAMPLES}/BoomBox/glTF-Binary/BoomBox.glb`,
    scale: 80,
  },
  lantern: {
    name: 'Lantern',
    url: `${GLTF_SAMPLES}/Lantern/glTF-Binary/Lantern.glb`,
    scale: 0.08,
  },
  waterBottle: {
    name: 'Water Bottle',
    url: `${GLTF_SAMPLES}/WaterBottle/glTF-Binary/WaterBottle.glb`,
    scale: 8,
  },
  avocado: {
    name: 'Avocado',
    url: `${GLTF_SAMPLES}/Avocado/glTF-Binary/Avocado.glb`,
    scale: 30,
  },
  toyCar: {
    name: 'Toy Car',
    url: `${GLTF_SAMPLES}/ToyCar/glTF-Binary/ToyCar.glb`,
    scale: 80,
  },
  milkTruck: {
    name: 'Milk Truck',
    url: `${GLTF_SAMPLES}/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb`,
    scale: 0.6,
  },
  buggy: {
    name: 'Buggy',
    url: `${GLTF_SAMPLES}/Buggy/glTF-Binary/Buggy.glb`,
    scale: 0.015,
  },
  cesiumMan: {
    name: 'Cesium Man',
    url: `${GLTF_SAMPLES}/CesiumMan/glTF-Binary/CesiumMan.glb`,
    scale: 1.2,
  },
};

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
    id: 'tactical-soldier',
    name: 'Tactical Combat Soldier',
    price: 89,
    currency: 'USD',
    description:
      'Professional military soldier 3D model with full combat gear. Game-ready rigged character perfect for FPS games, military simulations, and action cinematics.',
    category: 'Characters',
    rating: 4.8,
    previewColor: 'linear-gradient(135deg, #4A90E2, #357ABD)',
    polyCount: 45000,
    fileFormat: ['FBX', 'OBJ', 'BLEND'],
    tags: ['soldier', 'military', 'character', 'game-ready', 'rigged', 'fps'],
    featured: true,
    model: MODEL_LIBRARY.soldier,
  },
  {
    id: 'vintage-toy-car',
    name: 'Classic Toy Car Model',
    price: 49,
    currency: 'USD',
    description:
      'Charming vintage toy car with detailed PBR textures and realistic materials. Ideal for product visualization, game props, and nostalgic scene compositions.',
    category: 'Vehicles',
    rating: 4.9,
    previewColor: 'linear-gradient(135deg, #E94B8A, #C73E75)',
    polyCount: 12000,
    fileFormat: ['FBX', 'GLTF', 'MAX'],
    tags: ['toy', 'car', 'vehicle', 'vintage', 'prop', 'game-ready'],
    featured: true,
    model: MODEL_LIBRARY.toyCar,
  },
  {
    id: 'realistic-avocado',
    name: 'Photorealistic Avocado',
    price: 25,
    currency: 'USD',
    description:
      'Ultra-realistic avocado 3D model with high-resolution PBR textures. Perfect for food visualization, kitchen scenes, advertising, and culinary applications.',
    category: 'Props',
    rating: 4.7,
    previewColor: 'linear-gradient(135deg, #27AE60, #2ECC71)',
    polyCount: 8500,
    fileFormat: ['FBX', 'OBJ', 'GLTF'],
    tags: ['food', 'avocado', 'organic', 'realistic', 'kitchen', 'product-viz'],
    featured: false,
    model: MODEL_LIBRARY.avocado,
  },
  {
    id: 'japanese-city-diorama',
    name: 'Tokyo Street Diorama',
    price: 249,
    currency: 'USD',
    description:
      'Stunning Japanese cityscape diorama with intricate architectural details. Animated scene featuring traditional and modern Tokyo elements, perfect for games and cinematics.',
    category: 'Architecture',
    rating: 5.0,
    previewColor: 'linear-gradient(135deg, #1ABC9C, #16A085)',
    polyCount: 85000,
    fileFormat: ['FBX', 'BLEND', 'MAX'],
    tags: ['japan', 'tokyo', 'city', 'diorama', 'animated', 'architecture'],
    featured: true,
    model: MODEL_LIBRARY.littlestTokyo,
  },
  {
    id: 'animated-horse',
    name: 'Galloping Horse',
    price: 75,
    currency: 'USD',
    description:
      'Beautifully animated horse 3D model with realistic galloping motion. Ideal for equestrian games, historical scenes, fantasy environments, and nature documentaries.',
    category: 'Characters',
    rating: 4.6,
    previewColor: 'linear-gradient(135deg, #E67E22, #D35400)',
    polyCount: 38000,
    fileFormat: ['FBX', 'OBJ'],
    tags: ['horse', 'animal', 'animated', 'equine', 'nature', 'game-ready'],
    featured: false,
    model: MODEL_LIBRARY.horse,
  },
  {
    id: 'tropical-flamingo',
    name: 'Pink Flamingo Bird',
    price: 59,
    currency: 'USD',
    description:
      'Elegant pink flamingo with lifelike animated wing movements. Perfect for tropical environments, wildlife scenes, nature simulations, and decorative applications.',
    category: 'Nature',
    rating: 4.8,
    previewColor: 'linear-gradient(135deg, #FF6B9D, #C44569)',
    polyCount: 15000,
    fileFormat: ['FBX', 'GLTF', 'BLEND'],
    tags: ['flamingo', 'bird', 'tropical', 'wildlife', 'animated', 'nature'],
    featured: false,
    model: MODEL_LIBRARY.flamingo,
  },
  {
    id: 'expressive-robot',
    name: 'Expressive Robot Character',
    price: 129,
    currency: 'USD',
    description:
      'Adorable robot character with rich expressive animations and dynamic poses. Game-ready with multiple emotion states, perfect for mascots, games, and animated content.',
    category: 'Characters',
    rating: 4.9,
    previewColor: 'linear-gradient(135deg, #34495E, #2C3E50)',
    polyCount: 28000,
    fileFormat: ['FBX', 'MAX', 'BLEND'],
    tags: [
      'robot',
      'character',
      'animated',
      'expressive',
      'mascot',
      'game-ready',
    ],
    featured: true,
    model: MODEL_LIBRARY.robotExpressive,
  },
  {
    id: 'retro-boombox',
    name: 'Retro Boombox Speaker',
    price: 35,
    currency: 'USD',
    description:
      'Iconic 80s-style boombox with detailed controls and realistic materials. Great for retro scenes, music visualizations, urban environments, and nostalgic projects.',
    category: 'Props',
    rating: 4.5,
    previewColor: 'linear-gradient(135deg, #9B59B6, #8E44AD)',
    polyCount: 12000,
    fileFormat: ['FBX', 'OBJ', 'GLTF'],
    tags: ['boombox', 'retro', '80s', 'music', 'speaker', 'prop', 'vintage'],
    featured: false,
    model: MODEL_LIBRARY.boomBox,
  },
  {
    id: 'sci-fi-helmet',
    name: 'Damaged Sci-Fi Helmet',
    price: 89,
    currency: 'USD',
    description:
      'Battle-worn sci-fi helmet with stunning PBR damage effects and weathering. Includes scratches, dents, and wear details perfect for post-apocalyptic and military scenes.',
    category: 'Sci-Fi',
    rating: 4.7,
    previewColor: 'linear-gradient(135deg, #3498DB, #2980B9)',
    polyCount: 55000,
    fileFormat: ['FBX', 'GLTF', 'MAX'],
    tags: ['helmet', 'sci-fi', 'damaged', 'military', 'prop', 'pbr'],
    featured: false,
    model: MODEL_LIBRARY.damagedHelmet,
  },
  {
    id: 'animated-fox',
    name: 'Playful Fox Character',
    price: 65,
    currency: 'USD',
    description:
      "Charming animated fox with fluid motion and expressive personality. Perfect for wildlife games, children's content, mascot design, and nature-themed projects.",
    category: 'Characters',
    rating: 4.9,
    previewColor: 'linear-gradient(135deg, #F39C12, #F1C40F)',
    polyCount: 18000,
    fileFormat: ['FBX', 'BLEND', 'GLTF'],
    tags: ['fox', 'animal', 'animated', 'wildlife', 'character', 'stylized'],
    featured: true,
    model: MODEL_LIBRARY.fox,
  },
  {
    id: 'nefertiti-bust',
    name: 'Queen Nefertiti Bust',
    price: 149,
    currency: 'USD',
    description:
      'Museum-quality 3D scan of the iconic Egyptian Queen Nefertiti bust. Highly detailed sculpture perfect for educational content, historical visualization, and art projects.',
    category: 'Architecture',
    rating: 4.8,
    previewColor: 'linear-gradient(135deg, #795548, #5D4037)',
    polyCount: 68000,
    fileFormat: ['FBX', 'OBJ', 'MAX'],
    tags: ['nefertiti', 'egypt', 'bust', 'sculpture', 'historical', 'museum'],
    featured: false,
    model: MODEL_LIBRARY.nefertiti,
  },
  {
    id: 'vintage-lantern',
    name: 'Antique Oil Lantern',
    price: 29,
    currency: 'USD',
    description:
      'Classic antique oil lantern with intricate metalwork and glass details. Ideal for camping scenes, horror games, historical settings, and atmospheric lighting props.',
    category: 'Props',
    rating: 4.6,
    previewColor: 'linear-gradient(135deg, #607D8B, #455A64)',
    polyCount: 15000,
    fileFormat: ['FBX', 'GLTF', 'BLEND'],
    tags: ['lantern', 'antique', 'prop', 'lighting', 'vintage', 'atmospheric'],
    featured: false,
    model: MODEL_LIBRARY.lantern,
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
