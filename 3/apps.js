
let frutas = ["manzana", "platano", "manzana", "naranja", "platano", "manzana", "uva", "naranja"];

let contadorFrutas = {};

for(let i = 0; i < frutas.length; i++) {
    let fruta = frutas[i];
 
    if(contadorFrutas[fruta]) {
        contadorFrutas[fruta] = contadorFrutas[fruta] + 1;
    } else {
        contadorFrutas[fruta] = 1;
    }
}


console.log("Cantidad de cada fruta:");
console.log(contadorFrutas);

contadorFrutas = {};

let j = 0;
while(j < frutas.length) {
    let fruta = frutas[j];
    
    if(contadorFrutas[fruta]) {
        contadorFrutas[fruta] = contadorFrutas[fruta] + 1;
    } else {
        contadorFrutas[fruta] = 1;
    }
    
    j = j + 1;
}

console.log("\nResultados usando while:");
console.log(contadorFrutas);
