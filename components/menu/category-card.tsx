"use client";
import Image from 'next/image';
import { type Locale, getLocalizedName, getLocalizedDesc } from '@/lib/i18n';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  category: any;
  locale: Locale;
  onClick: () => void;
  index: number;
}

export function CategoryCard({ category, locale, onClick, index }: CategoryCardProps) {
  const name = getLocalizedName(category, locale);
  const desc = getLocalizedDesc(category, locale);

  return (
    <motion.button
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index ?? 0) * 0.04, duration: 0.35 }}
      onClick={() => onClick?.()}
      className="w-full flex items-center gap-4 p-4 rounded-xl border border-[hsl(40,20%,18%)] bg-[hsl(0,0%,7%)]/80 hover:bg-[hsl(0,0%,10%)] hover:border-[hsl(40,30%,25%)] transition-all duration-300 group text-left"
    >
      {/* Icon in golden circle */}
      <div className="relative w-11 h-11 flex-shrink-0 rounded-full border border-[hsl(40,40%,35%)] bg-[hsl(0,0%,10%)] flex items-center justify-center overflow-hidden">
        {category?.iconUrl ? (
          <Image
            src={category.iconUrl}
            alt={name}
            width={28}
            height={28}
            className="object-contain"
          />
        ) : (
          <span className="font-serif text-[hsl(40,60%,55%)] text-lg">H</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-serif text-[hsl(40,15%,85%)] text-lg group-hover:text-[hsl(40,60%,55%)] transition-colors">
          {name}
        </h3>
        {desc ? (
          <p className="text-[hsl(40,10%,42%)] text-xs mt-0.5 italic truncate">{desc}</p>
        ) : null}
      </div>
      <span className="text-[hsl(40,10%,30%)] group-hover:text-[hsl(40,60%,55%)] transition-colors flex-shrink-0 text-lg">
        ›
      </span>
    </motion.button>
  );
}
