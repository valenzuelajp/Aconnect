import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/email';
import { Alumni } from '@/lib/models';
import { Op } from 'sequelize';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      telephone,
      alternative_email,
      graduation_year,
      student_number,
      degree,
      sex,
      degree_other,
    } = body;

    const existingUser = await Alumni.findOne({
      where: {
        [Op.or]: [{ email }, { student_number }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email or Student Number already registered' },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const finalDegree = degree === 'Other' ? degree_other : degree;

    await Alumni.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone,
      telephone,
      alternative_email,
      graduation_year: graduation_year ? parseInt(graduation_year) : null,
      student_number,
      degree: finalDegree,
      sex,
      status: 'active',
      email_verified: false,
      verification_token: token,
      year_admitted: 0,
    });

    try {
      await sendVerificationEmail(email, token);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // We still proceed, but the user might need to resend later
    }

    return NextResponse.json(
      {
        message: 'Registration successful! Please verify your email.',
        requiresVerification: true,
        email: email,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 },
    );
  }
}
