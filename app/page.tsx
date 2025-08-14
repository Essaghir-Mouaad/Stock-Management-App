"use client";
import React, { useEffect, useRef } from "react";
import {
  LogIn,
  UserPlus,
  Mountain,
  ListTodo,
  TrendingUp,
  BarChart3,
  Activity,
  MountainSnow,
  Route,
  Github,
  Linkedin,
  Send,
  ChevronRight,
  Mail,
  Phone,
  Facebook,
  Twitter,
} from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
// Note: OrbitControls from drei is not available, using basic manual controls
import { OrbitControls } from "@react-three/drei";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Animated Background Component
const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particles for floating elements
    type Particle = {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    };
    const particles: Particle[] = [];
    const numParticles = 80;

    // Chart-like moving elements
    type ChartElement = {
      x: number;
      y: number;
      size: number;
      rotation: number;
      rotationSpeed: number;
      speedX: number;
      speedY: number;
      type: number;
      opacity: number;
    };
    const charts: ChartElement[] = [];
    const numCharts = 12;

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    // Initialize chart elements
    for (let i = 0; i < numCharts; i++) {
      charts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 40 + 20,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        type: Math.floor(Math.random() * 3), // 0: circle, 1: triangle, 2: square
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    // Grid lines
    const drawGrid = () => {
      ctx.strokeStyle = "rgba(59, 130, 246, 0.1)";
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = 0; x < canvas.width; x += 100) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 100) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    // Draw moving chart lines
    let time = 0;
    const drawAnalyticsLines = () => {
      ctx.strokeStyle = "rgba(59, 130, 246, 0.2)";
      ctx.lineWidth = 2;

      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const startY = (canvas.height / 6) * (i + 1);

        for (let x = 0; x < canvas.width; x += 20) {
          const y = startY + Math.sin(x * 0.01 + time * 0.02 + i * 0.5) * 30;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background elements
      drawGrid();
      drawAnalyticsLines();

      // Animate particles
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Animate chart elements
      charts.forEach((chart) => {
        chart.x += chart.speedX;
        chart.y += chart.speedY;
        chart.rotation += chart.rotationSpeed;

        if (chart.x < -50) chart.x = canvas.width + 50;
        if (chart.x > canvas.width + 50) chart.x = -50;
        if (chart.y < -50) chart.y = canvas.height + 50;
        if (chart.y > canvas.height + 50) chart.y = -50;

        ctx.save();
        ctx.translate(chart.x, chart.y);
        ctx.rotate(chart.rotation);
        ctx.fillStyle = `rgba(147, 51, 234, ${chart.opacity})`;
        ctx.strokeStyle = `rgba(147, 51, 234, ${chart.opacity * 2})`;
        ctx.lineWidth = 1;

        if (chart.type === 0) {
          // Circle
          ctx.beginPath();
          ctx.arc(0, 0, chart.size / 2, 0, Math.PI * 2);
          ctx.stroke();
        } else if (chart.type === 1) {
          // Triangle
          ctx.beginPath();
          ctx.moveTo(0, -chart.size / 2);
          ctx.lineTo(-chart.size / 2, chart.size / 2);
          ctx.lineTo(chart.size / 2, chart.size / 2);
          ctx.closePath();
          ctx.stroke();
        } else {
          // Square
          ctx.strokeRect(
            -chart.size / 2,
            -chart.size / 2,
            chart.size,
            chart.size
          );
        }

        ctx.restore();
      });

      time++;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
      }}
    />
  );
};

