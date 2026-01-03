import type { CommandConfig, CommandInteraction } from 'dressed';

export const config = {
	description: "Pings Handles to make sure he's okay",
	guilds: ["693995819841617960"],
} satisfies CommandConfig;

// The function name can be whatever you want
// Technically you don't even need to specify the name
export default async function pingCommand(interaction: CommandInteraction) {
  await interaction.reply("Pong!"); // This will send a simple message back to the user
}
