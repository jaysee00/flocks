import Vector from './vector';


test("Magnitude is calculated correctly", () => {
    const vector = new Vector(1, 1);
    expect(vector.getMagnitude()).toBe(Math.sqrt(2));
});

test("Unit vector has magnitude of 1", () => {

    const vector = new Vector(0, 1);
    expect(vector.getMagnitude()).toBe(1);
});

test("Get unit vector has magnitude of 1", () => {
    const vector = new Vector(26, 13);
    expect(vector.getUnitVector().getMagnitude()).toEqual(1);
});

test("Angle between vectors is calculated correctly", () => {
    const vector1 = new Vector(1, 0);
    const vector2 = new Vector(0, 1);
    expect(vector1.angleBetween(vector2)).toBe(Math.PI / 2);
});

test("Default orientation is North", () => {
    expect(Vector.getDefaultOrientation()).toBe(Vector.NORTH);
});

test("Static vectors cannot be manipulated", () => {
    expect(() => {
        Vector.NORTH.xve = 2;
    }).toThrow();
});