// Animated 3D Stock Management Visualization
const StockVisualization = () => {
  const groupRef = useRef<any>(null);
  const chartRef = useRef<any>(null);
  const boxesRef = useRef<any[]>([]);

  // Sample stock data
  const stockData = [
    { value: 0.8, color: "#3B82F6", label: "Electronics" },
    { value: 0.6, color: "#8B5CF6", label: "Clothing" },
    { value: 0.9, color: "#10B981", label: "Food" },
    { value: 0.4, color: "#F59E0B", label: "Books" },
    { value: 0.7, color: "#EF4444", label: "Tools" },
  ];

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Rotate entire group
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.5;
    }

    // Animate chart bars
    if (chartRef.current) {
      chartRef.current.children.forEach((bar: any, i: number) => {
        if (bar) {
          const baseHeight = stockData[i].value * 2;
          const animatedHeight = baseHeight + Math.sin(time * 2 + i) * 0.2;
          bar.scale.y = Math.max(0.1, animatedHeight);
          bar.position.y = animatedHeight / 2 - 1;
        }
      });
    }

    // Float inventory boxes
    boxesRef.current.forEach((box, i) => {
      if (box) {
        box.position.y = Math.sin(time + i * 0.8) * 0.3;
        box.rotation.x = time * 0.3 + i;
        box.rotation.z = time * 0.2 + i;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* 3D Bar Chart */}
      <group ref={chartRef} position={[0, -1, 0]}>
        {stockData.map((data, i) => (
          <group key={i}>
            {/* Bar */}
            <mesh position={[i * 0.8 - 1.6, data.value, 0]}>
              <boxGeometry args={[0.6, data.value * 3, 0.6]} />
              <meshStandardMaterial
                color={data.color}
                emissive={data.color}
                emissiveIntensity={0.2}
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>

            {/* Wireframe outline */}
            <mesh position={[i * 0.8 - 1.6, data.value, 0]}>
              <boxGeometry args={[0.61, data.value * 2 + 0.01, 0.61]} />
              <meshBasicMaterial
                color={data.color}
                wireframe={true}
                transparent={true}
                opacity={0.3}
              />
            </mesh>

            {/* Base platform */}
            <mesh position={[i * 0.8 - 1.6, -1, 0]}>
              <cylinderGeometry args={[0.4, 0.4, 0.1, 16]} />
              <meshStandardMaterial
                color="#1E293B"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Floating Inventory Boxes */}
      <group>
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 4;
          return (
            <mesh
              key={i}
              ref={(el) => (boxesRef.current[i] = el)}
              position={[
                Math.cos(angle) * radius,
                Math.sin(i) * 0.5,
                Math.sin(angle) * radius,
              ]}
            >
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshStandardMaterial
                color={stockData[i % stockData.length].color}
                transparent={true}
                opacity={0.7}
                emissive={stockData[i % stockData.length].color}
                emissiveIntensity={0.1}
              />
            </mesh>
          );
        })}
      </group>

      {/* Central Data Node */}
      <group>
        <mesh position={[0, 1, 0]}>
          <octahedronGeometry args={[0.5, 2]} />
          <meshStandardMaterial
            color="#60A5FA"
            emissive="#3B82F6"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Data connection lines */}
        {stockData.map((_, i) => (
          <mesh
            key={i}
            position={[0, 0.5, 0]}
            rotation={[0, (i / stockData.length) * Math.PI * 2, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
            <meshBasicMaterial
              color="#60A5FA"
              transparent={true}
              opacity={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* Rotating Ring */}
      <group>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3, 0.05, 8, 64]} />
          <meshBasicMaterial color="#8B5CF6" transparent={true} opacity={0.6} />
        </mesh>

        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[3.2, 0.03, 8, 64]} />
          <meshBasicMaterial color="#10B981" transparent={true} opacity={0.4} />
        </mesh>
      </group>

      {/* Stock Level Indicators */}
      <group position={[0, 2.5, 0]}>
        {[...Array(6)].map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 6) * Math.PI * 2) * 1.5,
              Math.sin(i * 2) * 0.2,
              Math.sin((i / 6) * Math.PI * 2) * 1.5,
            ]}
          >
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color="#F59E0B"
              emissive="#F59E0B"
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// Scene lighting and environment
const SceneLighting = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#3B82F6" />
      <pointLight position={[-10, -10, 10]} intensity={0.8} color="#8B5CF6" />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
    </>
  );
};

const globalInfo = [
  {
    title: "Initialisation des Stocks",
    text: "Configuration rapide et précise des quantités initiales de vos produits avec importation en lot, codes-barres automatiques et catégorisation intelligente pour un démarrage optimal de votre inventaire.",
    image: "/chat1.png",
  },
  {
    title: "Visualisation Temps Réel",
    text: "Tableaux de bord interactifs avec graphiques 3D, alertes instantanées et métriques avancées pour surveiller l'évolution de vos stocks en continu et prendre des décisions éclairées.",
    image: "/313.jpg",
  },
  {
    title: "Suivi Quotidien",
    text: "Monitoring automatique des mouvements de stock avec rapports journaliers détaillés, analyse des tendances et prédictions intelligentes pour optimiser votre gestion au quotidien.",
    image:
      "/20250810_1536_Stock Management Visualization_remix_01k2a6f954f2esvkffpc641db4.png",
  },
  {
    title: "Gestion Entrées/Sorties",
    text: "Traçabilité complète des flux IN/OUT avec validation automatique, historique détaillé et notifications en temps réel pour un contrôle total de vos mouvements de marchandises.",
    image: "/2001.i039.031_branding_isometric_concept_icons-06.jpg",
  },
];

