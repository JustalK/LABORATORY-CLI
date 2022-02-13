require('dotenv').config()
import fs = require('fs')

export type Backend = 'server1';

export interface ProfileConfig {
  command: string;
  active: boolean;
  docker?: {
    backend?: Backend[]
  };
  postInstall?: string[];
}
export interface UserProfiles {
  [profile: string]: ProfileConfig;
}

export class ProfileManager {
  private static instance: ProfileManager;
  private static userProfiles: UserProfiles = {};

  public static getInstance(): ProfileManager {
    if (!ProfileManager.instance) {
      ProfileManager.instance = new ProfileManager()
    }

    this.loadProfiles()
    return ProfileManager.instance
  }

  private static loadProfiles() {
    const installDirectory = '/home/justalk/Documents/Personal/LABO/LABORATORY-CLI/cli/src/configs/profiles'
    const profiles = fs.readdirSync(installDirectory)
    for (const profileFileName of profiles) {
      if (!profileFileName.endsWith('.json')) {
        continue
      }

      const profile: ProfileConfig = require(installDirectory + '/' + profileFileName)
      if (profile && profile.active) {
        this.userProfiles[profile.command] = profile
      }
    }

    return this.userProfiles
  }

  public getProfiles(): any {
    return ProfileManager.userProfiles
  }
}

ProfileManager.getInstance()
