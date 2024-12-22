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
            setTimeout(typeNameText, 300); // Delay between lines
        }
    }

    function typeNameText() {
        if (j < nameText.length) {
            nameSpan.textContent += nameText[j++];
            setTimeout(typeNameText, 75);
        } else if (callback) {
            setTimeout(callback, 500); // Delay before showing the video
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

    // Clear the videoContainer and set message
    videoContainer.innerHTML = '';

    // Start Typing Animation
    typeGreeting(firstName, () => {
        fetch('/get-video', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName: firstName.toLowerCase() })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    videoContainer.innerHTML = `
                        <div style="text-align: center; font-size: 1.2rem; color: #ff3333; margin-top: 20px;">
                            Sorry, the Santa’s elves didn’t create a surprise for <strong>${firstName}</strong> yet! 
                            <img src="/images/santa-icon-no-bg.png" alt="Santa's Elf" style="width: 40px; height: 40px; margin-left: 5px;">
                        </div>
                    `;
                    return;
                }

                const videoFileName = isMobileScreen()
                    ? `mobil-${data.videoKey}.mp4`
                    : `Christmas-Present-${data.videoKey.charAt(0).toUpperCase() + data.videoKey.slice(1)}.mp4`;

                const videoSrc = `/videos/${videoFileName}`;

                // Add video dynamically without autoplay
                videoContainer.innerHTML = `
                    <video controls>
                        <source src="${videoSrc}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                `;
                videoContainer.classList.add('show');
            })
            .catch(err => console.error('Error:', err));
    });
});
