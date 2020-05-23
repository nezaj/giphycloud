/* App component
 * Top-level component for rendering the React App
 */
import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import { Router, Route, hashHistory } from 'react-router'

import Mashup from './Mashup'

export default class App extends Component {
  render () {
    return (
      <Router history={hashHistory}>
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
      <div className='container'>
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
    // We need to limit number of tags so we don't make a ton of api requests
    let tags = this.extractTags(form).slice(0, 4)
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
  <div className='form-container'>
    <p className='form-header'>
      What kind of gifs would you like to see?
    </p>
    <div className='form-subheader'>
      Enter a list of keywords seperated by commas<br/>
      (e.g "Cute animal, puppies, aww")
    </div>
    <form onSubmit={onSubmit}>
      <input className='form-input' type='text'
        defaultValue='cosmic, nature, ocean'/>
      <input className='form-submit' type='submit'/>
    </form>
  </div>
)

GiphyForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

const SoundForm = ({onSubmit}) => {
  let defaultURL = 'https://soundcloud.com/orestrama/dzeko-torres-2012-in-10-minutes'
  return (
    <div className='form-container'>
      <p className='form-header'>
        Enter a SoundCloud url
      </p>
      <form onSubmit={onSubmit}>
        <input className='form-input' type='text' defaultValue={defaultURL} />
        <input className='form-submit' type='submit'/>
      </form>
    </div>
  )
}

SoundForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
}
