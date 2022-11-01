/* ------------- Contenedores principales ------------- */
const root = document.getElementById('root');
const rootPersonajes = document.getElementById('root-personajes');
const containerPaginador = document.getElementById('container-pagination');

/* ------------- Contenedores secundarios ------------- */
const containerCharacterInfo = document.getElementById('container-character-info');
const comicCharactersResults = document.getElementById('comic-characters-results');
const comicCharactersInfo = document.getElementById('comic-characters-info');
const containerComicInfo = document.getElementById('container-comic-info');
const characterComicsResults = document.getElementById('character-comics-results');
const characterInfo = document.getElementById('character-info');
const results = document.getElementById('results');

/* Id botón regresar */
let idBtnRegresar = 0;


/* ------------- Función de pintar los cómics ------------- */
const printData = (arr, num) => {
    comicCharactersResults.classList.add('is-hidden');
    comicCharactersInfo.classList.add('is-hidden');
    results.classList.remove('is-hidden');
    let cajita = '';

    results.innerHTML = `
    <div class="mb-5">
            <h3 class="is-size-5 american-font">Resultados</h3>
            <span class="">${num} Resultados</span>
        </div>
    `;
    arr.forEach(comic => {
        const {title, thumbnail: {extension, path}, id} = comic;

        const pathNonFoundNowanted = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available";
        const pathNonFoundWanted = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_uncanny";
        cajita += 
            `<div class="column is-one-fifth" onclick="fetchId(${id})">
                <figure>
                    <a href="#">
                        <img src="${path === pathNonFoundNowanted ? pathNonFoundWanted : path}.${extension}" alt="${title}">
                        <p class="american-font">${title}</p>
                    </a>
                </figure>
            </div>`    
    });
    root.innerHTML = cajita;

    containerPaginador.innerHTML = `
    <button id="first-page-btn" class="first-page pagination-next" ${
        offset === 0 && "disabled"
    } onclick="primerPagina(${() => fetchData(input, order)})">
    <i class="fas fa-angle-double-left"></i>
    </button>

    <button id="previews-page-btn" class="pagination-previous" ${
        offset === 0 && "disabled"
    } onclick="paginaAnterior(${() => fetchData(input, order)})">
    <i class="fas fa-angle-left"></i>
    </button>
    
    <button id="next-page-btn" class="pagination-next" ${
        offset === resultsCount - (resultsCount % 20) && "disabled"
    } onclick="paginaSiguiente(${() => fetchData(input, order)})">
    <i class="fas fa-angle-right"></i>
    </button>

    <button id="last-page-btn" class="last-page pagination-next" ${
        offset === resultsCount - (resultsCount % 20) && "disabled"
    } onclick="ultimaPagina(${() => fetchData(input, order)})">
    <i class="fas fa-angle-double-right"></i>
    </button>
    `;
};

/* ------------- Función de pintar los personajes------------- */
const printPersonajes = arr => {    
    let cajita = '';

    arr.forEach(comic => {
        const {id, name, thumbnail: {extension, path}} = comic;
        
        const pathNonFoundNowanted = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available";
        const pathNonFoundWanted = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_uncanny";

        cajita += 
            `<div class="column is-2" onclick="obtenerid(${id})">
                <div class="card">
                    <figure class="image is-4by5 personaje-container">
                        <a href="#">
                            <img src="${path === pathNonFoundNowanted ? pathNonFoundWanted : path}.${extension}" alt="${name}" class="personaje-thumbnail">
                        </a>
                    </figure>

                    <div class="card-content has-background-black has-text-light">
                        <p class="american-font">${name}</p>
                    </div>
                </div>
            </div>`    
    });
    rootPersonajes.innerHTML = cajita;   
};


