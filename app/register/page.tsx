"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Shield, Sparkles, Eye, EyeOff, Home } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "", name: "", role: "WORKER" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const router = useRouter();

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    // Your original API call code here
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) router.push("/login");
    else setError(data.message);
  };

   return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-ping"></div>
      </div>

      {/* Fixed Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '10%', top: '20%', animationDelay: '0s', animationDuration: '2s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '25%', top: '15%', animationDelay: '0.5s', animationDuration: '2.5s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '40%', top: '30%', animationDelay: '1s', animationDuration: '3s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '60%', top: '25%', animationDelay: '1.5s', animationDuration: '2.2s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '75%', top: '35%', animationDelay: '0.8s', animationDuration: '2.8s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '85%', top: '20%', animationDelay: '1.2s', animationDuration: '3.2s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '15%', top: '60%', animationDelay: '0.3s', animationDuration: '2.7s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '30%', top: '70%', animationDelay: '1.8s', animationDuration: '2.4s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '50%', top: '65%', animationDelay: '0.7s', animationDuration: '3.5s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '70%', top: '75%', animationDelay: '1.4s', animationDuration: '2.1s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '90%', top: '70%', animationDelay: '0.2s', animationDuration: '2.9s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '20%', top: '85%', animationDelay: '1.6s', animationDuration: '3.1s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '45%', top: '90%', animationDelay: '0.9s', animationDuration: '2.6s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '65%', top: '85%', animationDelay: '1.1s', animationDuration: '3.3s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '80%', top: '90%', animationDelay: '0.4s', animationDuration: '2.3s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '5%', top: '45%', animationDelay: '1.3s', animationDuration: '2.8s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '95%', top: '50%', animationDelay: '0.6s', animationDuration: '3.4s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '35%', top: '5%', animationDelay: '1.7s', animationDuration: '2.5s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '55%', top: '10%', animationDelay: '0.1s', animationDuration: '3.6s'}}></div>
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{left: '75%', top: '8%', animationDelay: '1.9s', animationDuration: '2.2s'}}></div>
      </div>
      <div className="p-3 bg-gradient-to-tr from-purple-700 to-blue-600 mb-2 rounded-xl animate-bounce cursor-pointer" onClick={()=>router.push("/")}>
        <Home className="w-15 h-15 text-gray-200"/>
      </div>

      <div className="relative z-10 w-full max-w-md transform hover:scale-105 transition-all duration-500">
        {/* Main Form Card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden">
          {/* Animated Border Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-3xl blur-xl animate-pulse"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4 animate-spin" style={{animationDuration: '8s'}}>
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
                Create Account
              </h2>
              <p className="text-white/70 text-sm">Join us and start your journey</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl backdrop-blur-sm animate-pulse">
                <p className="text-red-300 text-sm text-center">{error}</p>
              </div>
            )}

            <div onSubmit={handleSubmit}>
              {/* Username Field */}
              <div className="relative group mb-6">
                <label className="block text-white/80 text-sm font-medium mb-2 transition-colors duration-300 group-hover:text-white">
                  Username
                </label>
                <div className={`relative transition-all duration-300 ${focusedField === 'username' ? 'transform scale-105' : ''}`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:border-white/40 transition-all duration-300">
                    <User className="ml-4 w-5 h-5 text-purple-300" />
                    <input
                      type="text"
                      placeholder="Enter your username"
                      className="w-full px-4 py-4 bg-transparent text-white placeholder-white/50 outline-none focus:placeholder-white/70 transition-all duration-300"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField('')}
                    />
                  </div>
                </div>
              </div>

              <div className="relative group mb-6">
                <label className="block text-white/80 text-sm font-medium mb-2 transition-colors duration-300 group-hover:text-white">
                  email
                </label>
                <div className={`relative transition-all duration-300 ${focusedField === 'username' ? 'transform scale-105' : ''}`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:border-white/40 transition-all duration-300">
                    <User className="ml-4 w-5 h-5 text-purple-300" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-4 bg-transparent text-white placeholder-white/50 outline-none focus:placeholder-white/70 transition-all duration-300"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                    />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="relative group mb-6">
                <label className="block text-white/80 text-sm font-medium mb-2 transition-colors duration-300 group-hover:text-white">
                  Password
                </label>
                <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'transform scale-105' : ''}`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:border-white/40 transition-all duration-300">
                    <Lock className="ml-4 w-5 h-5 text-purple-300" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full px-4 py-4 bg-transparent text-white placeholder-white/50 outline-none focus:placeholder-white/70 transition-all duration-300"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField('')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="mr-4 p-1 hover:bg-white/10 rounded-lg transition-all duration-300"
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

              {/* Full Name Field */}
              <div className="relative group mb-6">
                <label className="block text-white/80 text-sm font-medium mb-2 transition-colors duration-300 group-hover:text-white">
                  Full Name
                </label>
                <div className={`relative transition-all duration-300 ${focusedField === 'name' ? 'transform scale-105' : ''}`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 outline-none hover:border-white/40 focus:border-purple-400/60 focus:placeholder-white/70 transition-all duration-300"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                  />
                </div>
              </div>

              {/* Role Field */}
              <div className="relative group mb-6">
                <label className="block text-white/80 text-sm font-medium mb-2 transition-colors duration-300 group-hover:text-white">
                  Role
                </label>
                <div className={`relative transition-all duration-300 ${focusedField === 'role' ? 'transform scale-105' : ''}`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <select
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white outline-none hover:border-white/40 focus:border-purple-400/60 transition-all duration-300 appearance-none cursor-pointer"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    onFocus={() => setFocusedField('role')}
                    onBlur={() => setFocusedField('')}
                  >
                    <option value="WORKER" className="bg-slate-800 text-white">Worker</option>
                    <option value="ADMIN" className="bg-slate-800 text-white">Admin</option>
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-purple-300"></div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                onClick={handleSubmit}
                className="group relative w-full py-4 px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl text-white font-semibold overflow-hidden hover:shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  <Shield className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="group-hover:scale-105 transition-transform duration-300">Create Account</span>
                </div>
                
                {/* Button shine effect */}
                <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 opacity-0 group-hover:animate-pulse"></div>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-white/60 text-sm">
                Already have an account?{' '}
                <a href="/login" className="text-purple-300 hover:text-purple-200 font-medium hover:underline transition-all duration-300">
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}