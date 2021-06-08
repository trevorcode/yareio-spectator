declare interface Spirit {
    shape:           string;
    id:              string;
    position:        Position;
    size:            number;
    final_size:      number;
    energy:          number;
    color:           string;
    color_store:     string;
    hp:              number;
    energy_capacity: number;
    player_id:       string;
    temp_size:       number;
    shout:           string;
}


declare interface Base {
    shape:           string;
    id:              string;
    position:        Position;
    size:            number;
    final_size:      number;
    energy:          number;
    color:           string;
    color_store:     string;
    hp:              number;
    energy_capacity: number;
    player_id:       string;
    temp_size:       number;
    shout:           string;
    current_spirit_cost: number;
}


declare type Position = [x: number, y: number] 
declare var render_state: (timestamp:any)=>void;

declare const living_spirits: Spirit[];
declare const bases: Base[];
declare var world_initiated: number;