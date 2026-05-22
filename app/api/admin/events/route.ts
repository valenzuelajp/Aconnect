import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Event } from '@/lib/models';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'administrator') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const events = await Event.findAll({ order: [['event_date', 'DESC']] });
  return NextResponse.json(events.map((event) => event.toJSON()));
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'administrator') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const event_name = formData.get('event_name') as string;
    const event_date = formData.get('event_date') as string;
    const event_time_duration = formData.get('event_time_duration') as string;
    const location = formData.get('location') as string;
    const contact_person = formData.get('contact_person') as string;
    const description = formData.get('description') as string;
    const event_image = formData.get('event_image') as File;

    console.log('Creating event:', { event_name, event_date, location });

    let eventImageName: string | null = null;

    if (event_image && event_image.size > 0) {
      console.log('Processing event image:', event_image.name);
      const buffer = Buffer.from(await event_image.arrayBuffer());
      eventImageName = `${Date.now()}_${event_image.name.replace(/\s+/g, '_')}`;

      const { writeFile, mkdir } = await import('fs/promises');
      const path = await import('path');

      const uploadDir = path.join(
        process.cwd(),
        'public',
        'assets',
        'uploads',
        'events',
      );
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch {
        console.log('Upload directory already exists or created');
      }

      await writeFile(path.join(uploadDir, eventImageName), buffer);
      console.log('Image saved:', eventImageName);
    }

    const event = await Event.create({
      event_name,
      event_date: new Date(event_date),
      event_time_duration,
      location,
      contact_person,
      description,
      event_image: eventImageName,
    });

    return NextResponse.json({
      id: event.id,
      event_name,
      event_date,
      event_time_duration,
      location,
      contact_person,
      description,
      event_image: eventImageName,
    });
  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create event' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'administrator') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  try {
    await Event.destroy({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'administrator') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  const body = await request.json();
  const {
    event_name,
    event_date,
    event_time_duration,
    location,
    contact_person,
    description,
  } = body;

  try {
    await Event.update(
      {
        ...(event_name ? { event_name } : {}),
        ...(event_date ? { event_date: new Date(event_date) } : {}),
        ...(event_time_duration ? { event_time_duration } : {}),
        ...(location ? { location } : {}),
        ...(contact_person ? { contact_person } : {}),
        ...(description ? { description } : {}),
      },
      { where: { id: parseInt(id) } },
    );
    return NextResponse.json({ success: true, id, ...body });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
