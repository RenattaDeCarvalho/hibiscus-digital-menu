"use client";
import { Search } from 'lucide-react';
import { type Locale, t } from '@/lib/i18n';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  locale: Locale;
}

export function SearchBar({ value, onChange, locale }: SearchBarProps) {
  return (
    <div className="relative max-w-[600px] mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(40,10%,40%)]" />
      <input
        type="text"
        value={value ?? ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e?.target?.value ?? '')}
        placeholder={t('searchPlaceholder', locale)}
        className="w-full bg-[hsl(0,0%,8%)] border border-[hsl(40,15%,18%)] rounded-full py-3.5 pl-11 pr-4 text-sm text-[hsl(40,20%,85%)] placeholder:text-[hsl(40,10%,35%)] focus:outline-none focus:border-[hsl(40,40%,30%)] transition-colors"
      />
    </div>
  );
}
