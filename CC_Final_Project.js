let showEarth = true;
let showFire = false;
let showWater = false;
let showAir = false;

function setup() {
    createCanvas(innerWidth, innerHeight);
    background(0);
    earth();
}

// earth
// recursive tree code by Daniel Shiffman
function branch(length) {
    line(0, 0, 0, -length);
    translate(0, -length);
    
    if(length > 2) {
        push();
        rotate(PI / 6);
        branch(length / 3);
        pop();

        push();
        rotate(- PI / 6); 
        branch(length / 2);
        pop();
    }
}

function earth() {
    stroke(150, 100, 0);
    translate(random(width), height);
    branch(120);
}

function fire() {
}

function water() {
}

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