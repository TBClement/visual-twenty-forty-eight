// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rand::Rng;

const BOARD_SIZE: usize = 4;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    println!("{}", name);
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn player_move(input: &str, board: [[i32; BOARD_SIZE]; BOARD_SIZE], mut score: i32) -> ([[i32; BOARD_SIZE]; BOARD_SIZE], i32, bool) {
    let dir: Direction = get_direction(input);
    println!("{:#?}", dir);

    let mut board_copy = board.clone();

    match dir{
        Direction::Up =>
            for i in 0..BOARD_SIZE{
                for j in 0..BOARD_SIZE{
                    shift_board(&mut board_copy, &dir, [i, j], &mut score);
                }
            }
        Direction::Down =>
            for i in (0..BOARD_SIZE).rev(){
                for j in 0..BOARD_SIZE{
                    shift_board(&mut board_copy, &dir, [i, j], &mut score);
                }
            }
        Direction::Left =>
            for i in 0..BOARD_SIZE{
                for j in 0..BOARD_SIZE{
                    shift_board(&mut board_copy, &dir, [i, j], &mut score);
                }
            }
        Direction::Right =>
            for i in 0..BOARD_SIZE{
                for j in (0..BOARD_SIZE).rev(){
                    shift_board(&mut board_copy, &dir, [i, j], &mut score);
                }
            }
        Direction::None => {
            println!("invalid player move");
            return (board, score, false);
        }

    }

    for i in 0..BOARD_SIZE{
        for j in 0..BOARD_SIZE{
            if board[i][j] != board_copy[i][j]{
                add_number(&mut board_copy);
                return (board_copy, score, game_over(board_copy))
            }
        }
    }

    return (board, score, false);

}

fn add_number(board: &mut [[i32; BOARD_SIZE]; BOARD_SIZE]){
    let mut vec = Vec::<[usize; 2]>::new();

    for i in 0..BOARD_SIZE{
        for j in 0..BOARD_SIZE{
            if board[i][j] == 0{
                vec.push([i, j]);
            }
        }
    }

    if vec.len() == 0{
        return;
    }

    let new_num_loc = rand::thread_rng().gen_range(0..vec.len());

    board[vec[new_num_loc][0]][vec[new_num_loc][1]] = 2;
}

fn get_direction(input: &str) -> Direction{

    match input{
        "w" => Direction::Up,
        "s" => Direction::Down,
        "a" => Direction::Left,
        "d" => Direction::Right,
        _ => Direction::None
    }
}

fn shift_board(board: &mut [[i32; BOARD_SIZE]; BOARD_SIZE], dir: &Direction, starting_cell_coordinates: [usize; 2], score: &mut i32){
    let current_cell = board[starting_cell_coordinates[0]][starting_cell_coordinates[1]];
    let mut check_coords: [usize; 2] = [0,0];

    match *dir{
        Direction::Up => {
            if starting_cell_coordinates[0] == 0 {
                return;
            }
            check_coords = [starting_cell_coordinates[0] - 1, starting_cell_coordinates[1]];
        }
        Direction::Down => {
            if starting_cell_coordinates[0] == 3 {
                return;
            }
            check_coords = [starting_cell_coordinates[0] + 1, starting_cell_coordinates[1]];
        }
        Direction::Left => {
            if starting_cell_coordinates[1] == 0 {
                return;
            }
            check_coords = [starting_cell_coordinates[0], starting_cell_coordinates[1] - 1];
        }
        Direction::Right => {
            if starting_cell_coordinates[1] == 3 {
                return;
            }
            check_coords = [starting_cell_coordinates[0], starting_cell_coordinates[1] + 1];
        }
        _ => {}
    }

    //this is where we recurse
    if board[check_coords[0]][check_coords[1]] == 0{
        board[check_coords[0]][check_coords[1]] = current_cell;
        board[starting_cell_coordinates[0]][starting_cell_coordinates[1]] = 0;
        shift_board(board, dir, check_coords, score);
    }
    else if board[check_coords[0]][check_coords[1]] == current_cell {
        board[check_coords[0]][check_coords[1]] += current_cell;
        *score += current_cell * 2;
        println!("{}", score);
        board[starting_cell_coordinates[0]][starting_cell_coordinates[1]] = 0;
        return;
    }
}

fn game_over(board: [[i32; BOARD_SIZE]; BOARD_SIZE]) -> bool{
    let mut game_over: bool = true;
    for i in 0..BOARD_SIZE{
        for j in 0..BOARD_SIZE{
            if board[i][j] == 0{
                game_over = false;
                // println!("there is an empty spot");
                return game_over;
            }
            if i < BOARD_SIZE - 1 && board[i][j] == board[i + 1][j]{
                game_over = false;
                // println!("there are two values side-by-side that are the same at {}, {} and {}, {}", i, j, i+1, j);
                return game_over;
            }
            if j < BOARD_SIZE - 1 && board[i][j] == board[i][j + 1]{
                game_over = false;
                return game_over;
            }
        }
    }

    return game_over;
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, player_move])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(PartialEq, Eq)]
#[derive(Debug)]
enum Direction {
    Left,
    Right,
    Up,
    Down,
    None
}