import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { categories } from "./seed-data/categories";
import { subCategories } from "./seed-data/subcategories";
import { items } from "./seed-data/menu-items";

const prisma = new PrismaClient();

async function main() {
  const hash2 = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@hibiscus.com" },
    update: {},
    create: {
      email: "admin@hibiscus.com",
      name: "Admin Hibiscus",
      password: hash2,
      role: "admin",
    },
  });

  const catMap: Record<string, string> = {};
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        namePt: cat.namePt,
        nameEn: cat.nameEn,
        nameEs: cat.nameEs,
        descPt: cat.descPt,
        descEn: cat.descEn,
        descEs: cat.descEs,
        iconUrl: cat.iconUrl,
        sortOrder: cat.sortOrder,
      },
      create: cat,
    });
    catMap[cat.slug] = c.id;
  }

  const subCatMap: Record<string, string> = {};
  for (const sub of subCategories) {
    const categoryId = catMap[sub.catSlug];

    const subCategory = await prisma.subCategory.upsert({
      where: {
        categoryId_slug: {
          categoryId,
          slug: sub.slug,
        },
      },
      update: {
        namePt: sub.namePt,
        nameEn: sub.nameEn,
        nameEs: sub.nameEs,
        sortOrder: sub.sortOrder,
      },
      create: {
        categoryId,
        slug: sub.slug,
        namePt: sub.namePt,
        nameEn: sub.nameEn,
        nameEs: sub.nameEs,
        sortOrder: sub.sortOrder,
        active: true,
      },
    });

    subCatMap[sub.slug] = subCategory.id;
  }

  for (const item of items) {
    const catId = catMap[item.catSlug];

    if (!catId) continue;

    const subCategoryId = item.subCategorySlug
      ? subCatMap[item.subCategorySlug]
      : null;

    const existing = await prisma.menuItem.findFirst({
      where: { namePt: item.namePt, categoryId: catId },
    });

    if (existing) {
      await prisma.menuItem.update({
        where: { id: existing.id },
        data: {
          nameEn: item.nameEn,
          nameEs: item.nameEs,
          descPt: item.descPt,
          descEn: item.descEn,
          descEs: item.descEs,
          price: item.price,
          sortOrder: item.sortOrder,
          subCategoryId,
          wineType: item.wineType ?? null,
        },
      });
    } else {
      await prisma.menuItem.create({
        data: {
          categoryId: catId,
          subCategoryId,
          wineType: item.wineType ?? null,
          namePt: item.namePt,
          nameEn: item.nameEn,
          nameEs: item.nameEs,
          descPt: item.descPt,
          descEn: item.descEn,
          descEs: item.descEs,
          price: item.price,
          sortOrder: item.sortOrder,
        },
      });
    }
  }
  // Site settings - default hero background
  await prisma.siteSetting.upsert({
    where: { key: "heroImageUrl" },
    update: {},
    create: { key: "heroImageUrl", value: "/hero-bg.jpg" },
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
