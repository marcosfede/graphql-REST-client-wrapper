import React, { Component } from "react"
import "./App.css"
import gql from "graphql-tag"
import { graphql } from 'react-apollo'


const USERS_QUERY = gql`
{ planet(id: 1) { 
  name
  rotation_period
  orbital_period
  diameter
  climate
  gravity
  terrain
  surface_water
  population
  residents {
    name
  }
} }`

class App extends Component {
  render() {
    const { loading, planet } = this.props.data
    console.log(this.props.data)
    if (loading) return <div>loading...</div>
    return (
      <div>
        {Object.keys(planet).filter(el => el !== 'residents').map(prop => <p key={prop}> {prop}: {planet[prop]} </p>)}
      </div>
    )
  }
}

export default graphql(USERS_QUERY)(App)
// export default App