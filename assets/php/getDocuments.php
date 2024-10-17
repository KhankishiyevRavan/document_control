<!-- <?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost";
$username = "document_nd"; // İstifadəçi adınızı daxil edin
$password = "zrC123&0a8"; // Şifrənizi daxil edin
$dbname = "document_control"; // Verilənlər bazası adınızı daxil edin

// Veritabanına bağlantı
$conn = new mysqli($servername, $username, $password, $dbname);

// Bağlantını yoxlayın
if ($conn->connect_error) {
    die("Bağlantıda xəta: " . $conn->connect_error);
}

// Məlumatları çəkmək üçün SQL sorğusu
$sql = "SELECT * FROM documents";
$result = $conn->query($sql);

$documents = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $documents[] = $row; // Hər bir sətri arraya əlavə edin
    }
}

// JSON formatında cavab verin
header('Content-Type: application/json');
echo json_encode($documents);

$conn->close();
?> -->
