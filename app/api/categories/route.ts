export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { items: { where: { active: true } } } } },
    });
    return NextResponse.json(categories ?? []);
  } catch (e: any) {
    return NextResponse.json([], { status: 500 });
  }
}
