const title = document.getElementById('title');
const button = document.getElementById('loadVideoButton');
const nameInput = document.getElementById('nameInput');
const videoContainer = document.getElementById('videoContainer');

// Function to capitalize the first letter of the name
function capitalizeName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

// Function to check screen size
function isMobileScreen() {
    return window.innerWidth <= 768; // Mobile threshold
}

// Typing Animation
function typeGreeting(name, callback) {
    title.innerHTML = '<span class="greeting"></span><span class="name"></span>';
    const greetingSpan = title.querySelector('.greeting');
    const nameSpan = title.querySelector('.name');

    const greetingText = 'Merry Christmas,';
    const nameText = `${name} 🎄`;
    let i = 0, j = 0;

    // Type "Merry Christmas,"
    function typeGreetingText() {
        if (i < greetingText.length) {
            greetingSpan.textContent += greetingText[i++];
            setTimeout(typeGreetingText, 75);
        } else {
            setTimeout(typeNameText, 300); // Small pause before typing name
        }
    }

    // Type "[Name] 🎄"
    function typeNameText() {
        if (j < nameText.length) {
            nameSpan.textContent += nameText[j++];
            setTimeout(typeNameText, 75);
        } else if (callback) {
            setTimeout(callback, 500); // Callback after typing completes
        }
    }

    typeGreetingText();
}

// Display Video or Error Message
function displayVideoOrMessage(name) {
    fetch('/get-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: name.toLowerCase() })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                // Show error message
                videoContainer.innerHTML = `
                    <div class="error-message">
                        Sorry, the elves didn't prepare a surprise for <strong>${capitalizeName(name)}</strong> yet! 🎅
                    </div>
                `;
                videoContainer.classList.add('show');
            } else {
                // Show video
                const videoSrc = isMobileScreen()
                    ? `/videos/mobil-${name}.mp4`
                    : `/videos/Christmas-Present-${capitalizeName(name)}.mp4`;

                videoContainer.innerHTML = `
                    <video controls>
                        <source src="${videoSrc}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                `;
                videoContainer.classList.add('show');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            videoContainer.innerHTML = `
                <div class="error-message">
                    Oops! Something went wrong. Please try again later. 🛠️
                </div>
            `;
            videoContainer.classList.add('show');
        });
}

// Button Event Listener
button.addEventListener('click', () => {
    const firstName = nameInput.value.trim();

    if (!firstName) {
        alert('Please enter your name!');
        return;
    }

    const capitalizedFirstName = capitalizeName(firstName);

    // Step 1: Show Typing Animation
    typeGreeting(capitalizedFirstName, () => {
        // Step 2: Display Video or Error Message after typing finishes
        displayVideoOrMessage(capitalizedFirstName);
    });
});
