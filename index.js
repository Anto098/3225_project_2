const SCALE_TYPE_COUNT = 2;
const KEY_SIGNATURE_COUNT = 15;
const BUTTON_COUNT = 12;

var question_number = null;
var game_number = null;
var timer = null;
var game_session = 0;
var is_game_running = 0;

var scale_type;
var scale_type_text;
var other_scale_type;
var other_scale_type_text;

var alteration_count;
var alteration_type;

var scale;
var scale_alteration;
var other_scale;
var other_scale_alteration;

var first_note_id;

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
    // Reinitialize timer/score and delete event listeners on last game played
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

        console.log("Jeu terminé");
        return;
    }

    let question = generate_question()
    $("#question_"+game_number).html(question)

    update_timer(30, question_number, game_session);
}

function generate_question() {
    var maj_or_min = Math.floor(Math.random() * SCALE_TYPE_COUNT);
    var scale_id = Math.floor(Math.random() * KEY_SIGNATURE_COUNT);
    var expected_answer;

    expected_answer = document.getElementById("alt_"+scale_id).innerHTML.substring(0, 3); // Get note without tags

    if(maj_or_min == 1) {
        scale_type = "maj_";
        other_scale_type = "min_";
    }
    else {
        scale_type = "min_";
        other_scale_type = "maj_";
    }
    // Get scale type from appropriate row header
    scale_type_text = document.getElementById(scale_type).innerHTML.split(" ")[1];
    other_scale_type_text = document.getElementById(other_scale_type).innerHTML.split(" ")[1];

    alteration_count = expected_answer.split(" ")[0]; // Get alteration count from appropriate column header
    if(alteration_count == 0) alteration_type = "Aucune";
    else alteration_type = expected_answer.split(" ")[1]; // Get alteration type from appropriate column header unless count is 0

    scale = document.getElementById(scale_type+scale_id).innerHTML.split(" ")[0]; // Get scale root from appropriate cell
    scale_alteration = document.getElementById(scale_type+scale_id).innerHTML.split(" ")[1]; // Get scale alteration from appropriate cell
    if(scale_alteration == "mineur" || scale_alteration == "majeur") scale_alteration = "Aucune";

    other_scale = document.getElementById(other_scale_type+scale_id).innerHTML.split(" ")[0];
    other_scale_alteration = document.getElementById(other_scale_type+scale_id).innerHTML.split(" ")[1];
    if(other_scale_alteration == "mineur" || other_scale_alteration == "majeur") other_scale_alteration = "Aucune";

    // Get button associated with scale root
    if(scale_alteration == "Aucune") {
        for(var i = 0; i < BUTTON_COUNT; i++) {
            let note = document.getElementById("select_"+i).innerHTML;
            if(note.includes(scale) && !note.includes("♯") && !note.includes("♭")) {
                first_note_id = i;
            }
        }
    }
    else {
        for(var i = 0; i < BUTTON_COUNT; i++) {
            let note = document.getElementById("select_"+i).innerHTML;
            if(note.includes(scale+" "+scale_alteration)) {
                first_note_id = i;
            }
        }
    }

    switch(game_number) {
        case 1:
            return "Quelle sont les altérations de la gamme de "+document.getElementById(scale_type+scale_id).innerHTML+" et combien y en a-t-il?";
        case 2:
            if(alteration_type != "Aucune") return "Quelle est la tonalité "+scale_type_text+"e qui contient "+alteration_count+" "+alteration_type+"?";
            else return "Quelle est la tonalité "+scale_type_text+"e qui contient "+alteration_count+" altérations?";
        case 3:
            return "Quelles sont les notes de la gamme de "+document.getElementById(scale_type+scale_id).innerHTML+"?";
        case 4:
            return "Quelle est la relative "+other_scale_type_text+"e de "+document.getElementById(scale_type+scale_id).innerHTML+"?";
    }
}

