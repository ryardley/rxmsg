/* tslint:disable:no-console */
const LOG_LEVEL = ['verbose', 'error'].indexOf(
  process.env.RXMSG_LOG_LEVEL || 'error'
);

class Logger {
  public label: string;
  constructor(options: { label: string }) {
    this.label = options.label || 'no-label';
  }

  public info(...messages: Array<string | void>) {
    if (process.env.NODE_ENV !== 'test' && LOG_LEVEL < 1) {
      messages.filter(Boolean).forEach(m => console.log(`INFO: ${m}`));
    }
  }

  public error(...messages: Array<string | void>) {
    if (process.env.NODE_ENV !== 'test' && LOG_LEVEL < 2) {
      messages.filter(Boolean).forEach(m => console.log(`ERROR: ${m}`));
    }
  }
}

export default Logger;
