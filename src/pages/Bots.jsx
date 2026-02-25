import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../api/axios.js';
import { useRealtimeMessages } from '../hooks/useRealtimeMessages.js';
import { ChatList } from '../components/chat/ChatList.jsx';
import '../components/chat/ChatWidget.css';
import './Bots.css';

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

// ── Página Bots ─────────────────────────────────────────────────
export const Bots = () => {
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelected] = useState(null);
    const [selectedSid, setSelectedSid] = useState(null);
    const [loadSessions, setLoadSessions] = useState(true);
    const messagesAreaRef = useRef(null);

    // Hook compartido para cargar mensajes de la sesión
    const { messages, loading: loadMsgs } = useRealtimeMessages(
        selectedSid, 'agente', 'advisor'
    );

    const scrollToBottom = useCallback((behavior = 'instant') => {
        const el = messagesAreaRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, []);

    useEffect(() => {
        scrollToBottom('instant');
    }, [messages, scrollToBottom]);

    const fetchSessions = useCallback(async () => {
        setLoadSessions(true);
        try {
            // Intentamos obtener las sesiones, pidiendo que vengan las que esten cerradas o directamente del endpoint regular 
            // y filtramos localmente asumiendo que el api las podría retornar, o si no, el query 'estado=cerrada' podria ser soportado.
            let response;
            try {
                response = await api.get('/chat/sessions', { params: { estado: 'cerrada' } });
            } catch (e) {
                response = await api.get('/chat/sessions');
            }

            const allSessions = response.data.sessions || [];
            // Filtramos las cerradas por parte del frontend para asegurar que solo se muestre el historial de la DB de sesiones finalizadas
            const historySessions = allSessions.filter(s => s.estado === 'cerrada' || s.estado === 'resuelta' || s.estado === 'finalizada' || (s.estado !== 'derivada_humano' && s.estado !== 'activa_bot' && s.estado !== 'esperando_input'));

            setSessions(historySessions.length > 0 ? historySessions : allSessions);
            // Nota: Si el endpoint ya filtró correctamente, o si queremos mostrar todas las sesiones de bot finalizadas
        } catch (err) {
            console.error('[Bots] sessions:', err);
        } finally {
            setLoadSessions(false);
        }
    }, []);

    useEffect(() => { fetchSessions(); }, [fetchSessions]);

    const handleSelect = (session) => {
        setSelected(session);
        setSelectedSid(session.id_sesion);
    };

    return (
        <div className="lc-page">
            <div className="lc-header">
                <div>
                    <h1 className="lc-title">Historial de Bots</h1>
                    <p className="lc-subtitle">Registro de chats y consultas cerradas de los usuarios</p>
                </div>
                <button className="lc-refresh-btn" onClick={fetchSessions} title="Refrescar historial">
                    🔄 Refrescar
                </button>
            </div>

            <div className="lc-container">
                <div className="lc-panel-left">
                    <div className="lc-panel-head">
                        <span>Historial</span>
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

                <div className="lc-panel-right">
                    {!selectedSession ? (
                        <div className="lc-empty-state">
                            <div className="lc-empty-icon">🗄️</div>
                            <h3>Selecciona una consulta cerrada</h3>
                            <p>Revisa el historial de la conversación pasada</p>
                        </div>
                    ) : (
                        <div className="lc-chat">
                            <div className="lc-chat-header">
                                <div className="lc-chat-client">
                                    <div className="lc-chat-avatar">
                                        {(selectedSession.nombre_cliente || 'C').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="lc-chat-name">
                                            {selectedSession.nombre_cliente || 'Cliente'}
                                        </div>
                                        <div className="lc-chat-meta">
                                            {selectedSession.canal === 'web' ? '🌐 Web' : '✈️ Telegram'}
                                            &nbsp;·&nbsp;{selectedSession.id_sesion.slice(0, 8)}...
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <button
                                        className="lc-icon-btn"
                                        onClick={() => setSelectedSid(sid => { const s = sid; setSelectedSid(null); setTimeout(() => setSelectedSid(s), 0); return null; })}
                                        title="Refrescar mensajes"
                                    >🔄</button>
                                    <span className="lc-estado-badge lc-estado--bot" style={{ background: '#94a3b822', color: '#94a3b8', border: '1px solid #94a3b844' }}>
                                        {selectedSession.estado === 'cerrada' || selectedSession.estado === 'resuelta' ? 'Cerrada' : selectedSession.estado}
                                    </span>
                                </div>
                            </div>

                            <div className="lc-messages-area" ref={messagesAreaRef}>
                                {loadMsgs ? (
                                    <div className="lc-loading">
                                        <div className="cw-spinner" />
                                        <span>Cargando historial...</span>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="lc-loading">
                                        <span style={{ opacity: 0.5 }}>Sin registro de mensajes</span>
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <Bubble key={msg.id_mensaje} msg={msg} />
                                    ))
                                )}
                            </div>

                            {/* Input section removed since it's history-only viewing */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};