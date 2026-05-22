import { NextRequest, NextResponse } from 'next/server';
import { Alumni } from '@/lib/models';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ message: 'Missing token' }, { status: 400 });
  }

  try {
    const user = await Alumni.findOne({
      where: { verification_token: token },
      attributes: ['id'],
    });

    if (!user) {
      return new NextResponse('Invalid or expired token.', { status: 400 });
    }

    await Alumni.update(
      { email_verified: true, status: 'active', verification_token: null },
      { where: { id: user.id } },
    );

    return NextResponse.redirect(new URL('/login?verified=true', req.url));
  } catch (error) {
    console.error('Verification error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
