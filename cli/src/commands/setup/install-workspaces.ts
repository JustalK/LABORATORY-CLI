/* eslint-disable no-await-in-loop */
import {Command} from '@oclif/core'
import {CLIError} from '@oclif/errors'
import execa = require('execa')
import commandExists from 'command-exists'
import {ProfileManager} from '../../configs/profiles'

export default class InstallWorkspaces extends Command {
  static description = 'Install the project.';

  static examples = [
    `$ kj setup:install-workspaces
`,
  ]

  static flags = {}

  async run(): Promise<void> {
    const userProfiles = ProfileManager.getInstance().getProfiles()
    const npmExist = await commandExists('npm')
    if (!npmExist) {
      throw new CLIError('[setup:install-workspaces] ❌ Npm is not installed')
    }

    try {
      const profiles = ['server1']
      this.log('[setup:install-workspaces] Processing install instruction for following workspaces : ' + profiles.join(','))
      for (const key of profiles) {
        const postInstallCommands = userProfiles[key]?.postInstall
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
