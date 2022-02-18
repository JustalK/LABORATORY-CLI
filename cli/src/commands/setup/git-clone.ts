import {Command, Flags} from '@oclif/core'
import execa = require('execa')
import {ProfileManager} from '../../configs/profiles'

const userProfiles = ProfileManager.getInstance().getProfiles()

export default class GitClone extends Command {
  static description = 'Git clone the repository';

  static examples = [
    `$ kj setup:git-clone
`,
  ]

  static flags = {
    help: Flags.help({char: 'h'}),
    profiles: Flags.string({
      options: Object.keys(userProfiles),
      multiple: true,
      char: 'p',
    }),
  }

  async run(): Promise<void> {
    try {
      const {flags} = await this.parse(GitClone)
      const profiles = flags?.profiles || Object.keys(userProfiles)

      const results = []
      for (const profile of profiles) {
        const userProfile = userProfiles[profile]
        results.push(execa('git', ['clone', userProfile.url, process.env.DEV_PATH + '/workspaces/' + userProfile.command]))
        this.log('[setup:git-clone] ✅ Repository (' + profile + ') added for download')
      }

      await Promise.all(results)
      this.log('[setup:git-clone] ✅ Repositories cloned')
    } catch (error: unknown) {
      this.log('[setup:git-clone] ❌ The repository could not be clone')
      this.error((error as any))
    }
  }
}
