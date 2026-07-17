import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Search, 
  Phone, 
  Video, 
  CheckCheck, 
  Bot
} from 'lucide-react';

export default function WhatsAppChat({ onTriggerBooking }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Initial Top of Funnel Message from Agent on Load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
      const typingDelay = setTimeout(() => {
        setIsTyping(false);
        setMessages([
          {
            id: 1,
            sender: 'agent',
            text: 'Hola, vi que gestionan la logística del complejo hospitalario. ¿Cómo están resolviendo el abastecimiento de indumentaria clínica y batas de especialidad esta semana?',
            time: getCurrentTime()
          }
        ]);
      }, 1500);
      return () => clearTimeout(typingDelay);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Internal Chat Container Auto-scroll (Does NOT scroll the entire page window)
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || isTyping) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      time: getCurrentTime()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');

    // Simulate natural typing delay (1.5s to 2.2s)
    setIsTyping(true);
    const randomDelay = Math.floor(Math.random() * 700) + 1500;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await response.json();

      setTimeout(() => {
        setIsTyping(false);
        const agentMsg = {
          id: Date.now() + 1,
          sender: 'agent',
          text: data.text || 'Nos especializamos en distribución mayorista de insumos hospitalarios. ¿Podemos coordinar una breve llamada?',
          time: getCurrentTime()
        };
        setMessages(prev => [...prev, agentMsg]);

        if (data.triggerBooking || data.text?.includes('calendario de abajo')) {
          setTimeout(() => {
            if (onTriggerBooking) {
              onTriggerBooking();
            } else {
              const el = document.getElementById('booking-calendar');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }, 1200);
        }
      }, randomDelay);

    } catch (err) {
      console.error('Chat error:', err);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'agent',
            text: 'Perfecto. Cumplen con el perfil de distribución directa. Selecciona un bloque en el calendario de abajo para coordinar la llamada con nuestro especialista.',
            time: getCurrentTime()
          }
        ]);
        setTimeout(() => {
          const el = document.getElementById('booking-calendar');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 1000);
      }, 1500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 bg-white glass-card">
      
      {/* WhatsApp Institutional Header */}
      <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center font-bold text-amber-400 text-sm shadow">
              <Bot className="w-6 h-6 text-amber-400" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075E54] rounded-full"></span>
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="font-semibold text-sm leading-tight text-white">
                Agente Comercial de Abastecimiento
              </h3>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded border border-amber-400/40 font-mono">
                IA Mayorista
              </span>
            </div>
            <p className="text-xs text-emerald-100 font-light flex items-center space-x-1">
              {isTyping ? (
                <span className="text-amber-300 font-medium animate-pulse flex items-center">
                  Escribiendo...
                </span>
              ) : (
                <span>en línea • Suministros e Indumentaria Clínica</span>
              )}
            </p>
          </div>
        </div>

        {/* WhatsApp Actions Header */}
        <div className="flex items-center space-x-4 text-emerald-100">
          <button className="hover:text-white transition cursor-pointer hidden sm:block" title="Llamada de voz">
            <Phone className="w-5 h-5" />
          </button>
          <button className="hover:text-white transition cursor-pointer hidden sm:block" title="Videollamada">
            <Video className="w-5 h-5" />
          </button>
          <button className="hover:text-white transition cursor-pointer" title="Buscar en chat">
            <Search className="w-5 h-5" />
          </button>
          <button className="hover:text-white transition cursor-pointer" title="Opciones">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* WhatsApp Body Chat Area - FIXED CONTAINER SCROLL */}
      <div 
        ref={chatBodyRef}
        className="wa-bg-pattern h-[420px] overflow-y-auto p-4 md:p-6 space-y-4 relative"
      >
        {/* Security Encryption Notice */}
        <div className="flex justify-center my-2">
          <div className="bg-[#FFEECD] text-[#54656F] text-[11px] px-3 py-1.5 rounded-lg shadow-xs max-w-xs text-center border border-[#F4D9A0] font-sans">
            🔒 Los mensajes están cifrados de extremo a extremo. El asistente evalúa su abastecimiento institucional en tiempo real.
          </div>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm relative text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#D9FDD3] text-slate-800 rounded-tr-none border border-emerald-200/50'
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
              }`}
            >
              {msg.sender === 'agent' && (
                <div className="text-[11px] font-semibold text-emerald-800 mb-0.5 flex items-center space-x-1">
                  <span>Asistente Comercial</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1 rounded font-normal">Oficial</span>
                </div>
              )}

              <p className="whitespace-pre-line text-[13.5px] font-sans">{msg.text}</p>

              <div className={`text-[10px] mt-1 flex items-center justify-end space-x-1 ${
                msg.sender === 'user' ? 'text-emerald-700' : 'text-slate-400'
              }`}>
                <span>{msg.time}</span>
                {msg.sender === 'user' && (
                  <CheckCheck className="w-4 h-4 text-[#53bdeb]" />
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Dynamic Typing Indicator Bubble */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-slate-100 flex items-center space-x-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-typing-dot-1"></span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-typing-dot-2"></span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-typing-dot-3"></span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Response Chips */}
      <div className="bg-slate-50 border-t border-slate-200/80 p-2.5 px-4 flex flex-wrap gap-2 items-center text-xs">
        <span className="text-slate-400 font-medium text-[11px] mr-1">Pruebas rápidas:</span>
        <button
          onClick={() => handleSendMessage('Requerimos 2,000 batas clínicas e insumos esterilizados semanales.')}
          className="bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 hover:border-amber-300 rounded-full px-3 py-1 transition cursor-pointer shadow-2xs text-[11.5px]"
        >
          🏥 Pedido hospitalario masivo (Calificar)
        </button>
        <button
          onClick={() => handleSendMessage('¿Tienen pañales desechables y ropa de bebé?')}
          className="bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-800 border border-slate-200 hover:border-rose-300 rounded-full px-3 py-1 transition cursor-pointer shadow-2xs text-[11.5px]"
        >
          🚫 Probar tópico ajeno (Guardarraíl)
        </button>
        <button
          onClick={() => handleSendMessage('Necesitamos agendar una llamada con un especialista comercial urgente.')}
          className="bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded-full px-3 py-1 transition cursor-pointer shadow-2xs text-[11.5px]"
        >
          📅 Solicitar agendamiento comercial
        </button>
      </div>

      {/* WhatsApp Input Bar */}
      <div className="bg-[#F0F2F5] px-3 py-2.5 flex items-center space-x-2 border-t border-slate-200">
        <button className="text-slate-500 hover:text-slate-700 p-1.5 transition cursor-pointer" title="Emojis">
          <Smile className="w-6 h-6" />
        </button>
        <button className="text-slate-500 hover:text-slate-700 p-1.5 transition cursor-pointer" title="Adjuntar">
          <Paperclip className="w-5 h-5" />
        </button>
        
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje aquí..."
          className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 placeholder-slate-400 shadow-2xs"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isTyping}
          className={`p-2.5 rounded-full transition cursor-pointer flex items-center justify-center ${
            inputText.trim() && !isTyping
              ? 'bg-[#008069] hover:bg-[#075E54] text-white shadow-md'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
          title="Enviar mensaje"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
