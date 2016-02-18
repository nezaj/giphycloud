/* App component
 * Top-level component for rendering the React App
 */
import _ from 'lodash'
import React, { Component } from 'react'
import request from 'superagent'
import SoundCloudAudio from 'soundcloud-audio'

function buildGiphy (query, apiKey, base = '') {
  base = base || 'http://api.giphy.com/v1/gifs/search'
  let rating = 'pg'
  return `${base}?q=${query}&api_key=${apiKey}&rating=${rating}`
}

export default class App extends Component {
  /* --------- Life-Cycle methods --------- */
  render () {
    return (
      <div>
        <Mashup />
      </div>
    )
  }
}

class Mashup extends Component {
  state = {
    currentImage: '',
    images: [],
    trackURL: ''
  }

  /* ----------------- Life-Cycle Methods ----------------- */
  componentDidMount () {
    // Load Giphy
    let giphyQuery = 'anime' // TODO: Make this a prop
    let public_key = 'dc6zaTOxFJmzC'
    let giphyURL = buildGiphy(giphyQuery, public_key)
    this.setGiphys(giphyURL)

    // Load Soundcloud
    let clientID = '3d6833fbab5bac6b610a01be3210800c'
    this.player = SoundCloudAudio(clientID)
    let soundURL = 'https://soundcloud.com/gryffinofficial/tove-lo-talking-body-gryffin-remix' // TODO: Make this a prop
    this.player.resolve(soundURL, this.renderPlayer)

    // Start giphy rotations
    this.imageInterval = setInterval(() => {
      if (!this.state.images) { return }
      let idx = _.random(0, this.state.images.length - 1)
      this.setState({
        currentImage: this.state.images[idx]
      })
    }, 1500)
  }

  componentWillUnmount () {
    clearInterval(this.imageInterval)
    this.player.stop()
  }

  render () {

    return (
      <div>
        <img src={this.state.currentImage}
          width='100%'
          style={{ 'display': 'block' }}></img>
      </div>
    )
  }

  /* ------------------- Utility Methods ------------------ */
  renderPlayer = (track) => {
    this.player.play()
  }

  setGiphys = (url) => {
    request
      .get(url)
      .end((err, res) => {
        if (err) { console.log('ERROR loading from giphy!') }
        let images = _.map(res.body.data, (e) => {
          return e['images']['original']['url']
        })
        this.setState({ images })
      })
  };

}
