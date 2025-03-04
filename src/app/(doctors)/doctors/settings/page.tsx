'use client';

import React, { useState } from 'react';
import { User, Bell, Clock, Shield, CreditCard, Key, UserPlus, Save, ChevronRight, Check, X } from 'lucide-react';

interface DoctorProfile {
    name: string;
    email: string;
    phone: string;
    specialization: string;
    bio: string;
    experience: string;
    education: string;
    languages: string[];
    consultationFee: number;
    acceptingNewPatients: boolean;
    workingDays: string[];
    workingHours: {
        start: string;
        end: string;
    };
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<string>('profile');
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Doctor profile state
    const [profile, setProfile] = useState<DoctorProfile>({
        name: 'Dr. John Smith',
        email: 'john.smith@medibook.com',
        phone: '+1 (555) 123-4567',
        specialization: 'Cardiology',
        bio: 'Experienced cardiologist with over 15 years of clinical practice. Specialized in interventional cardiology and cardiac rehabilitation.',
        experience: '15 years',
        education: 'MD, Harvard Medical School\nCardiology Fellowship, Mayo Clinic',
        languages: ['English', 'Spanish'],
        consultationFee: 150,
        acceptingNewPatients: true,
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: {
            start: '09:00',
            end: '17:00'
        }
    });

