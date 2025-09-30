const author = {                    // Nawiasy klamrowe służą do stworzenia obieku w JS.
    "first_name": "Douglas",        // Nazwy właściwości mogą być podane jako string.
    last_name: "Adams",             // Albo jako identyfikator, jeżeli da się je zapisać jako 
                                    // ciąg dowzolonych znaków (głównie litrery alfabetu, cyfry, podkreślnik i znak dolara)
    "books genre": "sci-fi,comedy", // Jeżeli chcemy użyć spacji w nazwie właściwości, musimy użyć stringu
    alive: false,                   // Wartości przypisane do właściwości mogą być dowolnego typu
    birth_date : {                  // Obiekty mogą nawet przechowywać inne obiekty!
        day: 11,
        month: 3,
        year: 1952,                 // Przecinek po ostatniej właściwości jest opcjonalny
    }
};

// Możemy odnośić się do wartości obiektu notacją <obiekt>.<właściwość>
console.log("Author:", author.first_name, author.last_name);
// albo notacji z nawiasami kwadratowymi: <obiekt>["<właściwość"]
console.log("Genres:", author["books genre"]);

// W przypadku właściwości ze spacją albo innymi niedozwolonymi znakami w nazwie, musimy użyć nawiasów
// console.log(author.books genre); // <- to by spowodowało błąd

// W przypadku obiektów zagnieżdżonych możemy korzystać z tych samych opcji dostępu
console.log("Born on", author.birth_date.day, ".", author.birth_date["month"], "in the year", author["birth_date"].year);

// Większość obiektów JS może być też zmieniana po stworzeniu
// nawet jeżeli zostały utworzone jako stałe
author.favorite_number = 42;
console.log(author); // JS zapewnia dość wygodne drukowanie obiektów zawierających dane

// Jeżeli chcę się dowiedzieć jakie właściwości zawiera obiekt, mogę użyć np. funkcji `Object.keys()` albo `Object.getOwnPropertyNames()`
console.log(Object.keys(author));
console.log(Object.getOwnPropertyNames(author));
