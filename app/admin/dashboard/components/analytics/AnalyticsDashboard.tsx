// Fix the import section - remove duplicate and unused imports
import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Package,
  BarChart3,
  Activity,
  Filter,
  ChevronDown,
  Eye,
  Target,
  TrendingUpIcon,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import PDFDownloadButton from "./PrintButton";
// Fixed: Remove duplicate import, keep only one
import PDFDownloadDailyReportButton from "./DailyButton";
// import BackupManager from "@/app/components/BackupManager";

const AnalyticsDashboard = () => {
  const [currentDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [checked, setChecked] = useState(false);
  const [ischecked, setIsChecked] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [categoryAannuler, setCategoryAannuler] = useState([]);
  const [categoryCheked, setCategoryCheked] = useState(false);
  const [numberStudents, setNumberStudents] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [viewMode, setViewMode] = useState("overview"); // 'overview', 'daily', 'monthly', 'categories'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState({
    dailyMovements: [],
    monthlySummary: null,
    categoryStats: [],
    productPerformance: [],
    currentOverview: null,
  });

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInSelectedMonth = getDaysInMonth(selectedYear, selectedMonth);

  // Helper function to safely fetch data
  const safeFetch = async (url: any, fallback = null) => {
    try {
      console.log(`Fetching: ${url}`);
      const response = await fetch(url, { credentials: "include" });

      if (!response.ok) {
        console.warn(
          `API endpoint ${url} returned ${response.status}: ${response.statusText}`
        );
        return fallback;
      }

      const data = await response.json();
      return data.error ? fallback : data;
    } catch (error) {
      console.error(`Failed to fetch ${url}:`, error);
      return fallback;
    }
  };

  // Fetch analytics data with improved error handling
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDate = new Date(selectedYear, selectedMonth - 1, 1);
      const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);

      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();

      console.log(
        `Fetching analytics data for ${startDateStr} to ${endDateStr}`
      );

      // Fetch all analytics data in parallel with fallbacks
      const [
        dailyMovements,
        monthlySummary,
        categoryStats,
        productPerformance,
        currentOverview,
      ] = await Promise.all([
        safeFetch(
          `/api/analytics/daily-movements?startDate=${startDateStr}&endDate=${endDateStr}`,
          null
        ),
        safeFetch(
          `/api/analytics/monthly-summary?year=${selectedYear}&month=${selectedMonth}`,
          null
        ),
        safeFetch(
          `/api/analytics/category-stats?startDate=${startDateStr}&endDate=${endDateStr}`,
          null
        ),
        safeFetch(
          `/api/analytics/product-performance?startDate=${startDateStr}&endDate=${endDateStr}&limit=10`,
          null
        ),
        safeFetch(
          `/api/analytics/current-overview?startDate=${startDateStr}&endDate=${endDateStr}`,
          null
        ),
      ]);

      console.log("Fetched data:", {
        dailyMovements: dailyMovements?.length || 0,
        monthlySummary: !!monthlySummary,
        categoryStats: categoryStats?.length || 0,
        productPerformance: productPerformance?.length || 0,
        currentOverview: !!currentOverview,
      });

      setAnalyticsData({
        dailyMovements: Array.isArray(dailyMovements) ? dailyMovements : [],
        monthlySummary,
        categoryStats: Array.isArray(categoryStats) ? categoryStats : [],
        productPerformance: Array.isArray(productPerformance)
          ? productPerformance
          : [],
        currentOverview,
      });

      // Show warning if no data was loaded
      if (
        !dailyMovements?.length &&
        !categoryStats?.length &&
        !productPerformance?.length
      ) {
        toast.error(
          "No analytics data available. Please check if your API endpoints are running."
        );
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setError(error.message);
      toast.error("Failed to load analytics data. Using demo data instead.");

      // Set demo data as fallback
      setAnalyticsData({
        dailyMovements: generateDemoData(),
        monthlySummary: null,
        categoryStats: generateDemoCategoryData(),
        productPerformance: generateDemoProductData(),
        currentOverview: {
          totalProducts: 156,
          totalStockValue: 45678.9,
          lowStockProducts: 12,
          highStockProducts: 89,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate demo data for development/testing
  const generateDemoData = () => {
    const data = [];
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);

    for (let i = 1; i <= daysInMonth; i++) {
      data.push({
        date: `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}-${i
          .toString()
          .padStart(2, "0")}`,
        stockIn: Math.floor(Math.random() * 50) + 10,
        stockOut: Math.floor(Math.random() * 40) + 5,
      });
    }
    return data;
  };

  //thise are just for a default vlaues for the Analyssi data of not exist
  const generateDemoCategoryData = () => [
    {
      name: "Électronique",
      movementCount: 145,
      percentage: 35.2,
      color: "#3B82F6",
    },
    {
      name: "Vêtements",
      movementCount: 89,
      percentage: 21.6,
      color: "#EF4444",
    },
    {
      name: "Alimentation",
      movementCount: 76,
      percentage: 18.4,
      color: "#10B981",
    },
    { name: "Maison", movementCount: 52, percentage: 12.6, color: "#F59E0B" },
    { name: "Sports", movementCount: 50, percentage: 12.2, color: "#8B5CF6" },
  ];

  const generateDemoProductData = () => [
    { name: "iPhone 13", movementCount: 25, totalIn: 45.5, totalOut: 32.1 },
    {
      name: "Samsung Galaxy",
      movementCount: 22,
      totalIn: 38.2,
      totalOut: 28.7,
    },
    { name: "MacBook Pro", movementCount: 18, totalIn: 28.9, totalOut: 15.4 },
    { name: "AirPods", movementCount: 15, totalIn: 55.3, totalOut: 41.8 },
    { name: "iPad", movementCount: 12, totalIn: 22.1, totalOut: 18.9 },
  ];

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedYear, selectedMonth]);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

const categories = [
    "Tous (الكل)",
    "Fruits (فواكه)",
    "Légumes (خضروات)",
    "Viande (لحم)",
    "Boissons (مشروبات)",
    "Céréales (الحبوب)",
    "Produits laitiers (منتجات الألبان)",
    "Légumineuses (البقوليات)",
    "Produits de nettoyage (مواد التنظيف)",
    "Épices et condiments (التوابل والمنكهات)",
    "Produits en conserve (المعلبات)",
    "Snacks et biscuits (وجبات خفيفة وبسكويت)",
    "Pain et boulangerie (الخبز والمخبوزات)",
    "Gaz (قنينات الغاز)",
    "Huiles et sauces (الزيوت والصلصات)",
    "Fournitures et emballages (مستلزمات وتغليف)",
    "Autre (أخرى)",
];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <p className="text-gray-600 text-sm mb-2">{`Date: ${label}`}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              style={{ color: entry.color }}
              className="font-semibold"
            >
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    color = "blue",
  }) => (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-${color}-50 to-${color}-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-${color}-200/50`}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full -mr-10 -mt-10"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <Icon className={`w-8 h-8 text-${color}-600`} />
          {trend && (
            <div
              className={`flex items-center text-sm ${
                trend > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend > 0 ? (
                <ArrowUpRight className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-1" />
              )}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className={`text-3xl font-bold text-${color}-900 mb-1`}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        <div className={`text-sm text-${color}-600`}>{title}</div>
        {subtitle && (
          <div className={`text-xs text-${color}-500 mt-1`}>{subtitle}</div>
        )}
      </div>
    </div>
  );

  const ChartContainer = ({ title, children, className = "" }) => (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden ${className}`}
    >
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

// Add this function to handle category selection
const handleCategoryToggle = (category) => {
  setCategoryAannuler(prev => {
    if (prev.includes(category)) {
      return prev.filter(cat => cat !== category);
    } else {
      return [...prev, category];
    }
  });
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <Toaster position="top-right" />

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                API Connection Error: {error}
              </p>
              <p className="text-sm text-red-600 mt-1">
                Please ensure your API endpoints are running. Showing demo data
                instead.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="mb-5">
            <div className="flex items-center mr-2">
              <div className="p-3 bg-gradient-to-b from-blue-600 to-purple-600 rounded-xl mr-3 text-white">
                <Activity className="w-10 h-10" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Tableau de bord analytique
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Analyse en temps réel des mouvements de stock
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mx-4 my-3">
            <select
              id="yearBtn"
              className="bg-white border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {Array.from(
                { length: 5 },
                (_, i) => currentDate.getFullYear() - 2 + i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              id="monthBtn"
              className="bg-white border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {monthNames.map((month, index) => (
                <option key={index + 1} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>

            <fieldset
              id="stockValueBtn"
              className="fieldset bg-white border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <label className="label text-sm font-semibold text-gray-500">
                Ajoute Valeur stockOut
                <input
                  type="checkbox"
                  className="checkbox"
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
              </label>
            </fieldset>

            <div className="relative">
              <fieldset
                id="stockValueBtn"
                className="fieldset bg-white border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <label className="label text-sm font-semibold text-gray-500">
                  Categorie a annuler
                  <input
                    type="checkbox"
                    className="checkbox"
                    onChange={(e) => setCategoryCheked(e.target.checked)}
                  />
                </label>
              </fieldset>

              {/* Category Selection Dropdown */}
              {categoryCheked && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-4">
                    <div className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">
                      Sélectionnez les catégories à annuler:
                    </div>
                    <div className="space-y-2">
                      {categories.map((category, index) => (
                        <label
                          key={index}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            checked={categoryAannuler.includes(category)}
                            onChange={() => handleCategoryToggle(category)}
                          />
                          <span className="text-sm text-gray-700 flex-1">
                            {category}
                          </span>
                          {categoryAannuler.includes(category) && (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                              Annulée
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                    {categoryAannuler.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-xs text-gray-500">
                          {categoryAannuler.length} catégorie(s) sélectionnée(s)
                        </div>
                        <button
                          onClick={() => setCategoryAannuler([])}
                          className="text-xs text-red-600 hover:text-red-800 mt-1"
                        >
                          Effacer tout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <fieldset
              id="dayBtn"
              className="fieldset bg-white border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <label className="label text-sm font-semibold text-gray-500">
                Rapport/jrs
                <input
                  type="checkbox"
                  className="checkbox"
                  onChange={(e) => setChecked(e.target.checked)}
                />
              </label>
            </fieldset>

            {/* this input for the number of student  */}
            <input
              id="numberOfStudentBtn"
              type="number"
              placeholder="Nombre d'élèves"
              min={0}
              className="bg-white border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => setNumberStudents(parseFloat(e.target.value))}
            />
            {checked && (
              <select
                className="bg-white border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedDay}
                onChange={(e) => setSelectedDay(parseInt(e.target.value))}
              >
                {Array.from(
                  { length: daysInSelectedMonth },
                  (_, i) => i + 1
                ).map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            )}

            {checked ? (
              <PDFDownloadDailyReportButton
                analyticsData={analyticsData}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                selectedDay={selectedDay}
                toast={toast}
                isChecked={ischecked}
              />
            ) : (
              <div id="printBtn">
                <PDFDownloadButton
                  analyticsData={analyticsData}
                  selectedYear={selectedYear}
                  selectedMonth={selectedMonth}
                  toast={toast}
                  numberStudents={numberStudents}
                  isChecked={ischecked}
                  enableButton={numberStudents}
                  categotyToignore={categoryAannuler}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-white rounded-2xl p-1 mb-8 shadow-sm">
        {[
          {
            id: "overview",
            label: "Vue d'ensemble",
            icon: Activity,
            guidId: "globalVue",
          },
          {
            id: "daily",
            label: "Quotidien",
            icon: Calendar,
            guidId: "dailyVue",
          },
          {
            id: "monthly",
            label: "Mensuel",
            icon: BarChart3,
            guidId: "monthlyVue",
          },
          {
            id: "categories",
            label: "Catégories",
            icon: Target,
            guidId: "categoryVue",
          },
        ].map(({ id, label, icon: Icon, guidId }) => (
          <button
            id={guidId}
            key={id}
            onClick={() => setViewMode(id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
              viewMode === id
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      {analyticsData.currentOverview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div id="numberOfProducts">
            <StatCard
              title="Produits totaux"
              value={analyticsData.currentOverview.totalProducts}
              subtitle="En stock"
              icon={Package}
              trend={12}
              color="blue"
            />
          </div>
          <div id="valueTotal">
            <StatCard
              title="Valeur totale du stock"
              value={`${analyticsData.currentOverview.totalStockValue.toFixed(
                2
              )} DH`}
              subtitle="Valeur actuelle"
              icon={TrendingUp}
              trend={8}
              color="green"
            />
          </div>
          <div id="underStock">
            <StatCard
              title="Articles en faible stock"
              value={analyticsData.currentOverview.lowStockProducts}
              subtitle="À surveiller"
              icon={TrendingDown}
              trend={-5}
              color="red"
            />
          </div>
          <div id="highStock">
            <StatCard
              title="Articles en stock élevé"
              value={analyticsData.currentOverview.highStockProducts}
              subtitle="Bien approvisionné"
              icon={Activity}
              trend={3}
              color="purple"
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      {viewMode === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Movement Chart */}
          {analyticsData.dailyMovements.length > 0 && (
            <ChartContainer
              title="Mouvement quotidiens"
              className="lg:col-span-2"
            >
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={analyticsData.dailyMovements}>
                  <defs>
                    <linearGradient
                      id="inboundGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="outboundGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="stockIn"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#inboundGradient)"
                    name="Stock In"
                  />
                  <Area
                    type="monotone"
                    dataKey="stockOut"
                    stroke="#EF4444"
                    fillOpacity={1}
                    fill="url(#outboundGradient)"
                    name="Stock Out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}

          {/* Category Distribution */}
          {analyticsData.categoryStats.length > 0 && (
            <ChartContainer title="Stock par catégorie">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.categoryStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={125}
                    paddingAngle={3}
                    dataKey="movementCount"
                  >
                    {analyticsData.categoryStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || `hsl(${index * 90}, 70%, 50%)`}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}

          {/* Top Products */}
          {analyticsData.productPerformance.length > 0 && (
            <ChartContainer title=" Produits les plus actifs">
              <div className="space-y-4">
                {analyticsData.productPerformance
                  .slice(0, 5)
                  .map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm mr-4">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.movementCount} mouvements
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          +{product.totalIn.toFixed(1)}
                        </div>
                        <div className="text-sm text-red-600">
                          -{product.totalOut.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </ChartContainer>
          )}
        </div>
      )}

      {viewMode === "daily" && analyticsData.dailyMovements.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              Mouvements quotidiens - {monthNames[selectedMonth - 1]}{" "}
              {selectedYear}
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Entrées de stock</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Sorties de stock</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analyticsData.dailyMovements} barGap={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="stockIn" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="stockOut" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {viewMode === "categories" && analyticsData.categoryStats.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartContainer title="Répartition par catégorie">
            <div className="space-y-4">
              {analyticsData.categoryStats.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor:
                          category.color || `hsl(${index * 60}, 70%, 50%)`,
                      }}
                    ></div>
                    <span className="font-medium text-gray-800">
                      {category.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-800">
                      {category.movementCount} mouvements
                    </div>
                    <div className="text-sm text-gray-500">
                      {category.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartContainer>

          <ChartContainer title="Performance par catégorie">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.categoryStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar
                  dataKey="movementCount"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
