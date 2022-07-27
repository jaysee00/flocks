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
        if (xve == undefined || isNaN(xve) || xve === null) {
            throw new Error("xve must be a number");
        }

        if (yve == undefined || isNaN(yve) || yve === null) {
            throw new Error("xve must be a number");
        }

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
        if (xve === undefined || isNaN(xve) || xve === null) {
            throw new Error("xve must be a number");
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
        if (yve === undefined || isNaN(yve) || yve === null) {
            throw new Error("xve must be a number");
        }
        this._yve = yve;
    }

    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector(this.xve * cos - this.yve * sin, this.xve * sin + this.yve * cos);
    }

    addVe(xve, yve) {
        return new Vector(this.xve + xve, this.yve + yve);
    }

    amplify(scalar) {
        return new Vector(this.xve * scalar, this.yve * scalar);
    }

    constrain(scalar) {

        let xcomponent = Decimal.div(this.xve, Math.abs(this.getMagnitude())).toNumber() * scalar;
        let ycomponent = Decimal.div(this.yve, Math.abs(this.getMagnitude())).toNumber() * scalar;
        console.log(`Constrained to ${xcomponent} ${ycomponent}`);
        return new Vector(xcomponent, ycomponent);
    }

    addVector(vector) {
        return new Vector(this.xve + vector.xve, this.yve + vector.yve);
    }

    divideByScalar(scalar) {
        return new Vector(Decimal.div(this.xve, scalar).toNumber(), Decimal.div(this.yve, scalar).toNumber());
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

        // Determine CW or CCW
        const cz = this.xve * other.yve - this.yve * other.xve;
        if (cz < 0) {
            return angle * -1;
        }
        return angle;

    }
}

export default Vector;