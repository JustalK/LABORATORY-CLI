import * as execa from 'execa'

require('dotenv').config()
import {Command} from '@oclif/core'

export default class Run extends Command {
  static description = 'Run a project'

  static examples = [
    '$ kj run -p server1',
  ]

  static flags = {}

  async run(): Promise<void> {
    const profiles = ['server1']
    this.log(`[run] 🌀  Lifting following profiles: ${profiles.join(', ')}`)

    const filePath = `${process.env.DEV_PATH}/infrastructure/docker-compose.yml`

    // eslint-disable-next-line no-await-in-loop
    await execa('docker-compose', [`-f ${filePath}`, 'up -d', `${[...executionList[key]].join(' ')}`],  {shell: true, stdio: 'inherit'})
    .then(() => {
      this.log('[run] ✅  Successfully launch')
    })
    .catch(error => {
      if (error.exitCode === 1) {
        this.log('[run] ✅  Successfully launch')
      } else if (error.exitCode === 255) {
        this.log('[run] ❌  Docker internal problem - not available or wrongly configured')
      } else {
        this.log('[run] ❌  Something goes wrong when running profiles')
        this.error(error)
      }
    })
  }
}
