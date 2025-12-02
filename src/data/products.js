/**
 * Base URLs for 3D model sources (all free/CC licensed)
 */
const GLTF_SAMPLES =
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0";
const THREEJS_EXAMPLES = "https://threejs.org/examples/models/gltf";

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
    name: "Littlest Tokyo",
    url: `${THREEJS_EXAMPLES}/LittlestTokyo.glb`,
    scale: 0.004,
  },
  soldier: {
    name: "Soldier",
    url: `${THREEJS_EXAMPLES}/Soldier.glb`,
    scale: 1.2,
  },
  robotExpressive: {
    name: "Robot Expressive",
    url: `${THREEJS_EXAMPLES}/RobotExpressive/RobotExpressive.glb`,
    scale: 0.7,
  },
  horse: { name: "Horse", url: `${THREEJS_EXAMPLES}/Horse.glb`, scale: 0.01 },
  flamingo: {
    name: "Flamingo",
    url: `${THREEJS_EXAMPLES}/Flamingo.glb`,
    scale: 0.02,
  },
  stork: { name: "Stork", url: `${THREEJS_EXAMPLES}/Stork.glb`, scale: 0.02 },
  parrot: {
    name: "Parrot",
    url: `${THREEJS_EXAMPLES}/Parrot.glb`,
    scale: 0.03,
  },
  materialsBall: {
    name: "Materials Ball",
    url: `${THREEJS_EXAMPLES}/MaterialsVariantsShoe/glTF/MaterialsVariantsShoe.gltf`,
    scale: 8,
  },
  nefertiti: {
    name: "Nefertiti",
    url: `${THREEJS_EXAMPLES}/Nefertiti/Nefertiti.glb`,
    scale: 0.04,
  },
  flower: {
    name: "Flower",
    url: `${THREEJS_EXAMPLES}/Flower/Flower.glb`,
    scale: 1,
  },

  // === KHRONOS SAMPLES (Reliable, well-tested) ===
  damagedHelmet: {
    name: "Damaged Helmet",
    url: `${GLTF_SAMPLES}/DamagedHelmet/glTF-Binary/DamagedHelmet.glb`,
    scale: 1.5,
  },
  flightHelmet: {
    name: "Flight Helmet",
    url: `${GLTF_SAMPLES}/FlightHelmet/glTF/FlightHelmet.gltf`,
    scale: 5,
  },
  fox: {
    name: "Fox",
    url: `${GLTF_SAMPLES}/Fox/glTF-Binary/Fox.glb`,
    scale: 0.02,
  },
  duck: {
    name: "Duck",
    url: `${GLTF_SAMPLES}/Duck/glTF-Binary/Duck.glb`,
    scale: 0.015,
  },
  boomBox: {
    name: "Boom Box",
    url: `${GLTF_SAMPLES}/BoomBox/glTF-Binary/BoomBox.glb`,
    scale: 80,
  },
  lantern: {
    name: "Lantern",
    url: `${GLTF_SAMPLES}/Lantern/glTF-Binary/Lantern.glb`,
    scale: 0.08,
  },
  waterBottle: {
    name: "Water Bottle",
    url: `${GLTF_SAMPLES}/WaterBottle/glTF-Binary/WaterBottle.glb`,
    scale: 8,
  },
  avocado: {
    name: "Avocado",
    url: `${GLTF_SAMPLES}/Avocado/glTF-Binary/Avocado.glb`,
    scale: 30,
  },
  toyCar: {
    name: "Toy Car",
    url: `${GLTF_SAMPLES}/ToyCar/glTF-Binary/ToyCar.glb`,
    scale: 80,
  },
  milkTruck: {
    name: "Milk Truck",
    url: `${GLTF_SAMPLES}/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb`,
    scale: 0.6,
  },
  buggy: {
    name: "Buggy",
    url: `${GLTF_SAMPLES}/Buggy/glTF-Binary/Buggy.glb`,
    scale: 0.015,
  },
  cesiumMan: {
    name: "Cesium Man",
    url: `${GLTF_SAMPLES}/CesiumMan/glTF-Binary/CesiumMan.glb`,
    scale: 1.2,
  },
};

/**
 * Available categories for filtering
 */
export const CATEGORIES = [
  "Characters",
  "Vehicles",
  "Props",
  "Architecture",
  "Nature",
  "Sci-Fi",
];

/**
 * Available file formats for filtering
 */
