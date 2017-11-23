
import { makeExecutableSchema } from 'graphql-tools'
const typeDefs = `
  type Person {
    name: String
	height: String
	mass: String
	hair_color: String
	skin_color: String
	eye_color: String
	birth_year: String
	gender: String
	homeworld: Planet
  }
  type Planet {
    name: String
	rotation_period: String
	orbital_period: String
	diameter: String
	climate: String
	gravity: String
	terrain: String
	surface_water: String
	population: String
	residents: [Person]
  }
  type Query {
    people: [Person]
    person (id: Int!): Person
    planets: [Planet]
    planet (id: Int!): Planet
  }
  schema {
    query: Query
  }
`

const endpoint = 'https://swapi.co/api/'
const toJSON = res => res.json()

const people = () => fetch(`${endpoint}people`).then(data => data.results).then(toJSON).catch(console.error)
const person = (root, { id }) => fetch(`${endpoint}people/${id}`).then(toJSON).catch(console.error)
const planets = () => fetch(`${endpoint}planets`).then(data => data.results).then(toJSON).catch(console.error)
const planet = (root, { id }) => fetch(`${endpoint}planets/${id}`).then(toJSON).catch(console.error)

const resolvers = {
  Query: {
    people,
    person,
    planets,
    planet
  },
  Planet: {
      residents: ({residents}) => residents.map(url => fetch(url).then(toJSON))
  },
  Person: {
      homeworld: ({homeworld}) => fetch(homeworld).then(toJSON)
  }
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})