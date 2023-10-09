import { ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, ModalComponentData, TextInputBuilder, TextInputComponentData } from "discord.js";

interface MakeModalRequest {
  inputFields: TextInputComponentData[],
  modalBuilderRequestData: Partial<ModalComponentData>
}

export function makeModal({ inputFields, modalBuilderRequestData }: MakeModalRequest) {
  const modal = new ModalBuilder(modalBuilderRequestData)

  const inputComponents = inputFields.map((field) => {
    const inputBuilder = new TextInputBuilder(field)

    return new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(inputBuilder);
  });

  modal.addComponents(...inputComponents);

  return modal;
}
