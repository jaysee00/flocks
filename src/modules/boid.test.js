import Boid from './boid.js';
import Point from './point.js';
import Vector from './vector.js';

test('Update loop sets position correctly', () => {
    const boid = new Boid(new Point(0, 0), new Vector(2, 1), 'green');
    boid.update();
    expect(boid.position.x).toBe(2);
    expect(boid.position.y).toBe(1);
});

test('Color is set correctly', () => {
    const boid = new Boid(new Point(0, 0), new Vector(0, 0), 'red');
    expect(boid.color).toBe('red');
});

test('Position is constrained to canvas size', () => {
    const boid = new Boid(new Point(599, 599), new Vector(2, 2), 'orange');
    boid.update();
    expect(boid.position.x).toBe(0);
    expect(boid.position.y).toBe(0);
});