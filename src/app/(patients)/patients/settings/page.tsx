"use client"
import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bell, User, Lock, CreditCard, Upload, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

// Types
interface ProfileFormValues {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
}

interface NotificationSettings {
    appointmentReminders: boolean;
    medicationReminders: boolean;
    labResults: boolean;
    messages: boolean;
    newsletters: boolean;
}

const Settings: NextPage = () => {
    // Profile form
    const profileForm = useForm<ProfileFormValues>({
        defaultValues: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '(555) 123-4567',
            dateOfBirth: '1985-07-15',
            address: '123 Main Street',
            city: 'Anytown',
            state: 'CA',
            zipCode: '90210',
        },
    });

    // Notification settings state
    const [notifications, setNotifications] = useState<NotificationSettings>({
        appointmentReminders: true,
        medicationReminders: true,
        labResults: true,
        messages: true,
        newsletters: false,
    });

    // Success message state
    const [showSuccess, setShowSuccess] = useState(false);

    // Handle profile save
    const onProfileSubmit = (data: ProfileFormValues) => {
        console.log('Profile data submitted:', data);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    // Handle notification toggle
    const handleNotificationToggle = (key: keyof NotificationSettings) => {
        setNotifications({
            ...notifications,
            [key]: !notifications[key],
        });
    };

    return (
        <>
            <Head>
                <title>Patient Settings | HealthCare Portal</title>
                <meta name="description" content="Manage your patient account settings" />
            </Head>

            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

                {showSuccess && (
                    <Alert className="mb-6 bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>
                            Your settings have been saved successfully.
                        </AlertDescription>
                    </Alert>
                )}

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid grid-cols-4 mb-8">
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Profile</span>
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="flex items-center gap-2">
                            <Bell className="h-4 w-4" />
                            <span>Notifications</span>
                        </TabsTrigger>
                        <TabsTrigger value="security" className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            <span>Security</span>
                        </TabsTrigger>
                        <TabsTrigger value="billing" className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span>Billing</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>
                                    Update your personal information and preferences.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-4 mb-6">
                                    <Avatar className="w-24 h-24">
                                        <div className="bg-blue-100 w-full h-full flex items-center justify-center rounded-full text-2xl font-bold text-blue-600">
                                            JD
                                        </div>
                                    </Avatar>
                                    <div>
                                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                                            <Upload className="h-4 w-4" />
                                            <span>Change Photo</span>
                                        </Button>
                                    </div>
                                </div>

                                <Form {...profileForm}>
                                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={profileForm.control}
                                                name="firstName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>First Name</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={profileForm.control}
                                                name="lastName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Last Name</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={profileForm.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} type="email" />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={profileForm.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Phone Number</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} type="tel" />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={profileForm.control}
                                                name="dateOfBirth"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Date of Birth</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} type="date" />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <Separator />
                                        <h3 className="text-lg font-medium">Address Information</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={profileForm.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem className="col-span-2">
                                                        <FormLabel>Street Address</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={profileForm.control}
                                                name="city"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>City</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={profileForm.control}
                                                    name="state"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>State</FormLabel>
                                                            <Select
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select state" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="CA">California</SelectItem>
                                                                    <SelectItem value="NY">New York</SelectItem>
                                                                    <SelectItem value="TX">Texas</SelectItem>
                                                                    <SelectItem value="FL">Florida</SelectItem>
                                                                    <SelectItem value="IL">Illinois</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={profileForm.control}
                                                    name="zipCode"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>ZIP Code</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <Button type="submit">Save Profile</Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                                <CardDescription>
                                    Control which notifications you receive from our healthcare system.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">Appointment Reminders</h3>
                                        <p className="text-sm text-gray-500">
                                            Receive notifications about upcoming appointments.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={notifications.appointmentReminders}
                                        onCheckedChange={() => handleNotificationToggle('appointmentReminders')}
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">Medication Reminders</h3>
                                        <p className="text-sm text-gray-500">
                                            Get reminded when it&#39;s time to take or refill your medications.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={notifications.medicationReminders}
                                        onCheckedChange={() => handleNotificationToggle('medicationReminders')}
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">Lab Results</h3>
                                        <p className="text-sm text-gray-500">
                                            Be notified when new lab results are available.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={notifications.labResults}
                                        onCheckedChange={() => handleNotificationToggle('labResults')}
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">Messages</h3>
                                        <p className="text-sm text-gray-500">
                                            Receive notifications for new messages from your care team.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={notifications.messages}
                                        onCheckedChange={() => handleNotificationToggle('messages')}
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">Newsletters & Updates</h3>
                                        <p className="text-sm text-gray-500">
                                            Receive health tips, newsletters, and system updates.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={notifications.newsletters}
                                        onCheckedChange={() => handleNotificationToggle('newsletters')}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button onClick={() => setShowSuccess(true)}>Save Preferences</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security">
                        <Card>
                            <CardHeader>
                                <CardTitle>Security Settings</CardTitle>
                                <CardDescription>
                                    Manage your password and account security settings.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Change Password</h3>
                                    <div className="grid gap-4">
                                        <div>
                                            <FormLabel htmlFor="current-password">Current Password</FormLabel>
                                            <Input id="current-password" type="password" />
                                        </div>
                                        <div>
                                            <FormLabel htmlFor="new-password">New Password</FormLabel>
                                            <Input id="new-password" type="password" />
                                            <FormDescription className="mt-1 text-xs">
                                                Password must be at least 8 characters and include a number and special character.
                                            </FormDescription>
                                        </div>
                                        <div>
                                            <FormLabel htmlFor="confirm-password">Confirm New Password</FormLabel>
                                            <Input id="confirm-password" type="password" />
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Add an extra layer of security to your account by enabling two-factor authentication.
                                            </p>
                                        </div>
                                        <Switch />
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Session Management</h3>
                                    <p className="text-sm text-gray-500">
                                        You are currently logged in on 2 devices. You can log out from all devices except your current one.
                                    </p>
                                    <Button variant="outline">Log Out From All Other Devices</Button>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button onClick={() => setShowSuccess(true)}>Save Security Settings</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Billing Tab */}
                    <TabsContent value="billing">
                        <Card>
                            <CardHeader>
                                <CardTitle>Billing Information</CardTitle>
                                <CardDescription>
                                    Manage your payment methods and billing preferences.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Payment Methods</h3>
                                    <div className="border rounded-md p-4 flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <CreditCard className="h-8 w-8 text-blue-500" />
                                            <div>
                                                <p className="font-medium">Visa ending in 4242</p>
                                                <p className="text-sm text-gray-500">Expires 04/25</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm">Edit</Button>
                                            <Button variant="outline" size="sm">Remove</Button>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" />
                                        <span>Add Payment Method</span>
                                    </Button>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Billing Address</h3>
                                    <div className="border rounded-md p-4">
                                        <p>John Doe</p>
                                        <p>123 Main Street</p>
                                        <p>Anytown, CA 90210</p>
                                        <p>United States</p>
                                        <Button variant="link" className="p-0 h-auto mt-2">Edit Address</Button>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Billing History</h3>
                                    <div className="border rounded-md overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">Jan 15, 2025</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">Appointment - Dr. Smith</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">$75.00</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">Paid</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">Dec 3, 2024</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">Lab Work - Blood Test</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">$120.00</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">Insurance Processing</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <Button variant="outline" className="w-full">View Full Billing History</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
};

export default Settings;