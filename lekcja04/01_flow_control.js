let x = 5, y = 10;

if (x > y) { // warunki muszą być otoczone nawiasami
    console.log(x, "jest większe niż", y);
} else {
    console.log(x, "jest niewiększe niż", y);
}

while (x-- > 0) { // post-dekrementacja: sprawdź wartość a potem odejmij 1
   console.log("W pętli while x ma wartość", x);
}

do {
   console.log("Po pętli while x ma wartość", x);
} while (x > 0) // warunek nie jest prawdziwy
// ale pętla do..while i tak wykona się przynajmniej raz

// klasyczna pętla
// for (inicjalizacja; warunek wyjścia; inkrementacja)
for (let i = 0; i < y; ++i) { 
   if (i % 2 == 1) { // nieparzyste i
      continue; // zacznij kolejną iterację pętli
   }

   console.log(i);

   if ((i > 0) && (i % 2 == 0)) { // i jest większe od zera ORAZ parzyste i
      break; // wyjdź z pętli
   }
}

let greeting = "hello";

switch (greeting) { // porównaj greeting z poniższymi opcjami
   case "hello":
      console.log("angielski");
      // brak wyrażenia "break". Potencjalny bug?
   case "witaj": // JS pozwala na przejście pomiędzy przypadkami w switch'u
      console.log("polski");
      break;
   default:
      console.log("nieznany");
      break;
}
