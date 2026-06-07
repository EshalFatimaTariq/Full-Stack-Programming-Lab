'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/utils/api';
import { FiCalendar, FiUser, FiClock, FiActivity, FiLogOut } from 'react-icons/fi';

export default function PatientDashboard() {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Booking Form State
    const [bookingForm, setBookingForm] = useState({
        doctor: '',
        appointmentDate: '',
        timeSlot: '09:00 AM - 12:00 PM',
        symptoms: ''
    });
    const [formMessage, setFormMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        // Guard clause: Make sure user is logged in and is a Patient
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        const name = localStorage.getItem('userName');
        
        if (!token || role !== 'Patient') {
            localStorage.clear();
            router.push('/login');
            return;
        }
        
        setUserName(name);
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch doctors list and patient's appointments simultaneously
            const [docsRes, appsRes] = await Promise.all([
                API.get('/doctors'),
                API.get('/appointments')
            ]);
            
            setDoctors(docsRes.data.data || []);
            setAppointments(appsRes.data.data || []);
        } catch (error) {
            console.error('Error fetching dashboard records:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push('/login');
    };

    const handleInputChange = (e) => {
        setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
    };

    const handleBookAppointment = async (e) => {
        e.preventDefault();
        setFormMessage({ type: '', text: '' });

        if (!bookingForm.doctor) {
            setFormMessage({ type: 'error', text: 'Please select a professional specialist doctor.' });
            return;
        }

        try {
            const response = await API.post('/appointments', bookingForm);
            if (response.data.success) {
                setFormMessage({ type: 'success', text: 'Appointment request logged successfully!' });
                setBookingForm({ doctor: '', appointmentDate: '', timeSlot: '09:00 AM - 12:00 PM', symptoms: '' });
                fetchDashboardData(); // Refresh list immediately
            }
        } catch (error) {
            setFormMessage({ type: 'error', text: error.response?.data?.message || 'Booking failed.' });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 font-semibold">
                Loading Secure Healthcare Environment Panel...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-blue-600 rounded-xl text-white">
                        <FiActivity className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-900">HLApp Care Platform</span>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                        Patient Account
                    </span>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-1.5 text-sm font-bold text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                        <FiLogOut /> <span>Logout</span>
                    </button>
                </div>
            </nav>

            {/* Dashboard Content Container */}
            <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT 1 COLUMN: Booking Workspace Form */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
                        <FiCalendar className="text-blue-600" /> <span>Book New Appointment</span>
                    </h3>

                    {formMessage.text && (
                        <div className={`mb-4 p-3 rounded-lg text-xs font-semibold ${
                            formMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                            {formMessage.text}
                        </div>
                    )}

                    <form onSubmit={handleBookAppointment} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Select Specialist Doctor</label>
                            <select 
                                name="doctor"
                                value={bookingForm.doctor}
                                onChange={handleInputChange}
                                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">-- Choose Doctor / Specialization --</option>
                                {doctors.map((doc) => (
                                    <option key={doc._id} value={doc.user?._id}>
                                        {doc.user?.name} ({doc.specialization})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Desired Consultation Date</label>
                            <input 
                                type="date"
                                name="appointmentDate"
                                required
                                value={bookingForm.appointmentDate}
                                onChange={handleInputChange}
                                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Preferred Time Window</label>
                            <select 
                                name="timeSlot"
                                value={bookingForm.timeSlot}
                                onChange={handleInputChange}
                                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM (Morning)</option>
                                <option value="02:00 PM - 05:00 PM">02:00 PM - 05:00 PM (Evening)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Brief Description of Symptoms</label>
                            <textarea 
                                name="symptoms"
                                rows="3"
                                value={bookingForm.symptoms}
                                onChange={handleInputChange}
                                placeholder="Describe any pain, duration, or special requests..."
                                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                        </div>

                        <button 
                            type="submit"
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer"
                        >
                            Submit Booking Request
                        </button>
                    </form>
                </div>

                {/* RIGHT 2 COLUMNS: Greetings and Upcoming Consultation Logs */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 rounded-2xl text-white shadow-md">
                        <h2 className="text-2xl font-black">Assalam-o-Alaikum, {userName}!</h2>
                        <p className="text-blue-100 text-sm mt-1">Welcome to your personal electronic healthcare medical board workspace.</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
                            <FiClock className="text-blue-600" /> <span>Your Appointment Tracking Schedules</span>
                        </h3>

                        {appointments.length === 0 ? (
                            <p className="text-sm text-slate-500 italic py-4">No active appointments booked yet. Use the dashboard panel to arrange your first treatment visit.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider">
                                            <th className="p-3">Doctor</th>
                                            <th className="p-3">Scheduled Date</th>
                                            <th className="p-3">Time Window</th>
                                            <th className="p-3">Status Flags</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {appointments.map((app) => (
                                            <tr key={app._id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="p-3 font-semibold text-slate-900 flex items-center space-x-2">
                                                    <FiUser className="text-slate-400" />
                                                    <span>{app.doctor?.name || "Assigned Consultant"}</span>
                                                </td>
                                                <td className="p-3 text-slate-700">{new Date(app.appointmentDate).toLocaleDateString()}</td>
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
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}