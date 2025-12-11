import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HistorialVentas = () => {
    const [ventas, setVentas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // En un sistema real enviaríamos el ID del usuario
        axios.get('http://localhost/cine-pos-app/backend/misventas.php')
            .then(res => setVentas(res.data))
            .catch(err => console.error(err));
    }, []);

    // Calcular el total vendido hoy
    const totalDia = ventas.reduce((acc, item) => acc + parseFloat(item.precio_boleto), 0);

    return (
        <div className="container mt-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>📋 Ventas del Día</h2>
                <button className="btn" onClick={() => navigate('/')} style={{ background: '#555' }}>
                    🏠 Volver
                </button>
            </div>

            <div style={{ background: '#16213e', padding: '20px', borderRadius: '10px', marginTop: '20px' }}>
                <h3 style={{ color: '#4db5ff' }}>Total en Caja: ${totalDia.toFixed(2)}</h3>
                <p>Boletos vendidos hoy: {ventas.length}</p>
            </div>

            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#0f3460', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Hora Venta</th>
                        <th style={{ padding: '10px' }}>Película</th>
                        <th style={{ padding: '10px' }}>Asiento</th>
                        <th style={{ padding: '10px' }}>Precio</th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.map(v => (
                        <tr key={v.id} style={{ borderBottom: '1px solid #333' }}>
                            <td style={{ padding: '10px' }}>{new Date(v.fecha_venta).toLocaleTimeString()}</td>
                            <td style={{ padding: '10px' }}>{v.titulo} <br /><small style={{ color: '#888' }}>{v.sala}</small></td>
                            <td style={{ padding: '10px', fontWeight: 'bold', color: '#e94560' }}>
                                {v.fila_letra}-{v.columna_numero}
                            </td>
                            <td style={{ padding: '10px' }}>${v.precio_boleto}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistorialVentas;