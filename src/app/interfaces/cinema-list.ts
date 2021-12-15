export interface CinemaList {
    name?: string,
    movieList?: any,
    image?: string,
    distance?: string,
    address?: {
        fullAddress: string,
        street: string,
        street_2: string,
        city: string,
        country: string,
        zipCode: string,
        latitude: number,
        longitude: number,
    }
}
