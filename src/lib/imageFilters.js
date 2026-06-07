/** Shared document image filter ids for suite + ScanVault optimizers. */
export const SUITE_FILTERS = [
  { id: 'original', label: 'Original', filter: 'original' },
  { id: 'grayscale', label: 'Grayscale', filter: 'grayscale' },
  { id: 'high-contrast', label: 'High Contrast', filter: 'high-contrast' },
  { id: 'magic-color', label: 'Magic Color', filter: 'magic-color' },
]

export const SCANVAULT_FILTERS = [
  { id: 'auto', label: 'Auto', filter: 'magic-color' },
  { id: 'bw', label: 'B&W', filter: 'high-contrast' },
  { id: 'grayscale', label: 'Grayscale', filter: 'grayscale' },
  { id: 'color', label: 'Color', filter: 'magic-color' },
  { id: 'photo', label: 'Photo', filter: 'original' },
]
