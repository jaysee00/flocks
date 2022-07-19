export default class Graph {

    graph = [];

    add(graphObject) {
        this.graph.push(graphObject);
    }

    update(delta) {
        this.graph.forEach(o => o.update(this, delta));
    }

    draw(ctx, debug) {
        this.graph.forEach(o => o.draw(ctx, debug));
    }

    getFirst(getFunc) {
        return this.graph.find(getFunc);
    }

    getAll(getFunc) {
        return this.graph.filter(getFunc);
    }
}