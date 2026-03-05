import { useState, useEffect } from "react";
import "./ManagerDashboard.css";
import { api } from "../api/axios.js";

export const ManagerDashboard = () => {
    const [data, setData] = useState({
        financiero: { totalRecaudado: 0, totalPorCobrar: 0 },
        planes: [],
        planesCatalogo: [],
        empleados: [],
        clientesConDeudas: [],
        clientesRegistrados: [],
        nuevasContrataciones: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [savingPlanId, setSavingPlanId] = useState(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const res = await api.get("/manager/dashboard");
                // Normalize: garantizar que nuevasContrataciones sea siempre un array
                setData({
                    financiero: { totalRecaudado: 0, totalPorCobrar: 0 },
                    planes: [],
                    planesCatalogo: [],
                    empleados: [],
                    clientesConDeudas: [],
                    clientesRegistrados: [],
                    nuevasContrataciones: [],
                    ...res.data,
                });
            } catch (err) {
                const msg = err?.response?.data?.message || err.message || "Error cargando panel";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const handlePriceChange = (id_plan, newPrecio) => {
        setData(prev => ({
            ...prev,
            planesCatalogo: prev.planesCatalogo.map(p =>
                p.id_plan === id_plan ? { ...p, precio: newPrecio } : p
            ),
        }));
    };

    const handleSavePlan = async (plan) => {
        setSavingPlanId(plan.id_plan);
        try {
            const res = await api.put(`/manager/planes/${plan.id_plan}`, {
                precio: Number(plan.precio),
                activo: plan.activo,
            });

            setData(prev => ({
                ...prev,
                planesCatalogo: prev.planesCatalogo.map(p =>
                    p.id_plan === plan.id_plan ? { ...p, ...res.data } : p
                ),
            }));
        } catch (err) {
            const msg = err?.response?.data?.message || "Error al guardar el plan";
            alert(msg);
        } finally {
            setSavingPlanId(null);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#1de9b6', fontSize: '1.2rem', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.8rem' }}>⏳</span> Cargando Panel de Gerente...
        </div>
    );
    if (error) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
            <span style={{ fontSize: '2.5rem' }}>⚠️</span>
            <p style={{ color: '#ff5252', fontSize: '1.1rem', fontWeight: '600', textAlign: 'center' }}>{error}</p>
            <button onClick={() => window.location.reload()} style={{ background: 'rgba(29,233,182,0.15)', border: '1px solid #1de9b6', color: '#1de9b6', padding: '0.5rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>Reintentar</button>
        </div>
    );

    return (
        <div className="manager-dashboard">
            <header className="manager-header">
                <h1>Panel de Gerente</h1>
                <p>Visión ejecutiva de clientes, deudas, planes y equipo.</p>
            </header>

            {/* KPI Cards */}
            <section className="manager-kpis">
                <div className="kpi-card kpi-recaudado">
                    <h3>Ingresos Recaudados</h3>
                    <p className="kpi-value">${data.financiero.totalRecaudado.toFixed(2)}</p>
                </div>
                <div className="kpi-card kpi-por-cobrar">
                    <h3>Cuentas por Cobrar (Deuda)</h3>
                    <p className="kpi-value">${data.financiero.totalPorCobrar.toFixed(2)}</p>
                </div>
                <div className="kpi-card kpi-clientes">
                    <h3>Clientes en Mora</h3>
                    <p className="kpi-value">{data.clientesConDeudas.filter(c => c.total_deuda > 0).length}</p>
                </div>
            </section>

            <div className="manager-grid">
                {/* Left Column: Clients & Debts */}
                <section className="manager-section manager-table-container">
                    <h2>Clientes y Deudas</h2>
                    {data.clientesConDeudas.length === 0 ? (
                        <p className="manager-empty">No hay clientes con deuda registrada.</p>
                    ) : (
                        <table className="manager-table">
                            <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>Cédula</th>
                                    <th>Facturas Pendientes</th>
                                    <th>Deuda Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.clientesConDeudas.map((cliente) => (
                                    <tr key={cliente.id_cliente}>
                                        <td>{cliente.nombre_cliente || "Desconocido"}</td>
                                        <td>{cliente.cedula || "N/A"}</td>
                                        <td className="text-center">{cliente.cantidad_facturas_pendientes}</td>
                                        <td className="text-right text-danger">${Number(cliente.total_deuda).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>

                {/* Right Column: Plans & Employees */}
                <div className="manager-side-grid">

                    <section className="manager-section">
                        <h2>Planes más contratados</h2>
                        {data.planes.length === 0 ? (
                            <p className="manager-empty">No hay datos de planes.</p>
                        ) : (
                            <ul className="manager-list">
                                {data.planes.map((plan) => (
                                    <li key={plan.id_plan} className="manager-list-item">
                                        <span className="plan-name">{plan.nombre}</span>
                                        <span className="plan-count badge">{plan.cantidad} contratos</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section className="manager-section">
                        <h2>Asesores y Empleados</h2>
                        {data.empleados.length === 0 ? (
                            <p className="manager-empty">No hay empleados registrados.</p>
                        ) : (
                            <ul className="manager-list">
                                {data.empleados.map((emp) => (
                                    <li key={emp.id} className="manager-list-item employee-item">
                                        <div>
                                            <span className="employee-name">{emp.nombre}</span>
                                            <span className="employee-user">@{emp.username}</span>
                                        </div>
                                        <span className={`badge ${emp.rol} `}>{emp.rol}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                </div>
            </div>


        </div>
    );
};
