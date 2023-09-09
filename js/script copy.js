
//COPY SEP 6 9PM
//make notes avaliable in the whole script
let notesData = [];

const fetchNotes = async (url) => {
    const response = await fetch(url);
    // check if the response is ok
    if (response.status === 200) {
        // const data = await response.json();
        // displayData(data);
        notesData = await response.json(); // Store the data in the 'notesData' array
        displayData(notesData); // Call the displayData function and pass the 'notesData' array as an argument
    } else {
        //throw an error
        throw new Error("Unable to fetch notes");
    }
};

fetchNotes('app/select.php');

const allButton = document.getElementById("all-notes");
allButton.addEventListener("click", () => {
    // Add class to the button to make it look clicked
    allButton.classList.add("clickedLow");
    displayData(notesData);

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
shuffleButton.addEventListener("click", () => {
    // Add class to the button to make it look clicked
    shuffleButton.classList.add("clickedLow");
    // Reverse the order of notesData
    notesData.reverse();
    displayData(notesData);

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
shCheckedButton.addEventListener("click", () => {
    // Add class to the button to make it look clicked
    shCheckedButton.classList.add("clickedLow");
    //doesnt work as expected
    // if (showChecked) {
    //     // If currently showing checked notes, show all notes
    //     displayData(notesData);
    //     showChecked = !showChecked;
    // } else {
        // If currently showing all notes, show only checked notes
        const checkedNotes = notesData.filter((note) => note.isChecked === 1);
        displayData(checkedNotes);
    //     showChecked = !showChecked;
    // }

    shCheckedButton.addEventListener("transitionend", () => {
        // Remove the "clickedLow" class when the transition ends
        shCheckedButton.classList.remove("clickedLow");
        // Remove the event listener to prevent multiple executions
        shCheckedButton.removeEventListener("transitionend", null);
    });
});

let showInWork = false; // Variable to track the state of the button (false = show all notes, true = show only notes in work)
const inworkButton = document.getElementById("inwork");
inworkButton.addEventListener("click", () => {
    // Add class to the button to make it look clicked
    inworkButton.classList.add("clickedLow");
    // if (showInWork) {
    //     // If currently showing checked notes, show all notes
    //     displayData(notesData);
    //     showInWork = !showInWork;
    // } else {
        // If currently showing all notes, show only checked notes
        //filter -> returns a new array with the elements that pass the condition
        const checkedNotes = notesData.filter((note) => note.isChecked === 0);
        displayData(checkedNotes);
    //     showInWork = !showInWork;
    // }

    inworkButton.addEventListener("transitionend", () => {
        // Remove the "clickedLow" class when the transition ends
        inworkButton.classList.remove("clickedLow");
        // Remove the event listener to prevent multiple executions
        inworkButton.removeEventListener("transitionend", null);
    });
});

const getTimestamp = (timestamp) => {
    // Create a Date object from the GMT timestamp
    const date = new Date(timestamp);

    // Set the time zone to Montreal (Eastern Daylight Time - EDT)
    date.setUTCHours(date.getUTCHours() - 4); // Subtract 4 hours for GMT to EDT conversion

    // Format the date and time as a string without seconds
    const montrealDate = date.toLocaleDateString('en-US', {
        timeZone: 'America/Toronto', // Montreal is in the same time zone as Toronto
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });

    const montrealTime = date.toLocaleTimeString('en-US', {
        timeZone: 'America/Toronto', // Montreal is in the same time zone as Toronto
        hour: 'numeric',
        minute: 'numeric',
        hour12: true, // Display AM/PM
    });

    return { montrealDate, montrealTime };
};

// function to display data
const displayData = (data) => {
    //select element from HTML where we'll put our tv show
    const display = document.querySelector('#display');
    display.innerHTML = '';
    console.log(data);
    let ul = document.createElement('ul');

    data.forEach((note) => {
        // console.log(note);
        if (note.isDeleted == 0) {
            let li = document.createElement('li');

            const timestamp = note.timestamp;
            const montrealDateTime = getTimestamp(timestamp);


            li.innerHTML = `
            <div class="card">
                <div class="left">
                    <button class="checked grid-child" data-noteid="${note.noteID}">
                        <i class="fa-regular fa-square-check check-icon"></i>
                    </button>
                    <button class="delete grid-child" data-noteid="${note.noteID}">
                        <i class="fa-regular fa-circle-xmark"></i>
                    </button>
                </div>
                <div class="right">
                    <div class="subj-time">
                        <h3 class="subject">${note.noteSubject}</h3>
                        <div class="time-grid">
                            <p class="date-stamp">${montrealDateTime.montrealDate}</p>
                            <p class="time-stamp">${montrealDateTime.montrealTime}</p>
                        </div>

                        
                    </div>
                    <p>${note.noteText}</p>
                    <button class="update" data-noteid="${note.noteID}><i class="fa-regular fa-pen-to-square"></i></button>
                    
                </div>
            </div>`;
            
            ul.appendChild(li);

            // Add class to the "checked" button if the note is checked and remove it if it's not
            if (note.isChecked == 1) {
                //add green color to checked note left side
                li.querySelector('.left').classList.add('checked-card');
                //remove style of check icon
                li.querySelector('.check-icon').classList.remove('fa-regular');
                //add solid style to check icon
                li.querySelector('.check-icon').classList.add('fa-solid');
            }


            // Add event listener to the "checked" button
            const checkedButton = li.querySelector('.checked');
            checkedButton.addEventListener('click', (event) => {
                event.preventDefault();
                const noteID = checkedButton.getAttribute('data-noteid');
                console.log('Clicked on checked button for noteID:', noteID);
                const formData = new FormData();
                formData.append('note_id', noteID);
                let url = 'app/update_checked.php';
                inserter(formData, url);
            });

            //add event listener to the delete button
            const deleteButton = li.querySelector('.delete');
            deleteButton.addEventListener('click', (event) => {
                event.preventDefault();
                const noteID = deleteButton.getAttribute('data-noteid');
                console.log('Clicked on delete button for noteID:', noteID);
                const formData = new FormData();
                formData.append('note_id', noteID);
                let url = 'app/delete.php';
                inserter(formData, url);
            });
        }
    });

    display.appendChild(ul);
};


const getFormData = (event) => {
    event.preventDefault();
    //get the form data & call an async function
    const insertFormData = new FormData(document.querySelector('#insert-form'));
    let url = 'app/insert.php';
    inserter(insertFormData, url);
}

const submitButton = document.getElementById("submit");
submitButton.addEventListener('click', getFormData);

//function to add new note
const inserter = async (data, url) => {
    const response = await fetch(url, {
        method: 'POST',
        body: data
    });

    if (response.status === 200) {
        const confirmation = await response.json();

        console.log(confirmation);
        //call function again to refresh the page
        fetchNotes('app/select.php');

        // Clear input and textarea fields
        const subjectInput = document.querySelector('input[name="note_subject"]');
        const textArea = document.querySelector('textarea[name="note_text"]');
        
        subjectInput.value = '';
        textArea.value = '';

    } else {
        throw new Error("Unable to add note");
    }
};


const textarea = document.getElementById('note_text');
const subjectInput = document.getElementById('note_subject');
const charCountElement = document.getElementById('char-count');
const errorMsg = document.querySelector(".error-msg");
let maxChars = 600;

// script to make button animation
submitButton.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default link behavior
    submitButton.classList.add("clicked");
    if (textarea.value.length === 0 || subjectInput.value.length === 0) {
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
    charCountElement.classList.remove('danger', 'warning', 'grey-text');
});

//transitionend event listener to remove the class after the animation is done
submitButton.addEventListener("transitionend", (event) => {
    if (event.propertyName === "transform") {
        submitButton.classList.remove("clicked");
    }
});


//characters left in text area from 600
textarea.addEventListener('input',() => {
    const remainingChars = maxChars - textarea.value.length;
    charCountElement.textContent = `${remainingChars}`;

    // Remove all classes from the element
    charCountElement.classList.remove('danger', 'warning', 'grey-text');
    submitButton.classList.remove('disabled-button');

    // Add classes based on the remaining characters
    if (remainingChars < 0) {
        charCountElement.classList.add('grey-text');
        submitButton.classList.add('disabled-button');
    }else if (remainingChars <= 150) {
        charCountElement.classList.add('danger');
    }
    else if (remainingChars <= 350) {
        charCountElement.classList.add('warning');
    }
});


