import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Alumni, SupportMessage } from "@/lib/models";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "administrator") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const messages = await SupportMessage.findAll({
      order: [["created_at", "DESC"]],
    });

    const alumniIds = [...new Set(messages.map((message) => message.sender_id))];
    const alumniRows = await Alumni.findAll({
      attributes: ["id", "first_name", "last_name", "email"],
      where: { id: alumniIds },
    });

    const alumniMap = new Map(
      alumniRows.map((alumni) => [alumni.id, alumni.toJSON()]),
    );

    const payload = messages.map((message) => ({
      ...message.toJSON(),
      alumni: alumniMap.get(message.sender_id) || null,
    }));

    return NextResponse.json(payload);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "administrator") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const body = await request.json();
  const { status } = body;

  try {
    await SupportMessage.update(
      { status },
      { where: { id: parseInt(id) } },
    );
    return NextResponse.json({ success: true, id, status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