/* ------------- Función de detalles del cómic seleccionado ------------- */
const printDetailComic = arr => {
    comicCharactersInfo.classList.remove('is-hidden');
    containerComicInfo.classList.remove('is-hidden');    
    containerCharacterInfo.classList.add('is-hidden');
    comicCharactersResults.classList.remove('is-hidden');  
    results.classList.add('is-hidden');

    let cajita = '';
    
    arr.forEach(comic => {
        const {thumbnail: {extension, path}, title, description, dates, creators, id } = comic;
        const releaseDate = new Intl.DateTimeFormat('es-AR').format(new Date(dates?.find(el => el.type === 'onsaleDate').date))
    
        const writer = creators?.items
        ?.filter((el) => el.role === "writer")
        .map((creator) => creator.name)
        .join(", ");

        idBtnRegresar = id;
        
        const pathNonFoundNowanted = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available";
        const pathNonFoundWanted = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_uncanny";

        cajita += `
        <div class="columns p-5 box-detail">
            <div class="column is-one-quarter">
                <figure class="img-detalle">
                    <img src="${path === pathNonFoundNowanted ? pathNonFoundWanted : path}.${extension}" alt="${title}" class="img-comic-info">
                </figure>
            </div>
            <div class="column is-size-6 px-6 py-4">
                <h3 class="title title-color">${title}</h3>
                <h4 class="has-text-weight-bold m-0 mb-2">Publicado:</h4>
                <p>${releaseDate}</p>
                <h4 class="has-text-weight-bold m-0 mt-3 mb-2">Guionistas:</h4>
                <p>${writer ? writer : 'Sin informacion'}</p>
                <h4 class="has-text-weight-bold m-0 mt-3 mb-2">Descripción:</h4>
                <p class="has-text-justified pr-5">${description ? description : 'Sin información'}<p>
                <button class="button is-dark mt-3" onclick="fetchData(input, order)">Regresar</button>
            </div>
        </div> `
    })
    root.innerHTML = cajita;
    myFunction2(x);
};

/* ------------- Función de los personajes del cómic seleccionado ------------- */
const printCharactersComic = (arr, containerText, container) => {
    if(arr.length === 0){
        containerText.innerHTML = `
            <h3 class="title mb-2 title-color">Personajes</h3>
            <p class="is-size-6 has-text-weight-bold mt-0">${arr.length} Resultado(s)</p>
            <p class="subtitle has-text-weight-bold mt-6 title-color">No se han encontrado resultados</p>`
    }

    let box = '';

    arr.forEach(character => {
        const {name, thumbnail: {extension, path}, id} = character;
        const pathNonFoundNowanted = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available";
        const pathNonFoundWanted = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_uncanny";
        containerText.innerHTML = `
                <h3 class="title mb-2 title-color">Personajes</h3>
                <p class="is-size-6 has-text-weight-bold mt-0">${arr.length} Resultado(s)</p>`;
        box += `
        <div class="column is-2" onclick="fetchCharacterId(${id})">
            <div class="card">
                <figure class="image is-4by5 personaje-container">
                    <a href="#">
                        <img src="${path === pathNonFoundNowanted ? pathNonFoundWanted : path}.${extension}" alt="${name}" class="personaje-thumbnail">
                    </a>
                </figure>
                <div class="card-content has-background-black has-text-light">
                    <p class="american-font">${name}</p>
                </div>
            </div>
        </div>`
    });
    container.innerHTML = box;
    containerPaginador.innerHTML = `
    <button id="first-page-btn" class="first-page pagination-next" ${
        offset === 0 && "disabled"
    } onclick="primerPagina(${() => fetchPersonajes(input, order)})">
    <i class="fas fa-angle-double-left"></i>
    </button>


    <button id="previews-page-btn" class="pagination-previous" ${
        offset === 0 && "disabled"
    } onclick="paginaAnterior(${() => fetchPersonajes(input, order)})">
    <i class="fas fa-angle-left"></i>
    </button>


    <button id="next-page-btn" class="pagination-next" ${
        offset === 0 && "disabled"
    } onclick="paginaSiguiente(${() => fetchPersonajes(input, order)})">
    <i class="fas fa-angle-right"></i>
    </button>


    <button id="last-page-btn" class="last-page pagination-next" ${
        offset === 0 && "disabled"
    } onclick="ultimaPagina(${() => fetchPersonajes(input, order)})">
    <i class="fas fa-angle-double-right"></i>
    </button>
    `;  
};

