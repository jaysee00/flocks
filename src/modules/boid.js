import Point from './point.js';
import Vector from './vector.js';
import Decimal from 'decimal.js';
import { v4 as uuidv4 } from 'uuid';
import { CANVAS_MAX_X, CANVAS_MAX_Y, CANVAS_MIN_X, CANVAS_MIN_Y, randomColour, convertRgbToHex } from './util.js';

const AVOIDANCE_RADIUS = 40;
const SPEED_LIMIT = 2;

export default class Boid {
    constructor(position, velocity, color) {
        this.position = position;
        this.velocity = velocity;
        this.sideLength = 15;
        this.color = color
        this.uuid = uuidv4();

        this.cohesionVector;
        this.avoidanceVector;
        this.alignmentVector;
        this.targetVelocity;
    }

    static randomBoid(colour) {
        return new Boid(
            Point.getRandom(CANVAS_MAX_X, CANVAS_MAX_Y), // Valid random position must be within the canvas 
            Vector.getRandom(2), // Valid random velocity must have a maximum magnitude
            colour ? colour : randomColour()
        );
    }

    update(graph, delta, otherBoids) {
        console.log(`Updating Boid ${this.uuid} (${this.color})`);

        if (!otherBoids) {
            otherBoids = graph.getAll(o => o instanceof Boid && o !== this);
        }

        // Calculate:
        // 1 - Cohesion vector (move to center of boids position)
        if (otherBoids.length > 0) {
            const aggregatePoint = otherBoids.map(b => b.position).reduce((prev, current) => {
                return new Point(prev.x + current.x, prev.y + current.y);
            });
            const cohesionPoint = new Point(new Decimal(aggregatePoint.x / otherBoids.length).toNumber(), new Decimal(aggregatePoint.y / otherBoids.length).toNumber());
            this.cohesionVector = this.position.vectorTo(cohesionPoint);

            // 2 - Alignment vector (align to average velocity of other boids)
            this.alignmentVector = otherBoids.reduce((prev, current) => {
                return new Vector(prev.xve + current.velocity.xve, prev.yve + current.velocity.yve);
            }, new Vector(0, 0)).divideByScalar(otherBoids.length).divideByScalar(8);

            // 3 - Avoidance vector (don't get too close to other boids)
            this.avoidanceVector = otherBoids.reduce((prev, current) => {
                if (Math.abs(current.position.x - this.position.x) < AVOIDANCE_RADIUS && Math.abs(current.position.y - this.position.y) < AVOIDANCE_RADIUS) {
                    // This boid is too close. 
                    const acc = prev.addVe(this.position.x - current.position.x, this.position.y - current.position.y).amplify(100);
                    return acc;
                }
                return prev;
            }, new Vector(0, 0));


            this.targetVelocity = this.avoidanceVector.addVector(this.alignmentVector).addVector(this.cohesionVector);


            //     let rotationAngle = Vector.getDefaultOrientation().angleBetween(this.velocity);
            // if (this.velocity.xve < 0) {
            //     rotationAngle = rotationAngle * -1;
            // }



            // Max rotation per frame is 10 degrees
            const targetRotation = this.velocity.angleBetween(this.targetVelocity);
            let targetRotationInDegrees = targetRotation * (180 / Math.PI);
            let actualRotation = 0;
            if (targetRotationInDegrees > Math.abs(10)) {
                console.log(`Target rotation was ${targetRotationInDegrees}. Constraining to 10 degrees.`);
                actualRotation = 0.0872665; // 5 degrees in radians
            } else {
                actualRotation = targetRotation;
            }
            this.velocity = this.velocity.rotate(actualRotation);

            if (Math.abs(this.velocity.getMagnitude()) > SPEED_LIMIT) {
                this.velocity = this.velocity.constrain(SPEED_LIMIT);
                console.log(`Velocity constrained to ${JSON.stringify(this.velocity)}`);
            }
        }

        // Delta is the time between frames in milliseconds. Assume a Delta of 10ms is equal to a 1x update. 

        this.position.x += this.velocity.xve * (delta / 10)
        this.position.y += this.velocity.yve * (delta / 10);

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
        console.log(`DEBUG ${debug} Drawing boid ${this.uuid} (${this.color}) | Position: ${JSON.stringify(this.position)} | Velocity: ${JSON.stringify(this.velocity)}`);
        // Rotate the canvas so the boid has the correct heading
        context.save();
        context.translate(this.position.x, this.position.y);

        if (debug) {
            context.fillStyle = 'black';
            context.font = "12px Serif";
            context.fillText(`(${Math.round(this.position.x, 2)}, ${Math.round(this.position.y, 2)})`, 10, 10);

            context.strokeStyle = 'blue';
            const normalizedCV = this.cohesionVector.getUnitVector();
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(normalizedCV.xve * this.sideLength, normalizedCV.yve * this.sideLength);
            context.stroke();

            if (this.alignmentVector.getMagnitude() > 0) {
                context.strokeStyle = 'green';
                const normalizedAlignmentVec = this.alignmentVector.getUnitVector();
                context.beginPath();
                context.moveTo(0, 0);
                context.lineTo(normalizedAlignmentVec.xve * this.sideLength, normalizedAlignmentVec.yve * this.sideLength);
                context.stroke();
            }

            if (this.avoidanceVector.getMagnitude() > 0) {
                context.stokeStyle = 'red';
                const normalizedAV = this.avoidanceVector.getUnitVector();
                context.beginPath();
                context.moveTo(0, 0);
                context.lineTo(normalizedAV.xve * this.sideLength, normalizedAV.yve * this.sideLength);
                context.stroke();
            }

            context.strokeStyle = 'red';
            context.lineWidth = 3;
            context.beginPath();
            context.moveTo(0, 0);
            const normalizedTv = this.targetVelocity.getUnitVector();
            context.lineTo(normalizedTv.xve * this.sideLength, normalizedTv.yve * this.sideLength);
            context.stroke();
        }

        const points = [
            new Point(0 - this.sideLength / 2, 0 + this.sideLength / 2),
            new Point(0 + this.sideLength / 2, 0 + this.sideLength / 2),
            new Point(0, 0 - this.sideLength / 2)
        ];
        let rotationAngle = Vector.getDefaultOrientation().angleBetween(this.velocity);
        // if (this.velocity.xve < 0) {
        //     rotationAngle = rotationAngle * -1;
        // }

        context.rotate(rotationAngle);
        context.fillStyle = this.color;
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        context.lineTo(points[1].x, points[1].y);
        context.lineTo(points[2].x, points[2].y);
        context.closePath();
        context.fill();

        if (debug) {
            // draw the co-ordinates of the boid
            context.fillStyle = 'black';
            context.beginPath();
            context.arc(0, 0, 5, 0, 2 * Math.PI);
            context.fill();

            // draw the velocity vector
            context.strokeStyle = 'black';
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(0, this.sideLength * -2);
            context.stroke();
        }
        context.restore();
    }
}