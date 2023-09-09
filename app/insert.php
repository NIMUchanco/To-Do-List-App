<?php
    require_once "_includes/db_connect.php";

    $results = [];
    $insertedRows = 0;

    //SQL query copied from phpMyAdmin:
    //INSERT INTO `note_app` (`noteID`, `noteSubject`, `noteText`, `isDeleted`, `isChecked`, `timestamp`) VALUES (NULL, 'Shopping list', 'eggs\r\nbread\r\nmilk\r\nmeat', '0', '0', current_timestamp());
    //isDeleted and isChecked are set to 0 by default

    //trim - strips whitespace (or other characters) from the beginning and end of a string
    //so if its only spaces, it will be empty
    try{
        if (!isset($_REQUEST["note_subject"]) || trim($_REQUEST["note_subject"]) === '' ||
            !isset($_REQUEST["note_text"]) || trim($_REQUEST["note_text"]) === '') {
            throw new Exception('Required data is missing i.e. note_subject or note_text');
        }

        // Additional check to ensure note_subject and note_text are not just spaces
        //strlen - returns the length of the string
        if (strlen(trim($_REQUEST["note_subject"])) === 0 || strlen(trim($_REQUEST["note_text"])) === 0) {
            throw new Exception('Note subject or note text cannot be just spaces.');
        }

        $query = "INSERT INTO note_app (noteSubject, noteText) VALUES (?, ?)";

        if($stmt = mysqli_prepare($link, $query)){
        mysqli_stmt_bind_param($stmt, 'ss', $_REQUEST["note_subject"], $_REQUEST["note_text"]);
        mysqli_stmt_execute($stmt);
        $insertedRows = mysqli_stmt_affected_rows($stmt);
        if($insertedRows > 0){
            $results[] = [
            "insertedRows"=>$insertedRows,
            "id" => $link->insert_id,
            "note_subject" => $_REQUEST["note_subject"],
            "note_text" => $_REQUEST["note_text"]
            ];
        }else{
            throw new Exception("No rows were inserted");
        }
        //removed the echo from here
        //echo json_encode($results);
        }else{
        throw new Exception("Prepared statement did not insert records.");
        }

    }catch(Exception $error){
        //add to results array rather than echoing out errors
        $results[] = ["error"=>$error->getMessage()];
    }finally{
        //echo out results
        echo json_encode($results);
    }
//example url with $_GET for full_name, email & tvshow
//https://aleksandra14.web582.com/dynamic/note/app/insert.php?note_subject=test&note_text=testtesttes
//[{"insertedRows":1,"id":2,"note_subject":"test","note_text":"testtesttes"}]

?>