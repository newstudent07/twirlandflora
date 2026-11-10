/**
 * Centralized catalog of products and categories for Twirl & Flora
 */

export const CATEGORIES = [
  {
    id: 'keychains',
    slug: 'keychains',
    name: 'Botanical Keychains',
    badge: 'Bespoke Keepsakes',
    image: '/keychain_hero.jpg',
    description: 'Charming botanical keepsakes encased in crystal resin with delicate dried florals and pure 24K gold foil.',
  },
  {
    id: 'bouquets',
    slug: 'bouquets',
    name: 'Luxury Bouquets',
    badge: 'Hand-Tied Stems',
    image: '/bouquet_hero.jpg',
    description: 'Hand-tied, voluminous arrangements of garden roses, peonies, and seasonal botanical stems.',
  },
  {
    id: 'pot-flowers',
    slug: 'pot-flowers',
    name: 'Potted Blooms',
    badge: 'Everlasting Flora',
    image: '/pot_flower_hero.jpg',
    description: 'Everlasting potted arrangements designed to bring timeless greenery, sculpted ceramic, and warmth to any interior.',
  },
  {
    id: 'single-flowers',
    slug: 'single-flowers',
    name: 'Solitary Stems',
    badge: 'Sculptural Stems',
    image: '/single_flower_hero.jpg',
    description: 'Carefully preserved solitary stems celebrating the architectural minimalism and sculptural elegance of nature.',
  },
];

