const SCALE_TYPE_COUNT = 2;
const KEY_SIGNATURE_COUNT = 15;
const BUTTON_COUNT = 12;

let question_number = null;
let game_number = null;
let timer = null;
let game_session = 0;
let is_game_running = 0;

let scale_type;
let scale_type_text;
let other_scale_type;
let other_scale_type_text;

let alteration_count;
let alteration_type;

let scale;
let scale_alteration;
let other_scale;
let other_scale_alteration;

let first_note_id;

function init(){
    $("#navbar").removeClass("hidden");

    for (let i=1; i<=4; i++) {
        $("#button_game"+i).on("click", new_game);
    }

    $("#main_menu").removeClass("hidden");

    timer = $("#timer");

    $("#minor_rel_0").removeClass("btn-primary").addClass("btn-secondary checked");
}

function new_game() {
    // Hide all games
    $("#game_container").children().addClass("hidden");

    // Reinitialize timer/score
    timer.html(10);
    $("#score").html(0);

    // delete event listeners on last game played
    if(game_number) {
        $("#submission"+game_number).off('click', verify_answer);
        timer.off('timerEnded', verify_answer);
    }

    // Prepare new game
    $("#answer_div").removeClass("hidden");
    question_number=0;
    game_session++;

    switch(this.id) {
        case "button_game1":
            $("#game1").removeClass("hidden");
            game_number = 1;
            break;
        case "button_game2":
            $("#game2").removeClass("hidden");
            game_number = 2;
            break;
        case "button_game3":
            $("#game3").removeClass("hidden");
            game_number = 3;
            break;
        case "button_game4":
            $("#game4").removeClass("hidden");
            game_number = 4;
            $(".js_bq4").on("click", function() {
                $(".js_bq4").removeClass("btn-secondary checked").addClass("btn-primary");
                $(this).removeClass("btn-primary").addClass("btn-secondary checked");
            })
            break;
    }

    run_game()
}

function run_game() {
    $("#submission"+game_number).on('click', verify_answer);
    timer.on('timerEnded', verify_answer);
    $("#player_answer").html("");
    $("#correct_answer").html("");

    is_game_running = true;
    next_question()
}

function next_question() {
    question_number++;

    if(question_number>5) {
        terminate_game()
        return;
    }
    let question = generate_question()
    $("#question_"+game_number).html(question)

    update_timer(30, question_number, game_session);
}

function terminate_game() {
    // Game has ended, so we display main menu with the score obtained
    is_game_running = false;

    console.log("Jeu terminé");

    let score = $("#score").text();
    $("#game_container").children().addClass("hidden");
    $("#main_menu").removeClass("hidden");
    $("#obtained_score").html(score)
    $("#score_message").removeClass("hidden");

    // Updating score history if score obtained is new maximum
    let max_score_tag = $("#score_history"+game_number)
    if(score > max_score_tag.text()) {
        max_score_tag.html(score);
    }
}

