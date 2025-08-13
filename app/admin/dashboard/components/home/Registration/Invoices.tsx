import { Product } from "@/type";
import { BarChart3, Calendar, Eye, FileText } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";


interface CompoInfo {
  invoices: Product[]; 
  setSelectedInvoice: React.Dispatch<React.SetStateAction<Product | null>>; // More specific type
  selectedInvoice: Product | null; 
}

const Invoices: React.FC<CompoInfo> = ({
  invoices,
  setSelectedInvoice,
  selectedInvoice,
}) => {

  if (!invoices || !Array.isArray(invoices)) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
        <p className="text-slate-600">Aucune facture disponible</p>
      </div>
    );
  }
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">Registre des factures</h2>
              <p className="text-slate-300 text-sm">
                Gérez vos enregistrements d’inventaire
              </p>
            </div>
          </div>
          <div className="bg-blue-500/20 px-3 py-1 rounded-full">
            <span className="text-blue-100 font-semibold text-sm">
              {invoices.length}
            </span>
          </div>
        </div>
      </div>

      {/* Invoice List*/}
      <div className="max-h-96 overflow-y-auto bg-gradient-to-b from-slate-50 to-white">
        {invoices.map((invoice, index) => (
          <div
            key={invoice.id}
            onClick={() => setSelectedInvoice(invoice)}
            className={`cursor-pointer transition-all duration-300 border-b border-slate-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 ${
              selectedInvoice?.id === invoice.id
                ? "bg-gradient-to-r from-blue-100 to-indigo-100 border-l-4 border-l-blue-500 shadow-md"
                : ""
            }`}
          >
            <div className="p-5">
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm ${
                      selectedInvoice?.id === invoice.id
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                        : "bg-gradient-to-r from-slate-400 to-slate-500"
                    }`}
                  >
                    #{index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 leading-tight">
                      {invoice.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      ID: {invoice.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-slate-100 px-2 py-1 rounded-lg">
                    <span className="text-xs font-medium text-slate-600">
                      {invoice.productLines.length} articles
                    </span>
                  </div>
                </div>
              </div>

              {/* Invoice Metadata */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <BarChart3 className="h-3 w-3" />
                    <span>Actif</span>
                  </span>
                </div>
                {selectedInvoice?.id === invoice.id && (
                  <div className="flex items-center space-x-1 text-blue-600">
                    <Eye className="h-3 w-3" />
                    <span className="font-medium">En cours de visualisation</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Invoices;
