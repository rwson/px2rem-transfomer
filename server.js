import { spawn } from 'child_process';
import WebpackDevServer from 'webpack-dev-server'
import webpack from 'webpack'
import config from './webpack.config.babel'

const PROT = process.env.PROT || 8080

config.entry.unshift(`webpack-dev-server/client?http://localhost:${PROT}/`)

const compiler = webpack(config)
const server = new WebpackDevServer(compiler, {
    noInfo: true,
    stats: { colors: true }
})

server.listen(PROT, "localhost", (error) => {
    if (error) return console.error(error)

    spawn('electron', '-r babel-register electron.js'.split(' '))
        .on('close', (code) => process.exit(code))
        .on('error', (error) => console.error(error))
})
