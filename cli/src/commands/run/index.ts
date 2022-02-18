import 'dotenv/config'
import execa = require('execa')
import {Command, Flags} from '@oclif/core'
import {ProfileManager} from '../../configs/profiles'

const userProfiles = ProfileManager.getInstance().getProfiles()

export default class Run extends Command {
  static description = 'Run a project'

  static examples = [
    '$ kj run -p server1',
  ]

  static flags = {
    profiles: Flags.string({
      options: Object.keys(userProfiles),
      multiple: true,
      char: 'p',
    }),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Run)
    const profiles = flags?.profiles || Object.keys(userProfiles)
    this.log(`[run] 🌀 Lifting following profiles: ${profiles.join(', ')}`)

    const results = []
    for (const profile of profiles) {
      const userProfile = userProfiles[profile]

      const executionList: any = {
        proxy: new Set<string>(),
        backend: new Set<string>(),
      }

      for (const infrastructure of Object.keys(executionList)) {
        for (const container of userProfile.docker[infrastructure]) {
          executionList[infrastructure].add(container)
        }
      }

      this.log(executionList)

      for (const key of Object.keys(executionList)) {
        const filePath = `${process.env.DEV_PATH}/infrastructure/${key}/docker-compose.yml`
        this.log(filePath)
        results.push(execa('docker-compose', [`-f ${filePath}`, 'up -d --build', `${[...executionList[key]].join(' ')}`],  {shell: true, stdio: 'inherit'}).then(() => {
          this.log('[run] ✅ The docker (' + key + ') has been launched')
        }).catch((error: unknown) => {
          if ((error as any).exitCode === 1) {
            this.log('[run] ✅ Successfully launch')
          } else if ((error as any).exitCode === 255) {
            this.log('[run] ❌ Docker internal problem - not available or wrongly configured')
          } else {
            this.log('[run] ❌ Something goes wrong when running profiles')
            this.error((error as any))
          }
        }))
      }
    }

    await Promise.all(results)
    this.log('[run] ✅ All projects has been launched')
  }
}
