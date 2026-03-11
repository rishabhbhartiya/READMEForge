/**
 * MetalForge v3 — Core SVG Engine
 * metals.ts
 *
 * Full color system: metallic presets + custom colors + multi-stop gradients
 * Design system: 25+ style presets (Neumorphism, Glassmorphism, Skeuomorphism,
 *   Flat, Material, Claymorphism, Brutalism, Minimalism, Retro, Vintage,
 *   Cyberpunk, Futuristic, Dark Mode, Gradient, Aurora, Bento, 3D, Soft UI,
 *   Swiss, Y2K, Memphis, Organic, Pixel/8-bit, CTA, and more)
 * Dark/light theme support throughout
 * Advanced text animations (20+ effects)
 * Button variants with clickable href support for README embedding
 * Logo/image/GIF containers with proper URL fetching
 */

// ─────────────────────────────────────────────
// 1. TYPES
// ─────────────────────────────────────────────

export type Theme = 'dark' | 'light' | 'auto';

/** Any CSS color string, hex, rgb(), hsl(), or named color */
export type CSSColor = string;

/**
 * A gradient stop.
 * position: 0–100 (percent along gradient)
 */
export interface GradientStop {
  color: CSSColor;
  position: number; // 0–100
}

/**
 * Full gradient descriptor.
 * type: linear | radial | conic | sweep (alias for conic)
 * angle: degrees (for linear/conic)
 */
export interface GradientConfig {
  type: 'linear' | 'radial' | 'conic' | 'sweep';
  stops: GradientStop[];
  angle?: number; // degrees, default 135
  cx?: number; // radial center x 0–100
  cy?: number; // radial center y 0–100
  spreadMethod?: 'pad' | 'reflect' | 'repeat';
  gradientUnits?: 'userSpaceOnUse' | 'objectBoundingBox';
  x1?: number; y1?: number; x2?: number; y2?: number; // override linear endpoints
}

/**
 * ColorSpec: union of plain color, named metal, or gradient config.
 * Pass as `color` in most render calls.
 */
export type ColorSpec =
  | CSSColor           // '#ff0000', 'red', 'hsl(0,100%,50%)'
  | MetalName          // 'gold', 'chrome', 'neon-pink', ...
  | GradientConfig;    // full gradient descriptor

// ─────────────────────────────────────────────
// 2. METAL PRESETS
// ─────────────────────────────────────────────

export type MetalName =
  | 'gold' | 'silver' | 'copper' | 'bronze' | 'platinum' | 'titanium'
  | 'iron' | 'steel' | 'rose-gold' | 'chrome' | 'obsidian' | 'mercury'
  // Neon / electric
  | 'electric' | 'neon-pink' | 'neon-green' | 'neon-blue' | 'neon-purple' | 'neon-orange'
  // Aurora
  | 'aurora' | 'aurora-rose' | 'aurora-ocean'
  // Cyberpunk
  | 'cyber-yellow' | 'cyber-red' | 'cyber-teal'
  // Pastel / soft
  | 'pastel-pink' | 'pastel-blue' | 'pastel-green' | 'pastel-lavender' | 'pastel-peach'
  // Material
  | 'material-blue' | 'material-red' | 'material-green' | 'material-deep-purple'
  // Retro / vintage
  | 'retro-orange' | 'retro-teal' | 'vintage-sepia' | 'vintage-green'
  // Y2K / Memphis
  | 'y2k-pink' | 'memphis-yellow' | 'memphis-coral'
  // Pixel / 8-bit
  | 'pixel-green' | 'pixel-purple'
  // Neutral
  | 'white' | 'black' | 'slate' | 'zinc';

export interface MetalPalette {
  /** Primary fill (solid stop or first gradient stop) */
  primary: CSSColor;
  /** Secondary fill */
  secondary: CSSColor;
  /** Highlight / shine color */
  highlight: CSSColor;
  /** Shadow / depth color */
  shadow: CSSColor;
  /** Text color on this metal */
  text: CSSColor;
  /** Glow / emission color */
  glow: CSSColor;
  /** Dark-mode variant of text */
  textDark: CSSColor;
  /** Light-mode variant of text */
  textLight: CSSColor;
  /** Border/edge color */
  border: CSSColor;
  /** Gradient stops for the metallic sheen */
  gradient: GradientStop[];
  /** Category tag */
  category: 'metal' | 'neon' | 'aurora' | 'cyber' | 'pastel' | 'material' | 'retro' | 'y2k' | 'pixel' | 'neutral';
  /** Human-readable label */
  label: string;
}

