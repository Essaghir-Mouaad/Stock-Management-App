import { AlertTriangle, Calendar } from "lucide-react";
import React from "react";

const SelectedDayMvt = React.forwardRef(
  (
    { analyticsData, selectedYear, selectedMonth, selectedDay, isChecked }: any,
    ref: any
  ) => {
    const selectedDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
    const currentDateTime = new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Fix: Use consistent data structure - remove .data layer
    const dayMovements = analyticsData?.dailyMovements?.find(
      (day: any) =>
        new Date(day.date).toDateString() === selectedDate.toDateString()
    );

    const totalStockValue =
      dayMovements?.movements
        .filter((day: any) => day.movementType === "OUT")
        .reduce(
          (sum: number, product: any) =>
            sum + product.quantity * product.productLine.unitPrice,
          0
        ) || 0;

    

    return (
      <div
        ref={ref}
        className="bg-white text-gray-900 p-8"
        style={{ minHeight: "297mm", width: "210mm" }}
      >
        {/* Header */}
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-900 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Rapport Journalier</h1>
              <p className="text-blue-200 text-lg">Mouvements de Stock</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-5 w-5" />
                <span className="text-xl font-semibold">
                  {selectedDate.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-blue-50">Généré le {currentDateTime}</p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div
          className={`${
            isChecked
              ? "grid grid-cols-4 gap-4 mb-8"
              : "grid grid-cols-3 gap-4 mb-8"
          }`}
        >
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <div className="text-2xl font-bold text-green-700">
              {dayMovements?.stockIn || 0}
            </div>
            <p className="text-sm font-semibold text-green-800">
              Total Entrées
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-200">
            <div className="text-2xl font-bold text-red-700">
              {dayMovements?.stockOut || 0}
            </div>
            <p className="text-sm font-semibold text-red-800">Total Sorties</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">
              {dayMovements?.net || 0}
            </div>
            <p className="text-sm font-semibold text-blue-800">Solde Net</p>
          </div>
          {isChecked && (
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <div className="text-2xl font-bold text-purple-700">
                {totalStockValue.toLocaleString("fr-FR")} dh
              </div>
              <p className="text-sm font-semibold text-purple-800">
                Valeur Stock
              </p>
            </div>
          )}
        </div>

        {/* Movements Table */}
        {dayMovements?.movements?.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h3 className="text-lg font-bold text-gray-800">
                Mouvements du {selectedDate.toLocaleDateString("fr-FR")}
              </h3>
              <p className="text-sm text-gray-600">
                {dayMovements.movements.length} mouvements
              </p>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Heure
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Produit
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold">
                    Type
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold">
                    Quantité
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Raison
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Utilisateur
                  </th>
                </tr>
              </thead>
              <tbody>
                {dayMovements.movements.map((movement: any, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-3 text-xs">
                      {new Date(movement.createdAt).toLocaleTimeString(
                        "fr-FR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium">
                        {movement.productLine?.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {movement.productLine?.category}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          movement.movementType === "IN"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {movement.movementType === "IN" ? "ENTRÉE" : "SORTIE"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold">
                        {movement.movementType === "IN" ? "+" : "-"}
                        {movement.quantity}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        {movement.productLine?.unite}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-meduim">
                        {movement.reason}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-medium">
                        {movement.user?.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {movement.user?.role}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun mouvement trouvé</h3>
            <p className="text-gray-600">
              Il n'y a eu aucun mouvement de stock le{" "}
              {selectedDate.toLocaleDateString("fr-FR")}
            </p>
          </div>
        )}

        {/* Footer */}
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

SelectedDayMvt.displayName = "SelectedDayMvt";

export default SelectedDayMvt;
