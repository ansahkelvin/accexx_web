"use client";
import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User, CheckCircle } from "lucide-react";
import { fetchUserPatientDetails, updateUserProfile } from "@/app/actions/user";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Types - Updated to match actual API response
interface User {
    id: string;
    email: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    name?: string;
    fullName?: string;
    phoneNumber?: string;
    isEmailVerified?: boolean;
    dateOfBirth?: string;
    profile_image?: string;
    profilePicture?: string;
    profileImage?: string;
}

const Settings: NextPage = () => {
    // Success message state
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Profile form
    const profileForm = useForm<User>({
        defaultValues: {
            id: "",
            email: "",
            address: "",
            latitude: 0,
            longitude: 0,
            name: "",
            fullName: "",
            phoneNumber: "",
            isEmailVerified: false,
            dateOfBirth: "",
            profile_image: "",
            profilePicture: "",
            profileImage: "",
        },
    });

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const user = await fetchUserPatientDetails();
                if (user) {
                    console.log("Fetched user details:", user);
                    profileForm.reset(user);
                }
            } catch (error) {
                console.error("Failed to fetch user details", error);
            }
        };
        fetchUserDetails();
    }, [profileForm]);


    const handleSaveProfile = async (data: User) => {
        setIsSaving(true);
        setSaveError(null);
        setShowSuccess(false);
        
        try {
            console.log("Saving profile data:", data);
            
            // Prepare the data to send to the API
            const updateData = {
                fullName: data.fullName || data.name,
                email: data.email,
                phoneNumber: data.phoneNumber,
                address: data.address,
                latitude: data.latitude,
                longitude: data.longitude
            };
            
            const updatedUser = await updateUserProfile(updateData);
            
            if (updatedUser) {
                setShowSuccess(true);
                // Update the form with the new data
                profileForm.reset(updatedUser);
                
                // Hide success message after 3 seconds
                setTimeout(() => {
                    setShowSuccess(false);
                }, 3000);
            }
        } catch (error) {
            console.error("Failed to save profile:", error);
            setSaveError(error instanceof Error ? error.message : "Failed to save profile");
        } finally {
            setIsSaving(false);
        }
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

                {saveError && (
                    <Alert className="mb-6 bg-red-50 border-red-200">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {saveError}
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
                            
                                <Form {...profileForm}>
                                    <form onSubmit={profileForm.handleSubmit(handleSaveProfile)} className="space-y-6">
                                        <FormField
                                            control={profileForm.control}
                                            name="fullName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Full Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} value={field.value || profileForm.watch("name") || ""} />
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
                                            name="phoneNumber"
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
                                            <Button type="submit" disabled={isSaving}>
                                                {isSaving ? "Saving..." : "Save Profile"}
                                            </Button>
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
