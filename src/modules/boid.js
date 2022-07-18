import Point from './point.js';
import Vector from './vector.js';
import { CANVAS_MAX_X, CANVAS_MAX_Y, CANVAS_MIN_X, CANVAS_MIN_Y, convertRgbToHex } from './util.js';

export default class Boid {
    constructor(position, velocity, color) {
        this.position = position;
        this.velocity = velocity;
        this.sideLength = 50;
        this.color = color
    }

    static randomBoid() {
        return new Boid(
            Point.getRandom(CANVAS_MAX_X, CANVAS_MAX_Y), // Valid random position must be within the canvas 
            Vector.getRandom(5), // Valid random velocity must have a maximum magnitude
            convertRgbToHex(Math.random() * 255, Math.random() * 255, Math.random() * 255) // Valid random colour must be an RGB
        );
    }

    update() {
        this.position.x += this.velocity.xve;
        this.position.y += this.velocity.yve;

        // Constrain position to canvas size.
        if (this.position.x > CANVAS_MAX_X) {
            this.position.x = CANVAS_MIN_X;
        }
        if (this.position.x < CANVAS_MIN_X) {
            this.position.x = CANVAS_MAX_X;
        }
        if (this.position.y > CANVAS_MAX_Y) {
            this.position.y = CANVAS_MIN_Y;
        }
        if (this.position.y < CANVAS_MIN_Y) {
            this.position.y = CANVAS_MAX_Y;
        }
    }

    draw(context, debug) {
        // Rotate the canvas so the boid has the correct heading
        context.save();
        context.translate(this.position.x, this.position.y);

        if (debug) {
            context.font = "12px Serif";
            context.fillText(`(${Math.round(this.position.x, 2)}, ${Math.round(this.position.y, 2)})`, 10, 10);
        }

        const points = [
            new Point(0 - this.sideLength / 2, 0 + this.sideLength / 2),
            new Point(0 + this.sideLength / 2, 0 + this.sideLength / 2),
            new Point(0, 0 - this.sideLength / 2)
        ];
        const rotationAngle = Vector.getDefaultOrientation().angleBetween(this.velocity);

        context.rotate(rotationAngle);
        context.fillStyle = this.color;
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        context.lineTo(points[1].x, points[1].y);
        context.lineTo(points[2].x, points[2].y);
        context.closePath();;
        context.fill();

        if (debug) {
            // draw the co-ordinates of the boid
            context.fillStyle = 'black';
            context.beginPath();
            context.arc(0, 0, 5, 0, 2 * Math.PI);
            context.fill();

            // draw the velocity vector
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(0, this.sideLength * -2);
            context.stroke();
        }
        context.restore();
    }
}