var img; // Main image
var img2; // Image of first seagull
var img3; // Image of second seagull
var img4; // Image of boat
var img5; // Image of sunset
var WIDTH; // Width of canvas
var HEIGHT; // Height of canvas
var pixelSize = 10; // Size of each pixel block
var totalPixels; // Total number of pixels to be drawn
var drawnPixels = 0; // Counter for drawn pixels
var pixelsToDraw; // Array to hold pixel data for wave effect
var startWave = false; // Flag to start wave animation
var img2X, img2Y, img2Direction, img2Speed; // Variables for first seagull position and movement
var img3X, img3Y, img3Direction, img3Speed; // Variables for second seagull position and movement
var img4X, img4Y, img4Direction, img4Speed; // Variables for boat position and movement
var img5X, img5Y, img5Scale; // Variables for sunset position and scale
var img2Width, img2Height; // Dimensions for first seagull
var img3Width, img3Height; // Dimensions for second seagull
var img4Width, img4Height; // Dimensions for boat
var img5Width, img5Height; // Dimensions for sunset
var time = 0; // Timer for animation
var bgm; // Background music
var timeInterval; // timer

function preload() {
  // Load images
  img = loadImage("assets/1.jpg");
  img2 = loadImage("assets/gull1.png");
  img3 = loadImage("assets/gull2.png");
  img4 = loadImage("assets/boat.png");
  img5 = loadImage("assets/sunset.png");

  // Load music
  bgm = loadSound('assets/bgm.mp3');
}

function setup() {
  // Set canvas dimensions
  WIDTH = windowWidth;
  HEIGHT = windowHeight;

  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  noStroke();
  background(255);
  img.resize(windowWidth, windowHeight);
  img.loadPixels();
  img5.loadPixels();

  // Initialize first seagull position and movement
  img2X = WIDTH / 2;
  img2Y = HEIGHT / 4;
  img2Direction = 1;
  img2Speed = 0.5;
  img2Width = img2.width / 2;
  img2Height = img2.height / 2;

  // Initialize second seagull position and movement
  img3X = WIDTH / 1.25;
  img3Y = HEIGHT / 4;
  img3Direction = -1;
  img3Speed = 0.5;
  img3Width = img3.width / 2;
  img3Height = img3.height / 2;

  // Initialize boat position and movement
  img4X = WIDTH / 1.5;
  img4Y = HEIGHT * 3 / 4;
  img4Direction = 1;
  img4Speed = 1;
  img4Width = img4.width / 2;
  img4Height = img4.height / 2;

  // Initialize sunset position and scale
  img5X = WIDTH * 0.65;
  img5Y = HEIGHT * 0.42;
  img5Scale = 0.5;

  // Create array of pixels to draw with wave effect
  pixelsToDraw = new Array();
  for (let y = 0; y < HEIGHT; y += pixelSize) {
    for (let x = 0; x < WIDTH; x += pixelSize) {
      const frequency = random(0.01, 0.05);
      const amplitude = 20 + (x % pixelSize) * 10;
      const oy = random(-30, 30);
      pixelsToDraw.push({x: x, y: y, frequency: frequency, offset: 0, amplitude: amplitude, oy: oy});
    }
  }
  shuffle(pixelsToDraw, true); // Shuffle the pixels array

  totalPixels = pixelsToDraw.length; // Set total number of pixels to draw
  frameRate(1000); // Set frame rate

  // Increment time every 200ms
  timeInterval = setInterval(() => {
    if (time < 60) {
      time += 1;
    }
  }, 200);
}

function draw() {
  if (!startWave) {
    // Draw the initial pixelated image
    for (var i = 0; i < 100; i++) {
      if (drawnPixels >= totalPixels) {
        // Set start to wave flag to true
        startWave = true;
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
    wave(); // Start wave animation
  }

  // Update first seagull position
  img2X += img2Direction * img2Speed;
  if (img2X > WIDTH / 2 + 10 || img2X < WIDTH / 2 - 10) {
    img2Direction *= -1;
  }

  // Update second seagull position
  img3X += img3Direction * img3Speed;
  if (img3X > WIDTH / 1.25 + 10 || img3X < WIDTH / 1.25 - 10) {
    img3Direction *= -1;
  }

  // Update boat position
  img4X += img4Direction * img4Speed;
  if (img4X > WIDTH / 1.5 + 100 || img4X < WIDTH / 1.5 - 100) {
    img4Direction *= -1;
  }

  // Draw first seagull
  image(img2, img2X, img2Y, img2.width / 2, img2.height / 2);

  // Draw second seagull
  image(img3, img3X, img3Y, img3Width, img3Height);

  // Draw boat with shadow
  fill(0, 100);
  ellipse(img4X, img4Y + img4Height * 0.07, img4Width, img4Height * 0.1);
  image(img4, img4X, img4Y, img4Width, img4Height);

  // Draw pixelated sunset image
  drawPixelatedImage(img5, img5X, img5Y - 100 + time, pixelSize, img5Scale);
}

function drawPixelatedImage(img, x, y, pixelSize, scale) {
  // Draw the sunset image in a pixelated style
  let scaledWidth = img.width * scale;
  let scaledHeight = img.height * scale;

  img.loadPixels();
  for (let py = 0; py < scaledHeight; py += pixelSize) {
    for (let px = 0; px < scaledWidth; px += pixelSize) {
      const imgColor = img.get(px / scale, py / scale);
      fill(imgColor);
      rect(px + x - scaledWidth / 2, py + y - scaledHeight / 2, pixelSize, pixelSize);
    }
  }
}

// Fisher-Yates Shuffle Algorithm
function shuffle(array, shouldShuffle) {
  if (!shouldShuffle) return array;
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function wave() {
  background(255); // Clear the background
  for (let i = 0; i < pixelsToDraw.length; i++) {
    var pixel = pixelsToDraw[i];
    var pix = img.get(pixel.x, pixel.y);

    // Adjust color for wave effect
    if (pix[0] > 130 && pix[2] < 150) {
      fill(pix[0] - (time * 2), round(pix[1] - (time * 1.5)), pix[2]);
    } else {
      fill(pix);
    }

    // Check current pixel need be wave
    if (pixel.y > HEIGHT * 0.6 + pixel.oy) {
      let waveHeight = map(noise(pixel.offset), 0, 1, -pixel.amplitude, pixel.amplitude);
      rect(pixel.x, pixel.y, pixelSize, pixelSize);
      rect(pixel.x, pixel.y + waveHeight, pixelSize, pixelSize);
      pixel.offset += pixel.frequency;
    } else {
      rect(pixel.x, pixel.y, pixelSize, pixelSize);
    }
  }
}

function mousePressed() {
  time = 0; // Reset timer when mouse is pressed

  if (!bgm.isPlaying()) {
    bgm.play(); // Play music
  }
}

function windowResized() {
  // Clear timer interval
  clearInterval(timeInterval);
  // Reset variable
  time = 0;
  startWave = false;
  drawnPixels = 0;
  // Recall setup
  setup();
}