export const METALS: Record<MetalName, MetalPalette> = {
  // ── Classic Metals ──────────────────────────────────────
  gold: {
    primary: '#FFD700', secondary: '#B8860B', highlight: '#FFFACD',
    shadow: '#8B6914', text: '#1a0e00', glow: '#FFD700',
    textDark: '#fff8e0', textLight: '#1a0e00', border: '#DAA520',
    gradient: [
      { color: '#FFF5B0', position: 0 },
      { color: '#FFD700', position: 25 },
      { color: '#B8860B', position: 55 },
      { color: '#FFD700', position: 75 },
      { color: '#8B6914', position: 100 },
    ],
    category: 'metal', label: 'Gold',
  },
  silver: {
    primary: '#C0C0C0', secondary: '#808080', highlight: '#F5F5F5',
    shadow: '#505050', text: '#111', glow: '#C0C0C0',
    textDark: '#f0f0f0', textLight: '#111', border: '#A0A0A0',
    gradient: [
      { color: '#F8F8F8', position: 0 },
      { color: '#C0C0C0', position: 30 },
      { color: '#808080', position: 60 },
      { color: '#C0C0C0', position: 80 },
      { color: '#505050', position: 100 },
    ],
    category: 'metal', label: 'Silver',
  },
  copper: {
    primary: '#B87333', secondary: '#7C4A1E', highlight: '#E8A96A',
    shadow: '#4A2E0E', text: '#fff', glow: '#D4813A',
    textDark: '#ffe8d0', textLight: '#2a1200', border: '#A0622A',
    gradient: [
      { color: '#F0C090', position: 0 },
      { color: '#C88040', position: 30 },
      { color: '#8B5515', position: 60 },
      { color: '#C07030', position: 80 },
      { color: '#5A3010', position: 100 },
    ],
    category: 'metal', label: 'Copper',
  },
  bronze: {
    primary: '#CD7F32', secondary: '#8B4513', highlight: '#E8A87C',
    shadow: '#5C2E0A', text: '#fff', glow: '#CD7F32',
    textDark: '#ffeedd', textLight: '#2a1500', border: '#A0622A',
    gradient: [
      { color: '#E8C090', position: 0 },
      { color: '#CD7F32', position: 35 },
      { color: '#8B4513', position: 65 },
      { color: '#CD7F32', position: 85 },
      { color: '#5C2E0A', position: 100 },
    ],
    category: 'metal', label: 'Bronze',
  },
  platinum: {
    primary: '#E5E4E2', secondary: '#A8A9AD', highlight: '#FFFFFF',
    shadow: '#6E6E6E', text: '#111', glow: '#E0E0FF',
    textDark: '#f8f8f8', textLight: '#111', border: '#C0C0C0',
    gradient: [
      { color: '#FFFFFF', position: 0 },
      { color: '#E5E4E2', position: 25 },
      { color: '#A8A9AD', position: 55 },
      { color: '#E0E0E0', position: 75 },
      { color: '#808080', position: 100 },
    ],
    category: 'metal', label: 'Platinum',
  },
  titanium: {
    primary: '#878681', secondary: '#545452', highlight: '#B0B0A8',
    shadow: '#2A2A28', text: '#fff', glow: '#9090A0',
    textDark: '#e8e8e4', textLight: '#1a1a18', border: '#686864',
    gradient: [
      { color: '#B8B8B0', position: 0 },
      { color: '#888880', position: 35 },
      { color: '#545452', position: 65 },
      { color: '#888880', position: 85 },
      { color: '#303030', position: 100 },
    ],
    category: 'metal', label: 'Titanium',
  },
  iron: {
    primary: '#4A4A4A', secondary: '#2A2A2A', highlight: '#787878',
    shadow: '#111', text: '#fff', glow: '#6060A0',
    textDark: '#e0e0e0', textLight: '#111', border: '#404040',
    gradient: [
      { color: '#888', position: 0 },
      { color: '#555', position: 30 },
      { color: '#222', position: 60 },
      { color: '#555', position: 80 },
      { color: '#111', position: 100 },
    ],
    category: 'metal', label: 'Iron',
  },
  steel: {
    primary: '#71797E', secondary: '#4682B4', highlight: '#A8BACC',
    shadow: '#1C2833', text: '#fff', glow: '#6090C0',
    textDark: '#e0eaf0', textLight: '#0d1520', border: '#5A7A9A',
    gradient: [
      { color: '#B0C8E0', position: 0 },
      { color: '#71797E', position: 30 },
      { color: '#4A6080', position: 60 },
      { color: '#708090', position: 80 },
      { color: '#1C2833', position: 100 },
    ],
    category: 'metal', label: 'Steel',
  },
  'rose-gold': {
    primary: '#B76E79', secondary: '#8B4557', highlight: '#E8A0A8',
    shadow: '#5C2030', text: '#fff', glow: '#E090A0',
    textDark: '#ffe0e8', textLight: '#2a0c14', border: '#A05A6A',
    gradient: [
      { color: '#F0C0C8', position: 0 },
      { color: '#D4909A', position: 30 },
      { color: '#B06070', position: 60 },
      { color: '#D08090', position: 80 },
      { color: '#703040', position: 100 },
    ],
    category: 'metal', label: 'Rose Gold',
  },
  chrome: {
    primary: '#D4D4D4', secondary: '#A8A8A8', highlight: '#FFFFFF',
    shadow: '#404040', text: '#111', glow: '#E8F0FF',
    textDark: '#f8f8ff', textLight: '#0a0a14', border: '#B8B8B8',
    gradient: [
      { color: '#FFFFFF', position: 0 },
      { color: '#D8D8D8', position: 15 },
      { color: '#888888', position: 40 },
      { color: '#F0F0F0', position: 60 },
      { color: '#A0A0A0', position: 80 },
      { color: '#D0D0D0', position: 100 },
    ],
    category: 'metal', label: 'Chrome',
  },
  obsidian: {
    primary: '#1C1C1C', secondary: '#0A0A0A', highlight: '#404060',
    shadow: '#000', text: '#fff', glow: '#6060FF',
    textDark: '#e0e0ff', textLight: '#0a0a0a', border: '#303050',
    gradient: [
      { color: '#505070', position: 0 },
      { color: '#1C1C2E', position: 30 },
      { color: '#0A0A10', position: 60 },
      { color: '#2A2A40', position: 80 },
      { color: '#000005', position: 100 },
    ],
    category: 'metal', label: 'Obsidian',
  },
  mercury: {
    primary: '#C8D8E8', secondary: '#8090A0', highlight: '#EAFAFF',
    shadow: '#304050', text: '#0a1a2a', glow: '#A0C8FF',
    textDark: '#e8f4ff', textLight: '#0a1a2a', border: '#9090A8',
    gradient: [
      { color: '#EAF8FF', position: 0 },
      { color: '#C0D8F0', position: 25 },
      { color: '#8090A8', position: 50 },
      { color: '#C8E0F8', position: 75 },
      { color: '#405060', position: 100 },
    ],
    category: 'metal', label: 'Mercury',
  },

  // ── Neon / Electric ──────────────────────────────────────
  electric: {
    primary: '#00D4FF', secondary: '#0088CC', highlight: '#80F0FF',
    shadow: '#003366', text: '#fff', glow: '#00EEFF',
    textDark: '#e0f8ff', textLight: '#001830', border: '#00AAEE',
    gradient: [
      { color: '#80F8FF', position: 0 },
      { color: '#00D4FF', position: 35 },
      { color: '#0066AA', position: 65 },
      { color: '#00AAFF', position: 85 },
      { color: '#003366', position: 100 },
    ],
    category: 'neon', label: 'Electric Blue',
  },
  'neon-pink': {
    primary: '#FF0080', secondary: '#AA0055', highlight: '#FF80C0',
    shadow: '#440022', text: '#fff', glow: '#FF00AA',
    textDark: '#ffe0f0', textLight: '#220011', border: '#CC0066',
    gradient: [
      { color: '#FF80C0', position: 0 },
      { color: '#FF0080', position: 35 },
      { color: '#880044', position: 65 },
      { color: '#FF1090', position: 85 },
      { color: '#440022', position: 100 },
    ],
    category: 'neon', label: 'Neon Pink',
  },
  'neon-green': {
    primary: '#00FF41', secondary: '#00AA28', highlight: '#80FF90',
    shadow: '#003010', text: '#001a08', glow: '#00FF41',
    textDark: '#d0ffe0', textLight: '#001408', border: '#00CC33',
    gradient: [
      { color: '#80FF90', position: 0 },
      { color: '#00FF41', position: 35 },
      { color: '#00882A', position: 65 },
      { color: '#00DD38', position: 85 },
      { color: '#003010', position: 100 },
    ],
    category: 'neon', label: 'Neon Green',
  },
  'neon-blue': {
    primary: '#0040FF', secondary: '#0020AA', highlight: '#6080FF',
    shadow: '#00104A', text: '#fff', glow: '#2060FF',
    textDark: '#d0e0ff', textLight: '#000820', border: '#0030CC',
    gradient: [
      { color: '#6090FF', position: 0 },
      { color: '#2050FF', position: 35 },
      { color: '#0020A0', position: 65 },
      { color: '#0040EE', position: 85 },
      { color: '#001050', position: 100 },
    ],
    category: 'neon', label: 'Neon Blue',
  },
  'neon-purple': {
    primary: '#AA00FF', secondary: '#6600AA', highlight: '#CC80FF',
    shadow: '#330066', text: '#fff', glow: '#CC00FF',
    textDark: '#f0d0ff', textLight: '#1a0033', border: '#8800CC',
    gradient: [
      { color: '#CC80FF', position: 0 },
      { color: '#AA00FF', position: 35 },
      { color: '#5500AA', position: 65 },
      { color: '#9900EE', position: 85 },
      { color: '#330055', position: 100 },
    ],
    category: 'neon', label: 'Neon Purple',
  },
  'neon-orange': {
    primary: '#FF6600', secondary: '#AA3300', highlight: '#FFB080',
    shadow: '#441500', text: '#fff', glow: '#FF8800',
    textDark: '#ffe8d0', textLight: '#1a0a00', border: '#CC5500',
    gradient: [
      { color: '#FFB080', position: 0 },
      { color: '#FF6600', position: 35 },
      { color: '#AA3300', position: 65 },
      { color: '#FF7700', position: 85 },
      { color: '#441500', position: 100 },
    ],
    category: 'neon', label: 'Neon Orange',
  },

  // ── Aurora ───────────────────────────────────────────────
  aurora: {
    primary: '#00C8FF', secondary: '#8000FF', highlight: '#A0FFD4',
    shadow: '#000830', text: '#fff', glow: '#00FFB0',
    textDark: '#e0fff8', textLight: '#00082a', border: '#0088CC',
    gradient: [
      { color: '#A0FFD4', position: 0 },
      { color: '#00C8FF', position: 25 },
      { color: '#8800FF', position: 55 },
      { color: '#00D4FF', position: 80 },
      { color: '#200060', position: 100 },
    ],
    category: 'aurora', label: 'Aurora Borealis',
  },
  'aurora-rose': {
    primary: '#FF4DA6', secondary: '#8800AA', highlight: '#FFB0D8',
    shadow: '#1A0030', text: '#fff', glow: '#FF80C8',
    textDark: '#ffe0f4', textLight: '#12001e', border: '#CC2080',
    gradient: [
      { color: '#FFB0D8', position: 0 },
      { color: '#FF4DA6', position: 30 },
      { color: '#AA0088', position: 55 },
      { color: '#FF60B8', position: 80 },
      { color: '#1A0030', position: 100 },
    ],
    category: 'aurora', label: 'Aurora Rose',
  },
  'aurora-ocean': {
    primary: '#00D4AA', secondary: '#006688', highlight: '#80FFE8',
    shadow: '#001828', text: '#fff', glow: '#00FFCC',
    textDark: '#d0fff8', textLight: '#001018', border: '#00AAAA',
    gradient: [
      { color: '#80FFE8', position: 0 },
      { color: '#00D4AA', position: 30 },
      { color: '#006888', position: 55 },
      { color: '#00BBCC', position: 80 },
      { color: '#001828', position: 100 },
    ],
    category: 'aurora', label: 'Aurora Ocean',
  },

  // ── Cyberpunk ─────────────────────────────────────────────
  'cyber-yellow': {
    primary: '#FFE600', secondary: '#AA9900', highlight: '#FFFF80',
    shadow: '#2A2200', text: '#0a0800', glow: '#FFE600',
    textDark: '#fffce0', textLight: '#0a0800', border: '#CCBB00',
    gradient: [
      { color: '#FFFFA0', position: 0 },
      { color: '#FFE600', position: 30 },
      { color: '#998800', position: 60 },
      { color: '#FFE000', position: 80 },
      { color: '#2A2200', position: 100 },
    ],
    category: 'cyber', label: 'Cyber Yellow',
  },
  'cyber-red': {
    primary: '#FF0022', secondary: '#880011', highlight: '#FF8090',
    shadow: '#220008', text: '#fff', glow: '#FF2040',
    textDark: '#ffe0e8', textLight: '#110004', border: '#CC001A',
    gradient: [
      { color: '#FF8090', position: 0 },
      { color: '#FF0022', position: 30 },
      { color: '#880011', position: 60 },
      { color: '#FF0030', position: 80 },
      { color: '#220008', position: 100 },
    ],
    category: 'cyber', label: 'Cyber Red',
  },
  'cyber-teal': {
    primary: '#00FFCC', secondary: '#00AA88', highlight: '#80FFF0',
    shadow: '#003028', text: '#001a14', glow: '#00FFCC',
    textDark: '#d0fff8', textLight: '#001a14', border: '#00CCAA',
    gradient: [
      { color: '#80FFF0', position: 0 },
      { color: '#00FFCC', position: 30 },
      { color: '#00AA80', position: 60 },
      { color: '#00EEBB', position: 80 },
      { color: '#003028', position: 100 },
    ],
    category: 'cyber', label: 'Cyber Teal',
  },

  // ── Pastel / Soft ─────────────────────────────────────────
  'pastel-pink': {
    primary: '#FFB3C6', secondary: '#FF80A0', highlight: '#FFE0EA',
    shadow: '#CC6080', text: '#3a1020', glow: '#FFB3C6',
    textDark: '#fff0f4', textLight: '#2a0818', border: '#FF90AA',
    gradient: [
      { color: '#FFE0EA', position: 0 },
      { color: '#FFB3C6', position: 40 },
      { color: '#FF80A0', position: 70 },
      { color: '#FFB3C6', position: 100 },
    ],
    category: 'pastel', label: 'Pastel Pink',
  },
  'pastel-blue': {
    primary: '#AEC6CF', secondary: '#7099A6', highlight: '#D8EEF4',
    shadow: '#3A6070', text: '#0a2030', glow: '#AEC6CF',
    textDark: '#e8f4f8', textLight: '#0a2030', border: '#88AABC',
    gradient: [
      { color: '#D8EEF4', position: 0 },
      { color: '#AEC6CF', position: 40 },
      { color: '#7099A6', position: 70 },
      { color: '#AEC6CF', position: 100 },
    ],
    category: 'pastel', label: 'Pastel Blue',
  },
  'pastel-green': {
    primary: '#B5EAD7', secondary: '#80CCA8', highlight: '#D8F8EC',
    shadow: '#407A58', text: '#0a2018', glow: '#B5EAD7',
    textDark: '#e8fff4', textLight: '#0a2018', border: '#90CCB0',
    gradient: [
      { color: '#D8F8EC', position: 0 },
      { color: '#B5EAD7', position: 40 },
      { color: '#80CCA8', position: 70 },
      { color: '#B5EAD7', position: 100 },
    ],
    category: 'pastel', label: 'Pastel Green',
  },
  'pastel-lavender': {
    primary: '#C3B1E1', secondary: '#9980C8', highlight: '#E8DEFF',
    shadow: '#5A4080', text: '#1a0840', glow: '#C3B1E1',
    textDark: '#f0eaff', textLight: '#1a0840', border: '#A890CC',
    gradient: [
      { color: '#E8DEFF', position: 0 },
      { color: '#C3B1E1', position: 40 },
      { color: '#9980C8', position: 70 },
      { color: '#C3B1E1', position: 100 },
    ],
    category: 'pastel', label: 'Pastel Lavender',
  },
  'pastel-peach': {
    primary: '#FFCBA4', secondary: '#FFAA70', highlight: '#FFE8D4',
    shadow: '#AA6030', text: '#2a1000', glow: '#FFCBA4',
    textDark: '#fff4ec', textLight: '#2a1000', border: '#FFAA80',
    gradient: [
      { color: '#FFE8D4', position: 0 },
      { color: '#FFCBA4', position: 40 },
      { color: '#FFAA70', position: 70 },
      { color: '#FFCBA4', position: 100 },
    ],
    category: 'pastel', label: 'Pastel Peach',
  },

  // ── Material ─────────────────────────────────────────────
  'material-blue': {
    primary: '#2196F3', secondary: '#0D47A1', highlight: '#90CAF9',
    shadow: '#01337A', text: '#fff', glow: '#42A5F5',
    textDark: '#e3f2fd', textLight: '#012060', border: '#1565C0',
    gradient: [
      { color: '#90CAF9', position: 0 },
      { color: '#2196F3', position: 40 },
      { color: '#0D47A1', position: 100 },
    ],
    category: 'material', label: 'Material Blue',
  },
  'material-red': {
    primary: '#F44336', secondary: '#B71C1C', highlight: '#EF9A9A',
    shadow: '#7F0000', text: '#fff', glow: '#EF5350',
    textDark: '#ffebee', textLight: '#4a0000', border: '#C62828',
    gradient: [
      { color: '#EF9A9A', position: 0 },
      { color: '#F44336', position: 40 },
      { color: '#B71C1C', position: 100 },
    ],
    category: 'material', label: 'Material Red',
  },
  'material-green': {
    primary: '#4CAF50', secondary: '#1B5E20', highlight: '#A5D6A7',
    shadow: '#004000', text: '#fff', glow: '#66BB6A',
    textDark: '#e8f5e9', textLight: '#002000', border: '#2E7D32',
    gradient: [
      { color: '#A5D6A7', position: 0 },
      { color: '#4CAF50', position: 40 },
      { color: '#1B5E20', position: 100 },
    ],
    category: 'material', label: 'Material Green',
  },
  'material-deep-purple': {
    primary: '#673AB7', secondary: '#311B92', highlight: '#CE93D8',
    shadow: '#1A0066', text: '#fff', glow: '#9575CD',
    textDark: '#ede7f6', textLight: '#0e0044', border: '#4527A0',
    gradient: [
      { color: '#CE93D8', position: 0 },
      { color: '#673AB7', position: 40 },
      { color: '#311B92', position: 100 },
    ],
    category: 'material', label: 'Material Deep Purple',
  },

  // ── Retro / Vintage ────────────────────────────────────────
  'retro-orange': {
    primary: '#FF6B35', secondary: '#CC3300', highlight: '#FFB090',
    shadow: '#661500', text: '#fff', glow: '#FF8044',
    textDark: '#ffe8d8', textLight: '#2a0800', border: '#CC5020',
    gradient: [
      { color: '#FFB090', position: 0 },
      { color: '#FF6B35', position: 35 },
      { color: '#CC3300', position: 65 },
      { color: '#FF6835', position: 85 },
      { color: '#661500', position: 100 },
    ],
    category: 'retro', label: 'Retro Orange',
  },
  'retro-teal': {
    primary: '#2BBCB1', secondary: '#1A7A72', highlight: '#80DED8',
    shadow: '#0A3830', text: '#fff', glow: '#30C8BC',
    textDark: '#d0f4f2', textLight: '#0a2820', border: '#1A9A92',
    gradient: [
      { color: '#80DED8', position: 0 },
      { color: '#2BBCB1', position: 35 },
      { color: '#1A7A72', position: 65 },
      { color: '#2BBCB1', position: 85 },
      { color: '#0A3830', position: 100 },
    ],
    category: 'retro', label: 'Retro Teal',
  },
  'vintage-sepia': {
    primary: '#C4A882', secondary: '#8B7355', highlight: '#E8D8B8',
    shadow: '#3A2A10', text: '#1a1008', glow: '#C4A882',
    textDark: '#f5ecd8', textLight: '#1a1008', border: '#A89070',
    gradient: [
      { color: '#F0DFC0', position: 0 },
      { color: '#C4A882', position: 40 },
      { color: '#8B7355', position: 70 },
      { color: '#C4A882', position: 100 },
    ],
    category: 'retro', label: 'Vintage Sepia',
  },
  'vintage-green': {
    primary: '#4A7C59', secondary: '#2A4A35', highlight: '#90C8A0',
    shadow: '#0A1A10', text: '#fff', glow: '#5A9C6A',
    textDark: '#d8f0e0', textLight: '#0a1a10', border: '#3A6048',
    gradient: [
      { color: '#90C8A0', position: 0 },
      { color: '#4A7C59', position: 40 },
      { color: '#2A4A35', position: 70 },
      { color: '#4A7C59', position: 100 },
    ],
    category: 'retro', label: 'Vintage Green',
  },

  // ── Y2K / Memphis ─────────────────────────────────────────
  'y2k-pink': {
    primary: '#FF69B4', secondary: '#FF1493', highlight: '#FFB0D8',
    shadow: '#AA0060', text: '#fff', glow: '#FF69B4',
    textDark: '#fff0f8', textLight: '#2a0018', border: '#FF3399',
    gradient: [
      { color: '#FFD0E8', position: 0 },
      { color: '#FF69B4', position: 40 },
      { color: '#FF1493', position: 70 },
      { color: '#FF69B4', position: 100 },
    ],
    category: 'y2k', label: 'Y2K Pink',
  },
  'memphis-yellow': {
    primary: '#FFD700', secondary: '#FF6B00', highlight: '#FFFF80',
    shadow: '#884000', text: '#1a0800', glow: '#FFD700',
    textDark: '#fff8cc', textLight: '#1a0800', border: '#FFAA00',
    gradient: [
      { color: '#FFFF80', position: 0 },
      { color: '#FFD700', position: 40 },
      { color: '#FF8800', position: 70 },
      { color: '#FFD700', position: 100 },
    ],
    category: 'y2k', label: 'Memphis Yellow',
  },
  'memphis-coral': {
    primary: '#FF6B6B', secondary: '#FF3A3A', highlight: '#FFB0B0',
    shadow: '#880000', text: '#fff', glow: '#FF6B6B',
    textDark: '#ffe8e8', textLight: '#220000', border: '#FF4444',
    gradient: [
      { color: '#FFB0B0', position: 0 },
      { color: '#FF6B6B', position: 40 },
      { color: '#FF3A3A', position: 70 },
      { color: '#FF6B6B', position: 100 },
    ],
    category: 'y2k', label: 'Memphis Coral',
  },

  // ── Pixel / 8-bit ─────────────────────────────────────────
  'pixel-green': {
    primary: '#00FF00', secondary: '#008800', highlight: '#80FF80',
    shadow: '#003300', text: '#001a00', glow: '#00FF00',
    textDark: '#d0ffd0', textLight: '#001a00', border: '#00CC00',
    gradient: [
      { color: '#80FF80', position: 0 },
      { color: '#00FF00', position: 40 },
      { color: '#008800', position: 70 },
      { color: '#00FF00', position: 100 },
    ],
    category: 'pixel', label: 'Pixel Green',
  },
  'pixel-purple': {
    primary: '#8800FF', secondary: '#4400AA', highlight: '#CC80FF',
    shadow: '#220055', text: '#fff', glow: '#AA00FF',
    textDark: '#f0d0ff', textLight: '#110033', border: '#6600CC',
    gradient: [
      { color: '#CC80FF', position: 0 },
      { color: '#8800FF', position: 40 },
      { color: '#4400AA', position: 70 },
      { color: '#8800FF', position: 100 },
    ],
    category: 'pixel', label: 'Pixel Purple',
  },

  // ── Neutral ───────────────────────────────────────────────
  white: {
    primary: '#FFFFFF', secondary: '#E0E0E0', highlight: '#FFFFFF',
    shadow: '#A0A0A0', text: '#111', glow: '#FFFFFF',
    textDark: '#f8f8f8', textLight: '#111', border: '#D0D0D0',
    gradient: [
      { color: '#FFFFFF', position: 0 },
      { color: '#F0F0F0', position: 50 },
      { color: '#E0E0E0', position: 100 },
    ],
    category: 'neutral', label: 'White',
  },
  black: {
    primary: '#111111', secondary: '#000000', highlight: '#333333',
    shadow: '#000000', text: '#fff', glow: '#444444',
    textDark: '#e8e8e8', textLight: '#111', border: '#222222',
    gradient: [
      { color: '#333333', position: 0 },
      { color: '#111111', position: 50 },
      { color: '#000000', position: 100 },
    ],
    category: 'neutral', label: 'Black',
  },
  slate: {
    primary: '#64748B', secondary: '#334155', highlight: '#94A3B8',
    shadow: '#0F172A', text: '#fff', glow: '#7090B0',
    textDark: '#e2e8f0', textLight: '#0f172a', border: '#475569',
    gradient: [
      { color: '#94A3B8', position: 0 },
      { color: '#64748B', position: 40 },
      { color: '#334155', position: 70 },
      { color: '#64748B', position: 100 },
    ],
    category: 'neutral', label: 'Slate',
  },
  zinc: {
    primary: '#71717A', secondary: '#3F3F46', highlight: '#A1A1AA',
    shadow: '#18181B', text: '#fff', glow: '#80808A',
    textDark: '#e4e4e7', textLight: '#18181b', border: '#52525B',
    gradient: [
      { color: '#A1A1AA', position: 0 },
      { color: '#71717A', position: 40 },
      { color: '#3F3F46', position: 70 },
      { color: '#71717A', position: 100 },
    ],
    category: 'neutral', label: 'Zinc',
  },
};

