'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/utils/api';
import { FiCheck, FiX, FiUsers, FiTrendingUp, FiActivity, FiLogOut, FiCalendar } from 'react-icons/fi';

export default function AdminDashboard() {
    const router = useRouter();
    const [adminName, setAdminName] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0 });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        const name = localStorage.getItem('userName');

        if (!token || role !== 'Admin') {
            localStorage.clear();
            router.push('/login');
            return;
        }

        setAdminName(name);
        fetchAdminDashboardData();
    }, []);

    const fetchAdminDashboardData = async () => {
        try {
            // CHANGED: '/admin/appointments' ko hata kar general route '/appointments' kar diya gaya hai
            const response = await API.get('/appointments');
            const data = response.data.data || [];
            setAppointments(data);

            // Calculate system summary stats locally
            const confirmed = data.filter(a => a.status === 'Confirmed').length;
            const pending = data.filter(a => a.status === 'Pending').length;
            setStats({
                total: data.length,
                confirmed,
                pending
            });
        } catch (error) {
            console.error('Error fetching global admin dashboard files:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const response = await API.put(`/admin/appointments/${id}`, { status: newStatus });
            if (response.data.success) {
                fetchAdminDashboardData(); // Instantly refresh system lists
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to modify operational flag status.');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 font-semibold">
                Loading Secure Corporate Management Control Hub...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-slate-900 rounded-xl text-white">
                        <FiActivity className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-900">HLApp Care Platform</span>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-semibold text-slate-900 bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-full">
                        System Administrator
                    </span>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-1.5 text-sm font-bold text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                        <FiLogOut /> <span>Logout</span>
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 space-y-6">
                
                {/* Greeting Card Header */}
                <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-md">
                    <h2 className="text-2xl font-black">Control Station: Welcome {adminName}</h2>
                    <p className="text-slate-400 text-sm mt-1">Review operational scheduling, review total allocations, and issue registration overrides.</p>
                </div>

                {/* Grid Row Metrics Summaries */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Consultations</span>
                            <h4 className="text-2xl font-black text-slate-900 mt-1">{stats.total}</h4>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FiCalendar className="w-6 h-6" /></div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirmed Slots</span>
                            <h4 className="text-2xl font-black text-emerald-600 mt-1">{stats.confirmed}</h4>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><FiTrendingUp className="w-6 h-6" /></div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Awaiting Action</span>
                            <h4 className="text-2xl font-black text-amber-600 mt-1">{stats.pending}</h4>
                        </div>
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><FiUsers className="w-6 h-6" /></div>
                    </div>
                </div>

                {/* Master Appointment Management Table Layout */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Master Enterprise Appointment Schedules</h3>
                    
                    {appointments.length === 0 ? (
                        <p className="text-sm text-slate-500 italic py-4">No registration files loaded on server cluster currently.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider">
                                        <th className="p-3">Patient</th>
                                        <th className="p-3">Assigned Doctor</th>
                                        <th className="p-3">Date</th>
                                        <th className="p-3">Time Window</th>
                                        <th className="p-3">Status Flags</th>
                                        <th className="p-3 text-center">Action Controls</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {appointments.map((app) => (
                                        <tr key={app._id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="p-3 font-semibold text-slate-900">{app.patient?.name || "System Patient"}</td>
                                            <td className="p-3 text-slate-700">{app.doctor?.name || "Unassigned Doc"}</td>
                                            <td className="p-3 text-slate-600">{new Date(app.appointmentDate).toLocaleDateString()}</td>
                                            <td className="p-3 text-slate-600 font-medium">{app.timeSlot}</td>
                                            <td className="p-3">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                    app.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                    app.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                                    'bg-amber-50 text-amber-700 border border-amber-200'
                                                }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="p-3 flex items-center justify-center space-x-2">
                                                {app.status === 'Pending' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleUpdateStatus(app._id, 'Confirmed')}
                                                            className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                                                            title="Confirm Slot"
                                                        >
                                                            <FiCheck className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleUpdateStatus(app._id, 'Cancelled')}
                                                            className="p-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                                                            title="Cancel Slot"
                                                        >
                                                            <FiX className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {app.status !== 'Pending' && (
                                                    <span className="text-xs text-slate-400 italic">No Actions</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}