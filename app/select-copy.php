<?php
    //connect to db
    require_once "_includes/db_connect.php";


    //prepare the statement passing the db $link and the SQL
    // removed ORDER BY timestamp DESC - reverse show of data
    // $stmt = mysqli_prepare($link, "SELECT noteID, noteSubject, noteText, isDeleted, isChecked, timestamp FROM relational_note ORDER BY timestamp DESC");

    // Prepare the SQL statement with a WHERE clause to filter by user ID
    // $stmt = mysqli_prepare($link, "SELECT noteID, noteSubject, noteText, isDeleted, isChecked, timestamp FROM relational_note WHERE user_id = ? ORDER BY timestamp DESC");
    
    // Bind the user ID from the session to the statement
    // mysqli_stmt_bind_param($stmt, "i", $_SESSION['user_id']);

    // Prepare the SQL statement with a WHERE clause to filter by user ID
    // example 4.2
    // works
    // $stmt = mysqli_prepare($link, "SELECT * FROM relational_note, relational_users WHERE relational_note.userID = relational_users.userID");

    $stmt = mysqli_prepare($link, "SELECT * FROM relational_note, relational_users WHERE relational_note.userID = relational_users.userID");
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