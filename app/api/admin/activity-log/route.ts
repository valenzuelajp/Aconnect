import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ActivityLog, Alumni } from "@/lib/models";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "administrator") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await ActivityLog.findAll({
      order: [["created_at", "DESC"]],
      limit: 100,
    });

    const alumniIds = [...new Set(rows.map((row) => row.alumni_id))];
    const alumniRows = await Alumni.findAll({
      attributes: ["id", "first_name", "last_name"],
      where: { id: alumniIds },
    });
    const alumniMap = new Map(
      alumniRows.map((alumni) => [alumni.id, alumni.toJSON()]),
    );

    const logs = rows.map((row) => ({
      ...row.toJSON(),
      alumni: alumniMap.get(row.alumni_id) || null,
    }));

    return NextResponse.json(logs);
  } catch (error: any) {
    console.error("Activity log API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
