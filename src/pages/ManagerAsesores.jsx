import { useState, useEffect } from 'react';
import { Search, User, Mail, Lock, Plus, Edit2, Check, X, Loader, Eye, EyeOff, AtSign, Phone, CreditCard, Trash2 } from 'lucide-react';
import { api } from '../api/axios.js';
import './ManagerClientes.css';
import './ManagerAsesores.css';

// ── Panel de edición de asesor ──────────────────────────────────
const AsesorPanel = ({ asesor, onClose, onSaved, onDeleted }) => {
    const [email, setEmail] = useState(asesor.email || '');
    const [password, setPassword] = useState('');
    const [cedula, setCedula] = useState(asesor.cedula || '');
    const [telefono, setTelefono] = useState(asesor.telefono || '');
    const [showPass, setShowPass] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [msg, setMsg] = useState('');
    const [isError, setIsError] = useState(false);

    const initial = (asesor.nombre || 'A').charAt(0).toUpperCase();

    const handleSave = async () => {
        setSaving(true); setMsg(''); setIsError(false); setDeleteConfirm(false);
        try {
            await api.put(`/manager/asesores/${asesor.id}`, {
                email: email || undefined,
                password: password || undefined,
                cedula: cedula || undefined,
                telefono: telefono || undefined,
            });
            setMsg('✓ Asesor actualizado correctamente.');
            setPassword('');
            onSaved();
        } catch (e) {
            setIsError(true);
            setMsg(e.response?.data?.message || 'Error al guardar.');
        } finally { setSaving(false); }
    };

    const handleDelete = async () => {
        if (!deleteConfirm) { setDeleteConfirm(true); return; }
        setDeleting(true); setMsg(''); setIsError(false);
        try {
            await api.delete(`/manager/asesores/${asesor.id}`);
            onDeleted();
        } catch (e) {
            setIsError(true);
            setMsg(e.response?.data?.message || 'Error al eliminar.');
            setDeleting(false);
            setDeleteConfirm(false);
        }
    };

    return (
        <div className="ci-panel">
            <div className="ci-header">
                <div className="ci-header-client">
                    <div className="ci-avatar">{initial}</div>
                    <div>
                        <div className="ci-header-name">{asesor.nombre}</div>
                        <div className="ci-header-sub">Editar información del asesor</div>
                    </div>
                </div>
                <button className="ci-close-btn" onClick={onClose} title="Cerrar"><X size={18} /></button>
            </div>

            <div className="ci-body">
                <div className="ci-avatar-block">
                    <div className="ci-avatar-lg">{initial}</div>
                    <div className="ci-avatar-name">{asesor.nombre}</div>
                    <div className="ci-avatar-badge">👤 Asesor</div>
                </div>

                <div className="ci-fields">
                    <div className="ci-field">
                        <div className="ci-field-label"><AtSign size={14} />Username</div>
                        <div className="ci-field-value">{asesor.username || <span className="ci-empty">—</span>}</div>
                    </div>
                </div>

                <div className="ma-edit-section">
                    <div className="ma-edit-title"><Edit2 size={14} /> Editar información</div>
                    <div className="ma-add-grid">
                        <div className="ma-field-group">
                            <label className="ma-label"><Mail size={13} /> Correo electrónico</label>
                            <input className="ma-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="correo@ejemplo.com" />
                        </div>
                        <div className="ma-field-group">
                            <label className="ma-label"><Lock size={13} /> Nueva contraseña <span className="ma-optional">(opcional)</span></label>
                            <div className="ma-pass-wrap">
                                <input className="ma-input" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Dejar vacío para no cambiar" />
                                <button className="ma-eye-btn" onClick={() => setShowPass(p => !p)} type="button">
                                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>
                        <div className="ma-field-group">
                            <label className="ma-label"><CreditCard size={13} /> Cédula</label>
                            <input className="ma-input" value={cedula} onChange={e => setCedula(e.target.value)} placeholder="Ej: 12345678" />
                        </div>
                        <div className="ma-field-group">
                            <label className="ma-label"><Phone size={13} /> Teléfono</label>
                            <input className="ma-input" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Ej: 04121234567" />
                        </div>
                    </div>
                    {msg && <p className={`ma-msg ${isError ? 'ma-msg--error' : 'ma-msg--ok'}`}>{msg}</p>}
                    <div className="ma-actions-row">
                        <button className="ma-save-btn" onClick={handleSave} disabled={saving || deleting}>
                            {saving ? <Loader size={15} className="ci-spinner" /> : <Check size={15} />}
                            {saving ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                        <button
                            className={`ma-delete-btn ${deleteConfirm ? 'ma-delete-btn--confirm' : ''}`}
                            onClick={handleDelete}
                            disabled={deleting}
                            onBlur={() => setDeleteConfirm(false)}
                        >
                            {deleting ? <Loader size={15} className="ci-spinner" /> : <Trash2 size={15} />}
                            {deleting ? 'Eliminando...' : deleteConfirm ? '¿Confirmar eliminación?' : 'Eliminar asesor'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Formulario para añadir asesor ──────────────────────────────
const AddAsesorForm = ({ onCreated }) => {
    const [form, setForm] = useState({ nombre: '', username: '', email: '', password: '', cedula: '', telefono: '' });
    const [showPass, setShowPass] = useState(false);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [isError, setIsError] = useState(false);

    const handleChange = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

    const handleCreate = async () => {
        if (!form.nombre || !form.username || !form.email || !form.password) {
            setIsError(true); setMsg('Nombre, username, correo y contraseña son obligatorios.'); return;
        }
        setSaving(true); setMsg(''); setIsError(false);
        try {
            await api.post('/manager/asesores', form);
            setMsg('✓ Asesor creado exitosamente.');
            setForm({ nombre: '', username: '', email: '', password: '', cedula: '', telefono: '' });
            onCreated();
        } catch (e) {
            setIsError(true);
            setMsg(e.response?.data?.message || 'Error al crear asesor.');
        } finally { setSaving(false); }
    };

    return (
        <div className="ma-add-form">
            <div className="ma-add-title"><Plus size={15} /> Añadir nuevo asesor</div>
            <div className="ma-add-grid">
                <div className="ma-field-group"><label className="ma-label">Nombre completo *</label><input className="ma-input" value={form.nombre} onChange={handleChange('nombre')} placeholder="Ej: Juan Pérez" /></div>
                <div className="ma-field-group"><label className="ma-label">Username *</label><input className="ma-input" value={form.username} onChange={handleChange('username')} placeholder="Ej: juanp" /></div>
                <div className="ma-field-group"><label className="ma-label">Correo *</label><input className="ma-input" type="email" value={form.email} onChange={handleChange('email')} placeholder="correo@ejemplo.com" /></div>
                <div className="ma-field-group">
                    <label className="ma-label">Contraseña *</label>
                    <div className="ma-pass-wrap">
                        <input className="ma-input" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange('password')} placeholder="Contraseña segura" />
                        <button className="ma-eye-btn" onClick={() => setShowPass(p => !p)} type="button">{showPass ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                    </div>
                </div>
                <div className="ma-field-group"><label className="ma-label">Cédula</label><input className="ma-input" value={form.cedula} onChange={handleChange('cedula')} placeholder="Ej: 12345678" /></div>
                <div className="ma-field-group"><label className="ma-label">Teléfono</label><input className="ma-input" value={form.telefono} onChange={handleChange('telefono')} placeholder="Ej: 04121234567" /></div>
            </div>
            {msg && <p className={`ma-msg ${isError ? 'ma-msg--error' : 'ma-msg--ok'}`}>{msg}</p>}
            <button className="ma-save-btn" onClick={handleCreate} disabled={saving}>
                {saving ? <Loader size={15} className="ci-spinner" /> : <Plus size={15} />}
                {saving ? 'Creando...' : 'Crear asesor'}
            </button>
        </div>
    );
};

// ── Página principal ────────────────────────────────────────────
export const ManagerAsesores = () => {
    const [asesores, setAsesores] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);

    const fetchAsesores = () => {
        setLoading(true);
        api.get('/manager/asesores')
            .then(({ data }) => { setAsesores(data.asesores); setFiltered(data.asesores); })
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchAsesores(); }, []);

    useEffect(() => {
        if (!search.trim()) { setFiltered(asesores); return; }
        const q = search.toLowerCase();
        setFiltered(asesores.filter(a =>
            a.nombre?.toLowerCase().includes(q) ||
            a.email?.toLowerCase().includes(q) ||
            a.username?.toLowerCase().includes(q)
        ));
    }, [search, asesores]);

    return (
        <div className="mc-container">
            <div className="mc-sidebar">
                <div className="mc-sidebar-header">
                    <div className="mc-sidebar-title">Asesores <span className="mc-count">{asesores.length}</span></div>
                </div>
                <div className="mc-search-wrap">
                    <Search size={15} className="mc-search-icon" />
                    <input className="mc-search-input" placeholder="Buscar por nombre, correo..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                <button className={`ma-add-toggle-btn ${showAdd ? 'ma-add-toggle-btn--active' : ''}`} onClick={() => { setShowAdd(p => !p); setSelected(null); }}>
                    <Plus size={14} />{showAdd ? 'Cancelar' : 'Añadir asesor'}
                </button>

                <div className="mc-list">
                    {loading ? (
                        <div className="mc-list-loading"><Loader size={20} className="ci-spinner" /> Cargando...</div>
                    ) : filtered.length === 0 ? (
                        <div className="mc-list-empty">No hay asesores</div>
                    ) : filtered.map(a => (
                        <li key={a.id} className={`mc-item ${selected?.id === a.id ? 'mc-item--active' : ''}`} onClick={() => { setSelected(a); setShowAdd(false); }}>
                            <div className="mc-item-avatar">{(a.nombre || 'A').charAt(0).toUpperCase()}</div>
                            <div className="mc-item-info">
                                <div className="mc-item-name">{a.nombre}</div>
                                <div className="mc-item-email">{a.email || a.username || '—'}</div>
                            </div>
                            <Edit2 size={13} className="mc-item-edit-icon" />
                        </li>
                    ))}
                </div>
            </div>

            <div className="mc-content">
                {showAdd ? (
                    <AddAsesorForm onCreated={() => { fetchAsesores(); setShowAdd(false); }} />
                ) : selected ? (
                    <AsesorPanel asesor={selected} onClose={() => setSelected(null)} onSaved={fetchAsesores} onDeleted={() => { setSelected(null); fetchAsesores(); }} />
                ) : (
                    <div className="mc-empty-state">
                        <User size={48} />
                        <p>Selecciona un asesor para editar su información<br />o usa "Añadir asesor" para crear uno nuevo.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
