import { NextResponse } from 'next/server';
import { transporter } from '@/lib/email';
import { EmailQueue } from '@/lib/models';

export const dynamic = 'force-dynamic';

const MAX_ATTEMPTS = 3;

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const emails = await EmailQueue.findAll({
      where: { status: 'pending' },
      order: [['created_at', 'ASC']],
      limit: 20,
    });

    if (emails.length === 0) {
      return NextResponse.json({ message: 'No pending emails' });
    }

    const results: any[] = [];

    for (const email of emails) {
      const emailRow = email.toJSON();
      try {
        await transporter.sendMail({
          from: `"AConnect Alumni System" <${process.env.EMAIL_USER}>`,
          to: emailRow.recipient,
          subject: emailRow.subject,
          html: emailRow.body,
        });

        await EmailQueue.update(
          { status: 'sent' },
          { where: { id: emailRow.id } },
        );

        results.push({ id: emailRow.id, status: 'sent' });
      } catch (error: any) {
        const updatedAttempts = (emailRow.attempts || 0) + 1;
        const updateValues: any = { attempts: updatedAttempts };

        if (updatedAttempts >= MAX_ATTEMPTS) {
          updateValues.status = 'failed';
        } else {
          const delay = Math.pow(2, updatedAttempts);
          updateValues.send_after = new Date(Date.now() + delay * 60 * 1000);
        }

        await EmailQueue.update(updateValues, { where: { id: emailRow.id } });

        results.push({
          id: emailRow.id,
          status: 'error',
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      message: `Processed ${emails.length} emails`,
      results,
    });
  } catch (error: any) {
    console.error('Email worker error:', error);
    return NextResponse.json(
      { message: 'Worker failed', error: error.message },
      { status: 500 },
    );
  }
}
