import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Alumni, Connection, Message } from '@/lib/models';
import { Op } from 'sequelize';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = session.user as any;
  const currentAlumniId = parseInt(user.id);

  const { searchParams } = new URL(req.url);
  const friendId = searchParams.get('friendId');

  try {
    if (friendId) {
      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { sender_id: currentAlumniId, receiver_id: parseInt(friendId) },
            { sender_id: parseInt(friendId), receiver_id: currentAlumniId },
          ],
        },
        order: [['sent_at', 'ASC']],
      });
      return NextResponse.json(messages.map((entry) => entry.toJSON()));
    } else {
      const connections = await Connection.findAll({
        where: {
          [Op.and]: [
            { status: 'accepted' },
            {
              [Op.or]: [
                { sender_id: currentAlumniId },
                { receiver_id: currentAlumniId },
              ],
            },
          ],
        },
      });

      const friendIds = connections
        .map((entry) => entry.toJSON())
        .map((connection) =>
          connection.sender_id === currentAlumniId
            ? connection.receiver_id
            : connection.sender_id,
        );

      const friends = await Alumni.findAll({
        attributes: ['id', 'first_name', 'last_name', 'profile_image', 'sex'],
        where: { id: friendIds },
      });

      return NextResponse.json(friends.map((entry) => entry.toJSON()));
    }
  } catch (error) {
    console.error('Error fetching messages/friends:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
