import './canvas.css';
import Point from "./modules/point.js";
import Vector from "./modules/vector.js";
import Flock from './modules/flock.js';
import Boid from "./modules/boid.js";
import Graph from './modules/graph.js';
import { CANVAS_MAX_X, CANVAS_MAX_Y } from './modules/util';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let paused = false;
let debug = false;
let raf;

const pauseButton = document.getElementById('pause');
pauseButton.onclick = (() => {
    paused = !paused;
    if (paused) {
        pauseButton.innerHTML = 'Resume';
        stepButton.disabled = false;
        window.cancelAnimationFrame(raf);
    } else {
        pauseButton.innerHTML = 'Pause';
        stepButton.disabled = true;
        raf = window.requestAnimationFrame(step);

    }
});

const stepButton = document.getElementById('step');
stepButton.onclick = (() => {
    step(previousTimestamp + 16, false);
});

const randomButton = document.getElementById('random');
randomButton.onclick = () => {
    graph.add(Boid.randomBoid());
};

const randomFlockButton = document.getElementById('randomFlock');
randomFlockButton.onclick = () => {
    graph.add(Flock.randomFlock());
}

const debugCheckbox = document.getElementById('debug');
debugCheckbox.onchange = () => {
    debug = debugCheckbox.checked;
}

const graph = new Graph();
// graph.add(Boid.randomBoid());
// graph.add(Boid.randomBoid());
// graph.add(Boid.randomBoid());
graph.add(Flock.randomFlock());

let start;
let previousTimestamp = 0;

function step(timestamp, repeat = true) {
    console.log(`Step`);
    if (start === undefined) {
        start = timestamp;
    }

    // Update
    const delta = timestamp - previousTimestamp;
    console.log(delta);
    if (delta > 0) {
        previousTimestamp = timestamp;
        console.log("Updating graph");
        graph.update(delta);
    }

    // Render
    ctx.clearRect(0, 0, CANVAS_MAX_X, CANVAS_MAX_Y);
    if (debug) {
        ctx.font = '14px Arial';
        ctx.fillText("Debug", 10, 20);
    }
    ctx.save();
    graph.draw(ctx, debug);
    ctx.restore();

    if (repeat) {
        raf = window.requestAnimationFrame(step);
    }
}

raf = window.requestAnimationFrame(step);