import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../api/axios.js';
import { useRealtimeMessages } from '../../hooks/useRealtimeMessages.js';
import { ChatWindow } from './ChatWindow.jsx';
import './ChatWidget.css';

export const ChatWidget = () => {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [loadingSession, setLoading] = useState(false);
    const [inputText, setInputText] = useState('');
    const [sending, setSending] = useState(false);

    // Hook compartido: carga historial + suscripción Realtime.
    // skipRemitente='usuario' → no duplicar los mensajes propios (Optimistic UI)
    const { messages, setMessages, loading: loadingMsgs } = useRealtimeMessages(
        sessionId,
        'usuario',
        'widget'
    );

    // ── Obtener/crear sesión (solo la primera vez que se abre) ──
    const initSession = useCallback(async () => {
        if (!isAuthenticated || sessionId) return;
        setLoading(true);
        try {
            const { data } = await api.post('/chat/session');
            setSessionId(data.sessionId);
            // El historial lo carga useRealtimeMessages automáticamente al recibir sessionId
        } catch (err) {
            console.error('[ChatWidget] init:', err);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, sessionId]);

    const handleOpen = () => {
        setIsOpen(true);
        initSession();
    };

    // ── Enviar mensaje (Optimistic UI) ──
    const handleSend = async (e) => {
        e?.preventDefault();
        if (!inputText.trim() || !sessionId || sending) return;
        setSending(true);
        const text = inputText.trim();
        setInputText('');

        // Mostrar el mensaje del usuario inmediatamente
        const optimistic = {
            id_mensaje: `opt-${Date.now()}`,
            remitente: 'usuario',
            contenido: text,
            fecha_creacion: new Date().toISOString(),
        };
        setMessages(prev => [...prev, optimistic]);

        try {
            await api.post('/chat/message', { sessionId, content: text });
            // La respuesta del bot (remitente='bot') llega por Realtime automáticamente
        } catch (err) {
            console.error('[ChatWidget] send:', err);
            setMessages(prev => prev.filter(m => m.id_mensaje !== optimistic.id_mensaje));
            setInputText(text);
        } finally {
            setSending(false);
        }
    };

    if (authLoading) return null;

    const showLoading = loadingSession || (sessionId && loadingMsgs);

    return (
        <div className="chat-widget">
            {isOpen && (
                <div className="cw-panel">
                    <div className="cw-panel-header">
                        <div className="cw-panel-title">
                            <span className="cw-online-dot" />
                            <span>Chat UdoConnect</span>
                        </div>
                        <button className="cw-close-btn" onClick={() => setIsOpen(false)}>✕</button>
                    </div>

                    <div className="cw-panel-body">
                        {!isAuthenticated ? (
                            <div className="cw-login-prompt">
                                <span style={{ fontSize: '2.5rem' }}>🔒</span>
                                <h4>Inicia sesión para chatear</h4>
                                <p>Necesitas una cuenta para acceder al soporte en vivo.</p>
                                <Link to="/login" className="btn btn-primary btn-sm" onClick={() => setIsOpen(false)}>
                                    Iniciar sesión
                                </Link>
                            </div>
                        ) : showLoading ? (
                            <div className="cw-loading">
                                <div className="cw-spinner" />
                                <span>Conectando...</span>
                            </div>
                        ) : (
                            <ChatWindow messages={messages} currentRole="usuario" />
                        )}
                    </div>

                    {isAuthenticated && !showLoading && (
                        <form className="cw-panel-footer" onSubmit={handleSend}>
                            <input
                                type="text"
                                className="cw-input"
                                placeholder="Escribe un mensaje..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                disabled={sending}
                                autoFocus
                            />
                            <button type="submit" className="cw-send-btn" disabled={sending || !inputText.trim()}>
                                {sending ? '...' : '➤'}
                            </button>
                        </form>
                    )}
                </div>
            )}

            <button
                className={`cw-fab ${isOpen ? 'cw-fab--open' : ''}`}
                onClick={isOpen ? () => setIsOpen(false) : handleOpen}
                aria-label="Abrir chat"
            >
                {isOpen ? '✕' : '💬'}
            </button>
        </div>
    );
};
