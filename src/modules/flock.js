import { v4 as uuidv4 } from 'uuid';
import Boid from './boid.js';
import { randomColour, CANVAS_MAX_X, CANVAS_MAX_Y } from './util.js';
import Point from './point.js';

const MAX_FLOCK_SIZE = 20;

export default class Flock {

    static randomFlock() {
        return new Flock(
            randomColour(),
            Point.getRandom(CANVAS_MAX_X, CANVAS_MAX_Y), // Valid random position must be within the canvas 
            Math.round(Math.random() * MAX_FLOCK_SIZE)
        );
    }

    constructor(colour, target, initialSize) {
        console.log(`New flock with colour ${colour}, target ${target} and initialSize ${initialSize}`);
        this.uuid = uuidv4();
        this.colour = colour;
        this.target = target;
        this.boids = new Array(initialSize).fill(null).map(() => Boid.randomBoid(colour));
    }

    update(graph, delta) {
        // TODO: Pre-calculate as much as possible. 
        // TODO: Determine if flock target has been achieved, and update if so. 
        console.log("Updating flock");
        this.boids.forEach(b => b.update(graph, delta, this.boids.filter(b2 => b2 !== b)));
    }

    draw(ctx, debug) {
        // TODO: Draw flock target, if debug rendering is on.
        this.boids.forEach(b => b.draw(ctx, debug));
    }


}