const { invoke } = window.__TAURI__.tauri;

let greetInputEl;
let greetMsgEl;
let moveInputEl;
var front_board = [[0, 2, 0, 0], [0, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
var score = 0;

function restart_game(){
  console.log("restarting game");
  front_board = [[0, 2, 0, 0], [0, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
  score = 0
  let restart_display = document.getElementById("game_over");
  if(restart_display!=null){
    restart_display.remove();
  }
  display_table(front_board);

}

async function player_move(event) {
  let rust_board;
  let rust_score;
  let game_over = false;

  debugger
  [rust_board, rust_score, game_over] = await invoke("player_move", { input: event.key, board: front_board, score: score});

  front_board = rust_board;
  score = rust_score;

  debugger
  display_table(rust_board);

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
  game_over_div.id = "game_over";

  let restart_button = document.createElement("button");
  restart_button.innerHTML = "Restart";
  restart_button.onClick="restart_game()";
  restart_button.addEventListener("click", () => {
    restart_game();
  }
  )

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


restart_game();
