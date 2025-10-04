import axios from "axios"

const AllCategories = axios.create({
    baseURL :"https://cafecoral.ir/api",
    timeout:8000,
    headers:{
        "Content-Type":"application/json"
    }
})

export default AllCategories