import { Product } from "@/type";
import React, { useEffect, useState } from "react";
import CurrentInvoiCompo from "./Invoices";
import {
  AlertTriangle,
  BarChart3,
  Info,
  Package,
  Star,
  TrendingUp,
} from "lucide-react";
import InvoiceProducts from "./InvoiceProducts";
import Invoices from "./Invoices";

const CurrentInvoice = () => {
  const [invoice, setInvoice] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

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

const getProductImage = (category: string) => {
  switch (category) {
    case "Fruits (فواكه)":
      return "🍎"; // Apple
    case "Légumes (خضروات)":
      return "🥕"; // Carrot
    case "Viande (لحم)":
      return "🥩"; // Meat
    case "Boissons (مشروبات)":
      return "🥤"; // Beverage
    case "Céréales (الحبوب)":
      return "🌾"; // Grains
    case "Produits laitiers (منتجات الألبان)":
      return "🧀"; // Cheese
    case "Produits de nettoyage (مواد التنظيف)":
      return "🧼"; // Cleaning product
    case "Épices et condiments (التوابل والمنكهات)":
      return "🧂"; // Spices
    case "Produits en conserve (المعلبات)":
      return "🥫"; // Canned food
    case "Snacks et biscuits (وجبات خفيفة وبسكويت)":
      return "🍪"; // Cookie
    case "Pain et boulangerie (الخبز والمخبوزات)":
      return "🥖"; // Bread
    case "Gaz (قنينات الغاز)":
      return "🪔"; // Gas lamp (closest match)
    case "Huiles et sauces (الزيوت والصلصات)":
      return "🫙"; // Jar (oil/sauce)
    case "Autre (أخرى)":
      return "📦"; // Other
    case "Tous (الكل)":
      return "🗂️"; // All
    default:
      return "📦"; // Default
  }
};

  const getQualityColor = (quality: number) => {
    if (quality >= 4) return "text-green-600";
    if (quality >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const renderStars = (quality: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < quality ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      {/* Professional Print Header - Enhanced */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-600 via-blue-600 to-indigo-600 rounded-3xl mb-6 shadow-xl print:hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full translate-y-36 -translate-x-36"></div>

        <div className="relative p-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/15 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-lg">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="text-white/70 text-sm font-medium tracking-wide uppercase mb-1">
                Dashboard d'Impression Professionnel
              </div>
              <h1 className="font-bold text-5xl text-white tracking-tight">
                Inventaire des Stocks Actuels
              </h1>
            </div>
          </div>

          <div className="h-1 w-32 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mb-6"></div>

          <p className="text-white/90 text-lg font-medium leading-relaxed max-w-4xl">
            Rapport détaillé de l'état de votre inventaire avec suivi en temps réel,
            analyses précises et documentation professionnelle pour une gestion optimisée.
          </p>
        </div>
      </div>

      {/* Professional Print-Only Header */}
      <div className="print:block hidden bg-white p-8 border-b-4 border-gray-800">
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">
                RAPPORT D'INVENTAIRE
              </h1>
              <div className="h-1 w-48 bg-gray-800 mb-4"></div>
              <p className="text-xl text-gray-700 font-medium">
                État des Stocks Actuels - Documentation Professionnelle
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-gray-600 font-medium mb-1">Type de Document</p>
                <p className="font-bold text-gray-900">Inventaire des Quantités</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium mb-1">Statut</p>
                <p className="font-bold text-gray-900">Rapport Officiel</p>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="bg-gray-100 p-6 rounded-lg border-2 border-gray-300 min-w-[280px]">
              <p className="text-gray-600 text-sm font-medium mb-2">Date de Génération</p>
              <p className="font-bold text-xl text-gray-900 mb-4">
                {new Date().toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              
              <div className="border-t border-gray-300 pt-4">
                <p className="text-gray-600 text-sm font-medium mb-1">Heure de Génération</p>
                <p className="font-bold text-lg text-gray-900">
                  {new Date().toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-300">
                <p className="text-gray-600 text-xs">Document ID</p>
                <p className="font-mono text-sm font-bold text-gray-900">
                  INV-{new Date().getFullYear()}-{String(new Date().getMonth() + 1).padStart(2, '0')}-{String(new Date().getDate()).padStart(2, '0')}-{Math.random().toString(36).substr(2, 6).toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Summary Bar */}
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
          <div className="grid grid-cols-4 gap-6 text-center">
            <div className="border-r border-gray-300 last:border-r-0">
              <p className="text-gray-600 text-sm font-medium mb-1">Système</p>
              <p className="font-bold text-lg text-gray-900">Gestion Stock</p>
            </div>
            <div className="border-r border-gray-300 last:border-r-0">
              <p className="text-gray-600 text-sm font-medium mb-1">Version</p>
              <p className="font-bold text-lg text-gray-900">Pro 2.1</p>
            </div>
            <div className="border-r border-gray-300 last:border-r-0">
              <p className="text-gray-600 text-sm font-medium mb-1">Module</p>
              <p className="font-bold text-lg text-gray-900">Inventaire</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Priorité</p>
              <p className="font-bold text-lg text-green-700">Actuel</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Info Card for Screen */}
      <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 rounded-2xl p-8 mb-8 border-l-8 border-amber-400 shadow-lg hover:shadow-xl transition-all duration-300 group print:hidden">
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

      {/* Print-Only*/}
      <div className="print:block hidden bg-white p-6 border-b border-gray-200 mb-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded border">
            <div className="font-bold text-gray-900 text-lg mb-2">Suivi Temps Réel</div>
            <p className="text-gray-600 text-sm">Monitoring continu des stocks</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded border">
            <div className="font-bold text-gray-900 text-lg mb-2">Alertes Automatiques</div>
            <p className="text-gray-600 text-sm">Notifications de stock faible</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded border">
            <div className="font-bold text-gray-900 text-lg mb-2">Gestion Optimisée</div>
            <p className="text-gray-600 text-sm">Processus d'inventaire améliorés</p>
          </div>
        </div>
      </div>

      {/* Invoices Section */}
      <div className="max-w-full mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Invoices
              invoices={invoice}
              selectedInvoice={selectedInvoice}
              setSelectedInvoice={setSelectedInvoice}
            />
          </div>

          {/* Enhanced Details Panel */}
          <div className="lg:col-span-2">
            {selectedInvoice ? (
              <InvoiceProducts
                selectedInvoice={selectedInvoice}
                getProductImage={getProductImage}
                getQualityColor={getQualityColor}
                renderStars={renderStars}
              />
            ) : (
              <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-3xl shadow-inner border border-slate-200 overflow-hidden">
                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-slate-300 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-10 right-10 w-24 h-24 bg-slate-400 rounded-full blur-2xl"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-slate-200 rounded-full blur-3xl"></div>
                </div>

                <div className="relative text-center py-16 px-8">
                  <div className="max-w-md mx-auto">
                    {/* Animated icon container */}
                    <div className="relative mb-8">
                      <div className="w-32 h-32 bg-gradient-to-br from-slate-100 via-white to-slate-200 rounded-3xl flex items-center justify-center mx-auto shadow-2xl border border-slate-200">
                        <div className="relative">
                          <Package className="h-16 w-16 text-slate-400" />
                          {/* Floating dots animation */}
                          <div
                            className="absolute -top-2 -right-2 w-3 h-3 bg-slate-300 rounded-full animate-bounce"
                            style={{ animationDelay: "0s" }}
                          ></div>
                          <div
                            className="absolute -bottom-2 -left-2 w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.5s" }}
                          ></div>
                          <div
                            className="absolute top-1/2 -right-4 w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"
                            style={{ animationDelay: "1s" }}
                          ></div>
                        </div>
                      </div>

                      {/* Pulsing rings */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-40 h-40 border border-slate-200 rounded-full animate-pulse opacity-30"></div>
                        <div
                          className="absolute w-48 h-48 border border-slate-200 rounded-full animate-pulse opacity-20"
                          style={{ animationDelay: "1s" }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-clip-text text-transparent">
                        Sélectionnez une facture
                      </h3>

                      <p className="text-slate-500 text-lg leading-relaxed">
                        Choisissez une facture dans le panneau de registre pour
                        afficher les informations détaillées des produits et
                        gérer votre inventaire.
                      </p>

                      {/* Status indicator */}
                      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-blue-700 text-sm font-medium">
                          💡 Astuce : Cliquez sur une facture pour explorer son
                          contenu.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentInvoice;
