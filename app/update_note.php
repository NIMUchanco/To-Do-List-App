<?php
require_once "_includes/db_connect.php";

$results = [];

try {
    if (!isset($_POST["noteID"]) || empty($_POST["noteID"])) {
        throw new Exception('Required data is missing i.e. noteID');
    }

    $noteId = $_POST["noteID"];
    // Changes the isChecked value to the opposite of what it is
    //manually update timestamp cuz it's set to CURRENT_TIMESTAMP() in the database but it doesn't update automatically
    $query = "UPDATE relational_note SET noteSubject = ?, noteText = ?, `timestamp` = CURRENT_TIMESTAMP() WHERE noteID = ?";

    if ($stmt = mysqli_prepare($link, $query)) {
        mysqli_stmt_bind_param($stmt, 'ssi', $_REQUEST["noteSubject"], $_REQUEST["noteText"], $_REQUEST["noteID"]);
        mysqli_stmt_execute($stmt);
        $affectedRows = mysqli_stmt_affected_rows($stmt);

        if ($affectedRows > 0) {
            $results[] = [
                "success" => "Action successful",
                "message" => "Note's fields updated",
                "noteID" => $noteId
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