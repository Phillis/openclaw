import { a as attachFooterText, c as normalizeLineAction } from "./send-receipt-DRkHDO5w.js";
//#region extensions/line/src/flex-templates/basic-cards.ts
/**
* Create an info card with title, body, and optional footer
*
* Editorial design: Clean hierarchy with accent bar, generous spacing,
* and subtle background zones for visual separation.
*/
function createInfoCard(title, body, footer) {
	const bubble = {
		type: "bubble",
		size: "mega",
		body: {
			type: "box",
			layout: "vertical",
			contents: [{
				type: "box",
				layout: "horizontal",
				contents: [{
					type: "box",
					layout: "vertical",
					contents: [],
					width: "4px",
					backgroundColor: "#06C755",
					cornerRadius: "2px"
				}, {
					type: "text",
					text: title,
					weight: "bold",
					size: "xl",
					color: "#111111",
					wrap: true,
					flex: 1,
					margin: "lg"
				}]
			}, {
				type: "box",
				layout: "vertical",
				contents: [{
					type: "text",
					text: body,
					size: "md",
					color: "#444444",
					wrap: true,
					lineSpacing: "6px"
				}],
				margin: "xl",
				paddingAll: "lg",
				backgroundColor: "#F8F9FA",
				cornerRadius: "lg"
			}],
			paddingAll: "xl",
			backgroundColor: "#FFFFFF"
		}
	};
	if (footer) attachFooterText(bubble, footer);
	return bubble;
}
/**
* Create a list card with title and multiple items
*
* Editorial design: Numbered/bulleted list with clear visual hierarchy,
* accent dots for each item, and generous spacing.
*/
function createListCard(title, items) {
	const itemContents = items.slice(0, 8).map((item, index) => {
		const itemContentsLocal = [{
			type: "text",
			text: item.title,
			size: "md",
			weight: "bold",
			color: "#1a1a1a",
			wrap: true
		}];
		if (item.subtitle) itemContentsLocal.push({
			type: "text",
			text: item.subtitle,
			size: "sm",
			color: "#888888",
			wrap: true,
			margin: "xs"
		});
		const itemBox = {
			type: "box",
			layout: "horizontal",
			contents: [{
				type: "box",
				layout: "vertical",
				contents: [{
					type: "box",
					layout: "vertical",
					contents: [],
					width: "8px",
					height: "8px",
					backgroundColor: index === 0 ? "#06C755" : "#DDDDDD",
					cornerRadius: "4px"
				}],
				width: "20px",
				alignItems: "center",
				paddingTop: "sm"
			}, {
				type: "box",
				layout: "vertical",
				contents: itemContentsLocal,
				flex: 1
			}],
			margin: index > 0 ? "lg" : void 0
		};
		if (item.action) itemBox.action = normalizeLineAction(item.action, 40);
		return itemBox;
	});
	return {
		type: "bubble",
		size: "mega",
		body: {
			type: "box",
			layout: "vertical",
			contents: [
				{
					type: "text",
					text: title,
					weight: "bold",
					size: "xl",
					color: "#111111",
					wrap: true
				},
				{
					type: "separator",
					margin: "lg",
					color: "#EEEEEE"
				},
				{
					type: "box",
					layout: "vertical",
					contents: itemContents,
					margin: "lg"
				}
			],
			paddingAll: "xl",
			backgroundColor: "#FFFFFF"
		}
	};
}
/**
* Create an image card with image, title, and optional body text
*/
function createImageCard(imageUrl, title, body, options) {
	const bubble = {
		type: "bubble",
		hero: {
			type: "image",
			url: imageUrl,
			size: "full",
			aspectRatio: options?.aspectRatio ?? "20:13",
			aspectMode: options?.aspectMode ?? "cover",
			action: options?.action === void 0 ? void 0 : normalizeLineAction(options.action, 40)
		},
		body: {
			type: "box",
			layout: "vertical",
			contents: [{
				type: "text",
				text: title,
				weight: "bold",
				size: "xl",
				wrap: true
			}],
			paddingAll: "lg"
		}
	};
	if (body && bubble.body) bubble.body.contents.push({
		type: "text",
		text: body,
		size: "md",
		wrap: true,
		margin: "md",
		color: "#666666"
	});
	return bubble;
}
/**
* Create an action card with title, body, and action buttons
*/
function createActionCard(title, body, actions, options) {
	const bubble = {
		type: "bubble",
		body: {
			type: "box",
			layout: "vertical",
			contents: [{
				type: "text",
				text: title,
				weight: "bold",
				size: "xl",
				wrap: true
			}, {
				type: "text",
				text: body,
				size: "md",
				wrap: true,
				margin: "md",
				color: "#666666"
			}],
			paddingAll: "lg"
		},
		footer: {
			type: "box",
			layout: "vertical",
			contents: actions.slice(0, 4).map((action, index) => ({
				type: "button",
				action: normalizeLineAction(action.action, 40),
				style: index === 0 ? "primary" : "secondary",
				margin: index > 0 ? "sm" : void 0
			})),
			paddingAll: "md"
		}
	};
	if (options?.imageUrl) bubble.hero = {
		type: "image",
		url: options.imageUrl,
		size: "full",
		aspectRatio: options.aspectRatio ?? "20:13",
		aspectMode: "cover"
	};
	return bubble;
}
//#endregion
export { createListCard as i, createImageCard as n, createInfoCard as r, createActionCard as t };