export const ALL_PRODUCTS = [
  // --- Keychains ---
  {
    id: 'keychain-1',
    name: 'The Hexagon Rose Keepsake',
    category: 'keychains',
    categoryName: 'Botanical Keychains',
    price: '₹38',
    numericPrice: 38,
    rating: '★ 5.0',
    tag: 'Bestseller',
    image: '/keychain_hero.jpg',
    description: 'Preserved blush rose petals & 24K gold leaf flakes encased in crystal-clear hexagonal eco-resin.',
    keywords: ['rose', 'keychain', 'resin', 'gold', 'hexagon', 'pink', 'keepsake', 'crystal'],
  },
  {
    id: 'keychain-2',
    name: 'Artisan Lavender Trio Keyring',
    category: 'keychains',
    categoryName: 'Botanical Keychains',
    price: '₹34',
    numericPrice: 34,
    rating: '★ 4.9',
    tag: 'Artisan Choice',
    image: '/keychain_product_2.jpg',
    description: 'French dried lavender, buttercups, and eucalyptus foliage set with brushed champagne brass clasp.',
    keywords: ['lavender', 'keychain', 'brass', 'purple', 'dried', 'keepsake', 'eucalyptus'],
  },
  {
    id: 'keychain-3',
    name: 'Golden Hour Botanical Keyring',
    category: 'keychains',
    categoryName: 'Botanical Keychains',
    price: '₹42',
    numericPrice: 42,
    rating: '★ 5.0',
    tag: 'Staff Favorite',
    image: '/keychain_hero.jpg',
    description: 'Sunset peach petals and rich gold leaf flakes crafted with an ultra-polished jewel finish.',
    keywords: ['gold', 'keychain', 'peach', 'sunset', 'petals', 'resin', 'jewel'],
  },
  {
    id: 'keychain-4',
    name: 'Petite Teardrop Flora Charm',
    category: 'keychains',
    categoryName: 'Botanical Keychains',
    price: '₹28',
    numericPrice: 28,
    rating: '★ 4.8',
    tag: 'Under ₹35',
    image: '/keychain_product_2.jpg',
    description: 'Teardrop silhouette capturing delicate yellow petals and gold leaf flecks for everyday elegance.',
    keywords: ['teardrop', 'charm', 'keychain', 'yellow', 'gold', 'under 35', 'petite'],
  },
  {
    id: 'keychain-5',
    name: 'Grand Prism Botanical Keepsake',
    category: 'keychains',
    categoryName: 'Botanical Keychains',
    price: '₹48',
    numericPrice: 48,
    rating: '★ 4.9',
    tag: 'Luxury',
    image: '/keychain_hero.jpg',
    description: 'Bespoke crystal resin silhouette featuring layered real dried botanicals and 24K gold foil.',
    keywords: ['prism', 'crystal', 'resin', 'luxury', 'gold', 'botanical', 'keepsake'],
  },
  {
    id: 'keychain-6',
    name: 'Artisan Cylindrical Botanical Bar',
    category: 'keychains',
    categoryName: 'Botanical Keychains',
    price: '₹32',
    numericPrice: 32,
    rating: '★ 4.9',
    tag: 'Signature',
    image: '/keychain_product_2.jpg',
    description: 'Slim rectangular bar encasing wild botanicals and gold leaf with heavy-duty swivel keyring.',
    keywords: ['bar', 'cylinder', 'keychain', 'swivel', 'gold', 'wildflower', 'under 35'],
  },

  // --- Bouquets ---
  {
    id: 'bouquet-1',
    name: 'The Royal Peony & Rose Symphony',
    category: 'bouquets',
    categoryName: 'Luxury Bouquets',
    price: '₹89',
    numericPrice: 89,
    rating: '★ 5.0',
    tag: 'Bestseller',
    image: '/bouquet_hero.jpg',
    description: 'Voluminous hand-tied blush peony blooms, garden roses, and silver dollar eucalyptus tied in silk.',
    keywords: ['peony', 'rose', 'bouquet', 'pink', 'silk', 'eucalyptus', 'bestseller'],
  },
  {
    id: 'bouquet-2',
    name: 'Sunset Coral Garden Gathering',
    category: 'bouquets',
    categoryName: 'Luxury Bouquets',
    price: '₹95',
    numericPrice: 95,
    rating: '★ 4.9',
    tag: 'Staff Favorite',
    image: '/hero_floral_3.jpg',
    description: 'Golden hour peach ranunculus, coral petals, and delicate seasonal wildflowers in full glory.',
    keywords: ['coral', 'ranunculus', 'bouquet', 'peach', 'wildflower', 'golden hour'],
  },
  {
    id: 'bouquet-3',
    name: 'Velvet Blanche Bridal Bouquet',
    category: 'bouquets',
    categoryName: 'Luxury Bouquets',
    price: '₹110',
    numericPrice: 110,
    rating: '★ 5.0',
    tag: 'Luxury',
    image: '/hero_floral_2.jpg',
    description: 'Opulent white ranunculus, ivory garden roses, and trailing jasmine vines for momentous occasions.',
    keywords: ['white', 'bridal', 'wedding', 'bouquet', 'ivory', 'rose', 'jasmine', 'ranunculus'],
  },
  {
    id: 'bouquet-4',
    name: 'The French Countryside Bundle',
    category: 'bouquets',
    categoryName: 'Luxury Bouquets',
    price: '₹75',
    numericPrice: 75,
    rating: '★ 4.8',
    tag: 'Under ₹80',
    image: '/product1.jpg',
    description: 'Rustic garden spray roses, dried lavender, and scented botanical stems wrapped in French parchment.',
    keywords: ['french', 'countryside', 'lavender', 'rose', 'rustic', 'parchment', 'bouquet'],
  },
  {
    id: 'bouquet-5',
    name: 'Pastel Meadow Cloud Bouquet',
    category: 'bouquets',
    categoryName: 'Luxury Bouquets',
    price: '₹68',
    numericPrice: 68,
    rating: '★ 4.9',
    tag: 'Under ₹80',
    image: '/hero_floral.jpg',
    description: 'Airy soft pink sweet peas, blush carnations, and fluffy cream hydrangeas for effortless grace.',
    keywords: ['pastel', 'hydrangea', 'carnation', 'sweet pea', 'pink', 'bouquet', 'cloud'],
  },
  {
    id: 'bouquet-6',
    name: 'Midnight Romance Botanical Wrap',
    category: 'bouquets',
    categoryName: 'Luxury Bouquets',
    price: '₹82',
    numericPrice: 82,
    rating: '★ 4.8',
    tag: 'Signature',
    image: '/product2.jpg',
    description: 'Deep berry tones, dusky garden foliage, and velvet garden roses tied with double satin.',
    keywords: ['midnight', 'romance', 'dark', 'berry', 'velvet', 'rose', 'satin', 'bouquet'],
  },

  // --- Pot Flowers ---
  {
    id: 'pot-1',
    name: 'The Fluted Cyclamen Ceramic Bowl',
    category: 'pot-flowers',
    categoryName: 'Potted Blooms',
    price: '₹65',
    numericPrice: 65,
    rating: '★ 5.0',
    tag: 'Bestseller',
    image: '/pot_flower_hero.jpg',
    description: 'Lush magenta and ivory cyclamen blooms with variegated foliage in a fluted artisan ceramic planter.',
    keywords: ['pot', 'ceramic', 'cyclamen', 'magenta', 'planter', 'bowl', 'fluted'],
  },
  {
    id: 'pot-2',
    name: 'Terracotta Garden Peony Pot',
    category: 'pot-flowers',
    categoryName: 'Potted Blooms',
    price: '₹58',
    numericPrice: 58,
    rating: '★ 4.9',
    tag: 'Artisan Choice',
    image: '/hero_floral_2.jpg',
    description: 'A charming arrangement of everlasting garden peonies and trailing ivy nestled in aged Tuscan clay.',
    keywords: ['terracotta', 'peony', 'pot', 'clay', 'tuscan', 'ivy', 'planter'],
  },
  {
    id: 'pot-3',
    name: 'Minimalist Glazed Ranunculus Planter',
    category: 'pot-flowers',
    categoryName: 'Potted Blooms',
    price: '₹72',
    numericPrice: 72,
    rating: '★ 4.9',
    tag: 'Luxury',
    image: '/product2.jpg',
    description: 'Soft ivory ranunculus stems and lush green moss set in a handcrafted ivory stoneware pot.',
    keywords: ['glazed', 'ranunculus', 'stoneware', 'pot', 'planter', 'moss', 'ivory'],
  },
  {
    id: 'pot-4',
    name: 'The Petite Botanist Herbarium Pot',
    category: 'pot-flowers',
    categoryName: 'Potted Blooms',
    price: '₹44',
    numericPrice: 44,
    rating: '★ 4.8',
    tag: 'Under ₹60',
    image: '/hero_floral_3.jpg',
    description: 'Everlasting miniature garden flora with delicate textured greenery in a textured stone vessel.',
    keywords: ['herbarium', 'stone', 'miniature', 'pot', 'planter', 'greenery'],
  },
  {
    id: 'pot-5',
    name: 'Chalk White Hydrangea Planter',
    category: 'pot-flowers',
    categoryName: 'Potted Blooms',
    price: '₹85',
    numericPrice: 85,
    rating: '★ 5.0',
    tag: 'Staff Favorite',
    image: '/hero_floral.jpg',
    description: 'Generous cloud of everlasting hydrangeas and dried foliage in an architectural fluted planter.',
    keywords: ['hydrangea', 'white', 'chalk', 'planter', 'fluted', 'pot'],
  },
  {
    id: 'pot-6',
    name: 'Artisan Moss & Wildflower Vessel',
    category: 'pot-flowers',
    categoryName: 'Potted Blooms',
    price: '₹48',
    numericPrice: 48,
    rating: '★ 4.8',
    tag: 'Signature',
    image: '/product1.jpg',
    description: 'Preserved forest moss, wild spray roses, and dried seed pods in a rustic ceramic compote.',
    keywords: ['moss', 'wildflower', 'vessel', 'ceramic', 'compote', 'pot', 'rustic'],
  },

  // --- Single Flowers ---
  {
    id: 'single-1',
    name: 'The Sculptural English Garden Rose',
    category: 'single-flowers',
    categoryName: 'Solitary Stems',
    price: '₹24',
    numericPrice: 24,
    rating: '★ 5.0',
    tag: 'Bestseller',
    image: '/single_flower_hero.jpg',
    description: 'A single, breathtaking blush rose with velvety petals and natural stem, standing in minimalist perfection.',
    keywords: ['rose', 'single', 'stem', 'sculptural', 'minimalist', 'blush', 'under 25'],
  },
  {
    id: 'single-2',
    name: 'The Velvety Peach Peony Stem',
    category: 'single-flowers',
    categoryName: 'Solitary Stems',
    price: '₹28',
    numericPrice: 28,
    rating: '★ 4.9',
    tag: 'Staff Favorite',
    image: '/product1.jpg',
    description: 'Full-bloom Japanese peony stem featuring layered ruffled petals and lush dewy green leaves.',
    keywords: ['peony', 'peach', 'single', 'stem', 'japanese', 'ruffled'],
  },
  {
    id: 'single-3',
    name: 'The Solitary White Calla Lily',
    category: 'single-flowers',
    categoryName: 'Solitary Stems',
    price: '₹22',
    numericPrice: 22,
    rating: '★ 4.8',
    tag: 'Artisan Choice',
    image: '/product2.jpg',
    description: 'Graceful architectural stem with smooth ivory trumpet petal for refined minimalist spaces.',
    keywords: ['calla lily', 'lily', 'white', 'single', 'stem', 'minimalist', 'under 25'],
  },
  {
    id: 'single-4',
    name: 'Blush Ranunculus Solitaire',
    category: 'single-flowers',
    categoryName: 'Solitary Stems',
    price: '₹18',
    numericPrice: 18,
    rating: '★ 4.9',
    tag: 'Under ₹25',
    image: '/hero_floral_2.jpg',
    description: 'Intricately layered spiral petals preserved to maintain natural softness and vibrant blush hue.',
    keywords: ['ranunculus', 'blush', 'single', 'stem', 'solitaire', 'under 25', 'pink'],
  },
  {
    id: 'single-5',
    name: 'The Imperial French Garden Dahlia',
    category: 'single-flowers',
    categoryName: 'Solitary Stems',
    price: '₹26',
    numericPrice: 26,
    rating: '★ 5.0',
    tag: 'Luxury',
    image: '/hero_floral_3.jpg',
    description: 'Striking geometric petal arrangement on a tall, slender stem for dramatic solitary vase styling.',
    keywords: ['dahlia', 'french', 'single', 'stem', 'geometric', 'petals'],
  },
  {
    id: 'single-6',
    name: 'Delicate Wild Cherry Blossom Stem',
    category: 'single-flowers',
    categoryName: 'Solitary Stems',
    price: '₹20',
    numericPrice: 20,
    rating: '★ 4.8',
    tag: 'Signature',
    image: '/hero_floral.jpg',
    description: 'Slender woody branch dotted with everlasting pale pink blossoms and gentle buds.',
    keywords: ['cherry blossom', 'branch', 'sakura', 'pink', 'single', 'stem', 'under 25'],
  },
];

