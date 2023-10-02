import {
    fetchNotes,
    getTimestamp,
    inserter,
    getFormData,
    } from "./credentials.js";
    
    const allButton = document.getElementById("all-notes");
    allButton.addEventListener("click", async () => {
        // Add class to the button to make it look clicked
        allButton.classList.add("clickedLow");
    
        let note = await fetchNotes("app/select.php");
        displayData(note);
    
        // Listen for the "transitionend" event on the button
        allButton.addEventListener("transitionend", () => {
        // Remove the "clickedLow" class when the transition ends
        allButton.classList.remove("clickedLow");
        // Remove the event listener to prevent multiple executions
        allButton.removeEventListener("transitionend", null);
        });
    });
    
    // Add event listener to the "sort" button
    const shuffleButton = document.getElementById("shuffle");
    shuffleButton.addEventListener("click", async () => {
        // Add class to the button to make it look clicked
        shuffleButton.classList.add("clickedLow");
    
        // Shuffle the notes
        let note = await fetchNotes("app/select.php");
        displayData(note.sort(() => Math.random() - 0.5));
    
        // Listen for the "transitionend" event on the button
        shuffleButton.addEventListener("transitionend", () => {
        // Remove the "clickedLow" class when the transition ends
        shuffleButton.classList.remove("clickedLow");
        // Remove the event listener to prevent multiple executions
        shuffleButton.removeEventListener("transitionend", null);
        });
    });
    
    let showChecked = false; // Variable to track the state of the button (false = show all notes, true = show only checked notes)
    const shCheckedButton = document.getElementById("sh-checked");
    shCheckedButton.addEventListener("click", async () => {
        const display = document.querySelector("#display");
        shCheckedButton.classList.add("clickedLow");
    
        let notesData = await fetchNotes("app/select.php");
        const checkedNotDeleted = notesData.filter(
        (note) => note.isChecked === 1 && note.isDeleted === 0
        );
        const checkedNotes = notesData.filter((note) => note.isChecked === 1);
    
        if (checkedNotDeleted.length > 0) {
        displayData(checkedNotes);
        } else {
        display.innerHTML = `<p class="no-notes">Oops, no notes to show</p>`;
        }
    
        shCheckedButton.addEventListener("transitionend", () => {
        // Remove the "clickedLow" class when the transition ends
        shCheckedButton.classList.remove("clickedLow");
        // Remove the event listener to prevent multiple executions
        shCheckedButton.removeEventListener("transitionend", null);
        });
    });
    
    // let showInWork = false; // Variable to track the state of the button (false = show all notes, true = show only notes in work)
    const inworkButton = document.getElementById("inwork");
    inworkButton.addEventListener("click", async () => {
        // Add class to the button to make it look clicked
        inworkButton.classList.add("clickedLow");
    
        let notesData = await fetchNotes("app/select.php");
        const checkedNotes = notesData.filter((note) => note.isChecked === 0);
        displayData(checkedNotes);
        inworkButton.addEventListener("transitionend", () => {
        // Remove the "clickedLow" class when the transition ends
        inworkButton.classList.remove("clickedLow");
        // Remove the event listener to prevent multiple executions
        inworkButton.removeEventListener("transitionend", null);
        });
    });
    
    // function to display data
    export const displayData = (data, username) => {
        //select element from HTML where we'll put our tv show
        const display = document.querySelector("#display");
        display.innerHTML = "";
        console.log(data);
    
        if (data === null) {
        const oopsMessage = document.createElement("div");
        oopsMessage.innerHTML = "<p>Oops! No notes available.</p>";
        display.appendChild(oopsMessage);
        return; // Exit the function early
        }
    
        let ul = document.createElement("ul");
        data.forEach((note) => {
        // console.log(note);
        if (note.username !== username) {
            return;
        }
    
        if (note.isDeleted == 0) {
            let li = document.createElement("li");
    
            const timestamp = note.timestamp;
            const montrealDateTime = getTimestamp(timestamp);
    
            li.innerHTML = `
                <div class="card">
                    <div class="left">
                    <h3 class="subject">${note.noteSubject}</h3>
                        <p>${note.noteText}</p>
                    </div>
                    <div class="right">
                    <div class="btn">
                        <button class="checked grid-child" data-noteid="${note.noteID}">
                                <i class="fa-regular fa-square-check check-icon"></i>
                            </button>
                            <button class="delete grid-child" data-noteid="${note.noteID}">
                                <i class="fa-regular fa-circle-xmark"></i>
                            </button>
                            <button class="edit" data-noteid="${note.noteID}"><i class="fa-regular fa-pen-to-square"></i></button>
                    </div>
                        <div class="subj-time">
                            <div class="time-grid">
                                <p class="date-stamp">${montrealDateTime.montrealDate}</p>
                                <p class="time-stamp">${montrealDateTime.montrealTime}</p>
                            </div>
                        </div>
                    </div>
                </div>`;
    
            // ul.appendChild(li);
    
            // Add class to the "checked" button if the note is checked and remove it if it's not
            if (note.isChecked == 1) {
            //add green color to checked note left side
            li.querySelector(".left").classList.add("checked-card");
            //remove style of check icon
            li.querySelector(".check-icon").classList.remove("fa-regular");
            //add solid style to check icon
            li.querySelector(".check-icon").classList.add("fa-solid");
            }
    
            // Add event listener to the "edit" button
            const editButton = li.querySelector(".edit");
            editButton.addEventListener("click", (event) => {
            event.preventDefault();
            const noteID = editButton.getAttribute("data-noteid");
            console.log("Clicked on edit button for noteID:", noteID);
            updateForm(event, noteID, note.noteSubject, note.noteText);
            });
    
            // Add event listener to the "checked" button
            const checkedButton = li.querySelector(".checked");
            checkedButton.addEventListener("click", (event) => {
            event.preventDefault();
            const noteID = checkedButton.getAttribute("data-noteid");
            console.log("Clicked on checked button for noteID:", noteID);
            const formData = new FormData();
            formData.append("note_id", noteID);
            let url = "app/update_checked.php";
            inserter(formData, url);
            });
    
            //add event listener to the delete button
            const deleteButton = li.querySelector(".delete");
            deleteButton.addEventListener("click", (event) => {
            event.preventDefault();
            const noteID = deleteButton.getAttribute("data-noteid");
            console.log("Clicked on delete button for noteID:", noteID);
            const formData = new FormData();
            formData.append("note_id", noteID);
            let url = "app/delete.php";
            inserter(formData, url);
            });
    
            ul.appendChild(li);
        }
        });
    
        display.appendChild(ul);
    };
    
    const updateForm = (event, noteID, noteSubject, noteText) => {
        // Prevent the default behavior (e.g., navigating to a URL)
        event.preventDefault();
    
        // Get the parent element of the clicked "edit" button
        let editButton = event.target;
        let card = editButton.closest(".card");
    
        // Get the left side of the card
        let leftSide = card.querySelector(".left");
    
        // Create an editable form for the right side of the card
        let form = document.createElement("form");
        form.id = "update-form";
        form.classList.add("update-form");
        form.innerHTML = `
            <input type="hidden" name="noteID" value="${noteID}">
            <input type="text" name="noteSubject" value="${noteSubject}">
            <textarea name="noteText">${noteText}</textarea>
            <button type="submit"><i class="fa-solid fa-angles-right"></i></button>
        `;
    
        // Add an event listener to handle the form submission
        form.addEventListener("submit", (e) => {
        e.preventDefault();
    
        // Serialize the form data into a FormData object
        let formData = new FormData(form);
    
        // Call a function to submit the updated data (e.g., send it to the server)
        let url = "app/update_note.php";
        inserter(formData, url);
    
        // Remove the form and show the original right side of the card
        card.replaceChild(leftSide, form);
        });
    
        // Replace the right side of the card with the form
        card.replaceChild(form, card.querySelector(".right"));
    
        // Hide the "edit" button while the form is displayed
        editButton.style.display = "none";
    };
    
    const submitButton = document.getElementById("submit");
    submitButton.addEventListener("click", getFormData);
    
    const textarea = document.getElementById("note_text");
    const subjectInput = document.getElementById("note_subject");
    const charCountElement = document.getElementById("char-count");
    const errorMsg = document.querySelector(".error-msg");
    let maxChars = 600;
    
    // script to make button animation
    submitButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent the default link behavior
        if (textarea.value.trim() === "" || subjectInput.value.trim() === "") {
        errorMsg.style.visibility = "visible";
        setTimeout(() => {
            errorMsg.style.visibility = "hidden";
        }, 5000);
        } else {
        errorMsg.style.visibility = "hidden";
        }
        // Reset the character count
        charCountElement.textContent = `600`;
        // Remove all classes from the element
        charCountElement.classList.remove("danger", "warning", "grey-text");
    });
    
    //characters left in text area from 600
    textarea.addEventListener("input", () => {
        const remainingChars = maxChars - textarea.value.length;
        charCountElement.textContent = `${remainingChars}`;
    
        // Remove all classes from the element
        charCountElement.classList.remove("danger", "warning", "grey-text");
        submitButton.classList.remove("disabled-button");
    
        // Add classes based on the remaining characters
        if (remainingChars < 0) {
        charCountElement.classList.add("grey-text");
        submitButton.classList.add("disabled-button");
        } else if (remainingChars <= 150) {
        charCountElement.classList.add("danger");
        } else if (remainingChars <= 350) {
        charCountElement.classList.add("warning");
        }
    });
    