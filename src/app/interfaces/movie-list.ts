import { CinemaList } from "./cinema-list";

export interface MovieList {

    id?: string,
    name?: string,
    releaseDate?: string,
    genres?: any,
    note?: number,
    duration?: string,
    producerName?: string,
    synopsis?: string,
    image?: string,
    trailer?: string,
    cinemaList?: CinemaList[],
    type?: string,
}
