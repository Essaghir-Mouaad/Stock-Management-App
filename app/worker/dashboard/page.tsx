"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Filter,
  Download,
  Bell,
  Settings,
  LogOut,
  Star,
  FileText,
  BarChart3,
  Eye,
  Package2Icon,
  ChartBar,
  ListRestart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Product } from "@/type";
import { useReactToPrint } from "react-to-print";
import "intro.js/introjs.css";

const WorkerStockWorkspace = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [workerName, setWokerName] = useState("Mohamed");
  const [stockMovements, setStockMovements] = useState({});
  const [reasons, setReasons] = useState({});
  const router = useRouter();
  const [invoices, setInvoices] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [productConfirmations, setProductConfirmations] = useState({});
  const [customReasons, setCustomReasons] = useState<{ [key: string]: string }>(
    {}
  );
  const [quantityAndReason, setQuantityAndReason] = useState<{
    [key: string]: {
      product: string;
      quantity: number;
      reason: string;
      createdAt: string;
    };
  }>({});

  // Fix the reportTimestamp initialization
  const [reportTimestamp, setReportTimestamp] = useState<Date>(new Date());
  const [isClientMounted, setIsClientMounted] = useState(false);

  // Keep the ref for consistent date strings
  const reportDateStringRef = useRef<string | null>(null);

  const printRef = useRef<HTMLDivElement>(null);

  // Add client mount detection
  useEffect(() => {
    setIsClientMounted(true);
    const now = new Date();
    setReportTimestamp(now);
    reportDateStringRef.current = now.toLocaleDateString("fr-FR");
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Invoice-${selectedInvoice?.name || "Unknown"}-${
      reportTimestamp.toISOString().split("T")[0]
    }`,
  });

  const getUserInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/worker/user", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const userInfo = await res.json();
        setWokerName(
          userInfo.name.split(" ")[0].charAt(0).toUpperCase() +
            userInfo.name.split(" ")[0].slice(1)
        );
      } else {
        console.error("error fetching user info");
      }
    } catch (error) {
      console.error("can't fetch info of user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/worker`, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const invoice = await res.json();
        setInvoices(invoice || []);
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
    quantity: string,
    reason: string
  ) => {
    try {
      const res = await fetch("/api/worker/stock-movement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId,
          quantity: parseFloat(quantity),
          reason,
          userProductId: selectedInvoice?.id,
        }),
      });

      if (res.ok) {
        return await res.json();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save stock movement");
      }
    } catch (error) {
      console.error("Error saving stock movement:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  useEffect(() => {
    getUserInfo();
  }, []);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterCategory === "all" ||
      invoice.productLines.some(
        (product) => product.category === filterCategory
      );
    return matchesSearch && matchesFilter;
  });

  const handleQuantityChange = (productId: string, quantity: number) => {
    setStockMovements((prev) => ({
      ...prev,
      [productId]: quantity,
    }));

    const productName =
      selectedInvoice?.products.find((p) => p.id === productId)?.name || "";

    setQuantityAndReason((prev) => ({
      ...prev,
      [productId]: {
        product: productName,
        quantity: quantity,
        reason: prev[productId]?.reason || "",
        // Use consistent date string from ref or fallback
        createdAt:
          prev[productId]?.createdAt ||
          reportDateStringRef.current ||
          new Date().toLocaleDateString("fr-FR"),
      },
    }));
  };

  const handleReasonChange = (productId: string, reason: string) => {
    setReasons((prev) => ({
      ...prev,
      [productId]: reason,
    }));

    const productName =
      selectedInvoice?.products.find((p) => p.id === productId)?.name || "";

    setQuantityAndReason((prev) => ({
      ...prev,
      [productId]: {
        product: productName,
        quantity: prev[productId]?.quantity || 0,
        reason: reason,
        // Use consistent date string from ref or fallback
        createdAt:
          prev[productId]?.createdAt ||
          reportDateStringRef.current ||
          new Date().toLocaleDateString("fr-FR"),
      },
    }));

    // Clear custom reason if not "Autre"
    if (reason !== "Autre") {
      setCustomReasons((prev) => ({
        ...prev,
        [productId]: "",
      }));
    }
  };

  const handleCustomReasonChange = (
    productId: string,
    customReason: string
  ) => {
    setCustomReasons((prev) => ({
      ...prev,
      [productId]: customReason,
    }));
  };

  const getFinalReason = (productId: string) => {
    const selectedReason = reasons[productId];
    if (selectedReason === "Autre") {
      return customReasons[productId] || "Autre";
    }
    return selectedReason;
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      const promises = Object.entries(stockMovements)
        .map(([productId, quantity]) => {
          const finalReason = getFinalReason(productId);
          if (quantity && finalReason && parseFloat(quantity) > 0) {
            return saveStockMovement(productId, quantity, finalReason);
          }
          return null;
        })
        .filter(Boolean);

      if (promises.length === 0) {
        toast.error("Aucun mouvement de stock à enregistrer");
        return;
      }

      await Promise.all(promises);

      toast.success("stock mouvement enregistré avec succès");
      setStockMovements({});
      setReasons({});
      setCustomReasons({});
      setProductConfirmations({});
      setQuantityAndReason({});

      await fetchInvoice();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement du mouvement de stock");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
        toast.success("Logged out successfully");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getProductImage = (category: string) => {
    switch (category) {
      case "Fruits (فواكه)":
        return "🍎";
      case "Légumes (خضروات)":
        return "🥕";
      case "Viande (لحم)":
        return "🥩";
      case "Boissons (مشروبات)":
        return "🥤";
      case "Céréales (الحبوب)":
        return "🌾";
      case "Produits laitiers (منتجات الألبان)":
        return "🧀";
      case "Produits de nettoyage (مواد التنظيف)":
        return "🧼";
      case "Épices et condiments (التوابل والمنكهات)":
        return "🧂";
      case "Produits en conserve (المعلبات)":
        return "🥫";
      case "Snacks et biscuits (وجبات خفيفة وبسكويت)":
        return "🍪";
      case "Pain et boulangerie (الخبز والمخبوزات)":
        return "🥖";
      case "Gaz (قنينات الغاز)":
        return "🪔";
      case "Huiles et sauces (الزيوت والصلصات)":
        return "🫙";
      case "Autre (أخرى)":
        return "📦";
      case "Tous (الكل)":
        return "🗂️";
      default:
        return "📦";
    }
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 4) return "text-emerald-500";
    if (quality >= 3) return "text-amber-500";
    return "text-red-500";
  };

  const renderStars = (quality: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 transition-colors duration-300 ${
          i < quality ? "fill-amber-400 text-amber-400" : "text-slate-300"
        }`}
      />
    ));
  };

  const handleProductConfirmation = (productId: string) => {
    setProductConfirmations((prev) => ({
      ...prev,
      [productId]: true,
    }));
  };

  const needsConfirmation = (productId: string) => {
    return (
      stockMovements[productId] &&
      reasons[productId] &&
      !productConfirmations[productId]
    );
  };

  const getFinalReasonForPrint = (productId: string) => {
    const selectedReason = quantityAndReason[productId]?.reason;
    if (selectedReason === "Autre") {
      return customReasons[productId] || "Autre";
    }
    return selectedReason;
  };

  const getPrintableData = () => {
    return Object.entries(quantityAndReason)
      .filter(([productId, data]) => data.quantity > 0 && data.reason)
      .map(([productId, data]) => ({
        ...data,
        reason: getFinalReasonForPrint(productId),
        unit:
          selectedInvoice?.products.find((p) => p.id === productId)?.unit ||
          "unités",
      }));
  };

  // global guide for worker section

  const startGuide = async () => {
    const introJs = (await import("intro.js")).default;
    const intro = introJs();

    intro.setOptions({
      steps: [
        {
          element: "#totalInvo",
          intro:
            "📑 هذا الرقم يُمثل **إجمالي عدد الفواتير** الموجودة في المخزون اليوم. كل فاتورة تحتوي على مجموعة من المنتجات التي يمكنك إدارتها.",
        },
        {
          element: "#activeProduct",
          intro:
            "📦 هنا ستجد **عدد المنتجات النشطة** الموجودة داخل الفاتورة التي اخترتها حاليًا. هذا يساعدك على معرفة حجم المخزون المتعلق بتلك الفاتورة بالتحديد.",
        },
        {
          element: "#operations",
          intro:
            "⏳ هنا يتم عرض **عدد العمليات التي قمت بها ولكن لم تحفظها بعد**. مثلًا: إذا خصمت 2 كغ من الطماطم و3 كغ من البطاطس ولم تضغط على زر الحفظ، فستظهر هنا حتى تقوم بالحفظ.",
        },
        {
          element: "#actions",
          intro:
            "⚠️ في هذه المنطقة ستقوم بالإجراءات النهائية: بعد اختيار الكميات وتحديد الأسباب، سيظهر لك زر تأكيد لكل منتج. بعد التأكيد يمكنك **طباعة التقرير** لعرض المنتجات التي تم إخراجها من المخزون. تذكر: بعد الطباعة يجب الضغط على زر الحفظ لإرسال البيانات إلى قاعدة البيانات، وعندها لن يكون بالإمكان طباعة نفس الفاتورة مرة أخرى لأنها أصبحت مُعالجة.",
        },
        {
          element: "#choseInvo",
          intro:
            "📋 لكي يتمكن العامل من طباعة تقرير يحتوي على جميع العمليات (الإخراجات) التي قام بها، يجب اتباع الخطوات التالية:\n\n" +
            "1️⃣ فتح الفاتورة التي تحتوي على المنتج المطلوب.\n" +
            "2️⃣ إدخال الكمية التي تم استهلاكها.\n" +
            "3️⃣ اختيار سبب الاستهلاك من القائمة.\n" +
            "4️⃣ الضغط على زر **تأكيد** للتأكد من صحة البيانات.\n" +
            "5️⃣ بعد ذلك يمكنه طباعة التقرير.\n\n" +
            "⚠️ ملاحظة مهمة: إذا قام العامل بحفظ البيانات قبل الطباعة، فإن التقرير سيكون فارغًا. لذلك يجب طباعة التقرير أولاً ثم حفظ البيانات.",
        },
      ],
      showProgress: true,
      showButtons: true,
      nextLabel: "التالي",
      prevLabel: "السابق",
      skipLabel: "تخطي",
      doneLabel: "إنهاء",
    });

    intro.start();
    setTimeout(() => {
      intro.start();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="sticky bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 overflow-hidden shadow-2xl">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-blue-500 via-purple-900 to-blue-500 p-2 rounded-2xl shadow-lg">
                  <Package className="h-13 w-13 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-50 to-slate-200 bg-clip-text text-transparent">
                  Gestion de Stock
                </h1>
                <p className="text-slate-100">Tableau de Bord Employé</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="py-3 px-5 bg-gradient-to-l text-xl text-white font-bold cursor-pointer hover:animate-bounce from-blue-300 to-purple-500 rounded-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  startGuide();
                }}
              >
                Guide
              </button>
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20 shadow-sm">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-bounce">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-slate-700 font-semibold">
                  Hello{" "}
                  <span className="text-xl bg-gradient-to-l from-lime-900 via-lime-700 to-lime-900 bg-clip-text text-transparent font-extrabold">
                    {workerName.toUpperCase()}
                  </span>
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="group flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-2xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-red-500/25 hover:scale-105"
              >
                <LogOut className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Worker Dashboard Information Section */}
      <div className="lg:col-span-3 mb-8">
        <div className="bg-white/90 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden">
          {/* Stats Grid */}
          <div className="bg-gradient-to-b from-slate-50 to-white p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Invoices */}
              <div
                id="totalInvo"
                className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800">
                      {invoices.length}
                    </div>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-slate-700 mb-1">
                  Factures Totales
                </h3>
                <p className="text-xs text-slate-500">
                  Factures disponibles aujourd'hui
                </p>
              </div>

              {/* Active Products */}
              <div
                id="activeProduct"
                className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Package className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800">
                      {selectedInvoice ? selectedInvoice.products.length : 0}
                    </div>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-slate-700 mb-1">
                  Produits Actifs
                </h3>
                <p className="text-xs text-slate-500">
                  Produits dans la facture sélectionnée
                </p>
              </div>

              {/* Pending Operations */}
              <div
                id="operations"
                className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800">
                      {Object.keys(stockMovements).length}
                    </div>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-slate-700 mb-1">
                  Opérations en Attente
                </h3>
                <p className="text-xs text-slate-500">
                  Mouvements de stock à confirmer
                </p>
              </div>

              {/* Status */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      Actif
                    </div>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-slate-700 mb-1">
                  Statut Session
                </h3>
                <p className="text-xs text-slate-500">
                  Connecté et opérationnel
                </p>
              </div>
            </div>

            {/* Quick Actions & Information */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <div
                id="actions"
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-500 rounded-lg mr-3">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Actions Rapides
                  </h3>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleSaveChanges}
                    className="w-full flex items-center justify-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Enregistrer Tous les Changements
                  </button>
                  <button
                    className="w-full flex items-center justify-center px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors duration-200"
                    onClick={handlePrint}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger Rapport
                  </button>
                </div>
              </div>

              {/* Session Information - FIXED */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-5">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-purple-500 rounded-lg mr-3">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Informations Session
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Employé:</span>
                    <span className="text-sm font-semibold text-slate-800">
                      {workerName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Date:</span>
                    <span
                      className="text-sm font-semibold text-slate-800"
                      suppressHydrationWarning
                    >
                      {isClientMounted
                        ? reportTimestamp.toLocaleDateString("fr-FR")
                        : "--/--/----"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Heure:</span>
                    <span
                      className="text-sm font-semibold text-slate-800"
                      suppressHydrationWarning
                    >
                      {isClientMounted
                        ? reportTimestamp.toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--:--"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Statut:</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-sm font-semibold text-green-600">
                        En ligne
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="choseInvo" className="max-w-full mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Invoice List */}
          <div className="lg:col-span-1 h-full">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/10 rounded-xl">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-xl">
                        Registre des Factures
                      </h2>
                      <p className="text-slate-300 text-sm">
                        Gérez vos enregistrements d'inventaire
                      </p>
                    </div>
                  </div>
                  <div className="bg-blue-500/20 px-3 py-1 rounded-full">
                    <span className="text-blue-100 font-semibold text-sm">
                      {invoices.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Search Section */}
              <div className="bg-gradient-to-b from-slate-50 to-white p-4 border-b border-slate-100">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Invoice List */}
              <div className="max-h-96 overflow-y-auto bg-gradient-to-b from-slate-50 to-white">
                {filteredInvoices.map((invoice, index) => (
                  <div
                    key={`${invoice.id}_${index}`}
                    onClick={() => setSelectedInvoice(invoice)}
                    className={`cursor-pointer transition-all duration-300 border-b border-slate-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 ${
                      selectedInvoice?.id === invoice.id
                        ? "bg-gradient-to-r from-blue-100 to-indigo-100 border-l-4 border-l-blue-500 shadow-md"
                        : ""
                    }`}
                  >
                    <div className="p-5">
                      {/* Invoice Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm ${
                              selectedInvoice?.id === invoice.id
                                ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                                : "bg-gradient-to-r from-slate-400 to-slate-500"
                            }`}
                          >
                            #{index + 1}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-800 leading-tight">
                              {invoice.name}
                            </h3>
                            <p className="text-xs text-slate-500 font-mono">
                              ID: {invoice.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="bg-slate-100 px-2 py-1 rounded-lg">
                            <span className="text-xs font-medium text-slate-600">
                              {invoice.products.length} Produits
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Invoice Metadata */}
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{invoice.date}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <BarChart3 className="h-3 w-3" />
                            <span>Active</span>
                          </span>
                        </div>
                        {selectedInvoice?.id === invoice.id && (
                          <div className="flex items-center space-x-1 text-blue-600">
                            <Eye className="h-3 w-3" />
                            <span className="font-medium">Visualisation</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Product Details */}
          <div className="lg:col-span-2">
            {selectedInvoice ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/10 rounded-xl">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-white font-bold text-xl">
                          {selectedInvoice.name}
                        </h2>
                        <p className="text-slate-300 text-sm">
                          Facture: {selectedInvoice.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleSaveChanges}
                      className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-300"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Tout Enregistrer
                    </button>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="bg-gradient-to-b from-slate-50 to-white p-4 border-b border-slate-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-3">
                      <div className="text-slate-600 text-sm">Date</div>
                      <div className="font-semibold text-slate-800">
                        {selectedInvoice.date}
                      </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-3">
                      <div className="text-slate-600 text-sm">
                        Produits Totaux
                      </div>
                      <div className="font-semibold text-slate-800">
                        {selectedInvoice.products.length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products List */}
                <div className="bg-gradient-to-b from-slate-50 to-white">
                  <div className="p-6">
                    <div className="flex flex-col my-3">
                      <div className="flex">
                        <div className="p-3 bg-gradient-to-b from-indigo-700 via-indigo-500 to-blue-400 mr-1 rounded-xl">
                          <Package2Icon className="text-white w-8 h-8 animate-pulse" />
                        </div>
                        <h3 className="text-3xl flex items-center font-bold bg-gradient-to-r from-blue-900 via-blue-500 rounded-xl to-indigo-700 bg-clip-text text-transparent">
                          Produits:
                        </h3>
                      </div>
                      <div className="h-1 w-15 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mt-2 mb-6"></div>
                    </div>

                    <div className="space-y-4">
                      {selectedInvoice.products.map((product, index) => (
                        <div
                          key={product.id}
                          className="bg-white border border-slate-200 rounded-xl p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                            {/* Product Info */}
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center text-3xl border-2 border-blue-200">
                                {getProductImage(product.category)}
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-800 text-lg">
                                  {product.name}
                                </h4>
                                <div className="text-sm text-slate-500 space-y-1">
                                  <p>
                                    Courant:{" "}
                                    <span className="text-blue-600 font-semibold">
                                      {product.currentStock}
                                    </span>{" "}
                                    {product.unit}
                                  </p>
                                  <p>
                                    Initial: {product.initialStock}{" "}
                                    {product.unit}
                                  </p>
                                  <div className="flex items-center space-x-1">
                                    <span>Qualité:</span>
                                    <div className="flex items-center space-x-1">
                                      {renderStars(product.quality)}
                                      <span
                                        className={`font-medium ${getQualityColor(
                                          product.quality
                                        )}`}
                                      >
                                        {product.quality}/5
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Quantity Input */}
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Quantité à Prendre
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300"
                                  placeholder="0"
                                  min="0"
                                  max={product.currentStock}
                                  value={stockMovements[product.id] || ""}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      product.id,
                                      e.target.value
                                    )
                                  }
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">
                                  {product.unit}
                                </span>
                              </div>
                              {stockMovements[product.id] &&
                                stockMovements[product.id] >
                                  product.currentStock && (
                                  <p className="text-red-600 text-xs mt-1 flex items-center">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Dépasse le stock actuel
                                  </p>
                                )}
                            </div>

                            {/* Reason Section */}
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Raison
                              </label>
                              <select
                                className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300"
                                value={reasons[product.id] || ""}
                                onChange={(e) =>
                                  handleReasonChange(product.id, e.target.value)
                                }
                              >
                                <option value="">
                                  Sélectionner une raison
                                </option>
                                <option value="Préparation-des-repas">
                                  Préparation des repas
                                </option>
                                <option value="Services-de-nettoyage">
                                  Services de nettoyage
                                </option>
                                <option value="Utilisation-a-les-équipements-et-ustensiles-de-cuisine">
                                  Utilisation a les équipements et ustensiles de
                                  cuisine
                                </option>
                                <option value="Approvisionnement-pour-le-dortoir">
                                  Approvisionnement pour le dortoir
                                </option>
                                <option value="Autre">Autre</option>
                              </select>
                              {reasons[product.id] === "Autre" && (
                                <input
                                  type="text"
                                  className="w-full mt-2 p-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
                                  placeholder="Spécifier la raison..."
                                  value={customReasons[product.id] || ""}
                                  onChange={(e) =>
                                    handleCustomReasonChange(
                                      product.id,
                                      e.target.value
                                    )
                                  }
                                />
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col space-y-2">
                              <button
                                onClick={() => handleSaveChanges()}
                                disabled={
                                  !stockMovements[product.id] ||
                                  !reasons[product.id] ||
                                  needsConfirmation(product.id)
                                }
                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Enregistrer
                              </button>
                              <button className="w-full bg-slate-100 text-slate-700 py-2 px-4 rounded-xl hover:bg-slate-200 transition-all duration-300 border border-slate-200">
                                Ignorer
                              </button>
                            </div>
                          </div>
                          {stockMovements[product.id] &&
                            reasons[product.id] && (
                              <div className="w-full bg-white shadow-lg border border-gray-200 rounded-2xl mt-8 p-6 hover:shadow-xl transition-shadow duration-300">
                                {/* Header Section */}
                                <div className="flex items-center mb-6">
                                  <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-xl p-2 mr-2 shadow-md">
                                    <ListRestart className="w-6 h-6 text-white" />
                                  </div>
                                  <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 via-purple-600 to-blue-500 bg-clip-text text-transparent">
                                    Opération Effectuée
                                  </h2>
                                </div>

                                {/* Live Confirmation Notification */}
                                {needsConfirmation(product.id) && (
                                  <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-lg shadow-sm animate-pulse">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0">
                                        <div className="w-3 h-3 bg-amber-400 rounded-full animate-ping mr-3"></div>
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-amber-800 font-semibold text-lg">
                                          ⚠️ Êtes-vous sûr des quantités saisies
                                          ?
                                        </p>
                                        <p className="text-amber-700 text-sm mt-1">
                                          Veuillez vérifier les informations
                                          avant de confirmer l'opération
                                        </p>
                                      </div>
                                      <div className="ml-4 flex space-x-2">
                                        <button
                                          className="px-4 py-2 bg-green-500 cursor-pointer hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                          onClick={() =>
                                            handleProductConfirmation(
                                              product.id
                                            )
                                          }
                                        >
                                          Confirmer
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Content Grid */}
                                <div className="space-y-6">
                                  {/* Quantity Section */}
                                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-l-4 border-indigo-500">
                                    <div className="flex-1">
                                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                        Quantité à Consommer
                                      </h3>
                                      <div className="w-full h-0.5 bg-gradient-to-r from-indigo-500 to-transparent"></div>
                                    </div>
                                    <div className="ml-6 text-right">
                                      <p className="text-2xl font-bold text-indigo-700">
                                        {stockMovements[product.id]}
                                        <span className="text-sm font-medium text-gray-600 ml-1">
                                          {product.unit}
                                        </span>
                                      </p>
                                    </div>
                                  </div>

                                  {/* Reason Section */}
                                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border-l-4 border-purple-500">
                                    <div className="flex-1">
                                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                        Raison de Consommation
                                      </h3>
                                      <div className="w-full h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></div>
                                    </div>
                                    <div className="ml-6 text-right">
                                      <p className="text-xl font-bold text-purple-700 capitalize">
                                        {reasons[product.id]}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>

                    {/* Bulk Actions */}
                    <div className="mt-6 p-4 bg-slate-100 rounded-xl border border-slate-200">
                      <h4 className="font-semibold text-slate-800 mb-3">
                        Actions Groupées
                      </h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveChanges}
                          className="bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all duration-300 flex items-center"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Enregistrer Toutes les Modifications
                        </button>
                        <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300">
                          Marquer la Facture comme Terminée
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                        Choisissez une facture dans le panneau de registre pour
                        afficher les informations détaillées des produits et
                        gérer votre inventaire.
                      </p>

                      {/* Status indicator */}
                      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-blue-700 text-sm font-medium">
                          💡 Astuce : Cliquez sur une facture pour explorer son
                          contenu.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        ref={printRef}
        className="hidden print:block print:p-8 print:bg-white"
      >
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            RAPPORT D'UTILISATION DES PRODUITS
          </h1>
          <div className="text-gray-700 space-y-1">
            <p className="text-lg">
              Facture:{" "}
              <span className="font-semibold">{selectedInvoice?.name}</span>
            </p>
            <p suppressHydrationWarning>
              Date:{" "}
              <span className="font-medium">
                {isClientMounted
                  ? reportTimestamp.toLocaleDateString("fr-FR")
                  : "--/--/----"}
              </span>
            </p>
            <p>
              Employé: <span className="font-medium">{workerName}</span>
            </p>
            <p className="text-sm text-gray-500">
              ID Facture: {selectedInvoice?.id}
            </p>
          </div>
        </div>

        {/* Products Table */}
        {getPrintableData().length > 0 ? (
          <div className="mb-8">
            <table className="w-full border-collapse border-2 border-gray-800">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-600 p-3 text-left font-bold">
                    #
                  </th>
                  <th className="border border-gray-600 p-3 text-left font-bold">
                    Produit
                  </th>
                  <th className="border border-gray-600 p-3 text-center font-bold">
                    Quantité
                  </th>
                  <th className="border border-gray-600 p-3 text-left font-bold">
                    Raison d'utilisation
                  </th>
                  <th className="border border-gray-600 p-3 text-center font-bold">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {getPrintableData().map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="border border-gray-400 p-3 text-center font-medium">
                      {index + 1}
                    </td>
                    <td className="border border-gray-400 p-3 font-medium">
                      {item.product}
                    </td>
                    <td className="border border-gray-400 p-3 text-center">
                      <span className="font-semibold">{item.quantity}</span>{" "}
                      {item.unit}
                    </td>
                    <td className="border border-gray-400 p-3">
                      {item.reason}
                    </td>
                    <td
                      className="border border-gray-400 p-3 text-center"
                      suppressHydrationWarning
                    >
                      {item.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-600 py-12 border border-gray-300 rounded">
            <p className="text-lg">Aucun produit utilisé à imprimer</p>
            <p className="text-sm mt-2">
              Veuillez sélectionner des produits et spécifier les quantités
              utilisées.
            </p>
          </div>
        )}

        {/* Summary Section */}
        <div className="bg-gray-100 p-4 rounded border border-gray-400 mb-6">
          <h3 className="font-bold text-lg mb-2">Résumé:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <span className="font-medium">Total produits utilisés:</span>{" "}
                {getPrintableData().length}
              </p>
              <p>
                <span className="font-medium">Facture traitée:</span>{" "}
                {selectedInvoice?.name || "N/A"}
              </p>
            </div>
            <div suppressHydrationWarning>
              <p>
                <span className="font-medium">Date du rapport:</span>{" "}
                {isClientMounted
                  ? reportTimestamp.toLocaleDateString("fr-FR")
                  : "--/--/----"}
              </p>
              <p>
                <span className="font-medium">Heure:</span>{" "}
                {isClientMounted
                  ? reportTimestamp.toLocaleTimeString("fr-FR")
                  : "--:--"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-800 pt-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              <p>Système de Gestion de Stock</p>
              <p>Employé: {workerName}</p>
            </div>
            <div className="text-right" suppressHydrationWarning>
              <p>Généré automatiquement</p>
              <p>
                Le:{" "}
                {isClientMounted
                  ? reportTimestamp.toLocaleString("fr-FR")
                  : "Loading..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerStockWorkspace;
