//Definimos las variables que modelan el juego
let statedGame = false;
let match = 0;
//Recuperamos el tiempo del local storage
let tiempo = sessionStorage.getItem("tiempo")
//Parseamos y se lo asignamos a la variable time
let time = JSON.parse(tiempo)
let flippedCards = 0;
let attempts = 0;
let card1;
let card1Value;
let card2;
let card2Value;
let countTime = null;
let points = 100;
let topFive = [];
// En top five se van a guardar los 5 mejores scores.
//Sonidos
let firstCardAudio = new Audio("./sounds/firstCard.wav")
let matchAudio = new Audio("./sounds/match.wav")
let noMatch = new Audio("./sounds/noMatch.wav")
let loseAudio = new Audio("./sounds/lose.wav")
let win = new Audio("./sounds/win.wav")
let music = new Audio("./sounds/music.wav")
music.volume = 0.1;

//Capturamos los elementos del DOM
let moves = document.getElementById("moves");
let start = document.getElementById("btn");
let end = document.getElementById("endGame")
let timer = document.getElementById("time")
let cards = document.getElementsByClassName("card")


//Manejo de eventos

//Click in cards event
document.addEventListener('click', (e) => {
    // Retrieve id from clicked element
    let elementId = e.target.id;
    // If element has id
    if (e.target.className.includes('card') && elementId != '') {
        flip(elementId);
    }
}
);

//Evento mejores puntajes
document.addEventListener('click', (e) => {
    if (e.target.className.includes('topScore')) {
        showScores();
    }
}
);

//Iconos del tablero
let icons = ["🍌", "🍌", "🍉", "🍉", "🍍", "🍍", "🥕", "🥕", "🥥", "🥥", "🍒", "🍒", "🍓", "🍓", "🍇", "🍇"];

//Los mezclamos
let items = mix(icons);

//Recibe el array de iconos y los retorna mezclados
function mix(icons) {
    return icons.sort(() => Math.random() - 0.5);
}

//Cuando se inicia el juego, comienza a correr el tiempo
const startGame = () => {
    music.play();
    countTime = setInterval(() => {
        time--;
        timer.innerHTML = `${time}`
        if (time <= 5) {
            timer.classList.add("red")
        }
        if (time == 0 && match != 8) {
            youLose();
        }
    }, 1000)
}

//Acá corre el juego
function flip(id) {

    //Iniciamos el juego
    if (!statedGame) {
        startGame();
        statedGame = true;
    }

    //Incrementamos las cartas mostradas
    flippedCards += 1;

    //Selección de la primera carta
    if (flippedCards === 1) {
        firstCardAudio.play();
        //Capturamos la carta que se elige 
        card1 = document.getElementById(id)
        //Le asignamos un valor del arreglo
        card1Value = items[id]
        //Mostramos el valor asignado
        card1.innerHTML = items[id]
        //Le agregamos la clase unavailable
        card1.classList.add('unavailable')
    }

    //Selección de la segunda carta
    else if (flippedCards === 2) {
        //Capturamos la carta que se elige 
        card2 = document.getElementById(id)
        //Le asignamos un valor del arreglo
        card2Value = items[id]
        //Mostramos el valor asignado
        card2.innerHTML = items[id]
        //Sumamos un intento
        attempts++;
        //Actualizamos los movimientos
        moves.innerHTML = attempts
        //Chequeamos una coincidencia
        checkMatch(card1Value, card2Value);
    }

    //Si se hacen 8 puntos, se gana
    if (match == 8) {
        youWin();
    }
}

function checkMatch(card1Value, card2Value) {
    //Si el valor de las dos cartas elegidas coincide
    card1Value == card2Value ? (
        matchAudio.play(),
        //Reestablecemos flippedCards
        flippedCards = 0,
        //Incrementamos match
        match += 1,
        //Inhabilitamos su selección 
        card2.classList.add('unavailable')) :
        //Despues de un segundo
        setTimeout(() => {
            noMatch.play(),
                //Reestablecemos flippedCards
                flippedCards = 0;
            //Ocultamos el contenido de las tarjetas
            card1.innerHTML = "";
            card2.innerHTML = "";
            //Volvemos a habilitar la tarjeta
            card1.classList.remove('unavailable')
        }, 650)
}

function youLose() {
    music.pause();
    loseAudio.play();
    //Paramos el tiempo
    clearInterval(countTime);
    showCards();
    //Mostramos cartel de derrota y preguntamos si queremos jugar otra vez
    Swal.fire({
        title: 'ups...',
        text: 'Buen intento!',
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '<a class="noLink" href="https://mentalchallenge.netlify.app/">Jugá otra vez</a>',
        cancelButtonText: '<a class="noLink topScore">Top scores</a>',
    })
}