function generate_question() {
    let maj_or_min = Math.floor(Math.random() * SCALE_TYPE_COUNT);
    let scale_id = Math.floor(Math.random() * KEY_SIGNATURE_COUNT);
    let expected_answer;

    expected_answer = document.getElementById("alt_"+scale_id).innerHTML.substring(0, 3); // Get note without tags

    if(maj_or_min === 1) {
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
    if(alteration_count === 0) alteration_type = "Aucune";
    else alteration_type = expected_answer.split(" ")[1]; // Get alteration type from appropriate column header unless count is 0

    scale = document.getElementById(scale_type+scale_id).innerHTML.split(" ")[0]; // Get scale root from appropriate cell
    scale_alteration = document.getElementById(scale_type+scale_id).innerHTML.split(" ")[1]; // Get scale alteration from appropriate cell
    if(scale_alteration === "mineur" || scale_alteration === "majeur") scale_alteration = "Aucune";

    other_scale = document.getElementById(other_scale_type+scale_id).innerHTML.split(" ")[0];
    other_scale_alteration = document.getElementById(other_scale_type+scale_id).innerHTML.split(" ")[1];
    if(other_scale_alteration === "mineur" || other_scale_alteration === "majeur") other_scale_alteration = "Aucune";

    // Get button associated with scale root
    if(scale_alteration === "Aucune") {
        for(let i = 0; i < BUTTON_COUNT; i++) {
            let note = document.getElementById("select_"+i).innerHTML;
            if(note.includes(scale) && !note.includes("♯") && !note.includes("♭")) {
                first_note_id = i;
            }
        }
    }
    else {
        for(let i = 0; i < BUTTON_COUNT; i++) {
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
            if(alteration_type !== "Aucune") return "Quelle est la tonalité "+scale_type_text+"e qui contient "+alteration_count+" "+alteration_type+"?";
            else return "Quelle est la tonalité "+scale_type_text+"e qui contient "+alteration_count+" altérations?";
        case 3:
            return "Quelles sont les notes de la gamme de "+document.getElementById(scale_type+scale_id).innerHTML+"?";
        case 4:
            return "Quelle est la relative "+other_scale_type_text+"e de "+document.getElementById(scale_type+scale_id).innerHTML+"?";
    }
}

function verify_answer() {
    if(!is_game_running){return;}


    let current_score_tag = $("#score");
    let current_score = current_score_tag.text();

    let player_answer = $("#player_answer");
    let correct_answer = $("#correct_answer");

    let answer_is_correct = false;
    switch(game_number) {
        case 1:
            // Compare player answer with expected answer for alteration count and (depending) alteration type
            let type_alt = $("#type_alt").val();
            let nb_alt = $("#nb_alt").val();
            if(type_alt === "Aucune") player_answer.html(nb_alt); // Do not show type of alterations if there are none
            else player_answer.html(nb_alt+" "+type_alt);
            if(alteration_type === "Aucune") correct_answer.html(alteration_count) // Do not show type of alterations if there are none
            else correct_answer.html(alteration_count+" "+alteration_type)
            if(type_alt === alteration_type && nb_alt === alteration_count){ // Increment score if answers match for both arguments
                current_score_tag.html(++current_score);
                answer_is_correct = true;
            }
            break;
        case 2:
            // Compare player answer with expected answer for scale and (depending) scale alteration
            let alteration_wanted = $("#alteration_wanted").val();
            let scale_wanted = $("#scale_wanted").val();
            if(alteration_wanted === "Aucune") player_answer.html(scale_wanted); // Do not show scale alteration if there is none
            else player_answer.html(scale_wanted+" "+alteration_wanted);
            if(scale_alteration === "Aucune") correct_answer.html(scale) // Do not show scale alteration if there is none
            else correct_answer.html(scale+" "+scale_alteration)
            if(alteration_wanted === scale_alteration && scale_wanted === scale){  // Increment score if answers match for both arguments
                current_score_tag.html(++current_score);
                answer_is_correct = true;
            }
            break;
        case 3:
            let s = ""; // String containing player answer (related to checked[])
            let checked = [] // Array containing checked buttons (related to s)
            for (let i = 0; i < BUTTON_COUNT; i++) {
                if($("#select_ht_"+i).prop("checked") === true) {
                    checked.push(i)
                }
            }
            s = "";
            for(let i = 0; i < checked.length; i++) {
                s += $("#select_"+checked[i]).text() + ", "; // Add values (notes) of each checked button to build player answer
            }
            s = s.substring(0, s.length - 2);
            player_answer.html(s)

            // Use separation intervals of a major scale to determine expected answer
            if(scale_type === "maj_") {
                let i = first_note_id;
                correct_answer.html(
                            $("#select_"+i).html() + ", "+
                            $("#select_"+(i+2)%12).html() + ", "+
                            $("#select_"+(i+4)%12).html() + ", "+
                            $("#select_"+(i+5)%12).html() + ", "+
                            $("#select_"+(i+7)%12).html() + ", "+
                            $("#select_"+(i+9)%12).html() + ", "+
                            $("#select_"+(i+11)%12).html());
                if    (checked.includes(i)
                    && checked.includes((i+2)%12)
                    && checked.includes((i+4)%12)
                    && checked.includes((i+5)%12)
                    && checked.includes((i+7)%12)
                    && checked.includes((i+9)%12)
                    && checked.includes((i+11)%12)){
                    current_score_tag.html(++current_score);
                    answer_is_correct = true;
                }
            }
            // Use separation intervals of a minor scale to determine expected answer
            else {
                let i = first_note_id;
                correct_answer.html(
                            $("#select_"+i).html() + ", "+
                            $("#select_"+(i+2)%12).html() + ", "+
                            $("#select_"+(i+3)%12).html() + ", "+
                            $("#select_"+(i+5)%12).html() + ", "+
                            $("#select_"+(i+7)%12).html() + ", "+
                            $("#select_"+(i+8)%12).html() + ", "+
                            $("#select_"+(i+10)%12).html());
                if    (checked.includes(i)
                    && checked.includes((i+2)%12)
                    && checked.includes((i+3)%12)
                    && checked.includes((i+5)%12)
                    && checked.includes((i+7)%12)
                    && checked.includes((i+8)%12)
                    && checked.includes((i+10)%12)){
                    current_score_tag.html(++current_score);
                    answer_is_correct = true;
                }
            }
            // Reset buttons to unchecked
            for (let i = 0; i < BUTTON_COUNT; i++) {
                $("#select_ht_"+i).prop("checked",false)
            }
            break;
        case 4:
            // Get id of checked button
            let minor_rel = null;
            for (let i = 0; i < BUTTON_COUNT; i++) {
                if($("#minor_rel_"+i).hasClass("checked")) {
                    minor_rel = i;
                }
            }

            // Get value (note) of checked button to build player answer
            let note = $("#minor_rel_"+minor_rel).text();
            player_answer.html(note);

            if(other_scale_alteration === "Aucune") {
                correct_answer.html(other_scale);
                if(note.includes(other_scale) && !note.includes("♯") && !note.includes("♭")){
                    current_score_tag.html(++current_score);
                    answer_is_correct = true;
                }
            }
            else {
                correct_answer.html(other_scale+" "+other_scale_alteration);
                if(note.includes(other_scale+" "+other_scale_alteration)){
                    current_score_tag.html(++current_score);
                    answer_is_correct = true;
                }
            }

            // Reset all buttons
            $(".js_bq4").removeClass("btn-secondary checked").addClass("btn-primary");
            $("#minor_rel_0").removeClass("btn-primary").addClass("btn-secondary checked");
            break;
    }

    let answer_validity = $("#answer_validity");
    let player_answer_div = $("#player_answer_div");
    let correct_answer_div = $("#correct_answer_div");

    if(answer_is_correct){
        if(answer_validity.hasClass("hidden")){
            answer_validity.removeClass("hidden");
        }
        player_answer_div.addClass("hidden");
        correct_answer_div.addClass("hidden");
    }
    else{
        if(player_answer_div.hasClass("hidden") && correct_answer_div.hasClass("hidden")){
            player_answer_div.removeClass("hidden");
            correct_answer_div.removeClass("hidden");
        }
        answer_validity.addClass("hidden");
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
        // We send an event to the timer, and the run_game() functions will handle it.
        document.getElementById("timer").dispatchEvent(new CustomEvent('timerEnded'));
        return;
    }
    setTimeout(function(){update_timer(time-1, n, s)}, 1000);
}

window.addEventListener("load", init);
