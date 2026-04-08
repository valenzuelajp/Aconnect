import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Alumni, Employment } from "@/lib/models";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;
  const currentAlumniId = parseInt(user.id);
  const data = await req.json();

  try {
    const { type, ...payload } = data;

    if (type === "basic") {
      await Alumni.update(
        {
          first_name: payload.first_name,
          last_name: payload.last_name,
          degree: payload.degree,
          graduation_year: payload.graduation_year
            ? parseInt(payload.graduation_year)
            : null,
          year_admitted: payload.year_admitted
            ? parseInt(payload.year_admitted)
            : 0,
          phone: payload.phone,
          alternative_phone: payload.alternative_phone,
          email: payload.email,
          alternative_email: payload.alternative_email,
        },
        { where: { id: currentAlumniId } },
      );
    } else if (type === "employment") {
      const existingRow = await Employment.findOne({
        where: { alumni_id: currentAlumniId },
      });

      if (existingRow) {
        await Employment.update(
          {
            employment_status: payload.employment_status,
            job_title: payload.job_title,
            company_name: payload.company_name,
            job_description: payload.job_description,
            year_of_service: payload.year_of_service
              ? parseInt(payload.year_of_service)
              : 0,
            promotion_count: payload.promotion_count
              ? parseInt(payload.promotion_count)
              : 0,
          },
          { where: { id: existingRow.id } },
        );
      } else {
        await Employment.create({
          alumni_id: currentAlumniId,
          employment_status: payload.employment_status,
          job_title: payload.job_title,
          company_name: payload.company_name,
          job_description: payload.job_description,
          year_of_service: payload.year_of_service
            ? parseInt(payload.year_of_service)
            : 0,
          promotion_count: payload.promotion_count
            ? parseInt(payload.promotion_count)
            : 0,
        });
      }
    } else if (type === "skills") {
      await Alumni.update(
        {
          soft_skills: Array.isArray(payload.soft_skills)
            ? payload.soft_skills.join(",")
            : payload.soft_skills,
          technical_skills: Array.isArray(payload.technical_skills)
            ? payload.technical_skills.join(",")
            : payload.technical_skills,
        },
        { where: { id: currentAlumniId } },
      );
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
