import React, { useRef } from 'react';
import WhatsAppChat from './components/WhatsAppChat';
import ServiceFeature from './components/ServiceFeature';
import BookingCalendar from './components/BookingCalendar';
import { 
  Sparkles, 
  Activity, 
  Bot
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
            <a href="#features" className="hover:text-amber-700 transition">Proceso 3 Pasos</a>
            <a href="#simulator" className="hover:text-amber-700 transition">Simulador WhatsApp</a>
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

        <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8">
          Un simulador conversacional inteligente entrenado para el sector clínico hospitalario. Filtra solicitudes ajenas en tiempo real y gestiona citas comerciales directas.
        </p>
      </section>

      {/* SECTION 1: Service Explanation Section (3 Step Grid) */}
      <div id="features" className="bg-slate-50/60 border-y border-slate-200/80 py-6">
        <ServiceFeature />
      </div>

      {/* SECTION 2: WhatsApp Interactive Simulator Container */}
      <section id="simulator" className="py-16 px-4 max-w-7xl mx-auto scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-800">
            <Bot className="w-4 h-4 text-emerald-600" />
            <span>Demostración de IA Conversacional en Vivo</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Prueba la Interacción del Agente en Tiempo Real
          </h2>

          <p className="text-slate-600 text-sm md:text-base font-medium max-w-2xl mx-auto bg-amber-50/80 border border-amber-200/70 p-3.5 rounded-2xl text-amber-900 shadow-2xs">
            A continuación puedes probar un chatbot real entrenado para responder como comercial del nicho clínico.
          </p>
        </div>

        <WhatsAppChat onTriggerBooking={scrollToCalendar} />
      </section>

      {/* SECTION 3: Booking Calendar Section */}
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
