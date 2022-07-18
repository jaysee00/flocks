import './canvas.css';
import Point from "./modules/point.js";
import Vector from "./modules/vector.js";
import Boid from "./modules/boid.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let paused = false;
let debug = false;
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

const randomButton = document.getElementById('random');
randomButton.onclick = () => {
    boids.push(Boid.randomBoid());
};

const debugCheckbox = document.getElementById('debug');
debugCheckbox.onchange = () => {
    debug = debugCheckbox.checked;
}

const boids = [];
boids.push(new Boid(new Point(100, 100), new Vector(0.5, .5), 'green'));
boids.push(new Boid(new Point(300, 300), new Vector(0, .2), 'purple'));

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
        boids.forEach(b => b.update());
    }
    // canvas top left is (0,0)
    // canvas bottom right is (600,600)
    ctx.clearRect(0, 0, 600, 600);

    if (debug) {
        ctx.font = '14px Arial';
        ctx.fillText("Debug", 10, 20);
    }

    ctx.save();
    boids.forEach(b => b.draw(ctx, debug));
    ctx.restore();

    previousTimestamp = timestamp;
    if (!done) {
        raf = window.requestAnimationFrame(step);
    }
}

raf = window.requestAnimationFrame(step);