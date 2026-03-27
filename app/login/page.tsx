import { Suspense } from "react";
import BrandPanel from "@/app/_components/BrandPanel";
import LoginComponent from "@/app/_components/auth/Login";

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-black/10 overflow-hidden grid lg:grid-cols-2 min-h-[620px]">
                <BrandPanel mode={'login'} />
                <div className="flex flex-col overflow-y-auto max-h-screen lg:max-h-[90vh]">
                    <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-4 border-pink-200 border-t-[#F0266F] rounded-full animate-spin" /></div>}>
                        <LoginComponent />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;
