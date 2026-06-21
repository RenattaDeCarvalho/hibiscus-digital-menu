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

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index ?? 0) * 0.04, duration: 0.3 }}
      className="flex items-start gap-4 p-4 rounded-xl border border-[hsl(40,20%,18%)] bg-[hsl(0,0%,7%)]/80 hover:bg-[hsl(0,0%,10%)] hover:border-[hsl(40,30%,22%)] transition-all duration-300"
    >
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
