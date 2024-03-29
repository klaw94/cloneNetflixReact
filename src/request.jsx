const API_KEY = "93ae2d6adcbf6f10851921594521202a"

const requests = {
    fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
    fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
    fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
    fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
    fetchFavouriteFilm: `/discover/movie?api_key=${API_KEY}&with_genres=`,
    fetchFavouriteSeries: `/discover/tv?api_key=${API_KEY}&with_genres=`,
    fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
    fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
    fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
    fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
    searchedFilms: `/search/multi?api_key=${API_KEY}&query=`,
    myList: `https://netflixapo.fly.dev/api/v1/movie`,
    likedFilms: `https://netflixapo.fly.dev/api/v1/liked-movie`,
    favouriteGenres: `https://netflixapo.fly.dev/api/v1/favourite-genres`,
    apiKey: `${API_KEY}`,
}
 export default requests