export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  return !!(session?.user);
}

export async function GET(req: Request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const url = new URL(req?.url ?? 'http://localhost:3000');
    const categoryId = url?.searchParams?.get?.('categoryId') ?? '';
    const items = await prisma.menuItem.findMany({
      where: categoryId ? { categoryId } : {},
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(items ?? []);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const maxOrder = await prisma.menuItem.aggregate({
      where: { categoryId: body?.categoryId },
      _max: { sortOrder: true },
    });
    const item = await prisma.menuItem.create({
      data: {
        categoryId: body?.categoryId ?? '',
        namePt: body?.namePt ?? '',
        nameEn: body?.nameEn ?? '',
        nameEs: body?.nameEs ?? '',
        descPt: body?.descPt ?? null,
        descEn: body?.descEn ?? null,
        descEs: body?.descEs ?? null,
        price: parseFloat(body?.price ?? 0) || 0,
        imageUrl: body?.imageUrl ?? null,
        sortOrder: (maxOrder?._max?.sortOrder ?? 0) + 1,
      },
    });
    return NextResponse.json(item);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 });
  }
}