// ─────────────────────────────────────────────
// 3. DESIGN SYSTEM PRESETS
// ─────────────────────────────────────────────

export type DesignStyle =
  | 'neumorphism' | 'glassmorphism' | 'skeuomorphism' | 'flat' | 'material'
  | 'claymorphism' | 'brutalism' | 'minimalism' | 'retro' | 'vintage'
  | 'cyberpunk' | 'futuristic' | 'dark-mode' | 'gradient' | 'aurora-ui'
  | 'bento' | '3d' | 'soft-ui' | 'swiss' | 'y2k' | 'memphis' | 'organic'
  | 'pixel' | 'metallic' | 'cta' | 'neon-sign' | 'holographic' | 'frosted';

export interface DesignSystemPreset {
  label: string;
  description: string;
  /** Suggested theme */
  theme: Theme;
  /** Suggested metals to pair with */
  suggestedMetals: MetalName[];
  /** Default border radius */
  borderRadius: number;
  /** Default shadow style */
  shadowStyle: 'none' | 'flat' | 'soft' | 'hard' | 'inner' | 'glow' | 'neon';
  /** Background color (dark theme) */
  bgDark: CSSColor;
  /** Background color (light theme) */
  bgLight: CSSColor;
  /** Surface color dark */
  surfaceDark: CSSColor;
  /** Surface color light */
  surfaceLight: CSSColor;
  /** Accent color */
  accent: CSSColor;
  /** Whether this style uses borders */
  hasBorder: boolean;
  /** Border width */
  borderWidth: number;
  /** Whether glass/blur effect */
  hasBlur: boolean;
  /** Whether uses noise texture */
  hasNoise: boolean;
  /** Typography flavor */
  fontFlavor: 'sans' | 'mono' | 'serif' | 'display' | 'pixel';
}

