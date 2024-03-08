<?php

$host = "localhost:3306";
$db = "relational_db";
$user = "maiko_25";
$pass = "?Rpk88t60";

$link = mysqli_connect($host, $user, $pass, $db);

if (!$link) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    header('Content-Type: text/plain; charset=utf-8', true, 500);
    exit();
}

// $db_response = [];
// $db_response['success'] = 'not set';
// if (!$link) {
//     $db_response['success'] = false;
//     echo 'not connected';
// } else {
//     $db_response['success'] = true;
//     echo 'connected';
// }

//echo json_encode($db_response);
//{"success":true}
?>