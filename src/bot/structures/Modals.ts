import { ModalType } from "../typings/Modals";

export class Modal {
  constructor(commandOptions: ModalType) {
    Object.assign(this, commandOptions);
  }
}
