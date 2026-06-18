export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { generatePresignedUploadUrl } from "@/lib/s3";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const { fileName, contentType, isPublic } = body ?? {};
    const result = await generatePresignedUploadUrl(
      fileName ?? 'file',
      contentType ?? 'application/octet-stream',
      isPublic ?? true
    );
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 });
  }
}
