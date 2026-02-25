import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../api/axios.js';
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
    const [messages, setMessages] = useState([]);
    const [loadMsgs, setLoadMsgs] = useState(false);
    const messagesAreaRef = useRef(null);

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
            // Usando el nuevo endpoint que consolida historial por cliente
            const response = await api.get('/chat/history/clients');
            setSessions(response.data.sessions || []);
        } catch (err) {
            console.error('[Bots] sessions:', err);
        } finally {
            setLoadSessions(false);
        }
    }, []);

    useEffect(() => { fetchSessions(); }, [fetchSessions]);

    // Fetch client messages when a client is selected
    useEffect(() => {
        if (!selectedSid) {
            setMessages([]);
            return;
        }
        const fetchMsgs = async () => {
            setLoadMsgs(true);
            try {
                // selectedSid is actually clientId in this view
                const { data } = await api.get(`/chat/history/messages/${selectedSid}`);
                setMessages(data.messages || []);
            } catch (e) {
                console.error('[Bots] messages:', e);
            } finally {
                setLoadMsgs(false);
            }
        };
        fetchMsgs();
    }, [selectedSid]);

    const handleSelect = (session) => {
        setSelected(session);
        setSelectedSid(session.id_sesion); // this is id_cliente from backend
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
                                            &nbsp;·&nbsp;Consolidado
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <button
                                        className="lc-icon-btn"
                                        onClick={() => {
                                            const sid = selectedSid;
                                            setSelectedSid(null);
                                            setTimeout(() => setSelectedSid(sid), 50);
                                        }}
                                        title="Refrescar mensajes"
                                    >🔄</button>
                                    <span className="lc-estado-badge lc-estado--bot" style={{ background: '#94a3b822', color: '#94a3b8', border: '1px solid #94a3b844' }}>
                                        Historial Completo
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};