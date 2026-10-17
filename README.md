# Laboratorio 09: Introducción a Next.js (CSR y SSR)

Curso: Desarrollo de Aplicaciones Web Avanzado, Tecsup
Docente: Edwin William Arévalo Sermeño
Autora: Nadhira Atanacio

Proyecto en Next.js 16 (App Router, TypeScript y Tailwind CSS) que compara los dos modelos de renderizado: Client-Side Rendering (CSR) y Server-Side Rendering (SSR).

## Páginas

| Ruta | Contenido | Renderizado |
|---|---|---|
| `/pokemon-csr` | Pokémon aleatorio (PokeAPI) | CSR |
| `/pokemon-ssr` | Pokémon aleatorio (PokeAPI) | SSR |
| `/weather` | Dashboard del clima (Open-Meteo): Lima en SSR y otras ciudades en CSR | Híbrido |
| `/peliculas` | Tarea: galería de películas y series (OMDb API) | Híbrido |

## Tarea: Galería de Películas y Series

- **Populares (SSR):** la lista se obtiene en el servidor antes de enviar la página, así carga más rápido y es mejor para SEO.
- **Búsqueda (CSR):** usa `'use client'`, `useState` y `useEffect`. Los resultados aparecen mientras escribes, sin recargar la página, y se espera 500 ms después de la última tecla para no hacer una petición por cada letra.
- **Detalle (CSR):** al elegir un título se abre una ventana modal con la información completa, en la misma página.

## Cómo ejecutarlo

Requisitos: Node.js 20.9 o superior.

1. Instala las dependencias:
```
   npm install
```
2. Crea una API key gratuita en https://www.omdbapi.com/apikey.aspx y actívala con el link que llega al correo.
3. En la raíz del proyecto crea un archivo `.env.local` con esta línea:
```
   NEXT_PUBLIC_OMDB_API_KEY=tu_clave
```
4. Inicia el servidor de desarrollo:
```
   npm run dev
```
5. Abre http://localhost:3000/peliculas (o cualquiera de las rutas de la tabla).

El archivo `.env.local` no se sube al repositorio para mantener la clave privada.

## Tecnologías

Next.js 16, React 19, TypeScript, Tailwind CSS 4 y Axios.