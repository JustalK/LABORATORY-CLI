/* eslint-disable no-await-in-loop */
import {Command, Flags} from '@oclif/core'
import execa = require('execa')
import {ProfileManager} from '../../configs/profiles'
const userProfiles = ProfileManager.getInstance().getProfiles()

export default class InstallWorkspaces extends Command {
  static description = 'Install the project.';

  static examples = [
    `$ kj setup:install-workspaces
`,
  ]

  static flags = {
    profiles: Flags.string({
      options: Object.keys(userProfiles),
      multiple: true,
      char: 'p',
    }),
  }

  async run(): Promise<void> {
    try {
      const {flags} = await this.parse(InstallWorkspaces)
      const profiles = flags?.profiles || Object.keys(userProfiles)
      this.log('[setup:install-workspaces] Processing install instruction for following workspaces : ' + profiles.join(','))
      for (const profile of profiles) {
        const postInstallCommands = userProfiles[profile]?.postInstall
        if (postInstallCommands) {
          for (const postInstallCommand of postInstallCommands) {
            await execa(postInstallCommand,  {shell: true, stdio: 'inherit'})
            this.log(`[setup:install-workspaces] ✅ Successfully execute install instruction : ${postInstallCommand}`)
          }
        }
      }

      this.log('[setup:install-workspaces] ✅ All install instruction have been executed.')
    } catch (error: unknown) {
      this.log('[setup:install-workspaces] ❌ Failed, installation for kj is not fulfilled')
      this.error(error as string)
    }
  }
}
