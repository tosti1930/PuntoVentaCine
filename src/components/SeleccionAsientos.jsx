import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const SeleccionAsientos = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [salaInfo, setSalaInfo] = useState(null);
    const [ocupados, setOcupados] = useState([]);
    const [seleccionados, setSeleccionados] = useState([]);

    useEffect(() => {
        cargarDatos();
    }, [id]);

    const cargarDatos = () => {
        axios.get(`http://localhost/cine-pos-app/backend/get_sala_info.php?funcion_id=${id}`)
            .then(res => {
                setSalaInfo(res.data.info);
                const ocupadosSet = res.data.ocupados.map(o => `${o.fila_letra}-${o.columna_numero}`);
                setOcupados(ocupadosSet);
                setSeleccionados([]);
            })
            .catch(err => console.error(err));
    };

    const toggleAsiento = (fila, col) => {
        const idAsiento = `${fila}-${col}`;
        if (ocupados.includes(idAsiento)) return;

        if (seleccionados.includes(idAsiento)) {
            setSeleccionados(seleccionados.filter(s => s !== idAsiento));
        } else {
            setSeleccionados([...seleccionados, idAsiento]);
        }
    };

    const handleComprar = () => {
        // 1. Preparar datos
        const asientosParaEnviar = seleccionados.map(str => {
            const [fila, col] = str.split('-');
            return { fila: fila, columna: parseInt(col) };
        });

        const payload = {
            funcion_id: id,
            asientos: asientosParaEnviar
        };

        // 2. Enviar al Backend
        axios.post('http://localhost/cine-pos-app/backend/vender_boletos.php', payload)
            .then(res => {
                Swal.fire({
                    title: 'Procesando...',
                    timer: 1000,
                    timerProgressBar: true,
                    didOpen: () => { Swal.showLoading() }
                }).then(() => {
                    navigate('/ticket', {
                        state: {
                            venta: {
                                titulo: salaInfo.titulo,
                                sala: salaInfo.sala_nombre,
                                funcion_id: id,
                                asientos: seleccionados,
                                total: (seleccionados.length * salaInfo.precio_boleto).toFixed(2)
                            }
                        }
                    });
                });
            })
            .catch(err => {
                console.error(err);
                Swal.fire('Error', 'No se pudo procesar la venta.', 'error');
            });
    }; // <--- AQUÍ TERMINA LA FUNCIÓN HANDLECOMPRAR

    // --- EL RENDERIZADO (RETURN) DEBE ESTAR AFUERA ---

    if (!salaInfo) return <div className="text-center mt-5">Cargando sala...</div>;

    const filas = Array.from({ length: salaInfo.filas }, (_, i) => String.fromCharCode(65 + i));
    const columnas = Array.from({ length: salaInfo.columnas }, (_, i) => i + 1);

    return (
        <div className="container text-center">
            <h2 className="my-4">Sala: {salaInfo.sala_nombre} <span style={{ color: '#888' }}>|</span> {salaInfo.titulo}</h2>

            {/* PANTALLA */}
            <div style={{ width: '60%', height: '15px', background: '#ccc', margin: '0 auto 40px auto', borderRadius: '0 0 50px 50px', boxShadow: '0 0 15px rgba(255,255,255,0.2)' }}></div>

            <div style={{ display: 'inline-grid', gap: '8px', gridTemplateColumns: `repeat(${salaInfo.columnas}, 1fr)` }}>
                {filas.map(fila => (
                    columnas.map(col => {
                        const idAsiento = `${fila}-${col}`;
                        const esOcupado = ocupados.includes(idAsiento);
                        const esSeleccionado = seleccionados.includes(idAsiento);

                        let bgColor = '#444';
                        if (esOcupado) bgColor = '#e63946';
                        if (esSeleccionado) bgColor = '#4cc9f0';

                        return (
                            <div
                                key={idAsiento}
                                onClick={() => toggleAsiento(fila, col)}
                                style={{
                                    width: '35px', height: '35px',
                                    backgroundColor: bgColor,
                                    borderRadius: '6px 6px 2px 2px',
                                    cursor: esOcupado ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.7rem', fontWeight: 'bold', userSelect: 'none',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {fila}{col}
                            </div>
                        );
                    })
                ))}
            </div>

            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#16213e', borderRadius: '10px' }}>
                <h3>Total: <span style={{ color: '#4cc9f0' }}>${(seleccionados.length * salaInfo.precio_boleto).toFixed(2)}</span></h3>
                <p>{seleccionados.length} boletos seleccionados: {seleccionados.join(', ')}</p>

                <button
                    className="btn btn-primary"
                    style={{ fontSize: '1.2rem', padding: '10px 40px', marginTop: '10px' }}
                    disabled={seleccionados.length === 0}
                    onClick={handleComprar}
                >
                    CONFIRMAR VENTA 🎟️
                </button>
            </div>
        </div>
    );
};

export default SeleccionAsientos;