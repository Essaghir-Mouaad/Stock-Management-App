import React from "react";
import { Calendar } from "lucide-react";
import { Movement } from "@/types/interfaces";

// PDF Report Layout Component
const GlobalReport = React.forwardRef(
  (
    {
      analyticsData,
      selectedYear,
      selectedMonth,
      numberStudents,
      checkedOption,
      categotyToignore
    }: any,
    ref: any
  ) => {
    const currentDate = new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const monthNames = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];

interface WeeklyStats {
  totalIn: number;
  totalOut: number;
  net: number;
  movementCount: number;
  year: number;
  week: number; 
  weekNumber: number; 
  startDate: string;
  endDate: string;
  days: Array<{
    date: string;
    stockIn: number;
    stockOut: number;
    net: number;
    movements: Movement[];
    movementCount: number;
  }>;
  // Keep as Records initially, will convert to arrays later
  categoryStats: Record<string, {
    name: string;
    totalIn: number;
    totalOut: number;
    net: number;
    movementCount: number;
  }>;
  productStats: Record<string, {
    id: string;
    name: string;
    category: string;
    totalIn: number;
    totalOut: number;
    net: number;
    unite: string;
    movementCount: number;
    unitPrice: number;
  }>;
}

interface WeeklyGroups {
  [weekKey: string]: WeeklyStats;
}

interface WeeklyDataItem {
  week: string;
  weekNumber: number;
  totalIn: number;
  totalOut: number;
  net: number;
  movementCount: number;
  year: number;
  startDate: string;
  endDate: string;
  days: Array<{
    date: string;
    stockIn: number;
    stockOut: number;
    net: number;
    movements: Movement[];
    movementCount: number;
  }>;
  // These should be arrays after conversion
  categoryStats: Array<{
    name: string;
    totalIn: number;
    totalOut: number;
    net: number;
    movementCount: number;
  }>;
  productStats: Array<{
    id: string;
    name: string;
    category: string;
    totalIn: number;
    totalOut: number;
    net: number;
    unite: string;
    movementCount: number;
    unitPrice: number;
  }>;
}

    const monthName = monthNames[selectedMonth - 1];
    const data = analyticsData.data || analyticsData;

    // Calculate total stock value
    const totalOutValue =
      data?.productPerformance?.reduce((sum: number, product: any) => {
        return sum + product.totalOut * product.unitPrice;
      }, 0) || 0;


    // this const handel the quantity of the categories out of consumation of students
    const totalCategoryoutOfStudentConso =
      data.productPerformance
        ?.filter(
          (product: any) =>
            categotyToignore.includes(product.category)
        )
        .reduce((sum: number, product: any) => {
          return sum + product.totalOut * product.unitPrice;
        }, 0) || 0;

    // cette const handel the consumation for each student based pare N days/month at the end of month gives the pure total consuma/student
    const consumationPerStudent =
      totalOutValue
        ? (totalOutValue - totalCategoryoutOfStudentConso) / numberStudents
        : 0;

    // get the weekely data
    const calculateWeeklyTotals = (dailyMovements: any) => {
      const weeklyData: WeeklyDataItem[] = [];

      // Helper function to get week number and year
      const getWeekInfo = (dateString: any) => {
        const date = new Date(dateString);
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
        return {
          year: date.getFullYear(),
          week: weekNumber,
          startDate: getWeekStartDate(date),
          endDate: getWeekEndDate(date),
        };
      };

      // Helper function to get week start date (Monday)
      const getWeekStartDate = (date: any) => {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(date.setDate(diff));
      };

      // Helper function to get week end date (Sunday)
      const getWeekEndDate = (date: any) => {
        const startDate = getWeekStartDate(new Date(date));
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        return endDate;
      };

      // Group daily movements by week
      const weeklyGroups: WeeklyGroups = {};

      dailyMovements.forEach((day: any) => {
        const weekInfo = getWeekInfo(day.date);
        const weekKey = `${weekInfo.year}-W${weekInfo.week}`;

        if (!weeklyGroups[weekKey]) {
          weeklyGroups[weekKey] = {
            year: weekInfo.year,
            week: weekInfo.week,
            weekNumber: weekInfo.week, // Add weekNumber
            startDate: weekInfo.startDate.toISOString().split("T")[0],
            endDate: weekInfo.endDate.toISOString().split("T")[0],
            totalIn: 0,
            totalOut: 0,
            net: 0,
            movementCount: 0,
            days: [],
            categoryStats: {}, // Keep as Record initially
            productStats: {}, // Keep as Record initially
          };
        }

        // Add daily totals to weekly totals
        weeklyGroups[weekKey].totalIn += day.stockIn;
        weeklyGroups[weekKey].totalOut += day.stockOut;
        weeklyGroups[weekKey].net += day.net;
        weeklyGroups[weekKey].movementCount += day.movements.length;
        weeklyGroups[weekKey].days.push({
          date: day.date,
          stockIn: day.stockIn,
          stockOut: day.stockOut,
          net: day.net,
          movements: day.movements, // Add the missing movements property
          movementCount: day.movements.length,
        });

        // Process movements for category and product statistics
        day.movements.forEach((movement: any) => {
          const category = movement.productLine.category;
          const productId = movement.productLine.id;
          const productName = movement.productLine.name;
          const quantity =
            movement.movementType === "IN"
              ? movement.quantity
              : -movement.quantity;

          // Category statistics
          if (!weeklyGroups[weekKey].categoryStats[category]) {
            weeklyGroups[weekKey].categoryStats[category] = {
              name: category,
              totalIn: 0,
              totalOut: 0,
              net: 0,
              movementCount: 0,
            };
          }

          if (movement.movementType === "IN") {
            weeklyGroups[weekKey].categoryStats[category].totalIn +=
              movement.quantity;
          } else {
            weeklyGroups[weekKey].categoryStats[category].totalOut +=
              movement.quantity;
          }
          weeklyGroups[weekKey].categoryStats[category].net += quantity;
          weeklyGroups[weekKey].categoryStats[category].movementCount++;

          // Product statistics
          if (!weeklyGroups[weekKey].productStats[productId]) {
            weeklyGroups[weekKey].productStats[productId] = {
              id: productId,
              name: productName,
              category: category,
              totalIn: 0,
              totalOut: 0,
              net: 0,
              movementCount: 0,
              unitPrice: movement.productLine.unitPrice,
              unite: movement.productLine.unite,
            };
          }

          if (movement.movementType === "IN") {
            weeklyGroups[weekKey].productStats[productId].totalIn +=
              movement.quantity;
          } else {
            weeklyGroups[weekKey].productStats[productId].totalOut +=
              movement.quantity;
          }
          weeklyGroups[weekKey].productStats[productId].net += quantity;
          weeklyGroups[weekKey].productStats[productId].movementCount++;
        });
      });

      // Convert grouped data to array and sort by week
      Object.keys(weeklyGroups)
        .sort()
        .forEach((weekKey) => {
          const weekData = weeklyGroups[weekKey];

          // Convert Records to arrays and create the final WeeklyDataItem
          const weeklyDataItem: WeeklyDataItem = {
            week: weekKey,
            weekNumber: weekData.week,
            year: weekData.year,
            startDate: weekData.startDate,
            endDate: weekData.endDate,
            totalIn: weekData.totalIn,
            totalOut: weekData.totalOut,
            net: weekData.net,
            movementCount: weekData.movementCount,
            days: weekData.days,
            // Convert category stats to array
            categoryStats: Object.values(weekData.categoryStats),
            // Convert product stats to array and sort by total activity
            productStats: Object.values(weekData.productStats).sort(
              (a, b) => b.totalIn + b.totalOut - (a.totalIn + a.totalOut)
            ),
          };

          weeklyData.push(weeklyDataItem);
        });

      return weeklyData;
    };

    const formatWeekPeriod = (weekData: any) => {
      const startDate = new Date(weekData.startDate).toLocaleDateString(
        "fr-FR",
        {
          day: "numeric",
          month: "short",
        }
      );
      const endDate = new Date(weekData.endDate).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      });
      return `Semaine ${weekData.weekNumber} (${startDate} - ${endDate})`;
    };

    const weeklyData = data?.dailyMovements ? calculateWeeklyTotals(data.dailyMovements) : [];

    // Handle monthly summary - ensure we don't include null/undefined entries
    const monthlySummaryData = (
      Array.isArray(data.monthlySummary)
        ? data.monthlySummary
        : [data.monthlySummary]
    ).filter(Boolean); // remove null/undefined so accessing properties like `month` is safe

    return (
      <div
        ref={ref}
        className="bg-white text-gray-900 p-8"
        style={{ minHeight: "297mm", width: "210mm" }}
      >
        {/* Header*/}
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-900 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Rapport Mensuel</h1>
              <p className="text-blue-200 text-lg">
                Analyse des Mouvements de Stock
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-5 w-5" />
                <span className="text-xl font-semibold">
                  {monthName} {selectedYear}
                </span>
              </div>
              <p className="text-blue-50">Généré le {currentDate}</p>
            </div>
          </div>
        </div>

        {/* Metrics*/}
        <div
          className={`${
            checkedOption
              ? "grid grid-cols-4 gap-4 mb-8"
              : "grid grid-cols-3 gap-4 mb-8"
          }`}
        >
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <div className="text-2xl font-bold text-green-700">
              {data.monthlySummary?.totalIn?.toLocaleString("fr-FR") || "0"}
            </div>
            <p className="text-sm font-semibold text-green-800">
              Total Entrées
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-200">
            <div className="text-2xl font-bold text-red-700">
              {data.monthlySummary?.totalOut?.toLocaleString("fr-FR") || "0"}
            </div>
            <p className="text-sm font-semibold text-red-800">Total Sorties</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">
              {data.monthlySummary?.net?.toLocaleString("fr-FR") || "0"}
            </div>
            <p className="text-sm font-semibold text-blue-800">Solde Net</p>
          </div>
          {checkedOption && (
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <div className="text-2xl font-bold text-purple-700">
                {totalOutValue}dh
              </div>
              <p className="text-sm font-semibold text-purple-800">
                Valeur Stock
              </p>
            </div>
          )}
        </div>

        {/* Monthly Summary*/}
        <div className="bg-white rounded-xl border border-gray-200 mb-8">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h3 className="text-lg font-bold text-gray-800">Résumé Mensuel</h3>
            <p className="text-sm text-gray-600">
              Historique des mouvements mensuels
            </p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-left text-xs font-semibold">
                  Période
                </th>
                <th className="px-4 py-3 text-center font-bold text-xs">
                  Entrées
                </th>
                <th className="px-4 py-3 text-center font-bold text-xs">
                  Sorties
                </th>
                <th className="px-4 py-3 text-center font-bold text-xs ">
                  Solde Net
                </th>
                <th className="px-4 py-3 text-center font-bold text-xs">
                  Mouvements
                </th>
              </tr>
            </thead>
            <tbody>
              {monthlySummaryData.map((monthData: any, index: number) => {
                const safeMonth = monthData?.month || selectedMonth;
                const safeYear = monthData?.year || selectedYear;
                const safeTotalIn = monthData?.totalIn ?? 0;
                const safeTotalOut = monthData?.totalOut ?? 0;
                const safeNet = monthData?.net ?? 0;
                const safeMovementCount = monthData?.movementCount ?? 0;

                return (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium">
                        {monthNames[safeMonth - 1]} {safeYear}
                      </div>
                      {!Array.isArray(data.monthlySummary) && (
                        <div className="text-xs text-gray-500">
                          Données actuelles
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-bold">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        +{safeTotalIn.toLocaleString("fr-FR")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold">
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                        -{safeTotalOut.toLocaleString("fr-FR")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          safeNet > 0
                            ? "bg-green-100 text-green-800"
                            : safeNet < 0
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {safeNet > 0 ? "+" : ""}
                        {safeNet.toLocaleString("fr-FR")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold">
                      <span className="font-semibold text-xs">
                        {safeMovementCount}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Weeekly summary */}

        <div className="bg-white rounded-xl border border-gray-200 mb-8">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h3 className="text-lg font-bold text-gray-800">
              Résumé Hebdomadaire
            </h3>
            <p className="text-sm text-gray-600">
              Historique des mouvements par semaine
            </p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-left text-xs font-semibold">
                  Période
                </th>
                <th className="px-4 py-3 text-center font-bold text-xs">
                  Entrées
                </th>
                <th className="px-4 py-3 text-center font-bold text-xs">
                  Sorties
                </th>
                <th className="px-4 py-3 text-center font-bold text-xs">
                  Solde Net
                </th>
                <th className="px-4 py-3 text-center font-bold text-xs">
                  Mouvements
                </th>
                <th className="px-4 py-3 text-center font-bold text-xs">
                  Jours Actifs
                </th>
              </tr>
            </thead>
            <tbody>
              {weeklyData.map((week: any, index: number) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium">
                      {formatWeekPeriod(week)}
                    </div>
                    <div className="text-xs text-gray-500">{week.year}</div>
                  </td>
                  <td className="px-4 py-3 text-center font-bold">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      +{week.totalIn.toLocaleString("fr-FR")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold">
                    <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                      -{week.totalOut.toLocaleString("fr-FR")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        week.net > 0
                          ? "bg-green-100 text-green-800"
                          : week.net < 0
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {week.net > 0 ? "+" : ""}
                      {week.net.toLocaleString("fr-FR")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold">
                    <span className="font-semibold text-xs">
                      {week.movementCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold">
                    <span className="font-semibold text-xs">
                      {week.days.length}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow mb-8">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h3 className="text-lg font-bold text-gray-800">
              Résumé des consommations par étudiant
            </h3>
            <p className="text-sm text-gray-600">
              Aperçu hebdomadaire des mouvements de consommation
            </p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-3 text-left font-medium text-balck">
                  Désignation
                </th>
                <th className="px-4 py-3 text-center font-bold  text-black">
                  Valeur
                </th>
              </tr>
            </thead>
            <tbody>
              {checkedOption && (
                <tr className="bg-gray-50 border-b">
                  <td className="px-4 py-3">
                    <span className="font-normal">
                      Consommation totale incluant les postes hors alimentation
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-bol">
                    {" "}
                    <span className="bg-amber-200">{totalOutValue} Dh</span>
                  </td>
                </tr>
              )}

              {checkedOption && (
                <tr className="bg-gray-50 border-b">
                  <td className="px-4 py-3">
                    <span className="font-normal">
                      Montant des consommations hors catégories alimentaires
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold">
                    <span className="bg-amber-200">
                      {totalCategoryoutOfStudentConso} Dh
                    </span>
                  </td>
                </tr>
              )}

              {checkedOption && (
                <tr className="bg-gray-50 border-b">
                  <td className="px-4 py-3">
                    <span className="font-normal">
                      Montant des consommations strictement alimentaires
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold">
                    <span className="bg-amber-200">
                      {totalOutValue - totalCategoryoutOfStudentConso} Dh
                    </span>
                  </td>
                </tr>
              )}

              <tr className="bg-gray-50 border-b">
                <td className="px-4 py-3">
                  <span className="font-normal">
                    Consommation moyenne par étudiant
                  </span>
                </td>
                <td className="px-4 py-3 text-center font-bold">
                  <span className="bg-amber-200">
                    {consumationPerStudent.toFixed(2)} Dh
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Category Performance*/}
        {checkedOption && (
          <div className="bg-white rounded-xl border border-gray-200 mb-8">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h3 className="text-lg font-bold text-gray-800">
              Performance par Catégorie
            </h3>
            <p className="text-sm text-gray-600">
              {data.categoryStats?.length || 0} catégories analysées
            </p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-left text-xs font-semibold">
                  Catégorie
                </th>
                <th className="px-4 py-3 text-center font-bold text-xs">
                  Entrées
                </th>
                <th className="px-4 py-3 text-center font-bold text-xs">
                  Sorties
                </th>
                <th className="px-4 py-3 text-center font-bold text-xs">Net</th>
                <th className="px-4 py-3 text-center font-bold text-xs ">
                  Mouvements
                </th>
                <th className="px-4 py-3 text-center font-bold text-xs">
                  % du Total
                </th>
              </tr>
            </thead>
            <tbody>
              {data.categoryStats?.map((category: any, index: number) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium">{category.name}</div>
                  </td>
                  <td className="px-4 py-3 text-center font-bold">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      +{category.totalIn}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold">
                    <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                      -{category.totalOut}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        category.net > 0
                          ? "bg-green-100 text-green-800"
                          : category.net < 0
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {category.net > 0 ? "+" : ""}
                      {category.net}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold">
                    <span className="font-semibold text-xs">
                      {category.movementCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold">
                    <span className="font-semibold text-xs">
                      {category.percentage?.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        {/* Product Performance */}
        <div className="bg-white rounded-xl border border-gray-200 mb-8">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h3 className="text-lg font-bold text-gray-800">
              Performance des Produits
            </h3>
            <p className="text-sm text-gray-600">
              {data.productPerformance?.length || 0} produits les plus actifs
            </p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-left text-xs font-semibold">
                  Produit
                </th>
                <th className="px-4 py-3 text-center font-bold text-xs">
                  Entrées
                </th>
                <th className="px-4 py-3 text-center font-bold text-xs">
                  Sorties
                </th>
                <th className="px-4 py-3 text-center font-bold text-xs">
                  Stock Actuel
                </th>
                {checkedOption && (
                  <th className="px-4 py-3 text-center font-bold text-xs ">
                    Prix Unitaire
                  </th>
                )}
                <th className="px-4 py-3 text-center font-bold text-xs">
                  Mouvements
                </th>
              </tr>
            </thead>
            <tbody>
              {data.productPerformance
                ?.slice(0)
                .map((product: any, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium">{product.name}</div>
                      <div className="text-xs text-gray-500">
                        {product.category}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-bold">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        +{product.totalIn}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        {product.unite}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold">
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                        -{product.totalOut}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        {product.unite}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          product.currentStock < 20
                            ? "bg-red-100 text-red-800"
                            : product.currentStock < 50
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {product.currentStock}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        {product.unite}
                      </span>
                    </td>
                    {checkedOption && (
                      <td className="px-4 py-3 text-center font-bold">
                        <span className="font-semibold text-xs">
                          {product.unitPrice} dh
                        </span>
                      </td>
                    )}
                    <td className="px-4 py-3 text-center font-bold">
                      <span className="font-semibold text-xs">
                        {product.movementCount}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Footer*/}
        <div className="mt-16 pt-6 border-t text-center text-sm text-gray-600">
          <p>
            © 2024 Système de Gestion des Stocks - Rapport généré
            automatiquement
          </p>
        </div>
      </div>
    );
  }
);

export default GlobalReport;