const socialMedia = [
  {
    name: "faceBook",
    icon: "/communication.png",
    description: "Explorer la page officielle de Avenir tubkal",
    link: "https://www.instagram.com/association_avenir_toubkal/",
  },
  {
    name: "instagram",
    description: "Explorer la page officielle de Avenir tubkal",
    icon: "/instagram.png",
    link: "https://www.instagram.com/association_avenir_toubkal/",
  },
];

export default function HomePage() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    return router.push(path);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      {/* Overlay for better content visibility */}
      <div className="absolute inset-0 bg-black/20 z-0"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-blue-900/90 to-purple-900/95 backdrop-blur-sm"></div>
          <div className="relative px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-wrap items-center justify-between gap-3 max-w-full mx-auto">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4 group">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-600/30 border border-white/20 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500 backdrop-blur-sm">
                      <Mountain className="w-10 h-10 text-white group-hover:rotate-12 transition-transform duration-300" />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-xl group-hover:blur-2xl transition-all duration-300 -z-10"></div>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg">
                      <div className="w-full h-full bg-emerald-400 rounded-full animate-ping"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-none tracking-tight">
                      AvenirTubkal
                    </h1>
                    <p className="text-sm text-blue-200/80 font-medium tracking-wide">
                      Stock Intelligence
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  className="group relative overflow-hidden rounded-xl"
                  onClick={() => handleNavigation("/login")}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative px-6 py-3 border border-white/30 rounded-xl backdrop-blur-sm bg-white/10 group-hover:bg-transparent transition-all duration-300">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-semibold">Connect</span>
                      <LogIn className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </button>

                <button
                  className="group relative overflow-hidden rounded-xl"
                  onClick={() => handleNavigation("/register")}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-semibold">Register</span>
                      <ListTodo className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-between px-4 sm:px-6 lg:px-20 py-10 lg:py-20 gap-8 lg:gap-12 min-h-[70vh] border rounded-lg  border-purple-500 mx-2 sm:mx-6 lg:mx-10 my-6 lg:my-10">
          {/* Left Content */}
          <div className="w-full lg:w-[45%] space-y-6 lg:space-y-10 flex flex-col items-center lg:items-start justify-evenly h-auto lg:h-[800px]">
            <div>
              <h1 className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent text-3xl sm:text-4xl lg:text-6xl font-black leading-tight text-center lg:text-left">
                AvenirTubkal
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Stock Management
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed mt-6 sm:mt-10 text-center lg:text-left">
                Cette application a pour but de révolutionner la gestion des
                stocks avec des analyses en temps réel, un suivi intelligent et
                des visualisations 2D immersives. Optimisée pour la gestionoptimal des stocks
                modernes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:space-x-4 w-full sm:w-auto">
              <button
                onClick={() => handleNavigation("/login")}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
              >
                <div className="flex items-center space-x-2">
                  <LogIn className="w-5 h-5" />
                  <span>Commencer</span>
                </div>
              </button>

              <button
                onClick={() => handleNavigation("/register")}
                className="w-full sm:w-auto px-8 py-4 border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center space-x-2">
                  <UserPlus className="w-5 h-5" />
                  <span>S&apos;inscrire</span>
                </div>
              </button>
            </div>
          </div>

          {/* Right 3D Section */}
          <div className="w-full lg:w-[50%] h-64 sm:h-80 md:h-[420px] lg:h-[700px] relative">
            <div className="w-full h-full rounded-2xl overflow-hidden">
              <Canvas
                camera={{ position: [0, 0, 8], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
              >
                <SceneLighting />
                <StockVisualization />
                <OrbitControls
                  enablePan={false}
                  enableZoom={true}
                  enableRotate={true}
                  autoRotate={true}
                  autoRotateSpeed={0.5}
                  maxDistance={15}
                  minDistance={5}
                />
              </Canvas>
            </div>

            {/* 3D Section Label */}
            {/* <div className="absolute top-4 left-4 px-4 py-2 rounded-lg bg-black/50 backdrop-blur-sm border border-white/20">
              <p className="text-white text-sm font-medium">Analyse 3D des Stocks en Temps Réel</p>
            </div> */}
          </div>
        </main>

        {/* Cards Section - Responsive */}
        <div className="w-full px-4 sm:px-6 lg:px-10 py-12 lg:py-16">
          <div className="max-w-[90%] mx-auto w-full">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-6">
                Fonctionnalités Avancées
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Découvrez notre suite complète d&apos;outils de gestion intelligente
                pour optimiser votre inventaire
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {globalInfo.map((card, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-slate-900/80 to-blue-900/60 backdrop-blur-sm hover:from-blue-900/80 hover:to-purple-900/60 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl -z-10"></div>

                  {/* Image container */}
                  <div className="relative overflow-hidden rounded-t-2xl h-56 sm:h-72 md:h-80 lg:h-96">
                    <Image src={card.image} alt="no image" width={400} height={400}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Floating icon */}
                    <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300">
                      {card.title}
                    </h3>

                    <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 group-hover:text-slate-200 transition-colors duration-300">
                      {card.text}
                    </p>

                    {/* Action button */}
                    <div className="pt-2">
                      <button className="relative overflow-hidden px-4 py-2 bg-gradient-to-r from-blue-600/80 to-purple-600/80 rounded-lg text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:from-blue-500 hover:to-purple-500">
                        <span className="relative z-10 flex items-center space-x-2">
                          <span onClick={() => handleNavigation("/login")}>
                            Explorer
                          </span>
                          <Activity className="w-4 h-4" />
                        </span>
                        {/* Button glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 hover:opacity-30 transition-opacity duration-300 blur-lg"></div>
                      </button>
                    </div>
                  </div>

                  {/* Card border glow */}
                  <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-br from-blue-500/50 to-purple-500/50 opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10"></div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-16">
              <button
                onClick={() => handleNavigation("/login")}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
              >
                <div className="flex items-center space-x-2">
                  <span>Voir toutes les fonctionnalités</span>
                  <BarChart3 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-20 py-16 lg:py-20 relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium backdrop-blur-sm">
                  À Propos
                </span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-8 leading-tight">
                C&apos;est quoi AvenirTubkal ?
              </h2>
              <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                Découvrez notre suite complète d&apos;outils de gestion intelligente
                pour optimiser votre inventaire et transformer votre entreprise
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="">
              {/* Left Content - Cards Grid */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10">
                  {socialMedia.map((card, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900/80 to-blue-900/60 backdrop-blur-sm hover:from-blue-900/80 hover:to-purple-900/60 transition-all duration-500 transform hover:scale-[1.05] hover:-translate-y-3"
                    >
                      {/* Image container */}
                      <div className="relative overflow-hidden flex flex-col items-center justify-center rounded-t-2xl h-44 sm:h-48 lg:h-56">
                        <Image width={400} height={400}
                          src={card.icon}
                          alt={card.name}
                          className="w-44 object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Image overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      </div>

                      {/* Card content */}
                      <div className="p-6 space-y-4">
                        <h3 className="text-lg font-bold text-white my-2 truncate">
                          {card.name}
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed line-clamp-2">
                          {card.description ||
                            "Fonctionnalité avancée pour optimiser votre gestion."}
                        </p>

                        {/* Action button */}
                        <div className="pt-2">
                          <button
                            onClick={() => handleNavigation(`${card.link}`)}
                            className="relative overflow-hidden w-full px-4 py-3 bg-gradient-to-r from-blue-600/80 to-purple-600/80 rounded-xl text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:from-blue-500 hover:to-purple-500"
                          >
                            <span className="relative z-10 flex items-center justify-center space-x-2">
                              <span>Explorer</span>
                              <Activity className="w-4 h-4" />
                            </span>
                            {/* Button glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 hover:opacity-30 transition-opacity duration-300 blur-lg"></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative mt-16 lg:mt-20">
          {/* Background with enhanced effects */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-800/95 to-transparent backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Decorative top border */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

          <div className="relative px-4 sm:px-6 lg:px-20 py-12 lg:py-16">
            <div className="max-w-7xl mx-auto">
              {/* Main footer content */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                {/* Company Info */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <MountainSnow className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl lg:text-3xl text-white font-black">
                      AvenirTubkal
                    </h1>
                  </div>

                  <p className="text-slate-300 leading-relaxed max-w-md">
                    Révolutionnez votre gestion de stock avec notre plateforme
                    . Analytics en temps réel,
                    interface moderne pour optimiser votre inventaire et booster
                    votre productivité.
                  </p>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors duration-300">
                      <Route className="w-5 h-5 text-blue-400" />
                      <span className="text-sm">
                        Route Seti Fadema Tahenout Elhouze, Maroc
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors duration-300">
                      <Phone className="w-5 h-5 text-blue-400" />
                      <span className="text-sm">+212 659-407669</span>
                    </div>

                    <div className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors duration-300">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <span className="text-sm">aghbaloucomplexe@gmail.com</span>
                    </div>
                  </div>
                </div>

                {/* Solutions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4 border-b border-blue-500/30 pb-2">
                    Solutions
                  </h3>
                  <ul className="space-y-3">
                    {[
                      { name: "Gestion de Stock", href: "/" },
                      { name: "Multi-Entrepôts", href: "/" },
                      { name: "Rapports Avancés", href: "/" },
                    ].map((link, index) => (
                      <li key={index}>
                        <Link
                          href={link.href}
                          className="text-slate-400 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center space-x-2 group"
                        >
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                          <span>{link.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ressources */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4 border-b border-purple-500/30 pb-2">
                    Ressources
                  </h3>
                  <ul className="space-y-3">
                    {[
                      { name: "Documentation", href: "/" },
                      { name: "Tutoriels", href: "/" },
                      { name: "Support", href: "mailto:aghbaloucomplexe@gmail.com"},
                      { name: "Blog", href: "/" },
                      { name: "Communauté", href: "/" },
                    ].map((link, index) => (
                      <li key={index}>
                        <Link
                          href={link.href}
                          className="text-slate-400 hover:text-purple-400 transition-colors duration-300 text-sm flex items-center space-x-2 group"
                        >
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                          <span>{link.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Newsletter Section */}
              <div className="border-t border-white/10 pt-8 mb-8">
                <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
                  <div className="text-center lg:text-left">
                    <h4 className="text-xl font-semibold text-white mb-2">
                      Restez informé des nouveautés
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Recevez les dernières mises à jour et conseils
                      d&apos;optimisation
                    </p>
                  </div>

                  <div className="flex w-full lg:w-auto max-w-md space-x-3">
                    <input
                      type="email"
                      placeholder="Votre adresse email"
                      className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    />
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Social Media & Bottom Bar */}
              <div className="border-t border-white/10 pt-8">
                <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
                  {/* Social Links */}
                  <div className="flex items-center space-x-6">
                    <span className="text-slate-400 text-sm">Suivez-nous:</span>
                    {[
                      { icon: Github, href: "#", color: "hover:text-gray-300" },
                      {
                        icon: Linkedin,
                        href: "#",
                        color: "hover:text-blue-400",
                      },
                      { icon: Twitter, href: "#", color: "hover:text-sky-400" },
                      {
                        icon: Facebook,
                        href: "#",
                        color: "hover:text-blue-500",
                      },
                    ].map((social, index) => (
                      <Link
                        key={index}
                        href={social.href}
                        className={`text-slate-400 ${social.color} transition-colors duration-300 transform hover:scale-110`}
                      >
                        <social.icon className="w-5 h-5" />
                      </Link>
                    ))}
                  </div>

                  {/* Legal Links */}
                  <div className="flex items-center space-x-6 text-sm">
                    <Link
                      href="/"
                      className="text-slate-400 hover:text-white transition-colors duration-300"
                    >
                      Confidentialité
                    </Link>
                    <Link
                      href="/"
                      className="text-slate-400 hover:text-white transition-colors duration-300"
                    >
                      Conditions
                    </Link>
                    <Link
                      href="/"
                      className="text-slate-400 hover:text-white transition-colors duration-300"
                    >
                      Cookies
                    </Link>
                  </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                  <p className="text-slate-500 text-sm">
                    © {new Date().getFullYear()} AvenirTubkal. Tous droits
                    réservés.
                    <span className="mx-2">•</span>
                    Plateforme de Gestion de Stock Nouvelle Génération
                    <span className="mx-2">•</span>
                    Conçu avec ❤️ au Maroc
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
