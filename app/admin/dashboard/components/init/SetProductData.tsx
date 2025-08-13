import { Product } from '@/type';
import { FileText, Layers, LoaderPinwheelIcon, Plus, Sparkles } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import InvoiceProductsCompo from './productInvoiceCompo';
import confetti from 'canvas-confetti';

const SetProductData = () => {
  const [invoiceName, setInvoiceName] = useState("");
  const [isNameValid, setIsNameValid] = useState(true);
  const [invoice, setInvoice] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch invoices for the logged-in user
  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products`, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const invoices = await res.json();
        setInvoice(invoices || []);
      } else {
        console.error("Failed to fetch invoice data");
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  // ✅ Create new invoice
  const handleProductInvoiceCreation = async () => {
    if (!invoiceName.trim()) {
      console.warn("Invoice name missing");
      return;
    }

    if (invoiceName.trim().length > 20) {
      console.warn("Invoice name too long");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: invoiceName.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to create invoice");
      }

      const newInvoice = await response.json();
      setInvoice((prev) => [...prev, newInvoice]);
      setInvoiceName("");

      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
      if (modal) modal.close();

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 9999,
      });
    } catch (error) {
      console.error("Error creating invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNameValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setInvoiceName(name);
    setIsNameValid(name.length <= 25);
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    {/* Hero Section */}
    <div id='info' className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-blue-700 to-indigo-800 rounded-3xl mb-8 shadow-2xl">
      {/* Background Pattern */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full translate-y-36 -translate-x-36"></div> */}
      
      <div className="relative p-12">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-white/15 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-lg">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="text-white/70 text-sm font-medium tracking-wide uppercase mb-1">Gestion des Factures</div>
              <h1 className="font-bold text-5xl text-white tracking-tight">
                Créer Votre Facture
              </h1>
            </div>
          </div>
          
          <button
            onClick={fetchInvoice}
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-7 py-4 rounded-2xl transition-all duration-100 flex items-center space-x-3 border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="loading loading-spinner loading-sm"></div>
                <span className="font-semibold">Chargement...</span>
              </>
            ) : (
              <>
                <LoaderPinwheelIcon className="h-6 w-6" />
                <span className="font-semibold">Actualiser</span>
              </>
            )}
          </button>
        </div>
        
        <div className="h-1 w-50 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mt-6 mb-6"></div>
        
        <p className="text-white/90 text-lg font-medium leading-relaxed max-w-4xl">
          Initialisez et gérez vos factures de stock avec un système intelligent 
          de suivi et de configuration des produits.
        </p>
      </div>
    </div>

    {/* Main Content */}
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      {/* Info Card */}
      <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 rounded-2xl p-6 mb-8 border-l-8 border-amber-400 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-start space-x-4">
          <div className="bg-amber-100 p-3 rounded-xl border border-amber-200 group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-lg font-bold text-amber-800">Information Importante</h2>
              <div className="bg-amber-200 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">
                Initialisation
              </div>
            </div>
            <p className="text-amber-700 font-medium leading-relaxed">
              Cette facture sert à initialiser les quantités des produits pour chaque 
              stock arrivé. Configurez soigneusement les données initiales.
            </p>
          </div>
        </div>
      </div>

      {/* Create New Invoice Card */}
      <div id='create'
        className="group bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-2xl p-8 mb-8 border-2 border-dashed border-indigo-300 hover:border-indigo-400 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-[1.009] transform"
        onClick={() =>
          (
            document.getElementById("my_modal_3") as HTMLDialogElement
          )?.showModal()
        }
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-100 group-hover:bg-indigo-200 p-4 rounded-2xl transition-all duration-300 group-hover:scale-110">
              <Plus className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <div className="font-bold text-xl text-indigo-800 mb-1">
                Créer une Nouvelle Facture
              </div>
              <div className="text-indigo-600 font-medium">
                Nommer la facture du mois et commencer la configuration
              </div>
            </div>
          </div>
          <div className="bg-indigo-200 group-hover:bg-indigo-300 text-indigo-700 rounded-full p-3 transition-all duration-300">
            <Layers className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col justify-center items-center py-16">
          <div className="loading loading-spinner loading-lg text-indigo-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement des factures...</p>
        </div>
      )}

      {/* Invoice List */}
      {!loading && invoice.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-blue-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800">Factures Existantes</h2>
            <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">
              {invoice.length} facture{invoice.length > 1 ? 's' : ''}
            </div>
          </div>
          
          {invoice.map((line, index) => (
            <InvoiceProductsCompo key={index} invoice={line} index={index} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && invoice.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Aucune facture créée</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Commencez par créer votre première facture pour initialiser 
            votre système de gestion de stock.
          </p>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            onClick={() =>
              (
                document.getElementById("my_modal_3") as HTMLDialogElement
              )?.showModal()
            }
          >
            Créer ma première facture
          </button>
        </div>
      )}
    </div>

    {/* Enhanced Modal */}
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-md">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 hover:bg-gray-100">
            ✕
          </button>
        </form>
        
        <div className="text-center mb-6">
          <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FileText className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="font-bold text-2xl text-gray-800 mb-2">Nouvelle Facture</h3>
          <p className="text-gray-600">Donnez un nom à votre facture pour commencer</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nom de la facture
            </label>
            <input
              type="text"
              placeholder="Ex. : Stock Juillet 2025"
              className={`input input-bordered w-full bg-gray-50 border-2 focus:border-indigo-500 focus:bg-white transition-all duration-300 ${
                isNameValid ? "border-gray-300" : "border-red-400 bg-red-50"
              }`}
              onChange={handleNameValidation}
              value={invoiceName}
            />
            {!isNameValid && (
              <p className="text-sm text-red-500 mt-2 flex items-center space-x-1">
                <span>⚠️</span>
                <span>Le nom doit contenir 20 caractères maximum.</span>
              </p>
            )}
          </div>
          
          <button
            className="btn w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl py-3 font-semibold transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={!isNameValid || invoiceName.length === 0 || loading}
            onClick={handleProductInvoiceCreation}
          >
            {loading ? (
              <>
                <div className="loading loading-spinner loading-sm mr-2"></div>
                Création en cours...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                Créer la facture
              </>
            )}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
);
};

export default SetProductData;
