var question_number = null;
var game_number = null;
var timer = null;
var game_session = 0;
var is_game_running = 0;

game1_data=[]
game1_answers=[]

function init(){
    init_navbar();
    timer = $("#timer");

}

function init_navbar() {
    navbar = $("#navbar");
    navbar.removeClass("hidden");

    for (let i=1; i<=4; i++) {
        $("#button_game"+i).on("click", new_game);
    }
}

function new_game() {
    // We reinitialize the timer and score and we delete event listeners on last game played
    $("#game_container").children().addClass("hidden");
    timer.html(10);
    $("#score").html(0);

    question_number=0;
    game_session++;

    if(game_number) {
        $("#submission"+game_number).off('click', verify_answer);
        timer.off('timerEnded', verify_answer);
    }

    switch(this.id) {
        case "button_game1":
            $("#game1").removeClass("hidden")
            game_number = 1;
            break;
        case "button_game2":
            $("#game2").removeClass("hidden")
            game_number = 2;
            break;
        case "button_game3":
            $("#game3").removeClass("hidden")
            game_number = 3;
            break;
        case "button_game4":
            $("#game4").removeClass("hidden")
            game_number = 4;
            $(".js_bq4").on("click", function() {
                $(".js_bq4").removeClass("btn-secondary checked").addClass("btn-primary")
                $(this).removeClass("btn-primary").addClass("btn-secondary checked")
            })
            break;
    }

    run_game()
}

function run_game() {
    $("#submission"+game_number).on('click', verify_answer);
    timer.on('timerEnded', verify_answer);

    is_game_running = true;
    next_question()
}

function next_question() {
    question_number++;

    if(question_number>5) {
        is_game_running = false;
        // garder le score obtenu pour le jeu en question en memoire ici

        console.log("jeu termine");
        return;
    }

    let question = generate_question()
    $("#question_"+game_number).html(question)

    update_timer(5, question_number, game_session);
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
    if(!is_game_running){return;}

    let current_score = $("#score").text()

    //   test
    //$("#score").html(++current_score)

    switch(game_number) {           // Checker si les reponses sont correctes, et incrementer le score dans la barre nav avec score.html(++current_score)
        case 1:
            let type_alt = $("#type_alt").val();
            let nb_alt = $("#nb_alt").val();
            console.log(type_alt,nb_alt);
            break;
        case 2:
            let alteration_wanted = $("#alteration_wanted").val();
            let scale_wanted = $("#scale_wanted").val();
            console.log(alteration_wanted,scale_wanted);
            break;
        case 3:
            let checked = []
            for (let i=0;i<12;i++) {
                if($("#select_ht_"+i).prop("checked")===true) {
                    checked.push(i)
                }
            }
            console.log(checked)
            break;
        case 4:
            var minor_rel = null;
            for (let i=0;i<12;i++) {
                if($("#minor_rel_"+i).hasClass("checked")) {
                    minor_rel = i;
                }
            }
            $(".js_bq4").removeClass("btn-secondary checked").addClass("btn-primary")       // Resets all buttons when an answer is submitted for game number 4
            console.log(minor_rel)
            break;
    }

    next_question();
}

function update_timer(time, n, s) {
    if(question_number !== n || game_session !== s) {
        // If the question has changed (due to player clicking "submit" button), we want to stop this timer updater.
        return;
    }

    timer.html(time);

    if(time===0) {
        // We send an event to the timer, and the run_game() functions will handle it
        document.getElementById("timer").dispatchEvent(new CustomEvent('timerEnded'));
        return;
    }
    setTimeout(function(){update_timer(time-1, n, s)}, 1000);
}

window.addEventListener("load", init);