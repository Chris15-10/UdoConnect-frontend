import { useState, useEffect } from 'react';
import { Loader, Package, Tag, Pencil, X, Check } from 'lucide-react';
import { api } from '../api/axios.js';
import './ManagerPlanes.css';

// ── Paleta por categoría ────────────────────────────────────────
const CAT_COLORS = {
    tv: { accent: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', icon: '📺' },
    internet: { accent: '#06b6d4', bg: 'rgba(6,182,212,0.08)', icon: '🌐' },
    combo: { accent: '#1de9b6', bg: 'rgba(29,233,182,0.08)', icon: '📦' },
    telefonia: { accent: '#f59e0b', bg: 'rgba(245,158,11,0.08)', icon: '📞' },
    default: { accent: '#64748b', bg: 'rgba(100,116,139,0.08)', icon: '🗂' },
};
const catStyle = cat => CAT_COLORS[cat?.toLowerCase()] || CAT_COLORS.default;

// ── Tarjeta de plan ─────────────────────────────────────────────
const PlanCard = ({ plan, onSaved }) => {
    const [editing, setEditing] = useState(false);
    const [precio, setPrecio] = useState(plan.precio);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const cs = catStyle(plan.categoria);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put(`/manager/planes/${plan.id_plan}`, { precio: Number(precio) });
            setSaved(true);
            setEditing(false);
            onSaved();
            setTimeout(() => setSaved(false), 2000);
        } catch (e) {
            alert(e.response?.data?.message || 'Error al guardar');
        } finally { setSaving(false); }
    };

    const handleCancel = () => { setPrecio(plan.precio); setEditing(false); };

    return (
        <div className="mp-card" style={{ '--accent': cs.accent, '--bg': cs.bg }}>
            {/* Header */}
            <div className="mp-card-header">
                <span className="mp-cat-icon">{cs.icon}</span>
                <div className="mp-card-title-wrap">
                    <div className="mp-card-name">{plan.nombre}</div>
                    <div className="mp-card-cat">{plan.categoria || 'Sin categoría'}</div>
                </div>
            </div>

            {/* Precio */}
            <div className="mp-price-wrap">
                <span className="mp-currency">$</span>
                {editing ? (
                    <input
                        className="mp-input mp-input--price"
                        type="number" min="0" step="0.01"
                        value={precio}
                        onChange={e => setPrecio(e.target.value)}
                        autoFocus
                    />
                ) : (
                    <span className="mp-price">{Number(precio).toFixed(2)}</span>
                )}
                <span className="mp-period">/mes</span>
            </div>

            {/* Acciones */}
            <div className="mp-card-actions">
                {editing ? (
                    <>
                        <button className="mp-btn mp-btn--save" onClick={handleSave} disabled={saving}>
                            {saving ? <Loader size={13} className="ci-spinner" /> : <Check size={13} />}
                            {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button className="mp-btn mp-btn--cancel" onClick={handleCancel}><X size={13} /> Cancelar</button>
                    </>
                ) : (
                    <button className={`mp-btn mp-btn--edit ${saved ? 'mp-btn--saved' : ''}`} onClick={() => setEditing(true)}>
                        {saved ? <><Check size={13} /> Guardado</> : <><Pencil size={13} /> Editar precio</>}
                    </button>
                )}
            </div>
        </div>
    );
};

// ── Página principal ────────────────────────────────────────────
const CAT_TABS = ['Todos', 'TV', 'Internet', 'Combo', 'Telefonía'];

export const ManagerPlanes = () => {
    const [planes, setPlanes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabCat, setTabCat] = useState('Todos');

    const fetchPlanes = () => {
        setLoading(true);
        api.get('/manager/planes')
            .then(({ data }) => setPlanes(Array.isArray(data) ? data : data.planes || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchPlanes(); }, []);

    const filtered = tabCat === 'Todos'
        ? planes
        : planes.filter(p => p.categoria?.toLowerCase() === tabCat.toLowerCase());

    return (
        <div className="mp-page">
            {/* Header */}
            <div className="mp-header">
                <div>
                    <h1 className="mp-title"><Package size={22} /> Planes y Precios</h1>
                    <p className="mp-subtitle">Gestiona los precios del catálogo de planes</p>
                </div>
                <div className="mp-stat">
                    <span className="mp-stat-val">{planes.length}</span>
                    <span className="mp-stat-label">Total planes</span>
                </div>
            </div>

            {/* Filtros por categoría */}
            <div className="mp-cat-tabs">
                {CAT_TABS.map(cat => (
                    <button key={cat} className={`mp-cat-tab ${tabCat === cat ? 'mp-cat-tab--active' : ''}`} onClick={() => setTabCat(cat)}>
                        {cat === 'Todos' ? <Tag size={13} /> : catStyle(cat).icon} {cat}
                    </button>
                ))}
            </div>

            {/* Grid de tarjetas */}
            {loading ? (
                <div className="mp-loading"><Loader size={24} className="ci-spinner" /> Cargando planes...</div>
            ) : filtered.length === 0 ? (
                <div className="mp-empty">No hay planes en esta categoría.</div>
            ) : (
                <div className="mp-grid">
                    {filtered.map(plan => (
                        <PlanCard key={plan.id_plan} plan={plan} onSaved={fetchPlanes} />
                    ))}
                </div>
            )}
        </div>
    );
};
