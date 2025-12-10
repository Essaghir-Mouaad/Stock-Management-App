import { Product } from "@/types/type";
import {
  Calendar,
  Package,
  Pen,
  SquareArrowOutUpRight,
  Trash,
  Check,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

type InvoiceComponenetPorps = {
  invoice: Product;
  index: number;
  onNameUpdate?: (id: string, newName: string) => void; // Add this prop
};

const InvoiceProductsCompo: React.FC<InvoiceComponenetPorps> = ({
  invoice,
  index,
  onNameUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(invoice.name);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleNameChange = async () => {
    if (!editName.trim() || editName.trim().length > 20) {
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: invoice.id, name: editName.trim() }),
      });

      if (response.ok) {
        onNameUpdate?.(invoice.id, editName.trim());
        setIsEditing(false);
      } else {
        console.error("Failed to update invoice name");
      }
    } catch (error) {
      console.error("Error updating invoice name:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelEdit = () => {
    setEditName(invoice.name);
    setIsEditing(false);
  };
  
  return (
    <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 mb-6 overflow-hidden border border-gray-100 hover:border-indigo-200 hover:scale-[1.02] transform">
      {/* Enhanced Header Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full translate-y-36 -translate-x-36"></div>

        <div className="relative p-8">
          <div className="flex flex-row justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-white/15 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-white/70 text-sm font-medium tracking-wide uppercase">
                  Facture
                </div>
                <div className="text-white text-2xl font-bold tracking-tight">
                  FACT-{invoice.id}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="w-4 h-4 text-white/60" />
                  <span className="text-white/80 text-sm font-medium">
                    {new Date(invoice.createdAt).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <Link
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl transition-all duration-300 flex items-center space-x-3 border border-white/20 hover:border-white/40 shadow-lg group-hover:scale-105 hover:shadow-xl"
              href={`/admin/productManage/${invoice.id}`}
            >
              <span className="font-semibold">Configurer</span>
              <SquareArrowOutUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>

          <div className="flex flex-row justify-between items-center mt-6">
            <div>
              <div className="flex items-center">
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-white/10 backdrop-blur-sm text-white text-3xl font-bold tracking-tight border border-white/30 rounded-xl px-3 py-1 focus:outline-none focus:border-white/60"
                      maxLength={20}
                      disabled={isUpdating}
                    />
                    <button
                      onClick={handleNameChange}
                      disabled={isUpdating || !editName.trim() || editName.trim().length > 20}
                      className="bg-green-500/20 hover:bg-green-500/30 backdrop-blur-sm border border-green-400/30 rounded-xl p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <Check className="w-4 h-4 text-green-300" />
                      )}
                    </button>
                    <button
                      onClick={cancelEdit}
                      disabled={isUpdating}
                      className="bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm border border-red-400/30 rounded-xl p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4 text-red-300" />
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 rounded-xl p-2 mr-2 cursor-pointer transition-all duration-300"
                    >
                      <Pen className="w-4 h-4 text-white" />
                    </button>
                    <h2 className="text-white text-3xl font-bold tracking-tight">
                      {invoice.name}
                    </h2>
                  </>
                )}
              </div>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mt-2"></div>
            </div>

            <div>
              <div className="bg-emerald-500/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-emerald-400/30">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-200 text-sm font-semibold">
                    Prêt à configurer
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceProductsCompo;
