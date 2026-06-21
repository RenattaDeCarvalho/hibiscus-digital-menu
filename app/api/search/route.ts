export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req?.url ?? 'http://localhost:3000');
    const q = url?.searchParams?.get('q') ?? '';

    if (!q || q?.length < 2) {
      return NextResponse.json([]);
    }
    const items = await prisma.menuItem.findMany({
      where: {
        active: true,
        OR: [
          { namePt: { contains: q, mode: 'insensitive' } },
          { nameEn: { contains: q, mode: 'insensitive' } },
          { nameEs: { contains: q, mode: 'insensitive' } },
          { descPt: { contains: q, mode: 'insensitive' } },
          { descEn: { contains: q, mode: 'insensitive' } },
          { descEs: { contains: q, mode: 'insensitive' } },
        ],
      },
      include: { category: true },
      take: 20,
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(items ?? []);
  } catch (e: any) {
    return NextResponse.json([], { status: 500 });
  }
}
