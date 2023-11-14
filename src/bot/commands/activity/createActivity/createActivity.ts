import { Command } from "@/bot/structures/Command";
import { checkIfNotAdmin } from "@/bot/utils/embed/checkIfNotAdmin";
import { description, name } from "./createActivityData.json";
import { createActivityModal } from "@/bot/modals/createActivity/createActivity";

export default new Command({
    name,
    description,

    run: async function ({ interaction }) {

        const isNotAdmin = await checkIfNotAdmin(interaction);
        if (isNotAdmin.isRight()) {
            return isNotAdmin.value.response;
        }

        return await interaction.showModal(createActivityModal)
    },
});
