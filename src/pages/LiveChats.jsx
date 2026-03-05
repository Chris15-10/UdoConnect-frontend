import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../api/axios.js';
import { useRealtimeMessages } from '../hooks/useRealtimeMessages.js';
import { ChatList } from '../components/chat/ChatList.jsx';
import { ClientInfo } from './ClientInfo.jsx';
import '../components/chat/ChatWidget.css';
import './LiveChats.css';

// ── Componente de burbuja de mensaje ────────────────────────────────
const Bubble = ({ msg }) => {
  const isAsesor = msg.remitente === 'agente';
  const isBot = msg.remitente === 'bot';

  const formatTime = (d) => new Date(d).toLocaleTimeString('es-VE', {
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className={`lc-row ${isAsesor ? 'lc-row--right' : 'lc-row--left'}`}>
      {!isAsesor && (
        <div className="lc-avatar">{isBot ? '🤖' : '👤'}</div>
      )}
      <div className="lc-bubble-wrap">
        {!isAsesor && (
          <span className="lc-sender">
            {isBot ? 'Bot' : 'Cliente'}
          </span>
        )}
        <div className={`lc-bubble ${isAsesor ? 'lc-bubble--asesor' : isBot ? 'lc-bubble--bot' : 'lc-bubble--cliente'}`}>
          {msg.contenido}
        </div>
        <span className="lc-time">{formatTime(msg.fecha_creacion)}</span>
      </div>
    </div>
  );
};

// ── Página LiveChats ─────────────────────────────────────────────────
export const LiveChats = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelected] = useState(null);
  const [selectedSid, setSelectedSid] = useState(null);
  const [inputText, setInputText] = useState('');
  const [loadSessions, setLoadSessions] = useState(true);
  const [sending, setSending] = useState(false);
  const [showClientInfo, setShowClientInfo] = useState(false);
  const inputRef = useRef(null);
  const messagesAreaRef = useRef(null);

  // Hook compartido: historial inicial + suscripción Realtime.
  // skipRemitente='agente' → no duplicar los mensajes propios (Optimistic UI)
  const { messages, setMessages, loading: loadMsgs } = useRealtimeMessages(
    selectedSid, 'agente', 'advisor'
  );

  // ── Scroll al fondo del chat ──
  // 'instant' evita la animación desde arriba; solo se anima si ya
  // estamos cerca del fondo (mensajes nuevos del otro participante).
  const scrollToBottom = useCallback((behavior = 'instant') => {
    const el = messagesAreaRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  // Scroll al fondo cuando cambian los mensajes
  useEffect(() => {
    scrollToBottom('instant');
  }, [messages, scrollToBottom]);

  // ── Cargar sesiones al montar ──
  const fetchSessions = useCallback(async () => {
    setLoadSessions(true);
    try {
      const { data } = await api.get('/chat/sessions');
      setSessions(data.sessions || []);
    } catch (err) {
      console.error('[LiveChats] sessions:', err);
    } finally {
      setLoadSessions(false);
    }
  }, []);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const handleSelect = (session) => {
    setSelected(session);
    setSelectedSid(session.id_sesion); // dispara useRealtimeMessages
    setInputText('');
    setShowClientInfo(false); // al cambiar de sesión siempre volver al chat
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // ── Asesor envía mensaje ──
  const handleSend = async (e) => {
    e?.preventDefault();
    const text = inputText.trim();
    if (!text || !selectedSession || sending) return;

    setSending(true);
    setInputText('');

    // Insertar mensaje optimistamente en la UI
    const optimistic = {
      id_mensaje: Date.now(),
      remitente: 'agente',
      contenido: text,
      fecha_creacion: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);

    try {
      await api.post('/chat/advisor-message', {
        sessionId: selectedSession.id_sesion,
        content: text,
      });
      // Realtime traerá la confirmación del mensaje guardado
      // No necesitamos llamar a fetchMessages manualmente
    } catch (err) {
      console.error('[LiveChats] send:', err);
      // Si falla, retirar el mensaje optimista
      setMessages(prev => prev.filter(m => m.id_mensaje !== optimistic.id_mensaje));
      setInputText(text);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleEndSession = async () => {
    if (!selectedSession) return;
    if (!window.confirm("¿Seguro que deseas finalizar esta sesión y marcarla como resuelta?")) return;

    try {
      await api.post(`/chat/session/${selectedSession.id_sesion}/end`);
      setSelected(null);
      setSelectedSid(null);
      fetchSessions(); // Recargar la lista de chats abiertos
    } catch (e) {
      console.error('[LiveChats] end session:', e);
      alert('Error al finalizar la sesión');
    }
  };

  return (
    <div className="lc-page">
      {/* Encabezado */}
      <div className="lc-header">
        <div>
          <h1 className="lc-title">Chats en Tiempo Real</h1>
          <p className="lc-subtitle">Sesiones escaladas a asesor humano</p>
        </div>
        <button className="lc-refresh-btn" onClick={fetchSessions} title="Refrescar sesiones">
          🔄 Refrescar
        </button>
      </div>

      <div className="lc-container">
        {/* Panel izquierdo — lista */}
        <div className="lc-panel-left">
          <div className="lc-panel-head">
            <span>Sesiones escaladas</span>
            {sessions.length > 0 && (
              <span className="lc-count">{sessions.length}</span>
            )}
          </div>
          <ChatList
            sessions={sessions}
            selectedId={selectedSession?.id_sesion}
            onSelect={handleSelect}
            loading={loadSessions}
          />
        </div>

        {/* Panel derecho — chat */}
        <div className="lc-panel-right">
          {!selectedSession ? (
            <div className="lc-empty-state">
              <div className="lc-empty-icon">📡</div>
              <h3>Selecciona una sesión</h3>
              <p>Elige una conversación de la lista para comenzar a atender</p>
            </div>
          ) : showClientInfo ? (
            <ClientInfo
              session={selectedSession}
              onClose={() => setShowClientInfo(false)}
            />
          ) : (
            <div className="lc-chat">
              {/* Cabecera del chat */}
              <div className="lc-chat-header">
                <div className="lc-chat-client">
                  <div className="lc-chat-avatar">
                    {(selectedSession.nombre_cliente || 'C').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <button
                      className="lc-client-name-btn"
                      onClick={() => setShowClientInfo(true)}
                      title="Ver datos del cliente"
                    >
                      {selectedSession.nombre_cliente || 'Cliente'}
                    </button>
                    <div className="lc-chat-meta">
                      {selectedSession.canal === 'web' ? '🌐 Web' : '✈️ Telegram'}
                      &nbsp;·&nbsp;{selectedSession.id_sesion.slice(0, 8)}...
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button
                    className="btn btn-outline"
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', color: '#dc2626', borderColor: '#dc2626' }}
                    onClick={handleEndSession}
                    title="Finalizar esta sesión y marcarla como resuelta"
                  >Terminar</button>
                  <button
                    className="lc-icon-btn"
                    onClick={() => setSelectedSid(sid => { const s = sid; setSelectedSid(null); setTimeout(() => setSelectedSid(s), 0); return null; })
                    }
                    title="Refrescar mensajes"
                  >🔄</button>
                  <span className={`lc-estado-badge ${selectedSession.estado === 'derivada_humano' ? 'lc-estado--activo' : 'lc-estado--bot'}`}>
                    {selectedSession.estado === 'derivada_humano' ? '✅ Con asesor' : '🤖 Bot activo'}
                  </span>
                </div>
              </div>

              {/* Área de mensajes */}
              <div className="lc-messages-area" ref={messagesAreaRef}>
                {loadMsgs ? (
                  <div className="lc-loading">
                    <div className="cw-spinner" />
                    <span>Cargando mensajes...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="lc-loading">
                    <span style={{ opacity: 0.5 }}>Sin mensajes en esta sesión</span>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <Bubble key={msg.id_mensaje} msg={msg} />
                  ))
                )}
              </div>

              {/* Input del asesor */}
              <form className="lc-input-area" onSubmit={handleSend}>
                <input
                  ref={inputRef}
                  type="text"
                  className="lc-input"
                  placeholder="Escribe tu respuesta al cliente..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={sending}
                />
                <button
                  type="submit"
                  className="lc-send-btn"
                  disabled={sending || !inputText.trim()}
                >
                  {sending ? '...' : '➤'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};