export const DESIGN_STYLES: Record<DesignStyle, DesignSystemPreset> = {
  neumorphism: {
    label: 'Neumorphism',
    description: 'Soft UI with dual light/dark shadows on matching background',
    theme: 'light', suggestedMetals: ['platinum', 'silver', 'slate'],
    borderRadius: 16, shadowStyle: 'soft',
    bgDark: '#1e2030', bgLight: '#E0E5EC',
    surfaceDark: '#252840', surfaceLight: '#E0E5EC',
    accent: '#6C8EBF', hasBorder: false, borderWidth: 0,
    hasBlur: false, hasNoise: false, fontFlavor: 'sans',
  },
  glassmorphism: {
    label: 'Glassmorphism',
    description: 'Frosted glass effect with blur and translucent layers',
    theme: 'dark', suggestedMetals: ['electric', 'aurora', 'chrome'],
    borderRadius: 20, shadowStyle: 'glow',
    bgDark: '#0a0a1a', bgLight: '#e8f0ff',
    surfaceDark: 'rgba(255,255,255,0.08)', surfaceLight: 'rgba(255,255,255,0.6)',
    accent: '#8866FF', hasBorder: true, borderWidth: 1,
    hasBlur: true, hasNoise: false, fontFlavor: 'sans',
  },
  skeuomorphism: {
    label: 'Skeuomorphism',
    description: 'Realistic materials with textures, stitching, gradients',
    theme: 'light', suggestedMetals: ['gold', 'copper', 'bronze'],
    borderRadius: 8, shadowStyle: 'hard',
    bgDark: '#2A1F14', bgLight: '#F5EDD8',
    surfaceDark: '#3A2D1E', surfaceLight: '#E8D4B0',
    accent: '#B87333', hasBorder: true, borderWidth: 2,
    hasBlur: false, hasNoise: true, fontFlavor: 'serif',
  },
  flat: {
    label: 'Flat Design',
    description: 'Clean, shadow-free design with solid colors',
    theme: 'light', suggestedMetals: ['material-blue', 'material-red', 'material-green'],
    borderRadius: 4, shadowStyle: 'none',
    bgDark: '#1a1a2e', bgLight: '#FAFAFA',
    surfaceDark: '#16213e', surfaceLight: '#FFFFFF',
    accent: '#2196F3', hasBorder: false, borderWidth: 0,
    hasBlur: false, hasNoise: false, fontFlavor: 'sans',
  },
  material: {
    label: 'Material Design',
    description: 'Google Material Design with elevation shadows',
    theme: 'light', suggestedMetals: ['material-blue', 'material-deep-purple', 'material-green'],
    borderRadius: 8, shadowStyle: 'flat',
    bgDark: '#121212', bgLight: '#F5F5F5',
    surfaceDark: '#1E1E1E', surfaceLight: '#FFFFFF',
    accent: '#6200EA', hasBorder: false, borderWidth: 0,
    hasBlur: false, hasNoise: false, fontFlavor: 'sans',
  },
  claymorphism: {
    label: 'Claymorphism',
    description: 'Puffy 3D clay-like shapes with soft shadows',
    theme: 'light', suggestedMetals: ['pastel-pink', 'pastel-blue', 'pastel-lavender'],
    borderRadius: 32, shadowStyle: 'soft',
    bgDark: '#1a1040', bgLight: '#F0EAFF',
    surfaceDark: '#241860', surfaceLight: '#FFFFFF',
    accent: '#C3B1E1', hasBorder: false, borderWidth: 0,
    hasBlur: false, hasNoise: false, fontFlavor: 'display',
  },
  brutalism: {
    label: 'Brutalism',
    description: 'Raw, bold design with thick borders and stark contrast',
    theme: 'light', suggestedMetals: ['black', 'cyber-yellow', 'memphis-coral'],
    borderRadius: 0, shadowStyle: 'hard',
    bgDark: '#0A0A0A', bgLight: '#FFFFFF',
    surfaceDark: '#111111', surfaceLight: '#EEEEEE',
    accent: '#FF0000', hasBorder: true, borderWidth: 4,
    hasBlur: false, hasNoise: false, fontFlavor: 'display',
  },
  minimalism: {
    label: 'Minimalism',
    description: 'Ultra-clean with maximum whitespace',
    theme: 'light', suggestedMetals: ['slate', 'zinc', 'white'],
    borderRadius: 2, shadowStyle: 'none',
    bgDark: '#0F0F0F', bgLight: '#FEFEFE',
    surfaceDark: '#1A1A1A', surfaceLight: '#F8F8F8',
    accent: '#111111', hasBorder: false, borderWidth: 0,
    hasBlur: false, hasNoise: false, fontFlavor: 'sans',
  },
  retro: {
    label: 'Retro',
    description: '70s–80s retro design with warm tones',
    theme: 'light', suggestedMetals: ['retro-orange', 'retro-teal', 'gold'],
    borderRadius: 6, shadowStyle: 'hard',
    bgDark: '#1A0F05', bgLight: '#FFF5E0',
    surfaceDark: '#2A1A08', surfaceLight: '#FEE8B8',
    accent: '#FF6B35', hasBorder: true, borderWidth: 3,
    hasBlur: false, hasNoise: true, fontFlavor: 'display',
  },
  vintage: {
    label: 'Vintage',
    description: 'Aged, worn aesthetic with sepia tones',
    theme: 'light', suggestedMetals: ['vintage-sepia', 'vintage-green', 'bronze'],
    borderRadius: 4, shadowStyle: 'inner',
    bgDark: '#100C06', bgLight: '#F0E8D0',
    surfaceDark: '#1A1408', surfaceLight: '#E8D8B0',
    accent: '#8B7355', hasBorder: true, borderWidth: 2,
    hasBlur: false, hasNoise: true, fontFlavor: 'serif',
  },
  cyberpunk: {
    label: 'Cyberpunk',
    description: 'Neon on dark with glitch effects and angular geometry',
    theme: 'dark', suggestedMetals: ['cyber-yellow', 'neon-pink', 'cyber-teal'],
    borderRadius: 0, shadowStyle: 'neon',
    bgDark: '#0A0010', bgLight: '#100020',
    surfaceDark: '#100018', surfaceLight: '#180028',
    accent: '#FF0080', hasBorder: true, borderWidth: 1,
    hasBlur: false, hasNoise: false, fontFlavor: 'mono',
  },
  futuristic: {
    label: 'Futuristic',
    description: 'Clean sci-fi UI with geometric precision',
    theme: 'dark', suggestedMetals: ['electric', 'titanium', 'neon-blue'],
    borderRadius: 4, shadowStyle: 'glow',
    bgDark: '#050A14', bgLight: '#0A1428',
    surfaceDark: '#0A1428', surfaceLight: '#0F1C38',
    accent: '#00D4FF', hasBorder: true, borderWidth: 1,
    hasBlur: false, hasNoise: false, fontFlavor: 'mono',
  },
  'dark-mode': {
    label: 'Dark Mode',
    description: 'Pure dark UI with subtle surface elevation',
    theme: 'dark', suggestedMetals: ['slate', 'zinc', 'electric'],
    borderRadius: 12, shadowStyle: 'flat',
    bgDark: '#09090B', bgLight: '#09090B',
    surfaceDark: '#18181B', surfaceLight: '#27272A',
    accent: '#8B5CF6', hasBorder: true, borderWidth: 1,
    hasBlur: false, hasNoise: false, fontFlavor: 'sans',
  },
  gradient: {
    label: 'Gradient Design',
    description: 'Rich gradient backgrounds and fills throughout',
    theme: 'dark', suggestedMetals: ['aurora', 'neon-purple', 'electric'],
    borderRadius: 16, shadowStyle: 'glow',
    bgDark: '#050520', bgLight: '#E8E0FF',
    surfaceDark: '#0A0840', surfaceLight: '#F0ECFF',
    accent: '#7C3AED', hasBorder: false, borderWidth: 0,
    hasBlur: true, hasNoise: false, fontFlavor: 'sans',
  },
  'aurora-ui': {
    label: 'Aurora UI',
    description: 'Northern lights inspired with flowing color gradients',
    theme: 'dark', suggestedMetals: ['aurora', 'aurora-rose', 'aurora-ocean'],
    borderRadius: 20, shadowStyle: 'glow',
    bgDark: '#030818', bgLight: '#0A102A',
    surfaceDark: '#060E22', surfaceLight: '#0E1A38',
    accent: '#00C8FF', hasBorder: true, borderWidth: 1,
    hasBlur: true, hasNoise: false, fontFlavor: 'sans',
  },
  bento: {
    label: 'Bento Grid',
    description: 'Asymmetric grid cards with varied sizes and colors',
    theme: 'dark', suggestedMetals: ['slate', 'material-deep-purple', 'electric'],
    borderRadius: 20, shadowStyle: 'soft',
    bgDark: '#0F0F13', bgLight: '#F5F5F7',
    surfaceDark: '#1A1A22', surfaceLight: '#FFFFFF',
    accent: '#6366F1', hasBorder: true, borderWidth: 1,
    hasBlur: false, hasNoise: false, fontFlavor: 'sans',
  },
  '3d': {
    label: '3D UI',
    description: 'Extruded depth, perspective, and realistic lighting',
    theme: 'light', suggestedMetals: ['gold', 'silver', 'steel'],
    borderRadius: 12, shadowStyle: 'hard',
    bgDark: '#0A0A20', bgLight: '#E8EAF0',
    surfaceDark: '#121230', surfaceLight: '#FFFFFF',
    accent: '#4A90E2', hasBorder: false, borderWidth: 0,
    hasBlur: false, hasNoise: false, fontFlavor: 'sans',
  },
  'soft-ui': {
    label: 'Soft UI',
    description: 'Pastel palette with gentle shadows and rounded forms',
    theme: 'light', suggestedMetals: ['pastel-pink', 'pastel-lavender', 'pastel-blue'],
    borderRadius: 24, shadowStyle: 'soft',
    bgDark: '#1A1030', bgLight: '#F3F0FF',
    surfaceDark: '#221840', surfaceLight: '#FFFFFF',
    accent: '#A78BFA', hasBorder: false, borderWidth: 0,
    hasBlur: false, hasNoise: false, fontFlavor: 'sans',
  },
  swiss: {
    label: 'Swiss Style',
    description: 'Grid-based, typographic, systematic — International Style',
    theme: 'light', suggestedMetals: ['black', 'white', 'material-red'],
    borderRadius: 0, shadowStyle: 'none',
    bgDark: '#0A0A0A', bgLight: '#FFFFFF',
    surfaceDark: '#111111', surfaceLight: '#F5F5F5',
    accent: '#FF0000', hasBorder: true, borderWidth: 2,
    hasBlur: false, hasNoise: false, fontFlavor: 'sans',
  },
  y2k: {
    label: 'Y2K Style',
    description: 'Early 2000s glossy, chrome, translucent plastic aesthetic',
    theme: 'light', suggestedMetals: ['y2k-pink', 'chrome', 'neon-blue'],
    borderRadius: 20, shadowStyle: 'soft',
    bgDark: '#080020', bgLight: '#E8D8FF',
    surfaceDark: '#100830', surfaceLight: '#F0E0FF',
    accent: '#FF69B4', hasBorder: true, borderWidth: 2,
    hasBlur: true, hasNoise: false, fontFlavor: 'display',
  },
  memphis: {
    label: 'Memphis Design',
    description: 'Bold patterns, random geometry, clashing colors',
    theme: 'light', suggestedMetals: ['memphis-yellow', 'memphis-coral', 'neon-blue'],
    borderRadius: 0, shadowStyle: 'hard',
    bgDark: '#0A0818', bgLight: '#FFFDE7',
    surfaceDark: '#100E28', surfaceLight: '#FFFFFF',
    accent: '#FF6B6B', hasBorder: true, borderWidth: 3,
    hasBlur: false, hasNoise: false, fontFlavor: 'display',
  },
  organic: {
    label: 'Organic Design',
    description: 'Natural shapes, earthy tones, biomorphic forms',
    theme: 'light', suggestedMetals: ['vintage-green', 'vintage-sepia', 'pastel-green'],
    borderRadius: 40, shadowStyle: 'soft',
    bgDark: '#0A1008', bgLight: '#F5F0E8',
    surfaceDark: '#101808', surfaceLight: '#EAE8DC',
    accent: '#4A7C59', hasBorder: false, borderWidth: 0,
    hasBlur: false, hasNoise: true, fontFlavor: 'serif',
  },
  pixel: {
    label: 'Pixel / 8-bit',
    description: 'Pixelated, retro game aesthetic',
    theme: 'dark', suggestedMetals: ['pixel-green', 'pixel-purple', 'cyber-yellow'],
    borderRadius: 0, shadowStyle: 'hard',
    bgDark: '#000000', bgLight: '#000000',
    surfaceDark: '#0A0A0A', surfaceLight: '#111111',
    accent: '#00FF00', hasBorder: true, borderWidth: 4,
    hasBlur: false, hasNoise: false, fontFlavor: 'pixel',
  },
  metallic: {
    label: 'Metallic',
    description: 'Shiny metal gradients with specular highlights',
    theme: 'dark', suggestedMetals: ['gold', 'silver', 'chrome', 'titanium'],
    borderRadius: 8, shadowStyle: 'hard',
    bgDark: '#0A0A0A', bgLight: '#E8E8E8',
    surfaceDark: '#141414', surfaceLight: '#F0F0F0',
    accent: '#C0C0C0', hasBorder: true, borderWidth: 1,
    hasBlur: false, hasNoise: false, fontFlavor: 'sans',
  },
  cta: {
    label: 'CTA Button',
    description: 'High-conversion call-to-action with maximum visual impact',
    theme: 'dark', suggestedMetals: ['electric', 'neon-pink', 'cyber-yellow'],
    borderRadius: 8, shadowStyle: 'glow',
    bgDark: '#0A0A1A', bgLight: '#F5F5FF',
    surfaceDark: '#10101E', surfaceLight: '#FFFFFF',
    accent: '#6C3AF4', hasBorder: false, borderWidth: 0,
    hasBlur: false, hasNoise: false, fontFlavor: 'sans',
  },
  'neon-sign': {
    label: 'Neon Sign',
    description: 'Bright neon tubes on dark backgrounds with animated glow',
    theme: 'dark', suggestedMetals: ['neon-pink', 'neon-green', 'electric'],
    borderRadius: 0, shadowStyle: 'neon',
    bgDark: '#050508', bgLight: '#070710',
    surfaceDark: '#080810', surfaceLight: '#0A0A14',
    accent: '#FF00AA', hasBorder: false, borderWidth: 0,
    hasBlur: false, hasNoise: false, fontFlavor: 'display',
  },
  holographic: {
    label: 'Holographic',
    description: 'Iridescent rainbow sheen like holographic foil',
    theme: 'dark', suggestedMetals: ['chrome', 'aurora', 'electric'],
    borderRadius: 16, shadowStyle: 'glow',
    bgDark: '#05050F', bgLight: '#0A0A1E',
    surfaceDark: '#0A0A1A', surfaceLight: '#12122A',
    accent: '#FF80FF', hasBorder: true, borderWidth: 1,
    hasBlur: true, hasNoise: false, fontFlavor: 'sans',
  },
  frosted: {
    label: 'Frosted Glass',
    description: 'Apple-style frosted glass with subtle tint',
    theme: 'dark', suggestedMetals: ['silver', 'platinum', 'electric'],
    borderRadius: 20, shadowStyle: 'soft',
    bgDark: '#0A101A', bgLight: '#EAF0F8',
    surfaceDark: 'rgba(255,255,255,0.06)', surfaceLight: 'rgba(255,255,255,0.72)',
    accent: '#0066CC', hasBorder: true, borderWidth: 1,
    hasBlur: true, hasNoise: false, fontFlavor: 'sans',
  },
};

// ─────────────────────────────────────────────
// 4. SVG GRADIENT FACTORIES
// ─────────────────────────────────────────────

