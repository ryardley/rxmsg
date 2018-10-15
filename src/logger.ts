/* tslint:disable:no-console */
class Logger {
  public label: string;
  constructor(options: { label: string }) {
    this.label = options.label || 'no-label';
  }

  public info(...messages: Array<string | void>) {
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    messages.filter(Boolean).forEach(m => console.log(`INFO: ${m}`));
  }

  public error(...messages: Array<string | void>) {
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    messages.filter(Boolean).forEach(m => console.log(`ERROR: ${m}`));
  }
}

export default Logger;
