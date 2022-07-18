import Boid from './boid.js';
import Point from './point.js';
import Vector from './vector.js';

test('Update loop sets position correctly', () => {
    const boid = new Boid(new Point(0, 0), new Vector(2, 1));
    boid.update();
    expect(boid.position.x).toBe(2);
    expect(boid.position.y).toBe(1);
});