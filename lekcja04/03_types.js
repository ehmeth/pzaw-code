console.log("*** Undefined ***")
let x;
console.log(typeof x); // x nie ma nadanej wartości => undefined
console.log(typeof y); // y nie zostało nigdy stworzone => undefined

// Tu napotykamy pierwsze bardzo dziwne zachowanie JS i operatora typeof
console.log("*** Null ***")
x = null;
console.log(typeof x) // Umm... 'object'?
console.log(typeof null) // Niestety tak mówi specyfikacja

console.log("*** Boolean ***")
x = true;
console.log(typeof x); // 'boolean'
console.log(typeof (x !== false)); // 'boolean'
console.log(typeof (typeof x === 'boolean')); // 'boolean'
console.log(typeof (5 >= 11)); // 'boolean'

console.log("*** String ***")
x = "What a lovely day!";
console.log(typeof "hello"); // 'string'
console.log(typeof x); // 'string'
console.log(typeof `Hello. ${x}`); // 'string'

console.log("*** Number ***")
x = 3;
console.log(typeof x); // 'number'
console.log(typeof 4.2); // 'number'
console.log(typeof (2 * Math.PI)); // 'number'
console.log(typeof (x + 1.2345e-4)); // 'number'

console.log("*** BigInt ***")
x = 3n; // tak tworzymy zmienne numeryczne typu BigInt
console.log(typeof x); // 'bigint'
console.log(typeof (x + 5n)); // 'bigint'

console.log("*** Object ***")
x = {}; // Tak tworzymy pusty obiekt w JS
console.log(typeof x); // 'object'
console.log(typeof { "name": "Douglas", "age": 42 }); // 'object'

// To były relatywnie oczywiste przykłady obiektów
// Ale są też mniej oczywiste

x = []; // to jest pusta tablica
console.log(typeof x); // 'object'?
console.log(typeof [1, 2, 4, 8]); // 'object'?

// A tu JavaScript po raz kolejny nas lekko zaskakuje
x = function() {};
console.log(typeof x); // 'function'? Skąd się nagle wzięło function?

// W powyższych przykładach zmienialiśmy typ zmiennej x przypisując 
// do niej nowe wartości. Jeżeli utworzymy stałą używając słowa const
// podczas deklaracji, nie będziemy mogli przypisać do niej nowej wartości

const z = {};
// z = null; // To by wywołało błąd przy uruchamianiu
