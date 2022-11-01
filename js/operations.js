/* ---------- Llaves de acceso ------------- */
const privada = '0958d2f4e73184a1e9d82f87383aec392fd539e8';
const publica = 'a701c47acd5ab0d2398d632714db0f10';
const timestamp = Date.now();
const hash = md5(timestamp + privada + publica);

/* ------------- Buscador -------------  */
const searchInput = document.getElementById('search-input');
const searchType = document.getElementById('select-tipo');
const searchOrder = document.getElementById('search-order');
const searchBtn = document.getElementById('search-btn');

/* ------------- Variables para el buscador ------------- */
let offset = 0;
let resultsCount = 0
let input = searchInput.value;
let order = searchOrder.value;
let type = searchType.value;


/* ------------- Fetch principal de comics -------------  */
const fetchData = (input, order) => {
    let url;
    if (input !== "") {
        url = `https://gateway.marvel.com/v1/public/comics?titleStartsWith=${input}&orderBy=${order}&limit=20&offset=${offset}&ts=${timestamp}&apikey=${publica}&hash=${hash}`;
        } else {
        url = `https://gateway.marvel.com/v1/public/comics?&orderBy=${order}&limit=20&offset=${offset}&ts=${timestamp}&apikey=${publica}&hash=${hash}`;
        }
    fetch(url)
    .then(respuesta => respuesta.json())
    .then(obj => printData(obj.data.results, obj.data.total))
    .catch(error => console.error(error))
};


/* ------------- total de comics -------------  */
const fetchTotalComics = () => {
    const url = 'https://gateway.marvel.com:443/v1/public/comics?apikey=a701c47acd5ab0d2398d632714db0f10'
    fetch(url)
    .then(respuesta => respuesta.json())
    .then(obj => {resultsCount = obj.data.total
    console.log(obj.data)})
    .catch(error => console.error(error))
};

fetchTotalComics()

/* -------------personajes -------------  */
const fetchPersonajes = (input, order) => {
    resultsCount = undefined;
    let url;
    if (input !== "") {
        url = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${input}&orderBy=${order}&limit=20&offset=${offset}&ts=${timestamp}&apikey=${publica}&hash=${hash}`;
    } else {
        url = `https://gateway.marvel.com/v1/public/characters?&orderBy=${order}&limit=20&offset=${offset}&ts=${timestamp}&apikey=${publica}&hash=${hash}`;
    }
    fetch(url)
    .then(respuesta => respuesta.json())
    .then(datos => printPersonajes(datos.data.results))
    .catch(err => console.error(err))
};

/* -------------  Id de los comics -------------  */
let comicId = '';

const fetchId = id => {    
    const url = `https://gateway.marvel.com/v1/public/comics/${id}?ts=${timestamp}&apikey=${publica}&hash=${hash}`;
    fetch(url)
        .then(resp => resp.json())
        .then(obj => printDetailComic(obj.data.results))
        comicId = id
        fetchCharacterComicId(comicId)
        return comicId
};

/* -------------Id de los personajes del comic -------------  */
const fetchCharacterComicId = (id) => {
    let offsetComic = 0; 
    const url = `https://gateway.marvel.com/v1/public/comics/${id}/characters?limit=5&offset=${offsetComic}&ts=${timestamp}&apikey=${publica}&hash=${hash}`
    fetch(url)
        .then(response => response.json())
        .then(obj => {
            const totalComics = obj.data.total;
            console.log(totalComics, offsetComic);
            console.log(obj.data.results)
            printCharactersComic(obj.data.results, comicCharactersResults, comicCharactersInfo)
        }
        )          
        .catch(err => console.error(err))
};


