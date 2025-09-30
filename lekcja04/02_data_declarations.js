// var tworzy zmienną w zakresie globalnym jeżeli jest użyty poza funkcją
var global_var = "global1";

// var użyte w funkcji nie tworzy globalnych zmiennych
function doStuff() {
   var local_var = "local1";
   console.log(local_var);
}
// Poniższa linia spowodowałaby błąd
// console.log(local_var);

// Co może zaskoczyć, to że nazwy zmiennych zadeklarowanych przy pomocy var są dostępne w kodzie przed ich deklaracją
console.log(greeting);
var greeting = "hello from var";
console.log(greeting);

// let ogranicza czas istnienia zmiennej tylko do bloku kodu pętli
for (let i = 0; i < 3; i++) {
   console.log("Zmienna i:", i);
}
// Poniższa linia spowodowałaby błąd
// console.log("i poza pętlą:", i);

// j będzie zmienną globalną!
for (var j = 0; j < 3; j++) {
   console.log("Zmienna j:", j);
}
console.log("j poza pętlą:", j);

// Zmienne stworzone przy pomocy let zwrócą błąd przy próbie przedwczesnego dostępu.
// Poniższa linia spowodowałaby błąd
// console.log(salutation);
let salutation = "hello from let";
console.log(salutation);

// Zmienne o takich samych nazwach tworzone przy pomocy let "przesłaniać" (ang. shadowing), jeżeli są w innych blokach
{
   let salutation = "hello from inner let";
   console.log(salutation);
}
console.log(salutation);

// Zmienne tworzone przez var się nie przesłaniają, re-deklaracja zmiennej wskazuje na te same dane w pamięci
{
   var greeting = "hello from inner var";
   console.log(greeting);
}
console.log(greeting, "ooops");

// "stałe" zadeklarowane przy pomocy const nie pozwolą na ponowne przypisanie nowej wartości
const data = { message: "hello" };
console.log(data);

// Poniższa linia spowodowałaby błąd
//data = { message: "witaj };

// ALE TO NIE ZNACZY, ŻE TE DANE SĄ FAKTYCZNIE STAŁE
data.message = "witaj";
console.log(data);
