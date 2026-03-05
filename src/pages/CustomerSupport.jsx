// src/pages/CustomerSupport.jsx
import { useState, useEffect } from 'react';
import { api } from '../api/axios'; // Asegúrate de importar tu cliente Axios

export const CustomerSupport = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Cargar historial (simulado por ahora)
  useEffect(() => {
    // Aquí luego llamarás a: api.get('/messages')
    setMessages([
      { id: 1, text: "¡Hola! Quiero contratar fibra óptica.", sender: "user" },
      { id: 2, text: "¡Hola! Claro que sí. ¿Cuál es tu dirección?", sender: "bot" }
    ]);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Agregar mensaje del usuario
    const userMessage = { id: Date.now(), text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // 2. Enviar al Backend (Tu API de Python)
      // Asegúrate de que tu backend exponga este endpoint
      const response = await api.post('/chat/send', { message: input });
      
      // 3. Agregar respuesta del Bot
      const botMessage = { id: Date.now() + 1, text: response.data.reply, sender: "bot" };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Error enviando mensaje:", error);
      const errorMsg = { id: Date.now() + 1, text: "Error de conexión.", sender: "bot" };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header del Chat */}
      <div className="bg-white border-b p-4 shadow-sm">
        <h1 className="text-xl font-bold text-indigo-600">Soporte en Vivo</h1>
        <p className="text-sm text-gray-500">Conectado con InternetConnect AI</p>
      </div>

      {/* Contenedor de Mensajes */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'user' 
              ? 'bg-indigo-600 text-white rounded-br-none' 
              : 'bg-gray-200 text-gray-800 rounded-bl-none'
            }`}>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-500 text-sm">Escribiendo...</div>}
      </div>

      {/* Input de Mensaje */}
      <div className="bg-white border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu mensaje..."
            className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};