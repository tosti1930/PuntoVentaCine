<?php
include_once 'db.php';

// --- CORRECCIÓN NUEVA ---
// Manejar la solicitud "Preflight" (OPTIONS) que envía Axios antes del POST
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
// ------------------------

// Leer el JSON que envía React
$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

// Validar datos mínimos
if (!isset($input['funcion_id']) || !isset($input['asientos']) || empty($input['asientos'])) {
    http_response_code(400);
    echo json_encode(["error" => "Datos incompletos"]);
    exit;
}

$funcion_id = $input['funcion_id'];
$asientos = $input['asientos']; // Array de objetos: [{fila: 'A', columna: 1}, {fila: 'A', columna: 2}]

try {
    // INICIAR TRANSACCIÓN (Todo o nada)
    $pdo->beginTransaction();

    $sqlInsert = "INSERT INTO boletos_vendidos (funcion_id, fila_letra, columna_numero, estado) 
                  VALUES (:fid, :fila, :col, 'VENDIDO')";
    
    $stmt = $pdo->prepare($sqlInsert);

    foreach ($asientos as $asiento) {
        // Opcional: Aquí podrías verificar OTRA VEZ si el asiento no se ganó alguien más hace 1 milisegundo
        
        $stmt->execute([
            ':fid' => $funcion_id,
            ':fila' => $asiento['fila'],
            ':col' => $asiento['columna']
        ]);
    }

    // Si todo salió bien, guardamos cambios
    $pdo->commit(); 
    
    echo json_encode(["mensaje" => "Venta exitosa", "boletos_generados" => count($asientos)]);

} catch (Exception $e) {
    // Si algo falló, deshacemos todo
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["error" => "Error al procesar la venta: " . $e->getMessage()]);
}
?>