let _gradientCounter = 0;
export function uniqueId(prefix = 'g'): string {
  return `${prefix}_${++_gradientCounter}_${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Build an SVG <linearGradient> or <radialGradient> from a GradientConfig.
 * Returns { id, defs } where defs is the full SVG def string.
 */
export function buildGradientDef(cfg: GradientConfig, id?: string): { id: string; defs: string } {
  const gid = id ?? uniqueId('grad');
  const stops = cfg.stops
    .map(s => `<stop offset="${s.position}%" stop-color="${s.color}"/>`)
    .join('');

  let tag = '';
  if (cfg.type === 'linear') {
    const angle = cfg.angle ?? 135;
    // Convert angle to x1/y1/x2/y2
    const rad = (angle - 90) * (Math.PI / 180);
    const x1 = cfg.x1 ?? +(50 - 50 * Math.cos(rad)).toFixed(4);
    const y1 = cfg.y1 ?? +(50 - 50 * Math.sin(rad)).toFixed(4);
    const x2 = cfg.x2 ?? +(50 + 50 * Math.cos(rad)).toFixed(4);
    const y2 = cfg.y2 ?? +(50 + 50 * Math.sin(rad)).toFixed(4);
    const spreadMethod = cfg.spreadMethod ?? 'pad';
    tag = `<linearGradient id="${gid}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%" gradientUnits="userSpaceOnUse" spreadMethod="${spreadMethod}">${stops}</linearGradient>`;
  } else if (cfg.type === 'radial') {
    const cx = cfg.cx ?? 50;
    const cy = cfg.cy ?? 50;
    tag = `<radialGradient id="${gid}" cx="${cx}%" cy="${cy}%" r="50%" gradientUnits="userSpaceOnUse">${stops}</radialGradient>`;
  } else {
    // conic / sweep — approximate as angular linear for SVG compatibility
    const angle = cfg.angle ?? 0;
    const rad = (angle - 90) * (Math.PI / 180);
    const x1 = +(50 - 50 * Math.cos(rad)).toFixed(4);
    const y1 = +(50 - 50 * Math.sin(rad)).toFixed(4);
    const x2 = +(50 + 50 * Math.cos(rad)).toFixed(4);
    const y2 = +(50 + 50 * Math.sin(rad)).toFixed(4);
    tag = `<linearGradient id="${gid}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%" gradientUnits="userSpaceOnUse">${stops}</linearGradient>`;
  }
  return { id: gid, defs: tag };
}

/**
 * Build a metallic gradient from a MetalPalette.
 */
export function buildMetalGradientDef(
  metal: MetalPalette,
  angle = 135,
  id?: string,
  w = 800,
  h = 200,
): { id: string; defs: string } {
  return buildGradientDef(
    {
      type: 'linear',
      angle,
      stops: metal.gradient,
      gradientUnits: 'userSpaceOnUse',
      x1: 0, y1: 0, x2: w, y2: h,
    },
    id,
  );
}

/**
 * Resolve a ColorSpec to a CSS color string or `url(#id)` fill reference.
 * Also returns any defs that need to be injected into the SVG.
 *
 * Usage:
 *   const { fill, defs } = resolveColor(spec, w, h);
 *   // inject defs into <defs>...</defs>
 *   // use fill as the fill="..." attribute
 */
export function resolveColor(
  spec: ColorSpec,
  w = 800,
  h = 200,
): { fill: string; defs: string } {
  if (typeof spec === 'string') {
    // Named metal or CSS color
    if (spec in METALS) {
      const metal = METALS[spec as MetalName];
      const { id, defs } = buildMetalGradientDef(metal, 135, undefined, w, h);
      return { fill: `url(#${id})`, defs };
    }
    // Plain CSS color
    return { fill: spec, defs: '' };
  }
  // GradientConfig
  const cfg = spec as GradientConfig;
  const { id, defs } = buildGradientDef(cfg);
  return { fill: `url(#${id})`, defs };
}

// ─────────────────────────────────────────────
// 5. FILTER FACTORIES
// ─────────────────────────────────────────────

export interface FilterOptions {
  blur?: number;          // feGaussianBlur stdDeviation
  glow?: boolean;         // adds bloom glow
  glowColor?: CSSColor;
  glowStrength?: number;  // 0–5
  noise?: boolean;        // adds feTurbulence noise
  noiseFreq?: number;
  noiseOctaves?: number;
  shadow?: boolean;
  shadowDx?: number;
  shadowDy?: number;
  shadowBlur?: number;
  shadowColor?: CSSColor;
  shadowOpacity?: number;
  innerShadow?: boolean;
  scanlines?: boolean;    // for cyberpunk/retro
}

export function buildFilter(opts: FilterOptions, id?: string): { id: string; defs: string } {
  const fid = id ?? uniqueId('filter');
  const parts: string[] = [];

  if (opts.blur) {
    parts.push(`<feGaussianBlur stdDeviation="${opts.blur}" result="blurred"/>`);
  }

  if (opts.glow) {
    const strength = opts.glowStrength ?? 2;
    const color = opts.glowColor ?? '#ffffff';
    parts.push(`
      <feGaussianBlur stdDeviation="${strength * 3}" result="glow_blur"/>
      <feFlood flood-color="${color}" flood-opacity="0.8" result="glow_color"/>
      <feComposite in="glow_color" in2="glow_blur" operator="in" result="glow_composite"/>
      <feMerge><feMergeNode in="glow_composite"/><feMergeNode in="SourceGraphic"/></feMerge>
    `);
  }

  if (opts.shadow) {
    const dx = opts.shadowDx ?? 4;
    const dy = opts.shadowDy ?? 4;
    const blur = opts.shadowBlur ?? 8;
    const color = opts.shadowColor ?? '#000000';
    const opacity = opts.shadowOpacity ?? 0.5;
    parts.push(`
      <feDropShadow dx="${dx}" dy="${dy}" stdDeviation="${blur}"
        flood-color="${color}" flood-opacity="${opacity}"/>
    `);
  }

  if (opts.noise) {
    const freq = opts.noiseFreq ?? 0.65;
    const oct = opts.noiseOctaves ?? 4;
    parts.push(`
      <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="${oct}" result="noise"/>
      <feComposite in="SourceGraphic" in2="noise" operator="arithmetic" k1="0" k2="0.9" k3="0.1" k4="0"/>
    `);
  }

  const content = parts.join('\n');
  if (!content.trim()) return { id: fid, defs: '' };

  const defs = `<filter id="${fid}" x="-20%" y="-20%" width="140%" height="140%">${content}</filter>`;
  return { id: fid, defs };
}

// ─────────────────────────────────────────────
// 6. TEXT ANIMATION SYSTEM
// ─────────────────────────────────────────────

export type TextAnimationEffect =
  // Basic
  | 'none' | 'typewriter' | 'fade-in' | 'slide-up' | 'slide-down'
  // Glitch / Cyber
  | 'glitch' | 'glitch-rgb' | 'glitch-scan' | 'corrupt'
  // Neon / Glow
  | 'neon-flicker' | 'neon-pulse' | 'neon-breathe'
  // Color
  | 'rainbow' | 'aurora-shift' | 'holographic' | 'fire'
  // Kinetic
  | 'wave' | 'bounce' | 'elastic' | 'spin-in' | 'char-drop'
  // Shimmer
  | 'shimmer' | 'shimmer-gold' | 'mercury-flow'
  // Retro / Special
  | 'matrix' | 'typewriter-delete' | 'scramble' | 'morse' | 'old-tv'
  // 3D
  | '3d-rotate' | 'perspective-tilt' | 'depth-pop';

export interface TextAnimConfig {
  effect: TextAnimationEffect;
  text: string;
  /** Main text color (CSSColor) */
  color?: CSSColor;
  /** Background color */
  bg?: CSSColor;
  /** Font size in px */
  fontSize?: number;
  /** Duration of one cycle in seconds */
  duration?: number;
  /** Repeat count ('indefinite' or number) */
  repeat?: string | number;
  /** Font family override */
  fontFamily?: string;
  /** Letter spacing */
  letterSpacing?: number;
}

/**
 * Generate a complete SVG text animation snippet (no outer <svg> tag).
 * Returns { svgContent, defs, animations }
 */
export function buildTextAnimation(
  cfg: TextAnimConfig,
  x: number,
  y: number,
  id?: string,
): { svgContent: string; defs: string; css: string } {
  const aid = id ?? uniqueId('tanim');
  const color = cfg.color ?? '#ffffff';
  const fontSize = cfg.fontSize ?? 48;
  const duration = cfg.duration ?? 3;
  const fontFamily = cfg.fontFamily ?? 'monospace';
  const ls = cfg.letterSpacing ?? 2;
  const text = cfg.text;

  switch (cfg.effect) {
    case 'typewriter': {
      const charW = fontSize * 0.6;
      const totalW = text.length * charW;
      return {
        defs: `
          <clipPath id="${aid}_clip">
            <rect x="${x}" y="${y - fontSize}" width="0" height="${fontSize * 1.4}">
              <animate attributeName="width" from="0" to="${totalW}" dur="${duration}s" fill="freeze"/>
            </rect>
          </clipPath>`,
        svgContent: `
          <text clip-path="url(#${aid}_clip)" x="${x}" y="${y}" font-size="${fontSize}" fill="${color}"
            font-family="${fontFamily}" letter-spacing="${ls}" dominant-baseline="auto">${text}</text>
          <rect x="${x}" y="${y - fontSize + 4}" width="2" height="${fontSize - 4}" fill="${color}" opacity="0.8">
            <animate attributeName="opacity" values="1;0;1" dur="0.8s" repeatCount="indefinite"/>
            <animate attributeName="x" from="${x}" to="${x + totalW}" dur="${duration}s" fill="freeze"/>
          </rect>`,
        css: '',
      };
    }

    case 'glitch-rgb': {
      return {
        defs: `
          <filter id="${aid}_f">
            <feTurbulence id="${aid}_turb" type="turbulence" baseFrequency="0.02 0.8"
              numOctaves="2" result="noise" seed="2">
              <animate attributeName="baseFrequency" values="0.02 0.8;0.5 0.1;0.02 0.8"
                dur="${duration * 0.5}s" repeatCount="indefinite"/>
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G"/>
          </filter>`,
        svgContent: `
          <text x="${x + 3}" y="${y}" font-size="${fontSize}" fill="rgba(255,0,0,0.7)"
            font-family="${fontFamily}" letter-spacing="${ls}" filter="url(#${aid}_f)">${text}</text>
          <text x="${x - 3}" y="${y}" font-size="${fontSize}" fill="rgba(0,255,255,0.7)"
            font-family="${fontFamily}" letter-spacing="${ls}">${text}</text>
          <text x="${x}" y="${y}" font-size="${fontSize}" fill="${color}"
            font-family="${fontFamily}" letter-spacing="${ls}">
            <animate attributeName="opacity" values="1;0.8;1;0.9;1" dur="${duration * 0.3}s" repeatCount="indefinite"/>
            ${text}
          </text>`,
        css: '',
      };
    }

    case 'neon-flicker': {
      const glowId = `${aid}_glow`;
      return {
        defs: `
          <filter id="${glowId}">
            <feGaussianBlur stdDeviation="4" result="blur1"/>
            <feGaussianBlur stdDeviation="8" result="blur2"/>
            <feMerge><feMergeNode in="blur2"/><feMergeNode in="blur1"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>`,
        svgContent: `
          <text x="${x}" y="${y}" font-size="${fontSize}" fill="${color}"
            font-family="${fontFamily}" letter-spacing="${ls}" filter="url(#${glowId})">
            <animate attributeName="opacity" values="1;0.95;1;0.3;1;0.9;1;0.4;1;0.97;1"
              dur="${duration}s" repeatCount="indefinite"/>
            ${text}
          </text>`,
        css: '',
      };
    }

    case 'rainbow': {
      return {
        defs: `
          <linearGradient id="${aid}_rbow" x1="0%" y1="0%" x2="100%" y2="0%"
            gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#ff0000"/>
            <stop offset="16%" stop-color="#ff8800"/>
            <stop offset="33%" stop-color="#ffff00"/>
            <stop offset="50%" stop-color="#00ff00"/>
            <stop offset="66%" stop-color="#0088ff"/>
            <stop offset="83%" stop-color="#8800ff"/>
            <stop offset="100%" stop-color="#ff0088"/>
            <animateTransform attributeName="gradientTransform" type="translate"
              from="-200 0" to="200 0" dur="${duration}s" repeatCount="indefinite"/>
          </linearGradient>`,
        svgContent: `
          <text x="${x}" y="${y}" font-size="${fontSize}" fill="url(#${aid}_rbow)"
            font-family="${fontFamily}" letter-spacing="${ls}">${text}</text>`,
        css: '',
      };
    }

    case 'aurora-shift': {
      return {
        defs: `
          <linearGradient id="${aid}_aurora" x1="0%" y1="0%" x2="100%" y2="0%"
            gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#00C8FF">
              <animate attributeName="stop-color" values="#00C8FF;#8800FF;#FF0080;#00C8FF"
                dur="${duration * 2}s" repeatCount="indefinite"/>
            </stop>
            <stop offset="50%" stop-color="#8800FF">
              <animate attributeName="stop-color" values="#8800FF;#FF0080;#00FFB0;#8800FF"
                dur="${duration * 2}s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stop-color="#00FFB0">
              <animate attributeName="stop-color" values="#00FFB0;#00C8FF;#8800FF;#00FFB0"
                dur="${duration * 2}s" repeatCount="indefinite"/>
            </stop>
          </linearGradient>`,
        svgContent: `
          <text x="${x}" y="${y}" font-size="${fontSize}" fill="url(#${aid}_aurora)"
            font-family="${fontFamily}" letter-spacing="${ls}">${text}</text>`,
        css: '',
      };
    }

    case 'holographic': {
      return {
        defs: `
          <linearGradient id="${aid}_holo" x1="0%" y1="0%" x2="100%" y2="100%"
            gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#FF80FF"/>
            <stop offset="25%" stop-color="#80FFFF"/>
            <stop offset="50%" stop-color="#FF80A0"/>
            <stop offset="75%" stop-color="#80A0FF"/>
            <stop offset="100%" stop-color="#FF80FF"/>
            <animateTransform attributeName="gradientTransform" type="rotate"
              from="0 400 100" to="360 400 100" dur="${duration}s" repeatCount="indefinite"/>
          </linearGradient>
          <filter id="${aid}_hf">
            <feGaussianBlur stdDeviation="1" result="b"/>
            <feComposite in="SourceGraphic" in2="b" operator="over"/>
          </filter>`,
        svgContent: `
          <text x="${x}" y="${y}" font-size="${fontSize}" fill="url(#${aid}_holo)"
            font-family="${fontFamily}" letter-spacing="${ls}" filter="url(#${aid}_hf)"
            style="paint-order: stroke fill;">
            <animate attributeName="opacity" values="0.9;1;0.85;1;0.95;1" dur="2s" repeatCount="indefinite"/>
            ${text}
          </text>`,
        css: '',
      };
    }

    case 'fire': {
      return {
        defs: `
          <linearGradient id="${aid}_fire" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#FF0000">
              <animate attributeName="stop-color" values="#FF0000;#FF4400;#FF0000" dur="0.5s" repeatCount="indefinite"/>
            </stop>
            <stop offset="40%" stop-color="#FF6600">
              <animate attributeName="stop-color" values="#FF6600;#FF8800;#FF6600" dur="0.7s" repeatCount="indefinite"/>
            </stop>
            <stop offset="80%" stop-color="#FFFF00">
              <animate attributeName="stop-color" values="#FFFF00;#FFcc00;#FFFF00" dur="0.4s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stop-color="#FFFFFF"/>
          </linearGradient>
          <filter id="${aid}_ff">
            <feTurbulence type="turbulence" baseFrequency="0.02 0.06" numOctaves="3" result="noise">
              <animate attributeName="baseFrequency" values="0.02 0.06;0.04 0.08;0.02 0.06" dur="0.5s" repeatCount="indefinite"/>
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
          </filter>`,
        svgContent: `
          <text x="${x}" y="${y}" font-size="${fontSize}" fill="url(#${aid}_fire)"
            font-family="${fontFamily}" letter-spacing="${ls}" filter="url(#${aid}_ff)">${text}</text>`,
        css: '',
      };
    }

    case 'wave': {
      const chars = text.split('');
      const charW = fontSize * 0.65;
      const svgChars = chars.map((ch, i) => `
        <text x="${x + i * charW}" y="${y}" font-size="${fontSize}" fill="${color}"
          font-family="${fontFamily}">
          <animateTransform attributeName="transform" type="translate" values="0,0;0,-${fontSize * 0.3};0,0"
            dur="${duration}s" begin="${i * 0.1}s" repeatCount="indefinite"/>
          ${ch}
        </text>`).join('');
      return { defs: '', svgContent: svgChars, css: '' };
    }

    case 'shimmer': {
      return {
        defs: `
          <linearGradient id="${aid}_shim" x1="0%" y1="0%" x2="100%" y2="0%"
            gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="${color}"/>
            <stop offset="40%" stop-color="${color}"/>
            <stop offset="50%" stop-color="#ffffff" stop-opacity="0.9"/>
            <stop offset="60%" stop-color="${color}"/>
            <stop offset="100%" stop-color="${color}"/>
            <animateTransform attributeName="gradientTransform" type="translate"
              from="-400 0" to="400 0" dur="${duration}s" repeatCount="indefinite"/>
          </linearGradient>`,
        svgContent: `
          <text x="${x}" y="${y}" font-size="${fontSize}" fill="url(#${aid}_shim)"
            font-family="${fontFamily}" letter-spacing="${ls}">${text}</text>`,
        css: '',
      };
    }

    case 'shimmer-gold': {
      return {
        defs: `
          <linearGradient id="${aid}_sgold" x1="0%" y1="0%" x2="100%" y2="0%"
            gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#B8860B"/>
            <stop offset="30%" stop-color="#FFD700"/>
            <stop offset="50%" stop-color="#FFFACD"/>
            <stop offset="70%" stop-color="#FFD700"/>
            <stop offset="100%" stop-color="#B8860B"/>
            <animateTransform attributeName="gradientTransform" type="translate"
              from="-400 0" to="400 0" dur="${duration}s" repeatCount="indefinite"/>
          </linearGradient>`,
        svgContent: `
          <text x="${x}" y="${y}" font-size="${fontSize}" fill="url(#${aid}_sgold)"
            font-family="${fontFamily}" letter-spacing="${ls}">${text}</text>`,
        css: '',
      };
    }

    case 'matrix': {
      const cols = Math.ceil(800 / (fontSize * 0.5));
      const rainChars = Array.from({ length: cols }, (_, i) => {
        const delay = (Math.random() * duration).toFixed(2);
        const dur2 = (1 + Math.random() * 2).toFixed(2);
        return `<text x="${i * fontSize * 0.5}" y="0" font-size="${fontSize * 0.4}" fill="#00FF41" opacity="0.4"
          font-family="monospace">
          <animateTransform attributeName="transform" type="translate"
            from="0,0" to="0,${200}" dur="${dur2}s" begin="${delay}s" repeatCount="indefinite"/>
          ${String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))}
        </text>`;
      }).join('');
      return {
        defs: `
          <clipPath id="${aid}_mclip">
            <rect x="0" y="0" width="800" height="${y + fontSize}"/>
          </clipPath>`,
        svgContent: `
          <g clip-path="url(#${aid}_mclip)" opacity="0.5">${rainChars}</g>
          <text x="${x}" y="${y}" font-size="${fontSize}" fill="#00FF41"
            font-family="monospace" letter-spacing="${ls}"
            style="text-shadow: 0 0 10px #00FF41, 0 0 20px #00FF41">${text}</text>`,
        css: '',
      };
    }

    case 'old-tv': {
      return {
        defs: `
          <filter id="${aid}_tv">
            <feTurbulence type="fractalNoise" baseFrequency="0.8 0.1" numOctaves="1" result="noise"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 0.15 0" in="noise" result="tinted"/>
            <feMerge>
              <feMergeNode in="tinted"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>`,
        svgContent: `
          <text x="${x}" y="${y}" font-size="${fontSize}" fill="${color}" filter="url(#${aid}_tv)"
            font-family="${fontFamily}" letter-spacing="${ls}"
            opacity="0.9">
            <animate attributeName="opacity" values="0.9;0.7;0.9;0.8;0.9;0.95;0.9"
              dur="${duration * 0.5}s" repeatCount="indefinite"/>
            ${text}
          </text>`,
        css: '',
      };
    }

    case '3d-rotate': {
      return {
        defs: '',
        svgContent: `
          <text x="${x}" y="${y}" font-size="${fontSize}" fill="${color}"
            font-family="${fontFamily}" letter-spacing="${ls}"
            style="transform-origin: ${x + (text.length * fontSize * 0.3)}px ${y}px">
            <animateTransform attributeName="transform" type="rotate"
              from="0 ${x + (text.length * fontSize * 0.3)} ${y}"
              to="360 ${x + (text.length * fontSize * 0.3)} ${y}"
              dur="${duration}s" repeatCount="indefinite"/>
            ${text}
          </text>`,
        css: '',
      };
    }

    case 'depth-pop': {
      const cx = x + text.length * fontSize * 0.3;
      return {
        defs: '',
        svgContent: `
          <text x="${x}" y="${y}" font-size="${fontSize}" fill="${color}"
            font-family="${fontFamily}" letter-spacing="${ls}"
            stroke="${color}" stroke-width="0.5" paint-order="stroke fill">
            <animateTransform attributeName="transform" type="scale"
              values="1 1;1.05 1.05;1 1" additive="sum"
              dur="${duration}s" repeatCount="indefinite"
              calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1"/>
          </text>`,
        css: '',
      };
    }

    case 'fade-in': {
      return {
        defs: '',
        svgContent: `
          <text x="${x}" y="${y}" font-size="${fontSize}" fill="${color}"
            font-family="${fontFamily}" letter-spacing="${ls}">
            <animate attributeName="opacity" from="0" to="1" dur="${duration}s" fill="freeze"/>
            ${text}
          </text>`,
        css: '',
      };
    }

    case 'slide-up': {
      return {
        defs: '',
        svgContent: `
          <text x="${x}" y="${y}" font-size="${fontSize}" fill="${color}"
            font-family="${fontFamily}" letter-spacing="${ls}">
            <animateTransform attributeName="transform" type="translate"
              from="0,${fontSize * 2}" to="0,0" dur="${duration}s" fill="freeze"
              calcMode="spline" keySplines="0.2 0 0 1"/>
            <animate attributeName="opacity" from="0" to="1" dur="${duration * 0.5}s" fill="freeze"/>
            ${text}
          </text>`,
        css: '',
      };
    }

    case 'bounce': {
      const chars2 = text.split('');
      const cw = fontSize * 0.65;
      const svg2 = chars2.map((ch, i) => `
        <text x="${x + i * cw}" y="${y}" font-size="${fontSize}" fill="${color}"
          font-family="${fontFamily}">
          <animateTransform attributeName="transform" type="translate"
            values="0,0;0,-${fontSize * 0.4};0,0" dur="${duration}s"
            begin="${i * 0.08}s" repeatCount="indefinite"
            calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
          ${ch}
        </text>`).join('');
      return { defs: '', svgContent: svg2, css: '' };
    }

    case 'scramble': {
      // Static scramble approximation (true scramble needs JS)
      return {
        defs: `
          <filter id="${aid}_sc">
            <feTurbulence baseFrequency="0.1" numOctaves="2" result="noise">
              <animate attributeName="seed" values="0;10;20;30;40;0" dur="${duration}s" repeatCount="indefinite"/>
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G"/>
          </filter>`,
        svgContent: `
          <text x="${x}" y="${y}" font-size="${fontSize}" fill="${color}" filter="url(#${aid}_sc)"
            font-family="monospace" letter-spacing="${ls}">${text}</text>`,
        css: '',
      };
    }

    default: {
      // none / fallback
      return {
        defs: '',
        svgContent: `
          <text x="${x}" y="${y}" font-size="${fontSize}" fill="${color}"
            font-family="${fontFamily}" letter-spacing="${ls}">${text}</text>`,
        css: '',
      };
    }
  }
}

// ─────────────────────────────────────────────
// 7. BUTTON SYSTEM  (README-compatible href)
// ─────────────────────────────────────────────

export type ButtonVariant =
  | 'solid' | 'outline' | 'ghost' | 'gradient' | 'glow'
  | '3d' | 'neo' | 'glass' | 'brutalist' | 'pill'
  | 'cta' | 'icon' | 'destructive' | 'retro' | 'pixel';

export interface ButtonConfig {
  label: string;
  /** Destination URL — used in <a> wrapper for README clicking */
  href?: string;
  variant?: ButtonVariant;
  color?: ColorSpec;
  textColor?: CSSColor;
  width?: number;
  height?: number;
  fontSize?: number;
  borderRadius?: number;
  icon?: string; // SVG path data or emoji
  iconPosition?: 'left' | 'right';
  theme?: Theme;
  animated?: boolean;
  fullWidth?: boolean;
}

/**
 * Render a README-compatible SVG button.
 *
 * README NOTE: SVG images embedded via ![](url) cannot be clicked.
 * To make a clickable button in a README use:
 *   [![Label](https://your-api.com/api/button?label=Click+Me)](https://destination.com)
 *
 * This renderer outputs the SVG image portion only.
 * The caller should wrap it in the markdown link syntax above.
 */
export function renderButton(cfg: ButtonConfig): string {
  const {
    label, variant = 'solid', width = 200, height = 48,
    fontSize = 15, borderRadius = 8, theme = 'dark', animated = true,
  } = cfg;

  const w = width, h = height;
  const cx = w / 2, cy = h / 2;

  // Resolve color
  const colorSpec: ColorSpec = cfg.color ?? 'electric';
  let fillDef = '';
  let fillVal = '';
  {
    const { fill, defs } = resolveColor(colorSpec, w, h);
    fillVal = fill;
    fillDef = defs;
  }

  const textColor = cfg.textColor ?? '#ffffff';
  const br = borderRadius;

  let buttonShape = '';
  let buttonText = '';
  let buttonEffects = '';
  let extraDefs = '';

  switch (variant) {
    case 'solid': {
      buttonShape = `<rect x="0" y="0" width="${w}" height="${h}" rx="${br}" fill="${fillVal}"/>`;
      if (animated) {
        buttonShape += `<rect x="0" y="0" width="${w}" height="${h}" rx="${br}" fill="rgba(255,255,255,0.15)" opacity="0">
          <animate attributeName="opacity" values="0;0.3;0" dur="2s" repeatCount="indefinite"/>
        </rect>`;
      }
      buttonText = `<text x="${cx}" y="${cy + fontSize * 0.35}" text-anchor="middle" font-size="${fontSize}"
        fill="${textColor}" font-family="system-ui,sans-serif" font-weight="600">${label}</text>`;
      break;
    }
    case 'outline': {
      buttonShape = `
        <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="${br}" fill="transparent" stroke="${fillVal}" stroke-width="2"/>`;
      buttonText = `<text x="${cx}" y="${cy + fontSize * 0.35}" text-anchor="middle" font-size="${fontSize}"
        fill="${fillVal}" font-family="system-ui,sans-serif" font-weight="600">${label}</text>`;
      break;
    }
    case 'gradient': {
      const gid = uniqueId('btn_grad');
      extraDefs += `<linearGradient id="${gid}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${METALS.aurora.gradient[0].color}"/>
        <stop offset="50%" stop-color="${METALS['neon-purple'].primary}"/>
        <stop offset="100%" stop-color="${METALS['neon-pink'].primary}"/>
      </linearGradient>`;
      buttonShape = `<rect x="0" y="0" width="${w}" height="${h}" rx="${br}" fill="url(#${gid})"/>`;
      buttonText = `<text x="${cx}" y="${cy + fontSize * 0.35}" text-anchor="middle" font-size="${fontSize}"
        fill="#fff" font-family="system-ui,sans-serif" font-weight="700">${label}</text>`;
      break;
    }
    case 'glow': {
      const glowFid = uniqueId('btn_glow');
      extraDefs += `<filter id="${glowFid}">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>`;
      buttonShape = `
        <rect x="0" y="0" width="${w}" height="${h}" rx="${br}" fill="${fillVal}" filter="url(#${glowFid})"/>`;
      buttonText = `<text x="${cx}" y="${cy + fontSize * 0.35}" text-anchor="middle" font-size="${fontSize}"
        fill="#fff" font-family="system-ui,sans-serif" font-weight="700">${label}</text>`;
      break;
    }
    case '3d': {
      const shadow3d = METALS[typeof colorSpec === 'string' && colorSpec in METALS ? colorSpec as MetalName : 'electric'].shadow;
      buttonShape = `
        <rect x="4" y="6" width="${w}" height="${h}" rx="${br}" fill="${shadow3d}"/>
        <rect x="0" y="0" width="${w}" height="${h}" rx="${br}" fill="${fillVal}"/>
        <rect x="0" y="0" width="${w}" height="${h / 3}" rx="${br}" fill="rgba(255,255,255,0.2)"/>`;
      buttonText = `<text x="${cx}" y="${cy + fontSize * 0.35}" text-anchor="middle" font-size="${fontSize}"
        fill="${textColor}" font-family="system-ui,sans-serif" font-weight="700">${label}</text>`;
      break;
    }
    case 'neo': {
      const bg = theme === 'dark' ? '#1e2030' : '#E0E5EC';
      const shadow1 = theme === 'dark' ? '#0a0c18' : '#a3b1c6';
      const shadow2 = theme === 'dark' ? '#323660' : '#ffffff';
      buttonShape = `
        <rect x="0" y="0" width="${w}" height="${h}" rx="${br}" fill="${bg}"/>
        <rect x="0" y="0" width="${w}" height="${h}" rx="${br}" fill="none"
          style="filter: drop-shadow(-3px -3px 6px ${shadow2}) drop-shadow(3px 3px 6px ${shadow1})"/>`;
      buttonText = `<text x="${cx}" y="${cy + fontSize * 0.35}" text-anchor="middle" font-size="${fontSize}"
        fill="${theme === 'dark' ? '#aab0d0' : '#5a6a8a'}" font-family="system-ui,sans-serif" font-weight="600">${label}</text>`;
      break;
    }
    case 'glass': {
      buttonShape = `
        <rect x="0" y="0" width="${w}" height="${h}" rx="${br}" fill="rgba(255,255,255,0.1)"
          stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
        <rect x="0" y="0" width="${w}" height="${h / 2}" rx="${br}" fill="rgba(255,255,255,0.05)"/>`;
      buttonText = `<text x="${cx}" y="${cy + fontSize * 0.35}" text-anchor="middle" font-size="${fontSize}"
        fill="rgba(255,255,255,0.9)" font-family="system-ui,sans-serif" font-weight="600">${label}</text>`;
      break;
    }
    case 'brutalist': {
      buttonShape = `
        <rect x="4" y="4" width="${w}" height="${h}" rx="0" fill="#000"/>
        <rect x="0" y="0" width="${w}" height="${h}" rx="0" fill="${fillVal}" stroke="#000" stroke-width="3"/>`;
      buttonText = `<text x="${cx}" y="${cy + fontSize * 0.35}" text-anchor="middle" font-size="${fontSize}"
        fill="#000" font-family="'Arial Black',sans-serif" font-weight="900">${label}</text>`;
      break;
    }
    case 'pill': {
      const pillR = h / 2;
      buttonShape = `<rect x="0" y="0" width="${w}" height="${h}" rx="${pillR}" fill="${fillVal}"/>`;
      buttonText = `<text x="${cx}" y="${cy + fontSize * 0.35}" text-anchor="middle" font-size="${fontSize}"
        fill="${textColor}" font-family="system-ui,sans-serif" font-weight="600">${label}</text>`;
      break;
    }
    case 'cta': {
      const ctaGid = uniqueId('cta_g');
      extraDefs += `<linearGradient id="${ctaGid}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#6C3AF4"/>
        <stop offset="100%" stop-color="#C026D3"/>
      </linearGradient>`;
      const ctaFid = uniqueId('cta_f');
      extraDefs += `<filter id="${ctaFid}">
        <feGaussianBlur stdDeviation="8" result="glow"/>
        <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>`;
      buttonShape = `
        <rect x="2" y="8" width="${w - 4}" height="${h}" rx="${br}" fill="rgba(108,58,244,0.4)" filter="url(#${ctaFid})"/>
        <rect x="0" y="0" width="${w}" height="${h}" rx="${br}" fill="url(#${ctaGid})"/>
        <rect x="0" y="0" width="${w}" height="${h / 2.5}" rx="${br}" fill="rgba(255,255,255,0.15)"/>`;
      buttonText = `<text x="${cx}" y="${cy + fontSize * 0.35}" text-anchor="middle" font-size="${fontSize}"
        fill="#fff" font-family="system-ui,sans-serif" font-weight="700" letter-spacing="0.5">${label}</text>`;
      break;
    }
    case 'retro': {
      buttonShape = `
        <rect x="3" y="3" width="${w}" height="${h}" rx="2" fill="#8B4513"/>
        <rect x="0" y="0" width="${w}" height="${h}" rx="2" fill="${fillVal}"
          stroke="#FFD700" stroke-width="2"/>
        <rect x="2" y="2" width="${w - 4}" height="${h * 0.4}" rx="1" fill="rgba(255,255,255,0.15)"/>`;
      buttonText = `<text x="${cx}" y="${cy + fontSize * 0.35}" text-anchor="middle" font-size="${fontSize}"
        fill="#FFD700" font-family="'Georgia',serif" font-weight="bold">${label}</text>`;
      break;
    }
    case 'pixel': {
      // Pixelated stepped shadow
      buttonShape = `
        <rect x="4" y="4" width="${w}" height="${h}" fill="#000"/>
        <rect x="0" y="0" width="${w}" height="${h}" fill="${fillVal}"/>
        <rect x="0" y="0" width="${w}" height="4" fill="rgba(255,255,255,0.4)"/>
        <rect x="0" y="0" width="4" height="${h}" fill="rgba(255,255,255,0.2)"/>`;
      buttonText = `<text x="${cx}" y="${cy + fontSize * 0.35}" text-anchor="middle" font-size="${fontSize}"
        fill="${textColor}" font-family="'Courier New',monospace" font-weight="700">${label}</text>`;
      break;
    }
    default: {
      buttonShape = `<rect x="0" y="0" width="${w}" height="${h}" rx="${br}" fill="${fillVal}"/>`;
      buttonText = `<text x="${cx}" y="${cy + fontSize * 0.35}" text-anchor="middle" font-size="${fontSize}"
        fill="${textColor}" font-family="system-ui,sans-serif" font-weight="600">${label}</text>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h + 8}"
    viewBox="0 0 ${w} ${h + 8}" role="img" aria-label="${label}">
    <title>${label}</title>
    <defs>
      ${fillDef}
      ${extraDefs}
    </defs>
    <g transform="translate(0,4)">
      ${buttonShape}
      ${buttonEffects}
      ${buttonText}
    </g>
  </svg>`;
}

// ─────────────────────────────────────────────
// 8. THEME SYSTEM
// ─────────────────────────────────────────────

export interface ThemeColors {
  bg: CSSColor;
  surface: CSSColor;
  surface2: CSSColor;
  border: CSSColor;
  text: CSSColor;
  textMuted: CSSColor;
  accent: CSSColor;
  shadow1: CSSColor;
  shadow2: CSSColor;
}

export function getThemeColors(
  theme: Theme,
  style: DesignStyle = 'metallic',
): ThemeColors {
  const preset = DESIGN_STYLES[style];
  const isDark = theme === 'dark';

  return {
    bg: isDark ? preset.bgDark : preset.bgLight,
    surface: isDark ? preset.surfaceDark : preset.surfaceLight,
    surface2: isDark
      ? lighten(preset.surfaceDark, 10)
      : darken(preset.surfaceLight, 8),
    border: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
    text: isDark ? '#FAFAFA' : '#0F0F0F',
    textMuted: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
    accent: preset.accent,
    shadow1: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.15)',
    shadow2: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)',
  };
}

// ─────────────────────────────────────────────
// 9. COLOR UTILITIES
// ─────────────────────────────────────────────

/** Lighten a hex color by percentage (rough approximation) */
export function lighten(hex: CSSColor, pct: number): CSSColor {
  try {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, ((num >> 16) & 0xff) + Math.round(2.55 * pct));
    const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(2.55 * pct));
    const b = Math.min(255, (num & 0xff) + Math.round(2.55 * pct));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  } catch { return hex; }
}

