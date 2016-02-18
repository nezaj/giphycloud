import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import request from 'superagent'
import SoundCloudAudio from 'soundcloud-audio'

export default class Mashup extends Component {
  static propTypes = {
    tags: PropTypes.array.isRequired,
    url: PropTypes.string.isRequired
  }

  state = {
    currentImage: '',
    images: [],
    trackURL: ''
  }

  /* ----------------- Life-Cycle Methods ----------------- */
  componentDidMount () {
    // Fetch Giphys
    let public_key = 'dc6zaTOxFJmzC'
    let tags = this.cleanTags(this.props.tags)
    _.map(tags, t => {
      let url = this.buildGiphyUrl(t, public_key)
      this.fetchGiphys(url)
    })

    // Fetch Soundcloud
    let clientID = '3d6833fbab5bac6b610a01be3210800c'
    this.player = SoundCloudAudio(clientID)
    this.player.resolve(this.props.url, this.renderPlayer)

    // Begin rotating gifs
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
          style={{ 'display': 'block' }}>
        </img>
      </div>
    )
  }

  /* ------------------- Utility Methods ------------------ */

  /* Giphy expects '+' instead of spaces for tags
   * ['   dogs', 'Cute   dogs'] -> [dogs, Cute+dogs']
   */
  cleanTags (tags) {
    return _.map(tags, t => t.trim().split(' ').join('+'))
  }

  /* Builds giphy url for fetching images */
  buildGiphyUrl (query, apiKey, base = '') {
    base = base || 'https://api.giphy.com/v1/gifs/search'
    let rating = 'pg'
    return `${base}?q=${query}&api_key=${apiKey}&rating=${rating}`
  }

  fetchGiphys = (url) => {
    request.get(url).end(this.setGiphys)
  };

  /* Renders html5 audio player for soundcloud url */
  renderPlayer = (track) => {
    this.player.play()
  };

  setGiphys = (err, res) => {
    if (err) { console.log('ERROR loading from giphy!') }
    let images = _.map(res.body.data, (e) => e['images']['original']['url'])
    this.setState({ images: images.concat(this.state.images) })
  };

}
