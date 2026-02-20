'use client';
import {Branding, HomeBackground} from "@/components/home";
import {AuthForm} from "@/components/home/authentication/AuthForm";

export default function Home() {

    return (
        <HomeBackground>

            {/* Main content */}
            <div className="relative z-10 w-full max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <Branding />
                    <AuthForm />

                </div>
            </div>
        </HomeBackground>
    );
}