function verify_answer() {
    if(!is_game_running){return;}

    let current_score = $("#score").text()

    switch(game_number) {
        case 1:
            let type_alt = $("#type_alt").val();
            let nb_alt = $("#nb_alt").val();
            if(type_alt == "Aucune") console.log("Réponse entrée: ", nb_alt);
            else console.log("Réponse entrée: ", nb_alt, type_alt);
            if(alteration_type == "Aucune") console.log("Réponse attendue: ", alteration_count);
            else console.log("Réponse attendue: ", alteration_count, alteration_type);
            if(type_alt == alteration_type && nb_alt == alteration_count) $("#score").html(++current_score);
            break;
        case 2:
            let alteration_wanted = $("#alteration_wanted").val();
            let scale_wanted = $("#scale_wanted").val();
            if(alteration_wanted == "Aucune") console.log("Réponse entrée: ", scale_wanted);
            else console.log("Réponse entrée: ", scale_wanted, alteration_wanted);
            if(scale_alteration == "Aucune") console.log("Réponse attendue: ", scale);
            else console.log("Réponse attendue: ", scale, scale_alteration);
            if(alteration_wanted == scale_alteration && scale_wanted == scale) $("#score").html(++current_score);
            break;
        case 3:
            let s = "";
            let checked = []
            for (var i = 0; i < BUTTON_COUNT; i++) {
                if($("#select_ht_"+i).prop("checked") == true) {
                    checked.push(i)
                }
            }
            s = "";
            for(var i = 0; i < checked.length; i++) {
                s += document.getElementById("select_"+checked[i]).innerHTML + ", ";
            }
            s = s.substring(0, s.length - 2);
            console.log("Réponse entrée: ", s);
            if(scale_type == "maj_") {
                var i = first_note_id;
                console.log("Réponse attendue: ",
                            document.getElementById("select_"+i).innerHTML + ", ",
                            document.getElementById("select_"+(i+2)%12).innerHTML + ", ",
                            document.getElementById("select_"+(i+4)%12).innerHTML + ", ",
                            document.getElementById("select_"+(i+5)%12).innerHTML + ", ",
                            document.getElementById("select_"+(i+7)%12).innerHTML + ", ",
                            document.getElementById("select_"+(i+9)%12).innerHTML + ", ",
                            document.getElementById("select_"+(i+11)%12).innerHTML);
                if    (checked.includes(i)
                    && checked.includes((i+2)%12)
                    && checked.includes((i+4)%12)
                    && checked.includes((i+5)%12)
                    && checked.includes((i+7)%12)
                    && checked.includes((i+9)%12)
                    && checked.includes((i+11)%12)) $("#score").html(++current_score);
            }
            else {
                var i = first_note_id;
                console.log("Réponse attendue: ",
                            document.getElementById("select_"+i).innerHTML + ", ",
                            document.getElementById("select_"+(i+2)%12).innerHTML + ", ",
                            document.getElementById("select_"+(i+3)%12).innerHTML + ", ",
                            document.getElementById("select_"+(i+5)%12).innerHTML + ", ",
                            document.getElementById("select_"+(i+7)%12).innerHTML + ", ",
                            document.getElementById("select_"+(i+8)%12).innerHTML + ", ",
                            document.getElementById("select_"+(i+10)%12).innerHTML);
                if    (checked.includes(i)
                    && checked.includes((i+2)%12)
                    && checked.includes((i+3)%12)
                    && checked.includes((i+5)%12)
                    && checked.includes((i+7)%12)
                    && checked.includes((i+8)%12)
                    && checked.includes((i+10)%12)) $("#score").html(++current_score);
            }
            break;
        case 4:

            var minor_rel = null;
            for (var i = 0; i < BUTTON_COUNT; i++) {
                if(document.getElementById("minor_rel_"+i).className.includes("checked")) {
                    minor_rel = i;
                }
            }


            let note = document.getElementById("minor_rel_"+minor_rel).innerHTML;
            console.log("Réponse entrée: ", note);

            if(other_scale_alteration == "Aucune") {
                console.log("Réponse attendue: ", other_scale);
                if(note.includes(other_scale) && !note.includes("♯") && !note.includes("♭")) $("#score").html(++current_score);
            }
            else {
                console.log("Réponse attendue: ", other_scale, other_scale_alteration);
                if(note.includes(other_scale+" "+other_scale_alteration)) $("#score").html(++current_score);
            }

            // Reset all buttons
            $(".js_bq4").removeClass("btn-secondary checked").addClass("btn-primary"); 
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

    if(time==0) {
        // We send an event to the timer, and the run_game() functions will handle it.
        document.getElementById("timer").dispatchEvent(new CustomEvent('timerEnded'));
        return;
    }
    setTimeout(function(){update_timer(time-1, n, s)}, 1000);
}

window.addEventListener("load", init);