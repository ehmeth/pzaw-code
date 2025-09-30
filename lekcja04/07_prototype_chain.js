// JavaScript pozwala na tworzenie obiektów metodą Object.create()
// Ale wymaga podania wtedy "prototypu". Póki co podajmy "null".
let empty = Object.create(null);

// Możemy z nowo stworzonego obiektu korzystać jak z każdego innego obiektu
empty.property = "value";

// Ale zostanie wydrukowany trochę inaczej
console.log(empty);

// Nie ma dostępu np. do metody toString
// Poniższa linijka wywoła błąd
// console.log(empty.toString());

// Kiedy tworzymy obiekt używając standardowej składni, tak naprawdę JavaScript
// pod spodem ustawia prototyp nowego obiektu na "Object.prototype"
let normal = Object.create(Object.prototype);
console.log(normal);

// Stwórzmy sobie prosty obiekt
let base = { a: 1, b: 2 };

// A teraz podajmy nasz nowo stworzony obiekt jako prototyp kolejnego
let derived = Object.create(base);
// Możemy normalnie dodawać do niego właściwości
derived.c = 3;
derived.d = 4;

// Wydrukowanie na konsolę działa tak jak się tego spodziewamy
console.log(derived);

// Ale dlaczego nasz obiekt ma właściwość "a"?
console.log(derived.a);

// Kiedy JS próbuje znaleźć właściwość na obiekcie, zaczyna od samego obiektu.
// Jeżeli nie ma takiej właściwości, JS sprawdza prototyp obiektu.
// Jeżeli nadal właściwość nie istnieje, idzie dalej... tak daleko, jak sięga
// łańcuch prototypów. 
// Jeżeli na żadnym etapie nie znajdzie poszukiwanej właściwości, wtedy JS
// zgłosi błąd.
// 
// derived  ---->    base  ---->  Object.prototype  ---->   null
// c: 3              a:1          toString(), itd.
// d: 4              b:2

// W tym przypadku skoro obiekt "derived" nie miał właściwości "a", JS poszedł
// o krok dalej i znalazł ją na obiekcie "base"
// W ten sam sposób wcześniej JS znalazł metodę toString, która istnieje na
// obiekcie Object.prototype

// Wracając do jednego z poprzednich przykładów, możemy stworzyć sobie teraz
// obiekt, który będzie zawierał wspólne funkcjonalności dla wielu innych obiektów
let greeter_base = {
   name: "<no name>",
   greet() { console.log("Hello, I'm", this.name) },
}

function make_greeter(name) {
   let greeter = Object.create(greeter_base);
   if (name != null) {
      greeter.name = name;
   }
   return greeter
}

let john = make_greeter("John");
let alice = make_greeter("Alice");
let anonymous = make_greeter();

john.greet();
alice.greet();
anonymous.greet();

// Ten sam efekt możemy osiągnąć tworząc funkcję konstruującą obiekty i używając operatora "new"

function Greeter(name) {
   if (name != null) {
      // Przy użyciu operatora "new"
      // Nowo tworzony obiekt jest podpięty pod słowo kluczowe "this"
      this.name = name;
   }
}

// w przypadku operatora "new", JS pod spodem dla nowo tworzonego obiektu wywoła funkcję Object.create
// z argumentem "Greeter.prototype", więc tam musimy umieścić wspólne funkcjonalności
Greeter.prototype = {
   name: "<no name>",
   greet() { console.log("Hi there, I'm", this.name) },
}

let bob = new Greeter("Bob");
let eve = new Greeter("Eve");
let anon = new Greeter();

bob.greet();
eve.greet();
anon.greet();

// I jeszcze raz ten sam efekt możemy uzyskać używając słowa kluczowego "class"
class GreeterClass {
   constructor(name) {
      if (name != null) {
         this.name = name;
      }
   }
   name = "<no name>";
   greet() { console.log("Hi! I'm", this.name) }
}

let ben = new GreeterClass("Ben");
let lisa = new GreeterClass("Lisa");
let noname = new GreeterClass();

ben.greet();
lisa.greet();
noname.greet();
