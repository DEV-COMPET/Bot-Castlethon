// Command Interaction
import { Command } from "@/bot/structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { description, name } from "./createTeamData.json";
import { createTeamModal } from "@/bot/modals/createTeam/createTeam";

export default new Command({
    name,
    description,
    run: async function ({ interaction }) {

        const isNotAdmin = await checkIfNotAdmin(interaction);
        if (isNotAdmin.isRight()) {
            return isNotAdmin.value.response;
        }

        await interaction.showModal(createTeamModal)
    },
});
