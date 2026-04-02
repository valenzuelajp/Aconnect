import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Alumni } from "@/lib/models";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "administrator") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accounts = await Alumni.findAll({
    attributes: [
      "id",
      "first_name",
      "last_name",
      "email",
      "status",
      "created_at",
      "student_number",
    ],
    order: [["created_at", "DESC"]],
  });
  return NextResponse.json(accounts.map((account) => account.toJSON()));
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
    await Alumni.update({ status }, { where: { id: parseInt(id) } });
    return NextResponse.json({ success: true, id, status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
