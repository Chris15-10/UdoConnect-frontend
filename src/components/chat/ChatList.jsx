/**
 * ChatList — lista de sesiones para el panel de asesores
 * Props:
 *   sessions: [{ id_sesion, nombre_cliente, ultimo_mensaje, ultima_actividad, estado, canal }]
 *   selectedId: string | null
 *   onSelect: (session) => void
 *   loading: boolean
 */
export const ChatList = ({ sessions = [], selectedId, onSelect, loading }) => {
    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const now = new Date();
        const diffHours = (now - d) / 36e5;
        if (diffHours < 24) {
            return d.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' });
        }
        return d.toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit' });
    };

    const estadoBadge = (estado) => {
        const map = {
            derivada_humano: { label: 'Con asesor', color: '#10b981' },
            activa_bot: { label: 'Con bot', color: '#6366f1' },
            esperando_input: { label: 'Esperando', color: '#f59e0b' },
        };
        return map[estado] || { label: estado, color: '#94a3b8' };
    };

    const canalIcon = (canal) => ({ web: '🌐', telegram: '✈️' }[canal] || '💬');

    if (loading) {
        return (
            <div className="cl-loading">
                <div className="cl-spinner" />
                <span>Cargando sesiones...</span>
            </div>
        );
    }

    if (sessions.length === 0) {
        return (
            <div className="cl-empty">
                <span style={{ fontSize: '2rem' }}>✅</span>
                <p>Sin sesiones pendientes</p>
            </div>
        );
    }

    return (
        <div className="cl-list">
            {sessions.map((s) => {
                const badge = estadoBadge(s.estado);
                const isActive = s.id_sesion === selectedId;

                return (
                    <div
                        key={s.id_sesion}
                        className={`cl-item ${isActive ? 'cl-item--active' : ''}`}
                        onClick={() => onSelect(s)}
                    >
                        <div className="cl-avatar">
                            {canalIcon(s.canal)}
                        </div>
                        <div className="cl-info">
                            <div className="cl-header-row">
                                <span className="cl-name">{s.nombre_cliente || 'Cliente'}</span>
                                <span className="cl-time">{formatTime(s.ultima_actividad)}</span>
                            </div>
                            <div className="cl-preview-row">
                                <span className="cl-preview">{s.ultimo_mensaje || 'Sin mensajes'}</span>
                                <span
                                    className="cl-badge"
                                    style={{ background: badge.color + '22', color: badge.color }}
                                >
                                    {badge.label}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
