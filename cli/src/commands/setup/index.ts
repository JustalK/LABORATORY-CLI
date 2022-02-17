require('dotenv').config()
import {Command} from '@oclif/core'
// import CheckRequirements from './check-requirements'
// import InitNetwork from './init-network'
// import InstallWorkspaces from './install-workspaces'
import GitClone from './git-clone'

export default class Setup extends Command {
  static description = 'Install development environment'

  static examples = [
    '$ kj setup',
  ]

  static flags = {}

  static args = []

  async run(): Promise<void> {
    try {
      await GitClone.run()
      /**
      await CheckRequirements.run()
      await InitNetwork.run()
      await InstallWorkspaces.run()
      **/
      this.log('[setup] ✅ Successfully install development environment.')
    } catch (error: unknown) {
      this.error(error as string)
    }
  }
}
