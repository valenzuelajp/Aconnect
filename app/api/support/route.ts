import { NextRequest, NextResponse } from 'next/server';
import { SupportMessage } from '@/lib/models';

export async function GET() {
  const messages = await SupportMessage.findAll({
    order: [['created_at', 'DESC']],
  });
  return NextResponse.json(messages.map((entry) => entry.toJSON()));
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { alumni_id, message } = data;

  const saved = await SupportMessage.create({
    sender_id: alumni_id,
    receiver_id: 0,
    message,
    is_admin: false,
    status: 'open',
  });

  return NextResponse.json({
    id: saved.id,
    sender_id: alumni_id,
    receiver_id: 0,
    message,
    status: 'open',
  });
}
