/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Hafif dokunsal geri bildirim (haptik).
 *
 * Android Chrome `navigator.vibrate`'i destekler; iOS Safari ve masaüstü
 * tarayıcılar bunu sessizce yok sayar — hiçbir yerde hata vermez.
 * Kullanıcının "hareketi azalt" (prefers-reduced-motion) tercihine saygı
 * duyar ve desteklenmeyen ortamlarda sessizce devre dışı kalır.
 */
export type HapticPattern =
  | 'light'   // bir dokunuş: sekme, seçim, çip
  | 'medium'  // daha belirgin bir onay
  | 'heavy'   // güçlü tek darbe
  | 'success' // işlem başarıyla tamamlandı (dilekçe indi, şikayet eklendi)
  | 'warning' // dikkat
  | 'error';  // başarısız

const PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 18,
  heavy: 28,
  success: [14, 40, 22],
  warning: [20, 60, 20],
  error: [30, 50, 30, 50, 30],
};

let reducedMotion = false;
if (typeof window !== 'undefined' && window.matchMedia) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  reducedMotion = mq.matches;
  // Tercih çalışırken değişirse (nadir) güncel kal
  mq.addEventListener?.('change', (e) => {
    reducedMotion = e.matches;
  });
}

export function haptic(pattern: HapticPattern = 'light'): void {
  try {
    if (reducedMotion) return;
    if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
    navigator.vibrate(PATTERNS[pattern]);
  } catch {
    /* Bazı gömülü webview'lerde vibrate hata atabilir — yok say */
  }
}