/** Darken a hex color by percentage */
export function darken(hex: CSSColor, pct: number): CSSColor {
  return lighten(hex, -pct);
}

/** Mix two hex colors */
export function mixColors(c1: CSSColor, c2: CSSColor, weight = 0.5): CSSColor {
  try {
    const n1 = parseInt(c1.replace('#', ''), 16);
    const n2 = parseInt(c2.replace('#', ''), 16);
    const r = Math.round(((n1 >> 16) & 0xff) * weight + ((n2 >> 16) & 0xff) * (1 - weight));
    const g = Math.round(((n1 >> 8) & 0xff) * weight + ((n2 >> 8) & 0xff) * (1 - weight));
    const b = Math.round((n1 & 0xff) * weight + (n2 & 0xff) * (1 - weight));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  } catch { return c1; }
}

/** Create a complementary color */
export function complementary(hex: CSSColor): CSSColor {
  try {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = 255 - ((num >> 16) & 0xff);
    const g = 255 - ((num >> 8) & 0xff);
    const b = 255 - (num & 0xff);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  } catch { return hex; }
}

/** Convert hex to rgba */
export function hexToRgba(hex: CSSColor, alpha: number): CSSColor {
  try {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = (num >> 16) & 0xff;
    const g = (num >> 8) & 0xff;
    const b = num & 0xff;
    return `rgba(${r},${g},${b},${alpha})`;
  } catch { return hex; }
}

