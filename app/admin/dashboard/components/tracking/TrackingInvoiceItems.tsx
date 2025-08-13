import { Product } from '@/type'
import { SquareArrowDownIcon, SquareArrowUpIcon, AlertTriangle, Package, TrendingDown, Star, Calendar, Hash, Layers, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import React, { useState } from 'react'

const TrackingInvoiceItems = ({ line }: { line: Product }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => setExpanded((prev) => !prev);
  
  const handleProgress = (initStock: number, currentStock: number) => {
    return ((currentStock * 100) / initStock).toFixed(1)
  }

  const handleProgressColor = (percentage: number) => {
    if (percentage >= 75) return "from-emerald-500 to-green-400"
    if (percentage >= 50) return "from-amber-500 to-yellow-400"
    if (percentage >= 25) return "from-orange-500 to-red-400"
    return "from-red-600 to-red-500"
  }

  const handleProgressBg = (percentage: number) => {
    if (percentage >= 75) return "bg-emerald-50 border-emerald-200"
    if (percentage >= 50) return "bg-amber-50 border-amber-200"
    if (percentage >= 25) return "bg-orange-50 border-orange-200"
    return "bg-red-50 border-red-200"
  }

  const handleTextColor = (percentage: number) => {
    if (percentage >= 75) return "text-emerald-700"
    if (percentage >= 50) return "text-amber-700"
    if (percentage >= 25) return "text-orange-700"
    return "text-red-700"
  }

  // New function to get actual colors for SVG gradient
  const getGradientColors = (percentage: number) => {
    if (percentage >= 75) return { start: "#10b981", end: "#4ade80" } // emerald-500 to green-400
    if (percentage >= 50) return { start: "#f59e0b", end: "#facc15" } // amber-500 to yellow-400
    if (percentage >= 25) return { start: "#f97316", end: "#f87171" } // orange-500 to red-400
    return { start: "#dc2626", end: "#ef4444" } // red-600 to red-500
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  // Calculate invoice statistics
  const calculateInvoiceStats = () => {
    const totalProducts = line.productLines.length;
    const totalInitialStock = line.productLines.reduce((sum, product) => sum + product.initialStock, 0);
    const totalCurrentStock = line.productLines.reduce((sum, product) => sum + product.currentStock, 0);
    const totalValue = line.productLines.reduce((sum, product) => sum + (product.currentStock * product.unitPrice), 0);
    const lowStockItems = line.productLines.filter(product => product.currentStock < product.minStock).length;
    const averageQuality = line.productLines.reduce((sum, product) => sum + product.quality, 0) / totalProducts;
    const overallStockPercentage = ((totalCurrentStock * 100) / totalInitialStock).toFixed(1);
    
    return {
      totalProducts,
      totalInitialStock,
      totalCurrentStock,
      totalValue,
      lowStockItems,
      averageQuality,
      overallStockPercentage: parseFloat(overallStockPercentage)
    };
  };

  const stats = calculateInvoiceStats();

  const getStatusBadge = () => {
    if (stats.lowStockItems > 0) {
      return {
        text: "Action Requise",
        color: "bg-gradient-to-r from-red-500 to-red-600",
        textColor: "text-white",
        icon: AlertTriangle
      };
    } else if (stats.overallStockPercentage >= 75) {
      return {
        text: "Excellent",
        color: "bg-gradient-to-r from-emerald-500 to-green-500",
        textColor: "text-white",
        icon: TrendingUp
      };
    } else if (stats.overallStockPercentage >= 50) {
      return {
        text: "Bon État",
        color: "bg-gradient-to-r from-blue-500 to-blue-600",
        textColor: "text-white",
        icon: Package
      };
    } else {
      return {
        text: "Attention",
        color: "bg-gradient-to-r from-amber-500 to-orange-500",
        textColor: "text-white",
        icon: AlertTriangle
      };
    }
  };

  const statusBadge = getStatusBadge();
  const StatusIcon = statusBadge.icon;

  return (
    <div id='trackInfo' className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-400 mb-6 overflow-hidden border border-gray-100 hover:border-indigo-200 hover:scale-[1.006] transform">
      {/* Enhanced Header Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full translate-y-36 -translate-x-36"></div>
        
        <div className="relative p-8">
          {/* Top Row - Invoice Info & Status */}
          <div className="flex flex-row justify-between items-start mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/15 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-white/70 text-sm font-medium tracking-wide uppercase">Facture</div>
                <div className="text-white text-2xl font-bold tracking-tight">FACT-{line.id}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="w-4 h-4 text-white/60" />
                  <span className="text-white/80 text-sm font-medium">
                    {new Date(line.createdAt).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-3">
              <div className={`${statusBadge.color} ${statusBadge.textColor} px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 shadow-lg border border-white/20 backdrop-blur-sm`}>
                <StatusIcon className="w-4 h-4" />
                <span>{statusBadge.text}</span>
              </div>
              
              <button 
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl transition-all duration-300 flex items-center space-x-3 border border-white/20 hover:border-white/40 shadow-lg group-hover:scale-105"
                onClick={handleExpand}
              >
                <span className="text-sm font-semibold">
                  {expanded ? "Masquer les détails" : "Voir les produits"}
                </span>
                {expanded ? (
                  <SquareArrowUpIcon className="w-5 h-5 transition-transform duration-300" />
                ) : (
                  <SquareArrowDownIcon className="w-5 h-5 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>

          {/* Invoice Name */}
          <div className="mb-8">
            <h1 className="text-white text-4xl font-bold tracking-tight mb-2">{line.name}</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-2">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <Layers className="w-5 h-5 text-blue-300" />
                </div>
                <div className="text-white/70 text-sm font-medium">Produits</div>
              </div>
              <div className="text-white text-2xl font-bold">{stats.totalProducts}</div>
              <div className="text-white/60 text-xs mt-1">Articles total</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-2">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-green-300" />
                </div>
                <div className="text-white/70 text-sm font-medium">Stock</div>
              </div>
              <div className="text-white text-2xl font-bold">{stats.totalCurrentStock}</div>
              <div className="text-white/60 text-xs mt-1">Unités restantes</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-2">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-300" />
                </div>
                <div className="text-white/70 text-sm font-medium">Valeur</div>
              </div>
              <div className="text-white text-2xl font-bold">{stats.totalValue.toLocaleString()}</div>
              <div className="text-white/60 text-xs mt-1">DH total</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-2">
                <div className="bg-yellow-500/20 p-2 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-300" />
                </div>
                <div className="text-white/70 text-sm font-medium">Qualité</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-white text-xl font-bold">{stats.averageQuality.toFixed(1)}</div>
                <div className="flex space-x-1">
                  {renderStars(Math.round(stats.averageQuality))}
                </div>
              </div>
              <div className="text-white/60 text-xs mt-1">Moyenne générale</div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">Niveau de stock global</span>
              </div>
              <div className="text-white text-2xl font-bold">{stats.overallStockPercentage}%</div>
            </div>
            
            <div className="relative h-4 bg-white/20 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${handleProgressColor(stats.overallStockPercentage)} transition-all duration-1000 ease-out rounded-full relative overflow-hidden`}
                style={{ width: `${stats.overallStockPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
              <div 
                className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-white/50 transition-all duration-1000 ease-out"
                style={{ left: `calc(${stats.overallStockPercentage}% - 10px)` }}
              >
                <div className={`w-full h-full rounded-full bg-gradient-to-r ${handleProgressColor(stats.overallStockPercentage)} opacity-80`}></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-3 text-white/80 text-sm">
              <span>0%</span>
              <span className="font-medium">
                {stats.totalCurrentStock} / {stats.totalInitialStock} unités
              </span>
              <span>100%</span>
            </div>
          </div>

          {/* Warning Alert */}
          {stats.lowStockItems > 0 && (
            <div className="mt-4 bg-red-500/20 border border-red-400/30 backdrop-blur-sm rounded-2xl p-4 flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-300 flex-shrink-0" />
              <div>
                <div className="text-red-200 font-bold text-lg">
                  {stats.lowStockItems} produit{stats.lowStockItems > 1 ? 's' : ''} en stock faible
                </div>
                <div className="text-red-300/80 text-sm">
                  Réapprovisionnement recommandé
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expandable Content - Keep existing detailed view */}
      <div
        className={`transition-all duration-700 ease-in-out ${
          expanded ? "max-h-full opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-800">
              Quantité restante de chaque produit
            </h2>
          </div>
          
          <div className="space-y-4">
            {line.productLines.map((productLine, index) => {
              const percentage = parseFloat(handleProgress(productLine.initialStock, productLine.currentStock));
              const isLowStock = productLine.currentStock < productLine.minStock;
              const gradientColors = getGradientColors(percentage);
              const gradientId = `gradient-${index}`; // Unique gradient ID for each item
              
              return (
                <div 
                  key={index} 
                  className={`relative bg-gray-50 rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-lg ${
                    isLowStock ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  {/* Low Stock Warning Banner */}
                  {isLowStock && (
                    <div className="absolute -top-2 left-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Stock Faible</span>
                    </div>
                  )}

                  {/* Product Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="text-lg font-semibold text-gray-500 mb-2">Nom du Produit</div>
                      <div className="font-bold text-lg text-gray-800">{productLine.name}</div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="text-lg font-semibold text-gray-500 mb-2">Category du Stock</div>
                      <div className="font-bold text-lg text-blue-600">
                        {productLine.category}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between">
                      <div className="text-lg font-semibold text-gray-500 mb-2">Quatily Stock</div>
                      <div className="font-bold text-lg text-orange-600 flex">
                        {renderStars(productLine.quality)}
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="text-lg font-semibold text-gray-500 mb-2">Stock Initial</div>
                      <div className="font-bold text-lg text-blue-600">
                        {productLine.initialStock} <span className="text-sm text-gray-500">{productLine.unite}</span>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="text-lg font-semibold text-gray-500 mb-2">Prix Unitaire</div>
                      <div className="font-bold text-lg text-blue-600">
                        {productLine.unitPrice} <span className="text-sm text-gray-500">DH</span>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="text-lg font-semibold text-gray-500 mb-2">Stock Minimum</div>
                      <div className="font-bold text-lg text-orange-600">
                        {productLine.minStock} <span className="text-sm text-gray-500">{productLine.unite}</span>
                      </div>
                    </div>
                  </div>

                  {/* Current Stock Highlight */}
                  <div className={`p-4 rounded-xl mb-6 border-2 ${handleProgressBg(percentage)}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg text-gray-600 mb-2">Stock Actuel</div>
                        <div className={`text-2xl font-bold ${handleTextColor(percentage)}`}>
                          {productLine.currentStock} <span className="text-lg text-gray-500">{productLine.unite}</span>
                        </div>
                      </div>
                      {isLowStock && (
                        <div className="flex items-center space-x-2 text-red-600">
                          <TrendingDown className="w-5 h-5" />
                          <span className="text-sm font-medium">Réapprovisionner</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Modern Progress Section */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-medium text-gray-600">Niveau de stock</span>
                      <span className={`text-lg font-bold ${handleTextColor(percentage)}`}>
                        {percentage}%
                      </span>
                    </div>
                    
                    {/* Enhanced Linear Progress Bar */}
                    <div className="relative">
                      {/* Progress Container with Glass Effect */}
                      <div className="relative h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-inner border border-gray-300/30 backdrop-blur-sm">
                        {/* Animated Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                        
                        {/* Main Progress Bar */}
                        <div 
                          className={`h-full bg-gradient-to-r ${handleProgressColor(percentage)} transition-all duration-1500 ease-out relative overflow-hidden rounded-2xl shadow-lg`}
                          style={{ width: `${percentage}%` }}
                        >
                          {/* Shimmer Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                          
                          {/* Glowing Edge */}
                          <div className="absolute right-0 top-0 h-full w-1 bg-white/60 shadow-lg"></div>
                          
                          {/* Inner Highlight */}
                          <div className="absolute top-1 left-1 right-1 h-2 bg-white/20 rounded-xl"></div>
                        </div>
                        
                        {/* Progress Indicator Dot */}
                        <div 
                          className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-gray-300 transition-all duration-1500 ease-out"
                          style={{ left: `calc(${percentage}% - 12px)` }}
                        >
                          <div className={`w-full h-full rounded-full bg-gradient-to-r ${handleProgressColor(percentage)} opacity-80`}></div>
                        </div>
                      </div>
                      
                      {/* Progress Labels */}
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-sm text-gray-600 font-medium">0%</span>
                        </div>
                        
                        <div className="text-center">
                          <div className={`text-3xl font-bold ${handleTextColor(percentage)} mb-1`}>
                            {percentage}%
                          </div>
                          <div className="text-sm text-gray-500 font-medium">Stock Restant</div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 font-medium">100%</span>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* Stock Level Indicator */}
                      <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${handleProgressColor(percentage)} shadow-sm`}></div>
                            <span className="text-sm font-medium text-gray-700">
                              {percentage >= 75 ? "Stock Optimal" : 
                               percentage >= 50 ? "Stock Modéré" : 
                               percentage >= 25 ? "Stock Faible" : "Stock Critique"}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">
                              {productLine.currentStock} / {productLine.initialStock} {productLine.unite}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Warning Message */}
                  {isLowStock && (
                    <div className="mt-4 bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-lg">Attention - Stock Critique</div>
                        <div className="text-sm opacity-90 font-semibold">
                          Le stock actuel ({productLine.currentStock} {productLine.unite}) est inférieur au minimum requis ({productLine.minStock} {productLine.unite}). Veuillez réapprovisionner rapidement.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingInvoiceItems;