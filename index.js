/* import { Instrument } from "/home/anto/node_modules/piano-chart";

const piano = new Instrument(document.getElementById('pianoContainer'));
piano.create();

piano.keyDown("D4");
piano.keyDown("F#4");
piano.keyDown("A4"); */

function handleAnswer0(){
    // get which game 
    console.log("handling an answer : 0");
}

function handleAnswer1(){
    // get which game 
    console.log("handling an answer: 1");
}



function init(){
    let buttons = document.querySelectorAll(".js-button");
    for(let i = 0; i< buttons.length; i++){
        let callback_method = "handleAnswer"+i;
        buttons[i].addEventListener("click",callback_method);
        // not sure if the callback method workaround works
    }


}

window.addEventListener("load", init);