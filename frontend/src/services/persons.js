import axios from 'axios'

const baseUrl = "/api/persons"

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data)
}

const createPerson = (newObject) => {
    return axios.post(baseUrl, newObject).then(response => response.data)
}

const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const updatePerson = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject)
}

export default{getAll, createPerson, deletePerson, updatePerson}