import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Cartelera from './components/Cartelera';
import SeleccionAsientos from './components/SeleccionAsientos';
import TicketView from './components/TicketView';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import CajeroPanel from './components/CajeroPanel';


// --- COMPONENTE DE PROTECCIÓN ---
const ProtectedRoute = ({ children }) => {
  const usuario = localStorage.getItem('usuario');

  // Si no hay usuario guardado, redirigir al Login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Si sí hay usuario, mostrar el contenido (el hijo)
  return children;
};
// --------------------------------

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* La ruta de Login es pública */}
        <Route path="/login" element={<Login />} />

        {/* Las demás rutas son privadas (protegidas) */}
        <Route path="/" element={
          <ProtectedRoute>
            <Cartelera />
          </ProtectedRoute>
        } />

        <Route path="/asientos/:id" element={
          <ProtectedRoute>
            <SeleccionAsientos />
          </ProtectedRoute>
        } />

        <Route path="/ticket" element={
          <ProtectedRoute>
            <TicketView />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />

        <Route path="/cajero" element={
          <ProtectedRoute>
            <CajeroPanel />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;