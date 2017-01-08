'use strict';

export class AppConfig {

  // Server connection
  public static get SERVER_URL(): string { return 'https://api.classpip.com'; }
  public static get LOGIN_URL(): string { return this.SERVER_URL + '/api/users/login'; }
  public static get LOGOUT_URL(): string { return this.SERVER_URL + '/api/users/logout'; }

  public static get AUTH_HEADER(): string { return 'Authorization'; }

  // Localstorage
  public static get LS_USER(): string { return 'currentUser'; }

  // i18n configuration
  public static get LANG(): string { return 'es'; }
  public static get LANG_PATH(): string { return '/assets/i18n'; }
  public static get LANG_EXT(): string { return '.json'; }

  // urls
  public static get PATH_HOME(): string { return ''; }
  public static get PATH_LOGIN(): string { return 'login'; }
  public static get PATH_STUDENTS(): string { return 'students'; }

  // Errors
  public static get LOGIN_FAILED(): string { return 'LOGIN_FAILED'; }

}