/* ------------- info del personaje seleccionado ------------- */
const printInfoCharater = (arr) =>{
    comicCharactersInfo.classList.add('is-hidden');
    containerComicInfo.classList.add('is-hidden');
    containerCharacterInfo.classList.remove('is-hidden');

    let box = '';
    arr.forEach(character => {
        const {name, thumbnail: {extension, path}, description} = character;
        const pathNonFoundNowanted = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available";
        const pathNonFoundWanted = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_uncanny";
        
        box += `
        <div class="columns p-5 box-detail">
            <div class="column is-one-quarter">
                <figure class="img-detalle">
                <img src="${path === pathNonFoundNowanted ? pathNonFoundWanted : path}.${extension}" alt="${name}" class="img-comic-info">
                </figure>
            </div>
            <div class="column is-size-6 px-6 py-4">
                <h3 class="title title-color">${name}</h3>
                <h4 class="has-text-weight-bold m-0 mt-3 mb-2">Descripción:</h4>
                <p class="has-text-justified pr-6">${description ? description : 'Sin información'}</p>
                <button class="button is-dark mt-3" onclick="fetchId(${idBtnRegresar})">Regresar</button>
            </div>
        </div>
        `
    });
    root.innerHTML = box;

    if(arr[0].comics.available == 0){
        characterComicsResults.innerHTML = `
            <h3 class="title mb-2 title-color">Comics</h3>
            <p class="is-size-6 has-text-weight-bold mt-0 label-select">${arr[0].comics.available} Resultado(s)</p>
            <p class="subtitle has-text-weight-bold mt-6 title-color">No se han encontrado resultados</p>`
    } else{
        characterComicsResults.innerHTML = `
        <h3 class="title mb-2 title-color">Comics</h3>
        <p class="is-size-6 has-text-weight-bold mt-0 label-select">${arr[0].comics.available} Resultado(s)</p>`
    };
};

/* ------------- Función de pintar los cómics del personaje ------------- */
const printComicsCharacter = (arr, num) => {
    containerCharacterInfo.classList.remove('is-hidden');
    
    let box = '';
    if(num === 0){
        characterComicsResults.innerHTML = `
        <div class="container">
            <h3 class="title mb-2 title-color">Comics</h3>
            <p class="is-size-6 has-text-weight-bold mt-0 label-select">0 Resultado(s)</p>
            <p class="subtitle has-text-weight-bold mt-6 title-color">No se han encontrado resultados</p>
        </div>
        `
    } else {
        characterComicsResults.innerHTML = `
        <div class="container">
            <h3 class="title mb-2 title-color">Comics</h3>
            <p class="is-size-6 has-text-weight-bold mt-0 label-select">${num} Resultado(s)</p>
        </div>
        `
    };    

    arr.forEach(comic => {
        const {title, thumbnail: {extension, path}, id} = comic;
        const pathNonFoundNowanted = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available";
        const pathNonFoundWanted = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_uncanny";
        box += `        
            <div class="column is-full-mobile is-one-third-tablet is-one-fifth-desktop box-comic-character" onclick="fetchId(${id})">
                <figure>
                    <a>
                        <img class="height_img" src="${path === pathNonFoundNowanted ? pathNonFoundWanted : path}.${extension}" alt="${title}">
                        <p class="has-text-centered">${title}</p>
                    </a>
                </figure>
            </div>
            `          
    });

    characterInfo.innerHTML = box;
    containerPaginador.innerHTML = `
    <button id="first-page-btn" class="first-page pagination-next" ${
        offset === 0 && "disabled"
    } onclick="primerPagina(${() => fetchCharacterId(characterId)})">
    <i class="fas fa-angle-double-left"></i>
    </button>

    <button id="previews-page-btn" class="pagination-previous" ${
        offset === 0 && "disabled"
    } onclick="paginaAnterior(${() => fetchCharacterId(characterId)})">
    <i class="fas fa-angle-left"></i>
    </button>
    
    <button id="next-page-btn" class="pagination-next" ${
        offset === resultsCount - (resultsCount % 20) && "disabled"
    } onclick="paginaSiguiente(${() => fetchCharacterId(characterId)})">
    <i class="fas fa-angle-right"></i>
    </button>

    <button id="last-page-btn" class="last-page pagination-next" ${
        offset === resultsCount - (resultsCount % 20) && "disabled"
    } onclick="ultimaPagina(${() => fetchCharacterId(characterId)})">
    <i class="fas fa-angle-double-right"></i>
    </button>
    `;
};

/* ------------- Responsive ------------- */
const myFunction = (x) => {
    if (x.matches) {
        root.classList.remove('is-mobile')
    } else {
        root.classList.add('is-mobile')
    }
};

var x = window.matchMedia("(max-width: 550px)")
myFunction(x);
x.addListener(myFunction);

const myFunction2 = (x) => {
    if (x.matches) {
        root.classList.remove('is-mobile')
    } else {
        root.classList.add('is-mobile')
    }
};

var x = window.matchMedia("(max-width: 550px)");
x.addListener(myFunction2);