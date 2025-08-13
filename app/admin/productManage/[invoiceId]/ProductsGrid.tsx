import { Calendar, Edit3, Package, Trash2 } from "lucide-react";
import React from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  quality: number;
  unitPrice: number;
  currentStock: number;
  unite: string;
  minStock: number;
  initialStock: number;
}

interface ProductLine {
  currentStock: number;
  unitPrice: number;
  category: string;
}

interface CompoInfo {
  getStockStatus: (product: Product) => "low" | "hight" | "normal";
  filteredProducts: Product[];
  getProductImage: (category: string) => React.ReactNode;
  handleEditProductLine: (product: Product) => void;
  handleDeleteProductLine: (id: string, name: string) => void;
  renderStars: (quality: number) => React.ReactNode;
  productLines: ProductLine[];
}

const ProductsGrid: React.FC<CompoInfo> = ({
  getStockStatus,
  filteredProducts,
  getProductImage,
  handleEditProductLine,
  handleDeleteProductLine,
  renderStars,
  productLines,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => {
        const stockStatus = getStockStatus(product);
        const stockStatusColors = {
          low: "text-red-600 bg-red-50 border-red-200",
          normal: "text-green-600 bg-green-50 border-green-200",
          high: "text-blue-600 bg-blue-50 border-blue-200",
        };

        return (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 flex items-center">
                  <div className="p-2 bg-gradient-to-b from-green-400 to-green-200 rounded-xl mr-2 text-2xl flex items-center justify-center">
                    {getProductImage(product.category)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Category: {product.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {/* <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye size={16} />
                      </button> */}
                  <button
                    onClick={() => handleEditProductLine(product)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteProductLine(product.id, product.name)
                    }
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Qualité:</span>
                  <div className="flex items-center space-x-1">
                    {renderStars(product.quality)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Prix unitaire:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {product.unitPrice}dh
                  </span>
                </div>
              </div>

              {/* Stock Info */}
              <div
                className={`p-4 rounded-lg border-2 ${stockStatusColors[stockStatus]} mb-4`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Stock courant</span>
                  <span className="text-2xl font-bold">
                    {product.currentStock} {product.unite}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Min: {product.minStock}</span>
                  <span>Initial: {product.initialStock}</span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span className="text-sm font-bold ">
                    Valeur du stock : {(product.currentStock * product.unitPrice).toFixed(2)} DH
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 flex flex-col items-center justify-center col-span-full">
          <Package size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun produit trouvé
          </h3>
          <p className="text-gray-500">
            {productLines.length === 0
              ? "Cette facture est vide. Ajoutez votre premier produit pour commencer !"
              : "Essayez d'ajuster vos critères de recherche ou de filtre"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;
