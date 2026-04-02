import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Alumni, Certification, Connection, ConnectionRequest, Employment } from "@/lib/models";
import { Op } from "sequelize";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const currentUserId = parseInt((session.user as any).id);
  const targetId = parseInt(id);

  try {
    const alumnus = await Alumni.findByPk(targetId);

    if (!alumnus) {
      return NextResponse.json({ error: "Alumni not found" }, { status: 404 });
    }

    const employmentRows = await Employment.findAll({
      where: { alumni_id: targetId },
    });

    const certificationRows = await Certification.findAll({
      where: { alumni_id: targetId },
      order: [["created_at", "DESC"]],
    });

    const sentRequest = await ConnectionRequest.findOne({
      where: { sender_id: currentUserId, receiver_id: targetId },
    });

    const receivedRequest = await ConnectionRequest.findOne({
      where: { sender_id: targetId, receiver_id: currentUserId },
    });

    const connection = await Connection.findOne({
      where: {
        [Op.or]: [
          { sender_id: currentUserId, receiver_id: targetId },
          { sender_id: targetId, receiver_id: currentUserId },
        ],
      },
    });

    let connectionStatus = "connectable";
    let requestId: any = null;

    if (connection) {
      connectionStatus = "accepted";
    } else if (sentRequest) {
      connectionStatus = "pending";
      requestId = sentRequest.id;
    } else if (receivedRequest) {
      connectionStatus = "received";
      requestId = receivedRequest.id;
    }

    return NextResponse.json({
      ...alumnus.toJSON(),
      employment: employmentRows.map((entry) => entry.toJSON()),
      certifications: certificationRows.map((entry) => entry.toJSON()),
      connectionStatus,
      requestId,
      isOwnProfile: currentUserId === targetId,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
