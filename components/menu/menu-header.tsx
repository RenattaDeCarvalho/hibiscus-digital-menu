"use client";
import Image from "next/image";
import { type Locale, t } from "@/lib/i18n";
import { ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";

interface MenuHeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  showBack?: boolean;
  onBack?: () => void;
}

export function MenuHeader({
  locale,
  onLocaleChange,
  showBack,
  onBack,
}: MenuHeaderProps) {
  const locales: Locale[] = ["pt", "en", "es"];

  return (
    <header className="sticky top-0 z-50 w-full bg-[hsl(0,0%,5%)]/90 backdrop-blur-md border-b border-[hsl(40,20%,15%)]/30">
      <div className="max-w-[800px] mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-[100px]">
          {showBack ? (
            <button
              onClick={() => onBack?.()}
              className="flex items-center gap-1.5 text-[hsl(40,20%,70%)] hover:text-[hsl(40,60%,55%)] transition-colors text-xs font-medium tracking-[0.2em] uppercase"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("back", locale)}
            </button>
          ) : (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-[hsl(40,10%,45%)] hover:text-[hsl(40,60%,55%)] transition-colors text-[11px] tracking-[0.2em] uppercase"
            >
              <Settings className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {showBack ? (
          <span className="font-serif text-[hsl(40,20%,85%)] text-xl italic tracking-wide">
            Hibiscus
          </span>
        ) : (
          <div className="relative w-20 h-20">
            <Image
              src="/logo-hibiscus.png"
              alt="Hibiscus - Panamby Hotel"
              fill
              className="object-contain"
            />
          </div>
        )}

        <div className="flex items-center gap-3 min-w-[100px] justify-end">
          {locales?.map?.((l: Locale) => (
            <button
              key={l}
              onClick={() => onLocaleChange?.(l)}
              className={`text-xs font-semibold tracking-wider transition-colors ${
                locale === l
                  ? "text-[hsl(40,60%,55%)]"
                  : "text-[hsl(40,10%,40%)] hover:text-[hsl(40,20%,60%)]"
              }`}
            >
              {l?.toUpperCase?.() ?? ""}
            </button>
          )) ?? []}
        </div>
      </div>
    </header>
  );
}
