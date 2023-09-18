const { invoke } = window.__TAURI__.tauri;

let greetInputEl;
let greetMsgEl;
let moveInputEl;
var front_board = [[0, 2, 0, 0], [0, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
var score = 0;


// async function greet() {
//   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
//   greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
// }

// window.addEventListener("DOMContentLoaded", () => {
//   greetInputEl = document.querySelector("#greet-input");
//   greetMsgEl = document.querySelector("#greet-msg");
//   document.querySelector("#greet-form").addEventListener("submit", (e) => {
//     e.preventDefault();
//     greet();
//   });
// });

function restart_game(){
  console.log("restarting game");
  front_board = [[0, 2, 0, 0], [0, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
  score = 0
}

async function player_move(event) {
  let rust_board;
  let rust_score;
  let game_over = false;
  // console.log(event.key)
  debugger
  [rust_board, rust_score, game_over] = await invoke("player_move", { input: event.key, board: front_board, score: score});
  // console.log(rust_board);
  // console.log(rust_score);
  front_board = rust_board;
  score = rust_score;
  // console.log(score);
  debugger
  display_table(rust_board);
  // console.log(game_over);
  if (game_over){
    display_game_over();
  }
}
window.addEventListener("keydown", (event) => {
  player_move(event);
})

function display_game_over(){
  let game_over_div = document.createElement("div");
  game_over_div.className = "game_over";

  let restart_button = document.createElement("button");
  restart_button.innerHTML = "Restart";
  restart_button.onclick="restart_game()";

  let game_over = document.createElement("h1");
  game_over.innerHTML = "GAME OVER!";

  game_over_div.appendChild(game_over);
  game_over_div.appendChild(restart_button);

  let container = document.getElementById("container");
  container.appendChild(game_over_div);
}

function display_table(table_values){
  let table_div = document.getElementById("table_div");
  let table = document.getElementById("board_table");
  if(table!=null){
    table.remove();
  }

  table = table_div.appendChild(document.createElement("table"));
  table.id = "board_table";

  for(let i=0; i<=3; i++){
    let row = table.insertRow();
    for(let j=0; j<=3; j++){
      let cell = row.insertCell(j);
      cell.innerHTML = table_values[i][j];
      // console.log(numbers[table_values[i][j]]);
      cell.className = numbers[table_values[i][j]];
    }
  }

  let score_board = document.getElementById("score");
  score_board.innerHTML = `Score: ${score}`;

}

const numbers = {
  0: "zero",
  2: "two",
  4: "four",
  8: "eight",
  16: "sixteen",
  32: "thirty-two",
  64: "sixty-four",
  128: "one-twenty-eight",
  256: "two-fifty-six",
  512: "five-twelve",
  1024: "ten-twenty-four",
  2048: "twenty-forty-eight"
};

display_table(front_board);
// window.addEventListener("DOMContentLoaded", () => {
//   moveInputEl = document.querySelector("#player-move-input");
//   document.querySelector("#player-move-form").addEventListener("submit", (e) => {
//     e.preventDefault();
//     player_move();
//   });
// });
