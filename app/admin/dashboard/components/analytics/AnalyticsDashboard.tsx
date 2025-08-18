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
import SelectedDayMvt from "./SelectedDayMvt";
// Fixed: Remove duplicate import, keep only one
import PDFDownloadDailyReportButton from "./DailyButton";
import BackupManager from "@/app/components/BackupManager";

const AnalyticsDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [checked, setChecked] = useState(false);
  const [ischecked, setIsChecked] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [numberStudents, setNumberStudents] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [viewMode, setViewMode] = useState("overview"); // 'overview', 'daily', 'monthly', 'categories'
  const [loading, setLoading] = useState(true);
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

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      const startDate = new Date(selectedYear, selectedMonth - 1, 1);
      const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);

      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();

      // Fetch all analytics data in parallel
      const [
        dailyMovements,
        monthlySummary,
        categoryStats,
        productPerformance,
        currentOverview,
      ] = await Promise.all([
        fetch(
          `/api/analytics/daily-movements?startDate=${startDateStr}&endDate=${endDateStr}`
        ).then((res) => res.json()),
        fetch(
          `/api/analytics/monthly-summary?year=${selectedYear}&month=${selectedMonth}`
        ).then((res) => res.json()),
        fetch(
          `/api/analytics/category-stats?startDate=${startDateStr}&endDate=${endDateStr}`
        ).then((res) => res.json()),
        fetch(
          `/api/analytics/product-performance?startDate=${startDateStr}&endDate=${endDateStr}&limit=10`
        ).then((res) => res.json()),
        fetch(
          `/api/analytics/current-overview?startDate=${encodeURIComponent(startDateStr)}&endDate=${encodeURIComponent(endDateStr)}`
        ).then((res) => res.json()),
      ]);

      console.log("daily movement", dailyMovements);
      console.log("monthly movement", monthlySummary);
      console.log("categorical movement", categoryStats);

      setAnalyticsData({
        dailyMovements: dailyMovements.error ? [] : dailyMovements,
        monthlySummary: monthlySummary.error ? null : monthlySummary,
        categoryStats: categoryStats.error ? [] : categoryStats,
        productPerformance: productPerformance.error ? [] : productPerformance,
        currentOverview: currentOverview.error ? null : currentOverview,
      });
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

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

  // const handleDownloadReport = () => {
  //     const reportData = {
  //         year: selectedYear,
  //         month: selectedMonth,
  //         monthName: monthNames[selectedMonth - 1],
  //         data: analyticsData,
  //         generatedAt: new Date().toISOString(),
  //     };

  //     const dataStr = JSON.stringify(reportData, null, 2);
  //     const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  //     const exportFileDefaultName = `analytics-report-${selectedYear}-${selectedMonth}.json`;

  //     const linkElement = document.createElement('a');
  //     linkElement.setAttribute('href', dataUri);
  //     linkElement.setAttribute('download', exportFileDefaultName);
  //     linkElement.click();

  //     toast.success('Report downloaded successfully');
  // };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <p className="text-gray-600 text-sm mb-2">{`Date: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
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
  }: any) => (
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

  const ChartContainer = ({ title, children, className = "" }: any) => (
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <Toaster position="top-right" />
        
        {/* Add the backup manager */}
        <BackupManager 
          analyticsData={analyticsData}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
      {/* Header */}
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

          <div className="grid grid-cols-2 gap-3 mt-3">
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
              />
              </div>
            )}

            {/* <button
                onClick={handleDownloadReport}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
                <Download className="w-4 h-4" />
                <span>Exporter le rapport</span>
            </button> */}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-white rounded-2xl p-1 mb-8 shadow-sm">
        {[
          { id: "overview", label: "Vue d’ensemble", icon: Activity, guidId:'globalVue' },
          { id: "daily", label: "Quotidien", icon: Calendar, guidId:'dailyVue' },
          { id: "monthly", label: "Mensuel", icon: BarChart3, guidId:'monthlyVue' },
          { id: "categories", label: "Catégories", icon: Target, guidId:'categoryVue' },
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
                    {analyticsData.categoryStats.map(
                      (entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color || `hsl(${index * 90}, 70%, 50%)`}
                        />
                      )
                    )}
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
                  .map((product: any, index: number) => (
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
              {analyticsData.categoryStats.map(
                (category: any, index: number) => (
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
                )
              )}
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
