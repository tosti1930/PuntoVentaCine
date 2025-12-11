<?php
include_once 'db.php';

// Validar que sea método GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit;
}

try {
    // Seleccionamos datos de la función, el título de la peli y el nombre de la sala
    // Filtramos para mostrar solo funciones futuras (opcional)
    $sql = "SELECT 
                f.id as funcion_id,
                f.fecha_hora_inicio,
                f.precio_boleto,
                p.titulo,
                p.poster_url,
                p.clasificacion,
                p.duracion_minutos,
                s.nombre as sala_nombre
            FROM funciones f
            INNER JOIN peliculas p ON f.pelicula_id = p.id
            INNER JOIN salas s ON f.sala_id = s.id
            ORDER BY f.fecha_hora_inicio ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $funciones = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($funciones);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>