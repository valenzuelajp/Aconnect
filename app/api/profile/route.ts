import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Alumni, Certification, Employment } from '@/lib/models';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = session.user as any;
  const currentAlumniId = parseInt(user.id);

  try {
    const alumni = await Alumni.findByPk(currentAlumniId);

    if (!alumni) {
      return NextResponse.json({ error: 'Alumni not found' }, { status: 404 });
    }

    const employmentRows = await Employment.findAll({
      where: { alumni_id: currentAlumniId },
    });

    const certificationRows = await Certification.findAll({
      where: { alumni_id: currentAlumniId },
    });

    return NextResponse.json({
      ...alumni.toJSON(),
      employment: employmentRows.map((entry) => entry.toJSON()),
      certifications: certificationRows.map((entry) => entry.toJSON()),
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
