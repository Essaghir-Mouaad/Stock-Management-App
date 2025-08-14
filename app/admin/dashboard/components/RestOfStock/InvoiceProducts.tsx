import { Product } from "@/type";
import {
  Calendar,
  CloudDownloadIcon,
  FileText,
  Package,
  TrendingUp,
} from "lucide-react";
import React, { useRef } from "react";
import { useReactToPrint } from 'react-to-print';

interface CompoInfo {
  selectedInvoice: Product | null;
  getProductImage: (category: string) => string;
  getQualityColor: (quality: number) => React.ReactNode;
  renderStars: (quality: number) => React.ReactNode;
}

const InvoiceProducts: React.FC<CompoInfo> = ({
  selectedInvoice,
  getProductImage,
  getQualityColor,
  renderStars,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  // Fixed totalValue function
  const totalValue = () => {
    if (!selectedInvoice?.productLines) return 0;
    
    return selectedInvoice.productLines.reduce(
      (sum: number, product: any) =>
        sum + product.currentStock * product.unitPrice,
      0
    );
  };

  // Calculate total current stock across all products
  const totalCurrentStock = () => {
    if (!selectedInvoice?.productLines) return 0;
    
    return selectedInvoice.productLines.reduce(
      (sum: number, product: any) => sum + product.currentStock,
      0
    );
  };

  // Calculate total initial stock across all products
  const totalInitialStock = () => {
    if (!selectedInvoice?.productLines) return 0;
    
    return selectedInvoice.productLines.reduce(
      (sum: number, product: any) => sum + product.initialStock,
      0
    );
  };

  // Handle print functionality - FIXED: Use contentRef instead of content
  const handlePrint = useReactToPrint({
    contentRef: printRef, // Changed from content: () => printRef.current
    documentTitle: `Invoice-${selectedInvoice?.name || 'Unknown'}-${new Date().toISOString().split('T')[0]}`,
  });

  if (!selectedInvoice) {
    return <div>No invoice selected</div>;
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      {/* Invoice Header */}
      <div className="bg-gradient-to-r from-purple-700 via-blue-800 to-cyan-800 p-8 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{selectedInvoice.name}</h2>
                  <p className="text-blue-100 text-lg">Gestion des factures</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                <p className="text-blue-100 text-sm">ID de la facture</p>
                <p className="font-mono font-bold">
                  {selectedInvoice.id.slice(0, 12)}...
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-blue-200" />
                <div>
                  <p className="text-blue-100 text-sm">Date de création</p>
                  <p className="font-bold text-lg">
                    {new Date(selectedInvoice.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
              <div className="flex items-center space-x-3">
                <Package className="w-6 h-6 text-blue-200" />
                <div>
                  <p className="text-blue-100 text-sm">Produits totaux</p>
                  <p className="font-bold text-lg">
                    {selectedInvoice.productLines.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-blue-200" />
                <div>
                  <p className="text-blue-100 text-sm">Statut</p>
                  <p className="font-bold text-lg">Actif</p>
                </div>
              </div>
            </div>
            {/* Fixed Download Button with react-to-print */}
            <div
              className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-300"
              onClick={handlePrint}
            >
              <div className="flex items-center justify-center space-x-3">
                <CloudDownloadIcon className="w-8 h-8 text-white text-lg" />
                <p className="text-lg font-bold">Télécharger</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section - This will be printed */}
      <div ref={printRef} className="print:bg-white print:shadow-none">
        {/* Professional Print Header */}
        <div className="print:block hidden bg-white p-8 border-b-2 border-gray-200">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">FACTURE</h1>
              <p className="text-lg text-gray-600">Inventaire des Produits</p>
            </div>
            <div className="text-right">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-gray-600 text-sm font-medium">
                  Numéro de Facture
                </p>
                <p className="font-mono font-bold text-lg text-gray-900">
                  INV-{selectedInvoice.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-gray-600 text-sm mt-2">Date d'émission</p>
                <p className="font-semibold text-gray-900">
                  {new Date().toLocaleDateString(
                    "fr-FR"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 print:p-6">
          <div className="flex items-center justify-between mb-8 print:mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full print:bg-gray-800"></div>
              <h3 className="text-2xl font-bold text-slate-800 print:text-gray-900 print:text-xl">
                Inventaire des produits
              </h3>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-xl border border-blue-200 print:bg-gray-100 print:border-gray-300">
              <span className="text-blue-700 font-semibold text-sm print:text-gray-800">
                {selectedInvoice.productLines.length} Articles Actifs
              </span>
            </div>
          </div>

          {/* Professional Table for Print */}
          <div className="print:block hidden">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-900">
                    #
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-900">
                    Produit
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-900">
                    Catégorie
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-right font-bold text-gray-900">
                    Qty Initial
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-right font-bold text-gray-900">
                    Qty Actuel
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-right font-bold text-gray-900">
                    Prix Unit. (DH)
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-right font-bold text-gray-900">
                    Montant (DH)
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.productLines.map((product, index) => (
                  <tr
                    key={product.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="font-bold text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">
                      {product.category}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                      {product.initialStock} {product.unite}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                      {product.currentStock} {product.unite}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                      {product.unitPrice.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-bold text-gray-900">
                      {(
                        product.currentStock * product.unitPrice
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card Layout for Screen */}
          <div className="space-y-6 print:hidden">
            {selectedInvoice.productLines.map((product, index) => (
              <div
                key={product.id}
                className="group bg-gradient-to-r from-white to-slate-50 rounded-2xl p-6 border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  {/* Enhanced Product Info */}
                  <div className="md:col-span-2 flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center text-3xl border-2 border-blue-200">
                        {getProductImage(product.category)}
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-slate-900 mb-1">
                        {product.name}
                      </h4>
                      <p className="text-slate-600 text-sm mb-2">
                        Catégorie: {product.category}
                      </p>
                    </div>
                  </div>

                  {/* Quality current */}
                  <div className="text-center">
                    <p className="text-lg text-slate-600 mb-2 font-bold underline">
                      Quantité initial
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-500">Quantité:</span>
                      <span className="font-semibold text-blue-600">
                        {product.initialStock} {product.unite}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg text-slate-600 mb-2 font-bold underline">
                      Quantité courant
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-500">Quantité:</span>
                      <span className="font-semibold text-blue-600">
                        {product.currentStock} {product.unite}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg text-slate-600 mb-2 font-bold underline">
                      Prix unitaire
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-500">Prix:</span>
                      <span className="font-semibold text-blue-600">
                        {product.unitPrice} dh
                      </span>
                    </div>
                  </div>
                  <div className="text-start">
                    <p className="text-lg text-slate-600 mb-2 font-bold underline">
                      Montant
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-500">Montant:</span>
                      <span className="font-semibold text-blue-600">
                        {product.currentStock * product.unitPrice} dh
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Value Section */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-800">
                Total de la facture
              </h3>
              <div className="text-right">
                <p className="text-lg text-slate-600 mb-2 font-bold">
                  Montant Total
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-lg text-slate-500">Total:</span>
                  <span className="font-bold text-2xl text-blue-600">
                    {totalValue().toLocaleString()} dh
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceProducts;