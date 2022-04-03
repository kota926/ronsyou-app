import Axios from 'axios'

const axios = Axios.create({
    // baseURL: 'http://localhost:80',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
})

axios.defaults.withCredentials = true

export default axios