import { StringSelectMenuType } from "../typings/SelectMenu";

export class SelectMenu {
  constructor(commandOptions: StringSelectMenuType) {
    Object.assign(this, commandOptions);
  }
}
