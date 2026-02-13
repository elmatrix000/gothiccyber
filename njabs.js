/**
 * Checks whether a number is prime.
 * @param {number} num - The integer to test.
 * @returns {boolean} True if prime, false otherwise.
 */
function isPrime(num) {
    if (num < 2) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;
    const limit = Math.floor(Math.sqrt(num));
    for (let i = 3; i <= limit; i += 2) {
        if (num % i === 0) return false;
    }
    return true;
}

/**
 * Finds all prime numbers in the interval [start, end] (inclusive).
 * @param {number} start - Lower bound of the interval.
 * @param {number} end - Upper bound of the interval.
 * @returns {{ n: number, primes: number[] }} Object containing count and list of primes.
 */
function find_primes(start, end) {
    const primes = [];
    for (let candidate = start; candidate <= end; candidate++) {
        if (isPrime(candidate)) {
            primes.push(candidate);
        }
    }
    return {
        n: primes.length,
        primes: primes
    };
}

// Example usage:
const result = find_primes(2, 4);
console.log(`n=${result.n}`);        // n=2
console.log(`res = ${result.primes.join('')}`); // res = 23
