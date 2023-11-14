import { Command } from "@/bot/structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { description, name } from "./recieveActivitiesAnswersData.json";
import { editErrorReply } from "@/bot/utils/discord/editErrorReply";
import { listAvailableActivities } from "./utils/listAvailableActivities";
import { createListAvailableActivitiesMenu } from "./utils/createListAvailableActivitiesMenu";
import { makeStringSelectMenuComponent } from "@/bot/utils/modal/makeSelectMenu";

export default new Command({
    name,
    description,

    run: async function ({ interaction }) {

        await interaction.deferReply({ ephemeral: true });

        const isNotAdmin = await checkIfNotAdmin(interaction);
        if (isNotAdmin.isRight()) {
            return isNotAdmin.value.response;
        }

        const listAvailableActivitiesResponse = await listAvailableActivities();
        if (listAvailableActivitiesResponse.isLeft())
            return await editErrorReply({
                error: listAvailableActivitiesResponse.value.error,
                interaction, title: "Erro ao pegar as atividades."
            })

        const listAvailableActivitiesMenu = await createListAvailableActivitiesMenu({ activitieNames: listAvailableActivitiesResponse.value.availableActivities });

        return await interaction.editReply({
            content: "Selecione a atividade:",
            components: [await makeStringSelectMenuComponent(listAvailableActivitiesMenu)],
        });
    },
});
