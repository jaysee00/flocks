import './canvas.css';
import Point from "./modules/point.js";
import Vector from "./modules/vector.js";
import Boid from "./modules/boid.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let paused = false;
let raf;

const pauseButton = document.getElementById('pause');
pauseButton.onclick = ((ev) => {
    paused = !paused;
    if (paused) {
        pauseButton.innerHTML = 'Resume';
        window.cancelAnimationFrame(raf);
    } else {
        pauseButton.innerHTML = 'Pause';
        raf = window.requestAnimationFrame(step);
    }
});

// canvas top left is (0,0)
// canvas bottom right is (600,600)

ctx.fillStyle = 'green';

// ctx.fillRect(10, 10, 150, 100);



const boid = new Boid(new Point(100, 100), new Vector(0.5, .5));
const boid2 = new Boid(new Point(300, 300), new Vector(0, .2));

let start;
let previousTimestamp = 0;
let done = false;

function step(timestamp) {
    if (start === undefined) {
        start = timestamp;
    }

    const elapsed = timestamp - start;
    if (previousTimestamp !== timestamp) {
        const count = Math.min(0.1 * elapsed, 200);
        boid.update();
        boid2.update();

    }
    ctx.clearRect(0, 0, 600, 600);
    ctx.save();
    boid.draw(ctx)
    boid2.draw(ctx);
    ctx.restore();

    previousTimestamp = timestamp;
    if (!done) {
        raf = window.requestAnimationFrame(step);
    }
}

raf = window.requestAnimationFrame(step);