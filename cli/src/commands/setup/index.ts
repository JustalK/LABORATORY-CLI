require('dotenv').config()
import {Command} from '@oclif/core'
import CheckRequirements from './check-requirements'
import InstallWorkspaces from './install-workspaces'

export default class Setup extends Command {
  static description = 'Install development environment'

  static examples = [
    '$ kj setup',
  ]

  static flags = {}

  static args = []

  async run(): Promise<void> {
    try {
      await CheckRequirements.run()
      await InstallWorkspaces.run()
      this.log('[setup] ✅ Successfully install development environment.')
    } catch (error: unknown) {
      this.error(error as string)
    }
  }
}
