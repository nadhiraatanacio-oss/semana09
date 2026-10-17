'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { MovieDetail, OMDB_URL, NO_POSTER } from './types'

interface Props {
  imdbID: string
  onClose: () => void
}

export default function DetalleModal({ imdbID, onClose }: Props) {
  const [detalle, setDetalle] = useState<MovieDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Pide el detalle completo cuando cambia el ID seleccionado
  useEffect(() => {
    const fetchDetalle = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await axios.get<MovieDetail>(OMDB_URL, {
          params: {
            apikey: process.env.NEXT_PUBLIC_OMDB_API_KEY,
            i: imdbID,
            plot: 'full',
          },
        })
        if (response.data.Response === 'True') {
          setDetalle(response.data)
        } else {
          setError(response.data.Error || 'No se pudo cargar el detalle.')
        }
      } catch {
        setError('Error al conectar con OMDb.')
      } finally {
        setLoading(false)
      }
    }
    fetchDetalle()
  }, [imdbID])

  // Cerrar con la tecla Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-gray-200 hover:bg-red-500 hover:text-white text-gray-700 text-xl font-bold transition cursor-pointer"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {loading && (
          <div className="py-24 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando detalle...</p>
          </div>
        )}

        {!loading && error && <p className="py-24 text-center text-red-600 font-semibold">{error}</p>}

        {!loading && detalle && (
          <div className="md:flex">
            <img
              src={detalle.Poster !== 'N/A' ? detalle.Poster : NO_POSTER}
              alt={detalle.Title}
                          className="w-full md:w-80 object-cover md:rounded-l-2xl"
              onError={(e) => {
                if (e.currentTarget.src !== NO_POSTER) e.currentTarget.src = NO_POSTER
              }}
            />
            <div className="p-6 flex-1">
              <h2 className="text-3xl font-extrabold text-gray-900 pr-10">{detalle.Title}</h2>
              <p className="text-gray-500 mt-1">
                {detalle.Year} · {detalle.Rated} · {detalle.Runtime}
                {detalle.totalSeasons && ` · ${detalle.totalSeasons} temporadas`}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                {detalle.Genre.split(', ').map((g) => (
                  <span key={g} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                    {g}
                  </span>
                ))}
              </div>

              <p className="text-gray-700 mt-4 leading-relaxed">{detalle.Plot}</p>

              <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div><dt className="font-bold text-gray-800">Director</dt><dd className="text-gray-600">{detalle.Director}</dd></div>
                <div><dt className="font-bold text-gray-800">Guion</dt><dd className="text-gray-600">{detalle.Writer}</dd></div>
                <div><dt className="font-bold text-gray-800">Actores</dt><dd className="text-gray-600">{detalle.Actors}</dd></div>
                <div><dt className="font-bold text-gray-800">Estreno</dt><dd className="text-gray-600">{detalle.Released}</dd></div>
                <div><dt className="font-bold text-gray-800">Idioma</dt><dd className="text-gray-600">{detalle.Language}</dd></div>
                <div><dt className="font-bold text-gray-800">País</dt><dd className="text-gray-600">{detalle.Country}</dd></div>
                <div className="sm:col-span-2"><dt className="font-bold text-gray-800">Premios</dt><dd className="text-gray-600">{detalle.Awards}</dd></div>
              </dl>

              <div className="flex flex-wrap gap-3 mt-5">
                {detalle.Ratings.map((r) => (
                  <div key={r.Source} className="px-3 py-2 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                    <p className="text-xs text-gray-500">{r.Source}</p>
                    <p className="font-bold text-gray-800">{r.Value}</p>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-xs text-blue-700 bg-blue-50 border-2 border-blue-200 rounded-lg p-2">
                🔄 Detalle cargado en el navegador (CSR) sin salir de la página.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}