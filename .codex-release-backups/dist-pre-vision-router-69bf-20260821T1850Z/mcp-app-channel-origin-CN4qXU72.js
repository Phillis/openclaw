//#region src/gateway/mcp-app-channel-origin.ts
let publishedOrigin;
/** Install the process-lifecycle snapshot used by terminal channel replies. */
function prepareMcpAppChannelOrigin(snapshot) {
	const url = new URL(snapshot.origin);
	if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new Error("MCP App channel origin must be an absolute HTTPS origin");
	const owner = Symbol("mcp-app-channel-origin");
	publishedOrigin = {
		origin: url.origin,
		reachability: snapshot.reachability,
		owner
	};
	return () => {
		if (publishedOrigin?.owner === owner) publishedOrigin = void 0;
	};
}
function getMcpAppChannelOrigin() {
	return publishedOrigin ? {
		origin: publishedOrigin.origin,
		reachability: publishedOrigin.reachability
	} : void 0;
}
//#endregion
export { prepareMcpAppChannelOrigin as n, getMcpAppChannelOrigin as t };
