function setup() {
    createCanvas(innerWidth, innerHeight);
    background(0);
    frameRate(5);
}

function draw() {
    background(0, 40);

    if (growth < maxDepth) {
        growth += growSpeed;
    }

    earth();
}

// ------------------ EARTH ------------------ //
// recursive tree code by Daniel Shiffman
// https://natureofcode.com/fractals/

let showEarth = true;
let trees = [];
let spawnTime = 0;
let maxTrees = 5;
let maxDepth = 15;
let growSpeed = 0.3;
let growth = 0;

function branch(length, depth) {
    if (depth > growth) return;

    let shade = map(depth, 0, maxDepth, 80, 200);
    let branchStroke = map(length, 120, 2, 8, 0.5);
    strokeWeight(branchStroke);
    
    stroke(shade + 70, shade + 10, 0);
    line(0, 0, 0, -length);
    translate(0, -length);
    
    if(length > 2) {
        let shrink = random(0.55, 0.85);
        let angle = random(PI / 8, PI / 5);

        push();
        rotate(angle);
        branch(length * shrink, depth + 1);
        pop();

        push();
        rotate(-angle); 
        branch(length * shrink, depth + 1);
        pop();
    }
}

function earth() {
    translate(random(width), height);
    branch(120, 0);
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