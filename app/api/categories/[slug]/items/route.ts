export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params?.slug ?? '';

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        items: {
          where: {
            active: true,
            subCategoryId: null,
          },
          orderBy: { sortOrder: 'asc' },
        },
        subCategories: {
          where: { active: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            items: {
              where: { active: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 });
  }
}