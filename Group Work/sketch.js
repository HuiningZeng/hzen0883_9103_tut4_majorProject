var img;
var img2;
var img3;
var img4;
var img5;
var WIDTH;
var HEIGHT;
var pixelSize = 10;  // Square size
var totalPixels;
var drawnPixels = 0;
var pixelsToDraw;
var startWave = false;
var img2X, img2Y, img2Direction,img2Speed; // Position, movement direction, and speed of the first image
var img3X, img3Y, img3Direction,img3Speed; // Position, movement direction, and speed of the second image
var img4X, img4Y, img4Direction, img4Speed; // Position, movement direction, and speed of the forth image
var img5X, img5Y; // Position of the fifth image
var img2Width, img2Height; // Width and height of the second image after shrinking
var img3Width, img3Height; // Width and height of the third image after shrinking
var img4Width, img4Height; // Width and height of the fourth image after shrinking
var img5Width, img5Height; // Width and height of the fifth image after shrinking


function preload() {
  img = loadImage("assets/1.jpg");
  img2 = loadImage("assets/gull1.png");
  img3 = loadImage("assets/gull2.png");
  img4 = loadImage("assets/boat.png");
  img5 = loadImage("assets/sunset.png"); // Import image
}

function setup() {
  WIDTH = img.width;
  HEIGHT = img.height;
  createCanvas(WIDTH, HEIGHT);
  imageMode(CENTER);
  noStroke();
  background(255);
  img.loadPixels();
  img5.loadPixels(); // Pixel dimensions of the image
  
// Initialize the position and movement direction of the second image
  img2X = WIDTH / 2;
  img2Y = HEIGHT / 4;
  img2Direction = 1; // Initial movement to the right
  img2Speed = 0.5; // Set speed

  img2Width = img2.width / 2;
  img2Height = img2.height / 2; // Size after scaling

  // Initialize the position and movement direction of the third image
  img3X = WIDTH / 1.25; // 
  img3Y = HEIGHT / 4; // 
  img3Direction = -1; // Initial movement to the left
  img3Speed = 0.5;

  // Initialize the width and height of the third image after shrinking
  img3Width = img3.width / 2;
  img3Height = img3.height / 2;

  // Initialize the position, movement direction, and speed of the fourth image
  img4X = WIDTH / 1.5; // 
  img4Y = HEIGHT * 3 / 4; // 
  img4Direction = 1; // Initial movement to the right
  img4Speed = 1; // 

  // Initialize the width and height of the fourth image after shrinking
  img4Width = img4.width / 2;
  img4Height = img4.height / 2;

   // Initialize the position of the fifth image
   img5X = WIDTH * 0.65; // 
   img5Y = HEIGHT * 0.42; // 
   img5Scale = 0.5; // Reduce to half of the original size

  pixelsToDraw = new Array();
  for (let y = 0; y < HEIGHT; y += pixelSize) {
    for (let x = 0; x < WIDTH; x += pixelSize) {
      const frequency = random(0.01, 0.05)
      const amplitude = 20 + (x % pixelSize) * 10
      const oy = random(-30, 30)
      pixelsToDraw.push({x: x, y: y, frequency: frequency, offset: 0, amplitude: amplitude, oy: oy});
    }
  }
  shuffle(pixelsToDraw, true);

  totalPixels = pixelsToDraw.length;
  frameRate(1000);
}

function draw() {
  if (!startWave) {
    for (var i = 0; i < 100; i++) {
      if (drawnPixels >= totalPixels) {
        startWave = true;  // Stop drawing
        break;
      }
      var pixel = pixelsToDraw[drawnPixels];
      var pix = img.get(pixel.x, pixel.y);
      fill(pix);
      rect(pixel.x, pixel.y, pixelSize, pixelSize);
      drawnPixels++;
    }
  }

  if (startWave) {
    wave();
  }
  // Update the position of the image
  img2X += img2Direction * img2Speed;
  if (img2X > WIDTH / 2 + 10|| img2X < WIDTH / 2 - 10) { // Set a small range of movement
    img2Direction *= -1; // Reverse the direction of movement
  }

  img3X += img3Direction * img3Speed; // Use a speed variable to control the movement speed
  if (img3X > WIDTH / 1.25 + 10 || img3X <WIDTH / 1.25 - 10) {
    img3Direction *= -1; // Reverse the direction of movement
  }
   
   img4X += img4Direction * img4Speed;
   if (img4X > WIDTH / 1.5 + 100 || img4X < WIDTH / 1.5 - 100) { // Set a small range for movement
     img4Direction *= -1; // Reverse the direction of movement
   }

  // Draw the second image
  image(img2, img2X, img2Y, img2.width / 2, img2.height / 2);
 // Draw the third image
  image(img3, img3X, img3Y, img3Width, img3Height);
  // Draw the forth image
   fill(0, 100); // Set the shadow to black and semi-transparent
  ellipse(img4X, img4Y + img4Height * 0.07, img4Width, img4Height * 0.1); // Draw an elliptical shadow
  image(img4, img4X, img4Y, img4Width, img4Height); // Shrink the image

  drawPixelatedImage(img5, img5X, img5Y, pixelSize, img5Scale);// Pixelate image 5
}

function drawPixelatedImage(img, x, y, pixelSize, scale) {
  // Scale the image
  let scaledWidth = img.width * scale;
  let scaledHeight = img.height * scale;

  // Iterate through the pixels of the image
  img.loadPixels();
  for (let py = 0; py < scaledHeight; py += pixelSize) {
    for (let px = 0; px < scaledWidth; px += pixelSize) {
      // Get the color of the current pixel
      const imgColor = img.get(px / scale, py / scale);
      // Fill the color of the current pixel using square pixel blocks
      fill(imgColor);
      rect(px + x - scaledWidth / 2, py + y - scaledHeight / 2, pixelSize, pixelSize);
    }
  }
}

//Fisher-Yates Shuffle algorithm to shuffle an array
//this technique was not covered in class(this technique is from 
//https://www.tutorialspoint.com/data_structures_algorithms/dsa_fisher_yates_shuffle_algorithm.htm)
function shuffle(array, shouldShuffle) {
  // If shouldShuffle is false, return the original array without shuffling
  if (!shouldShuffle) return array;
  // Start from the last element and iterate backwards
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random integer j between 0 and i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap array[i] and array[j]
    [array[i], array[j]] = [array[j], array[i]];
  }
  // Return the shuffled array
  return array;
}

function wave() {
  background(255);
  for (let i = 0; i < pixelsToDraw.length; i++) {
    var pixel = pixelsToDraw[i];
    var pix = img.get(pixel.x, pixel.y);
    fill(pix);

    if (pixel.y > 400 + pixel.oy) {
      let waveHeight = map(noise(pixel.offset), 0, 1, -pixel.amplitude, pixel.amplitude);
      rect(pixel.x, pixel.y, pixelSize, pixelSize);
      rect(pixel.x, pixel.y + waveHeight, pixelSize, pixelSize);
      pixel.offset += pixel.frequency;
    } else {
      rect(pixel.x, pixel.y, pixelSize, pixelSize);
    }
  }
}