    // Form handling
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleWorkingHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            workingHours: {
                ...prev.workingHours,
                [name]: value
            }
        }));
    };

    const handleToggleAcceptingPatients = () => {
        setProfile(prev => ({ ...prev, acceptingNewPatients: !prev.acceptingNewPatients }));
    };

    const handleWorkingDayToggle = (day: string) => {
        setProfile(prev => {
            if (prev.workingDays.includes(day)) {
                return { ...prev, workingDays: prev.workingDays.filter(d => d !== day) };
            } else {
                return { ...prev, workingDays: [...prev.workingDays, day] };
            }
        });
    };

    const handleLanguageToggle = (language: string) => {
        setProfile(prev => {
            if (prev.languages.includes(language)) {
                return { ...prev, languages: prev.languages.filter(l => l !== language) };
            } else {
                return { ...prev, languages: [...prev.languages, language] };
            }
        });
    };

    // Save profile changes
    const handleSaveProfile = async () => {
        setIsLoading(true);
        setIsSuccess(false);
        setIsError(false);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // In a real app, you would post to your API
            // const response = await fetch('/api/doctor/profile', {
            //   method: 'PUT',
            //   headers: {
            //     'Content-Type': 'application/json'
            //   },
            //   body: JSON.stringify(profile)
            // });

            // if (!response.ok) throw new Error('Failed to update profile');

            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 3000);
        } catch (error) {
            console.error(error);
            setIsError(true);
            setTimeout(() => setIsError(false), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    // Notification settings
    const [notifications, setNotifications] = useState({
        email: {
            appointments: true,
            reminders: true,
            marketing: false
        },
        push: {
            appointments: true,
            reminders: true,
            marketing: false
        },
        sms: {
            appointments: true,
            reminders: false,
            marketing: false
        }
    });

    const handleNotificationToggle = (type: 'email' | 'push' | 'sms', setting: 'appointments' | 'reminders' | 'marketing') => {
        setNotifications(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [setting]: !prev[type][setting]
            }
        }));
    };

    // Security settings
    const [password, setPassword] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPassword(prev => ({ ...prev, [name]: value }));
    };

    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    // Payment settings
    const [paymentMethods, setPaymentMethods] = useState([
        { id: '1', type: 'card', last4: '4242', brand: 'Visa', isDefault: true, expiryDate: '12/2025' },
        { id: '2', type: 'card', last4: '5555', brand: 'Mastercard', isDefault: false, expiryDate: '08/2026' }
    ]);

    const [taxInfo, setTaxInfo] = useState({
        taxId: '123-45-6789',
        businessName: 'Smith Cardiology LLC',
        address: '123 Medical Center Drive, Suite 456, San Francisco, CA 94110'
    });

    const handleTaxInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTaxInfo(prev => ({ ...prev, [name]: value }));
    };

    const setDefaultPaymentMethod = (id: string) => {
        setPaymentMethods(prev =>
            prev.map(method => ({
                ...method,
                isDefault: method.id === id
            }))
        );
    };

    // Team settings
    const [team] = useState([
        { id: '1', name: 'Sarah Johnson', email: 'sarah.j@medibook.com', role: 'Nurse', status: 'active' },
        { id: '2', name: 'Michael Chen', email: 'm.chen@medibook.com', role: 'Administrative Assistant', status: 'active' },
        { id: '3', name: 'Jessica Williams', email: 'j.williams@medibook.com', role: 'Medical Assistant', status: 'invited' }
    ]);

    return (
        <div className={"p-6"}>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 ">

                {isSuccess && (
                    <div className="bg-green-50 text-green-800 px-4 py-2 rounded-md flex items-center">
                        <Check size={16} className="mr-2" />
                        <span>Settings updated successfully</span>
                    </div>
                )}

                {isError && (
                    <div className="bg-red-50 text-red-800 px-4 py-2 rounded-md flex items-center">
                        <X size={16} className="mr-2" />
                        <span>Failed to update settings</span>
                    </div>
                )}
            </div>

            {/* Settings Content */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="md:flex">
                    {/* Settings Navigation */}
                    <div className="md:w-64 border-r border-gray-200">
                        <nav className="p-4">
                            <div className="space-y-1">
                                <button
                                    className={`w-full text-left px-3 py-2 rounded-md flex items-center ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                    onClick={() => setActiveTab('profile')}
                                >
                                    <User size={18} className="mr-3" />
                                    <span>Profile</span>
                                </button>
                                <button
                                    className={`w-full text-left px-3 py-2 rounded-md flex items-center ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                    onClick={() => setActiveTab('notifications')}
                                >
                                    <Bell size={18} className="mr-3" />
                                    <span>Notifications</span>
                                </button>
                                <button
                                    className={`w-full text-left px-3 py-2 rounded-md flex items-center ${activeTab === 'schedule' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                    onClick={() => setActiveTab('schedule')}
                                >
                                    <Clock size={18} className="mr-3" />
                                    <span>Schedule</span>
                                </button>
                                <button
                                    className={`w-full text-left px-3 py-2 rounded-md flex items-center ${activeTab === 'security' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                    onClick={() => setActiveTab('security')}
                                >
                                    <Shield size={18} className="mr-3" />
                                    <span>Security</span>
                                </button>
                                <button
                                    className={`w-full text-left px-3 py-2 rounded-md flex items-center ${activeTab === 'payment' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                    onClick={() => setActiveTab('payment')}
                                >
                                    <CreditCard size={18} className="mr-3" />
                                    <span>Payment</span>
                                </button>
                                <button
                                    className={`w-full text-left px-3 py-2 rounded-md flex items-center ${activeTab === 'team' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                    onClick={() => setActiveTab('team')}
                                >
                                    <UserPlus size={18} className="mr-3" />
                                    <span>Team</span>
                                </button>
                            </div>
                        </nav>
                    </div>

                    {/* Settings Content */}
                    <div className="flex-1 p-6 md:overflow-y-auto">

                        {/* Profile Settings */}
                        {activeTab === 'profile' && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-6">Profile Settings</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profile.name}
                                            onChange={handleProfileChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profile.email}
                                            onChange={handleProfileChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profile.phone}
                                            onChange={handleProfileChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                                        <input
                                            type="text"
                                            name="specialization"
                                            value={profile.specialization}
                                            onChange={handleProfileChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio</label>
                                    <textarea
                                        name="bio"
                                        rows={4}
                                        value={profile.bio}
                                        onChange={handleProfileChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                                        <input
                                            type="text"
                                            name="experience"
                                            value={profile.experience}
                                            onChange={handleProfileChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee ($)</label>
                                        <input
                                            type="number"
                                            name="consultationFee"
                                            value={profile.consultationFee}
                                            onChange={handleProfileChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Education & Credentials</label>
                                    <textarea
                                        name="education"
                                        rows={3}
                                        value={profile.education}
                                        onChange={handleProfileChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['English', 'Spanish', 'French', 'Mandarin', 'Hindi', 'Arabic'].map((language) => (
                                            <button
                                                key={language}
                                                type="button"
                                                onClick={() => handleLanguageToggle(language)}
                                                className={`px-3 py-1 rounded-full text-sm ${
                                                    profile.languages.includes(language)
                                                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                                                }`}
                                            >
                                                {language}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={profile.acceptingNewPatients}
                                            onChange={handleToggleAcceptingPatients}
                                            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Currently accepting new patients</span>
                                    </label>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleSaveProfile}
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></span>
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} className="mr-2" />
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Notification Settings */}
                        {activeTab === 'notifications' && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-6">Notification Settings</h2>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-md font-medium text-gray-700 mb-4">Email Notifications</h3>
                                        <div className="space-y-3">
                                            <label className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">Appointment confirmations and updates</span>
                                                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications.email.appointments}
                                                        onChange={() => handleNotificationToggle('email', 'appointments')}
                                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                                        style={{ right: notifications.email.appointments ? '0' : 'auto' }}
                                                    />
                                                    <label
                                                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                                                            notifications.email.appointments ? 'bg-blue-500' : 'bg-gray-300'
                                                        }`}
                                                    ></label>
                                                </div>
                                            </label>

                                            <label className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">Daily and weekly schedule reminders</span>
                                                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications.email.reminders}
                                                        onChange={() => handleNotificationToggle('email', 'reminders')}
                                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                                        style={{ right: notifications.email.reminders ? '0' : 'auto' }}
                                                    />
                                                    <label
                                                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                                                            notifications.email.reminders ? 'bg-blue-500' : 'bg-gray-300'
                                                        }`}
                                                    ></label>
                                                </div>
                                            </label>

                                            <label className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">Marketing and promotional messages</span>
                                                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications.email.marketing}
                                                        onChange={() => handleNotificationToggle('email', 'marketing')}
                                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                                        style={{ right: notifications.email.marketing ? '0' : 'auto' }}
                                                    />
                                                    <label
                                                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                                                            notifications.email.marketing ? 'bg-blue-500' : 'bg-gray-300'
                                                        }`}
                                                    ></label>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-md font-medium text-gray-700 mb-4">Push Notifications</h3>
                                        <div className="space-y-3">
                                            <label className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">Appointment confirmations and updates</span>
                                                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications.push.appointments}
                                                        onChange={() => handleNotificationToggle('push', 'appointments')}
                                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                                        style={{ right: notifications.push.appointments ? '0' : 'auto' }}
                                                    />
                                                    <label
                                                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                                                            notifications.push.appointments ? 'bg-blue-500' : 'bg-gray-300'
                                                        }`}
                                                    ></label>
                                                </div>
                                            </label>

                                            <label className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">Daily and weekly schedule reminders</span>
                                                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications.push.reminders}
                                                        onChange={() => handleNotificationToggle('push', 'reminders')}
                                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                                        style={{ right: notifications.push.reminders ? '0' : 'auto' }}
                                                    />
                                                    <label
                                                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                                                            notifications.push.reminders ? 'bg-blue-500' : 'bg-gray-300'
                                                        }`}
                                                    ></label>
                                                </div>
                                            </label>

                                            <label className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">Marketing and promotional messages</span>
                                                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications.push.marketing}
                                                        onChange={() => handleNotificationToggle('push', 'marketing')}
                                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                                        style={{ right: notifications.push.marketing ? '0' : 'auto' }}
                                                    />
                                                    <label
                                                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                                                            notifications.push.marketing ? 'bg-blue-500' : 'bg-gray-300'
                                                        }`}
                                                    ></label>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-md font-medium text-gray-700 mb-4">SMS Notifications</h3>
                                        <div className="space-y-3">
                                            <label className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">Appointment confirmations and updates</span>
                                                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications.sms.appointments}
                                                        onChange={() => handleNotificationToggle('sms', 'appointments')}
                                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                                        style={{ right: notifications.sms.appointments ? '0' : 'auto' }}
                                                    />
                                                    <label
                                                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                                                            notifications.sms.appointments ? 'bg-blue-500' : 'bg-gray-300'
                                                        }`}
                                                    ></label>
                                                </div>
                                            </label>

                                            <label className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">Daily and weekly schedule reminders</span>
                                                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications.sms.reminders}
                                                        onChange={() => handleNotificationToggle('sms', 'reminders')}
                                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                                        style={{ right: notifications.sms.reminders ? '0' : 'auto' }}
                                                    />
                                                    <label
                                                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                                                            notifications.sms.reminders ? 'bg-blue-500' : 'bg-gray-300'
                                                        }`}
                                                    ></label>
                                                </div>
                                            </label>

                                            <label className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">Marketing and promotional messages</span>
                                                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications.sms.marketing}
                                                        onChange={() => handleNotificationToggle('sms', 'marketing')}
                                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                                        style={{ right: notifications.sms.marketing ? '0' : 'auto' }}
                                                    />
                                                    <label
                                                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                                                            notifications.sms.marketing ? 'bg-blue-500' : 'bg-gray-300'
                                                        }`}
                                                    ></label>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-6">
                                    <button
                                        type="button"
                                        onClick={handleSaveProfile}
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></span>
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} className="mr-2" />
                                                <span>Save Preferences</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Security Settings */}
                        {activeTab === 'security' && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-6">Security Settings</h2>

                                <div className="mb-8">
                                    <h3 className="text-md font-medium text-gray-700 mb-4">Change Password</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                            <input
                                                type="password"
                                                name="current"
                                                value={password.current}
                                                onChange={handlePasswordChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                            <input
                                                type="password"
                                                name="new"
                                                value={password.new}
                                                onChange={handlePasswordChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                            <input
                                                type="password"
                                                name="confirm"
                                                value={password.confirm}
                                                onChange={handlePasswordChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="pt-2">
                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                                            >
                                                <Key size={16} className="mr-2" />
                                                <span>Update Password</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-md font-medium text-gray-700 mb-4">Two-Factor Authentication</h3>
                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                                        <div>
                                            <p className="font-medium text-gray-800">Secure your account with 2FA</p>
                                            <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account by requiring a verification code in addition to your password when signing in.</p>
                                        </div>
                                        <div className="relative inline-block w-12 mr-2 align-middle select-none">
                                            <input
                                                type="checkbox"
                                                checked={twoFactorEnabled}
                                                onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                                style={{ right: twoFactorEnabled ? '0' : 'auto' }}
                                            />
                                            <label
                                                className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                                                    twoFactorEnabled ? 'bg-blue-500' : 'bg-gray-300'
                                                }`}
                                            ></label>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-md font-medium text-gray-700 mb-4">Session Management</h3>
                                    <div className="border border-gray-200 rounded-md overflow-hidden">
                                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                                            <p className="font-medium text-gray-700">Active Sessions</p>
                                        </div>
                                        <div className="p-4">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-gray-800">Current Session</p>
                                                        <p className="text-sm text-gray-600">Windows • Chrome • San Francisco, CA</p>
                                                        <p className="text-xs text-gray-500 mt-1">Started on Feb 28, 2025 at 10:23 AM</p>
                                                    </div>
                                                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-gray-800">Mobile App</p>
                                                        <p className="text-sm text-gray-600">iOS • iPhone • San Francisco, CA</p>
                                                        <p className="text-xs text-gray-500 mt-1">Last active on Feb 26, 2025 at 3:42 PM</p>
                                                    </div>
                                                    <button className="text-sm text-red-600 hover:text-red-700">Revoke</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleSaveProfile}
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></span>
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} className="mr-2" />
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Payment Settings */}
                        {activeTab === 'payment' && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-6">Payment Settings</h2>

                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-md font-medium text-gray-700">Payment Methods</h3>
                                        <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                                            <span>Add new method</span>
                                            <ChevronRight size={16} className="ml-1" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {paymentMethods.map(method => (
                                            <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                                                        {method.brand === 'Visa' ? (
                                                            <span className="text-blue-700 font-bold">VISA</span>
                                                        ) : method.brand === 'Mastercard' ? (
                                                            <span className="text-red-600 font-bold">MC</span>
                                                        ) : (
                                                            <CreditCard size={20} className="text-gray-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {method.brand} •••• {method.last4}
                                                            {method.isDefault && (
                                                                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-gray-600">Expires {method.expiryDate}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-4">
                                                    {!method.isDefault && (
                                                        <button
                                                            onClick={() => setDefaultPaymentMethod(method.id)}
                                                            className="text-sm text-gray-600 hover:text-gray-900"
                                                        >
                                                            Set as default
                                                        </button>
                                                    )}
                                                    <button className="text-sm text-gray-600 hover:text-gray-900">Edit</button>
                                                    <button className="text-sm text-red-600 hover:text-red-700">Remove</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-md font-medium text-gray-700 mb-4">Tax Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID / SSN</label>
                                            <input
                                                type="text"
                                                name="taxId"
                                                value={taxInfo.taxId}
                                                onChange={handleTaxInfoChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                                            <input
                                                type="text"
                                                name="businessName"
                                                value={taxInfo.businessName}
                                                onChange={handleTaxInfoChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                                            <textarea
                                                name="address"
                                                value={taxInfo.address}
                                                onChange={handleTaxInfoChange}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleSaveProfile}
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></span>
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} className="mr-2" />
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Team Settings */}
                        {activeTab === 'team' && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-6">Team Management</h2>

                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-sm text-gray-600">Manage staff members who have access to your account.</p>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                                        <UserPlus size={16} className="mr-2" />
                                        <span>Invite Team Member</span>
                                    </button>
                                </div>

                                <div className="border border-gray-200 rounded-md overflow-hidden">
                                    <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
                                        <div className="col-span-4">Name</div>
                                        <div className="col-span-4">Email</div>
                                        <div className="col-span-2">Role</div>
                                        <div className="col-span-2">Status</div>
                                    </div>

                                    {team.map(member => (
                                        <div key={member.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 items-center">
                                            <div className="col-span-4 font-medium text-gray-800">{member.name}</div>
                                            <div className="col-span-4 text-gray-600">{member.email}</div>
                                            <div className="col-span-2">{member.role}</div>
                                            <div className="col-span-2">
                                                {member.status === 'active' ? (
                                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
                                                ) : (
                                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Invited</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end mt-6">
                                    <button
                                        type="button"
                                        onClick={handleSaveProfile}
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></span>
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} className="mr-2" />
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Schedule Settings */}
                        {activeTab === 'schedule' && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-6">Schedule Settings</h2>

                                <div className="mb-6">
                                    <h3 className="text-md font-medium text-gray-700 mb-4">Working Days</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => handleWorkingDayToggle(day)}
                                                className={`px-3 py-1 rounded-full text-sm ${
                                                    profile.workingDays.includes(day)
                                                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                                                }`}
                                            >
                                                {day}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-md font-medium text-gray-700 mb-4">Working Hours</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                            <input
                                                type="time"
                                                name="start"
                                                value={profile.workingHours.start}
                                                onChange={handleWorkingHoursChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                            <input
                                                type="time"
                                                name="end"
                                                value={profile.workingHours.end}
                                                onChange={handleWorkingHoursChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleSaveProfile}
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></span>
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} className="mr-2" />
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}