/**
 * useRealtimeMessages
 *
 * Hook reutilizable para ChatWidget (cliente) y LiveChats (asesor).
 * - Carga el historial inicial via REST cuando cambia sessionId.
 * - Se suscribe a INSERT en `mensajes` de Supabase Realtime.
 * - Filtra el remitente propio (skipRemitente) para evitar duplicados
 *   cuando se usa Optimistic UI al enviar.
 *
 * @param {string|null} sessionId      - ID de la sesión activa (null = sin suscripción)
 * @param {string}      skipRemitente  - Remitente propio a ignorar ('usuario' | 'agente')
 * @param {string}      channelPrefix  - Prefijo del canal Supabase (p.ej. 'widget' | 'advisor')
 */
import { useState, useEffect } from 'react';
import { api } from '../api/axios.js';
import { supabase } from '../lib/supabase.js';

export function useRealtimeMessages(sessionId, skipRemitente, channelPrefix = 'chat') {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    // ── Cargar historial inicial ──
    useEffect(() => {
        if (!sessionId) {
            setMessages([]);
            return;
        }
        let cancelled = false;
        setLoading(true);
        api.get(`/chat/messages/${sessionId}`)
            .then(({ data }) => {
                if (!cancelled) setMessages(data.messages || []);
            })
            .catch((err) => console.error('[useRealtimeMessages] fetch:', err))
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [sessionId]);

    // ── Suscripción Supabase Realtime ──
    useEffect(() => {
        if (!sessionId) return;

        const channel = supabase
            .channel(`${channelPrefix}-${sessionId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'mensajes',
                    filter: `id_sesion=eq.${sessionId}`,
                },
                (payload) => {
                    const nuevo = payload.new;
                    // Ignorar los mensajes propios (ya mostrados por Optimistic UI)
                    if (nuevo.remitente === skipRemitente) return;
                    setMessages(prev => [...prev, nuevo]);
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [sessionId, skipRemitente, channelPrefix]);

    return { messages, setMessages, loading };
}
