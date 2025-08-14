import { Search } from 'lucide-react';
import React from 'react'

interface CompoInfo {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filterCategory: string;
  setFilterCategory: React.Dispatch<React.SetStateAction<string>>;
  categories: string[];
  filterStatus: string;
  setFilterStatus: React.Dispatch<React.SetStateAction<string>>;
}

const Filters:React.FC<CompoInfo> = ({searchTerm,setSearchTerm, filterCategory, setFilterCategory, categories, filterStatus, setFilterStatus}) => {
  return (
     <div className="bg-gradient-to-br from-blue-200 via-green-50 to-purple-200 rounded-xl p-6 shadow-sm border border-gray-400 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Rechercher des produits par nom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "Toutes les catégories" : cat}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="low">Stock faible</option>
                <option value="normal">Stock normal</option>
                <option value="high">Stock élevé</option>
              </select>
            </div>
          </div>
        </div>
  )
}

export default Filters