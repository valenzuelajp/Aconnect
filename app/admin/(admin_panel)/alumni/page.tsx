import db from "@/lib/db";
import AlumniList from "@/components/admin/AlumniList";
import PageHeader from "@/components/layout/PageHeader";

export default async function AdminAlumniPage() {
    const [alumni]: any = await db.query("SELECT * FROM alumni ORDER BY created_at DESC");

    return (
        <div className="bg-white min-h-screen">
            <PageHeader
                title="Alumni"
                subtitle="Management"
                description="Maintain and verify alumni records and professional profiles."
                icon={<i className="fas fa-users-cog text-amber-400 text-xl"></i>}
            />

            <div className="flex justify-end mb-4">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors">
                    <i className="fas fa-sync-alt"></i> Sync Database
                </button>
            </div>

            <AlumniList initialAlumni={alumni} />
        </div>
    );
}
