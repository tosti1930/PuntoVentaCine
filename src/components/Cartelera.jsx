import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cartelera = () => {
    const [funciones, setFunciones] = useState([]);
    const navigate = useNavigate();
    // Recuperamos el usuario para saber si es admin
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    useEffect(() => {
        // CORRECCIÓN 1: Agregué el guion bajo "_" en get_funciones.php
        axios.get('http://localhost/cine-pos-app/backend/getfunciones.php')
            .then(response => {
                setFunciones(response.data);
            })
            .catch(error => console.error("Error cargando funciones:", error));
    }, []);

    const handleSeleccionar = (id) => {
        navigate(`/asientos/${id}`);
    };

    return (
        <div className="container">

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>🎬 Cartelera / Próximas Funciones</h1>
                <div>
                    {/* Solo mostramos el botón Admin si el rol es 'admin' */}
                    {usuario.rol === 'admin' && (
                        <button className="btn" onClick={() => navigate('/admin')} style={{ marginRight: '10px', background: '#f1c40f', color: '#000' }}>
                            ⚙️ Admin
                        </button>
                    )}
                    {usuario.rol == 'cajero' && (
                        <button className="btn" onClick={() => navigate('/cajero')} style={{ marginRight: '10px', background: '#f39c12', color: '#000' }}>
                            🧾 Ventas del Día
                        </button>
                    )}
                    <button className="btn" onClick={() => { localStorage.removeItem('usuario'); navigate('/login'); }} style={{ background: '#e74c3c' }}>
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {funciones.map(func => (
                    <div key={func.funcion_id} style={{ border: '1px solid #333', borderRadius: '10px', overflow: 'hidden', background: '#16213e' }}>
                        {/* Si tienes imágenes, usa func.poster_url en un tag <img> */}
                        <div style={{ padding: '15px' }}>
                            <h3>{func.titulo} ({func.clasificacion})</h3>
                            <p>📍 {func.sala_nombre}</p>
                            <p>⏰ {new Date(func.fecha_hora_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <h2 style={{ color: '#4db5ff' }}>${func.precio_boleto}</h2>

                            <button
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                                onClick={() => handleSeleccionar(func.funcion_id)}
                            >
                                Vender Boletos
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Cartelera;