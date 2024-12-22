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

    function typeGreetingText() {
        if (i < greetingText.length) {
            greetingSpan.textContent += greetingText[i++];
            setTimeout(typeGreetingText, 75);
        } else {
            setTimeout(typeNameText, 300);
        }
    }

    function typeNameText() {
        if (j < nameText.length) {
            nameSpan.textContent += nameText[j++];
            setTimeout(typeNameText, 75);
        } else if (callback) {
            setTimeout(callback, 500);
        }
    }

    typeGreetingText();
}

// Button Event Listener
button.addEventListener('click', () => {
    const firstName = capitalizeName(nameInput.value.trim());

    if (!firstName) {
        alert('Please enter your name!');
        return;
    }

    typeGreeting(firstName, () => {
        const videoSrc = isMobileScreen()
            ? `/videos/mobil-${firstName}.mp4`
            : `/videos/Christmas-Present-${firstName}.mp4`;

        videoContainer.innerHTML = `
            <video controls>
                <source src="${videoSrc}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        `;
        videoContainer.classList.add('show');
    });
});
