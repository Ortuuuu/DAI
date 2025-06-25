(function() {
    const template = document.createElement('template');
    template.innerHTML = `
        <style>
            .wiki {
                font-size: 90%;
            }
                            
            h2 {
                font-weight: bold;
                font-size: 25px;
            }
            
            img {
                vertical-align: text-top;
                max-width: 50px;
                max-width: 50px;
                margin-right: 10px;
                border: 1px solid lightgray;
            }
        </style>

        <h2>
            <img src="" alt=""/>
        </h2>
    `;

    class Encabezado extends HTMLElement {

        static get observedAttributes() {
            return ['data-tema'];
        }

        constructor() {
            super();
            let clone = template.content.cloneNode(true);
            let shadowRoot = this.attachShadow({
                mode: 'open'
            });
            shadowRoot.appendChild(clone);

            // Variables que nos permitirán el posterior acceso a sus elementos
            this.encabezado = this.shadowRoot.querySelector('h2');
            this.imagen = this.shadowRoot.querySelector('img');
        }

        connectedCallback() {
            this.tema = this.getAttribute('data-tema');
            if (this.tema) {
                this.actualizarComponente(this.tema);
            }
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (name === 'data-tema' && oldValue !== newValue) {
                this.tema = newValue;
                this.actualizarComponente(this.tema);
            }
        }

        lanzarError(mensajeDeError, divDescripcionWiki, esExcepcion) {
            if(esExcepcion) {
                console.log(`EXCEPCIÓN!! => ${mensajeDeError}`);
            }
            else {
                this.encabezado.append(document.createTextNode("Cuestionario sin tema válido"));
                this.shadowRoot.append(divDescripcionWiki);
            }
            this.imagen.src = 'https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57723/globe_east_540.jpg';
            this.imagen.alt = "Imagen de cuestionario no válido";
        }

        peticionWikipedia(tema, componente, divDescripcionWiki) {
            fetch(`https://es.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts&exintro&explaintext&continue&titles=${encodeURIComponent(tema)}`)
                .then(function(response) {
                    if (!response.ok) {
                        throw new Error(`Error en la petición a Wikipedia: ${response.statusText}. Tema: ${tema}`);
                    }
                    return response.json();
                })
                .then(function(objetoResponse) {
                    let pagesAtributo = objetoResponse.query.pages;
                    let key = Object.keys(pagesAtributo)[0];
                    let textoRaw = pagesAtributo[key]?.extract || "";
                    let regex = /\[\d+\]/g;
                    divDescripcionWiki.textContent = textoRaw.replace(regex, '');
                    componente.shadowRoot.append(divDescripcionWiki);
                    return componente;
                })
                .catch(function(error) {
                    componente.lanzarError(error.message, divDescripcionWiki, true);
                });
        }
        

        peticionFlickr(tema, componente) {
            const api_key = '1cb78b3aa24d273b13389553bad5bac3';

            fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${api_key}&text=${encodeURIComponent(tema)}&format=json&per_page=10&media=photos&sort=relevance&nojsoncallback=1`)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error(`Error en la petición a Flickr: ${response.statusText}. Tema: ${tema}`);
                }
                return response.json();
            })
            .then(function(responseAsobject) {
                // Comprobamos que exista foto. Si introducimos tema random (fbdasjf) y no hacemos esta comprobación, al ejecutar responseasobject.photos.photo[0].id dará error ya que esa photo[0] no existe y estamos forzando a que acceda al atributo id de un elemento inexistente
                let primeraFoto = responseAsobject.photos.photo[0];
                if(!primeraFoto) {
                    throw new Error(`No se han encontrado imagenes en Flickr. Tema: ${tema}`);
                }

                let idPrimeraImagen = responseAsobject.photos.photo[0].id;
                fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=${api_key}&photo_id=${idPrimeraImagen}&format=json&nojsoncallback=1`)
                .then(function(response2) {
                    if (!response2.ok) {
                        throw new Error(`Error en la obtención de la imagen de Flickr: ${response2.statusText}`);
                    }
                    return response2.json();
                })
                .then(function(responseAsobject2) {
                    componente.imagen.src = responseAsobject2.sizes.size[0].source;
                    componente.imagen.alt = `Imagen de ${tema}`;
                })
                .catch(function(error) {
                    componente.lanzarError(error.message, undefined, true);
                });
            })
            .catch(function(error) {
                componente.lanzarError(error.message, undefined, true);
            });
        };

        actualizarComponente(tema) {
            var componente = this;
            let divDescripcionWiki = this.shadowRoot.querySelector('.wiki');
            // Creamos el div en caso de no existir previamente
            if (!divDescripcionWiki) {
                divDescripcionWiki = document.createElement('div');
                divDescripcionWiki.className = "wiki";
                this.shadowRoot.appendChild(divDescripcionWiki);
            }

            // Limpiamos el nodo de texto del h2 y el contenido del nodo img, pero conservando el nodo img
            this.encabezado.textContent = ""; // Limpia TODO el contenido del nodo encabezado, incluida la eliminación del nodo img
            this.encabezado.appendChild(this.imagen); // Añade la imagen de nuevo al encabezado
            this.imagen.src = ''; 
            this.imagen.alt = ''; 
            divDescripcionWiki.textContent = '';

            if (!tema || tema === '') {
                this.lanzarError("No hay tema", divDescripcionWiki, false);
            } else {
                this.encabezado.appendChild(document.createTextNode(`Cuestionario de ${tema}`));

                this.peticionWikipedia(tema, componente, divDescripcionWiki);
                this.peticionFlickr(tema, componente);
            }
        };
    }

    customElements.define("encabezado-cuestionario", Encabezado);
})();
