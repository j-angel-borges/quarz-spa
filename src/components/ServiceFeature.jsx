import React from 'react';
import { 
  Database, 
  Filter, 
  Sparkles, 
  Cpu, 
  CalendarCheck, 
  TrendingUp, 
  CheckCircle2, 
  Building2,
  GitBranch
} from 'lucide-react';

export default function ServiceFeature() {
  const steps = [
    {
      number: '01',
      title: 'Abordaje Frío Automático',
      subtitle: 'Filtrado inteligente de bases de datos',
      description: 'El agente identifica centrales de compra hospitalarias y clínicas clave, iniciando el primer contacto calificador sin intervención humana.',
      icon: Database,
      badgeText: 'Top of Funnel',
      vectorGraphic: (
        <div className="relative w-full h-32 bg-slate-50 rounded-xl p-3 flex flex-col justify-between border border-slate-100 overflow-hidden group-hover:border-amber-200 transition-colors">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="flex items-center font-mono text-[11px]"><Filter className="w-3 h-3 text-amber-500 mr-1" /> Hospital Lead DB</span>
            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-medium">99.4% Validated</span>
          </div>
          {/* Animated Database node list */}
          <div className="space-y-1.5 my-auto">
            <div className="flex items-center justify-between bg-white px-2.5 py-1 rounded border border-slate-200/70 text-[11px] shadow-2xs">
              <span className="font-medium text-slate-700 flex items-center"><Building2 className="w-3 h-3 mr-1 text-slate-400" /> Cuestión Médica Central</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="flex items-center justify-between bg-amber-500/10 px-2.5 py-1 rounded border border-amber-300/40 text-[11px]">
              <span className="font-medium text-amber-900 flex items-center"><Building2 className="w-3 h-3 mr-1 text-amber-600" /> Complejo Clínico Sur</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            </div>
          </div>
          <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 w-3/4 animate-pulse"></div>
          </div>
        </div>
      )
    },
    {
      number: '02',
      title: 'Calificación Estratégica',
      subtitle: 'Preguntas de nicho en tiempo real',
      description: 'Evalúa el volumen de indumentaria clínica e insumos requeridos, descartando solicitudes fuera de alcance mediante guardarraíles inteligentes.',
      icon: Cpu,
      badgeText: 'Filtro IA',
      vectorGraphic: (
        <div className="relative w-full h-32 bg-slate-50 rounded-xl p-3 flex flex-col justify-between border border-slate-100 overflow-hidden group-hover:border-amber-200 transition-colors">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="flex items-center font-mono text-[11px]"><Sparkles className="w-3 h-3 text-amber-500 mr-1" /> Niche Qualifier</span>
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-medium">&lt; 4 Pasos</span>
          </div>
          {/* Qualification Vector Decision Tree */}
          <div className="grid grid-cols-2 gap-2 my-auto text-[11px]">
            <div className="bg-emerald-50 border border-emerald-200 rounded p-1.5 text-emerald-800 flex items-center justify-between">
              <span>Batas / Insumos</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded p-1.5 text-rose-800 flex items-center justify-between opacity-60">
              <span className="line-through">Pañales / Otros</span>
              <span className="text-[10px] font-bold text-rose-600">Filtro</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
            <span>Confianza de encaje:</span>
            <span className="font-bold text-amber-600 font-mono">ALTO VALOR</span>
          </div>
        </div>
      )
    },
    {
      number: '03',
      title: 'Traspaso al Comercial',
      subtitle: 'Agendamiento e inserción directa',
      description: 'Gestiona la reserva directa de una llamada comercial en el calendario ejecutivo y notifica automáticamente al representante de ventas.',
      icon: CalendarCheck,
      badgeText: 'Bottom of Funnel',
      vectorGraphic: (
        <div className="relative w-full h-32 bg-slate-50 rounded-xl p-3 flex flex-col justify-between border border-slate-100 overflow-hidden group-hover:border-amber-200 transition-colors">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="flex items-center font-mono text-[11px]"><GitBranch className="w-3 h-3 text-amber-500 mr-1" /> Sync & Calendar</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[10px] font-medium">Auto Notificación</span>
          </div>
          {/* Calendar Transfer graphic */}
          <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs flex items-center space-x-2 my-auto">
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 text-white p-2 rounded text-center min-w-[36px]">
              <span className="text-[9px] block leading-none font-bold">MAR</span>
              <span className="text-sm font-black leading-none">11</span>
            </div>
            <div className="flex-1 text-left">
              <div className="text-[11px] font-bold text-slate-800">Llamada Comercial Especializada</div>
              <div className="text-[10px] text-slate-500">11:00 AM • Confirmado</div>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-[10px] text-slate-400 text-center font-mono">
            Envío Inmediato de Notificación
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto relative">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-800 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Arquitectura Conversacional de Alta Conversión</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          ¿Cómo transforma el Asistente de IA el pipeline de venta hospitalaria?
        </h2>
        
        <p className="text-slate-600 text-base md:text-lg leading-relaxed font-normal">
          Diseñado con parámetros corporativos de alta eficiencia: filtrado sin fricción y agendamiento comercial en tiempo récord.
        </p>
      </div>

      {/* 3 Step Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {steps.map((step) => (
          <div
            key={step.number}
            className="group bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 hover:border-amber-400/80 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-200 via-amber-400 to-slate-200 group-hover:from-amber-400 group-hover:to-amber-600 transition-all"></div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 font-mono tracking-tighter">
                  {step.number}
                </span>
                <span className="bg-slate-100 text-slate-600 group-hover:bg-amber-50 group-hover:text-amber-800 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-200 group-hover:border-amber-200 transition-colors">
                  {step.badgeText}
                </span>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs font-semibold text-amber-700 mt-0.5">
                  {step.subtitle}
                </p>
              </div>

              <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-6">
                {step.description}
              </p>
            </div>

            <div className="mt-2">
              {step.vectorGraphic}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
