import { AdminUser, Alumni, Event, Job, Post } from "@/lib/models";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminDashboardPage() {
  const [totalEvents, totalPosts, totalJobs, totalAlumni, totalAccounts, activeUsers, inactiveUsers] = await Promise.all([
    Event.count(),
    Post.count(),
    Job.count(),
    Alumni.count(),
    AdminUser.count(),
    Alumni.count({ where: { status: "active" } }),
    Alumni.count({ where: { status: "inactive" } }),
  ]);

  return (
    <AdminDashboard
      stats={{
        totalEvents,
        totalPosts,
        totalJobs,
        totalAlumni,
        totalAccounts,
        activeUsers,
        inactiveUsers,
      }}
    />
  );
}
