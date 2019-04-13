export interface BaseService<T> {
  find(params?: any): Promise<T[]>;
  get(id: string): Promise<T>;
  patch(id: string, data: Partial<T>): Promise<T>;
}
