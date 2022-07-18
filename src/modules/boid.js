import Point from './point.js';
import Vector from './vector.js';

export default class Boid {
    constructor(position, velocity) {
        this.position = position;
        this.velocity = velocity;
        this.sideLength = 50;
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
        context.fillStyle = 'green';
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        context.lineTo(points[1].x, points[1].y);
        context.lineTo(points[2].x, points[2].y);
        context.closePath();;
        context.fill();

        // draw the centroid
        context.fillStyle = 'red';
        context.beginPath();
        context.arc(0, 0, 10, 0, 2 * Math.PI);
        context.fill();

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, this.sideLength * -2);
        context.stroke();

        context.restore();
    }
}