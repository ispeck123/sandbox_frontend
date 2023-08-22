export class ZoneCoordinates {
    coordinates!: number[][];
    color!: string;
    width!: number;
    transparency!: string; 

    constructor (coords: number[][], color: string, strokeWidth: number, transparency: string) {
        this.coordinates = coords;
        this.color = color;
        this.width = strokeWidth;
        this.transparency = transparency;
    }
}