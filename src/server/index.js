import path from 'path'

import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import program from 'commander'

import { serviceRouter } from './routers'

function main (opts) {
  // Initialize app
  let app = express()

  /* --------- BEGIN Middlewares --------- */
  // Logging
  app.use(morgan('dev'))

  // Cross Origin Resource Sharing
  app.use(cors())

  // Configure static directory
  const staticDir = path.join(__dirname, '..', '..', 'public')
  app.use(express.static(staticDir))

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))

  // parse application/json
  app.use(bodyParser.json())

  // Route middlewares
  app.use('/service', serviceRouter)

  app.use('*', function (req, res) {
    res.sendFile('index.html')
  })

  /* --------- END Middlewares --------- */

  // Create HTTP server
  let port = process.env.PORT || 3000
  app.listen(port)
  console.log(`Express listening on port ${port}`)
}

if (require.main === module) {
  program
  .description('Info: Start the backend webserver')
  .usage(': babel-node --harmony server.py [options]')
  .parse(process.argv)

  main(program)
}
