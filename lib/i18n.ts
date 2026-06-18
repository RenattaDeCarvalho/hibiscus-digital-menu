export type Locale = 'pt' | 'en' | 'es';

export const translations: Record<string, Record<Locale, string>> = {
  welcome: { pt: 'BEM-VINDO', en: 'WELCOME', es: 'BIENVENIDO' },
  subtitle: {
    pt: 'Uma experiência gastronômica refinada, no coração da Cidade.',
    en: 'A refined dining experience, in the heart of the City.',
    es: 'Una experiencia gastronómica refinada, en el corazón de la Ciudad.',
  },
  searchPlaceholder: {
    pt: 'Buscar prato ou bebida...',
    en: 'Search dish or drink...',
    es: 'Buscar plato o bebida...',
  },
  categories: { pt: 'CATEGORIAS', en: 'CATEGORIES', es: 'CATEGORÍAS' },
  back: { pt: 'VOLTAR', en: 'BACK', es: 'VOLVER' },
  footer: {
    pt: 'Atendimento dedicado, sabor inesquecível.',
    en: 'Dedicated service, unforgettable flavor.',
    es: 'Servicio dedicado, sabor inolvidable.',
  },
  noResults: {
    pt: 'Nenhum resultado encontrado.',
    en: 'No results found.',
    es: 'No se encontraron resultados.',
  },
  admin: { pt: 'ADMINISTRAÇÃO', en: 'ADMINISTRATION', es: 'ADMINISTRACIÓN' },
};

export function t(key: string, locale: Locale): string {
  return translations?.[key]?.[locale] ?? translations?.[key]?.['pt'] ?? key;
}

export function getLocalizedName(item: any, locale: Locale): string {
  if (locale === 'en') return item?.nameEn ?? item?.namePt ?? '';
  if (locale === 'es') return item?.nameEs ?? item?.namePt ?? '';
  return item?.namePt ?? '';
}

export function getLocalizedDesc(item: any, locale: Locale): string {
  if (locale === 'en') return item?.descEn ?? item?.descPt ?? '';
  if (locale === 'es') return item?.descEs ?? item?.descPt ?? '';
  return item?.descPt ?? '';
}
