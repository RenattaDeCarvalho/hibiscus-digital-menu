"use client";
import { type Locale, t } from '@/lib/i18n';

export function MenuFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="py-10 px-4 text-center">
      {/* Golden divider line */}
      <div className="max-w-[300px] mx-auto mb-8">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[hsl(40,60%,45%)] to-transparent" />
      </div>
      
      <p className="font-serif text-[hsl(40,50%,50%)] text-base italic mb-3">
        {t('footer', locale)}
      </p>
      <p className="text-[hsl(40,10%,35%)] text-[11px] tracking-[0.3em] uppercase">
        HIBISCUS &middot; PANAMBY HOTEL &middot; SÃO PAULO
      </p>
    </footer>
  );
}
