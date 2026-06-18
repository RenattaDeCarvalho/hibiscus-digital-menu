export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getFileUrl } from "@/lib/s3";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const { cloud_storage_path, isPublic } = body ?? {};
    const url = await getFileUrl(cloud_storage_path ?? '', isPublic ?? true);
    return NextResponse.json({ url, cloud_storage_path });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 });
  }
}
