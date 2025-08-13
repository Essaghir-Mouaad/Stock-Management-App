import { Product } from "@/type";
import { FileText, Package } from "lucide-react";
import React from "react";

interface CompoInfo {
  selectedInvoice: Product | null;
  calculateInvoiceStats: (productLines: any[]) => {
    totalProducts: number;
    totalCurrentStock: number;
    totalInitialStock: number;
    totalValue: number;
    totalValueInitial:number;
    lowStockItems: number;
    averageQuality: number;
    overallStockPercentage: number;
  };
}

const DetailInfo: React.FC<CompoInfo> = ({
  selectedInvoice,
  calculateInvoiceStats,
}) => {
  return (
    <div className="w-full mt-4">
      {selectedInvoice ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {(() => {
            // Calculate stats once for the entire invoice
            const stats = calculateInvoiceStats(selectedInvoice.productLines);

            return (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
                  <h3 className="text-white font-semibold text-lg">
                    Statistiques de l’inventaire
                  </h3>
                </div>

                <div className="divide-y divide-gray-100">
                  <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="font-medium text-gray-700">
                        Produits totaux
                      </span>
                    </div>
                    <span className="text-gray-900 font-semibold">
                      {stats.totalProducts}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="font-medium text-gray-700">
                        Articles en stock faible
                      </span>
                    </div>
                    <span className="text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-full text-sm">
                      {stats.lowStockItems}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="font-medium text-gray-700">
                        Stock actuel total
                      </span>
                    </div>
                    <span className="text-gray-900 font-semibold">
                      {stats.totalCurrentStock}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span className="font-medium text-gray-700">
                        Stock initial total
                      </span>
                    </div>
                    <span className="text-gray-900 font-semibold">
                      {stats.totalInitialStock}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <span className="font-medium text-gray-700">
                        Qualité moyenne
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-900 font-semibold">
                        {stats.averageQuality.toFixed(1)}/5
                      </span>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < Math.floor(stats.averageQuality)
                                ? "bg-amber-400"
                                : "bg-gray-200"
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          stats.overallStockPercentage >= 70
                            ? "bg-green-500"
                            : stats.overallStockPercentage >= 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <span className="font-medium text-gray-700">
                        Pourcentage global du stock
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`font-semibold px-3 py-1 rounded-full text-sm ${
                          stats.overallStockPercentage >= 70
                            ? "text-green-700 bg-green-100"
                            : stats.overallStockPercentage >= 40
                            ? "text-yellow-700 bg-yellow-100"
                            : "text-red-700 bg-red-100"
                        }`}
                      >
                        {stats.overallStockPercentage}%
                      </span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            stats.overallStockPercentage >= 70
                              ? "bg-green-500"
                              : stats.overallStockPercentage >= 40
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${stats.overallStockPercentage}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="font-semibold text-gray-800">
                        Valeur totale
                      </span>
                    </div>
                    <span className="text-green-700 font-bold text-lg bg-white px-4 py-2 rounded-lg shadow-sm">
                      {stats.totalValue.toFixed(2)}Dh
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
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
                  Sélectionnez une facture
                </h3>

                <p className="text-slate-500 text-lg leading-relaxed">
                  Choisissez une facture dans le panneau de registre pour afficher les informations détaillées des produits et gérer votre inventaire.


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

export default DetailInfo;
