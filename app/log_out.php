<?php
    session_start();

    // Unset specific session variables
    $_SESSION['verify'] = false;

    // Destroy the entire session
    session_destroy();

    // Create a response array indicating successful logout
    $response = ["success" => "Action successful"];

    // Encode and echo the JSON response
    echo json_encode($response);
?>