import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import heroImg from './assets/hero.png';
import React from 'react'
import './App.css'
import Search from './components/Search'
import MovieCard from './components/MovieCard'
import { useDebounce } from 'react-use'

const API_BASE_URL = 'https://api.themoviedb.org/3' ;

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovielIst] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debounceSearchTerm, setDebounceSearchTerm] = useState('');


    useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm])

    const fetchMovies = async (query = '') => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const endpoint = query 
            ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
            : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

            const response = await fetch(endpoint, API_OPTIONS);

            if(!response.ok) {
                throw new Error('Failed to fetch movies');
            }

            const data = await response.json();

            console.log(data);

            if(data.Response === 'False')
            {
                setErrorMessage(data.Error || 'Failed to fetch movies');
                setMovielIst([]);
                return;
            }
            setMovielIst(data.results || []);

        } catch (error) {
            console.error('Error fetching movies: ${error}');
            setErrorMessage('Errorfetching movies. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect( () => {
        fetchMovies(debounceSearchTerm);
    }, [debounceSearchTerm])

    return (
        <main>
            <div className="pattern"/>

            <div className="wrapper">
                <header>
                    <img src= {heroImg} alt='Hero Banner' />
                    <h1>
                        Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
                    </h1>
                </header>

                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                
                <section className="all-movies">
                    <h2 className='mt-[20px]'>All Movies</h2>
            
                    {isLoading ? (
                        <p className="text-black">Loading...</p>)
                        : errorMessage ? ( 
                            <p className="text-red-500">{errorMessage}</p>
                        ): (
                            <ul>
                                {movieList.map((movie) => (
                                    //<p key={movie.id} className="text-black">{movie.title}</p>
                                    <MovieCard key={movie.id} movie={movie} />
                                ))}
                            </ul>
                        )
                     }

                </section>
            </div>

        </main>
    )

}

export default App
