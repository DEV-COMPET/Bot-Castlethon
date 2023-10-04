export type BaseRepository<T> = {
  create(data: T): Promise<T | undefined> | T | undefined;
  list(): Promise<T[]> | T[];
};
