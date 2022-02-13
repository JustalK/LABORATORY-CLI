import {Command, Flags} from '@oclif/core'
import {CLIError} from '@oclif/errors'
import execa = require('execa')
import commandExists from 'command-exists'

export default class CheckRequirements extends Command {
  static description = 'Check utility platform requirements';

  static examples = [
    `$ kj setup:check-requirements
`,
  ]

  static flags = {
    help: Flags.help({char: 'h'}),
  }

  async run(): Promise<void> {
    try {
      if (!process.env.DEV_PATH) {
        throw new CLIError('[setup:check-requirements] ❌ Missing DEV_PATH env variable')
      }

      const dockerExist = await commandExists('docker')
      if (dockerExist) {
        const gitResponse = await execa('git', ['--version']);
        (gitResponse && gitResponse.stdout) ? this.log('[setup:check-requirements] ✅  ' + gitResponse.stdout) : this.log('[setup:check-requirements] ❌ git is not installed')

        const npmResponse = await execa('npm', ['-v']);
        (npmResponse && npmResponse.stdout) ? this.log('[setup:check-requirements] ✅ npm version', npmResponse.stdout) : this.log('[setup:check-requirements] ❌ npm is not installed')

        const yarnResponse = await execa('yarn', ['-v']);
        (yarnResponse && yarnResponse.stdout) ? this.log('[setup:check-requirements] ✅ yarn version', yarnResponse.stdout) : this.log('[setup:check-requirements] ❌ yarn is not installed')

        const nodeResponse = await execa('node', ['-v']);
        (nodeResponse && nodeResponse.stdout) ? this.log('[setup:check-requirements] ✅ node version', nodeResponse.stdout) : this.log('[setup:check-requirements] ❌ node is not installed')
      } else {
        this.error('[setup:check-requirements] ❌ Failed, requirement for kj is not fulfilled')
      }
    } catch (error: unknown) {
      this.log('[setup:check-requirements] ❌ Failed, requirement for kj is not fulfilled')
      this.error(error as string)
    }
  }
}
