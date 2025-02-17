import React from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/sections/Footer";

export default function Layout({ children }: { children : React.ReactNode}) {
    return (
        <main className={"w-full text-sm"}>
            <Navbar/>
            {children}
            <Footer/>
        </main>
    )
}