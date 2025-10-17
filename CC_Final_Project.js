let treeX;
let currentTree;

function setup() {
    createCanvas(innerWidth, innerHeight);
    background(0);
    frameRate(70);

    treeX = random(width);
    currentTree = generateTree(120, 0);
}

function draw() {
    background(0, 30);

    if (growth < maxDepth) {
        growth += growSpeed;
    }

    windTime += 0.02;
    earth();
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

function branch(node, depth) {
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
        branch(node.right, depth + 1);
        pop();
    }

    if (node.left && depth < growth) {
        push();
        rotate(-swayLeft);
        branch(node.left, depth + 1);
        pop();
    }
}

function earth() {
    push(); 
    translate(treeX, height);
    branch(currentTree, 0);
    pop();
}

function mousePressed() {
    treeX = mouseX;
    treeY = height;
    currentTree = generateTree(120, 0);
    growth = 0;
}

// ------------------ FIRE ------------------ //

let showFire = false;

function fire() {
}

// ------------------ WATER ------------------ //

let showWater = false;

function water() {

}

// ------------------ AIR ------------------ //

let showAir = false;

function air() {
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