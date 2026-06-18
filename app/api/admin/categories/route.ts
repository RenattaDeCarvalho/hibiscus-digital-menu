export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  return !!(session?.user);
}

export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { items: true } } },
    });
    return NextResponse.json(categories ?? []);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const maxOrder = await prisma.category.aggregate({ _max: { sortOrder: true } });
    const category = await prisma.category.create({
      data: {
        slug: body?.slug ?? '',
        namePt: body?.namePt ?? '',
        nameEn: body?.nameEn ?? '',
        nameEs: body?.nameEs ?? '',
        descPt: body?.descPt ?? null,
        descEn: body?.descEn ?? null,
        descEs: body?.descEs ?? null,
        iconUrl: body?.iconUrl ?? null,
        sortOrder: (maxOrder?._max?.sortOrder ?? 0) + 1,
      },
    });
    return NextResponse.json(category);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 });
  }
}
