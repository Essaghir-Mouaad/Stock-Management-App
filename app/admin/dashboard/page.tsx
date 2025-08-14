"use client";

import {
  BarChart3,
  LogOut,
  Package,
  Receipt,
  TrendingUp,
  Menu,
  X,
  LucideHome,
  ListStartIcon,
  BadgeIcon,
  Play,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Analysis from "@/app/admin/dashboard/components/analytics/Analysis";
import TrackProducts from "@/app/admin/dashboard/components/tracking/TrackProducts";
import SetProductData from "@/app/admin/dashboard/components/init/SetProductData";
import DashboardHome from "@/app/admin/dashboard/components/home/DashboardHome";
import CurrentInvoice from "@/app/admin/dashboard/components/RestOfStock/CurrentInvoice";

import dynamic from "next/dynamic";
import "intro.js/introjs.css";

const Steps = dynamic(() => import("intro.js-react").then((mod) => mod.Steps), {
  ssr: false,
});

const page = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <DashboardHome />;
      case "analysis":
        return <Analysis />;
      case "track":
        return <TrackProducts />;
      case "set-data":
        return <SetProductData />;
      case "invoice":
        return <CurrentInvoice />;
      default:
        return <DashboardHome />;
    }
  };

  //global gide
  const startGuide = async () => {
    const introJs = (await import("intro.js")).default;
    const intro = introJs();

    intro.setOptions({
      steps: [
        {
          element: "#acceuilBtn",
          intro:
            "🏠 هذا هو زر «الصفحة الرئيسية». عند فتحه ستظهر لوحة التحكم العامة التي تحتوي على أحدث بيانات التسجيل، الأداء العام، ومعلومات شاملة حول النظام.",
        },
        {
          element: "#productBtn",
          intro:
            "📦 هذا هو زر «المنتجات». يمكنك من خلاله إدخال الكميات الأولية للمخزون الكامل بناءً على الشحنات الواردة في كل فترة.",
        },
        {
          element: "#suiviBtn",
          intro:
            "📋 هذا هو زر «المتابعة اليومية». يتيح لك تتبع الاستهلاك ومعرفة تفاصيل المخزون لكل منتج على حدة.",
        },
        {
          element: "#staticBtn",
          intro:
            "📊 هذا هو زر «الإحصائيات». يعرض لك بيانات وتحليلات المخزون بشكل أسبوعي، يومي أو شهري.",
        },
        {
          element: "#getCurrentBtn",
          intro:
            "📄 هذا هو زر «المخزون الحالي». يتيح لك عرض وطباعة القيمة الحالية للمخزون على شكل ملف PDF.",
        },
        {
          element: "#mainSection",
          intro:
            "🖥 هنا ستظهر التفاصيل والمحتوى الخاص بكل صفحة. يمكنك أيضًا عرض دليل مخصص لكل قسم من هذه المنطقة.",
        },
      ],
    });

    intro.start();
  };

  // Accueil Guide
  const startGuideForAcceuil = async () => {
    if (activeTab !== "home") {
      setActiveTab("home");
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    const introJs = (await import("intro.js")).default;
    const intro = introJs();

    intro.setOptions({
      // helperElementPadding: 12,
      steps: [
        {
          element: "#bell",
          intro:
            "🔔 هذه الأيقونة تعرض لك عدد المنتجات التي انخفض مخزونها عن الحد الأدنى، لتنبيهك لإعادة التزويد.",
        },
        {
          element: "#registration",
          intro:
            "📦 هذا القسم يعرض جميع معلومات الفواتير الخاصة بالمنتجات التي تم إنشاؤها في قسم المنتجات، بالإضافة إلى إحصائيات إضافية مثل آخر عمليات الإدخال والإخراج.",
        },
        {
          element: "#performance",
          intro:
            "📊 هذا القسم يعرض أداء المنتجات حسب الفئة، مع ترتيبها بناءً على عدد الحركات أو العمليات.",
        },
        {
          element: "#pricing",
          intro:
            "💰 هذا القسم يمنحك نظرة واضحة على قيمة المخزون لكل فاتورة منتج، مع عرض الفرق بين المخزون الأولي والمخزون الحالي.",
        },
      ],
    });

    intro.start();
  };

  //products guide

  const startGuideForProducts = async () => {
    if (activeTab !== "set-data") {
      setActiveTab("set-data");
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    const introJs = (await import("intro.js")).default;
    const intro = introJs();

    intro.setOptions({
      steps: [
        {
          element: "#info",
          intro:
            "📦 من الأفضل تنظيم هذا القسم عن طريق إنشاء فواتير ثابتة مثل (الخضروات، الفواكه، ...). هذه الفواتير تبقى موجودة في النظام بشكل دائم ولا تُحذف. إذا انتهت صلاحية المخزون لأي فاتورة، كل ما عليك هو تحديث محتواها طوال دورة حياة التطبيق.",
        },
        {
          element: "#create",
          intro:
            "➕ هذا الزر يسمح لك بإنشاء فاتورة جديدة فارغة، يمكنك بعدها إضافة المنتجات والكميات إليها.",
        },
      ],
    });

    intro.start();
  };

  const startGuideForTracking = async () => {
    if (activeTab !== "track") {
      setActiveTab("track");
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    const introJs = (await import("intro.js")).default;
    const intro = introJs();

    intro.setOptions({
      steps: [
        {
          element: "#trackInfo",
          intro:
            "📦 في هذا القسم يمكنك متابعة كل فاتورة على حدة ومعرفة جميع التفاصيل المرتبطة بها. " +
            "ستجد المخزون الحالي لكل منتج، وسعر الوحدة، بالإضافة إلى تقييم الأداء وجودة المنتج بناءً على بيانات الاستهلاك. " +
            "كما يمكنك الاطلاع على المخزون الابتدائي الذي تم إدخاله عند إنشاء الفاتورة، " +
            "ومراجعة المتوسط العام لجميع البيانات الخاصة بتلك الفاتورة، مما يمنحك رؤية دقيقة وشاملة. " +
            "هذه المعلومات تساعدك على تتبّع حركة المنتجات بدقة واتخاذ قرارات سريعة إذا لاحظت تغيّرات في السعر أو الكمية أو التقييم.",
        },
      ],
    });

    intro.start();
  };

const startGuideForStatistics = async () => {
  if (activeTab !== "analysis") {
    setActiveTab("analysis");
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  const introJs = (await import("intro.js")).default;
  const intro = introJs();

  intro.setOptions({
    steps: [
      {
        element: "#yearBtn",
        intro: "اختر السنة التي تريد عرض التحليلات الخاصة بها لمتابعة الأداء السنوي للمخزون."
      },

      {
        element: "#monthBtn",
        intro: "اختر الشهر الذي تريد معرفة تحليلاته، لتتمكن من عرض بيانات المخزون الشهرية بدقة."
      },
      {
        element: "#stockValueBtn",
        intro: "يمكنك عرض القيمة الإجمالية للمخزون في تقرير الطباعة سواء كان يوميًا أو شهريًا، لمتابعة الوضع المالي للمخزون."
      },
      {
        element: "#dayBtn",
        intro: "اختر اليوم الذي تريد معرفة التحليلات اليومية الخاصة بالمخزون لكل منتج."
      },
      {
        element: "#numberOfStudentBtn",
        intro: "هذا الزر مهم جدًا لحساب الاستهلاك لكل طالب عند طباعة التقرير السنوي، فهو يحدد الأساس الذي يُحسب عليه الاستهلاك."
      },
      {
        element: "#printBtn",
        intro: "زر الطباعة سيكون معطلًا إذا كان عدد الطلاب يساوي صفر أو واحد لضمان صحة الحسابات في التقرير."
      },{
        element: "#globalVue",
        intro: "يعرض هذا القسم رؤية شاملة لجميع المنتجات والفئات، لتقييم الأداء العام للمخزون."
      },
      {
        element: "#dailyVue",
        intro: "يعرض هذا القسم الأداء اليومي للمنتجات والفئات لمتابعة حركة المخزون يوميًا."
      },
      {
        element: "#monthlyVue",
        intro: "يعرض هذا القسم الأداء الشهري للمنتجات والفئات لمتابعة الاتجاهات على مدى الشهر."
      },
      {
        element: "#categoryVue",
        intro: "يعرض هذا القسم الأداء حسب الفئات المختلفة، مما يتيح لك معرفة أكثر الفئات نشاطًا وربحية."
      },
      {
        element: "#numberOfProducts",
        intro: "يعرض هذا القسم العدد الإجمالي للمنتجات الموجودة في المخزون بالكامل."
      },
      {
        element: "#valueTotal",
        intro: "يعرض هذا القسم القيمة الإجمالية لمخزون المنتجات، ويتم تحديثه تلقائيًا بعد أي عملية إدخال أو إخراج."
      },
      {
        element: "#underStock",
        intro: "يعرض هذا القسم عدد المنتجات التي وصل مخزونها إلى الحد الأدنى، لتنبيهك بإعادة التزويد سريعًا."
      },
      {
        element: "#highStock",
        intro: "يعرض هذا القسم أفضل الفئات أداءً من حيث الحركة والبيع، لمساعدتك على اتخاذ القرارات المناسبة."
      },
    ]
  });

  intro.start();
};


  return (
    <>
      <header className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 overflow-hidden shadow-2xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating orbs */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -top-5 right-1/4 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-pulse animation-delay-2000"></div>

          {/* Mesh gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-800/50 via-transparent to-pink-800/30"></div>

          {/* Geometric pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="grid"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Glass morphism overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

        <div className="relative px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Left side - Brand and Navigation */}
            <div className="flex items-center space-x-8">
              {/* Brand Section */}
              <div className="flex items-center space-x-4 group">
                {/* Logo Container */}
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Package className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-300" />

                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/30 to-purple-400/30 blur-xl group-hover:blur-2xl transition-all duration-300 -z-10"></div>
                  </div>

                  {/* Floating indicator */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                </div>

                {/* Brand Text */}
                <div className="space-y-1">
                  <h1 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-none">
                    AvenirTubkal
                  </h1>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-white/70 text-sm font-medium">
                      Gestion du tableau de bord
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats (Optional Enhancement) */}
              <div className="hidden lg:flex items-center space-x-6 ml-8">
                <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/80 text-sm font-medium">
                    Système actif
                  </span>
                </div>

                <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-white/80 text-sm font-medium">
                    Bonne performance
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-4">
              <button
                className="px-4 py-3 flex items-center rounded-xl cursor-pointer text-white font-semibold bg-gradient-to-b from-blue-300 to-purple-400"
                onClick={startGuide}
              >
                <ListStartIcon className="w-6 h-6 mr-2 animate-pulse" />
                Guide
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="group relative overflow-hidden bg-gradient-to-r from-red-500/90 to-rose-500/90 backdrop-blur-sm hover:from-red-500 hover:to-rose-500 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-xl hover:shadow-red-500/25 hover:scale-105 transform border border-red-400/30"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Button content */}
                <div className="relative flex items-center space-x-2 z-10">
                  <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-semibold">Déconnexion</span>
                </div>

                {/* Ripple effect */}
                <div className="absolute inset-0 bg-white/20 scale-0 group-active:scale-100 rounded-xl transition-transform duration-200"></div>

                {/* Shine effect */}
                <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] group-hover:animate-shine"></div>
              </button>
            </div>
          </div>

          {/* Bottom accent line with animated gradient */}
          <div className="mt-6 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-50 animate-pulse"></div>
          </div>
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes shine {
            0% {
              left: -100%;
            }
            100% {
              left: 100%;
            }
          }
          .animate-shine {
            animation: shine 0.6s ease-in-out;
          }
          .animation-delay-1000 {
            animation-delay: 1s;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
        `}</style>
      </header>
      <button
        onClick={toggleSidebar}
        className="btn btn-ghost btn-sm hover:bg-base-200 transition-all duration-200 mt-4 animate-pulse"
        title={
          sidebarCollapsed
            ? " Agrandir la barre latérale"
            : "Réduire la barre latérale"
        }
      >
        {sidebarCollapsed ? (
          <Menu className="w-5 h-5 text-base-content" />
        ) : (
          <X className="w-5 h-5 text-base-content" />
        )}
      </button>

      <div className="flex gap-4 h-screen p-4">
        <aside
          className={`flex flex-col justify-between p-3 lg:p-4 rounded-2xl border border-accent shadow-md h-fit md:h-full transition-all duration-300 ease-in-out ${
            sidebarCollapsed
              ? "w-0 opacity-0 pointer-events-none -translate-x-4"
              : "w-16 lg:w-64 opacity-100 translate-x-0"
          }`}
        >
          <nav className="flex flex-col gap-3">
            <button
              id="acceuilBtn"
              className={`group flex items-center justify-between gap-3 py-4 px-3 lg:px-4 rounded-xl font-semibold cursor-pointer transition-all duration-200 ${
                activeTab === "home"
                  ? "bg-primary text-primary-content shadow-lg"
                  : "bg-base-200 text-base-content hover:bg-primary/10 hover:text-primary hover:shadow-md hover:scale-[1.02]"
              }`}
              onClick={() => setActiveTab("home")}
            >
              <div className="flex items-center ">
                <LucideHome className="w-5 h-5 mr-2" />
                <span className="hidden lg:block text-left font-medium">
                  Accueil
                </span>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  startGuideForAcceuil();
                }}
                title="Commancer le guide"
              >
                <Play className="w-5 h-5 hover:text-black" />
              </div>
            </button>

            <button
              id="productBtn"
              className={`group flex items-center justify-between gap-3 py-3 px-3 lg:px-4 rounded-xl font-semibold cursor-pointer transition-all duration-200 ${
                activeTab === "set-data"
                  ? "bg-primary text-primary-content shadow-lg"
                  : "bg-base-200 text-base-content hover:bg-primary/10 hover:text-primary hover:shadow-md hover:scale-[1.02]"
              }`}
              onClick={() => setActiveTab("set-data")}
            >
              <div className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                <span className="hidden lg:block text-left font-medium">
                  Produits
                </span>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation(), startGuideForProducts();
                }}
                title="Commancer le guide"
              >
                <Play className="w-5 h-5 hover:text-black" />
              </div>
            </button>

            <button
              id="suiviBtn"
              className={`group flex items-center justify-between gap-3 py-3 px-3 lg:px-4 rounded-xl font-semibold cursor-pointer transition-all duration-200 ${
                activeTab === "track"
                  ? "bg-primary text-primary-content shadow-lg"
                  : "bg-base-200 text-base-content hover:bg-primary/10 hover:text-primary hover:shadow-md hover:scale-[1.02]"
              }`}
              onClick={() => setActiveTab("track")}
            >
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                <span className="hidden lg:block text-left font-medium">
                  Suivi quotidien
                </span>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation(), startGuideForTracking();
                }}
                title="Commancer le guide"
              >
                <Play className="w-5 h-5 hover:text-black" />
              </div>
            </button>

            <button
              id="staticBtn"
              className={`group flex items-center justify-between gap-3 py-3 px-3 lg:px-4 rounded-xl font-semibold cursor-pointer transition-all duration-200 ${
                activeTab === "analysis"
                  ? "bg-primary text-primary-content shadow-lg"
                  : "bg-base-200 text-base-content hover:bg-primary/10 hover:text-primary hover:shadow-md hover:scale-[1.02]"
              }`}
              onClick={() => setActiveTab("analysis")}
            >
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                <span className="hidden lg:block text-left font-medium">
                  Statistiques
                </span>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  startGuideForStatistics();
                }}
                title="Commancer le guide"
              >
                <Play className="w-5 h-5 hover:text-black" />
              </div>
            </button>

            <button
              id="getCurrentBtn"
              className={`group flex items-center justify-center lg:justify-start gap-3 py-3 px-3 lg:px-4 rounded-xl font-semibold cursor-pointer transition-all duration-200 ${
                activeTab === "invoice"
                  ? "bg-primary text-primary-content shadow-lg"
                  : "bg-base-200 text-base-content hover:bg-primary/10 hover:text-primary hover:shadow-md hover:scale-[1.02]"
              }`}
              onClick={() => setActiveTab("invoice")}
            >
              <Receipt className="w-5 h-5 flex-shrink-0" />
              <span className="hidden lg:block text-left font-medium">
                Etat de Stock(PDF)
              </span>
            </button>
          </nav>
        </aside>

        <main
          id="mainSection"
          className={`flex-1 border border-accent rounded-2xl p-6 shadow-inner overflow-auto transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? "ml-0" : ""
          }`}
        >
          {renderContent()}
        </main>
      </div>
    </>
  );
};

export default page;
