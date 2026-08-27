import { MeetingPlatformAdapter } from "openclaw/plugin-sdk/meeting-runtime";
//#region extensions/zoom-meetings/src/cli-output-mode.ts
const ZOOM_MEETINGS_CLI_METADATA = MeetingPlatformAdapter.createCliMetadata({
	commandName: "zoommeetings",
	description: "Join and manage Zoom meeting guests",
	id: "zoom-meetings",
	name: "Zoom meetings"
});
//#endregion
export { ZOOM_MEETINGS_CLI_METADATA as default };
