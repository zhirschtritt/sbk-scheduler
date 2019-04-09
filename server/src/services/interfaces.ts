export interface BaseService<T> {
  find(): Promise<T[]>;
  get(id: string): Promise<T>;
  patch(id: string, data: Partial<T>): Promise<T>;
}