/* -------------Id del personaje -------------  */
let characterId = '';
const fetchCharacterId = (id) => {
    resultsCount = undefined;
    const url = `https://gateway.marvel.com/v1/public/characters/${id}?&limit=20&offset=${offset}&ts=${timestamp}&apikey=${publica}&hash=${hash}`
    fetch(url)
        .then(response => response.json())
        .then((obj) => {
            printInfoCharater(obj.data.results)
            resultsCount = obj.data.results[0].comics.available;
        })
        .catch(err => console.error(err))
    characterId = id
    fetchComicsCharacterId(characterId)
    return characterId
};

/* -------------Id de los comics según el personaje -------------  */
const fetchComicsCharacterId = (id) => {
    const url = `https://gateway.marvel.com/v1/public/characters/${id}/comics?&limit=20&offset=${offset}&ts=${timestamp}&apikey=${publica}&hash=${hash}`;
    fetch(url)
        .then(response => response.json())
        .then(obj => {printComicsCharacter(obj.data.results, obj.data.total)
        console.log(obj.data.total)})
        .catch(err => console.error(err))
};

/* -------------Fetch para el buscador -------------  */
const fetchCharacters = (input, order) => {
    let url;
    if (input !== "") {
        url = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${input}&orderBy=${order}&limit=20&offset=${offset}&ts=${timestamp}&apikey=${publica}&hash=${hash}`;
    } else {
        url = `https://gateway.marvel.com/v1/public/characters?&orderBy=${order}&limit=20&offset=${offset}&ts=${timestamp}&apikey=${publica}&hash=${hash}`;
    }
    fetch(url)
        .then(response => response.json())
        .then(obj => {
            printCharactersComic(obj.data.results, '', root)
            console.log(obj.data.results)
        })
        .catch(err => console.error(err))
};

/* ------------- Función de buscar por tipo -------------  */
const buscadorTipo = () => {
    offset = 0;
    input = searchInput.value;
    type = searchType.value;
    order = searchOrder.value;
    if (type === "comics") {
        fetchData(input, order);
    }
    if (type === "characters") {
        fetchCharacters(input, order);
    }
};

/* -------------Invertir opciones de filtros según búsqueda de cómic o personaje ------------- */
searchType.addEventListener('change', () => {
    type = searchType.value
    if (type === 'comics') {
        searchOrder.innerHTML = `
        <option value='title'>A/Z</option>
        <option value='-title'>Z/A</option>
        <option value='-focDate'>Más nuevos</option>
        <option value='focDate'>Más viejos</option> 
        `
    }
    if (type === 'characters') {
        searchOrder.innerHTML = `
        <option value='name'>A/Z</option>
        <option value='-name'>Z/A</option>
        `
    }
});

/* ------------- Botón buscar -------------  */
searchBtn.addEventListener('click', () => {
    buscadorTipo()
    containerCharacterInfo.classList.add('is-hidden')
    console.log(input = '');
});

/* ------------- Funciones de paginador -------------  */
const primerPagina = (func) => {
    offset = 0;
    func();
    pageNumber = 1;
    return offset;
};

const paginaAnterior = (func) => {
    offset -= 20;
    func();
    pageNumber = Math.floor(offset / 20) + 1;
    return offset;
};

const paginaSiguiente = (func) => {
    offset += 20;
    func();
    pageNumber = Math.floor(offset / 20) + 1;
    return offset;
};

const ultimaPagina = (func) => {
    const isExact = resultsCount % 20 === 0;
    const pages = Math.floor(resultsCount / 20);
    offset = (isExact ? pages - 1 : pages) * 20;
    offset = resultsCount - (resultsCount % 20);
    func();
    pageNumber = Math.floor(offset / 20) + 1;
    return offset;
};

/* -------------Botón de subir arriba-------------  */
const btnUpContainer = document.querySelector('.go-top-container');

window.onscroll = function(){
    if(document.documentElement.scrollTop > 100){
        btnUpContainer.classList.add('show')
    } else {
        btnUpContainer.classList.remove('show')
    }
};

btnUpContainer.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
});

/* -------------Función de carga------------- */
window.onload = () => {
    fetchData(input, order);
};