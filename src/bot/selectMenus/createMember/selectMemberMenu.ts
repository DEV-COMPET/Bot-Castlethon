import { SelectMenu } from "@/bot/structures/SelectMenu";
import { customId } from "./selectMemberMenuData.json"
import { selectedUserData } from "./variables/userData";
import { createMemberModal } from "@/bot/modals/createMember/createMember";

export default new SelectMenu({
    customId: customId,

    run: async ({ interaction }) => {

        const [id, nickName, username] = interaction.values[0]
            .split(" /**separator**/")
            .map(value => value.trim());

        selectedUserData.push({ id, nickName, username })

        await interaction.showModal(createMemberModal)
    }
});
