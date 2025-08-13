import { Product } from "@/type";
import {
  ChartBarIncreasing,
  LucideBadgeDollarSign,
  Package,
} from "lucide-react";
import React from "react";

interface StockPricing {
  invoice: Product[];
  calculateInvoiceStats: (productLines: any[]) => {
    totalProducts: number;
    totalCurrentStock: number;
    totalInitialStock: number;
    totalValue: number;
    totalValueInitial: number;
    lowStockItems: number;
    averageQuality: number;
    overallStockPercentage: number;
  };
}

const StockPricing: React.FC<StockPricing> = ({
  invoice,
  calculateInvoiceStats,
}) => {
  return (
    <div>
      {invoice.length > 0 ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {invoice.map((product: any, index: number) => {
            const stats = calculateInvoiceStats(product.productLines);

            return (
              <div
                key={`${product.overallStockPercentage}_${index}`}
                className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden group hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1"
              >
                {/* Animated background elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-indigo-50/30"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-200/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
                <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-indigo-200/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700"></div>

                {/* Header Section */}
                <div className="relative bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 px-8 py-6 overflow-hidden">
                  {/* Header background pattern */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

                  {/* Floating orbs in header */}
                  <div className="absolute top-2 right-8 w-6 h-6 bg-white/20 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-3 right-16 w-3 h-3 bg-white/30 rounded-full animate-pulse animation-delay-1000"></div>

                  <div className="relative flex items-center space-x-4">
                    {/* Icon container with glow */}
                    <div className="relative">
                      <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-xl group-hover:scale-110 transition-all duration-300">
                        <LucideBadgeDollarSign className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/40 to-green-400/40 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 -z-10"></div>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-white font-bold text-xl leading-tight">
                        Statistiques de l'inventaire de Fact--<span className="font-bold text-gray-300 text-3xl">{product?.name}</span>
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                        <p className="text-purple-100 text-sm font-medium">
                          Données en temps réel
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="relative p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Initial Stock Card */}
                    <div className="group/card relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-2xl border-2 border-green-200/50 hover:border-green-300 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
                      {/* Card background effects */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-emerald-400/5"></div>
                      <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-200/30 rounded-full blur-2xl group-hover/card:blur-3xl transition-all duration-500"></div>

                      <div className="relative p-6 space-y-4">
                        {/* Card header */}
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                            </svg>
                          </div>
                          <h4 className="font-bold text-green-800 text-lg">
                            Stock Initial
                          </h4>
                        </div>

                        {/* Stats */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-green-200/50">
                            <span className="text-green-700 font-medium">
                              Quantité initiale:
                            </span>
                            <span className="font-bold text-green-900 text-lg">
                              {stats.totalInitialStock}
                            </span>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-green-200">
                            <span className="text-green-700 font-medium">
                              Nomber de produits:
                            </span>
                            <span className="font-bold text-green-900">
                              {stats.totalProducts}
                            </span>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-green-200/50">
                            <span className="text-green-700 font-medium">
                              Montant Initial:
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-green-900 text-lg">
                                {stats.totalValueInitial}
                              </span>
                              <span className="text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-lg text-sm">
                                Dh
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Current Stock Card */}
                    <div className="group/card relative overflow-hidden bg-gradient-to-br from-rose-50 via-red-50 to-pink-50 rounded-2xl border-2 border-red-200/50 hover:border-red-300 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10">
                      {/* Card background effects */}
                      <div className="absolute inset-0 bg-gradient-to-br from-red-400/5 to-rose-400/5"></div>
                      <div className="absolute -top-6 -right-6 w-24 h-24 bg-red-200/30 rounded-full blur-2xl group-hover/card:blur-3xl transition-all duration-500"></div>

                      <div className="relative p-6 space-y-4">
                        {/* Card header */}
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <h4 className="font-bold text-red-800 text-lg">
                            Stock Actuel
                          </h4>
                        </div>

                        {/* Stats */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-red-200/50">
                            <span className="text-red-700 font-medium">
                              Quantité actuelle:
                            </span>
                            <span className="font-bold text-red-900 text-lg">
                              {stats.totalCurrentStock}
                            </span>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-red-200/50">
                            <span className="text-red-700 font-medium">
                              Montant Actuel:
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-red-900 text-lg">
                                {stats.totalValue}
                              </span>
                              <span className="text-red-600 font-semibold bg-red-100 px-2 py-1 rounded-lg text-sm">
                                Dh
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom comparison indicator */}
                  <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200/50">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-indigo-700 font-medium text-sm">
                          Initial
                        </span>
                      </div>

                      <svg
                        className="w-6 h-6 text-indigo-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>

                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-rose-500 rounded-full animate-pulse animation-delay-500"></div>
                        <span className="text-indigo-700 font-medium text-sm">
                          Actuel
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <style jsx>{`
                  .animation-delay-500 {
                    animation-delay: 0.5s;
                  }
                  .animation-delay-1000 {
                    animation-delay: 1s;
                  }
                  .hover:shadow-3xl {
                    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
                  }
                `}</style>
              </div>
            );
          })}
        </div>
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
                  Aucune donnée de performance
                </h3>

                <p className="text-slate-500 text-lg leading-relaxed">
                  Les données de performance des produits apparaîtront ici dès
                  qu'elles seront disponibles.
                </p>

                {/* Status indicator */}
                <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200 mt-6">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse"></div>
                    <div
                      className="w-2 h-2 bg-slate-300 rounded-full animate-pulse"
                      style={{ animationDelay: "0.3s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-slate-300 rounded-full animate-pulse"
                      style={{ animationDelay: "0.6s" }}
                    ></div>
                  </div>
                  <span className="text-slate-600 text-sm font-medium">
                    Waiting for data
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockPricing;
