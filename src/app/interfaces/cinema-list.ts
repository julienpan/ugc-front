import { AddressForm } from "./address-form";
import { MovieList } from "./movie-list";

export interface CinemaList {
    name?: string,
    movieList?: MovieList[],
    image?: string,
    distance?: string,
    address?: AddressForm
}