/**
 * Build a quick multi-stop gradient from an array of colors.
 * Stops are distributed evenly unless positions are provided.
 */
export function quickGradient(
  colors: CSSColor[],
  angle = 135,
  type: 'linear' | 'radial' = 'linear',
): GradientConfig {
  const stops: GradientStop[] = colors.map((color, i) => ({
    color,
    position: Math.round((i / (colors.length - 1)) * 100),
  }));
  return { type, stops, angle };
}

/**
 * Parse a comma-separated color list string into a GradientConfig.
 * e.g. '#ff0000,#00ff00,#0000ff'  →  GradientConfig
 */
export function parseColorList(colorStr: string, angle = 135): GradientConfig {
  const colors = colorStr.split(',').map(c => c.trim()).filter(Boolean);
  if (colors.length === 1) {
    return { type: 'linear', stops: [{ color: colors[0], position: 0 }, { color: colors[0], position: 100 }], angle };
  }
  return quickGradient(colors, angle);
}

// ─────────────────────────────────────────────
// 10. IMAGE / GIF / LOGO CONTAINER HELPERS
// ─────────────────────────────────────────────

/**
 * Build an SVG <image> element that correctly references a remote URL.
 *
 * README NOTE: GitHub's SVG image proxy strips <image> tags for security.
 * For actual image embedding in README, use standard markdown:
 *   ![alt](url)  or  <img src="url" width="x" height="y">
 *
 * This function produces a decorative frame SVG that embeds the image URL.
 * The result works in browsers and GitHub Pages but NOT in GitHub README markdown.
 *
 * For README usage, generate the frame as a standalone SVG and link it with:
 *   [![](frame-url)](destination)
 */
