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
  }

  async run(): Promise<void> {
    try {
      const profiles = ['server1']

      const userProfile = userProfiles[profiles[0]]
      await execa('git', ['clone', userProfile.url, process.env.DEV_PATH + '/workspaces/' + userProfile.command])
      this.log('[setup:git-clone] ✅ Repository cloned')
    } catch (error: unknown) {
      this.log('[setup:git-clone] ❌ The repository could not be clone')
      this.error((error as any))
    }
  }
}
