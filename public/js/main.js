const button = document.getElementById('loadVideoButton');
const nameInput = document.getElementById('nameInput');
const videoContainer = document.getElementById('videoContainer');

// Event listener for button click
button.addEventListener('click', () => {
  const firstName = nameInput.value.trim();
  
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
      videoContainer.innerHTML = `
        <video controls autoplay width="600">
          <source src="${data.videoPath}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;
    }
  })
  .catch(err => console.error('Error:', err));
});
