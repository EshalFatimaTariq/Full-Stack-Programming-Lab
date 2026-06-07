'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/utils/api';
import { FiUser, FiClock, FiFileText, FiPlusCircle, FiActivity, FiLogOut } from 'react-icons/fi';

export default function DoctorDashboard() {
    const router = useRouter();
    const [doctorName, setDoctorName] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Prescription Form State
    const [medicalForm, setMedicalForm] = useState({
        patient: '',
        diagnosis: '',
        medication: '',
        dosage: '',
        duration: '',
        doctorNotes: ''
    });
    const [formMessage, setFormMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        const name = localStorage.getItem('userName');

        if (!token || role !== 'Doctor') {
            localStorage.clear();
            router.push('/login');
            return;
        }

        setDoctorName(name);
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await API.get('/appointments');
            setAppointments(response.data.data || []);
        } catch (error) {
            console.error('Error fetching clinical schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push('/login');
    };

    const handleInputChange = (e) => {
        setMedicalForm({ ...medicalForm, [e.target.name]: e.target.value });
    };

    const handleSelectPatient = (patientId) => {
        setMedicalForm({ ...medicalForm, patient: patientId });
        setFormMessage({ type: 'info', text: 'Patient selected. Complete prescription module fields below.' });
    };

    const handleSubmitRecord = async (e) => {
        e.preventDefault();
        setFormMessage({ type: '', text: '' });

        if (!medicalForm.patient) {
            setFormMessage({ type: 'error', text: 'Please click "Select Patient" on an appointment above first.' });
            return;
        }

        const payload = {
            patient: medicalForm.patient,
            diagnosis: medicalForm.diagnosis,
            prescription: {
                medication: medicalForm.medication,
                dosage: medicalForm.dosage,
                duration: medicalForm.duration
            },
            doctorNotes: medicalForm.doctorNotes
        };

        try {
            const response = await API.post('/records', payload);
            if (response.data.success) {
                setFormMessage({ type: 'success', text: 'Medical chart and prescription issued successfully!' });
                setMedicalForm({ patient: '', diagnosis: '', medication: '', dosage: '', duration: '', doctorNotes: '' });
            }
        } catch (error) {
            setFormMessage({ type: 'error', text: error.response?.data?.message || 'Failed to submit medical record.' });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 font-semibold">
                Loading Secure Medical Portal Workspace...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-indigo-600 rounded-xl text-white">
                        <FiActivity className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-900">HLApp Care Platform</span>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                        Medical Practitioner
                    </span>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-1.5 text-sm font-bold text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                        <FiLogOut /> <span>Logout</span>
                    </button>
                </div>
            </nav>

            {/* Dashboard Content Grid */}
            <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT 2 COLUMNS: Doctor Greeting and Managed Consultations */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gradient-to-r from-indigo-700 to-slate-900 p-6 rounded-2xl text-white shadow-md">
                        <h2 className="text-2xl font-black">Welcome Back, {doctorName}</h2>
                        <p className="text-indigo-100 text-sm mt-1">Review your assigned patient consultations and record history files below.</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
                            <FiClock className="text-indigo-600" /> <span>Your Scheduled Consultations</span>
                        </h3>

                        {appointments.length === 0 ? (
                            <p className="text-sm text-slate-500 italic py-4">No active patients have booked appointments with your profile currently.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider">
                                            <th className="p-3">Patient Name</th>
                                            <th className="p-3">Date</th>
                                            <th className="p-3">Time Window</th>
                                            <th className="p-3 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {appointments.map((app) => (
                                            <tr key={app._id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="p-3 font-semibold text-slate-900 flex items-center space-x-2">
                                                    <FiUser className="text-slate-400" />
                                                    <span>{app.patient?.name || "Registered Patient"}</span>
                                                </td>
                                                <td className="p-3 text-slate-700">{new Date(app.appointmentDate).toLocaleDateString()}</td>
                                                <td className="p-3 text-slate-600 font-medium">{app.timeSlot}</td>
                                                <td className="p-3 text-center">
                                                    <button 
                                                        onClick={() => handleSelectPatient(app.patient?._id)}
                                                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                                                    >
                                                        Select Patient
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT 1 COLUMN: Interactive Prescription Workspace Module */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
                        <FiFileText className="text-indigo-600" /> <span>Issue Consultation Record</span>
                    </h3>

                    {formMessage.text && (
                        <div className={`mb-4 p-3 rounded-lg text-xs font-semibold ${
                            formMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                            formMessage.type === 'info' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                            'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                            {formMessage.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmitRecord} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Clinical Diagnosis</label>
                            <input 
                                type="text"
                                name="diagnosis"
                                required
                                value={medicalForm.diagnosis}
                                onChange={handleInputChange}
                                placeholder="e.g. Acute Migraine / Seasonal Allergy"
                                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="border-t border-slate-100 pt-3 mt-2">
                            <span className="block text-xs font-black text-indigo-600 uppercase tracking-wide mb-2 flex items-center space-x-1">
                                <FiPlusCircle /> <span>Prescription Details</span>
                            </span>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-600 uppercase">Medication Name</label>
                                    <input 
                                        type="text"
                                        name="medication"
                                        required
                                        value={medicalForm.medication}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Panadol 500mg"
                                        className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 uppercase">Dosage</label>
                                        <input 
                                            type="text"
                                            name="dosage"
                                            required
                                            value={medicalForm.dosage}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Twice a day"
                                            className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 uppercase">Duration</label>
                                        <input 
                                            type="text"
                                            name="duration"
                                            required
                                            value={medicalForm.duration}
                                            onChange={handleInputChange}
                                            placeholder="e.g. 5 days"
                                            className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Additional Practitioner Notes</label>
                            <textarea 
                                name="doctorNotes"
                                rows="2"
                                value={medicalForm.doctorNotes}
                                onChange={handleInputChange}
                                placeholder="Rest recommendations, diet constraints..."
                                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            ></textarea>
                        </div>

                        <button 
                            type="submit"
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer"
                        >
                            Save Record & Dispatch
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}