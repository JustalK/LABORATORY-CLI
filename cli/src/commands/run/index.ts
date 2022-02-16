
require('dotenv').config()
import execa = require('execa')
import {Command} from '@oclif/core'
import {ProfileManager} from '../../configs/profiles'

const userProfiles = ProfileManager.getInstance().getProfiles()

export default class Run extends Command {
  static description = 'Run a project'

  static examples = [
    '$ kj run -p server1',
  ]

  static flags = {}

  async run(): Promise<void> {
    const profiles = ['server1']
    this.log(`[run] 🌀  Lifting following profiles: ${profiles.join(', ')}`)

    const userProfile = userProfiles[profiles[0]]

    const executionList: any = {
      proxy: new Set<string>(),
      backend: new Set<string>(),
    }

    userProfile.docker.proxy?.forEach((container: string) => executionList.proxy.add(container))
    userProfile.docker.backend?.forEach((container: string) => executionList.backend.add(container))
    this.log(executionList)

    //await execa('docker', ['network', 'create', '--subnet=172.10.0.0/24', 'local-network'])
    for (const key of Object.keys(executionList)) {
      const filePath = `${process.env.DEV_PATH}/infrastructure/${key}/docker-compose.yml`
      this.log(filePath)
      // eslint-disable-next-line no-await-in-loop
      await execa('docker-compose', [`-f ${filePath}`, 'up -d', `${[...executionList[key]].join(' ')}`],  {shell: true, stdio: 'inherit'})
      .then(() => {
        this.log('[run] ✅ Successfully launch')
      })
      .catch((error: unknown) => {
        if ((error as any).exitCode === 1) {
          this.log('[run] ✅ Successfully launch')
        } else if ((error as any).exitCode === 255) {
          this.log('[run] ❌ Docker internal problem - not available or wrongly configured')
        } else {
          this.log('[run] ❌ Something goes wrong when running profiles')
          this.error((error as any))
        }
      })
    }
  }
}