export const FILE_FORMATS = ["FBX", "OBJ", "GLTF", "BLEND", "MAX"];

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
    id: "cyber-warrior",
    name: "Cyber Warrior",
    price: 89,
    currency: "USD",
    description:
      "Highly detailed cyberpunk character model with modular armor pieces and multiple texture sets.",
    category: "Characters",
    rating: 4.8,
    previewColor: "linear-gradient(135deg, #4A90E2, #357ABD)",
    polyCount: 45000,
    fileFormat: ["FBX", "OBJ", "BLEND"],
    tags: ["cyberpunk", "character", "game-ready", "rigged"],
    featured: true,
    model: MODEL_LIBRARY.soldier,
  },
  {
    id: "hover-bike",
    name: "Hover Bike X-7",
    price: 129,
    currency: "USD",
    description:
      "Futuristic hover bike with animated hover effects and PBR materials.",
    category: "Vehicles",
    rating: 4.9,
    previewColor: "linear-gradient(135deg, #E94B8A, #C73E75)",
    polyCount: 32000,
    fileFormat: ["FBX", "GLTF", "MAX"],
    tags: ["vehicle", "sci-fi", "animated", "game-ready"],
    featured: true,
    model: MODEL_LIBRARY.toyCar,
  },
  {
    id: "crystal-formation",
    name: "Crystal Formation Pack",
    price: 45,
    currency: "USD",
    description:
      "Collection of 12 unique crystal formations with emission maps for magical environments.",
    category: "Nature",
    rating: 4.7,
    previewColor: "linear-gradient(135deg, #9B59B6, #8E44AD)",
    polyCount: 8500,
    fileFormat: ["FBX", "OBJ", "GLTF"],
    tags: ["nature", "fantasy", "props", "low-poly"],
    featured: false,
    model: MODEL_LIBRARY.avocado,
  },
  {
    id: "space-station",
    name: "Orbital Station Alpha",
    price: 249,
    currency: "USD",
    description:
      "Modular space station with detailed interiors, docking bays, and animated components.",
    category: "Architecture",
    rating: 5.0,
    previewColor: "linear-gradient(135deg, #1ABC9C, #16A085)",
    polyCount: 85000,
    fileFormat: ["FBX", "BLEND", "MAX"],
    tags: ["architecture", "sci-fi", "modular", "animated"],
    featured: true,
    model: MODEL_LIBRARY.littlestTokyo,
  },
  {
    id: "medieval-knight",
    name: "Medieval Knight",
    price: 75,
    currency: "USD",
    description:
      "Fully rigged medieval knight with interchangeable weapons and armor variants.",
    category: "Characters",
    rating: 4.6,
    previewColor: "linear-gradient(135deg, #E67E22, #D35400)",
    polyCount: 38000,
    fileFormat: ["FBX", "OBJ"],
    tags: ["character", "medieval", "rigged", "fantasy"],
    featured: false,
    model: MODEL_LIBRARY.horse,
  },
  {
    id: "alien-flora",
    name: "Alien Flora Bundle",
    price: 59,
    currency: "USD",
    description:
      "Exotic alien plant collection with bioluminescent materials and wind animation.",
    category: "Nature",
    rating: 4.8,
    previewColor: "linear-gradient(135deg, #27AE60, #2ECC71)",
    polyCount: 15000,
    fileFormat: ["FBX", "GLTF", "BLEND"],
    tags: ["nature", "sci-fi", "animated", "environment"],
    featured: false,
    model: MODEL_LIBRARY.flamingo,
  },
  {
    id: "mech-suit",
    name: "Industrial Mech Suit",
    price: 189,
    currency: "USD",
    description:
      "Heavy industrial mech with cockpit interior, animated joints, and damage variants.",
    category: "Vehicles",
    rating: 4.9,
    previewColor: "linear-gradient(135deg, #34495E, #2C3E50)",
    polyCount: 72000,
    fileFormat: ["FBX", "MAX", "BLEND"],
    tags: ["mech", "vehicle", "rigged", "game-ready"],
    featured: true,
    model: MODEL_LIBRARY.robotExpressive,
  },
  {
    id: "neon-props",
    name: "Neon City Props",
    price: 35,
    currency: "USD",
    description:
      "20+ cyberpunk street props including signs, vending machines, and trash elements.",
    category: "Props",
    rating: 4.5,
    previewColor: "linear-gradient(135deg, #FF6B9D, #C44569)",
    polyCount: 12000,
    fileFormat: ["FBX", "OBJ", "GLTF"],
    tags: ["props", "cyberpunk", "urban", "low-poly"],
    featured: false,
    model: MODEL_LIBRARY.boomBox,
  },
  {
    id: "sci-fi-corridor",
    name: "Sci-Fi Corridor Kit",
    price: 149,
    currency: "USD",
    description:
      "Modular corridor system with doors, panels, lighting, and damage variations.",
    category: "Architecture",
    rating: 4.7,
    previewColor: "linear-gradient(135deg, #3498DB, #2980B9)",
    polyCount: 55000,
    fileFormat: ["FBX", "GLTF", "MAX"],
    tags: ["architecture", "sci-fi", "modular", "interior"],
    featured: false,
    model: MODEL_LIBRARY.damagedHelmet,
  },
  {
    id: "robot-companion",
    name: "Robot Companion",
    price: 65,
    currency: "USD",
    description:
      "Cute robot companion with expressive animations and customizable parts.",
    category: "Characters",
    rating: 4.9,
    previewColor: "linear-gradient(135deg, #F39C12, #F1C40F)",
    polyCount: 18000,
    fileFormat: ["FBX", "BLEND", "GLTF"],
    tags: ["character", "robot", "animated", "stylized"],
    featured: true,
    model: MODEL_LIBRARY.fox,
  },
  {
    id: "ancient-temple",
    name: "Ancient Temple Ruins",
    price: 199,
    currency: "USD",
    description:
      "Detailed temple ruins with vegetation overgrowth and multiple LOD levels.",
    category: "Architecture",
    rating: 4.8,
    previewColor: "linear-gradient(135deg, #795548, #5D4037)",
    polyCount: 68000,
    fileFormat: ["FBX", "OBJ", "MAX"],
    tags: ["architecture", "ancient", "ruins", "environment"],
    featured: false,
    model: MODEL_LIBRARY.nefertiti,
  },
  {
    id: "sci-fi-weapons",
    name: "Sci-Fi Weapon Pack",
    price: 79,
    currency: "USD",
    description:
      "8 detailed sci-fi weapons with reload animations and customizable attachments.",
    category: "Props",
    rating: 4.6,
    previewColor: "linear-gradient(135deg, #607D8B, #455A64)",
    polyCount: 25000,
    fileFormat: ["FBX", "GLTF", "BLEND"],
    tags: ["props", "weapons", "sci-fi", "animated"],
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
    searchTerm = "",
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
