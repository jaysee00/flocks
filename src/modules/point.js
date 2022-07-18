class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static getRandom(maxX, maxY) {
        return new Point(Math.random() * maxX, Math.random() * maxY);
    }
}

export default Point;