import {Command, Flags} from '@oclif/core'
import execa = require('execa')

export default class CheckRequirements extends Command {
  static description = 'Initialize the docker network';

  static examples = [
    `$ kj setup:init-network
`,
  ]

  static flags = {
    help: Flags.help({char: 'h'}),
  }

  async run(): Promise<void> {
    try {
      const rsl = await execa('docker', ['network', 'ls'])
      if (rsl.stdout.includes('local-network')) {
        this.log('[setup:docker-init-network] ✅ Docker network already exist')
      } else {
        await execa('docker', ['network', 'create', '--subnet=172.10.0.0/24', 'local-network'])
        await execa('docker', ['network', 'inspect', 'local-network'])
        this.log('[setup:docker-init-network] ✅ Docker network created')
      }
    } catch (error: unknown) {
      this.log('[setup:docker-init-network] ❌ Docker has not been created')
      this.error((error as any))
    }
  }
}
