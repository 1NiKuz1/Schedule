import "reflect-metadata";
const requiredMetadataKey = Symbol("required");

/**
 * The method parameter decorator that marks the argument as required.
 * Used in conjunction with `@validate` for automatic validation.
 *
 * @param {Object} target The class prototype or constructor.
 * @param {string|symbol} propertyKey The name of the method.
 * @param {number} parameterIndex The index of the parameter in the argument list.
 */
export function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    const existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
    if (!existingRequiredParameters.includes(parameterIndex)) {
        existingRequiredParameters.push(parameterIndex);
    }
    Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
}

/**
 * A method decorator that validates required parameters
 * marked with `@required'. Must be applied to the methods of the class.
 *
 * @param {Object} target The prototype of the class.
 * @param {string} propertyName The name of the method.
 * @param {TypedPropertyDescriptor<Function>} descriptor The method descriptor.
 *
 * @throws If the required argument is `null` or `undefined'.
 */
export function validate(target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const original: Function = descriptor.value!;
    descriptor.value = function (...args: any[]) {
        const requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
        if (requiredParameters) {
            for (const parameterIndex of requiredParameters) {
                if (parameterIndex >= args.length || args[parameterIndex] == null) {
                    throw new Error(`The "${propertyName}" method does not have a required parameter on the position: ${parameterIndex}`);
                }
            }
        }
        return original.apply(this, args);
    };
}
