<?php
include_once 'db.php';

if (!isset($_GET['funcion_id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Falta el ID de la función"]);
    exit;
}

$funcion_id = $_GET['funcion_id'];

try {
    // 1. Obtener información de la sala y la función
    $sqlSala = "SELECT 
                    f.precio_boleto,
                    s.filas, 
                    s.columnas, 
                    s.nombre as sala_nombre, 
                    p.titulo 
                FROM funciones f
                INNER JOIN salas s ON f.sala_id = s.id
                INNER JOIN peliculas p ON f.pelicula_id = p.id
                WHERE f.id = :fid";
    
    $stmt = $pdo->prepare($sqlSala);
    $stmt->execute([':fid' => $funcion_id]);
    $infoFuncion = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$infoFuncion) {
        throw new Exception("Función no encontrada");
    }

    // 2. Obtener los asientos que YA están ocupados en esa función
    $sqlOcupados = "SELECT fila_letra, columna_numero 
                    FROM boletos_vendidos 
                    WHERE funcion_id = :fid AND estado = 'VENDIDO'";
    
    $stmt = $pdo->prepare($sqlOcupados);
    $stmt->execute([':fid' => $funcion_id]);
    $asientosOcupados = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. Devolver todo en un solo objeto JSON
    echo json_encode([
        "info" => $infoFuncion,
        "ocupados" => $asientosOcupados
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>