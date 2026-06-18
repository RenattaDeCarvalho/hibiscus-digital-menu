"use client";
import { useState, useEffect, useCallback } from "react";
import { type Locale, t, getLocalizedName, getLocalizedDesc } from "@/lib/i18n";
import { MenuHeader } from "./menu-header";
import { SearchBar } from "./search-bar";
import { CategoryCard } from "./category-card";
import { MenuItemCard } from "./menu-item-card";
import { MenuFooter } from "./menu-footer";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function MenuApp() {
  const [locale, setLocale] = useState<Locale>("pt");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [heroImageUrl, setHeroImageUrl] = useState("/hero-bg.jpg");
  const [selectedWineGroup, setSelectedWineGroup] = useState<any>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((r: Response) => r?.json?.() ?? [])
      .then((data: any) => setCategories(data ?? []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));

    fetch("/api/settings")
      .then((r: Response) => r?.json?.() ?? {})
      .then((data: any) => {
        if (data?.heroImageUrl) setHeroImageUrl(data.heroImageUrl);
      })
      .catch(() => {});
  }, []);

  const getBackToWineTypesLabel = (locale: string) => {
    const labels = {
      pt: "Voltar para tipos de vinho",
      en: "Back to wine types",
      es: "Volver a los tipos de vino",
    };

    return labels[locale as keyof typeof labels] ?? labels.pt;
  };

  const handleSelectCategory = useCallback((cat: any) => {
    setSelectedWineGroup(null);
    const slug = cat?.slug ?? "";
    if (!slug) return;
    fetch(`/api/categories/${slug}/items`)
      .then((r: Response) => r?.json?.())
      .then((data: any) => {
        setSelectedCategory(data ?? null);
        setSearchQuery("");
        setSearchResults([]);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const q = searchQuery?.trim?.() ?? "";
    if (q?.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then((r: Response) => r?.json?.() ?? [])
        .then((data: any) => setSearchResults(data ?? []))
        .catch(() => setSearchResults([]))
        .finally(() => setIsSearching(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleBack = useCallback(() => {
    setSelectedWineGroup(null);
    setSelectedCategory(null);
    setSearchQuery("");
    setSearchResults([]);
  }, []);

  const showingSearch = (searchQuery?.trim?.()?.length ?? 0) >= 2;

  return (
    <div className="min-h-screen bg-[hsl(0,0%,5%)] flex flex-col">
      <MenuHeader
        locale={locale}
        onLocaleChange={setLocale}
        showBack={!!selectedCategory}
        onBack={handleBack}
      />

      <main className="flex-1 max-w-[800px] mx-auto w-full px-4">
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero Section with Background Image */}
              <div className="relative -mx-4 mb-6">
                {/* Background Image */}
                <div className="relative w-full h-[280px] sm:h-[320px] overflow-hidden">
                  <Image
                    src={heroImageUrl}
                    alt="Hibiscus Restaurant"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[hsl(0,0%,5%)]/60 via-[hsl(0,0%,5%)]/30 to-[hsl(0,0%,5%)]" />
                </div>

                {/* Content overlaid on image */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                  <p className="text-[hsl(40,60%,55%)] text-xs tracking-[0.35em] uppercase font-medium mb-2">
                    PANAMBY HOTEL
                  </p>
                  <h1 className="font-serif text-[hsl(40,20%,92%)] text-5xl sm:text-6xl italic tracking-wide mb-4">
                    Hibiscus
                  </h1>
                  {/* Decorative line with welcome text */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-[1px] bg-[hsl(40,60%,55%)]" />
                    <span className="text-[hsl(40,60%,55%)] text-[10px] tracking-[0.35em] uppercase font-semibold">
                      {t("welcome", locale)}
                    </span>
                    <div className="w-12 h-[1px] bg-[hsl(40,60%,55%)]" />
                  </div>
                  <p className="text-[hsl(40,10%,60%)] text-sm max-w-xs leading-relaxed">
                    {t("subtitle", locale)}
                  </p>
                </div>
              </div>

              {/* Search */}
              <div className="mb-8">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  locale={locale}
                />
              </div>

              {showingSearch ? (
                <div className="space-y-3">
                  {(searchResults?.length ?? 0) === 0 && !isSearching ? (
                    <p className="text-center text-[hsl(40,10%,40%)] text-sm py-8 font-serif italic">
                      {t("noResults", locale)}
                    </p>
                  ) : (
                    ((searchResults ?? [])?.map?.((item: any, i: number) => (
                      <MenuItemCard
                        key={item?.id ?? i}
                        item={item}
                        locale={locale}
                        index={i}
                      />
                    )) ?? [])
                  )}
                </div>
              ) : (
                <>
                  <h2 className="text-[hsl(40,10%,45%)] text-[11px] tracking-[0.35em] uppercase mb-5">
                    {t("categories", locale)}
                  </h2>
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="w-8 h-8 border-2 border-[hsl(40,60%,55%)] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(categories ?? [])?.map?.((cat: any, i: number) => (
                        <CategoryCard
                          key={cat?.id ?? i}
                          category={cat}
                          locale={locale}
                          onClick={() => handleSelectCategory(cat)}
                          index={i}
                        />
                      )) ?? []}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="category"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="py-8"
            >
              {/* Category Header */}
              <div className="text-center mb-2">
                <p className="text-[hsl(40,60%,55%)] text-[10px] tracking-[0.35em] uppercase mb-2">
                  {t("categories", locale)}
                </p>
                <h2 className="font-serif text-[hsl(40,15%,90%)] text-3xl sm:text-4xl italic tracking-wide">
                  {getLocalizedName(selectedCategory, locale)}
                </h2>
                {getLocalizedDesc(selectedCategory, locale) ? (
                  <p className="text-[hsl(40,10%,45%)] text-xs mt-2 italic">
                    {getLocalizedDesc(selectedCategory, locale)}
                  </p>
                ) : null}
                <div className="w-10 h-[1px] bg-[hsl(40,10%,25%)] mx-auto mt-4" />
              </div>

              {/* Search in category */}
              {/* Items */}
              <div className="space-y-6">
                {(() => {
                  const q = searchQuery?.trim?.()?.toLowerCase?.() ?? "";
                  const subCategories = selectedCategory?.subCategories ?? [];
                  const items = selectedCategory?.items ?? [];

                  const filterItems = (list: any[]) => {
                    if (q?.length < 2) return list;

                    return (
                      list?.filter?.((item: any) => {
                        const name =
                          getLocalizedName(item, locale)?.toLowerCase?.() ?? "";
                        const desc =
                          getLocalizedDesc(item, locale)?.toLowerCase?.() ?? "";
                        return name?.includes?.(q) || desc?.includes?.(q);
                      }) ?? []
                    );
                  };

                  const hasSubCategories = (subCategories?.length ?? 0) > 0;

                  if (hasSubCategories && !selectedWineGroup) {
                    return subCategories.map((sub: any) => {
                      const wineTypes = Array.from(
                        new Set(
                          (sub?.items ?? [])
                            .map((item: any) => item?.wineType)
                            .filter(Boolean),
                        ),
                      );

                      return (
                        <div key={sub.id} className="space-y-3">
                          <h3 className="font-serif text-[hsl(40,60%,55%)] text-2xl italic">
                            {getLocalizedName(sub, locale)}
                          </h3>

                          <div className="space-y-2">
                            {wineTypes.map((type: any) => (
                              <button
                                key={type}
                                onClick={() =>
                                  setSelectedWineGroup({
                                    subCategory: sub,
                                    wineType: type,
                                  })
                                }
                                className="w-full text-left rounded-xl border border-[hsl(40,20%,20%)] bg-[hsl(0,0%,8%)] px-4 py-3 text-[hsl(40,15%,90%)]"
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    });
                  }

                  if (hasSubCategories && selectedWineGroup) {
                    const filtered = filterItems(
                      (selectedWineGroup.subCategory?.items ?? []).filter(
                        (item: any) =>
                          item?.wineType === selectedWineGroup.wineType,
                      ),
                    );

                    return (
                      <div className="space-y-3">
                        <button
                          onClick={() => setSelectedWineGroup(null)}
                          className="text-[hsl(40,60%,55%)] text-sm mb-2"
                        >
                          ← {getBackToWineTypesLabel(locale)}
                        </button>

                        <h3 className="font-serif text-[hsl(40,60%,55%)] text-2xl italic">
                          {getLocalizedName(
                            selectedWineGroup.subCategory,
                            locale,
                          )}{" "}
                          · {selectedWineGroup.wineType}
                        </h3>

                        {filtered.map((item: any, i: number) => (
                          <MenuItemCard
                            key={item?.id ?? i}
                            item={item}
                            locale={locale}
                            index={i}
                          />
                        ))}
                      </div>
                    );
                  }

                  const filtered = filterItems(items);

                  if ((filtered?.length ?? 0) === 0) {
                    return (
                      <p className="text-center text-[hsl(40,10%,40%)] text-sm py-8 font-serif italic">
                        {t("noResults", locale)}
                      </p>
                    );
                  }

                  return filtered.map((item: any, i: number) => (
                    <MenuItemCard
                      key={item?.id ?? i}
                      item={item}
                      locale={locale}
                      index={i}
                    />
                  ));
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <MenuFooter locale={locale} />
    </div>
  );
}
