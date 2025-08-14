import React from "react";
import {
  TrendingUp,
  Package,
  Activity,
  BarChart3,
  Award,
  Eye,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Info,
} from "lucide-react";

interface ProductPerformanceProps {
  analysisData: {
    currentOverview: null;
    productPerformance: [];
    getCategoryStats: [];
  };
}

const ProductPerformanceSection: React.FC<ProductPerformanceProps> = ({
  analysisData,
}) => {
  const stats = {
    totalMovements: analysisData.productPerformance.reduce(
      (sum, p) => sum + p.movementCount,
      0
    ),
    activeProducts: analysisData.productPerformance.length,
    totalInflow: analysisData.productPerformance.reduce(
      (sum, p) => sum + p.totalIn,
      0
    ),
    totalOutflow: analysisData.productPerformance.reduce(
      (sum, p) => sum + p.totalOut,
      0
    ),
  };

  return (
    <div className="space-y-6">
      {/* Main Product Performance Block */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50/80 to-blue-50/60 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500">
        {/* Subtle animated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-50"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full blur-2xl"></div>

        <div className="relative p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Produits les plus performants
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Dernières analyses de mouvements
                </p>
              </div>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full border border-green-200">
              <span className="text-green-700 font-semibold text-sm flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Mises à jour en direct</span>
              </span>
            </div>
          </div>

          {/* Product List */}
          {analysisData.productPerformance.length > 0 ? (
            <div className="space-y-3">
              {analysisData.productPerformance
                .slice(0, 4)
                .map((product, index) => (
                  <div
                    key={index}
                    className="group/item relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-white/30 p-5 hover:bg-white/90 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-300 ${
                              index === 0
                                ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                                : index === 1
                                ? "bg-gradient-to-br from-slate-400 to-slate-600"
                                : index === 2
                                ? "bg-gradient-to-br from-orange-400 to-red-500"
                                : "bg-gradient-to-br from-blue-500 to-indigo-600"
                            }`}
                          >
                            #{index + 1}
                          </div>
                          {index < 3 && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-sm">
                              <Award className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="font-semibold text-slate-900 text-lg group-hover/item:text-blue-600 transition-colors">
                            {product.name}
                          </div>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-sm text-slate-500 flex items-center">
                              <Activity className="w-4 h-4 mr-1" />
                              {product.movementCount} mouvements
                            </span>
                            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                            <span className="text-sm text-blue-600 font-medium">
                              Actif
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Performance indicators */}
                      <div className="text-right space-y-1">
                        <div className="flex items-center justify-end space-x-2">
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                          <span className="font-bold text-green-600 text-lg">
                            +{product.totalIn.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-end space-x-2">
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                          <span className="font-semibold text-red-500">
                            -{product.totalOut.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar for visual appeal */}
                    {/* This progress show us how the total IN of a product X is performed comparing with the top products */}
                    <div className="mt-4">
                      <div className="relative w-full h-16 bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
                        {/* Background helix pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="w-full h-full bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 transform skew-y-1"></div>
                        </div>

                        {/* Animated helical progress bar */}
                        <div
                          className="relative h-full rounded-2xl overflow-hidden transform-gpu"
                          style={{
                            width: `${Math.min(
                              (product.totalIn /
                                Math.max(
                                  ...analysisData.productPerformance.map(
                                    (p) => p.totalIn
                                  )
                                )) *
                                100,
                              100
                            )}%`,
                            background:
                              "linear-gradient(45deg, #ef4444, #06b6d4, #6366f1, #8b5cf6)",
                            backgroundSize: "200% 200%",
                            animation:
                              "helixFlow 3s ease-in-out infinite, gradientShift 4s ease-in-out infinite",
                            boxShadow:
                              "0 4px 15px rgba(99, 102, 241, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.2)",
                            transition:
                              "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        >
                          {/* Helical shine effect */}
                          <div
                            className="absolute inset-0 opacity-60"
                            style={{
                              background: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 8px,
              rgba(255, 255, 255, 0.1) 8px,
              rgba(255, 255, 255, 0.1) 16px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 12px,
              rgba(255, 255, 255, 0.05) 12px,
              rgba(255, 255, 255, 0.05) 24px
            )
          `,
                              animation: "helixRotate 6s linear infinite",
                            }}
                          ></div>

                          {/* Floating particles effect */}
                          <div className="absolute inset-0 overflow-hidden">
                            <div
                              className="absolute w-2 h-2 bg-white rounded-full opacity-40"
                              style={{
                                animation:
                                  "floatParticle1 2s ease-in-out infinite",
                                left: "10%",
                                top: "20%",
                              }}
                            ></div>
                            <div
                              className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-30"
                              style={{
                                animation:
                                  "floatParticle2 2.5s ease-in-out infinite",
                                left: "60%",
                                top: "60%",
                              }}
                            ></div>
                            <div
                              className="absolute w-1 h-1 bg-white rounded-full opacity-50"
                              style={{
                                animation:
                                  "floatParticle3 1.8s ease-in-out infinite",
                                left: "80%",
                                top: "30%",
                              }}
                            ></div>
                          </div>

                          {/* Progress glow effect */}
                          <div
                            className="absolute inset-0 rounded-2xl"
                            style={{
                              background:
                                "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                              animation: "progressGlow 2s ease-in-out infinite",
                            }}
                          ></div>
                        </div>

                        {/* End cap with pulsing effect */}
                        <div
                          className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full shadow-lg"
                          style={{
                            left: `${Math.min(
                              (product.totalIn /
                                Math.max(
                                  ...analysisData.productPerformance.map(
                                    (p) => p.totalIn
                                  )
                                )) *
                                100,
                              100
                            )}%`,
                            background:
                              "radial-gradient(circle, #8b5cf6, #6366f1)",
                            animation: "endCapPulse 2s ease-in-out infinite",
                            transition:
                              "left 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                            marginLeft: "-8px",
                            boxShadow:
                              "0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(99, 102, 241, 0.3)",
                          }}
                        ></div>
                      </div>

                      <style jsx>{`
                        @keyframes helixFlow {
                          0%,
                          100% {
                            transform: perspective(100px) rotateX(0deg) scale(1);
                          }
                          50% {
                            transform: perspective(100px) rotateX(5deg)
                              scale(1.02);
                          }
                        }

                        @keyframes gradientShift {
                          0% {
                            background-position: 0% 50%;
                          }
                          50% {
                            background-position: 100% 50%;
                          }
                          100% {
                            background-position: 0% 50%;
                          }
                        }

                        @keyframes helixRotate {
                          0% {
                            transform: translateX(-100%) rotate(0deg);
                          }
                          100% {
                            transform: translateX(100%) rotate(360deg);
                          }
                        }

                        @keyframes floatParticle1 {
                          0%,
                          100% {
                            transform: translateY(0px) rotate(0deg);
                            opacity: 0.4;
                          }
                          50% {
                            transform: translateY(-8px) rotate(180deg);
                            opacity: 0.8;
                          }
                        }

                        @keyframes floatParticle2 {
                          0%,
                          100% {
                            transform: translateY(0px) rotate(0deg) scale(1);
                            opacity: 0.3;
                          }
                          50% {
                            transform: translateY(-12px) rotate(270deg)
                              scale(1.2);
                            opacity: 0.7;
                          }
                        }

                        @keyframes floatParticle3 {
                          0%,
                          100% {
                            transform: translateY(0px) rotate(0deg);
                            opacity: 0.5;
                          }
                          50% {
                            transform: translateY(-6px) rotate(90deg);
                            opacity: 0.9;
                          }
                        }

                        @keyframes progressGlow {
                          0%,
                          100% {
                            transform: translateX(-100%);
                            opacity: 0;
                          }
                          50% {
                            transform: translateX(100%);
                            opacity: 1;
                          }
                        }

                        @keyframes endCapPulse {
                          0%,
                          100% {
                            transform: translateY(-50%) scale(1);
                            box-shadow: 0 0 20px rgba(139, 92, 246, 0.6),
                              0 0 40px rgba(99, 102, 241, 0.3);
                          }
                          50% {
                            transform: translateY(-50%) scale(1.3);
                            box-shadow: 0 0 30px rgba(139, 92, 246, 0.8),
                              0 0 60px rgba(99, 102, 241, 0.5);
                          }
                        }
                      `}</style>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                Aucune donnée de performance
              </h3>
              <p className="text-slate-500">
                {" "}
                Les données de performance des produits apparaîtront ici dès
                qu’elles seront disponibles.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50/80 to-blue-50/60 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500">
        {/* Subtle animated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-50"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full blur-2xl"></div>

        <div className="relative p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Catégories les plus performantes
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Dernières analyses de mouvements
                </p>
              </div>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full border border-green-200">
              <span className="text-green-700 font-semibold text-sm flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Mises à jour en direct</span>
              </span>
            </div>
          </div>

          {/* Product List */}
          {analysisData.getCategoryStats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analysisData.getCategoryStats.map(
                (category: any, index: number) => (
                  <div
                    key={index}
                    className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                  >
                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${
                          category.color || `hsl(${index * 60}, 70%, 50%)`
                        }, transparent)`,
                      }}
                    ></div>

                    {/* Header with color accent */}
                    <div className="relative p-6 pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                          style={{
                            backgroundColor:
                              category.color || `hsl(${index * 60}, 70%, 50%)`,
                            boxShadow: `0 8px 25px ${
                              category.color || `hsl(${index * 60}, 70%, 50%)`
                            }20`,
                          }}
                        >
                          <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor:
                                  category.color ||
                                  `hsl(${index * 60}, 70%, 50%)`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div
                            className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
                            style={{
                              backgroundImage: `linear-gradient(135deg, ${
                                category.color || `hsl(${index * 60}, 70%, 50%)`
                              }, ${
                                category.color || `hsl(${index * 60}, 70%, 50%)`
                              }80)`,
                            }}
                          >
                            {category.percentage.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                            Share
                          </div>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                        {category.name}
                      </h3>
                    </div>

                    {/* Content */}
                    <div className="relative px-6 pb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex -space-x-1">
                            {[
                              ...Array(
                                Math.min(
                                  3,
                                  Math.ceil(category.movementCount / 10)
                                )
                              ),
                            ].map((_, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                style={{
                                  backgroundColor: `${
                                    category.color ||
                                    `hsl(${index * 60}, 70%, 50%)`
                                  }${80 - i * 20}`,
                                }}
                              ></div>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 font-medium">
                            movements
                          </span>
                        </div>

                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">
                            {category.movementCount}
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-1 h-3 rounded-full transition-all duration-300 ${
                                  i < Math.ceil((category.percentage / 100) * 5)
                                    ? "opacity-100"
                                    : "opacity-20"
                                }`}
                                style={{
                                  backgroundColor:
                                    category.color ||
                                    `hsl(${index * 60}, 70%, 50%)`,
                                  animationDelay: `${i * 100}ms`,
                                }}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom accent line */}
                    <div
                      className="h-1 w-full"
                      style={{
                        background: `linear-gradient(90deg, ${
                          category.color || `hsl(${index * 60}, 70%, 50%)`
                        }, transparent)`,
                      }}
                    ></div>
                  </div>
                )
              )}
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
                      Les données de performance des produits apparaîtront ici
                      dès qu'elles seront disponibles.
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
      </div>

      {/* Supporting Statistics Blocks */}
      <div className="flex flex-col mt-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                PLus d'information:
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Dernières analyses de mouvements
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full border border-green-200">
            <span className="text-green-700 font-semibold text-sm flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Mises à jour en direct</span>
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Movements */}
          <div className="bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-blue-600 text-sm font-medium">Total</span>
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-1">
              {stats.totalMovements}
            </div>
            <div className="text-slate-500 text-sm">Mouvements totaux</div>
          </div>

          {/* Active Products */}
          <div className="bg-gradient-to-br from-white to-green-50/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-600 text-sm font-medium">Actif</span>
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-1">
              {stats.activeProducts}
            </div>
            <div className="text-slate-500 text-sm">Produits suivis</div>
          </div>

          {/* Total Inflow */}
          <div className="bg-gradient-to-br from-white to-emerald-50/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                <ArrowUpRight className="w-6 h-6 text-white" />
              </div>
              <span className="text-emerald-600 text-sm font-medium">
                Entrées
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-1">
              +{stats.totalInflow.toFixed(0)}
            </div>
            <div className="text-slate-500 text-sm">Total reçu</div>
          </div>

          {/* Total Outflow */}
          <div className="bg-gradient-to-br from-white to-red-50/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                <ArrowDownRight className="w-6 h-6 text-white" />
              </div>
              <span className="text-red-600 text-sm font-medium">Sorties</span>
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-1">
              -{stats.totalOutflow.toFixed(0)}
            </div>
            <div className="text-slate-500 text-sm">Total expédié</div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl hover:bg-white/90 transition-all duration-300 cursor-pointer">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <h5 className="font-semibold text-slate-900">
              Voir les analyses détaillées
            </h5>
          </div>
          <p className="text-sm text-slate-600">
            {" "}
            Gérer les niveaux de stock Update inventory quantities and manage
            product availability
          </p>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl hover:bg-white/90 transition-all duration-300 cursor-pointer">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <ShoppingCart className="w-5 h-5 text-green-600" />
            </div>
            <h5 className="font-semibold text-slate-900">
              Gérer les niveaux de stock
            </h5>
          </div>
          <p className="text-sm text-slate-600">
            Mettre à jour les quantités en stock et gérer la disponibilité des
            produits
          </p>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl hover:bg-white/90 transition-all duration-300 cursor-pointer">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <h5 className="font-semibold text-slate-900">
              {" "}
              Exporter le rapport de performance
            </h5>
          </div>
          <p className="text-sm text-slate-600">
            Générer des rapports détaillés pour l’analyse et l’archivage
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductPerformanceSection;