function youWin() {
    music.pause();
    win.play();
    //Frenamos el tiempo
    clearInterval(countTime);
    //Mostramos y bloqueamos las cartas
    showCards();
    //Mostramos resumen de victoria
    Swal.fire({
        title: 'Ganaste! </br>',
        html: `With ${attempts} moves & ${points - attempts + time} points </br></br> queres guardar tu score?`,
        width: 600,
        padding: '3em',
        color: 'rgba(34, 193, 195, 1)',
        background: '#fff url(/images/trees.png)',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: '<a class="noLink" href="https://mentalchallenge.netlify.app/">Play again</a>',
        cancelButtonText: '<a class="noLink topScore">Top scores</a>',
    }).then((result) => {
        if (result.isConfirmed) {
            saveScore();
        }
    })
}

function showCards() {
    for (let i = 0; i < icons.length; i++) {
        //Capturamos todas las cartas
        let card = document.getElementById(i);
        //Printeamos su contenido
        card.innerHTML = items[i];
        //Bloqueamos su uso
        card.classList.add('unavailable');
    }
}

//TODO.- IMPLEMENTAR TABLA DE SCORES
function saveScore() {
    Swal.fire({
        title: 'Ingresá tu nombre',
        input: 'text',
        confirmButtonText: 'Save',
        showLoaderOnConfirm: true,
        inputValidator: name => {
            if (!name) {
                return "Por favor escribi tu nombre";
            } else {
                return undefined;
            }
        }
    })
        .then(resultado => {
            if (resultado.value) {
                let user = { name: resultado.value, score: getPoints() }
                setScore(user);
                playAgain();
            }
        });
}

function playAgain() {
    Swal.fire({
        title: 'Queres intentarlo otra vez?',
        showDenyButton: true,
        confirmButtonText: '<a class="noLink" href="https://mentalchallenge.netlify.app/">Jugar otra vez</a>',
        denyButtonText: `Cancelar`,
    })
}

//Mostramos los scores y los usuarios por consola
function showScores() {

    for (let i = 0; i < localStorage.length; i++) {
        let name = localStorage.key(i)
        let point = JSON.parse(localStorage.getItem(localStorage.key(i))).score
        console.log("El usuario", name + " hizo", point + " puntos")
        console.log(topFive)
        topFive.push({ name, point })

    }
    // sortTopFive(topFive);
    Swal.fire({
        title: '<strong>TOP FIVE</strong>',
        html:
            `<table>
        <tbody>
            <tr>
                <td class="title-td">Users</td>
                <td class="title-td">Points</td>
            </tr>
            <tr>
                <td class="user">${topFive[0].name}</td>
                <td class="point">${topFive[0].point}</td>
            </tr>
            <tr>
                <td class="user">${topFive[1].name}</td>
                <td class="point">${topFive[2].point}</td>
            </tr>
            <tr>
                <td class="user">${topFive[2].name}</td>
                <td class="point">${topFive[2].point}</td>
            </tr>
            <tr>
                <td class="user">${topFive[3].name}</td>
                <td class="point">${topFive[3].point}</td>
            </tr>
            <tr>
                <td class="user">${topFive[1].name}</td>
                <td class="point">${topFive[1].point}</td>
            </tr>
        </tbody>
    </table>
  `,
        confirmButtonText: '<a class="noLink" href="https://mentalchallenge.netlify.app/">Jugá otra vez</a>',
    })
}

function sortTopFive(topFive) {

    console.log("sin ordenar --- >" + topFive)

    topFive.sort(function (a, b) {
        if (a.point > b.point) {
            return 1;
        }
        if (a.point < b.point) {
            return -1;
        }
        return 0;
    });

    console.log("ordenado --- >" + topFive)
}

function getPoints() {
    return points - attempts + time;
}

function setScore(user) {

    //Iteramos el local storage
    for (let i = 1; i < localStorage.length; i++) {
        //Reservamos el nombre y el puntaje
        // let name = localStorage.key(i)
        let usuarios = JSON.parse(localStorage.getItem(localStorage.key(i)))

        //Si el puntaje del usuario nuevo es mayor al puntaje del usuario viejo
        //Guardamos en el localstorage
        if (user.score > usuarios.score) {
            localStorage.setItem(user.name, JSON.stringify(user))
            break;
        }
    }
}
