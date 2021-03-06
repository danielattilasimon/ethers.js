"use strict";

import { Logger } from "@ethersproject/logger";
import { version } from "./_version";
const logger = new Logger(version);

export function defineReadOnly<T, K extends keyof T>(object: T, name: K, value: T[K]): void {
    Object.defineProperty(object, name, {
        enumerable: true,
        value: value,
        writable: false,
    });
}

// Crawl up the constructor chain to find a static method
export function getStatic<T>(ctor: any, key: string): T {
    for (let i = 0; i < 32; i++) {
        if (ctor[key]) { return ctor[key]; }
        if (!ctor.prototype || typeof(ctor.prototype) !== "object") { break; }
        ctor = Object.getPrototypeOf(ctor.prototype).constructor;
    }
    return null;
}

export type Similar<T> = {
    [P in keyof T]: T[P];
}

export type Resolvable<T> = {
    [P in keyof T]: T[P] | Promise<T[P]>;
}

type Result = { key: string, value: any};
export function resolveProperties<T>(object: Resolvable<T>): Promise<Similar<T>> {

    const promises: Array<Promise<Result>> = Object.keys(object).map((key) => {
        const value = (<any>object)[key];

        if (!(value instanceof Promise)) {
            return Promise.resolve({ key: key, value: value });
        }

        return value.then((value) => {
            return { key: key, value: value };
        });
    });

    return Promise.all(promises).then((results) => {
        const result: any = { };
        return (<Similar<T>>(results.reduce((accum, result) => {
            accum[result.key] = result.value;
            return accum;
        }, result)));
    });
}

export function checkProperties(object: any, properties: { [ name: string ]: boolean }): void {
    if (!object || typeof(object) !== "object") {
        logger.throwArgumentError("invalid object", "object", object);
    }

    Object.keys(object).forEach((key) => {
        if (!properties[key]) {
            logger.throwArgumentError("invalid object key - " + key, "transaction:" + key, object);
        }
    });
}

export function shallowCopy<T>(object: T): Similar<T> {
    const result: any = {};
    for (const key in object) { result[key] = object[key]; }
    return result;
}

const opaque: { [key: string]: boolean } = { bigint: true, boolean: true, "function": true, number: true, string: true };

function _isFrozen(object: any): boolean {

    // Opaque objects are not mutable, so safe to copy by assignment
    if (object === undefined || object === null || opaque[typeof(object)]) { return true; }

    if (Array.isArray(object) || typeof(object) === "object") {
        if (!Object.isFrozen(object)) { return false; }

        const keys = Object.keys(object);
        for (let i = 0; i < keys.length; i++) {
            if (!_isFrozen(object[keys[i]])) { return false; }
        }

        return true;
    }

    return logger.throwArgumentError(`Cannot deepCopy ${ typeof(object) }`, "object", object);
}

// Returns a new copy of object, such that no properties may be replaced.
// New properties may be added only to objects.
function _deepCopy(object: any): any {

    if (_isFrozen(object)) { return object; }

    // Arrays are mutable, so we need to create a copy
    if (Array.isArray(object)) {
        return Object.freeze(object.map((item) => deepCopy(item)));
    }

    if (typeof(object) === "object") {
        const result: { [ key: string ]: any } = {};
        for (const key in object) {
            const value = object[key];
            if (value === undefined) { continue; }
            defineReadOnly(result, key, deepCopy(value));
        }

        return result;
    }

    return logger.throwArgumentError(`Cannot deepCopy ${ typeof(object) }`, "object", object);
}

export function deepCopy<T>(object: T): Similar<T> {
    return _deepCopy(object);
}

export class Description<T = any> {
    constructor(info: { [ K in keyof T ]: T[K] }) {
        for (const key in info) {
            (<any>this)[key] = deepCopy(info[key]);
        }
    }
}
