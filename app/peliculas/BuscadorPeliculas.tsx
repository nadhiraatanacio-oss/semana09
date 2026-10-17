'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import DetalleModal from './DetalleModal'
import { MovieSummary, SearchResponse, OMDB_URL, NO_POSTER } from './types'

export default function BuscadorPeliculas() {
  const [busqueda, setBusqueda] = useState('')
  const [tipo, setTipo] = useState('')
  const [anio, setAnio] = useState('')
  const [resultados, setResultados] = useState<MovieSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [seleccionado, setSeleccionado] = useState<string | null>(null)

  useEffect(() => {
    const texto = busqueda.trim()

    // OMDb necesita al menos 3 letras para buscar
    if (texto.length < 3) return

    // Espera 500 ms después de que el usuario deja de escribir (debounce)
    const timer = setTimeout(async () => {
      setLoading(true)
      setError('')
      try {
        const response = await axios.get<SearchResponse>(OMDB_URL, {
          params: {
            apikey: process.env.NEXT_PUBLIC_OMDB_API_KEY,
            s: texto,
            type: tipo || undefined,
            y: anio || undefined,
          },
        })
        if (response.data.Response === 'True' && response.data.Search) {
          setResultados(response.data.Search)
        } else {
          setResultados([])
          setError(
            response.data.Error === 'Movie not found!'
              ? 'No se encontraron resultados.'
              : response.data.Error || 'No se encontraron resultados.'
          )
        }
      } catch {
        setResultados([])
        setError('Error al conectar con OMDb. Revisa tu API key o tu conexión.')
      } finally {
        setLoading(false)
      }
    }, 500)

    // Si el usuario sigue escribiendo, se cancela la búsqueda anterior
    return () => clearTimeout(timer)
  }, [busqueda, tipo, anio])

  // Solo se muestran resultados si hay 3 letras o más
  const puedeBuscar = busqueda.trim().length >= 3

  return (
    <section>
      <div className="flex items-center gap-2 mb-5">
        <span className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></span>
        <h2 className="text-2xl font-bold text-white">Buscar</h2>
        <span className="ml-2 text-xs font-semibold px-2 py-1 rounded-full bg-blue-500 text-white">
          CSR
        </span>
      </div>

      {/* Inputs de búsqueda */}
      <div className="bg-white rounded-2xl shadow-2xl p-5 grid md:grid-cols-4 gap-3">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Escribe un título (ej. batman, friends, harry potter)..."
          className="md:col-span-2 p-3 border-2 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-purple-500"
        />
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="p-3 border-2 border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-purple-500"
        >
          <option value="">Todos</option>
          <option value="movie">Películas</option>
          <option value="series">Series</option>
        </select>
        <input
          type="number"
          value={anio}
          onChange={(e) => setAnio(e.target.value)}
          placeholder="Año (opcional)"
          className="p-3 border-2 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-purple-500"
        />
      </div>

      <p className="mt-3 text-sm text-blue-200">
        🔄 Los resultados se cargan en el navegador mientras escribes, sin recargar la página.
      </p>

      {/* Estados */}
      {puedeBuscar && loading && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-300 mx-auto"></div>
        </div>
      )}

      {puedeBuscar && !loading && error && (
        <p className="mt-6 text-center text-red-300 font-semibold">{error}</p>
      )}

      {busqueda.trim().length > 0 && !puedeBuscar && (
        <p className="mt-6 text-center text-gray-300">Escribe al menos 3 letras...</p>
      )}

      {/* Resultados */}
      {puedeBuscar && !loading && resultados.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          {resultados.map((m, i) => (
            <button
              key={`${m.imdbID}-${i}`}
              onClick={() => setSeleccionado(m.imdbID)}
              className="text-left bg-white/10 backdrop-blur rounded-xl overflow-hidden border border-white/20 shadow-lg hover:scale-105 hover:border-purple-400 transition cursor-pointer"
            >
              <img
                src={m.Poster !== 'N/A' ? m.Poster : NO_POSTER}
                alt={m.Title}
                                className="w-full h-60 object-cover"
                onError={(e) => {
                  if (e.currentTarget.src !== NO_POSTER) e.currentTarget.src = NO_POSTER
                }}
              />
              <div className="p-3">
                <h3 className="text-white font-bold text-sm line-clamp-2">{m.Title}</h3>
                <p className="text-purple-200 text-xs mt-1">
                  {m.Year} · {m.Type === 'series' ? 'Serie' : m.Type === 'movie' ? 'Película' : m.Type}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Detalle en ventana modal (misma página) */}
      {seleccionado && (
        <DetalleModal imdbID={seleccionado} onClose={() => setSeleccionado(null)} />
      )}
    </section>
  )
}