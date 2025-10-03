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
    creator_id: number;
    starts_at: string;
    ends_at: string;
    points: Point[];
    crews: Crew[];
}

export interface Point {
    id: number;
    name: string;
    location: string;
    position: number;
}

export interface Crew {
    id: number;
    car_id: number;
    seats: number;
    expedition_id: number;
    driver_id: number;
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

export interface Message{
    id: number;
    type: MessageType;
    status: Status;
    producerId: number;
    producerName: string;
    consumerId: number;
    description: string;
    expeditionId: number;
    crewId: number;
    expeditionName: string;
}

export enum MessageType {
    CrewRequest = 'CrewRequest',
    News = 'News',
    NewExpedition = 'NewExpedition'
}

export enum Status {
    Active = "active",
    Approved = "approved",
    Rejected = "rejected",
    Empty = "empty"
}