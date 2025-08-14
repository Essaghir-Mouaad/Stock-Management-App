"use client";
import { useState } from "react";
import { User, Lock, LogIn, Eye, EyeOff, LucideArrowRightFromLine, ArrowBigLeftIcon, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include",
    });
    const data = await res.json();

    if (data.success) {
      toast.success("Login successful!");
      if (data.user.role === "ADMIN") router.push("/admin/dashboard");
      else router.push("/worker/dashboard");
    } else {
      toast.error(data.message || "Invalid username or password");
    }
  };

  // const backHome = ()=>{
  //   return(
  //     <Link href={`/`}>Home</Link>
  //   )
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Static Background Elements */}
      
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Static Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-2 h-2 bg-white/20 rounded-full" style={{left: '10%', top: '20%'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full" style={{left: '25%', top: '15%'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full" style={{left: '40%', top: '30%'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full" style={{left: '60%', top: '25%'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full" style={{left: '75%', top: '35%'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full" style={{left: '85%', top: '20%'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full" style={{left: '15%', top: '60%'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full" style={{left: '30%', top: '70%'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full" style={{left: '50%', top: '65%'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full" style={{left: '70%', top: '75%'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full" style={{left: '90%', top: '70%'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full" style={{left: '20%', top: '85%'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full" style={{left: '45%', top: '90%'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full" style={{left: '65%', top: '85%'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full" style={{left: '80%', top: '90%'}}></div>
      </div>

      <div className="p-3 bg-gradient-to-tr from-purple-700 to-blue-600 mb-2 rounded-xl animate-bounce cursor-pointer" onClick={()=>router.push("/")}>
        <Home className="w-15 h-15 text-gray-200"/>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Main Form Card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden">
          {/* Static Border Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h2>
              <p className="text-white/70 text-sm">Sign in to your account</p>
            </div>

            <div>
              {/* Username Field */}
              <div className="relative group mb-6">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="relative flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:border-white/40">
                    <User className="ml-4 w-5 h-5 text-purple-300" />
                    <input
                      type="text"
                      placeholder="Enter your username"
                      className="w-full px-4 py-4 bg-transparent text-white placeholder-white/50 outline-none focus:placeholder-white/70"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="relative group mb-6">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="relative flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:border-white/40">
                    <Lock className="ml-4 w-5 h-5 text-purple-300" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full px-4 py-4 bg-transparent text-white placeholder-white/50 outline-none focus:placeholder-white/70"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="mr-4 p-1 hover:bg-white/10 rounded-lg"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-purple-300" />
                      ) : (
                        <Eye className="w-5 h-5 text-purple-300" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                onClick={handleSubmit}
                className="group relative w-full py-4 px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl text-white font-semibold overflow-hidden hover:shadow-2xl hover:shadow-purple-500/25 hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-blue-500"
              >
                <div className="relative flex items-center justify-center space-x-2">
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center space-y-4">
              <div>
                <a href="/forgot-password" className="text-purple-300 hover:text-purple-200 text-sm font-medium hover:underline">
                  Forgot your password?
                </a>
              </div>
              <div>
                <p className="text-white/60 text-sm">
                  Don't have an account?{' '}
                  <a href="/register" className="text-purple-300 hover:text-purple-200 font-medium hover:underline">
                    Create one here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}