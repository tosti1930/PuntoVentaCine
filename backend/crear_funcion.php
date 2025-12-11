<?php
include_once 'db.php';
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // AQUÍ ES DONDE UN SENIOR VALIDARÍA TRASLAPE DE HORARIOS
    // (Por ahora haremos la inserción directa para el MVP)
    
    $sql = "INSERT INTO funciones (pelicula_id, sala_id, fecha_hora_inicio, precio_boleto) VALUES (:pid, :sid, :fecha, :precio)";
    $stmt = $pdo->prepare($sql);
    
    $stmt->execute([
        ':pid' => $input['pelicula_id'],
        ':sid' => $input['sala_id'],
        ':fecha' => $input['fecha_hora'],
        ':precio' => $input['precio']
    ]);
    
    echo json_encode(["mensaje" => "Función programada correctamente"]);
}
?>