export function buildImageElement(
  src: string,
  x: number,
  y: number,
  w: number,
  h: number,
  clipId?: string,
  preserveAspectRatio = 'xMidYMid slice',
): string {
  const href = src.startsWith('data:') || src.startsWith('http') || src.startsWith('/') ? src : `https://${src}`;
  const clipAttr = clipId ? `clip-path="url(#${clipId})"` : '';
  return `<image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}"
    preserveAspectRatio="${preserveAspectRatio}" ${clipAttr}/>`;
}

/**
 * Build a clip path for rounded image containers.
 */
export function buildClipRect(
  id: string,
  x: number, y: number, w: number, h: number,
  rx = 12, ry = 12,
): string {
  return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ry="${ry}"/></clipPath>`;
}

/**
 * Build a placeholder grid for when no image src is provided.
 */
export function buildPlaceholder(
  x: number, y: number, w: number, h: number,
  color = '#444', label = 'Image',
): string {
  const cx = x + w / 2;
  const cy = y + h / 2;
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" opacity="0.3"/>
    <line x1="${x}" y1="${y}" x2="${x + w}" y2="${y + h}" stroke="${color}" stroke-width="1" opacity="0.4"/>
    <line x1="${x + w}" y1="${y}" x2="${x}" y2="${y + h}" stroke="${color}" stroke-width="1" opacity="0.4"/>
    <text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="14" fill="${color}" opacity="0.6"
      font-family="system-ui,sans-serif">${label}</text>`;
}

// ─────────────────────────────────────────────
// 11. SVG DOCUMENT WRAPPER
// ─────────────────────────────────────────────

export interface SVGDocOptions {
  width: number;
  height: number;
  title?: string;
  desc?: string;
  /** Extra xmlns for animations */
  xmlnsXlink?: boolean;
  /** Inline CSS styles */
  css?: string;
  /** Theme for background */
  theme?: Theme;
  style?: DesignStyle;
  /** Explicit background color override */
  bg?: CSSColor;
}

export function svgOpen(opts: SVGDocOptions): string {
  const { width, height, title, desc, css = '', theme = 'dark', style = 'metallic', bg } = opts;
  const themeColors = getThemeColors(theme, style);
  const bgColor = bg ?? themeColors.bg;
  const xmlnsXlink = opts.xmlnsXlink ? ' xmlns:xlink="http://www.w3.org/1999/xlink"' : '';

  return `<svg xmlns="http://www.w3.org/2000/svg"${xmlnsXlink}
  width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
  role="img"${title ? ` aria-label="${title}"` : ''}>
  ${title ? `<title>${title}</title>` : ''}
  ${desc ? `<desc>${desc}</desc>` : ''}
  ${css ? `<style>${css}</style>` : ''}
  <rect width="${width}" height="${height}" fill="${bgColor}"/>`;
}

export function svgClose(): string {
  return `</svg>`;
}

// ─────────────────────────────────────────────
// 12. LAYOUT HELPERS
// ─────────────────────────────────────────────

/** Center-align x for text of given approximate width */
export function centerX(containerW: number, textW: number): number {
  return (containerW - textW) / 2;
}

/** Distribute items evenly across a width */
export function distribute(count: number, totalW: number, itemW: number): number[] {
  const gap = (totalW - count * itemW) / (count + 1);
  return Array.from({ length: count }, (_, i) => gap + i * (itemW + gap));
}

/** Generate a wave path (sine wave) */
export function wavePath(
  w: number,
  yBase: number,
  amplitude: number,
  frequency = 1,
  phase = 0,
  steps = 100,
): string {
  const pts = Array.from({ length: steps + 1 }, (_, i) => {
    const x = (i / steps) * w;
    const y = yBase + amplitude * Math.sin((i / steps) * Math.PI * 2 * frequency + phase);
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  });
  return pts.join(' ');
}

/** Generate a zigzag path */
export function zigzagPath(w: number, y: number, amplitude: number, segments: number): string {
  const segW = w / segments;
  const pts = Array.from({ length: segments + 1 }, (_, i) => {
    const x = i * segW;
    const zy = i % 2 === 0 ? y : y + amplitude;
    return `${i === 0 ? 'M' : 'L'} ${x} ${zy}`;
  });
  return pts.join(' ');
}

/** Generate hexagon points */
export function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(' ');
}

/** Generate star polygon points */
export function starPoints(cx: number, cy: number, outerR: number, innerR: number, points = 5): string {
  return Array.from({ length: points * 2 }, (_, i) => {
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(' ');
}

// ─────────────────────────────────────────────
// 13. NAVBAR HELPERS
// ─────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavbarConfig {
  brand: string;
  brandHref?: string;
  items: NavItem[];
  color?: ColorSpec;
  theme?: Theme;
  style?: DesignStyle;
  width?: number;
  height?: number;
  logoText?: string;
}

// ─────────────────────────────────────────────
// 14. CARD STYLE HELPERS
// ─────────────────────────────────────────────

/** Neumorphism shadow pair for a given bg color */
export function neoShadows(bg: CSSColor, intensity = 1): { light: CSSColor; dark: CSSColor } {
  return {
    light: lighten(bg, 15 * intensity),
    dark: darken(bg, 15 * intensity),
  };
}

/** Glassmorphism border gradient */
export function glassBorder(id: string, color = '#ffffff', opacity = 0.2): string {
  return `<linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${color}" stop-opacity="${opacity}"/>
    <stop offset="100%" stop-color="${color}" stop-opacity="${opacity * 0.1}"/>
  </linearGradient>`;
}

/** Clay/Claymorphism inner highlight */
export function clayHighlight(x: number, y: number, w: number, h: number, r: number, id: string): string {
  return `
    <linearGradient id="${id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.6)"/>
      <stop offset="60%" stop-color="rgba(255,255,255,0.0)"/>
    </linearGradient>
    <rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h * 0.5}" rx="${r - 4}" fill="url(#${id})"/>`;
}

/** Material elevation shadow (approximated in SVG) */
export function materialShadow(elevation: 1 | 2 | 3 | 4 | 5 = 2): string {
  const shadows: Record<number, string> = {
    1: 'drop-shadow(0 1px 3px rgba(0,0,0,0.2)) drop-shadow(0 1px 2px rgba(0,0,0,0.14))',
    2: 'drop-shadow(0 3px 6px rgba(0,0,0,0.2)) drop-shadow(0 2px 4px rgba(0,0,0,0.14))',
    3: 'drop-shadow(0 6px 10px rgba(0,0,0,0.2)) drop-shadow(0 1px 18px rgba(0,0,0,0.12))',
    4: 'drop-shadow(0 10px 14px rgba(0,0,0,0.24)) drop-shadow(0 4px 5px rgba(0,0,0,0.14))',
    5: 'drop-shadow(0 16px 24px rgba(0,0,0,0.3)) drop-shadow(0 6px 30px rgba(0,0,0,0.22))',
  };
  return shadows[elevation];
}

// ─────────────────────────────────────────────
// 15. EXPORTS SUMMARY
// ─────────────────────────────────────────────

/**
 * Quick reference of all exports:
 *
 * TYPES:
 *   Theme, CSSColor, GradientStop, GradientConfig, ColorSpec
 *   MetalName, MetalPalette
 *   DesignStyle, DesignSystemPreset
 *   TextAnimationEffect, TextAnimConfig
 *   ButtonVariant, ButtonConfig
 *   ThemeColors, NavItem, NavbarConfig, FilterOptions, SVGDocOptions
 *
 * DATA:
 *   METALS          — 44 metal/color palettes
 *   DESIGN_STYLES   — 28 design system presets
 *
 * COLOR:
 *   resolveColor(spec, w, h)         → { fill, defs }
 *   buildGradientDef(cfg, id?)       → { id, defs }
 *   buildMetalGradientDef(metal, ...) → { id, defs }
 *   quickGradient(colors, angle)     → GradientConfig
 *   parseColorList(str, angle)       → GradientConfig
 *   lighten/darken/mixColors/complementary/hexToRgba
 *
 * FILTERS:
 *   buildFilter(opts, id?)           → { id, defs }
 *
 * TEXT ANIMATIONS (20 effects):
 *   buildTextAnimation(cfg, x, y, id?) → { svgContent, defs, css }
 *
 * BUTTONS (15 variants):
 *   renderButton(cfg)                → SVG string
 *
 * THEME:
 *   getThemeColors(theme, style)     → ThemeColors
 *
 * SVG HELPERS:
 *   svgOpen(opts) / svgClose()
 *   buildImageElement(src, x, y, w, h, clipId)
 *   buildClipRect(id, x, y, w, h, rx, ry)
 *   buildPlaceholder(x, y, w, h, color, label)
 *   uniqueId(prefix)
 *
 * LAYOUT:
 *   centerX, distribute, wavePath, zigzagPath, hexPoints, starPoints
 *
 * CARD HELPERS:
 *   neoShadows, glassBorder, clayHighlight, materialShadow
 */