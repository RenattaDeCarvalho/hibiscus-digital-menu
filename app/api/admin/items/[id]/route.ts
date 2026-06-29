export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  return !!(session?.user);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const id = params?.id ?? '';
    const body = await req.json();
    const data: any = {
      namePt: body?.namePt,
      nameEn: body?.nameEn,
      nameEs: body?.nameEs,
      descPt: body?.descPt ?? null,
      descEn: body?.descEn ?? null,
      descEs: body?.descEs ?? null,
      price: parseFloat(body?.price ?? 0) || 0,
      imageUrl: body?.imageUrl ?? null,
    };

    if (body.active !== undefined) {
      data.active = body?.active;
    }
    const item = await prisma.menuItem.update({
      where: { id },
      data,
    });
    return NextResponse.json(item);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const id = params?.id ?? '';
    await prisma.menuItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 });
  }
}
