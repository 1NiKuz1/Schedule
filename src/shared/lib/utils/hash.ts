/** Calculates the hash of the string.
 *
 * The djb2 algorithm for string hash functions is used as a basis.
 * @link https://helloacm.com/the-simplest-string-hash-function-djb2-algorithm-and-implementations/
 */
export function hashStringToNumber(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        hash = (hash << 5) + hash + code;
    }
    return hash | 0;
}
