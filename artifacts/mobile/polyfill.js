// DOMException must be defined SYNCHRONOUSLY before the entire JS bundle runs.
// Metro injects getPolyfills() scripts before any module factory executes.
// This is the ONLY way to guarantee it runs before setUpReactNativeEnvironment.
global.DOMException = global.DOMException || class DOMException extends Error {
  constructor(message, name) {
    super(message);
    this.name = name || 'Error';
    this.code = 0;
  }
};
