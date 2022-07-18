import Decimal from 'decimal.js';


class Vector {

    static NORTH = new Vector(0, -1, true);
    static EAST = new Vector(1, 0, true);
    static SOUTH = new Vector(0, 1, true);
    static WEST = new Vector(-1, 0, true);

    static getDefaultOrientation() {
        return Vector.NORTH;
    }

    static getRandom(maxVe) {
        return new Vector(Math.random() * maxVe * 2 - maxVe, Math.random() * maxVe * 2 - maxVe);
    }

    constructor(xve, yve, isConstant = false) {
        this._xve = xve;
        this._yve = yve;
        this.isConstant = isConstant;
    }

    get xve() {
        return this._xve;
    };
    set xve(xve) {
        if (this.isConstant) {
            throw new Error('Cannot set xve on a constant vector');
        }
        this._xve = xve;
    }

    get yve() {
        return this._yve;
    };
    set yve(yve) {
        if (this.isConstant) {
            throw new Error('Cannot set yve on a constant vector');
        }
        this._yve = yve;
    }

    getMagnitude() {
        return Decimal.sqrt(this.xve ** 2 + this.yve ** 2).toNumber();
    }

    getUnitVector() {
        return new Vector(new Decimal(this.xve / this.getMagnitude()).toNumber(), new Decimal(this.yve / this.getMagnitude()).toNumber());
    }

    angleBetween(other) {
        const dot = (p1, p2) => p1.xve * p2.xve + p1.yve * p2.yve;
        const magSq = ({ xve, yve }) => xve ** 2 + yve ** 2;

        const angle = Math.acos(dot(this, other) / Math.sqrt(magSq(this) * magSq(other)));
        return angle;

    }
}

export default Vector;