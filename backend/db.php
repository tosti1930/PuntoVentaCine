<?php
// backend/db.php
header("Access-Control-Allow-Origin: *"); // Importante para que React pueda pedir datos
header("Access-Control-Allow-Headers: *");

$host = 'localhost';
$db   = 'cine_db';
$user = 'root'; // Tu usuario
$pass = '';     // Tu contraseña

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>