import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  Lock, 
  Building, 
  User, 
  Mail, 
  Send, 
  Sparkles, 
  Check,
  Phone
} from 'lucide-react';

export default function BookingCalendar() {
  const daysOfWeek = [
    { key: 'lunes', name: 'Lunes' },
    { key: 'martes', name: 'Martes' },
    { key: 'miercoles', name: 'Miércoles' },
    { key: 'jueves', name: 'Jueves' },
    { key: 'viernes', name: 'Viernes' }
  ];

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
    '08:00 PM'
  ];

  const availability = {
    lunes: ['11:00 AM'],
    martes: ['11:00 AM', '02:00 PM', '06:00 PM'],
    miercoles: ['02:00 PM'],
    jueves: [],
    viernes: ['11:00 AM']
  };

  const [selectedDay, setSelectedDay] = useState('martes');
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    whatsapp: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const isSlotAvailable = (day, time) => {
    return availability[day]?.includes(time) || false;
  };

  const handleSlotClick = (day, time) => {
    if (!isSlotAvailable(day, time)) return;
    setSelectedDay(day);
    setSelectedTime(time);
    setIsBooked(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.companyName || !formData.email || !formData.whatsapp) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      fullName: formData.fullName,
      companyName: formData.companyName,
      email: formData.email,
      whatsapp: formData.whatsapp,
      day: daysOfWeek.find(d => d.key === selectedDay)?.name,
      time: selectedTime
    };

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.status !== 'success') {
        throw new Error(data.message || 'No se pudo registrar la reserva.');
      }

      setIsSubmitting(false);
      setIsBooked(true);
      setBookingDetails(payload);

    } catch (err) {
      console.error('Booking submission error:', err);
      setIsSubmitting(false);
      setSubmitError('No pudimos registrar tu reserva en este momento. Por favor intenta nuevamente.');
    }
  };

  return (
    <section id="booking-calendar" className="py-20 px-4 max-w-6xl mx-auto scroll-mt-10">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden glass-card">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8 md:p-10 border-b border-amber-500/30 text-center md:text-left relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Agendamiento Directo Especializado</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Reserva de Llamada Comercial Especializada
              </h2>
              <p className="text-slate-300 text-sm mt-1 max-w-xl font-light">
                Selecciona un bloque de disponibilidad confirmado para coordinar la logística con nuestro equipo técnico.
              </p>
            </div>

            <div className="bg-slate-800/80 backdrop-blur border border-slate-700 p-4 rounded-xl text-xs space-y-1 text-slate-300 min-w-[220px]">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-white">Ventana Horaria:</span>
              </div>
              <p className="font-mono text-amber-200">09:00 AM – 08:00 PM</p>
              <p className="text-[10px] text-slate-400">Notificación automática a emails institucionales</p>
            </div>
          </div>
        </div>

        {isBooked ? (
          /* Success Screen - Cleaned of Internal Email List */
          <div className="p-8 md:p-16 text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-50 shadow-inner">
              <CheckCircle className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
                Reserva Confirmada
              </span>
              <h3 className="text-3xl font-black text-slate-900">
                ¡Llamada Agendada! Revisa tu bandeja de entrada
              </h3>
              <p className="text-slate-600 text-sm max-w-lg mx-auto">
                Hemos recibido tu solicitud corporativa. Te hemos enviado un resumen de confirmación a tu correo electrónico.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-3 shadow-sm text-sm">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Detalle de la Cita</span>
                <span className="text-amber-800 font-mono">ID: REF-{Math.floor(1000 + Math.random() * 9000)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Día y Hora:</span>
                <span className="font-bold text-slate-900 font-mono">{bookingDetails?.day} a las {bookingDetails?.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Solicitante:</span>
                <span className="font-semibold text-slate-800">{bookingDetails?.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Empresa:</span>
                <span className="font-semibold text-slate-800">{bookingDetails?.companyName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Correo:</span>
                <span className="font-mono text-amber-800 text-xs">{bookingDetails?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">WhatsApp:</span>
                <span className="font-mono text-emerald-800 text-xs font-bold">{bookingDetails?.whatsapp}</span>
              </div>
            </div>

            <button
              onClick={() => setIsBooked(false)}
              className="inline-flex items-center space-x-2 text-sm font-semibold text-amber-800 hover:text-amber-900 underline underline-offset-4 cursor-pointer"
            >
              <span>Agendar otra llamada comercial</span>
            </button>
          </div>
        ) : (
          /* Main Calendar & Form Grid */
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Interactive Weekly Calendar Matrix */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-900 flex items-center">
                  <CalendarIcon className="w-5 h-5 text-amber-600 mr-2" />
                  Disponibilidad Semanal Exclusiva
                </h3>
                <span className="text-xs text-slate-500 font-mono">Horario rígido (09:00 AM - 08:00 PM)</span>
              </div>

              {/* Day Selector Buttons */}
              <div className="grid grid-cols-5 gap-2">
                {daysOfWeek.map((d) => {
                  const hasAvailable = availability[d.key]?.length > 0;
                  const isSelected = selectedDay === d.key;

                  return (
                    <button
                      key={d.key}
                      onClick={() => {
                        setSelectedDay(d.key);
                        const firstAvail = availability[d.key]?.[0] || null;
                        setSelectedTime(firstAvail);
                      }}
                      className={`p-2.5 rounded-xl text-center border transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400/50'
                          : hasAvailable
                          ? 'bg-amber-50/60 hover:bg-amber-100 text-slate-800 border-amber-200/80'
                          : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                      }`}
                    >
                      <span className="text-xs font-bold block">{d.name}</span>
                      <span className="text-[10px] font-mono mt-1 block">
                        {hasAvailable ? `${availability[d.key].length} Libre` : 'Lleno'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Time Slots Grid for Selected Day */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">
                    Bloques para el {daysOfWeek.find(d => d.key === selectedDay)?.name}:
                  </span>
                  <div className="flex items-center space-x-3 text-[11px]">
                    <span className="flex items-center text-emerald-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span> Disponible
                    </span>
                    <span className="flex items-center text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-slate-300 mr-1"></span> Ocupado
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {timeSlots.map((time) => {
                    const available = isSlotAvailable(selectedDay, time);
                    const isSelected = selectedTime === time && available;

                    return (
                      <button
                        key={time}
                        disabled={!available}
                        onClick={() => handleSlotClick(selectedDay, time)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-mono font-medium transition cursor-pointer flex items-center justify-between border ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-md ring-2 ring-amber-300'
                            : available
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-emerald-200/80 hover:border-emerald-400'
                            : 'bg-slate-100 text-slate-400 border-slate-200/60 cursor-not-allowed line-through'
                        }`}
                      >
                        <span>{time}</span>
                        {available ? (
                          <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-emerald-500'}`}></span>
                        ) : (
                          <Lock className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Reservation Form */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-5">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center">
                  <User className="w-4 h-4 text-amber-600 mr-2" />
                  Datos de la Reserva
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Slot seleccionado: <strong className="text-amber-800 font-mono">{daysOfWeek.find(d => d.key === selectedDay)?.name} @ {selectedTime || 'Selecciona horario'}</strong>
                </p>
              </div>

              {!selectedTime ? (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-4 rounded-xl text-center">
                  Por favor selecciona un horario marcado como <strong className="text-emerald-700">Disponible</strong> en el panel izquierdo.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Field: Nombre Completo */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nombre Completo *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Ej. Dr. Carlos Mendoza"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Field: Nombre de la Empresa */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nombre de la Empresa / Hospital *
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Ej. Grupo de Salud Metropolitano"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Field: Correo Electrónico Profesional */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Correo Electrónico Profesional *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="cmendoza@saludmetropolitana.com"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-800 font-mono"
                      />
                    </div>
                  </div>

                  {/* Field: Número de WhatsApp */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Número de WhatsApp *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        name="whatsapp"
                        required
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="+52 55 1234 5678"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition duration-200 cursor-pointer flex items-center justify-center space-x-2 group"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin mr-2"></span>
                        Procesando Reserva...
                      </span>
                    ) : (
                      <>
                        <span>Confirmar Cita Comercial</span>
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {submitError && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-center">
                      {submitError}
                    </p>
                  )}
                </form>
              )}
            </div>

          </div>
        )}
      </div>
    </section>
  );
}