/**
 * Filter products based on search term
 */
export const searchCatalog = (query) => {
  if (!query || !query.trim()) {
    return { matchingCategories: [], matchingProducts: [] };
  }

  const cleanQuery = query.trim().toLowerCase();
  const queryTokens = cleanQuery.split(/\s+/).filter(Boolean);

  // Match categories
  const matchingCategories = CATEGORIES.filter((cat) => {
    return (
      cat.name.toLowerCase().includes(cleanQuery) ||
      cat.slug.toLowerCase().includes(cleanQuery) ||
      cat.description.toLowerCase().includes(cleanQuery) ||
      queryTokens.some((token) => cat.name.toLowerCase().includes(token) || cat.slug.toLowerCase().includes(token))
    );
  });

  // Match products
  const matchingProducts = ALL_PRODUCTS.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(cleanQuery);
    const descMatch = product.description.toLowerCase().includes(cleanQuery);
    const catMatch = product.categoryName.toLowerCase().includes(cleanQuery) || product.category.toLowerCase().includes(cleanQuery);
    const tagMatch = product.tag?.toLowerCase().includes(cleanQuery);
    const keywordMatch = product.keywords?.some((kw) => kw.toLowerCase().includes(cleanQuery));

    // Also check token matches (all tokens should match something)
    const tokenMatch = queryTokens.every((token) => {
      return (
        product.name.toLowerCase().includes(token) ||
        product.description.toLowerCase().includes(token) ||
        product.categoryName.toLowerCase().includes(token) ||
        product.tag?.toLowerCase().includes(token) ||
        product.keywords?.some((kw) => kw.toLowerCase().includes(token))
      );
    });

    return nameMatch || descMatch || catMatch || tagMatch || keywordMatch || tokenMatch;
  });

  return {
    matchingCategories,
    matchingProducts,
  };
};

/**
 * Popular search recommendations
 */
export const POPULAR_SEARCH_TAGS = [
  'Peony',
  'Garden Rose',
  'Keychains',
  'Luxury Bouquets',
  'Potted Blooms',
  'Single Stems',
  '24K Gold Leaf',
  'Under ₹35',
  'Ranunculus',
  'Lavender',
];
