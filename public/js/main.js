const title = document.getElementById('title');
const button = document.getElementById('loadVideoButton');
const nameInput = document.getElementById('nameInput');
const videoContainer = document.getElementById('videoContainer');
const container = document.querySelector('.container');

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

// Display Video or Error Message
// Display Video or Error Message
function displayVideoOrMessage(name) {
  fetch('/get-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: name.toLowerCase() }) // Always lowercase
  })
      .then(response => response.json())
      .then(data => {
          const container = document.querySelector('.container');

          if (data.error) {
              container.classList.remove('container-expanded');
              
              videoContainer.innerHTML = `
                  <div class="error-message">
                      Sorry, the elves didn't prepare a surprise for <strong>${capitalizeName(name)}</strong> yet! 🎅
                  </div>
              `;
              videoContainer.classList.add('show');
          } else {
              container.classList.add('container-expanded');
              
              // Ensure lowercase for filenames
              const lowercaseName = name.toLowerCase();
              const videoSrc = isMobileScreen()
                  ? `/videos/mobil-${lowercaseName}.mp4`
                  : `/videos/christmas-present-${lowercaseName}.mp4`;

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
          const container = document.querySelector('.container');
          container.classList.remove('container-expanded');
          
          videoContainer.innerHTML = `
              <div class="error-message">
                  Oops! Something went wrong. Please try again later. 🛠️
              </div>
          `;
          videoContainer.classList.add('show');
      });
}

// Load Video with Expanded Container
button.addEventListener('click', () => {
  const firstName = nameInput.value.trim();

  if (!firstName) {
      alert('Please enter your name!');
      return;
  }

  const capitalizedFirstName = capitalizeName(firstName);

  // Typing Animation
  typeGreeting(capitalizedFirstName, () => {
      const container = document.querySelector('.container');
      container.classList.add('container-expanded'); // Apply gradient background for video view

      // Display Video
      displayVideoOrMessage(capitalizedFirstName);
  });
});
