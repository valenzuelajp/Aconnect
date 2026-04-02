import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Message } from "@/lib/models";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;
  const currentAlumniId = parseInt(user.id);
  const { receiverId, message } = await req.json();

  try {
    const saved = await Message.create({
      sender_id: currentAlumniId,
      receiver_id: parseInt(receiverId),
      message,
    });

    const newMessage = {
      id: saved.id,
      sender_id: currentAlumniId,
      receiver_id: parseInt(receiverId),
      message,
      sent_at: new Date(),
    };

    return NextResponse.json({ status: "success", message: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
