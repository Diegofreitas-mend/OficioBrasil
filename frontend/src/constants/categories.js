const FALLBACK = {
  icon: '📚',
  gradient: 'linear-gradient(135deg,#1a1a1a,#333)',
  bannerGradient: 'linear-gradient(135deg,#0a0a0a,#222)',
};

export const CATEGORIES = {
  'Elétrica': {
    icon: '⚡',
    gradient: 'linear-gradient(135deg,#1d4ed8,#3b82f6)',
    bannerGradient: 'linear-gradient(135deg,#1e3a8a,#3b82f6)',
  },
  'Refrigeração': {
    icon: '❄',
    gradient: 'linear-gradient(135deg,#0e7490,#22d3ee)',
    bannerGradient: 'linear-gradient(135deg,#164e63,#0891b2)',
  },
  'Marcenaria': {
    icon: '🪚',
    gradient: 'linear-gradient(135deg,#92400e,#d97706)',
    bannerGradient: 'linear-gradient(135deg,#78350f,#d97706)',
  },
  'Soldagem': {
    icon: '🔥',
    gradient: 'linear-gradient(135deg,#9a3412,#f97316)',
    bannerGradient: 'linear-gradient(135deg,#7c2d12,#ea580c)',
  },
  'Hidráulica': {
    icon: '💧',
    gradient: 'linear-gradient(135deg,#0f766e,#14b8a6)',
    bannerGradient: 'linear-gradient(135deg,#134e4a,#0d9488)',
  },
  'Automotiva': {
    icon: '🔧',
    gradient: 'linear-gradient(135deg,#991b1b,#ef4444)',
    bannerGradient: 'linear-gradient(135deg,#7f1d1d,#dc2626)',
  },
};

export function getCategory(categoria) {
  return CATEGORIES[categoria] ?? FALLBACK;
}
