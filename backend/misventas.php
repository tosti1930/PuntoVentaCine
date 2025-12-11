<?php
include_once 'db.php';
// CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

// Recibimos el ID del usuario (cajero)
$user_id = $_GET['user_id'] ?? 0;

try {
    // Consulta: Trae la película, sala, hora y asientos agrupados por venta
    // TRUCO: Como tu tabla 'boletos_vendidos' guarda asiento por asiento,
    // necesitamos agruparlos para mostrar "Venta #1: Asientos A1, A2"
    
    // Vamos a traer los boletos individuales vendidos hoy por este usuario.
    // (Nota: Para un sistema real, idealmente tendrías una tabla 'ventas' padre, 
    // pero trabajaremos con lo que ya tienes).
    
    $sql = "SELECT 
                b.id, 
                b.fecha_venta,
                b.fila_letra,
                b.columna_numero,
                p.titulo,
                s.nombre as sala,
                f.fecha_hora_inicio,
                f.precio_boleto
            FROM boletos_vendidos b
            INNER JOIN funciones f ON b.funcion_id = f.id
            INNER JOIN peliculas p ON f.pelicula_id = p.id
            INNER JOIN salas s ON f.sala_id = s.id
            WHERE DATE(b.fecha_venta) = CURDATE() 
            ORDER BY b.fecha_venta DESC";
            
    // NOTA: Si tuviéramos una columna 'usuario_id' en boletos_vendidos, filtraríamos aquí.
    // Por ahora, mostraremos todas las ventas del día.
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($ventas);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>