import { Instrument } from "/home/cyrille/node_modules/piano-chart";

const piano = new Instrument(document.getElementById('pianoContainer'));
piano.create();

piano.keyDown("D4");
piano.keyDown("F#4");
piano.keyDown("A4");

console.log("Allo");