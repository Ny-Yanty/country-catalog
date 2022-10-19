import axios from "axios";

const baseURL = 'https://restcountries.com/v3.1'
const countryApi = {
    async getAllCountries() {
        return await axios.get(`${baseURL}/all`)
    },
    async getCountryByname(text) {
        return await axios.get(`${baseURL}/name/${text}`)
    }
}

export default countryApi
