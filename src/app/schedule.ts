export interface Schedule {
    title: string;
    subtitle:string;
    days: Day[]
    hours: Hour[]
    links: Link[];
}

export interface Link {
    url: string;
    name: string;
}

export interface Hour {
    start: string;
    stop: string;
}

export interface Box {
    text: string;
    link: string;
}
export interface Day {
    day: string;
    boxes: Box[]
}
