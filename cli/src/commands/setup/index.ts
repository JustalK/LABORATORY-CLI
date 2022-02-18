import 'dotenv/config'
import {Command, Flags} from '@oclif/core'
import InstallWorkspaces from './install-workspaces'
import CheckRequirements from './check-requirements'
import InitNetwork from './init-network'
import GitClone from './git-clone'
import {ProfileManager} from '../../configs/profiles'
const userProfiles = ProfileManager.getInstance().getProfiles()

export default class Setup extends Command {
  static description = 'Install development environment'

  static examples = [
    '$ kj setup',
  ]

  static flags = {
    profiles: Flags.string({
      options: Object.keys(userProfiles),
      multiple: true,
      char: 'p',
    }),
  }

  async catch(error: Error): Promise<void> {
    if ((error.message as string).includes('Expected')) {
      this.log('[setup] ❌ ' + error.message)
      return
    }

    throw error
  }

  async run(): Promise<void> {
    try {
      const {flags} = await this.parse(Setup)
      const profiles = ['--profiles', ...flags?.profiles || Object.keys(userProfiles)]

      await CheckRequirements.run()
      await InitNetwork.run()

      await GitClone.run(profiles)
      await InstallWorkspaces.run(profiles)

      this.log('[setup] ✅ Successfully install development environment.')
    } catch (error: unknown) {
      this.error(error as string)
    }
  }
}
