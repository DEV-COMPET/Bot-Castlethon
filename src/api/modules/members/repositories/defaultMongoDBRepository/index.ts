import { Model } from "mongoose";
import { Repository } from "..";
export abstract class DefaultMongoDBRepository<T> extends Repository<T> {
  constructor(private model: Model<T>) {
    super();
  }
}
