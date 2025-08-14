"use client";

import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import Header from "./Header";
import StatCards from "./StatCards";
import Filters from "./Filters";
import ProductsGrid from "./ProductsGrid";

const ProductPage = ({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) => {
  const [invoiceId, setInvoiceId] = useState<string>("");
  const [invoice, setInvoice] = useState<any>(null);
  const [productLines, setProductLines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

const categories = [
  "Tous (الكل)",
  "Boissons (مشروبات)",
  "Céréales (الحبوب)",
  "Fruits (فواكه)",
  "Légumes (خضروات)",
  "Viande (لحم)",
  "Produits laitiers (منتجات الألبان)",
  "Produits de nettoyage (مواد التنظيف)",
  "Épices et condiments (التوابل والمنكهات)",
  "Produits en conserve (المعلبات)",
  "Snacks et biscuits (وجبات خفيفة وبسكويت)",
  "Pain et boulangerie (الخبز والمخبوزات)",
  "Gaz (قنينات الغاز)",
  "Huiles et sauces (الزيوت والصلصات)",
  "Autre (أخرى)"
];



  useEffect(() => {
    const resolvePrams = async () => {
      try {
        const searchParams = await params;
        setInvoiceId(searchParams.invoiceId);
        await fetchInvoiceData(searchParams.invoiceId);
      } catch (error) {
        console.error("Error resolving params:", error);
      }
    };

    resolvePrams();
  }, [params]);

  const fetchInvoiceData = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}/productLines`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setInvoice(data);
        setProductLines(data.productLines || []);
      } else {
        console.error("Failed to fetch invoice data");
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveStockMovement = async (
    productId: string,
    newStock: number,
    previousStock: number,
    userProductId: string,
    movementType?: string,
    reason?: string,
    quantity?: number
  ) => {
    console.log("saveStockMovement called with:", {
      productId,
      newStock,
      previousStock,
      userProductId,
      movementType,
      reason,
      quantity,
    });

    // Validate parameters
    if (
      !productId ||
      newStock === undefined ||
      previousStock === undefined ||
      !userProductId
    ) {
      const missingParams = [];
      if (!productId) missingParams.push("productId");
      if (newStock === undefined) missingParams.push("newStock");
      if (previousStock === undefined) missingParams.push("previousStock");
      if (!userProductId) missingParams.push("userProductId");

      throw new Error(
        `Missing required parameters: ${missingParams.join(", ")}`
      );
    }

    try {
      const response = await fetch(`/api/admin/stock-movement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId,
          initialStock: newStock, // API expects 'initialStock' as the new stock
          currentStock: previousStock, // API expects 'currentStock' as the previous stock
          userProductId,
          movementType, // Pass movement type if provided
          reason, // Pass reason if provided
          quantity, // Pass quantity if provided
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("API Error Response:", error);
        throw new Error(error.error || "Failed to save stock movement");
      }

      const result = await response.json();
      console.log("Stock movement saved:", result);
      return result;
    } catch (error) {
      console.error("Error saving stock movement:", error);
      throw error;
    }
  };

  const getStockStatus = (product: any) => {
    if (product.currentStock <= product.minStock) return "low";
    if (product.currentStock >= product.initialStock * 0.8) return "high";
    return "normal";
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }
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



  const filteredProducts = productLines.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "low" && getStockStatus(product) === "low") ||
      (filterStatus === "normal" && getStockStatus(product) === "normal") ||
      (filterStatus === "high" && getStockStatus(product) === "high");

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const AddProductModal = () => {
    const [formData, setFormData] = useState({
      name: "",
      category: "Boissons (مشروبات)",
      unitPrice: 0,
      initialStock: 0,
      minStock: 0,
      unite: "Kg",
      quality: 3,
    });

    const handleSubmit = async () => {
      if (!formData.name.trim()) {
        toast.error("Nom de produit est important");
        return;
      }

      console.log("Form data before submission:", formData);
      console.log("Invoice ID:", invoiceId);

      try {
        // First, create the product line
        const response = await fetch(
          `/api/products/${invoiceId}/productLines`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          const updatedInvoice = await response.json();
          console.log(
            "Updated invoice after product creation:",
            updatedInvoice
          );

          // Get the newly created product line
          const newProductLines = updatedInvoice.productLines;
          const newProductLine = newProductLines[newProductLines.length - 1];

          console.log("New product line created:", newProductLine);

          // Validate that we have the necessary data
          if (!newProductLine || !newProductLine.id) {
            console.error("No product line ID found in response");
            toast.error("Erreur: ID du produit non trouvé");
            return;
          }

          if (!invoiceId) {
            console.error("Invoice ID is missing");
            toast.error("Erreur: ID de facture manquant");
            return;
          }

          try {
            // Save stock movement for the new product
            // For new products: previousStock = 0, newStock = initialStock
            await saveStockMovement(
              newProductLine.id,
              formData.initialStock,
              0,
              invoiceId
            );

            console.log("Stock movement saved successfully for new product");
            toast.success(
              "Produit ajouté avec succès et mouvement de stock enregistré"
            );
          } catch (stockError) {
            console.error(
              "Failed to save stock movement, but product was created:",
              stockError
            );
            toast.error(
              "Produit créé avec succès mais le mouvement du stock n'a pas été enregistré"
            );
          }

          // Update the state with new product lines
          setProductLines(newProductLines);
          setShowAddModal(false);

          // Reset form
          setFormData({
            name: "",
            category: "Céréales",
            unitPrice: 0,
            initialStock: 0,
            minStock: 0,
            unite: "Kg",
            quality: 3,
          });
        } else {
          const error = await response.json();
          console.error("Product creation failed:", error);
          toast.error(`Erreur: ${error.error}`);
        }
      } catch (error) {
        console.error("Error adding product:", error);
        toast.error("Erreur lors de l'ajout des produits");
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Ajouter un nouveau produit
            </h2>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du produit
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.slice(1).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix unitaire (DH)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      unitPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock initial
                </label>
                <input
                  type="number"
                  required
                  value={formData.initialStock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      initialStock: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unité
                </label>
                <select
                  value={formData.unite}
                  onChange={(e) =>
                    setFormData({ ...formData, unite: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Kg">Kg</option>
                  <option value="Pcs">Pcs</option>
                  <option value="L">Liters</option>
                  <option value="Box">Box</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock minimum
                </label>
                <input
                  type="number"
                  required
                  value={formData.minStock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minStock: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Évaluation de la qualité
                </label>
                <div className="flex items-center space-x-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, quality: i + 1 })
                      }
                      className="focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={
                          i < formData.quality
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ajouter un produit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Edit madel section 
  const EditProductModal = () => {
    const [formData, setFormData] = useState({
      name: editingProduct?.name || "",
      category: editingProduct?.category || "Beverages",
      unitPrice: editingProduct?.unitPrice || 0,
      currentStock:
        editingProduct?.currentStock || editingProduct?.initialStock || 0,
      initialStock: editingProduct?.initialStock || 0,
      minStock: editingProduct?.minStock || 0,
      unite: editingProduct?.unite || "Kg",
      quality: editingProduct?.quality || 3,
    });

    // Add new field for stock adjustment
    const [stockAdjustment, setStockAdjustment] = useState(0);
    const [adjustmentType, setAdjustmentType] = useState("add"); // "add" or "subtract" or "set"

    // Update form data when editingProduct changes
    useEffect(() => {
      if (editingProduct) {
        setFormData({
          name: editingProduct.name || "",
          category: editingProduct.category || "Beverages",
          unitPrice: editingProduct.unitPrice || 0,
          currentStock:
            editingProduct.currentStock || editingProduct.initialStock || 0,
          initialStock: editingProduct.initialStock || 0,
          minStock: editingProduct.minStock || 0,
          unite: editingProduct.unite || "Kg",
          quality: editingProduct.quality || 3,
        });
        setStockAdjustment(0);
        setAdjustmentType("add");
      }
    }, [editingProduct]);

    const handleSubmit = async () => {
      if (!formData.name.trim()) {
        toast.error("Le nom du produit nécessaire");
        return;
      }

      try {
        const originalStock =
          editingProduct.currentStock || editingProduct.initialStock || 0;
        let newStock = originalStock;

        // Calculate new stock based on adjustment type
        if (stockAdjustment !== 0) {
          if (adjustmentType === "add") {
            newStock = originalStock + Math.abs(stockAdjustment);
          } else if (adjustmentType === "subtract") {
            newStock = Math.max(0, originalStock - Math.abs(stockAdjustment));
          } else if (adjustmentType === "set") {
            newStock = Math.abs(stockAdjustment);
          }
        }

        console.log("Stock calculation:", {
          originalStock,
          stockAdjustment,
          adjustmentType,
          newStock,
        });

        // Update form data with calculated stock
        const updatedFormData = {
          ...formData,
          currentStock: newStock,
        };

        // Update the product first
        await handleUpdateProductLine(editingProduct.id, updatedFormData);

        // Record stock movement if there was a change
        if (originalStock !== newStock) {
          console.log("Recording stock movement...");

          try {
            // Determine movement type and reason based on adjustment
            let movementType, reason;
            const quantityChanged = Math.abs(newStock - originalStock);

            if (adjustmentType === "add") {
              movementType = "IN";
              reason = "STOCK_ADDITION";
            } else if (adjustmentType === "subtract") {
              movementType = "OUT";
              reason = "STOCK_CONSUMPTION";
            } else {
              movementType = newStock > originalStock ? "IN" : "OUT";
              reason = "STOCK_ADJUSTMENT";
            }

            // Save stock movement with proper parameters
            await saveStockMovement(
              editingProduct.id, // productId
              newStock, // newStock
              originalStock, // previousStock
              invoiceId, // userProductId
              movementType, // movement type
              reason, // reason
              quantityChanged // quantity changed
            );

            console.log(
              `Stock movement recorded: ${movementType} ${quantityChanged} units`
            );
            toast.success(
              `Produit mis à jour avec succès. Stock ${adjustmentType === "add"
                ? "ajouté"
                : adjustmentType === "subtract"
                  ? "consommé"
                  : "ajusté"
              }: ${quantityChanged} ${editingProduct.unite}`
            );
          } catch (stockError) {
            console.error(
              "Failed to save stock movement after update:",
              stockError
            );
            toast.success(
              "Produit mis à jour, mais le mouvement de stock n'a pas été enregistré"
            );
          }
        } else {
          toast.success("Produit mis à jour avec succès");
        }

        setShowEditModal(false);
        setEditingProduct(null);
      } catch (error) {
        console.error("Error updating product:", error);
        toast.error("Erreur lors de la mise à jour");
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Modifier le produit
            </h2>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du produit
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.slice(1).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix unitaire(DH)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      unitPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Stock Management Section */}
              <div className="md:col-span-2">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Gestion du stock
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock Courant
                      </label>
                      <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
                        {editingProduct?.currentStock ||
                          editingProduct?.initialStock ||
                          0}{" "}
                        {editingProduct?.unite}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type d'action
                      </label>
                      <select
                        value={adjustmentType}
                        onChange={(e) => setAdjustmentType(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="add">Ajouter du stock (ENTRÉE)</option>
                        <option value="subtract">
                          Consommer du stock (SORTIE)
                        </option>
                        <option value="set">Définir le stock exact</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {adjustmentType === "set"
                          ? "Nouveau montant de stock"
                          : "Quantité"}
                      </label>
                      <input
                        type="number"
                        value={stockAdjustment}
                        onChange={(e) =>
                          setStockAdjustment(parseFloat(e.target.value) || 0)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={
                          adjustmentType === "set"
                            ? "Stock total"
                            : "Montant à ajouter" + adjustmentType
                        }
                      />
                    </div>
                  </div>

                  {/* Stock Calculation Preview */}
                  {stockAdjustment !== 0 && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>Preview:</strong>
                        {adjustmentType === "add" &&
                          ` ${editingProduct?.currentStock || 0
                          } + ${stockAdjustment} = ${(editingProduct?.currentStock || 0) +
                          stockAdjustment
                          } ${editingProduct?.unite}`}
                        {adjustmentType === "subtract" &&
                          ` ${editingProduct?.currentStock || 0
                          } - ${stockAdjustment} = ${Math.max(
                            0,
                            (editingProduct?.currentStock || 0) -
                            stockAdjustment
                          )} ${editingProduct?.unite}`}
                        {adjustmentType === "set" &&
                          ` Stock will be set to ${stockAdjustment} ${editingProduct?.unite}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Stock
                </label>
                <input
                  type="number"
                  required
                  value={formData.initialStock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      initialStock: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  value={formData.unite}
                  onChange={(e) =>
                    setFormData({ ...formData, unite: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Kg">Kg</option>
                  <option value="Pcs">Pcs</option>
                  <option value="L">Liters</option>
                  <option value="Box">Box</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Stock
                </label>
                <input
                  type="number"
                  required
                  value={formData.minStock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minStock: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality Rating
                </label>
                <div className="flex items-center space-x-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, quality: i + 1 })
                      }
                      className="focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={
                          i < formData.quality
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mettre à jour le produit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleUpdateProductLine = async (
    productLineId: string,
    updateData: any
  ) => {
    try {
      console.log(
        "Updating product line:",
        productLineId,
        "with data:",
        updateData
      );

      const response = await fetch(
        `/api/products/${invoiceId}/productLines/${productLineId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updateData),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error:", errorText);
        throw new Error(
          `Unable to update product line: ${response.status} ${errorText}`
        );
      }

      const result = await response.json();
      console.log("Update product line result:", result);

      // Refresh the invoice data
      await fetchInvoiceData(invoiceId);

      return result;
    } catch (error) {
      console.error("Failed to update product line:", error);
      throw error;
    }
  };

  // Function to handle editing a product line (opens edit modal)
  const handleEditProductLine = (product: any) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  // Function to delete entire invoice
  const deleteProductInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/products?id=${invoiceId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        toast.success("la supresssion ech");
        throw new Error("Unable to delete invoice");
      }

      const result = await response.json();
      console.log("Delete result:", result);

      // Redirect to dashboard or show success message
      toast.success("la supresssion suffit avec success");
      window.location.href = "/admin/dashboard";

      return result;
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      throw error;
    }
  };

  // Function to delete individual product line
  const handleDeleteLine = async (productLineId: string) => {
    try {
      const response = await fetch(
        `/api/products/${invoiceId}/productLines/${productLineId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to delete product line");
      }

      const result = await response.json();
      console.log("Delete product line result:", result);

      // Refresh the invoice data
      await fetchInvoiceData(invoiceId);

      return result;
    } catch (error) {
      console.error("Failed to delete product line:", error);
      throw error;
    }
  };

  // Function to handle invoice deletion with confirmation
  const handleDeleteInvoice = async () => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer entièrement cette facture ? Cette action ne peut pas être annulée."
      )
    ) {
      try {
        await deleteProductInvoice(invoiceId);
        toast.success("la supresssion suffit avec success");
      } catch (error) {
        toast.error("Erreur lors de la suppression de la facture");
      }
    }
  };

  // Function to handle product line deletion with confirmation
  const handleDeleteProductLine = async (
    productLineId: string,
    productName: string
  ) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer "${productName}"? Cette action ne peut pas être annulée.`
      )
    ) {
      try {
        await handleDeleteLine(productLineId);
        toast.success("la supresssion suffit avec success");
      } catch (error) {
        toast.error("Erreur lors de la suppression du produit");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-blue-600"></div>
          <p className="mt-4 text-gray-600">
            Chargement des données de facture...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50">
      {/* Header */}
      <Header
        invoice={invoice}
        invoiceId={invoiceId}
        setShowModel={setShowAddModal}
        handleDeleteInvoice={handleDeleteInvoice}
      />

      {/* Stats Cards */}
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatCards
          productLines={productLines}
          getStockStatus={getStockStatus}
        />

        {/* Filters */}
        <Filters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          categories={categories}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {/* Products Grid */}
        <ProductsGrid
          getStockStatus={getStockStatus}
          filteredProducts={filteredProducts}
          getProductImage={getProductImage}
          handleDeleteProductLine={handleDeleteProductLine}
          handleEditProductLine={handleEditProductLine}
          renderStars={renderStars}
          productLines={productLines}
        />
      </div>

      {/* Add Product Modal */}
      {showAddModal && <AddProductModal />}
      {showEditModal && <EditProductModal />}
    </div>
  );
};

export default ProductPage;
