import { useEffect, useRef } from 'react';

/**
 * ChatWindow — área de mensajes reutilizable
 * Props:
 *   messages: [{ id_mensaje, remitente, contenido, fecha_creacion }]
 *   currentRole: 'usuario' | 'asesor'  (para saber cuál lado es "mío")
 */
export const ChatWindow = ({ messages = [], currentRole = 'usuario' }) => {
    const bottomRef = useRef(null);

    // Auto-scroll al fondo cuando llegan mensajes nuevos
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' });
    };

    if (messages.length === 0) {
        return (
            <div className="cw-empty">
                <span>💬</span>
                <p>No hay mensajes aún. ¡Inicia la conversación!</p>
            </div>
        );
    }

    return (
        <div className="cw-messages">
            {messages.map((msg) => {
                // Determinar alineación: si remitente === currentRole → burbuja propia (right)
                const isOwn = msg.remitente === currentRole;
                const isBot = msg.remitente === 'bot';

                let bubbleClass = 'cw-bubble';
                if (isOwn) bubbleClass += ' cw-bubble--own';
                else if (isBot) bubbleClass += ' cw-bubble--bot';
                else bubbleClass += ' cw-bubble--other';

                return (
                    <div key={msg.id_mensaje} className={`cw-row ${isOwn ? 'cw-row--right' : 'cw-row--left'}`}>
                        {/* Avatar */}
                        {!isOwn && (
                            <div className="cw-avatar">
                                {isBot ? '🤖' : '👨‍💼'}
                            </div>
                        )}
                        <div className="cw-bubble-wrapper">
                            <div className={bubbleClass}>
                                {msg.contenido}
                            </div>
                            <span className="cw-time">{formatTime(msg.fecha_creacion)}</span>
                        </div>
                    </div>
                );
            })}
            <div ref={bottomRef} />
        </div>
    );
};
