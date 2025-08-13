import { Product } from "@/type";
import React, { useEffect, useState } from "react";
import TrackingInvoiceItems from "./TrackingInvoiceItems";
import {
  AlertTriangle,
  BarChart3,
  Info,
  Package,
  TrendingUp,
} from "lucide-react";

const TrackProducts = () => {
  const [invoice, setInvoice] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const responce = await fetch("/api/products", {
        method: "GET",
        credentials: "include",
      });

      if (responce.ok) {
        const products = await responce.json();
        setInvoice(products || []);
        setLoading(false);
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl mb-8 shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full translate-y-36 -translate-x-36"></div>

        <div className="relative p-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/15 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-lg">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="text-white/70 text-sm font-medium tracking-wide uppercase mb-1">
                Dashboard de Suivi
              </div>
              <h1 className="font-bold text-5xl text-white tracking-tight">
                Détail des Quantités Restantes
              </h1>
            </div>
          </div>

          <div className="h-1 w-32 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mb-6"></div>

          <p className="text-white/90 text-lg font-medium leading-relaxed max-w-4xl">
            Surveillez en temps réel l'état de votre inventaire avec des
            analyses détaillées, des alertes intelligentes et des visualisations
            interactives pour optimiser votre gestion de stock.
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 rounded-2xl p-8 mb-8 border-l-8 border-amber-400 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-start space-x-4">
          <div className="bg-amber-100 p-3 rounded-xl border border-amber-200 group-hover:scale-110 transition-transform duration-300">
            <Info className="w-8 h-8 text-amber-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h2 className="text-xl font-bold text-amber-800">
                Informations Importantes
              </h2>
              <div className="bg-amber-200 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">
                Système d'Alerte Actif
              </div>
            </div>
            <p className="text-amber-700 font-medium leading-relaxed text-lg">
              Cette section affiche les statistiques des quantités restantes en
              stock, avec des alertes automatiques lorsque le stock passe en
              dessous du seuil minimum défini pour chaque produit.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-200">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-gray-800">
                    Suivi en Temps Réel
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  Monitoring continu des niveaux de stock
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-200">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-gray-800">
                    Alertes Intelligentes
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  Notifications automatiques de stock faible
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-800">
                    Gestion Optimisée
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  Optimisation des processus d'inventaire
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Section */}
      <div className="space-y-6">
        {invoice.map((line, idx) => (
          <TrackingInvoiceItems line={line} key={idx} />
        ))}
      </div>
    </div>
  );
};

export default TrackProducts;
