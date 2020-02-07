export interface IGeometry {
  type:string;
  coordinates:number[];
}

export interface IFeatures{
  geometry:IGeometry;
  properties?:any;
  $key?:string;
}


export interface IGeoJson {
  type:'string';
  features: IFeatures[]

}


// export

// export class GeoJson implements IGeoJson{
//   type = 'Feature';
//   geometry:IGeometry;

//   constructor(coordinates, public properties?){
//     this.geometry = {
//       type:'Point',
//       coordinates: coordinates
//     }
//   }
// }

// export class FeatureCollection {
//   type = 'FeatureCollection'
//   constructor(public features:Array<GeoJson>){}
// }