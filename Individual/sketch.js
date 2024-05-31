var img;
var img2;
var img3;
var img4;
var img5;
var WIDTH;
var HEIGHT;
var pixelSize = 10;  // 方块大小
var totalPixels;
var drawnPixels = 0;
var pixelsToDraw;
var startWave = false;
var img2X, img2Y, img2Direction,img2Speed; // 第一张图片的位置和移动方向和速度
var img3X, img3Y, img3Direction,img3Speed; // 第二张图片的位置和移动方向和速度
var img4X, img4Y, img4Direction, img4Speed; // 第四张图片的位置、移动方向和速度
var img5X, img5Y; // 第五张图片的位置
var img2Width, img2Height; // 第三张图片缩小后的宽度和高度
var img3Width, img3Height; // 第三张图片缩小后的宽度和高度
var img4Width, img4Height; // 第四张图片缩小后的宽度和高度
var img5Width, img5Height; // 第五张图片缩小后的宽度和高度
var time = 0;


function preload() {
  img = loadImage("assets/1.jpg");
  img2 = loadImage("assets/gull1.png");
  img3 = loadImage("assets/gull2.png");
  img4 = loadImage("assets/boat.png");
  img5 = loadImage("assets/sunset.png"); // 导入图片
}

function setup() {
  WIDTH = img.width;
  HEIGHT = img.height;
  createCanvas(WIDTH, HEIGHT);
  imageMode(CENTER);
  noStroke();
  background(255);
  img.loadPixels();
  img5.loadPixels(); // 加载图片的像素

// 初始化第二张图片的位置和移动方向
  img2X = WIDTH / 2;
  img2Y = HEIGHT / 4;
  img2Direction = 1; // 初始向右移动
  img2Speed = 0.5; // 设置速度

  img2Width = img2.width / 2;
  img2Height = img2.height / 2; // 缩放后的大小

  // 初始化第三张图片的位置和移动方向
  img3X = WIDTH / 1.25; //
  img3Y = HEIGHT / 4; //
  img3Direction = -1; // 初始向左移动
  img3Speed = 0.5;

  // 初始化第三张图片缩小后的宽度和高度
  img3Width = img3.width / 2;
  img3Height = img3.height / 2;

  // 初始化第四张图片的位置、移动方向和速度
  img4X = WIDTH / 1.5; //
  img4Y = HEIGHT * 3 / 4; //
  img4Direction = 1; // 初始向右移动
  img4Speed = 1; //

  // 初始化第四张图片缩小后的宽度和高度
  img4Width = img4.width / 2;
  img4Height = img4.height / 2;

   // 初始化第五张图片的位置
   img5X = WIDTH * 0.65; //
   img5Y = HEIGHT * 0.42; //
   img5Scale = 0.5; // 缩小为原始大小的一半

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

  setInterval(() => {
    if (time < 60) {
      time += 1;
    }
  }, 200);
}

function draw() {
  if (!startWave) {
    for (var i = 0; i < 100; i++) {
      if (drawnPixels >= totalPixels) {
        startWave = true;  // 停止绘制
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
  // 更新图片的位置
  img2X += img2Direction * img2Speed;
  if (img2X > WIDTH / 2 + 10|| img2X < WIDTH / 2 - 10) { // 设置小范围的移动范围
    img2Direction *= -1; // 反转移动方向
  }

  img3X += img3Direction * img3Speed; // 使用速度变量来控制移动速度
  if (img3X > WIDTH / 1.25 + 10 || img3X <WIDTH / 1.25 - 10) {
    img3Direction *= -1; // 反转移动方向
  }

   img4X += img4Direction * img4Speed;
   if (img4X > WIDTH / 1.5 + 100 || img4X < WIDTH / 1.5 - 100) { // 设置小范围的移动范围
     img4Direction *= -1; // 反转移动方向
   }

  // 绘制第二张图片
  image(img2, img2X, img2Y, img2.width / 2, img2.height / 2);
 // 绘制第三张图片
  image(img3, img3X, img3Y, img3Width, img3Height);
  // 绘制第四张图片
   fill(0, 100); // 设置影子为黑色并半透明
  ellipse(img4X, img4Y + img4Height * 0.07, img4Width, img4Height * 0.1); // 绘制椭圆影子
  image(img4, img4X, img4Y, img4Width, img4Height); // 缩小图片

  drawPixelatedImage(img5, img5X, img5Y - 100 + time, pixelSize, img5Scale);// 图5像素风
}

function drawPixelatedImage(img, x, y, pixelSize, scale) {
  // 缩放图片
  let scaledWidth = img.width * scale;
  let scaledHeight = img.height * scale;

  // 循环遍历图片像素
  img.loadPixels();
  for (let py = 0; py < scaledHeight; py += pixelSize) {
    for (let px = 0; px < scaledWidth; px += pixelSize) {
      // 获取当前像素的颜色
      const imgColor = img.get(px / scale, py / scale);
      // 使用方形像素块填充当前像素的颜色
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
  background(255);
  for (let i = 0; i < pixelsToDraw.length; i++) {
    var pixel = pixelsToDraw[i];
    var pix = img.get(pixel.x, pixel.y);
    if (pix[0] > 130 && pix[2] < 150) {
      fill(pix[0] - (time * 2), round(pix[1] - (time * 1.5)), pix[2]);
    } else {
      fill(pix);
    }

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

function mousePressed() {
  time = 0;
}
