"use client";
import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User, CheckCircle, Upload } from "lucide-react";
import { fetchUserPatientDetails } from "@/app/actions/user";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";

// Types
interface User {
    id: string;
    email: string;
    address: string;
    latitude: number;
    longitude: number;
    name: string;
    profile_image: string;
}

const Settings: NextPage = () => {
    // Success message state
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showSuccess, setShowSuccess] = useState(false);

    // Profile form
    const profileForm = useForm<User>({
        defaultValues: {
            id: "",
            email: "",
            address: "",
            latitude: 0,
            longitude: 0,
            name: "",
            profile_image: "",
        },
    });

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const user = await fetchUserPatientDetails();
                if (user) {
                    profileForm.reset(user);
                }
            } catch (error) {
                console.error("Failed to fetch user details", error);
            }
        };
        fetchUserDetails();
    }, [profileForm]);

    const profileImage = profileForm.watch("profile_image") || "/default-avatar.png"; // Fallback image

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
                    </TabsList>
                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Update your personal information and preferences.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-4 mb-6">
                                    <Avatar className="w-24 h-24">
                                        {profileImage ? (
                                            <Image width={800} height={800} src={profileImage} alt="User Profile" className="w-full h-full rounded-full object-cover" />
                                        ) : null}
                                    </Avatar>
                                    <div>
                                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                                            <Upload className="h-4 w-4" />
                                            <span>Change Photo</span>
                                        </Button>
                                    </div>
                                </div>
                                <Form {...profileForm}>
                                    <form onSubmit={profileForm.handleSubmit(() => {})} className="space-y-6">
                                        <FormField
                                            control={profileForm.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
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
                                            name="address"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Address</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <div className="flex justify-end">
                                            <Button type="submit">Save Profile</Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
};

export default Settings;
