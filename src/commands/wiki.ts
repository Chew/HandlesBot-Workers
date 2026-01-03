import { type CommandConfig, CommandInteraction, CommandOption, Container, TextDisplay } from 'dressed';

interface SearchDoc {
	searchDocs: {
		title: string,
		pageTitle: string | null,
		type: number,
		sectionRef: string,
		url: string,
		content: string,
		keywords: string,
		version: string
	}[],
}

export const config = {
	description: "Searches the wiki with the provided terms",
	guilds: ["693995819841617960"],
	options: [
		CommandOption({
			name: "query",
			description: "What to search on the wiki",
			type: "String",
			required: true,
		})
	]
} satisfies CommandConfig;

export default async function wikiCommand(interaction: CommandInteraction) {
	const query = interaction.getOption("query", true).string(); // string

	const res = await interaction.deferReply({ ephemeral: false, with_response: true, flags: 1 << 15 })

	// Fetch wiki data
	const response = await fetch('https://tardis.pages.dev/search-doc.json');
	const wikiParsed: SearchDoc = await response.json();

	const results = [];
	results.push("# TARDIS Wiki Results")

	for (const item of wikiParsed.searchDocs) {
		// not a valid result
		if (!item.title.toLowerCase().includes(query.toLowerCase())) {
			continue;
		}

		if (item.type === 0) {
			results.push(
				`[${item.title}](https://tardis.pages.dev${item.url})`
			);
		} else if (item.type === 1) {
			results.push(
				`[${item.pageTitle} > ${item.title}](https://tardis.pages.dev${item.url})`
			);
		}
	}

	if (results.length === 0) {
		results.push('No results found');
	}

	results.sort();

	const resultEmbed = Container(
		TextDisplay(results.join("\n"))
	)

	// Edit original message with results
	await interaction.editReply({ components: [resultEmbed], flags: 1 << 15 });
}
