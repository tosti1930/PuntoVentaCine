import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const navigate = useNavigate();
    // Estados para cargar los selects
    const [listas, setListas] = useState({ peliculas: [], salas: [] });

    // Estados del Formulario Película
    const [nuevaPeli, setNuevaPeli] = useState({ titulo: '', duracion: '', clasificacion: 'B', poster_url: '' });

    // Estados del Formulario Función
    const [nuevaFuncion, setNuevaFuncion] = useState({ pelicula_id: '', sala_id: '', fecha_hora: '', precio: 80 });

    useEffect(() => {
        cargarListas();
    }, []);

    const cargarListas = () => {
        axios.get('http://localhost/cine-pos-app/backend/admin_data.php')
            .then(res => setListas(res.data))
            .catch(err => console.error(err));
    };

    const handleCrearPelicula = (e) => {
        e.preventDefault();
        axios.post('http://localhost/cine-pos-app/backend/crear_pelicula.php', nuevaPeli)
            .then(() => {
                Swal.fire('¡Listo!', 'Película agregada', 'success');
                setNuevaPeli({ titulo: '', duracion: '', clasificacion: 'B', poster_url: '' }); // Limpiar form
                cargarListas(); // Recargar lista para que aparezca en el otro form
            });
    };

    const handleCrearFuncion = (e) => {
        e.preventDefault();
        axios.post('http://localhost/cine-pos-app/backend/crear_funcion.php', nuevaFuncion)
            .then(() => {
                Swal.fire('¡Listo!', 'Función programada', 'success');
            });
    };

    return (
        <div className="container mt-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>🛠️ Panel de Administración</h1>
                <button className="btn" style={{ background: '#555' }} onClick={() => navigate('/')}>🏠 Volver a Cartelera</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>

                {/* --- FORMULARIO 1: NUEVA PELÍCULA --- */}
                <div style={{ background: '#16213e', padding: '20px', borderRadius: '10px' }}>
                    <h3>🎬 1. Agregar Nueva Película</h3>
                    <form onSubmit={handleCrearPelicula}>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Título:</label>
                            <input className="form-control" required value={nuevaPeli.titulo} onChange={e => setNuevaPeli({ ...nuevaPeli, titulo: e.target.value })} style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Duración (min):</label>
                            <input type="number" required value={nuevaPeli.duracion} onChange={e => setNuevaPeli({ ...nuevaPeli, duracion: e.target.value })} style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Clasificación:</label>
                            <select value={nuevaPeli.clasificacion} onChange={e => setNuevaPeli({ ...nuevaPeli, clasificacion: e.target.value })} style={{ width: '100%', padding: '8px' }}>
                                <option>AA</option>
                                <option>A</option>
                                <option>B</option>
                                <option>B15</option>
                                <option>C</option>
                            </select>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Guardar Película</button>
                    </form>
                </div>

                {/* --- FORMULARIO 2: CREAR FUNCIÓN --- */}
                <div style={{ background: '#0f3460', padding: '20px', borderRadius: '10px' }}>
                    <h3>📅 2. Programar Función</h3>
                    <form onSubmit={handleCrearFuncion}>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Película:</label>
                            <select required onChange={e => setNuevaFuncion({ ...nuevaFuncion, pelicula_id: e.target.value })} style={{ width: '100%', padding: '8px' }}>
                                <option value="">Selecciona...</option>
                                {listas.peliculas.map(p => <option key={p.id} value={p.id}>{p.titulo}</option>)}
                            </select>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Sala:</label>
                            <select required onChange={e => setNuevaFuncion({ ...nuevaFuncion, sala_id: e.target.value })} style={{ width: '100%', padding: '8px' }}>
                                <option value="">Selecciona...</option>
                                {listas.salas.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                            </select>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Fecha y Hora:</label>
                            <input type="datetime-local" required onChange={e => setNuevaFuncion({ ...nuevaFuncion, fecha_hora: e.target.value })} style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Precio Boleto ($):</label>
                            <input type="number" required value={nuevaFuncion.precio} onChange={e => setNuevaFuncion({ ...nuevaFuncion, precio: e.target.value })} style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '10px', background: '#e94560' }}>Programar Función</button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default AdminPanel;