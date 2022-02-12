import {Command} from '@oclif/core'
import CheckRequirements from './check-requirements'

export default class Setup extends Command {
  static description = 'Install development environment'

  static examples = [
    '$ kj setup',
  ]

  static flags = {}

  static args = []

  async run() {
    try {
      await CheckRequirements.run([])
      this.log('[setup] ✅  Successfully install development environment.')
    } catch (error: unknown) {
      this.error(error as string)
    }
  }
}
