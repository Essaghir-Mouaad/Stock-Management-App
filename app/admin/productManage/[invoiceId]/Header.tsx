import { Product } from "@/type";
import { LogOut, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";

interface HeaderInfo {
  invoice: Product;
  invoiceId: string;
  setShowModel: (value: boolean) => void;
  handleDeleteInvoice: () => void;
}

const Header: React.FC<HeaderInfo> = ({
  invoice,
  invoiceId,
  setShowModel,
  handleDeleteInvoice,
}) => {
  return (
    <div className="relative bg-gradient-to-r from-slate-800 via-purple-700 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>

      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute -top-20 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>

      {/* Glass Effect Overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

      <div className="relative max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          {/* Left Side - Title and Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-15 h-15 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent leading-tight">
                  Gestion des produits
                </h1>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-blue-100/80 text-lg font-medium">
                    Facture:{" "}
                    <span className="text-white font-semibold">
                      {invoice?.name || "Chargement..."}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Invoice ID Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-blue-200 text-sm font-medium">ID: </span>
              <span className="text-white font-mono text-sm ml-1">
                {invoiceId}
              </span>
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex flex-wrap items-center gap-3 py-4">
            {/* Delete Invoice Button */}
            <button
              onClick={handleDeleteInvoice}
              className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/25 hover:scale-105 transform"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-2">
                <Trash2
                  size={20}
                  className="group-hover:rotate-12 transition-transform duration-300"
                />
                <span className="font-semibold">Supprimer la facture</span>
              </div>
              {/* Ripple Effect */}
              <div className="absolute inset-0 bg-white/20 scale-0 group-active:scale-100 rounded-xl transition-transform duration-200"></div>
            </button>

            {/* Add Product Button */}
            <button
              onClick={() => setShowModel(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105 transform"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-2">
                <Plus
                  size={20}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
                <span className="font-semibold">Ajouter un produit</span>
              </div>
              {/* Shine Effect */}
              <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shine"></div>
            </button>

            {/* Dashboard Button */}
            <Link
              href="/admin/dashboard"
              className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 
             hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl 
             transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 hover:scale-105 
             transform flex items-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-2">
                <LogOut
                  size={20}
                  className="group-hover:rotate-12 transition-transform duration-300"
                />
                <span className="font-semibold">Tableau de bord</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom Decorative Line */}
        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>
    </div>
  );
};

export default Header;
