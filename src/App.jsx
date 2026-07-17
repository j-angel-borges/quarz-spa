import React, { useRef } from 'react';
import WhatsAppChat from './components/WhatsAppChat';
import ServiceFeature from './components/ServiceFeature';
import BookingCalendar from './components/BookingCalendar';
import { 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Building2, 
  CheckCircle,
  Layers,
  Clock,
  Send
} from 'lucide-react';

export default function App() {
  const scrollToCalendar = () => {
    const el = document.getElementById('booking-calendar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFCFF] text-slate-800 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Clean Commercial Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Official Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img 
              src="/quarz-logo.png" 
              alt="Logo Corporativo" 
              className="h-11 w-auto object-contain rounded-lg hover:scale-105 transition-transform"
            />
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
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-amber-400/40 shadow-sm hover:shadow-md transition cursor-pointer flex items-center space-x-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Reservar Demostración</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-14 pb-12 px-4 max-w-7xl mx-auto text-center relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-100/30 via-amber-50/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="inline-flex items-center space-x-2 bg-white border border-amber-300/80 px-4 py-1.5 rounded-full text-xs font-bold text-amber-900 shadow-2xs mb-6">
          <Activity className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>Agente Setter de Alto Rendimiento para Insumos Hospitalarios</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          Automatiza la cualificación y agendamiento comercial de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700">indumentaria e insumos médicos</span>
        </h1>

        <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-12">
          Un simulador conversacional inteligente entrenado para el sector clínico hospitalario. Filtra solicitudes ajenas en tiempo real y gestiona citas comerciales directas.
        </p>

        {/* WhatsApp Interactive Simulator Container */}
        <div id="simulator" className="scroll-mt-24">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Prueba la Interacción del Agente en Vivo
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Interactúa como un comprador hospitalario o introduce una consulta de prueba.
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
      <footer className="bg-slate-950 text-white border-t border-slate-800 py-10 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          
          <div className="flex items-center space-x-3">
            <img 
              src="/quarz-logo.png" 
              alt="Logo Corporativo" 
              className="h-9 w-auto object-contain rounded bg-white/10 p-1 border border-slate-700"
            />
            <div>
              <span className="font-semibold text-white tracking-wide text-xs">Medical AI Solutions</span>
              <p className="text-[10px] text-slate-500">Distribución de Indumentaria & Inteligencia Artificial Hospitalaria</p>
            </div>
          </div>

          <div className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} Medical AI Solutions. Todos los derechos reservados.
          </div>
        </div>
      </footer>

    </div>
  );
}
