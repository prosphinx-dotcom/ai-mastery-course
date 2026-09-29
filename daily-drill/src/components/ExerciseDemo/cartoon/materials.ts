/**
 * Three-tone materials (highlight / base / shadow) for the cartoon figure.
 * Far-side limbs use the `far` set: darker and slightly cooler, which is
 * what makes them read as further from the camera.
 */
export interface Material {
  hi: string;
  base: string;
  lo: string;
}

export interface Palette {
  skin: Material;
  shirt: Material;
  shorts: Material;
  shoe: Material;
  sole: string;
}

export const NEAR: Palette = {
  skin: { hi: '#f7caa4', base: '#e3a47b', lo: '#b27150' },
  shirt: { hi: '#e6ff8f', base: '#c8ff3d', lo: '#82b01a' },
  shorts: { hi: '#6072a0', base: '#43527a', lo: '#2a3553' },
  shoe: { hi: '#ffffff', base: '#e8e8ee', lo: '#a9a9b4' },
  sole: '#ff5b36',
};

export const FAR: Palette = {
  skin: { hi: '#c4906f', base: '#a8765a', lo: '#7a4f38' },
  shirt: { hi: '#a9cf3f', base: '#8fb82a', lo: '#587a12' },
  shorts: { hi: '#3f4c6d', base: '#303b58', lo: '#1d253c' },
  shoe: { hi: '#b9b9c3', base: '#9f9faa', lo: '#6f6f7a' },
  sole: '#b8422a',
};

export const HAIR: Material = { hi: '#54392c', base: '#33231b', lo: '#1c130e' };
export const HEADBAND = '#ff5b36';
export const FEATURE = '#1b1b1f';
