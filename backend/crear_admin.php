<?php
include_once 'db.php';
// backend/crear_admin.php
$pass = password_hash("123456", PASSWORD_DEFAULT);
$sql = "INSERT INTO usuarios (nombre, email, password, rol) VALUES ('Cajero', 'cajero@cine.com', '$pass', 'cajero')";
$pdo->exec($sql);
echo "Usuario creado: cajero@cine.com / 123456";
?>