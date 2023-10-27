// Get the tutorial element
const tutorialElement = document.querySelector('#tutorial');

// Create a container element
const containerElement = document.createElement('div');
containerElement.classList.add('side-container');

// Create an image element
const imageElement = document.createElement('img');
imageElement.src = 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmFuZG9tfGVufDB8fDB8fHww';
imageElement.alt = 'Image 1';

imageElement.setAttribute('class', 'tutorial-image');
imageElement.setAttribute('id', 'tutorial-image-1');

// Append the image element to the container element
containerElement.appendChild(imageElement);

// Append the container element to the tutorial element
tutorialElement.appendChild(containerElement);

const sideContainer = document.querySelector('.side-container');

// Get the image element in the side container
const image = sideContainer.querySelector('img');

// Create a scroll event listener
window.addEventListener('scroll', function() {
  // Get the user's current scroll position
  const scrollPosition = window.scrollY;

  // Change the image in the side container based on the user's current scroll position
  if (scrollPosition < 500) {
    image.src = 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmFuZG9tfGVufDB8fDB8fHww';
  } else if (scrollPosition < 1500) {
    image.src = 'https://cdn.pixabay.com/photo/2015/03/17/02/01/cubes-677092_1280.png';
  } else if (scrollPosition < 2500) {
    image.src = 'https://clipart-library.com/data_images/6103.png';
  }
});