import axios from 'axios'
import config from '../../config/keys'

axios.defaults.baseURL = config.api.baseURL

export default axios
