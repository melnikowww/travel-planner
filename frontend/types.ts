export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    imgSrc: string;
    cars: Car[];
    crews: Crew[];
}

export interface Car {
    id: number;
    name: string;
}

export interface Expedition {
    id: number;
    name: string;
    description: string;
    points: Point[];
    crews: Crew[];
}

export interface Point {
    id: number;
    name: string;
    location: string;
}

export interface Crew {
    id: number;
    carId: number;
    expeditionId: number;
    driverId: number;
    members: User[];
    equipment: Equipment[];
    goods: Good[];
}

export interface Equipment {
    id: number;
    name: string;
}

export interface Good {
    id: number;
    name: string;
}