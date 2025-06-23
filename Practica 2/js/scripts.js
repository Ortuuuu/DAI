document.addEventListener("DOMContentLoaded", init, false);

function init() {
    let bloques = document.querySelectorAll(".bloque");
    for (let i = 0; i < bloques.length; i++) {
        addCruz(bloques[i]);
    }
};

// Funciones auxiliares para manipular el DOM
function insertAsLastChild(padre, nuevoHijo) {
    padre.append(nuevoHijo);
};

function insertAsFirstChild(padre, nuevoHijo) {
    padre.prepend(nuevoHijo);
};

function insertBeforeChild(padre, hijo, nuevoHijo) {
    padre.insertBefore(nuevoHijo, hijo);
};

function removeElement(nodo) {
    nodo.remove();
};

function queryAncestorSelector (node,selector) {
    var parent= node.parentNode;
    var all = document.querySelectorAll(selector);
    var found= false;
    while (parent !== document && !found) {
        for (var i = 0; i < all.length && !found; i++) {
            found= (all[i] === parent)?true:false;
        }
        parent = (!found)?parent.parentNode:parent;
    }
    return (found)?parent:null;
};

// Funciones para eliminar preguntas
function addCruz(nodoBloque) {
    let cruz = document.createElement("div");
    cruz.className = "borra";
    cruz.textContent = "☒";

    insertAsFirstChild(nodoBloque, cruz);

    cruz.addEventListener("click", borraPregunta, false);
}

function borraPregunta(evento) {
    bloqueClicado = queryAncestorSelector(evento.target, ".bloque");
    seccionClicada = queryAncestorSelector(bloqueClicado, "section");
    idSeccionClicada = seccionClicada.id;
    numHijosSeccionClicada = seccionClicada.querySelectorAll(".bloque").length;

    // Eliminamos la pregunta
    removeElement(bloqueClicado);
    numHijosSeccionClicada -= 1;

    // Si la pregunta eliminada era la última de la sección, eliminamos la sección y su entrada del índice
    if(numHijosSeccionClicada == 0) {
        removeElement(seccionClicada);
        let entradaIndice = document.querySelector('nav').getElementsByClassName(idSeccionClicada)[0];
        removeElement(entradaIndice);
    }
}