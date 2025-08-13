import { Activity, CheckCircle, Package, TrendingUp } from 'lucide-react'
import React from 'react'

interface ProductLine {
  currentStock: number;
  unitPrice: number;
  category: string;
}

interface CompoInfo {
  productLines: ProductLine[];
  getStockStatus: (value: ProductLine) => string;
}

const StatCards:React.FC<CompoInfo> = ({productLines, getStockStatus}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-blue-100/80 rounded-2xl backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl hover: border border-white/90 ">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-blue-600 text-sm font-medium">Total</span>
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-1">
              {productLines.length}
            </div>
            <div className="text-slate-500 text-sm">Total Movements</div>
          </div>

          <div className="bg-gradient-to-br from-white to-red-100/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-red-600 text-sm font-medium">Active</span>
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-1">
              {productLines.filter((p) => getStockStatus(p) === "low").length}
            </div>
            <div className="text-slate-500 text-sm">Products Tracked</div>
          </div>

          <div className="bg-gradient-to-br from-white to-green-100/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-b from-green-500 to-green-600 rounded-xl shadow-lg">
                <CheckCircle className="text-white" size={32} />
              </div>
              <span className="text-green-600 text-sm font-medium">Active</span>
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-1">
              {productLines
                .reduce((sum, p) => sum + p.currentStock * p.unitPrice, 0)
                .toFixed(2)}{" "}
              DH
            </div>
            <div className="text-slate-500 text-sm">Products Amount</div>
          </div>

          <div className="bg-gradient-to-br from-white to-purple-100/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <TrendingUp className="text-white" size={32} />
              </div>
              <span className="text-purple-600 text-sm font-medium">
                Active
              </span>
            </div>
            <div className="text-3xl font-black text-slate-800">
              {new Set(productLines.map((p) => p.category)).size}
            </div>
            <div className="text-sm text-slate-600">Catégories</div>
          </div>
        </div>
  )
}

export default StatCards