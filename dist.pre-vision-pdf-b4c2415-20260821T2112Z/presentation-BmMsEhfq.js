import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { C as resolveMessagePresentationButtonAction } from "./payload-ByplrRCQ.js";
import { t as adaptMessagePresentationForChannel } from "./presentation-limits-DBZBXEoz.js";
import "./string-coerce-runtime-D9ocX9lc.js";
//#region extensions/msteams/src/presentation.ts
const MSTEAMS_PRESENTATION_CAPABILITIES = {
	supported: true,
	buttons: true,
	selects: false,
	context: true,
	divider: true,
	limits: {
		actions: {
			supportsStyles: false,
			supportsDisabled: false
		},
		text: { markdownDialect: "markdown" }
	}
};
function buildMSTeamsPresentationCard(params) {
	const body = [];
	const text = normalizeOptionalString(params.text);
	if (text) body.push({
		type: "TextBlock",
		text,
		wrap: true
	});
	const presentation = adaptMessagePresentationForChannel({
		presentation: params.presentation,
		capabilities: MSTEAMS_PRESENTATION_CAPABILITIES
	});
	if (presentation.title) body.push({
		type: "TextBlock",
		text: presentation.title,
		weight: "Bolder",
		size: "Medium",
		wrap: true
	});
	const actions = [];
	for (const block of presentation.blocks) {
		if (block.type === "text" || block.type === "context") {
			body.push({
				type: "TextBlock",
				text: block.text,
				wrap: true,
				...block.type === "context" ? {
					isSubtle: true,
					size: "Small"
				} : {}
			});
			continue;
		}
		if (block.type === "divider") {
			body.push({
				type: "TextBlock",
				text: "---",
				wrap: true,
				isSubtle: true
			});
			continue;
		}
		if (block.type === "buttons") for (const button of block.buttons) {
			const action = resolveMessagePresentationButtonAction(button);
			if (action?.type === "url" || action?.type === "web-app") {
				const url = normalizeOptionalString(action.url);
				if (!url) continue;
				actions.push({
					type: "Action.OpenUrl",
					title: button.label,
					url
				});
				continue;
			}
			if (action?.type === "command") {
				actions.push({
					type: "Action.Submit",
					title: button.label,
					data: action.command
				});
				continue;
			}
			if (action?.type === "callback") actions.push({
				type: "Action.Submit",
				title: button.label,
				data: {
					value: action.value,
					label: button.label
				}
			});
		}
	}
	return {
		type: "AdaptiveCard",
		version: "1.4",
		body,
		...actions.length ? { actions } : {}
	};
}
//#endregion
export { buildMSTeamsPresentationCard as n, MSTEAMS_PRESENTATION_CAPABILITIES as t };
