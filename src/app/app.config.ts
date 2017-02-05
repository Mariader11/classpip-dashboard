'use strict';

export class AppConfig {

  // Localstorage
  public static get LS_USER(): string { return 'currentUser'; }
  public static get LS_ROLE(): string { return 'currentRole'; }

  // i18n configuration
  public static get LANG(): string { return 'es'; }
  public static get LANG_PATH(): string { return '/assets/i18n'; }
  public static get LANG_EXT(): string { return '.json'; }

  // urls
  public static get PATH_HOME(): string { return ''; }
  public static get PATH_LOGIN(): string { return 'login'; }
  public static get PATH_STUDENTS(): string { return 'students'; }
}
