import Point from './point.js';
import Vector from './vector.js';
import { convertRgbToHex } from './util.js';

export default class Boid {
    constructor(position, velocity, color) {
        this.position = position;
        this.velocity = velocity;
        this.sideLength = 50;
        this.color = color
    }

    static randomBoid() {
        return new Boid(
            Point.getRandom(600, 600), // Valid random position must be within the canvas 
            Vector.getRandom(5), // Valid random velocity must have a maximum magnitude
            convertRgbToHex(Math.random() * 255, Math.random() * 255, Math.random() * 255) // Valid random colour must be an RGB
        );
    }


    update() {
        this.position.x += this.velocity.xve;
        this.position.y += this.velocity.yve;
    }

    draw(context) {
        // Rotate the canvas so the boid has the correct heading
        context.save();
        context.translate(this.position.x, this.position.y);

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

        // draw the centroid
        context.fillStyle = 'black';
        context.beginPath();
        context.arc(0, 0, 5, 0, 2 * Math.PI);
        context.fill();

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, this.sideLength * -2);
        context.stroke();

        context.restore();
    }
}