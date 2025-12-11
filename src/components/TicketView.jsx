import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const TicketView = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Recibimos los datos de la venta desde la pantalla anterior
    const { venta } = location.state || {};

    if (!venta) return <div className="text-center mt-5">No hay datos de venta.</div>;

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px' }}>

            <h2 style={{ marginBottom: '20px' }}>¡Venta Completada! ✅</h2>

            {/* --- ESTE ES EL TICKET VISUAL --- */}
            <div style={{
                backgroundColor: '#fff',
                color: '#000',
                width: '300px',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                fontFamily: 'monospace' // Fuente tipo ticket
            }}>
                <div style={{ textAlign: 'center', borderBottom: '2px dashed #000', paddingBottom: '10px', marginBottom: '10px' }}>
                    <h3>CINE POS 🍿</h3>
                    <p>Sucursal Centro</p>
                </div>

                <p><strong>Película:</strong> {venta.titulo}</p>
                <p><strong>Sala:</strong> {venta.sala}</p>
                <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Hora:</strong> {new Date().toLocaleTimeString()}</p>

                <div style={{ borderTop: '1px solid #000', borderBottom: '1px solid #000', margin: '10px 0', padding: '10px 0' }}>
                    <p><strong>Asientos:</strong> {venta.asientos.join(', ')}</p>
                    <p><strong>Total Pagado:</strong> ${venta.total}</p>
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <p style={{ fontSize: '12px', marginBottom: '5px' }}>Escanear para entrar</p>
                    {/* Generamos un QR único con los datos de la venta */}
                    <QRCodeSVG value={`TICKET-${venta.funcion_id}-${venta.asientos.join('')}`} size={128} />
                </div>

                <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '10px' }}>
                    <p>Gracias por su preferencia</p>
                </div>
            </div>
            {/* -------------------------------- */}

            <div style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
                <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Imprimir</button>
                <button className="btn" style={{ background: '#555' }} onClick={() => navigate('/')}>🏠 Volver al Inicio</button>
            </div>

        </div>
    );
};

export default TicketView;