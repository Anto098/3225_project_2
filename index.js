var question_number = null;
var game_number = null;
var timer = null;
var game_session = 0;
var is_game_running = 0;
var scale_type;
var other_scale_type;
var scale_type_text;
var alteration_amount;
var alteration_type;
var scale;
var other_scale;
var scale_alteration;
var other_scale_alteration;
var first_note_number;

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
    var major_or_minor = Math.floor(Math.random() * 2);
    var scale_number = Math.floor(Math.random() * 15);
    var expected_answer;

    expected_answer = document.getElementById("alt_"+scale_number);

    if(major_or_minor === 1) {
        scale_type = "maj_";
        other_scale_type = "min_";
    }
    else {
        scale_type = "min_";
        other_scale_type = "maj_";
    }
    scale_type_text = document.getElementById(scale_type)[1].split(" ");

    alteration_amount = expected_answer[0].split(" ");
    if(alteration_amount === 0) alteration_type = "Aucune";
    else alteration_type = expected_answer[1].split(" ");

    scale = document.getElementById(scale_type+scale_number)[0].split(" ");
    scale_alteration = document.getElementById(scale_type+scale_number)[1].split(" ");
    if(scale_alteration === "mineur" || scale_alteration === "majeur") scale_alteration = "Aucune";

    other_scale = document.getElementById(other_scale_type+scale_number)[0].split(" ");
    other_scale_alteration = document.getElementById(other_scale_type+scale_number)[1].split(" ");
    if(other_scale_alteration === "mineur" || other_scale_alteration === "majeur") other_scale_alteration = "Aucune";

    if(scale_alteration === "Aucune") {
        for(let i = 0; i < 12; i++) {
            var note = document.getElementById("select_ht_"+i);
            if(note.includes(scale) && !note.includes("♯") && !note.includes("♭")) {
                first_note_number = i;
            }
        }
    }
    else {
        for(let i = 0; i < 12; i++) {
            var note = document.getElementById("select_ht_"+i);
            if(note.includes(scale+" "+scale_alteration)) {
                first_note_number = i;
            }
        }
    }

    switch(game_number) {
        case 1:
            return "Quelle sont les altérations de la gamme de "+document.getElementById(scale_type+scale_number)+" et combien y en a-t-il?";   // A remplacer par les vraies questions
        case 2:
            return "Quelle est la tonalité "+scale_type_text+"e qui contient "+alteration_amount+" "+alteration_type+"?";
        case 3:
            return "Quelles sont les notes de la gamme de "+document.getElementById(scale_type+scale_number)+"?";
        case 4:
            return "Quelle est la relative de "+document.getElementById(scale_type+scale_number)+"?";
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
            if(type_alt === alteration_type && nb_alt === alteration_amount) score.html(++current_score);
            break;
        case 2:
            let alteration_wanted = $("#alteration_wanted").val();
            let scale_wanted = $("#scale_wanted").val();
            console.log(alteration_wanted,scale_wanted);
            if(alteration_wanted === scale_alteration && scale_wanted === scale) score.html(++current_score);
            break;
        case 3:
            let checked = []
            for (let i=0;i<12;i++) {
                if($("#select_ht_"+i).prop("checked")===true) {
                    checked.push(i)
                }
            }
            console.log(checked)
            if(scale_type === "maj_") {
                var i = first_note_number;
                if    (checked.includes(i)
                    && checked.includes((i+2)%12)
                    && checked.includes((i+4)%12)
                    && checked.includes((i+5)%12)
                    && checked.includes((i+7)%12)
                    && checked.includes((i+9)%12)
                    && checked.includes((i+11)%12)) score.html(++current_score);
            }
            else {
                var i = first_note_number;
                if    (checked.includes(i)
                    && checked.includes((i+2)%12)
                    && checked.includes((i+3)%12)
                    && checked.includes((i+5)%12)
                    && checked.includes((i+7)%12)
                    && checked.includes((i+8)%12)
                    && checked.includes((i+10)%12)) score.html(++current_score);
            }
            break;
        case 4:
            $(".js_bq4").removeClass("btn-secondary checked").addClass("btn-primary")       // Resets all buttons when an answer is submitted for game number 4

            var minor_rel = null;
            for (let i=0;i<12;i++) {
                if($("#minor_rel_"+i).hasClass("checked")) {
                    minor_rel = i;
                }
            }

            console.log(minor_rel)

            if(other_scale_alteration === "Aucune") {
                var note = document.getElementById("minor_rel_"+minor_rel);
                if(note.includes(other_scale) && !note.includes("♯") && !note.includes("♭")) score.html(++current_score);
            }
            else {
                var note = document.getElementById("minor_rel_"+minor_rel);
                if(note.includes(other_scale+" "+other_scale_alteration)) score.html(++current_score);
            }
            if(document.getElementById("minor_rel_"+minor_rel).includes())
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