export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const id = params?.id ?? '';
    const { direction } = await req.json();
    const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
    const idx = categories?.findIndex?.((c: any) => c?.id === id) ?? -1;
    if (idx < 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= (categories?.length ?? 0)) {
      return NextResponse.json({ success: true });
    }

    const current = categories?.[idx];
    const swap = categories?.[swapIdx];
    if (current && swap) {
      await prisma.category.update({ where: { id: current.id }, data: { sortOrder: swap.sortOrder } });
      await prisma.category.update({ where: { id: swap.id }, data: { sortOrder: current.sortOrder } });
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 });
  }
}
