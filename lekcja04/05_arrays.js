const grades = [ // Tablicę tworzymy przy pomocy nawiasów kwadratowych
   4, 6, 3, 4, 5
];
console.log(grades[0]); // Do poszczególnych elementów możemy
                        // dostać się również używając notacji 
                        // nawiasów kwadratowych.
console.log(grades[2]); // Indeksy elementów zaczynamy liczyć od zera

console.log(grades[5]); // Ponieważ mamy 5 elementów i indeksujemy od 0
                        // element o indeksie 5 nie istnieje

// Istnieje co najmniej kilka sposobów na przejście przez wszystkie
// elementy listy

// Można użyć zwykłej pętli for z własnym indeksem
for (let i = 0; i < grades.length; i++) { // właściwość "length" zwraca liczbę elementów w tablicy
   console.log(grades[i]);
}

// Można użyć funkcji forEach, która jest właściwością tablicy
grades.forEach((grade, index, array) => { // musimy wtedy przekazać do forEach funkcję
   console.log(`${index}) ${grade}`);     // która będzie operować na elementach tablicy
});

// Możemy też użyć pętli "for .. of", ale wtedy nie mamy dostępu do indeksu
for (let grade of grades) {
   console.log(grade);
}

// Możemy dodawać elementy do końca tablicy metodą "push"
grades.push(2);
console.log(`tablica grades ma teraz ${grades.length} elementów, jej ostatni element to ${grades[5]}`);

let popped = grades.pop();
console.log(`tablica grades ma teraz ${grades.length} elementów, usunięty element to ${popped}`);

// Można też dodawać i usuwać elementy z przodu tablicy metodami "unshift" i "shift", ale ze względu na konieczność przesuwania wszystkich elementów o jeden indeks nie jest to zalecana praktyka.
grades.unshift(popped);
console.log(`tablica grades ma teraz ${grades.length} elementów, jej pierwszy element to ${grades[0]}`);

// Tablice mogą zawierać elementy różnych typów, nawet tych bardziej złożonych
const random_stuff = [4, true, null, {message: "this is an object"}, ["to jest tablica w tablicy"], () => {console.log("I'm a function")} ];
console.log(random_stuff);

// Trzeba jednak uważać z tworzeniem zbyt skomplikowanych konstrukcji.
// Czasami skorzystanie z zawartości tablicy staje się przez to mało czytelne
random_stuff[5]();
console.log(random_stuff[4][0]);
console.log(random_stuff[3].message);
// Poniższa linijka ma identyczne znaczenie, jak powyższa
console.log(random_stuff[3]['message']);

// JavaScript pozwala też na tzw. destrukturyzację 
// Poniższy zapis bierze pierwsze 3 elementy z tablicy random_stuff
// i umieszcza je w zmiennych a, b, c.
// Jak widać nie musimy w ten sposób przechwytywać wszystkich elementów.
let [a, b, c] = random_stuff;
console.log(a, b, c);

// A taki zapis bierze z tablicy 2 pierwsze elementy i umieszcza w zmiennych a i b
// a całą resztę tablicy umieszcza w zmiennej c
[a, b, ...c] = random_stuff;
console.log(a, b, c);

// Ponieważ tablice w JS to pod spodem obiekty, możemy z nich np. wyciągnąć nazwy właściwości
console.log(Object.getOwnPropertyNames(grades));
