"use client";
import Image from 'next/image';
import { type Locale, getLocalizedName, getLocalizedDesc } from '@/lib/i18n';
import { motion } from 'framer-motion';

interface MenuItemCardProps {
  item: any;
  locale: Locale;
  index: number;
}

export function MenuItemCard({ item, locale, index }: MenuItemCardProps) {
  const name = getLocalizedName(item, locale);
  const desc = getLocalizedDesc(item, locale);
  const price = item?.price ?? 0;
  const imageUrl = item?.imageUrl ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index ?? 0) * 0.04, duration: 0.3 }}
      className="flex items-start gap-4 p-4 rounded-xl border border-[hsl(40,20%,18%)] bg-[hsl(0,0%,7%)]/80 hover:bg-[hsl(0,0%,10%)] hover:border-[hsl(40,30%,22%)] transition-all duration-300"
    >
      {/* Image or placeholder */}
      <div className="relative w-[80px] h-[80px] flex-shrink-0 rounded-lg overflow-hidden bg-[hsl(0,0%,10%)] border border-[hsl(40,15%,16%)] flex items-center justify-center">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        ) : (
          <span className="font-serif text-[hsl(40,20%,35%)] text-2xl italic select-none">H</span>
        )}
      </div>
      <div className="flex-1 min-w-0 py-0.5">
        <h4 className="font-serif text-[hsl(40,15%,88%)] text-[15px] leading-tight mb-1">{name}</h4>
        {desc ? (
          <p className="text-[hsl(40,10%,42%)] text-xs leading-relaxed mb-2">{desc}</p>
        ) : null}
        <span className="font-serif text-[hsl(40,60%,55%)] text-sm font-semibold">
          R$ {price?.toFixed?.(2)?.replace?.('.', ',') ?? '0,00'}
        </span>
      </div>
    </motion.div>
  );
}
