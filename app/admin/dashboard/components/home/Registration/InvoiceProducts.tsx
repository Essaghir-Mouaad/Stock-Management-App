import { Product } from "@/types/type";
import { Calendar, FileText, Package, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

interface CompoInfo {
    selectedInvoice: Product | null;
    getProductImage: (category: string) => string;
    selectedMonth: number;
    selectedYear: number;
}

const InvoiceProducts: React.FC<CompoInfo> = ({
                                                  selectedInvoice,
                                                  getProductImage,
                                                  selectedYear,
                                                  selectedMonth
                                              }) => {
    const [loading, setLoading] = useState(false);
    const [analyticsData, setAnalyticsData] = useState({
        dailyMovements: [],
        monthlySummary: null,
        categoryStats: [],
        productPerformance: [],
        currentOverview: null,
    });

    // Function to get the last operation for a specific product
    const getLastOperations = (productId: string) => {
        let lastIn: any = null;
        let lastOut: any = null;

        // Iterate through all daily movements to find the last IN and OUT operations
        analyticsData.dailyMovements.forEach((day: any) => {
            day.movements?.forEach((movement: any) => {
                if (movement.productLineId === productId) {
                    if (movement.movementType === "IN") {
                        if (!lastIn || new Date(movement.createdAt) > new Date(lastIn.createdAt)) {
                            lastIn = movement;
                        }
                    } else if (movement.movementType === "OUT") {
                        if (!lastOut || new Date(movement.createdAt) > new Date(lastOut.createdAt)) {
                            lastOut = movement;
                        }
                    }
                }
            });
        });

        return { lastIn, lastOut };
    };

    // Function to format the reason text
    const formatReason = (reason: string) => {
        return reason?.replace(/-/g, ' ').replace(/([A-Z])/g, ' $1').trim().toLowerCase() || 'Non spécifié';
    };

    const fetchAnalyticsData = useCallback(async () => {
        // Don't fetch if no invoice is selected
        if (!selectedInvoice) return;

        try {
            setLoading(true);
            console.log("Fetching analytics data for InvoiceProducts...");

            const startDate = new Date(selectedYear, selectedMonth - 1, 1);
            const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);

            const startDateStr = startDate.toISOString();
            const endDateStr = endDate.toISOString();

            console.log("Date range:", { selectedYear, selectedMonth, startDateStr, endDateStr });

            // Create requests with proper error handling
            const requests = [
                fetch(`/api/analytics/daily-movements?startDate=${startDateStr}&endDate=${endDateStr}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                }),
                fetch(`/api/analytics/monthly-summary?year=${selectedYear}&month=${selectedMonth}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                }),
                fetch(`/api/analytics/category-stats?startDate=${startDateStr}&endDate=${endDateStr}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                }),
                fetch(`/api/analytics/product-performance?startDate=${startDateStr}&endDate=${endDateStr}&limit=10`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                }),
                fetch(`/api/analytics/current-overview?startDate=${startDateStr}&endDate=${endDateStr}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                })
            ];

            // Execute requests with timeout
            const responses = await Promise.allSettled(
                requests.map(request =>
                    Promise.race([
                        request,
                        new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('Request timeout')), 10000)
                        )
                    ])
                )
            );

            console.log("Response results:", responses.map((result, index) => ({
                index,
                status: result.status,
                ...(result.status === 'fulfilled' && { responseOk: (result.value as Response).ok })
            })));

            // Process responses safely
            const [
                dailyMovementsResult,
                monthlySummaryResult,
                categoryStatsResult,
                productPerformanceResult,
                currentOverviewResult,
            ] = responses;

            // Helper function to safely parse responses
            const parseResponse = async (result: PromiseSettledResult<any>, defaultValue: any) => {
                if (result.status === 'rejected') {
                    console.warn('Request failed:', result.reason);
                    return defaultValue;
                }

                try {
                    const response = result.value as Response;
                    if (!response.ok) {
                        console.warn(`HTTP ${response.status} for ${response.url}`);
                        return defaultValue;
                    }
                    return await response.json();
                } catch (error) {
                    console.warn('Failed to parse response:', error);
                    return defaultValue;
                }
            };

            // Parse all responses safely
            const [
                dailyMovements,
                monthlySummary,
                categoryStats,
                productPerformance,
                currentOverview,
            ] = await Promise.all([
                parseResponse(dailyMovementsResult, []),
                parseResponse(monthlySummaryResult, null),
                parseResponse(categoryStatsResult, []),
                parseResponse(productPerformanceResult, []),
                parseResponse(currentOverviewResult, null),
            ]);

            console.log("Parsed data:", {
                dailyMovements: Array.isArray(dailyMovements) ? dailyMovements.length : 'invalid',
                monthlySummary: monthlySummary ? 'loaded' : 'null',
                categoryStats: Array.isArray(categoryStats) ? categoryStats.length : 'invalid',
                productPerformance: Array.isArray(productPerformance) ? productPerformance.length : 'invalid',
                currentOverview: currentOverview ? 'loaded' : 'null'
            });

            setAnalyticsData({
                dailyMovements: Array.isArray(dailyMovements) ? dailyMovements : [],
                monthlySummary: monthlySummary || null,
                categoryStats: Array.isArray(categoryStats) ? categoryStats : [],
                productPerformance: Array.isArray(productPerformance) ? productPerformance : [],
                currentOverview: currentOverview || null,
            });

        } catch (error) {
            console.error("Network error fetching analytics data:", error);
            console.error("This indicates a connectivity issue with your API server");

            // Set safe default values
            setAnalyticsData({
                dailyMovements: [],
                monthlySummary: null,
                categoryStats: [],
                productPerformance: [],
                currentOverview: null,
            });

            // Only show toast error if it's a real error, not just missing data
            if (error instanceof Error && error.message !== 'Request timeout') {
                toast.error("Unable to load analytics data - API server may be offline");
            }
        } finally {
            setLoading(false);
        }
    }, [selectedInvoice, selectedYear, selectedMonth]);

    useEffect(() => {
        // Add delay to ensure component stability
        const timeoutId = setTimeout(() => {
            fetchAnalyticsData();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [fetchAnalyticsData]);

    // Early return if no invoice selected
    if (!selectedInvoice) {
        return (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                <div className="text-center text-slate-500">
                    <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <p>Sélectionnez une facture pour voir les détails des produits</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            {/* Invoice Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 p-8 text-white relative overflow-hidden">
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
                    <div className="grid grid-cols-3 gap-6">
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
                                        {selectedInvoice.productLines?.length || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                            <div className="flex items-center space-x-3">
                                <TrendingUp className="w-6 h-6 text-blue-200" />
                                <div>
                                    <p className="text-blue-100 text-sm">Statut</p>
                                    <p className="font-bold text-lg">
                                        {loading ? "Chargement..." : "Actif"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                        <h3 className="text-2xl font-bold text-slate-800">
                            Inventaire des produits
                        </h3>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-xl border border-blue-200">
            <span className="text-blue-700 font-semibold text-sm">
              {selectedInvoice.productLines?.length || 0} Articles Actifs
            </span>
                    </div>
                </div>

                {loading && (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="text-slate-500 mt-2">Chargement des données analytiques...</p>
                    </div>
                )}

                <div className="space-y-6">
                    {selectedInvoice.productLines?.map((product, index) => {
                        const { lastIn, lastOut } = getLastOperations(product.id);

                        return (
                            <div
                                key={product.id}
                                className="group bg-gradient-to-r from-white to-slate-50 rounded-2xl p-6 border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="grid grid-cols-1 gap-6 items-center">
                                    {/* Enhanced Product Info */}
                                    <div className="flex items-center space-x-4 w-full">
                                        <div className="relative">
                                            <div className="w-18 h-18 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center text-3xl border-2 border-blue-200">
                                                {getProductImage(product.category)}
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-700 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div className="flex items-center w-[90%] justify-between">
                                            <div>
                                                <h4 className="font-bold text-xl text-slate-900 mb-1">
                                                    {product.name}
                                                </h4>
                                                <p className="text-slate-600 text-sm mb-2">
                                                    Catégorie: {product.category}
                                                </p>
                                            </div>

                                            {/* Stock Information */}
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-slate-500">Actuel:</span>
                                                    <span className="font-semibold text-green-600">
                            {product.currentStock} {product.unite}
                          </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-slate-500">Initial:</span>
                                                    <span className="font-semibold text-blue-600">
                            {product.initialStock} {product.unite}
                          </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Last Operations Section */}
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-slate-600 mb-3 font-medium">
                                            Dernières opérations
                                            {loading && (
                                                <span className="ml-2 text-xs text-blue-500">(Chargement...)</span>
                                            )}
                                        </p>

                                        <div className="space-y-3">
                                            {/* Last IN Operation */}
                                            {lastIn ? (
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <ArrowUp className="w-4 h-4 text-green-600" />
                                                        <span className="text-sm font-semibold text-green-700">
                              Dernière entrée
                            </span>
                                                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                              +{lastIn.quantity} {product.unite}
                            </span>
                                                    </div>
                                                    <div className="text-xs text-slate-600 space-y-1">
                                                        <p><span className="font-medium">Raison:</span> {formatReason(lastIn.reason)}</p>
                                                        <p><span className="font-medium">Par:</span> {lastIn.user?.name || 'Utilisateur inconnu'}</p>
                                                        <p><span className="font-medium">Date:</span> {new Date(lastIn.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <span className="text-sm text-gray-500">
                            {loading ? "Recherche des entrées..." : "Aucune entrée trouvée"}
                          </span>
                                                </div>
                                            )}

                                            {/* Last OUT Operation */}
                                            {lastOut ? (
                                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <ArrowDown className="w-4 h-4 text-red-600" />
                                                        <span className="text-sm font-semibold text-red-700">
                              Dernière sortie
                            </span>
                                                        <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                              -{lastOut.quantity} {product.unite}
                            </span>
                                                    </div>
                                                    <div className="text-xs text-slate-600 space-y-1">
                                                        <p><span className="font-medium">Raison:</span> {formatReason(lastOut.reason)}</p>
                                                        <p><span className="font-medium">Par:</span> {lastOut.user?.name || 'Utilisateur inconnu'}</p>
                                                        <p><span className="font-medium">Date:</span> {new Date(lastOut.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <span className="text-sm text-gray-500">
                            {loading ? "Recherche des sorties..." : "Aucune sortie trouvée"}
                          </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty state if no products */}
                {!selectedInvoice.productLines || selectedInvoice.productLines.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-600 mb-2">Aucun produit trouvé</h3>
                        <p className="text-slate-500">Cette facture ne contient aucun produit.</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default InvoiceProducts;