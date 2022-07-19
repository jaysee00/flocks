import './canvas.css';
import Point from "./modules/point.js";
import Vector from "./modules/vector.js";
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
        window.cancelAnimationFrame(raf);
    } else {
        pauseButton.innerHTML = 'Pause';
        raf = window.requestAnimationFrame(step);
    }
});

const randomButton = document.getElementById('random');
randomButton.onclick = () => {
    graph.add(Boid.randomBoid());
};

const debugCheckbox = document.getElementById('debug');
debugCheckbox.onchange = () => {
    debug = debugCheckbox.checked;
}

const graph = new Graph();
graph.add(Boid.randomBoid());
graph.add(Boid.randomBoid());
graph.add(Boid.randomBoid());

let start;
let previousTimestamp = 0;
let done = false;

function step(timestamp) {
    if (start === undefined) {
        start = timestamp;
    }



    const delta = timestamp - previousTimestamp;
    console.log(delta);
    if (delta > 0) {
        graph.update(delta);
    }

    // canvas top left is (0,0)
    // canvas bottom right is (600,600)
    ctx.clearRect(0, 0, CANVAS_MAX_X, CANVAS_MAX_Y);

    if (debug) {
        ctx.font = '14px Arial';
        ctx.fillText("Debug", 10, 20);
    }

    ctx.save();
    graph.draw(ctx, debug);
    ctx.restore();

    previousTimestamp = timestamp;
    if (!done) {
        raf = window.requestAnimationFrame(step);
    }
}

raf = window.requestAnimationFrame(step);