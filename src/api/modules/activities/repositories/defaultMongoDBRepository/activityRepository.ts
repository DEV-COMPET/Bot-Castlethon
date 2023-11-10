import { DefaultMongoDBRepository } from ".";
import { ActivityModel, ActivityType, Activity } from "../../entities/activity.entity";
import { ActivityRepository as InterfaceActivityRepository } from "..";
import { AnswerData } from "./answerRepository";

export type ActivityData = {
  name?: string,
  description?: string,
  descriptionFileDir?: string,
  answers?: AnswerData[],
  created_at?: Date
  updated_at?: Date
};

export class ActivityMongoDBRepository extends DefaultMongoDBRepository<ActivityType> implements InterfaceActivityRepository {

  constructor(private activityModel = ActivityModel) {
    super(activityModel);
  }

  public async list(): Promise<ActivityType[]> {
    const activities = this.activityModel.find();
    const result = (await activities).map((activity) => {
      return activity.toJSON() as ActivityType;
    });
    return result;
  }

  public async getByName(name: string): Promise<ActivityType | undefined> {

    const activity = await this.activityModel.findOne({ name });
    const result = activity?.toJSON();
    return result ? result as ActivityType : undefined;
  }

  public async create(data: Activity): Promise<ActivityType | undefined> {

    const model = new this.activityModel(data._data)

    const createdData = await model.save();

    if (!createdData) {
      throw new Error("Failed to create new Data");
    }

    return createdData.toJSON<ActivityType>() as ActivityType;
  }

  public async deleteByName(nome: string): Promise<ActivityType | undefined> {
    const deletedActivity = await this.activityModel.findOne({ nome });
    if (!deletedActivity) {
      return;
    }
    await deletedActivity.deleteOne();
    return deletedActivity.toJSON<ActivityType>() as ActivityType;
  }

  public async update(nome: string, data: ActivityData): Promise<ActivityType | undefined> {
    const updatedActivity = await this.activityModel.findOneAndUpdate(
      { nome },
      data,
      { new: true }
    );
    if (!updatedActivity) {
      return;
    }
    return updatedActivity.toJSON<ActivityType>() as ActivityType;
  }
}
