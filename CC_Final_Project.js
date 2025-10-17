let started = false;
let startButton;

let trees = [];
let treeX;
let currentTree;

let lines = [];
let t = 0;
let numLines = 100;

let blobs = [];
let numBlobs = 30;
let points = 30;

function setup() {
    createCanvas(innerWidth, innerHeight);
    background(0);
    frameRate(70);

    treeX = random(width);
    currentTree = generateTree(120, 0);

    for (let i = 0; i < numLines; i++) {
        let y = map(i, 0, numLines, -50, height + 50);
        let len = width;
        lines.push(new HorizontalLine(y, len));
    }

    for (let i = 0; i < numBlobs; i++) {
        blobs.push(new Blob(random(width), random(height), random(50, 150)));
    }

    startButton = createButton("Start");
    startButton.style("font-size", "20px");
    startButton.style("padding", "10px 30px");
    startButton.style("border-radius", "10px");
    startButton.style("background", "#ff20");
    startButton.style("color", "white");
    startButton.position(width / 2 - 35, height / 2 - 20);
    startButton.mousePressed(startSketch);
  
    noLoop();
}

function startSketch() {
    started = true;
    startButton.hide();
    loop();
    showEarth = true;
}

function draw() {
    if (!started) {
        background(0);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(25);
        text("The Human Experience", width / 2, height / 2 - 100);
        textSize(18);
        text("Creative Coding 2025", width / 2, height / 2 - 70);
        return;
    }

    background(0, 30);

    if (growth < maxDepth) {
        growth += growSpeed;
    }

    windTime += 0.02;

    if (showEarth) {
        earth();
    } else if (showFire) {
        fire();
    } else if (showWater) {
        water();
    } else if (showAir) {
        air();
    }
}

function keyPressed() {
    if(key == " ") {
        if(showEarth) {
            showEarth = false;
            showFire = true;
            fire();
        } else if(showFire) {
            showFire = false;
            showWater = true;
            water();
        } else if(showWater) {
            showWater = false;
            showAir = true;
            air();
        }
    }
}

function mousePressed() {
   if (showEarth) {
        let newTree = {
            x: mouseX,
            tree: generateTree(120, 0),
            growth: 0,
        };
        trees.push(newTree);
    } else if (showFire) {
        for (let i = 0; i < 20; i++) {
            fireParticles.push(new FireParticle(mouseX, mouseY));
        }
    }
}

// ------------------ EARTH ------------------ //
// recursive tree code by Daniel Shiffman
// https://natureofcode.com/fractals/

let showEarth = true;
let spawnTime = 0;
let maxTrees = 5;
let maxDepth = 15;
let growSpeed = 0.05;
let growth = 0;
let windTime = 0;

function generateTree(length, depth) {
  if (length < 2 || depth >= maxDepth) return null;

  const node = {
    length,
    angleRight: random(PI / 8, PI / 5),
    angleLeft: random(PI / 8, PI / 5),
    shrinkRight: random(0.55, 0.85),
    shrinkLeft: random(0.55, 0.85),
    depth,
  };

  node.right = generateTree(length * node.shrinkRight, depth + 1);
  node.left = generateTree(length * node.shrinkLeft, depth + 1);

  return node;
}

function branch(node, depth, growth) {
    if (depth > growth) return;

    let shade = map(depth, 0, maxDepth, 80, 200);
    let branchStroke = map(node.length, 120, 2, 8, 0.5);
    strokeWeight(branchStroke);
    
    stroke(shade + 70, shade + 10, 0);
    line(0, 0, 0, -node.length);
    translate(0, -node.length);

    let windStrength = 0.05;
    let swayRight = node.angleRight + sin(windTime + node.depth) * windStrength;
    let swayLeft  = node.angleLeft  + sin(windTime + node.depth + 1) * windStrength;

    if (node.right && depth < growth) {
        push();
        rotate(swayRight);
        branch(node.right, depth + 1, growth);
        pop();
    }

    if (node.left && depth < growth) {
        push();
        rotate(-swayLeft);
        branch(node.left, depth + 1, growth);
        pop();
    }
}

function earth() {
    for (let t of trees) {

        if (t.growth < maxDepth) {
            t.growth += growSpeed;
        }

        push();
        translate(t.x, height);
        branch(t.tree, 0, t.growth);
        pop();
    }
}

// ------------------ FIRE ------------------ //
// 

let showFire = false;
let fireParticles = [];

class FireParticle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D().mult(random(2, 5));
    this.radius = random(4, 10);
    this.c = color(random(200, 255), random(50, 100), 0);
  }

  update() {
    this.position.add(this.velocity);

    if (this.position.x < 0 || this.position.x > width) this.velocity.x *= -1;
    if (this.position.y < 0 || this.position.y > height) this.velocity.y *= -1;
  }

  draw() {
    noStroke();
    fill(this.c);
    ellipse(this.position.x, this.position.y, this.radius);
  }
}

function fire() {
    for (let p of fireParticles) {
        p.update();
        p.draw();
    }
}

// ------------------ WATER ------------------ //

let showWater = false;

class HorizontalLine {
  constructor(y, length) {
    this.y = y;
    this.length = length;
    this.c = color(0, map(y, 0, height, 255, 50), 200);
    this.noiseOffset = random(1000);
  }

  drawWave(time) {
    stroke(this.c);
    strokeWeight(2);
    noFill();

    beginShape();
    for (let x = 0; x < this.length; x += 2) {
      let amp = map(noise(this.noiseOffset + x * 0.01), 0, 1, 5, 30);
      let offsetY = sin((x / this.length) * TWO_PI + time) * amp;
      vertex(x, this.y + offsetY);
    }
    endShape();
  }
}

function water() {
    t += 0.05;
    for (let l of lines) {
        l.drawWave(t);
    }
}

// ------------------ AIR ------------------ //
// 

let showAir = false;

class Blob {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.alpha = random(50, 120);
    this.speed = random(0.2, 1);
    this.offsets = [];
    this.noiseSeed = random(1000);
    for (let i = 0; i < points; i++) {
      this.offsets.push(random(-20, 20));
    }
  }

  update() {
    this.x += this.speed;
    if (this.x - this.radius > width) this.x = -this.radius;

    for (let i = 0; i < this.offsets.length; i++) {
      this.offsets[i] = map(noise(this.noiseSeed + i * 0.1 + frameCount * 0.01), 0, 1, -30, 30);
    }
  }

  display() {
    fill(255, this.alpha);
    noStroke();

    beginShape();
    for (let i = 0; i < points; i++) {
      let angle = map(i, 0, points, 0, TWO_PI);
      let r = this.radius + this.offsets[i];
      let x = this.x + cos(angle) * r;
      let y = this.y + sin(angle) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}

function air() {
    for (let blob of blobs) {
        blob.update();
        blob.display();
    }
}