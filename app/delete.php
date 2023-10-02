<?php
require_once "_includes/db_connect.php";

$results = [];

try {
    if (!isset($_POST["note_id"]) || empty($_POST["note_id"])) {
        throw new Exception('Required data is missing i.e. note_id');
    }

    $noteId = $_POST["note_id"];
    //changes the isDeleted value to the opposite of what it is
    $query = "UPDATE relational_note SET isDeleted = CASE WHEN isDeleted = 0 THEN 1 ELSE 0 END WHERE noteID = ?";
    
    if ($stmt = mysqli_prepare($link, $query)) {
        mysqli_stmt_bind_param($stmt, 'i', $noteId);
        mysqli_stmt_execute($stmt);
        $affectedRows = mysqli_stmt_affected_rows($stmt);
        
        if ($affectedRows > 0) {
            $results[] = [
                "success" => "Action successful",
                "message" => "Note's isDeleted toggled",
                "note_id" => $noteId
            ];
        } else {
            throw new Exception("No rows were updated");
        }
    } else {
        throw new Exception("Prepared statement did not update records.");
    }
} catch (Exception $error) {
    $results[] = ["error" => $error->getMessage()];
} finally {
    echo json_encode($results);
}

?>