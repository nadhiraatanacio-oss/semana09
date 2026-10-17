// Tipos de datos que devuelve la API de OMDb

// Resultado corto que llega en una búsqueda (?s=)
export interface MovieSummary {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

// Respuesta de una búsqueda (?s=)
export interface SearchResponse {
  Search?: MovieSummary[]
  totalResults?: string
  Response: 'True' | 'False'
  Error?: string
}

// Detalle completo de una película o serie (?i=)
export interface MovieDetail {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: Array<{ Source: string; Value: string }>
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  totalSeasons?: string
  Response: 'True' | 'False'
  Error?: string
}

// URL base (con https para evitar errores de "contenido mixto")
export const OMDB_URL = 'https://www.omdbapi.com/'

// Imagen de reemplazo cuando OMDb devuelve Poster = "N/A"
export const NO_POSTER = 'https://placehold.co/300x445?text=Sin+imagen'