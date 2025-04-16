'use client';

import React from 'react';
import { Filter, Search } from 'lucide-react';

export default function InboxLoading() {
    return (
        <div className="flex h-screen flex-1 bg-gray-50 overflow-hidden">
            {/* Sidebar Skeleton */}
            <div className="w-full sm:w-80 lg:w-96 border-r border-gray-200 bg-white h-full flex flex-col">
                <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                    <div className="h-7 w-28 bg-gray-200 rounded animate-pulse"></div>
                    <div className="p-2 rounded-full">
                        <Filter size={18} className="text-gray-300" />
                    </div>
                </div>

                <div className="p-3 border-b border-gray-200">
                    <div className="relative">
                        <div className="w-full p-2 pl-9 rounded-lg border border-gray-200 bg-gray-100 h-9">
                            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" size={16} />
                    </div>
                </div>

                {/* Chat List Skeleton */}
                <div className="overflow-y-auto flex-grow">
                    {Array(6).fill(0).map((_, index) => (
                        <div key={index} className="p-3 border-b border-gray-100 animate-pulse">
                            <div className="flex items-start">
                                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                                <div className="ml-3 flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="h-5 w-32 bg-gray-200 rounded"></div>
                                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area Skeleton */}
            <div className="hidden sm:flex flex-1 flex-col h-full">
                <div className="p-3 border-b border-gray-200 bg-white flex justify-between items-center shadow-sm">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div className="ml-3">
                            <div className="h-5 w-32 bg-gray-200 rounded"></div>
                        </div>
                    </div>

                    <div className="flex space-x-1">
                        <div className="p-2 rounded-full w-10 h-10 bg-gray-100"></div>
                        <div className="p-2 rounded-full w-10 h-10 bg-gray-100"></div>
                        <div className="p-2 rounded-full w-10 h-10 bg-gray-100"></div>
                    </div>
                </div>

                {/* Messages Skeleton */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    <div className="space-y-4 max-w-4xl mx-auto">
                        {/* Receiver Message */}
                        <div className="flex justify-start">
                            <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 self-end mb-1"></div>
                            <div className="max-w-xs sm:max-w-md p-3 rounded-lg bg-white rounded-bl-none shadow-sm">
                                <div className="h-4 w-48 bg-gray-200 rounded"></div>
                                <div className="h-3 w-24 bg-gray-200 rounded mt-2"></div>
                            </div>
                        </div>

                        {/* Sender Message */}
                        <div className="flex justify-end">
                            <div className="max-w-xs sm:max-w-md p-3 rounded-lg bg-blue-200 rounded-br-none">
                                <div className="h-4 w-40 bg-blue-300 rounded"></div>
                                <div className="h-3 w-24 bg-blue-300 rounded mt-2"></div>
                            </div>
                            <div className="w-8 h-8 self-end mb-1 ml-2"></div>
                        </div>

                        {/* Receiver Message */}
                        <div className="flex justify-start">
                            <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 self-end mb-1"></div>
                            <div className="max-w-xs sm:max-w-md p-3 rounded-lg bg-white rounded-bl-none shadow-sm">
                                <div className="h-4 w-64 bg-gray-200 rounded"></div>
                                <div className="h-4 w-52 bg-gray-200 rounded mt-2"></div>
                                <div className="h-3 w-24 bg-gray-200 rounded mt-2"></div>
                            </div>
                        </div>

                        {/* Sender Message */}
                        <div className="flex justify-end">
                            <div className="max-w-xs sm:max-w-md p-3 rounded-lg bg-blue-200 rounded-br-none">
                                <div className="h-4 w-56 bg-blue-300 rounded"></div>
                                <div className="h-3 w-24 bg-blue-300 rounded mt-2"></div>
                            </div>
                            <div className="w-8 h-8 self-end mb-1 ml-2"></div>
                        </div>
                    </div>
                </div>

                {/* Message Input Skeleton */}
                <div className="p-3 border-t border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center max-w-4xl mx-auto">
                        <div className="p-2 rounded-full w-10 h-10 bg-gray-100"></div>
                        <div className="flex-1 h-10 mx-2 rounded-full bg-gray-100"></div>
                        <div className="p-2 rounded-full w-10 h-10 bg-gray-300"></div>
                    </div>
                </div>
            </div>

            {/* Empty State for Mobile */}
            <div className="flex-1 sm:hidden flex flex-col items-center justify-center bg-gray-50">
                <div className="text-center p-6 max-w-md animate-pulse">
                    <div className="h-6 w-56 bg-gray-200 rounded mx-auto mb-4"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded mx-auto"></div>
                    <div className="h-10 w-40 bg-gray-200 rounded mx-auto mt-6"></div>
                </div>
            </div>
        </div>
    );
}