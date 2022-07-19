import Vector from "./vector.js";

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static getRandom(maxX, maxY) {
        return new Point(Math.random() * maxX, Math.random() * maxY);
    }

    vectorTo(otherPoint) {
        return new Vector(otherPoint.x - this.x, otherPoint.y - this.y);
    }
}

export default Point;