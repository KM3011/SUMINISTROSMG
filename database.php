<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$host = "localhost";
$username = "root";
$password = "";

// Determine which DB to connect to based on session
$db_name = "suministrosmg"; // Default fallback
if (isset($_SESSION['company_context'])) {
    if ($_SESSION['company_context'] === 'servicios') {
        $db_name = "meygo_servicios";
    }
}

try {
    $conn = new PDO("mysql:host={$host};dbname={$db_name}", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    echo "Error de conexión: " . $exception->getMessage();
}
?>
