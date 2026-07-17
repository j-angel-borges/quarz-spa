import React, { useRef } from 'react';
import WhatsAppChat from './components/WhatsAppChat';
import ServiceFeature from './components/ServiceFeature';
import BookingCalendar from './components/BookingCalendar';
import { 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Building2, 
  ArrowRight, 
  Cpu, 
  CheckCircle,
  FileSpreadsheet,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function App() {
  const calendarRef = useRef(null);

  const scrollToCalendar = () => {
    const el = document.getElementById('booking-calendar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFCFF] text-slate-800 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Top Corporate Status Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo QUARZ Geometric Crystal Badge */}
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center border border-amber-400/50 shadow-md relative group">
              <span className="font-black text-amber-400 font-mono text-lg tracking-wider group-hover:scale-105 transition-transform">Q</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">QUARZ</span>
                <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                  Medical AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono leading-none">
                Vertex AI • Project: gen-lang-client-0929068122
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-600">
            <a href="#simulator" className="hover:text-amber-700 transition">Simulador WhatsApp</a>
            <a href="#features" className="hover:text-amber-700 transition">Proceso 3 Pasos</a>
            <a href="#booking-calendar" className="hover:text-amber-700 transition">Agendamiento</a>
          </nav>

          {/* Header Action Button */}
          <button
            onClick={scrollToCalendar}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-amber-400/40 shadow-sm hover:shadow-md transition cursor-pointer flex items-center space-x-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Reservar Demostración</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-16 px-4 max-w-7xl mx-auto text-center relative overflow-hidden">
        {/* Background Geometric Crystal Traces inspired by Quarz logo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-100/40 via-amber-50/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="inline-flex items-center space-x-2 bg-white border border-amber-300/80 px-4 py-1.5 rounded-full text-xs font-bold text-amber-900 shadow-2xs mb-6">
          <Activity className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>Agente Setter de Alto Rendimiento para Insumos Hospitalarios</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          Automatiza la cualificación y agendamiento comercial de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700">indumentaria quirúrgica</span>
        </h1>

        <p className="text-slate-600 text-base md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-10">
          Un simulador conversacional inteligente entrenado bajo parámetros de nicho hospitalario. Filtra tópicos ajenos en tiempo real y direcciona el agendamiento directo.
        </p>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16 text-left">
          <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Motor de IA</span>
            <span className="text-lg font-bold text-slate-900 font-mono">Gemini 3.5 Flash</span>
          </div>
          <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Proyecto GCP</span>
            <span className="text-xs font-bold text-amber-800 font-mono truncate block">gen-lang-client-092906...</span>
          </div>
          <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Límite Cualificación</span>
            <span className="text-lg font-bold text-slate-900 font-mono">&lt; 4 Interacciones</span>
          </div>
          <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Notificaciones</span>
            <span className="text-xs font-bold text-emerald-700 font-mono flex items-center">
              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Apps Script Active
            </span>
          </div>
        </div>

        {/* WhatsApp Interactive Simulator Container */}
        <div id="simulator" className="scroll-mt-24">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Prueba la Interacción del Agente en Vivo
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Interactúa como un comprador hospitalario o introduce una consulta fuera de nicho para evaluar el guardarraíl.
            </p>
          </div>

          <WhatsAppChat onTriggerBooking={scrollToCalendar} />
        </div>
      </section>

      {/* Service Explanation Section (3 Step Grid) */}
      <div id="features" className="bg-slate-50/60 border-y border-slate-200/80">
        <ServiceFeature />
      </div>

      {/* Booking Calendar Section */}
      <BookingCalendar />

      {/* Corporate Footer */}
      <footer className="bg-slate-950 text-white border-t border-slate-800 py-12 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-amber-400/40 flex items-center justify-center font-bold text-amber-400 font-mono text-sm">
              Q
            </div>
            <div>
              <span className="font-extrabold text-white tracking-wide text-sm">QUARZ Systems</span>
              <p className="text-[10px] text-slate-500">Distribución Quirúrgica & Inteligencia Artificial Hospitalaria</p>
            </div>
          </div>

          <div className="text-center md:text-right font-mono text-[11px] space-y-1">
            <p className="text-slate-300">GCP Project: <code className="text-amber-400">gen-lang-client-0929068122</code></p>
            <p className="text-slate-500">Notificaciones asíncronas a: mipropiadinastia@gmail.com | angel.borges@quarz.online</p>
          </div>

          <div className="text-slate-600 text-[11px]">
            © {new Date().getFullYear()} QUARZ. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
