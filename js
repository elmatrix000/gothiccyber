const readline = require('readline');

/**
 * Checks if a number is prime.
 * @param {number} num - The number to test.
 * @returns {boolean} True if prime, else false.
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
 * Returns all prime numbers between start and end (inclusive).
 * @param {number} start - Lower bound.
 * @param {number} end - Upper bound.
 * @returns {{ n: number, primes: number[] }} Object with count and list.
 */
function find_primes(start, end) {
    const primes = [];
    const lower = Math.max(start, 2); // primes start at 2
    for (let candidate = lower; candidate <= end; candidate++) {
        if (isPrime(candidate)) {
            primes.push(candidate);
        }
    }
    return {
        n: primes.length,
        primes: primes
    };
}

// Set up readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Read start value
rl.question('', (startStr) => {
    // Read end value
    rl.question('', (endStr) => {
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);

        const result = find_primes(start, end);

        // Print exactly as required: n=<count> and res = <concatenated primes>
        console.log(`n=${result.n}`);
        console.log(`res = ${result.primes.join('')}`);

        rl.close();
    });
});
