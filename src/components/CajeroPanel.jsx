import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
// 1. IMPORTANTE: Importamos la librería del QR
import { QRCodeSVG } from 'qrcode.react';

const CajeroPanel = () => {
    const [ventas, setVentas] = useState([]);
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{"nombre":"Cajero", "id":0}');

    useEffect(() => {
        cargarVentas();
    }, []);

    const cargarVentas = () => {
        // Asegúrate que la ruta al PHP sea correcta
        axios.get('http://localhost/cine-pos-app/backend/misventas.php')
            .then(res => setVentas(res.data))
            .catch(err => console.error(err));
    };

    const totalDinero = ventas.reduce((acc, item) => acc + parseFloat(item.precio_boleto), 0);
    const totalBoletos = ventas.length;

    const handleCorteCaja = () => {
        Swal.fire({
            title: '✂️ ¿Cerrar Turno?',
            text: `Se generará un corte por $${totalDinero.toFixed(2)}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, Imprimir',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Pequeño retardo para asegurar que el DOM se actualice antes de imprimir
                setTimeout(() => window.print(), 500);
            }
        });
    };

    return (
        <div className="container mt-4">
            {/* ... (Toda la parte visual del dashboard sigue igual) ... */}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ margin: 0 }}>👋 Hola, {usuario.nombre}</h1>
                    <p style={{ color: '#888', margin: 0 }}>Resumen de operaciones del día</p>
                </div>
                <div>
                    <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginRight: '10px' }}>➕ Nueva Venta</button>
                    <button className="btn" onClick={() => navigate('/')} style={{ background: '#555' }}>🏠 Inicio</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div style={{ background: '#16213e', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #2ecc71' }}>
                    <h3 style={{ margin: 0, color: '#aaa', fontSize: '1rem' }}>Total Vendido</h3>
                    <h2 style={{ margin: '10px 0', fontSize: '2rem' }}>${totalDinero.toFixed(2)}</h2>
                </div>
                <div style={{ background: '#16213e', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #e94560' }}>
                    <h3 style={{ margin: 0, color: '#aaa', fontSize: '1rem' }}>Boletos Emitidos</h3>
                    <h2 style={{ margin: '10px 0', fontSize: '2rem' }}>{totalBoletos}</h2>
                </div>
                <div onClick={handleCorteCaja} style={{ background: '#0f3460', padding: '20px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #4db5ff' }}>
                    <h3 style={{ margin: 0, color: '#4db5ff' }}>✂️ Realizar Corte</h3>
                </div>
            </div>

            {/* TABLA DE HISTORIAL */}
            <div style={{ background: '#1a1a2e', borderRadius: '10px', overflow: 'hidden' }}>
                <h3 style={{ padding: '20px', margin: 0, background: '#16213e' }}>📜 Historial de Transacciones</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ background: '#0f3460', color: '#fff', textAlign: 'left' }}>
                                <th style={{ padding: '15px' }}>Hora</th>
                                <th style={{ padding: '15px' }}>Película</th>
                                <th style={{ padding: '15px' }}>Sala</th>
                                <th style={{ padding: '15px' }}>Asiento</th>
                                <th style={{ padding: '15px' }}>Importe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventas.length > 0 ? (
                                ventas.map((v) => (
                                    <tr key={v.id} style={{ borderBottom: '1px solid #333', fontSize: '0.9rem' }}>
                                        <td style={{ padding: '15px' }}>{new Date(v.fecha_venta).toLocaleTimeString()}</td>
                                        <td style={{ padding: '15px', fontWeight: 'bold' }}>{v.titulo}</td>
                                        <td style={{ padding: '15px' }}>{v.sala}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{ background: '#333', padding: '5px 10px', borderRadius: '4px', color: '#e94560', fontWeight: 'bold' }}>
                                                {v.fila_letra}-{v.columna_numero}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px', color: '#2ecc71' }}>${parseFloat(v.precio_boleto).toFixed(2)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#888' }}>
                                        No hay ventas registradas hoy.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ======================================================= */}
            {/* TICKET OCULTO CON CÓDIGO QR                             */}
            {/* ======================================================= */}
            <div id="printable-ticket" style={{ display: 'none' }}>
                <div style={{
                    fontFamily: 'monospace',
                    width: '300px',
                    margin: '0 auto',
                    padding: '10px',
                    color: 'black',
                    textAlign: 'center'
                }}>
                    <h3>CINE POS - CORTE</h3>
                    <p>Sucursal Centro</p>
                    <p>--------------------------------</p>

                    <p style={{ textAlign: 'left' }}><strong>Cajero:</strong> {usuario.nombre}</p>
                    <p style={{ textAlign: 'left' }}><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
                    <p style={{ textAlign: 'left' }}><strong>Hora:</strong> {new Date().toLocaleTimeString()}</p>

                    <p>--------------------------------</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Boletos:</span>
                        <strong>{totalBoletos}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', margin: '10px 0' }}>
                        <span>TOTAL:</span>
                        <strong>${totalDinero.toFixed(2)}</strong>
                    </div>

                    <p>--------------------------------</p>

                    {/* 2. AGREGAMOS EL QR AQUÍ */}
                    <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
                        <QRCodeSVG
                            value={`CORTE-${usuario.nombre}-${Date.now()}-${totalDinero}`}
                            size={100}
                        />
                    </div>

                    <p>__________________________</p>
                    <p>Firma de Supervisor</p>
                </div>
            </div>

        </div>
    );
};

export default CajeroPanel;