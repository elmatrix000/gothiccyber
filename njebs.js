const readline = require('readline');

function isPrime(num) {
    if (num < 2) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;
    for (let i = 3; i * i <= num; i += 2) {
        if (num % i === 0) return false;
    }
    return true;
}

function find_primes(start, end) {
    const primes = [];
    for (let candidate = start; candidate <= end; candidate++) {
        if (isPrime(candidate)) primes.push(candidate);
    }
    return { n: primes.length, primes };
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('', (startStr) => {
    rl.question('', (endStr) => {
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        const result = find_primes(start, end);
        console.log(`n=${result.n}`);
        console.log(`res = ${result.primes.join('')}`);
        rl.close();
    });
});
