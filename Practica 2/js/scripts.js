var contadorGlobal = 1;
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

    // Asociamos la función 'addCuestionario' como manejadora del evento 'click' del botón de añadir cuestionario
    let botonAddCuestionario = document.querySelector("#nuevoCuestionario.formulario input[type='button']");
    botonAddCuestionario.addEventListener("click", addCuestionario, false);
    // Asociamos la funcion 'addCuestionario' al evento 'keydown' de los cuadros de texto del formulario
    let inputsFormNuevoCuestionario = document.querySelectorAll("#nuevoCuestionario.formulario input[type='text'], #nuevoCuestionario.formulario input[type='url']");
    for (let i = 0; i < inputsFormNuevoCuestionario.length; i++) {
        inputsFormNuevoCuestionario[i].addEventListener('keydown', (event) => {
            if(event.key == 'Enter') {
                addCuestionario(event);
            }
        }, false);
    }
};



// FUNCIONES AUXILIARES PARA MANIPULAR EL DOM //
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



// FUNCIONES PARA ELIMINAR PREGUNTAS //
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



// FUNCIONES PARA AÑADIR NUEVAS PREGUNTAS //
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


// FUNCIONES PARA AÑADIR NUEVOS CUESTIONARIOS //
function addCuestionario(evento) {
    let botonAddCuestionario = evento.target;
    let formNuevoCuestionario = queryAncestorSelector(botonAddCuestionario, "#nuevoCuestionario.formulario");

    let tituloCuestionario = formNuevoCuestionario.querySelector("input[type='text'][id='tema']")
    let urlImagen = formNuevoCuestionario.querySelector("input[type='url'][id='imagen']");

    if(tituloCuestionario.value == "" && urlImagen.value == "") {
        window.alert("El título del cuestionario y la URL de la imagen no pueden estar vacíos.");
    }
    else if(tituloCuestionario.value == "") {
        window.alert("El título del cuestionario no puede estar vacío");
    }
    else if(urlImagen.value == "") {
         window.alert("La URL de la imagen no puede estar vacía.");
    }
    else {
        // Creamos la seccion del cuestionario
        let nuevaSeccion = document.createElement("section");
        nuevaSeccion.id = "c" + contadorGlobal;

        // Creamos el encabezado de la seccion
        let encabezadoSeccion = document.createElement("h2");
        encabezadoSeccion.textContent = "Cuestionario sobre " + tituloCuestionario.value;

        let imagenSeccion = document.createElement("img");
        imagenSeccion.setAttribute("src", urlImagen.value);
        imagenSeccion.setAttribute("alt", "Imagen de " + tituloCuestionario.value);

        // Anidamos los elementos 
        nuevaSeccion.appendChild(encabezadoSeccion);
        insertAsFirstChild(encabezadoSeccion, imagenSeccion);
        addFormPregunta(nuevaSeccion);

        // Lo insertamos en el documento y añadimos la entrada al indice
        document.querySelector("main").appendChild(nuevaSeccion);

        let entradaIndice = document.createElement("li");
        let nuevoElemIndice = document.createElement("a");
        nuevoElemIndice.setAttribute("href", "#c" + contadorGlobal);
        nuevoElemIndice.className = "c" + contadorGlobal;
        nuevoElemIndice.textContent = tituloCuestionario.value;
        entradaIndice.appendChild(nuevoElemIndice);
        document.querySelector("nav ul").appendChild(entradaIndice);

        // Limpiamos el formulario e incrementamos el contador global
        tituloCuestionario.value = "";
        urlImagen.value = "";
        contadorGlobal += 1;
    }
}