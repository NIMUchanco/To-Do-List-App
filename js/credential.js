import { displayData } from "./script.js";

const signUp = document.querySelector('#sign-up');
const insert = document.querySelector('#insert');
// const signinBtn = document.querySelector('#signin-button');
const loginForm = document.querySelector('#login-form');
const logoutBtn = document.querySelector('#logout-btn');
const icons = document.querySelector('.icons');
insert.style.display = 'none';
icons.style.display = 'none';
logoutBtn.style.display = 'none';


// check if logged in
const checkLogin = async () => {
    let url = 'app/login_check.php';
    const response = await fetch(url);
    const confirmation = await response.json();
    console.log(confirmation);

    if(!confirmation[0].verify) {
        //show login form
        signUp.style.display = 'block';
        icons.style.display = 'none';
        logoutBtn.style.display = 'none';

    } else {
        greetUser(confirmation[0].username);
        //show insert form
        insert.style.display = 'block';
        icons.style.display = 'block';
        logoutBtn.style.display = 'block';

        let note = await fetchNotes('app/select.php');
        displayData(note);
    }
}

checkLogin();


//timestamp function
export const getTimestamp = (timestamp) => {
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

// fetch data
export const fetchNotes = async (url) => {
    const response = await fetch(url);
    // check if the response is ok
    if (response.status === 200) {
        // const data = await response.json();
        // displayData(data);
        let notesData = await response.json(); // Store the data in the 'notesData' array

        return notesData;
    } else {
        //throw an error
        throw new Error("Unable to fetch notes");
    }
};

//logout
const logout = async () => {
    let url = 'app/log_out.php';
    const response = await fetch(url);
    const confirmation = await response.json();
    console.log(confirmation);
    window.location.reload();
}

const logoutButton = document.querySelector('#logout-btn');
logoutButton.addEventListener('click', logout);


// function to finduser
const finduser = async (username, password) => {
    // Create an object with username and password fields
    const credentials = {
        login_username: username,
        login_password: password
    };

    // Convert the object to JSON
    const data = JSON.stringify(credentials);

    let url = 'app/log_in.php';
    const response = await fetch(url, {
        method: "POST",
        body: data,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let result;

    if (response.ok) {
        try {
            result = await response.json();
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    } else {
        console.error('Fetch request failed with status:', response.status);
        console.error('Response text:', await response.text()); // Log the response body as text
    }

    return result;
}

//function to greet user
const greetUser = (username) => {
    signUp.innerHTML = `<h2>Hello, ${username}!</h2>`;
};

// click login button
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let login = await finduser(loginForm.login_username.value, loginForm.login_pass.value);
    console.log(login);

    if (login && login.success === 'Action successful') {
        const usernameValue = login.sessionData.username;
        logoutBtn.style.display = 'block';
        loginForm.reset();
        signUp.innerHTML = '';
        insert.style.display = 'block';
        icons.style.display = 'block';
        
        //call function to greet user
        greetUser(usernameValue);
        let note = await fetchNotes('app/select.php');
        displayData(note);
    } else {
        // Display the error message in the "error-message" div
        const errorMessageDiv = document.querySelector("#error-message-in");
        errorMessageDiv.innerHTML = '<p>Wrong email or password</p>';
        setTimeout(() => {
            errorMessageDiv.innerHTML = ''; // Clear the error message
        }, 3000); // 3000 milliseconds (3 seconds)
        // alert('Wrong username or password');
    }
});

//function to sign up and add new note
export const inserter = async (data, url) => {
    const response = await fetch(url, {
        method: 'POST',
        body: data
    });

    let status = false;

    if (response.status === 200) {
        const confirmation = await response.json();
        console.log(confirmation);

        if (!confirmation[0].error && confirmation[0].success === 'Action successful') {
            let note = await fetchNotes('app/select.php');
            displayData(note);
            insert.style.display = 'block';
            status = true;

        } else {
            // Get the error message from the response
            const errorMessage = confirmation.error;
            console.log('Error message:', errorMessage);
        }

        // clear input and textarea fields
        const subjectInput = document.querySelector('input[name="note_subject"]');
        const textArea = document.querySelector('textarea[name="note_text"]');
        
        subjectInput.value = '';
        textArea.value = '';
    }

    return status;
};

// sign up
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Serialize the form data into a FormData object
    const formData = new FormData(signupForm);

    // Check if the passwords match
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm_password');
    if (password !== confirmPassword) {
        // Passwords do not match, display an error message
        const errorMessageDiv = document.querySelector("#error-message-up");
        errorMessageDiv.innerHTML = '<p>Passwords do not match</p>';
        setTimeout(() => {
            errorMessageDiv.innerHTML = ''; // Clear the error message
        }, 3000); // 3000 milliseconds (3 seconds)
        insert.style.display = 'none';
        return; // Exit the function to prevent form submission
    }

    if (password.length < 8) {
        // Password is too short, display an error message
        const errorMessageDiv = document.querySelector("#error-message-up");
        errorMessageDiv.innerHTML = '<p>Password must be at least 8 characters long</p>';
        setTimeout(() => {
            errorMessageDiv.innerHTML = ''; // Clear the error message
        }, 3000); // 3000 milliseconds (3 seconds)
        insert.style.display = 'none';
        return; // Exit the function to prevent form submission
    }

    // Call a function to submit the form data (e.g., send it to the server)
    const url = 'app/sign_up.php';
    let signupSuccess = await inserter(formData, url);

    if (signupSuccess) {
        logoutBtn.style.display = 'block';
        icons.style.display = 'block';

        //call function to greet user
        const userName = document.querySelector('#username');
        const usernameValue = userName.value;
        greetUser(usernameValue);
        
    } else {
        // Display the error message in the "error-message" div
        const errorMessageDiv = document.querySelector("#error-message-up");
        errorMessageDiv.innerHTML = '<p>Email already exists</p>';
        setTimeout(() => {
            errorMessageDiv.innerHTML = ''; // Clear the error message
        }, 3000); // 3000 milliseconds (3 seconds)
        logoutBtn.style.display = 'none';
        icons.style.display = 'none';
    }
});


//log in - sign up change
document.querySelector('#showSignUpLink').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#signup').style.display = 'block';
    document.querySelector('#signin').style.display = 'none';
    logoutBtn.style.display = 'none';
});

document.querySelector('#showSignInLink').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#signin').style.display = 'block';
    document.querySelector('#signup').style.display = 'none';
    logoutBtn.style.display = 'none';
});


// post new note
export const getFormData = async (event) => {
    event.preventDefault();
    //get the form data & call an async function
    const insertFormData = new FormData(document.querySelector('#insert-form'));
    let url = 'app/insert.php';
    inserter(insertFormData, url);
    // refresh the page
    let note = await fetchNotes('app/select.php');
    displayData(note);
}