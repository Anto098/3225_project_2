var game1 = null;
var game2 = null;
var game3 = null;
var game4 = null;

var question_number = null;
var game_number = null;
var timer = null;

game1_data=[]
game1_answers=[]


function init(){
    init_games();
    init_navbar();
    timer = $("#timer");

}

function init_games() {
    game1 = $("#game1");
    game2 = $("#game2");
    game3 = $("#game3");
    game4 = $("#game4");
}

function init_navbar() {
    navbar = $("#navbar");
    navbar.removeClass("hidden");

    for (let i=1; i<=4; i++) {
        $("#button_game"+i).on("click", new_game);
    }
}

function new_game() {
    hide_games();

    // We reinitialize the timer and score and we delete event listeners on last game played
    timer.html(10);
    $("#score").html(0);

    question_number=1;

    if(game_number) {
        $("#submission"+game_number).off('click', verify_answer);
        timer.off('timerEnded', verify_answer);
    }

    switch(this.id) {
        case "button_game1":
            game1.removeClass("hidden")
            game_number = 1;
            break;
        case "button_game2":
            game2.removeClass("hidden")
            game_number = 2;
            break;
        case "button_game3":
            game3.removeClass("hidden")
            game_number = 3;
            break;
        case "button_game4":
            game4.removeClass("hidden")
            game_number = 4;
            break;
    }

    run_game()
}

function hide_games() {
    game1.addClass("hidden")
    game2.addClass("hidden")
    game3.addClass("hidden")
    game4.addClass("hidden")
}

function run_game() {
    $("#submission"+game_number).on('click', verify_answer);
    timer.on('timerEnded', verify_answer);

    next_question()
}

function next_question() {

    if(question_number>5) {
        console.log("jeu termine");
        return;
    }

    let question = generate_question()
    $("#question_"+game_number).html(question)

    update_timer(2, question_number);

}

function generate_question() {
    switch(game_number) {
        case 1:
            return "question numero "+question_number+" du jeu "+game_number;     // A remplacer par les vraies questions
        case 2:
            return "question numero "+question_number+" du jeu "+game_number;
        case 3:
            return "question numero "+question_number+" du jeu "+game_number;
        case 4:
            return "question numero "+question_number+" du jeu "+game_number;
    }
}

function verify_answer() {
    let type_alt = $("#type_alt").val();
    let nb_alt = $("#nb_alt").val();
    console.log(type_alt,nb_alt);

    next_question();

    switch(game_number) {
        case 1:
            break;
        case 2:
            break;
        case 3:
            break;
        case 4:
            break;
    }
}

function update_timer(time, n) {
    if(question_number !== n) {
        // If the question has changed (due to player clicking "submit" button), we want to stop this timer updater.
        return;
    }

    timer.html(time);

    if(time===0) {
        // We send an event to the timer, and the run_game() functions will handle it
        document.getElementById("timer").dispatchEvent(new CustomEvent('timerEnded'));
        return;
    }
    setTimeout(function(){update_timer(time-1, n)}, 1000);
}




window.addEventListener("load", init);