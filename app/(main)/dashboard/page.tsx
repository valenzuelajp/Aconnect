import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminUser, Alumni, Event, Job, Post } from '@/lib/models';
import AlumniDashboard from '@/components/ui/AlumniDashboard';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  const user = session.user as any;

  if (user.role === 'administrator') {
    const [
      totalEvents,
      totalPosts,
      totalJobs,
      totalAlumni,
      totalAccounts,
      activeUsers,
      inactiveUsers,
    ] = await Promise.all([
      Event.count(),
      Post.count(),
      Job.count(),
      Alumni.count(),
      AdminUser.count(),
      Alumni.count({ where: { status: 'active' } }),
      Alumni.count({ where: { status: 'inactive' } }),
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

  return <AlumniDashboard />;
}
