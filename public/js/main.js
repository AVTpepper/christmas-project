const button = document.getElementById('loadVideoButton');
const nameInput = document.getElementById('nameInput');
const videoContainer = document.getElementById('videoContainer');

// Function to check screen size
function isMobileScreen() {
  return window.innerWidth <= 768; // Consider screens <= 768px as mobile
}

button.addEventListener('click', () => {
  const firstName = nameInput.value.trim().toLowerCase();

  if (!firstName) {
    alert('Please enter your name!');
    return;
  }

  fetch('/get-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName })
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
      } else {
        const videoFileName = isMobileScreen()
          ? `mobile-${data.videoKey}.mp4`
          : `Christmas-Present-${data.videoKey.charAt(0).toUpperCase() + data.videoKey.slice(1)}.mp4`;

        const videoSrc = `/videos/${videoFileName}`;

        videoContainer.innerHTML = `
          <video controls autoplay>
            <source src="${videoSrc}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        `;
      }
    })
    .catch(err => console.error('Error:', err));
});
