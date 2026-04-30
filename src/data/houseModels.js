export const KNOWN_MODELS = {
  grayson: 'grayson',
}

export const graysonModel = {
  id: 'grayson',
  name: 'The Grayson',
  builder: 'Mattamy Homes',
  community: 'Wildflowers',
  city: 'Kitchener, ON',
  elevation: 'Traditional — Elevation A',

  specs: {
    sqft: 2282,
    beds: 4,
    baths: 3,
    halfBaths: 1,
    storeys: 2,
    garage: 2,
    priceRange: '$749,990 – $819,990 CAD',
  },

  // Default lot (overridable by user)
  defaultLot: { width: 33.9, depth: 142.9 },

  // House dimensions (feet — 1 unit = 1 ft in Three.js)
  house: {
    width: 26,
    depth: 47,
    floor1H: 9,
    floor2H: 9,
    roofPeak: 7,          // rise above 2nd floor top
    overhang: 1.5,        // roof overhang
    garageW: 18,          // width of integrated garage
    garageD: 21,          // garage depth (from front face)
    garageH: 8.5,
    porchW: 9,
    porchD: 5,
    porchH: 9.5,          // porch roof height from ground
  },

  // Rooms used in interior walkthrough
  rooms: [
    {
      id: 'great-room',
      name: 'Great Room',
      icon: '🛋️',
      floor: 1,
      w: 15, d: 16, h: 9,
      floorColor: '#C8A882',   // warm oak
      wallColor: '#F0EBE0',
      ceilingColor: '#FAFAF8',
      accentWall: '#D4C4A8',
      furniture: 'living',
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      icon: '🍳',
      floor: 1,
      w: 14, d: 16, h: 9,
      floorColor: '#C8A882',
      wallColor: '#F0EBE0',
      ceilingColor: '#FAFAF8',
      accentWall: '#E8DDD0',
      furniture: 'kitchen',
    },
    {
      id: 'dining',
      name: 'Dining Room',
      icon: '🍽️',
      floor: 1,
      w: 12, d: 13, h: 9,
      floorColor: '#C8A882',
      wallColor: '#F0EBE0',
      ceilingColor: '#FAFAF8',
      accentWall: '#D0C9BC',
      furniture: 'dining',
    },
    {
      id: 'master',
      name: "Owner's Suite",
      icon: '🛏️',
      floor: 2,
      w: 14, d: 14, h: 9,
      floorColor: '#8B7355',   // warm carpet
      wallColor: '#EAE4DA',
      ceilingColor: '#FAFAF8',
      accentWall: '#C4B8A4',
      furniture: 'master',
    },
    {
      id: 'bed2',
      name: 'Bedroom 2',
      icon: '🛏️',
      floor: 2,
      w: 11, d: 12, h: 9,
      floorColor: '#8B7355',
      wallColor: '#E8F0F5',
      ceilingColor: '#FAFAF8',
      accentWall: '#B8CCE0',
      furniture: 'bedroom',
    },
    {
      id: 'bed3',
      name: 'Bedroom 3',
      icon: '🛏️',
      floor: 2,
      w: 10, d: 12, h: 9,
      floorColor: '#8B7355',
      wallColor: '#F0EDE8',
      ceilingColor: '#FAFAF8',
      accentWall: '#D8D0C4',
      furniture: 'bedroom',
    },
    {
      id: 'bed4',
      name: 'Bedroom 4',
      icon: '🛏️',
      floor: 2,
      w: 10, d: 11, h: 9,
      floorColor: '#8B7355',
      wallColor: '#EDF0F5',
      ceilingColor: '#FAFAF8',
      accentWall: '#B8C8D8',
      furniture: 'bedroom',
    },
  ],
}

export function resolveModel(url, lotWidth, lotDepth) {
  // Match URL patterns to known models
  const lower = (url || '').toLowerCase()
  let model = null

  if (lower.includes('grayson') || lower.includes('mattamy')) {
    model = { ...graysonModel }
  } else {
    // Default: use Grayson as the demo model
    model = { ...graysonModel, name: 'Custom House (Demo)' }
  }

  return {
    ...model,
    lot: { width: parseFloat(lotWidth) || 33.9, depth: parseFloat(lotDepth) || 142.9 },
  }
}
