class ExecutionContext {

    constructor() {

        this.memory = {};

    }

    set(key, value) {

        this.memory[key] = value;

    }

    get(key) {

        return this.memory[key];

    }

    has(key) {

        return key in this.memory;

    }

}

module.exports = ExecutionContext;