import Vue from 'vue'

const eventBus = new Vue();

function on(event, callback) {
    eventBus.$on(event, callback);
    //console.log("on(" + event + ")")
}

function off(event, callback) {
    eventBus.$off(event, callback);
    //console.log("off(" + event + ")")
}

function fire(eventName, ...args) {
    eventBus.$emit(eventName, ...args);
    //console.log("fire(" + eventName + ")")
}

export default {
    on,
    off,
    fire
}