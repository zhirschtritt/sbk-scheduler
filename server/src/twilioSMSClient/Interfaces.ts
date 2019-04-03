export interface MinimalLogger {
  info(ctx: any, message: string): void;
  info(message: string): void;
  debug(ctx: any, message: string): void;
  debug(message: string): void;
  error(ctx: any, message: string): void;
  error(message: string): void;
}
