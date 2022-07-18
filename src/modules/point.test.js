import Point from './point.js';

test('persists (x,y) co-ordinates', () => {
    const point = new Point(10, 20);
    expect(point.x).toBe(10);
    expect(point.y).toBe(20);
});