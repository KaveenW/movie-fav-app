import axios from "axios";

const API_KEY = "abf8a45a9809fdf56109dc03b2c1ab55";
const BASE_URL = "https://api.themoviedb.org/3";

export const searchMovies = async (query: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/search/movie`, {
            params: {
                api_key: API_KEY,
                query,
            },
        });
        return response.data.results;
    }
    catch (error) {
        console.error("Error fetching movies:", error);
        return [];
    }
}