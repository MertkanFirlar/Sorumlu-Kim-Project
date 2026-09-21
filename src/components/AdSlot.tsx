import React, { useEffect } from 'react';

/**
 * Google AdSense (web ads) slot.
 *
 * TEK ADIMDA AKTİF ETME:
 *   AdSense onayın gelince publisher id'ni buraya yapıştır (ör. "ca-pub-1234567890123456").
 *   Boş kaldığı sürece canlıda HİÇBİR ŞEY göstermez (temiz kalır); sadece dev'de
 *   yerini görmen için ince bir placeholder çıkar.
 *
 * Not: AdSense mobil değil WEB reklamıdır (AdMob mobil uygulama içindir).
 */
export const ADSENSE_CLIENT = ''; // <-- "ca-pub-XXXXXXXXXXXXXXXX" yapıştır

interface AdSlotProps {
  /** AdSense reklam birimi (ad unit) id'si */
  slot?: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export const AdSlot: React.FC<AdSlotProps> = ({ slot = '', className = '' }) => {
  const isLive = ADSENSE_CLIENT.startsWith('ca-pub-');

  useEffect(() => {
    if (!isLive) return;
    // AdSense kütüphanesini bir kez yükle
    const scriptId = 'adsbygoogle-js';
    if (!document.getElementById(scriptId)) {
      const s = document.createElement('script');
      s.id = scriptId;
      s.async = true;
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
      s.crossOrigin = 'anonymous';
      document.head.appendChild(s);
    }
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ad blocker vb. — sessiz geç */
    }
  }, [isLive]);

  // Henüz publisher id yoksa: canlıda hiçbir şey gösterme, sadece dev'de yer belli olsun
  if (!isLive) {
    if ((import.meta as any).env?.DEV) {
      return (
        <div
          className={`w-full flex items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-[#F8F9FA] text-neutral-400 text-[11px] py-4 ${className}`}
        >
          Reklam alanı — AdSense onayı sonrası burada gösterilecek
        </div>
      );
    }
    return null;
  }

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={{ display: 'block' }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};
