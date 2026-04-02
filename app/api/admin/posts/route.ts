import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { AdminUser, Post } from "@/lib/models";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "administrator") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await Post.findAll({ order: [["created_at", "DESC"]] });
    const adminIds = [...new Set(posts.map((post) => post.created_by))];
    const admins = await AdminUser.findAll({
      attributes: ["id", "first_name", "last_name"],
      where: { id: adminIds },
    });
    const adminMap = new Map(
      admins.map((admin) => [admin.id, admin.toJSON()]),
    );

    return NextResponse.json(
      posts.map((post) => ({
        ...post.toJSON(),
        first_name: adminMap.get(post.created_by)?.first_name || null,
        last_name: adminMap.get(post.created_by)?.last_name || null,
      })),
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "administrator") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const post_type = formData.get("post_type") as string;
    const recipient_batch = formData.get("recipient_batch") as string;
    const file = formData.get("file") as File | null;

    let imageName: string | null = null;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      imageName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "assets",
        "uploads",
        "post",
      );
      const filePath = path.join(uploadDir, imageName);
      await writeFile(filePath, buffer);
    }

    const post = await Post.create({
      title,
      content,
      post_type,
      image: imageName,
      recipient_batch,
      created_by: (session.user as any).id,
    });

    return NextResponse.json(post.toJSON());
  } catch (error: any) {
    console.error("Post creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "administrator") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  try {
    await Post.destroy({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
