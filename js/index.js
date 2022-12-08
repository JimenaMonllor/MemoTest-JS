let time = 0;

// Evento click en nivel
document.addEventListener('click', (evt) => {
    let lvl = evt.target.id;
    if (evt.target.className.includes('level') && lvl != '') {
        lvl === "extreme" ? time = 26 : time = 35
    }
    const tiempoString = JSON.stringify(time);
    sessionStorage.setItem("tiempo", tiempoString)
    //Reservamos la variable elegida para utilizar en app.js
}
);

//Evento click en play
const btn = document.querySelector('#btn')
btn.addEventListener("click", () => {
    time == 0 ? Swal.fire('POR FAVOR ELEGI UN NIVEL') : location.href = "./game.html";
}
);

