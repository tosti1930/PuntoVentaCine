<?php
include_once 'db.php';

// Manejar preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

// 1. Buscar el usuario por email
$sql = "SELECT * FROM usuarios WHERE email = :email";
$stmt = $pdo->prepare($sql);
$stmt->execute([':email' => $email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// 2. Verificar contraseña
// NOTA: Para este ejercicio, si no has creado usuarios con hash real, 
// puedes cambiar 'password_verify' por una comparación simple ($user['password'] == $password)
// SOLO para pruebas iniciales si insertaste la pass manual "123456" en la BD.
// Pero lo profesional es usar password_verify.

if ($user && password_verify($password, $user['password'])) {
    // ¡Login exitoso!
    // No devolvemos la contraseña, obvio.
    unset($user['password']);
    
    echo json_encode([
        "mensaje" => "Autenticación correcta",
        "usuario" => $user,
        "token" => bin2hex(random_bytes(16)) // Un token falso simple para el frontend
    ]);
} else {
    http_response_code(401);
    echo json_encode(["error" => "Credenciales incorrectas"]);
}
?>