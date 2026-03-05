import { useState, useEffect } from 'react';
import { Search, User, Mail, CreditCard, Phone, AtSign, Package, X, Loader } from 'lucide-react';
import { api } from '../api/axios.js';
import './ManagerClientes.css';

// Panel de perfil inline — usa el endpoint del manager (evita problemas de overflow con IDs Telegram)
const ClientProfilePanel = ({ idCliente, nombreCliente, onClose }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!idCliente) return;
        setLoading(true);
        setError('');
        setProfile(null);
        api.get(`/manager/client/${idCliente}/profile`)
            .then(({ data }) => setProfile(data.profile))
            .catch(() => setError('No se pudo cargar la información del cliente.'))
            .finally(() => setLoading(false));
    }, [idCliente]);

    const initial = (nombreCliente || 'C').charAt(0).toUpperCase();
    const displayName = profile?.nombre || nombreCliente || 'Cliente';
    const canal = profile?.canal || 'web';

    return (
        <div className="ci-panel">
            <div className="ci-header">
                <div className="ci-header-client">
                    <div className="ci-avatar">{initial}</div>
                    <div>
                        <div className="ci-header-name">{displayName}</div>
                        <div className="ci-header-sub">Información del cliente</div>
                    </div>
                </div>
                <button className="ci-close-btn" onClick={onClose} title="Cerrar">
                    <X size={18} />
                </button>
            </div>

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
                        <div className="ci-avatar-block">
                            <div className="ci-avatar-lg">{initial}</div>
                            <div className="ci-avatar-name">{displayName}</div>
                            <div className="ci-avatar-badge">
                                {canal === 'web' ? '🌐 Web' : '✈️ Telegram'}
                            </div>
                        </div>

                        <div className="ci-fields">
                            <div className="ci-field">
                                <div className="ci-field-label"><User size={14} />Nombre Completo</div>
                                <div className="ci-field-value">{profile?.nombre || <span className="ci-empty">Sin datos</span>}</div>
                            </div>
                            <div className="ci-field">
                                <div className="ci-field-label"><AtSign size={14} />Nombre de Usuario</div>
                                <div className="ci-field-value">{profile?.username || <span className="ci-empty">—</span>}</div>
                            </div>
                            <div className="ci-field">
                                <div className="ci-field-label"><Mail size={14} />Correo Electrónico</div>
                                <div className="ci-field-value">{profile?.email || <span className="ci-empty">—</span>}</div>
                            </div>
                            <div className="ci-field">
                                <div className="ci-field-label"><CreditCard size={14} />Cédula de Identidad</div>
                                <div className="ci-field-value">{profile?.cedula || <span className="ci-empty">—</span>}</div>
                            </div>
                            <div className="ci-field">
                                <div className="ci-field-label"><Phone size={14} />Teléfono</div>
                                <div className="ci-field-value">{profile?.telefono || <span className="ci-empty">—</span>}</div>
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

export const ManagerClientes = () => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [selectedClientId, setSelectedClientId] = useState(null);

    useEffect(() => {
        api.get('/manager/dashboard')
            .then(({ data }) => {
                setClientes(data.clientesRegistrados || []);
            })
            .catch((err) => {
                setError(err?.response?.data?.message || 'Error cargando clientes');
            })
            .finally(() => setLoading(false));
    }, []);

    const filtered = clientes.filter((c) => {
        const q = search.toLowerCase();
        return (
            (c.nombre_cliente || '').toLowerCase().includes(q) ||
            (c.email || '').toLowerCase().includes(q) ||
            (c.username || '').toLowerCase().includes(q) ||
            (c.cedula || '').toLowerCase().includes(q)
        );
    });

    const selectedCliente = clientes.find((c) => c.id_cliente === selectedClientId);

    return (
        <div className="mc-shell">
            {/* ── Lista de clientes ── */}
            <div className={`mc-list-col ${selectedClientId ? 'mc-list-col--narrow' : ''}`}>
                <div className="mc-list-header">
                    <h2 className="mc-list-title">Clientes Registrados</h2>
                    <span className="mc-list-count">{filtered.length}</span>
                </div>

                <div className="mc-search-wrap">
                    <Search size={15} className="mc-search-icon" />
                    <input
                        className="mc-search-input"
                        type="text"
                        placeholder="Buscar por nombre, correo, usuario..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="mc-state">⏳ Cargando clientes...</div>
                ) : error ? (
                    <div className="mc-state mc-state--error">⚠️ {error}</div>
                ) : filtered.length === 0 ? (
                    <div className="mc-state">No se encontraron clientes.</div>
                ) : (
                    <ul className="mc-list">
                        {filtered.map((cliente) => {
                            const initial = (cliente.nombre_cliente || 'C').charAt(0).toUpperCase();
                            const isSelected = cliente.id_cliente === selectedClientId;
                            return (
                                <li
                                    key={cliente.id_cliente}
                                    className={`mc-item ${isSelected ? 'mc-item--active' : ''}`}
                                    onClick={() =>
                                        setSelectedClientId(isSelected ? null : cliente.id_cliente)
                                    }
                                >
                                    <div className="mc-item-avatar">{initial}</div>
                                    <div className="mc-item-info">
                                        <span className="mc-item-name">
                                            {cliente.nombre_cliente || 'Sin nombre'}
                                        </span>
                                        <span className="mc-item-sub">
                                            {cliente.email || cliente.username || '—'}
                                        </span>
                                    </div>
                                    {cliente.cedula && (
                                        <span className="mc-item-cedula">{cliente.cedula}</span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {/* ── Panel de perfil ── */}
            {selectedClientId && (
                <div className="mc-profile-col">
                    <ClientProfilePanel
                        idCliente={selectedClientId}
                        nombreCliente={selectedCliente?.nombre_cliente}
                        onClose={() => setSelectedClientId(null)}
                    />
                </div>
            )}
        </div>
    );
};
