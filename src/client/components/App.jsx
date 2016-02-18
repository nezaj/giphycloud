/* App component
 * Top-level component for rendering the React App
 */
import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import { Router, Route, browserHistory } from 'react-router'
import request from 'superagent'
import SoundCloudAudio from 'soundcloud-audio'

export default class App extends Component {
  render () {
    return (
      <Router history={browserHistory}>
        <Route path='/' component={Intro} />
        <Route path='/mashup' component={Mashup} />
      </Router>
    )
  }
}

class Intro extends Component {

  state = {
    tags: [],
    url: ''
  }

  /* ----------------- Life-Cycle Methods ----------------- */
  render () {
    let page = _.isEmpty(this.state.tags)
      ? <GiphyForm onSubmit={this.handleGiphySubmit} />
      : _.isEmpty(this.state.url)
        ? <SoundForm onSubmit={this.handleSoundSubmit} />
        : <Mashup tags={this.state.tags} url={this.state.url} />

    return (
      <div>
        {page}
      </div>
    )
  }

  /* ------------------- Utility Methods ------------------ */
  extractTags (form) {
    return form.children[0].value.split(',')
  }

  extractUrl (form) {
    return form.children[0].value
  }

  /* ------------------- Event Handlers ------------------- */
  handleGiphySubmit = (e) => {
    e.preventDefault()
    let form = e.target
    let tags = this.extractTags(form)
    this.setState({ tags })
  }

  handleSoundSubmit = (e) => {
    e.preventDefault()
    let form = e.target
    let url = this.extractUrl(form)
    this.setState({ url })
  }
}

const GiphyForm = ({onSubmit}) => (
  <div>
    Enter some tags:<br/>
    <form onSubmit={onSubmit}>
      <input type='text' defaultValue='Dogs'/>
      <input type='submit'/>
    </form>
  </div>
)

GiphyForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

const SoundForm = ({onSubmit}) => {
  let defaultURL = 'https://soundcloud.com/gryffinofficial/tove-lo-talking-body-gryffin-remix'
  return (
    <div>
      Enter a SoundCloud url:<br/>
      <form onSubmit={onSubmit}>
        <input type='text' defaultValue={defaultURL} />
        <input type='submit'/>
      </form>
    </div>
  )
}

SoundForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

class Mashup extends Component {
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
    // Fetch Giphy
    let public_key = 'dc6zaTOxFJmzC'
    let giphyURL = this.buildGiphy(this.props.tags, public_key)
    this.fetchGiphys(giphyURL)

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
  /* Builds giphy url for fetching images */
  buildGiphy (tags, apiKey, base = '') {
    base = base || 'http://api.giphy.com/v1/gifs/search'
    // Giphy expects '+' instead of spaces for tags
    // ['dogs', 'Cute dogs'] -> ['dogs', 'Cute+dogs']
    let query = _.map(tags, t => t.trim().split(' ').join('+'))
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
    this.setState({ images })
  };

}
