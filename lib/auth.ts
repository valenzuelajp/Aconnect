import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { AdminUser, Alumni } from "@/lib/models";

const authSecret =
  process.env.NEXTAUTH_SECRET || "aconnect-development-secret";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "alumni",
      name: "Alumni Login",
      credentials: {
        student_number: { label: "Student Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.student_number || !credentials?.password) return null;

        const user = await Alumni.findOne({
          where: { student_number: credentials.student_number },
        });

        if (!user) {
          throw new Error("Unregistered Student Number");
        }

        const alumni = user.get({ plain: true }) as any;

        const isValid = await bcrypt.compare(credentials.password, alumni.password);
        if (!isValid) {
          throw new Error("Invalid Password");
        }

        return {
          id: alumni.id.toString(),
          name: `${alumni.first_name} ${alumni.last_name}`,
          email: alumni.email,
          role: "alumni",
          student_number: alumni.student_number,
        };
      },
    }),
    CredentialsProvider({
      id: "admin",
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await AdminUser.findOne({
          where: { username: credentials.username },
        });

        if (!user) {
          throw new Error("Unregistered Admin Username");
        }

        const admin = user.get({ plain: true }) as any;

        const isValid = await bcrypt.compare(credentials.password, admin.password);
        if (!isValid) {
          throw new Error("Invalid Password");
        }

        return {
          id: admin.id.toString(),
          name: `${admin.first_name} ${admin.last_name}`,
          email: admin.email,
          role: "administrator",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.student_number = (user as any).student_number;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).student_number = token.student_number;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: authSecret,
};
