<?php
    //connect to db
    require_once "_includes/db_connect.php";

    //prepare the statement passing the db $link and the SQL
    // removed ORDER BY timestamp DESC - reverse show of data
    $stmt = mysqli_prepare($link, "SELECT noteID, noteSubject, noteText, isDeleted, isChecked, timestamp FROM note_app ORDER BY timestamp DESC");

    //execute the statement / query from above
    mysqli_stmt_execute($stmt);

    //get results
    $result = mysqli_stmt_get_result($stmt);

    // loop through
    while ($row = mysqli_fetch_assoc($result)) {
        $results[] = $row;
    }

    //encode and display JSON
    echo json_encode($results);

    //close the link to the db
    mysqli_close($link);
?>