import { Product } from "@/type";
import { div, tr } from "framer-motion/client";
import {
  Bell,
  AlertTriangle,
  Package,
  Calendar,
  Star,
  FileText,
  TrendingUp,
  BarChart3,
  Eye,
  ReceiptPoundSterling,
  TrainTrackIcon,
  SwatchBook,
  icons,
  FileTextIcon,
  DollarSign,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductPerformanceSection from "./Performance/ProductPerformanceProps";
import ProductsToUpdate from "./ProductToUpdate/ProductsToUpdate";
import Invoices from "./Registration/Invoices";
import InvoiceProducts from "./Registration/InvoiceProducts";
import DetailInfo from "./Registration/DetailInfo";
import StockPricing from "./Pricing/StockPricing";
import { geteuid } from "process";

const GlobalDashboard = () => {
  const [notification, setNotification] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [invoices, setInvoices] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState("invoices");
  const [analysisData, setAnalyticsData] = useState({
    currentOverview: null,
    productPerformance: [],
    getCategoryStats: [],
  });

const fetchAnalysisData = async () => {
  const startDate = new Date(selectedYear, selectedMonth - 1, 1);
  const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);

  const startDateStr = startDate.toISOString();
  const endDateStr = endDate.toISOString();

  console.log("Date range being sent:", { 
    selectedYear, 
    selectedMonth, 
    startDateStr, 
    endDateStr 
  });

  try {
    const [currentOverview, productPerformance, getCategoryStats] =
      await Promise.all([
        fetch(`/api/analytics/current-overview?startDate=${encodeURIComponent(startDateStr)}&endDate=${encodeURIComponent(endDateStr)}`).then((res) => res.json()),
        fetch(
          `/api/analytics/product-performance?startDate=${startDateStr}&endDate=${endDateStr}&limit=10`
        ).then((res) => res.json()),
        fetch(
          `/api/analytics/category-stats?startDate=${startDateStr}&endDate=${endDateStr}`
        ).then((res) => res.json()),
      ]);

    console.log("Raw API responses:", { currentOverview, productPerformance, getCategoryStats });

    const overviewData = currentOverview.error ? null : currentOverview;
    const productPerformances = productPerformance.error ? [] : productPerformance;
    const categoryStats = getCategoryStats.error ? [] : getCategoryStats;

    console.log("Processed data:", { overviewData, productPerformances, categoryStats });

    setAnalyticsData({
      currentOverview: overviewData,
      productPerformance: productPerformances,
      getCategoryStats: categoryStats,
    });

    // Fix: Use the fetched data directly, not the state
    // Also fix the property name - it should be lowStockProducts, not lowStockItems
    if (overviewData && overviewData.lowStockProducts !== undefined) {
      setNotification(overviewData.lowStockProducts);
    } else {
      setNotification(0);
    }

  } catch (error) {
    console.error("Error fetching analytics data:", error);
    toast.error("Failed to load analytics data");
    // Set default values in case of error
    setAnalyticsData({
      currentOverview: null,
      productPerformance: [],
      getCategoryStats: [],
    });
    setNotification(0);
  }
};

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch(`/api/products`, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const invoices = await res.json();
        setInvoices(invoices || []);
      } else {
        console.error("Failed to fetch invoice data");
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleBellClick = () => {
    setIsModalOpen(true);
    // console.log(invoices);
    setNotification(0);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 4) return "text-green-600";
    if (quality >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const calculateInvoiceStats = (line: any) => {
    const totalProducts = line.length;
    const totalInitialStock = line.reduce(
      (sum, product) => sum + product.initialStock,
      0
    );

    const totalCurrentStock = line.reduce(
      (sum, product) => sum + product.currentStock,
      0
    );
    const totalValue = line.reduce(
      (sum, product) => sum + product.currentStock * product.unitPrice,
      0
    );

    const totalValueInitial = line.reduce(
      (sum, product) => sum + product.initialStock * product.unitPrice,
      0
    );

    const lowStockItems = line.filter(
      (product) => product.currentStock < product.minStock
    ).length;
    const averageQuality =
      line.reduce((sum, product) => sum + product.quality, 0) / totalProducts;
    const overallStockPercentage = (
      (totalCurrentStock * 100) /
      totalInitialStock
    ).toFixed(1);

    return {
      totalProducts,
      totalCurrentStock,
      totalInitialStock,
      totalValue,
      lowStockItems,
      averageQuality,
      totalValueInitial,
      overallStockPercentage: parseFloat(overallStockPercentage),
    };
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


  const notificationProducts = (invoices: Product[]) => {
    const invoiceItems = [];

    if (invoices && invoices.length > 0) {
      // Loop through each invoice
      for (const invoice of invoices) {
        // Loop through each product line in the invoice
        if (invoice.productLines && invoice.productLines.length > 0) {
          for (const productLine of invoice.productLines) {
            // Check if current stock is below minimum stock
            if (productLine.currentStock < productLine.minStock) {
              invoiceItems.push({
                name: productLine.name,
                currentQte: productLine.currentStock,
                minStock: productLine.minStock,
                unite: productLine.unite, // Note: your data structure shows 'unit', not 'unite'
                invoiceId: invoice.id, // Optional: include which invoice this came from
                invoiceName: invoice.name,
              });
            }
          }
        }
      }
    }

    return invoiceItems;
  };

  const productToUpdate = notificationProducts(invoices);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-2">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex flex-row items-center justify-between">
          {/* Left Side - Title and Description */}
          <div className="relative">
            {/* Background Blur Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl blur-xl"></div>

            <div className="relative">
              <div className="flex items-center space-x-4 mb-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                    Tableau de bord global
                  </h1>
                  <div className="h-0.5 w-40 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Notification Bell */}
          <div className="relative">
            {/* Notification Bell with Animation */}
            <div  id="bell"
              className={`relative cursor-pointer group p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 hover:shadow-2xl transition-all duration-300 ${
                notification > 0 ? "animate-bounce" : ""
              }`}
              onClick={handleBellClick}
            >
              {/* Glow Effect for Urgent Notifications */}
              {notification > 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 rounded-2xl blur-md opacity-40 animate-pulse"></div>
              )}

              <Bell
                className={`w-6 h-6 relative z-10 transition-all duration-300 ${
                  notification > 0
                    ? "text-red-500 animate-pulse"
                    : "text-slate-600 group-hover:text-blue-500"
                }`}
              />

              {/* Notification Badge */}
              {notification > 0 && (
                <div className="absolute -top-2 -right-2 z-20">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-lg animate-pulse">
                    {notification}
                  </div>
                  {/* Pulse Ring Animation */}
                  <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-30"></div>
                </div>
              )}

              {/* Hover Text */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {notification > 0
                  ? `${notification} alertes urgentes !`
                  : "Aucune notification"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* nav section */}
      <div className="flex space-x-2 rounded-2xl mb-10 shadow-sm">
        {[
          { id: "invoices", label: "Registration", icon: ReceiptPoundSterling, guideId:'registration' },
          { id: "lastUpdates", label: "Activité récente", icon: TrainTrackIcon, guideId:'performance' },
          { id: "pricing", label: "Tarification ", icon: DollarSign, guideId:'pricing' },
        ].map(({ id, label, icon: Icon, guideId }) => (
          <button
            key={id}
            id={guideId}
            className={`flex items-center space-x-2 px-4 py-4 rounded-xl transition-all duration-300 ${
              viewMode === id
                ? "bg-gradient-to-b from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setViewMode(id)}
          >
            <Icon className="w-6 h-6" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Invoice Management Section */}
      {viewMode === "invoices" && (
        <div className="max-w-full mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Invoices
                invoices={invoices}
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
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
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
                          Choisissez une facture dans le panneau de registre
                          pour afficher les informations détaillées des produits
                          et gérer votre inventaire.
                        </p>

                        {/* Status indicator */}
                        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <p className="text-blue-700 text-sm font-medium">
                            💡 Astuce : Cliquez sur une facture pour explorer
                            son contenu.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <DetailInfo
            selectedInvoice={selectedInvoice}
            calculateInvoiceStats={calculateInvoiceStats}
          />
        </div>
      )}

      {/* Last Updates Section */}
      {viewMode === "lastUpdates" && (
        <ProductPerformanceSection analysisData={analysisData} />
      )}

      {/* Pricing Section */}
      {viewMode === "pricing" && <StockPricing invoice={invoices} calculateInvoiceStats={calculateInvoiceStats}/>}

      {/* Enhanced Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white relative">
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                ✕
              </button>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl">Alertes de stock</h3>
                  <p className="text-white/90 text-sm">
                    Articles nécessitant une attention immédiate
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <ProductsToUpdate
              toUpdate={productToUpdate}
              closeModal={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalDashboard;
