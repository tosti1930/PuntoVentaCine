<?php
include_once 'db.php';
// Headers CORS estandar
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

try {
    // 1. Obtener todas las películas
    $stmt = $pdo->query("SELECT id, titulo FROM peliculas");
    $peliculas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Obtener todas las salas
    $stmt = $pdo->query("SELECT id, nombre FROM salas");
    $salas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['peliculas' => $peliculas, 'salas' => $salas]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>