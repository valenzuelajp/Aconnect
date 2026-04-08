import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Alumni, Connection, ConnectionRequest } from "@/lib/models";
import { Op } from "sequelize";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;
  const currentAlumniId = parseInt(user.id);

  try {
    const alumniList = await Alumni.findAll({
      attributes: [
        "id",
        "first_name",
        "last_name",
        "degree",
        "graduation_year",
        "profile_image",
        "sex",
        "current_job",
        "email",
        "technical_skills",
      ],
      where: {
        id: { [Op.ne]: currentAlumniId },
        status: "active",
      },
    });

    const requests = await ConnectionRequest.findAll({
      where: {
        [Op.or]: [
          { sender_id: currentAlumniId },
          { receiver_id: currentAlumniId },
        ],
      },
    });

    const connections = await Connection.findAll({
      where: {
        [Op.or]: [
          { sender_id: currentAlumniId },
          { receiver_id: currentAlumniId },
        ],
      },
    });

    const requestRows = requests.map((entry) => entry.toJSON());

    const connectionRows = connections.map((entry) => entry.toJSON());

    const formattedAlumni = alumniList.map((alumnus) => {
      let connectionStatus = "connectable";
      let requestId: any = null;
      let senderId: any = null;

      const request = requestRows.find(
        (r: any) =>
          (r.sender_id === currentAlumniId && r.receiver_id === alumnus.id) ||
          (r.sender_id === alumnus.id && r.receiver_id === currentAlumniId),
      );

      const connection = connectionRows.find(
        (c: any) =>
          (c.sender_id === currentAlumniId && c.receiver_id === alumnus.id) ||
          (c.sender_id === alumnus.id && c.receiver_id === currentAlumniId),
      );

      if (connection && connection.status === "accepted") {
        connectionStatus = "accepted";
      } else if (request && request.status === "pending") {
        connectionStatus = "pending";
        requestId = request.id;
        senderId = request.sender_id;
      }

      return {
        ...alumnus.toJSON(),
        connectionStatus,
        requestId,
        senderId,
      };
    });

    return NextResponse.json(formattedAlumni);
  } catch (error) {
    console.error("Error fetching alumni:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
