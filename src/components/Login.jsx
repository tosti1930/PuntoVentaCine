import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post('http://localhost/cine-pos-app/backend/Login.php', { email, password })
      .then(res => {
        // Guardamos la sesión en el navegador
        localStorage.setItem('usuario', JSON.stringify(res.data.usuario));

        Swal.fire({
          icon: 'success',
          title: `Hola, ${res.data.usuario.nombre}`,
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          navigate('/'); // Redirigir a la Cartelera
        });
      })
      .catch(err => {
        Swal.fire('Error', 'Usuario o contraseña incorrectos', 'error');
      });
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0c29' }}>
      <div style={{ background: '#24243e', padding: '40px', borderRadius: '10px', width: '300px', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>🔐 Acceso Cine</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none' }}
              placeholder="admin@cine.com"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none' }}
              placeholder="******"
            />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }}>INGRESAR</button>
        </form>
      </div>
    </div>
  );
};

export default Login;