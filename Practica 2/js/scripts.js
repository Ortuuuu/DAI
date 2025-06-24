document.addEventListener("DOMContentLoaded", init, false);

function init() {
    // Añadimos las cruces de eliminación a los bloques existentes
    let bloques = document.querySelectorAll(".bloque");
    for (let i = 0; i < bloques.length; i++) {
        addCruz(bloques[i]);
    }

    // Añadimos los formularios de adicion de preguntas a las secciones
    let secciones = document.querySelectorAll("section");
    for (let i = 0; i < secciones.length; i++) {
        addFormPregunta(secciones[i]);
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

// Funciones para añadir formulario de inserción de preguntas
function addFormPregunta(nodoSection) {
    // Creamos el div del formulario
    let divForm = document.createElement("div");
    divForm.className = "formulario";
    // Creamos una lista
    let ulForm = document.createElement("ul");
    // Primer <li> 
    let li1 = document.createElement("li");
    let labelPregunta = document.createElement("label");
    labelPregunta.setAttribute("for", nodoSection.id + "_pregunta");
    labelPregunta.textContent = "Enunciado de la pregunta";
    let inputPregunta = document.createElement("input");
    inputPregunta.setAttribute("type", "text");
    inputPregunta.setAttribute("name", nodoSection.id + "_pregunta"); 
    inputPregunta.setAttribute("id", nodoSection.id + "_pregunta");
    inputPregunta.addEventListener('keydown', (event) => {
        if(event.key == 'Enter') {
            addPregunta(event);
        }
    }, false);
    // Segundo <li> 
    let li2 = document.createElement("li");
    let labelRespuesta = document.createElement("label");
    labelRespuesta.textContent = "Respuesta:";
    let inputRespuestaV = document.createElement("input");
    inputRespuestaV.type = "radio";
    inputRespuestaV.name = nodoSection.id + "_respuesta";
    inputRespuestaV.value = "verdadero";
    inputRespuestaV.id = nodoSection.id + "_v";
    inputRespuestaV.checked = true;
    let labelRespuestaV = document.createElement("label");
    labelRespuestaV.setAttribute("for", nodoSection.id + "_v");
    labelRespuestaV.className = "radio";
    labelRespuestaV.textContent = "Verdadero";
    let inputRespuestaF = document.createElement("input");  
    inputRespuestaF.type = "radio";
    inputRespuestaF.name = nodoSection.id + "_respuesta";
    inputRespuestaF.value = "falso";
    inputRespuestaF.id = nodoSection.id + "_f";
    let labelRespuestaF = document.createElement("label");
    labelRespuestaF.setAttribute("for", nodoSection.id + "_f");
    labelRespuestaF.className = "radio";
    labelRespuestaF.textContent = "Falso";
    // Tercer <li>
    let li3 = document.createElement("li");
    let botonInsertar = document.createElement("input");
    botonInsertar.setAttribute("type", "button");
    botonInsertar.setAttribute("value", "Añadir nueva pregunta");
    botonInsertar.addEventListener("click", addPregunta, false);

    // Anidamos los elementos
    divForm.appendChild(ulForm);
    ulForm.appendChild(li1);
    ulForm.appendChild(li2);
    ulForm.appendChild(li3);
    li1.appendChild(labelPregunta);
    li1.appendChild(inputPregunta);
    li2.appendChild(labelRespuesta);
    li2.appendChild(inputRespuestaV);
    li2.appendChild(labelRespuestaV);
    li2.appendChild(inputRespuestaF);
    li2.appendChild(labelRespuestaF);
    li3.appendChild(botonInsertar);

    // Añadimos el cuestionario a continuación del título del cuestionario
    insertBeforeChild(nodoSection, nodoSection.children[1], divForm);
}

function addPregunta(evento) {
    let formPadre = queryAncestorSelector(evento.target, ".formulario");
    let enunciadoPregunta = formPadre.querySelector("input[type='text']");
    let respuestaPregunta = formPadre.querySelector("input[type='radio']:checked");

    if(enunciadoPregunta.value == "") {
        window.alert("El enunciado de la pregunta no puede estar vacío.");

        // Reseteamos el formulario
        enunciadoPregunta.value = "";
        if(respuestaPregunta.value == "falso") {
            formPadre.querySelector("input[type='radio'][value='verdadero']").checked = true;
        }
    }
    else {
        let nuevoDiv = document.createElement("div");
        nuevoDiv.className = "bloque";
        let divPregunta = document.createElement("div");
        divPregunta.className = "pregunta";
        divPregunta.textContent = enunciadoPregunta.value;
        let divRespuesta = document.createElement("div");
        divRespuesta.className = "respuesta";
        if (respuestaPregunta.value == "verdadero") {
            divRespuesta.setAttribute("data-valor", "true");
        }
        else {
            divRespuesta.setAttribute("data-valor", "false");
        }
        addCruz(nuevoDiv);
        
        // Insertamos la pregunta y la respuesta en el documento
        nuevoDiv.appendChild(divPregunta);
        nuevoDiv.appendChild(divRespuesta);
        insertAsLastChild(formPadre.parentNode, nuevoDiv);

        // Reseteamos el formulario
        enunciadoPregunta.value = "";
        if(respuestaPregunta.value == "falso") {
            formPadre.querySelector("input[type='radio'][value='verdadero']").checked = true;
        }
    }
}