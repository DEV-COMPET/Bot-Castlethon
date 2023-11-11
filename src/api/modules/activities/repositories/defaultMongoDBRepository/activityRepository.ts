import { DefaultMongoDBRepository } from ".";
import { ActivityModel, ActivityType, Activity, ActivityMessage } from "../../entities/activity.entity";
import { ActivityRepository as InterfaceActivityRepository } from "..";
import { AnswerType } from "../../entities/answer.entity";

export type ActivityData = {
  name?: string,
  description?: string,
  descriptionFileDir?: string,
  chatMessagesIds?: ActivityMessage[], // ids das mensagens de envio de tarefas (para pessoas receberem tarefa)
  opened_at?: Date | null,
  closed_at?: Date | null,
  answers?: AnswerType[],
  created_at?: Date
  updated_at?: Date
};

export class ActivityMongoDBRepository extends DefaultMongoDBRepository<ActivityType> implements InterfaceActivityRepository {

  constructor(private activityModel = ActivityModel) {
    super(activityModel);
  }

  public async close(name: string): Promise<ActivityType | undefined> {
    const activity = await this.activityModel.findOne({ name });
    if (!activity) {
      return;
    }
    activity.closed_at = new Date();
    await activity.save();
    return activity.toJSON() as ActivityType;
  }

  public async open(name: string): Promise<ActivityType | undefined> {
    const activity = await this.activityModel.findOne({ name });
    if (!activity) {
      return;
    }
    activity.opened_at = new Date();
    await activity.save();
    return activity.toJSON() as ActivityType;
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