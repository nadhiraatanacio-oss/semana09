import axios from 'axios'
import BuscadorPeliculas from './BuscadorPeliculas'
import { MovieDetail, OMDB_URL, NO_POSTER } from './types'

// SSR: esta página se genera en el servidor en CADA petición
export const dynamic = 'force-dynamic'

// Películas y series populares (IDs de IMDb)
const POPULARES = [
  'tt4154796', // Avengers: Endgame
  'tt1375666', // Inception
  'tt0816692', // Interstellar
  'tt15398776', // Oppenheimer
  'tt9362722', // Spider-Man: Across the Spider-Verse
  'tt0903747', // Breaking Bad
  'tt4574334', // Stranger Things
  'tt1632701', // Suits
]

async function getPopulares(): Promise<MovieDetail[]> {
  const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY
  if (!apiKey) return []

  // Se piden todas a la vez desde el servidor
  const respuestas = await Promise.allSettled(
    POPULARES.map((id) =>
      axios.get<MovieDetail>(OMDB_URL, { params: { apikey: apiKey, i: id } })
    )
  )

  // Solo se quedan las que respondieron bien
  return respuestas
    .filter((r) => r.status === 'fulfilled')
    .map((r) => (r as PromiseFulfilledResult<{ data: MovieDetail }>).value.data)
    .filter((m) => m.Response === 'True')
}

export default async function PeliculasPage() {
  const populares = await getPopulares()
  const sinApiKey = !process.env.NEXT_PUBLIC_OMDB_API_KEY

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            🎬 Galería de Películas y Series
          </h1>
          <p className="text-purple-200 mt-2">Next.js · SSR + CSR · API de OMDb</p>
        </header>

        {sinApiKey && (
          <div className="mb-8 p-4 rounded-xl bg-red-100 border-2 border-red-400 text-red-800">
            ⚠️ Falta la API key. Crea el archivo <strong>.env.local</strong> con
            NEXT_PUBLIC_OMDB_API_KEY=tu_clave y reinicia <strong>npm run dev</strong>.
          </div>
        )}

        {/* ===== SECCIÓN SSR ===== */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
            <h2 className="text-2xl font-bold text-white">Populares</h2>
            <span className="ml-2 text-xs font-semibold px-2 py-1 rounded-full bg-green-500 text-white">
              SSR
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {populares.map((m) => (
              <article
                key={m.imdbID}
                className="bg-white/10 backdrop-blur rounded-xl overflow-hidden border border-white/20 shadow-xl hover:scale-105 transition"
              >
                <img
                  src={m.Poster !== 'N/A' ? m.Poster : NO_POSTER}
                  alt={m.Title}
                  className="w-full h-72 object-cover"
                />
                <div className="p-3">
                  <h3 className="text-white font-bold leading-tight line-clamp-1">{m.Title}</h3>
                  <p className="text-purple-200 text-sm">
                    {m.Year} · {m.Type === 'series' ? 'Serie' : 'Película'}
                  </p>
                  <p className="text-yellow-300 text-sm mt-1">⭐ {m.imdbRating}</p>
                  <p className="text-gray-300 text-xs mt-1 line-clamp-1">{m.Genre}</p>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-4 text-sm text-green-200">
            ✅ Esta lista se obtiene en el servidor antes de enviar el HTML (mejor SEO y carga inicial).
          </p>
        </section>

        {/* ===== SECCIÓN CSR ===== */}
        <BuscadorPeliculas />
      </div>
    </div>
  )
}