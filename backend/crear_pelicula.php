<?php
include_once 'db.php';
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $sql = "INSERT INTO peliculas (titulo, duracion_minutos, clasificacion, poster_url) VALUES (:tit, :dur, :clas, :img)";
    $stmt = $pdo->prepare($sql);
    
    // Usamos una imagen genérica si no envían URL
    $poster = $input['poster_url'] ?: 'https://via.placeholder.com/300x450?text=Sin+Imagen';
    
    $stmt->execute([
        ':tit' => $input['titulo'],
        ':dur' => $input['duracion'],
        ':clas' => $input['clasificacion'],
        ':img' => $poster
    ]);
    
    echo json_encode(["mensaje" => "Película creada exitosamente"]);
}
?>