import { useState, useEffect } from 'react';
import { User, Mail, CreditCard, Phone, AtSign, Package, X, Loader } from 'lucide-react';
import { api } from '../api/axios.js';
import './ClientInfo.css';

/**
 * ClientInfo — Panel de datos del cliente.
 * Se monta en el mismo espacio que lc-panel-right.
 *
 * Modos de uso:
 *   1. Desde LiveChats (sesión activa):
 *      <ClientInfo session={selectedSession} onClose={...} />
 *      → fetch por /chat/session/:id_sesion/client-profile
 *
 *   2. Desde Bots (historial):
 *      <ClientInfo clientId={id_cliente} session={selectedSession} onClose={...} />
 *      → fetch por /chat/client/:id_cliente/profile
 */
export const ClientInfo = ({ session, clientId, onClose }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const byClient = clientId != null;
        const bySession = session?.id_sesion != null;
        if (!byClient && !bySession) return;

        setLoading(true);
        setError('');
        setProfile(null);

        const url = byClient
            ? `/chat/client/${clientId}/profile`
            : `/chat/session/${session.id_sesion}/client-profile`;

        api.get(url)
            .then(({ data }) => setProfile(data.profile))
            .catch((err) => {
                console.error('[ClientInfo] fetch profile:', err);
                setError('No se pudo cargar la información del cliente.');
            })
            .finally(() => setLoading(false));
    }, [clientId, session?.id_sesion]);

    if (!session && clientId == null) return null;

    const initial = (session?.nombre_cliente || 'C').charAt(0).toUpperCase();
    const displayName = profile?.nombre || session?.nombre_cliente || 'Cliente';
    const canal = session?.canal || profile?.canal || 'web';

    return (
        <div className="ci-panel">
            {/* ── Cabecera ── */}
            <div className="ci-header">
                <div className="ci-header-client">
                    <div className="ci-avatar">{initial}</div>
                    <div>
                        <div className="ci-header-name">{displayName}</div>
                        <div className="ci-header-sub">Información del cliente</div>
                    </div>
                </div>
                <button className="ci-close-btn" onClick={onClose} title="Volver">
                    <X size={18} />
                </button>
            </div>

            {/* ── Cuerpo ── */}
            <div className="ci-body">
                {loading ? (
                    <div className="ci-loading">
                        <Loader size={22} className="ci-spinner" />
                        <span>Cargando datos del cliente...</span>
                    </div>
                ) : error ? (
                    <div className="ci-error">{error}</div>
                ) : (
                    <>
                        {/* Avatar grande */}
                        <div className="ci-avatar-block">
                            <div className="ci-avatar-lg">{initial}</div>
                            <div className="ci-avatar-name">{displayName}</div>
                            <div className="ci-avatar-badge">
                                {canal === 'web' ? '🌐 Web' : '✈️ Telegram'}
                            </div>
                        </div>

                        {/* Campos */}
                        <div className="ci-fields">

                            <div className="ci-field">
                                <div className="ci-field-label"><User size={14} />Nombre Completo</div>
                                <div className="ci-field-value">
                                    {profile?.nombre || <span className="ci-empty">Sin datos</span>}
                                </div>
                            </div>

                            <div className="ci-field">
                                <div className="ci-field-label"><AtSign size={14} />Nombre de Usuario</div>
                                <div className="ci-field-value">
                                    {profile?.username || <span className="ci-empty">—</span>}
                                </div>
                            </div>

                            <div className="ci-field">
                                <div className="ci-field-label"><Mail size={14} />Correo Electrónico</div>
                                <div className="ci-field-value">
                                    {profile?.email || <span className="ci-empty">—</span>}
                                </div>
                            </div>

                            <div className="ci-field">
                                <div className="ci-field-label"><CreditCard size={14} />Cédula de Identidad</div>
                                <div className="ci-field-value">
                                    {profile?.cedula || <span className="ci-empty">—</span>}
                                </div>
                            </div>

                            <div className="ci-field">
                                <div className="ci-field-label"><Phone size={14} />Teléfono</div>
                                <div className="ci-field-value">
                                    {profile?.telefono || <span className="ci-empty">—</span>}
                                </div>
                            </div>

                            {profile?.plan && (
                                <div className="ci-field ci-field--plan">
                                    <div className="ci-field-label"><Package size={14} />Plan Activo</div>
                                    <div className="ci-field-value ci-plan-name">
                                        {profile.plan.nombre.replace(/^\d+\.\s*/, '')}
                                    </div>
                                    {profile.plan.categoria && (
                                        <div className="ci-plan-meta">
                                            <span className="ci-plan-cat">{profile.plan.categoria}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
