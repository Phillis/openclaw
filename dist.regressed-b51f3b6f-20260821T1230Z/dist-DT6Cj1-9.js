import { a as __require, s as __toESM, t as __commonJSMin } from "./rolldown-runtime-DE1ahGrs.js";
import { t as require_form_data } from "./form_data-Bo2jt1G1.js";
import { t as require_json_bigint } from "./json-bigint-BGmRKqqv.js";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import fs$1, { writeFile } from "node:fs/promises";
import { compare } from "semver";
import WebSocket$1 from "ws";
import EventEmitter from "events";
//#region node_modules/zca-js/dist/Errors/ZaloApiError.js
var ZaloApiError = class extends Error {
	constructor(message, code) {
		super(message);
		this.name = "ZcaApiError";
		this.code = code || null;
	}
};
//#endregion
//#region node_modules/zca-js/dist/Errors/ZaloApiMissingImageMetadataGetter.js
var ZaloApiMissingImageMetadataGetter = class extends ZaloApiError {
	constructor() {
		super("Missing `imageMetadataGetter`. Please provide it in the Zalo object options.");
		this.name = "ZaloApiMissingImageMetadataGetter";
	}
};
//#endregion
//#region node_modules/zca-js/dist/Errors/ZaloApiLoginQRAborted.js
var import_json_bigint = /* @__PURE__ */ __toESM(require_json_bigint(), 1);
var ZaloApiLoginQRAborted = class extends ZaloApiError {
	constructor(message = "Operation aborted") {
		super(message);
		this.name = "ZaloApiLoginQRAborted";
	}
};
//#endregion
//#region node_modules/zca-js/dist/Errors/ZaloApiLoginQRDeclined.js
var ZaloApiLoginQRDeclined = class extends ZaloApiError {
	constructor(message = "Login QR request declined") {
		super(message);
		this.name = "ZaloApiLoginQRDeclined";
	}
};
//#endregion
//#region node_modules/zca-js/dist/models/AutoReply.js
var AutoReplyScope;
(function(AutoReplyScope) {
	AutoReplyScope[AutoReplyScope["Everyone"] = 0] = "Everyone";
	AutoReplyScope[AutoReplyScope["Stranger"] = 1] = "Stranger";
	AutoReplyScope[AutoReplyScope["SpecificFriends"] = 2] = "SpecificFriends";
	AutoReplyScope[AutoReplyScope["FriendsExcept"] = 3] = "FriendsExcept";
})(AutoReplyScope || (AutoReplyScope = {}));
//#endregion
//#region node_modules/zca-js/dist/models/Board.js
var BoardType;
(function(BoardType) {
	BoardType[BoardType["Note"] = 1] = "Note";
	BoardType[BoardType["PinnedMessage"] = 2] = "PinnedMessage";
	BoardType[BoardType["Poll"] = 3] = "Poll";
})(BoardType || (BoardType = {}));
//#endregion
//#region node_modules/zca-js/dist/models/Enum.js
var ThreadType;
(function(ThreadType) {
	ThreadType[ThreadType["User"] = 0] = "User";
	ThreadType[ThreadType["Group"] = 1] = "Group";
})(ThreadType || (ThreadType = {}));
var DestType;
(function(DestType) {
	DestType[DestType["Group"] = 1] = "Group";
	DestType[DestType["User"] = 3] = "User";
	DestType[DestType["Page"] = 5] = "Page";
})(DestType || (DestType = {}));
var Gender;
(function(Gender) {
	Gender[Gender["Male"] = 0] = "Male";
	Gender[Gender["Female"] = 1] = "Female";
})(Gender || (Gender = {}));
var AvatarSize;
(function(AvatarSize) {
	AvatarSize[AvatarSize["Small"] = 120] = "Small";
	AvatarSize[AvatarSize["Large"] = 240] = "Large";
})(AvatarSize || (AvatarSize = {}));
/**
* @note Bank codes list after Mitm on Mobile and Bank's supported by Zalo
* @documents https://developers.zalo.me/docs/zalo-notification-service/phu-luc/danh-sach-bin-code - docs missing bin code and short_name bank
*/
var BinBankCard;
(function(BinBankCard) {
	/**
	* NH TMCP An Bình
	*/
	BinBankCard[BinBankCard["ABBank"] = 970425] = "ABBank";
	/**
	* NH TMCP Á Châu
	*/
	BinBankCard[BinBankCard["ACB"] = 970416] = "ACB";
	/**
	* NH Nông nghiệp và Phát triển Nông thôn Việt Nam
	*/
	BinBankCard[BinBankCard["Agribank"] = 970405] = "Agribank";
	/**
	* NH TMCP Đầu tư và Phát triển Việt Nam
	*/
	BinBankCard[BinBankCard["BIDV"] = 970418] = "BIDV";
	/**
	* NH TMCP Bản Việt
	*/
	BinBankCard[BinBankCard["BVBank"] = 970454] = "BVBank";
	/**
	* NH TMCP Bắc Á
	*/
	BinBankCard[BinBankCard["BacA_Bank"] = 970409] = "BacA_Bank";
	/**
	* NH TMCP Bảo Việt
	*/
	BinBankCard[BinBankCard["BaoViet_Bank"] = 970438] = "BaoViet_Bank";
	/**
	* NH số CAKE by VPBank - TMCP Việt Nam Thịnh Vượng
	*/
	BinBankCard[BinBankCard["CAKE"] = 546034] = "CAKE";
	/**
	* NH Thương mại TNHH MTV Xây dựng Việt Nam
	*/
	BinBankCard[BinBankCard["CB_Bank"] = 970444] = "CB_Bank";
	/**
	* NH TNHH MTV CIMB Việt Nam
	*/
	BinBankCard[BinBankCard["CIMB_Bank"] = 422589] = "CIMB_Bank";
	/**
	* NH Hợp tác xã Việt Nam
	*/
	BinBankCard[BinBankCard["Coop_Bank"] = 970446] = "Coop_Bank";
	/**
	* NH TNHH MTV Phát triển Singapore - CN TP. Hồ Chí Minh
	*/
	BinBankCard[BinBankCard["DBS_Bank"] = 796500] = "DBS_Bank";
	/**
	* NH TMCP Đông Á
	*/
	BinBankCard[BinBankCard["DongA_Bank"] = 970406] = "DongA_Bank";
	/**
	* NH TMCP Xuất Nhập khẩu Việt Nam
	*/
	BinBankCard[BinBankCard["Eximbank"] = 970431] = "Eximbank";
	/**
	* NH TMCP Dầu khí Toàn cầu
	*/
	BinBankCard[BinBankCard["GPBank"] = 970408] = "GPBank";
	/**
	* NH TMCP Phát triển TP. Hồ Chí Minh
	*/
	BinBankCard[BinBankCard["HDBank"] = 970437] = "HDBank";
	/**
	* NH TNHH MTV HSBC (Việt Nam)
	*/
	BinBankCard[BinBankCard["HSBC"] = 458761] = "HSBC";
	/**
	* NH TNHH MTV Hong Leong Việt Nam
	*/
	BinBankCard[BinBankCard["HongLeong_Bank"] = 970442] = "HongLeong_Bank";
	/**
	* NH Công nghiệp Hàn Quốc - CN TP. Hồ Chí Minh
	*/
	BinBankCard[BinBankCard["IBK_HCM"] = 970456] = "IBK_HCM";
	/**
	* NH Công nghiệp Hàn Quốc - CN Hà Nội
	*/
	BinBankCard[BinBankCard["IBK_HN"] = 970455] = "IBK_HN";
	/**
	* NH TNHH Indovina
	*/
	BinBankCard[BinBankCard["Indovina_Bank"] = 970434] = "Indovina_Bank";
	/**
	* NH Đại chúng TNHH Kasikornbank - CN TP. Hồ Chí Minh
	*/
	BinBankCard[BinBankCard["KBank"] = 668888] = "KBank";
	/**
	* NH TMCP Kiên Long
	*/
	BinBankCard[BinBankCard["KienlongBank"] = 970452] = "KienlongBank";
	/**
	* NH Kookmin - CN TP. Hồ Chí Minh
	*/
	BinBankCard[BinBankCard["Kookmin_Bank_HCM"] = 970463] = "Kookmin_Bank_HCM";
	/**
	* NH Kookmin - CN Hà Nội
	*/
	BinBankCard[BinBankCard["Kookmin_Bank_HN"] = 970462] = "Kookmin_Bank_HN";
	/**
	* NH TMCP Lộc Phát Việt Nam
	*/
	BinBankCard[BinBankCard["LPBank"] = 970449] = "LPBank";
	/**
	* NH TMCP Quân đội
	*/
	BinBankCard[BinBankCard["MB_Bank"] = 970422] = "MB_Bank";
	/**
	* NH TMCP Hàng Hải
	*/
	BinBankCard[BinBankCard["MSB"] = 970426] = "MSB";
	/**
	* NH TMCP Quốc Dân
	*/
	BinBankCard[BinBankCard["NCB"] = 970419] = "NCB";
	/**
	* NH TMCP Nam Á
	*/
	BinBankCard[BinBankCard["Nam_A_Bank"] = 970428] = "Nam_A_Bank";
	/**
	* NH Nonghyup - CN Hà Nội
	*/
	BinBankCard[BinBankCard["NongHyup_Bank"] = 801011] = "NongHyup_Bank";
	/**
	* NH TMCP Phương Đông
	*/
	BinBankCard[BinBankCard["OCB"] = 970448] = "OCB";
	/**
	* NH Thương mại TNHH MTV Đại Dương
	*/
	BinBankCard[BinBankCard["Ocean_Bank"] = 970414] = "Ocean_Bank";
	/**
	* NH TMCP Thịnh vượng và Phát triển
	*/
	BinBankCard[BinBankCard["PGBank"] = 970430] = "PGBank";
	/**
	* NH TMCP Đại Chúng Việt Nam
	*/
	BinBankCard[BinBankCard["PVcomBank"] = 970412] = "PVcomBank";
	/**
	* NH TNHH MTV Public Việt Nam
	*/
	BinBankCard[BinBankCard["Public_Bank_Vietnam"] = 970439] = "Public_Bank_Vietnam";
	/**
	* NH TMCP Sài Gòn
	*/
	BinBankCard[BinBankCard["SCB"] = 970429] = "SCB";
	/**
	* NH TMCP Sài Gòn - Hà Nội
	*/
	BinBankCard[BinBankCard["SHB"] = 970443] = "SHB";
	/**
	* NH TMCP Sài Gòn Thương Tín
	*/
	BinBankCard[BinBankCard["Sacombank"] = 970403] = "Sacombank";
	/**
	* NH TMCP Sài Gòn Công Thương
	*/
	BinBankCard[BinBankCard["Saigon_Bank"] = 970400] = "Saigon_Bank";
	/**
	* NH TMCP Đông Nam Á
	*/
	BinBankCard[BinBankCard["SeABank"] = 970440] = "SeABank";
	/**
	* NH TNHH MTV Shinhan Việt Nam
	*/
	BinBankCard[BinBankCard["Shinhan_Bank"] = 970424] = "Shinhan_Bank";
	/**
	* NH TNHH MTV Standard Chartered Bank Việt Nam
	*/
	BinBankCard[BinBankCard["Standard_Chartered_Vietnam"] = 970410] = "Standard_Chartered_Vietnam";
	/**
	* NH số TNEX
	*/
	BinBankCard[BinBankCard["TNEX"] = 9704261] = "TNEX";
	/**
	* NH TMCP Tiên Phong
	*/
	BinBankCard[BinBankCard["TPBank"] = 970423] = "TPBank";
	/**
	* NH TMCP Kỹ thương Việt Nam
	*/
	BinBankCard[BinBankCard["Techcombank"] = 970407] = "Techcombank";
	/**
	* NH số Timo by Bản Việt Bank
	*/
	BinBankCard[BinBankCard["Timo"] = 963388] = "Timo";
	/**
	* NH số UBank by VPBank
	*/
	BinBankCard[BinBankCard["UBank"] = 546035] = "UBank";
	/**
	* NH United Overseas Bank Việt Nam
	*/
	BinBankCard[BinBankCard["United_Overseas_Bank_Vietnam"] = 970458] = "United_Overseas_Bank_Vietnam";
	/**
	* NH TMCP Quốc tế Việt Nam
	*/
	BinBankCard[BinBankCard["VIB"] = 970441] = "VIB";
	/**
	* NH TMCP Việt Nam Thịnh Vượng
	*/
	BinBankCard[BinBankCard["VPBank"] = 970432] = "VPBank";
	/**
	* NH Liên doanh Việt - Nga
	*/
	BinBankCard[BinBankCard["VRB"] = 970421] = "VRB";
	/**
	* NH TMCP Việt Á
	*/
	BinBankCard[BinBankCard["VietABank"] = 970427] = "VietABank";
	/**
	* NH TMCP Việt Nam Thương Tín
	*/
	BinBankCard[BinBankCard["VietBank"] = 970433] = "VietBank";
	/**
	* NH TMCP Ngoại Thương Việt Nam
	*/
	BinBankCard[BinBankCard["Vietcombank"] = 970436] = "Vietcombank";
	/**
	* NH TMCP Công thương Việt Nam
	*/
	BinBankCard[BinBankCard["VietinBank"] = 970415] = "VietinBank";
	/**
	* NH TNHH MTV Woori Việt Nam
	*/
	BinBankCard[BinBankCard["Woori_Bank"] = 970457] = "Woori_Bank";
})(BinBankCard || (BinBankCard = {}));
//#endregion
//#region node_modules/zca-js/dist/models/DeliveredMessage.js
var UserDeliveredMessage = class {
	constructor(data) {
		this.type = ThreadType.User;
		this.data = data;
		this.threadId = data.deliveredUids[0];
		this.isSelf = false;
	}
};
var GroupDeliveredMessage = class {
	constructor(uid, data) {
		this.type = ThreadType.Group;
		this.data = data;
		this.threadId = data.groupId;
		this.isSelf = data.deliveredUids.includes(uid);
	}
};
//#endregion
//#region node_modules/zca-js/dist/models/FriendEvent.js
var FriendEventType;
(function(FriendEventType) {
	FriendEventType[FriendEventType["ADD"] = 0] = "ADD";
	FriendEventType[FriendEventType["REMOVE"] = 1] = "REMOVE";
	FriendEventType[FriendEventType["REQUEST"] = 2] = "REQUEST";
	FriendEventType[FriendEventType["UNDO_REQUEST"] = 3] = "UNDO_REQUEST";
	FriendEventType[FriendEventType["REJECT_REQUEST"] = 4] = "REJECT_REQUEST";
	FriendEventType[FriendEventType["SEEN_FRIEND_REQUEST"] = 5] = "SEEN_FRIEND_REQUEST";
	FriendEventType[FriendEventType["BLOCK"] = 6] = "BLOCK";
	FriendEventType[FriendEventType["UNBLOCK"] = 7] = "UNBLOCK";
	FriendEventType[FriendEventType["BLOCK_CALL"] = 8] = "BLOCK_CALL";
	FriendEventType[FriendEventType["UNBLOCK_CALL"] = 9] = "UNBLOCK_CALL";
	FriendEventType[FriendEventType["PIN_UNPIN"] = 10] = "PIN_UNPIN";
	FriendEventType[FriendEventType["PIN_CREATE"] = 11] = "PIN_CREATE";
	FriendEventType[FriendEventType["UNKNOWN"] = 12] = "UNKNOWN";
})(FriendEventType || (FriendEventType = {}));
function initializeFriendEvent(uid, data, type) {
	if (type == FriendEventType.ADD || type == FriendEventType.REMOVE || type == FriendEventType.BLOCK || type == FriendEventType.UNBLOCK || type == FriendEventType.BLOCK_CALL || type == FriendEventType.UNBLOCK_CALL) return {
		type,
		data,
		threadId: data,
		isSelf: ![FriendEventType.ADD, FriendEventType.REMOVE].includes(type)
	};
	else if (type == FriendEventType.REJECT_REQUEST || type == FriendEventType.UNDO_REQUEST) return {
		type,
		data,
		threadId: data.toUid,
		isSelf: data.fromUid == uid
	};
	else if (type == FriendEventType.REQUEST) return {
		type,
		data,
		threadId: data.toUid,
		isSelf: data.fromUid == uid
	};
	else if (type == FriendEventType.SEEN_FRIEND_REQUEST) return {
		type,
		data,
		threadId: uid,
		isSelf: true
	};
	else if (type == FriendEventType.PIN_CREATE) return {
		type,
		data,
		threadId: data.conversationId,
		isSelf: data.actorId == uid
	};
	else if (type == FriendEventType.PIN_UNPIN) return {
		type,
		data,
		threadId: data.conversationId,
		isSelf: data.actorId == uid
	};
	else return {
		type: FriendEventType.UNKNOWN,
		data: JSON.stringify(data),
		threadId: "",
		isSelf: false
	};
}
//#endregion
//#region node_modules/zca-js/dist/models/Group.js
var GroupTopicType;
(function(GroupTopicType) {
	GroupTopicType[GroupTopicType["Note"] = 0] = "Note";
	GroupTopicType[GroupTopicType["Message"] = 2] = "Message";
	GroupTopicType[GroupTopicType["Poll"] = 3] = "Poll";
})(GroupTopicType || (GroupTopicType = {}));
var GroupType;
(function(GroupType) {
	GroupType[GroupType["Group"] = 1] = "Group";
	GroupType[GroupType["Community"] = 2] = "Community";
})(GroupType || (GroupType = {}));
//#endregion
//#region node_modules/zca-js/dist/models/GroupEvent.js
var GroupEventType;
(function(GroupEventType) {
	GroupEventType["JOIN_REQUEST"] = "join_request";
	GroupEventType["JOIN"] = "join";
	GroupEventType["LEAVE"] = "leave";
	GroupEventType["REMOVE_MEMBER"] = "remove_member";
	GroupEventType["BLOCK_MEMBER"] = "block_member";
	GroupEventType["UPDATE_SETTING"] = "update_setting";
	GroupEventType["UPDATE"] = "update";
	GroupEventType["NEW_LINK"] = "new_link";
	GroupEventType["ADD_ADMIN"] = "add_admin";
	GroupEventType["REMOVE_ADMIN"] = "remove_admin";
	GroupEventType["NEW_PIN_TOPIC"] = "new_pin_topic";
	GroupEventType["UPDATE_PIN_TOPIC"] = "update_pin_topic";
	GroupEventType["REORDER_PIN_TOPIC"] = "reorder_pin_topic";
	GroupEventType["UPDATE_BOARD"] = "update_board";
	GroupEventType["REMOVE_BOARD"] = "remove_board";
	GroupEventType["UPDATE_TOPIC"] = "update_topic";
	GroupEventType["UNPIN_TOPIC"] = "unpin_topic";
	GroupEventType["REMOVE_TOPIC"] = "remove_topic";
	GroupEventType["ACCEPT_REMIND"] = "accept_remind";
	GroupEventType["REJECT_REMIND"] = "reject_remind";
	GroupEventType["REMIND_TOPIC"] = "remind_topic";
	GroupEventType["UPDATE_AVATAR"] = "update_avatar";
	GroupEventType["UNKNOWN"] = "unknown";
})(GroupEventType || (GroupEventType = {}));
function initializeGroupEvent(uid, data, type, act) {
	var _a;
	const threadId = "group_id" in data ? data.group_id : data.groupId;
	if (type == GroupEventType.JOIN_REQUEST) return {
		type,
		act,
		data,
		threadId,
		isSelf: false
	};
	else if (type == GroupEventType.NEW_PIN_TOPIC || type == GroupEventType.UNPIN_TOPIC || type == GroupEventType.UPDATE_PIN_TOPIC) return {
		type,
		act,
		data,
		threadId,
		isSelf: data.actorId == uid
	};
	else if (type == GroupEventType.REORDER_PIN_TOPIC) return {
		type,
		act,
		data,
		threadId,
		isSelf: data.actorId == uid
	};
	else if (type == GroupEventType.UPDATE_BOARD || type == GroupEventType.REMOVE_BOARD) return {
		type,
		act,
		data,
		threadId,
		isSelf: data.sourceId == uid
	};
	else if (type == GroupEventType.ACCEPT_REMIND || type == GroupEventType.REJECT_REMIND) return {
		type,
		act,
		data,
		threadId,
		isSelf: data.updateMembers.some((memberId) => memberId == uid)
	};
	else if (type == GroupEventType.REMIND_TOPIC) return {
		type,
		act,
		data,
		threadId,
		isSelf: data.creatorId == uid
	};
	else {
		const baseData = data;
		return {
			type,
			act,
			data: baseData,
			threadId,
			isSelf: ((_a = baseData.updateMembers) === null || _a === void 0 ? void 0 : _a.some((member) => member.id == uid)) || baseData.sourceId == uid
		};
	}
}
//#endregion
//#region node_modules/zca-js/dist/models/Message.js
var UserMessage = class {
	constructor(uid, data) {
		this.type = ThreadType.User;
		this.data = data;
		this.threadId = data.uidFrom == "0" ? data.idTo : data.uidFrom;
		this.isSelf = data.uidFrom == "0";
		if (data.idTo == "0") data.idTo = uid;
		if (data.uidFrom == "0") data.uidFrom = uid;
		if (data.quote) data.quote.ownerId = String(data.quote.ownerId);
	}
};
var GroupMessage = class {
	constructor(uid, data) {
		this.type = ThreadType.Group;
		this.data = data;
		this.threadId = data.idTo;
		this.isSelf = data.uidFrom == "0";
		if (data.uidFrom == "0") data.uidFrom = uid;
		if (data.quote) data.quote.ownerId = String(data.quote.ownerId);
	}
};
//#endregion
//#region node_modules/zca-js/dist/models/Reaction.js
var Reactions;
(function(Reactions) {
	Reactions["HEART"] = "/-heart";
	Reactions["LIKE"] = "/-strong";
	Reactions["HAHA"] = ":>";
	Reactions["WOW"] = ":o";
	Reactions["CRY"] = ":-((";
	Reactions["ANGRY"] = ":-h";
	Reactions["KISS"] = ":-*";
	Reactions["TEARS_OF_JOY"] = ":')";
	Reactions["SHIT"] = "/-shit";
	Reactions["ROSE"] = "/-rose";
	Reactions["BROKEN_HEART"] = "/-break";
	Reactions["DISLIKE"] = "/-weak";
	Reactions["LOVE"] = ";xx";
	Reactions["CONFUSED"] = ";-/";
	Reactions["WINK"] = ";-)";
	Reactions["FADE"] = "/-fade";
	Reactions["SUN"] = "/-li";
	Reactions["BIRTHDAY"] = "/-bd";
	Reactions["BOMB"] = "/-bome";
	Reactions["OK"] = "/-ok";
	Reactions["PEACE"] = "/-v";
	Reactions["THANKS"] = "/-thanks";
	Reactions["PUNCH"] = "/-punch";
	Reactions["SHARE"] = "/-share";
	Reactions["PRAY"] = "_()_";
	Reactions["NO"] = "/-no";
	Reactions["BAD"] = "/-bad";
	Reactions["LOVE_YOU"] = "/-loveu";
	Reactions["SAD"] = "--b";
	Reactions["VERY_SAD"] = ":((";
	Reactions["COOL"] = "x-)";
	Reactions["NERD"] = "8-)";
	Reactions["BIG_SMILE"] = ";-d";
	Reactions["SUNGLASSES"] = "b-)";
	Reactions["NEUTRAL"] = ":--|";
	Reactions["SAD_FACE"] = "p-(";
	Reactions["BYE"] = ":-bye";
	Reactions["SLEEPY"] = "|-)";
	Reactions["WIPE"] = ":wipe";
	Reactions["DIG"] = ":-dig";
	Reactions["ANGUISH"] = "&-(";
	Reactions["HANDCLAP"] = ":handclap";
	Reactions["ANGRY_FACE"] = ">-|";
	Reactions["F_CHAIR"] = ":-f";
	Reactions["L_CHAIR"] = ":-l";
	Reactions["R_CHAIR"] = ":-r";
	Reactions["SILENT"] = ";-x";
	Reactions["SURPRISE"] = ":-o";
	Reactions["EMBARRASSED"] = ";-s";
	Reactions["AFRAID"] = ";-a";
	Reactions["SAD2"] = ":-<";
	Reactions["BIG_LAUGH"] = ":))";
	Reactions["RICH"] = "$-)";
	Reactions["BEER"] = "/-beer";
	Reactions["NONE"] = "";
})(Reactions || (Reactions = {}));
var Reaction = class {
	constructor(uid, data, isGroup) {
		this.data = data;
		this.threadId = isGroup || data.uidFrom == "0" ? data.idTo : data.uidFrom;
		this.isSelf = data.uidFrom == "0";
		this.isGroup = isGroup;
		if (data.idTo == "0") data.idTo = uid;
		if (data.uidFrom == "0") data.uidFrom = uid;
	}
};
//#endregion
//#region node_modules/zca-js/dist/models/Reminder.js
var ReminderRepeatMode;
(function(ReminderRepeatMode) {
	ReminderRepeatMode[ReminderRepeatMode["None"] = 0] = "None";
	ReminderRepeatMode[ReminderRepeatMode["Daily"] = 1] = "Daily";
	ReminderRepeatMode[ReminderRepeatMode["Weekly"] = 2] = "Weekly";
	ReminderRepeatMode[ReminderRepeatMode["Monthly"] = 3] = "Monthly";
})(ReminderRepeatMode || (ReminderRepeatMode = {}));
//#endregion
//#region node_modules/zca-js/dist/models/SeenMessage.js
var UserSeenMessage = class {
	constructor(data) {
		this.type = ThreadType.User;
		this.data = data;
		this.threadId = data.idTo;
		this.isSelf = false;
	}
};
var GroupSeenMessage = class {
	constructor(uid, data) {
		this.type = ThreadType.Group;
		this.data = data;
		this.threadId = data.groupId;
		this.isSelf = data.seenUids.includes(uid);
	}
};
//#endregion
//#region node_modules/zca-js/dist/models/Typing.js
var UserTyping = class {
	constructor(data) {
		this.type = ThreadType.User;
		this.data = data;
		this.threadId = data.uid;
		this.isSelf = false;
	}
};
var GroupTyping = class {
	constructor(data) {
		this.type = ThreadType.Group;
		this.data = data;
		this.threadId = data.gid;
		this.isSelf = false;
	}
};
//#endregion
//#region node_modules/zca-js/dist/models/Undo.js
var Undo = class {
	constructor(uid, data, isGroup) {
		this.data = data;
		this.threadId = isGroup || data.uidFrom == "0" ? data.idTo : data.uidFrom;
		this.isSelf = data.uidFrom == "0";
		this.isGroup = isGroup;
		if (data.idTo == "0") data.idTo = uid;
		if (data.uidFrom == "0") data.uidFrom = uid;
	}
};
//#endregion
//#region node_modules/zca-js/dist/models/ZBusiness.js
var BusinessCategory;
(function(BusinessCategory) {
	BusinessCategory[BusinessCategory["Other"] = 0] = "Other";
	BusinessCategory[BusinessCategory["RealEstate"] = 1] = "RealEstate";
	BusinessCategory[BusinessCategory["TechnologyAndDevices"] = 2] = "TechnologyAndDevices";
	BusinessCategory[BusinessCategory["TravelAndHospitality"] = 3] = "TravelAndHospitality";
	BusinessCategory[BusinessCategory["EducationAndTraining"] = 4] = "EducationAndTraining";
	BusinessCategory[BusinessCategory["ShoppingAndRetail"] = 5] = "ShoppingAndRetail";
	BusinessCategory[BusinessCategory["CosmeticsAndBeauty"] = 6] = "CosmeticsAndBeauty";
	BusinessCategory[BusinessCategory["RestaurantAndCafe"] = 7] = "RestaurantAndCafe";
	BusinessCategory[BusinessCategory["AutoAndMotorbike"] = 8] = "AutoAndMotorbike";
	BusinessCategory[BusinessCategory["FashionAndApparel"] = 9] = "FashionAndApparel";
	BusinessCategory[BusinessCategory["FoodAndBeverage"] = 10] = "FoodAndBeverage";
	BusinessCategory[BusinessCategory["MediaAndEntertainment"] = 11] = "MediaAndEntertainment";
	BusinessCategory[BusinessCategory["InternalCommunications"] = 12] = "InternalCommunications";
	BusinessCategory[BusinessCategory["Transportation"] = 13] = "Transportation";
	BusinessCategory[BusinessCategory["Telecommunications"] = 14] = "Telecommunications";
})(BusinessCategory || (BusinessCategory = {}));
const BusinessCategoryName = {
	[BusinessCategory.Other]: "Dịch vụ khác (Không hiển thị)",
	[BusinessCategory.RealEstate]: "Bất động sản",
	[BusinessCategory.TechnologyAndDevices]: "Công nghệ & Thiết bị",
	[BusinessCategory.TravelAndHospitality]: "Du lịch & Lưu trú",
	[BusinessCategory.EducationAndTraining]: "Giáo dục & Đào tạo",
	[BusinessCategory.ShoppingAndRetail]: "Mua sắm & Bán lẻ",
	[BusinessCategory.CosmeticsAndBeauty]: "Mỹ phẩm & Làm đẹp",
	[BusinessCategory.RestaurantAndCafe]: "Nhà hàng & Quán",
	[BusinessCategory.AutoAndMotorbike]: "Ô tô & Xe máy",
	[BusinessCategory.FashionAndApparel]: "Thời trang & May mặc",
	[BusinessCategory.FoodAndBeverage]: "Thực phẩm & Đồ uống",
	[BusinessCategory.MediaAndEntertainment]: "Truyền thông & Giải trí",
	[BusinessCategory.InternalCommunications]: "Truyền thông nội bộ",
	[BusinessCategory.Transportation]: "Vận tải",
	[BusinessCategory.Telecommunications]: "Viễn thông"
};
//#endregion
//#region node_modules/tough-cookie/dist/pathMatch.js
var require_pathMatch = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.pathMatch = pathMatch;
	/**
	* Answers "does the request-path path-match a given cookie-path?" as per {@link https://www.rfc-editor.org/rfc/rfc6265.html#section-5.1.4 | RFC6265 Section 5.1.4}.
	* This is essentially a prefix-match where cookiePath is a prefix of reqPath.
	*
	* @remarks
	* A request-path path-matches a given cookie-path if at least one of
	* the following conditions holds:
	*
	* - The cookie-path and the request-path are identical.
	* - The cookie-path is a prefix of the request-path, and the last character of the cookie-path is %x2F ("/").
	* - The cookie-path is a prefix of the request-path, and the first character of the request-path that is not included in the cookie-path is a %x2F ("/") character.
	*
	* @param reqPath - the path of the request
	* @param cookiePath - the path of the cookie
	* @public
	*/
	function pathMatch(reqPath, cookiePath) {
		if (cookiePath === reqPath) return true;
		if (reqPath.indexOf(cookiePath) === 0) {
			if (cookiePath[cookiePath.length - 1] === "/") return true;
			if (reqPath.startsWith(cookiePath) && reqPath[cookiePath.length] === "/") return true;
		}
		return false;
	}
}));
//#endregion
//#region node_modules/tldts/dist/cjs/index.js
var require_cjs = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Check if `vhost` is a valid suffix of `hostname` (top-domain)
	*
	* It means that `vhost` needs to be a suffix of `hostname` and we then need to
	* make sure that: either they are equal, or the character preceding `vhost` in
	* `hostname` is a '.' (it should not be a partial label).
	*
	* * hostname = 'not.evil.com' and vhost = 'vil.com'      => not ok
	* * hostname = 'not.evil.com' and vhost = 'evil.com'     => ok
	* * hostname = 'not.evil.com' and vhost = 'not.evil.com' => ok
	*/
	function shareSameDomainSuffix(hostname, vhost) {
		if (hostname.endsWith(vhost)) return hostname.length === vhost.length || hostname[hostname.length - vhost.length - 1] === ".";
		return false;
	}
	/**
	* Given a hostname and its public suffix, extract the general domain.
	*/
	function extractDomainWithSuffix(hostname, publicSuffix) {
		const publicSuffixIndex = hostname.length - publicSuffix.length - 2;
		const lastDotBeforeSuffixIndex = hostname.lastIndexOf(".", publicSuffixIndex);
		if (lastDotBeforeSuffixIndex === -1) return hostname;
		return hostname.slice(lastDotBeforeSuffixIndex + 1);
	}
	/**
	* Detects the domain based on rules and upon and a host string
	*/
	function getDomain$1(suffix, hostname, options) {
		if (options.validHosts !== null) {
			const validHosts = options.validHosts;
			for (const vhost of validHosts) if (shareSameDomainSuffix(hostname, vhost)) return vhost;
		}
		let numberOfLeadingDots = 0;
		if (hostname.startsWith(".")) while (numberOfLeadingDots < hostname.length && hostname[numberOfLeadingDots] === ".") numberOfLeadingDots += 1;
		if (suffix.length === hostname.length - numberOfLeadingDots) return null;
		return extractDomainWithSuffix(hostname, suffix);
	}
	/**
	* Return the part of domain without suffix.
	*
	* Example: for domain 'foo.com', the result would be 'foo'.
	*/
	function getDomainWithoutSuffix$1(domain, suffix) {
		return domain.slice(0, -suffix.length - 1);
	}
	/**
	* @param url - URL we want to extract a hostname from.
	* @param urlIsValidHostname - hint from caller; true if `url` is already a valid hostname.
	*/
	function extractHostname(url, urlIsValidHostname) {
		let start = 0;
		let end = url.length;
		let hasUpper = false;
		if (!urlIsValidHostname) {
			if (url.startsWith("data:")) return null;
			while (start < url.length && url.charCodeAt(start) <= 32) start += 1;
			while (end > start + 1 && url.charCodeAt(end - 1) <= 32) end -= 1;
			if (url.charCodeAt(start) === 47 && url.charCodeAt(start + 1) === 47) start += 2;
			else {
				const indexOfProtocol = url.indexOf(":/", start);
				if (indexOfProtocol !== -1) {
					const protocolSize = indexOfProtocol - start;
					const c0 = url.charCodeAt(start);
					const c1 = url.charCodeAt(start + 1);
					const c2 = url.charCodeAt(start + 2);
					const c3 = url.charCodeAt(start + 3);
					const c4 = url.charCodeAt(start + 4);
					if (protocolSize === 5 && c0 === 104 && c1 === 116 && c2 === 116 && c3 === 112 && c4 === 115);
					else if (protocolSize === 4 && c0 === 104 && c1 === 116 && c2 === 116 && c3 === 112);
					else if (protocolSize === 3 && c0 === 119 && c1 === 115 && c2 === 115);
					else if (protocolSize === 2 && c0 === 119 && c1 === 115);
					else for (let i = start; i < indexOfProtocol; i += 1) {
						const lowerCaseCode = url.charCodeAt(i) | 32;
						if (!(lowerCaseCode >= 97 && lowerCaseCode <= 122 || lowerCaseCode >= 48 && lowerCaseCode <= 57 || lowerCaseCode === 46 || lowerCaseCode === 45 || lowerCaseCode === 43)) return null;
					}
					start = indexOfProtocol + 2;
					while (url.charCodeAt(start) === 47) start += 1;
				}
			}
			let indexOfIdentifier = -1;
			let indexOfClosingBracket = -1;
			let indexOfPort = -1;
			for (let i = start; i < end; i += 1) {
				const code = url.charCodeAt(i);
				if (code === 35 || code === 47 || code === 63) {
					end = i;
					break;
				} else if (code === 64) indexOfIdentifier = i;
				else if (code === 93) indexOfClosingBracket = i;
				else if (code === 58) indexOfPort = i;
				else if (code >= 65 && code <= 90) hasUpper = true;
			}
			if (indexOfIdentifier !== -1 && indexOfIdentifier > start && indexOfIdentifier < end) start = indexOfIdentifier + 1;
			if (url.charCodeAt(start) === 91) {
				if (indexOfClosingBracket !== -1) return url.slice(start + 1, indexOfClosingBracket).toLowerCase();
				return null;
			} else if (indexOfPort !== -1 && indexOfPort > start && indexOfPort < end) end = indexOfPort;
		}
		while (end > start + 1 && url.charCodeAt(end - 1) === 46) end -= 1;
		const hostname = start !== 0 || end !== url.length ? url.slice(start, end) : url;
		if (hasUpper) return hostname.toLowerCase();
		return hostname;
	}
	/**
	* Check if a hostname is an IP. You should be aware that this only works
	* because `hostname` is already garanteed to be a valid hostname!
	*/
	function isProbablyIpv4(hostname) {
		if (hostname.length < 7) return false;
		if (hostname.length > 15) return false;
		let numberOfDots = 0;
		for (let i = 0; i < hostname.length; i += 1) {
			const code = hostname.charCodeAt(i);
			if (code === 46) numberOfDots += 1;
			else if (code < 48 || code > 57) return false;
		}
		return numberOfDots === 3 && hostname.charCodeAt(0) !== 46 && hostname.charCodeAt(hostname.length - 1) !== 46;
	}
	/**
	* Similar to isProbablyIpv4.
	*/
	function isProbablyIpv6(hostname) {
		if (hostname.length < 3) return false;
		let start = hostname.startsWith("[") ? 1 : 0;
		let end = hostname.length;
		if (hostname[end - 1] === "]") end -= 1;
		if (end - start > 39) return false;
		let hasColon = false;
		for (; start < end; start += 1) {
			const code = hostname.charCodeAt(start);
			if (code === 58) hasColon = true;
			else if (!(code >= 48 && code <= 57 || code >= 97 && code <= 102 || code >= 65 && code <= 90)) return false;
		}
		return hasColon;
	}
	/**
	* Check if `hostname` is *probably* a valid ip addr (either ipv6 or ipv4).
	* This *will not* work on any string. We need `hostname` to be a valid
	* hostname.
	*/
	function isIp(hostname) {
		return isProbablyIpv6(hostname) || isProbablyIpv4(hostname);
	}
	/**
	* Implements fast shallow verification of hostnames. This does not perform a
	* struct check on the content of labels (classes of Unicode characters, etc.)
	* but instead check that the structure is valid (number of labels, length of
	* labels, etc.).
	*
	* If you need stricter validation, consider using an external library.
	*/
	function isValidAscii(code) {
		return code >= 97 && code <= 122 || code >= 48 && code <= 57 || code > 127;
	}
	/**
	* Check if a hostname string is valid. It's usually a preliminary check before
	* trying to use getDomain or anything else.
	*
	* Beware: it does not check if the TLD exists.
	*/
	function isValidHostname(hostname) {
		if (hostname.length > 255) return false;
		if (hostname.length === 0) return false;
		if (!isValidAscii(hostname.charCodeAt(0)) && hostname.charCodeAt(0) !== 46 && hostname.charCodeAt(0) !== 95) return false;
		let lastDotIndex = -1;
		let lastCharCode = -1;
		const len = hostname.length;
		for (let i = 0; i < len; i += 1) {
			const code = hostname.charCodeAt(i);
			if (code === 46) {
				if (i - lastDotIndex > 64 || lastCharCode === 46 || lastCharCode === 45 || lastCharCode === 95) return false;
				lastDotIndex = i;
			} else if (!(isValidAscii(code) || code === 45 || code === 95)) return false;
			lastCharCode = code;
		}
		return len - lastDotIndex - 1 <= 63 && lastCharCode !== 45;
	}
	function setDefaultsImpl({ allowIcannDomains = true, allowPrivateDomains = false, detectIp = true, extractHostname = true, mixedInputs = true, validHosts = null, validateHostname = true }) {
		return {
			allowIcannDomains,
			allowPrivateDomains,
			detectIp,
			extractHostname,
			mixedInputs,
			validHosts,
			validateHostname
		};
	}
	const DEFAULT_OPTIONS = setDefaultsImpl({});
	function setDefaults(options) {
		if (options === void 0) return DEFAULT_OPTIONS;
		return setDefaultsImpl(options);
	}
	/**
	* Returns the subdomain of a hostname string
	*/
	function getSubdomain$1(hostname, domain) {
		if (domain.length === hostname.length) return "";
		return hostname.slice(0, -domain.length - 1);
	}
	/**
	* Implement a factory allowing to plug different implementations of suffix
	* lookup (e.g.: using a trie or the packed hashes datastructures). This is used
	* and exposed in `tldts.ts` and `tldts-experimental.ts` bundle entrypoints.
	*/
	function getEmptyResult() {
		return {
			domain: null,
			domainWithoutSuffix: null,
			hostname: null,
			isIcann: null,
			isIp: null,
			isPrivate: null,
			publicSuffix: null,
			subdomain: null
		};
	}
	function resetResult(result) {
		result.domain = null;
		result.domainWithoutSuffix = null;
		result.hostname = null;
		result.isIcann = null;
		result.isIp = null;
		result.isPrivate = null;
		result.publicSuffix = null;
		result.subdomain = null;
	}
	function parseImpl(url, step, suffixLookup, partialOptions, result) {
		const options = setDefaults(partialOptions);
		if (typeof url !== "string") return result;
		if (!options.extractHostname) result.hostname = url;
		else if (options.mixedInputs) result.hostname = extractHostname(url, isValidHostname(url));
		else result.hostname = extractHostname(url, false);
		if (step === 0 || result.hostname === null) return result;
		if (options.detectIp) {
			result.isIp = isIp(result.hostname);
			if (result.isIp) return result;
		}
		if (options.validateHostname && options.extractHostname && !isValidHostname(result.hostname)) {
			result.hostname = null;
			return result;
		}
		suffixLookup(result.hostname, options, result);
		if (step === 2 || result.publicSuffix === null) return result;
		result.domain = getDomain$1(result.publicSuffix, result.hostname, options);
		if (step === 3 || result.domain === null) return result;
		result.subdomain = getSubdomain$1(result.hostname, result.domain);
		if (step === 4) return result;
		result.domainWithoutSuffix = getDomainWithoutSuffix$1(result.domain, result.publicSuffix);
		return result;
	}
	function fastPathLookup(hostname, options, out) {
		if (!options.allowPrivateDomains && hostname.length > 3) {
			const last = hostname.length - 1;
			const c3 = hostname.charCodeAt(last);
			const c2 = hostname.charCodeAt(last - 1);
			const c1 = hostname.charCodeAt(last - 2);
			const c0 = hostname.charCodeAt(last - 3);
			if (c3 === 109 && c2 === 111 && c1 === 99 && c0 === 46) {
				out.isIcann = true;
				out.isPrivate = false;
				out.publicSuffix = "com";
				return true;
			} else if (c3 === 103 && c2 === 114 && c1 === 111 && c0 === 46) {
				out.isIcann = true;
				out.isPrivate = false;
				out.publicSuffix = "org";
				return true;
			} else if (c3 === 117 && c2 === 100 && c1 === 101 && c0 === 46) {
				out.isIcann = true;
				out.isPrivate = false;
				out.publicSuffix = "edu";
				return true;
			} else if (c3 === 118 && c2 === 111 && c1 === 103 && c0 === 46) {
				out.isIcann = true;
				out.isPrivate = false;
				out.publicSuffix = "gov";
				return true;
			} else if (c3 === 116 && c2 === 101 && c1 === 110 && c0 === 46) {
				out.isIcann = true;
				out.isPrivate = false;
				out.publicSuffix = "net";
				return true;
			} else if (c3 === 101 && c2 === 100 && c1 === 46) {
				out.isIcann = true;
				out.isPrivate = false;
				out.publicSuffix = "de";
				return true;
			}
		}
		return false;
	}
	const exceptions = (function() {
		const _0 = [1, {}], _1 = [2, {}], _2 = [0, { "city": _0 }];
		return [0, {
			"ck": [0, { "www": _0 }],
			"jp": [0, {
				"kawasaki": _2,
				"kitakyushu": _2,
				"kobe": _2,
				"nagoya": _2,
				"sapporo": _2,
				"sendai": _2,
				"yokohama": _2
			}],
			"dev": [0, { "hrsn": [0, { "psl": [0, { "wc": [0, {
				"ignored": _1,
				"sub": [0, { "ignored": _1 }]
			}] }] }] }]
		}];
	})();
	const rules = (function() {
		const _3 = [1, {}], _4 = [2, {}], _5 = [1, {
			"com": _3,
			"edu": _3,
			"gov": _3,
			"net": _3,
			"org": _3
		}], _6 = [1, {
			"com": _3,
			"edu": _3,
			"gov": _3,
			"mil": _3,
			"net": _3,
			"org": _3
		}], _7 = [0, { "*": _4 }], _8 = [2, { "s": _7 }], _9 = [0, { "relay": _4 }], _10 = [2, { "id": _4 }], _11 = [1, { "gov": _3 }], _12 = [0, { "transfer-webapp": _4 }], _13 = [0, {
			"notebook": _4,
			"studio": _4
		}], _14 = [0, {
			"labeling": _4,
			"notebook": _4,
			"studio": _4
		}], _15 = [0, { "notebook": _4 }], _16 = [0, {
			"labeling": _4,
			"notebook": _4,
			"notebook-fips": _4,
			"studio": _4
		}], _17 = [0, {
			"notebook": _4,
			"notebook-fips": _4,
			"studio": _4,
			"studio-fips": _4
		}], _18 = [0, { "*": _3 }], _19 = [1, { "co": _4 }], _20 = [0, { "objects": _4 }], _21 = [2, { "nodes": _4 }], _22 = [0, { "my": _7 }], _23 = [0, {
			"s3": _4,
			"s3-accesspoint": _4,
			"s3-website": _4
		}], _24 = [0, {
			"s3": _4,
			"s3-accesspoint": _4
		}], _25 = [0, { "direct": _4 }], _26 = [0, { "webview-assets": _4 }], _27 = [0, {
			"vfs": _4,
			"webview-assets": _4
		}], _28 = [0, {
			"execute-api": _4,
			"emrappui-prod": _4,
			"emrnotebooks-prod": _4,
			"emrstudio-prod": _4,
			"dualstack": _23,
			"s3": _4,
			"s3-accesspoint": _4,
			"s3-object-lambda": _4,
			"s3-website": _4,
			"aws-cloud9": _26,
			"cloud9": _27
		}], _29 = [0, {
			"execute-api": _4,
			"emrappui-prod": _4,
			"emrnotebooks-prod": _4,
			"emrstudio-prod": _4,
			"dualstack": _24,
			"s3": _4,
			"s3-accesspoint": _4,
			"s3-object-lambda": _4,
			"s3-website": _4,
			"aws-cloud9": _26,
			"cloud9": _27
		}], _30 = [0, {
			"execute-api": _4,
			"emrappui-prod": _4,
			"emrnotebooks-prod": _4,
			"emrstudio-prod": _4,
			"dualstack": _23,
			"s3": _4,
			"s3-accesspoint": _4,
			"s3-object-lambda": _4,
			"s3-website": _4,
			"analytics-gateway": _4,
			"aws-cloud9": _26,
			"cloud9": _27
		}], _31 = [0, {
			"execute-api": _4,
			"emrappui-prod": _4,
			"emrnotebooks-prod": _4,
			"emrstudio-prod": _4,
			"dualstack": _23,
			"s3": _4,
			"s3-accesspoint": _4,
			"s3-object-lambda": _4,
			"s3-website": _4
		}], _32 = [0, {
			"s3": _4,
			"s3-accesspoint": _4,
			"s3-accesspoint-fips": _4,
			"s3-fips": _4,
			"s3-website": _4
		}], _33 = [0, {
			"execute-api": _4,
			"emrappui-prod": _4,
			"emrnotebooks-prod": _4,
			"emrstudio-prod": _4,
			"dualstack": _32,
			"s3": _4,
			"s3-accesspoint": _4,
			"s3-accesspoint-fips": _4,
			"s3-fips": _4,
			"s3-object-lambda": _4,
			"s3-website": _4,
			"aws-cloud9": _26,
			"cloud9": _27
		}], _34 = [0, {
			"execute-api": _4,
			"emrappui-prod": _4,
			"emrnotebooks-prod": _4,
			"emrstudio-prod": _4,
			"dualstack": _32,
			"s3": _4,
			"s3-accesspoint": _4,
			"s3-accesspoint-fips": _4,
			"s3-deprecated": _4,
			"s3-fips": _4,
			"s3-object-lambda": _4,
			"s3-website": _4,
			"analytics-gateway": _4,
			"aws-cloud9": _26,
			"cloud9": _27
		}], _36 = [0, {
			"execute-api": _4,
			"emrappui-prod": _4,
			"emrnotebooks-prod": _4,
			"emrstudio-prod": _4,
			"dualstack": [0, {
				"s3": _4,
				"s3-accesspoint": _4,
				"s3-accesspoint-fips": _4,
				"s3-fips": _4
			}],
			"s3": _4,
			"s3-accesspoint": _4,
			"s3-accesspoint-fips": _4,
			"s3-fips": _4,
			"s3-object-lambda": _4,
			"s3-website": _4
		}], _37 = [0, { "auth": _4 }], _38 = [0, {
			"auth": _4,
			"auth-fips": _4
		}], _39 = [0, { "auth-fips": _4 }], _40 = [0, { "apps": _4 }], _41 = [0, { "paas": _4 }], _42 = [2, { "eu": _4 }], _43 = [0, { "app": _4 }], _44 = [0, { "site": _4 }], _45 = [1, {
			"com": _3,
			"edu": _3,
			"net": _3,
			"org": _3
		}], _46 = [0, { "j": _4 }], _47 = [0, { "dyn": _4 }], _48 = [1, {
			"co": _3,
			"com": _3,
			"edu": _3,
			"gov": _3,
			"net": _3,
			"org": _3
		}], _49 = [0, { "p": _4 }], _50 = [0, { "user": _4 }], _51 = [0, { "shop": _4 }], _52 = [0, { "cdn": _4 }], _53 = [0, {
			"cust": _4,
			"reservd": _4
		}], _54 = [0, { "cust": _4 }], _55 = [0, { "s3": _4 }], _56 = [1, {
			"biz": _3,
			"com": _3,
			"edu": _3,
			"gov": _3,
			"info": _3,
			"net": _3,
			"org": _3
		}], _57 = [0, { "ipfs": _4 }], _58 = [1, { "framer": _4 }], _59 = [0, { "forgot": _4 }], _60 = [1, { "gs": _3 }], _61 = [0, { "nes": _3 }], _62 = [1, {
			"k12": _3,
			"cc": _3,
			"lib": _3
		}], _63 = [1, {
			"cc": _3,
			"lib": _3
		}];
		return [0, {
			"ac": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"mil": _3,
				"net": _3,
				"org": _3,
				"drr": _4,
				"feedback": _4,
				"forms": _4
			}],
			"ad": _3,
			"ae": [1, {
				"ac": _3,
				"co": _3,
				"gov": _3,
				"mil": _3,
				"net": _3,
				"org": _3,
				"sch": _3
			}],
			"aero": [1, {
				"airline": _3,
				"airport": _3,
				"accident-investigation": _3,
				"accident-prevention": _3,
				"aerobatic": _3,
				"aeroclub": _3,
				"aerodrome": _3,
				"agents": _3,
				"air-surveillance": _3,
				"air-traffic-control": _3,
				"aircraft": _3,
				"airtraffic": _3,
				"ambulance": _3,
				"association": _3,
				"author": _3,
				"ballooning": _3,
				"broker": _3,
				"caa": _3,
				"cargo": _3,
				"catering": _3,
				"certification": _3,
				"championship": _3,
				"charter": _3,
				"civilaviation": _3,
				"club": _3,
				"conference": _3,
				"consultant": _3,
				"consulting": _3,
				"control": _3,
				"council": _3,
				"crew": _3,
				"design": _3,
				"dgca": _3,
				"educator": _3,
				"emergency": _3,
				"engine": _3,
				"engineer": _3,
				"entertainment": _3,
				"equipment": _3,
				"exchange": _3,
				"express": _3,
				"federation": _3,
				"flight": _3,
				"freight": _3,
				"fuel": _3,
				"gliding": _3,
				"government": _3,
				"groundhandling": _3,
				"group": _3,
				"hanggliding": _3,
				"homebuilt": _3,
				"insurance": _3,
				"journal": _3,
				"journalist": _3,
				"leasing": _3,
				"logistics": _3,
				"magazine": _3,
				"maintenance": _3,
				"marketplace": _3,
				"media": _3,
				"microlight": _3,
				"modelling": _3,
				"navigation": _3,
				"parachuting": _3,
				"paragliding": _3,
				"passenger-association": _3,
				"pilot": _3,
				"press": _3,
				"production": _3,
				"recreation": _3,
				"repbody": _3,
				"res": _3,
				"research": _3,
				"rotorcraft": _3,
				"safety": _3,
				"scientist": _3,
				"services": _3,
				"show": _3,
				"skydiving": _3,
				"software": _3,
				"student": _3,
				"taxi": _3,
				"trader": _3,
				"trading": _3,
				"trainer": _3,
				"union": _3,
				"workinggroup": _3,
				"works": _3
			}],
			"af": _5,
			"ag": [1, {
				"co": _3,
				"com": _3,
				"net": _3,
				"nom": _3,
				"org": _3,
				"obj": _4
			}],
			"ai": [1, {
				"com": _3,
				"net": _3,
				"off": _3,
				"org": _3,
				"uwu": _4,
				"framer": _4
			}],
			"al": _6,
			"am": [1, {
				"co": _3,
				"com": _3,
				"commune": _3,
				"net": _3,
				"org": _3,
				"radio": _4
			}],
			"ao": [1, {
				"co": _3,
				"ed": _3,
				"edu": _3,
				"gov": _3,
				"gv": _3,
				"it": _3,
				"og": _3,
				"org": _3,
				"pb": _3
			}],
			"aq": _3,
			"ar": [1, {
				"bet": _3,
				"com": _3,
				"coop": _3,
				"edu": _3,
				"gob": _3,
				"gov": _3,
				"int": _3,
				"mil": _3,
				"musica": _3,
				"mutual": _3,
				"net": _3,
				"org": _3,
				"seg": _3,
				"senasa": _3,
				"tur": _3
			}],
			"arpa": [1, {
				"e164": _3,
				"home": _3,
				"in-addr": _3,
				"ip6": _3,
				"iris": _3,
				"uri": _3,
				"urn": _3
			}],
			"as": _11,
			"asia": [1, {
				"cloudns": _4,
				"daemon": _4,
				"dix": _4
			}],
			"at": [1, {
				"ac": [1, { "sth": _3 }],
				"co": _3,
				"gv": _3,
				"or": _3,
				"funkfeuer": [0, { "wien": _4 }],
				"futurecms": [0, {
					"*": _4,
					"ex": _7,
					"in": _7
				}],
				"futurehosting": _4,
				"futuremailing": _4,
				"ortsinfo": [0, {
					"ex": _7,
					"kunden": _7
				}],
				"biz": _4,
				"info": _4,
				"123webseite": _4,
				"priv": _4,
				"myspreadshop": _4,
				"12hp": _4,
				"2ix": _4,
				"4lima": _4,
				"lima-city": _4
			}],
			"au": [1, {
				"asn": _3,
				"com": [1, {
					"cloudlets": [0, { "mel": _4 }],
					"myspreadshop": _4
				}],
				"edu": [1, {
					"act": _3,
					"catholic": _3,
					"nsw": [1, { "schools": _3 }],
					"nt": _3,
					"qld": _3,
					"sa": _3,
					"tas": _3,
					"vic": _3,
					"wa": _3
				}],
				"gov": [1, {
					"qld": _3,
					"sa": _3,
					"tas": _3,
					"vic": _3,
					"wa": _3
				}],
				"id": _3,
				"net": _3,
				"org": _3,
				"conf": _3,
				"oz": _3,
				"act": _3,
				"nsw": _3,
				"nt": _3,
				"qld": _3,
				"sa": _3,
				"tas": _3,
				"vic": _3,
				"wa": _3
			}],
			"aw": [1, { "com": _3 }],
			"ax": _3,
			"az": [1, {
				"biz": _3,
				"co": _3,
				"com": _3,
				"edu": _3,
				"gov": _3,
				"info": _3,
				"int": _3,
				"mil": _3,
				"name": _3,
				"net": _3,
				"org": _3,
				"pp": _3,
				"pro": _3
			}],
			"ba": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"mil": _3,
				"net": _3,
				"org": _3,
				"rs": _4
			}],
			"bb": [1, {
				"biz": _3,
				"co": _3,
				"com": _3,
				"edu": _3,
				"gov": _3,
				"info": _3,
				"net": _3,
				"org": _3,
				"store": _3,
				"tv": _3
			}],
			"bd": _18,
			"be": [1, {
				"ac": _3,
				"cloudns": _4,
				"webhosting": _4,
				"interhostsolutions": [0, { "cloud": _4 }],
				"kuleuven": [0, { "ezproxy": _4 }],
				"123website": _4,
				"myspreadshop": _4,
				"transurl": _7
			}],
			"bf": _11,
			"bg": [1, {
				"0": _3,
				"1": _3,
				"2": _3,
				"3": _3,
				"4": _3,
				"5": _3,
				"6": _3,
				"7": _3,
				"8": _3,
				"9": _3,
				"a": _3,
				"b": _3,
				"c": _3,
				"d": _3,
				"e": _3,
				"f": _3,
				"g": _3,
				"h": _3,
				"i": _3,
				"j": _3,
				"k": _3,
				"l": _3,
				"m": _3,
				"n": _3,
				"o": _3,
				"p": _3,
				"q": _3,
				"r": _3,
				"s": _3,
				"t": _3,
				"u": _3,
				"v": _3,
				"w": _3,
				"x": _3,
				"y": _3,
				"z": _3,
				"barsy": _4
			}],
			"bh": _5,
			"bi": [1, {
				"co": _3,
				"com": _3,
				"edu": _3,
				"or": _3,
				"org": _3
			}],
			"biz": [1, {
				"activetrail": _4,
				"cloud-ip": _4,
				"cloudns": _4,
				"jozi": _4,
				"dyndns": _4,
				"for-better": _4,
				"for-more": _4,
				"for-some": _4,
				"for-the": _4,
				"selfip": _4,
				"webhop": _4,
				"orx": _4,
				"mmafan": _4,
				"myftp": _4,
				"no-ip": _4,
				"dscloud": _4
			}],
			"bj": [1, {
				"africa": _3,
				"agro": _3,
				"architectes": _3,
				"assur": _3,
				"avocats": _3,
				"co": _3,
				"com": _3,
				"eco": _3,
				"econo": _3,
				"edu": _3,
				"info": _3,
				"loisirs": _3,
				"money": _3,
				"net": _3,
				"org": _3,
				"ote": _3,
				"restaurant": _3,
				"resto": _3,
				"tourism": _3,
				"univ": _3
			}],
			"bm": _5,
			"bn": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"net": _3,
				"org": _3,
				"co": _4
			}],
			"bo": [1, {
				"com": _3,
				"edu": _3,
				"gob": _3,
				"int": _3,
				"mil": _3,
				"net": _3,
				"org": _3,
				"tv": _3,
				"web": _3,
				"academia": _3,
				"agro": _3,
				"arte": _3,
				"blog": _3,
				"bolivia": _3,
				"ciencia": _3,
				"cooperativa": _3,
				"democracia": _3,
				"deporte": _3,
				"ecologia": _3,
				"economia": _3,
				"empresa": _3,
				"indigena": _3,
				"industria": _3,
				"info": _3,
				"medicina": _3,
				"movimiento": _3,
				"musica": _3,
				"natural": _3,
				"nombre": _3,
				"noticias": _3,
				"patria": _3,
				"plurinacional": _3,
				"politica": _3,
				"profesional": _3,
				"pueblo": _3,
				"revista": _3,
				"salud": _3,
				"tecnologia": _3,
				"tksat": _3,
				"transporte": _3,
				"wiki": _3
			}],
			"br": [1, {
				"9guacu": _3,
				"abc": _3,
				"adm": _3,
				"adv": _3,
				"agr": _3,
				"aju": _3,
				"am": _3,
				"anani": _3,
				"aparecida": _3,
				"app": _3,
				"arq": _3,
				"art": _3,
				"ato": _3,
				"b": _3,
				"barueri": _3,
				"belem": _3,
				"bet": _3,
				"bhz": _3,
				"bib": _3,
				"bio": _3,
				"blog": _3,
				"bmd": _3,
				"boavista": _3,
				"bsb": _3,
				"campinagrande": _3,
				"campinas": _3,
				"caxias": _3,
				"cim": _3,
				"cng": _3,
				"cnt": _3,
				"com": [1, { "simplesite": _4 }],
				"contagem": _3,
				"coop": _3,
				"coz": _3,
				"cri": _3,
				"cuiaba": _3,
				"curitiba": _3,
				"def": _3,
				"des": _3,
				"det": _3,
				"dev": _3,
				"ecn": _3,
				"eco": _3,
				"edu": _3,
				"emp": _3,
				"enf": _3,
				"eng": _3,
				"esp": _3,
				"etc": _3,
				"eti": _3,
				"far": _3,
				"feira": _3,
				"flog": _3,
				"floripa": _3,
				"fm": _3,
				"fnd": _3,
				"fortal": _3,
				"fot": _3,
				"foz": _3,
				"fst": _3,
				"g12": _3,
				"geo": _3,
				"ggf": _3,
				"goiania": _3,
				"gov": [1, {
					"ac": _3,
					"al": _3,
					"am": _3,
					"ap": _3,
					"ba": _3,
					"ce": _3,
					"df": _3,
					"es": _3,
					"go": _3,
					"ma": _3,
					"mg": _3,
					"ms": _3,
					"mt": _3,
					"pa": _3,
					"pb": _3,
					"pe": _3,
					"pi": _3,
					"pr": _3,
					"rj": _3,
					"rn": _3,
					"ro": _3,
					"rr": _3,
					"rs": _3,
					"sc": _3,
					"se": _3,
					"sp": _3,
					"to": _3
				}],
				"gru": _3,
				"imb": _3,
				"ind": _3,
				"inf": _3,
				"jab": _3,
				"jampa": _3,
				"jdf": _3,
				"joinville": _3,
				"jor": _3,
				"jus": _3,
				"leg": [1, {
					"ac": _4,
					"al": _4,
					"am": _4,
					"ap": _4,
					"ba": _4,
					"ce": _4,
					"df": _4,
					"es": _4,
					"go": _4,
					"ma": _4,
					"mg": _4,
					"ms": _4,
					"mt": _4,
					"pa": _4,
					"pb": _4,
					"pe": _4,
					"pi": _4,
					"pr": _4,
					"rj": _4,
					"rn": _4,
					"ro": _4,
					"rr": _4,
					"rs": _4,
					"sc": _4,
					"se": _4,
					"sp": _4,
					"to": _4
				}],
				"leilao": _3,
				"lel": _3,
				"log": _3,
				"londrina": _3,
				"macapa": _3,
				"maceio": _3,
				"manaus": _3,
				"maringa": _3,
				"mat": _3,
				"med": _3,
				"mil": _3,
				"morena": _3,
				"mp": _3,
				"mus": _3,
				"natal": _3,
				"net": _3,
				"niteroi": _3,
				"nom": _18,
				"not": _3,
				"ntr": _3,
				"odo": _3,
				"ong": _3,
				"org": _3,
				"osasco": _3,
				"palmas": _3,
				"poa": _3,
				"ppg": _3,
				"pro": _3,
				"psc": _3,
				"psi": _3,
				"pvh": _3,
				"qsl": _3,
				"radio": _3,
				"rec": _3,
				"recife": _3,
				"rep": _3,
				"ribeirao": _3,
				"rio": _3,
				"riobranco": _3,
				"riopreto": _3,
				"salvador": _3,
				"sampa": _3,
				"santamaria": _3,
				"santoandre": _3,
				"saobernardo": _3,
				"saogonca": _3,
				"seg": _3,
				"sjc": _3,
				"slg": _3,
				"slz": _3,
				"sorocaba": _3,
				"srv": _3,
				"taxi": _3,
				"tc": _3,
				"tec": _3,
				"teo": _3,
				"the": _3,
				"tmp": _3,
				"trd": _3,
				"tur": _3,
				"tv": _3,
				"udi": _3,
				"vet": _3,
				"vix": _3,
				"vlog": _3,
				"wiki": _3,
				"zlg": _3
			}],
			"bs": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"net": _3,
				"org": _3,
				"we": _4
			}],
			"bt": _5,
			"bv": _3,
			"bw": [1, {
				"ac": _3,
				"co": _3,
				"gov": _3,
				"net": _3,
				"org": _3
			}],
			"by": [1, {
				"gov": _3,
				"mil": _3,
				"com": _3,
				"of": _3,
				"mediatech": _4
			}],
			"bz": [1, {
				"co": _3,
				"com": _3,
				"edu": _3,
				"gov": _3,
				"net": _3,
				"org": _3,
				"za": _4,
				"mydns": _4,
				"gsj": _4
			}],
			"ca": [1, {
				"ab": _3,
				"bc": _3,
				"mb": _3,
				"nb": _3,
				"nf": _3,
				"nl": _3,
				"ns": _3,
				"nt": _3,
				"nu": _3,
				"on": _3,
				"pe": _3,
				"qc": _3,
				"sk": _3,
				"yk": _3,
				"gc": _3,
				"barsy": _4,
				"awdev": _7,
				"co": _4,
				"no-ip": _4,
				"myspreadshop": _4,
				"box": _4
			}],
			"cat": _3,
			"cc": [1, {
				"cleverapps": _4,
				"cloudns": _4,
				"ftpaccess": _4,
				"game-server": _4,
				"myphotos": _4,
				"scrapping": _4,
				"twmail": _4,
				"csx": _4,
				"fantasyleague": _4,
				"spawn": [0, { "instances": _4 }]
			}],
			"cd": _11,
			"cf": _3,
			"cg": _3,
			"ch": [1, {
				"square7": _4,
				"cloudns": _4,
				"cloudscale": [0, {
					"cust": _4,
					"lpg": _20,
					"rma": _20
				}],
				"flow": [0, {
					"ae": [0, { "alp1": _4 }],
					"appengine": _4
				}],
				"linkyard-cloud": _4,
				"gotdns": _4,
				"dnsking": _4,
				"123website": _4,
				"myspreadshop": _4,
				"firenet": [0, {
					"*": _4,
					"svc": _7
				}],
				"12hp": _4,
				"2ix": _4,
				"4lima": _4,
				"lima-city": _4
			}],
			"ci": [1, {
				"ac": _3,
				"xn--aroport-bya": _3,
				"aéroport": _3,
				"asso": _3,
				"co": _3,
				"com": _3,
				"ed": _3,
				"edu": _3,
				"go": _3,
				"gouv": _3,
				"int": _3,
				"net": _3,
				"or": _3,
				"org": _3
			}],
			"ck": _18,
			"cl": [1, {
				"co": _3,
				"gob": _3,
				"gov": _3,
				"mil": _3,
				"cloudns": _4
			}],
			"cm": [1, {
				"co": _3,
				"com": _3,
				"gov": _3,
				"net": _3
			}],
			"cn": [1, {
				"ac": _3,
				"com": [1, {
					"amazonaws": [0, {
						"cn-north-1": [0, {
							"execute-api": _4,
							"emrappui-prod": _4,
							"emrnotebooks-prod": _4,
							"emrstudio-prod": _4,
							"dualstack": _23,
							"s3": _4,
							"s3-accesspoint": _4,
							"s3-deprecated": _4,
							"s3-object-lambda": _4,
							"s3-website": _4
						}],
						"cn-northwest-1": [0, {
							"execute-api": _4,
							"emrappui-prod": _4,
							"emrnotebooks-prod": _4,
							"emrstudio-prod": _4,
							"dualstack": _24,
							"s3": _4,
							"s3-accesspoint": _4,
							"s3-object-lambda": _4,
							"s3-website": _4
						}],
						"compute": _7,
						"airflow": [0, {
							"cn-north-1": _7,
							"cn-northwest-1": _7
						}],
						"eb": [0, {
							"cn-north-1": _4,
							"cn-northwest-1": _4
						}],
						"elb": _7
					}],
					"sagemaker": [0, {
						"cn-north-1": _13,
						"cn-northwest-1": _13
					}]
				}],
				"edu": _3,
				"gov": _3,
				"mil": _3,
				"net": _3,
				"org": _3,
				"xn--55qx5d": _3,
				"公司": _3,
				"xn--od0alg": _3,
				"網絡": _3,
				"xn--io0a7i": _3,
				"网络": _3,
				"ah": _3,
				"bj": _3,
				"cq": _3,
				"fj": _3,
				"gd": _3,
				"gs": _3,
				"gx": _3,
				"gz": _3,
				"ha": _3,
				"hb": _3,
				"he": _3,
				"hi": _3,
				"hk": _3,
				"hl": _3,
				"hn": _3,
				"jl": _3,
				"js": _3,
				"jx": _3,
				"ln": _3,
				"mo": _3,
				"nm": _3,
				"nx": _3,
				"qh": _3,
				"sc": _3,
				"sd": _3,
				"sh": [1, { "as": _4 }],
				"sn": _3,
				"sx": _3,
				"tj": _3,
				"tw": _3,
				"xj": _3,
				"xz": _3,
				"yn": _3,
				"zj": _3,
				"canva-apps": _4,
				"canvasite": _22,
				"myqnapcloud": _4,
				"quickconnect": _25
			}],
			"co": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"mil": _3,
				"net": _3,
				"nom": _3,
				"org": _3,
				"carrd": _4,
				"crd": _4,
				"otap": _7,
				"leadpages": _4,
				"lpages": _4,
				"mypi": _4,
				"xmit": _7,
				"firewalledreplit": _10,
				"repl": _10,
				"supabase": _4
			}],
			"com": [1, {
				"a2hosted": _4,
				"cpserver": _4,
				"adobeaemcloud": [2, { "dev": _7 }],
				"africa": _4,
				"airkitapps": _4,
				"airkitapps-au": _4,
				"aivencloud": _4,
				"alibabacloudcs": _4,
				"kasserver": _4,
				"amazonaws": [0, {
					"af-south-1": _28,
					"ap-east-1": _29,
					"ap-northeast-1": _30,
					"ap-northeast-2": _30,
					"ap-northeast-3": _28,
					"ap-south-1": _30,
					"ap-south-2": _31,
					"ap-southeast-1": _30,
					"ap-southeast-2": _30,
					"ap-southeast-3": _31,
					"ap-southeast-4": _31,
					"ap-southeast-5": [0, {
						"execute-api": _4,
						"dualstack": _23,
						"s3": _4,
						"s3-accesspoint": _4,
						"s3-deprecated": _4,
						"s3-object-lambda": _4,
						"s3-website": _4
					}],
					"ca-central-1": _33,
					"ca-west-1": [0, {
						"execute-api": _4,
						"emrappui-prod": _4,
						"emrnotebooks-prod": _4,
						"emrstudio-prod": _4,
						"dualstack": _32,
						"s3": _4,
						"s3-accesspoint": _4,
						"s3-accesspoint-fips": _4,
						"s3-fips": _4,
						"s3-object-lambda": _4,
						"s3-website": _4
					}],
					"eu-central-1": _30,
					"eu-central-2": _31,
					"eu-north-1": _29,
					"eu-south-1": _28,
					"eu-south-2": _31,
					"eu-west-1": [0, {
						"execute-api": _4,
						"emrappui-prod": _4,
						"emrnotebooks-prod": _4,
						"emrstudio-prod": _4,
						"dualstack": _23,
						"s3": _4,
						"s3-accesspoint": _4,
						"s3-deprecated": _4,
						"s3-object-lambda": _4,
						"s3-website": _4,
						"analytics-gateway": _4,
						"aws-cloud9": _26,
						"cloud9": _27
					}],
					"eu-west-2": _29,
					"eu-west-3": _28,
					"il-central-1": [0, {
						"execute-api": _4,
						"emrappui-prod": _4,
						"emrnotebooks-prod": _4,
						"emrstudio-prod": _4,
						"dualstack": _23,
						"s3": _4,
						"s3-accesspoint": _4,
						"s3-object-lambda": _4,
						"s3-website": _4,
						"aws-cloud9": _26,
						"cloud9": [0, { "vfs": _4 }]
					}],
					"me-central-1": _31,
					"me-south-1": _29,
					"sa-east-1": _28,
					"us-east-1": [2, {
						"execute-api": _4,
						"emrappui-prod": _4,
						"emrnotebooks-prod": _4,
						"emrstudio-prod": _4,
						"dualstack": _32,
						"s3": _4,
						"s3-accesspoint": _4,
						"s3-accesspoint-fips": _4,
						"s3-deprecated": _4,
						"s3-fips": _4,
						"s3-object-lambda": _4,
						"s3-website": _4,
						"analytics-gateway": _4,
						"aws-cloud9": _26,
						"cloud9": _27
					}],
					"us-east-2": _34,
					"us-gov-east-1": _36,
					"us-gov-west-1": _36,
					"us-west-1": _33,
					"us-west-2": _34,
					"compute": _7,
					"compute-1": _7,
					"airflow": [0, {
						"af-south-1": _7,
						"ap-east-1": _7,
						"ap-northeast-1": _7,
						"ap-northeast-2": _7,
						"ap-northeast-3": _7,
						"ap-south-1": _7,
						"ap-south-2": _7,
						"ap-southeast-1": _7,
						"ap-southeast-2": _7,
						"ap-southeast-3": _7,
						"ap-southeast-4": _7,
						"ca-central-1": _7,
						"ca-west-1": _7,
						"eu-central-1": _7,
						"eu-central-2": _7,
						"eu-north-1": _7,
						"eu-south-1": _7,
						"eu-south-2": _7,
						"eu-west-1": _7,
						"eu-west-2": _7,
						"eu-west-3": _7,
						"il-central-1": _7,
						"me-central-1": _7,
						"me-south-1": _7,
						"sa-east-1": _7,
						"us-east-1": _7,
						"us-east-2": _7,
						"us-west-1": _7,
						"us-west-2": _7
					}],
					"s3": _4,
					"s3-1": _4,
					"s3-ap-east-1": _4,
					"s3-ap-northeast-1": _4,
					"s3-ap-northeast-2": _4,
					"s3-ap-northeast-3": _4,
					"s3-ap-south-1": _4,
					"s3-ap-southeast-1": _4,
					"s3-ap-southeast-2": _4,
					"s3-ca-central-1": _4,
					"s3-eu-central-1": _4,
					"s3-eu-north-1": _4,
					"s3-eu-west-1": _4,
					"s3-eu-west-2": _4,
					"s3-eu-west-3": _4,
					"s3-external-1": _4,
					"s3-fips-us-gov-east-1": _4,
					"s3-fips-us-gov-west-1": _4,
					"s3-global": [0, { "accesspoint": [0, { "mrap": _4 }] }],
					"s3-me-south-1": _4,
					"s3-sa-east-1": _4,
					"s3-us-east-2": _4,
					"s3-us-gov-east-1": _4,
					"s3-us-gov-west-1": _4,
					"s3-us-west-1": _4,
					"s3-us-west-2": _4,
					"s3-website-ap-northeast-1": _4,
					"s3-website-ap-southeast-1": _4,
					"s3-website-ap-southeast-2": _4,
					"s3-website-eu-west-1": _4,
					"s3-website-sa-east-1": _4,
					"s3-website-us-east-1": _4,
					"s3-website-us-gov-west-1": _4,
					"s3-website-us-west-1": _4,
					"s3-website-us-west-2": _4,
					"elb": _7
				}],
				"amazoncognito": [0, {
					"af-south-1": _37,
					"ap-east-1": _37,
					"ap-northeast-1": _37,
					"ap-northeast-2": _37,
					"ap-northeast-3": _37,
					"ap-south-1": _37,
					"ap-south-2": _37,
					"ap-southeast-1": _37,
					"ap-southeast-2": _37,
					"ap-southeast-3": _37,
					"ap-southeast-4": _37,
					"ap-southeast-5": _37,
					"ca-central-1": _37,
					"ca-west-1": _37,
					"eu-central-1": _37,
					"eu-central-2": _37,
					"eu-north-1": _37,
					"eu-south-1": _37,
					"eu-south-2": _37,
					"eu-west-1": _37,
					"eu-west-2": _37,
					"eu-west-3": _37,
					"il-central-1": _37,
					"me-central-1": _37,
					"me-south-1": _37,
					"sa-east-1": _37,
					"us-east-1": _38,
					"us-east-2": _38,
					"us-gov-east-1": _39,
					"us-gov-west-1": _39,
					"us-west-1": _38,
					"us-west-2": _38
				}],
				"amplifyapp": _4,
				"awsapprunner": _7,
				"awsapps": _4,
				"elasticbeanstalk": [2, {
					"af-south-1": _4,
					"ap-east-1": _4,
					"ap-northeast-1": _4,
					"ap-northeast-2": _4,
					"ap-northeast-3": _4,
					"ap-south-1": _4,
					"ap-southeast-1": _4,
					"ap-southeast-2": _4,
					"ap-southeast-3": _4,
					"ca-central-1": _4,
					"eu-central-1": _4,
					"eu-north-1": _4,
					"eu-south-1": _4,
					"eu-west-1": _4,
					"eu-west-2": _4,
					"eu-west-3": _4,
					"il-central-1": _4,
					"me-south-1": _4,
					"sa-east-1": _4,
					"us-east-1": _4,
					"us-east-2": _4,
					"us-gov-east-1": _4,
					"us-gov-west-1": _4,
					"us-west-1": _4,
					"us-west-2": _4
				}],
				"awsglobalaccelerator": _4,
				"siiites": _4,
				"appspacehosted": _4,
				"appspaceusercontent": _4,
				"on-aptible": _4,
				"myasustor": _4,
				"balena-devices": _4,
				"boutir": _4,
				"bplaced": _4,
				"cafjs": _4,
				"canva-apps": _4,
				"cdn77-storage": _4,
				"br": _4,
				"cn": _4,
				"de": _4,
				"eu": _4,
				"jpn": _4,
				"mex": _4,
				"ru": _4,
				"sa": _4,
				"uk": _4,
				"us": _4,
				"za": _4,
				"clever-cloud": [0, { "services": _7 }],
				"dnsabr": _4,
				"ip-ddns": _4,
				"jdevcloud": _4,
				"wpdevcloud": _4,
				"cf-ipfs": _4,
				"cloudflare-ipfs": _4,
				"trycloudflare": _4,
				"co": _4,
				"devinapps": _7,
				"builtwithdark": _4,
				"datadetect": [0, {
					"demo": _4,
					"instance": _4
				}],
				"dattolocal": _4,
				"dattorelay": _4,
				"dattoweb": _4,
				"mydatto": _4,
				"digitaloceanspaces": _7,
				"discordsays": _4,
				"discordsez": _4,
				"drayddns": _4,
				"dreamhosters": _4,
				"durumis": _4,
				"mydrobo": _4,
				"blogdns": _4,
				"cechire": _4,
				"dnsalias": _4,
				"dnsdojo": _4,
				"doesntexist": _4,
				"dontexist": _4,
				"doomdns": _4,
				"dyn-o-saur": _4,
				"dynalias": _4,
				"dyndns-at-home": _4,
				"dyndns-at-work": _4,
				"dyndns-blog": _4,
				"dyndns-free": _4,
				"dyndns-home": _4,
				"dyndns-ip": _4,
				"dyndns-mail": _4,
				"dyndns-office": _4,
				"dyndns-pics": _4,
				"dyndns-remote": _4,
				"dyndns-server": _4,
				"dyndns-web": _4,
				"dyndns-wiki": _4,
				"dyndns-work": _4,
				"est-a-la-maison": _4,
				"est-a-la-masion": _4,
				"est-le-patron": _4,
				"est-mon-blogueur": _4,
				"from-ak": _4,
				"from-al": _4,
				"from-ar": _4,
				"from-ca": _4,
				"from-ct": _4,
				"from-dc": _4,
				"from-de": _4,
				"from-fl": _4,
				"from-ga": _4,
				"from-hi": _4,
				"from-ia": _4,
				"from-id": _4,
				"from-il": _4,
				"from-in": _4,
				"from-ks": _4,
				"from-ky": _4,
				"from-ma": _4,
				"from-md": _4,
				"from-mi": _4,
				"from-mn": _4,
				"from-mo": _4,
				"from-ms": _4,
				"from-mt": _4,
				"from-nc": _4,
				"from-nd": _4,
				"from-ne": _4,
				"from-nh": _4,
				"from-nj": _4,
				"from-nm": _4,
				"from-nv": _4,
				"from-oh": _4,
				"from-ok": _4,
				"from-or": _4,
				"from-pa": _4,
				"from-pr": _4,
				"from-ri": _4,
				"from-sc": _4,
				"from-sd": _4,
				"from-tn": _4,
				"from-tx": _4,
				"from-ut": _4,
				"from-va": _4,
				"from-vt": _4,
				"from-wa": _4,
				"from-wi": _4,
				"from-wv": _4,
				"from-wy": _4,
				"getmyip": _4,
				"gotdns": _4,
				"hobby-site": _4,
				"homelinux": _4,
				"homeunix": _4,
				"iamallama": _4,
				"is-a-anarchist": _4,
				"is-a-blogger": _4,
				"is-a-bookkeeper": _4,
				"is-a-bulls-fan": _4,
				"is-a-caterer": _4,
				"is-a-chef": _4,
				"is-a-conservative": _4,
				"is-a-cpa": _4,
				"is-a-cubicle-slave": _4,
				"is-a-democrat": _4,
				"is-a-designer": _4,
				"is-a-doctor": _4,
				"is-a-financialadvisor": _4,
				"is-a-geek": _4,
				"is-a-green": _4,
				"is-a-guru": _4,
				"is-a-hard-worker": _4,
				"is-a-hunter": _4,
				"is-a-landscaper": _4,
				"is-a-lawyer": _4,
				"is-a-liberal": _4,
				"is-a-libertarian": _4,
				"is-a-llama": _4,
				"is-a-musician": _4,
				"is-a-nascarfan": _4,
				"is-a-nurse": _4,
				"is-a-painter": _4,
				"is-a-personaltrainer": _4,
				"is-a-photographer": _4,
				"is-a-player": _4,
				"is-a-republican": _4,
				"is-a-rockstar": _4,
				"is-a-socialist": _4,
				"is-a-student": _4,
				"is-a-teacher": _4,
				"is-a-techie": _4,
				"is-a-therapist": _4,
				"is-an-accountant": _4,
				"is-an-actor": _4,
				"is-an-actress": _4,
				"is-an-anarchist": _4,
				"is-an-artist": _4,
				"is-an-engineer": _4,
				"is-an-entertainer": _4,
				"is-certified": _4,
				"is-gone": _4,
				"is-into-anime": _4,
				"is-into-cars": _4,
				"is-into-cartoons": _4,
				"is-into-games": _4,
				"is-leet": _4,
				"is-not-certified": _4,
				"is-slick": _4,
				"is-uberleet": _4,
				"is-with-theband": _4,
				"isa-geek": _4,
				"isa-hockeynut": _4,
				"issmarterthanyou": _4,
				"likes-pie": _4,
				"likescandy": _4,
				"neat-url": _4,
				"saves-the-whales": _4,
				"selfip": _4,
				"sells-for-less": _4,
				"sells-for-u": _4,
				"servebbs": _4,
				"simple-url": _4,
				"space-to-rent": _4,
				"teaches-yoga": _4,
				"writesthisblog": _4,
				"ddnsfree": _4,
				"ddnsgeek": _4,
				"giize": _4,
				"gleeze": _4,
				"kozow": _4,
				"loseyourip": _4,
				"ooguy": _4,
				"theworkpc": _4,
				"mytuleap": _4,
				"tuleap-partners": _4,
				"encoreapi": _4,
				"evennode": [0, {
					"eu-1": _4,
					"eu-2": _4,
					"eu-3": _4,
					"eu-4": _4,
					"us-1": _4,
					"us-2": _4,
					"us-3": _4,
					"us-4": _4
				}],
				"onfabrica": _4,
				"fastly-edge": _4,
				"fastly-terrarium": _4,
				"fastvps-server": _4,
				"mydobiss": _4,
				"firebaseapp": _4,
				"fldrv": _4,
				"forgeblocks": _4,
				"framercanvas": _4,
				"freebox-os": _4,
				"freeboxos": _4,
				"freemyip": _4,
				"aliases121": _4,
				"gentapps": _4,
				"gentlentapis": _4,
				"githubusercontent": _4,
				"0emm": _7,
				"appspot": [2, { "r": _7 }],
				"blogspot": _4,
				"codespot": _4,
				"googleapis": _4,
				"googlecode": _4,
				"pagespeedmobilizer": _4,
				"withgoogle": _4,
				"withyoutube": _4,
				"grayjayleagues": _4,
				"hatenablog": _4,
				"hatenadiary": _4,
				"herokuapp": _4,
				"gr": _4,
				"smushcdn": _4,
				"wphostedmail": _4,
				"wpmucdn": _4,
				"pixolino": _4,
				"apps-1and1": _4,
				"live-website": _4,
				"dopaas": _4,
				"hosted-by-previder": _41,
				"hosteur": [0, {
					"rag-cloud": _4,
					"rag-cloud-ch": _4
				}],
				"ik-server": [0, {
					"jcloud": _4,
					"jcloud-ver-jpc": _4
				}],
				"jelastic": [0, { "demo": _4 }],
				"massivegrid": _41,
				"wafaicloud": [0, {
					"jed": _4,
					"ryd": _4
				}],
				"webadorsite": _4,
				"joyent": [0, { "cns": _7 }],
				"lpusercontent": _4,
				"linode": [0, {
					"members": _4,
					"nodebalancer": _7
				}],
				"linodeobjects": _7,
				"linodeusercontent": [0, { "ip": _4 }],
				"localtonet": _4,
				"lovableproject": _4,
				"barsycenter": _4,
				"barsyonline": _4,
				"modelscape": _4,
				"mwcloudnonprod": _4,
				"polyspace": _4,
				"mazeplay": _4,
				"miniserver": _4,
				"atmeta": _4,
				"fbsbx": _40,
				"meteorapp": _42,
				"routingthecloud": _4,
				"mydbserver": _4,
				"hostedpi": _4,
				"mythic-beasts": [0, {
					"caracal": _4,
					"customer": _4,
					"fentiger": _4,
					"lynx": _4,
					"ocelot": _4,
					"oncilla": _4,
					"onza": _4,
					"sphinx": _4,
					"vs": _4,
					"x": _4,
					"yali": _4
				}],
				"nospamproxy": [0, { "cloud": [2, { "o365": _4 }] }],
				"4u": _4,
				"nfshost": _4,
				"3utilities": _4,
				"blogsyte": _4,
				"ciscofreak": _4,
				"damnserver": _4,
				"ddnsking": _4,
				"ditchyourip": _4,
				"dnsiskinky": _4,
				"dynns": _4,
				"geekgalaxy": _4,
				"health-carereform": _4,
				"homesecuritymac": _4,
				"homesecuritypc": _4,
				"myactivedirectory": _4,
				"mysecuritycamera": _4,
				"myvnc": _4,
				"net-freaks": _4,
				"onthewifi": _4,
				"point2this": _4,
				"quicksytes": _4,
				"securitytactics": _4,
				"servebeer": _4,
				"servecounterstrike": _4,
				"serveexchange": _4,
				"serveftp": _4,
				"servegame": _4,
				"servehalflife": _4,
				"servehttp": _4,
				"servehumour": _4,
				"serveirc": _4,
				"servemp3": _4,
				"servep2p": _4,
				"servepics": _4,
				"servequake": _4,
				"servesarcasm": _4,
				"stufftoread": _4,
				"unusualperson": _4,
				"workisboring": _4,
				"myiphost": _4,
				"observableusercontent": [0, { "static": _4 }],
				"simplesite": _4,
				"orsites": _4,
				"operaunite": _4,
				"customer-oci": [0, {
					"*": _4,
					"oci": _7,
					"ocp": _7,
					"ocs": _7
				}],
				"oraclecloudapps": _7,
				"oraclegovcloudapps": _7,
				"authgear-staging": _4,
				"authgearapps": _4,
				"skygearapp": _4,
				"outsystemscloud": _4,
				"ownprovider": _4,
				"pgfog": _4,
				"pagexl": _4,
				"gotpantheon": _4,
				"paywhirl": _7,
				"upsunapp": _4,
				"postman-echo": _4,
				"prgmr": [0, { "xen": _4 }],
				"pythonanywhere": _42,
				"qa2": _4,
				"alpha-myqnapcloud": _4,
				"dev-myqnapcloud": _4,
				"mycloudnas": _4,
				"mynascloud": _4,
				"myqnapcloud": _4,
				"qualifioapp": _4,
				"ladesk": _4,
				"qbuser": _4,
				"quipelements": _7,
				"rackmaze": _4,
				"readthedocs-hosted": _4,
				"rhcloud": _4,
				"onrender": _4,
				"render": _43,
				"subsc-pay": _4,
				"180r": _4,
				"dojin": _4,
				"sakuratan": _4,
				"sakuraweb": _4,
				"x0": _4,
				"code": [0, {
					"builder": _7,
					"dev-builder": _7,
					"stg-builder": _7
				}],
				"salesforce": [0, { "platform": [0, { "code-builder-stg": [0, { "test": [0, { "001": _7 }] }] }] }],
				"logoip": _4,
				"scrysec": _4,
				"firewall-gateway": _4,
				"myshopblocks": _4,
				"myshopify": _4,
				"shopitsite": _4,
				"1kapp": _4,
				"appchizi": _4,
				"applinzi": _4,
				"sinaapp": _4,
				"vipsinaapp": _4,
				"streamlitapp": _4,
				"try-snowplow": _4,
				"playstation-cloud": _4,
				"myspreadshop": _4,
				"w-corp-staticblitz": _4,
				"w-credentialless-staticblitz": _4,
				"w-staticblitz": _4,
				"stackhero-network": _4,
				"stdlib": [0, { "api": _4 }],
				"strapiapp": [2, { "media": _4 }],
				"streak-link": _4,
				"streaklinks": _4,
				"streakusercontent": _4,
				"temp-dns": _4,
				"dsmynas": _4,
				"familyds": _4,
				"mytabit": _4,
				"taveusercontent": _4,
				"tb-hosting": _44,
				"reservd": _4,
				"thingdustdata": _4,
				"townnews-staging": _4,
				"typeform": [0, { "pro": _4 }],
				"hk": _4,
				"it": _4,
				"deus-canvas": _4,
				"vultrobjects": _7,
				"wafflecell": _4,
				"hotelwithflight": _4,
				"reserve-online": _4,
				"cprapid": _4,
				"pleskns": _4,
				"remotewd": _4,
				"wiardweb": [0, { "pages": _4 }],
				"wixsite": _4,
				"wixstudio": _4,
				"messwithdns": _4,
				"woltlab-demo": _4,
				"wpenginepowered": [2, { "js": _4 }],
				"xnbay": [2, {
					"u2": _4,
					"u2-local": _4
				}],
				"yolasite": _4
			}],
			"coop": _3,
			"cr": [1, {
				"ac": _3,
				"co": _3,
				"ed": _3,
				"fi": _3,
				"go": _3,
				"or": _3,
				"sa": _3
			}],
			"cu": [1, {
				"com": _3,
				"edu": _3,
				"gob": _3,
				"inf": _3,
				"nat": _3,
				"net": _3,
				"org": _3
			}],
			"cv": [1, {
				"com": _3,
				"edu": _3,
				"id": _3,
				"int": _3,
				"net": _3,
				"nome": _3,
				"org": _3,
				"publ": _3
			}],
			"cw": _45,
			"cx": [1, {
				"gov": _3,
				"cloudns": _4,
				"ath": _4,
				"info": _4,
				"assessments": _4,
				"calculators": _4,
				"funnels": _4,
				"paynow": _4,
				"quizzes": _4,
				"researched": _4,
				"tests": _4
			}],
			"cy": [1, {
				"ac": _3,
				"biz": _3,
				"com": [1, { "scaleforce": _46 }],
				"ekloges": _3,
				"gov": _3,
				"ltd": _3,
				"mil": _3,
				"net": _3,
				"org": _3,
				"press": _3,
				"pro": _3,
				"tm": _3
			}],
			"cz": [1, {
				"contentproxy9": [0, { "rsc": _4 }],
				"realm": _4,
				"e4": _4,
				"co": _4,
				"metacentrum": [0, {
					"cloud": _7,
					"custom": _4
				}],
				"muni": [0, { "cloud": [0, {
					"flt": _4,
					"usr": _4
				}] }]
			}],
			"de": [1, {
				"bplaced": _4,
				"square7": _4,
				"com": _4,
				"cosidns": _47,
				"dnsupdater": _4,
				"dynamisches-dns": _4,
				"internet-dns": _4,
				"l-o-g-i-n": _4,
				"ddnss": [2, {
					"dyn": _4,
					"dyndns": _4
				}],
				"dyn-ip24": _4,
				"dyndns1": _4,
				"home-webserver": [2, { "dyn": _4 }],
				"myhome-server": _4,
				"dnshome": _4,
				"fuettertdasnetz": _4,
				"isteingeek": _4,
				"istmein": _4,
				"lebtimnetz": _4,
				"leitungsen": _4,
				"traeumtgerade": _4,
				"frusky": _7,
				"goip": _4,
				"xn--gnstigbestellen-zvb": _4,
				"günstigbestellen": _4,
				"xn--gnstigliefern-wob": _4,
				"günstigliefern": _4,
				"hs-heilbronn": [0, { "it": [0, {
					"pages": _4,
					"pages-research": _4
				}] }],
				"dyn-berlin": _4,
				"in-berlin": _4,
				"in-brb": _4,
				"in-butter": _4,
				"in-dsl": _4,
				"in-vpn": _4,
				"iservschule": _4,
				"mein-iserv": _4,
				"schulplattform": _4,
				"schulserver": _4,
				"test-iserv": _4,
				"keymachine": _4,
				"git-repos": _4,
				"lcube-server": _4,
				"svn-repos": _4,
				"barsy": _4,
				"webspaceconfig": _4,
				"123webseite": _4,
				"rub": _4,
				"ruhr-uni-bochum": [2, { "noc": [0, { "io": _4 }] }],
				"logoip": _4,
				"firewall-gateway": _4,
				"my-gateway": _4,
				"my-router": _4,
				"spdns": _4,
				"speedpartner": [0, { "customer": _4 }],
				"myspreadshop": _4,
				"taifun-dns": _4,
				"12hp": _4,
				"2ix": _4,
				"4lima": _4,
				"lima-city": _4,
				"dd-dns": _4,
				"dray-dns": _4,
				"draydns": _4,
				"dyn-vpn": _4,
				"dynvpn": _4,
				"mein-vigor": _4,
				"my-vigor": _4,
				"my-wan": _4,
				"syno-ds": _4,
				"synology-diskstation": _4,
				"synology-ds": _4,
				"uberspace": _7,
				"virtual-user": _4,
				"virtualuser": _4,
				"community-pro": _4,
				"diskussionsbereich": _4
			}],
			"dj": _3,
			"dk": [1, {
				"biz": _4,
				"co": _4,
				"firm": _4,
				"reg": _4,
				"store": _4,
				"123hjemmeside": _4,
				"myspreadshop": _4
			}],
			"dm": _48,
			"do": [1, {
				"art": _3,
				"com": _3,
				"edu": _3,
				"gob": _3,
				"gov": _3,
				"mil": _3,
				"net": _3,
				"org": _3,
				"sld": _3,
				"web": _3
			}],
			"dz": [1, {
				"art": _3,
				"asso": _3,
				"com": _3,
				"edu": _3,
				"gov": _3,
				"net": _3,
				"org": _3,
				"pol": _3,
				"soc": _3,
				"tm": _3
			}],
			"ec": [1, {
				"com": _3,
				"edu": _3,
				"fin": _3,
				"gob": _3,
				"gov": _3,
				"info": _3,
				"k12": _3,
				"med": _3,
				"mil": _3,
				"net": _3,
				"org": _3,
				"pro": _3,
				"base": _4,
				"official": _4
			}],
			"edu": [1, { "rit": [0, { "git-pages": _4 }] }],
			"ee": [1, {
				"aip": _3,
				"com": _3,
				"edu": _3,
				"fie": _3,
				"gov": _3,
				"lib": _3,
				"med": _3,
				"org": _3,
				"pri": _3,
				"riik": _3
			}],
			"eg": [1, {
				"ac": _3,
				"com": _3,
				"edu": _3,
				"eun": _3,
				"gov": _3,
				"info": _3,
				"me": _3,
				"mil": _3,
				"name": _3,
				"net": _3,
				"org": _3,
				"sci": _3,
				"sport": _3,
				"tv": _3
			}],
			"er": _18,
			"es": [1, {
				"com": _3,
				"edu": _3,
				"gob": _3,
				"nom": _3,
				"org": _3,
				"123miweb": _4,
				"myspreadshop": _4
			}],
			"et": [1, {
				"biz": _3,
				"com": _3,
				"edu": _3,
				"gov": _3,
				"info": _3,
				"name": _3,
				"net": _3,
				"org": _3
			}],
			"eu": [1, {
				"airkitapps": _4,
				"cloudns": _4,
				"dogado": [0, { "jelastic": _4 }],
				"barsy": _4,
				"spdns": _4,
				"transurl": _7,
				"diskstation": _4
			}],
			"fi": [1, {
				"aland": _3,
				"dy": _4,
				"xn--hkkinen-5wa": _4,
				"häkkinen": _4,
				"iki": _4,
				"cloudplatform": [0, { "fi": _4 }],
				"datacenter": [0, {
					"demo": _4,
					"paas": _4
				}],
				"kapsi": _4,
				"123kotisivu": _4,
				"myspreadshop": _4
			}],
			"fj": [1, {
				"ac": _3,
				"biz": _3,
				"com": _3,
				"gov": _3,
				"info": _3,
				"mil": _3,
				"name": _3,
				"net": _3,
				"org": _3,
				"pro": _3
			}],
			"fk": _18,
			"fm": [1, {
				"com": _3,
				"edu": _3,
				"net": _3,
				"org": _3,
				"radio": _4,
				"user": _7
			}],
			"fo": _3,
			"fr": [1, {
				"asso": _3,
				"com": _3,
				"gouv": _3,
				"nom": _3,
				"prd": _3,
				"tm": _3,
				"avoues": _3,
				"cci": _3,
				"greta": _3,
				"huissier-justice": _3,
				"en-root": _4,
				"fbx-os": _4,
				"fbxos": _4,
				"freebox-os": _4,
				"freeboxos": _4,
				"goupile": _4,
				"123siteweb": _4,
				"on-web": _4,
				"chirurgiens-dentistes-en-france": _4,
				"dedibox": _4,
				"aeroport": _4,
				"avocat": _4,
				"chambagri": _4,
				"chirurgiens-dentistes": _4,
				"experts-comptables": _4,
				"medecin": _4,
				"notaires": _4,
				"pharmacien": _4,
				"port": _4,
				"veterinaire": _4,
				"myspreadshop": _4,
				"ynh": _4
			}],
			"ga": _3,
			"gb": _3,
			"gd": [1, {
				"edu": _3,
				"gov": _3
			}],
			"ge": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"net": _3,
				"org": _3,
				"pvt": _3,
				"school": _3
			}],
			"gf": _3,
			"gg": [1, {
				"co": _3,
				"net": _3,
				"org": _3,
				"botdash": _4,
				"kaas": _4,
				"stackit": _4,
				"panel": [2, { "daemon": _4 }]
			}],
			"gh": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"mil": _3,
				"org": _3
			}],
			"gi": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"ltd": _3,
				"mod": _3,
				"org": _3
			}],
			"gl": [1, {
				"co": _3,
				"com": _3,
				"edu": _3,
				"net": _3,
				"org": _3,
				"biz": _4
			}],
			"gm": _3,
			"gn": [1, {
				"ac": _3,
				"com": _3,
				"edu": _3,
				"gov": _3,
				"net": _3,
				"org": _3
			}],
			"gov": _3,
			"gp": [1, {
				"asso": _3,
				"com": _3,
				"edu": _3,
				"mobi": _3,
				"net": _3,
				"org": _3
			}],
			"gq": _3,
			"gr": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"net": _3,
				"org": _3,
				"barsy": _4,
				"simplesite": _4
			}],
			"gs": _3,
			"gt": [1, {
				"com": _3,
				"edu": _3,
				"gob": _3,
				"ind": _3,
				"mil": _3,
				"net": _3,
				"org": _3
			}],
			"gu": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"guam": _3,
				"info": _3,
				"net": _3,
				"org": _3,
				"web": _3
			}],
			"gw": _3,
			"gy": _48,
			"hk": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"idv": _3,
				"net": _3,
				"org": _3,
				"xn--ciqpn": _3,
				"个人": _3,
				"xn--gmqw5a": _3,
				"個人": _3,
				"xn--55qx5d": _3,
				"公司": _3,
				"xn--mxtq1m": _3,
				"政府": _3,
				"xn--lcvr32d": _3,
				"敎育": _3,
				"xn--wcvs22d": _3,
				"教育": _3,
				"xn--gmq050i": _3,
				"箇人": _3,
				"xn--uc0atv": _3,
				"組織": _3,
				"xn--uc0ay4a": _3,
				"組织": _3,
				"xn--od0alg": _3,
				"網絡": _3,
				"xn--zf0avx": _3,
				"網络": _3,
				"xn--mk0axi": _3,
				"组織": _3,
				"xn--tn0ag": _3,
				"组织": _3,
				"xn--od0aq3b": _3,
				"网絡": _3,
				"xn--io0a7i": _3,
				"网络": _3,
				"inc": _4,
				"ltd": _4
			}],
			"hm": _3,
			"hn": [1, {
				"com": _3,
				"edu": _3,
				"gob": _3,
				"mil": _3,
				"net": _3,
				"org": _3
			}],
			"hr": [1, {
				"com": _3,
				"from": _3,
				"iz": _3,
				"name": _3,
				"brendly": _51
			}],
			"ht": [1, {
				"adult": _3,
				"art": _3,
				"asso": _3,
				"com": _3,
				"coop": _3,
				"edu": _3,
				"firm": _3,
				"gouv": _3,
				"info": _3,
				"med": _3,
				"net": _3,
				"org": _3,
				"perso": _3,
				"pol": _3,
				"pro": _3,
				"rel": _3,
				"shop": _3,
				"rt": _4
			}],
			"hu": [1, {
				"2000": _3,
				"agrar": _3,
				"bolt": _3,
				"casino": _3,
				"city": _3,
				"co": _3,
				"erotica": _3,
				"erotika": _3,
				"film": _3,
				"forum": _3,
				"games": _3,
				"hotel": _3,
				"info": _3,
				"ingatlan": _3,
				"jogasz": _3,
				"konyvelo": _3,
				"lakas": _3,
				"media": _3,
				"news": _3,
				"org": _3,
				"priv": _3,
				"reklam": _3,
				"sex": _3,
				"shop": _3,
				"sport": _3,
				"suli": _3,
				"szex": _3,
				"tm": _3,
				"tozsde": _3,
				"utazas": _3,
				"video": _3
			}],
			"id": [1, {
				"ac": _3,
				"biz": _3,
				"co": _3,
				"desa": _3,
				"go": _3,
				"mil": _3,
				"my": _3,
				"net": _3,
				"or": _3,
				"ponpes": _3,
				"sch": _3,
				"web": _3,
				"zone": _4
			}],
			"ie": [1, {
				"gov": _3,
				"myspreadshop": _4
			}],
			"il": [1, {
				"ac": _3,
				"co": [1, {
					"ravpage": _4,
					"mytabit": _4,
					"tabitorder": _4
				}],
				"gov": _3,
				"idf": _3,
				"k12": _3,
				"muni": _3,
				"net": _3,
				"org": _3
			}],
			"xn--4dbrk0ce": [1, {
				"xn--4dbgdty6c": _3,
				"xn--5dbhl8d": _3,
				"xn--8dbq2a": _3,
				"xn--hebda8b": _3
			}],
			"ישראל": [1, {
				"אקדמיה": _3,
				"ישוב": _3,
				"צהל": _3,
				"ממשל": _3
			}],
			"im": [1, {
				"ac": _3,
				"co": [1, {
					"ltd": _3,
					"plc": _3
				}],
				"com": _3,
				"net": _3,
				"org": _3,
				"tt": _3,
				"tv": _3
			}],
			"in": [1, {
				"5g": _3,
				"6g": _3,
				"ac": _3,
				"ai": _3,
				"am": _3,
				"bihar": _3,
				"biz": _3,
				"business": _3,
				"ca": _3,
				"cn": _3,
				"co": _3,
				"com": _3,
				"coop": _3,
				"cs": _3,
				"delhi": _3,
				"dr": _3,
				"edu": _3,
				"er": _3,
				"firm": _3,
				"gen": _3,
				"gov": _3,
				"gujarat": _3,
				"ind": _3,
				"info": _3,
				"int": _3,
				"internet": _3,
				"io": _3,
				"me": _3,
				"mil": _3,
				"net": _3,
				"nic": _3,
				"org": _3,
				"pg": _3,
				"post": _3,
				"pro": _3,
				"res": _3,
				"travel": _3,
				"tv": _3,
				"uk": _3,
				"up": _3,
				"us": _3,
				"cloudns": _4,
				"barsy": _4,
				"web": _4,
				"supabase": _4
			}],
			"info": [1, {
				"cloudns": _4,
				"dynamic-dns": _4,
				"barrel-of-knowledge": _4,
				"barrell-of-knowledge": _4,
				"dyndns": _4,
				"for-our": _4,
				"groks-the": _4,
				"groks-this": _4,
				"here-for-more": _4,
				"knowsitall": _4,
				"selfip": _4,
				"webhop": _4,
				"barsy": _4,
				"mayfirst": _4,
				"mittwald": _4,
				"mittwaldserver": _4,
				"typo3server": _4,
				"dvrcam": _4,
				"ilovecollege": _4,
				"no-ip": _4,
				"forumz": _4,
				"nsupdate": _4,
				"dnsupdate": _4,
				"v-info": _4
			}],
			"int": [1, { "eu": _3 }],
			"io": [1, {
				"2038": _4,
				"co": _3,
				"com": _3,
				"edu": _3,
				"gov": _3,
				"mil": _3,
				"net": _3,
				"nom": _3,
				"org": _3,
				"on-acorn": _7,
				"myaddr": _4,
				"apigee": _4,
				"b-data": _4,
				"beagleboard": _4,
				"bitbucket": _4,
				"bluebite": _4,
				"boxfuse": _4,
				"brave": _8,
				"browsersafetymark": _4,
				"bubble": _52,
				"bubbleapps": _4,
				"bigv": [0, { "uk0": _4 }],
				"cleverapps": _4,
				"cloudbeesusercontent": _4,
				"dappnode": [0, { "dyndns": _4 }],
				"darklang": _4,
				"definima": _4,
				"dedyn": _4,
				"fh-muenster": _4,
				"shw": _4,
				"forgerock": [0, { "id": _4 }],
				"github": _4,
				"gitlab": _4,
				"lolipop": _4,
				"hasura-app": _4,
				"hostyhosting": _4,
				"hypernode": _4,
				"moonscale": _7,
				"beebyte": _41,
				"beebyteapp": [0, { "sekd1": _4 }],
				"jele": _4,
				"webthings": _4,
				"loginline": _4,
				"barsy": _4,
				"azurecontainer": _7,
				"ngrok": [2, {
					"ap": _4,
					"au": _4,
					"eu": _4,
					"in": _4,
					"jp": _4,
					"sa": _4,
					"us": _4
				}],
				"nodeart": [0, { "stage": _4 }],
				"pantheonsite": _4,
				"pstmn": [2, { "mock": _4 }],
				"protonet": _4,
				"qcx": [2, { "sys": _7 }],
				"qoto": _4,
				"vaporcloud": _4,
				"myrdbx": _4,
				"rb-hosting": _44,
				"on-k3s": _7,
				"on-rio": _7,
				"readthedocs": _4,
				"resindevice": _4,
				"resinstaging": [0, { "devices": _4 }],
				"hzc": _4,
				"sandcats": _4,
				"scrypted": [0, { "client": _4 }],
				"mo-siemens": _4,
				"lair": _40,
				"stolos": _7,
				"musician": _4,
				"utwente": _4,
				"edugit": _4,
				"telebit": _4,
				"thingdust": [0, {
					"dev": _53,
					"disrec": _53,
					"prod": _54,
					"testing": _53
				}],
				"tickets": _4,
				"webflow": _4,
				"webflowtest": _4,
				"editorx": _4,
				"wixstudio": _4,
				"basicserver": _4,
				"virtualserver": _4
			}],
			"iq": _6,
			"ir": [1, {
				"ac": _3,
				"co": _3,
				"gov": _3,
				"id": _3,
				"net": _3,
				"org": _3,
				"sch": _3,
				"xn--mgba3a4f16a": _3,
				"ایران": _3,
				"xn--mgba3a4fra": _3,
				"ايران": _3,
				"arvanedge": _4
			}],
			"is": _3,
			"it": [1, {
				"edu": _3,
				"gov": _3,
				"abr": _3,
				"abruzzo": _3,
				"aosta-valley": _3,
				"aostavalley": _3,
				"bas": _3,
				"basilicata": _3,
				"cal": _3,
				"calabria": _3,
				"cam": _3,
				"campania": _3,
				"emilia-romagna": _3,
				"emiliaromagna": _3,
				"emr": _3,
				"friuli-v-giulia": _3,
				"friuli-ve-giulia": _3,
				"friuli-vegiulia": _3,
				"friuli-venezia-giulia": _3,
				"friuli-veneziagiulia": _3,
				"friuli-vgiulia": _3,
				"friuliv-giulia": _3,
				"friulive-giulia": _3,
				"friulivegiulia": _3,
				"friulivenezia-giulia": _3,
				"friuliveneziagiulia": _3,
				"friulivgiulia": _3,
				"fvg": _3,
				"laz": _3,
				"lazio": _3,
				"lig": _3,
				"liguria": _3,
				"lom": _3,
				"lombardia": _3,
				"lombardy": _3,
				"lucania": _3,
				"mar": _3,
				"marche": _3,
				"mol": _3,
				"molise": _3,
				"piedmont": _3,
				"piemonte": _3,
				"pmn": _3,
				"pug": _3,
				"puglia": _3,
				"sar": _3,
				"sardegna": _3,
				"sardinia": _3,
				"sic": _3,
				"sicilia": _3,
				"sicily": _3,
				"taa": _3,
				"tos": _3,
				"toscana": _3,
				"trentin-sud-tirol": _3,
				"xn--trentin-sd-tirol-rzb": _3,
				"trentin-süd-tirol": _3,
				"trentin-sudtirol": _3,
				"xn--trentin-sdtirol-7vb": _3,
				"trentin-südtirol": _3,
				"trentin-sued-tirol": _3,
				"trentin-suedtirol": _3,
				"trentino": _3,
				"trentino-a-adige": _3,
				"trentino-aadige": _3,
				"trentino-alto-adige": _3,
				"trentino-altoadige": _3,
				"trentino-s-tirol": _3,
				"trentino-stirol": _3,
				"trentino-sud-tirol": _3,
				"xn--trentino-sd-tirol-c3b": _3,
				"trentino-süd-tirol": _3,
				"trentino-sudtirol": _3,
				"xn--trentino-sdtirol-szb": _3,
				"trentino-südtirol": _3,
				"trentino-sued-tirol": _3,
				"trentino-suedtirol": _3,
				"trentinoa-adige": _3,
				"trentinoaadige": _3,
				"trentinoalto-adige": _3,
				"trentinoaltoadige": _3,
				"trentinos-tirol": _3,
				"trentinostirol": _3,
				"trentinosud-tirol": _3,
				"xn--trentinosd-tirol-rzb": _3,
				"trentinosüd-tirol": _3,
				"trentinosudtirol": _3,
				"xn--trentinosdtirol-7vb": _3,
				"trentinosüdtirol": _3,
				"trentinosued-tirol": _3,
				"trentinosuedtirol": _3,
				"trentinsud-tirol": _3,
				"xn--trentinsd-tirol-6vb": _3,
				"trentinsüd-tirol": _3,
				"trentinsudtirol": _3,
				"xn--trentinsdtirol-nsb": _3,
				"trentinsüdtirol": _3,
				"trentinsued-tirol": _3,
				"trentinsuedtirol": _3,
				"tuscany": _3,
				"umb": _3,
				"umbria": _3,
				"val-d-aosta": _3,
				"val-daosta": _3,
				"vald-aosta": _3,
				"valdaosta": _3,
				"valle-aosta": _3,
				"valle-d-aosta": _3,
				"valle-daosta": _3,
				"valleaosta": _3,
				"valled-aosta": _3,
				"valledaosta": _3,
				"vallee-aoste": _3,
				"xn--valle-aoste-ebb": _3,
				"vallée-aoste": _3,
				"vallee-d-aoste": _3,
				"xn--valle-d-aoste-ehb": _3,
				"vallée-d-aoste": _3,
				"valleeaoste": _3,
				"xn--valleaoste-e7a": _3,
				"valléeaoste": _3,
				"valleedaoste": _3,
				"xn--valledaoste-ebb": _3,
				"valléedaoste": _3,
				"vao": _3,
				"vda": _3,
				"ven": _3,
				"veneto": _3,
				"ag": _3,
				"agrigento": _3,
				"al": _3,
				"alessandria": _3,
				"alto-adige": _3,
				"altoadige": _3,
				"an": _3,
				"ancona": _3,
				"andria-barletta-trani": _3,
				"andria-trani-barletta": _3,
				"andriabarlettatrani": _3,
				"andriatranibarletta": _3,
				"ao": _3,
				"aosta": _3,
				"aoste": _3,
				"ap": _3,
				"aq": _3,
				"aquila": _3,
				"ar": _3,
				"arezzo": _3,
				"ascoli-piceno": _3,
				"ascolipiceno": _3,
				"asti": _3,
				"at": _3,
				"av": _3,
				"avellino": _3,
				"ba": _3,
				"balsan": _3,
				"balsan-sudtirol": _3,
				"xn--balsan-sdtirol-nsb": _3,
				"balsan-südtirol": _3,
				"balsan-suedtirol": _3,
				"bari": _3,
				"barletta-trani-andria": _3,
				"barlettatraniandria": _3,
				"belluno": _3,
				"benevento": _3,
				"bergamo": _3,
				"bg": _3,
				"bi": _3,
				"biella": _3,
				"bl": _3,
				"bn": _3,
				"bo": _3,
				"bologna": _3,
				"bolzano": _3,
				"bolzano-altoadige": _3,
				"bozen": _3,
				"bozen-sudtirol": _3,
				"xn--bozen-sdtirol-2ob": _3,
				"bozen-südtirol": _3,
				"bozen-suedtirol": _3,
				"br": _3,
				"brescia": _3,
				"brindisi": _3,
				"bs": _3,
				"bt": _3,
				"bulsan": _3,
				"bulsan-sudtirol": _3,
				"xn--bulsan-sdtirol-nsb": _3,
				"bulsan-südtirol": _3,
				"bulsan-suedtirol": _3,
				"bz": _3,
				"ca": _3,
				"cagliari": _3,
				"caltanissetta": _3,
				"campidano-medio": _3,
				"campidanomedio": _3,
				"campobasso": _3,
				"carbonia-iglesias": _3,
				"carboniaiglesias": _3,
				"carrara-massa": _3,
				"carraramassa": _3,
				"caserta": _3,
				"catania": _3,
				"catanzaro": _3,
				"cb": _3,
				"ce": _3,
				"cesena-forli": _3,
				"xn--cesena-forl-mcb": _3,
				"cesena-forlì": _3,
				"cesenaforli": _3,
				"xn--cesenaforl-i8a": _3,
				"cesenaforlì": _3,
				"ch": _3,
				"chieti": _3,
				"ci": _3,
				"cl": _3,
				"cn": _3,
				"co": _3,
				"como": _3,
				"cosenza": _3,
				"cr": _3,
				"cremona": _3,
				"crotone": _3,
				"cs": _3,
				"ct": _3,
				"cuneo": _3,
				"cz": _3,
				"dell-ogliastra": _3,
				"dellogliastra": _3,
				"en": _3,
				"enna": _3,
				"fc": _3,
				"fe": _3,
				"fermo": _3,
				"ferrara": _3,
				"fg": _3,
				"fi": _3,
				"firenze": _3,
				"florence": _3,
				"fm": _3,
				"foggia": _3,
				"forli-cesena": _3,
				"xn--forl-cesena-fcb": _3,
				"forlì-cesena": _3,
				"forlicesena": _3,
				"xn--forlcesena-c8a": _3,
				"forlìcesena": _3,
				"fr": _3,
				"frosinone": _3,
				"ge": _3,
				"genoa": _3,
				"genova": _3,
				"go": _3,
				"gorizia": _3,
				"gr": _3,
				"grosseto": _3,
				"iglesias-carbonia": _3,
				"iglesiascarbonia": _3,
				"im": _3,
				"imperia": _3,
				"is": _3,
				"isernia": _3,
				"kr": _3,
				"la-spezia": _3,
				"laquila": _3,
				"laspezia": _3,
				"latina": _3,
				"lc": _3,
				"le": _3,
				"lecce": _3,
				"lecco": _3,
				"li": _3,
				"livorno": _3,
				"lo": _3,
				"lodi": _3,
				"lt": _3,
				"lu": _3,
				"lucca": _3,
				"macerata": _3,
				"mantova": _3,
				"massa-carrara": _3,
				"massacarrara": _3,
				"matera": _3,
				"mb": _3,
				"mc": _3,
				"me": _3,
				"medio-campidano": _3,
				"mediocampidano": _3,
				"messina": _3,
				"mi": _3,
				"milan": _3,
				"milano": _3,
				"mn": _3,
				"mo": _3,
				"modena": _3,
				"monza": _3,
				"monza-brianza": _3,
				"monza-e-della-brianza": _3,
				"monzabrianza": _3,
				"monzaebrianza": _3,
				"monzaedellabrianza": _3,
				"ms": _3,
				"mt": _3,
				"na": _3,
				"naples": _3,
				"napoli": _3,
				"no": _3,
				"novara": _3,
				"nu": _3,
				"nuoro": _3,
				"og": _3,
				"ogliastra": _3,
				"olbia-tempio": _3,
				"olbiatempio": _3,
				"or": _3,
				"oristano": _3,
				"ot": _3,
				"pa": _3,
				"padova": _3,
				"padua": _3,
				"palermo": _3,
				"parma": _3,
				"pavia": _3,
				"pc": _3,
				"pd": _3,
				"pe": _3,
				"perugia": _3,
				"pesaro-urbino": _3,
				"pesarourbino": _3,
				"pescara": _3,
				"pg": _3,
				"pi": _3,
				"piacenza": _3,
				"pisa": _3,
				"pistoia": _3,
				"pn": _3,
				"po": _3,
				"pordenone": _3,
				"potenza": _3,
				"pr": _3,
				"prato": _3,
				"pt": _3,
				"pu": _3,
				"pv": _3,
				"pz": _3,
				"ra": _3,
				"ragusa": _3,
				"ravenna": _3,
				"rc": _3,
				"re": _3,
				"reggio-calabria": _3,
				"reggio-emilia": _3,
				"reggiocalabria": _3,
				"reggioemilia": _3,
				"rg": _3,
				"ri": _3,
				"rieti": _3,
				"rimini": _3,
				"rm": _3,
				"rn": _3,
				"ro": _3,
				"roma": _3,
				"rome": _3,
				"rovigo": _3,
				"sa": _3,
				"salerno": _3,
				"sassari": _3,
				"savona": _3,
				"si": _3,
				"siena": _3,
				"siracusa": _3,
				"so": _3,
				"sondrio": _3,
				"sp": _3,
				"sr": _3,
				"ss": _3,
				"xn--sdtirol-n2a": _3,
				"südtirol": _3,
				"suedtirol": _3,
				"sv": _3,
				"ta": _3,
				"taranto": _3,
				"te": _3,
				"tempio-olbia": _3,
				"tempioolbia": _3,
				"teramo": _3,
				"terni": _3,
				"tn": _3,
				"to": _3,
				"torino": _3,
				"tp": _3,
				"tr": _3,
				"trani-andria-barletta": _3,
				"trani-barletta-andria": _3,
				"traniandriabarletta": _3,
				"tranibarlettaandria": _3,
				"trapani": _3,
				"trento": _3,
				"treviso": _3,
				"trieste": _3,
				"ts": _3,
				"turin": _3,
				"tv": _3,
				"ud": _3,
				"udine": _3,
				"urbino-pesaro": _3,
				"urbinopesaro": _3,
				"va": _3,
				"varese": _3,
				"vb": _3,
				"vc": _3,
				"ve": _3,
				"venezia": _3,
				"venice": _3,
				"verbania": _3,
				"vercelli": _3,
				"verona": _3,
				"vi": _3,
				"vibo-valentia": _3,
				"vibovalentia": _3,
				"vicenza": _3,
				"viterbo": _3,
				"vr": _3,
				"vs": _3,
				"vt": _3,
				"vv": _3,
				"12chars": _4,
				"ibxos": _4,
				"iliadboxos": _4,
				"neen": [0, { "jc": _4 }],
				"123homepage": _4,
				"16-b": _4,
				"32-b": _4,
				"64-b": _4,
				"myspreadshop": _4,
				"syncloud": _4
			}],
			"je": [1, {
				"co": _3,
				"net": _3,
				"org": _3,
				"of": _4
			}],
			"jm": _18,
			"jo": [1, {
				"agri": _3,
				"ai": _3,
				"com": _3,
				"edu": _3,
				"eng": _3,
				"fm": _3,
				"gov": _3,
				"mil": _3,
				"net": _3,
				"org": _3,
				"per": _3,
				"phd": _3,
				"sch": _3,
				"tv": _3
			}],
			"jobs": _3,
			"jp": [1, {
				"ac": _3,
				"ad": _3,
				"co": _3,
				"ed": _3,
				"go": _3,
				"gr": _3,
				"lg": _3,
				"ne": [1, {
					"aseinet": _50,
					"gehirn": _4,
					"ivory": _4,
					"mail-box": _4,
					"mints": _4,
					"mokuren": _4,
					"opal": _4,
					"sakura": _4,
					"sumomo": _4,
					"topaz": _4
				}],
				"or": _3,
				"aichi": [1, {
					"aisai": _3,
					"ama": _3,
					"anjo": _3,
					"asuke": _3,
					"chiryu": _3,
					"chita": _3,
					"fuso": _3,
					"gamagori": _3,
					"handa": _3,
					"hazu": _3,
					"hekinan": _3,
					"higashiura": _3,
					"ichinomiya": _3,
					"inazawa": _3,
					"inuyama": _3,
					"isshiki": _3,
					"iwakura": _3,
					"kanie": _3,
					"kariya": _3,
					"kasugai": _3,
					"kira": _3,
					"kiyosu": _3,
					"komaki": _3,
					"konan": _3,
					"kota": _3,
					"mihama": _3,
					"miyoshi": _3,
					"nishio": _3,
					"nisshin": _3,
					"obu": _3,
					"oguchi": _3,
					"oharu": _3,
					"okazaki": _3,
					"owariasahi": _3,
					"seto": _3,
					"shikatsu": _3,
					"shinshiro": _3,
					"shitara": _3,
					"tahara": _3,
					"takahama": _3,
					"tobishima": _3,
					"toei": _3,
					"togo": _3,
					"tokai": _3,
					"tokoname": _3,
					"toyoake": _3,
					"toyohashi": _3,
					"toyokawa": _3,
					"toyone": _3,
					"toyota": _3,
					"tsushima": _3,
					"yatomi": _3
				}],
				"akita": [1, {
					"akita": _3,
					"daisen": _3,
					"fujisato": _3,
					"gojome": _3,
					"hachirogata": _3,
					"happou": _3,
					"higashinaruse": _3,
					"honjo": _3,
					"honjyo": _3,
					"ikawa": _3,
					"kamikoani": _3,
					"kamioka": _3,
					"katagami": _3,
					"kazuno": _3,
					"kitaakita": _3,
					"kosaka": _3,
					"kyowa": _3,
					"misato": _3,
					"mitane": _3,
					"moriyoshi": _3,
					"nikaho": _3,
					"noshiro": _3,
					"odate": _3,
					"oga": _3,
					"ogata": _3,
					"semboku": _3,
					"yokote": _3,
					"yurihonjo": _3
				}],
				"aomori": [1, {
					"aomori": _3,
					"gonohe": _3,
					"hachinohe": _3,
					"hashikami": _3,
					"hiranai": _3,
					"hirosaki": _3,
					"itayanagi": _3,
					"kuroishi": _3,
					"misawa": _3,
					"mutsu": _3,
					"nakadomari": _3,
					"noheji": _3,
					"oirase": _3,
					"owani": _3,
					"rokunohe": _3,
					"sannohe": _3,
					"shichinohe": _3,
					"shingo": _3,
					"takko": _3,
					"towada": _3,
					"tsugaru": _3,
					"tsuruta": _3
				}],
				"chiba": [1, {
					"abiko": _3,
					"asahi": _3,
					"chonan": _3,
					"chosei": _3,
					"choshi": _3,
					"chuo": _3,
					"funabashi": _3,
					"futtsu": _3,
					"hanamigawa": _3,
					"ichihara": _3,
					"ichikawa": _3,
					"ichinomiya": _3,
					"inzai": _3,
					"isumi": _3,
					"kamagaya": _3,
					"kamogawa": _3,
					"kashiwa": _3,
					"katori": _3,
					"katsuura": _3,
					"kimitsu": _3,
					"kisarazu": _3,
					"kozaki": _3,
					"kujukuri": _3,
					"kyonan": _3,
					"matsudo": _3,
					"midori": _3,
					"mihama": _3,
					"minamiboso": _3,
					"mobara": _3,
					"mutsuzawa": _3,
					"nagara": _3,
					"nagareyama": _3,
					"narashino": _3,
					"narita": _3,
					"noda": _3,
					"oamishirasato": _3,
					"omigawa": _3,
					"onjuku": _3,
					"otaki": _3,
					"sakae": _3,
					"sakura": _3,
					"shimofusa": _3,
					"shirako": _3,
					"shiroi": _3,
					"shisui": _3,
					"sodegaura": _3,
					"sosa": _3,
					"tako": _3,
					"tateyama": _3,
					"togane": _3,
					"tohnosho": _3,
					"tomisato": _3,
					"urayasu": _3,
					"yachimata": _3,
					"yachiyo": _3,
					"yokaichiba": _3,
					"yokoshibahikari": _3,
					"yotsukaido": _3
				}],
				"ehime": [1, {
					"ainan": _3,
					"honai": _3,
					"ikata": _3,
					"imabari": _3,
					"iyo": _3,
					"kamijima": _3,
					"kihoku": _3,
					"kumakogen": _3,
					"masaki": _3,
					"matsuno": _3,
					"matsuyama": _3,
					"namikata": _3,
					"niihama": _3,
					"ozu": _3,
					"saijo": _3,
					"seiyo": _3,
					"shikokuchuo": _3,
					"tobe": _3,
					"toon": _3,
					"uchiko": _3,
					"uwajima": _3,
					"yawatahama": _3
				}],
				"fukui": [1, {
					"echizen": _3,
					"eiheiji": _3,
					"fukui": _3,
					"ikeda": _3,
					"katsuyama": _3,
					"mihama": _3,
					"minamiechizen": _3,
					"obama": _3,
					"ohi": _3,
					"ono": _3,
					"sabae": _3,
					"sakai": _3,
					"takahama": _3,
					"tsuruga": _3,
					"wakasa": _3
				}],
				"fukuoka": [1, {
					"ashiya": _3,
					"buzen": _3,
					"chikugo": _3,
					"chikuho": _3,
					"chikujo": _3,
					"chikushino": _3,
					"chikuzen": _3,
					"chuo": _3,
					"dazaifu": _3,
					"fukuchi": _3,
					"hakata": _3,
					"higashi": _3,
					"hirokawa": _3,
					"hisayama": _3,
					"iizuka": _3,
					"inatsuki": _3,
					"kaho": _3,
					"kasuga": _3,
					"kasuya": _3,
					"kawara": _3,
					"keisen": _3,
					"koga": _3,
					"kurate": _3,
					"kurogi": _3,
					"kurume": _3,
					"minami": _3,
					"miyako": _3,
					"miyama": _3,
					"miyawaka": _3,
					"mizumaki": _3,
					"munakata": _3,
					"nakagawa": _3,
					"nakama": _3,
					"nishi": _3,
					"nogata": _3,
					"ogori": _3,
					"okagaki": _3,
					"okawa": _3,
					"oki": _3,
					"omuta": _3,
					"onga": _3,
					"onojo": _3,
					"oto": _3,
					"saigawa": _3,
					"sasaguri": _3,
					"shingu": _3,
					"shinyoshitomi": _3,
					"shonai": _3,
					"soeda": _3,
					"sue": _3,
					"tachiarai": _3,
					"tagawa": _3,
					"takata": _3,
					"toho": _3,
					"toyotsu": _3,
					"tsuiki": _3,
					"ukiha": _3,
					"umi": _3,
					"usui": _3,
					"yamada": _3,
					"yame": _3,
					"yanagawa": _3,
					"yukuhashi": _3
				}],
				"fukushima": [1, {
					"aizubange": _3,
					"aizumisato": _3,
					"aizuwakamatsu": _3,
					"asakawa": _3,
					"bandai": _3,
					"date": _3,
					"fukushima": _3,
					"furudono": _3,
					"futaba": _3,
					"hanawa": _3,
					"higashi": _3,
					"hirata": _3,
					"hirono": _3,
					"iitate": _3,
					"inawashiro": _3,
					"ishikawa": _3,
					"iwaki": _3,
					"izumizaki": _3,
					"kagamiishi": _3,
					"kaneyama": _3,
					"kawamata": _3,
					"kitakata": _3,
					"kitashiobara": _3,
					"koori": _3,
					"koriyama": _3,
					"kunimi": _3,
					"miharu": _3,
					"mishima": _3,
					"namie": _3,
					"nango": _3,
					"nishiaizu": _3,
					"nishigo": _3,
					"okuma": _3,
					"omotego": _3,
					"ono": _3,
					"otama": _3,
					"samegawa": _3,
					"shimogo": _3,
					"shirakawa": _3,
					"showa": _3,
					"soma": _3,
					"sukagawa": _3,
					"taishin": _3,
					"tamakawa": _3,
					"tanagura": _3,
					"tenei": _3,
					"yabuki": _3,
					"yamato": _3,
					"yamatsuri": _3,
					"yanaizu": _3,
					"yugawa": _3
				}],
				"gifu": [1, {
					"anpachi": _3,
					"ena": _3,
					"gifu": _3,
					"ginan": _3,
					"godo": _3,
					"gujo": _3,
					"hashima": _3,
					"hichiso": _3,
					"hida": _3,
					"higashishirakawa": _3,
					"ibigawa": _3,
					"ikeda": _3,
					"kakamigahara": _3,
					"kani": _3,
					"kasahara": _3,
					"kasamatsu": _3,
					"kawaue": _3,
					"kitagata": _3,
					"mino": _3,
					"minokamo": _3,
					"mitake": _3,
					"mizunami": _3,
					"motosu": _3,
					"nakatsugawa": _3,
					"ogaki": _3,
					"sakahogi": _3,
					"seki": _3,
					"sekigahara": _3,
					"shirakawa": _3,
					"tajimi": _3,
					"takayama": _3,
					"tarui": _3,
					"toki": _3,
					"tomika": _3,
					"wanouchi": _3,
					"yamagata": _3,
					"yaotsu": _3,
					"yoro": _3
				}],
				"gunma": [1, {
					"annaka": _3,
					"chiyoda": _3,
					"fujioka": _3,
					"higashiagatsuma": _3,
					"isesaki": _3,
					"itakura": _3,
					"kanna": _3,
					"kanra": _3,
					"katashina": _3,
					"kawaba": _3,
					"kiryu": _3,
					"kusatsu": _3,
					"maebashi": _3,
					"meiwa": _3,
					"midori": _3,
					"minakami": _3,
					"naganohara": _3,
					"nakanojo": _3,
					"nanmoku": _3,
					"numata": _3,
					"oizumi": _3,
					"ora": _3,
					"ota": _3,
					"shibukawa": _3,
					"shimonita": _3,
					"shinto": _3,
					"showa": _3,
					"takasaki": _3,
					"takayama": _3,
					"tamamura": _3,
					"tatebayashi": _3,
					"tomioka": _3,
					"tsukiyono": _3,
					"tsumagoi": _3,
					"ueno": _3,
					"yoshioka": _3
				}],
				"hiroshima": [1, {
					"asaminami": _3,
					"daiwa": _3,
					"etajima": _3,
					"fuchu": _3,
					"fukuyama": _3,
					"hatsukaichi": _3,
					"higashihiroshima": _3,
					"hongo": _3,
					"jinsekikogen": _3,
					"kaita": _3,
					"kui": _3,
					"kumano": _3,
					"kure": _3,
					"mihara": _3,
					"miyoshi": _3,
					"naka": _3,
					"onomichi": _3,
					"osakikamijima": _3,
					"otake": _3,
					"saka": _3,
					"sera": _3,
					"seranishi": _3,
					"shinichi": _3,
					"shobara": _3,
					"takehara": _3
				}],
				"hokkaido": [1, {
					"abashiri": _3,
					"abira": _3,
					"aibetsu": _3,
					"akabira": _3,
					"akkeshi": _3,
					"asahikawa": _3,
					"ashibetsu": _3,
					"ashoro": _3,
					"assabu": _3,
					"atsuma": _3,
					"bibai": _3,
					"biei": _3,
					"bifuka": _3,
					"bihoro": _3,
					"biratori": _3,
					"chippubetsu": _3,
					"chitose": _3,
					"date": _3,
					"ebetsu": _3,
					"embetsu": _3,
					"eniwa": _3,
					"erimo": _3,
					"esan": _3,
					"esashi": _3,
					"fukagawa": _3,
					"fukushima": _3,
					"furano": _3,
					"furubira": _3,
					"haboro": _3,
					"hakodate": _3,
					"hamatonbetsu": _3,
					"hidaka": _3,
					"higashikagura": _3,
					"higashikawa": _3,
					"hiroo": _3,
					"hokuryu": _3,
					"hokuto": _3,
					"honbetsu": _3,
					"horokanai": _3,
					"horonobe": _3,
					"ikeda": _3,
					"imakane": _3,
					"ishikari": _3,
					"iwamizawa": _3,
					"iwanai": _3,
					"kamifurano": _3,
					"kamikawa": _3,
					"kamishihoro": _3,
					"kamisunagawa": _3,
					"kamoenai": _3,
					"kayabe": _3,
					"kembuchi": _3,
					"kikonai": _3,
					"kimobetsu": _3,
					"kitahiroshima": _3,
					"kitami": _3,
					"kiyosato": _3,
					"koshimizu": _3,
					"kunneppu": _3,
					"kuriyama": _3,
					"kuromatsunai": _3,
					"kushiro": _3,
					"kutchan": _3,
					"kyowa": _3,
					"mashike": _3,
					"matsumae": _3,
					"mikasa": _3,
					"minamifurano": _3,
					"mombetsu": _3,
					"moseushi": _3,
					"mukawa": _3,
					"muroran": _3,
					"naie": _3,
					"nakagawa": _3,
					"nakasatsunai": _3,
					"nakatombetsu": _3,
					"nanae": _3,
					"nanporo": _3,
					"nayoro": _3,
					"nemuro": _3,
					"niikappu": _3,
					"niki": _3,
					"nishiokoppe": _3,
					"noboribetsu": _3,
					"numata": _3,
					"obihiro": _3,
					"obira": _3,
					"oketo": _3,
					"okoppe": _3,
					"otaru": _3,
					"otobe": _3,
					"otofuke": _3,
					"otoineppu": _3,
					"oumu": _3,
					"ozora": _3,
					"pippu": _3,
					"rankoshi": _3,
					"rebun": _3,
					"rikubetsu": _3,
					"rishiri": _3,
					"rishirifuji": _3,
					"saroma": _3,
					"sarufutsu": _3,
					"shakotan": _3,
					"shari": _3,
					"shibecha": _3,
					"shibetsu": _3,
					"shikabe": _3,
					"shikaoi": _3,
					"shimamaki": _3,
					"shimizu": _3,
					"shimokawa": _3,
					"shinshinotsu": _3,
					"shintoku": _3,
					"shiranuka": _3,
					"shiraoi": _3,
					"shiriuchi": _3,
					"sobetsu": _3,
					"sunagawa": _3,
					"taiki": _3,
					"takasu": _3,
					"takikawa": _3,
					"takinoue": _3,
					"teshikaga": _3,
					"tobetsu": _3,
					"tohma": _3,
					"tomakomai": _3,
					"tomari": _3,
					"toya": _3,
					"toyako": _3,
					"toyotomi": _3,
					"toyoura": _3,
					"tsubetsu": _3,
					"tsukigata": _3,
					"urakawa": _3,
					"urausu": _3,
					"uryu": _3,
					"utashinai": _3,
					"wakkanai": _3,
					"wassamu": _3,
					"yakumo": _3,
					"yoichi": _3
				}],
				"hyogo": [1, {
					"aioi": _3,
					"akashi": _3,
					"ako": _3,
					"amagasaki": _3,
					"aogaki": _3,
					"asago": _3,
					"ashiya": _3,
					"awaji": _3,
					"fukusaki": _3,
					"goshiki": _3,
					"harima": _3,
					"himeji": _3,
					"ichikawa": _3,
					"inagawa": _3,
					"itami": _3,
					"kakogawa": _3,
					"kamigori": _3,
					"kamikawa": _3,
					"kasai": _3,
					"kasuga": _3,
					"kawanishi": _3,
					"miki": _3,
					"minamiawaji": _3,
					"nishinomiya": _3,
					"nishiwaki": _3,
					"ono": _3,
					"sanda": _3,
					"sannan": _3,
					"sasayama": _3,
					"sayo": _3,
					"shingu": _3,
					"shinonsen": _3,
					"shiso": _3,
					"sumoto": _3,
					"taishi": _3,
					"taka": _3,
					"takarazuka": _3,
					"takasago": _3,
					"takino": _3,
					"tamba": _3,
					"tatsuno": _3,
					"toyooka": _3,
					"yabu": _3,
					"yashiro": _3,
					"yoka": _3,
					"yokawa": _3
				}],
				"ibaraki": [1, {
					"ami": _3,
					"asahi": _3,
					"bando": _3,
					"chikusei": _3,
					"daigo": _3,
					"fujishiro": _3,
					"hitachi": _3,
					"hitachinaka": _3,
					"hitachiomiya": _3,
					"hitachiota": _3,
					"ibaraki": _3,
					"ina": _3,
					"inashiki": _3,
					"itako": _3,
					"iwama": _3,
					"joso": _3,
					"kamisu": _3,
					"kasama": _3,
					"kashima": _3,
					"kasumigaura": _3,
					"koga": _3,
					"miho": _3,
					"mito": _3,
					"moriya": _3,
					"naka": _3,
					"namegata": _3,
					"oarai": _3,
					"ogawa": _3,
					"omitama": _3,
					"ryugasaki": _3,
					"sakai": _3,
					"sakuragawa": _3,
					"shimodate": _3,
					"shimotsuma": _3,
					"shirosato": _3,
					"sowa": _3,
					"suifu": _3,
					"takahagi": _3,
					"tamatsukuri": _3,
					"tokai": _3,
					"tomobe": _3,
					"tone": _3,
					"toride": _3,
					"tsuchiura": _3,
					"tsukuba": _3,
					"uchihara": _3,
					"ushiku": _3,
					"yachiyo": _3,
					"yamagata": _3,
					"yawara": _3,
					"yuki": _3
				}],
				"ishikawa": [1, {
					"anamizu": _3,
					"hakui": _3,
					"hakusan": _3,
					"kaga": _3,
					"kahoku": _3,
					"kanazawa": _3,
					"kawakita": _3,
					"komatsu": _3,
					"nakanoto": _3,
					"nanao": _3,
					"nomi": _3,
					"nonoichi": _3,
					"noto": _3,
					"shika": _3,
					"suzu": _3,
					"tsubata": _3,
					"tsurugi": _3,
					"uchinada": _3,
					"wajima": _3
				}],
				"iwate": [1, {
					"fudai": _3,
					"fujisawa": _3,
					"hanamaki": _3,
					"hiraizumi": _3,
					"hirono": _3,
					"ichinohe": _3,
					"ichinoseki": _3,
					"iwaizumi": _3,
					"iwate": _3,
					"joboji": _3,
					"kamaishi": _3,
					"kanegasaki": _3,
					"karumai": _3,
					"kawai": _3,
					"kitakami": _3,
					"kuji": _3,
					"kunohe": _3,
					"kuzumaki": _3,
					"miyako": _3,
					"mizusawa": _3,
					"morioka": _3,
					"ninohe": _3,
					"noda": _3,
					"ofunato": _3,
					"oshu": _3,
					"otsuchi": _3,
					"rikuzentakata": _3,
					"shiwa": _3,
					"shizukuishi": _3,
					"sumita": _3,
					"tanohata": _3,
					"tono": _3,
					"yahaba": _3,
					"yamada": _3
				}],
				"kagawa": [1, {
					"ayagawa": _3,
					"higashikagawa": _3,
					"kanonji": _3,
					"kotohira": _3,
					"manno": _3,
					"marugame": _3,
					"mitoyo": _3,
					"naoshima": _3,
					"sanuki": _3,
					"tadotsu": _3,
					"takamatsu": _3,
					"tonosho": _3,
					"uchinomi": _3,
					"utazu": _3,
					"zentsuji": _3
				}],
				"kagoshima": [1, {
					"akune": _3,
					"amami": _3,
					"hioki": _3,
					"isa": _3,
					"isen": _3,
					"izumi": _3,
					"kagoshima": _3,
					"kanoya": _3,
					"kawanabe": _3,
					"kinko": _3,
					"kouyama": _3,
					"makurazaki": _3,
					"matsumoto": _3,
					"minamitane": _3,
					"nakatane": _3,
					"nishinoomote": _3,
					"satsumasendai": _3,
					"soo": _3,
					"tarumizu": _3,
					"yusui": _3
				}],
				"kanagawa": [1, {
					"aikawa": _3,
					"atsugi": _3,
					"ayase": _3,
					"chigasaki": _3,
					"ebina": _3,
					"fujisawa": _3,
					"hadano": _3,
					"hakone": _3,
					"hiratsuka": _3,
					"isehara": _3,
					"kaisei": _3,
					"kamakura": _3,
					"kiyokawa": _3,
					"matsuda": _3,
					"minamiashigara": _3,
					"miura": _3,
					"nakai": _3,
					"ninomiya": _3,
					"odawara": _3,
					"oi": _3,
					"oiso": _3,
					"sagamihara": _3,
					"samukawa": _3,
					"tsukui": _3,
					"yamakita": _3,
					"yamato": _3,
					"yokosuka": _3,
					"yugawara": _3,
					"zama": _3,
					"zushi": _3
				}],
				"kochi": [1, {
					"aki": _3,
					"geisei": _3,
					"hidaka": _3,
					"higashitsuno": _3,
					"ino": _3,
					"kagami": _3,
					"kami": _3,
					"kitagawa": _3,
					"kochi": _3,
					"mihara": _3,
					"motoyama": _3,
					"muroto": _3,
					"nahari": _3,
					"nakamura": _3,
					"nankoku": _3,
					"nishitosa": _3,
					"niyodogawa": _3,
					"ochi": _3,
					"okawa": _3,
					"otoyo": _3,
					"otsuki": _3,
					"sakawa": _3,
					"sukumo": _3,
					"susaki": _3,
					"tosa": _3,
					"tosashimizu": _3,
					"toyo": _3,
					"tsuno": _3,
					"umaji": _3,
					"yasuda": _3,
					"yusuhara": _3
				}],
				"kumamoto": [1, {
					"amakusa": _3,
					"arao": _3,
					"aso": _3,
					"choyo": _3,
					"gyokuto": _3,
					"kamiamakusa": _3,
					"kikuchi": _3,
					"kumamoto": _3,
					"mashiki": _3,
					"mifune": _3,
					"minamata": _3,
					"minamioguni": _3,
					"nagasu": _3,
					"nishihara": _3,
					"oguni": _3,
					"ozu": _3,
					"sumoto": _3,
					"takamori": _3,
					"uki": _3,
					"uto": _3,
					"yamaga": _3,
					"yamato": _3,
					"yatsushiro": _3
				}],
				"kyoto": [1, {
					"ayabe": _3,
					"fukuchiyama": _3,
					"higashiyama": _3,
					"ide": _3,
					"ine": _3,
					"joyo": _3,
					"kameoka": _3,
					"kamo": _3,
					"kita": _3,
					"kizu": _3,
					"kumiyama": _3,
					"kyotamba": _3,
					"kyotanabe": _3,
					"kyotango": _3,
					"maizuru": _3,
					"minami": _3,
					"minamiyamashiro": _3,
					"miyazu": _3,
					"muko": _3,
					"nagaokakyo": _3,
					"nakagyo": _3,
					"nantan": _3,
					"oyamazaki": _3,
					"sakyo": _3,
					"seika": _3,
					"tanabe": _3,
					"uji": _3,
					"ujitawara": _3,
					"wazuka": _3,
					"yamashina": _3,
					"yawata": _3
				}],
				"mie": [1, {
					"asahi": _3,
					"inabe": _3,
					"ise": _3,
					"kameyama": _3,
					"kawagoe": _3,
					"kiho": _3,
					"kisosaki": _3,
					"kiwa": _3,
					"komono": _3,
					"kumano": _3,
					"kuwana": _3,
					"matsusaka": _3,
					"meiwa": _3,
					"mihama": _3,
					"minamiise": _3,
					"misugi": _3,
					"miyama": _3,
					"nabari": _3,
					"shima": _3,
					"suzuka": _3,
					"tado": _3,
					"taiki": _3,
					"taki": _3,
					"tamaki": _3,
					"toba": _3,
					"tsu": _3,
					"udono": _3,
					"ureshino": _3,
					"watarai": _3,
					"yokkaichi": _3
				}],
				"miyagi": [1, {
					"furukawa": _3,
					"higashimatsushima": _3,
					"ishinomaki": _3,
					"iwanuma": _3,
					"kakuda": _3,
					"kami": _3,
					"kawasaki": _3,
					"marumori": _3,
					"matsushima": _3,
					"minamisanriku": _3,
					"misato": _3,
					"murata": _3,
					"natori": _3,
					"ogawara": _3,
					"ohira": _3,
					"onagawa": _3,
					"osaki": _3,
					"rifu": _3,
					"semine": _3,
					"shibata": _3,
					"shichikashuku": _3,
					"shikama": _3,
					"shiogama": _3,
					"shiroishi": _3,
					"tagajo": _3,
					"taiwa": _3,
					"tome": _3,
					"tomiya": _3,
					"wakuya": _3,
					"watari": _3,
					"yamamoto": _3,
					"zao": _3
				}],
				"miyazaki": [1, {
					"aya": _3,
					"ebino": _3,
					"gokase": _3,
					"hyuga": _3,
					"kadogawa": _3,
					"kawaminami": _3,
					"kijo": _3,
					"kitagawa": _3,
					"kitakata": _3,
					"kitaura": _3,
					"kobayashi": _3,
					"kunitomi": _3,
					"kushima": _3,
					"mimata": _3,
					"miyakonojo": _3,
					"miyazaki": _3,
					"morotsuka": _3,
					"nichinan": _3,
					"nishimera": _3,
					"nobeoka": _3,
					"saito": _3,
					"shiiba": _3,
					"shintomi": _3,
					"takaharu": _3,
					"takanabe": _3,
					"takazaki": _3,
					"tsuno": _3
				}],
				"nagano": [1, {
					"achi": _3,
					"agematsu": _3,
					"anan": _3,
					"aoki": _3,
					"asahi": _3,
					"azumino": _3,
					"chikuhoku": _3,
					"chikuma": _3,
					"chino": _3,
					"fujimi": _3,
					"hakuba": _3,
					"hara": _3,
					"hiraya": _3,
					"iida": _3,
					"iijima": _3,
					"iiyama": _3,
					"iizuna": _3,
					"ikeda": _3,
					"ikusaka": _3,
					"ina": _3,
					"karuizawa": _3,
					"kawakami": _3,
					"kiso": _3,
					"kisofukushima": _3,
					"kitaaiki": _3,
					"komagane": _3,
					"komoro": _3,
					"matsukawa": _3,
					"matsumoto": _3,
					"miasa": _3,
					"minamiaiki": _3,
					"minamimaki": _3,
					"minamiminowa": _3,
					"minowa": _3,
					"miyada": _3,
					"miyota": _3,
					"mochizuki": _3,
					"nagano": _3,
					"nagawa": _3,
					"nagiso": _3,
					"nakagawa": _3,
					"nakano": _3,
					"nozawaonsen": _3,
					"obuse": _3,
					"ogawa": _3,
					"okaya": _3,
					"omachi": _3,
					"omi": _3,
					"ookuwa": _3,
					"ooshika": _3,
					"otaki": _3,
					"otari": _3,
					"sakae": _3,
					"sakaki": _3,
					"saku": _3,
					"sakuho": _3,
					"shimosuwa": _3,
					"shinanomachi": _3,
					"shiojiri": _3,
					"suwa": _3,
					"suzaka": _3,
					"takagi": _3,
					"takamori": _3,
					"takayama": _3,
					"tateshina": _3,
					"tatsuno": _3,
					"togakushi": _3,
					"togura": _3,
					"tomi": _3,
					"ueda": _3,
					"wada": _3,
					"yamagata": _3,
					"yamanouchi": _3,
					"yasaka": _3,
					"yasuoka": _3
				}],
				"nagasaki": [1, {
					"chijiwa": _3,
					"futsu": _3,
					"goto": _3,
					"hasami": _3,
					"hirado": _3,
					"iki": _3,
					"isahaya": _3,
					"kawatana": _3,
					"kuchinotsu": _3,
					"matsuura": _3,
					"nagasaki": _3,
					"obama": _3,
					"omura": _3,
					"oseto": _3,
					"saikai": _3,
					"sasebo": _3,
					"seihi": _3,
					"shimabara": _3,
					"shinkamigoto": _3,
					"togitsu": _3,
					"tsushima": _3,
					"unzen": _3
				}],
				"nara": [1, {
					"ando": _3,
					"gose": _3,
					"heguri": _3,
					"higashiyoshino": _3,
					"ikaruga": _3,
					"ikoma": _3,
					"kamikitayama": _3,
					"kanmaki": _3,
					"kashiba": _3,
					"kashihara": _3,
					"katsuragi": _3,
					"kawai": _3,
					"kawakami": _3,
					"kawanishi": _3,
					"koryo": _3,
					"kurotaki": _3,
					"mitsue": _3,
					"miyake": _3,
					"nara": _3,
					"nosegawa": _3,
					"oji": _3,
					"ouda": _3,
					"oyodo": _3,
					"sakurai": _3,
					"sango": _3,
					"shimoichi": _3,
					"shimokitayama": _3,
					"shinjo": _3,
					"soni": _3,
					"takatori": _3,
					"tawaramoto": _3,
					"tenkawa": _3,
					"tenri": _3,
					"uda": _3,
					"yamatokoriyama": _3,
					"yamatotakada": _3,
					"yamazoe": _3,
					"yoshino": _3
				}],
				"niigata": [1, {
					"aga": _3,
					"agano": _3,
					"gosen": _3,
					"itoigawa": _3,
					"izumozaki": _3,
					"joetsu": _3,
					"kamo": _3,
					"kariwa": _3,
					"kashiwazaki": _3,
					"minamiuonuma": _3,
					"mitsuke": _3,
					"muika": _3,
					"murakami": _3,
					"myoko": _3,
					"nagaoka": _3,
					"niigata": _3,
					"ojiya": _3,
					"omi": _3,
					"sado": _3,
					"sanjo": _3,
					"seiro": _3,
					"seirou": _3,
					"sekikawa": _3,
					"shibata": _3,
					"tagami": _3,
					"tainai": _3,
					"tochio": _3,
					"tokamachi": _3,
					"tsubame": _3,
					"tsunan": _3,
					"uonuma": _3,
					"yahiko": _3,
					"yoita": _3,
					"yuzawa": _3
				}],
				"oita": [1, {
					"beppu": _3,
					"bungoono": _3,
					"bungotakada": _3,
					"hasama": _3,
					"hiji": _3,
					"himeshima": _3,
					"hita": _3,
					"kamitsue": _3,
					"kokonoe": _3,
					"kuju": _3,
					"kunisaki": _3,
					"kusu": _3,
					"oita": _3,
					"saiki": _3,
					"taketa": _3,
					"tsukumi": _3,
					"usa": _3,
					"usuki": _3,
					"yufu": _3
				}],
				"okayama": [1, {
					"akaiwa": _3,
					"asakuchi": _3,
					"bizen": _3,
					"hayashima": _3,
					"ibara": _3,
					"kagamino": _3,
					"kasaoka": _3,
					"kibichuo": _3,
					"kumenan": _3,
					"kurashiki": _3,
					"maniwa": _3,
					"misaki": _3,
					"nagi": _3,
					"niimi": _3,
					"nishiawakura": _3,
					"okayama": _3,
					"satosho": _3,
					"setouchi": _3,
					"shinjo": _3,
					"shoo": _3,
					"soja": _3,
					"takahashi": _3,
					"tamano": _3,
					"tsuyama": _3,
					"wake": _3,
					"yakage": _3
				}],
				"okinawa": [1, {
					"aguni": _3,
					"ginowan": _3,
					"ginoza": _3,
					"gushikami": _3,
					"haebaru": _3,
					"higashi": _3,
					"hirara": _3,
					"iheya": _3,
					"ishigaki": _3,
					"ishikawa": _3,
					"itoman": _3,
					"izena": _3,
					"kadena": _3,
					"kin": _3,
					"kitadaito": _3,
					"kitanakagusuku": _3,
					"kumejima": _3,
					"kunigami": _3,
					"minamidaito": _3,
					"motobu": _3,
					"nago": _3,
					"naha": _3,
					"nakagusuku": _3,
					"nakijin": _3,
					"nanjo": _3,
					"nishihara": _3,
					"ogimi": _3,
					"okinawa": _3,
					"onna": _3,
					"shimoji": _3,
					"taketomi": _3,
					"tarama": _3,
					"tokashiki": _3,
					"tomigusuku": _3,
					"tonaki": _3,
					"urasoe": _3,
					"uruma": _3,
					"yaese": _3,
					"yomitan": _3,
					"yonabaru": _3,
					"yonaguni": _3,
					"zamami": _3
				}],
				"osaka": [1, {
					"abeno": _3,
					"chihayaakasaka": _3,
					"chuo": _3,
					"daito": _3,
					"fujiidera": _3,
					"habikino": _3,
					"hannan": _3,
					"higashiosaka": _3,
					"higashisumiyoshi": _3,
					"higashiyodogawa": _3,
					"hirakata": _3,
					"ibaraki": _3,
					"ikeda": _3,
					"izumi": _3,
					"izumiotsu": _3,
					"izumisano": _3,
					"kadoma": _3,
					"kaizuka": _3,
					"kanan": _3,
					"kashiwara": _3,
					"katano": _3,
					"kawachinagano": _3,
					"kishiwada": _3,
					"kita": _3,
					"kumatori": _3,
					"matsubara": _3,
					"minato": _3,
					"minoh": _3,
					"misaki": _3,
					"moriguchi": _3,
					"neyagawa": _3,
					"nishi": _3,
					"nose": _3,
					"osakasayama": _3,
					"sakai": _3,
					"sayama": _3,
					"sennan": _3,
					"settsu": _3,
					"shijonawate": _3,
					"shimamoto": _3,
					"suita": _3,
					"tadaoka": _3,
					"taishi": _3,
					"tajiri": _3,
					"takaishi": _3,
					"takatsuki": _3,
					"tondabayashi": _3,
					"toyonaka": _3,
					"toyono": _3,
					"yao": _3
				}],
				"saga": [1, {
					"ariake": _3,
					"arita": _3,
					"fukudomi": _3,
					"genkai": _3,
					"hamatama": _3,
					"hizen": _3,
					"imari": _3,
					"kamimine": _3,
					"kanzaki": _3,
					"karatsu": _3,
					"kashima": _3,
					"kitagata": _3,
					"kitahata": _3,
					"kiyama": _3,
					"kouhoku": _3,
					"kyuragi": _3,
					"nishiarita": _3,
					"ogi": _3,
					"omachi": _3,
					"ouchi": _3,
					"saga": _3,
					"shiroishi": _3,
					"taku": _3,
					"tara": _3,
					"tosu": _3,
					"yoshinogari": _3
				}],
				"saitama": [1, {
					"arakawa": _3,
					"asaka": _3,
					"chichibu": _3,
					"fujimi": _3,
					"fujimino": _3,
					"fukaya": _3,
					"hanno": _3,
					"hanyu": _3,
					"hasuda": _3,
					"hatogaya": _3,
					"hatoyama": _3,
					"hidaka": _3,
					"higashichichibu": _3,
					"higashimatsuyama": _3,
					"honjo": _3,
					"ina": _3,
					"iruma": _3,
					"iwatsuki": _3,
					"kamiizumi": _3,
					"kamikawa": _3,
					"kamisato": _3,
					"kasukabe": _3,
					"kawagoe": _3,
					"kawaguchi": _3,
					"kawajima": _3,
					"kazo": _3,
					"kitamoto": _3,
					"koshigaya": _3,
					"kounosu": _3,
					"kuki": _3,
					"kumagaya": _3,
					"matsubushi": _3,
					"minano": _3,
					"misato": _3,
					"miyashiro": _3,
					"miyoshi": _3,
					"moroyama": _3,
					"nagatoro": _3,
					"namegawa": _3,
					"niiza": _3,
					"ogano": _3,
					"ogawa": _3,
					"ogose": _3,
					"okegawa": _3,
					"omiya": _3,
					"otaki": _3,
					"ranzan": _3,
					"ryokami": _3,
					"saitama": _3,
					"sakado": _3,
					"satte": _3,
					"sayama": _3,
					"shiki": _3,
					"shiraoka": _3,
					"soka": _3,
					"sugito": _3,
					"toda": _3,
					"tokigawa": _3,
					"tokorozawa": _3,
					"tsurugashima": _3,
					"urawa": _3,
					"warabi": _3,
					"yashio": _3,
					"yokoze": _3,
					"yono": _3,
					"yorii": _3,
					"yoshida": _3,
					"yoshikawa": _3,
					"yoshimi": _3
				}],
				"shiga": [1, {
					"aisho": _3,
					"gamo": _3,
					"higashiomi": _3,
					"hikone": _3,
					"koka": _3,
					"konan": _3,
					"kosei": _3,
					"koto": _3,
					"kusatsu": _3,
					"maibara": _3,
					"moriyama": _3,
					"nagahama": _3,
					"nishiazai": _3,
					"notogawa": _3,
					"omihachiman": _3,
					"otsu": _3,
					"ritto": _3,
					"ryuoh": _3,
					"takashima": _3,
					"takatsuki": _3,
					"torahime": _3,
					"toyosato": _3,
					"yasu": _3
				}],
				"shimane": [1, {
					"akagi": _3,
					"ama": _3,
					"gotsu": _3,
					"hamada": _3,
					"higashiizumo": _3,
					"hikawa": _3,
					"hikimi": _3,
					"izumo": _3,
					"kakinoki": _3,
					"masuda": _3,
					"matsue": _3,
					"misato": _3,
					"nishinoshima": _3,
					"ohda": _3,
					"okinoshima": _3,
					"okuizumo": _3,
					"shimane": _3,
					"tamayu": _3,
					"tsuwano": _3,
					"unnan": _3,
					"yakumo": _3,
					"yasugi": _3,
					"yatsuka": _3
				}],
				"shizuoka": [1, {
					"arai": _3,
					"atami": _3,
					"fuji": _3,
					"fujieda": _3,
					"fujikawa": _3,
					"fujinomiya": _3,
					"fukuroi": _3,
					"gotemba": _3,
					"haibara": _3,
					"hamamatsu": _3,
					"higashiizu": _3,
					"ito": _3,
					"iwata": _3,
					"izu": _3,
					"izunokuni": _3,
					"kakegawa": _3,
					"kannami": _3,
					"kawanehon": _3,
					"kawazu": _3,
					"kikugawa": _3,
					"kosai": _3,
					"makinohara": _3,
					"matsuzaki": _3,
					"minamiizu": _3,
					"mishima": _3,
					"morimachi": _3,
					"nishiizu": _3,
					"numazu": _3,
					"omaezaki": _3,
					"shimada": _3,
					"shimizu": _3,
					"shimoda": _3,
					"shizuoka": _3,
					"susono": _3,
					"yaizu": _3,
					"yoshida": _3
				}],
				"tochigi": [1, {
					"ashikaga": _3,
					"bato": _3,
					"haga": _3,
					"ichikai": _3,
					"iwafune": _3,
					"kaminokawa": _3,
					"kanuma": _3,
					"karasuyama": _3,
					"kuroiso": _3,
					"mashiko": _3,
					"mibu": _3,
					"moka": _3,
					"motegi": _3,
					"nasu": _3,
					"nasushiobara": _3,
					"nikko": _3,
					"nishikata": _3,
					"nogi": _3,
					"ohira": _3,
					"ohtawara": _3,
					"oyama": _3,
					"sakura": _3,
					"sano": _3,
					"shimotsuke": _3,
					"shioya": _3,
					"takanezawa": _3,
					"tochigi": _3,
					"tsuga": _3,
					"ujiie": _3,
					"utsunomiya": _3,
					"yaita": _3
				}],
				"tokushima": [1, {
					"aizumi": _3,
					"anan": _3,
					"ichiba": _3,
					"itano": _3,
					"kainan": _3,
					"komatsushima": _3,
					"matsushige": _3,
					"mima": _3,
					"minami": _3,
					"miyoshi": _3,
					"mugi": _3,
					"nakagawa": _3,
					"naruto": _3,
					"sanagochi": _3,
					"shishikui": _3,
					"tokushima": _3,
					"wajiki": _3
				}],
				"tokyo": [1, {
					"adachi": _3,
					"akiruno": _3,
					"akishima": _3,
					"aogashima": _3,
					"arakawa": _3,
					"bunkyo": _3,
					"chiyoda": _3,
					"chofu": _3,
					"chuo": _3,
					"edogawa": _3,
					"fuchu": _3,
					"fussa": _3,
					"hachijo": _3,
					"hachioji": _3,
					"hamura": _3,
					"higashikurume": _3,
					"higashimurayama": _3,
					"higashiyamato": _3,
					"hino": _3,
					"hinode": _3,
					"hinohara": _3,
					"inagi": _3,
					"itabashi": _3,
					"katsushika": _3,
					"kita": _3,
					"kiyose": _3,
					"kodaira": _3,
					"koganei": _3,
					"kokubunji": _3,
					"komae": _3,
					"koto": _3,
					"kouzushima": _3,
					"kunitachi": _3,
					"machida": _3,
					"meguro": _3,
					"minato": _3,
					"mitaka": _3,
					"mizuho": _3,
					"musashimurayama": _3,
					"musashino": _3,
					"nakano": _3,
					"nerima": _3,
					"ogasawara": _3,
					"okutama": _3,
					"ome": _3,
					"oshima": _3,
					"ota": _3,
					"setagaya": _3,
					"shibuya": _3,
					"shinagawa": _3,
					"shinjuku": _3,
					"suginami": _3,
					"sumida": _3,
					"tachikawa": _3,
					"taito": _3,
					"tama": _3,
					"toshima": _3
				}],
				"tottori": [1, {
					"chizu": _3,
					"hino": _3,
					"kawahara": _3,
					"koge": _3,
					"kotoura": _3,
					"misasa": _3,
					"nanbu": _3,
					"nichinan": _3,
					"sakaiminato": _3,
					"tottori": _3,
					"wakasa": _3,
					"yazu": _3,
					"yonago": _3
				}],
				"toyama": [1, {
					"asahi": _3,
					"fuchu": _3,
					"fukumitsu": _3,
					"funahashi": _3,
					"himi": _3,
					"imizu": _3,
					"inami": _3,
					"johana": _3,
					"kamiichi": _3,
					"kurobe": _3,
					"nakaniikawa": _3,
					"namerikawa": _3,
					"nanto": _3,
					"nyuzen": _3,
					"oyabe": _3,
					"taira": _3,
					"takaoka": _3,
					"tateyama": _3,
					"toga": _3,
					"tonami": _3,
					"toyama": _3,
					"unazuki": _3,
					"uozu": _3,
					"yamada": _3
				}],
				"wakayama": [1, {
					"arida": _3,
					"aridagawa": _3,
					"gobo": _3,
					"hashimoto": _3,
					"hidaka": _3,
					"hirogawa": _3,
					"inami": _3,
					"iwade": _3,
					"kainan": _3,
					"kamitonda": _3,
					"katsuragi": _3,
					"kimino": _3,
					"kinokawa": _3,
					"kitayama": _3,
					"koya": _3,
					"koza": _3,
					"kozagawa": _3,
					"kudoyama": _3,
					"kushimoto": _3,
					"mihama": _3,
					"misato": _3,
					"nachikatsuura": _3,
					"shingu": _3,
					"shirahama": _3,
					"taiji": _3,
					"tanabe": _3,
					"wakayama": _3,
					"yuasa": _3,
					"yura": _3
				}],
				"yamagata": [1, {
					"asahi": _3,
					"funagata": _3,
					"higashine": _3,
					"iide": _3,
					"kahoku": _3,
					"kaminoyama": _3,
					"kaneyama": _3,
					"kawanishi": _3,
					"mamurogawa": _3,
					"mikawa": _3,
					"murayama": _3,
					"nagai": _3,
					"nakayama": _3,
					"nanyo": _3,
					"nishikawa": _3,
					"obanazawa": _3,
					"oe": _3,
					"oguni": _3,
					"ohkura": _3,
					"oishida": _3,
					"sagae": _3,
					"sakata": _3,
					"sakegawa": _3,
					"shinjo": _3,
					"shirataka": _3,
					"shonai": _3,
					"takahata": _3,
					"tendo": _3,
					"tozawa": _3,
					"tsuruoka": _3,
					"yamagata": _3,
					"yamanobe": _3,
					"yonezawa": _3,
					"yuza": _3
				}],
				"yamaguchi": [1, {
					"abu": _3,
					"hagi": _3,
					"hikari": _3,
					"hofu": _3,
					"iwakuni": _3,
					"kudamatsu": _3,
					"mitou": _3,
					"nagato": _3,
					"oshima": _3,
					"shimonoseki": _3,
					"shunan": _3,
					"tabuse": _3,
					"tokuyama": _3,
					"toyota": _3,
					"ube": _3,
					"yuu": _3
				}],
				"yamanashi": [1, {
					"chuo": _3,
					"doshi": _3,
					"fuefuki": _3,
					"fujikawa": _3,
					"fujikawaguchiko": _3,
					"fujiyoshida": _3,
					"hayakawa": _3,
					"hokuto": _3,
					"ichikawamisato": _3,
					"kai": _3,
					"kofu": _3,
					"koshu": _3,
					"kosuge": _3,
					"minami-alps": _3,
					"minobu": _3,
					"nakamichi": _3,
					"nanbu": _3,
					"narusawa": _3,
					"nirasaki": _3,
					"nishikatsura": _3,
					"oshino": _3,
					"otsuki": _3,
					"showa": _3,
					"tabayama": _3,
					"tsuru": _3,
					"uenohara": _3,
					"yamanakako": _3,
					"yamanashi": _3
				}],
				"xn--ehqz56n": _3,
				"三重": _3,
				"xn--1lqs03n": _3,
				"京都": _3,
				"xn--qqqt11m": _3,
				"佐賀": _3,
				"xn--f6qx53a": _3,
				"兵庫": _3,
				"xn--djrs72d6uy": _3,
				"北海道": _3,
				"xn--mkru45i": _3,
				"千葉": _3,
				"xn--0trq7p7nn": _3,
				"和歌山": _3,
				"xn--5js045d": _3,
				"埼玉": _3,
				"xn--kbrq7o": _3,
				"大分": _3,
				"xn--pssu33l": _3,
				"大阪": _3,
				"xn--ntsq17g": _3,
				"奈良": _3,
				"xn--uisz3g": _3,
				"宮城": _3,
				"xn--6btw5a": _3,
				"宮崎": _3,
				"xn--1ctwo": _3,
				"富山": _3,
				"xn--6orx2r": _3,
				"山口": _3,
				"xn--rht61e": _3,
				"山形": _3,
				"xn--rht27z": _3,
				"山梨": _3,
				"xn--nit225k": _3,
				"岐阜": _3,
				"xn--rht3d": _3,
				"岡山": _3,
				"xn--djty4k": _3,
				"岩手": _3,
				"xn--klty5x": _3,
				"島根": _3,
				"xn--kltx9a": _3,
				"広島": _3,
				"xn--kltp7d": _3,
				"徳島": _3,
				"xn--c3s14m": _3,
				"愛媛": _3,
				"xn--vgu402c": _3,
				"愛知": _3,
				"xn--efvn9s": _3,
				"新潟": _3,
				"xn--1lqs71d": _3,
				"東京": _3,
				"xn--4pvxs": _3,
				"栃木": _3,
				"xn--uuwu58a": _3,
				"沖縄": _3,
				"xn--zbx025d": _3,
				"滋賀": _3,
				"xn--8pvr4u": _3,
				"熊本": _3,
				"xn--5rtp49c": _3,
				"石川": _3,
				"xn--ntso0iqx3a": _3,
				"神奈川": _3,
				"xn--elqq16h": _3,
				"福井": _3,
				"xn--4it168d": _3,
				"福岡": _3,
				"xn--klt787d": _3,
				"福島": _3,
				"xn--rny31h": _3,
				"秋田": _3,
				"xn--7t0a264c": _3,
				"群馬": _3,
				"xn--uist22h": _3,
				"茨城": _3,
				"xn--8ltr62k": _3,
				"長崎": _3,
				"xn--2m4a15e": _3,
				"長野": _3,
				"xn--32vp30h": _3,
				"青森": _3,
				"xn--4it797k": _3,
				"静岡": _3,
				"xn--5rtq34k": _3,
				"香川": _3,
				"xn--k7yn95e": _3,
				"高知": _3,
				"xn--tor131o": _3,
				"鳥取": _3,
				"xn--d5qv7z876c": _3,
				"鹿児島": _3,
				"kawasaki": _18,
				"kitakyushu": _18,
				"kobe": _18,
				"nagoya": _18,
				"sapporo": _18,
				"sendai": _18,
				"yokohama": _18,
				"buyshop": _4,
				"fashionstore": _4,
				"handcrafted": _4,
				"kawaiishop": _4,
				"supersale": _4,
				"theshop": _4,
				"0am": _4,
				"0g0": _4,
				"0j0": _4,
				"0t0": _4,
				"mydns": _4,
				"pgw": _4,
				"wjg": _4,
				"usercontent": _4,
				"angry": _4,
				"babyblue": _4,
				"babymilk": _4,
				"backdrop": _4,
				"bambina": _4,
				"bitter": _4,
				"blush": _4,
				"boo": _4,
				"boy": _4,
				"boyfriend": _4,
				"but": _4,
				"candypop": _4,
				"capoo": _4,
				"catfood": _4,
				"cheap": _4,
				"chicappa": _4,
				"chillout": _4,
				"chips": _4,
				"chowder": _4,
				"chu": _4,
				"ciao": _4,
				"cocotte": _4,
				"coolblog": _4,
				"cranky": _4,
				"cutegirl": _4,
				"daa": _4,
				"deca": _4,
				"deci": _4,
				"digick": _4,
				"egoism": _4,
				"fakefur": _4,
				"fem": _4,
				"flier": _4,
				"floppy": _4,
				"fool": _4,
				"frenchkiss": _4,
				"girlfriend": _4,
				"girly": _4,
				"gloomy": _4,
				"gonna": _4,
				"greater": _4,
				"hacca": _4,
				"heavy": _4,
				"her": _4,
				"hiho": _4,
				"hippy": _4,
				"holy": _4,
				"hungry": _4,
				"icurus": _4,
				"itigo": _4,
				"jellybean": _4,
				"kikirara": _4,
				"kill": _4,
				"kilo": _4,
				"kuron": _4,
				"littlestar": _4,
				"lolipopmc": _4,
				"lolitapunk": _4,
				"lomo": _4,
				"lovepop": _4,
				"lovesick": _4,
				"main": _4,
				"mods": _4,
				"mond": _4,
				"mongolian": _4,
				"moo": _4,
				"namaste": _4,
				"nikita": _4,
				"nobushi": _4,
				"noor": _4,
				"oops": _4,
				"parallel": _4,
				"parasite": _4,
				"pecori": _4,
				"peewee": _4,
				"penne": _4,
				"pepper": _4,
				"perma": _4,
				"pigboat": _4,
				"pinoko": _4,
				"punyu": _4,
				"pupu": _4,
				"pussycat": _4,
				"pya": _4,
				"raindrop": _4,
				"readymade": _4,
				"sadist": _4,
				"schoolbus": _4,
				"secret": _4,
				"staba": _4,
				"stripper": _4,
				"sub": _4,
				"sunnyday": _4,
				"thick": _4,
				"tonkotsu": _4,
				"under": _4,
				"upper": _4,
				"velvet": _4,
				"verse": _4,
				"versus": _4,
				"vivian": _4,
				"watson": _4,
				"weblike": _4,
				"whitesnow": _4,
				"zombie": _4,
				"hateblo": _4,
				"hatenablog": _4,
				"hatenadiary": _4,
				"2-d": _4,
				"bona": _4,
				"crap": _4,
				"daynight": _4,
				"eek": _4,
				"flop": _4,
				"halfmoon": _4,
				"jeez": _4,
				"matrix": _4,
				"mimoza": _4,
				"netgamers": _4,
				"nyanta": _4,
				"o0o0": _4,
				"rdy": _4,
				"rgr": _4,
				"rulez": _4,
				"sakurastorage": [0, {
					"isk01": _55,
					"isk02": _55
				}],
				"saloon": _4,
				"sblo": _4,
				"skr": _4,
				"tank": _4,
				"uh-oh": _4,
				"undo": _4,
				"webaccel": [0, {
					"rs": _4,
					"user": _4
				}],
				"websozai": _4,
				"xii": _4
			}],
			"ke": [1, {
				"ac": _3,
				"co": _3,
				"go": _3,
				"info": _3,
				"me": _3,
				"mobi": _3,
				"ne": _3,
				"or": _3,
				"sc": _3
			}],
			"kg": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"mil": _3,
				"net": _3,
				"org": _3,
				"us": _4
			}],
			"kh": _18,
			"ki": _56,
			"km": [1, {
				"ass": _3,
				"com": _3,
				"edu": _3,
				"gov": _3,
				"mil": _3,
				"nom": _3,
				"org": _3,
				"prd": _3,
				"tm": _3,
				"asso": _3,
				"coop": _3,
				"gouv": _3,
				"medecin": _3,
				"notaires": _3,
				"pharmaciens": _3,
				"presse": _3,
				"veterinaire": _3
			}],
			"kn": [1, {
				"edu": _3,
				"gov": _3,
				"net": _3,
				"org": _3
			}],
			"kp": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"org": _3,
				"rep": _3,
				"tra": _3
			}],
			"kr": [1, {
				"ac": _3,
				"ai": _3,
				"co": _3,
				"es": _3,
				"go": _3,
				"hs": _3,
				"io": _3,
				"it": _3,
				"kg": _3,
				"me": _3,
				"mil": _3,
				"ms": _3,
				"ne": _3,
				"or": _3,
				"pe": _3,
				"re": _3,
				"sc": _3,
				"busan": _3,
				"chungbuk": _3,
				"chungnam": _3,
				"daegu": _3,
				"daejeon": _3,
				"gangwon": _3,
				"gwangju": _3,
				"gyeongbuk": _3,
				"gyeonggi": _3,
				"gyeongnam": _3,
				"incheon": _3,
				"jeju": _3,
				"jeonbuk": _3,
				"jeonnam": _3,
				"seoul": _3,
				"ulsan": _3,
				"c01": _4,
				"eliv-dns": _4
			}],
			"kw": [1, {
				"com": _3,
				"edu": _3,
				"emb": _3,
				"gov": _3,
				"ind": _3,
				"net": _3,
				"org": _3
			}],
			"ky": _45,
			"kz": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"mil": _3,
				"net": _3,
				"org": _3,
				"jcloud": _4
			}],
			"la": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"info": _3,
				"int": _3,
				"net": _3,
				"org": _3,
				"per": _3,
				"bnr": _4
			}],
			"lb": _5,
			"lc": [1, {
				"co": _3,
				"com": _3,
				"edu": _3,
				"gov": _3,
				"net": _3,
				"org": _3,
				"oy": _4
			}],
			"li": _3,
			"lk": [1, {
				"ac": _3,
				"assn": _3,
				"com": _3,
				"edu": _3,
				"gov": _3,
				"grp": _3,
				"hotel": _3,
				"int": _3,
				"ltd": _3,
				"net": _3,
				"ngo": _3,
				"org": _3,
				"sch": _3,
				"soc": _3,
				"web": _3
			}],
			"lr": _5,
			"ls": [1, {
				"ac": _3,
				"biz": _3,
				"co": _3,
				"edu": _3,
				"gov": _3,
				"info": _3,
				"net": _3,
				"org": _3,
				"sc": _3
			}],
			"lt": _11,
			"lu": [1, { "123website": _4 }],
			"lv": [1, {
				"asn": _3,
				"com": _3,
				"conf": _3,
				"edu": _3,
				"gov": _3,
				"id": _3,
				"mil": _3,
				"net": _3,
				"org": _3
			}],
			"ly": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"id": _3,
				"med": _3,
				"net": _3,
				"org": _3,
				"plc": _3,
				"sch": _3
			}],
			"ma": [1, {
				"ac": _3,
				"co": _3,
				"gov": _3,
				"net": _3,
				"org": _3,
				"press": _3
			}],
			"mc": [1, {
				"asso": _3,
				"tm": _3
			}],
			"md": [1, { "ir": _4 }],
			"me": [1, {
				"ac": _3,
				"co": _3,
				"edu": _3,
				"gov": _3,
				"its": _3,
				"net": _3,
				"org": _3,
				"priv": _3,
				"c66": _4,
				"craft": _4,
				"edgestack": _4,
				"filegear": _4,
				"glitch": _4,
				"filegear-sg": _4,
				"lohmus": _4,
				"barsy": _4,
				"mcdir": _4,
				"brasilia": _4,
				"ddns": _4,
				"dnsfor": _4,
				"hopto": _4,
				"loginto": _4,
				"noip": _4,
				"webhop": _4,
				"soundcast": _4,
				"tcp4": _4,
				"vp4": _4,
				"diskstation": _4,
				"dscloud": _4,
				"i234": _4,
				"myds": _4,
				"synology": _4,
				"transip": _44,
				"nohost": _4
			}],
			"mg": [1, {
				"co": _3,
				"com": _3,
				"edu": _3,
				"gov": _3,
				"mil": _3,
				"nom": _3,
				"org": _3,
				"prd": _3
			}],
			"mh": _3,
			"mil": _3,
			"mk": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"inf": _3,
				"name": _3,
				"net": _3,
				"org": _3
			}],
			"ml": [1, {
				"ac": _3,
				"art": _3,
				"asso": _3,
				"com": _3,
				"edu": _3,
				"gouv": _3,
				"gov": _3,
				"info": _3,
				"inst": _3,
				"net": _3,
				"org": _3,
				"pr": _3,
				"presse": _3
			}],
			"mm": _18,
			"mn": [1, {
				"edu": _3,
				"gov": _3,
				"org": _3,
				"nyc": _4
			}],
			"mo": _5,
			"mobi": [1, {
				"barsy": _4,
				"dscloud": _4
			}],
			"mp": [1, { "ju": _4 }],
			"mq": _3,
			"mr": _11,
			"ms": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"net": _3,
				"org": _3,
				"minisite": _4
			}],
			"mt": _45,
			"mu": [1, {
				"ac": _3,
				"co": _3,
				"com": _3,
				"gov": _3,
				"net": _3,
				"or": _3,
				"org": _3
			}],
			"museum": _3,
			"mv": [1, {
				"aero": _3,
				"biz": _3,
				"com": _3,
				"coop": _3,
				"edu": _3,
				"gov": _3,
				"info": _3,
				"int": _3,
				"mil": _3,
				"museum": _3,
				"name": _3,
				"net": _3,
				"org": _3,
				"pro": _3
			}],
			"mw": [1, {
				"ac": _3,
				"biz": _3,
				"co": _3,
				"com": _3,
				"coop": _3,
				"edu": _3,
				"gov": _3,
				"int": _3,
				"net": _3,
				"org": _3
			}],
			"mx": [1, {
				"com": _3,
				"edu": _3,
				"gob": _3,
				"net": _3,
				"org": _3
			}],
			"my": [1, {
				"biz": _3,
				"com": _3,
				"edu": _3,
				"gov": _3,
				"mil": _3,
				"name": _3,
				"net": _3,
				"org": _3
			}],
			"mz": [1, {
				"ac": _3,
				"adv": _3,
				"co": _3,
				"edu": _3,
				"gov": _3,
				"mil": _3,
				"net": _3,
				"org": _3
			}],
			"na": [1, {
				"alt": _3,
				"co": _3,
				"com": _3,
				"gov": _3,
				"net": _3,
				"org": _3
			}],
			"name": [1, {
				"her": _59,
				"his": _59
			}],
			"nc": [1, {
				"asso": _3,
				"nom": _3
			}],
			"ne": _3,
			"net": [1, {
				"adobeaemcloud": _4,
				"adobeio-static": _4,
				"adobeioruntime": _4,
				"akadns": _4,
				"akamai": _4,
				"akamai-staging": _4,
				"akamaiedge": _4,
				"akamaiedge-staging": _4,
				"akamaihd": _4,
				"akamaihd-staging": _4,
				"akamaiorigin": _4,
				"akamaiorigin-staging": _4,
				"akamaized": _4,
				"akamaized-staging": _4,
				"edgekey": _4,
				"edgekey-staging": _4,
				"edgesuite": _4,
				"edgesuite-staging": _4,
				"alwaysdata": _4,
				"myamaze": _4,
				"cloudfront": _4,
				"appudo": _4,
				"atlassian-dev": [0, { "prod": _52 }],
				"myfritz": _4,
				"onavstack": _4,
				"shopselect": _4,
				"blackbaudcdn": _4,
				"boomla": _4,
				"bplaced": _4,
				"square7": _4,
				"cdn77": [0, { "r": _4 }],
				"cdn77-ssl": _4,
				"gb": _4,
				"hu": _4,
				"jp": _4,
				"se": _4,
				"uk": _4,
				"clickrising": _4,
				"ddns-ip": _4,
				"dns-cloud": _4,
				"dns-dynamic": _4,
				"cloudaccess": _4,
				"cloudflare": [2, { "cdn": _4 }],
				"cloudflareanycast": _52,
				"cloudflarecn": _52,
				"cloudflareglobal": _52,
				"ctfcloud": _4,
				"feste-ip": _4,
				"knx-server": _4,
				"static-access": _4,
				"cryptonomic": _7,
				"dattolocal": _4,
				"mydatto": _4,
				"debian": _4,
				"definima": _4,
				"deno": _4,
				"at-band-camp": _4,
				"blogdns": _4,
				"broke-it": _4,
				"buyshouses": _4,
				"dnsalias": _4,
				"dnsdojo": _4,
				"does-it": _4,
				"dontexist": _4,
				"dynalias": _4,
				"dynathome": _4,
				"endofinternet": _4,
				"from-az": _4,
				"from-co": _4,
				"from-la": _4,
				"from-ny": _4,
				"gets-it": _4,
				"ham-radio-op": _4,
				"homeftp": _4,
				"homeip": _4,
				"homelinux": _4,
				"homeunix": _4,
				"in-the-band": _4,
				"is-a-chef": _4,
				"is-a-geek": _4,
				"isa-geek": _4,
				"kicks-ass": _4,
				"office-on-the": _4,
				"podzone": _4,
				"scrapper-site": _4,
				"selfip": _4,
				"sells-it": _4,
				"servebbs": _4,
				"serveftp": _4,
				"thruhere": _4,
				"webhop": _4,
				"casacam": _4,
				"dynu": _4,
				"dynv6": _4,
				"twmail": _4,
				"ru": _4,
				"channelsdvr": [2, { "u": _4 }],
				"fastly": [0, {
					"freetls": _4,
					"map": _4,
					"prod": [0, {
						"a": _4,
						"global": _4
					}],
					"ssl": [0, {
						"a": _4,
						"b": _4,
						"global": _4
					}]
				}],
				"fastlylb": [2, { "map": _4 }],
				"edgeapp": _4,
				"keyword-on": _4,
				"live-on": _4,
				"server-on": _4,
				"cdn-edges": _4,
				"heteml": _4,
				"cloudfunctions": _4,
				"grafana-dev": _4,
				"iobb": _4,
				"moonscale": _4,
				"in-dsl": _4,
				"in-vpn": _4,
				"oninferno": _4,
				"botdash": _4,
				"apps-1and1": _4,
				"ipifony": _4,
				"cloudjiffy": [2, {
					"fra1-de": _4,
					"west1-us": _4
				}],
				"elastx": [0, {
					"jls-sto1": _4,
					"jls-sto2": _4,
					"jls-sto3": _4
				}],
				"massivegrid": [0, { "paas": [0, {
					"fr-1": _4,
					"lon-1": _4,
					"lon-2": _4,
					"ny-1": _4,
					"ny-2": _4,
					"sg-1": _4
				}] }],
				"saveincloud": [0, {
					"jelastic": _4,
					"nordeste-idc": _4
				}],
				"scaleforce": _46,
				"kinghost": _4,
				"uni5": _4,
				"krellian": _4,
				"ggff": _4,
				"localcert": _4,
				"localhostcert": _4,
				"localto": _7,
				"barsy": _4,
				"memset": _4,
				"azure-api": _4,
				"azure-mobile": _4,
				"azureedge": _4,
				"azurefd": _4,
				"azurestaticapps": [2, {
					"1": _4,
					"2": _4,
					"3": _4,
					"4": _4,
					"5": _4,
					"6": _4,
					"7": _4,
					"centralus": _4,
					"eastasia": _4,
					"eastus2": _4,
					"westeurope": _4,
					"westus2": _4
				}],
				"azurewebsites": _4,
				"cloudapp": _4,
				"trafficmanager": _4,
				"windows": [0, {
					"core": [0, { "blob": _4 }],
					"servicebus": _4
				}],
				"mynetname": [0, { "sn": _4 }],
				"routingthecloud": _4,
				"bounceme": _4,
				"ddns": _4,
				"eating-organic": _4,
				"mydissent": _4,
				"myeffect": _4,
				"mymediapc": _4,
				"mypsx": _4,
				"mysecuritycamera": _4,
				"nhlfan": _4,
				"no-ip": _4,
				"pgafan": _4,
				"privatizehealthinsurance": _4,
				"redirectme": _4,
				"serveblog": _4,
				"serveminecraft": _4,
				"sytes": _4,
				"dnsup": _4,
				"hicam": _4,
				"now-dns": _4,
				"ownip": _4,
				"vpndns": _4,
				"cloudycluster": _4,
				"ovh": [0, {
					"hosting": _7,
					"webpaas": _7
				}],
				"rackmaze": _4,
				"myradweb": _4,
				"in": _4,
				"subsc-pay": _4,
				"squares": _4,
				"schokokeks": _4,
				"firewall-gateway": _4,
				"seidat": _4,
				"senseering": _4,
				"siteleaf": _4,
				"mafelo": _4,
				"myspreadshop": _4,
				"vps-host": [2, { "jelastic": [0, {
					"atl": _4,
					"njs": _4,
					"ric": _4
				}] }],
				"srcf": [0, {
					"soc": _4,
					"user": _4
				}],
				"supabase": _4,
				"dsmynas": _4,
				"familyds": _4,
				"ts": [2, { "c": _7 }],
				"torproject": [2, { "pages": _4 }],
				"vusercontent": _4,
				"reserve-online": _4,
				"community-pro": _4,
				"meinforum": _4,
				"yandexcloud": [2, {
					"storage": _4,
					"website": _4
				}],
				"za": _4
			}],
			"nf": [1, {
				"arts": _3,
				"com": _3,
				"firm": _3,
				"info": _3,
				"net": _3,
				"other": _3,
				"per": _3,
				"rec": _3,
				"store": _3,
				"web": _3
			}],
			"ng": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"i": _3,
				"mil": _3,
				"mobi": _3,
				"name": _3,
				"net": _3,
				"org": _3,
				"sch": _3,
				"biz": [2, {
					"co": _4,
					"dl": _4,
					"go": _4,
					"lg": _4,
					"on": _4
				}],
				"col": _4,
				"firm": _4,
				"gen": _4,
				"ltd": _4,
				"ngo": _4,
				"plc": _4
			}],
			"ni": [1, {
				"ac": _3,
				"biz": _3,
				"co": _3,
				"com": _3,
				"edu": _3,
				"gob": _3,
				"in": _3,
				"info": _3,
				"int": _3,
				"mil": _3,
				"net": _3,
				"nom": _3,
				"org": _3,
				"web": _3
			}],
			"nl": [1, {
				"co": _4,
				"hosting-cluster": _4,
				"gov": _4,
				"khplay": _4,
				"123website": _4,
				"myspreadshop": _4,
				"transurl": _7,
				"cistron": _4,
				"demon": _4
			}],
			"no": [1, {
				"fhs": _3,
				"folkebibl": _3,
				"fylkesbibl": _3,
				"idrett": _3,
				"museum": _3,
				"priv": _3,
				"vgs": _3,
				"dep": _3,
				"herad": _3,
				"kommune": _3,
				"mil": _3,
				"stat": _3,
				"aa": _60,
				"ah": _60,
				"bu": _60,
				"fm": _60,
				"hl": _60,
				"hm": _60,
				"jan-mayen": _60,
				"mr": _60,
				"nl": _60,
				"nt": _60,
				"of": _60,
				"ol": _60,
				"oslo": _60,
				"rl": _60,
				"sf": _60,
				"st": _60,
				"svalbard": _60,
				"tm": _60,
				"tr": _60,
				"va": _60,
				"vf": _60,
				"akrehamn": _3,
				"xn--krehamn-dxa": _3,
				"åkrehamn": _3,
				"algard": _3,
				"xn--lgrd-poac": _3,
				"ålgård": _3,
				"arna": _3,
				"bronnoysund": _3,
				"xn--brnnysund-m8ac": _3,
				"brønnøysund": _3,
				"brumunddal": _3,
				"bryne": _3,
				"drobak": _3,
				"xn--drbak-wua": _3,
				"drøbak": _3,
				"egersund": _3,
				"fetsund": _3,
				"floro": _3,
				"xn--flor-jra": _3,
				"florø": _3,
				"fredrikstad": _3,
				"hokksund": _3,
				"honefoss": _3,
				"xn--hnefoss-q1a": _3,
				"hønefoss": _3,
				"jessheim": _3,
				"jorpeland": _3,
				"xn--jrpeland-54a": _3,
				"jørpeland": _3,
				"kirkenes": _3,
				"kopervik": _3,
				"krokstadelva": _3,
				"langevag": _3,
				"xn--langevg-jxa": _3,
				"langevåg": _3,
				"leirvik": _3,
				"mjondalen": _3,
				"xn--mjndalen-64a": _3,
				"mjøndalen": _3,
				"mo-i-rana": _3,
				"mosjoen": _3,
				"xn--mosjen-eya": _3,
				"mosjøen": _3,
				"nesoddtangen": _3,
				"orkanger": _3,
				"osoyro": _3,
				"xn--osyro-wua": _3,
				"osøyro": _3,
				"raholt": _3,
				"xn--rholt-mra": _3,
				"råholt": _3,
				"sandnessjoen": _3,
				"xn--sandnessjen-ogb": _3,
				"sandnessjøen": _3,
				"skedsmokorset": _3,
				"slattum": _3,
				"spjelkavik": _3,
				"stathelle": _3,
				"stavern": _3,
				"stjordalshalsen": _3,
				"xn--stjrdalshalsen-sqb": _3,
				"stjørdalshalsen": _3,
				"tananger": _3,
				"tranby": _3,
				"vossevangen": _3,
				"aarborte": _3,
				"aejrie": _3,
				"afjord": _3,
				"xn--fjord-lra": _3,
				"åfjord": _3,
				"agdenes": _3,
				"akershus": _61,
				"aknoluokta": _3,
				"xn--koluokta-7ya57h": _3,
				"ákŋoluokta": _3,
				"al": _3,
				"xn--l-1fa": _3,
				"ål": _3,
				"alaheadju": _3,
				"xn--laheadju-7ya": _3,
				"álaheadju": _3,
				"alesund": _3,
				"xn--lesund-hua": _3,
				"ålesund": _3,
				"alstahaug": _3,
				"alta": _3,
				"xn--lt-liac": _3,
				"áltá": _3,
				"alvdal": _3,
				"amli": _3,
				"xn--mli-tla": _3,
				"åmli": _3,
				"amot": _3,
				"xn--mot-tla": _3,
				"åmot": _3,
				"andasuolo": _3,
				"andebu": _3,
				"andoy": _3,
				"xn--andy-ira": _3,
				"andøy": _3,
				"ardal": _3,
				"xn--rdal-poa": _3,
				"årdal": _3,
				"aremark": _3,
				"arendal": _3,
				"xn--s-1fa": _3,
				"ås": _3,
				"aseral": _3,
				"xn--seral-lra": _3,
				"åseral": _3,
				"asker": _3,
				"askim": _3,
				"askoy": _3,
				"xn--asky-ira": _3,
				"askøy": _3,
				"askvoll": _3,
				"asnes": _3,
				"xn--snes-poa": _3,
				"åsnes": _3,
				"audnedaln": _3,
				"aukra": _3,
				"aure": _3,
				"aurland": _3,
				"aurskog-holand": _3,
				"xn--aurskog-hland-jnb": _3,
				"aurskog-høland": _3,
				"austevoll": _3,
				"austrheim": _3,
				"averoy": _3,
				"xn--avery-yua": _3,
				"averøy": _3,
				"badaddja": _3,
				"xn--bdddj-mrabd": _3,
				"bådåddjå": _3,
				"xn--brum-voa": _3,
				"bærum": _3,
				"bahcavuotna": _3,
				"xn--bhcavuotna-s4a": _3,
				"báhcavuotna": _3,
				"bahccavuotna": _3,
				"xn--bhccavuotna-k7a": _3,
				"báhccavuotna": _3,
				"baidar": _3,
				"xn--bidr-5nac": _3,
				"báidár": _3,
				"bajddar": _3,
				"xn--bjddar-pta": _3,
				"bájddar": _3,
				"balat": _3,
				"xn--blt-elab": _3,
				"bálát": _3,
				"balestrand": _3,
				"ballangen": _3,
				"balsfjord": _3,
				"bamble": _3,
				"bardu": _3,
				"barum": _3,
				"batsfjord": _3,
				"xn--btsfjord-9za": _3,
				"båtsfjord": _3,
				"bearalvahki": _3,
				"xn--bearalvhki-y4a": _3,
				"bearalváhki": _3,
				"beardu": _3,
				"beiarn": _3,
				"berg": _3,
				"bergen": _3,
				"berlevag": _3,
				"xn--berlevg-jxa": _3,
				"berlevåg": _3,
				"bievat": _3,
				"xn--bievt-0qa": _3,
				"bievát": _3,
				"bindal": _3,
				"birkenes": _3,
				"bjarkoy": _3,
				"xn--bjarky-fya": _3,
				"bjarkøy": _3,
				"bjerkreim": _3,
				"bjugn": _3,
				"bodo": _3,
				"xn--bod-2na": _3,
				"bodø": _3,
				"bokn": _3,
				"bomlo": _3,
				"xn--bmlo-gra": _3,
				"bømlo": _3,
				"bremanger": _3,
				"bronnoy": _3,
				"xn--brnny-wuac": _3,
				"brønnøy": _3,
				"budejju": _3,
				"buskerud": _61,
				"bygland": _3,
				"bykle": _3,
				"cahcesuolo": _3,
				"xn--hcesuolo-7ya35b": _3,
				"čáhcesuolo": _3,
				"davvenjarga": _3,
				"xn--davvenjrga-y4a": _3,
				"davvenjárga": _3,
				"davvesiida": _3,
				"deatnu": _3,
				"dielddanuorri": _3,
				"divtasvuodna": _3,
				"divttasvuotna": _3,
				"donna": _3,
				"xn--dnna-gra": _3,
				"dønna": _3,
				"dovre": _3,
				"drammen": _3,
				"drangedal": _3,
				"dyroy": _3,
				"xn--dyry-ira": _3,
				"dyrøy": _3,
				"eid": _3,
				"eidfjord": _3,
				"eidsberg": _3,
				"eidskog": _3,
				"eidsvoll": _3,
				"eigersund": _3,
				"elverum": _3,
				"enebakk": _3,
				"engerdal": _3,
				"etne": _3,
				"etnedal": _3,
				"evenassi": _3,
				"xn--eveni-0qa01ga": _3,
				"evenášši": _3,
				"evenes": _3,
				"evje-og-hornnes": _3,
				"farsund": _3,
				"fauske": _3,
				"fedje": _3,
				"fet": _3,
				"finnoy": _3,
				"xn--finny-yua": _3,
				"finnøy": _3,
				"fitjar": _3,
				"fjaler": _3,
				"fjell": _3,
				"fla": _3,
				"xn--fl-zia": _3,
				"flå": _3,
				"flakstad": _3,
				"flatanger": _3,
				"flekkefjord": _3,
				"flesberg": _3,
				"flora": _3,
				"folldal": _3,
				"forde": _3,
				"xn--frde-gra": _3,
				"førde": _3,
				"forsand": _3,
				"fosnes": _3,
				"xn--frna-woa": _3,
				"fræna": _3,
				"frana": _3,
				"frei": _3,
				"frogn": _3,
				"froland": _3,
				"frosta": _3,
				"froya": _3,
				"xn--frya-hra": _3,
				"frøya": _3,
				"fuoisku": _3,
				"fuossko": _3,
				"fusa": _3,
				"fyresdal": _3,
				"gaivuotna": _3,
				"xn--givuotna-8ya": _3,
				"gáivuotna": _3,
				"galsa": _3,
				"xn--gls-elac": _3,
				"gálsá": _3,
				"gamvik": _3,
				"gangaviika": _3,
				"xn--ggaviika-8ya47h": _3,
				"gáŋgaviika": _3,
				"gaular": _3,
				"gausdal": _3,
				"giehtavuoatna": _3,
				"gildeskal": _3,
				"xn--gildeskl-g0a": _3,
				"gildeskål": _3,
				"giske": _3,
				"gjemnes": _3,
				"gjerdrum": _3,
				"gjerstad": _3,
				"gjesdal": _3,
				"gjovik": _3,
				"xn--gjvik-wua": _3,
				"gjøvik": _3,
				"gloppen": _3,
				"gol": _3,
				"gran": _3,
				"grane": _3,
				"granvin": _3,
				"gratangen": _3,
				"grimstad": _3,
				"grong": _3,
				"grue": _3,
				"gulen": _3,
				"guovdageaidnu": _3,
				"ha": _3,
				"xn--h-2fa": _3,
				"hå": _3,
				"habmer": _3,
				"xn--hbmer-xqa": _3,
				"hábmer": _3,
				"hadsel": _3,
				"xn--hgebostad-g3a": _3,
				"hægebostad": _3,
				"hagebostad": _3,
				"halden": _3,
				"halsa": _3,
				"hamar": _3,
				"hamaroy": _3,
				"hammarfeasta": _3,
				"xn--hmmrfeasta-s4ac": _3,
				"hámmárfeasta": _3,
				"hammerfest": _3,
				"hapmir": _3,
				"xn--hpmir-xqa": _3,
				"hápmir": _3,
				"haram": _3,
				"hareid": _3,
				"harstad": _3,
				"hasvik": _3,
				"hattfjelldal": _3,
				"haugesund": _3,
				"hedmark": [0, {
					"os": _3,
					"valer": _3,
					"xn--vler-qoa": _3,
					"våler": _3
				}],
				"hemne": _3,
				"hemnes": _3,
				"hemsedal": _3,
				"hitra": _3,
				"hjartdal": _3,
				"hjelmeland": _3,
				"hobol": _3,
				"xn--hobl-ira": _3,
				"hobøl": _3,
				"hof": _3,
				"hol": _3,
				"hole": _3,
				"holmestrand": _3,
				"holtalen": _3,
				"xn--holtlen-hxa": _3,
				"holtålen": _3,
				"hordaland": [0, { "os": _3 }],
				"hornindal": _3,
				"horten": _3,
				"hoyanger": _3,
				"xn--hyanger-q1a": _3,
				"høyanger": _3,
				"hoylandet": _3,
				"xn--hylandet-54a": _3,
				"høylandet": _3,
				"hurdal": _3,
				"hurum": _3,
				"hvaler": _3,
				"hyllestad": _3,
				"ibestad": _3,
				"inderoy": _3,
				"xn--indery-fya": _3,
				"inderøy": _3,
				"iveland": _3,
				"ivgu": _3,
				"jevnaker": _3,
				"jolster": _3,
				"xn--jlster-bya": _3,
				"jølster": _3,
				"jondal": _3,
				"kafjord": _3,
				"xn--kfjord-iua": _3,
				"kåfjord": _3,
				"karasjohka": _3,
				"xn--krjohka-hwab49j": _3,
				"kárášjohka": _3,
				"karasjok": _3,
				"karlsoy": _3,
				"karmoy": _3,
				"xn--karmy-yua": _3,
				"karmøy": _3,
				"kautokeino": _3,
				"klabu": _3,
				"xn--klbu-woa": _3,
				"klæbu": _3,
				"klepp": _3,
				"kongsberg": _3,
				"kongsvinger": _3,
				"kraanghke": _3,
				"xn--kranghke-b0a": _3,
				"kråanghke": _3,
				"kragero": _3,
				"xn--krager-gya": _3,
				"kragerø": _3,
				"kristiansand": _3,
				"kristiansund": _3,
				"krodsherad": _3,
				"xn--krdsherad-m8a": _3,
				"krødsherad": _3,
				"xn--kvfjord-nxa": _3,
				"kvæfjord": _3,
				"xn--kvnangen-k0a": _3,
				"kvænangen": _3,
				"kvafjord": _3,
				"kvalsund": _3,
				"kvam": _3,
				"kvanangen": _3,
				"kvinesdal": _3,
				"kvinnherad": _3,
				"kviteseid": _3,
				"kvitsoy": _3,
				"xn--kvitsy-fya": _3,
				"kvitsøy": _3,
				"laakesvuemie": _3,
				"xn--lrdal-sra": _3,
				"lærdal": _3,
				"lahppi": _3,
				"xn--lhppi-xqa": _3,
				"láhppi": _3,
				"lardal": _3,
				"larvik": _3,
				"lavagis": _3,
				"lavangen": _3,
				"leangaviika": _3,
				"xn--leagaviika-52b": _3,
				"leaŋgaviika": _3,
				"lebesby": _3,
				"leikanger": _3,
				"leirfjord": _3,
				"leka": _3,
				"leksvik": _3,
				"lenvik": _3,
				"lerdal": _3,
				"lesja": _3,
				"levanger": _3,
				"lier": _3,
				"lierne": _3,
				"lillehammer": _3,
				"lillesand": _3,
				"lindas": _3,
				"xn--linds-pra": _3,
				"lindås": _3,
				"lindesnes": _3,
				"loabat": _3,
				"xn--loabt-0qa": _3,
				"loabát": _3,
				"lodingen": _3,
				"xn--ldingen-q1a": _3,
				"lødingen": _3,
				"lom": _3,
				"loppa": _3,
				"lorenskog": _3,
				"xn--lrenskog-54a": _3,
				"lørenskog": _3,
				"loten": _3,
				"xn--lten-gra": _3,
				"løten": _3,
				"lund": _3,
				"lunner": _3,
				"luroy": _3,
				"xn--lury-ira": _3,
				"lurøy": _3,
				"luster": _3,
				"lyngdal": _3,
				"lyngen": _3,
				"malatvuopmi": _3,
				"xn--mlatvuopmi-s4a": _3,
				"málatvuopmi": _3,
				"malselv": _3,
				"xn--mlselv-iua": _3,
				"målselv": _3,
				"malvik": _3,
				"mandal": _3,
				"marker": _3,
				"marnardal": _3,
				"masfjorden": _3,
				"masoy": _3,
				"xn--msy-ula0h": _3,
				"måsøy": _3,
				"matta-varjjat": _3,
				"xn--mtta-vrjjat-k7af": _3,
				"mátta-várjjat": _3,
				"meland": _3,
				"meldal": _3,
				"melhus": _3,
				"meloy": _3,
				"xn--mely-ira": _3,
				"meløy": _3,
				"meraker": _3,
				"xn--merker-kua": _3,
				"meråker": _3,
				"midsund": _3,
				"midtre-gauldal": _3,
				"moareke": _3,
				"xn--moreke-jua": _3,
				"moåreke": _3,
				"modalen": _3,
				"modum": _3,
				"molde": _3,
				"more-og-romsdal": [0, {
					"heroy": _3,
					"sande": _3
				}],
				"xn--mre-og-romsdal-qqb": [0, {
					"xn--hery-ira": _3,
					"sande": _3
				}],
				"møre-og-romsdal": [0, {
					"herøy": _3,
					"sande": _3
				}],
				"moskenes": _3,
				"moss": _3,
				"mosvik": _3,
				"muosat": _3,
				"xn--muost-0qa": _3,
				"muosát": _3,
				"naamesjevuemie": _3,
				"xn--nmesjevuemie-tcba": _3,
				"nååmesjevuemie": _3,
				"xn--nry-yla5g": _3,
				"nærøy": _3,
				"namdalseid": _3,
				"namsos": _3,
				"namsskogan": _3,
				"nannestad": _3,
				"naroy": _3,
				"narviika": _3,
				"narvik": _3,
				"naustdal": _3,
				"navuotna": _3,
				"xn--nvuotna-hwa": _3,
				"návuotna": _3,
				"nedre-eiker": _3,
				"nesna": _3,
				"nesodden": _3,
				"nesseby": _3,
				"nesset": _3,
				"nissedal": _3,
				"nittedal": _3,
				"nord-aurdal": _3,
				"nord-fron": _3,
				"nord-odal": _3,
				"norddal": _3,
				"nordkapp": _3,
				"nordland": [0, {
					"bo": _3,
					"xn--b-5ga": _3,
					"bø": _3,
					"heroy": _3,
					"xn--hery-ira": _3,
					"herøy": _3
				}],
				"nordre-land": _3,
				"nordreisa": _3,
				"nore-og-uvdal": _3,
				"notodden": _3,
				"notteroy": _3,
				"xn--nttery-byae": _3,
				"nøtterøy": _3,
				"odda": _3,
				"oksnes": _3,
				"xn--ksnes-uua": _3,
				"øksnes": _3,
				"omasvuotna": _3,
				"oppdal": _3,
				"oppegard": _3,
				"xn--oppegrd-ixa": _3,
				"oppegård": _3,
				"orkdal": _3,
				"orland": _3,
				"xn--rland-uua": _3,
				"ørland": _3,
				"orskog": _3,
				"xn--rskog-uua": _3,
				"ørskog": _3,
				"orsta": _3,
				"xn--rsta-fra": _3,
				"ørsta": _3,
				"osen": _3,
				"osteroy": _3,
				"xn--ostery-fya": _3,
				"osterøy": _3,
				"ostfold": [0, { "valer": _3 }],
				"xn--stfold-9xa": [0, { "xn--vler-qoa": _3 }],
				"østfold": [0, { "våler": _3 }],
				"ostre-toten": _3,
				"xn--stre-toten-zcb": _3,
				"østre-toten": _3,
				"overhalla": _3,
				"ovre-eiker": _3,
				"xn--vre-eiker-k8a": _3,
				"øvre-eiker": _3,
				"oyer": _3,
				"xn--yer-zna": _3,
				"øyer": _3,
				"oygarden": _3,
				"xn--ygarden-p1a": _3,
				"øygarden": _3,
				"oystre-slidre": _3,
				"xn--ystre-slidre-ujb": _3,
				"øystre-slidre": _3,
				"porsanger": _3,
				"porsangu": _3,
				"xn--porsgu-sta26f": _3,
				"porsáŋgu": _3,
				"porsgrunn": _3,
				"rade": _3,
				"xn--rde-ula": _3,
				"råde": _3,
				"radoy": _3,
				"xn--rady-ira": _3,
				"radøy": _3,
				"xn--rlingen-mxa": _3,
				"rælingen": _3,
				"rahkkeravju": _3,
				"xn--rhkkervju-01af": _3,
				"ráhkkerávju": _3,
				"raisa": _3,
				"xn--risa-5na": _3,
				"ráisa": _3,
				"rakkestad": _3,
				"ralingen": _3,
				"rana": _3,
				"randaberg": _3,
				"rauma": _3,
				"rendalen": _3,
				"rennebu": _3,
				"rennesoy": _3,
				"xn--rennesy-v1a": _3,
				"rennesøy": _3,
				"rindal": _3,
				"ringebu": _3,
				"ringerike": _3,
				"ringsaker": _3,
				"risor": _3,
				"xn--risr-ira": _3,
				"risør": _3,
				"rissa": _3,
				"roan": _3,
				"rodoy": _3,
				"xn--rdy-0nab": _3,
				"rødøy": _3,
				"rollag": _3,
				"romsa": _3,
				"romskog": _3,
				"xn--rmskog-bya": _3,
				"rømskog": _3,
				"roros": _3,
				"xn--rros-gra": _3,
				"røros": _3,
				"rost": _3,
				"xn--rst-0na": _3,
				"røst": _3,
				"royken": _3,
				"xn--ryken-vua": _3,
				"røyken": _3,
				"royrvik": _3,
				"xn--ryrvik-bya": _3,
				"røyrvik": _3,
				"ruovat": _3,
				"rygge": _3,
				"salangen": _3,
				"salat": _3,
				"xn--slat-5na": _3,
				"sálat": _3,
				"xn--slt-elab": _3,
				"sálát": _3,
				"saltdal": _3,
				"samnanger": _3,
				"sandefjord": _3,
				"sandnes": _3,
				"sandoy": _3,
				"xn--sandy-yua": _3,
				"sandøy": _3,
				"sarpsborg": _3,
				"sauda": _3,
				"sauherad": _3,
				"sel": _3,
				"selbu": _3,
				"selje": _3,
				"seljord": _3,
				"siellak": _3,
				"sigdal": _3,
				"siljan": _3,
				"sirdal": _3,
				"skanit": _3,
				"xn--sknit-yqa": _3,
				"skánit": _3,
				"skanland": _3,
				"xn--sknland-fxa": _3,
				"skånland": _3,
				"skaun": _3,
				"skedsmo": _3,
				"ski": _3,
				"skien": _3,
				"skierva": _3,
				"xn--skierv-uta": _3,
				"skiervá": _3,
				"skiptvet": _3,
				"skjak": _3,
				"xn--skjk-soa": _3,
				"skjåk": _3,
				"skjervoy": _3,
				"xn--skjervy-v1a": _3,
				"skjervøy": _3,
				"skodje": _3,
				"smola": _3,
				"xn--smla-hra": _3,
				"smøla": _3,
				"snaase": _3,
				"xn--snase-nra": _3,
				"snåase": _3,
				"snasa": _3,
				"xn--snsa-roa": _3,
				"snåsa": _3,
				"snillfjord": _3,
				"snoasa": _3,
				"sogndal": _3,
				"sogne": _3,
				"xn--sgne-gra": _3,
				"søgne": _3,
				"sokndal": _3,
				"sola": _3,
				"solund": _3,
				"somna": _3,
				"xn--smna-gra": _3,
				"sømna": _3,
				"sondre-land": _3,
				"xn--sndre-land-0cb": _3,
				"søndre-land": _3,
				"songdalen": _3,
				"sor-aurdal": _3,
				"xn--sr-aurdal-l8a": _3,
				"sør-aurdal": _3,
				"sor-fron": _3,
				"xn--sr-fron-q1a": _3,
				"sør-fron": _3,
				"sor-odal": _3,
				"xn--sr-odal-q1a": _3,
				"sør-odal": _3,
				"sor-varanger": _3,
				"xn--sr-varanger-ggb": _3,
				"sør-varanger": _3,
				"sorfold": _3,
				"xn--srfold-bya": _3,
				"sørfold": _3,
				"sorreisa": _3,
				"xn--srreisa-q1a": _3,
				"sørreisa": _3,
				"sortland": _3,
				"sorum": _3,
				"xn--srum-gra": _3,
				"sørum": _3,
				"spydeberg": _3,
				"stange": _3,
				"stavanger": _3,
				"steigen": _3,
				"steinkjer": _3,
				"stjordal": _3,
				"xn--stjrdal-s1a": _3,
				"stjørdal": _3,
				"stokke": _3,
				"stor-elvdal": _3,
				"stord": _3,
				"stordal": _3,
				"storfjord": _3,
				"strand": _3,
				"stranda": _3,
				"stryn": _3,
				"sula": _3,
				"suldal": _3,
				"sund": _3,
				"sunndal": _3,
				"surnadal": _3,
				"sveio": _3,
				"svelvik": _3,
				"sykkylven": _3,
				"tana": _3,
				"telemark": [0, {
					"bo": _3,
					"xn--b-5ga": _3,
					"bø": _3
				}],
				"time": _3,
				"tingvoll": _3,
				"tinn": _3,
				"tjeldsund": _3,
				"tjome": _3,
				"xn--tjme-hra": _3,
				"tjøme": _3,
				"tokke": _3,
				"tolga": _3,
				"tonsberg": _3,
				"xn--tnsberg-q1a": _3,
				"tønsberg": _3,
				"torsken": _3,
				"xn--trna-woa": _3,
				"træna": _3,
				"trana": _3,
				"tranoy": _3,
				"xn--trany-yua": _3,
				"tranøy": _3,
				"troandin": _3,
				"trogstad": _3,
				"xn--trgstad-r1a": _3,
				"trøgstad": _3,
				"tromsa": _3,
				"tromso": _3,
				"xn--troms-zua": _3,
				"tromsø": _3,
				"trondheim": _3,
				"trysil": _3,
				"tvedestrand": _3,
				"tydal": _3,
				"tynset": _3,
				"tysfjord": _3,
				"tysnes": _3,
				"xn--tysvr-vra": _3,
				"tysvær": _3,
				"tysvar": _3,
				"ullensaker": _3,
				"ullensvang": _3,
				"ulvik": _3,
				"unjarga": _3,
				"xn--unjrga-rta": _3,
				"unjárga": _3,
				"utsira": _3,
				"vaapste": _3,
				"vadso": _3,
				"xn--vads-jra": _3,
				"vadsø": _3,
				"xn--vry-yla5g": _3,
				"værøy": _3,
				"vaga": _3,
				"xn--vg-yiab": _3,
				"vågå": _3,
				"vagan": _3,
				"xn--vgan-qoa": _3,
				"vågan": _3,
				"vagsoy": _3,
				"xn--vgsy-qoa0j": _3,
				"vågsøy": _3,
				"vaksdal": _3,
				"valle": _3,
				"vang": _3,
				"vanylven": _3,
				"vardo": _3,
				"xn--vard-jra": _3,
				"vardø": _3,
				"varggat": _3,
				"xn--vrggt-xqad": _3,
				"várggát": _3,
				"varoy": _3,
				"vefsn": _3,
				"vega": _3,
				"vegarshei": _3,
				"xn--vegrshei-c0a": _3,
				"vegårshei": _3,
				"vennesla": _3,
				"verdal": _3,
				"verran": _3,
				"vestby": _3,
				"vestfold": [0, { "sande": _3 }],
				"vestnes": _3,
				"vestre-slidre": _3,
				"vestre-toten": _3,
				"vestvagoy": _3,
				"xn--vestvgy-ixa6o": _3,
				"vestvågøy": _3,
				"vevelstad": _3,
				"vik": _3,
				"vikna": _3,
				"vindafjord": _3,
				"voagat": _3,
				"volda": _3,
				"voss": _3,
				"co": _4,
				"123hjemmeside": _4,
				"myspreadshop": _4
			}],
			"np": _18,
			"nr": _56,
			"nu": [1, {
				"merseine": _4,
				"mine": _4,
				"shacknet": _4,
				"enterprisecloud": _4
			}],
			"nz": [1, {
				"ac": _3,
				"co": _3,
				"cri": _3,
				"geek": _3,
				"gen": _3,
				"govt": _3,
				"health": _3,
				"iwi": _3,
				"kiwi": _3,
				"maori": _3,
				"xn--mori-qsa": _3,
				"māori": _3,
				"mil": _3,
				"net": _3,
				"org": _3,
				"parliament": _3,
				"school": _3,
				"cloudns": _4
			}],
			"om": [1, {
				"co": _3,
				"com": _3,
				"edu": _3,
				"gov": _3,
				"med": _3,
				"museum": _3,
				"net": _3,
				"org": _3,
				"pro": _3
			}],
			"onion": _3,
			"org": [1, {
				"altervista": _4,
				"pimienta": _4,
				"poivron": _4,
				"potager": _4,
				"sweetpepper": _4,
				"cdn77": [0, {
					"c": _4,
					"rsc": _4
				}],
				"cdn77-secure": [0, { "origin": [0, { "ssl": _4 }] }],
				"ae": _4,
				"cloudns": _4,
				"ip-dynamic": _4,
				"ddnss": _4,
				"dpdns": _4,
				"duckdns": _4,
				"tunk": _4,
				"blogdns": _4,
				"blogsite": _4,
				"boldlygoingnowhere": _4,
				"dnsalias": _4,
				"dnsdojo": _4,
				"doesntexist": _4,
				"dontexist": _4,
				"doomdns": _4,
				"dvrdns": _4,
				"dynalias": _4,
				"dyndns": [2, {
					"go": _4,
					"home": _4
				}],
				"endofinternet": _4,
				"endoftheinternet": _4,
				"from-me": _4,
				"game-host": _4,
				"gotdns": _4,
				"hobby-site": _4,
				"homedns": _4,
				"homeftp": _4,
				"homelinux": _4,
				"homeunix": _4,
				"is-a-bruinsfan": _4,
				"is-a-candidate": _4,
				"is-a-celticsfan": _4,
				"is-a-chef": _4,
				"is-a-geek": _4,
				"is-a-knight": _4,
				"is-a-linux-user": _4,
				"is-a-patsfan": _4,
				"is-a-soxfan": _4,
				"is-found": _4,
				"is-lost": _4,
				"is-saved": _4,
				"is-very-bad": _4,
				"is-very-evil": _4,
				"is-very-good": _4,
				"is-very-nice": _4,
				"is-very-sweet": _4,
				"isa-geek": _4,
				"kicks-ass": _4,
				"misconfused": _4,
				"podzone": _4,
				"readmyblog": _4,
				"selfip": _4,
				"sellsyourhome": _4,
				"servebbs": _4,
				"serveftp": _4,
				"servegame": _4,
				"stuff-4-sale": _4,
				"webhop": _4,
				"accesscam": _4,
				"camdvr": _4,
				"freeddns": _4,
				"mywire": _4,
				"webredirect": _4,
				"twmail": _4,
				"eu": [2, {
					"al": _4,
					"asso": _4,
					"at": _4,
					"au": _4,
					"be": _4,
					"bg": _4,
					"ca": _4,
					"cd": _4,
					"ch": _4,
					"cn": _4,
					"cy": _4,
					"cz": _4,
					"de": _4,
					"dk": _4,
					"edu": _4,
					"ee": _4,
					"es": _4,
					"fi": _4,
					"fr": _4,
					"gr": _4,
					"hr": _4,
					"hu": _4,
					"ie": _4,
					"il": _4,
					"in": _4,
					"int": _4,
					"is": _4,
					"it": _4,
					"jp": _4,
					"kr": _4,
					"lt": _4,
					"lu": _4,
					"lv": _4,
					"me": _4,
					"mk": _4,
					"mt": _4,
					"my": _4,
					"net": _4,
					"ng": _4,
					"nl": _4,
					"no": _4,
					"nz": _4,
					"pl": _4,
					"pt": _4,
					"ro": _4,
					"ru": _4,
					"se": _4,
					"si": _4,
					"sk": _4,
					"tr": _4,
					"uk": _4,
					"us": _4
				}],
				"fedorainfracloud": _4,
				"fedorapeople": _4,
				"fedoraproject": [0, {
					"cloud": _4,
					"os": _43,
					"stg": [0, { "os": _43 }]
				}],
				"freedesktop": _4,
				"hatenadiary": _4,
				"hepforge": _4,
				"in-dsl": _4,
				"in-vpn": _4,
				"js": _4,
				"barsy": _4,
				"mayfirst": _4,
				"routingthecloud": _4,
				"bmoattachments": _4,
				"cable-modem": _4,
				"collegefan": _4,
				"couchpotatofries": _4,
				"hopto": _4,
				"mlbfan": _4,
				"myftp": _4,
				"mysecuritycamera": _4,
				"nflfan": _4,
				"no-ip": _4,
				"read-books": _4,
				"ufcfan": _4,
				"zapto": _4,
				"dynserv": _4,
				"now-dns": _4,
				"is-local": _4,
				"httpbin": _4,
				"pubtls": _4,
				"jpn": _4,
				"my-firewall": _4,
				"myfirewall": _4,
				"spdns": _4,
				"small-web": _4,
				"dsmynas": _4,
				"familyds": _4,
				"teckids": _55,
				"tuxfamily": _4,
				"diskstation": _4,
				"hk": _4,
				"us": _4,
				"toolforge": _4,
				"wmcloud": _4,
				"wmflabs": _4,
				"za": _4
			}],
			"pa": [1, {
				"abo": _3,
				"ac": _3,
				"com": _3,
				"edu": _3,
				"gob": _3,
				"ing": _3,
				"med": _3,
				"net": _3,
				"nom": _3,
				"org": _3,
				"sld": _3
			}],
			"pe": [1, {
				"com": _3,
				"edu": _3,
				"gob": _3,
				"mil": _3,
				"net": _3,
				"nom": _3,
				"org": _3
			}],
			"pf": [1, {
				"com": _3,
				"edu": _3,
				"org": _3
			}],
			"pg": _18,
			"ph": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"i": _3,
				"mil": _3,
				"net": _3,
				"ngo": _3,
				"org": _3,
				"cloudns": _4
			}],
			"pk": [1, {
				"ac": _3,
				"biz": _3,
				"com": _3,
				"edu": _3,
				"fam": _3,
				"gkp": _3,
				"gob": _3,
				"gog": _3,
				"gok": _3,
				"gop": _3,
				"gos": _3,
				"gov": _3,
				"net": _3,
				"org": _3,
				"web": _3
			}],
			"pl": [1, {
				"com": _3,
				"net": _3,
				"org": _3,
				"agro": _3,
				"aid": _3,
				"atm": _3,
				"auto": _3,
				"biz": _3,
				"edu": _3,
				"gmina": _3,
				"gsm": _3,
				"info": _3,
				"mail": _3,
				"media": _3,
				"miasta": _3,
				"mil": _3,
				"nieruchomosci": _3,
				"nom": _3,
				"pc": _3,
				"powiat": _3,
				"priv": _3,
				"realestate": _3,
				"rel": _3,
				"sex": _3,
				"shop": _3,
				"sklep": _3,
				"sos": _3,
				"szkola": _3,
				"targi": _3,
				"tm": _3,
				"tourism": _3,
				"travel": _3,
				"turystyka": _3,
				"gov": [1, {
					"ap": _3,
					"griw": _3,
					"ic": _3,
					"is": _3,
					"kmpsp": _3,
					"konsulat": _3,
					"kppsp": _3,
					"kwp": _3,
					"kwpsp": _3,
					"mup": _3,
					"mw": _3,
					"oia": _3,
					"oirm": _3,
					"oke": _3,
					"oow": _3,
					"oschr": _3,
					"oum": _3,
					"pa": _3,
					"pinb": _3,
					"piw": _3,
					"po": _3,
					"pr": _3,
					"psp": _3,
					"psse": _3,
					"pup": _3,
					"rzgw": _3,
					"sa": _3,
					"sdn": _3,
					"sko": _3,
					"so": _3,
					"sr": _3,
					"starostwo": _3,
					"ug": _3,
					"ugim": _3,
					"um": _3,
					"umig": _3,
					"upow": _3,
					"uppo": _3,
					"us": _3,
					"uw": _3,
					"uzs": _3,
					"wif": _3,
					"wiih": _3,
					"winb": _3,
					"wios": _3,
					"witd": _3,
					"wiw": _3,
					"wkz": _3,
					"wsa": _3,
					"wskr": _3,
					"wsse": _3,
					"wuoz": _3,
					"wzmiuw": _3,
					"zp": _3,
					"zpisdn": _3
				}],
				"augustow": _3,
				"babia-gora": _3,
				"bedzin": _3,
				"beskidy": _3,
				"bialowieza": _3,
				"bialystok": _3,
				"bielawa": _3,
				"bieszczady": _3,
				"boleslawiec": _3,
				"bydgoszcz": _3,
				"bytom": _3,
				"cieszyn": _3,
				"czeladz": _3,
				"czest": _3,
				"dlugoleka": _3,
				"elblag": _3,
				"elk": _3,
				"glogow": _3,
				"gniezno": _3,
				"gorlice": _3,
				"grajewo": _3,
				"ilawa": _3,
				"jaworzno": _3,
				"jelenia-gora": _3,
				"jgora": _3,
				"kalisz": _3,
				"karpacz": _3,
				"kartuzy": _3,
				"kaszuby": _3,
				"katowice": _3,
				"kazimierz-dolny": _3,
				"kepno": _3,
				"ketrzyn": _3,
				"klodzko": _3,
				"kobierzyce": _3,
				"kolobrzeg": _3,
				"konin": _3,
				"konskowola": _3,
				"kutno": _3,
				"lapy": _3,
				"lebork": _3,
				"legnica": _3,
				"lezajsk": _3,
				"limanowa": _3,
				"lomza": _3,
				"lowicz": _3,
				"lubin": _3,
				"lukow": _3,
				"malbork": _3,
				"malopolska": _3,
				"mazowsze": _3,
				"mazury": _3,
				"mielec": _3,
				"mielno": _3,
				"mragowo": _3,
				"naklo": _3,
				"nowaruda": _3,
				"nysa": _3,
				"olawa": _3,
				"olecko": _3,
				"olkusz": _3,
				"olsztyn": _3,
				"opoczno": _3,
				"opole": _3,
				"ostroda": _3,
				"ostroleka": _3,
				"ostrowiec": _3,
				"ostrowwlkp": _3,
				"pila": _3,
				"pisz": _3,
				"podhale": _3,
				"podlasie": _3,
				"polkowice": _3,
				"pomorskie": _3,
				"pomorze": _3,
				"prochowice": _3,
				"pruszkow": _3,
				"przeworsk": _3,
				"pulawy": _3,
				"radom": _3,
				"rawa-maz": _3,
				"rybnik": _3,
				"rzeszow": _3,
				"sanok": _3,
				"sejny": _3,
				"skoczow": _3,
				"slask": _3,
				"slupsk": _3,
				"sosnowiec": _3,
				"stalowa-wola": _3,
				"starachowice": _3,
				"stargard": _3,
				"suwalki": _3,
				"swidnica": _3,
				"swiebodzin": _3,
				"swinoujscie": _3,
				"szczecin": _3,
				"szczytno": _3,
				"tarnobrzeg": _3,
				"tgory": _3,
				"turek": _3,
				"tychy": _3,
				"ustka": _3,
				"walbrzych": _3,
				"warmia": _3,
				"warszawa": _3,
				"waw": _3,
				"wegrow": _3,
				"wielun": _3,
				"wlocl": _3,
				"wloclawek": _3,
				"wodzislaw": _3,
				"wolomin": _3,
				"wroclaw": _3,
				"zachpomor": _3,
				"zagan": _3,
				"zarow": _3,
				"zgora": _3,
				"zgorzelec": _3,
				"art": _4,
				"gliwice": _4,
				"krakow": _4,
				"poznan": _4,
				"wroc": _4,
				"zakopane": _4,
				"beep": _4,
				"ecommerce-shop": _4,
				"cfolks": _4,
				"dfirma": _4,
				"dkonto": _4,
				"you2": _4,
				"shoparena": _4,
				"homesklep": _4,
				"sdscloud": _4,
				"unicloud": _4,
				"lodz": _4,
				"pabianice": _4,
				"plock": _4,
				"sieradz": _4,
				"skierniewice": _4,
				"zgierz": _4,
				"krasnik": _4,
				"leczna": _4,
				"lubartow": _4,
				"lublin": _4,
				"poniatowa": _4,
				"swidnik": _4,
				"co": _4,
				"torun": _4,
				"simplesite": _4,
				"myspreadshop": _4,
				"gda": _4,
				"gdansk": _4,
				"gdynia": _4,
				"med": _4,
				"sopot": _4,
				"bielsko": _4
			}],
			"pm": [1, {
				"own": _4,
				"name": _4
			}],
			"pn": [1, {
				"co": _3,
				"edu": _3,
				"gov": _3,
				"net": _3,
				"org": _3
			}],
			"post": _3,
			"pr": [1, {
				"biz": _3,
				"com": _3,
				"edu": _3,
				"gov": _3,
				"info": _3,
				"isla": _3,
				"name": _3,
				"net": _3,
				"org": _3,
				"pro": _3,
				"ac": _3,
				"est": _3,
				"prof": _3
			}],
			"pro": [1, {
				"aaa": _3,
				"aca": _3,
				"acct": _3,
				"avocat": _3,
				"bar": _3,
				"cpa": _3,
				"eng": _3,
				"jur": _3,
				"law": _3,
				"med": _3,
				"recht": _3,
				"12chars": _4,
				"cloudns": _4,
				"barsy": _4,
				"ngrok": _4
			}],
			"ps": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"net": _3,
				"org": _3,
				"plo": _3,
				"sec": _3
			}],
			"pt": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"int": _3,
				"net": _3,
				"nome": _3,
				"org": _3,
				"publ": _3,
				"123paginaweb": _4
			}],
			"pw": [1, {
				"gov": _3,
				"cloudns": _4,
				"x443": _4
			}],
			"py": [1, {
				"com": _3,
				"coop": _3,
				"edu": _3,
				"gov": _3,
				"mil": _3,
				"net": _3,
				"org": _3
			}],
			"qa": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"mil": _3,
				"name": _3,
				"net": _3,
				"org": _3,
				"sch": _3
			}],
			"re": [1, {
				"asso": _3,
				"com": _3,
				"netlib": _4,
				"can": _4
			}],
			"ro": [1, {
				"arts": _3,
				"com": _3,
				"firm": _3,
				"info": _3,
				"nom": _3,
				"nt": _3,
				"org": _3,
				"rec": _3,
				"store": _3,
				"tm": _3,
				"www": _3,
				"co": _4,
				"shop": _4,
				"barsy": _4
			}],
			"rs": [1, {
				"ac": _3,
				"co": _3,
				"edu": _3,
				"gov": _3,
				"in": _3,
				"org": _3,
				"brendly": _51,
				"barsy": _4,
				"ox": _4
			}],
			"ru": [1, {
				"ac": _4,
				"edu": _4,
				"gov": _4,
				"int": _4,
				"mil": _4,
				"eurodir": _4,
				"adygeya": _4,
				"bashkiria": _4,
				"bir": _4,
				"cbg": _4,
				"com": _4,
				"dagestan": _4,
				"grozny": _4,
				"kalmykia": _4,
				"kustanai": _4,
				"marine": _4,
				"mordovia": _4,
				"msk": _4,
				"mytis": _4,
				"nalchik": _4,
				"nov": _4,
				"pyatigorsk": _4,
				"spb": _4,
				"vladikavkaz": _4,
				"vladimir": _4,
				"na4u": _4,
				"mircloud": _4,
				"myjino": [2, {
					"hosting": _7,
					"landing": _7,
					"spectrum": _7,
					"vps": _7
				}],
				"cldmail": [0, { "hb": _4 }],
				"mcdir": [2, { "vps": _4 }],
				"mcpre": _4,
				"net": _4,
				"org": _4,
				"pp": _4,
				"lk3": _4,
				"ras": _4
			}],
			"rw": [1, {
				"ac": _3,
				"co": _3,
				"coop": _3,
				"gov": _3,
				"mil": _3,
				"net": _3,
				"org": _3
			}],
			"sa": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"med": _3,
				"net": _3,
				"org": _3,
				"pub": _3,
				"sch": _3
			}],
			"sb": _5,
			"sc": _5,
			"sd": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"info": _3,
				"med": _3,
				"net": _3,
				"org": _3,
				"tv": _3
			}],
			"se": [1, {
				"a": _3,
				"ac": _3,
				"b": _3,
				"bd": _3,
				"brand": _3,
				"c": _3,
				"d": _3,
				"e": _3,
				"f": _3,
				"fh": _3,
				"fhsk": _3,
				"fhv": _3,
				"g": _3,
				"h": _3,
				"i": _3,
				"k": _3,
				"komforb": _3,
				"kommunalforbund": _3,
				"komvux": _3,
				"l": _3,
				"lanbib": _3,
				"m": _3,
				"n": _3,
				"naturbruksgymn": _3,
				"o": _3,
				"org": _3,
				"p": _3,
				"parti": _3,
				"pp": _3,
				"press": _3,
				"r": _3,
				"s": _3,
				"t": _3,
				"tm": _3,
				"u": _3,
				"w": _3,
				"x": _3,
				"y": _3,
				"z": _3,
				"com": _4,
				"iopsys": _4,
				"123minsida": _4,
				"itcouldbewor": _4,
				"myspreadshop": _4
			}],
			"sg": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"net": _3,
				"org": _3,
				"enscaled": _4
			}],
			"sh": [1, {
				"com": _3,
				"gov": _3,
				"mil": _3,
				"net": _3,
				"org": _3,
				"hashbang": _4,
				"botda": _4,
				"platform": [0, {
					"ent": _4,
					"eu": _4,
					"us": _4
				}],
				"now": _4
			}],
			"si": [1, {
				"f5": _4,
				"gitapp": _4,
				"gitpage": _4
			}],
			"sj": _3,
			"sk": _3,
			"sl": _5,
			"sm": _3,
			"sn": [1, {
				"art": _3,
				"com": _3,
				"edu": _3,
				"gouv": _3,
				"org": _3,
				"perso": _3,
				"univ": _3
			}],
			"so": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"me": _3,
				"net": _3,
				"org": _3,
				"surveys": _4
			}],
			"sr": _3,
			"ss": [1, {
				"biz": _3,
				"co": _3,
				"com": _3,
				"edu": _3,
				"gov": _3,
				"me": _3,
				"net": _3,
				"org": _3,
				"sch": _3
			}],
			"st": [1, {
				"co": _3,
				"com": _3,
				"consulado": _3,
				"edu": _3,
				"embaixada": _3,
				"mil": _3,
				"net": _3,
				"org": _3,
				"principe": _3,
				"saotome": _3,
				"store": _3,
				"helioho": _4,
				"kirara": _4,
				"noho": _4
			}],
			"su": [1, {
				"abkhazia": _4,
				"adygeya": _4,
				"aktyubinsk": _4,
				"arkhangelsk": _4,
				"armenia": _4,
				"ashgabad": _4,
				"azerbaijan": _4,
				"balashov": _4,
				"bashkiria": _4,
				"bryansk": _4,
				"bukhara": _4,
				"chimkent": _4,
				"dagestan": _4,
				"east-kazakhstan": _4,
				"exnet": _4,
				"georgia": _4,
				"grozny": _4,
				"ivanovo": _4,
				"jambyl": _4,
				"kalmykia": _4,
				"kaluga": _4,
				"karacol": _4,
				"karaganda": _4,
				"karelia": _4,
				"khakassia": _4,
				"krasnodar": _4,
				"kurgan": _4,
				"kustanai": _4,
				"lenug": _4,
				"mangyshlak": _4,
				"mordovia": _4,
				"msk": _4,
				"murmansk": _4,
				"nalchik": _4,
				"navoi": _4,
				"north-kazakhstan": _4,
				"nov": _4,
				"obninsk": _4,
				"penza": _4,
				"pokrovsk": _4,
				"sochi": _4,
				"spb": _4,
				"tashkent": _4,
				"termez": _4,
				"togliatti": _4,
				"troitsk": _4,
				"tselinograd": _4,
				"tula": _4,
				"tuva": _4,
				"vladikavkaz": _4,
				"vladimir": _4,
				"vologda": _4
			}],
			"sv": [1, {
				"com": _3,
				"edu": _3,
				"gob": _3,
				"org": _3,
				"red": _3
			}],
			"sx": _11,
			"sy": _6,
			"sz": [1, {
				"ac": _3,
				"co": _3,
				"org": _3
			}],
			"tc": _3,
			"td": _3,
			"tel": _3,
			"tf": [1, { "sch": _4 }],
			"tg": _3,
			"th": [1, {
				"ac": _3,
				"co": _3,
				"go": _3,
				"in": _3,
				"mi": _3,
				"net": _3,
				"or": _3,
				"online": _4,
				"shop": _4
			}],
			"tj": [1, {
				"ac": _3,
				"biz": _3,
				"co": _3,
				"com": _3,
				"edu": _3,
				"go": _3,
				"gov": _3,
				"int": _3,
				"mil": _3,
				"name": _3,
				"net": _3,
				"nic": _3,
				"org": _3,
				"test": _3,
				"web": _3
			}],
			"tk": _3,
			"tl": _11,
			"tm": [1, {
				"co": _3,
				"com": _3,
				"edu": _3,
				"gov": _3,
				"mil": _3,
				"net": _3,
				"nom": _3,
				"org": _3
			}],
			"tn": [1, {
				"com": _3,
				"ens": _3,
				"fin": _3,
				"gov": _3,
				"ind": _3,
				"info": _3,
				"intl": _3,
				"mincom": _3,
				"nat": _3,
				"net": _3,
				"org": _3,
				"perso": _3,
				"tourism": _3,
				"orangecloud": _4
			}],
			"to": [1, {
				"611": _4,
				"com": _3,
				"edu": _3,
				"gov": _3,
				"mil": _3,
				"net": _3,
				"org": _3,
				"oya": _4,
				"x0": _4,
				"quickconnect": _25,
				"vpnplus": _4
			}],
			"tr": [1, {
				"av": _3,
				"bbs": _3,
				"bel": _3,
				"biz": _3,
				"com": _3,
				"dr": _3,
				"edu": _3,
				"gen": _3,
				"gov": _3,
				"info": _3,
				"k12": _3,
				"kep": _3,
				"mil": _3,
				"name": _3,
				"net": _3,
				"org": _3,
				"pol": _3,
				"tel": _3,
				"tsk": _3,
				"tv": _3,
				"web": _3,
				"nc": _11
			}],
			"tt": [1, {
				"biz": _3,
				"co": _3,
				"com": _3,
				"edu": _3,
				"gov": _3,
				"info": _3,
				"mil": _3,
				"name": _3,
				"net": _3,
				"org": _3,
				"pro": _3
			}],
			"tv": [1, {
				"better-than": _4,
				"dyndns": _4,
				"on-the-web": _4,
				"worse-than": _4,
				"from": _4,
				"sakura": _4
			}],
			"tw": [1, {
				"club": _3,
				"com": [1, { "mymailer": _4 }],
				"ebiz": _3,
				"edu": _3,
				"game": _3,
				"gov": _3,
				"idv": _3,
				"mil": _3,
				"net": _3,
				"org": _3,
				"url": _4,
				"mydns": _4
			}],
			"tz": [1, {
				"ac": _3,
				"co": _3,
				"go": _3,
				"hotel": _3,
				"info": _3,
				"me": _3,
				"mil": _3,
				"mobi": _3,
				"ne": _3,
				"or": _3,
				"sc": _3,
				"tv": _3
			}],
			"ua": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"in": _3,
				"net": _3,
				"org": _3,
				"cherkassy": _3,
				"cherkasy": _3,
				"chernigov": _3,
				"chernihiv": _3,
				"chernivtsi": _3,
				"chernovtsy": _3,
				"ck": _3,
				"cn": _3,
				"cr": _3,
				"crimea": _3,
				"cv": _3,
				"dn": _3,
				"dnepropetrovsk": _3,
				"dnipropetrovsk": _3,
				"donetsk": _3,
				"dp": _3,
				"if": _3,
				"ivano-frankivsk": _3,
				"kh": _3,
				"kharkiv": _3,
				"kharkov": _3,
				"kherson": _3,
				"khmelnitskiy": _3,
				"khmelnytskyi": _3,
				"kiev": _3,
				"kirovograd": _3,
				"km": _3,
				"kr": _3,
				"kropyvnytskyi": _3,
				"krym": _3,
				"ks": _3,
				"kv": _3,
				"kyiv": _3,
				"lg": _3,
				"lt": _3,
				"lugansk": _3,
				"luhansk": _3,
				"lutsk": _3,
				"lv": _3,
				"lviv": _3,
				"mk": _3,
				"mykolaiv": _3,
				"nikolaev": _3,
				"od": _3,
				"odesa": _3,
				"odessa": _3,
				"pl": _3,
				"poltava": _3,
				"rivne": _3,
				"rovno": _3,
				"rv": _3,
				"sb": _3,
				"sebastopol": _3,
				"sevastopol": _3,
				"sm": _3,
				"sumy": _3,
				"te": _3,
				"ternopil": _3,
				"uz": _3,
				"uzhgorod": _3,
				"uzhhorod": _3,
				"vinnica": _3,
				"vinnytsia": _3,
				"vn": _3,
				"volyn": _3,
				"yalta": _3,
				"zakarpattia": _3,
				"zaporizhzhe": _3,
				"zaporizhzhia": _3,
				"zhitomir": _3,
				"zhytomyr": _3,
				"zp": _3,
				"zt": _3,
				"cc": _4,
				"inf": _4,
				"ltd": _4,
				"cx": _4,
				"ie": _4,
				"biz": _4,
				"co": _4,
				"pp": _4,
				"v": _4
			}],
			"ug": [1, {
				"ac": _3,
				"co": _3,
				"com": _3,
				"edu": _3,
				"go": _3,
				"gov": _3,
				"mil": _3,
				"ne": _3,
				"or": _3,
				"org": _3,
				"sc": _3,
				"us": _3
			}],
			"uk": [1, {
				"ac": _3,
				"co": [1, {
					"bytemark": [0, {
						"dh": _4,
						"vm": _4
					}],
					"layershift": _46,
					"barsy": _4,
					"barsyonline": _4,
					"retrosnub": _54,
					"nh-serv": _4,
					"no-ip": _4,
					"adimo": _4,
					"myspreadshop": _4
				}],
				"gov": [1, {
					"api": _4,
					"campaign": _4,
					"service": _4
				}],
				"ltd": _3,
				"me": _3,
				"net": _3,
				"nhs": _3,
				"org": [1, {
					"glug": _4,
					"lug": _4,
					"lugs": _4,
					"affinitylottery": _4,
					"raffleentry": _4,
					"weeklylottery": _4
				}],
				"plc": _3,
				"police": _3,
				"sch": _18,
				"conn": _4,
				"copro": _4,
				"hosp": _4,
				"independent-commission": _4,
				"independent-inquest": _4,
				"independent-inquiry": _4,
				"independent-panel": _4,
				"independent-review": _4,
				"public-inquiry": _4,
				"royal-commission": _4,
				"pymnt": _4,
				"barsy": _4,
				"nimsite": _4,
				"oraclegovcloudapps": _7
			}],
			"us": [1, {
				"dni": _3,
				"isa": _3,
				"nsn": _3,
				"ak": _62,
				"al": _62,
				"ar": _62,
				"as": _62,
				"az": _62,
				"ca": _62,
				"co": _62,
				"ct": _62,
				"dc": _62,
				"de": [1, {
					"cc": _3,
					"lib": _4
				}],
				"fl": _62,
				"ga": _62,
				"gu": _62,
				"hi": _63,
				"ia": _62,
				"id": _62,
				"il": _62,
				"in": _62,
				"ks": _62,
				"ky": _62,
				"la": _62,
				"ma": [1, {
					"k12": [1, {
						"chtr": _3,
						"paroch": _3,
						"pvt": _3
					}],
					"cc": _3,
					"lib": _3
				}],
				"md": _62,
				"me": _62,
				"mi": [1, {
					"k12": _3,
					"cc": _3,
					"lib": _3,
					"ann-arbor": _3,
					"cog": _3,
					"dst": _3,
					"eaton": _3,
					"gen": _3,
					"mus": _3,
					"tec": _3,
					"washtenaw": _3
				}],
				"mn": _62,
				"mo": _62,
				"ms": _62,
				"mt": _62,
				"nc": _62,
				"nd": _63,
				"ne": _62,
				"nh": _62,
				"nj": _62,
				"nm": _62,
				"nv": _62,
				"ny": _62,
				"oh": _62,
				"ok": _62,
				"or": _62,
				"pa": _62,
				"pr": _62,
				"ri": _63,
				"sc": _62,
				"sd": _63,
				"tn": _62,
				"tx": _62,
				"ut": _62,
				"va": _62,
				"vi": _62,
				"vt": _62,
				"wa": _62,
				"wi": _62,
				"wv": [1, { "cc": _3 }],
				"wy": _62,
				"cloudns": _4,
				"is-by": _4,
				"land-4-sale": _4,
				"stuff-4-sale": _4,
				"heliohost": _4,
				"enscaled": [0, { "phx": _4 }],
				"mircloud": _4,
				"ngo": _4,
				"golffan": _4,
				"noip": _4,
				"pointto": _4,
				"freeddns": _4,
				"srv": [2, {
					"gh": _4,
					"gl": _4
				}],
				"platterp": _4,
				"servername": _4
			}],
			"uy": [1, {
				"com": _3,
				"edu": _3,
				"gub": _3,
				"mil": _3,
				"net": _3,
				"org": _3
			}],
			"uz": [1, {
				"co": _3,
				"com": _3,
				"net": _3,
				"org": _3
			}],
			"va": _3,
			"vc": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"mil": _3,
				"net": _3,
				"org": _3,
				"gv": [2, { "d": _4 }],
				"0e": _7,
				"mydns": _4
			}],
			"ve": [1, {
				"arts": _3,
				"bib": _3,
				"co": _3,
				"com": _3,
				"e12": _3,
				"edu": _3,
				"emprende": _3,
				"firm": _3,
				"gob": _3,
				"gov": _3,
				"info": _3,
				"int": _3,
				"mil": _3,
				"net": _3,
				"nom": _3,
				"org": _3,
				"rar": _3,
				"rec": _3,
				"store": _3,
				"tec": _3,
				"web": _3
			}],
			"vg": [1, { "edu": _3 }],
			"vi": [1, {
				"co": _3,
				"com": _3,
				"k12": _3,
				"net": _3,
				"org": _3
			}],
			"vn": [1, {
				"ac": _3,
				"ai": _3,
				"biz": _3,
				"com": _3,
				"edu": _3,
				"gov": _3,
				"health": _3,
				"id": _3,
				"info": _3,
				"int": _3,
				"io": _3,
				"name": _3,
				"net": _3,
				"org": _3,
				"pro": _3,
				"angiang": _3,
				"bacgiang": _3,
				"backan": _3,
				"baclieu": _3,
				"bacninh": _3,
				"baria-vungtau": _3,
				"bentre": _3,
				"binhdinh": _3,
				"binhduong": _3,
				"binhphuoc": _3,
				"binhthuan": _3,
				"camau": _3,
				"cantho": _3,
				"caobang": _3,
				"daklak": _3,
				"daknong": _3,
				"danang": _3,
				"dienbien": _3,
				"dongnai": _3,
				"dongthap": _3,
				"gialai": _3,
				"hagiang": _3,
				"haiduong": _3,
				"haiphong": _3,
				"hanam": _3,
				"hanoi": _3,
				"hatinh": _3,
				"haugiang": _3,
				"hoabinh": _3,
				"hungyen": _3,
				"khanhhoa": _3,
				"kiengiang": _3,
				"kontum": _3,
				"laichau": _3,
				"lamdong": _3,
				"langson": _3,
				"laocai": _3,
				"longan": _3,
				"namdinh": _3,
				"nghean": _3,
				"ninhbinh": _3,
				"ninhthuan": _3,
				"phutho": _3,
				"phuyen": _3,
				"quangbinh": _3,
				"quangnam": _3,
				"quangngai": _3,
				"quangninh": _3,
				"quangtri": _3,
				"soctrang": _3,
				"sonla": _3,
				"tayninh": _3,
				"thaibinh": _3,
				"thainguyen": _3,
				"thanhhoa": _3,
				"thanhphohochiminh": _3,
				"thuathienhue": _3,
				"tiengiang": _3,
				"travinh": _3,
				"tuyenquang": _3,
				"vinhlong": _3,
				"vinhphuc": _3,
				"yenbai": _3
			}],
			"vu": _45,
			"wf": [1, {
				"biz": _4,
				"sch": _4
			}],
			"ws": [1, {
				"com": _3,
				"edu": _3,
				"gov": _3,
				"net": _3,
				"org": _3,
				"advisor": _7,
				"cloud66": _4,
				"dyndns": _4,
				"mypets": _4
			}],
			"yt": [1, { "org": _4 }],
			"xn--mgbaam7a8h": _3,
			"امارات": _3,
			"xn--y9a3aq": _3,
			"հայ": _3,
			"xn--54b7fta0cc": _3,
			"বাংলা": _3,
			"xn--90ae": _3,
			"бг": _3,
			"xn--mgbcpq6gpa1a": _3,
			"البحرين": _3,
			"xn--90ais": _3,
			"бел": _3,
			"xn--fiqs8s": _3,
			"中国": _3,
			"xn--fiqz9s": _3,
			"中國": _3,
			"xn--lgbbat1ad8j": _3,
			"الجزائر": _3,
			"xn--wgbh1c": _3,
			"مصر": _3,
			"xn--e1a4c": _3,
			"ею": _3,
			"xn--qxa6a": _3,
			"ευ": _3,
			"xn--mgbah1a3hjkrd": _3,
			"موريتانيا": _3,
			"xn--node": _3,
			"გე": _3,
			"xn--qxam": _3,
			"ελ": _3,
			"xn--j6w193g": [1, {
				"xn--gmqw5a": _3,
				"xn--55qx5d": _3,
				"xn--mxtq1m": _3,
				"xn--wcvs22d": _3,
				"xn--uc0atv": _3,
				"xn--od0alg": _3
			}],
			"香港": [1, {
				"個人": _3,
				"公司": _3,
				"政府": _3,
				"教育": _3,
				"組織": _3,
				"網絡": _3
			}],
			"xn--2scrj9c": _3,
			"ಭಾರತ": _3,
			"xn--3hcrj9c": _3,
			"ଭାରତ": _3,
			"xn--45br5cyl": _3,
			"ভাৰত": _3,
			"xn--h2breg3eve": _3,
			"भारतम्": _3,
			"xn--h2brj9c8c": _3,
			"भारोत": _3,
			"xn--mgbgu82a": _3,
			"ڀارت": _3,
			"xn--rvc1e0am3e": _3,
			"ഭാരതം": _3,
			"xn--h2brj9c": _3,
			"भारत": _3,
			"xn--mgbbh1a": _3,
			"بارت": _3,
			"xn--mgbbh1a71e": _3,
			"بھارت": _3,
			"xn--fpcrj9c3d": _3,
			"భారత్": _3,
			"xn--gecrj9c": _3,
			"ભારત": _3,
			"xn--s9brj9c": _3,
			"ਭਾਰਤ": _3,
			"xn--45brj9c": _3,
			"ভারত": _3,
			"xn--xkc2dl3a5ee0h": _3,
			"இந்தியா": _3,
			"xn--mgba3a4f16a": _3,
			"ایران": _3,
			"xn--mgba3a4fra": _3,
			"ايران": _3,
			"xn--mgbtx2b": _3,
			"عراق": _3,
			"xn--mgbayh7gpa": _3,
			"الاردن": _3,
			"xn--3e0b707e": _3,
			"한국": _3,
			"xn--80ao21a": _3,
			"қаз": _3,
			"xn--q7ce6a": _3,
			"ລາວ": _3,
			"xn--fzc2c9e2c": _3,
			"ලංකා": _3,
			"xn--xkc2al3hye2a": _3,
			"இலங்கை": _3,
			"xn--mgbc0a9azcg": _3,
			"المغرب": _3,
			"xn--d1alf": _3,
			"мкд": _3,
			"xn--l1acc": _3,
			"мон": _3,
			"xn--mix891f": _3,
			"澳門": _3,
			"xn--mix082f": _3,
			"澳门": _3,
			"xn--mgbx4cd0ab": _3,
			"مليسيا": _3,
			"xn--mgb9awbf": _3,
			"عمان": _3,
			"xn--mgbai9azgqp6j": _3,
			"پاکستان": _3,
			"xn--mgbai9a5eva00b": _3,
			"پاكستان": _3,
			"xn--ygbi2ammx": _3,
			"فلسطين": _3,
			"xn--90a3ac": [1, {
				"xn--80au": _3,
				"xn--90azh": _3,
				"xn--d1at": _3,
				"xn--c1avg": _3,
				"xn--o1ac": _3,
				"xn--o1ach": _3
			}],
			"срб": [1, {
				"ак": _3,
				"обр": _3,
				"од": _3,
				"орг": _3,
				"пр": _3,
				"упр": _3
			}],
			"xn--p1ai": _3,
			"рф": _3,
			"xn--wgbl6a": _3,
			"قطر": _3,
			"xn--mgberp4a5d4ar": _3,
			"السعودية": _3,
			"xn--mgberp4a5d4a87g": _3,
			"السعودیة": _3,
			"xn--mgbqly7c0a67fbc": _3,
			"السعودیۃ": _3,
			"xn--mgbqly7cvafr": _3,
			"السعوديه": _3,
			"xn--mgbpl2fh": _3,
			"سودان": _3,
			"xn--yfro4i67o": _3,
			"新加坡": _3,
			"xn--clchc0ea0b2g2a9gcd": _3,
			"சிங்கப்பூர்": _3,
			"xn--ogbpf8fl": _3,
			"سورية": _3,
			"xn--mgbtf8fl": _3,
			"سوريا": _3,
			"xn--o3cw4h": [1, {
				"xn--o3cyx2a": _3,
				"xn--12co0c3b4eva": _3,
				"xn--m3ch0j3a": _3,
				"xn--h3cuzk1di": _3,
				"xn--12c1fe0br": _3,
				"xn--12cfi8ixb8l": _3
			}],
			"ไทย": [1, {
				"ทหาร": _3,
				"ธุรกิจ": _3,
				"เน็ต": _3,
				"รัฐบาล": _3,
				"ศึกษา": _3,
				"องค์กร": _3
			}],
			"xn--pgbs0dh": _3,
			"تونس": _3,
			"xn--kpry57d": _3,
			"台灣": _3,
			"xn--kprw13d": _3,
			"台湾": _3,
			"xn--nnx388a": _3,
			"臺灣": _3,
			"xn--j1amh": _3,
			"укр": _3,
			"xn--mgb2ddes": _3,
			"اليمن": _3,
			"xxx": _3,
			"ye": _6,
			"za": [0, {
				"ac": _3,
				"agric": _3,
				"alt": _3,
				"co": _3,
				"edu": _3,
				"gov": _3,
				"grondar": _3,
				"law": _3,
				"mil": _3,
				"net": _3,
				"ngo": _3,
				"nic": _3,
				"nis": _3,
				"nom": _3,
				"org": _3,
				"school": _3,
				"tm": _3,
				"web": _3
			}],
			"zm": [1, {
				"ac": _3,
				"biz": _3,
				"co": _3,
				"com": _3,
				"edu": _3,
				"gov": _3,
				"info": _3,
				"mil": _3,
				"net": _3,
				"org": _3,
				"sch": _3
			}],
			"zw": [1, {
				"ac": _3,
				"co": _3,
				"gov": _3,
				"mil": _3,
				"org": _3
			}],
			"aaa": _3,
			"aarp": _3,
			"abb": _3,
			"abbott": _3,
			"abbvie": _3,
			"abc": _3,
			"able": _3,
			"abogado": _3,
			"abudhabi": _3,
			"academy": [1, { "official": _4 }],
			"accenture": _3,
			"accountant": _3,
			"accountants": _3,
			"aco": _3,
			"actor": _3,
			"ads": _3,
			"adult": _3,
			"aeg": _3,
			"aetna": _3,
			"afl": _3,
			"africa": _3,
			"agakhan": _3,
			"agency": _3,
			"aig": _3,
			"airbus": _3,
			"airforce": _3,
			"airtel": _3,
			"akdn": _3,
			"alibaba": _3,
			"alipay": _3,
			"allfinanz": _3,
			"allstate": _3,
			"ally": _3,
			"alsace": _3,
			"alstom": _3,
			"amazon": _3,
			"americanexpress": _3,
			"americanfamily": _3,
			"amex": _3,
			"amfam": _3,
			"amica": _3,
			"amsterdam": _3,
			"analytics": _3,
			"android": _3,
			"anquan": _3,
			"anz": _3,
			"aol": _3,
			"apartments": _3,
			"app": [1, {
				"adaptable": _4,
				"aiven": _4,
				"beget": _7,
				"brave": _8,
				"clerk": _4,
				"clerkstage": _4,
				"wnext": _4,
				"csb": [2, { "preview": _4 }],
				"convex": _4,
				"deta": _4,
				"ondigitalocean": _4,
				"easypanel": _4,
				"encr": _4,
				"evervault": _9,
				"expo": [2, { "staging": _4 }],
				"edgecompute": _4,
				"on-fleek": _4,
				"flutterflow": _4,
				"e2b": _4,
				"framer": _4,
				"hosted": _7,
				"run": _7,
				"web": _4,
				"hasura": _4,
				"botdash": _4,
				"loginline": _4,
				"lovable": _4,
				"medusajs": _4,
				"messerli": _4,
				"netfy": _4,
				"netlify": _4,
				"ngrok": _4,
				"ngrok-free": _4,
				"developer": _7,
				"noop": _4,
				"northflank": _7,
				"upsun": _7,
				"replit": _10,
				"nyat": _4,
				"snowflake": [0, {
					"*": _4,
					"privatelink": _7
				}],
				"streamlit": _4,
				"storipress": _4,
				"telebit": _4,
				"typedream": _4,
				"vercel": _4,
				"bookonline": _4,
				"wdh": _4,
				"windsurf": _4,
				"zeabur": _4,
				"zerops": _7
			}],
			"apple": _3,
			"aquarelle": _3,
			"arab": _3,
			"aramco": _3,
			"archi": _3,
			"army": _3,
			"art": _3,
			"arte": _3,
			"asda": _3,
			"associates": _3,
			"athleta": _3,
			"attorney": _3,
			"auction": _3,
			"audi": _3,
			"audible": _3,
			"audio": _3,
			"auspost": _3,
			"author": _3,
			"auto": _3,
			"autos": _3,
			"aws": [1, {
				"sagemaker": [0, {
					"ap-northeast-1": _14,
					"ap-northeast-2": _14,
					"ap-south-1": _14,
					"ap-southeast-1": _14,
					"ap-southeast-2": _14,
					"ca-central-1": _16,
					"eu-central-1": _14,
					"eu-west-1": _14,
					"eu-west-2": _14,
					"us-east-1": _16,
					"us-east-2": _16,
					"us-west-2": _16,
					"af-south-1": _13,
					"ap-east-1": _13,
					"ap-northeast-3": _13,
					"ap-south-2": _15,
					"ap-southeast-3": _13,
					"ap-southeast-4": _15,
					"ca-west-1": [0, {
						"notebook": _4,
						"notebook-fips": _4
					}],
					"eu-central-2": _13,
					"eu-north-1": _13,
					"eu-south-1": _13,
					"eu-south-2": _13,
					"eu-west-3": _13,
					"il-central-1": _13,
					"me-central-1": _13,
					"me-south-1": _13,
					"sa-east-1": _13,
					"us-gov-east-1": _17,
					"us-gov-west-1": _17,
					"us-west-1": [0, {
						"notebook": _4,
						"notebook-fips": _4,
						"studio": _4
					}],
					"experiments": _7
				}],
				"repost": [0, { "private": _7 }],
				"on": [0, {
					"ap-northeast-1": _12,
					"ap-southeast-1": _12,
					"ap-southeast-2": _12,
					"eu-central-1": _12,
					"eu-north-1": _12,
					"eu-west-1": _12,
					"us-east-1": _12,
					"us-east-2": _12,
					"us-west-2": _12
				}]
			}],
			"axa": _3,
			"azure": _3,
			"baby": _3,
			"baidu": _3,
			"banamex": _3,
			"band": _3,
			"bank": _3,
			"bar": _3,
			"barcelona": _3,
			"barclaycard": _3,
			"barclays": _3,
			"barefoot": _3,
			"bargains": _3,
			"baseball": _3,
			"basketball": [1, {
				"aus": _4,
				"nz": _4
			}],
			"bauhaus": _3,
			"bayern": _3,
			"bbc": _3,
			"bbt": _3,
			"bbva": _3,
			"bcg": _3,
			"bcn": _3,
			"beats": _3,
			"beauty": _3,
			"beer": _3,
			"bentley": _3,
			"berlin": _3,
			"best": _3,
			"bestbuy": _3,
			"bet": _3,
			"bharti": _3,
			"bible": _3,
			"bid": _3,
			"bike": _3,
			"bing": _3,
			"bingo": _3,
			"bio": _3,
			"black": _3,
			"blackfriday": _3,
			"blockbuster": _3,
			"blog": _3,
			"bloomberg": _3,
			"blue": _3,
			"bms": _3,
			"bmw": _3,
			"bnpparibas": _3,
			"boats": _3,
			"boehringer": _3,
			"bofa": _3,
			"bom": _3,
			"bond": _3,
			"boo": _3,
			"book": _3,
			"booking": _3,
			"bosch": _3,
			"bostik": _3,
			"boston": _3,
			"bot": _3,
			"boutique": _3,
			"box": _3,
			"bradesco": _3,
			"bridgestone": _3,
			"broadway": _3,
			"broker": _3,
			"brother": _3,
			"brussels": _3,
			"build": [1, {
				"v0": _4,
				"windsurf": _4
			}],
			"builders": [1, { "cloudsite": _4 }],
			"business": _19,
			"buy": _3,
			"buzz": _3,
			"bzh": _3,
			"cab": _3,
			"cafe": _3,
			"cal": _3,
			"call": _3,
			"calvinklein": _3,
			"cam": _3,
			"camera": _3,
			"camp": [1, { "emf": [0, { "at": _4 }] }],
			"canon": _3,
			"capetown": _3,
			"capital": _3,
			"capitalone": _3,
			"car": _3,
			"caravan": _3,
			"cards": _3,
			"care": _3,
			"career": _3,
			"careers": _3,
			"cars": _3,
			"casa": [1, { "nabu": [0, { "ui": _4 }] }],
			"case": _3,
			"cash": _3,
			"casino": _3,
			"catering": _3,
			"catholic": _3,
			"cba": _3,
			"cbn": _3,
			"cbre": _3,
			"center": _3,
			"ceo": _3,
			"cern": _3,
			"cfa": _3,
			"cfd": _3,
			"chanel": _3,
			"channel": _3,
			"charity": _3,
			"chase": _3,
			"chat": _3,
			"cheap": _3,
			"chintai": _3,
			"christmas": _3,
			"chrome": _3,
			"church": _3,
			"cipriani": _3,
			"circle": _3,
			"cisco": _3,
			"citadel": _3,
			"citi": _3,
			"citic": _3,
			"city": _3,
			"claims": _3,
			"cleaning": _3,
			"click": _3,
			"clinic": _3,
			"clinique": _3,
			"clothing": _3,
			"cloud": [1, {
				"convex": _4,
				"elementor": _4,
				"encoway": [0, { "eu": _4 }],
				"statics": _7,
				"ravendb": _4,
				"axarnet": [0, { "es-1": _4 }],
				"diadem": _4,
				"jelastic": [0, { "vip": _4 }],
				"jele": _4,
				"jenv-aruba": [0, {
					"aruba": [0, { "eur": [0, { "it1": _4 }] }],
					"it1": _4
				}],
				"keliweb": [2, { "cs": _4 }],
				"oxa": [2, {
					"tn": _4,
					"uk": _4
				}],
				"primetel": [2, { "uk": _4 }],
				"reclaim": [0, {
					"ca": _4,
					"uk": _4,
					"us": _4
				}],
				"trendhosting": [0, {
					"ch": _4,
					"de": _4
				}],
				"jotelulu": _4,
				"kuleuven": _4,
				"laravel": _4,
				"linkyard": _4,
				"magentosite": _7,
				"matlab": _4,
				"observablehq": _4,
				"perspecta": _4,
				"vapor": _4,
				"on-rancher": _7,
				"scw": [0, {
					"baremetal": [0, {
						"fr-par-1": _4,
						"fr-par-2": _4,
						"nl-ams-1": _4
					}],
					"fr-par": [0, {
						"cockpit": _4,
						"fnc": [2, { "functions": _4 }],
						"k8s": _21,
						"s3": _4,
						"s3-website": _4,
						"whm": _4
					}],
					"instances": [0, {
						"priv": _4,
						"pub": _4
					}],
					"k8s": _4,
					"nl-ams": [0, {
						"cockpit": _4,
						"k8s": _21,
						"s3": _4,
						"s3-website": _4,
						"whm": _4
					}],
					"pl-waw": [0, {
						"cockpit": _4,
						"k8s": _21,
						"s3": _4,
						"s3-website": _4
					}],
					"scalebook": _4,
					"smartlabeling": _4
				}],
				"servebolt": _4,
				"onstackit": [0, { "runs": _4 }],
				"trafficplex": _4,
				"unison-services": _4,
				"urown": _4,
				"voorloper": _4,
				"zap": _4
			}],
			"club": [1, {
				"cloudns": _4,
				"jele": _4,
				"barsy": _4
			}],
			"clubmed": _3,
			"coach": _3,
			"codes": [1, { "owo": _7 }],
			"coffee": _3,
			"college": _3,
			"cologne": _3,
			"commbank": _3,
			"community": [1, {
				"nog": _4,
				"ravendb": _4,
				"myforum": _4
			}],
			"company": _3,
			"compare": _3,
			"computer": _3,
			"comsec": _3,
			"condos": _3,
			"construction": _3,
			"consulting": _3,
			"contact": _3,
			"contractors": _3,
			"cooking": _3,
			"cool": [1, {
				"elementor": _4,
				"de": _4
			}],
			"corsica": _3,
			"country": _3,
			"coupon": _3,
			"coupons": _3,
			"courses": _3,
			"cpa": _3,
			"credit": _3,
			"creditcard": _3,
			"creditunion": _3,
			"cricket": _3,
			"crown": _3,
			"crs": _3,
			"cruise": _3,
			"cruises": _3,
			"cuisinella": _3,
			"cymru": _3,
			"cyou": _3,
			"dad": _3,
			"dance": _3,
			"data": _3,
			"date": _3,
			"dating": _3,
			"datsun": _3,
			"day": _3,
			"dclk": _3,
			"dds": _3,
			"deal": _3,
			"dealer": _3,
			"deals": _3,
			"degree": _3,
			"delivery": _3,
			"dell": _3,
			"deloitte": _3,
			"delta": _3,
			"democrat": _3,
			"dental": _3,
			"dentist": _3,
			"desi": _3,
			"design": [1, {
				"graphic": _4,
				"bss": _4
			}],
			"dev": [1, {
				"12chars": _4,
				"myaddr": _4,
				"panel": _4,
				"lcl": _7,
				"lclstage": _7,
				"stg": _7,
				"stgstage": _7,
				"pages": _4,
				"r2": _4,
				"workers": _4,
				"deno": _4,
				"deno-staging": _4,
				"deta": _4,
				"evervault": _9,
				"fly": _4,
				"githubpreview": _4,
				"gateway": _7,
				"hrsn": [2, { "psl": [0, {
					"sub": _4,
					"wc": [0, {
						"*": _4,
						"sub": _7
					}]
				}] }],
				"botdash": _4,
				"inbrowser": _7,
				"is-a-good": _4,
				"is-a": _4,
				"iserv": _4,
				"runcontainers": _4,
				"localcert": [0, { "user": _7 }],
				"loginline": _4,
				"barsy": _4,
				"mediatech": _4,
				"modx": _4,
				"ngrok": _4,
				"ngrok-free": _4,
				"is-a-fullstack": _4,
				"is-cool": _4,
				"is-not-a": _4,
				"localplayer": _4,
				"xmit": _4,
				"platter-app": _4,
				"replit": [2, {
					"archer": _4,
					"bones": _4,
					"canary": _4,
					"global": _4,
					"hacker": _4,
					"id": _4,
					"janeway": _4,
					"kim": _4,
					"kira": _4,
					"kirk": _4,
					"odo": _4,
					"paris": _4,
					"picard": _4,
					"pike": _4,
					"prerelease": _4,
					"reed": _4,
					"riker": _4,
					"sisko": _4,
					"spock": _4,
					"staging": _4,
					"sulu": _4,
					"tarpit": _4,
					"teams": _4,
					"tucker": _4,
					"wesley": _4,
					"worf": _4
				}],
				"crm": [0, {
					"d": _7,
					"w": _7,
					"wa": _7,
					"wb": _7,
					"wc": _7,
					"wd": _7,
					"we": _7,
					"wf": _7
				}],
				"vercel": _4,
				"webhare": _7
			}],
			"dhl": _3,
			"diamonds": _3,
			"diet": _3,
			"digital": [1, { "cloudapps": [2, { "london": _4 }] }],
			"direct": [1, { "libp2p": _4 }],
			"directory": _3,
			"discount": _3,
			"discover": _3,
			"dish": _3,
			"diy": _3,
			"dnp": _3,
			"docs": _3,
			"doctor": _3,
			"dog": _3,
			"domains": _3,
			"dot": _3,
			"download": _3,
			"drive": _3,
			"dtv": _3,
			"dubai": _3,
			"dunlop": _3,
			"dupont": _3,
			"durban": _3,
			"dvag": _3,
			"dvr": _3,
			"earth": _3,
			"eat": _3,
			"eco": _3,
			"edeka": _3,
			"education": _19,
			"email": [1, {
				"crisp": [0, { "on": _4 }],
				"tawk": _49,
				"tawkto": _49
			}],
			"emerck": _3,
			"energy": _3,
			"engineer": _3,
			"engineering": _3,
			"enterprises": _3,
			"epson": _3,
			"equipment": _3,
			"ericsson": _3,
			"erni": _3,
			"esq": _3,
			"estate": [1, { "compute": _7 }],
			"eurovision": _3,
			"eus": [1, { "party": _50 }],
			"events": [1, {
				"koobin": _4,
				"co": _4
			}],
			"exchange": _3,
			"expert": _3,
			"exposed": _3,
			"express": _3,
			"extraspace": _3,
			"fage": _3,
			"fail": _3,
			"fairwinds": _3,
			"faith": _3,
			"family": _3,
			"fan": _3,
			"fans": _3,
			"farm": [1, { "storj": _4 }],
			"farmers": _3,
			"fashion": _3,
			"fast": _3,
			"fedex": _3,
			"feedback": _3,
			"ferrari": _3,
			"ferrero": _3,
			"fidelity": _3,
			"fido": _3,
			"film": _3,
			"final": _3,
			"finance": _3,
			"financial": _19,
			"fire": _3,
			"firestone": _3,
			"firmdale": _3,
			"fish": _3,
			"fishing": _3,
			"fit": _3,
			"fitness": _3,
			"flickr": _3,
			"flights": _3,
			"flir": _3,
			"florist": _3,
			"flowers": _3,
			"fly": _3,
			"foo": _3,
			"food": _3,
			"football": _3,
			"ford": _3,
			"forex": _3,
			"forsale": _3,
			"forum": _3,
			"foundation": _3,
			"fox": _3,
			"free": _3,
			"fresenius": _3,
			"frl": _3,
			"frogans": _3,
			"frontier": _3,
			"ftr": _3,
			"fujitsu": _3,
			"fun": _3,
			"fund": _3,
			"furniture": _3,
			"futbol": _3,
			"fyi": _3,
			"gal": _3,
			"gallery": _3,
			"gallo": _3,
			"gallup": _3,
			"game": _3,
			"games": [1, {
				"pley": _4,
				"sheezy": _4
			}],
			"gap": _3,
			"garden": _3,
			"gay": [1, { "pages": _4 }],
			"gbiz": _3,
			"gdn": [1, { "cnpy": _4 }],
			"gea": _3,
			"gent": _3,
			"genting": _3,
			"george": _3,
			"ggee": _3,
			"gift": _3,
			"gifts": _3,
			"gives": _3,
			"giving": _3,
			"glass": _3,
			"gle": _3,
			"global": [1, { "appwrite": _4 }],
			"globo": _3,
			"gmail": _3,
			"gmbh": _3,
			"gmo": _3,
			"gmx": _3,
			"godaddy": _3,
			"gold": _3,
			"goldpoint": _3,
			"golf": _3,
			"goo": _3,
			"goodyear": _3,
			"goog": [1, {
				"cloud": _4,
				"translate": _4,
				"usercontent": _7
			}],
			"google": _3,
			"gop": _3,
			"got": _3,
			"grainger": _3,
			"graphics": _3,
			"gratis": _3,
			"green": _3,
			"gripe": _3,
			"grocery": _3,
			"group": [1, { "discourse": _4 }],
			"gucci": _3,
			"guge": _3,
			"guide": _3,
			"guitars": _3,
			"guru": _3,
			"hair": _3,
			"hamburg": _3,
			"hangout": _3,
			"haus": _3,
			"hbo": _3,
			"hdfc": _3,
			"hdfcbank": _3,
			"health": [1, { "hra": _4 }],
			"healthcare": _3,
			"help": _3,
			"helsinki": _3,
			"here": _3,
			"hermes": _3,
			"hiphop": _3,
			"hisamitsu": _3,
			"hitachi": _3,
			"hiv": _3,
			"hkt": _3,
			"hockey": _3,
			"holdings": _3,
			"holiday": _3,
			"homedepot": _3,
			"homegoods": _3,
			"homes": _3,
			"homesense": _3,
			"honda": _3,
			"horse": _3,
			"hospital": _3,
			"host": [1, {
				"cloudaccess": _4,
				"freesite": _4,
				"easypanel": _4,
				"fastvps": _4,
				"myfast": _4,
				"tempurl": _4,
				"wpmudev": _4,
				"jele": _4,
				"mircloud": _4,
				"wp2": _4,
				"half": _4
			}],
			"hosting": [1, { "opencraft": _4 }],
			"hot": _3,
			"hotels": _3,
			"hotmail": _3,
			"house": _3,
			"how": _3,
			"hsbc": _3,
			"hughes": _3,
			"hyatt": _3,
			"hyundai": _3,
			"ibm": _3,
			"icbc": _3,
			"ice": _3,
			"icu": _3,
			"ieee": _3,
			"ifm": _3,
			"ikano": _3,
			"imamat": _3,
			"imdb": _3,
			"immo": _3,
			"immobilien": _3,
			"inc": _3,
			"industries": _3,
			"infiniti": _3,
			"ing": _3,
			"ink": _3,
			"institute": _3,
			"insurance": _3,
			"insure": _3,
			"international": _3,
			"intuit": _3,
			"investments": _3,
			"ipiranga": _3,
			"irish": _3,
			"ismaili": _3,
			"ist": _3,
			"istanbul": _3,
			"itau": _3,
			"itv": _3,
			"jaguar": _3,
			"java": _3,
			"jcb": _3,
			"jeep": _3,
			"jetzt": _3,
			"jewelry": _3,
			"jio": _3,
			"jll": _3,
			"jmp": _3,
			"jnj": _3,
			"joburg": _3,
			"jot": _3,
			"joy": _3,
			"jpmorgan": _3,
			"jprs": _3,
			"juegos": _3,
			"juniper": _3,
			"kaufen": _3,
			"kddi": _3,
			"kerryhotels": _3,
			"kerryproperties": _3,
			"kfh": _3,
			"kia": _3,
			"kids": _3,
			"kim": _3,
			"kindle": _3,
			"kitchen": _3,
			"kiwi": _3,
			"koeln": _3,
			"komatsu": _3,
			"kosher": _3,
			"kpmg": _3,
			"kpn": _3,
			"krd": [1, {
				"co": _4,
				"edu": _4
			}],
			"kred": _3,
			"kuokgroup": _3,
			"kyoto": _3,
			"lacaixa": _3,
			"lamborghini": _3,
			"lamer": _3,
			"lancaster": _3,
			"land": _3,
			"landrover": _3,
			"lanxess": _3,
			"lasalle": _3,
			"lat": _3,
			"latino": _3,
			"latrobe": _3,
			"law": _3,
			"lawyer": _3,
			"lds": _3,
			"lease": _3,
			"leclerc": _3,
			"lefrak": _3,
			"legal": _3,
			"lego": _3,
			"lexus": _3,
			"lgbt": _3,
			"lidl": _3,
			"life": _3,
			"lifeinsurance": _3,
			"lifestyle": _3,
			"lighting": _3,
			"like": _3,
			"lilly": _3,
			"limited": _3,
			"limo": _3,
			"lincoln": _3,
			"link": [1, {
				"myfritz": _4,
				"cyon": _4,
				"dweb": _7,
				"inbrowser": _7,
				"nftstorage": _57,
				"mypep": _4,
				"storacha": _57,
				"w3s": _57
			}],
			"live": [1, {
				"aem": _4,
				"hlx": _4,
				"ewp": _7
			}],
			"living": _3,
			"llc": _3,
			"llp": _3,
			"loan": _3,
			"loans": _3,
			"locker": _3,
			"locus": _3,
			"lol": [1, { "omg": _4 }],
			"london": _3,
			"lotte": _3,
			"lotto": _3,
			"love": _3,
			"lpl": _3,
			"lplfinancial": _3,
			"ltd": _3,
			"ltda": _3,
			"lundbeck": _3,
			"luxe": _3,
			"luxury": _3,
			"madrid": _3,
			"maif": _3,
			"maison": _3,
			"makeup": _3,
			"man": _3,
			"management": _3,
			"mango": _3,
			"map": _3,
			"market": _3,
			"marketing": _3,
			"markets": _3,
			"marriott": _3,
			"marshalls": _3,
			"mattel": _3,
			"mba": _3,
			"mckinsey": _3,
			"med": _3,
			"media": _58,
			"meet": _3,
			"melbourne": _3,
			"meme": _3,
			"memorial": _3,
			"men": _3,
			"menu": [1, {
				"barsy": _4,
				"barsyonline": _4
			}],
			"merck": _3,
			"merckmsd": _3,
			"miami": _3,
			"microsoft": _3,
			"mini": _3,
			"mint": _3,
			"mit": _3,
			"mitsubishi": _3,
			"mlb": _3,
			"mls": _3,
			"mma": _3,
			"mobile": _3,
			"moda": _3,
			"moe": _3,
			"moi": _3,
			"mom": [1, { "ind": _4 }],
			"monash": _3,
			"money": _3,
			"monster": _3,
			"mormon": _3,
			"mortgage": _3,
			"moscow": _3,
			"moto": _3,
			"motorcycles": _3,
			"mov": _3,
			"movie": _3,
			"msd": _3,
			"mtn": _3,
			"mtr": _3,
			"music": _3,
			"nab": _3,
			"nagoya": _3,
			"navy": _3,
			"nba": _3,
			"nec": _3,
			"netbank": _3,
			"netflix": _3,
			"network": [1, {
				"alces": _7,
				"co": _4,
				"arvo": _4,
				"azimuth": _4,
				"tlon": _4
			}],
			"neustar": _3,
			"new": _3,
			"news": [1, { "noticeable": _4 }],
			"next": _3,
			"nextdirect": _3,
			"nexus": _3,
			"nfl": _3,
			"ngo": _3,
			"nhk": _3,
			"nico": _3,
			"nike": _3,
			"nikon": _3,
			"ninja": _3,
			"nissan": _3,
			"nissay": _3,
			"nokia": _3,
			"norton": _3,
			"now": _3,
			"nowruz": _3,
			"nowtv": _3,
			"nra": _3,
			"nrw": _3,
			"ntt": _3,
			"nyc": _3,
			"obi": _3,
			"observer": _3,
			"office": _3,
			"okinawa": _3,
			"olayan": _3,
			"olayangroup": _3,
			"ollo": _3,
			"omega": _3,
			"one": [1, {
				"kin": _7,
				"service": _4
			}],
			"ong": [1, { "obl": _4 }],
			"onl": _3,
			"online": [1, {
				"eero": _4,
				"eero-stage": _4,
				"websitebuilder": _4,
				"barsy": _4
			}],
			"ooo": _3,
			"open": _3,
			"oracle": _3,
			"orange": [1, { "tech": _4 }],
			"organic": _3,
			"origins": _3,
			"osaka": _3,
			"otsuka": _3,
			"ott": _3,
			"ovh": [1, { "nerdpol": _4 }],
			"page": [1, {
				"aem": _4,
				"hlx": _4,
				"hlx3": _4,
				"translated": _4,
				"codeberg": _4,
				"heyflow": _4,
				"prvcy": _4,
				"rocky": _4,
				"pdns": _4,
				"plesk": _4
			}],
			"panasonic": _3,
			"paris": _3,
			"pars": _3,
			"partners": _3,
			"parts": _3,
			"party": _3,
			"pay": _3,
			"pccw": _3,
			"pet": _3,
			"pfizer": _3,
			"pharmacy": _3,
			"phd": _3,
			"philips": _3,
			"phone": _3,
			"photo": _3,
			"photography": _3,
			"photos": _58,
			"physio": _3,
			"pics": _3,
			"pictet": _3,
			"pictures": [1, { "1337": _4 }],
			"pid": _3,
			"pin": _3,
			"ping": _3,
			"pink": _3,
			"pioneer": _3,
			"pizza": [1, { "ngrok": _4 }],
			"place": _19,
			"play": _3,
			"playstation": _3,
			"plumbing": _3,
			"plus": _3,
			"pnc": _3,
			"pohl": _3,
			"poker": _3,
			"politie": _3,
			"porn": _3,
			"pramerica": _3,
			"praxi": _3,
			"press": _3,
			"prime": _3,
			"prod": _3,
			"productions": _3,
			"prof": _3,
			"progressive": _3,
			"promo": _3,
			"properties": _3,
			"property": _3,
			"protection": _3,
			"pru": _3,
			"prudential": _3,
			"pub": [1, {
				"id": _7,
				"kin": _7,
				"barsy": _4
			}],
			"pwc": _3,
			"qpon": _3,
			"quebec": _3,
			"quest": _3,
			"racing": _3,
			"radio": _3,
			"read": _3,
			"realestate": _3,
			"realtor": _3,
			"realty": _3,
			"recipes": _3,
			"red": _3,
			"redstone": _3,
			"redumbrella": _3,
			"rehab": _3,
			"reise": _3,
			"reisen": _3,
			"reit": _3,
			"reliance": _3,
			"ren": _3,
			"rent": _3,
			"rentals": _3,
			"repair": _3,
			"report": _3,
			"republican": _3,
			"rest": _3,
			"restaurant": _3,
			"review": _3,
			"reviews": _3,
			"rexroth": _3,
			"rich": _3,
			"richardli": _3,
			"ricoh": _3,
			"ril": _3,
			"rio": _3,
			"rip": [1, { "clan": _4 }],
			"rocks": [1, {
				"myddns": _4,
				"stackit": _4,
				"lima-city": _4,
				"webspace": _4
			}],
			"rodeo": _3,
			"rogers": _3,
			"room": _3,
			"rsvp": _3,
			"rugby": _3,
			"ruhr": _3,
			"run": [1, {
				"appwrite": _7,
				"development": _4,
				"ravendb": _4,
				"liara": [2, { "iran": _4 }],
				"servers": _4,
				"build": _7,
				"code": _7,
				"database": _7,
				"migration": _7,
				"onporter": _4,
				"repl": _4,
				"stackit": _4,
				"val": [0, {
					"express": _4,
					"web": _4
				}],
				"wix": _4
			}],
			"rwe": _3,
			"ryukyu": _3,
			"saarland": _3,
			"safe": _3,
			"safety": _3,
			"sakura": _3,
			"sale": _3,
			"salon": _3,
			"samsclub": _3,
			"samsung": _3,
			"sandvik": _3,
			"sandvikcoromant": _3,
			"sanofi": _3,
			"sap": _3,
			"sarl": _3,
			"sas": _3,
			"save": _3,
			"saxo": _3,
			"sbi": _3,
			"sbs": _3,
			"scb": _3,
			"schaeffler": _3,
			"schmidt": _3,
			"scholarships": _3,
			"school": _3,
			"schule": _3,
			"schwarz": _3,
			"science": _3,
			"scot": [1, { "gov": [2, { "service": _4 }] }],
			"search": _3,
			"seat": _3,
			"secure": _3,
			"security": _3,
			"seek": _3,
			"select": _3,
			"sener": _3,
			"services": [1, { "loginline": _4 }],
			"seven": _3,
			"sew": _3,
			"sex": _3,
			"sexy": _3,
			"sfr": _3,
			"shangrila": _3,
			"sharp": _3,
			"shell": _3,
			"shia": _3,
			"shiksha": _3,
			"shoes": _3,
			"shop": [1, {
				"base": _4,
				"hoplix": _4,
				"barsy": _4,
				"barsyonline": _4,
				"shopware": _4
			}],
			"shopping": _3,
			"shouji": _3,
			"show": _3,
			"silk": _3,
			"sina": _3,
			"singles": _3,
			"site": [1, {
				"square": _4,
				"canva": _22,
				"cloudera": _7,
				"convex": _4,
				"cyon": _4,
				"fastvps": _4,
				"figma": _4,
				"heyflow": _4,
				"jele": _4,
				"jouwweb": _4,
				"loginline": _4,
				"barsy": _4,
				"notion": _4,
				"omniwe": _4,
				"opensocial": _4,
				"madethis": _4,
				"platformsh": _7,
				"tst": _7,
				"byen": _4,
				"srht": _4,
				"novecore": _4,
				"cpanel": _4,
				"wpsquared": _4
			}],
			"ski": _3,
			"skin": _3,
			"sky": _3,
			"skype": _3,
			"sling": _3,
			"smart": _3,
			"smile": _3,
			"sncf": _3,
			"soccer": _3,
			"social": _3,
			"softbank": _3,
			"software": _3,
			"sohu": _3,
			"solar": _3,
			"solutions": _3,
			"song": _3,
			"sony": _3,
			"soy": _3,
			"spa": _3,
			"space": [1, {
				"myfast": _4,
				"heiyu": _4,
				"hf": [2, { "static": _4 }],
				"app-ionos": _4,
				"project": _4,
				"uber": _4,
				"xs4all": _4
			}],
			"sport": _3,
			"spot": _3,
			"srl": _3,
			"stada": _3,
			"staples": _3,
			"star": _3,
			"statebank": _3,
			"statefarm": _3,
			"stc": _3,
			"stcgroup": _3,
			"stockholm": _3,
			"storage": _3,
			"store": [1, {
				"barsy": _4,
				"sellfy": _4,
				"shopware": _4,
				"storebase": _4
			}],
			"stream": _3,
			"studio": _3,
			"study": _3,
			"style": _3,
			"sucks": _3,
			"supplies": _3,
			"supply": _3,
			"support": [1, { "barsy": _4 }],
			"surf": _3,
			"surgery": _3,
			"suzuki": _3,
			"swatch": _3,
			"swiss": _3,
			"sydney": _3,
			"systems": [1, { "knightpoint": _4 }],
			"tab": _3,
			"taipei": _3,
			"talk": _3,
			"taobao": _3,
			"target": _3,
			"tatamotors": _3,
			"tatar": _3,
			"tattoo": _3,
			"tax": _3,
			"taxi": _3,
			"tci": _3,
			"tdk": _3,
			"team": [1, {
				"discourse": _4,
				"jelastic": _4
			}],
			"tech": [1, { "cleverapps": _4 }],
			"technology": _19,
			"temasek": _3,
			"tennis": _3,
			"teva": _3,
			"thd": _3,
			"theater": _3,
			"theatre": _3,
			"tiaa": _3,
			"tickets": _3,
			"tienda": _3,
			"tips": _3,
			"tires": _3,
			"tirol": _3,
			"tjmaxx": _3,
			"tjx": _3,
			"tkmaxx": _3,
			"tmall": _3,
			"today": [1, { "prequalifyme": _4 }],
			"tokyo": _3,
			"tools": [1, {
				"addr": _47,
				"myaddr": _4
			}],
			"top": [1, {
				"ntdll": _4,
				"wadl": _7
			}],
			"toray": _3,
			"toshiba": _3,
			"total": _3,
			"tours": _3,
			"town": _3,
			"toyota": _3,
			"toys": _3,
			"trade": _3,
			"trading": _3,
			"training": _3,
			"travel": _3,
			"travelers": _3,
			"travelersinsurance": _3,
			"trust": _3,
			"trv": _3,
			"tube": _3,
			"tui": _3,
			"tunes": _3,
			"tushu": _3,
			"tvs": _3,
			"ubank": _3,
			"ubs": _3,
			"unicom": _3,
			"university": _3,
			"uno": _3,
			"uol": _3,
			"ups": _3,
			"vacations": _3,
			"vana": _3,
			"vanguard": _3,
			"vegas": _3,
			"ventures": _3,
			"verisign": _3,
			"versicherung": _3,
			"vet": _3,
			"viajes": _3,
			"video": _3,
			"vig": _3,
			"viking": _3,
			"villas": _3,
			"vin": _3,
			"vip": _3,
			"virgin": _3,
			"visa": _3,
			"vision": _3,
			"viva": _3,
			"vivo": _3,
			"vlaanderen": _3,
			"vodka": _3,
			"volvo": _3,
			"vote": _3,
			"voting": _3,
			"voto": _3,
			"voyage": _3,
			"wales": _3,
			"walmart": _3,
			"walter": _3,
			"wang": _3,
			"wanggou": _3,
			"watch": _3,
			"watches": _3,
			"weather": _3,
			"weatherchannel": _3,
			"webcam": _3,
			"weber": _3,
			"website": _58,
			"wed": _3,
			"wedding": _3,
			"weibo": _3,
			"weir": _3,
			"whoswho": _3,
			"wien": _3,
			"wiki": _58,
			"williamhill": _3,
			"win": _3,
			"windows": _3,
			"wine": _3,
			"winners": _3,
			"wme": _3,
			"wolterskluwer": _3,
			"woodside": _3,
			"work": _3,
			"works": _3,
			"world": _3,
			"wow": _3,
			"wtc": _3,
			"wtf": _3,
			"xbox": _3,
			"xerox": _3,
			"xihuan": _3,
			"xin": _3,
			"xn--11b4c3d": _3,
			"कॉम": _3,
			"xn--1ck2e1b": _3,
			"セール": _3,
			"xn--1qqw23a": _3,
			"佛山": _3,
			"xn--30rr7y": _3,
			"慈善": _3,
			"xn--3bst00m": _3,
			"集团": _3,
			"xn--3ds443g": _3,
			"在线": _3,
			"xn--3pxu8k": _3,
			"点看": _3,
			"xn--42c2d9a": _3,
			"คอม": _3,
			"xn--45q11c": _3,
			"八卦": _3,
			"xn--4gbrim": _3,
			"موقع": _3,
			"xn--55qw42g": _3,
			"公益": _3,
			"xn--55qx5d": _3,
			"公司": _3,
			"xn--5su34j936bgsg": _3,
			"香格里拉": _3,
			"xn--5tzm5g": _3,
			"网站": _3,
			"xn--6frz82g": _3,
			"移动": _3,
			"xn--6qq986b3xl": _3,
			"我爱你": _3,
			"xn--80adxhks": _3,
			"москва": _3,
			"xn--80aqecdr1a": _3,
			"католик": _3,
			"xn--80asehdb": _3,
			"онлайн": _3,
			"xn--80aswg": _3,
			"сайт": _3,
			"xn--8y0a063a": _3,
			"联通": _3,
			"xn--9dbq2a": _3,
			"קום": _3,
			"xn--9et52u": _3,
			"时尚": _3,
			"xn--9krt00a": _3,
			"微博": _3,
			"xn--b4w605ferd": _3,
			"淡马锡": _3,
			"xn--bck1b9a5dre4c": _3,
			"ファッション": _3,
			"xn--c1avg": _3,
			"орг": _3,
			"xn--c2br7g": _3,
			"नेट": _3,
			"xn--cck2b3b": _3,
			"ストア": _3,
			"xn--cckwcxetd": _3,
			"アマゾン": _3,
			"xn--cg4bki": _3,
			"삼성": _3,
			"xn--czr694b": _3,
			"商标": _3,
			"xn--czrs0t": _3,
			"商店": _3,
			"xn--czru2d": _3,
			"商城": _3,
			"xn--d1acj3b": _3,
			"дети": _3,
			"xn--eckvdtc9d": _3,
			"ポイント": _3,
			"xn--efvy88h": _3,
			"新闻": _3,
			"xn--fct429k": _3,
			"家電": _3,
			"xn--fhbei": _3,
			"كوم": _3,
			"xn--fiq228c5hs": _3,
			"中文网": _3,
			"xn--fiq64b": _3,
			"中信": _3,
			"xn--fjq720a": _3,
			"娱乐": _3,
			"xn--flw351e": _3,
			"谷歌": _3,
			"xn--fzys8d69uvgm": _3,
			"電訊盈科": _3,
			"xn--g2xx48c": _3,
			"购物": _3,
			"xn--gckr3f0f": _3,
			"クラウド": _3,
			"xn--gk3at1e": _3,
			"通販": _3,
			"xn--hxt814e": _3,
			"网店": _3,
			"xn--i1b6b1a6a2e": _3,
			"संगठन": _3,
			"xn--imr513n": _3,
			"餐厅": _3,
			"xn--io0a7i": _3,
			"网络": _3,
			"xn--j1aef": _3,
			"ком": _3,
			"xn--jlq480n2rg": _3,
			"亚马逊": _3,
			"xn--jvr189m": _3,
			"食品": _3,
			"xn--kcrx77d1x4a": _3,
			"飞利浦": _3,
			"xn--kput3i": _3,
			"手机": _3,
			"xn--mgba3a3ejt": _3,
			"ارامكو": _3,
			"xn--mgba7c0bbn0a": _3,
			"العليان": _3,
			"xn--mgbab2bd": _3,
			"بازار": _3,
			"xn--mgbca7dzdo": _3,
			"ابوظبي": _3,
			"xn--mgbi4ecexp": _3,
			"كاثوليك": _3,
			"xn--mgbt3dhd": _3,
			"همراه": _3,
			"xn--mk1bu44c": _3,
			"닷컴": _3,
			"xn--mxtq1m": _3,
			"政府": _3,
			"xn--ngbc5azd": _3,
			"شبكة": _3,
			"xn--ngbe9e0a": _3,
			"بيتك": _3,
			"xn--ngbrx": _3,
			"عرب": _3,
			"xn--nqv7f": _3,
			"机构": _3,
			"xn--nqv7fs00ema": _3,
			"组织机构": _3,
			"xn--nyqy26a": _3,
			"健康": _3,
			"xn--otu796d": _3,
			"招聘": _3,
			"xn--p1acf": [1, {
				"xn--90amc": _4,
				"xn--j1aef": _4,
				"xn--j1ael8b": _4,
				"xn--h1ahn": _4,
				"xn--j1adp": _4,
				"xn--c1avg": _4,
				"xn--80aaa0cvac": _4,
				"xn--h1aliz": _4,
				"xn--90a1af": _4,
				"xn--41a": _4
			}],
			"рус": [1, {
				"биз": _4,
				"ком": _4,
				"крым": _4,
				"мир": _4,
				"мск": _4,
				"орг": _4,
				"самара": _4,
				"сочи": _4,
				"спб": _4,
				"я": _4
			}],
			"xn--pssy2u": _3,
			"大拿": _3,
			"xn--q9jyb4c": _3,
			"みんな": _3,
			"xn--qcka1pmc": _3,
			"グーグル": _3,
			"xn--rhqv96g": _3,
			"世界": _3,
			"xn--rovu88b": _3,
			"書籍": _3,
			"xn--ses554g": _3,
			"网址": _3,
			"xn--t60b56a": _3,
			"닷넷": _3,
			"xn--tckwe": _3,
			"コム": _3,
			"xn--tiq49xqyj": _3,
			"天主教": _3,
			"xn--unup4y": _3,
			"游戏": _3,
			"xn--vermgensberater-ctb": _3,
			"vermögensberater": _3,
			"xn--vermgensberatung-pwb": _3,
			"vermögensberatung": _3,
			"xn--vhquv": _3,
			"企业": _3,
			"xn--vuq861b": _3,
			"信息": _3,
			"xn--w4r85el8fhu5dnra": _3,
			"嘉里大酒店": _3,
			"xn--w4rs40l": _3,
			"嘉里": _3,
			"xn--xhq521b": _3,
			"广东": _3,
			"xn--zfr164b": _3,
			"政务": _3,
			"xyz": [1, {
				"botdash": _4,
				"telebit": _7
			}],
			"yachts": _3,
			"yahoo": _3,
			"yamaxun": _3,
			"yandex": _3,
			"yodobashi": _3,
			"yoga": _3,
			"yokohama": _3,
			"you": _3,
			"youtube": _3,
			"yun": _3,
			"zappos": _3,
			"zara": _3,
			"zero": _3,
			"zip": _3,
			"zone": [1, {
				"cloud66": _4,
				"triton": _7,
				"stackit": _4,
				"lima": _4
			}],
			"zuerich": _3
		}];
	})();
	/**
	* Lookup parts of domain in Trie
	*/
	function lookupInTrie(parts, trie, index, allowedMask) {
		let result = null;
		let node = trie;
		while (node !== void 0) {
			if ((node[0] & allowedMask) !== 0) result = {
				index: index + 1,
				isIcann: node[0] === 1,
				isPrivate: node[0] === 2
			};
			if (index === -1) break;
			const succ = node[1];
			node = Object.prototype.hasOwnProperty.call(succ, parts[index]) ? succ[parts[index]] : succ["*"];
			index -= 1;
		}
		return result;
	}
	/**
	* Check if `hostname` has a valid public suffix in `trie`.
	*/
	function suffixLookup(hostname, options, out) {
		var _a;
		if (fastPathLookup(hostname, options, out)) return;
		const hostnameParts = hostname.split(".");
		const allowedMask = (options.allowPrivateDomains ? 2 : 0) | (options.allowIcannDomains ? 1 : 0);
		const exceptionMatch = lookupInTrie(hostnameParts, exceptions, hostnameParts.length - 1, allowedMask);
		if (exceptionMatch !== null) {
			out.isIcann = exceptionMatch.isIcann;
			out.isPrivate = exceptionMatch.isPrivate;
			out.publicSuffix = hostnameParts.slice(exceptionMatch.index + 1).join(".");
			return;
		}
		const rulesMatch = lookupInTrie(hostnameParts, rules, hostnameParts.length - 1, allowedMask);
		if (rulesMatch !== null) {
			out.isIcann = rulesMatch.isIcann;
			out.isPrivate = rulesMatch.isPrivate;
			out.publicSuffix = hostnameParts.slice(rulesMatch.index).join(".");
			return;
		}
		out.isIcann = false;
		out.isPrivate = false;
		out.publicSuffix = (_a = hostnameParts[hostnameParts.length - 1]) !== null && _a !== void 0 ? _a : null;
	}
	const RESULT = getEmptyResult();
	function parse(url, options = {}) {
		return parseImpl(url, 5, suffixLookup, options, getEmptyResult());
	}
	function getHostname(url, options = {}) {
		resetResult(RESULT);
		return parseImpl(url, 0, suffixLookup, options, RESULT).hostname;
	}
	function getPublicSuffix(url, options = {}) {
		resetResult(RESULT);
		return parseImpl(url, 2, suffixLookup, options, RESULT).publicSuffix;
	}
	function getDomain(url, options = {}) {
		resetResult(RESULT);
		return parseImpl(url, 3, suffixLookup, options, RESULT).domain;
	}
	function getSubdomain(url, options = {}) {
		resetResult(RESULT);
		return parseImpl(url, 4, suffixLookup, options, RESULT).subdomain;
	}
	function getDomainWithoutSuffix(url, options = {}) {
		resetResult(RESULT);
		return parseImpl(url, 5, suffixLookup, options, RESULT).domainWithoutSuffix;
	}
	exports.getDomain = getDomain;
	exports.getDomainWithoutSuffix = getDomainWithoutSuffix;
	exports.getHostname = getHostname;
	exports.getPublicSuffix = getPublicSuffix;
	exports.getSubdomain = getSubdomain;
	exports.parse = parse;
}));
//#endregion
//#region node_modules/tough-cookie/dist/getPublicSuffix.js
var require_getPublicSuffix = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getPublicSuffix = getPublicSuffix;
	const tldts_1 = require_cjs();
	const SPECIAL_USE_DOMAINS = [
		"local",
		"example",
		"invalid",
		"localhost",
		"test"
	];
	const SPECIAL_TREATMENT_DOMAINS = ["localhost", "invalid"];
	const defaultGetPublicSuffixOptions = {
		allowSpecialUseDomain: false,
		ignoreError: false
	};
	/**
	* Returns the public suffix of this hostname. The public suffix is the shortest domain
	* name upon which a cookie can be set.
	*
	* @remarks
	* A "public suffix" is a domain that is controlled by a
	* public registry, such as "com", "co.uk", and "pvt.k12.wy.us".
	* This step is essential for preventing attacker.com from
	* disrupting the integrity of example.com by setting a cookie
	* with a Domain attribute of "com".  Unfortunately, the set of
	* public suffixes (also known as "registry controlled domains")
	* changes over time.  If feasible, user agents SHOULD use an
	* up-to-date public suffix list, such as the one maintained by
	* the Mozilla project at http://publicsuffix.org/.
	* (See {@link https://www.rfc-editor.org/rfc/rfc6265.html#section-5.3 | RFC6265 - Section 5.3})
	*
	* @example
	* ```
	* getPublicSuffix('www.example.com') === 'example.com'
	* getPublicSuffix('www.subdomain.example.com') === 'example.com'
	* ```
	*
	* @param domain - the domain attribute of a cookie
	* @param options - optional configuration for controlling how the public suffix is determined
	* @public
	*/
	function getPublicSuffix(domain, options = {}) {
		options = {
			...defaultGetPublicSuffixOptions,
			...options
		};
		const domainParts = domain.split(".");
		const topLevelDomain = domainParts[domainParts.length - 1];
		const allowSpecialUseDomain = !!options.allowSpecialUseDomain;
		const ignoreError = !!options.ignoreError;
		if (allowSpecialUseDomain && topLevelDomain !== void 0 && SPECIAL_USE_DOMAINS.includes(topLevelDomain)) {
			if (domainParts.length > 1) return `${domainParts[domainParts.length - 2]}.${topLevelDomain}`;
			else if (SPECIAL_TREATMENT_DOMAINS.includes(topLevelDomain)) return topLevelDomain;
		}
		if (!ignoreError && topLevelDomain !== void 0 && SPECIAL_USE_DOMAINS.includes(topLevelDomain)) throw new Error(`Cookie has domain set to the public suffix "${topLevelDomain}" which is a special use domain. To allow this, configure your CookieJar with {allowSpecialUseDomain: true, rejectPublicSuffixes: false}.`);
		const publicSuffix = (0, tldts_1.getDomain)(domain, {
			allowIcannDomains: true,
			allowPrivateDomains: true
		});
		if (publicSuffix) return publicSuffix;
	}
}));
//#endregion
//#region node_modules/tough-cookie/dist/permuteDomain.js
var require_permuteDomain = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.permuteDomain = permuteDomain;
	const getPublicSuffix_1 = require_getPublicSuffix();
	/**
	* Generates the permutation of all possible values that {@link domainMatch} the given `domain` parameter. The
	* array is in shortest-to-longest order. Useful when building custom {@link Store} implementations.
	*
	* @example
	* ```
	* permuteDomain('foo.bar.example.com')
	* // ['example.com', 'bar.example.com', 'foo.bar.example.com']
	* ```
	*
	* @public
	* @param domain - the domain to generate permutations for
	* @param allowSpecialUseDomain - flag to control if {@link https://www.rfc-editor.org/rfc/rfc6761.html | Special Use Domains} such as `localhost` should be allowed
	*/
	function permuteDomain(domain, allowSpecialUseDomain) {
		const pubSuf = (0, getPublicSuffix_1.getPublicSuffix)(domain, { allowSpecialUseDomain });
		if (!pubSuf) return;
		if (pubSuf == domain) return [domain];
		if (domain.slice(-1) == ".") domain = domain.slice(0, -1);
		const parts = domain.slice(0, -(pubSuf.length + 1)).split(".").reverse();
		let cur = pubSuf;
		const permutations = [cur];
		while (parts.length) {
			cur = `${parts.shift()}.${cur}`;
			permutations.push(cur);
		}
		return permutations;
	}
}));
//#endregion
//#region node_modules/tough-cookie/dist/store.js
var require_store = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Store = void 0;
	/**
	* Base class for {@link CookieJar} stores.
	*
	* The storage model for each {@link CookieJar} instance can be replaced with a custom implementation. The default is
	* {@link MemoryCookieStore}.
	*
	* @remarks
	* - Stores should inherit from the base Store class, which is available as a top-level export.
	*
	* - Stores are asynchronous by default, but if {@link Store.synchronous} is set to true, then the `*Sync` methods
	*     of the containing {@link CookieJar} can be used.
	*
	* @public
	*/
	var Store = class {
		constructor() {
			this.synchronous = false;
		}
		/**
		* @internal No doc because this is an overload that supports the implementation
		*/
		findCookie(_domain, _path, _key, _callback) {
			throw new Error("findCookie is not implemented");
		}
		/**
		* @internal No doc because this is an overload that supports the implementation
		*/
		findCookies(_domain, _path, _allowSpecialUseDomain = false, _callback) {
			throw new Error("findCookies is not implemented");
		}
		/**
		* @internal No doc because this is an overload that supports the implementation
		*/
		putCookie(_cookie, _callback) {
			throw new Error("putCookie is not implemented");
		}
		/**
		* @internal No doc because this is an overload that supports the implementation
		*/
		updateCookie(_oldCookie, _newCookie, _callback) {
			throw new Error("updateCookie is not implemented");
		}
		/**
		* @internal No doc because this is an overload that supports the implementation
		*/
		removeCookie(_domain, _path, _key, _callback) {
			throw new Error("removeCookie is not implemented");
		}
		/**
		* @internal No doc because this is an overload that supports the implementation
		*/
		removeCookies(_domain, _path, _callback) {
			throw new Error("removeCookies is not implemented");
		}
		/**
		* @internal No doc because this is an overload that supports the implementation
		*/
		removeAllCookies(_callback) {
			throw new Error("removeAllCookies is not implemented");
		}
		/**
		* @internal No doc because this is an overload that supports the implementation
		*/
		getAllCookies(_callback) {
			throw new Error("getAllCookies is not implemented (therefore jar cannot be serialized)");
		}
	};
	exports.Store = Store;
}));
//#endregion
//#region node_modules/tough-cookie/dist/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.safeToString = exports.objectToString = void 0;
	exports.createPromiseCallback = createPromiseCallback;
	exports.inOperator = inOperator;
	/** Wrapped `Object.prototype.toString`, so that you don't need to remember to use `.call()`. */
	const objectToString = (obj) => Object.prototype.toString.call(obj);
	exports.objectToString = objectToString;
	/**
	* Converts an array to string, safely handling symbols, null prototype objects, and recursive arrays.
	*/
	const safeArrayToString = (arr, seenArrays) => {
		if (typeof arr.join !== "function") return (0, exports.objectToString)(arr);
		seenArrays.add(arr);
		return arr.map((val) => val === null || val === void 0 || seenArrays.has(val) ? "" : safeToStringImpl(val, seenArrays)).join();
	};
	const safeToStringImpl = (val, seenArrays = /* @__PURE__ */ new WeakSet()) => {
		if (typeof val !== "object" || val === null) return String(val);
		else if (typeof val.toString === "function") return Array.isArray(val) ? safeArrayToString(val, seenArrays) : String(val);
		else return (0, exports.objectToString)(val);
	};
	/** Safely converts any value to string, using the value's own `toString` when available. */
	const safeToString = (val) => safeToStringImpl(val);
	exports.safeToString = safeToString;
	/** Converts a callback into a utility object where either a callback or a promise can be used. */
	function createPromiseCallback(cb) {
		let callback;
		let resolve;
		let reject;
		const promise = new Promise((_resolve, _reject) => {
			resolve = _resolve;
			reject = _reject;
		});
		if (typeof cb === "function") callback = (err, result) => {
			try {
				if (err) cb(err);
				else cb(null, result);
			} catch (e) {
				reject(e instanceof Error ? e : /* @__PURE__ */ new Error());
			}
		};
		else callback = (err, result) => {
			try {
				if (err) reject(err);
				else resolve(result);
			} catch (e) {
				reject(e instanceof Error ? e : /* @__PURE__ */ new Error());
			}
		};
		return {
			promise,
			callback,
			resolve: (value) => {
				callback(null, value);
				return promise;
			},
			reject: (error) => {
				callback(error);
				return promise;
			}
		};
	}
	function inOperator(k, o) {
		return k in o;
	}
}));
//#endregion
//#region node_modules/tough-cookie/dist/memstore.js
var require_memstore = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MemoryCookieStore = void 0;
	const pathMatch_1 = require_pathMatch();
	const permuteDomain_1 = require_permuteDomain();
	const store_1 = require_store();
	const utils_1 = require_utils();
	/**
	* An in-memory {@link Store} implementation for {@link CookieJar}. This is the default implementation used by
	* {@link CookieJar} and supports both async and sync operations. Also supports serialization, getAllCookies, and removeAllCookies.
	* @public
	*/
	var MemoryCookieStore = class extends store_1.Store {
		/**
		* Create a new {@link MemoryCookieStore}.
		*/
		constructor() {
			super();
			this.synchronous = true;
			this.idx = Object.create(null);
		}
		/**
		* @internal No doc because this is an overload that supports the implementation
		*/
		findCookie(domain, path, key, callback) {
			const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
			if (domain == null || path == null || key == null) return promiseCallback.resolve(void 0);
			const result = this.idx[domain]?.[path]?.[key];
			return promiseCallback.resolve(result);
		}
		/**
		* @internal No doc because this is an overload that supports the implementation
		*/
		findCookies(domain, path, allowSpecialUseDomain = false, callback) {
			if (typeof allowSpecialUseDomain === "function") {
				callback = allowSpecialUseDomain;
				allowSpecialUseDomain = true;
			}
			const results = [];
			const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
			if (!domain) return promiseCallback.resolve([]);
			let pathMatcher;
			if (!path) pathMatcher = function matchAll(domainIndex) {
				for (const curPath in domainIndex) {
					const pathIndex = domainIndex[curPath];
					for (const key in pathIndex) {
						const value = pathIndex[key];
						if (value) results.push(value);
					}
				}
			};
			else pathMatcher = function matchRFC(domainIndex) {
				for (const cookiePath in domainIndex) if ((0, pathMatch_1.pathMatch)(path, cookiePath)) {
					const pathIndex = domainIndex[cookiePath];
					for (const key in pathIndex) {
						const value = pathIndex[key];
						if (value) results.push(value);
					}
				}
			};
			const domains = (0, permuteDomain_1.permuteDomain)(domain, allowSpecialUseDomain) || [domain];
			const idx = this.idx;
			domains.forEach((curDomain) => {
				const domainIndex = idx[curDomain];
				if (!domainIndex) return;
				pathMatcher(domainIndex);
			});
			return promiseCallback.resolve(results);
		}
		/**
		* @internal No doc because this is an overload that supports the implementation
		*/
		putCookie(cookie, callback) {
			const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
			const { domain, path, key } = cookie;
			if (domain == null || path == null || key == null) return promiseCallback.resolve(void 0);
			const domainEntry = this.idx[domain] ?? Object.create(null);
			this.idx[domain] = domainEntry;
			const pathEntry = domainEntry[path] ?? Object.create(null);
			domainEntry[path] = pathEntry;
			pathEntry[key] = cookie;
			return promiseCallback.resolve(void 0);
		}
		/**
		* @internal No doc because this is an overload that supports the implementation
		*/
		updateCookie(_oldCookie, newCookie, callback) {
			if (callback) this.putCookie(newCookie, callback);
			else return this.putCookie(newCookie);
		}
		/**
		* @internal No doc because this is an overload that supports the implementation
		*/
		removeCookie(domain, path, key, callback) {
			const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
			delete this.idx[domain]?.[path]?.[key];
			return promiseCallback.resolve(void 0);
		}
		/**
		* @internal No doc because this is an overload that supports the implementation
		*/
		removeCookies(domain, path, callback) {
			const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
			const domainEntry = this.idx[domain];
			if (domainEntry) if (path) delete domainEntry[path];
			else delete this.idx[domain];
			return promiseCallback.resolve(void 0);
		}
		/**
		* @internal No doc because this is an overload that supports the implementation
		*/
		removeAllCookies(callback) {
			const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
			this.idx = Object.create(null);
			return promiseCallback.resolve(void 0);
		}
		/**
		* @internal No doc because this is an overload that supports the implementation
		*/
		getAllCookies(callback) {
			const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
			const cookies = [];
			const idx = this.idx;
			Object.keys(idx).forEach((domain) => {
				const domainEntry = idx[domain] ?? {};
				Object.keys(domainEntry).forEach((path) => {
					const pathEntry = domainEntry[path] ?? {};
					Object.keys(pathEntry).forEach((key) => {
						const keyEntry = pathEntry[key];
						if (keyEntry != null) cookies.push(keyEntry);
					});
				});
			});
			cookies.sort((a, b) => {
				return (a.creationIndex || 0) - (b.creationIndex || 0);
			});
			return promiseCallback.resolve(cookies);
		}
	};
	exports.MemoryCookieStore = MemoryCookieStore;
}));
//#endregion
//#region node_modules/tough-cookie/dist/validators.js
var require_validators = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ParameterError = void 0;
	exports.isNonEmptyString = isNonEmptyString;
	exports.isDate = isDate;
	exports.isEmptyString = isEmptyString;
	exports.isString = isString;
	exports.isObject = isObject;
	exports.isInteger = isInteger;
	exports.validate = validate;
	const utils_1 = require_utils();
	/** Determines whether the argument is a non-empty string. */
	function isNonEmptyString(data) {
		return isString(data) && data !== "";
	}
	/** Determines whether the argument is a *valid* Date. */
	function isDate(data) {
		return data instanceof Date && isInteger(data.getTime());
	}
	/** Determines whether the argument is the empty string. */
	function isEmptyString(data) {
		return data === "" || data instanceof String && data.toString() === "";
	}
	/** Determines whether the argument is a string. */
	function isString(data) {
		return typeof data === "string" || data instanceof String;
	}
	/** Determines whether the string representation of the argument is "[object Object]". */
	function isObject(data) {
		return (0, utils_1.objectToString)(data) === "[object Object]";
	}
	/** Determines whether the argument is an integer. */
	function isInteger(data) {
		return typeof data === "number" && data % 1 === 0;
	}
	/**
	* When the first argument is false, an error is created with the given message. If a callback is
	* provided, the error is passed to the callback, otherwise the error is thrown.
	*/
	function validate(bool, cbOrMessage, message) {
		if (bool) return;
		const cb = typeof cbOrMessage === "function" ? cbOrMessage : void 0;
		let options = typeof cbOrMessage === "function" ? message : cbOrMessage;
		if (!isObject(options)) options = "[object Object]";
		const err = new ParameterError((0, utils_1.safeToString)(options));
		if (cb) cb(err);
		else throw err;
	}
	/**
	* Represents a validation error.
	* @public
	*/
	var ParameterError = class extends Error {};
	exports.ParameterError = ParameterError;
}));
//#endregion
//#region node_modules/tough-cookie/dist/version.js
var require_version = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.version = void 0;
	/**
	* The version of `tough-cookie`
	* @public
	*/
	exports.version = "5.1.2";
}));
//#endregion
//#region node_modules/tough-cookie/dist/cookie/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.IP_V6_REGEX_OBJECT = exports.PrefixSecurityEnum = void 0;
	/**
	* Cookie prefixes are a way to indicate that a given cookie was set with a set of attributes simply by inspecting the
	* first few characters of the cookie's name. These are defined in {@link https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis-13#section-4.1.3 | RFC6265bis - Section 4.1.3}.
	*
	* The following values can be used to configure how a {@link CookieJar} enforces attribute restrictions for Cookie prefixes:
	*
	* - `silent` - Enable cookie prefix checking but silently ignores the cookie if conditions are not met. This is the default configuration for a {@link CookieJar}.
	*
	* - `strict` - Enables cookie prefix checking and will raise an error if conditions are not met.
	*
	* - `unsafe-disabled` - Disables cookie prefix checking.
	* @public
	*/
	exports.PrefixSecurityEnum = {
		SILENT: "silent",
		STRICT: "strict",
		DISABLED: "unsafe-disabled"
	};
	Object.freeze(exports.PrefixSecurityEnum);
	const IP_V6_REGEX = `
\\[?(?:
(?:[a-fA-F\\d]{1,4}:){7}(?:[a-fA-F\\d]{1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|:[a-fA-F\\d]{1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,2}|:)|
(?:[a-fA-F\\d]{1,4}:){4}(?:(?::[a-fA-F\\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,3}|:)|
(?:[a-fA-F\\d]{1,4}:){3}(?:(?::[a-fA-F\\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){2}(?:(?::[a-fA-F\\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,5}|:)|
(?:[a-fA-F\\d]{1,4}:){1}(?:(?::[a-fA-F\\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,6}|:)|
(?::(?:(?::[a-fA-F\\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,7}|:))
)(?:%[0-9a-zA-Z]{1,})?\\]?
`.replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim();
	exports.IP_V6_REGEX_OBJECT = new RegExp(`^${IP_V6_REGEX}$`);
}));
//#endregion
//#region node_modules/tough-cookie/dist/cookie/canonicalDomain.js
var require_canonicalDomain = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.canonicalDomain = canonicalDomain;
	const constants_1 = require_constants();
	/**
	* Normalizes a domain to lowercase and punycode-encoded.
	* Runtime-agnostic equivalent to node's `domainToASCII`.
	* @see https://nodejs.org/docs/latest-v22.x/api/url.html#urldomaintoasciidomain
	*/
	function domainToASCII(domain) {
		return new URL(`http://${domain}`).hostname;
	}
	/**
	* Transforms a domain name into a canonical domain name. The canonical domain name is a domain name
	* that has been trimmed, lowercased, stripped of leading dot, and optionally punycode-encoded
	* ({@link https://www.rfc-editor.org/rfc/rfc6265.html#section-5.1.2 | Section 5.1.2 of RFC 6265}). For
	* the most part, this function is idempotent (calling the function with the output from a previous call
	* returns the same output).
	*
	* @remarks
	* A canonicalized host name is the string generated by the following
	* algorithm:
	*
	* 1.  Convert the host name to a sequence of individual domain name
	*     labels.
	*
	* 2.  Convert each label that is not a Non-Reserved LDH (NR-LDH) label,
	*     to an A-label (see Section 2.3.2.1 of [RFC5890] for the former
	*     and latter), or to a "punycode label" (a label resulting from the
	*     "ToASCII" conversion in Section 4 of [RFC3490]), as appropriate
	*     (see Section 6.3 of this specification).
	*
	* 3.  Concatenate the resulting labels, separated by a %x2E (".")
	*     character.
	*
	* @example
	* ```
	* canonicalDomain('.EXAMPLE.com') === 'example.com'
	* ```
	*
	* @param domainName - the domain name to generate the canonical domain from
	* @public
	*/
	function canonicalDomain(domainName) {
		if (domainName == null) return;
		let str = domainName.trim().replace(/^\./, "");
		if (constants_1.IP_V6_REGEX_OBJECT.test(str)) {
			if (!str.startsWith("[")) str = "[" + str;
			if (!str.endsWith("]")) str = str + "]";
			return domainToASCII(str).slice(1, -1);
		}
		if (/[^\u0001-\u007f]/.test(str)) return domainToASCII(str);
		return str.toLowerCase();
	}
}));
//#endregion
//#region node_modules/tough-cookie/dist/cookie/formatDate.js
var require_formatDate = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.formatDate = formatDate;
	/**
	* Format a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date | Date} into
	* the {@link https://www.rfc-editor.org/rfc/rfc2616#section-3.3.1 | preferred Internet standard format}
	* defined in {@link https://www.rfc-editor.org/rfc/rfc822#section-5 | RFC822} and
	* updated in {@link https://www.rfc-editor.org/rfc/rfc1123#page-55 | RFC1123}.
	*
	* @example
	* ```
	* formatDate(new Date(0)) === 'Thu, 01 Jan 1970 00:00:00 GMT`
	* ```
	*
	* @param date - the date value to format
	* @public
	*/
	function formatDate(date) {
		return date.toUTCString();
	}
}));
//#endregion
//#region node_modules/tough-cookie/dist/cookie/parseDate.js
var require_parseDate = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.parseDate = parseDate;
	const DATE_DELIM = /[\x09\x20-\x2F\x3B-\x40\x5B-\x60\x7B-\x7E]/;
	const MONTH_TO_NUM = {
		jan: 0,
		feb: 1,
		mar: 2,
		apr: 3,
		may: 4,
		jun: 5,
		jul: 6,
		aug: 7,
		sep: 8,
		oct: 9,
		nov: 10,
		dec: 11
	};
	function parseDigits(token, minDigits, maxDigits, trailingOK) {
		let count = 0;
		while (count < token.length) {
			const c = token.charCodeAt(count);
			if (c <= 47 || c >= 58) break;
			count++;
		}
		if (count < minDigits || count > maxDigits) return;
		if (!trailingOK && count != token.length) return;
		return parseInt(token.slice(0, count), 10);
	}
	function parseTime(token) {
		const parts = token.split(":");
		const result = [
			0,
			0,
			0
		];
		if (parts.length !== 3) return;
		for (let i = 0; i < 3; i++) {
			const trailingOK = i == 2;
			const numPart = parts[i];
			if (numPart === void 0) return;
			const num = parseDigits(numPart, 1, 2, trailingOK);
			if (num === void 0) return;
			result[i] = num;
		}
		return result;
	}
	function parseMonth(token) {
		token = String(token).slice(0, 3).toLowerCase();
		switch (token) {
			case "jan": return MONTH_TO_NUM.jan;
			case "feb": return MONTH_TO_NUM.feb;
			case "mar": return MONTH_TO_NUM.mar;
			case "apr": return MONTH_TO_NUM.apr;
			case "may": return MONTH_TO_NUM.may;
			case "jun": return MONTH_TO_NUM.jun;
			case "jul": return MONTH_TO_NUM.jul;
			case "aug": return MONTH_TO_NUM.aug;
			case "sep": return MONTH_TO_NUM.sep;
			case "oct": return MONTH_TO_NUM.oct;
			case "nov": return MONTH_TO_NUM.nov;
			case "dec": return MONTH_TO_NUM.dec;
			default: return;
		}
	}
	/**
	* Parse a cookie date string into a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date | Date}. Parses according to
	* {@link https://www.rfc-editor.org/rfc/rfc6265.html#section-5.1.1 | RFC6265 - Section 5.1.1}, not
	* {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse | Date.parse()}.
	*
	* @remarks
	*
	* ### RFC6265 - 5.1.1. Dates
	*
	* The user agent MUST use an algorithm equivalent to the following
	* algorithm to parse a cookie-date.  Note that the various boolean
	* flags defined as a part of the algorithm (i.e., found-time, found-
	* day-of-month, found-month, found-year) are initially "not set".
	*
	* 1.  Using the grammar below, divide the cookie-date into date-tokens.
	*
	* ```
	*     cookie-date     = *delimiter date-token-list *delimiter
	*     date-token-list = date-token *( 1*delimiter date-token )
	*     date-token      = 1*non-delimiter
	*
	*     delimiter       = %x09 / %x20-2F / %x3B-40 / %x5B-60 / %x7B-7E
	*     non-delimiter   = %x00-08 / %x0A-1F / DIGIT / ":" / ALPHA / %x7F-FF
	*     non-digit       = %x00-2F / %x3A-FF
	*
	*     day-of-month    = 1*2DIGIT ( non-digit *OCTET )
	*     month           = ( "jan" / "feb" / "mar" / "apr" /
	*                        "may" / "jun" / "jul" / "aug" /
	*                        "sep" / "oct" / "nov" / "dec" ) *OCTET
	*     year            = 2*4DIGIT ( non-digit *OCTET )
	*     time            = hms-time ( non-digit *OCTET )
	*     hms-time        = time-field ":" time-field ":" time-field
	*     time-field      = 1*2DIGIT
	* ```
	*
	* 2. Process each date-token sequentially in the order the date-tokens
	*     appear in the cookie-date:
	*
	*     1. If the found-time flag is not set and the token matches the
	*         time production, set the found-time flag and set the hour-
	*         value, minute-value, and second-value to the numbers denoted
	*         by the digits in the date-token, respectively.  Skip the
	*         remaining sub-steps and continue to the next date-token.
	*
	*     2. If the found-day-of-month flag is not set and the date-token
	*         matches the day-of-month production, set the found-day-of-
	*         month flag and set the day-of-month-value to the number
	*         denoted by the date-token.  Skip the remaining sub-steps and
	*         continue to the next date-token.
	*
	*     3. If the found-month flag is not set and the date-token matches
	*         the month production, set the found-month flag and set the
	*         month-value to the month denoted by the date-token.  Skip the
	*         remaining sub-steps and continue to the next date-token.
	*
	*     4. If the found-year flag is not set and the date-token matches
	*         the year production, set the found-year flag and set the
	*         year-value to the number denoted by the date-token.  Skip the
	*         remaining sub-steps and continue to the next date-token.
	*
	*  3. If the year-value is greater than or equal to 70 and less than or
	*      equal to 99, increment the year-value by 1900.
	*
	*  4. If the year-value is greater than or equal to 0 and less than or
	*      equal to 69, increment the year-value by 2000.
	*
	*      1. NOTE: Some existing user agents interpret two-digit years differently.
	*
	*  5. Abort these steps and fail to parse the cookie-date if:
	*
	*      - at least one of the found-day-of-month, found-month, found-
	*          year, or found-time flags is not set,
	*
	*      - the day-of-month-value is less than 1 or greater than 31,
	*
	*      - the year-value is less than 1601,
	*
	*      - the hour-value is greater than 23,
	*
	*      - the minute-value is greater than 59, or
	*
	*      - the second-value is greater than 59.
	*
	*      (Note that leap seconds cannot be represented in this syntax.)
	*
	*  6. Let the parsed-cookie-date be the date whose day-of-month, month,
	*      year, hour, minute, and second (in UTC) are the day-of-month-
	*      value, the month-value, the year-value, the hour-value, the
	*      minute-value, and the second-value, respectively.  If no such
	*      date exists, abort these steps and fail to parse the cookie-date.
	*
	*  7. Return the parsed-cookie-date as the result of this algorithm.
	*
	* @example
	* ```
	* parseDate('Wed, 09 Jun 2021 10:18:14 GMT')
	* ```
	*
	* @param cookieDate - the cookie date string
	* @public
	*/
	function parseDate(cookieDate) {
		if (!cookieDate) return;
		const tokens = cookieDate.split(DATE_DELIM);
		let hour;
		let minute;
		let second;
		let dayOfMonth;
		let month;
		let year;
		for (let i = 0; i < tokens.length; i++) {
			const token = (tokens[i] ?? "").trim();
			if (!token.length) continue;
			if (second === void 0) {
				const result = parseTime(token);
				if (result) {
					hour = result[0];
					minute = result[1];
					second = result[2];
					continue;
				}
			}
			if (dayOfMonth === void 0) {
				const result = parseDigits(token, 1, 2, true);
				if (result !== void 0) {
					dayOfMonth = result;
					continue;
				}
			}
			if (month === void 0) {
				const result = parseMonth(token);
				if (result !== void 0) {
					month = result;
					continue;
				}
			}
			if (year === void 0) {
				const result = parseDigits(token, 2, 4, true);
				if (result !== void 0) {
					year = result;
					if (year >= 70 && year <= 99) year += 1900;
					else if (year >= 0 && year <= 69) year += 2e3;
				}
			}
		}
		if (dayOfMonth === void 0 || month === void 0 || year === void 0 || hour === void 0 || minute === void 0 || second === void 0 || dayOfMonth < 1 || dayOfMonth > 31 || year < 1601 || hour > 23 || minute > 59 || second > 59) return;
		return new Date(Date.UTC(year, month, dayOfMonth, hour, minute, second));
	}
}));
//#endregion
//#region node_modules/tough-cookie/dist/cookie/cookie.js
var require_cookie$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Cookie = void 0;
	/*!
	* Copyright (c) 2015-2020, Salesforce.com, Inc.
	* All rights reserved.
	*
	* Redistribution and use in source and binary forms, with or without
	* modification, are permitted provided that the following conditions are met:
	*
	* 1. Redistributions of source code must retain the above copyright notice,
	* this list of conditions and the following disclaimer.
	*
	* 2. Redistributions in binary form must reproduce the above copyright notice,
	* this list of conditions and the following disclaimer in the documentation
	* and/or other materials provided with the distribution.
	*
	* 3. Neither the name of Salesforce.com nor the names of its contributors may
	* be used to endorse or promote products derived from this software without
	* specific prior written permission.
	*
	* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	* ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
	* LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
	* CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
	* SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
	* INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
	* CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
	* ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
	* POSSIBILITY OF SUCH DAMAGE.
	*/
	const getPublicSuffix_1 = require_getPublicSuffix();
	const validators = __importStar(require_validators());
	const utils_1 = require_utils();
	const formatDate_1 = require_formatDate();
	const parseDate_1 = require_parseDate();
	const canonicalDomain_1 = require_canonicalDomain();
	const COOKIE_OCTETS = /^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]+$/;
	const PATH_VALUE = /[\x20-\x3A\x3C-\x7E]+/;
	const CONTROL_CHARS = /[\x00-\x1F]/;
	const TERMINATORS = [
		"\n",
		"\r",
		"\0"
	];
	function trimTerminator(str) {
		if (validators.isEmptyString(str)) return str;
		for (let t = 0; t < TERMINATORS.length; t++) {
			const terminator = TERMINATORS[t];
			const terminatorIdx = terminator ? str.indexOf(terminator) : -1;
			if (terminatorIdx !== -1) str = str.slice(0, terminatorIdx);
		}
		return str;
	}
	function parseCookiePair(cookiePair, looseMode) {
		cookiePair = trimTerminator(cookiePair);
		let firstEq = cookiePair.indexOf("=");
		if (looseMode) {
			if (firstEq === 0) {
				cookiePair = cookiePair.substring(1);
				firstEq = cookiePair.indexOf("=");
			}
		} else if (firstEq <= 0) return;
		let cookieName, cookieValue;
		if (firstEq <= 0) {
			cookieName = "";
			cookieValue = cookiePair.trim();
		} else {
			cookieName = cookiePair.slice(0, firstEq).trim();
			cookieValue = cookiePair.slice(firstEq + 1).trim();
		}
		if (CONTROL_CHARS.test(cookieName) || CONTROL_CHARS.test(cookieValue)) return;
		const c = new Cookie();
		c.key = cookieName;
		c.value = cookieValue;
		return c;
	}
	function parse(str, options) {
		if (validators.isEmptyString(str) || !validators.isString(str)) return;
		str = str.trim();
		const firstSemi = str.indexOf(";");
		const c = parseCookiePair(firstSemi === -1 ? str : str.slice(0, firstSemi), options?.loose ?? false);
		if (!c) return;
		if (firstSemi === -1) return c;
		const unparsed = str.slice(firstSemi + 1).trim();
		if (unparsed.length === 0) return c;
		const cookie_avs = unparsed.split(";");
		while (cookie_avs.length) {
			const av = (cookie_avs.shift() ?? "").trim();
			if (av.length === 0) continue;
			const av_sep = av.indexOf("=");
			let av_key, av_value;
			if (av_sep === -1) {
				av_key = av;
				av_value = null;
			} else {
				av_key = av.slice(0, av_sep);
				av_value = av.slice(av_sep + 1);
			}
			av_key = av_key.trim().toLowerCase();
			if (av_value) av_value = av_value.trim();
			switch (av_key) {
				case "expires":
					if (av_value) {
						const exp = (0, parseDate_1.parseDate)(av_value);
						if (exp) c.expires = exp;
					}
					break;
				case "max-age":
					if (av_value) {
						if (/^-?[0-9]+$/.test(av_value)) {
							const delta = parseInt(av_value, 10);
							c.setMaxAge(delta);
						}
					}
					break;
				case "domain":
					if (av_value) {
						const domain = av_value.trim().replace(/^\./, "");
						if (domain) c.domain = domain.toLowerCase();
					}
					break;
				case "path":
					c.path = av_value && av_value[0] === "/" ? av_value : null;
					break;
				case "secure":
					c.secure = true;
					break;
				case "httponly":
					c.httpOnly = true;
					break;
				case "samesite":
					switch (av_value ? av_value.toLowerCase() : "") {
						case "strict":
							c.sameSite = "strict";
							break;
						case "lax":
							c.sameSite = "lax";
							break;
						case "none":
							c.sameSite = "none";
							break;
						default:
							c.sameSite = void 0;
							break;
					}
					break;
				default:
					c.extensions = c.extensions || [];
					c.extensions.push(av);
					break;
			}
		}
		return c;
	}
	function fromJSON(str) {
		if (!str || validators.isEmptyString(str)) return;
		let obj;
		if (typeof str === "string") try {
			obj = JSON.parse(str);
		} catch {
			return;
		}
		else obj = str;
		const c = new Cookie();
		Cookie.serializableProperties.forEach((prop) => {
			if (obj && typeof obj === "object" && (0, utils_1.inOperator)(prop, obj)) {
				const val = obj[prop];
				if (val === void 0) return;
				if ((0, utils_1.inOperator)(prop, cookieDefaults) && val === cookieDefaults[prop]) return;
				switch (prop) {
					case "key":
					case "value":
					case "sameSite":
						if (typeof val === "string") c[prop] = val;
						break;
					case "expires":
					case "creation":
					case "lastAccessed":
						if (typeof val === "number" || typeof val === "string" || val instanceof Date) c[prop] = obj[prop] == "Infinity" ? "Infinity" : new Date(val);
						else if (val === null) c[prop] = null;
						break;
					case "maxAge":
						if (typeof val === "number" || val === "Infinity" || val === "-Infinity") c[prop] = val;
						break;
					case "domain":
					case "path":
						if (typeof val === "string" || val === null) c[prop] = val;
						break;
					case "secure":
					case "httpOnly":
						if (typeof val === "boolean") c[prop] = val;
						break;
					case "extensions":
						if (Array.isArray(val) && val.every((item) => typeof item === "string")) c[prop] = val;
						break;
					case "hostOnly":
					case "pathIsDefault":
						if (typeof val === "boolean" || val === null) c[prop] = val;
						break;
				}
			}
		});
		return c;
	}
	const cookieDefaults = {
		key: "",
		value: "",
		expires: "Infinity",
		maxAge: null,
		domain: null,
		path: null,
		secure: false,
		httpOnly: false,
		extensions: null,
		hostOnly: null,
		pathIsDefault: null,
		creation: null,
		lastAccessed: null,
		sameSite: void 0
	};
	/**
	* An HTTP cookie (web cookie, browser cookie) is a small piece of data that a server sends to a user's web browser.
	* It is defined in {@link https://www.rfc-editor.org/rfc/rfc6265.html | RFC6265}.
	* @public
	*/
	var Cookie = class Cookie {
		/**
		* Create a new Cookie instance.
		* @public
		* @param options - The attributes to set on the cookie
		*/
		constructor(options = {}) {
			this.key = options.key ?? cookieDefaults.key;
			this.value = options.value ?? cookieDefaults.value;
			this.expires = options.expires ?? cookieDefaults.expires;
			this.maxAge = options.maxAge ?? cookieDefaults.maxAge;
			this.domain = options.domain ?? cookieDefaults.domain;
			this.path = options.path ?? cookieDefaults.path;
			this.secure = options.secure ?? cookieDefaults.secure;
			this.httpOnly = options.httpOnly ?? cookieDefaults.httpOnly;
			this.extensions = options.extensions ?? cookieDefaults.extensions;
			this.creation = options.creation ?? cookieDefaults.creation;
			this.hostOnly = options.hostOnly ?? cookieDefaults.hostOnly;
			this.pathIsDefault = options.pathIsDefault ?? cookieDefaults.pathIsDefault;
			this.lastAccessed = options.lastAccessed ?? cookieDefaults.lastAccessed;
			this.sameSite = options.sameSite ?? cookieDefaults.sameSite;
			this.creation = options.creation ?? /* @__PURE__ */ new Date();
			Object.defineProperty(this, "creationIndex", {
				configurable: false,
				enumerable: false,
				writable: true,
				value: ++Cookie.cookiesCreated
			});
			this.creationIndex = Cookie.cookiesCreated;
		}
		[Symbol.for("nodejs.util.inspect.custom")]() {
			const now = Date.now();
			const hostOnly = this.hostOnly != null ? this.hostOnly.toString() : "?";
			const createAge = this.creation && this.creation !== "Infinity" ? `${String(now - this.creation.getTime())}ms` : "?";
			const accessAge = this.lastAccessed && this.lastAccessed !== "Infinity" ? `${String(now - this.lastAccessed.getTime())}ms` : "?";
			return `Cookie="${this.toString()}; hostOnly=${hostOnly}; aAge=${accessAge}; cAge=${createAge}"`;
		}
		/**
		* For convenience in using `JSON.stringify(cookie)`. Returns a plain-old Object that can be JSON-serialized.
		*
		* @remarks
		* - Any `Date` properties (such as {@link Cookie.expires}, {@link Cookie.creation}, and {@link Cookie.lastAccessed}) are exported in ISO format (`Date.toISOString()`).
		*
		*  - Custom Cookie properties are discarded. In tough-cookie 1.x, since there was no {@link Cookie.toJSON} method explicitly defined, all enumerable properties were captured.
		*      If you want a property to be serialized, add the property name to {@link Cookie.serializableProperties}.
		*/
		toJSON() {
			const obj = {};
			for (const prop of Cookie.serializableProperties) {
				const val = this[prop];
				if (val === cookieDefaults[prop]) continue;
				switch (prop) {
					case "key":
					case "value":
					case "sameSite":
						if (typeof val === "string") obj[prop] = val;
						break;
					case "expires":
					case "creation":
					case "lastAccessed":
						if (typeof val === "number" || typeof val === "string" || val instanceof Date) obj[prop] = val == "Infinity" ? "Infinity" : new Date(val).toISOString();
						else if (val === null) obj[prop] = null;
						break;
					case "maxAge":
						if (typeof val === "number" || val === "Infinity" || val === "-Infinity") obj[prop] = val;
						break;
					case "domain":
					case "path":
						if (typeof val === "string" || val === null) obj[prop] = val;
						break;
					case "secure":
					case "httpOnly":
						if (typeof val === "boolean") obj[prop] = val;
						break;
					case "extensions":
						if (Array.isArray(val)) obj[prop] = val;
						break;
					case "hostOnly":
					case "pathIsDefault":
						if (typeof val === "boolean" || val === null) obj[prop] = val;
						break;
				}
			}
			return obj;
		}
		/**
		* Does a deep clone of this cookie, implemented exactly as `Cookie.fromJSON(cookie.toJSON())`.
		* @public
		*/
		clone() {
			return fromJSON(this.toJSON());
		}
		/**
		* Validates cookie attributes for semantic correctness. Useful for "lint" checking any `Set-Cookie` headers you generate.
		* For now, it returns a boolean, but eventually could return a reason string.
		*
		* @remarks
		* Works for a few things, but is by no means comprehensive.
		*
		* @beta
		*/
		validate() {
			if (!this.value || !COOKIE_OCTETS.test(this.value)) return false;
			if (this.expires != "Infinity" && !(this.expires instanceof Date) && !(0, parseDate_1.parseDate)(this.expires)) return false;
			if (this.maxAge != null && this.maxAge !== "Infinity" && (this.maxAge === "-Infinity" || this.maxAge <= 0)) return false;
			if (this.path != null && !PATH_VALUE.test(this.path)) return false;
			const cdomain = this.cdomain();
			if (cdomain) {
				if (cdomain.match(/\.$/)) return false;
				if ((0, getPublicSuffix_1.getPublicSuffix)(cdomain) == null) return false;
			}
			return true;
		}
		/**
		* Sets the 'Expires' attribute on a cookie.
		*
		* @remarks
		* When given a `string` value it will be parsed with {@link parseDate}. If the value can't be parsed as a cookie date
		* then the 'Expires' attribute will be set to `"Infinity"`.
		*
		* @param exp - the new value for the 'Expires' attribute of the cookie.
		*/
		setExpires(exp) {
			if (exp instanceof Date) this.expires = exp;
			else this.expires = (0, parseDate_1.parseDate)(exp) || "Infinity";
		}
		/**
		* Sets the 'Max-Age' attribute (in seconds) on a cookie.
		*
		* @remarks
		* Coerces `-Infinity` to `"-Infinity"` and `Infinity` to `"Infinity"` so it can be serialized to JSON.
		*
		* @param age - the new value for the 'Max-Age' attribute (in seconds).
		*/
		setMaxAge(age) {
			if (age === Infinity) this.maxAge = "Infinity";
			else if (age === -Infinity) this.maxAge = "-Infinity";
			else this.maxAge = age;
		}
		/**
		* Encodes to a `Cookie` header value (specifically, the {@link Cookie.key} and {@link Cookie.value} properties joined with "=").
		* @public
		*/
		cookieString() {
			const val = this.value || "";
			if (this.key) return `${this.key}=${val}`;
			return val;
		}
		/**
		* Encodes to a `Set-Cookie header` value.
		* @public
		*/
		toString() {
			let str = this.cookieString();
			if (this.expires != "Infinity") {
				if (this.expires instanceof Date) str += `; Expires=${(0, formatDate_1.formatDate)(this.expires)}`;
			}
			if (this.maxAge != null && this.maxAge != Infinity) str += `; Max-Age=${String(this.maxAge)}`;
			if (this.domain && !this.hostOnly) str += `; Domain=${this.domain}`;
			if (this.path) str += `; Path=${this.path}`;
			if (this.secure) str += "; Secure";
			if (this.httpOnly) str += "; HttpOnly";
			if (this.sameSite && this.sameSite !== "none") if (this.sameSite.toLowerCase() === Cookie.sameSiteCanonical.lax.toLowerCase()) str += `; SameSite=${Cookie.sameSiteCanonical.lax}`;
			else if (this.sameSite.toLowerCase() === Cookie.sameSiteCanonical.strict.toLowerCase()) str += `; SameSite=${Cookie.sameSiteCanonical.strict}`;
			else str += `; SameSite=${this.sameSite}`;
			if (this.extensions) this.extensions.forEach((ext) => {
				str += `; ${ext}`;
			});
			return str;
		}
		/**
		* Computes the TTL relative to now (milliseconds).
		*
		* @remarks
		* - `Infinity` is returned for cookies without an explicit expiry
		*
		* - `0` is returned if the cookie is expired.
		*
		* - Otherwise a time-to-live in milliseconds is returned.
		*
		* @param now - passing an explicit value is mostly used for testing purposes since this defaults to the `Date.now()`
		* @public
		*/
		TTL(now = Date.now()) {
			if (this.maxAge != null && typeof this.maxAge === "number") return this.maxAge <= 0 ? 0 : this.maxAge * 1e3;
			const expires = this.expires;
			if (expires === "Infinity") return Infinity;
			return (expires?.getTime() ?? now) - (now || Date.now());
		}
		/**
		* Computes the absolute unix-epoch milliseconds that this cookie expires.
		*
		* The "Max-Age" attribute takes precedence over "Expires" (as per the RFC). The {@link Cookie.lastAccessed} attribute
		* (or the `now` parameter if given) is used to offset the {@link Cookie.maxAge} attribute.
		*
		* If Expires ({@link Cookie.expires}) is set, that's returned.
		*
		* @param now - can be used to provide a time offset (instead of {@link Cookie.lastAccessed}) to use when calculating the "Max-Age" value
		*/
		expiryTime(now) {
			if (this.maxAge != null) {
				const relativeTo = now || this.lastAccessed || /* @__PURE__ */ new Date();
				const maxAge = typeof this.maxAge === "number" ? this.maxAge : -Infinity;
				const age = maxAge <= 0 ? -Infinity : maxAge * 1e3;
				if (relativeTo === "Infinity") return Infinity;
				return relativeTo.getTime() + age;
			}
			if (this.expires == "Infinity") return Infinity;
			return this.expires ? this.expires.getTime() : void 0;
		}
		/**
		* Similar to {@link Cookie.expiryTime}, computes the absolute unix-epoch milliseconds that this cookie expires and returns it as a Date.
		*
		* The "Max-Age" attribute takes precedence over "Expires" (as per the RFC). The {@link Cookie.lastAccessed} attribute
		* (or the `now` parameter if given) is used to offset the {@link Cookie.maxAge} attribute.
		*
		* If Expires ({@link Cookie.expires}) is set, that's returned.
		*
		* @param now - can be used to provide a time offset (instead of {@link Cookie.lastAccessed}) to use when calculating the "Max-Age" value
		*/
		expiryDate(now) {
			const millisec = this.expiryTime(now);
			if (millisec == Infinity) return /* @__PURE__ */ new Date(2147483647e3);
			else if (millisec == -Infinity) return /* @__PURE__ */ new Date(0);
			else return millisec == void 0 ? void 0 : new Date(millisec);
		}
		/**
		* Indicates if the cookie has been persisted to a store or not.
		* @public
		*/
		isPersistent() {
			return this.maxAge != null || this.expires != "Infinity";
		}
		/**
		* Calls {@link canonicalDomain} with the {@link Cookie.domain} property.
		* @public
		*/
		canonicalizedDomain() {
			return (0, canonicalDomain_1.canonicalDomain)(this.domain);
		}
		/**
		* Alias for {@link Cookie.canonicalizedDomain}
		* @public
		*/
		cdomain() {
			return (0, canonicalDomain_1.canonicalDomain)(this.domain);
		}
		/**
		* Parses a string into a Cookie object.
		*
		* @remarks
		* Note: when parsing a `Cookie` header it must be split by ';' before each Cookie string can be parsed.
		*
		* @example
		* ```
		* // parse a `Set-Cookie` header
		* const setCookieHeader = 'a=bcd; Expires=Tue, 18 Oct 2011 07:05:03 GMT'
		* const cookie = Cookie.parse(setCookieHeader)
		* cookie.key === 'a'
		* cookie.value === 'bcd'
		* cookie.expires === new Date(Date.parse('Tue, 18 Oct 2011 07:05:03 GMT'))
		* ```
		*
		* @example
		* ```
		* // parse a `Cookie` header
		* const cookieHeader = 'name=value; name2=value2; name3=value3'
		* const cookies = cookieHeader.split(';').map(Cookie.parse)
		* cookies[0].name === 'name'
		* cookies[0].value === 'value'
		* cookies[1].name === 'name2'
		* cookies[1].value === 'value2'
		* cookies[2].name === 'name3'
		* cookies[2].value === 'value3'
		* ```
		*
		* @param str - The `Set-Cookie` header or a Cookie string to parse.
		* @param options - Configures `strict` or `loose` mode for cookie parsing
		*/
		static parse(str, options) {
			return parse(str, options);
		}
		/**
		* Does the reverse of {@link Cookie.toJSON}.
		*
		* @remarks
		* Any Date properties (such as .expires, .creation, and .lastAccessed) are parsed via Date.parse, not tough-cookie's parseDate, since ISO timestamps are being handled at this layer.
		*
		* @example
		* ```
		* const json = JSON.stringify({
		*   key: 'alpha',
		*   value: 'beta',
		*   domain: 'example.com',
		*   path: '/foo',
		*   expires: '2038-01-19T03:14:07.000Z',
		* })
		* const cookie = Cookie.fromJSON(json)
		* cookie.key === 'alpha'
		* cookie.value === 'beta'
		* cookie.domain === 'example.com'
		* cookie.path === '/foo'
		* cookie.expires === new Date(Date.parse('2038-01-19T03:14:07.000Z'))
		* ```
		*
		* @param str - An unparsed JSON string or a value that has already been parsed as JSON
		*/
		static fromJSON(str) {
			return fromJSON(str);
		}
	};
	exports.Cookie = Cookie;
	Cookie.cookiesCreated = 0;
	/**
	* @internal
	*/
	Cookie.sameSiteLevel = {
		strict: 3,
		lax: 2,
		none: 1
	};
	/**
	* @internal
	*/
	Cookie.sameSiteCanonical = {
		strict: "Strict",
		lax: "Lax"
	};
	/**
	* Cookie properties that will be serialized when using {@link Cookie.fromJSON} and {@link Cookie.toJSON}.
	* @public
	*/
	Cookie.serializableProperties = [
		"key",
		"value",
		"expires",
		"maxAge",
		"domain",
		"path",
		"secure",
		"httpOnly",
		"extensions",
		"hostOnly",
		"pathIsDefault",
		"creation",
		"lastAccessed",
		"sameSite"
	];
}));
//#endregion
//#region node_modules/tough-cookie/dist/cookie/cookieCompare.js
var require_cookieCompare = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.cookieCompare = cookieCompare;
	/**
	* The maximum timestamp a cookie, in milliseconds. The value is (2^31 - 1) seconds since the Unix
	* epoch, corresponding to 2038-01-19.
	*/
	const MAX_TIME = 2147483647e3;
	/**
	* A comparison function that can be used with {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort | Array.sort()},
	* which orders a list of cookies into the recommended order given in Step 2 of {@link https://www.rfc-editor.org/rfc/rfc6265.html#section-5.4 | RFC6265 - Section 5.4}.
	*
	* The sort algorithm is, in order of precedence:
	*
	* - Longest {@link Cookie.path}
	*
	* - Oldest {@link Cookie.creation} (which has a 1-ms precision, same as Date)
	*
	* - Lowest {@link Cookie.creationIndex} (to get beyond the 1-ms precision)
	*
	* @remarks
	* ### RFC6265 - Section 5.4 - Step 2
	*
	* The user agent SHOULD sort the cookie-list in the following order:
	*
	* - Cookies with longer paths are listed before cookies with shorter paths.
	*
	* - Among cookies that have equal-length path fields, cookies with
	*    earlier creation-times are listed before cookies with later
	*    creation-times.
	*
	* NOTE: Not all user agents sort the cookie-list in this order, but
	* this order reflects common practice when this document was
	* written, and, historically, there have been servers that
	* (erroneously) depended on this order.
	*
	* ### Custom Store Implementors
	*
	* Since the JavaScript Date is limited to a 1-ms precision, cookies within the same millisecond are entirely possible.
	* This is especially true when using the `now` option to `CookieJar.setCookie(...)`. The {@link Cookie.creationIndex}
	* property is a per-process global counter, assigned during construction with `new Cookie()`, which preserves the spirit
	* of the RFC sorting: older cookies go first. This works great for {@link MemoryCookieStore} since `Set-Cookie` headers
	* are parsed in order, but is not so great for distributed systems.
	*
	* Sophisticated Stores may wish to set this to some other
	* logical clock so that if cookies `A` and `B` are created in the same millisecond, but cookie `A` is created before
	* cookie `B`, then `A.creationIndex < B.creationIndex`.
	*
	* @example
	* ```
	* const cookies = [
	*   new Cookie({ key: 'a', value: '' }),
	*   new Cookie({ key: 'b', value: '' }),
	*   new Cookie({ key: 'c', value: '', path: '/path' }),
	*   new Cookie({ key: 'd', value: '', path: '/path' }),
	* ]
	* cookies.sort(cookieCompare)
	* // cookie sort order would be ['c', 'd', 'a', 'b']
	* ```
	*
	* @param a - the first Cookie for comparison
	* @param b - the second Cookie for comparison
	* @public
	*/
	function cookieCompare(a, b) {
		let cmp;
		const aPathLen = a.path ? a.path.length : 0;
		cmp = (b.path ? b.path.length : 0) - aPathLen;
		if (cmp !== 0) return cmp;
		cmp = (a.creation && a.creation instanceof Date ? a.creation.getTime() : MAX_TIME) - (b.creation && b.creation instanceof Date ? b.creation.getTime() : MAX_TIME);
		if (cmp !== 0) return cmp;
		cmp = (a.creationIndex || 0) - (b.creationIndex || 0);
		return cmp;
	}
}));
//#endregion
//#region node_modules/tough-cookie/dist/cookie/defaultPath.js
var require_defaultPath = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.defaultPath = defaultPath;
	/**
	* Given a current request/response path, gives the path appropriate for storing
	* in a cookie. This is basically the "directory" of a "file" in the path, but
	* is specified by {@link https://www.rfc-editor.org/rfc/rfc6265.html#section-5.1.4 | RFC6265 - Section 5.1.4}.
	*
	* @remarks
	* ### RFC6265 - Section 5.1.4
	*
	* The user agent MUST use an algorithm equivalent to the following algorithm to compute the default-path of a cookie:
	*
	* 1. Let uri-path be the path portion of the request-uri if such a
	*     portion exists (and empty otherwise).  For example, if the
	*     request-uri contains just a path (and optional query string),
	*     then the uri-path is that path (without the %x3F ("?") character
	*     or query string), and if the request-uri contains a full
	*     absoluteURI, the uri-path is the path component of that URI.
	*
	* 2. If the uri-path is empty or if the first character of the uri-
	*     path is not a %x2F ("/") character, output %x2F ("/") and skip
	*     the remaining steps.
	*
	* 3. If the uri-path contains no more than one %x2F ("/") character,
	*     output %x2F ("/") and skip the remaining step.
	*
	* 4. Output the characters of the uri-path from the first character up
	*     to, but not including, the right-most %x2F ("/").
	*
	* @example
	* ```
	* defaultPath('') === '/'
	* defaultPath('/some-path') === '/'
	* defaultPath('/some-parent-path/some-path') === '/some-parent-path'
	* defaultPath('relative-path') === '/'
	* ```
	*
	* @param path - the path portion of the request-uri (excluding the hostname, query, fragment, and so on)
	* @public
	*/
	function defaultPath(path) {
		if (!path || path.slice(0, 1) !== "/") return "/";
		if (path === "/") return path;
		const rightSlash = path.lastIndexOf("/");
		if (rightSlash === 0) return "/";
		return path.slice(0, rightSlash);
	}
}));
//#endregion
//#region node_modules/tough-cookie/dist/cookie/domainMatch.js
var require_domainMatch = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.domainMatch = domainMatch;
	const canonicalDomain_1 = require_canonicalDomain();
	const IP_REGEX_LOWERCASE = /(?:^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$)|(?:^(?:(?:[a-f\d]{1,4}:){7}(?:[a-f\d]{1,4}|:)|(?:[a-f\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-f\d]{1,4}|:)|(?:[a-f\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,2}|:)|(?:[a-f\d]{1,4}:){4}(?:(?::[a-f\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,3}|:)|(?:[a-f\d]{1,4}:){3}(?:(?::[a-f\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,4}|:)|(?:[a-f\d]{1,4}:){2}(?:(?::[a-f\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,5}|:)|(?:[a-f\d]{1,4}:){1}(?:(?::[a-f\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,6}|:)|(?::(?:(?::[a-f\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,7}|:)))$)/;
	/**
	* Answers "does this real domain match the domain in a cookie?". The `domain` is the "current" domain name and the
	* `cookieDomain` is the "cookie" domain name. Matches according to {@link https://www.rfc-editor.org/rfc/rfc6265.html#section-5.1.3 | RFC6265 - Section 5.1.3},
	* but it helps to think of it as a "suffix match".
	*
	* @remarks
	* ### 5.1.3.  Domain Matching
	*
	* A string domain-matches a given domain string if at least one of the
	* following conditions hold:
	*
	* - The domain string and the string are identical.  (Note that both
	*     the domain string and the string will have been canonicalized to
	*     lower case at this point.)
	*
	* - All of the following conditions hold:
	*
	*     - The domain string is a suffix of the string.
	*
	*     - The last character of the string that is not included in the
	*         domain string is a %x2E (".") character.
	*
	*     - The string is a host name (i.e., not an IP address).
	*
	* @example
	* ```
	* domainMatch('example.com', 'example.com') === true
	* domainMatch('eXaMpLe.cOm', 'ExAmPlE.CoM') === true
	* domainMatch('no.ca', 'yes.ca') === false
	* ```
	*
	* @param domain - The domain string to test
	* @param cookieDomain - The cookie domain string to match against
	* @param canonicalize - The canonicalize parameter toggles whether the domain parameters get normalized with canonicalDomain or not
	* @public
	*/
	function domainMatch(domain, cookieDomain, canonicalize) {
		if (domain == null || cookieDomain == null) return;
		let _str;
		let _domStr;
		if (canonicalize !== false) {
			_str = (0, canonicalDomain_1.canonicalDomain)(domain);
			_domStr = (0, canonicalDomain_1.canonicalDomain)(cookieDomain);
		} else {
			_str = domain;
			_domStr = cookieDomain;
		}
		if (_str == null || _domStr == null) return;
		if (_str == _domStr) return true;
		const idx = _str.lastIndexOf(_domStr);
		if (idx <= 0) return false;
		if (_str.length !== _domStr.length + idx) return false;
		if (_str.substring(idx - 1, idx) !== ".") return false;
		return !IP_REGEX_LOWERCASE.test(_str);
	}
}));
//#endregion
//#region node_modules/tough-cookie/dist/cookie/cookieJar.js
var require_cookieJar = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CookieJar = void 0;
	const getPublicSuffix_1 = require_getPublicSuffix();
	const validators = __importStar(require_validators());
	const validators_1 = require_validators();
	const store_1 = require_store();
	const memstore_1 = require_memstore();
	const pathMatch_1 = require_pathMatch();
	const cookie_1 = require_cookie$1();
	const utils_1 = require_utils();
	const canonicalDomain_1 = require_canonicalDomain();
	const constants_1 = require_constants();
	const defaultPath_1 = require_defaultPath();
	const domainMatch_1 = require_domainMatch();
	const cookieCompare_1 = require_cookieCompare();
	const version_1 = require_version();
	const defaultSetCookieOptions = {
		loose: false,
		sameSiteContext: void 0,
		ignoreError: false,
		http: true
	};
	const defaultGetCookieOptions = {
		http: true,
		expire: true,
		allPaths: false,
		sameSiteContext: void 0,
		sort: void 0
	};
	const SAME_SITE_CONTEXT_VAL_ERR = "Invalid sameSiteContext option for getCookies(); expected one of \"strict\", \"lax\", or \"none\"";
	function getCookieContext(url) {
		if (url && typeof url === "object" && "hostname" in url && typeof url.hostname === "string" && "pathname" in url && typeof url.pathname === "string" && "protocol" in url && typeof url.protocol === "string") return {
			hostname: url.hostname,
			pathname: url.pathname,
			protocol: url.protocol
		};
		else if (typeof url === "string") try {
			return new URL(decodeURI(url));
		} catch {
			return new URL(url);
		}
		else throw new validators_1.ParameterError("`url` argument is not a string or URL.");
	}
	function checkSameSiteContext(value) {
		const context = String(value).toLowerCase();
		if (context === "none" || context === "lax" || context === "strict") return context;
		else return;
	}
	/**
	*  If the cookie-name begins with a case-sensitive match for the
	*  string "__Secure-", abort these steps and ignore the cookie
	*  entirely unless the cookie's secure-only-flag is true.
	* @param cookie
	* @returns boolean
	*/
	function isSecurePrefixConditionMet(cookie) {
		return !(typeof cookie.key === "string" && cookie.key.startsWith("__Secure-")) || cookie.secure;
	}
	/**
	*  If the cookie-name begins with a case-sensitive match for the
	*  string "__Host-", abort these steps and ignore the cookie
	*  entirely unless the cookie meets all the following criteria:
	*    1.  The cookie's secure-only-flag is true.
	*    2.  The cookie's host-only-flag is true.
	*    3.  The cookie-attribute-list contains an attribute with an
	*        attribute-name of "Path", and the cookie's path is "/".
	* @param cookie
	* @returns boolean
	*/
	function isHostPrefixConditionMet(cookie) {
		return !(typeof cookie.key === "string" && cookie.key.startsWith("__Host-")) || Boolean(cookie.secure && cookie.hostOnly && cookie.path != null && cookie.path === "/");
	}
	function getNormalizedPrefixSecurity(prefixSecurity) {
		const normalizedPrefixSecurity = prefixSecurity.toLowerCase();
		switch (normalizedPrefixSecurity) {
			case constants_1.PrefixSecurityEnum.STRICT:
			case constants_1.PrefixSecurityEnum.SILENT:
			case constants_1.PrefixSecurityEnum.DISABLED: return normalizedPrefixSecurity;
			default: return constants_1.PrefixSecurityEnum.SILENT;
		}
	}
	exports.CookieJar = class CookieJar {
		/**
		* Creates a new `CookieJar` instance.
		*
		* @remarks
		* - If a custom store is not passed to the constructor, an in-memory store ({@link MemoryCookieStore} will be created and used.
		* - If a boolean value is passed as the `options` parameter, this is equivalent to passing `{ rejectPublicSuffixes: <value> }`
		*
		* @param store - a custom {@link Store} implementation (defaults to {@link MemoryCookieStore})
		* @param options - configures how cookies are processed by the cookie jar
		*/
		constructor(store, options) {
			if (typeof options === "boolean") options = { rejectPublicSuffixes: options };
			this.rejectPublicSuffixes = options?.rejectPublicSuffixes ?? true;
			this.enableLooseMode = options?.looseMode ?? false;
			this.allowSpecialUseDomain = options?.allowSpecialUseDomain ?? true;
			this.prefixSecurity = getNormalizedPrefixSecurity(options?.prefixSecurity ?? "silent");
			this.store = store ?? new memstore_1.MemoryCookieStore();
		}
		callSync(fn) {
			if (!this.store.synchronous) throw new Error("CookieJar store is not synchronous; use async API instead.");
			let syncErr = null;
			let syncResult = void 0;
			try {
				fn.call(this, (error, result) => {
					syncErr = error;
					syncResult = result;
				});
			} catch (err) {
				syncErr = err;
			}
			if (syncErr) throw syncErr;
			return syncResult;
		}
		/**
		* @internal No doc because this is the overload implementation
		*/
		setCookie(cookie, url, options, callback) {
			if (typeof options === "function") {
				callback = options;
				options = void 0;
			}
			const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
			const cb = promiseCallback.callback;
			let context;
			try {
				if (typeof url === "string") validators.validate(validators.isNonEmptyString(url), callback, (0, utils_1.safeToString)(options));
				context = getCookieContext(url);
				if (typeof url === "function") return promiseCallback.reject(/* @__PURE__ */ new Error("No URL was specified"));
				if (typeof options === "function") options = defaultSetCookieOptions;
				validators.validate(typeof cb === "function", cb);
				if (!validators.isNonEmptyString(cookie) && !validators.isObject(cookie) && cookie instanceof String && cookie.length == 0) return promiseCallback.resolve(void 0);
			} catch (err) {
				return promiseCallback.reject(err);
			}
			const host = (0, canonicalDomain_1.canonicalDomain)(context.hostname) ?? null;
			const loose = options?.loose || this.enableLooseMode;
			let sameSiteContext = null;
			if (options?.sameSiteContext) {
				sameSiteContext = checkSameSiteContext(options.sameSiteContext);
				if (!sameSiteContext) return promiseCallback.reject(/* @__PURE__ */ new Error(SAME_SITE_CONTEXT_VAL_ERR));
			}
			if (typeof cookie === "string" || cookie instanceof String) {
				const parsedCookie = cookie_1.Cookie.parse(cookie.toString(), { loose });
				if (!parsedCookie) {
					const err = /* @__PURE__ */ new Error("Cookie failed to parse");
					return options?.ignoreError ? promiseCallback.resolve(void 0) : promiseCallback.reject(err);
				}
				cookie = parsedCookie;
			} else if (!(cookie instanceof cookie_1.Cookie)) {
				const err = /* @__PURE__ */ new Error("First argument to setCookie must be a Cookie object or string");
				return options?.ignoreError ? promiseCallback.resolve(void 0) : promiseCallback.reject(err);
			}
			const now = options?.now || /* @__PURE__ */ new Date();
			if (this.rejectPublicSuffixes && cookie.domain) try {
				const cdomain = cookie.cdomain();
				if ((typeof cdomain === "string" ? (0, getPublicSuffix_1.getPublicSuffix)(cdomain, {
					allowSpecialUseDomain: this.allowSpecialUseDomain,
					ignoreError: options?.ignoreError
				}) : null) == null && !constants_1.IP_V6_REGEX_OBJECT.test(cookie.domain)) {
					const err = /* @__PURE__ */ new Error("Cookie has domain set to a public suffix");
					return options?.ignoreError ? promiseCallback.resolve(void 0) : promiseCallback.reject(err);
				}
			} catch (err) {
				return options?.ignoreError ? promiseCallback.resolve(void 0) : promiseCallback.reject(err);
			}
			if (cookie.domain) {
				if (!(0, domainMatch_1.domainMatch)(host ?? void 0, cookie.cdomain() ?? void 0, false)) {
					const err = /* @__PURE__ */ new Error(`Cookie not in this host's domain. Cookie:${cookie.cdomain() ?? "null"} Request:${host ?? "null"}`);
					return options?.ignoreError ? promiseCallback.resolve(void 0) : promiseCallback.reject(err);
				}
				if (cookie.hostOnly == null) cookie.hostOnly = false;
			} else {
				cookie.hostOnly = true;
				cookie.domain = host;
			}
			if (!cookie.path || cookie.path[0] !== "/") {
				cookie.path = (0, defaultPath_1.defaultPath)(context.pathname);
				cookie.pathIsDefault = true;
			}
			if (options?.http === false && cookie.httpOnly) {
				const err = /* @__PURE__ */ new Error("Cookie is HttpOnly and this isn't an HTTP API");
				return options.ignoreError ? promiseCallback.resolve(void 0) : promiseCallback.reject(err);
			}
			if (cookie.sameSite !== "none" && cookie.sameSite !== void 0 && sameSiteContext) {
				if (sameSiteContext === "none") {
					const err = /* @__PURE__ */ new Error("Cookie is SameSite but this is a cross-origin request");
					return options?.ignoreError ? promiseCallback.resolve(void 0) : promiseCallback.reject(err);
				}
			}
			const ignoreErrorForPrefixSecurity = this.prefixSecurity === constants_1.PrefixSecurityEnum.SILENT;
			if (!(this.prefixSecurity === constants_1.PrefixSecurityEnum.DISABLED)) {
				let errorFound = false;
				let errorMsg;
				if (!isSecurePrefixConditionMet(cookie)) {
					errorFound = true;
					errorMsg = "Cookie has __Secure prefix but Secure attribute is not set";
				} else if (!isHostPrefixConditionMet(cookie)) {
					errorFound = true;
					errorMsg = "Cookie has __Host prefix but either Secure or HostOnly attribute is not set or Path is not '/'";
				}
				if (errorFound) return options?.ignoreError || ignoreErrorForPrefixSecurity ? promiseCallback.resolve(void 0) : promiseCallback.reject(new Error(errorMsg));
			}
			const store = this.store;
			if (!store.updateCookie) store.updateCookie = async function(_oldCookie, newCookie, cb) {
				return this.putCookie(newCookie).then(() => cb?.(null), (error) => cb?.(error));
			};
			store.findCookie(cookie.domain, cookie.path, cookie.key, function withCookie(err, oldCookie) {
				if (err) {
					cb(err);
					return;
				}
				const next = function(err) {
					if (err) cb(err);
					else if (typeof cookie === "string") cb(null, void 0);
					else cb(null, cookie);
				};
				if (oldCookie) {
					if (options && "http" in options && options.http === false && oldCookie.httpOnly) {
						err = /* @__PURE__ */ new Error("old Cookie is HttpOnly and this isn't an HTTP API");
						if (options.ignoreError) cb(null, void 0);
						else cb(err);
						return;
					}
					if (cookie instanceof cookie_1.Cookie) {
						cookie.creation = oldCookie.creation;
						cookie.creationIndex = oldCookie.creationIndex;
						cookie.lastAccessed = now;
						store.updateCookie(oldCookie, cookie, next);
					}
				} else if (cookie instanceof cookie_1.Cookie) {
					cookie.creation = cookie.lastAccessed = now;
					store.putCookie(cookie, next);
				}
			});
			return promiseCallback.promise;
		}
		/**
		* Synchronously attempt to set the {@link Cookie} in the {@link CookieJar}.
		*
		* <strong>Note:</strong> Only works if the configured {@link Store} is also synchronous.
		*
		* @remarks
		* - If successfully persisted, the {@link Cookie} will have updated
		*     {@link Cookie.creation}, {@link Cookie.lastAccessed} and {@link Cookie.hostOnly}
		*     properties.
		*
		* - As per the RFC, the {@link Cookie.hostOnly} flag is set if there was no `Domain={value}`
		*     atttribute on the cookie string. The {@link Cookie.domain} property is set to the
		*     fully-qualified hostname of `currentUrl` in this case. Matching this cookie requires an
		*     exact hostname match (not a {@link domainMatch} as per usual)
		*
		* @param cookie - The cookie object or cookie string to store. A string value will be parsed into a cookie using {@link Cookie.parse}.
		* @param url - The domain to store the cookie with.
		* @param options - Configuration settings to use when storing the cookie.
		* @public
		*/
		setCookieSync(cookie, url, options) {
			const setCookieFn = options ? this.setCookie.bind(this, cookie, url, options) : this.setCookie.bind(this, cookie, url);
			return this.callSync(setCookieFn);
		}
		/**
		* @internal No doc because this is the overload implementation
		*/
		getCookies(url, options, callback) {
			if (typeof options === "function") {
				callback = options;
				options = defaultGetCookieOptions;
			} else if (options === void 0) options = defaultGetCookieOptions;
			const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
			const cb = promiseCallback.callback;
			let context;
			try {
				if (typeof url === "string") validators.validate(validators.isNonEmptyString(url), cb, url);
				context = getCookieContext(url);
				validators.validate(validators.isObject(options), cb, (0, utils_1.safeToString)(options));
				validators.validate(typeof cb === "function", cb);
			} catch (parameterError) {
				return promiseCallback.reject(parameterError);
			}
			const host = (0, canonicalDomain_1.canonicalDomain)(context.hostname);
			const path = context.pathname || "/";
			const secure = context.protocol && (context.protocol == "https:" || context.protocol == "wss:");
			let sameSiteLevel = 0;
			if (options.sameSiteContext) {
				const sameSiteContext = checkSameSiteContext(options.sameSiteContext);
				if (sameSiteContext == null) return promiseCallback.reject(/* @__PURE__ */ new Error(SAME_SITE_CONTEXT_VAL_ERR));
				sameSiteLevel = cookie_1.Cookie.sameSiteLevel[sameSiteContext];
				if (!sameSiteLevel) return promiseCallback.reject(/* @__PURE__ */ new Error(SAME_SITE_CONTEXT_VAL_ERR));
			}
			const http = options.http ?? true;
			const now = Date.now();
			const expireCheck = options.expire ?? true;
			const allPaths = options.allPaths ?? false;
			const store = this.store;
			function matchingCookie(c) {
				if (c.hostOnly) {
					if (c.domain != host) return false;
				} else if (!(0, domainMatch_1.domainMatch)(host ?? void 0, c.domain ?? void 0, false)) return false;
				if (!allPaths && typeof c.path === "string" && !(0, pathMatch_1.pathMatch)(path, c.path)) return false;
				if (c.secure && !secure) return false;
				if (c.httpOnly && !http) return false;
				if (sameSiteLevel) {
					let cookieLevel;
					if (c.sameSite === "lax") cookieLevel = cookie_1.Cookie.sameSiteLevel.lax;
					else if (c.sameSite === "strict") cookieLevel = cookie_1.Cookie.sameSiteLevel.strict;
					else cookieLevel = cookie_1.Cookie.sameSiteLevel.none;
					if (cookieLevel > sameSiteLevel) return false;
				}
				const expiryTime = c.expiryTime();
				if (expireCheck && expiryTime != void 0 && expiryTime <= now) {
					store.removeCookie(c.domain, c.path, c.key, () => {});
					return false;
				}
				return true;
			}
			store.findCookies(host, allPaths ? null : path, this.allowSpecialUseDomain, (err, cookies) => {
				if (err) {
					cb(err);
					return;
				}
				if (cookies == null) {
					cb(null, []);
					return;
				}
				cookies = cookies.filter(matchingCookie);
				if ("sort" in options && options.sort !== false) cookies = cookies.sort(cookieCompare_1.cookieCompare);
				const now = /* @__PURE__ */ new Date();
				for (const cookie of cookies) cookie.lastAccessed = now;
				cb(null, cookies);
			});
			return promiseCallback.promise;
		}
		/**
		* Synchronously retrieve the list of cookies that can be sent in a Cookie header for the
		* current URL.
		*
		* <strong>Note</strong>: Only works if the configured Store is also synchronous.
		*
		* @remarks
		* - The array of cookies returned will be sorted according to {@link cookieCompare}.
		*
		* - The {@link Cookie.lastAccessed} property will be updated on all returned cookies.
		*
		* @param url - The domain to store the cookie with.
		* @param options - Configuration settings to use when retrieving the cookies.
		*/
		getCookiesSync(url, options) {
			return this.callSync(this.getCookies.bind(this, url, options)) ?? [];
		}
		/**
		* @internal No doc because this is the overload implementation
		*/
		getCookieString(url, options, callback) {
			if (typeof options === "function") {
				callback = options;
				options = void 0;
			}
			const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
			const next = function(err, cookies) {
				if (err) promiseCallback.callback(err);
				else promiseCallback.callback(null, cookies?.sort(cookieCompare_1.cookieCompare).map((c) => c.cookieString()).join("; "));
			};
			this.getCookies(url, options, next);
			return promiseCallback.promise;
		}
		/**
		* Synchronous version of `.getCookieString()`. Accepts the same options as `.getCookies()` but returns a string suitable for a
		* `Cookie` header rather than an Array.
		*
		* <strong>Note</strong>: Only works if the configured Store is also synchronous.
		*
		* @param url - The domain to store the cookie with.
		* @param options - Configuration settings to use when retrieving the cookies.
		*/
		getCookieStringSync(url, options) {
			return this.callSync(options ? this.getCookieString.bind(this, url, options) : this.getCookieString.bind(this, url)) ?? "";
		}
		/**
		* @internal No doc because this is the overload implementation
		*/
		getSetCookieStrings(url, options, callback) {
			if (typeof options === "function") {
				callback = options;
				options = void 0;
			}
			const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
			const next = function(err, cookies) {
				if (err) promiseCallback.callback(err);
				else promiseCallback.callback(null, cookies?.map((c) => {
					return c.toString();
				}));
			};
			this.getCookies(url, options, next);
			return promiseCallback.promise;
		}
		/**
		* Synchronous version of `.getSetCookieStrings()`. Returns an array of strings suitable for `Set-Cookie` headers.
		* Accepts the same options as `.getCookies()`.
		*
		* <strong>Note</strong>: Only works if the configured Store is also synchronous.
		*
		* @param url - The domain to store the cookie with.
		* @param options - Configuration settings to use when retrieving the cookies.
		*/
		getSetCookieStringsSync(url, options = {}) {
			return this.callSync(this.getSetCookieStrings.bind(this, url, options)) ?? [];
		}
		/**
		* @internal No doc because this is the overload implementation
		*/
		serialize(callback) {
			const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
			let type = this.store.constructor.name;
			if (validators.isObject(type)) type = null;
			const serialized = {
				version: `tough-cookie@${version_1.version}`,
				storeType: type,
				rejectPublicSuffixes: this.rejectPublicSuffixes,
				enableLooseMode: this.enableLooseMode,
				allowSpecialUseDomain: this.allowSpecialUseDomain,
				prefixSecurity: getNormalizedPrefixSecurity(this.prefixSecurity),
				cookies: []
			};
			if (typeof this.store.getAllCookies !== "function") return promiseCallback.reject(/* @__PURE__ */ new Error("store does not support getAllCookies and cannot be serialized"));
			this.store.getAllCookies((err, cookies) => {
				if (err) {
					promiseCallback.callback(err);
					return;
				}
				if (cookies == null) {
					promiseCallback.callback(null, serialized);
					return;
				}
				serialized.cookies = cookies.map((cookie) => {
					const serializedCookie = cookie.toJSON();
					delete serializedCookie.creationIndex;
					return serializedCookie;
				});
				promiseCallback.callback(null, serialized);
			});
			return promiseCallback.promise;
		}
		/**
		* Serialize the CookieJar if the underlying store supports `.getAllCookies`.
		*
		* <strong>Note</strong>: Only works if the configured Store is also synchronous.
		*/
		serializeSync() {
			return this.callSync((callback) => {
				this.serialize(callback);
			});
		}
		/**
		* Alias of {@link CookieJar.serializeSync}. Allows the cookie to be serialized
		* with `JSON.stringify(cookieJar)`.
		*/
		toJSON() {
			return this.serializeSync();
		}
		/**
		* Use the class method CookieJar.deserialize instead of calling this directly
		* @internal
		*/
		_importCookies(serialized, callback) {
			let cookies = void 0;
			if (serialized && typeof serialized === "object" && (0, utils_1.inOperator)("cookies", serialized) && Array.isArray(serialized.cookies)) cookies = serialized.cookies;
			if (!cookies) {
				callback(/* @__PURE__ */ new Error("serialized jar has no cookies array"), void 0);
				return;
			}
			cookies = cookies.slice();
			const putNext = (err) => {
				if (err) {
					callback(err, void 0);
					return;
				}
				if (Array.isArray(cookies)) {
					if (!cookies.length) {
						callback(err, this);
						return;
					}
					let cookie;
					try {
						cookie = cookie_1.Cookie.fromJSON(cookies.shift());
					} catch (e) {
						callback(e instanceof Error ? e : /* @__PURE__ */ new Error(), void 0);
						return;
					}
					if (cookie === void 0) {
						putNext(null);
						return;
					}
					this.store.putCookie(cookie, putNext);
				}
			};
			putNext(null);
		}
		/**
		* @internal
		*/
		_importCookiesSync(serialized) {
			this.callSync(this._importCookies.bind(this, serialized));
		}
		/**
		* @internal No doc because this is the overload implementation
		*/
		clone(newStore, callback) {
			if (typeof newStore === "function") {
				callback = newStore;
				newStore = void 0;
			}
			const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
			const cb = promiseCallback.callback;
			this.serialize((err, serialized) => {
				if (err) return promiseCallback.reject(err);
				return CookieJar.deserialize(serialized ?? "", newStore, cb);
			});
			return promiseCallback.promise;
		}
		/**
		* @internal
		*/
		_cloneSync(newStore) {
			const cloneFn = newStore && typeof newStore !== "function" ? this.clone.bind(this, newStore) : this.clone.bind(this);
			return this.callSync((callback) => {
				cloneFn(callback);
			});
		}
		/**
		* Produces a deep clone of this CookieJar. Modifications to the original do
		* not affect the clone, and vice versa.
		*
		* <strong>Note</strong>: Only works if both the configured Store and destination
		* Store are synchronous.
		*
		* @remarks
		* - When no {@link Store} is provided, a new {@link MemoryCookieStore} will be used.
		*
		* - Transferring between store types is supported so long as the source
		*     implements `.getAllCookies()` and the destination implements `.putCookie()`.
		*
		* @param newStore - The target {@link Store} to clone cookies into.
		*/
		cloneSync(newStore) {
			if (!newStore) return this._cloneSync();
			if (!newStore.synchronous) throw new Error("CookieJar clone destination store is not synchronous; use async API instead.");
			return this._cloneSync(newStore);
		}
		/**
		* @internal No doc because this is the overload implementation
		*/
		removeAllCookies(callback) {
			const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
			const cb = promiseCallback.callback;
			const store = this.store;
			if (typeof store.removeAllCookies === "function" && store.removeAllCookies !== store_1.Store.prototype.removeAllCookies) {
				store.removeAllCookies(cb);
				return promiseCallback.promise;
			}
			store.getAllCookies((err, cookies) => {
				if (err) {
					cb(err);
					return;
				}
				if (!cookies) cookies = [];
				if (cookies.length === 0) {
					cb(null, void 0);
					return;
				}
				let completedCount = 0;
				const removeErrors = [];
				const removeCookieCb = function removeCookieCb(removeErr) {
					if (removeErr) removeErrors.push(removeErr);
					completedCount++;
					if (completedCount === cookies.length) {
						if (removeErrors[0]) cb(removeErrors[0]);
						else cb(null, void 0);
						return;
					}
				};
				cookies.forEach((cookie) => {
					store.removeCookie(cookie.domain, cookie.path, cookie.key, removeCookieCb);
				});
			});
			return promiseCallback.promise;
		}
		/**
		* Removes all cookies from the CookieJar.
		*
		* <strong>Note</strong>: Only works if the configured Store is also synchronous.
		*
		* @remarks
		* - This is a new backwards-compatible feature of tough-cookie version 2.5,
		*     so not all Stores will implement it efficiently. For Stores that do not
		*     implement `removeAllCookies`, the fallback is to call `removeCookie` after
		*     `getAllCookies`.
		*
		* - If `getAllCookies` fails or isn't implemented in the Store, an error is returned.
		*
		* - If one or more of the `removeCookie` calls fail, only the first error is returned.
		*/
		removeAllCookiesSync() {
			this.callSync((callback) => {
				this.removeAllCookies(callback);
			});
		}
		/**
		* @internal No doc because this is the overload implementation
		*/
		static deserialize(strOrObj, store, callback) {
			if (typeof store === "function") {
				callback = store;
				store = void 0;
			}
			const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
			let serialized;
			if (typeof strOrObj === "string") try {
				serialized = JSON.parse(strOrObj);
			} catch (e) {
				return promiseCallback.reject(e instanceof Error ? e : /* @__PURE__ */ new Error());
			}
			else serialized = strOrObj;
			const readSerializedProperty = (property) => {
				return serialized && typeof serialized === "object" && (0, utils_1.inOperator)(property, serialized) ? serialized[property] : void 0;
			};
			const readSerializedBoolean = (property) => {
				const value = readSerializedProperty(property);
				return typeof value === "boolean" ? value : void 0;
			};
			const readSerializedString = (property) => {
				const value = readSerializedProperty(property);
				return typeof value === "string" ? value : void 0;
			};
			const jar = new CookieJar(store, {
				rejectPublicSuffixes: readSerializedBoolean("rejectPublicSuffixes"),
				looseMode: readSerializedBoolean("enableLooseMode"),
				allowSpecialUseDomain: readSerializedBoolean("allowSpecialUseDomain"),
				prefixSecurity: getNormalizedPrefixSecurity(readSerializedString("prefixSecurity") ?? "silent")
			});
			jar._importCookies(serialized, (err) => {
				if (err) {
					promiseCallback.callback(err);
					return;
				}
				promiseCallback.callback(null, jar);
			});
			return promiseCallback.promise;
		}
		/**
		* A new CookieJar is created and the serialized {@link Cookie} values are added to
		* the underlying store. Each {@link Cookie} is added via `store.putCookie(...)` in
		* the order in which they appear in the serialization.
		*
		* <strong>Note</strong>: Only works if the configured Store is also synchronous.
		*
		* @remarks
		* - When no {@link Store} is provided, a new {@link MemoryCookieStore} will be used.
		*
		* - As a convenience, if `strOrObj` is a string, it is passed through `JSON.parse` first.
		*
		* @param strOrObj - A JSON string or object representing the deserialized cookies.
		* @param store - The underlying store to persist the deserialized cookies into.
		*/
		static deserializeSync(strOrObj, store) {
			const serialized = typeof strOrObj === "string" ? JSON.parse(strOrObj) : strOrObj;
			const readSerializedProperty = (property) => {
				return serialized && typeof serialized === "object" && (0, utils_1.inOperator)(property, serialized) ? serialized[property] : void 0;
			};
			const readSerializedBoolean = (property) => {
				const value = readSerializedProperty(property);
				return typeof value === "boolean" ? value : void 0;
			};
			const readSerializedString = (property) => {
				const value = readSerializedProperty(property);
				return typeof value === "string" ? value : void 0;
			};
			const jar = new CookieJar(store, {
				rejectPublicSuffixes: readSerializedBoolean("rejectPublicSuffixes"),
				looseMode: readSerializedBoolean("enableLooseMode"),
				allowSpecialUseDomain: readSerializedBoolean("allowSpecialUseDomain"),
				prefixSecurity: getNormalizedPrefixSecurity(readSerializedString("prefixSecurity") ?? "silent")
			});
			if (!jar.store.synchronous) throw new Error("CookieJar store is not synchronous; use async API instead.");
			jar._importCookiesSync(serialized);
			return jar;
		}
		/**
		* Alias of {@link CookieJar.deserializeSync}.
		*
		* @remarks
		* - When no {@link Store} is provided, a new {@link MemoryCookieStore} will be used.
		*
		* - As a convenience, if `strOrObj` is a string, it is passed through `JSON.parse` first.
		*
		* @param jsonString - A JSON string or object representing the deserialized cookies.
		* @param store - The underlying store to persist the deserialized cookies into.
		*/
		static fromJSON(jsonString, store) {
			return CookieJar.deserializeSync(jsonString, store);
		}
	};
}));
//#endregion
//#region node_modules/tough-cookie/dist/cookie/permutePath.js
var require_permutePath = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.permutePath = permutePath;
	/**
	* Generates the permutation of all possible values that {@link pathMatch} the `path` parameter.
	* The array is in longest-to-shortest order.  Useful when building custom {@link Store} implementations.
	*
	* @example
	* ```
	* permutePath('/foo/bar/')
	* // ['/foo/bar/', '/foo/bar', '/foo', '/']
	* ```
	*
	* @param path - the path to generate permutations for
	* @public
	*/
	function permutePath(path) {
		if (path === "/") return ["/"];
		const permutations = [path];
		while (path.length > 1) {
			const lindex = path.lastIndexOf("/");
			if (lindex === 0) break;
			path = path.slice(0, lindex);
			permutations.push(path);
		}
		permutations.push("/");
		return permutations;
	}
}));
//#endregion
//#region node_modules/tough-cookie/dist/cookie/index.js
var require_cookie = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.permutePath = exports.parseDate = exports.formatDate = exports.domainMatch = exports.defaultPath = exports.CookieJar = exports.cookieCompare = exports.Cookie = exports.PrefixSecurityEnum = exports.canonicalDomain = exports.version = exports.ParameterError = exports.Store = exports.getPublicSuffix = exports.permuteDomain = exports.pathMatch = exports.MemoryCookieStore = void 0;
	var memstore_1 = require_memstore();
	Object.defineProperty(exports, "MemoryCookieStore", {
		enumerable: true,
		get: function() {
			return memstore_1.MemoryCookieStore;
		}
	});
	var pathMatch_1 = require_pathMatch();
	Object.defineProperty(exports, "pathMatch", {
		enumerable: true,
		get: function() {
			return pathMatch_1.pathMatch;
		}
	});
	var permuteDomain_1 = require_permuteDomain();
	Object.defineProperty(exports, "permuteDomain", {
		enumerable: true,
		get: function() {
			return permuteDomain_1.permuteDomain;
		}
	});
	var getPublicSuffix_1 = require_getPublicSuffix();
	Object.defineProperty(exports, "getPublicSuffix", {
		enumerable: true,
		get: function() {
			return getPublicSuffix_1.getPublicSuffix;
		}
	});
	var store_1 = require_store();
	Object.defineProperty(exports, "Store", {
		enumerable: true,
		get: function() {
			return store_1.Store;
		}
	});
	var validators_1 = require_validators();
	Object.defineProperty(exports, "ParameterError", {
		enumerable: true,
		get: function() {
			return validators_1.ParameterError;
		}
	});
	var version_1 = require_version();
	Object.defineProperty(exports, "version", {
		enumerable: true,
		get: function() {
			return version_1.version;
		}
	});
	var canonicalDomain_1 = require_canonicalDomain();
	Object.defineProperty(exports, "canonicalDomain", {
		enumerable: true,
		get: function() {
			return canonicalDomain_1.canonicalDomain;
		}
	});
	var constants_1 = require_constants();
	Object.defineProperty(exports, "PrefixSecurityEnum", {
		enumerable: true,
		get: function() {
			return constants_1.PrefixSecurityEnum;
		}
	});
	var cookie_1 = require_cookie$1();
	Object.defineProperty(exports, "Cookie", {
		enumerable: true,
		get: function() {
			return cookie_1.Cookie;
		}
	});
	var cookieCompare_1 = require_cookieCompare();
	Object.defineProperty(exports, "cookieCompare", {
		enumerable: true,
		get: function() {
			return cookieCompare_1.cookieCompare;
		}
	});
	var cookieJar_1 = require_cookieJar();
	Object.defineProperty(exports, "CookieJar", {
		enumerable: true,
		get: function() {
			return cookieJar_1.CookieJar;
		}
	});
	var defaultPath_1 = require_defaultPath();
	Object.defineProperty(exports, "defaultPath", {
		enumerable: true,
		get: function() {
			return defaultPath_1.defaultPath;
		}
	});
	var domainMatch_1 = require_domainMatch();
	Object.defineProperty(exports, "domainMatch", {
		enumerable: true,
		get: function() {
			return domainMatch_1.domainMatch;
		}
	});
	var formatDate_1 = require_formatDate();
	Object.defineProperty(exports, "formatDate", {
		enumerable: true,
		get: function() {
			return formatDate_1.formatDate;
		}
	});
	var parseDate_1 = require_parseDate();
	Object.defineProperty(exports, "parseDate", {
		enumerable: true,
		get: function() {
			return parseDate_1.parseDate;
		}
	});
	var permutePath_1 = require_permutePath();
	Object.defineProperty(exports, "permutePath", {
		enumerable: true,
		get: function() {
			return permutePath_1.permutePath;
		}
	});
	require_cookie$1();
}));
//#endregion
//#region node_modules/crypto-js/core.js
var require_core = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory) {
		if (typeof exports === "object") module.exports = exports = factory();
		else if (typeof define === "function" && define.amd) define([], factory);
		else root.CryptoJS = factory();
	})(exports, function() {
		/**
		* CryptoJS core components.
		*/
		var CryptoJS = CryptoJS || function(Math, undefined) {
			var crypto;
			if (typeof window !== "undefined" && window.crypto) crypto = window.crypto;
			if (typeof self !== "undefined" && self.crypto) crypto = self.crypto;
			if (typeof globalThis !== "undefined" && globalThis.crypto) crypto = globalThis.crypto;
			if (!crypto && typeof window !== "undefined" && window.msCrypto) crypto = window.msCrypto;
			if (!crypto && typeof global !== "undefined" && global.crypto) crypto = global.crypto;
			if (!crypto && typeof __require === "function") try {
				crypto = __require("crypto");
			} catch (err) {}
			var cryptoSecureRandomInt = function() {
				if (crypto) {
					if (typeof crypto.getRandomValues === "function") try {
						return crypto.getRandomValues(/* @__PURE__ */ new Uint32Array(1))[0];
					} catch (err) {}
					if (typeof crypto.randomBytes === "function") try {
						return crypto.randomBytes(4).readInt32LE();
					} catch (err) {}
				}
				throw new Error("Native crypto module could not be used to get secure random number.");
			};
			var create = Object.create || function() {
				function F() {}
				return function(obj) {
					var subtype;
					F.prototype = obj;
					subtype = new F();
					F.prototype = null;
					return subtype;
				};
			}();
			/**
			* CryptoJS namespace.
			*/
			var C = {};
			/**
			* Library namespace.
			*/
			var C_lib = C.lib = {};
			/**
			* Base object for prototypal inheritance.
			*/
			var Base = C_lib.Base = function() {
				return {
					/**
					* Creates a new object that inherits from this object.
					*
					* @param {Object} overrides Properties to copy into the new object.
					*
					* @return {Object} The new object.
					*
					* @static
					*
					* @example
					*
					*     var MyType = CryptoJS.lib.Base.extend({
					*         field: 'value',
					*
					*         method: function () {
					*         }
					*     });
					*/
					extend: function(overrides) {
						var subtype = create(this);
						if (overrides) subtype.mixIn(overrides);
						if (!subtype.hasOwnProperty("init") || this.init === subtype.init) subtype.init = function() {
							subtype.$super.init.apply(this, arguments);
						};
						subtype.init.prototype = subtype;
						subtype.$super = this;
						return subtype;
					},
					/**
					* Extends this object and runs the init method.
					* Arguments to create() will be passed to init().
					*
					* @return {Object} The new object.
					*
					* @static
					*
					* @example
					*
					*     var instance = MyType.create();
					*/
					create: function() {
						var instance = this.extend();
						instance.init.apply(instance, arguments);
						return instance;
					},
					/**
					* Initializes a newly created object.
					* Override this method to add some logic when your objects are created.
					*
					* @example
					*
					*     var MyType = CryptoJS.lib.Base.extend({
					*         init: function () {
					*             // ...
					*         }
					*     });
					*/
					init: function() {},
					/**
					* Copies properties into this object.
					*
					* @param {Object} properties The properties to mix in.
					*
					* @example
					*
					*     MyType.mixIn({
					*         field: 'value'
					*     });
					*/
					mixIn: function(properties) {
						for (var propertyName in properties) if (properties.hasOwnProperty(propertyName)) this[propertyName] = properties[propertyName];
						if (properties.hasOwnProperty("toString")) this.toString = properties.toString;
					},
					/**
					* Creates a copy of this object.
					*
					* @return {Object} The clone.
					*
					* @example
					*
					*     var clone = instance.clone();
					*/
					clone: function() {
						return this.init.prototype.extend(this);
					}
				};
			}();
			/**
			* An array of 32-bit words.
			*
			* @property {Array} words The array of 32-bit words.
			* @property {number} sigBytes The number of significant bytes in this word array.
			*/
			var WordArray = C_lib.WordArray = Base.extend({
				/**
				* Initializes a newly created word array.
				*
				* @param {Array} words (Optional) An array of 32-bit words.
				* @param {number} sigBytes (Optional) The number of significant bytes in the words.
				*
				* @example
				*
				*     var wordArray = CryptoJS.lib.WordArray.create();
				*     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
				*     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
				*/
				init: function(words, sigBytes) {
					words = this.words = words || [];
					if (sigBytes != undefined) this.sigBytes = sigBytes;
					else this.sigBytes = words.length * 4;
				},
				/**
				* Converts this word array to a string.
				*
				* @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
				*
				* @return {string} The stringified word array.
				*
				* @example
				*
				*     var string = wordArray + '';
				*     var string = wordArray.toString();
				*     var string = wordArray.toString(CryptoJS.enc.Utf8);
				*/
				toString: function(encoder) {
					return (encoder || Hex).stringify(this);
				},
				/**
				* Concatenates a word array to this word array.
				*
				* @param {WordArray} wordArray The word array to append.
				*
				* @return {WordArray} This word array.
				*
				* @example
				*
				*     wordArray1.concat(wordArray2);
				*/
				concat: function(wordArray) {
					var thisWords = this.words;
					var thatWords = wordArray.words;
					var thisSigBytes = this.sigBytes;
					var thatSigBytes = wordArray.sigBytes;
					this.clamp();
					if (thisSigBytes % 4) for (var i = 0; i < thatSigBytes; i++) {
						var thatByte = thatWords[i >>> 2] >>> 24 - i % 4 * 8 & 255;
						thisWords[thisSigBytes + i >>> 2] |= thatByte << 24 - (thisSigBytes + i) % 4 * 8;
					}
					else for (var j = 0; j < thatSigBytes; j += 4) thisWords[thisSigBytes + j >>> 2] = thatWords[j >>> 2];
					this.sigBytes += thatSigBytes;
					return this;
				},
				/**
				* Removes insignificant bits.
				*
				* @example
				*
				*     wordArray.clamp();
				*/
				clamp: function() {
					var words = this.words;
					var sigBytes = this.sigBytes;
					words[sigBytes >>> 2] &= 4294967295 << 32 - sigBytes % 4 * 8;
					words.length = Math.ceil(sigBytes / 4);
				},
				/**
				* Creates a copy of this word array.
				*
				* @return {WordArray} The clone.
				*
				* @example
				*
				*     var clone = wordArray.clone();
				*/
				clone: function() {
					var clone = Base.clone.call(this);
					clone.words = this.words.slice(0);
					return clone;
				},
				/**
				* Creates a word array filled with random bytes.
				*
				* @param {number} nBytes The number of random bytes to generate.
				*
				* @return {WordArray} The random word array.
				*
				* @static
				*
				* @example
				*
				*     var wordArray = CryptoJS.lib.WordArray.random(16);
				*/
				random: function(nBytes) {
					var words = [];
					for (var i = 0; i < nBytes; i += 4) words.push(cryptoSecureRandomInt());
					return new WordArray.init(words, nBytes);
				}
			});
			/**
			* Encoder namespace.
			*/
			var C_enc = C.enc = {};
			/**
			* Hex encoding strategy.
			*/
			var Hex = C_enc.Hex = {
				/**
				* Converts a word array to a hex string.
				*
				* @param {WordArray} wordArray The word array.
				*
				* @return {string} The hex string.
				*
				* @static
				*
				* @example
				*
				*     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
				*/
				stringify: function(wordArray) {
					var words = wordArray.words;
					var sigBytes = wordArray.sigBytes;
					var hexChars = [];
					for (var i = 0; i < sigBytes; i++) {
						var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
						hexChars.push((bite >>> 4).toString(16));
						hexChars.push((bite & 15).toString(16));
					}
					return hexChars.join("");
				},
				/**
				* Converts a hex string to a word array.
				*
				* @param {string} hexStr The hex string.
				*
				* @return {WordArray} The word array.
				*
				* @static
				*
				* @example
				*
				*     var wordArray = CryptoJS.enc.Hex.parse(hexString);
				*/
				parse: function(hexStr) {
					var hexStrLength = hexStr.length;
					var words = [];
					for (var i = 0; i < hexStrLength; i += 2) words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << 24 - i % 8 * 4;
					return new WordArray.init(words, hexStrLength / 2);
				}
			};
			/**
			* Latin1 encoding strategy.
			*/
			var Latin1 = C_enc.Latin1 = {
				/**
				* Converts a word array to a Latin1 string.
				*
				* @param {WordArray} wordArray The word array.
				*
				* @return {string} The Latin1 string.
				*
				* @static
				*
				* @example
				*
				*     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
				*/
				stringify: function(wordArray) {
					var words = wordArray.words;
					var sigBytes = wordArray.sigBytes;
					var latin1Chars = [];
					for (var i = 0; i < sigBytes; i++) {
						var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
						latin1Chars.push(String.fromCharCode(bite));
					}
					return latin1Chars.join("");
				},
				/**
				* Converts a Latin1 string to a word array.
				*
				* @param {string} latin1Str The Latin1 string.
				*
				* @return {WordArray} The word array.
				*
				* @static
				*
				* @example
				*
				*     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
				*/
				parse: function(latin1Str) {
					var latin1StrLength = latin1Str.length;
					var words = [];
					for (var i = 0; i < latin1StrLength; i++) words[i >>> 2] |= (latin1Str.charCodeAt(i) & 255) << 24 - i % 4 * 8;
					return new WordArray.init(words, latin1StrLength);
				}
			};
			/**
			* UTF-8 encoding strategy.
			*/
			var Utf8 = C_enc.Utf8 = {
				/**
				* Converts a word array to a UTF-8 string.
				*
				* @param {WordArray} wordArray The word array.
				*
				* @return {string} The UTF-8 string.
				*
				* @static
				*
				* @example
				*
				*     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
				*/
				stringify: function(wordArray) {
					try {
						return decodeURIComponent(escape(Latin1.stringify(wordArray)));
					} catch (e) {
						throw new Error("Malformed UTF-8 data");
					}
				},
				/**
				* Converts a UTF-8 string to a word array.
				*
				* @param {string} utf8Str The UTF-8 string.
				*
				* @return {WordArray} The word array.
				*
				* @static
				*
				* @example
				*
				*     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
				*/
				parse: function(utf8Str) {
					return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
				}
			};
			/**
			* Abstract buffered block algorithm template.
			*
			* The property blockSize must be implemented in a concrete subtype.
			*
			* @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
			*/
			var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
				/**
				* Resets this block algorithm's data buffer to its initial state.
				*
				* @example
				*
				*     bufferedBlockAlgorithm.reset();
				*/
				reset: function() {
					this._data = new WordArray.init();
					this._nDataBytes = 0;
				},
				/**
				* Adds new data to this block algorithm's buffer.
				*
				* @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
				*
				* @example
				*
				*     bufferedBlockAlgorithm._append('data');
				*     bufferedBlockAlgorithm._append(wordArray);
				*/
				_append: function(data) {
					if (typeof data == "string") data = Utf8.parse(data);
					this._data.concat(data);
					this._nDataBytes += data.sigBytes;
				},
				/**
				* Processes available data blocks.
				*
				* This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
				*
				* @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
				*
				* @return {WordArray} The processed data.
				*
				* @example
				*
				*     var processedData = bufferedBlockAlgorithm._process();
				*     var processedData = bufferedBlockAlgorithm._process(!!'flush');
				*/
				_process: function(doFlush) {
					var processedWords;
					var data = this._data;
					var dataWords = data.words;
					var dataSigBytes = data.sigBytes;
					var blockSize = this.blockSize;
					var nBlocksReady = dataSigBytes / (blockSize * 4);
					if (doFlush) nBlocksReady = Math.ceil(nBlocksReady);
					else nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
					var nWordsReady = nBlocksReady * blockSize;
					var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);
					if (nWordsReady) {
						for (var offset = 0; offset < nWordsReady; offset += blockSize) this._doProcessBlock(dataWords, offset);
						processedWords = dataWords.splice(0, nWordsReady);
						data.sigBytes -= nBytesReady;
					}
					return new WordArray.init(processedWords, nBytesReady);
				},
				/**
				* Creates a copy of this object.
				*
				* @return {Object} The clone.
				*
				* @example
				*
				*     var clone = bufferedBlockAlgorithm.clone();
				*/
				clone: function() {
					var clone = Base.clone.call(this);
					clone._data = this._data.clone();
					return clone;
				},
				_minBufferSize: 0
			});
			C_lib.Hasher = BufferedBlockAlgorithm.extend({
				/**
				* Configuration options.
				*/
				cfg: Base.extend(),
				/**
				* Initializes a newly created hasher.
				*
				* @param {Object} cfg (Optional) The configuration options to use for this hash computation.
				*
				* @example
				*
				*     var hasher = CryptoJS.algo.SHA256.create();
				*/
				init: function(cfg) {
					this.cfg = this.cfg.extend(cfg);
					this.reset();
				},
				/**
				* Resets this hasher to its initial state.
				*
				* @example
				*
				*     hasher.reset();
				*/
				reset: function() {
					BufferedBlockAlgorithm.reset.call(this);
					this._doReset();
				},
				/**
				* Updates this hasher with a message.
				*
				* @param {WordArray|string} messageUpdate The message to append.
				*
				* @return {Hasher} This hasher.
				*
				* @example
				*
				*     hasher.update('message');
				*     hasher.update(wordArray);
				*/
				update: function(messageUpdate) {
					this._append(messageUpdate);
					this._process();
					return this;
				},
				/**
				* Finalizes the hash computation.
				* Note that the finalize operation is effectively a destructive, read-once operation.
				*
				* @param {WordArray|string} messageUpdate (Optional) A final message update.
				*
				* @return {WordArray} The hash.
				*
				* @example
				*
				*     var hash = hasher.finalize();
				*     var hash = hasher.finalize('message');
				*     var hash = hasher.finalize(wordArray);
				*/
				finalize: function(messageUpdate) {
					if (messageUpdate) this._append(messageUpdate);
					return this._doFinalize();
				},
				blockSize: 512 / 32,
				/**
				* Creates a shortcut function to a hasher's object interface.
				*
				* @param {Hasher} hasher The hasher to create a helper for.
				*
				* @return {Function} The shortcut function.
				*
				* @static
				*
				* @example
				*
				*     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
				*/
				_createHelper: function(hasher) {
					return function(message, cfg) {
						return new hasher.init(cfg).finalize(message);
					};
				},
				/**
				* Creates a shortcut function to the HMAC's object interface.
				*
				* @param {Hasher} hasher The hasher to use in this HMAC helper.
				*
				* @return {Function} The shortcut function.
				*
				* @static
				*
				* @example
				*
				*     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
				*/
				_createHmacHelper: function(hasher) {
					return function(message, key) {
						return new C_algo.HMAC.init(hasher, key).finalize(message);
					};
				}
			});
			/**
			* Algorithm namespace.
			*/
			var C_algo = C.algo = {};
			return C;
		}(Math);
		return CryptoJS;
	});
}));
//#endregion
//#region node_modules/crypto-js/x64-core.js
var require_x64_core = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory) {
		if (typeof exports === "object") module.exports = exports = factory(require_core());
		else if (typeof define === "function" && define.amd) define(["./core"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		(function(undefined) {
			var C = CryptoJS;
			var C_lib = C.lib;
			var Base = C_lib.Base;
			var X32WordArray = C_lib.WordArray;
			/**
			* x64 namespace.
			*/
			var C_x64 = C.x64 = {};
			C_x64.Word = Base.extend({ 
			/**
			* Initializes a newly created 64-bit word.
			*
			* @param {number} high The high 32 bits.
			* @param {number} low The low 32 bits.
			*
			* @example
			*
			*     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
			*/
init: function(high, low) {
				this.high = high;
				this.low = low;
			} });
			C_x64.WordArray = Base.extend({
				/**
				* Initializes a newly created word array.
				*
				* @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
				* @param {number} sigBytes (Optional) The number of significant bytes in the words.
				*
				* @example
				*
				*     var wordArray = CryptoJS.x64.WordArray.create();
				*
				*     var wordArray = CryptoJS.x64.WordArray.create([
				*         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
				*         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
				*     ]);
				*
				*     var wordArray = CryptoJS.x64.WordArray.create([
				*         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
				*         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
				*     ], 10);
				*/
				init: function(words, sigBytes) {
					words = this.words = words || [];
					if (sigBytes != undefined) this.sigBytes = sigBytes;
					else this.sigBytes = words.length * 8;
				},
				/**
				* Converts this 64-bit word array to a 32-bit word array.
				*
				* @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
				*
				* @example
				*
				*     var x32WordArray = x64WordArray.toX32();
				*/
				toX32: function() {
					var x64Words = this.words;
					var x64WordsLength = x64Words.length;
					var x32Words = [];
					for (var i = 0; i < x64WordsLength; i++) {
						var x64Word = x64Words[i];
						x32Words.push(x64Word.high);
						x32Words.push(x64Word.low);
					}
					return X32WordArray.create(x32Words, this.sigBytes);
				},
				/**
				* Creates a copy of this word array.
				*
				* @return {X64WordArray} The clone.
				*
				* @example
				*
				*     var clone = x64WordArray.clone();
				*/
				clone: function() {
					var clone = Base.clone.call(this);
					var words = clone.words = this.words.slice(0);
					var wordsLength = words.length;
					for (var i = 0; i < wordsLength; i++) words[i] = words[i].clone();
					return clone;
				}
			});
		})();
		return CryptoJS;
	});
}));
//#endregion
//#region node_modules/crypto-js/lib-typedarrays.js
var require_lib_typedarrays = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory) {
		if (typeof exports === "object") module.exports = exports = factory(require_core());
		else if (typeof define === "function" && define.amd) define(["./core"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		(function() {
			if (typeof ArrayBuffer != "function") return;
			var WordArray = CryptoJS.lib.WordArray;
			var superInit = WordArray.init;
			var subInit = WordArray.init = function(typedArray) {
				if (typedArray instanceof ArrayBuffer) typedArray = new Uint8Array(typedArray);
				if (typedArray instanceof Int8Array || typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray || typedArray instanceof Int16Array || typedArray instanceof Uint16Array || typedArray instanceof Int32Array || typedArray instanceof Uint32Array || typedArray instanceof Float32Array || typedArray instanceof Float64Array) typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
				if (typedArray instanceof Uint8Array) {
					var typedArrayByteLength = typedArray.byteLength;
					var words = [];
					for (var i = 0; i < typedArrayByteLength; i++) words[i >>> 2] |= typedArray[i] << 24 - i % 4 * 8;
					superInit.call(this, words, typedArrayByteLength);
				} else superInit.apply(this, arguments);
			};
			subInit.prototype = WordArray;
		})();
		return CryptoJS.lib.WordArray;
	});
}));
//#endregion
//#region node_modules/crypto-js/enc-utf16.js
var require_enc_utf16 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory) {
		if (typeof exports === "object") module.exports = exports = factory(require_core());
		else if (typeof define === "function" && define.amd) define(["./core"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		(function() {
			var C = CryptoJS;
			var WordArray = C.lib.WordArray;
			var C_enc = C.enc;
			C_enc.Utf16 = C_enc.Utf16BE = {
				/**
				* Converts a word array to a UTF-16 BE string.
				*
				* @param {WordArray} wordArray The word array.
				*
				* @return {string} The UTF-16 BE string.
				*
				* @static
				*
				* @example
				*
				*     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
				*/
				stringify: function(wordArray) {
					var words = wordArray.words;
					var sigBytes = wordArray.sigBytes;
					var utf16Chars = [];
					for (var i = 0; i < sigBytes; i += 2) {
						var codePoint = words[i >>> 2] >>> 16 - i % 4 * 8 & 65535;
						utf16Chars.push(String.fromCharCode(codePoint));
					}
					return utf16Chars.join("");
				},
				/**
				* Converts a UTF-16 BE string to a word array.
				*
				* @param {string} utf16Str The UTF-16 BE string.
				*
				* @return {WordArray} The word array.
				*
				* @static
				*
				* @example
				*
				*     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
				*/
				parse: function(utf16Str) {
					var utf16StrLength = utf16Str.length;
					var words = [];
					for (var i = 0; i < utf16StrLength; i++) words[i >>> 1] |= utf16Str.charCodeAt(i) << 16 - i % 2 * 16;
					return WordArray.create(words, utf16StrLength * 2);
				}
			};
			/**
			* UTF-16 LE encoding strategy.
			*/
			C_enc.Utf16LE = {
				/**
				* Converts a word array to a UTF-16 LE string.
				*
				* @param {WordArray} wordArray The word array.
				*
				* @return {string} The UTF-16 LE string.
				*
				* @static
				*
				* @example
				*
				*     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
				*/
				stringify: function(wordArray) {
					var words = wordArray.words;
					var sigBytes = wordArray.sigBytes;
					var utf16Chars = [];
					for (var i = 0; i < sigBytes; i += 2) {
						var codePoint = swapEndian(words[i >>> 2] >>> 16 - i % 4 * 8 & 65535);
						utf16Chars.push(String.fromCharCode(codePoint));
					}
					return utf16Chars.join("");
				},
				/**
				* Converts a UTF-16 LE string to a word array.
				*
				* @param {string} utf16Str The UTF-16 LE string.
				*
				* @return {WordArray} The word array.
				*
				* @static
				*
				* @example
				*
				*     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
				*/
				parse: function(utf16Str) {
					var utf16StrLength = utf16Str.length;
					var words = [];
					for (var i = 0; i < utf16StrLength; i++) words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << 16 - i % 2 * 16);
					return WordArray.create(words, utf16StrLength * 2);
				}
			};
			function swapEndian(word) {
				return word << 8 & 4278255360 | word >>> 8 & 16711935;
			}
		})();
		return CryptoJS.enc.Utf16;
	});
}));
//#endregion
//#region node_modules/crypto-js/enc-base64.js
var require_enc_base64 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory) {
		if (typeof exports === "object") module.exports = exports = factory(require_core());
		else if (typeof define === "function" && define.amd) define(["./core"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		(function() {
			var C = CryptoJS;
			var WordArray = C.lib.WordArray;
			var C_enc = C.enc;
			C_enc.Base64 = {
				/**
				* Converts a word array to a Base64 string.
				*
				* @param {WordArray} wordArray The word array.
				*
				* @return {string} The Base64 string.
				*
				* @static
				*
				* @example
				*
				*     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
				*/
				stringify: function(wordArray) {
					var words = wordArray.words;
					var sigBytes = wordArray.sigBytes;
					var map = this._map;
					wordArray.clamp();
					var base64Chars = [];
					for (var i = 0; i < sigBytes; i += 3) {
						var byte1 = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
						var byte2 = words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 255;
						var byte3 = words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 255;
						var triplet = byte1 << 16 | byte2 << 8 | byte3;
						for (var j = 0; j < 4 && i + j * .75 < sigBytes; j++) base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 63));
					}
					var paddingChar = map.charAt(64);
					if (paddingChar) while (base64Chars.length % 4) base64Chars.push(paddingChar);
					return base64Chars.join("");
				},
				/**
				* Converts a Base64 string to a word array.
				*
				* @param {string} base64Str The Base64 string.
				*
				* @return {WordArray} The word array.
				*
				* @static
				*
				* @example
				*
				*     var wordArray = CryptoJS.enc.Base64.parse(base64String);
				*/
				parse: function(base64Str) {
					var base64StrLength = base64Str.length;
					var map = this._map;
					var reverseMap = this._reverseMap;
					if (!reverseMap) {
						reverseMap = this._reverseMap = [];
						for (var j = 0; j < map.length; j++) reverseMap[map.charCodeAt(j)] = j;
					}
					var paddingChar = map.charAt(64);
					if (paddingChar) {
						var paddingIndex = base64Str.indexOf(paddingChar);
						if (paddingIndex !== -1) base64StrLength = paddingIndex;
					}
					return parseLoop(base64Str, base64StrLength, reverseMap);
				},
				_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
			};
			function parseLoop(base64Str, base64StrLength, reverseMap) {
				var words = [];
				var nBytes = 0;
				for (var i = 0; i < base64StrLength; i++) if (i % 4) {
					var bitsCombined = reverseMap[base64Str.charCodeAt(i - 1)] << i % 4 * 2 | reverseMap[base64Str.charCodeAt(i)] >>> 6 - i % 4 * 2;
					words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
					nBytes++;
				}
				return WordArray.create(words, nBytes);
			}
		})();
		return CryptoJS.enc.Base64;
	});
}));
//#endregion
//#region node_modules/crypto-js/enc-base64url.js
var require_enc_base64url = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory) {
		if (typeof exports === "object") module.exports = exports = factory(require_core());
		else if (typeof define === "function" && define.amd) define(["./core"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		(function() {
			var C = CryptoJS;
			var WordArray = C.lib.WordArray;
			var C_enc = C.enc;
			C_enc.Base64url = {
				/**
				* Converts a word array to a Base64url string.
				*
				* @param {WordArray} wordArray The word array.
				*
				* @param {boolean} urlSafe Whether to use url safe
				*
				* @return {string} The Base64url string.
				*
				* @static
				*
				* @example
				*
				*     var base64String = CryptoJS.enc.Base64url.stringify(wordArray);
				*/
				stringify: function(wordArray, urlSafe) {
					if (urlSafe === void 0) urlSafe = true;
					var words = wordArray.words;
					var sigBytes = wordArray.sigBytes;
					var map = urlSafe ? this._safe_map : this._map;
					wordArray.clamp();
					var base64Chars = [];
					for (var i = 0; i < sigBytes; i += 3) {
						var byte1 = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
						var byte2 = words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 255;
						var byte3 = words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 255;
						var triplet = byte1 << 16 | byte2 << 8 | byte3;
						for (var j = 0; j < 4 && i + j * .75 < sigBytes; j++) base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 63));
					}
					var paddingChar = map.charAt(64);
					if (paddingChar) while (base64Chars.length % 4) base64Chars.push(paddingChar);
					return base64Chars.join("");
				},
				/**
				* Converts a Base64url string to a word array.
				*
				* @param {string} base64Str The Base64url string.
				*
				* @param {boolean} urlSafe Whether to use url safe
				*
				* @return {WordArray} The word array.
				*
				* @static
				*
				* @example
				*
				*     var wordArray = CryptoJS.enc.Base64url.parse(base64String);
				*/
				parse: function(base64Str, urlSafe) {
					if (urlSafe === void 0) urlSafe = true;
					var base64StrLength = base64Str.length;
					var map = urlSafe ? this._safe_map : this._map;
					var reverseMap = this._reverseMap;
					if (!reverseMap) {
						reverseMap = this._reverseMap = [];
						for (var j = 0; j < map.length; j++) reverseMap[map.charCodeAt(j)] = j;
					}
					var paddingChar = map.charAt(64);
					if (paddingChar) {
						var paddingIndex = base64Str.indexOf(paddingChar);
						if (paddingIndex !== -1) base64StrLength = paddingIndex;
					}
					return parseLoop(base64Str, base64StrLength, reverseMap);
				},
				_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
				_safe_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
			};
			function parseLoop(base64Str, base64StrLength, reverseMap) {
				var words = [];
				var nBytes = 0;
				for (var i = 0; i < base64StrLength; i++) if (i % 4) {
					var bitsCombined = reverseMap[base64Str.charCodeAt(i - 1)] << i % 4 * 2 | reverseMap[base64Str.charCodeAt(i)] >>> 6 - i % 4 * 2;
					words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
					nBytes++;
				}
				return WordArray.create(words, nBytes);
			}
		})();
		return CryptoJS.enc.Base64url;
	});
}));
//#endregion
//#region node_modules/crypto-js/md5.js
var require_md5 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory) {
		if (typeof exports === "object") module.exports = exports = factory(require_core());
		else if (typeof define === "function" && define.amd) define(["./core"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		(function(Math) {
			var C = CryptoJS;
			var C_lib = C.lib;
			var WordArray = C_lib.WordArray;
			var Hasher = C_lib.Hasher;
			var C_algo = C.algo;
			var T = [];
			(function() {
				for (var i = 0; i < 64; i++) T[i] = Math.abs(Math.sin(i + 1)) * 4294967296 | 0;
			})();
			/**
			* MD5 hash algorithm.
			*/
			var MD5 = C_algo.MD5 = Hasher.extend({
				_doReset: function() {
					this._hash = new WordArray.init([
						1732584193,
						4023233417,
						2562383102,
						271733878
					]);
				},
				_doProcessBlock: function(M, offset) {
					for (var i = 0; i < 16; i++) {
						var offset_i = offset + i;
						var M_offset_i = M[offset_i];
						M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 16711935 | (M_offset_i << 24 | M_offset_i >>> 8) & 4278255360;
					}
					var H = this._hash.words;
					var M_offset_0 = M[offset + 0];
					var M_offset_1 = M[offset + 1];
					var M_offset_2 = M[offset + 2];
					var M_offset_3 = M[offset + 3];
					var M_offset_4 = M[offset + 4];
					var M_offset_5 = M[offset + 5];
					var M_offset_6 = M[offset + 6];
					var M_offset_7 = M[offset + 7];
					var M_offset_8 = M[offset + 8];
					var M_offset_9 = M[offset + 9];
					var M_offset_10 = M[offset + 10];
					var M_offset_11 = M[offset + 11];
					var M_offset_12 = M[offset + 12];
					var M_offset_13 = M[offset + 13];
					var M_offset_14 = M[offset + 14];
					var M_offset_15 = M[offset + 15];
					var a = H[0];
					var b = H[1];
					var c = H[2];
					var d = H[3];
					a = FF(a, b, c, d, M_offset_0, 7, T[0]);
					d = FF(d, a, b, c, M_offset_1, 12, T[1]);
					c = FF(c, d, a, b, M_offset_2, 17, T[2]);
					b = FF(b, c, d, a, M_offset_3, 22, T[3]);
					a = FF(a, b, c, d, M_offset_4, 7, T[4]);
					d = FF(d, a, b, c, M_offset_5, 12, T[5]);
					c = FF(c, d, a, b, M_offset_6, 17, T[6]);
					b = FF(b, c, d, a, M_offset_7, 22, T[7]);
					a = FF(a, b, c, d, M_offset_8, 7, T[8]);
					d = FF(d, a, b, c, M_offset_9, 12, T[9]);
					c = FF(c, d, a, b, M_offset_10, 17, T[10]);
					b = FF(b, c, d, a, M_offset_11, 22, T[11]);
					a = FF(a, b, c, d, M_offset_12, 7, T[12]);
					d = FF(d, a, b, c, M_offset_13, 12, T[13]);
					c = FF(c, d, a, b, M_offset_14, 17, T[14]);
					b = FF(b, c, d, a, M_offset_15, 22, T[15]);
					a = GG(a, b, c, d, M_offset_1, 5, T[16]);
					d = GG(d, a, b, c, M_offset_6, 9, T[17]);
					c = GG(c, d, a, b, M_offset_11, 14, T[18]);
					b = GG(b, c, d, a, M_offset_0, 20, T[19]);
					a = GG(a, b, c, d, M_offset_5, 5, T[20]);
					d = GG(d, a, b, c, M_offset_10, 9, T[21]);
					c = GG(c, d, a, b, M_offset_15, 14, T[22]);
					b = GG(b, c, d, a, M_offset_4, 20, T[23]);
					a = GG(a, b, c, d, M_offset_9, 5, T[24]);
					d = GG(d, a, b, c, M_offset_14, 9, T[25]);
					c = GG(c, d, a, b, M_offset_3, 14, T[26]);
					b = GG(b, c, d, a, M_offset_8, 20, T[27]);
					a = GG(a, b, c, d, M_offset_13, 5, T[28]);
					d = GG(d, a, b, c, M_offset_2, 9, T[29]);
					c = GG(c, d, a, b, M_offset_7, 14, T[30]);
					b = GG(b, c, d, a, M_offset_12, 20, T[31]);
					a = HH(a, b, c, d, M_offset_5, 4, T[32]);
					d = HH(d, a, b, c, M_offset_8, 11, T[33]);
					c = HH(c, d, a, b, M_offset_11, 16, T[34]);
					b = HH(b, c, d, a, M_offset_14, 23, T[35]);
					a = HH(a, b, c, d, M_offset_1, 4, T[36]);
					d = HH(d, a, b, c, M_offset_4, 11, T[37]);
					c = HH(c, d, a, b, M_offset_7, 16, T[38]);
					b = HH(b, c, d, a, M_offset_10, 23, T[39]);
					a = HH(a, b, c, d, M_offset_13, 4, T[40]);
					d = HH(d, a, b, c, M_offset_0, 11, T[41]);
					c = HH(c, d, a, b, M_offset_3, 16, T[42]);
					b = HH(b, c, d, a, M_offset_6, 23, T[43]);
					a = HH(a, b, c, d, M_offset_9, 4, T[44]);
					d = HH(d, a, b, c, M_offset_12, 11, T[45]);
					c = HH(c, d, a, b, M_offset_15, 16, T[46]);
					b = HH(b, c, d, a, M_offset_2, 23, T[47]);
					a = II(a, b, c, d, M_offset_0, 6, T[48]);
					d = II(d, a, b, c, M_offset_7, 10, T[49]);
					c = II(c, d, a, b, M_offset_14, 15, T[50]);
					b = II(b, c, d, a, M_offset_5, 21, T[51]);
					a = II(a, b, c, d, M_offset_12, 6, T[52]);
					d = II(d, a, b, c, M_offset_3, 10, T[53]);
					c = II(c, d, a, b, M_offset_10, 15, T[54]);
					b = II(b, c, d, a, M_offset_1, 21, T[55]);
					a = II(a, b, c, d, M_offset_8, 6, T[56]);
					d = II(d, a, b, c, M_offset_15, 10, T[57]);
					c = II(c, d, a, b, M_offset_6, 15, T[58]);
					b = II(b, c, d, a, M_offset_13, 21, T[59]);
					a = II(a, b, c, d, M_offset_4, 6, T[60]);
					d = II(d, a, b, c, M_offset_11, 10, T[61]);
					c = II(c, d, a, b, M_offset_2, 15, T[62]);
					b = II(b, c, d, a, M_offset_9, 21, T[63]);
					H[0] = H[0] + a | 0;
					H[1] = H[1] + b | 0;
					H[2] = H[2] + c | 0;
					H[3] = H[3] + d | 0;
				},
				_doFinalize: function() {
					var data = this._data;
					var dataWords = data.words;
					var nBitsTotal = this._nDataBytes * 8;
					var nBitsLeft = data.sigBytes * 8;
					dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
					var nBitsTotalH = Math.floor(nBitsTotal / 4294967296);
					var nBitsTotalL = nBitsTotal;
					dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = (nBitsTotalH << 8 | nBitsTotalH >>> 24) & 16711935 | (nBitsTotalH << 24 | nBitsTotalH >>> 8) & 4278255360;
					dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotalL << 8 | nBitsTotalL >>> 24) & 16711935 | (nBitsTotalL << 24 | nBitsTotalL >>> 8) & 4278255360;
					data.sigBytes = (dataWords.length + 1) * 4;
					this._process();
					var hash = this._hash;
					var H = hash.words;
					for (var i = 0; i < 4; i++) {
						var H_i = H[i];
						H[i] = (H_i << 8 | H_i >>> 24) & 16711935 | (H_i << 24 | H_i >>> 8) & 4278255360;
					}
					return hash;
				},
				clone: function() {
					var clone = Hasher.clone.call(this);
					clone._hash = this._hash.clone();
					return clone;
				}
			});
			function FF(a, b, c, d, x, s, t) {
				var n = a + (b & c | ~b & d) + x + t;
				return (n << s | n >>> 32 - s) + b;
			}
			function GG(a, b, c, d, x, s, t) {
				var n = a + (b & d | c & ~d) + x + t;
				return (n << s | n >>> 32 - s) + b;
			}
			function HH(a, b, c, d, x, s, t) {
				var n = a + (b ^ c ^ d) + x + t;
				return (n << s | n >>> 32 - s) + b;
			}
			function II(a, b, c, d, x, s, t) {
				var n = a + (c ^ (b | ~d)) + x + t;
				return (n << s | n >>> 32 - s) + b;
			}
			/**
			* Shortcut function to the hasher's object interface.
			*
			* @param {WordArray|string} message The message to hash.
			*
			* @return {WordArray} The hash.
			*
			* @static
			*
			* @example
			*
			*     var hash = CryptoJS.MD5('message');
			*     var hash = CryptoJS.MD5(wordArray);
			*/
			C.MD5 = Hasher._createHelper(MD5);
			/**
			* Shortcut function to the HMAC's object interface.
			*
			* @param {WordArray|string} message The message to hash.
			* @param {WordArray|string} key The secret key.
			*
			* @return {WordArray} The HMAC.
			*
			* @static
			*
			* @example
			*
			*     var hmac = CryptoJS.HmacMD5(message, key);
			*/
			C.HmacMD5 = Hasher._createHmacHelper(MD5);
		})(Math);
		return CryptoJS.MD5;
	});
}));
//#endregion
//#region node_modules/crypto-js/sha1.js
var require_sha1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory) {
		if (typeof exports === "object") module.exports = exports = factory(require_core());
		else if (typeof define === "function" && define.amd) define(["./core"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		(function() {
			var C = CryptoJS;
			var C_lib = C.lib;
			var WordArray = C_lib.WordArray;
			var Hasher = C_lib.Hasher;
			var C_algo = C.algo;
			var W = [];
			/**
			* SHA-1 hash algorithm.
			*/
			var SHA1 = C_algo.SHA1 = Hasher.extend({
				_doReset: function() {
					this._hash = new WordArray.init([
						1732584193,
						4023233417,
						2562383102,
						271733878,
						3285377520
					]);
				},
				_doProcessBlock: function(M, offset) {
					var H = this._hash.words;
					var a = H[0];
					var b = H[1];
					var c = H[2];
					var d = H[3];
					var e = H[4];
					for (var i = 0; i < 80; i++) {
						if (i < 16) W[i] = M[offset + i] | 0;
						else {
							var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
							W[i] = n << 1 | n >>> 31;
						}
						var t = (a << 5 | a >>> 27) + e + W[i];
						if (i < 20) t += (b & c | ~b & d) + 1518500249;
						else if (i < 40) t += (b ^ c ^ d) + 1859775393;
						else if (i < 60) t += (b & c | b & d | c & d) - 1894007588;
						else t += (b ^ c ^ d) - 899497514;
						e = d;
						d = c;
						c = b << 30 | b >>> 2;
						b = a;
						a = t;
					}
					H[0] = H[0] + a | 0;
					H[1] = H[1] + b | 0;
					H[2] = H[2] + c | 0;
					H[3] = H[3] + d | 0;
					H[4] = H[4] + e | 0;
				},
				_doFinalize: function() {
					var data = this._data;
					var dataWords = data.words;
					var nBitsTotal = this._nDataBytes * 8;
					var nBitsLeft = data.sigBytes * 8;
					dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
					dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 4294967296);
					dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
					data.sigBytes = dataWords.length * 4;
					this._process();
					return this._hash;
				},
				clone: function() {
					var clone = Hasher.clone.call(this);
					clone._hash = this._hash.clone();
					return clone;
				}
			});
			/**
			* Shortcut function to the hasher's object interface.
			*
			* @param {WordArray|string} message The message to hash.
			*
			* @return {WordArray} The hash.
			*
			* @static
			*
			* @example
			*
			*     var hash = CryptoJS.SHA1('message');
			*     var hash = CryptoJS.SHA1(wordArray);
			*/
			C.SHA1 = Hasher._createHelper(SHA1);
			/**
			* Shortcut function to the HMAC's object interface.
			*
			* @param {WordArray|string} message The message to hash.
			* @param {WordArray|string} key The secret key.
			*
			* @return {WordArray} The HMAC.
			*
			* @static
			*
			* @example
			*
			*     var hmac = CryptoJS.HmacSHA1(message, key);
			*/
			C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
		})();
		return CryptoJS.SHA1;
	});
}));
//#endregion
//#region node_modules/crypto-js/sha256.js
var require_sha256 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory) {
		if (typeof exports === "object") module.exports = exports = factory(require_core());
		else if (typeof define === "function" && define.amd) define(["./core"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		(function(Math) {
			var C = CryptoJS;
			var C_lib = C.lib;
			var WordArray = C_lib.WordArray;
			var Hasher = C_lib.Hasher;
			var C_algo = C.algo;
			var H = [];
			var K = [];
			(function() {
				function isPrime(n) {
					var sqrtN = Math.sqrt(n);
					for (var factor = 2; factor <= sqrtN; factor++) if (!(n % factor)) return false;
					return true;
				}
				function getFractionalBits(n) {
					return (n - (n | 0)) * 4294967296 | 0;
				}
				var n = 2;
				var nPrime = 0;
				while (nPrime < 64) {
					if (isPrime(n)) {
						if (nPrime < 8) H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
						K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));
						nPrime++;
					}
					n++;
				}
			})();
			var W = [];
			/**
			* SHA-256 hash algorithm.
			*/
			var SHA256 = C_algo.SHA256 = Hasher.extend({
				_doReset: function() {
					this._hash = new WordArray.init(H.slice(0));
				},
				_doProcessBlock: function(M, offset) {
					var H = this._hash.words;
					var a = H[0];
					var b = H[1];
					var c = H[2];
					var d = H[3];
					var e = H[4];
					var f = H[5];
					var g = H[6];
					var h = H[7];
					for (var i = 0; i < 64; i++) {
						if (i < 16) W[i] = M[offset + i] | 0;
						else {
							var gamma0x = W[i - 15];
							var gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;
							var gamma1x = W[i - 2];
							var gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;
							W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
						}
						var ch = e & f ^ ~e & g;
						var maj = a & b ^ a & c ^ b & c;
						var sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);
						var sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);
						var t1 = h + sigma1 + ch + K[i] + W[i];
						var t2 = sigma0 + maj;
						h = g;
						g = f;
						f = e;
						e = d + t1 | 0;
						d = c;
						c = b;
						b = a;
						a = t1 + t2 | 0;
					}
					H[0] = H[0] + a | 0;
					H[1] = H[1] + b | 0;
					H[2] = H[2] + c | 0;
					H[3] = H[3] + d | 0;
					H[4] = H[4] + e | 0;
					H[5] = H[5] + f | 0;
					H[6] = H[6] + g | 0;
					H[7] = H[7] + h | 0;
				},
				_doFinalize: function() {
					var data = this._data;
					var dataWords = data.words;
					var nBitsTotal = this._nDataBytes * 8;
					var nBitsLeft = data.sigBytes * 8;
					dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
					dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 4294967296);
					dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
					data.sigBytes = dataWords.length * 4;
					this._process();
					return this._hash;
				},
				clone: function() {
					var clone = Hasher.clone.call(this);
					clone._hash = this._hash.clone();
					return clone;
				}
			});
			/**
			* Shortcut function to the hasher's object interface.
			*
			* @param {WordArray|string} message The message to hash.
			*
			* @return {WordArray} The hash.
			*
			* @static
			*
			* @example
			*
			*     var hash = CryptoJS.SHA256('message');
			*     var hash = CryptoJS.SHA256(wordArray);
			*/
			C.SHA256 = Hasher._createHelper(SHA256);
			/**
			* Shortcut function to the HMAC's object interface.
			*
			* @param {WordArray|string} message The message to hash.
			* @param {WordArray|string} key The secret key.
			*
			* @return {WordArray} The HMAC.
			*
			* @static
			*
			* @example
			*
			*     var hmac = CryptoJS.HmacSHA256(message, key);
			*/
			C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
		})(Math);
		return CryptoJS.SHA256;
	});
}));
//#endregion
//#region node_modules/crypto-js/sha224.js
var require_sha224 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_sha256());
		else if (typeof define === "function" && define.amd) define(["./core", "./sha256"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		(function() {
			var C = CryptoJS;
			var WordArray = C.lib.WordArray;
			var C_algo = C.algo;
			var SHA256 = C_algo.SHA256;
			/**
			* SHA-224 hash algorithm.
			*/
			var SHA224 = C_algo.SHA224 = SHA256.extend({
				_doReset: function() {
					this._hash = new WordArray.init([
						3238371032,
						914150663,
						812702999,
						4144912697,
						4290775857,
						1750603025,
						1694076839,
						3204075428
					]);
				},
				_doFinalize: function() {
					var hash = SHA256._doFinalize.call(this);
					hash.sigBytes -= 4;
					return hash;
				}
			});
			/**
			* Shortcut function to the hasher's object interface.
			*
			* @param {WordArray|string} message The message to hash.
			*
			* @return {WordArray} The hash.
			*
			* @static
			*
			* @example
			*
			*     var hash = CryptoJS.SHA224('message');
			*     var hash = CryptoJS.SHA224(wordArray);
			*/
			C.SHA224 = SHA256._createHelper(SHA224);
			/**
			* Shortcut function to the HMAC's object interface.
			*
			* @param {WordArray|string} message The message to hash.
			* @param {WordArray|string} key The secret key.
			*
			* @return {WordArray} The HMAC.
			*
			* @static
			*
			* @example
			*
			*     var hmac = CryptoJS.HmacSHA224(message, key);
			*/
			C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
		})();
		return CryptoJS.SHA224;
	});
}));
//#endregion
//#region node_modules/crypto-js/sha512.js
var require_sha512 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_x64_core());
		else if (typeof define === "function" && define.amd) define(["./core", "./x64-core"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		(function() {
			var C = CryptoJS;
			var Hasher = C.lib.Hasher;
			var C_x64 = C.x64;
			var X64Word = C_x64.Word;
			var X64WordArray = C_x64.WordArray;
			var C_algo = C.algo;
			function X64Word_create() {
				return X64Word.create.apply(X64Word, arguments);
			}
			var K = [
				X64Word_create(1116352408, 3609767458),
				X64Word_create(1899447441, 602891725),
				X64Word_create(3049323471, 3964484399),
				X64Word_create(3921009573, 2173295548),
				X64Word_create(961987163, 4081628472),
				X64Word_create(1508970993, 3053834265),
				X64Word_create(2453635748, 2937671579),
				X64Word_create(2870763221, 3664609560),
				X64Word_create(3624381080, 2734883394),
				X64Word_create(310598401, 1164996542),
				X64Word_create(607225278, 1323610764),
				X64Word_create(1426881987, 3590304994),
				X64Word_create(1925078388, 4068182383),
				X64Word_create(2162078206, 991336113),
				X64Word_create(2614888103, 633803317),
				X64Word_create(3248222580, 3479774868),
				X64Word_create(3835390401, 2666613458),
				X64Word_create(4022224774, 944711139),
				X64Word_create(264347078, 2341262773),
				X64Word_create(604807628, 2007800933),
				X64Word_create(770255983, 1495990901),
				X64Word_create(1249150122, 1856431235),
				X64Word_create(1555081692, 3175218132),
				X64Word_create(1996064986, 2198950837),
				X64Word_create(2554220882, 3999719339),
				X64Word_create(2821834349, 766784016),
				X64Word_create(2952996808, 2566594879),
				X64Word_create(3210313671, 3203337956),
				X64Word_create(3336571891, 1034457026),
				X64Word_create(3584528711, 2466948901),
				X64Word_create(113926993, 3758326383),
				X64Word_create(338241895, 168717936),
				X64Word_create(666307205, 1188179964),
				X64Word_create(773529912, 1546045734),
				X64Word_create(1294757372, 1522805485),
				X64Word_create(1396182291, 2643833823),
				X64Word_create(1695183700, 2343527390),
				X64Word_create(1986661051, 1014477480),
				X64Word_create(2177026350, 1206759142),
				X64Word_create(2456956037, 344077627),
				X64Word_create(2730485921, 1290863460),
				X64Word_create(2820302411, 3158454273),
				X64Word_create(3259730800, 3505952657),
				X64Word_create(3345764771, 106217008),
				X64Word_create(3516065817, 3606008344),
				X64Word_create(3600352804, 1432725776),
				X64Word_create(4094571909, 1467031594),
				X64Word_create(275423344, 851169720),
				X64Word_create(430227734, 3100823752),
				X64Word_create(506948616, 1363258195),
				X64Word_create(659060556, 3750685593),
				X64Word_create(883997877, 3785050280),
				X64Word_create(958139571, 3318307427),
				X64Word_create(1322822218, 3812723403),
				X64Word_create(1537002063, 2003034995),
				X64Word_create(1747873779, 3602036899),
				X64Word_create(1955562222, 1575990012),
				X64Word_create(2024104815, 1125592928),
				X64Word_create(2227730452, 2716904306),
				X64Word_create(2361852424, 442776044),
				X64Word_create(2428436474, 593698344),
				X64Word_create(2756734187, 3733110249),
				X64Word_create(3204031479, 2999351573),
				X64Word_create(3329325298, 3815920427),
				X64Word_create(3391569614, 3928383900),
				X64Word_create(3515267271, 566280711),
				X64Word_create(3940187606, 3454069534),
				X64Word_create(4118630271, 4000239992),
				X64Word_create(116418474, 1914138554),
				X64Word_create(174292421, 2731055270),
				X64Word_create(289380356, 3203993006),
				X64Word_create(460393269, 320620315),
				X64Word_create(685471733, 587496836),
				X64Word_create(852142971, 1086792851),
				X64Word_create(1017036298, 365543100),
				X64Word_create(1126000580, 2618297676),
				X64Word_create(1288033470, 3409855158),
				X64Word_create(1501505948, 4234509866),
				X64Word_create(1607167915, 987167468),
				X64Word_create(1816402316, 1246189591)
			];
			var W = [];
			(function() {
				for (var i = 0; i < 80; i++) W[i] = X64Word_create();
			})();
			/**
			* SHA-512 hash algorithm.
			*/
			var SHA512 = C_algo.SHA512 = Hasher.extend({
				_doReset: function() {
					this._hash = new X64WordArray.init([
						new X64Word.init(1779033703, 4089235720),
						new X64Word.init(3144134277, 2227873595),
						new X64Word.init(1013904242, 4271175723),
						new X64Word.init(2773480762, 1595750129),
						new X64Word.init(1359893119, 2917565137),
						new X64Word.init(2600822924, 725511199),
						new X64Word.init(528734635, 4215389547),
						new X64Word.init(1541459225, 327033209)
					]);
				},
				_doProcessBlock: function(M, offset) {
					var H = this._hash.words;
					var H0 = H[0];
					var H1 = H[1];
					var H2 = H[2];
					var H3 = H[3];
					var H4 = H[4];
					var H5 = H[5];
					var H6 = H[6];
					var H7 = H[7];
					var H0h = H0.high;
					var H0l = H0.low;
					var H1h = H1.high;
					var H1l = H1.low;
					var H2h = H2.high;
					var H2l = H2.low;
					var H3h = H3.high;
					var H3l = H3.low;
					var H4h = H4.high;
					var H4l = H4.low;
					var H5h = H5.high;
					var H5l = H5.low;
					var H6h = H6.high;
					var H6l = H6.low;
					var H7h = H7.high;
					var H7l = H7.low;
					var ah = H0h;
					var al = H0l;
					var bh = H1h;
					var bl = H1l;
					var ch = H2h;
					var cl = H2l;
					var dh = H3h;
					var dl = H3l;
					var eh = H4h;
					var el = H4l;
					var fh = H5h;
					var fl = H5l;
					var gh = H6h;
					var gl = H6l;
					var hh = H7h;
					var hl = H7l;
					for (var i = 0; i < 80; i++) {
						var Wil;
						var Wih;
						var Wi = W[i];
						if (i < 16) {
							Wih = Wi.high = M[offset + i * 2] | 0;
							Wil = Wi.low = M[offset + i * 2 + 1] | 0;
						} else {
							var gamma0x = W[i - 15];
							var gamma0xh = gamma0x.high;
							var gamma0xl = gamma0x.low;
							var gamma0h = (gamma0xh >>> 1 | gamma0xl << 31) ^ (gamma0xh >>> 8 | gamma0xl << 24) ^ gamma0xh >>> 7;
							var gamma0l = (gamma0xl >>> 1 | gamma0xh << 31) ^ (gamma0xl >>> 8 | gamma0xh << 24) ^ (gamma0xl >>> 7 | gamma0xh << 25);
							var gamma1x = W[i - 2];
							var gamma1xh = gamma1x.high;
							var gamma1xl = gamma1x.low;
							var gamma1h = (gamma1xh >>> 19 | gamma1xl << 13) ^ (gamma1xh << 3 | gamma1xl >>> 29) ^ gamma1xh >>> 6;
							var gamma1l = (gamma1xl >>> 19 | gamma1xh << 13) ^ (gamma1xl << 3 | gamma1xh >>> 29) ^ (gamma1xl >>> 6 | gamma1xh << 26);
							var Wi7 = W[i - 7];
							var Wi7h = Wi7.high;
							var Wi7l = Wi7.low;
							var Wi16 = W[i - 16];
							var Wi16h = Wi16.high;
							var Wi16l = Wi16.low;
							Wil = gamma0l + Wi7l;
							Wih = gamma0h + Wi7h + (Wil >>> 0 < gamma0l >>> 0 ? 1 : 0);
							Wil = Wil + gamma1l;
							Wih = Wih + gamma1h + (Wil >>> 0 < gamma1l >>> 0 ? 1 : 0);
							Wil = Wil + Wi16l;
							Wih = Wih + Wi16h + (Wil >>> 0 < Wi16l >>> 0 ? 1 : 0);
							Wi.high = Wih;
							Wi.low = Wil;
						}
						var chh = eh & fh ^ ~eh & gh;
						var chl = el & fl ^ ~el & gl;
						var majh = ah & bh ^ ah & ch ^ bh & ch;
						var majl = al & bl ^ al & cl ^ bl & cl;
						var sigma0h = (ah >>> 28 | al << 4) ^ (ah << 30 | al >>> 2) ^ (ah << 25 | al >>> 7);
						var sigma0l = (al >>> 28 | ah << 4) ^ (al << 30 | ah >>> 2) ^ (al << 25 | ah >>> 7);
						var sigma1h = (eh >>> 14 | el << 18) ^ (eh >>> 18 | el << 14) ^ (eh << 23 | el >>> 9);
						var sigma1l = (el >>> 14 | eh << 18) ^ (el >>> 18 | eh << 14) ^ (el << 23 | eh >>> 9);
						var Ki = K[i];
						var Kih = Ki.high;
						var Kil = Ki.low;
						var t1l = hl + sigma1l;
						var t1h = hh + sigma1h + (t1l >>> 0 < hl >>> 0 ? 1 : 0);
						var t1l = t1l + chl;
						var t1h = t1h + chh + (t1l >>> 0 < chl >>> 0 ? 1 : 0);
						var t1l = t1l + Kil;
						var t1h = t1h + Kih + (t1l >>> 0 < Kil >>> 0 ? 1 : 0);
						var t1l = t1l + Wil;
						var t1h = t1h + Wih + (t1l >>> 0 < Wil >>> 0 ? 1 : 0);
						var t2l = sigma0l + majl;
						var t2h = sigma0h + majh + (t2l >>> 0 < sigma0l >>> 0 ? 1 : 0);
						hh = gh;
						hl = gl;
						gh = fh;
						gl = fl;
						fh = eh;
						fl = el;
						el = dl + t1l | 0;
						eh = dh + t1h + (el >>> 0 < dl >>> 0 ? 1 : 0) | 0;
						dh = ch;
						dl = cl;
						ch = bh;
						cl = bl;
						bh = ah;
						bl = al;
						al = t1l + t2l | 0;
						ah = t1h + t2h + (al >>> 0 < t1l >>> 0 ? 1 : 0) | 0;
					}
					H0l = H0.low = H0l + al;
					H0.high = H0h + ah + (H0l >>> 0 < al >>> 0 ? 1 : 0);
					H1l = H1.low = H1l + bl;
					H1.high = H1h + bh + (H1l >>> 0 < bl >>> 0 ? 1 : 0);
					H2l = H2.low = H2l + cl;
					H2.high = H2h + ch + (H2l >>> 0 < cl >>> 0 ? 1 : 0);
					H3l = H3.low = H3l + dl;
					H3.high = H3h + dh + (H3l >>> 0 < dl >>> 0 ? 1 : 0);
					H4l = H4.low = H4l + el;
					H4.high = H4h + eh + (H4l >>> 0 < el >>> 0 ? 1 : 0);
					H5l = H5.low = H5l + fl;
					H5.high = H5h + fh + (H5l >>> 0 < fl >>> 0 ? 1 : 0);
					H6l = H6.low = H6l + gl;
					H6.high = H6h + gh + (H6l >>> 0 < gl >>> 0 ? 1 : 0);
					H7l = H7.low = H7l + hl;
					H7.high = H7h + hh + (H7l >>> 0 < hl >>> 0 ? 1 : 0);
				},
				_doFinalize: function() {
					var data = this._data;
					var dataWords = data.words;
					var nBitsTotal = this._nDataBytes * 8;
					var nBitsLeft = data.sigBytes * 8;
					dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
					dataWords[(nBitsLeft + 128 >>> 10 << 5) + 30] = Math.floor(nBitsTotal / 4294967296);
					dataWords[(nBitsLeft + 128 >>> 10 << 5) + 31] = nBitsTotal;
					data.sigBytes = dataWords.length * 4;
					this._process();
					return this._hash.toX32();
				},
				clone: function() {
					var clone = Hasher.clone.call(this);
					clone._hash = this._hash.clone();
					return clone;
				},
				blockSize: 1024 / 32
			});
			/**
			* Shortcut function to the hasher's object interface.
			*
			* @param {WordArray|string} message The message to hash.
			*
			* @return {WordArray} The hash.
			*
			* @static
			*
			* @example
			*
			*     var hash = CryptoJS.SHA512('message');
			*     var hash = CryptoJS.SHA512(wordArray);
			*/
			C.SHA512 = Hasher._createHelper(SHA512);
			/**
			* Shortcut function to the HMAC's object interface.
			*
			* @param {WordArray|string} message The message to hash.
			* @param {WordArray|string} key The secret key.
			*
			* @return {WordArray} The HMAC.
			*
			* @static
			*
			* @example
			*
			*     var hmac = CryptoJS.HmacSHA512(message, key);
			*/
			C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
		})();
		return CryptoJS.SHA512;
	});
}));
//#endregion
//#region node_modules/crypto-js/sha384.js
var require_sha384 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_x64_core(), require_sha512());
		else if (typeof define === "function" && define.amd) define([
			"./core",
			"./x64-core",
			"./sha512"
		], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		(function() {
			var C = CryptoJS;
			var C_x64 = C.x64;
			var X64Word = C_x64.Word;
			var X64WordArray = C_x64.WordArray;
			var C_algo = C.algo;
			var SHA512 = C_algo.SHA512;
			/**
			* SHA-384 hash algorithm.
			*/
			var SHA384 = C_algo.SHA384 = SHA512.extend({
				_doReset: function() {
					this._hash = new X64WordArray.init([
						new X64Word.init(3418070365, 3238371032),
						new X64Word.init(1654270250, 914150663),
						new X64Word.init(2438529370, 812702999),
						new X64Word.init(355462360, 4144912697),
						new X64Word.init(1731405415, 4290775857),
						new X64Word.init(2394180231, 1750603025),
						new X64Word.init(3675008525, 1694076839),
						new X64Word.init(1203062813, 3204075428)
					]);
				},
				_doFinalize: function() {
					var hash = SHA512._doFinalize.call(this);
					hash.sigBytes -= 16;
					return hash;
				}
			});
			/**
			* Shortcut function to the hasher's object interface.
			*
			* @param {WordArray|string} message The message to hash.
			*
			* @return {WordArray} The hash.
			*
			* @static
			*
			* @example
			*
			*     var hash = CryptoJS.SHA384('message');
			*     var hash = CryptoJS.SHA384(wordArray);
			*/
			C.SHA384 = SHA512._createHelper(SHA384);
			/**
			* Shortcut function to the HMAC's object interface.
			*
			* @param {WordArray|string} message The message to hash.
			* @param {WordArray|string} key The secret key.
			*
			* @return {WordArray} The HMAC.
			*
			* @static
			*
			* @example
			*
			*     var hmac = CryptoJS.HmacSHA384(message, key);
			*/
			C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
		})();
		return CryptoJS.SHA384;
	});
}));
//#endregion
//#region node_modules/crypto-js/sha3.js
var require_sha3 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_x64_core());
		else if (typeof define === "function" && define.amd) define(["./core", "./x64-core"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		(function(Math) {
			var C = CryptoJS;
			var C_lib = C.lib;
			var WordArray = C_lib.WordArray;
			var Hasher = C_lib.Hasher;
			var X64Word = C.x64.Word;
			var C_algo = C.algo;
			var RHO_OFFSETS = [];
			var PI_INDEXES = [];
			var ROUND_CONSTANTS = [];
			(function() {
				var x = 1, y = 0;
				for (var t = 0; t < 24; t++) {
					RHO_OFFSETS[x + 5 * y] = (t + 1) * (t + 2) / 2 % 64;
					var newX = y % 5;
					var newY = (2 * x + 3 * y) % 5;
					x = newX;
					y = newY;
				}
				for (var x = 0; x < 5; x++) for (var y = 0; y < 5; y++) PI_INDEXES[x + 5 * y] = y + (2 * x + 3 * y) % 5 * 5;
				var LFSR = 1;
				for (var i = 0; i < 24; i++) {
					var roundConstantMsw = 0;
					var roundConstantLsw = 0;
					for (var j = 0; j < 7; j++) {
						if (LFSR & 1) {
							var bitPosition = (1 << j) - 1;
							if (bitPosition < 32) roundConstantLsw ^= 1 << bitPosition;
							else roundConstantMsw ^= 1 << bitPosition - 32;
						}
						if (LFSR & 128) LFSR = LFSR << 1 ^ 113;
						else LFSR <<= 1;
					}
					ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
				}
			})();
			var T = [];
			(function() {
				for (var i = 0; i < 25; i++) T[i] = X64Word.create();
			})();
			/**
			* SHA-3 hash algorithm.
			*/
			var SHA3 = C_algo.SHA3 = Hasher.extend({
				/**
				* Configuration options.
				*
				* @property {number} outputLength
				*   The desired number of bits in the output hash.
				*   Only values permitted are: 224, 256, 384, 512.
				*   Default: 512
				*/
				cfg: Hasher.cfg.extend({ outputLength: 512 }),
				_doReset: function() {
					var state = this._state = [];
					for (var i = 0; i < 25; i++) state[i] = new X64Word.init();
					this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
				},
				_doProcessBlock: function(M, offset) {
					var state = this._state;
					var nBlockSizeLanes = this.blockSize / 2;
					for (var i = 0; i < nBlockSizeLanes; i++) {
						var M2i = M[offset + 2 * i];
						var M2i1 = M[offset + 2 * i + 1];
						M2i = (M2i << 8 | M2i >>> 24) & 16711935 | (M2i << 24 | M2i >>> 8) & 4278255360;
						M2i1 = (M2i1 << 8 | M2i1 >>> 24) & 16711935 | (M2i1 << 24 | M2i1 >>> 8) & 4278255360;
						var lane = state[i];
						lane.high ^= M2i1;
						lane.low ^= M2i;
					}
					for (var round = 0; round < 24; round++) {
						for (var x = 0; x < 5; x++) {
							var tMsw = 0, tLsw = 0;
							for (var y = 0; y < 5; y++) {
								var lane = state[x + 5 * y];
								tMsw ^= lane.high;
								tLsw ^= lane.low;
							}
							var Tx = T[x];
							Tx.high = tMsw;
							Tx.low = tLsw;
						}
						for (var x = 0; x < 5; x++) {
							var Tx4 = T[(x + 4) % 5];
							var Tx1 = T[(x + 1) % 5];
							var Tx1Msw = Tx1.high;
							var Tx1Lsw = Tx1.low;
							var tMsw = Tx4.high ^ (Tx1Msw << 1 | Tx1Lsw >>> 31);
							var tLsw = Tx4.low ^ (Tx1Lsw << 1 | Tx1Msw >>> 31);
							for (var y = 0; y < 5; y++) {
								var lane = state[x + 5 * y];
								lane.high ^= tMsw;
								lane.low ^= tLsw;
							}
						}
						for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
							var tMsw;
							var tLsw;
							var lane = state[laneIndex];
							var laneMsw = lane.high;
							var laneLsw = lane.low;
							var rhoOffset = RHO_OFFSETS[laneIndex];
							if (rhoOffset < 32) {
								tMsw = laneMsw << rhoOffset | laneLsw >>> 32 - rhoOffset;
								tLsw = laneLsw << rhoOffset | laneMsw >>> 32 - rhoOffset;
							} else {
								tMsw = laneLsw << rhoOffset - 32 | laneMsw >>> 64 - rhoOffset;
								tLsw = laneMsw << rhoOffset - 32 | laneLsw >>> 64 - rhoOffset;
							}
							var TPiLane = T[PI_INDEXES[laneIndex]];
							TPiLane.high = tMsw;
							TPiLane.low = tLsw;
						}
						var T0 = T[0];
						var state0 = state[0];
						T0.high = state0.high;
						T0.low = state0.low;
						for (var x = 0; x < 5; x++) for (var y = 0; y < 5; y++) {
							var laneIndex = x + 5 * y;
							var lane = state[laneIndex];
							var TLane = T[laneIndex];
							var Tx1Lane = T[(x + 1) % 5 + 5 * y];
							var Tx2Lane = T[(x + 2) % 5 + 5 * y];
							lane.high = TLane.high ^ ~Tx1Lane.high & Tx2Lane.high;
							lane.low = TLane.low ^ ~Tx1Lane.low & Tx2Lane.low;
						}
						var lane = state[0];
						var roundConstant = ROUND_CONSTANTS[round];
						lane.high ^= roundConstant.high;
						lane.low ^= roundConstant.low;
					}
				},
				_doFinalize: function() {
					var data = this._data;
					var dataWords = data.words;
					this._nDataBytes * 8;
					var nBitsLeft = data.sigBytes * 8;
					var blockSizeBits = this.blockSize * 32;
					dataWords[nBitsLeft >>> 5] |= 1 << 24 - nBitsLeft % 32;
					dataWords[(Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits >>> 5) - 1] |= 128;
					data.sigBytes = dataWords.length * 4;
					this._process();
					var state = this._state;
					var outputLengthBytes = this.cfg.outputLength / 8;
					var outputLengthLanes = outputLengthBytes / 8;
					var hashWords = [];
					for (var i = 0; i < outputLengthLanes; i++) {
						var lane = state[i];
						var laneMsw = lane.high;
						var laneLsw = lane.low;
						laneMsw = (laneMsw << 8 | laneMsw >>> 24) & 16711935 | (laneMsw << 24 | laneMsw >>> 8) & 4278255360;
						laneLsw = (laneLsw << 8 | laneLsw >>> 24) & 16711935 | (laneLsw << 24 | laneLsw >>> 8) & 4278255360;
						hashWords.push(laneLsw);
						hashWords.push(laneMsw);
					}
					return new WordArray.init(hashWords, outputLengthBytes);
				},
				clone: function() {
					var clone = Hasher.clone.call(this);
					var state = clone._state = this._state.slice(0);
					for (var i = 0; i < 25; i++) state[i] = state[i].clone();
					return clone;
				}
			});
			/**
			* Shortcut function to the hasher's object interface.
			*
			* @param {WordArray|string} message The message to hash.
			*
			* @return {WordArray} The hash.
			*
			* @static
			*
			* @example
			*
			*     var hash = CryptoJS.SHA3('message');
			*     var hash = CryptoJS.SHA3(wordArray);
			*/
			C.SHA3 = Hasher._createHelper(SHA3);
			/**
			* Shortcut function to the HMAC's object interface.
			*
			* @param {WordArray|string} message The message to hash.
			* @param {WordArray|string} key The secret key.
			*
			* @return {WordArray} The HMAC.
			*
			* @static
			*
			* @example
			*
			*     var hmac = CryptoJS.HmacSHA3(message, key);
			*/
			C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
		})(Math);
		return CryptoJS.SHA3;
	});
}));
//#endregion
//#region node_modules/crypto-js/ripemd160.js
var require_ripemd160 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory) {
		if (typeof exports === "object") module.exports = exports = factory(require_core());
		else if (typeof define === "function" && define.amd) define(["./core"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		/** @preserve
		(c) 2012 by Cédric Mesnil. All rights reserved.
		
		Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
		
		- Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
		- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
		
		THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
		*/
		(function(Math) {
			var C = CryptoJS;
			var C_lib = C.lib;
			var WordArray = C_lib.WordArray;
			var Hasher = C_lib.Hasher;
			var C_algo = C.algo;
			var _zl = WordArray.create([
				0,
				1,
				2,
				3,
				4,
				5,
				6,
				7,
				8,
				9,
				10,
				11,
				12,
				13,
				14,
				15,
				7,
				4,
				13,
				1,
				10,
				6,
				15,
				3,
				12,
				0,
				9,
				5,
				2,
				14,
				11,
				8,
				3,
				10,
				14,
				4,
				9,
				15,
				8,
				1,
				2,
				7,
				0,
				6,
				13,
				11,
				5,
				12,
				1,
				9,
				11,
				10,
				0,
				8,
				12,
				4,
				13,
				3,
				7,
				15,
				14,
				5,
				6,
				2,
				4,
				0,
				5,
				9,
				7,
				12,
				2,
				10,
				14,
				1,
				3,
				8,
				11,
				6,
				15,
				13
			]);
			var _zr = WordArray.create([
				5,
				14,
				7,
				0,
				9,
				2,
				11,
				4,
				13,
				6,
				15,
				8,
				1,
				10,
				3,
				12,
				6,
				11,
				3,
				7,
				0,
				13,
				5,
				10,
				14,
				15,
				8,
				12,
				4,
				9,
				1,
				2,
				15,
				5,
				1,
				3,
				7,
				14,
				6,
				9,
				11,
				8,
				12,
				2,
				10,
				0,
				4,
				13,
				8,
				6,
				4,
				1,
				3,
				11,
				15,
				0,
				5,
				12,
				2,
				13,
				9,
				7,
				10,
				14,
				12,
				15,
				10,
				4,
				1,
				5,
				8,
				7,
				6,
				2,
				13,
				14,
				0,
				3,
				9,
				11
			]);
			var _sl = WordArray.create([
				11,
				14,
				15,
				12,
				5,
				8,
				7,
				9,
				11,
				13,
				14,
				15,
				6,
				7,
				9,
				8,
				7,
				6,
				8,
				13,
				11,
				9,
				7,
				15,
				7,
				12,
				15,
				9,
				11,
				7,
				13,
				12,
				11,
				13,
				6,
				7,
				14,
				9,
				13,
				15,
				14,
				8,
				13,
				6,
				5,
				12,
				7,
				5,
				11,
				12,
				14,
				15,
				14,
				15,
				9,
				8,
				9,
				14,
				5,
				6,
				8,
				6,
				5,
				12,
				9,
				15,
				5,
				11,
				6,
				8,
				13,
				12,
				5,
				12,
				13,
				14,
				11,
				8,
				5,
				6
			]);
			var _sr = WordArray.create([
				8,
				9,
				9,
				11,
				13,
				15,
				15,
				5,
				7,
				7,
				8,
				11,
				14,
				14,
				12,
				6,
				9,
				13,
				15,
				7,
				12,
				8,
				9,
				11,
				7,
				7,
				12,
				7,
				6,
				15,
				13,
				11,
				9,
				7,
				15,
				11,
				8,
				6,
				6,
				14,
				12,
				13,
				5,
				14,
				13,
				13,
				7,
				5,
				15,
				5,
				8,
				11,
				14,
				14,
				6,
				14,
				6,
				9,
				12,
				9,
				12,
				5,
				15,
				8,
				8,
				5,
				12,
				9,
				12,
				5,
				14,
				6,
				8,
				13,
				6,
				5,
				15,
				13,
				11,
				11
			]);
			var _hl = WordArray.create([
				0,
				1518500249,
				1859775393,
				2400959708,
				2840853838
			]);
			var _hr = WordArray.create([
				1352829926,
				1548603684,
				1836072691,
				2053994217,
				0
			]);
			/**
			* RIPEMD160 hash algorithm.
			*/
			var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
				_doReset: function() {
					this._hash = WordArray.create([
						1732584193,
						4023233417,
						2562383102,
						271733878,
						3285377520
					]);
				},
				_doProcessBlock: function(M, offset) {
					for (var i = 0; i < 16; i++) {
						var offset_i = offset + i;
						var M_offset_i = M[offset_i];
						M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 16711935 | (M_offset_i << 24 | M_offset_i >>> 8) & 4278255360;
					}
					var H = this._hash.words;
					var hl = _hl.words;
					var hr = _hr.words;
					var zl = _zl.words;
					var zr = _zr.words;
					var sl = _sl.words;
					var sr = _sr.words;
					var al, bl, cl, dl, el;
					var ar = al = H[0], br = bl = H[1], cr = cl = H[2], dr = dl = H[3], er = el = H[4];
					var t;
					for (var i = 0; i < 80; i += 1) {
						t = al + M[offset + zl[i]] | 0;
						if (i < 16) t += f1(bl, cl, dl) + hl[0];
						else if (i < 32) t += f2(bl, cl, dl) + hl[1];
						else if (i < 48) t += f3(bl, cl, dl) + hl[2];
						else if (i < 64) t += f4(bl, cl, dl) + hl[3];
						else t += f5(bl, cl, dl) + hl[4];
						t = t | 0;
						t = rotl(t, sl[i]);
						t = t + el | 0;
						al = el;
						el = dl;
						dl = rotl(cl, 10);
						cl = bl;
						bl = t;
						t = ar + M[offset + zr[i]] | 0;
						if (i < 16) t += f5(br, cr, dr) + hr[0];
						else if (i < 32) t += f4(br, cr, dr) + hr[1];
						else if (i < 48) t += f3(br, cr, dr) + hr[2];
						else if (i < 64) t += f2(br, cr, dr) + hr[3];
						else t += f1(br, cr, dr) + hr[4];
						t = t | 0;
						t = rotl(t, sr[i]);
						t = t + er | 0;
						ar = er;
						er = dr;
						dr = rotl(cr, 10);
						cr = br;
						br = t;
					}
					t = H[1] + cl + dr | 0;
					H[1] = H[2] + dl + er | 0;
					H[2] = H[3] + el + ar | 0;
					H[3] = H[4] + al + br | 0;
					H[4] = H[0] + bl + cr | 0;
					H[0] = t;
				},
				_doFinalize: function() {
					var data = this._data;
					var dataWords = data.words;
					var nBitsTotal = this._nDataBytes * 8;
					var nBitsLeft = data.sigBytes * 8;
					dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
					dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotal << 8 | nBitsTotal >>> 24) & 16711935 | (nBitsTotal << 24 | nBitsTotal >>> 8) & 4278255360;
					data.sigBytes = (dataWords.length + 1) * 4;
					this._process();
					var hash = this._hash;
					var H = hash.words;
					for (var i = 0; i < 5; i++) {
						var H_i = H[i];
						H[i] = (H_i << 8 | H_i >>> 24) & 16711935 | (H_i << 24 | H_i >>> 8) & 4278255360;
					}
					return hash;
				},
				clone: function() {
					var clone = Hasher.clone.call(this);
					clone._hash = this._hash.clone();
					return clone;
				}
			});
			function f1(x, y, z) {
				return x ^ y ^ z;
			}
			function f2(x, y, z) {
				return x & y | ~x & z;
			}
			function f3(x, y, z) {
				return (x | ~y) ^ z;
			}
			function f4(x, y, z) {
				return x & z | y & ~z;
			}
			function f5(x, y, z) {
				return x ^ (y | ~z);
			}
			function rotl(x, n) {
				return x << n | x >>> 32 - n;
			}
			/**
			* Shortcut function to the hasher's object interface.
			*
			* @param {WordArray|string} message The message to hash.
			*
			* @return {WordArray} The hash.
			*
			* @static
			*
			* @example
			*
			*     var hash = CryptoJS.RIPEMD160('message');
			*     var hash = CryptoJS.RIPEMD160(wordArray);
			*/
			C.RIPEMD160 = Hasher._createHelper(RIPEMD160);
			/**
			* Shortcut function to the HMAC's object interface.
			*
			* @param {WordArray|string} message The message to hash.
			* @param {WordArray|string} key The secret key.
			*
			* @return {WordArray} The HMAC.
			*
			* @static
			*
			* @example
			*
			*     var hmac = CryptoJS.HmacRIPEMD160(message, key);
			*/
			C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
		})(Math);
		return CryptoJS.RIPEMD160;
	});
}));
//#endregion
//#region node_modules/crypto-js/hmac.js
var require_hmac = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory) {
		if (typeof exports === "object") module.exports = exports = factory(require_core());
		else if (typeof define === "function" && define.amd) define(["./core"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		(function() {
			var C = CryptoJS;
			var Base = C.lib.Base;
			var Utf8 = C.enc.Utf8;
			var C_algo = C.algo;
			C_algo.HMAC = Base.extend({
				/**
				* Initializes a newly created HMAC.
				*
				* @param {Hasher} hasher The hash algorithm to use.
				* @param {WordArray|string} key The secret key.
				*
				* @example
				*
				*     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
				*/
				init: function(hasher, key) {
					hasher = this._hasher = new hasher.init();
					if (typeof key == "string") key = Utf8.parse(key);
					var hasherBlockSize = hasher.blockSize;
					var hasherBlockSizeBytes = hasherBlockSize * 4;
					if (key.sigBytes > hasherBlockSizeBytes) key = hasher.finalize(key);
					key.clamp();
					var oKey = this._oKey = key.clone();
					var iKey = this._iKey = key.clone();
					var oKeyWords = oKey.words;
					var iKeyWords = iKey.words;
					for (var i = 0; i < hasherBlockSize; i++) {
						oKeyWords[i] ^= 1549556828;
						iKeyWords[i] ^= 909522486;
					}
					oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;
					this.reset();
				},
				/**
				* Resets this HMAC to its initial state.
				*
				* @example
				*
				*     hmacHasher.reset();
				*/
				reset: function() {
					var hasher = this._hasher;
					hasher.reset();
					hasher.update(this._iKey);
				},
				/**
				* Updates this HMAC with a message.
				*
				* @param {WordArray|string} messageUpdate The message to append.
				*
				* @return {HMAC} This HMAC instance.
				*
				* @example
				*
				*     hmacHasher.update('message');
				*     hmacHasher.update(wordArray);
				*/
				update: function(messageUpdate) {
					this._hasher.update(messageUpdate);
					return this;
				},
				/**
				* Finalizes the HMAC computation.
				* Note that the finalize operation is effectively a destructive, read-once operation.
				*
				* @param {WordArray|string} messageUpdate (Optional) A final message update.
				*
				* @return {WordArray} The HMAC.
				*
				* @example
				*
				*     var hmac = hmacHasher.finalize();
				*     var hmac = hmacHasher.finalize('message');
				*     var hmac = hmacHasher.finalize(wordArray);
				*/
				finalize: function(messageUpdate) {
					var hasher = this._hasher;
					var innerHash = hasher.finalize(messageUpdate);
					hasher.reset();
					return hasher.finalize(this._oKey.clone().concat(innerHash));
				}
			});
		})();
	});
}));
//#endregion
//#region node_modules/crypto-js/pbkdf2.js
var require_pbkdf2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_sha256(), require_hmac());
		else if (typeof define === "function" && define.amd) define([
			"./core",
			"./sha256",
			"./hmac"
		], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		(function() {
			var C = CryptoJS;
			var C_lib = C.lib;
			var Base = C_lib.Base;
			var WordArray = C_lib.WordArray;
			var C_algo = C.algo;
			var SHA256 = C_algo.SHA256;
			var HMAC = C_algo.HMAC;
			/**
			* Password-Based Key Derivation Function 2 algorithm.
			*/
			var PBKDF2 = C_algo.PBKDF2 = Base.extend({
				/**
				* Configuration options.
				*
				* @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
				* @property {Hasher} hasher The hasher to use. Default: SHA256
				* @property {number} iterations The number of iterations to perform. Default: 250000
				*/
				cfg: Base.extend({
					keySize: 128 / 32,
					hasher: SHA256,
					iterations: 25e4
				}),
				/**
				* Initializes a newly created key derivation function.
				*
				* @param {Object} cfg (Optional) The configuration options to use for the derivation.
				*
				* @example
				*
				*     var kdf = CryptoJS.algo.PBKDF2.create();
				*     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
				*     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
				*/
				init: function(cfg) {
					this.cfg = this.cfg.extend(cfg);
				},
				/**
				* Computes the Password-Based Key Derivation Function 2.
				*
				* @param {WordArray|string} password The password.
				* @param {WordArray|string} salt A salt.
				*
				* @return {WordArray} The derived key.
				*
				* @example
				*
				*     var key = kdf.compute(password, salt);
				*/
				compute: function(password, salt) {
					var cfg = this.cfg;
					var hmac = HMAC.create(cfg.hasher, password);
					var derivedKey = WordArray.create();
					var blockIndex = WordArray.create([1]);
					var derivedKeyWords = derivedKey.words;
					var blockIndexWords = blockIndex.words;
					var keySize = cfg.keySize;
					var iterations = cfg.iterations;
					while (derivedKeyWords.length < keySize) {
						var block = hmac.update(salt).finalize(blockIndex);
						hmac.reset();
						var blockWords = block.words;
						var blockWordsLength = blockWords.length;
						var intermediate = block;
						for (var i = 1; i < iterations; i++) {
							intermediate = hmac.finalize(intermediate);
							hmac.reset();
							var intermediateWords = intermediate.words;
							for (var j = 0; j < blockWordsLength; j++) blockWords[j] ^= intermediateWords[j];
						}
						derivedKey.concat(block);
						blockIndexWords[0]++;
					}
					derivedKey.sigBytes = keySize * 4;
					return derivedKey;
				}
			});
			/**
			* Computes the Password-Based Key Derivation Function 2.
			*
			* @param {WordArray|string} password The password.
			* @param {WordArray|string} salt A salt.
			* @param {Object} cfg (Optional) The configuration options to use for this computation.
			*
			* @return {WordArray} The derived key.
			*
			* @static
			*
			* @example
			*
			*     var key = CryptoJS.PBKDF2(password, salt);
			*     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8 });
			*     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
			*/
			C.PBKDF2 = function(password, salt, cfg) {
				return PBKDF2.create(cfg).compute(password, salt);
			};
		})();
		return CryptoJS.PBKDF2;
	});
}));
//#endregion
//#region node_modules/crypto-js/evpkdf.js
var require_evpkdf = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_sha1(), require_hmac());
		else if (typeof define === "function" && define.amd) define([
			"./core",
			"./sha1",
			"./hmac"
		], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		(function() {
			var C = CryptoJS;
			var C_lib = C.lib;
			var Base = C_lib.Base;
			var WordArray = C_lib.WordArray;
			var C_algo = C.algo;
			var MD5 = C_algo.MD5;
			/**
			* This key derivation function is meant to conform with EVP_BytesToKey.
			* www.openssl.org/docs/crypto/EVP_BytesToKey.html
			*/
			var EvpKDF = C_algo.EvpKDF = Base.extend({
				/**
				* Configuration options.
				*
				* @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
				* @property {Hasher} hasher The hash algorithm to use. Default: MD5
				* @property {number} iterations The number of iterations to perform. Default: 1
				*/
				cfg: Base.extend({
					keySize: 128 / 32,
					hasher: MD5,
					iterations: 1
				}),
				/**
				* Initializes a newly created key derivation function.
				*
				* @param {Object} cfg (Optional) The configuration options to use for the derivation.
				*
				* @example
				*
				*     var kdf = CryptoJS.algo.EvpKDF.create();
				*     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
				*     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
				*/
				init: function(cfg) {
					this.cfg = this.cfg.extend(cfg);
				},
				/**
				* Derives a key from a password.
				*
				* @param {WordArray|string} password The password.
				* @param {WordArray|string} salt A salt.
				*
				* @return {WordArray} The derived key.
				*
				* @example
				*
				*     var key = kdf.compute(password, salt);
				*/
				compute: function(password, salt) {
					var block;
					var cfg = this.cfg;
					var hasher = cfg.hasher.create();
					var derivedKey = WordArray.create();
					var derivedKeyWords = derivedKey.words;
					var keySize = cfg.keySize;
					var iterations = cfg.iterations;
					while (derivedKeyWords.length < keySize) {
						if (block) hasher.update(block);
						block = hasher.update(password).finalize(salt);
						hasher.reset();
						for (var i = 1; i < iterations; i++) {
							block = hasher.finalize(block);
							hasher.reset();
						}
						derivedKey.concat(block);
					}
					derivedKey.sigBytes = keySize * 4;
					return derivedKey;
				}
			});
			/**
			* Derives a key from a password.
			*
			* @param {WordArray|string} password The password.
			* @param {WordArray|string} salt A salt.
			* @param {Object} cfg (Optional) The configuration options to use for this computation.
			*
			* @return {WordArray} The derived key.
			*
			* @static
			*
			* @example
			*
			*     var key = CryptoJS.EvpKDF(password, salt);
			*     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
			*     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
			*/
			C.EvpKDF = function(password, salt, cfg) {
				return EvpKDF.create(cfg).compute(password, salt);
			};
		})();
		return CryptoJS.EvpKDF;
	});
}));
//#endregion
//#region node_modules/crypto-js/cipher-core.js
var require_cipher_core = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_evpkdf());
		else if (typeof define === "function" && define.amd) define(["./core", "./evpkdf"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		/**
		* Cipher core components.
		*/
		CryptoJS.lib.Cipher || function(undefined) {
			var C = CryptoJS;
			var C_lib = C.lib;
			var Base = C_lib.Base;
			var WordArray = C_lib.WordArray;
			var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
			var C_enc = C.enc;
			C_enc.Utf8;
			var Base64 = C_enc.Base64;
			var EvpKDF = C.algo.EvpKDF;
			/**
			* Abstract base cipher template.
			*
			* @property {number} keySize This cipher's key size. Default: 4 (128 bits)
			* @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
			* @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
			* @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
			*/
			var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
				/**
				* Configuration options.
				*
				* @property {WordArray} iv The IV to use for this operation.
				*/
				cfg: Base.extend(),
				/**
				* Creates this cipher in encryption mode.
				*
				* @param {WordArray} key The key.
				* @param {Object} cfg (Optional) The configuration options to use for this operation.
				*
				* @return {Cipher} A cipher instance.
				*
				* @static
				*
				* @example
				*
				*     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
				*/
				createEncryptor: function(key, cfg) {
					return this.create(this._ENC_XFORM_MODE, key, cfg);
				},
				/**
				* Creates this cipher in decryption mode.
				*
				* @param {WordArray} key The key.
				* @param {Object} cfg (Optional) The configuration options to use for this operation.
				*
				* @return {Cipher} A cipher instance.
				*
				* @static
				*
				* @example
				*
				*     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
				*/
				createDecryptor: function(key, cfg) {
					return this.create(this._DEC_XFORM_MODE, key, cfg);
				},
				/**
				* Initializes a newly created cipher.
				*
				* @param {number} xformMode Either the encryption or decryption transormation mode constant.
				* @param {WordArray} key The key.
				* @param {Object} cfg (Optional) The configuration options to use for this operation.
				*
				* @example
				*
				*     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
				*/
				init: function(xformMode, key, cfg) {
					this.cfg = this.cfg.extend(cfg);
					this._xformMode = xformMode;
					this._key = key;
					this.reset();
				},
				/**
				* Resets this cipher to its initial state.
				*
				* @example
				*
				*     cipher.reset();
				*/
				reset: function() {
					BufferedBlockAlgorithm.reset.call(this);
					this._doReset();
				},
				/**
				* Adds data to be encrypted or decrypted.
				*
				* @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
				*
				* @return {WordArray} The data after processing.
				*
				* @example
				*
				*     var encrypted = cipher.process('data');
				*     var encrypted = cipher.process(wordArray);
				*/
				process: function(dataUpdate) {
					this._append(dataUpdate);
					return this._process();
				},
				/**
				* Finalizes the encryption or decryption process.
				* Note that the finalize operation is effectively a destructive, read-once operation.
				*
				* @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
				*
				* @return {WordArray} The data after final processing.
				*
				* @example
				*
				*     var encrypted = cipher.finalize();
				*     var encrypted = cipher.finalize('data');
				*     var encrypted = cipher.finalize(wordArray);
				*/
				finalize: function(dataUpdate) {
					if (dataUpdate) this._append(dataUpdate);
					return this._doFinalize();
				},
				keySize: 128 / 32,
				ivSize: 128 / 32,
				_ENC_XFORM_MODE: 1,
				_DEC_XFORM_MODE: 2,
				/**
				* Creates shortcut functions to a cipher's object interface.
				*
				* @param {Cipher} cipher The cipher to create a helper for.
				*
				* @return {Object} An object with encrypt and decrypt shortcut functions.
				*
				* @static
				*
				* @example
				*
				*     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
				*/
				_createHelper: function() {
					function selectCipherStrategy(key) {
						if (typeof key == "string") return PasswordBasedCipher;
						else return SerializableCipher;
					}
					return function(cipher) {
						return {
							encrypt: function(message, key, cfg) {
								return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
							},
							decrypt: function(ciphertext, key, cfg) {
								return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
							}
						};
					};
				}()
			});
			C_lib.StreamCipher = Cipher.extend({
				_doFinalize: function() {
					return this._process(true);
				},
				blockSize: 1
			});
			/**
			* Mode namespace.
			*/
			var C_mode = C.mode = {};
			/**
			* Abstract base block cipher mode template.
			*/
			var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
				/**
				* Creates this mode for encryption.
				*
				* @param {Cipher} cipher A block cipher instance.
				* @param {Array} iv The IV words.
				*
				* @static
				*
				* @example
				*
				*     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
				*/
				createEncryptor: function(cipher, iv) {
					return this.Encryptor.create(cipher, iv);
				},
				/**
				* Creates this mode for decryption.
				*
				* @param {Cipher} cipher A block cipher instance.
				* @param {Array} iv The IV words.
				*
				* @static
				*
				* @example
				*
				*     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
				*/
				createDecryptor: function(cipher, iv) {
					return this.Decryptor.create(cipher, iv);
				},
				/**
				* Initializes a newly created mode.
				*
				* @param {Cipher} cipher A block cipher instance.
				* @param {Array} iv The IV words.
				*
				* @example
				*
				*     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
				*/
				init: function(cipher, iv) {
					this._cipher = cipher;
					this._iv = iv;
				}
			});
			/**
			* Cipher Block Chaining mode.
			*/
			var CBC = C_mode.CBC = function() {
				/**
				* Abstract base CBC mode.
				*/
				var CBC = BlockCipherMode.extend();
				/**
				* CBC encryptor.
				*/
				CBC.Encryptor = CBC.extend({ 
				/**
				* Processes the data block at offset.
				*
				* @param {Array} words The data words to operate on.
				* @param {number} offset The offset where the block starts.
				*
				* @example
				*
				*     mode.processBlock(data.words, offset);
				*/
processBlock: function(words, offset) {
					var cipher = this._cipher;
					var blockSize = cipher.blockSize;
					xorBlock.call(this, words, offset, blockSize);
					cipher.encryptBlock(words, offset);
					this._prevBlock = words.slice(offset, offset + blockSize);
				} });
				/**
				* CBC decryptor.
				*/
				CBC.Decryptor = CBC.extend({ 
				/**
				* Processes the data block at offset.
				*
				* @param {Array} words The data words to operate on.
				* @param {number} offset The offset where the block starts.
				*
				* @example
				*
				*     mode.processBlock(data.words, offset);
				*/
processBlock: function(words, offset) {
					var cipher = this._cipher;
					var blockSize = cipher.blockSize;
					var thisBlock = words.slice(offset, offset + blockSize);
					cipher.decryptBlock(words, offset);
					xorBlock.call(this, words, offset, blockSize);
					this._prevBlock = thisBlock;
				} });
				function xorBlock(words, offset, blockSize) {
					var block;
					var iv = this._iv;
					if (iv) {
						block = iv;
						this._iv = undefined;
					} else block = this._prevBlock;
					for (var i = 0; i < blockSize; i++) words[offset + i] ^= block[i];
				}
				return CBC;
			}();
			/**
			* Padding namespace.
			*/
			var C_pad = C.pad = {};
			/**
			* PKCS #5/7 padding strategy.
			*/
			var Pkcs7 = C_pad.Pkcs7 = {
				/**
				* Pads data using the algorithm defined in PKCS #5/7.
				*
				* @param {WordArray} data The data to pad.
				* @param {number} blockSize The multiple that the data should be padded to.
				*
				* @static
				*
				* @example
				*
				*     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
				*/
				pad: function(data, blockSize) {
					var blockSizeBytes = blockSize * 4;
					var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
					var paddingWord = nPaddingBytes << 24 | nPaddingBytes << 16 | nPaddingBytes << 8 | nPaddingBytes;
					var paddingWords = [];
					for (var i = 0; i < nPaddingBytes; i += 4) paddingWords.push(paddingWord);
					var padding = WordArray.create(paddingWords, nPaddingBytes);
					data.concat(padding);
				},
				/**
				* Unpads data that had been padded using the algorithm defined in PKCS #5/7.
				*
				* @param {WordArray} data The data to unpad.
				*
				* @static
				*
				* @example
				*
				*     CryptoJS.pad.Pkcs7.unpad(wordArray);
				*/
				unpad: function(data) {
					var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
					data.sigBytes -= nPaddingBytes;
				}
			};
			C_lib.BlockCipher = Cipher.extend({
				/**
				* Configuration options.
				*
				* @property {Mode} mode The block mode to use. Default: CBC
				* @property {Padding} padding The padding strategy to use. Default: Pkcs7
				*/
				cfg: Cipher.cfg.extend({
					mode: CBC,
					padding: Pkcs7
				}),
				reset: function() {
					var modeCreator;
					Cipher.reset.call(this);
					var cfg = this.cfg;
					var iv = cfg.iv;
					var mode = cfg.mode;
					if (this._xformMode == this._ENC_XFORM_MODE) modeCreator = mode.createEncryptor;
					else {
						modeCreator = mode.createDecryptor;
						this._minBufferSize = 1;
					}
					if (this._mode && this._mode.__creator == modeCreator) this._mode.init(this, iv && iv.words);
					else {
						this._mode = modeCreator.call(mode, this, iv && iv.words);
						this._mode.__creator = modeCreator;
					}
				},
				_doProcessBlock: function(words, offset) {
					this._mode.processBlock(words, offset);
				},
				_doFinalize: function() {
					var finalProcessedBlocks;
					var padding = this.cfg.padding;
					if (this._xformMode == this._ENC_XFORM_MODE) {
						padding.pad(this._data, this.blockSize);
						finalProcessedBlocks = this._process(true);
					} else {
						finalProcessedBlocks = this._process(true);
						padding.unpad(finalProcessedBlocks);
					}
					return finalProcessedBlocks;
				},
				blockSize: 128 / 32
			});
			/**
			* A collection of cipher parameters.
			*
			* @property {WordArray} ciphertext The raw ciphertext.
			* @property {WordArray} key The key to this ciphertext.
			* @property {WordArray} iv The IV used in the ciphering operation.
			* @property {WordArray} salt The salt used with a key derivation function.
			* @property {Cipher} algorithm The cipher algorithm.
			* @property {Mode} mode The block mode used in the ciphering operation.
			* @property {Padding} padding The padding scheme used in the ciphering operation.
			* @property {number} blockSize The block size of the cipher.
			* @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
			*/
			var CipherParams = C_lib.CipherParams = Base.extend({
				/**
				* Initializes a newly created cipher params object.
				*
				* @param {Object} cipherParams An object with any of the possible cipher parameters.
				*
				* @example
				*
				*     var cipherParams = CryptoJS.lib.CipherParams.create({
				*         ciphertext: ciphertextWordArray,
				*         key: keyWordArray,
				*         iv: ivWordArray,
				*         salt: saltWordArray,
				*         algorithm: CryptoJS.algo.AES,
				*         mode: CryptoJS.mode.CBC,
				*         padding: CryptoJS.pad.PKCS7,
				*         blockSize: 4,
				*         formatter: CryptoJS.format.OpenSSL
				*     });
				*/
				init: function(cipherParams) {
					this.mixIn(cipherParams);
				},
				/**
				* Converts this cipher params object to a string.
				*
				* @param {Format} formatter (Optional) The formatting strategy to use.
				*
				* @return {string} The stringified cipher params.
				*
				* @throws Error If neither the formatter nor the default formatter is set.
				*
				* @example
				*
				*     var string = cipherParams + '';
				*     var string = cipherParams.toString();
				*     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
				*/
				toString: function(formatter) {
					return (formatter || this.formatter).stringify(this);
				}
			});
			/**
			* Format namespace.
			*/
			var C_format = C.format = {};
			/**
			* OpenSSL formatting strategy.
			*/
			var OpenSSLFormatter = C_format.OpenSSL = {
				/**
				* Converts a cipher params object to an OpenSSL-compatible string.
				*
				* @param {CipherParams} cipherParams The cipher params object.
				*
				* @return {string} The OpenSSL-compatible string.
				*
				* @static
				*
				* @example
				*
				*     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
				*/
				stringify: function(cipherParams) {
					var wordArray;
					var ciphertext = cipherParams.ciphertext;
					var salt = cipherParams.salt;
					if (salt) wordArray = WordArray.create([1398893684, 1701076831]).concat(salt).concat(ciphertext);
					else wordArray = ciphertext;
					return wordArray.toString(Base64);
				},
				/**
				* Converts an OpenSSL-compatible string to a cipher params object.
				*
				* @param {string} openSSLStr The OpenSSL-compatible string.
				*
				* @return {CipherParams} The cipher params object.
				*
				* @static
				*
				* @example
				*
				*     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
				*/
				parse: function(openSSLStr) {
					var salt;
					var ciphertext = Base64.parse(openSSLStr);
					var ciphertextWords = ciphertext.words;
					if (ciphertextWords[0] == 1398893684 && ciphertextWords[1] == 1701076831) {
						salt = WordArray.create(ciphertextWords.slice(2, 4));
						ciphertextWords.splice(0, 4);
						ciphertext.sigBytes -= 16;
					}
					return CipherParams.create({
						ciphertext,
						salt
					});
				}
			};
			/**
			* A cipher wrapper that returns ciphertext as a serializable cipher params object.
			*/
			var SerializableCipher = C_lib.SerializableCipher = Base.extend({
				/**
				* Configuration options.
				*
				* @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
				*/
				cfg: Base.extend({ format: OpenSSLFormatter }),
				/**
				* Encrypts a message.
				*
				* @param {Cipher} cipher The cipher algorithm to use.
				* @param {WordArray|string} message The message to encrypt.
				* @param {WordArray} key The key.
				* @param {Object} cfg (Optional) The configuration options to use for this operation.
				*
				* @return {CipherParams} A cipher params object.
				*
				* @static
				*
				* @example
				*
				*     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
				*     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
				*     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
				*/
				encrypt: function(cipher, message, key, cfg) {
					cfg = this.cfg.extend(cfg);
					var encryptor = cipher.createEncryptor(key, cfg);
					var ciphertext = encryptor.finalize(message);
					var cipherCfg = encryptor.cfg;
					return CipherParams.create({
						ciphertext,
						key,
						iv: cipherCfg.iv,
						algorithm: cipher,
						mode: cipherCfg.mode,
						padding: cipherCfg.padding,
						blockSize: cipher.blockSize,
						formatter: cfg.format
					});
				},
				/**
				* Decrypts serialized ciphertext.
				*
				* @param {Cipher} cipher The cipher algorithm to use.
				* @param {CipherParams|string} ciphertext The ciphertext to decrypt.
				* @param {WordArray} key The key.
				* @param {Object} cfg (Optional) The configuration options to use for this operation.
				*
				* @return {WordArray} The plaintext.
				*
				* @static
				*
				* @example
				*
				*     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
				*     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
				*/
				decrypt: function(cipher, ciphertext, key, cfg) {
					cfg = this.cfg.extend(cfg);
					ciphertext = this._parse(ciphertext, cfg.format);
					return cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);
				},
				/**
				* Converts serialized ciphertext to CipherParams,
				* else assumed CipherParams already and returns ciphertext unchanged.
				*
				* @param {CipherParams|string} ciphertext The ciphertext.
				* @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
				*
				* @return {CipherParams} The unserialized ciphertext.
				*
				* @static
				*
				* @example
				*
				*     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
				*/
				_parse: function(ciphertext, format) {
					if (typeof ciphertext == "string") return format.parse(ciphertext, this);
					else return ciphertext;
				}
			});
			/**
			* Key derivation function namespace.
			*/
			var C_kdf = C.kdf = {};
			/**
			* OpenSSL key derivation function.
			*/
			var OpenSSLKdf = C_kdf.OpenSSL = { 
			/**
			* Derives a key and IV from a password.
			*
			* @param {string} password The password to derive from.
			* @param {number} keySize The size in words of the key to generate.
			* @param {number} ivSize The size in words of the IV to generate.
			* @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
			*
			* @return {CipherParams} A cipher params object with the key, IV, and salt.
			*
			* @static
			*
			* @example
			*
			*     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
			*     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
			*/
execute: function(password, keySize, ivSize, salt, hasher) {
				if (!salt) salt = WordArray.random(64 / 8);
				if (!hasher) var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);
				else var key = EvpKDF.create({
					keySize: keySize + ivSize,
					hasher
				}).compute(password, salt);
				var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
				key.sigBytes = keySize * 4;
				return CipherParams.create({
					key,
					iv,
					salt
				});
			} };
			/**
			* A serializable cipher wrapper that derives the key from a password,
			* and returns ciphertext as a serializable cipher params object.
			*/
			var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
				/**
				* Configuration options.
				*
				* @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
				*/
				cfg: SerializableCipher.cfg.extend({ kdf: OpenSSLKdf }),
				/**
				* Encrypts a message using a password.
				*
				* @param {Cipher} cipher The cipher algorithm to use.
				* @param {WordArray|string} message The message to encrypt.
				* @param {string} password The password.
				* @param {Object} cfg (Optional) The configuration options to use for this operation.
				*
				* @return {CipherParams} A cipher params object.
				*
				* @static
				*
				* @example
				*
				*     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
				*     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
				*/
				encrypt: function(cipher, message, password, cfg) {
					cfg = this.cfg.extend(cfg);
					var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, cfg.salt, cfg.hasher);
					cfg.iv = derivedParams.iv;
					var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);
					ciphertext.mixIn(derivedParams);
					return ciphertext;
				},
				/**
				* Decrypts serialized ciphertext using a password.
				*
				* @param {Cipher} cipher The cipher algorithm to use.
				* @param {CipherParams|string} ciphertext The ciphertext to decrypt.
				* @param {string} password The password.
				* @param {Object} cfg (Optional) The configuration options to use for this operation.
				*
				* @return {WordArray} The plaintext.
				*
				* @static
				*
				* @example
				*
				*     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
				*     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
				*/
				decrypt: function(cipher, ciphertext, password, cfg) {
					cfg = this.cfg.extend(cfg);
					ciphertext = this._parse(ciphertext, cfg.format);
					var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt, cfg.hasher);
					cfg.iv = derivedParams.iv;
					return SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);
				}
			});
		}();
	});
}));
//#endregion
//#region node_modules/crypto-js/mode-cfb.js
var require_mode_cfb = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_cipher_core());
		else if (typeof define === "function" && define.amd) define(["./core", "./cipher-core"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		/**
		* Cipher Feedback block mode.
		*/
		CryptoJS.mode.CFB = function() {
			var CFB = CryptoJS.lib.BlockCipherMode.extend();
			CFB.Encryptor = CFB.extend({ processBlock: function(words, offset) {
				var cipher = this._cipher;
				var blockSize = cipher.blockSize;
				generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
				this._prevBlock = words.slice(offset, offset + blockSize);
			} });
			CFB.Decryptor = CFB.extend({ processBlock: function(words, offset) {
				var cipher = this._cipher;
				var blockSize = cipher.blockSize;
				var thisBlock = words.slice(offset, offset + blockSize);
				generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
				this._prevBlock = thisBlock;
			} });
			function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
				var keystream;
				var iv = this._iv;
				if (iv) {
					keystream = iv.slice(0);
					this._iv = void 0;
				} else keystream = this._prevBlock;
				cipher.encryptBlock(keystream, 0);
				for (var i = 0; i < blockSize; i++) words[offset + i] ^= keystream[i];
			}
			return CFB;
		}();
		return CryptoJS.mode.CFB;
	});
}));
//#endregion
//#region node_modules/crypto-js/mode-ctr.js
var require_mode_ctr = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_cipher_core());
		else if (typeof define === "function" && define.amd) define(["./core", "./cipher-core"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		/**
		* Counter block mode.
		*/
		CryptoJS.mode.CTR = function() {
			var CTR = CryptoJS.lib.BlockCipherMode.extend();
			CTR.Decryptor = CTR.Encryptor = CTR.extend({ processBlock: function(words, offset) {
				var cipher = this._cipher;
				var blockSize = cipher.blockSize;
				var iv = this._iv;
				var counter = this._counter;
				if (iv) {
					counter = this._counter = iv.slice(0);
					this._iv = void 0;
				}
				var keystream = counter.slice(0);
				cipher.encryptBlock(keystream, 0);
				counter[blockSize - 1] = counter[blockSize - 1] + 1 | 0;
				for (var i = 0; i < blockSize; i++) words[offset + i] ^= keystream[i];
			} });
			return CTR;
		}();
		return CryptoJS.mode.CTR;
	});
}));
//#endregion
//#region node_modules/crypto-js/mode-ctr-gladman.js
var require_mode_ctr_gladman = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_cipher_core());
		else if (typeof define === "function" && define.amd) define(["./core", "./cipher-core"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		/** @preserve
		* Counter block mode compatible with  Dr Brian Gladman fileenc.c
		* derived from CryptoJS.mode.CTR
		* Jan Hruby jhruby.web@gmail.com
		*/
		CryptoJS.mode.CTRGladman = function() {
			var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();
			function incWord(word) {
				if ((word >> 24 & 255) === 255) {
					var b1 = word >> 16 & 255;
					var b2 = word >> 8 & 255;
					var b3 = word & 255;
					if (b1 === 255) {
						b1 = 0;
						if (b2 === 255) {
							b2 = 0;
							if (b3 === 255) b3 = 0;
							else ++b3;
						} else ++b2;
					} else ++b1;
					word = 0;
					word += b1 << 16;
					word += b2 << 8;
					word += b3;
				} else word += 1 << 24;
				return word;
			}
			function incCounter(counter) {
				if ((counter[0] = incWord(counter[0])) === 0) counter[1] = incWord(counter[1]);
				return counter;
			}
			CTRGladman.Decryptor = CTRGladman.Encryptor = CTRGladman.extend({ processBlock: function(words, offset) {
				var cipher = this._cipher;
				var blockSize = cipher.blockSize;
				var iv = this._iv;
				var counter = this._counter;
				if (iv) {
					counter = this._counter = iv.slice(0);
					this._iv = void 0;
				}
				incCounter(counter);
				var keystream = counter.slice(0);
				cipher.encryptBlock(keystream, 0);
				for (var i = 0; i < blockSize; i++) words[offset + i] ^= keystream[i];
			} });
			return CTRGladman;
		}();
		return CryptoJS.mode.CTRGladman;
	});
}));
//#endregion
//#region node_modules/crypto-js/mode-ofb.js
var require_mode_ofb = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_cipher_core());
		else if (typeof define === "function" && define.amd) define(["./core", "./cipher-core"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		/**
		* Output Feedback block mode.
		*/
		CryptoJS.mode.OFB = function() {
			var OFB = CryptoJS.lib.BlockCipherMode.extend();
			OFB.Decryptor = OFB.Encryptor = OFB.extend({ processBlock: function(words, offset) {
				var cipher = this._cipher;
				var blockSize = cipher.blockSize;
				var iv = this._iv;
				var keystream = this._keystream;
				if (iv) {
					keystream = this._keystream = iv.slice(0);
					this._iv = void 0;
				}
				cipher.encryptBlock(keystream, 0);
				for (var i = 0; i < blockSize; i++) words[offset + i] ^= keystream[i];
			} });
			return OFB;
		}();
		return CryptoJS.mode.OFB;
	});
}));
//#endregion
//#region node_modules/crypto-js/mode-ecb.js
var require_mode_ecb = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_cipher_core());
		else if (typeof define === "function" && define.amd) define(["./core", "./cipher-core"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		/**
		* Electronic Codebook block mode.
		*/
		CryptoJS.mode.ECB = function() {
			var ECB = CryptoJS.lib.BlockCipherMode.extend();
			ECB.Encryptor = ECB.extend({ processBlock: function(words, offset) {
				this._cipher.encryptBlock(words, offset);
			} });
			ECB.Decryptor = ECB.extend({ processBlock: function(words, offset) {
				this._cipher.decryptBlock(words, offset);
			} });
			return ECB;
		}();
		return CryptoJS.mode.ECB;
	});
}));
//#endregion
//#region node_modules/crypto-js/pad-ansix923.js
var require_pad_ansix923 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_cipher_core());
		else if (typeof define === "function" && define.amd) define(["./core", "./cipher-core"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		/**
		* ANSI X.923 padding strategy.
		*/
		CryptoJS.pad.AnsiX923 = {
			pad: function(data, blockSize) {
				var dataSigBytes = data.sigBytes;
				var blockSizeBytes = blockSize * 4;
				var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;
				var lastBytePos = dataSigBytes + nPaddingBytes - 1;
				data.clamp();
				data.words[lastBytePos >>> 2] |= nPaddingBytes << 24 - lastBytePos % 4 * 8;
				data.sigBytes += nPaddingBytes;
			},
			unpad: function(data) {
				var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
				data.sigBytes -= nPaddingBytes;
			}
		};
		return CryptoJS.pad.Ansix923;
	});
}));
//#endregion
//#region node_modules/crypto-js/pad-iso10126.js
var require_pad_iso10126 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_cipher_core());
		else if (typeof define === "function" && define.amd) define(["./core", "./cipher-core"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		/**
		* ISO 10126 padding strategy.
		*/
		CryptoJS.pad.Iso10126 = {
			pad: function(data, blockSize) {
				var blockSizeBytes = blockSize * 4;
				var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
				data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1)).concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
			},
			unpad: function(data) {
				var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
				data.sigBytes -= nPaddingBytes;
			}
		};
		return CryptoJS.pad.Iso10126;
	});
}));
//#endregion
//#region node_modules/crypto-js/pad-iso97971.js
var require_pad_iso97971 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_cipher_core());
		else if (typeof define === "function" && define.amd) define(["./core", "./cipher-core"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		/**
		* ISO/IEC 9797-1 Padding Method 2.
		*/
		CryptoJS.pad.Iso97971 = {
			pad: function(data, blockSize) {
				data.concat(CryptoJS.lib.WordArray.create([2147483648], 1));
				CryptoJS.pad.ZeroPadding.pad(data, blockSize);
			},
			unpad: function(data) {
				CryptoJS.pad.ZeroPadding.unpad(data);
				data.sigBytes--;
			}
		};
		return CryptoJS.pad.Iso97971;
	});
}));
//#endregion
//#region node_modules/crypto-js/pad-zeropadding.js
var require_pad_zeropadding = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_cipher_core());
		else if (typeof define === "function" && define.amd) define(["./core", "./cipher-core"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		/**
		* Zero padding strategy.
		*/
		CryptoJS.pad.ZeroPadding = {
			pad: function(data, blockSize) {
				var blockSizeBytes = blockSize * 4;
				data.clamp();
				data.sigBytes += blockSizeBytes - (data.sigBytes % blockSizeBytes || blockSizeBytes);
			},
			unpad: function(data) {
				var dataWords = data.words;
				var i = data.sigBytes - 1;
				for (var i = data.sigBytes - 1; i >= 0; i--) if (dataWords[i >>> 2] >>> 24 - i % 4 * 8 & 255) {
					data.sigBytes = i + 1;
					break;
				}
			}
		};
		return CryptoJS.pad.ZeroPadding;
	});
}));
//#endregion
//#region node_modules/crypto-js/pad-nopadding.js
var require_pad_nopadding = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_cipher_core());
		else if (typeof define === "function" && define.amd) define(["./core", "./cipher-core"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		/**
		* A noop padding strategy.
		*/
		CryptoJS.pad.NoPadding = {
			pad: function() {},
			unpad: function() {}
		};
		return CryptoJS.pad.NoPadding;
	});
}));
//#endregion
//#region node_modules/crypto-js/format-hex.js
var require_format_hex = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_cipher_core());
		else if (typeof define === "function" && define.amd) define(["./core", "./cipher-core"], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		(function(undefined) {
			var C = CryptoJS;
			var CipherParams = C.lib.CipherParams;
			var Hex = C.enc.Hex;
			var C_format = C.format;
			C_format.Hex = {
				/**
				* Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
				*
				* @param {CipherParams} cipherParams The cipher params object.
				*
				* @return {string} The hexadecimally encoded string.
				*
				* @static
				*
				* @example
				*
				*     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
				*/
				stringify: function(cipherParams) {
					return cipherParams.ciphertext.toString(Hex);
				},
				/**
				* Converts a hexadecimally encoded ciphertext string to a cipher params object.
				*
				* @param {string} input The hexadecimally encoded string.
				*
				* @return {CipherParams} The cipher params object.
				*
				* @static
				*
				* @example
				*
				*     var cipherParams = CryptoJS.format.Hex.parse(hexString);
				*/
				parse: function(input) {
					var ciphertext = Hex.parse(input);
					return CipherParams.create({ ciphertext });
				}
			};
		})();
		return CryptoJS.format.Hex;
	});
}));
//#endregion
//#region node_modules/crypto-js/aes.js
var require_aes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
		else if (typeof define === "function" && define.amd) define([
			"./core",
			"./enc-base64",
			"./md5",
			"./evpkdf",
			"./cipher-core"
		], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		(function() {
			var C = CryptoJS;
			var BlockCipher = C.lib.BlockCipher;
			var C_algo = C.algo;
			var SBOX = [];
			var INV_SBOX = [];
			var SUB_MIX_0 = [];
			var SUB_MIX_1 = [];
			var SUB_MIX_2 = [];
			var SUB_MIX_3 = [];
			var INV_SUB_MIX_0 = [];
			var INV_SUB_MIX_1 = [];
			var INV_SUB_MIX_2 = [];
			var INV_SUB_MIX_3 = [];
			(function() {
				var d = [];
				for (var i = 0; i < 256; i++) if (i < 128) d[i] = i << 1;
				else d[i] = i << 1 ^ 283;
				var x = 0;
				var xi = 0;
				for (var i = 0; i < 256; i++) {
					var sx = xi ^ xi << 1 ^ xi << 2 ^ xi << 3 ^ xi << 4;
					sx = sx >>> 8 ^ sx & 255 ^ 99;
					SBOX[x] = sx;
					INV_SBOX[sx] = x;
					var x2 = d[x];
					var x4 = d[x2];
					var x8 = d[x4];
					var t = d[sx] * 257 ^ sx * 16843008;
					SUB_MIX_0[x] = t << 24 | t >>> 8;
					SUB_MIX_1[x] = t << 16 | t >>> 16;
					SUB_MIX_2[x] = t << 8 | t >>> 24;
					SUB_MIX_3[x] = t;
					var t = x8 * 16843009 ^ x4 * 65537 ^ x2 * 257 ^ x * 16843008;
					INV_SUB_MIX_0[sx] = t << 24 | t >>> 8;
					INV_SUB_MIX_1[sx] = t << 16 | t >>> 16;
					INV_SUB_MIX_2[sx] = t << 8 | t >>> 24;
					INV_SUB_MIX_3[sx] = t;
					if (!x) x = xi = 1;
					else {
						x = x2 ^ d[d[d[x8 ^ x2]]];
						xi ^= d[d[xi]];
					}
				}
			})();
			var RCON = [
				0,
				1,
				2,
				4,
				8,
				16,
				32,
				64,
				128,
				27,
				54
			];
			/**
			* AES block cipher algorithm.
			*/
			var AES = C_algo.AES = BlockCipher.extend({
				_doReset: function() {
					var t;
					if (this._nRounds && this._keyPriorReset === this._key) return;
					var key = this._keyPriorReset = this._key;
					var keyWords = key.words;
					var keySize = key.sigBytes / 4;
					var ksRows = ((this._nRounds = keySize + 6) + 1) * 4;
					var keySchedule = this._keySchedule = [];
					for (var ksRow = 0; ksRow < ksRows; ksRow++) if (ksRow < keySize) keySchedule[ksRow] = keyWords[ksRow];
					else {
						t = keySchedule[ksRow - 1];
						if (!(ksRow % keySize)) {
							t = t << 8 | t >>> 24;
							t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 255] << 16 | SBOX[t >>> 8 & 255] << 8 | SBOX[t & 255];
							t ^= RCON[ksRow / keySize | 0] << 24;
						} else if (keySize > 6 && ksRow % keySize == 4) t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 255] << 16 | SBOX[t >>> 8 & 255] << 8 | SBOX[t & 255];
						keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
					}
					var invKeySchedule = this._invKeySchedule = [];
					for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
						var ksRow = ksRows - invKsRow;
						if (invKsRow % 4) var t = keySchedule[ksRow];
						else var t = keySchedule[ksRow - 4];
						if (invKsRow < 4 || ksRow <= 4) invKeySchedule[invKsRow] = t;
						else invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[t >>> 16 & 255]] ^ INV_SUB_MIX_2[SBOX[t >>> 8 & 255]] ^ INV_SUB_MIX_3[SBOX[t & 255]];
					}
				},
				encryptBlock: function(M, offset) {
					this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
				},
				decryptBlock: function(M, offset) {
					var t = M[offset + 1];
					M[offset + 1] = M[offset + 3];
					M[offset + 3] = t;
					this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);
					var t = M[offset + 1];
					M[offset + 1] = M[offset + 3];
					M[offset + 3] = t;
				},
				_doCryptBlock: function(M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
					var nRounds = this._nRounds;
					var s0 = M[offset] ^ keySchedule[0];
					var s1 = M[offset + 1] ^ keySchedule[1];
					var s2 = M[offset + 2] ^ keySchedule[2];
					var s3 = M[offset + 3] ^ keySchedule[3];
					var ksRow = 4;
					for (var round = 1; round < nRounds; round++) {
						var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[s1 >>> 16 & 255] ^ SUB_MIX_2[s2 >>> 8 & 255] ^ SUB_MIX_3[s3 & 255] ^ keySchedule[ksRow++];
						var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[s2 >>> 16 & 255] ^ SUB_MIX_2[s3 >>> 8 & 255] ^ SUB_MIX_3[s0 & 255] ^ keySchedule[ksRow++];
						var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[s3 >>> 16 & 255] ^ SUB_MIX_2[s0 >>> 8 & 255] ^ SUB_MIX_3[s1 & 255] ^ keySchedule[ksRow++];
						var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[s0 >>> 16 & 255] ^ SUB_MIX_2[s1 >>> 8 & 255] ^ SUB_MIX_3[s2 & 255] ^ keySchedule[ksRow++];
						s0 = t0;
						s1 = t1;
						s2 = t2;
						s3 = t3;
					}
					var t0 = (SBOX[s0 >>> 24] << 24 | SBOX[s1 >>> 16 & 255] << 16 | SBOX[s2 >>> 8 & 255] << 8 | SBOX[s3 & 255]) ^ keySchedule[ksRow++];
					var t1 = (SBOX[s1 >>> 24] << 24 | SBOX[s2 >>> 16 & 255] << 16 | SBOX[s3 >>> 8 & 255] << 8 | SBOX[s0 & 255]) ^ keySchedule[ksRow++];
					var t2 = (SBOX[s2 >>> 24] << 24 | SBOX[s3 >>> 16 & 255] << 16 | SBOX[s0 >>> 8 & 255] << 8 | SBOX[s1 & 255]) ^ keySchedule[ksRow++];
					var t3 = (SBOX[s3 >>> 24] << 24 | SBOX[s0 >>> 16 & 255] << 16 | SBOX[s1 >>> 8 & 255] << 8 | SBOX[s2 & 255]) ^ keySchedule[ksRow++];
					M[offset] = t0;
					M[offset + 1] = t1;
					M[offset + 2] = t2;
					M[offset + 3] = t3;
				},
				keySize: 256 / 32
			});
			/**
			* Shortcut functions to the cipher's object interface.
			*
			* @example
			*
			*     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
			*     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
			*/
			C.AES = BlockCipher._createHelper(AES);
		})();
		return CryptoJS.AES;
	});
}));
//#endregion
//#region node_modules/crypto-js/tripledes.js
var require_tripledes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
		else if (typeof define === "function" && define.amd) define([
			"./core",
			"./enc-base64",
			"./md5",
			"./evpkdf",
			"./cipher-core"
		], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		(function() {
			var C = CryptoJS;
			var C_lib = C.lib;
			var WordArray = C_lib.WordArray;
			var BlockCipher = C_lib.BlockCipher;
			var C_algo = C.algo;
			var PC1 = [
				57,
				49,
				41,
				33,
				25,
				17,
				9,
				1,
				58,
				50,
				42,
				34,
				26,
				18,
				10,
				2,
				59,
				51,
				43,
				35,
				27,
				19,
				11,
				3,
				60,
				52,
				44,
				36,
				63,
				55,
				47,
				39,
				31,
				23,
				15,
				7,
				62,
				54,
				46,
				38,
				30,
				22,
				14,
				6,
				61,
				53,
				45,
				37,
				29,
				21,
				13,
				5,
				28,
				20,
				12,
				4
			];
			var PC2 = [
				14,
				17,
				11,
				24,
				1,
				5,
				3,
				28,
				15,
				6,
				21,
				10,
				23,
				19,
				12,
				4,
				26,
				8,
				16,
				7,
				27,
				20,
				13,
				2,
				41,
				52,
				31,
				37,
				47,
				55,
				30,
				40,
				51,
				45,
				33,
				48,
				44,
				49,
				39,
				56,
				34,
				53,
				46,
				42,
				50,
				36,
				29,
				32
			];
			var BIT_SHIFTS = [
				1,
				2,
				4,
				6,
				8,
				10,
				12,
				14,
				15,
				17,
				19,
				21,
				23,
				25,
				27,
				28
			];
			var SBOX_P = [
				{
					0: 8421888,
					268435456: 32768,
					536870912: 8421378,
					805306368: 2,
					1073741824: 512,
					1342177280: 8421890,
					1610612736: 8389122,
					1879048192: 8388608,
					2147483648: 514,
					2415919104: 8389120,
					2684354560: 33280,
					2952790016: 8421376,
					3221225472: 32770,
					3489660928: 8388610,
					3758096384: 0,
					4026531840: 33282,
					134217728: 0,
					402653184: 8421890,
					671088640: 33282,
					939524096: 32768,
					1207959552: 8421888,
					1476395008: 512,
					1744830464: 8421378,
					2013265920: 2,
					2281701376: 8389120,
					2550136832: 33280,
					2818572288: 8421376,
					3087007744: 8389122,
					3355443200: 8388610,
					3623878656: 32770,
					3892314112: 514,
					4160749568: 8388608,
					1: 32768,
					268435457: 2,
					536870913: 8421888,
					805306369: 8388608,
					1073741825: 8421378,
					1342177281: 33280,
					1610612737: 512,
					1879048193: 8389122,
					2147483649: 8421890,
					2415919105: 8421376,
					2684354561: 8388610,
					2952790017: 33282,
					3221225473: 514,
					3489660929: 8389120,
					3758096385: 32770,
					4026531841: 0,
					134217729: 8421890,
					402653185: 8421376,
					671088641: 8388608,
					939524097: 512,
					1207959553: 32768,
					1476395009: 8388610,
					1744830465: 2,
					2013265921: 33282,
					2281701377: 32770,
					2550136833: 8389122,
					2818572289: 514,
					3087007745: 8421888,
					3355443201: 8389120,
					3623878657: 0,
					3892314113: 33280,
					4160749569: 8421378
				},
				{
					0: 1074282512,
					16777216: 16384,
					33554432: 524288,
					50331648: 1074266128,
					67108864: 1073741840,
					83886080: 1074282496,
					100663296: 1073758208,
					117440512: 16,
					134217728: 540672,
					150994944: 1073758224,
					167772160: 1073741824,
					184549376: 540688,
					201326592: 524304,
					218103808: 0,
					234881024: 16400,
					251658240: 1074266112,
					8388608: 1073758208,
					25165824: 540688,
					41943040: 16,
					58720256: 1073758224,
					75497472: 1074282512,
					92274688: 1073741824,
					109051904: 524288,
					125829120: 1074266128,
					142606336: 524304,
					159383552: 0,
					176160768: 16384,
					192937984: 1074266112,
					209715200: 1073741840,
					226492416: 540672,
					243269632: 1074282496,
					260046848: 16400,
					268435456: 0,
					285212672: 1074266128,
					301989888: 1073758224,
					318767104: 1074282496,
					335544320: 1074266112,
					352321536: 16,
					369098752: 540688,
					385875968: 16384,
					402653184: 16400,
					419430400: 524288,
					436207616: 524304,
					452984832: 1073741840,
					469762048: 540672,
					486539264: 1073758208,
					503316480: 1073741824,
					520093696: 1074282512,
					276824064: 540688,
					293601280: 524288,
					310378496: 1074266112,
					327155712: 16384,
					343932928: 1073758208,
					360710144: 1074282512,
					377487360: 16,
					394264576: 1073741824,
					411041792: 1074282496,
					427819008: 1073741840,
					444596224: 1073758224,
					461373440: 524304,
					478150656: 0,
					494927872: 16400,
					511705088: 1074266128,
					528482304: 540672
				},
				{
					0: 260,
					1048576: 0,
					2097152: 67109120,
					3145728: 65796,
					4194304: 65540,
					5242880: 67108868,
					6291456: 67174660,
					7340032: 67174400,
					8388608: 67108864,
					9437184: 67174656,
					10485760: 65792,
					11534336: 67174404,
					12582912: 67109124,
					13631488: 65536,
					14680064: 4,
					15728640: 256,
					524288: 67174656,
					1572864: 67174404,
					2621440: 0,
					3670016: 67109120,
					4718592: 67108868,
					5767168: 65536,
					6815744: 65540,
					7864320: 260,
					8912896: 4,
					9961472: 256,
					11010048: 67174400,
					12058624: 65796,
					13107200: 65792,
					14155776: 67109124,
					15204352: 67174660,
					16252928: 67108864,
					16777216: 67174656,
					17825792: 65540,
					18874368: 65536,
					19922944: 67109120,
					20971520: 256,
					22020096: 67174660,
					23068672: 67108868,
					24117248: 0,
					25165824: 67109124,
					26214400: 67108864,
					27262976: 4,
					28311552: 65792,
					29360128: 67174400,
					30408704: 260,
					31457280: 65796,
					32505856: 67174404,
					17301504: 67108864,
					18350080: 260,
					19398656: 67174656,
					20447232: 0,
					21495808: 65540,
					22544384: 67109120,
					23592960: 256,
					24641536: 67174404,
					25690112: 65536,
					26738688: 67174660,
					27787264: 65796,
					28835840: 67108868,
					29884416: 67109124,
					30932992: 67174400,
					31981568: 4,
					33030144: 65792
				},
				{
					0: 2151682048,
					65536: 2147487808,
					131072: 4198464,
					196608: 2151677952,
					262144: 0,
					327680: 4198400,
					393216: 2147483712,
					458752: 4194368,
					524288: 2147483648,
					589824: 4194304,
					655360: 64,
					720896: 2147487744,
					786432: 2151678016,
					851968: 4160,
					917504: 4096,
					983040: 2151682112,
					32768: 2147487808,
					98304: 64,
					163840: 2151678016,
					229376: 2147487744,
					294912: 4198400,
					360448: 2151682112,
					425984: 0,
					491520: 2151677952,
					557056: 4096,
					622592: 2151682048,
					688128: 4194304,
					753664: 4160,
					819200: 2147483648,
					884736: 4194368,
					950272: 4198464,
					1015808: 2147483712,
					1048576: 4194368,
					1114112: 4198400,
					1179648: 2147483712,
					1245184: 0,
					1310720: 4160,
					1376256: 2151678016,
					1441792: 2151682048,
					1507328: 2147487808,
					1572864: 2151682112,
					1638400: 2147483648,
					1703936: 2151677952,
					1769472: 4198464,
					1835008: 2147487744,
					1900544: 4194304,
					1966080: 64,
					2031616: 4096,
					1081344: 2151677952,
					1146880: 2151682112,
					1212416: 0,
					1277952: 4198400,
					1343488: 4194368,
					1409024: 2147483648,
					1474560: 2147487808,
					1540096: 64,
					1605632: 2147483712,
					1671168: 4096,
					1736704: 2147487744,
					1802240: 2151678016,
					1867776: 4160,
					1933312: 2151682048,
					1998848: 4194304,
					2064384: 4198464
				},
				{
					0: 128,
					4096: 17039360,
					8192: 262144,
					12288: 536870912,
					16384: 537133184,
					20480: 16777344,
					24576: 553648256,
					28672: 262272,
					32768: 16777216,
					36864: 537133056,
					40960: 536871040,
					45056: 553910400,
					49152: 553910272,
					53248: 0,
					57344: 17039488,
					61440: 553648128,
					2048: 17039488,
					6144: 553648256,
					10240: 128,
					14336: 17039360,
					18432: 262144,
					22528: 537133184,
					26624: 553910272,
					30720: 536870912,
					34816: 537133056,
					38912: 0,
					43008: 553910400,
					47104: 16777344,
					51200: 536871040,
					55296: 553648128,
					59392: 16777216,
					63488: 262272,
					65536: 262144,
					69632: 128,
					73728: 536870912,
					77824: 553648256,
					81920: 16777344,
					86016: 553910272,
					90112: 537133184,
					94208: 16777216,
					98304: 553910400,
					102400: 553648128,
					106496: 17039360,
					110592: 537133056,
					114688: 262272,
					118784: 536871040,
					122880: 0,
					126976: 17039488,
					67584: 553648256,
					71680: 16777216,
					75776: 17039360,
					79872: 537133184,
					83968: 536870912,
					88064: 17039488,
					92160: 128,
					96256: 553910272,
					100352: 262272,
					104448: 553910400,
					108544: 0,
					112640: 553648128,
					116736: 16777344,
					120832: 262144,
					124928: 537133056,
					129024: 536871040
				},
				{
					0: 268435464,
					256: 8192,
					512: 270532608,
					768: 270540808,
					1024: 268443648,
					1280: 2097152,
					1536: 2097160,
					1792: 268435456,
					2048: 0,
					2304: 268443656,
					2560: 2105344,
					2816: 8,
					3072: 270532616,
					3328: 2105352,
					3584: 8200,
					3840: 270540800,
					128: 270532608,
					384: 270540808,
					640: 8,
					896: 2097152,
					1152: 2105352,
					1408: 268435464,
					1664: 268443648,
					1920: 8200,
					2176: 2097160,
					2432: 8192,
					2688: 268443656,
					2944: 270532616,
					3200: 0,
					3456: 270540800,
					3712: 2105344,
					3968: 268435456,
					4096: 268443648,
					4352: 270532616,
					4608: 270540808,
					4864: 8200,
					5120: 2097152,
					5376: 268435456,
					5632: 268435464,
					5888: 2105344,
					6144: 2105352,
					6400: 0,
					6656: 8,
					6912: 270532608,
					7168: 8192,
					7424: 268443656,
					7680: 270540800,
					7936: 2097160,
					4224: 8,
					4480: 2105344,
					4736: 2097152,
					4992: 268435464,
					5248: 268443648,
					5504: 8200,
					5760: 270540808,
					6016: 270532608,
					6272: 270540800,
					6528: 270532616,
					6784: 8192,
					7040: 2105352,
					7296: 2097160,
					7552: 0,
					7808: 268435456,
					8064: 268443656
				},
				{
					0: 1048576,
					16: 33555457,
					32: 1024,
					48: 1049601,
					64: 34604033,
					80: 0,
					96: 1,
					112: 34603009,
					128: 33555456,
					144: 1048577,
					160: 33554433,
					176: 34604032,
					192: 34603008,
					208: 1025,
					224: 1049600,
					240: 33554432,
					8: 34603009,
					24: 0,
					40: 33555457,
					56: 34604032,
					72: 1048576,
					88: 33554433,
					104: 33554432,
					120: 1025,
					136: 1049601,
					152: 33555456,
					168: 34603008,
					184: 1048577,
					200: 1024,
					216: 34604033,
					232: 1,
					248: 1049600,
					256: 33554432,
					272: 1048576,
					288: 33555457,
					304: 34603009,
					320: 1048577,
					336: 33555456,
					352: 34604032,
					368: 1049601,
					384: 1025,
					400: 34604033,
					416: 1049600,
					432: 1,
					448: 0,
					464: 34603008,
					480: 33554433,
					496: 1024,
					264: 1049600,
					280: 33555457,
					296: 34603009,
					312: 1,
					328: 33554432,
					344: 1048576,
					360: 1025,
					376: 34604032,
					392: 33554433,
					408: 34603008,
					424: 0,
					440: 34604033,
					456: 1049601,
					472: 1024,
					488: 33555456,
					504: 1048577
				},
				{
					0: 134219808,
					1: 131072,
					2: 134217728,
					3: 32,
					4: 131104,
					5: 134350880,
					6: 134350848,
					7: 2048,
					8: 134348800,
					9: 134219776,
					10: 133120,
					11: 134348832,
					12: 2080,
					13: 0,
					14: 134217760,
					15: 133152,
					2147483648: 2048,
					2147483649: 134350880,
					2147483650: 134219808,
					2147483651: 134217728,
					2147483652: 134348800,
					2147483653: 133120,
					2147483654: 133152,
					2147483655: 32,
					2147483656: 134217760,
					2147483657: 2080,
					2147483658: 131104,
					2147483659: 134350848,
					2147483660: 0,
					2147483661: 134348832,
					2147483662: 134219776,
					2147483663: 131072,
					16: 133152,
					17: 134350848,
					18: 32,
					19: 2048,
					20: 134219776,
					21: 134217760,
					22: 134348832,
					23: 131072,
					24: 0,
					25: 131104,
					26: 134348800,
					27: 134219808,
					28: 134350880,
					29: 133120,
					30: 2080,
					31: 134217728,
					2147483664: 131072,
					2147483665: 2048,
					2147483666: 134348832,
					2147483667: 133152,
					2147483668: 32,
					2147483669: 134348800,
					2147483670: 134217728,
					2147483671: 134219808,
					2147483672: 134350880,
					2147483673: 134217760,
					2147483674: 134219776,
					2147483675: 0,
					2147483676: 133120,
					2147483677: 2080,
					2147483678: 131104,
					2147483679: 134350848
				}
			];
			var SBOX_MASK = [
				4160749569,
				528482304,
				33030144,
				2064384,
				129024,
				8064,
				504,
				2147483679
			];
			/**
			* DES block cipher algorithm.
			*/
			var DES = C_algo.DES = BlockCipher.extend({
				_doReset: function() {
					var keyWords = this._key.words;
					var keyBits = [];
					for (var i = 0; i < 56; i++) {
						var keyBitPos = PC1[i] - 1;
						keyBits[i] = keyWords[keyBitPos >>> 5] >>> 31 - keyBitPos % 32 & 1;
					}
					var subKeys = this._subKeys = [];
					for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
						var subKey = subKeys[nSubKey] = [];
						var bitShift = BIT_SHIFTS[nSubKey];
						for (var i = 0; i < 24; i++) {
							subKey[i / 6 | 0] |= keyBits[(PC2[i] - 1 + bitShift) % 28] << 31 - i % 6;
							subKey[4 + (i / 6 | 0)] |= keyBits[28 + (PC2[i + 24] - 1 + bitShift) % 28] << 31 - i % 6;
						}
						subKey[0] = subKey[0] << 1 | subKey[0] >>> 31;
						for (var i = 1; i < 7; i++) subKey[i] = subKey[i] >>> (i - 1) * 4 + 3;
						subKey[7] = subKey[7] << 5 | subKey[7] >>> 27;
					}
					var invSubKeys = this._invSubKeys = [];
					for (var i = 0; i < 16; i++) invSubKeys[i] = subKeys[15 - i];
				},
				encryptBlock: function(M, offset) {
					this._doCryptBlock(M, offset, this._subKeys);
				},
				decryptBlock: function(M, offset) {
					this._doCryptBlock(M, offset, this._invSubKeys);
				},
				_doCryptBlock: function(M, offset, subKeys) {
					this._lBlock = M[offset];
					this._rBlock = M[offset + 1];
					exchangeLR.call(this, 4, 252645135);
					exchangeLR.call(this, 16, 65535);
					exchangeRL.call(this, 2, 858993459);
					exchangeRL.call(this, 8, 16711935);
					exchangeLR.call(this, 1, 1431655765);
					for (var round = 0; round < 16; round++) {
						var subKey = subKeys[round];
						var lBlock = this._lBlock;
						var rBlock = this._rBlock;
						var f = 0;
						for (var i = 0; i < 8; i++) f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
						this._lBlock = rBlock;
						this._rBlock = lBlock ^ f;
					}
					var t = this._lBlock;
					this._lBlock = this._rBlock;
					this._rBlock = t;
					exchangeLR.call(this, 1, 1431655765);
					exchangeRL.call(this, 8, 16711935);
					exchangeRL.call(this, 2, 858993459);
					exchangeLR.call(this, 16, 65535);
					exchangeLR.call(this, 4, 252645135);
					M[offset] = this._lBlock;
					M[offset + 1] = this._rBlock;
				},
				keySize: 64 / 32,
				ivSize: 64 / 32,
				blockSize: 64 / 32
			});
			function exchangeLR(offset, mask) {
				var t = (this._lBlock >>> offset ^ this._rBlock) & mask;
				this._rBlock ^= t;
				this._lBlock ^= t << offset;
			}
			function exchangeRL(offset, mask) {
				var t = (this._rBlock >>> offset ^ this._lBlock) & mask;
				this._lBlock ^= t;
				this._rBlock ^= t << offset;
			}
			/**
			* Shortcut functions to the cipher's object interface.
			*
			* @example
			*
			*     var ciphertext = CryptoJS.DES.encrypt(message, key, cfg);
			*     var plaintext  = CryptoJS.DES.decrypt(ciphertext, key, cfg);
			*/
			C.DES = BlockCipher._createHelper(DES);
			/**
			* Triple-DES block cipher algorithm.
			*/
			var TripleDES = C_algo.TripleDES = BlockCipher.extend({
				_doReset: function() {
					var keyWords = this._key.words;
					if (keyWords.length !== 2 && keyWords.length !== 4 && keyWords.length < 6) throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
					var key1 = keyWords.slice(0, 2);
					var key2 = keyWords.length < 4 ? keyWords.slice(0, 2) : keyWords.slice(2, 4);
					var key3 = keyWords.length < 6 ? keyWords.slice(0, 2) : keyWords.slice(4, 6);
					this._des1 = DES.createEncryptor(WordArray.create(key1));
					this._des2 = DES.createEncryptor(WordArray.create(key2));
					this._des3 = DES.createEncryptor(WordArray.create(key3));
				},
				encryptBlock: function(M, offset) {
					this._des1.encryptBlock(M, offset);
					this._des2.decryptBlock(M, offset);
					this._des3.encryptBlock(M, offset);
				},
				decryptBlock: function(M, offset) {
					this._des3.decryptBlock(M, offset);
					this._des2.encryptBlock(M, offset);
					this._des1.decryptBlock(M, offset);
				},
				keySize: 192 / 32,
				ivSize: 64 / 32,
				blockSize: 64 / 32
			});
			/**
			* Shortcut functions to the cipher's object interface.
			*
			* @example
			*
			*     var ciphertext = CryptoJS.TripleDES.encrypt(message, key, cfg);
			*     var plaintext  = CryptoJS.TripleDES.decrypt(ciphertext, key, cfg);
			*/
			C.TripleDES = BlockCipher._createHelper(TripleDES);
		})();
		return CryptoJS.TripleDES;
	});
}));
//#endregion
//#region node_modules/crypto-js/rc4.js
var require_rc4 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
		else if (typeof define === "function" && define.amd) define([
			"./core",
			"./enc-base64",
			"./md5",
			"./evpkdf",
			"./cipher-core"
		], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		(function() {
			var C = CryptoJS;
			var StreamCipher = C.lib.StreamCipher;
			var C_algo = C.algo;
			/**
			* RC4 stream cipher algorithm.
			*/
			var RC4 = C_algo.RC4 = StreamCipher.extend({
				_doReset: function() {
					var key = this._key;
					var keyWords = key.words;
					var keySigBytes = key.sigBytes;
					var S = this._S = [];
					for (var i = 0; i < 256; i++) S[i] = i;
					for (var i = 0, j = 0; i < 256; i++) {
						var keyByteIndex = i % keySigBytes;
						var keyByte = keyWords[keyByteIndex >>> 2] >>> 24 - keyByteIndex % 4 * 8 & 255;
						j = (j + S[i] + keyByte) % 256;
						var t = S[i];
						S[i] = S[j];
						S[j] = t;
					}
					this._i = this._j = 0;
				},
				_doProcessBlock: function(M, offset) {
					M[offset] ^= generateKeystreamWord.call(this);
				},
				keySize: 256 / 32,
				ivSize: 0
			});
			function generateKeystreamWord() {
				var S = this._S;
				var i = this._i;
				var j = this._j;
				var keystreamWord = 0;
				for (var n = 0; n < 4; n++) {
					i = (i + 1) % 256;
					j = (j + S[i]) % 256;
					var t = S[i];
					S[i] = S[j];
					S[j] = t;
					keystreamWord |= S[(S[i] + S[j]) % 256] << 24 - n * 8;
				}
				this._i = i;
				this._j = j;
				return keystreamWord;
			}
			/**
			* Shortcut functions to the cipher's object interface.
			*
			* @example
			*
			*     var ciphertext = CryptoJS.RC4.encrypt(message, key, cfg);
			*     var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key, cfg);
			*/
			C.RC4 = StreamCipher._createHelper(RC4);
			/**
			* Modified RC4 stream cipher algorithm.
			*/
			var RC4Drop = C_algo.RC4Drop = RC4.extend({
				/**
				* Configuration options.
				*
				* @property {number} drop The number of keystream words to drop. Default 192
				*/
				cfg: RC4.cfg.extend({ drop: 192 }),
				_doReset: function() {
					RC4._doReset.call(this);
					for (var i = this.cfg.drop; i > 0; i--) generateKeystreamWord.call(this);
				}
			});
			/**
			* Shortcut functions to the cipher's object interface.
			*
			* @example
			*
			*     var ciphertext = CryptoJS.RC4Drop.encrypt(message, key, cfg);
			*     var plaintext  = CryptoJS.RC4Drop.decrypt(ciphertext, key, cfg);
			*/
			C.RC4Drop = StreamCipher._createHelper(RC4Drop);
		})();
		return CryptoJS.RC4;
	});
}));
//#endregion
//#region node_modules/crypto-js/rabbit.js
var require_rabbit = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
		else if (typeof define === "function" && define.amd) define([
			"./core",
			"./enc-base64",
			"./md5",
			"./evpkdf",
			"./cipher-core"
		], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		(function() {
			var C = CryptoJS;
			var StreamCipher = C.lib.StreamCipher;
			var C_algo = C.algo;
			var S = [];
			var C_ = [];
			var G = [];
			/**
			* Rabbit stream cipher algorithm
			*/
			var Rabbit = C_algo.Rabbit = StreamCipher.extend({
				_doReset: function() {
					var K = this._key.words;
					var iv = this.cfg.iv;
					for (var i = 0; i < 4; i++) K[i] = (K[i] << 8 | K[i] >>> 24) & 16711935 | (K[i] << 24 | K[i] >>> 8) & 4278255360;
					var X = this._X = [
						K[0],
						K[3] << 16 | K[2] >>> 16,
						K[1],
						K[0] << 16 | K[3] >>> 16,
						K[2],
						K[1] << 16 | K[0] >>> 16,
						K[3],
						K[2] << 16 | K[1] >>> 16
					];
					var C = this._C = [
						K[2] << 16 | K[2] >>> 16,
						K[0] & 4294901760 | K[1] & 65535,
						K[3] << 16 | K[3] >>> 16,
						K[1] & 4294901760 | K[2] & 65535,
						K[0] << 16 | K[0] >>> 16,
						K[2] & 4294901760 | K[3] & 65535,
						K[1] << 16 | K[1] >>> 16,
						K[3] & 4294901760 | K[0] & 65535
					];
					this._b = 0;
					for (var i = 0; i < 4; i++) nextState.call(this);
					for (var i = 0; i < 8; i++) C[i] ^= X[i + 4 & 7];
					if (iv) {
						var IV = iv.words;
						var IV_0 = IV[0];
						var IV_1 = IV[1];
						var i0 = (IV_0 << 8 | IV_0 >>> 24) & 16711935 | (IV_0 << 24 | IV_0 >>> 8) & 4278255360;
						var i2 = (IV_1 << 8 | IV_1 >>> 24) & 16711935 | (IV_1 << 24 | IV_1 >>> 8) & 4278255360;
						var i1 = i0 >>> 16 | i2 & 4294901760;
						var i3 = i2 << 16 | i0 & 65535;
						C[0] ^= i0;
						C[1] ^= i1;
						C[2] ^= i2;
						C[3] ^= i3;
						C[4] ^= i0;
						C[5] ^= i1;
						C[6] ^= i2;
						C[7] ^= i3;
						for (var i = 0; i < 4; i++) nextState.call(this);
					}
				},
				_doProcessBlock: function(M, offset) {
					var X = this._X;
					nextState.call(this);
					S[0] = X[0] ^ X[5] >>> 16 ^ X[3] << 16;
					S[1] = X[2] ^ X[7] >>> 16 ^ X[5] << 16;
					S[2] = X[4] ^ X[1] >>> 16 ^ X[7] << 16;
					S[3] = X[6] ^ X[3] >>> 16 ^ X[1] << 16;
					for (var i = 0; i < 4; i++) {
						S[i] = (S[i] << 8 | S[i] >>> 24) & 16711935 | (S[i] << 24 | S[i] >>> 8) & 4278255360;
						M[offset + i] ^= S[i];
					}
				},
				blockSize: 128 / 32,
				ivSize: 64 / 32
			});
			function nextState() {
				var X = this._X;
				var C = this._C;
				for (var i = 0; i < 8; i++) C_[i] = C[i];
				C[0] = C[0] + 1295307597 + this._b | 0;
				C[1] = C[1] + 3545052371 + (C[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
				C[2] = C[2] + 886263092 + (C[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
				C[3] = C[3] + 1295307597 + (C[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
				C[4] = C[4] + 3545052371 + (C[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
				C[5] = C[5] + 886263092 + (C[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
				C[6] = C[6] + 1295307597 + (C[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
				C[7] = C[7] + 3545052371 + (C[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
				this._b = C[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;
				for (var i = 0; i < 8; i++) {
					var gx = X[i] + C[i];
					var ga = gx & 65535;
					var gb = gx >>> 16;
					G[i] = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb ^ ((gx & 4294901760) * gx | 0) + ((gx & 65535) * gx | 0);
				}
				X[0] = G[0] + (G[7] << 16 | G[7] >>> 16) + (G[6] << 16 | G[6] >>> 16) | 0;
				X[1] = G[1] + (G[0] << 8 | G[0] >>> 24) + G[7] | 0;
				X[2] = G[2] + (G[1] << 16 | G[1] >>> 16) + (G[0] << 16 | G[0] >>> 16) | 0;
				X[3] = G[3] + (G[2] << 8 | G[2] >>> 24) + G[1] | 0;
				X[4] = G[4] + (G[3] << 16 | G[3] >>> 16) + (G[2] << 16 | G[2] >>> 16) | 0;
				X[5] = G[5] + (G[4] << 8 | G[4] >>> 24) + G[3] | 0;
				X[6] = G[6] + (G[5] << 16 | G[5] >>> 16) + (G[4] << 16 | G[4] >>> 16) | 0;
				X[7] = G[7] + (G[6] << 8 | G[6] >>> 24) + G[5] | 0;
			}
			/**
			* Shortcut functions to the cipher's object interface.
			*
			* @example
			*
			*     var ciphertext = CryptoJS.Rabbit.encrypt(message, key, cfg);
			*     var plaintext  = CryptoJS.Rabbit.decrypt(ciphertext, key, cfg);
			*/
			C.Rabbit = StreamCipher._createHelper(Rabbit);
		})();
		return CryptoJS.Rabbit;
	});
}));
//#endregion
//#region node_modules/crypto-js/rabbit-legacy.js
var require_rabbit_legacy = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
		else if (typeof define === "function" && define.amd) define([
			"./core",
			"./enc-base64",
			"./md5",
			"./evpkdf",
			"./cipher-core"
		], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		(function() {
			var C = CryptoJS;
			var StreamCipher = C.lib.StreamCipher;
			var C_algo = C.algo;
			var S = [];
			var C_ = [];
			var G = [];
			/**
			* Rabbit stream cipher algorithm.
			*
			* This is a legacy version that neglected to convert the key to little-endian.
			* This error doesn't affect the cipher's security,
			* but it does affect its compatibility with other implementations.
			*/
			var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
				_doReset: function() {
					var K = this._key.words;
					var iv = this.cfg.iv;
					var X = this._X = [
						K[0],
						K[3] << 16 | K[2] >>> 16,
						K[1],
						K[0] << 16 | K[3] >>> 16,
						K[2],
						K[1] << 16 | K[0] >>> 16,
						K[3],
						K[2] << 16 | K[1] >>> 16
					];
					var C = this._C = [
						K[2] << 16 | K[2] >>> 16,
						K[0] & 4294901760 | K[1] & 65535,
						K[3] << 16 | K[3] >>> 16,
						K[1] & 4294901760 | K[2] & 65535,
						K[0] << 16 | K[0] >>> 16,
						K[2] & 4294901760 | K[3] & 65535,
						K[1] << 16 | K[1] >>> 16,
						K[3] & 4294901760 | K[0] & 65535
					];
					this._b = 0;
					for (var i = 0; i < 4; i++) nextState.call(this);
					for (var i = 0; i < 8; i++) C[i] ^= X[i + 4 & 7];
					if (iv) {
						var IV = iv.words;
						var IV_0 = IV[0];
						var IV_1 = IV[1];
						var i0 = (IV_0 << 8 | IV_0 >>> 24) & 16711935 | (IV_0 << 24 | IV_0 >>> 8) & 4278255360;
						var i2 = (IV_1 << 8 | IV_1 >>> 24) & 16711935 | (IV_1 << 24 | IV_1 >>> 8) & 4278255360;
						var i1 = i0 >>> 16 | i2 & 4294901760;
						var i3 = i2 << 16 | i0 & 65535;
						C[0] ^= i0;
						C[1] ^= i1;
						C[2] ^= i2;
						C[3] ^= i3;
						C[4] ^= i0;
						C[5] ^= i1;
						C[6] ^= i2;
						C[7] ^= i3;
						for (var i = 0; i < 4; i++) nextState.call(this);
					}
				},
				_doProcessBlock: function(M, offset) {
					var X = this._X;
					nextState.call(this);
					S[0] = X[0] ^ X[5] >>> 16 ^ X[3] << 16;
					S[1] = X[2] ^ X[7] >>> 16 ^ X[5] << 16;
					S[2] = X[4] ^ X[1] >>> 16 ^ X[7] << 16;
					S[3] = X[6] ^ X[3] >>> 16 ^ X[1] << 16;
					for (var i = 0; i < 4; i++) {
						S[i] = (S[i] << 8 | S[i] >>> 24) & 16711935 | (S[i] << 24 | S[i] >>> 8) & 4278255360;
						M[offset + i] ^= S[i];
					}
				},
				blockSize: 128 / 32,
				ivSize: 64 / 32
			});
			function nextState() {
				var X = this._X;
				var C = this._C;
				for (var i = 0; i < 8; i++) C_[i] = C[i];
				C[0] = C[0] + 1295307597 + this._b | 0;
				C[1] = C[1] + 3545052371 + (C[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
				C[2] = C[2] + 886263092 + (C[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
				C[3] = C[3] + 1295307597 + (C[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
				C[4] = C[4] + 3545052371 + (C[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
				C[5] = C[5] + 886263092 + (C[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
				C[6] = C[6] + 1295307597 + (C[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
				C[7] = C[7] + 3545052371 + (C[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
				this._b = C[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;
				for (var i = 0; i < 8; i++) {
					var gx = X[i] + C[i];
					var ga = gx & 65535;
					var gb = gx >>> 16;
					G[i] = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb ^ ((gx & 4294901760) * gx | 0) + ((gx & 65535) * gx | 0);
				}
				X[0] = G[0] + (G[7] << 16 | G[7] >>> 16) + (G[6] << 16 | G[6] >>> 16) | 0;
				X[1] = G[1] + (G[0] << 8 | G[0] >>> 24) + G[7] | 0;
				X[2] = G[2] + (G[1] << 16 | G[1] >>> 16) + (G[0] << 16 | G[0] >>> 16) | 0;
				X[3] = G[3] + (G[2] << 8 | G[2] >>> 24) + G[1] | 0;
				X[4] = G[4] + (G[3] << 16 | G[3] >>> 16) + (G[2] << 16 | G[2] >>> 16) | 0;
				X[5] = G[5] + (G[4] << 8 | G[4] >>> 24) + G[3] | 0;
				X[6] = G[6] + (G[5] << 16 | G[5] >>> 16) + (G[4] << 16 | G[4] >>> 16) | 0;
				X[7] = G[7] + (G[6] << 8 | G[6] >>> 24) + G[5] | 0;
			}
			/**
			* Shortcut functions to the cipher's object interface.
			*
			* @example
			*
			*     var ciphertext = CryptoJS.RabbitLegacy.encrypt(message, key, cfg);
			*     var plaintext  = CryptoJS.RabbitLegacy.decrypt(ciphertext, key, cfg);
			*/
			C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
		})();
		return CryptoJS.RabbitLegacy;
	});
}));
//#endregion
//#region node_modules/crypto-js/blowfish.js
var require_blowfish = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
		else if (typeof define === "function" && define.amd) define([
			"./core",
			"./enc-base64",
			"./md5",
			"./evpkdf",
			"./cipher-core"
		], factory);
		else factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		(function() {
			var C = CryptoJS;
			var BlockCipher = C.lib.BlockCipher;
			var C_algo = C.algo;
			const N = 16;
			const ORIG_P = [
				608135816,
				2242054355,
				320440878,
				57701188,
				2752067618,
				698298832,
				137296536,
				3964562569,
				1160258022,
				953160567,
				3193202383,
				887688300,
				3232508343,
				3380367581,
				1065670069,
				3041331479,
				2450970073,
				2306472731
			];
			const ORIG_S = [
				[
					3509652390,
					2564797868,
					805139163,
					3491422135,
					3101798381,
					1780907670,
					3128725573,
					4046225305,
					614570311,
					3012652279,
					134345442,
					2240740374,
					1667834072,
					1901547113,
					2757295779,
					4103290238,
					227898511,
					1921955416,
					1904987480,
					2182433518,
					2069144605,
					3260701109,
					2620446009,
					720527379,
					3318853667,
					677414384,
					3393288472,
					3101374703,
					2390351024,
					1614419982,
					1822297739,
					2954791486,
					3608508353,
					3174124327,
					2024746970,
					1432378464,
					3864339955,
					2857741204,
					1464375394,
					1676153920,
					1439316330,
					715854006,
					3033291828,
					289532110,
					2706671279,
					2087905683,
					3018724369,
					1668267050,
					732546397,
					1947742710,
					3462151702,
					2609353502,
					2950085171,
					1814351708,
					2050118529,
					680887927,
					999245976,
					1800124847,
					3300911131,
					1713906067,
					1641548236,
					4213287313,
					1216130144,
					1575780402,
					4018429277,
					3917837745,
					3693486850,
					3949271944,
					596196993,
					3549867205,
					258830323,
					2213823033,
					772490370,
					2760122372,
					1774776394,
					2652871518,
					566650946,
					4142492826,
					1728879713,
					2882767088,
					1783734482,
					3629395816,
					2517608232,
					2874225571,
					1861159788,
					326777828,
					3124490320,
					2130389656,
					2716951837,
					967770486,
					1724537150,
					2185432712,
					2364442137,
					1164943284,
					2105845187,
					998989502,
					3765401048,
					2244026483,
					1075463327,
					1455516326,
					1322494562,
					910128902,
					469688178,
					1117454909,
					936433444,
					3490320968,
					3675253459,
					1240580251,
					122909385,
					2157517691,
					634681816,
					4142456567,
					3825094682,
					3061402683,
					2540495037,
					79693498,
					3249098678,
					1084186820,
					1583128258,
					426386531,
					1761308591,
					1047286709,
					322548459,
					995290223,
					1845252383,
					2603652396,
					3431023940,
					2942221577,
					3202600964,
					3727903485,
					1712269319,
					422464435,
					3234572375,
					1170764815,
					3523960633,
					3117677531,
					1434042557,
					442511882,
					3600875718,
					1076654713,
					1738483198,
					4213154764,
					2393238008,
					3677496056,
					1014306527,
					4251020053,
					793779912,
					2902807211,
					842905082,
					4246964064,
					1395751752,
					1040244610,
					2656851899,
					3396308128,
					445077038,
					3742853595,
					3577915638,
					679411651,
					2892444358,
					2354009459,
					1767581616,
					3150600392,
					3791627101,
					3102740896,
					284835224,
					4246832056,
					1258075500,
					768725851,
					2589189241,
					3069724005,
					3532540348,
					1274779536,
					3789419226,
					2764799539,
					1660621633,
					3471099624,
					4011903706,
					913787905,
					3497959166,
					737222580,
					2514213453,
					2928710040,
					3937242737,
					1804850592,
					3499020752,
					2949064160,
					2386320175,
					2390070455,
					2415321851,
					4061277028,
					2290661394,
					2416832540,
					1336762016,
					1754252060,
					3520065937,
					3014181293,
					791618072,
					3188594551,
					3933548030,
					2332172193,
					3852520463,
					3043980520,
					413987798,
					3465142937,
					3030929376,
					4245938359,
					2093235073,
					3534596313,
					375366246,
					2157278981,
					2479649556,
					555357303,
					3870105701,
					2008414854,
					3344188149,
					4221384143,
					3956125452,
					2067696032,
					3594591187,
					2921233993,
					2428461,
					544322398,
					577241275,
					1471733935,
					610547355,
					4027169054,
					1432588573,
					1507829418,
					2025931657,
					3646575487,
					545086370,
					48609733,
					2200306550,
					1653985193,
					298326376,
					1316178497,
					3007786442,
					2064951626,
					458293330,
					2589141269,
					3591329599,
					3164325604,
					727753846,
					2179363840,
					146436021,
					1461446943,
					4069977195,
					705550613,
					3059967265,
					3887724982,
					4281599278,
					3313849956,
					1404054877,
					2845806497,
					146425753,
					1854211946
				],
				[
					1266315497,
					3048417604,
					3681880366,
					3289982499,
					290971e4,
					1235738493,
					2632868024,
					2414719590,
					3970600049,
					1771706367,
					1449415276,
					3266420449,
					422970021,
					1963543593,
					2690192192,
					3826793022,
					1062508698,
					1531092325,
					1804592342,
					2583117782,
					2714934279,
					4024971509,
					1294809318,
					4028980673,
					1289560198,
					2221992742,
					1669523910,
					35572830,
					157838143,
					1052438473,
					1016535060,
					1802137761,
					1753167236,
					1386275462,
					3080475397,
					2857371447,
					1040679964,
					2145300060,
					2390574316,
					1461121720,
					2956646967,
					4031777805,
					4028374788,
					33600511,
					2920084762,
					1018524850,
					629373528,
					3691585981,
					3515945977,
					2091462646,
					2486323059,
					586499841,
					988145025,
					935516892,
					3367335476,
					2599673255,
					2839830854,
					265290510,
					3972581182,
					2759138881,
					3795373465,
					1005194799,
					847297441,
					406762289,
					1314163512,
					1332590856,
					1866599683,
					4127851711,
					750260880,
					613907577,
					1450815602,
					3165620655,
					3734664991,
					3650291728,
					3012275730,
					3704569646,
					1427272223,
					778793252,
					1343938022,
					2676280711,
					2052605720,
					1946737175,
					3164576444,
					3914038668,
					3967478842,
					3682934266,
					1661551462,
					3294938066,
					4011595847,
					840292616,
					3712170807,
					616741398,
					312560963,
					711312465,
					1351876610,
					322626781,
					1910503582,
					271666773,
					2175563734,
					1594956187,
					70604529,
					3617834859,
					1007753275,
					1495573769,
					4069517037,
					2549218298,
					2663038764,
					504708206,
					2263041392,
					3941167025,
					2249088522,
					1514023603,
					1998579484,
					1312622330,
					694541497,
					2582060303,
					2151582166,
					1382467621,
					776784248,
					2618340202,
					3323268794,
					2497899128,
					2784771155,
					503983604,
					4076293799,
					907881277,
					423175695,
					432175456,
					1378068232,
					4145222326,
					3954048622,
					3938656102,
					3820766613,
					2793130115,
					2977904593,
					26017576,
					3274890735,
					3194772133,
					1700274565,
					1756076034,
					4006520079,
					3677328699,
					720338349,
					1533947780,
					354530856,
					688349552,
					3973924725,
					1637815568,
					332179504,
					3949051286,
					53804574,
					2852348879,
					3044236432,
					1282449977,
					3583942155,
					3416972820,
					4006381244,
					1617046695,
					2628476075,
					3002303598,
					1686838959,
					431878346,
					2686675385,
					1700445008,
					1080580658,
					1009431731,
					832498133,
					3223435511,
					2605976345,
					2271191193,
					2516031870,
					1648197032,
					4164389018,
					2548247927,
					300782431,
					375919233,
					238389289,
					3353747414,
					2531188641,
					2019080857,
					1475708069,
					455242339,
					2609103871,
					448939670,
					3451063019,
					1395535956,
					2413381860,
					1841049896,
					1491858159,
					885456874,
					4264095073,
					4001119347,
					1565136089,
					3898914787,
					1108368660,
					540939232,
					1173283510,
					2745871338,
					3681308437,
					4207628240,
					3343053890,
					4016749493,
					1699691293,
					1103962373,
					3625875870,
					2256883143,
					3830138730,
					1031889488,
					3479347698,
					1535977030,
					4236805024,
					3251091107,
					2132092099,
					1774941330,
					1199868427,
					1452454533,
					157007616,
					2904115357,
					342012276,
					595725824,
					1480756522,
					206960106,
					497939518,
					591360097,
					863170706,
					2375253569,
					3596610801,
					1814182875,
					2094937945,
					3421402208,
					1082520231,
					3463918190,
					2785509508,
					435703966,
					3908032597,
					1641649973,
					2842273706,
					3305899714,
					1510255612,
					2148256476,
					2655287854,
					3276092548,
					4258621189,
					236887753,
					3681803219,
					274041037,
					1734335097,
					3815195456,
					3317970021,
					1899903192,
					1026095262,
					4050517792,
					356393447,
					2410691914,
					3873677099,
					3682840055
				],
				[
					3913112168,
					2491498743,
					4132185628,
					2489919796,
					1091903735,
					1979897079,
					3170134830,
					3567386728,
					3557303409,
					857797738,
					1136121015,
					1342202287,
					507115054,
					2535736646,
					337727348,
					3213592640,
					1301675037,
					2528481711,
					1895095763,
					1721773893,
					3216771564,
					62756741,
					2142006736,
					835421444,
					2531993523,
					1442658625,
					3659876326,
					2882144922,
					676362277,
					1392781812,
					170690266,
					3921047035,
					1759253602,
					3611846912,
					1745797284,
					664899054,
					1329594018,
					3901205900,
					3045908486,
					2062866102,
					2865634940,
					3543621612,
					3464012697,
					1080764994,
					553557557,
					3656615353,
					3996768171,
					991055499,
					499776247,
					1265440854,
					648242737,
					3940784050,
					980351604,
					3713745714,
					1749149687,
					3396870395,
					4211799374,
					3640570775,
					1161844396,
					3125318951,
					1431517754,
					545492359,
					4268468663,
					3499529547,
					1437099964,
					2702547544,
					3433638243,
					2581715763,
					2787789398,
					1060185593,
					1593081372,
					2418618748,
					4260947970,
					69676912,
					2159744348,
					86519011,
					2512459080,
					3838209314,
					1220612927,
					3339683548,
					133810670,
					1090789135,
					1078426020,
					1569222167,
					845107691,
					3583754449,
					4072456591,
					1091646820,
					628848692,
					1613405280,
					3757631651,
					526609435,
					236106946,
					48312990,
					2942717905,
					3402727701,
					1797494240,
					859738849,
					992217954,
					4005476642,
					2243076622,
					3870952857,
					3732016268,
					765654824,
					3490871365,
					2511836413,
					1685915746,
					3888969200,
					1414112111,
					2273134842,
					3281911079,
					4080962846,
					172450625,
					2569994100,
					980381355,
					4109958455,
					2819808352,
					2716589560,
					2568741196,
					3681446669,
					3329971472,
					1835478071,
					660984891,
					3704678404,
					4045999559,
					3422617507,
					3040415634,
					1762651403,
					1719377915,
					3470491036,
					2693910283,
					3642056355,
					3138596744,
					1364962596,
					2073328063,
					1983633131,
					926494387,
					3423689081,
					2150032023,
					4096667949,
					1749200295,
					3328846651,
					309677260,
					2016342300,
					1779581495,
					3079819751,
					111262694,
					1274766160,
					443224088,
					298511866,
					1025883608,
					3806446537,
					1145181785,
					168956806,
					3641502830,
					3584813610,
					1689216846,
					3666258015,
					3200248200,
					1692713982,
					2646376535,
					4042768518,
					1618508792,
					1610833997,
					3523052358,
					4130873264,
					2001055236,
					3610705100,
					2202168115,
					4028541809,
					2961195399,
					1006657119,
					2006996926,
					3186142756,
					1430667929,
					3210227297,
					1314452623,
					4074634658,
					4101304120,
					2273951170,
					1399257539,
					3367210612,
					3027628629,
					1190975929,
					2062231137,
					2333990788,
					2221543033,
					2438960610,
					1181637006,
					548689776,
					2362791313,
					3372408396,
					3104550113,
					3145860560,
					296247880,
					1970579870,
					3078560182,
					3769228297,
					1714227617,
					3291629107,
					3898220290,
					166772364,
					1251581989,
					493813264,
					448347421,
					195405023,
					2709975567,
					677966185,
					3703036547,
					1463355134,
					2715995803,
					1338867538,
					1343315457,
					2802222074,
					2684532164,
					233230375,
					2599980071,
					2000651841,
					3277868038,
					1638401717,
					4028070440,
					3237316320,
					6314154,
					819756386,
					300326615,
					590932579,
					1405279636,
					3267499572,
					3150704214,
					2428286686,
					3959192993,
					3461946742,
					1862657033,
					1266418056,
					963775037,
					2089974820,
					2263052895,
					1917689273,
					448879540,
					3550394620,
					3981727096,
					150775221,
					3627908307,
					1303187396,
					508620638,
					2975983352,
					2726630617,
					1817252668,
					1876281319,
					1457606340,
					908771278,
					3720792119,
					3617206836,
					2455994898,
					1729034894,
					1080033504
				],
				[
					976866871,
					3556439503,
					2881648439,
					1522871579,
					1555064734,
					1336096578,
					3548522304,
					2579274686,
					3574697629,
					3205460757,
					3593280638,
					3338716283,
					3079412587,
					564236357,
					2993598910,
					1781952180,
					1464380207,
					3163844217,
					3332601554,
					1699332808,
					1393555694,
					1183702653,
					3581086237,
					1288719814,
					691649499,
					2847557200,
					2895455976,
					3193889540,
					2717570544,
					1781354906,
					1676643554,
					2592534050,
					3230253752,
					1126444790,
					2770207658,
					2633158820,
					2210423226,
					2615765581,
					2414155088,
					3127139286,
					673620729,
					2805611233,
					1269405062,
					4015350505,
					3341807571,
					4149409754,
					1057255273,
					2012875353,
					2162469141,
					2276492801,
					2601117357,
					993977747,
					3918593370,
					2654263191,
					753973209,
					36408145,
					2530585658,
					25011837,
					3520020182,
					2088578344,
					530523599,
					2918365339,
					1524020338,
					1518925132,
					3760827505,
					3759777254,
					1202760957,
					3985898139,
					3906192525,
					674977740,
					4174734889,
					2031300136,
					2019492241,
					3983892565,
					4153806404,
					3822280332,
					352677332,
					2297720250,
					60907813,
					90501309,
					3286998549,
					1016092578,
					2535922412,
					2839152426,
					457141659,
					509813237,
					4120667899,
					652014361,
					1966332200,
					2975202805,
					55981186,
					2327461051,
					676427537,
					3255491064,
					2882294119,
					3433927263,
					1307055953,
					942726286,
					933058658,
					2468411793,
					3933900994,
					4215176142,
					1361170020,
					2001714738,
					2830558078,
					3274259782,
					1222529897,
					1679025792,
					2729314320,
					3714953764,
					1770335741,
					151462246,
					3013232138,
					1682292957,
					1483529935,
					471910574,
					1539241949,
					458788160,
					3436315007,
					1807016891,
					3718408830,
					978976581,
					1043663428,
					3165965781,
					1927990952,
					4200891579,
					2372276910,
					3208408903,
					3533431907,
					1412390302,
					2931980059,
					4132332400,
					1947078029,
					3881505623,
					4168226417,
					2941484381,
					1077988104,
					1320477388,
					886195818,
					18198404,
					3786409e3,
					2509781533,
					112762804,
					3463356488,
					1866414978,
					891333506,
					18488651,
					661792760,
					1628790961,
					3885187036,
					3141171499,
					876946877,
					2693282273,
					1372485963,
					791857591,
					2686433993,
					3759982718,
					3167212022,
					3472953795,
					2716379847,
					445679433,
					3561995674,
					3504004811,
					3574258232,
					54117162,
					3331405415,
					2381918588,
					3769707343,
					4154350007,
					1140177722,
					4074052095,
					668550556,
					3214352940,
					367459370,
					261225585,
					2610173221,
					4209349473,
					3468074219,
					3265815641,
					314222801,
					3066103646,
					3808782860,
					282218597,
					3406013506,
					3773591054,
					379116347,
					1285071038,
					846784868,
					2669647154,
					3771962079,
					3550491691,
					2305946142,
					453669953,
					1268987020,
					3317592352,
					3279303384,
					3744833421,
					2610507566,
					3859509063,
					266596637,
					3847019092,
					517658769,
					3462560207,
					3443424879,
					370717030,
					4247526661,
					2224018117,
					4143653529,
					4112773975,
					2788324899,
					2477274417,
					1456262402,
					2901442914,
					1517677493,
					1846949527,
					2295493580,
					3734397586,
					2176403920,
					1280348187,
					1908823572,
					3871786941,
					846861322,
					1172426758,
					3287448474,
					3383383037,
					1655181056,
					3139813346,
					901632758,
					1897031941,
					2986607138,
					3066810236,
					3447102507,
					1393639104,
					373351379,
					950779232,
					625454576,
					3124240540,
					4148612726,
					2007998917,
					544563296,
					2244738638,
					2330496472,
					2058025392,
					1291430526,
					424198748,
					50039436,
					29584100,
					3605783033,
					2429876329,
					2791104160,
					1057563949,
					3255363231,
					3075367218,
					3463963227,
					1469046755,
					985887462
				]
			];
			var BLOWFISH_CTX = {
				pbox: [],
				sbox: []
			};
			function F(ctx, x) {
				let a = x >> 24 & 255;
				let b = x >> 16 & 255;
				let c = x >> 8 & 255;
				let d = x & 255;
				let y = ctx.sbox[0][a] + ctx.sbox[1][b];
				y = y ^ ctx.sbox[2][c];
				y = y + ctx.sbox[3][d];
				return y;
			}
			function BlowFish_Encrypt(ctx, left, right) {
				let Xl = left;
				let Xr = right;
				let temp;
				for (let i = 0; i < N; ++i) {
					Xl = Xl ^ ctx.pbox[i];
					Xr = F(ctx, Xl) ^ Xr;
					temp = Xl;
					Xl = Xr;
					Xr = temp;
				}
				temp = Xl;
				Xl = Xr;
				Xr = temp;
				Xr = Xr ^ ctx.pbox[N];
				Xl = Xl ^ ctx.pbox[17];
				return {
					left: Xl,
					right: Xr
				};
			}
			function BlowFish_Decrypt(ctx, left, right) {
				let Xl = left;
				let Xr = right;
				let temp;
				for (let i = 17; i > 1; --i) {
					Xl = Xl ^ ctx.pbox[i];
					Xr = F(ctx, Xl) ^ Xr;
					temp = Xl;
					Xl = Xr;
					Xr = temp;
				}
				temp = Xl;
				Xl = Xr;
				Xr = temp;
				Xr = Xr ^ ctx.pbox[1];
				Xl = Xl ^ ctx.pbox[0];
				return {
					left: Xl,
					right: Xr
				};
			}
			/**
			* Initialization ctx's pbox and sbox.
			*
			* @param {Object} ctx The object has pbox and sbox.
			* @param {Array} key An array of 32-bit words.
			* @param {int} keysize The length of the key.
			*
			* @example
			*
			*     BlowFishInit(BLOWFISH_CTX, key, 128/32);
			*/
			function BlowFishInit(ctx, key, keysize) {
				for (let Row = 0; Row < 4; Row++) {
					ctx.sbox[Row] = [];
					for (let Col = 0; Col < 256; Col++) ctx.sbox[Row][Col] = ORIG_S[Row][Col];
				}
				let keyIndex = 0;
				for (let index = 0; index < 18; index++) {
					ctx.pbox[index] = ORIG_P[index] ^ key[keyIndex];
					keyIndex++;
					if (keyIndex >= keysize) keyIndex = 0;
				}
				let Data1 = 0;
				let Data2 = 0;
				let res = 0;
				for (let i = 0; i < 18; i += 2) {
					res = BlowFish_Encrypt(ctx, Data1, Data2);
					Data1 = res.left;
					Data2 = res.right;
					ctx.pbox[i] = Data1;
					ctx.pbox[i + 1] = Data2;
				}
				for (let i = 0; i < 4; i++) for (let j = 0; j < 256; j += 2) {
					res = BlowFish_Encrypt(ctx, Data1, Data2);
					Data1 = res.left;
					Data2 = res.right;
					ctx.sbox[i][j] = Data1;
					ctx.sbox[i][j + 1] = Data2;
				}
				return true;
			}
			/**
			* Blowfish block cipher algorithm.
			*/
			var Blowfish = C_algo.Blowfish = BlockCipher.extend({
				_doReset: function() {
					if (this._keyPriorReset === this._key) return;
					var key = this._keyPriorReset = this._key;
					var keyWords = key.words;
					BlowFishInit(BLOWFISH_CTX, keyWords, key.sigBytes / 4);
				},
				encryptBlock: function(M, offset) {
					var res = BlowFish_Encrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
					M[offset] = res.left;
					M[offset + 1] = res.right;
				},
				decryptBlock: function(M, offset) {
					var res = BlowFish_Decrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
					M[offset] = res.left;
					M[offset + 1] = res.right;
				},
				blockSize: 64 / 32,
				keySize: 128 / 32,
				ivSize: 64 / 32
			});
			/**
			* Shortcut functions to the cipher's object interface.
			*
			* @example
			*
			*     var ciphertext = CryptoJS.Blowfish.encrypt(message, key, cfg);
			*     var plaintext  = CryptoJS.Blowfish.decrypt(ciphertext, key, cfg);
			*/
			C.Blowfish = BlockCipher._createHelper(Blowfish);
		})();
		return CryptoJS.Blowfish;
	});
}));
//#endregion
//#region node_modules/crypto-js/index.js
var require_crypto_js = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, factory, undef) {
		if (typeof exports === "object") module.exports = exports = factory(require_core(), require_x64_core(), require_lib_typedarrays(), require_enc_utf16(), require_enc_base64(), require_enc_base64url(), require_md5(), require_sha1(), require_sha256(), require_sha224(), require_sha512(), require_sha384(), require_sha3(), require_ripemd160(), require_hmac(), require_pbkdf2(), require_evpkdf(), require_cipher_core(), require_mode_cfb(), require_mode_ctr(), require_mode_ctr_gladman(), require_mode_ofb(), require_mode_ecb(), require_pad_ansix923(), require_pad_iso10126(), require_pad_iso97971(), require_pad_zeropadding(), require_pad_nopadding(), require_format_hex(), require_aes(), require_tripledes(), require_rc4(), require_rabbit(), require_rabbit_legacy(), require_blowfish());
		else if (typeof define === "function" && define.amd) define([
			"./core",
			"./x64-core",
			"./lib-typedarrays",
			"./enc-utf16",
			"./enc-base64",
			"./enc-base64url",
			"./md5",
			"./sha1",
			"./sha256",
			"./sha224",
			"./sha512",
			"./sha384",
			"./sha3",
			"./ripemd160",
			"./hmac",
			"./pbkdf2",
			"./evpkdf",
			"./cipher-core",
			"./mode-cfb",
			"./mode-ctr",
			"./mode-ctr-gladman",
			"./mode-ofb",
			"./mode-ecb",
			"./pad-ansix923",
			"./pad-iso10126",
			"./pad-iso97971",
			"./pad-zeropadding",
			"./pad-nopadding",
			"./format-hex",
			"./aes",
			"./tripledes",
			"./rc4",
			"./rabbit",
			"./rabbit-legacy",
			"./blowfish"
		], factory);
		else root.CryptoJS = factory(root.CryptoJS);
	})(exports, function(CryptoJS) {
		return CryptoJS;
	});
}));
//#endregion
//#region node_modules/zca-js/node_modules/pako/dist/pako.esm.mjs
var import_cookie = /* @__PURE__ */ __toESM(require_cookie(), 1);
var import_crypto_js = /* @__PURE__ */ __toESM(require_crypto_js(), 1);
/*! pako 2.2.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */
const Z_FIXED$1 = 4;
const Z_BINARY = 0;
const Z_TEXT = 1;
const Z_UNKNOWN$1 = 2;
function zero$1(buf) {
	let len = buf.length;
	while (--len >= 0) buf[len] = 0;
}
const STORED_BLOCK = 0;
const STATIC_TREES = 1;
const DYN_TREES = 2;
const LENGTH_CODES$1 = 29;
const LITERALS$1 = 256;
const L_CODES$1 = 286;
const D_CODES$1 = 30;
const BL_CODES$1 = 19;
const HEAP_SIZE$1 = 573;
const MAX_BITS$1 = 15;
const Buf_size = 16;
const MAX_BL_BITS = 7;
const END_BLOCK = 256;
const REP_3_6 = 16;
const REPZ_3_10 = 17;
const REPZ_11_138 = 18;
const extra_lbits = new Uint8Array([
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	1,
	1,
	1,
	1,
	2,
	2,
	2,
	2,
	3,
	3,
	3,
	3,
	4,
	4,
	4,
	4,
	5,
	5,
	5,
	5,
	0
]);
const extra_dbits = new Uint8Array([
	0,
	0,
	0,
	0,
	1,
	1,
	2,
	2,
	3,
	3,
	4,
	4,
	5,
	5,
	6,
	6,
	7,
	7,
	8,
	8,
	9,
	9,
	10,
	10,
	11,
	11,
	12,
	12,
	13,
	13
]);
const extra_blbits = new Uint8Array([
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	2,
	3,
	7
]);
const bl_order = new Uint8Array([
	16,
	17,
	18,
	0,
	8,
	7,
	9,
	6,
	10,
	5,
	11,
	4,
	12,
	3,
	13,
	2,
	14,
	1,
	15
]);
const DIST_CODE_LEN = 512;
const static_ltree = new Array(288 * 2);
zero$1(static_ltree);
const static_dtree = new Array(D_CODES$1 * 2);
zero$1(static_dtree);
const _dist_code = new Array(DIST_CODE_LEN);
zero$1(_dist_code);
const _length_code = new Array(256);
zero$1(_length_code);
const base_length = new Array(LENGTH_CODES$1);
zero$1(base_length);
const base_dist = new Array(D_CODES$1);
zero$1(base_dist);
function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
	this.static_tree = static_tree;
	this.extra_bits = extra_bits;
	this.extra_base = extra_base;
	this.elems = elems;
	this.max_length = max_length;
	this.has_stree = static_tree && static_tree.length;
}
let static_l_desc;
let static_d_desc;
let static_bl_desc;
function TreeDesc(dyn_tree, stat_desc) {
	this.dyn_tree = dyn_tree;
	this.max_code = 0;
	this.stat_desc = stat_desc;
}
const d_code = (dist) => {
	return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
};
const put_short = (s, w) => {
	s.pending_buf[s.pending++] = w & 255;
	s.pending_buf[s.pending++] = w >>> 8 & 255;
};
const send_bits = (s, value, length) => {
	if (s.bi_valid > Buf_size - length) {
		s.bi_buf |= value << s.bi_valid & 65535;
		put_short(s, s.bi_buf);
		s.bi_buf = value >> Buf_size - s.bi_valid;
		s.bi_valid += length - Buf_size;
	} else {
		s.bi_buf |= value << s.bi_valid & 65535;
		s.bi_valid += length;
	}
};
const send_code = (s, c, tree) => {
	send_bits(s, tree[c * 2], tree[c * 2 + 1]);
};
const bi_reverse = (code, len) => {
	let res = 0;
	do {
		res |= code & 1;
		code >>>= 1;
		res <<= 1;
	} while (--len > 0);
	return res >>> 1;
};
const bi_flush = (s) => {
	if (s.bi_valid === 16) {
		put_short(s, s.bi_buf);
		s.bi_buf = 0;
		s.bi_valid = 0;
	} else if (s.bi_valid >= 8) {
		s.pending_buf[s.pending++] = s.bi_buf & 255;
		s.bi_buf >>= 8;
		s.bi_valid -= 8;
	}
};
const gen_bitlen = (s, desc) => {
	const tree = desc.dyn_tree;
	const max_code = desc.max_code;
	const stree = desc.stat_desc.static_tree;
	const has_stree = desc.stat_desc.has_stree;
	const extra = desc.stat_desc.extra_bits;
	const base = desc.stat_desc.extra_base;
	const max_length = desc.stat_desc.max_length;
	let h;
	let n, m;
	let bits;
	let xbits;
	let f;
	let overflow = 0;
	for (bits = 0; bits <= MAX_BITS$1; bits++) s.bl_count[bits] = 0;
	tree[s.heap[s.heap_max] * 2 + 1] = 0;
	for (h = s.heap_max + 1; h < HEAP_SIZE$1; h++) {
		n = s.heap[h];
		bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
		if (bits > max_length) {
			bits = max_length;
			overflow++;
		}
		tree[n * 2 + 1] = bits;
		if (n > max_code) continue;
		s.bl_count[bits]++;
		xbits = 0;
		if (n >= base) xbits = extra[n - base];
		f = tree[n * 2];
		s.opt_len += f * (bits + xbits);
		if (has_stree) s.static_len += f * (stree[n * 2 + 1] + xbits);
	}
	if (overflow === 0) return;
	do {
		bits = max_length - 1;
		while (s.bl_count[bits] === 0) bits--;
		s.bl_count[bits]--;
		s.bl_count[bits + 1] += 2;
		s.bl_count[max_length]--;
		overflow -= 2;
	} while (overflow > 0);
	for (bits = max_length; bits !== 0; bits--) {
		n = s.bl_count[bits];
		while (n !== 0) {
			m = s.heap[--h];
			if (m > max_code) continue;
			if (tree[m * 2 + 1] !== bits) {
				s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
				tree[m * 2 + 1] = bits;
			}
			n--;
		}
	}
};
const gen_codes = (tree, max_code, bl_count) => {
	const next_code = new Array(16);
	let code = 0;
	let bits;
	let n;
	for (bits = 1; bits <= MAX_BITS$1; bits++) {
		code = code + bl_count[bits - 1] << 1;
		next_code[bits] = code;
	}
	for (n = 0; n <= max_code; n++) {
		let len = tree[n * 2 + 1];
		if (len === 0) continue;
		tree[n * 2] = bi_reverse(next_code[len]++, len);
	}
};
const tr_static_init = () => {
	let n;
	let bits;
	let length;
	let code;
	let dist;
	const bl_count = new Array(16);
	length = 0;
	for (code = 0; code < LENGTH_CODES$1 - 1; code++) {
		base_length[code] = length;
		for (n = 0; n < 1 << extra_lbits[code]; n++) _length_code[length++] = code;
	}
	_length_code[length - 1] = code;
	dist = 0;
	for (code = 0; code < 16; code++) {
		base_dist[code] = dist;
		for (n = 0; n < 1 << extra_dbits[code]; n++) _dist_code[dist++] = code;
	}
	dist >>= 7;
	for (; code < D_CODES$1; code++) {
		base_dist[code] = dist << 7;
		for (n = 0; n < 1 << extra_dbits[code] - 7; n++) _dist_code[256 + dist++] = code;
	}
	for (bits = 0; bits <= MAX_BITS$1; bits++) bl_count[bits] = 0;
	n = 0;
	while (n <= 143) {
		static_ltree[n * 2 + 1] = 8;
		n++;
		bl_count[8]++;
	}
	while (n <= 255) {
		static_ltree[n * 2 + 1] = 9;
		n++;
		bl_count[9]++;
	}
	while (n <= 279) {
		static_ltree[n * 2 + 1] = 7;
		n++;
		bl_count[7]++;
	}
	while (n <= 287) {
		static_ltree[n * 2 + 1] = 8;
		n++;
		bl_count[8]++;
	}
	gen_codes(static_ltree, 287, bl_count);
	for (n = 0; n < D_CODES$1; n++) {
		static_dtree[n * 2 + 1] = 5;
		static_dtree[n * 2] = bi_reverse(n, 5);
	}
	static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, 257, L_CODES$1, MAX_BITS$1);
	static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES$1, MAX_BITS$1);
	static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES$1, MAX_BL_BITS);
};
const init_block = (s) => {
	let n;
	for (n = 0; n < L_CODES$1; n++) s.dyn_ltree[n * 2] = 0;
	for (n = 0; n < D_CODES$1; n++) s.dyn_dtree[n * 2] = 0;
	for (n = 0; n < BL_CODES$1; n++) s.bl_tree[n * 2] = 0;
	s.dyn_ltree[END_BLOCK * 2] = 1;
	s.opt_len = s.static_len = 0;
	s.sym_next = s.matches = 0;
};
const bi_windup = (s) => {
	if (s.bi_valid > 8) put_short(s, s.bi_buf);
	else if (s.bi_valid > 0) s.pending_buf[s.pending++] = s.bi_buf;
	s.bi_buf = 0;
	s.bi_valid = 0;
};
const smaller = (tree, n, m, depth) => {
	const _n2 = n * 2;
	const _m2 = m * 2;
	return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
};
const pqdownheap = (s, tree, k) => {
	const v = s.heap[k];
	let j = k << 1;
	while (j <= s.heap_len) {
		if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) j++;
		if (smaller(tree, v, s.heap[j], s.depth)) break;
		s.heap[k] = s.heap[j];
		k = j;
		j <<= 1;
	}
	s.heap[k] = v;
};
const compress_block = (s, ltree, dtree) => {
	let dist;
	let lc;
	let sx = 0;
	let code;
	let extra;
	if (s.sym_next !== 0) do {
		dist = s.pending_buf[s.sym_buf + sx++] & 255;
		dist += (s.pending_buf[s.sym_buf + sx++] & 255) << 8;
		lc = s.pending_buf[s.sym_buf + sx++];
		if (dist === 0) send_code(s, lc, ltree);
		else {
			code = _length_code[lc];
			send_code(s, code + LITERALS$1 + 1, ltree);
			extra = extra_lbits[code];
			if (extra !== 0) {
				lc -= base_length[code];
				send_bits(s, lc, extra);
			}
			dist--;
			code = d_code(dist);
			send_code(s, code, dtree);
			extra = extra_dbits[code];
			if (extra !== 0) {
				dist -= base_dist[code];
				send_bits(s, dist, extra);
			}
		}
	} while (sx < s.sym_next);
	send_code(s, END_BLOCK, ltree);
};
const build_tree = (s, desc) => {
	const tree = desc.dyn_tree;
	const stree = desc.stat_desc.static_tree;
	const has_stree = desc.stat_desc.has_stree;
	const elems = desc.stat_desc.elems;
	let n, m;
	let max_code = -1;
	let node;
	s.heap_len = 0;
	s.heap_max = HEAP_SIZE$1;
	for (n = 0; n < elems; n++) if (tree[n * 2] !== 0) {
		s.heap[++s.heap_len] = max_code = n;
		s.depth[n] = 0;
	} else tree[n * 2 + 1] = 0;
	while (s.heap_len < 2) {
		node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
		tree[node * 2] = 1;
		s.depth[node] = 0;
		s.opt_len--;
		if (has_stree) s.static_len -= stree[node * 2 + 1];
	}
	desc.max_code = max_code;
	for (n = s.heap_len >> 1; n >= 1; n--) pqdownheap(s, tree, n);
	node = elems;
	do {
		/*** pqremove ***/
		n = s.heap[1];
		s.heap[1] = s.heap[s.heap_len--];
		pqdownheap(s, tree, 1);
		m = s.heap[1];
		s.heap[--s.heap_max] = n;
		s.heap[--s.heap_max] = m;
		tree[node * 2] = tree[n * 2] + tree[m * 2];
		s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
		tree[n * 2 + 1] = tree[m * 2 + 1] = node;
		s.heap[1] = node++;
		pqdownheap(s, tree, 1);
	} while (s.heap_len >= 2);
	s.heap[--s.heap_max] = s.heap[1];
	gen_bitlen(s, desc);
	gen_codes(tree, max_code, s.bl_count);
};
const scan_tree = (s, tree, max_code) => {
	let n;
	let prevlen = -1;
	let curlen;
	let nextlen = tree[1];
	let count = 0;
	let max_count = 7;
	let min_count = 4;
	if (nextlen === 0) {
		max_count = 138;
		min_count = 3;
	}
	tree[(max_code + 1) * 2 + 1] = 65535;
	for (n = 0; n <= max_code; n++) {
		curlen = nextlen;
		nextlen = tree[(n + 1) * 2 + 1];
		if (++count < max_count && curlen === nextlen) continue;
		else if (count < min_count) s.bl_tree[curlen * 2] += count;
		else if (curlen !== 0) {
			if (curlen !== prevlen) s.bl_tree[curlen * 2]++;
			s.bl_tree[REP_3_6 * 2]++;
		} else if (count <= 10) s.bl_tree[REPZ_3_10 * 2]++;
		else s.bl_tree[REPZ_11_138 * 2]++;
		count = 0;
		prevlen = curlen;
		if (nextlen === 0) {
			max_count = 138;
			min_count = 3;
		} else if (curlen === nextlen) {
			max_count = 6;
			min_count = 3;
		} else {
			max_count = 7;
			min_count = 4;
		}
	}
};
const send_tree = (s, tree, max_code) => {
	let n;
	let prevlen = -1;
	let curlen;
	let nextlen = tree[1];
	let count = 0;
	let max_count = 7;
	let min_count = 4;
	if (nextlen === 0) {
		max_count = 138;
		min_count = 3;
	}
	for (n = 0; n <= max_code; n++) {
		curlen = nextlen;
		nextlen = tree[(n + 1) * 2 + 1];
		if (++count < max_count && curlen === nextlen) continue;
		else if (count < min_count) do
			send_code(s, curlen, s.bl_tree);
		while (--count !== 0);
		else if (curlen !== 0) {
			if (curlen !== prevlen) {
				send_code(s, curlen, s.bl_tree);
				count--;
			}
			send_code(s, REP_3_6, s.bl_tree);
			send_bits(s, count - 3, 2);
		} else if (count <= 10) {
			send_code(s, REPZ_3_10, s.bl_tree);
			send_bits(s, count - 3, 3);
		} else {
			send_code(s, REPZ_11_138, s.bl_tree);
			send_bits(s, count - 11, 7);
		}
		count = 0;
		prevlen = curlen;
		if (nextlen === 0) {
			max_count = 138;
			min_count = 3;
		} else if (curlen === nextlen) {
			max_count = 6;
			min_count = 3;
		} else {
			max_count = 7;
			min_count = 4;
		}
	}
};
const build_bl_tree = (s) => {
	let max_blindex;
	scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
	scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
	build_tree(s, s.bl_desc);
	for (max_blindex = BL_CODES$1 - 1; max_blindex >= 3; max_blindex--) if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) break;
	s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
	return max_blindex;
};
const send_all_trees = (s, lcodes, dcodes, blcodes) => {
	let rank;
	send_bits(s, lcodes - 257, 5);
	send_bits(s, dcodes - 1, 5);
	send_bits(s, blcodes - 4, 4);
	for (rank = 0; rank < blcodes; rank++) send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1], 3);
	send_tree(s, s.dyn_ltree, lcodes - 1);
	send_tree(s, s.dyn_dtree, dcodes - 1);
};
const detect_data_type = (s) => {
	let block_mask = 4093624447;
	let n;
	for (n = 0; n <= 31; n++, block_mask >>>= 1) if (block_mask & 1 && s.dyn_ltree[n * 2] !== 0) return Z_BINARY;
	if (s.dyn_ltree[18] !== 0 || s.dyn_ltree[20] !== 0 || s.dyn_ltree[26] !== 0) return Z_TEXT;
	for (n = 32; n < LITERALS$1; n++) if (s.dyn_ltree[n * 2] !== 0) return Z_TEXT;
	return Z_BINARY;
};
let static_init_done = false;
const _tr_init$1 = (s) => {
	if (!static_init_done) {
		tr_static_init();
		static_init_done = true;
	}
	s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
	s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
	s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
	s.bi_buf = 0;
	s.bi_valid = 0;
	init_block(s);
};
const _tr_stored_block$1 = (s, buf, stored_len, last) => {
	send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
	bi_windup(s);
	put_short(s, stored_len);
	put_short(s, ~stored_len);
	if (stored_len) s.pending_buf.set(s.window.subarray(buf, buf + stored_len), s.pending);
	s.pending += stored_len;
};
const _tr_align$1 = (s) => {
	send_bits(s, STATIC_TREES << 1, 3);
	send_code(s, END_BLOCK, static_ltree);
	bi_flush(s);
};
const _tr_flush_block$1 = (s, buf, stored_len, last) => {
	let opt_lenb, static_lenb;
	let max_blindex = 0;
	if (s.level > 0) {
		if (s.strm.data_type === Z_UNKNOWN$1) s.strm.data_type = detect_data_type(s);
		build_tree(s, s.l_desc);
		build_tree(s, s.d_desc);
		max_blindex = build_bl_tree(s);
		opt_lenb = s.opt_len + 3 + 7 >>> 3;
		static_lenb = s.static_len + 3 + 7 >>> 3;
		if (static_lenb <= opt_lenb) opt_lenb = static_lenb;
	} else opt_lenb = static_lenb = stored_len + 5;
	if (stored_len + 4 <= opt_lenb && buf !== -1) _tr_stored_block$1(s, buf, stored_len, last);
	else if (s.strategy === Z_FIXED$1 || static_lenb === opt_lenb) {
		send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
		compress_block(s, static_ltree, static_dtree);
	} else {
		send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
		send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
		compress_block(s, s.dyn_ltree, s.dyn_dtree);
	}
	init_block(s);
	if (last) bi_windup(s);
};
const _tr_tally$1 = (s, dist, lc) => {
	s.pending_buf[s.sym_buf + s.sym_next++] = dist;
	s.pending_buf[s.sym_buf + s.sym_next++] = dist >> 8;
	s.pending_buf[s.sym_buf + s.sym_next++] = lc;
	if (dist === 0) s.dyn_ltree[lc * 2]++;
	else {
		s.matches++;
		dist--;
		s.dyn_ltree[(_length_code[lc] + LITERALS$1 + 1) * 2]++;
		s.dyn_dtree[d_code(dist) * 2]++;
	}
	return s.sym_next === s.sym_end;
};
var trees = {
	_tr_init: _tr_init$1,
	_tr_stored_block: _tr_stored_block$1,
	_tr_flush_block: _tr_flush_block$1,
	_tr_tally: _tr_tally$1,
	_tr_align: _tr_align$1
};
const adler32 = (adler, buf, len, pos) => {
	let s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
	while (len !== 0) {
		n = len > 2e3 ? 2e3 : len;
		len -= n;
		do {
			s1 = s1 + buf[pos++] | 0;
			s2 = s2 + s1 | 0;
		} while (--n);
		s1 %= 65521;
		s2 %= 65521;
	}
	return s1 | s2 << 16 | 0;
};
var adler32_1 = adler32;
const makeTable = () => {
	let c, table = [];
	for (var n = 0; n < 256; n++) {
		c = n;
		for (var k = 0; k < 8; k++) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
		table[n] = c;
	}
	return table;
};
const crcTable = new Uint32Array(makeTable());
const crc32 = (crc, buf, len, pos) => {
	const t = crcTable;
	const end = pos + len;
	crc ^= -1;
	for (let i = pos; i < end; i++) crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
	return crc ^ -1;
};
var crc32_1 = crc32;
var messages = {
	2: "need dictionary",
	1: "stream end",
	0: "",
	"-1": "file error",
	"-2": "stream error",
	"-3": "data error",
	"-4": "insufficient memory",
	"-5": "buffer error",
	"-6": "incompatible version"
};
var constants$2 = {
	Z_NO_FLUSH: 0,
	Z_PARTIAL_FLUSH: 1,
	Z_SYNC_FLUSH: 2,
	Z_FULL_FLUSH: 3,
	Z_FINISH: 4,
	Z_BLOCK: 5,
	Z_TREES: 6,
	Z_OK: 0,
	Z_STREAM_END: 1,
	Z_NEED_DICT: 2,
	Z_ERRNO: -1,
	Z_STREAM_ERROR: -2,
	Z_DATA_ERROR: -3,
	Z_MEM_ERROR: -4,
	Z_BUF_ERROR: -5,
	Z_NO_COMPRESSION: 0,
	Z_BEST_SPEED: 1,
	Z_BEST_COMPRESSION: 9,
	Z_DEFAULT_COMPRESSION: -1,
	Z_FILTERED: 1,
	Z_HUFFMAN_ONLY: 2,
	Z_RLE: 3,
	Z_FIXED: 4,
	Z_DEFAULT_STRATEGY: 0,
	Z_BINARY: 0,
	Z_TEXT: 1,
	Z_UNKNOWN: 2,
	Z_DEFLATED: 8
};
const { _tr_init, _tr_stored_block, _tr_flush_block, _tr_tally, _tr_align } = trees;
const { Z_NO_FLUSH: Z_NO_FLUSH$2, Z_PARTIAL_FLUSH, Z_FULL_FLUSH: Z_FULL_FLUSH$1, Z_FINISH: Z_FINISH$3, Z_BLOCK: Z_BLOCK$1, Z_OK: Z_OK$3, Z_STREAM_END: Z_STREAM_END$3, Z_STREAM_ERROR: Z_STREAM_ERROR$2, Z_DATA_ERROR: Z_DATA_ERROR$2, Z_BUF_ERROR: Z_BUF_ERROR$2, Z_DEFAULT_COMPRESSION: Z_DEFAULT_COMPRESSION$1, Z_FILTERED, Z_HUFFMAN_ONLY, Z_RLE, Z_FIXED, Z_DEFAULT_STRATEGY: Z_DEFAULT_STRATEGY$1, Z_UNKNOWN, Z_DEFLATED: Z_DEFLATED$2 } = constants$2;
const MAX_MEM_LEVEL = 9;
const MAX_WBITS$1 = 15;
const DEF_MEM_LEVEL = 8;
const HEAP_SIZE = 573;
const MIN_MATCH = 3;
const MAX_MATCH = 258;
const MIN_LOOKAHEAD = 262;
const PRESET_DICT = 32;
const INIT_STATE = 42;
const GZIP_STATE = 57;
const EXTRA_STATE = 69;
const NAME_STATE = 73;
const COMMENT_STATE = 91;
const HCRC_STATE = 103;
const BUSY_STATE = 113;
const FINISH_STATE = 666;
const BS_NEED_MORE = 1;
const BS_BLOCK_DONE = 2;
const BS_FINISH_STARTED = 3;
const BS_FINISH_DONE = 4;
const OS_CODE = 3;
const err = (strm, errorCode) => {
	strm.msg = messages[errorCode];
	return errorCode;
};
const rank = (f) => {
	return f * 2 - (f > 4 ? 9 : 0);
};
const zero = (buf) => {
	let len = buf.length;
	while (--len >= 0) buf[len] = 0;
};
const slide_hash = (s) => {
	let n, m;
	let p;
	let wsize = s.w_size;
	n = s.hash_size;
	p = n;
	do {
		m = s.head[--p];
		s.head[p] = m >= wsize ? m - wsize : 0;
	} while (--n);
	n = wsize;
	p = n;
	do {
		m = s.prev[--p];
		s.prev[p] = m >= wsize ? m - wsize : 0;
	} while (--n);
};
let HASH = (s, prev, data) => (prev << s.hash_shift ^ data) & s.hash_mask;
const INSERT_STRING = (s, str) => {
	let h;
	if (s.legacy_hash) h = s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);
	else {
		const w = s.window;
		const value = w[str] | w[str + 1] << 8 | w[str + 2] << 16 | w[str + 3] << 24;
		h = s.ins_h = Math.imul(value, 66521) + 66521 >>> 16 & s.hash_mask;
	}
	const hash_head = s.prev[str & s.w_mask] = s.head[h];
	s.head[h] = str;
	return hash_head;
};
const flush_pending = (strm) => {
	const s = strm.state;
	let len = s.pending;
	if (len > strm.avail_out) len = strm.avail_out;
	if (len === 0) return;
	strm.output.set(s.pending_buf.subarray(s.pending_out, s.pending_out + len), strm.next_out);
	strm.next_out += len;
	s.pending_out += len;
	strm.total_out += len;
	strm.avail_out -= len;
	s.pending -= len;
	if (s.pending === 0) s.pending_out = 0;
};
const flush_block_only = (s, last) => {
	_tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
	s.block_start = s.strstart;
	flush_pending(s.strm);
};
const put_byte = (s, b) => {
	s.pending_buf[s.pending++] = b;
};
const putShortMSB = (s, b) => {
	s.pending_buf[s.pending++] = b >>> 8 & 255;
	s.pending_buf[s.pending++] = b & 255;
};
const read_buf = (strm, buf, start, size) => {
	let len = strm.avail_in;
	if (len > size) len = size;
	if (len === 0) return 0;
	strm.avail_in -= len;
	buf.set(strm.input.subarray(strm.next_in, strm.next_in + len), start);
	if (strm.state.wrap === 1) strm.adler = adler32_1(strm.adler, buf, len, start);
	else if (strm.state.wrap === 2) strm.adler = crc32_1(strm.adler, buf, len, start);
	strm.next_in += len;
	strm.total_in += len;
	return len;
};
const longest_match = (s, cur_match) => {
	let chain_length = s.max_chain_length;
	let scan = s.strstart;
	let match;
	let len;
	let best_len = s.prev_length;
	let nice_match = s.nice_match;
	const limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
	const _win = s.window;
	const wmask = s.w_mask;
	const prev = s.prev;
	const strend = s.strstart + MAX_MATCH;
	let scan_end1 = _win[scan + best_len - 1];
	let scan_end = _win[scan + best_len];
	if (s.prev_length >= s.good_match) chain_length >>= 2;
	if (nice_match > s.lookahead) nice_match = s.lookahead;
	do {
		match = cur_match;
		if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) continue;
		scan += 2;
		match++;
		do		;
while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
		len = MAX_MATCH - (strend - scan);
		scan = strend - MAX_MATCH;
		if (len > best_len) {
			s.match_start = cur_match;
			best_len = len;
			if (len >= nice_match) break;
			scan_end1 = _win[scan + best_len - 1];
			scan_end = _win[scan + best_len];
		}
	} while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
	if (best_len <= s.lookahead) return best_len;
	return s.lookahead;
};
const fill_window = (s) => {
	const _w_size = s.w_size;
	let n, more, str;
	do {
		more = s.window_size - s.lookahead - s.strstart;
		if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
			s.window.set(s.window.subarray(_w_size, _w_size + _w_size - more), 0);
			s.match_start -= _w_size;
			s.strstart -= _w_size;
			s.block_start -= _w_size;
			if (s.insert > s.strstart) s.insert = s.strstart;
			slide_hash(s);
			more += _w_size;
		}
		if (s.strm.avail_in === 0) break;
		n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
		s.lookahead += n;
		if (!s.legacy_hash) {
			if (s.lookahead + s.insert > MIN_MATCH) {
				str = s.strstart - s.insert;
				while (s.insert) {
					INSERT_STRING(s, str);
					str++;
					s.insert--;
					if (s.lookahead + s.insert <= MIN_MATCH) break;
				}
			}
		} else if (s.lookahead + s.insert >= MIN_MATCH) {
			str = s.strstart - s.insert;
			s.ins_h = s.window[str];
			s.ins_h = HASH(s, s.ins_h, s.window[str + 1]);
			while (s.insert) {
				INSERT_STRING(s, str);
				str++;
				s.insert--;
				if (s.lookahead + s.insert < MIN_MATCH) break;
			}
		}
	} while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
};
const deflate_stored = (s, flush) => {
	let min_block = s.pending_buf_size - 5 > s.w_size ? s.w_size : s.pending_buf_size - 5;
	let len, left, have, last = 0;
	let used = s.strm.avail_in;
	do {
		len = 65535;
		have = s.bi_valid + 42 >> 3;
		if (s.strm.avail_out < have) break;
		have = s.strm.avail_out - have;
		left = s.strstart - s.block_start;
		if (len > left + s.strm.avail_in) len = left + s.strm.avail_in;
		if (len > have) len = have;
		if (len < min_block && (len === 0 && flush !== Z_FINISH$3 || flush === Z_NO_FLUSH$2 || len !== left + s.strm.avail_in)) break;
		last = flush === Z_FINISH$3 && len === left + s.strm.avail_in ? 1 : 0;
		_tr_stored_block(s, 0, 0, last);
		s.pending_buf[s.pending - 4] = len;
		s.pending_buf[s.pending - 3] = len >> 8;
		s.pending_buf[s.pending - 2] = ~len;
		s.pending_buf[s.pending - 1] = ~len >> 8;
		flush_pending(s.strm);
		if (left) {
			if (left > len) left = len;
			s.strm.output.set(s.window.subarray(s.block_start, s.block_start + left), s.strm.next_out);
			s.strm.next_out += left;
			s.strm.avail_out -= left;
			s.strm.total_out += left;
			s.block_start += left;
			len -= left;
		}
		if (len) {
			read_buf(s.strm, s.strm.output, s.strm.next_out, len);
			s.strm.next_out += len;
			s.strm.avail_out -= len;
			s.strm.total_out += len;
		}
	} while (last === 0);
	used -= s.strm.avail_in;
	if (used) {
		if (used >= s.w_size) {
			s.matches = 2;
			s.window.set(s.strm.input.subarray(s.strm.next_in - s.w_size, s.strm.next_in), 0);
			s.strstart = s.w_size;
			s.insert = s.strstart;
		} else {
			if (s.window_size - s.strstart <= used) {
				s.strstart -= s.w_size;
				s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
				if (s.matches < 2) s.matches++;
				if (s.insert > s.strstart) s.insert = s.strstart;
			}
			s.window.set(s.strm.input.subarray(s.strm.next_in - used, s.strm.next_in), s.strstart);
			s.strstart += used;
			s.insert += used > s.w_size - s.insert ? s.w_size - s.insert : used;
		}
		s.block_start = s.strstart;
	}
	if (s.high_water < s.strstart) s.high_water = s.strstart;
	if (last) return BS_FINISH_DONE;
	if (flush !== Z_NO_FLUSH$2 && flush !== Z_FINISH$3 && s.strm.avail_in === 0 && s.strstart === s.block_start) return BS_BLOCK_DONE;
	have = s.window_size - s.strstart;
	if (s.strm.avail_in > have && s.block_start >= s.w_size) {
		s.block_start -= s.w_size;
		s.strstart -= s.w_size;
		s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
		if (s.matches < 2) s.matches++;
		have += s.w_size;
		if (s.insert > s.strstart) s.insert = s.strstart;
	}
	if (have > s.strm.avail_in) have = s.strm.avail_in;
	if (have) {
		read_buf(s.strm, s.window, s.strstart, have);
		s.strstart += have;
		s.insert += have > s.w_size - s.insert ? s.w_size - s.insert : have;
	}
	if (s.high_water < s.strstart) s.high_water = s.strstart;
	have = s.bi_valid + 42 >> 3;
	have = s.pending_buf_size - have > 65535 ? 65535 : s.pending_buf_size - have;
	min_block = have > s.w_size ? s.w_size : have;
	left = s.strstart - s.block_start;
	if (left >= min_block || (left || flush === Z_FINISH$3) && flush !== Z_NO_FLUSH$2 && s.strm.avail_in === 0 && left <= have) {
		len = left > have ? have : left;
		last = flush === Z_FINISH$3 && s.strm.avail_in === 0 && len === left ? 1 : 0;
		_tr_stored_block(s, s.block_start, len, last);
		s.block_start += len;
		flush_pending(s.strm);
	}
	return last ? BS_FINISH_STARTED : BS_NEED_MORE;
};
const deflate_fast = (s, flush) => {
	let hash_head;
	let bflush;
	for (;;) {
		if (s.lookahead < MIN_LOOKAHEAD) {
			fill_window(s);
			if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) return BS_NEED_MORE;
			if (s.lookahead === 0) break;
		}
		hash_head = 0;
		if (s.lookahead >= MIN_MATCH) hash_head = INSERT_STRING(s, s.strstart);
		if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) s.match_length = longest_match(s, hash_head);
		if (s.match_length >= MIN_MATCH) {
			/*** _tr_tally_dist(s, s.strstart - s.match_start,
			s.match_length - MIN_MATCH, bflush); ***/
			bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
			s.lookahead -= s.match_length;
			if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
				s.match_length--;
				do {
					s.strstart++;
					hash_head = INSERT_STRING(s, s.strstart);
				} while (--s.match_length !== 0);
				s.strstart++;
			} else {
				s.strstart += s.match_length;
				s.match_length = 0;
				if (s.legacy_hash) {
					s.ins_h = s.window[s.strstart];
					s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]);
				}
			}
		} else {
			/*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
			bflush = _tr_tally(s, 0, s.window[s.strstart]);
			s.lookahead--;
			s.strstart++;
		}
		if (bflush) {
			/*** FLUSH_BLOCK(s, 0); ***/
			flush_block_only(s, false);
			if (s.strm.avail_out === 0) return BS_NEED_MORE;
		}
	}
	s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
	if (flush === Z_FINISH$3) {
		/*** FLUSH_BLOCK(s, 1); ***/
		flush_block_only(s, true);
		if (s.strm.avail_out === 0) return BS_FINISH_STARTED;
		return BS_FINISH_DONE;
	}
	if (s.sym_next) {
		/*** FLUSH_BLOCK(s, 0); ***/
		flush_block_only(s, false);
		if (s.strm.avail_out === 0) return BS_NEED_MORE;
	}
	return BS_BLOCK_DONE;
};
const deflate_slow = (s, flush) => {
	let hash_head;
	let bflush;
	let max_insert;
	for (;;) {
		if (s.lookahead < MIN_LOOKAHEAD) {
			fill_window(s);
			if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) return BS_NEED_MORE;
			if (s.lookahead === 0) break;
		}
		hash_head = 0;
		if (s.lookahead >= MIN_MATCH) hash_head = INSERT_STRING(s, s.strstart);
		s.prev_length = s.match_length;
		s.prev_match = s.match_start;
		s.match_length = MIN_MATCH - 1;
		if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
			s.match_length = longest_match(s, hash_head);
			if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)) s.match_length = MIN_MATCH - 1;
		}
		if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
			max_insert = s.strstart + s.lookahead - MIN_MATCH;
			/***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
			s.prev_length - MIN_MATCH, bflush);***/
			bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
			s.lookahead -= s.prev_length - 1;
			s.prev_length -= 2;
			do
				if (++s.strstart <= max_insert) hash_head = INSERT_STRING(s, s.strstart);
			while (--s.prev_length !== 0);
			s.match_available = 0;
			s.match_length = MIN_MATCH - 1;
			s.strstart++;
			if (bflush) {
				/*** FLUSH_BLOCK(s, 0); ***/
				flush_block_only(s, false);
				if (s.strm.avail_out === 0) return BS_NEED_MORE;
			}
		} else if (s.match_available) {
			/*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
			bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
			if (bflush)
 /*** FLUSH_BLOCK_ONLY(s, 0) ***/
			flush_block_only(s, false);
			s.strstart++;
			s.lookahead--;
			if (s.strm.avail_out === 0) return BS_NEED_MORE;
		} else {
			s.match_available = 1;
			s.strstart++;
			s.lookahead--;
		}
	}
	if (s.match_available) {
		/*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
		bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
		s.match_available = 0;
	}
	s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
	if (flush === Z_FINISH$3) {
		/*** FLUSH_BLOCK(s, 1); ***/
		flush_block_only(s, true);
		if (s.strm.avail_out === 0) return BS_FINISH_STARTED;
		return BS_FINISH_DONE;
	}
	if (s.sym_next) {
		/*** FLUSH_BLOCK(s, 0); ***/
		flush_block_only(s, false);
		if (s.strm.avail_out === 0) return BS_NEED_MORE;
	}
	return BS_BLOCK_DONE;
};
const deflate_rle = (s, flush) => {
	let bflush;
	let prev;
	let scan, strend;
	const _win = s.window;
	for (;;) {
		if (s.lookahead <= MAX_MATCH) {
			fill_window(s);
			if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH$2) return BS_NEED_MORE;
			if (s.lookahead === 0) break;
		}
		s.match_length = 0;
		if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
			scan = s.strstart - 1;
			prev = _win[scan];
			if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
				strend = s.strstart + MAX_MATCH;
				do				;
while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
				s.match_length = MAX_MATCH - (strend - scan);
				if (s.match_length > s.lookahead) s.match_length = s.lookahead;
			}
		}
		if (s.match_length >= MIN_MATCH) {
			/*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
			bflush = _tr_tally(s, 1, s.match_length - MIN_MATCH);
			s.lookahead -= s.match_length;
			s.strstart += s.match_length;
			s.match_length = 0;
		} else {
			/*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
			bflush = _tr_tally(s, 0, s.window[s.strstart]);
			s.lookahead--;
			s.strstart++;
		}
		if (bflush) {
			/*** FLUSH_BLOCK(s, 0); ***/
			flush_block_only(s, false);
			if (s.strm.avail_out === 0) return BS_NEED_MORE;
		}
	}
	s.insert = 0;
	if (flush === Z_FINISH$3) {
		/*** FLUSH_BLOCK(s, 1); ***/
		flush_block_only(s, true);
		if (s.strm.avail_out === 0) return BS_FINISH_STARTED;
		return BS_FINISH_DONE;
	}
	if (s.sym_next) {
		/*** FLUSH_BLOCK(s, 0); ***/
		flush_block_only(s, false);
		if (s.strm.avail_out === 0) return BS_NEED_MORE;
	}
	return BS_BLOCK_DONE;
};
const deflate_huff = (s, flush) => {
	let bflush;
	for (;;) {
		if (s.lookahead === 0) {
			fill_window(s);
			if (s.lookahead === 0) {
				if (flush === Z_NO_FLUSH$2) return BS_NEED_MORE;
				break;
			}
		}
		s.match_length = 0;
		/*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
		bflush = _tr_tally(s, 0, s.window[s.strstart]);
		s.lookahead--;
		s.strstart++;
		if (bflush) {
			/*** FLUSH_BLOCK(s, 0); ***/
			flush_block_only(s, false);
			if (s.strm.avail_out === 0) return BS_NEED_MORE;
		}
	}
	s.insert = 0;
	if (flush === Z_FINISH$3) {
		/*** FLUSH_BLOCK(s, 1); ***/
		flush_block_only(s, true);
		if (s.strm.avail_out === 0) return BS_FINISH_STARTED;
		return BS_FINISH_DONE;
	}
	if (s.sym_next) {
		/*** FLUSH_BLOCK(s, 0); ***/
		flush_block_only(s, false);
		if (s.strm.avail_out === 0) return BS_NEED_MORE;
	}
	return BS_BLOCK_DONE;
};
function Config(good_length, max_lazy, nice_length, max_chain, func) {
	this.good_length = good_length;
	this.max_lazy = max_lazy;
	this.nice_length = nice_length;
	this.max_chain = max_chain;
	this.func = func;
}
const configuration_table = [
	new Config(0, 0, 0, 0, deflate_stored),
	new Config(4, 4, 8, 4, deflate_fast),
	new Config(4, 5, 16, 8, deflate_fast),
	new Config(4, 6, 32, 32, deflate_fast),
	new Config(4, 4, 16, 16, deflate_slow),
	new Config(8, 16, 32, 32, deflate_slow),
	new Config(8, 16, 128, 128, deflate_slow),
	new Config(8, 32, 128, 256, deflate_slow),
	new Config(32, 128, 258, 1024, deflate_slow),
	new Config(32, 258, 258, 4096, deflate_slow)
];
const lm_init = (s) => {
	s.window_size = 2 * s.w_size;
	/*** CLEAR_HASH(s); ***/
	zero(s.head);
	s.max_lazy_match = configuration_table[s.level].max_lazy;
	s.good_match = configuration_table[s.level].good_length;
	s.nice_match = configuration_table[s.level].nice_length;
	s.max_chain_length = configuration_table[s.level].max_chain;
	s.strstart = 0;
	s.block_start = 0;
	s.lookahead = 0;
	s.insert = 0;
	s.match_length = s.prev_length = MIN_MATCH - 1;
	s.match_available = 0;
	s.ins_h = 0;
};
function DeflateState() {
	this.strm = null;
	this.status = 0;
	this.pending_buf = null;
	this.pending_buf_size = 0;
	this.pending_out = 0;
	this.pending = 0;
	this.wrap = 0;
	this.gzhead = null;
	this.gzindex = 0;
	this.method = Z_DEFLATED$2;
	this.last_flush = -1;
	this.w_size = 0;
	this.w_bits = 0;
	this.w_mask = 0;
	this.window = null;
	this.window_size = 0;
	this.prev = null;
	this.head = null;
	this.ins_h = 0;
	this.legacy_hash = 0;
	this.hash_size = 0;
	this.hash_bits = 0;
	this.hash_mask = 0;
	this.hash_shift = 0;
	this.block_start = 0;
	this.match_length = 0;
	this.prev_match = 0;
	this.match_available = 0;
	this.strstart = 0;
	this.match_start = 0;
	this.lookahead = 0;
	this.prev_length = 0;
	this.max_chain_length = 0;
	this.max_lazy_match = 0;
	this.level = 0;
	this.strategy = 0;
	this.good_match = 0;
	this.nice_match = 0;
	this.dyn_ltree = new Uint16Array(HEAP_SIZE * 2);
	this.dyn_dtree = /* @__PURE__ */ new Uint16Array(122);
	this.bl_tree = /* @__PURE__ */ new Uint16Array(78);
	zero(this.dyn_ltree);
	zero(this.dyn_dtree);
	zero(this.bl_tree);
	this.l_desc = null;
	this.d_desc = null;
	this.bl_desc = null;
	this.bl_count = /* @__PURE__ */ new Uint16Array(16);
	this.heap = /* @__PURE__ */ new Uint16Array(573);
	zero(this.heap);
	this.heap_len = 0;
	this.heap_max = 0;
	this.depth = /* @__PURE__ */ new Uint16Array(573);
	zero(this.depth);
	this.sym_buf = 0;
	this.lit_bufsize = 0;
	this.sym_next = 0;
	this.sym_end = 0;
	this.opt_len = 0;
	this.static_len = 0;
	this.matches = 0;
	this.insert = 0;
	this.bi_buf = 0;
	this.bi_valid = 0;
}
const deflateStateCheck = (strm) => {
	if (!strm) return 1;
	const s = strm.state;
	if (!s || s.strm !== strm || s.status !== INIT_STATE && s.status !== GZIP_STATE && s.status !== EXTRA_STATE && s.status !== NAME_STATE && s.status !== COMMENT_STATE && s.status !== HCRC_STATE && s.status !== BUSY_STATE && s.status !== FINISH_STATE) return 1;
	return 0;
};
const deflateResetKeep = (strm) => {
	if (deflateStateCheck(strm)) return err(strm, Z_STREAM_ERROR$2);
	strm.total_in = strm.total_out = 0;
	strm.data_type = Z_UNKNOWN;
	const s = strm.state;
	s.pending = 0;
	s.pending_out = 0;
	if (s.wrap < 0) s.wrap = -s.wrap;
	s.status = s.wrap === 2 ? GZIP_STATE : s.wrap ? INIT_STATE : BUSY_STATE;
	strm.adler = s.wrap === 2 ? 0 : 1;
	s.last_flush = -2;
	_tr_init(s);
	return Z_OK$3;
};
const deflateReset = (strm) => {
	const ret = deflateResetKeep(strm);
	if (ret === Z_OK$3) lm_init(strm.state);
	return ret;
};
const deflateSetHeader = (strm, head) => {
	if (deflateStateCheck(strm) || strm.state.wrap !== 2) return Z_STREAM_ERROR$2;
	strm.state.gzhead = head;
	return Z_OK$3;
};
const deflateInit2 = (strm, level, method, windowBits, memLevel, strategy, legacyHash) => {
	if (!strm) return Z_STREAM_ERROR$2;
	let wrap = 1;
	if (level === Z_DEFAULT_COMPRESSION$1) level = 6;
	if (windowBits < 0) {
		wrap = 0;
		windowBits = -windowBits;
	} else if (windowBits > 15) {
		wrap = 2;
		windowBits -= 16;
	}
	if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED$2 || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED || windowBits === 8 && wrap !== 1) return err(strm, Z_STREAM_ERROR$2);
	if (windowBits === 8) windowBits = 9;
	const s = new DeflateState();
	strm.state = s;
	s.strm = strm;
	s.status = INIT_STATE;
	s.wrap = wrap;
	s.gzhead = null;
	s.w_bits = windowBits;
	s.w_size = 1 << s.w_bits;
	s.w_mask = s.w_size - 1;
	s.legacy_hash = legacyHash ? 1 : 0;
	s.hash_bits = memLevel + 7;
	if (!s.legacy_hash && s.hash_bits < 15) s.hash_bits = 15;
	s.hash_size = 1 << s.hash_bits;
	s.hash_mask = s.hash_size - 1;
	s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
	s.window = new Uint8Array(s.w_size * 2);
	s.head = new Uint16Array(s.hash_size);
	s.prev = new Uint16Array(s.w_size);
	s.lit_bufsize = 1 << memLevel + 6;
	s.pending_buf_size = s.lit_bufsize * 4;
	s.pending_buf = new Uint8Array(s.pending_buf_size);
	s.sym_buf = s.lit_bufsize;
	s.sym_end = (s.lit_bufsize - 1) * 3;
	s.level = level;
	s.strategy = strategy;
	s.method = method;
	return deflateReset(strm);
};
const deflateInit = (strm, level) => {
	return deflateInit2(strm, level, Z_DEFLATED$2, MAX_WBITS$1, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY$1);
};
const deflate$2 = (strm, flush) => {
	if (deflateStateCheck(strm) || flush > Z_BLOCK$1 || flush < 0) return strm ? err(strm, Z_STREAM_ERROR$2) : Z_STREAM_ERROR$2;
	const s = strm.state;
	if (!strm.output || strm.avail_in !== 0 && !strm.input || s.status === FINISH_STATE && flush !== Z_FINISH$3) return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR$2 : Z_STREAM_ERROR$2);
	const old_flush = s.last_flush;
	s.last_flush = flush;
	if (s.pending !== 0) {
		flush_pending(strm);
		if (strm.avail_out === 0) {
			s.last_flush = -1;
			return Z_OK$3;
		}
	} else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH$3) return err(strm, Z_BUF_ERROR$2);
	if (s.status === FINISH_STATE && strm.avail_in !== 0) return err(strm, Z_BUF_ERROR$2);
	if (s.status === INIT_STATE && s.wrap === 0) s.status = BUSY_STATE;
	if (s.status === INIT_STATE) {
		let header = Z_DEFLATED$2 + (s.w_bits - 8 << 4) << 8;
		let level_flags = -1;
		if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) level_flags = 0;
		else if (s.level < 6) level_flags = 1;
		else if (s.level === 6) level_flags = 2;
		else level_flags = 3;
		header |= level_flags << 6;
		if (s.strstart !== 0) header |= PRESET_DICT;
		header += 31 - header % 31;
		putShortMSB(s, header);
		if (s.strstart !== 0) {
			putShortMSB(s, strm.adler >>> 16);
			putShortMSB(s, strm.adler & 65535);
		}
		strm.adler = 1;
		s.status = BUSY_STATE;
		flush_pending(strm);
		if (s.pending !== 0) {
			s.last_flush = -1;
			return Z_OK$3;
		}
	}
	if (s.status === GZIP_STATE) {
		strm.adler = 0;
		put_byte(s, 31);
		put_byte(s, 139);
		put_byte(s, 8);
		if (!s.gzhead) {
			put_byte(s, 0);
			put_byte(s, 0);
			put_byte(s, 0);
			put_byte(s, 0);
			put_byte(s, 0);
			put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
			put_byte(s, OS_CODE);
			s.status = BUSY_STATE;
			flush_pending(strm);
			if (s.pending !== 0) {
				s.last_flush = -1;
				return Z_OK$3;
			}
		} else {
			put_byte(s, (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16));
			put_byte(s, s.gzhead.time & 255);
			put_byte(s, s.gzhead.time >> 8 & 255);
			put_byte(s, s.gzhead.time >> 16 & 255);
			put_byte(s, s.gzhead.time >> 24 & 255);
			put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
			put_byte(s, s.gzhead.os & 255);
			if (s.gzhead.extra && s.gzhead.extra.length) {
				put_byte(s, s.gzhead.extra.length & 255);
				put_byte(s, s.gzhead.extra.length >> 8 & 255);
			}
			if (s.gzhead.hcrc) strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending, 0);
			s.gzindex = 0;
			s.status = EXTRA_STATE;
		}
	}
	if (s.status === EXTRA_STATE) {
		if (s.gzhead.extra) {
			let beg = s.pending;
			let left = (s.gzhead.extra.length & 65535) - s.gzindex;
			while (s.pending + left > s.pending_buf_size) {
				let copy = s.pending_buf_size - s.pending;
				s.pending_buf.set(s.gzhead.extra.subarray(s.gzindex, s.gzindex + copy), s.pending);
				s.pending = s.pending_buf_size;
				if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
				s.gzindex += copy;
				flush_pending(strm);
				if (s.pending !== 0) {
					s.last_flush = -1;
					return Z_OK$3;
				}
				beg = 0;
				left -= copy;
			}
			let gzhead_extra = new Uint8Array(s.gzhead.extra);
			s.pending_buf.set(gzhead_extra.subarray(s.gzindex, s.gzindex + left), s.pending);
			s.pending += left;
			if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
			s.gzindex = 0;
		}
		s.status = NAME_STATE;
	}
	if (s.status === NAME_STATE) {
		if (s.gzhead.name) {
			let beg = s.pending;
			let val;
			do {
				if (s.pending === s.pending_buf_size) {
					if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
					flush_pending(strm);
					if (s.pending !== 0) {
						s.last_flush = -1;
						return Z_OK$3;
					}
					beg = 0;
				}
				if (s.gzindex < s.gzhead.name.length) val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
				else val = 0;
				put_byte(s, val);
			} while (val !== 0);
			if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
			s.gzindex = 0;
		}
		s.status = COMMENT_STATE;
	}
	if (s.status === COMMENT_STATE) {
		if (s.gzhead.comment) {
			let beg = s.pending;
			let val;
			do {
				if (s.pending === s.pending_buf_size) {
					if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
					flush_pending(strm);
					if (s.pending !== 0) {
						s.last_flush = -1;
						return Z_OK$3;
					}
					beg = 0;
				}
				if (s.gzindex < s.gzhead.comment.length) val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
				else val = 0;
				put_byte(s, val);
			} while (val !== 0);
			if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
		}
		s.status = HCRC_STATE;
	}
	if (s.status === HCRC_STATE) {
		if (s.gzhead.hcrc) {
			if (s.pending + 2 > s.pending_buf_size) {
				flush_pending(strm);
				if (s.pending !== 0) {
					s.last_flush = -1;
					return Z_OK$3;
				}
			}
			put_byte(s, strm.adler & 255);
			put_byte(s, strm.adler >> 8 & 255);
			strm.adler = 0;
		}
		s.status = BUSY_STATE;
		flush_pending(strm);
		if (s.pending !== 0) {
			s.last_flush = -1;
			return Z_OK$3;
		}
	}
	if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH$2 && s.status !== FINISH_STATE) {
		let bstate = s.level === 0 ? deflate_stored(s, flush) : s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
		if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) s.status = FINISH_STATE;
		if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
			if (strm.avail_out === 0) s.last_flush = -1;
			return Z_OK$3;
		}
		if (bstate === BS_BLOCK_DONE) {
			if (flush === Z_PARTIAL_FLUSH) _tr_align(s);
			else if (flush !== Z_BLOCK$1) {
				_tr_stored_block(s, 0, 0, false);
				if (flush === Z_FULL_FLUSH$1) {
					/*** CLEAR_HASH(s); ***/ zero(s.head);
					if (s.lookahead === 0) {
						s.strstart = 0;
						s.block_start = 0;
						s.insert = 0;
					}
				}
			}
			flush_pending(strm);
			if (strm.avail_out === 0) {
				s.last_flush = -1;
				return Z_OK$3;
			}
		}
	}
	if (flush !== Z_FINISH$3) return Z_OK$3;
	if (s.wrap <= 0) return Z_STREAM_END$3;
	if (s.wrap === 2) {
		put_byte(s, strm.adler & 255);
		put_byte(s, strm.adler >> 8 & 255);
		put_byte(s, strm.adler >> 16 & 255);
		put_byte(s, strm.adler >> 24 & 255);
		put_byte(s, strm.total_in & 255);
		put_byte(s, strm.total_in >> 8 & 255);
		put_byte(s, strm.total_in >> 16 & 255);
		put_byte(s, strm.total_in >> 24 & 255);
	} else {
		putShortMSB(s, strm.adler >>> 16);
		putShortMSB(s, strm.adler & 65535);
	}
	flush_pending(strm);
	if (s.wrap > 0) s.wrap = -s.wrap;
	return s.pending !== 0 ? Z_OK$3 : Z_STREAM_END$3;
};
const deflateEnd = (strm) => {
	if (deflateStateCheck(strm)) return Z_STREAM_ERROR$2;
	const status = strm.state.status;
	strm.state = null;
	return status === BUSY_STATE ? err(strm, Z_DATA_ERROR$2) : Z_OK$3;
};
const deflateSetDictionary = (strm, dictionary) => {
	let dictLength = dictionary.length;
	if (deflateStateCheck(strm)) return Z_STREAM_ERROR$2;
	const s = strm.state;
	const wrap = s.wrap;
	if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) return Z_STREAM_ERROR$2;
	if (wrap === 1) strm.adler = adler32_1(strm.adler, dictionary, dictLength, 0);
	s.wrap = 0;
	if (dictLength >= s.w_size) {
		if (wrap === 0) {
			/*** CLEAR_HASH(s); ***/
			zero(s.head);
			s.strstart = 0;
			s.block_start = 0;
			s.insert = 0;
		}
		let tmpDict = new Uint8Array(s.w_size);
		tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);
		dictionary = tmpDict;
		dictLength = s.w_size;
	}
	const avail = strm.avail_in;
	const next = strm.next_in;
	const input = strm.input;
	strm.avail_in = dictLength;
	strm.next_in = 0;
	strm.input = dictionary;
	fill_window(s);
	while (s.lookahead >= MIN_MATCH) {
		let str = s.strstart;
		let n = s.lookahead - (MIN_MATCH - 1);
		do {
			INSERT_STRING(s, str);
			str++;
		} while (--n);
		s.strstart = str;
		s.lookahead = MIN_MATCH - 1;
		fill_window(s);
	}
	s.strstart += s.lookahead;
	s.block_start = s.strstart;
	s.insert = s.lookahead;
	s.lookahead = 0;
	s.match_length = s.prev_length = MIN_MATCH - 1;
	s.match_available = 0;
	strm.next_in = next;
	strm.input = input;
	strm.avail_in = avail;
	s.wrap = wrap;
	return Z_OK$3;
};
var deflate_1$2 = {
	deflateInit,
	deflateInit2,
	deflateReset,
	deflateResetKeep,
	deflateSetHeader,
	deflate: deflate$2,
	deflateEnd,
	deflateSetDictionary,
	deflateInfo: "pako deflate (from Nodeca project)"
};
const _has = (obj, key) => {
	return Object.prototype.hasOwnProperty.call(obj, key);
};
var assign = function(obj) {
	const sources = Array.prototype.slice.call(arguments, 1);
	while (sources.length) {
		const source = sources.shift();
		if (!source) continue;
		if (typeof source !== "object") throw new TypeError(source + "must be non-object");
		for (const p in source) if (_has(source, p)) obj[p] = source[p];
	}
	return obj;
};
var flattenChunks = (chunks) => {
	let len = 0;
	for (let i = 0, l = chunks.length; i < l; i++) len += chunks[i].length;
	const result = new Uint8Array(len);
	for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
		let chunk = chunks[i];
		result.set(chunk, pos);
		pos += chunk.length;
	}
	return result;
};
var common = {
	assign,
	flattenChunks
};
let STR_APPLY_UIA_OK = true;
try {
	String.fromCharCode.apply(null, /* @__PURE__ */ new Uint8Array(1));
} catch (__) {
	STR_APPLY_UIA_OK = false;
}
const _utf8len = /* @__PURE__ */ new Uint8Array(256);
for (let q = 0; q < 256; q++) _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
_utf8len[254] = _utf8len[255] = 1;
var string2buf = (str) => {
	if (typeof TextEncoder === "function" && TextEncoder.prototype.encode) return new TextEncoder().encode(str);
	let buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
	for (m_pos = 0; m_pos < str_len; m_pos++) {
		c = str.charCodeAt(m_pos);
		if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
			c2 = str.charCodeAt(m_pos + 1);
			if ((c2 & 64512) === 56320) {
				c = 65536 + (c - 55296 << 10) + (c2 - 56320);
				m_pos++;
			}
		}
		buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
	}
	buf = new Uint8Array(buf_len);
	for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
		c = str.charCodeAt(m_pos);
		if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
			c2 = str.charCodeAt(m_pos + 1);
			if ((c2 & 64512) === 56320) {
				c = 65536 + (c - 55296 << 10) + (c2 - 56320);
				m_pos++;
			}
		}
		if (c < 128) buf[i++] = c;
		else if (c < 2048) {
			buf[i++] = 192 | c >>> 6;
			buf[i++] = 128 | c & 63;
		} else if (c < 65536) {
			buf[i++] = 224 | c >>> 12;
			buf[i++] = 128 | c >>> 6 & 63;
			buf[i++] = 128 | c & 63;
		} else {
			buf[i++] = 240 | c >>> 18;
			buf[i++] = 128 | c >>> 12 & 63;
			buf[i++] = 128 | c >>> 6 & 63;
			buf[i++] = 128 | c & 63;
		}
	}
	return buf;
};
const buf2binstring = (buf, len) => {
	if (len < 65534) {
		if (buf.subarray && STR_APPLY_UIA_OK) return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
	}
	let result = "";
	for (let i = 0; i < len; i++) result += String.fromCharCode(buf[i]);
	return result;
};
var buf2string = (buf, max) => {
	const len = max || buf.length;
	if (typeof TextDecoder === "function" && TextDecoder.prototype.decode) return new TextDecoder().decode(buf.subarray(0, max));
	let i, out;
	const utf16buf = new Array(len * 2);
	for (out = 0, i = 0; i < len;) {
		let c = buf[i++];
		if (c < 128) {
			utf16buf[out++] = c;
			continue;
		}
		let c_len = _utf8len[c];
		if (c_len > 4) {
			utf16buf[out++] = 65533;
			i += c_len - 1;
			continue;
		}
		c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
		while (c_len > 1 && i < len) {
			c = c << 6 | buf[i++] & 63;
			c_len--;
		}
		if (c_len > 1) {
			utf16buf[out++] = 65533;
			continue;
		}
		if (c < 65536) utf16buf[out++] = c;
		else {
			c -= 65536;
			utf16buf[out++] = 55296 | c >> 10 & 1023;
			utf16buf[out++] = 56320 | c & 1023;
		}
	}
	return buf2binstring(utf16buf, out);
};
var utf8border = (buf, max) => {
	max = max || buf.length;
	if (max > buf.length) max = buf.length;
	let pos = max - 1;
	while (pos >= 0 && (buf[pos] & 192) === 128) pos--;
	if (pos < 0) return max;
	if (pos === 0) return max;
	return pos + _utf8len[buf[pos]] > max ? pos : max;
};
var strings = {
	string2buf,
	buf2string,
	utf8border
};
function ZStream() {
	this.input = null;
	this.next_in = 0;
	this.avail_in = 0;
	this.total_in = 0;
	this.output = null;
	this.next_out = 0;
	this.avail_out = 0;
	this.total_out = 0;
	this.msg = "";
	this.state = null;
	this.data_type = 2;
	this.adler = 0;
}
var zstream = ZStream;
const toString$1 = Object.prototype.toString;
const { Z_NO_FLUSH: Z_NO_FLUSH$1, Z_SYNC_FLUSH, Z_FULL_FLUSH, Z_FINISH: Z_FINISH$2, Z_OK: Z_OK$2, Z_STREAM_END: Z_STREAM_END$2, Z_DEFAULT_COMPRESSION, Z_DEFAULT_STRATEGY, Z_DEFLATED: Z_DEFLATED$1 } = constants$2;
const defaultOptions$1 = {
	level: Z_DEFAULT_COMPRESSION,
	method: Z_DEFLATED$1,
	chunkSize: 16384,
	windowBits: 15,
	memLevel: 8,
	strategy: Z_DEFAULT_STRATEGY,
	legacyHash: true
};
/**
* class Deflate
*
* Generic JS-style wrapper for zlib calls. If you don't need
* streaming behaviour - use more simple functions: [[deflate]],
* [[deflateRaw]] and [[gzip]].
**/
/**
* Deflate.result -> Uint8Array
*
* Compressed result, generated by default [[Deflate#onData]]
* and [[Deflate#onEnd]] handlers. Filled after you push last chunk
* (call [[Deflate#push]] with `Z_FINISH` / `true` param).
**/
/**
* Deflate.err -> Number
*
* Error code after deflate finished. 0 (Z_OK) on success.
* You will not need it in real life, because deflate errors
* are possible only on wrong options or bad `onData` / `onEnd`
* custom handlers.
**/
/**
* Deflate.msg -> String
*
* Error message, if [[Deflate.err]] != 0
**/
/**
* new Deflate(options)
* - options (Object): zlib deflate options.
*
* Creates new deflator instance with specified params. Throws exception
* on bad params. Supported options:
*
* - `level`
* - `windowBits`
* - `memLevel`
* - `strategy`
* - `dictionary`
*
* [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
* for more information on these.
*
* - `legacyHash` (Boolean) - use the classic zlib hash (default), which matches
*   canonical zlib output byte-for-byte. Set to `false` to use the faster
*   ANZAC++ hash, which matches recent (chromium) node.js output instead.
*
* Additional options, for internal needs:
*
* - `chunkSize` - size of generated data chunks (16K by default)
* - `raw` (Boolean) - do raw deflate
* - `gzip` (Boolean) - create gzip wrapper
* - `header` (Object) - custom header for gzip
*   - `text` (Boolean) - true if compressed data believed to be text
*   - `time` (Number) - modification time, unix timestamp
*   - `os` (Number) - operation system code
*   - `extra` (Array) - array of bytes with extra data (max 65536)
*   - `name` (String) - file name (binary string)
*   - `comment` (String) - comment (binary string)
*   - `hcrc` (Boolean) - true if header crc should be added
*
* ##### Example:
*
* ```javascript
* const pako = require('pako')
*   , chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
*   , chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
*
* const deflate = new pako.Deflate({ level: 3});
*
* deflate.push(chunk1, false);
* deflate.push(chunk2, true);  // true -> last chunk
*
* if (deflate.err) { throw new Error(deflate.err); }
*
* console.log(deflate.result);
* ```
**/
function Deflate$1(options) {
	this.options = common.assign({}, defaultOptions$1, options || {});
	let opt = this.options;
	if (opt.raw && opt.windowBits > 0) opt.windowBits = -opt.windowBits;
	else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) opt.windowBits += 16;
	this.err = 0;
	this.msg = "";
	this.ended = false;
	this.chunks = [];
	this.strm = new zstream();
	this.strm.avail_out = 0;
	let status = deflate_1$2.deflateInit2(this.strm, opt.level, opt.method, opt.windowBits, opt.memLevel, opt.strategy, opt.legacyHash);
	if (status !== Z_OK$2) throw new Error(messages[status]);
	if (opt.header) deflate_1$2.deflateSetHeader(this.strm, opt.header);
	if (opt.dictionary) {
		let dict;
		if (typeof opt.dictionary === "string") dict = strings.string2buf(opt.dictionary);
		else if (toString$1.call(opt.dictionary) === "[object ArrayBuffer]") dict = new Uint8Array(opt.dictionary);
		else dict = opt.dictionary;
		status = deflate_1$2.deflateSetDictionary(this.strm, dict);
		if (status !== Z_OK$2) throw new Error(messages[status]);
		this._dict_set = true;
	}
}
/**
* Deflate#push(data[, flush_mode]) -> Boolean
* - data (Uint8Array|ArrayBuffer|String): input data. Strings will be
*   converted to utf8 byte sequence.
* - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
*   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
*
* Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
* new compressed chunks. Returns `true` on success. The last data block must
* have `flush_mode` Z_FINISH (or `true`). That will flush internal pending
* buffers and call [[Deflate#onEnd]].
*
* On fail call [[Deflate#onEnd]] with error code and return false.
*
* ##### Example
*
* ```javascript
* push(chunk, false); // push one of data chunks
* ...
* push(chunk, true);  // push last chunk
* ```
**/
Deflate$1.prototype.push = function(data, flush_mode) {
	const strm = this.strm;
	const chunkSize = this.options.chunkSize;
	let status, _flush_mode;
	if (this.ended) return false;
	if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
	else _flush_mode = flush_mode === true ? Z_FINISH$2 : Z_NO_FLUSH$1;
	if (typeof data === "string") strm.input = strings.string2buf(data);
	else if (toString$1.call(data) === "[object ArrayBuffer]") strm.input = new Uint8Array(data);
	else strm.input = data;
	strm.next_in = 0;
	strm.avail_in = strm.input.length;
	for (;;) {
		if (strm.avail_out === 0) {
			strm.output = new Uint8Array(chunkSize);
			strm.next_out = 0;
			strm.avail_out = chunkSize;
		}
		if ((_flush_mode === Z_SYNC_FLUSH || _flush_mode === Z_FULL_FLUSH) && strm.avail_out <= 6) {
			this.onData(strm.output.subarray(0, strm.next_out));
			strm.avail_out = 0;
			continue;
		}
		status = deflate_1$2.deflate(strm, _flush_mode);
		if (status === Z_STREAM_END$2) {
			if (strm.next_out > 0) this.onData(strm.output.subarray(0, strm.next_out));
			status = deflate_1$2.deflateEnd(this.strm);
			this.onEnd(status);
			this.ended = true;
			return status === Z_OK$2;
		}
		if (strm.avail_out === 0) {
			this.onData(strm.output);
			continue;
		}
		if (_flush_mode > 0 && strm.next_out > 0) {
			this.onData(strm.output.subarray(0, strm.next_out));
			strm.avail_out = 0;
			continue;
		}
		if (strm.avail_in === 0) break;
	}
	return true;
};
/**
* Deflate#onData(chunk) -> Void
* - chunk (Uint8Array): output data.
*
* By default, stores data blocks in `chunks[]` property and glue
* those in `onEnd`. Override this handler, if you need another behaviour.
**/
Deflate$1.prototype.onData = function(chunk) {
	this.chunks.push(chunk);
};
/**
* Deflate#onEnd(status) -> Void
* - status (Number): deflate status. 0 (Z_OK) on success,
*   other if not.
*
* Called once after you tell deflate that the input stream is
* complete (Z_FINISH). By default - join collected chunks,
* free memory and fill `results` / `err` properties.
**/
Deflate$1.prototype.onEnd = function(status) {
	if (status === Z_OK$2) this.result = common.flattenChunks(this.chunks);
	this.chunks = [];
	this.err = status;
	this.msg = this.strm.msg;
};
/**
* deflate(data[, options]) -> Uint8Array
* - data (Uint8Array|ArrayBuffer|String): input data to compress.
* - options (Object): zlib deflate options.
*
* Compress `data` with deflate algorithm and `options`.
*
* Supported options are:
*
* - level
* - windowBits
* - memLevel
* - strategy
* - dictionary
*
* [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
* for more information on these.
*
* Sugar (options):
*
* - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
*   negative windowBits implicitly.
*
* ##### Example:
*
* ```javascript
* const pako = require('pako')
* const data = new Uint8Array([1,2,3,4,5,6,7,8,9]);
*
* console.log(pako.deflate(data));
* ```
**/
function deflate$1(input, options) {
	const deflator = new Deflate$1(options);
	deflator.push(input, true);
	if (deflator.err) throw deflator.msg || messages[deflator.err];
	return deflator.result;
}
/**
* deflateRaw(data[, options]) -> Uint8Array
* - data (Uint8Array|ArrayBuffer|String): input data to compress.
* - options (Object): zlib deflate options.
*
* The same as [[deflate]], but creates raw data, without wrapper
* (header and adler32 crc).
**/
function deflateRaw$1(input, options) {
	options = options || {};
	options.raw = true;
	return deflate$1(input, options);
}
/**
* gzip(data[, options]) -> Uint8Array
* - data (Uint8Array|ArrayBuffer|String): input data to compress.
* - options (Object): zlib deflate options.
*
* The same as [[deflate]], but create gzip wrapper instead of
* deflate one.
**/
function gzip$1(input, options) {
	options = options || {};
	options.gzip = true;
	return deflate$1(input, options);
}
var deflate_1$1 = {
	Deflate: Deflate$1,
	deflate: deflate$1,
	deflateRaw: deflateRaw$1,
	gzip: gzip$1,
	constants: constants$2
};
const BAD$1 = 16209;
const TYPE$1 = 16191;
var inffast = function inflate_fast(strm, start) {
	let _in;
	let last;
	let _out;
	let beg;
	let end;
	let dmax;
	let wsize;
	let whave;
	let wnext;
	let s_window;
	let hold;
	let bits;
	let lcode;
	let dcode;
	let lmask;
	let dmask;
	let here;
	let op;
	let len;
	let dist;
	let from;
	let from_source;
	let input, output;
	const state = strm.state;
	_in = strm.next_in;
	input = strm.input;
	last = _in + (strm.avail_in - 5);
	_out = strm.next_out;
	output = strm.output;
	beg = _out - (start - strm.avail_out);
	end = _out + (strm.avail_out - 257);
	dmax = state.dmax;
	wsize = state.wsize;
	whave = state.whave;
	wnext = state.wnext;
	s_window = state.window;
	hold = state.hold;
	bits = state.bits;
	lcode = state.lencode;
	dcode = state.distcode;
	lmask = (1 << state.lenbits) - 1;
	dmask = (1 << state.distbits) - 1;
	top: do {
		if (bits < 15) {
			hold += input[_in++] << bits;
			bits += 8;
			hold += input[_in++] << bits;
			bits += 8;
		}
		here = lcode[hold & lmask];
		dolen: for (;;) {
			op = here >>> 24;
			hold >>>= op;
			bits -= op;
			op = here >>> 16 & 255;
			if (op === 0) output[_out++] = here & 65535;
			else if (op & 16) {
				len = here & 65535;
				op &= 15;
				if (op) {
					if (bits < op) {
						hold += input[_in++] << bits;
						bits += 8;
					}
					len += hold & (1 << op) - 1;
					hold >>>= op;
					bits -= op;
				}
				if (bits < 15) {
					hold += input[_in++] << bits;
					bits += 8;
					hold += input[_in++] << bits;
					bits += 8;
				}
				here = dcode[hold & dmask];
				dodist: for (;;) {
					op = here >>> 24;
					hold >>>= op;
					bits -= op;
					op = here >>> 16 & 255;
					if (op & 16) {
						dist = here & 65535;
						op &= 15;
						if (bits < op) {
							hold += input[_in++] << bits;
							bits += 8;
							if (bits < op) {
								hold += input[_in++] << bits;
								bits += 8;
							}
						}
						dist += hold & (1 << op) - 1;
						if (dist > dmax) {
							strm.msg = "invalid distance too far back";
							state.mode = BAD$1;
							break top;
						}
						hold >>>= op;
						bits -= op;
						op = _out - beg;
						if (dist > op) {
							op = dist - op;
							if (op > whave) {
								if (state.sane) {
									strm.msg = "invalid distance too far back";
									state.mode = BAD$1;
									break top;
								}
							}
							from = 0;
							from_source = s_window;
							if (wnext === 0) {
								from += wsize - op;
								if (op < len) {
									len -= op;
									do
										output[_out++] = s_window[from++];
									while (--op);
									from = _out - dist;
									from_source = output;
								}
							} else if (wnext < op) {
								from += wsize + wnext - op;
								op -= wnext;
								if (op < len) {
									len -= op;
									do
										output[_out++] = s_window[from++];
									while (--op);
									from = 0;
									if (wnext < len) {
										op = wnext;
										len -= op;
										do
											output[_out++] = s_window[from++];
										while (--op);
										from = _out - dist;
										from_source = output;
									}
								}
							} else {
								from += wnext - op;
								if (op < len) {
									len -= op;
									do
										output[_out++] = s_window[from++];
									while (--op);
									from = _out - dist;
									from_source = output;
								}
							}
							while (len > 2) {
								output[_out++] = from_source[from++];
								output[_out++] = from_source[from++];
								output[_out++] = from_source[from++];
								len -= 3;
							}
							if (len) {
								output[_out++] = from_source[from++];
								if (len > 1) output[_out++] = from_source[from++];
							}
						} else {
							from = _out - dist;
							do {
								output[_out++] = output[from++];
								output[_out++] = output[from++];
								output[_out++] = output[from++];
								len -= 3;
							} while (len > 2);
							if (len) {
								output[_out++] = output[from++];
								if (len > 1) output[_out++] = output[from++];
							}
						}
					} else if ((op & 64) === 0) {
						here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
						continue dodist;
					} else {
						strm.msg = "invalid distance code";
						state.mode = BAD$1;
						break top;
					}
					break;
				}
			} else if ((op & 64) === 0) {
				here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
				continue dolen;
			} else if (op & 32) {
				state.mode = TYPE$1;
				break top;
			} else {
				strm.msg = "invalid literal/length code";
				state.mode = BAD$1;
				break top;
			}
			break;
		}
	} while (_in < last && _out < end);
	len = bits >> 3;
	_in -= len;
	bits -= len << 3;
	hold &= (1 << bits) - 1;
	strm.next_in = _in;
	strm.next_out = _out;
	strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
	strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
	state.hold = hold;
	state.bits = bits;
};
const MAXBITS = 15;
const ENOUGH_LENS$1 = 852;
const ENOUGH_DISTS$1 = 592;
const CODES$1 = 0;
const LENS$1 = 1;
const DISTS$1 = 2;
const lbase = new Uint16Array([
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	13,
	15,
	17,
	19,
	23,
	27,
	31,
	35,
	43,
	51,
	59,
	67,
	83,
	99,
	115,
	131,
	163,
	195,
	227,
	258,
	0,
	0
]);
const lext = new Uint8Array([
	16,
	16,
	16,
	16,
	16,
	16,
	16,
	16,
	17,
	17,
	17,
	17,
	18,
	18,
	18,
	18,
	19,
	19,
	19,
	19,
	20,
	20,
	20,
	20,
	21,
	21,
	21,
	21,
	16,
	199,
	75
]);
const dbase = new Uint16Array([
	1,
	2,
	3,
	4,
	5,
	7,
	9,
	13,
	17,
	25,
	33,
	49,
	65,
	97,
	129,
	193,
	257,
	385,
	513,
	769,
	1025,
	1537,
	2049,
	3073,
	4097,
	6145,
	8193,
	12289,
	16385,
	24577,
	0,
	0
]);
const dext = new Uint8Array([
	16,
	16,
	16,
	16,
	17,
	17,
	18,
	18,
	19,
	19,
	20,
	20,
	21,
	21,
	22,
	22,
	23,
	23,
	24,
	24,
	25,
	25,
	26,
	26,
	27,
	27,
	28,
	28,
	29,
	29,
	64,
	64
]);
const inflate_table = (type, lens, lens_index, codes, table, table_index, work, opts) => {
	const bits = opts.bits;
	let len = 0;
	let sym = 0;
	let min = 0, max = 0;
	let root = 0;
	let curr = 0;
	let drop = 0;
	let left = 0;
	let used = 0;
	let huff = 0;
	let incr;
	let fill;
	let low;
	let mask;
	let next;
	let base = null;
	let match;
	const count = /* @__PURE__ */ new Uint16Array(16);
	const offs = /* @__PURE__ */ new Uint16Array(16);
	let extra = null;
	let here_bits, here_op, here_val;
	for (len = 0; len <= MAXBITS; len++) count[len] = 0;
	for (sym = 0; sym < codes; sym++) count[lens[lens_index + sym]]++;
	root = bits;
	for (max = MAXBITS; max >= 1; max--) if (count[max] !== 0) break;
	if (root > max) root = max;
	if (max === 0) {
		table[table_index++] = 20971520;
		table[table_index++] = 20971520;
		opts.bits = 1;
		return 0;
	}
	for (min = 1; min < max; min++) if (count[min] !== 0) break;
	if (root < min) root = min;
	left = 1;
	for (len = 1; len <= MAXBITS; len++) {
		left <<= 1;
		left -= count[len];
		if (left < 0) return -1;
	}
	if (left > 0 && (type === CODES$1 || max !== 1)) return -1;
	offs[1] = 0;
	for (len = 1; len < MAXBITS; len++) offs[len + 1] = offs[len] + count[len];
	for (sym = 0; sym < codes; sym++) if (lens[lens_index + sym] !== 0) work[offs[lens[lens_index + sym]]++] = sym;
	if (type === CODES$1) {
		base = extra = work;
		match = 20;
	} else if (type === LENS$1) {
		base = lbase;
		extra = lext;
		match = 257;
	} else {
		base = dbase;
		extra = dext;
		match = 0;
	}
	huff = 0;
	sym = 0;
	len = min;
	next = table_index;
	curr = root;
	drop = 0;
	low = -1;
	used = 1 << root;
	mask = used - 1;
	if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) return 1;
	for (;;) {
		here_bits = len - drop;
		if (work[sym] + 1 < match) {
			here_op = 0;
			here_val = work[sym];
		} else if (work[sym] >= match) {
			here_op = extra[work[sym] - match];
			here_val = base[work[sym] - match];
		} else {
			here_op = 96;
			here_val = 0;
		}
		incr = 1 << len - drop;
		fill = 1 << curr;
		min = fill;
		do {
			fill -= incr;
			table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
		} while (fill !== 0);
		incr = 1 << len - 1;
		while (huff & incr) incr >>= 1;
		if (incr !== 0) {
			huff &= incr - 1;
			huff += incr;
		} else huff = 0;
		sym++;
		if (--count[len] === 0) {
			if (len === max) break;
			len = lens[lens_index + work[sym]];
		}
		if (len > root && (huff & mask) !== low) {
			if (drop === 0) drop = root;
			next += min;
			curr = len - drop;
			left = 1 << curr;
			while (curr + drop < max) {
				left -= count[curr + drop];
				if (left <= 0) break;
				curr++;
				left <<= 1;
			}
			used += 1 << curr;
			if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) return 1;
			low = huff & mask;
			table[low] = root << 24 | curr << 16 | next - table_index | 0;
		}
	}
	if (huff !== 0) table[next + huff] = len - drop << 24 | 4194304;
	opts.bits = root;
	return 0;
};
var inftrees = inflate_table;
const CODES = 0;
const LENS = 1;
const DISTS = 2;
const { Z_FINISH: Z_FINISH$1, Z_BLOCK, Z_TREES, Z_OK: Z_OK$1, Z_STREAM_END: Z_STREAM_END$1, Z_NEED_DICT: Z_NEED_DICT$1, Z_STREAM_ERROR: Z_STREAM_ERROR$1, Z_DATA_ERROR: Z_DATA_ERROR$1, Z_MEM_ERROR: Z_MEM_ERROR$1, Z_BUF_ERROR: Z_BUF_ERROR$1, Z_DEFLATED } = constants$2;
const HEAD = 16180;
const FLAGS = 16181;
const TIME = 16182;
const OS = 16183;
const EXLEN = 16184;
const EXTRA = 16185;
const NAME = 16186;
const COMMENT = 16187;
const HCRC = 16188;
const DICTID = 16189;
const DICT = 16190;
const TYPE = 16191;
const TYPEDO = 16192;
const STORED = 16193;
const COPY_ = 16194;
const COPY = 16195;
const TABLE = 16196;
const LENLENS = 16197;
const CODELENS = 16198;
const LEN_ = 16199;
const LEN = 16200;
const LENEXT = 16201;
const DIST = 16202;
const DISTEXT = 16203;
const MATCH = 16204;
const LIT = 16205;
const CHECK = 16206;
const LENGTH = 16207;
const DONE = 16208;
const BAD = 16209;
const MEM = 16210;
const SYNC = 16211;
const ENOUGH_LENS = 852;
const ENOUGH_DISTS = 592;
const DEF_WBITS = 15;
const zswap32 = (q) => {
	return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
};
function InflateState() {
	this.strm = null;
	this.mode = 0;
	this.last = false;
	this.wrap = 0;
	this.havedict = false;
	this.flags = 0;
	this.dmax = 0;
	this.check = 0;
	this.total = 0;
	this.head = null;
	this.wbits = 0;
	this.wsize = 0;
	this.whave = 0;
	this.wnext = 0;
	this.window = null;
	this.hold = 0;
	this.bits = 0;
	this.length = 0;
	this.offset = 0;
	this.extra = 0;
	this.lencode = null;
	this.distcode = null;
	this.lenbits = 0;
	this.distbits = 0;
	this.ncode = 0;
	this.nlen = 0;
	this.ndist = 0;
	this.have = 0;
	this.next = null;
	this.lens = /* @__PURE__ */ new Uint16Array(320);
	this.work = /* @__PURE__ */ new Uint16Array(288);
	this.lendyn = null;
	this.distdyn = null;
	this.sane = 0;
	this.back = 0;
	this.was = 0;
}
const inflateStateCheck = (strm) => {
	if (!strm) return 1;
	const state = strm.state;
	if (!state || state.strm !== strm || state.mode < HEAD || state.mode > SYNC) return 1;
	return 0;
};
const inflateResetKeep = (strm) => {
	if (inflateStateCheck(strm)) return Z_STREAM_ERROR$1;
	const state = strm.state;
	strm.total_in = strm.total_out = state.total = 0;
	strm.msg = "";
	if (state.wrap) strm.adler = state.wrap & 1;
	state.mode = HEAD;
	state.last = 0;
	state.havedict = 0;
	state.flags = -1;
	state.dmax = 32768;
	state.head = null;
	state.hold = 0;
	state.bits = 0;
	state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS);
	state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS);
	state.sane = 1;
	state.back = -1;
	return Z_OK$1;
};
const inflateReset = (strm) => {
	if (inflateStateCheck(strm)) return Z_STREAM_ERROR$1;
	const state = strm.state;
	state.wsize = 0;
	state.whave = 0;
	state.wnext = 0;
	return inflateResetKeep(strm);
};
const inflateReset2 = (strm, windowBits) => {
	let wrap;
	if (inflateStateCheck(strm)) return Z_STREAM_ERROR$1;
	const state = strm.state;
	if (windowBits < 0) {
		wrap = 0;
		windowBits = -windowBits;
	} else {
		wrap = (windowBits >> 4) + 5;
		if (windowBits < 48) windowBits &= 15;
	}
	if (windowBits && (windowBits < 8 || windowBits > 15)) return Z_STREAM_ERROR$1;
	if (state.window !== null && state.wbits !== windowBits) state.window = null;
	state.wrap = wrap;
	state.wbits = windowBits;
	return inflateReset(strm);
};
const inflateInit2 = (strm, windowBits) => {
	if (!strm) return Z_STREAM_ERROR$1;
	const state = new InflateState();
	strm.state = state;
	state.strm = strm;
	state.window = null;
	state.mode = HEAD;
	const ret = inflateReset2(strm, windowBits);
	if (ret !== Z_OK$1) strm.state = null;
	return ret;
};
const inflateInit = (strm) => {
	return inflateInit2(strm, DEF_WBITS);
};
let virgin = true;
let lenfix;
let distfix;
const fixedtables = (state) => {
	if (virgin) {
		lenfix = /* @__PURE__ */ new Int32Array(512);
		distfix = /* @__PURE__ */ new Int32Array(32);
		let sym = 0;
		while (sym < 144) state.lens[sym++] = 8;
		while (sym < 256) state.lens[sym++] = 9;
		while (sym < 280) state.lens[sym++] = 7;
		while (sym < 288) state.lens[sym++] = 8;
		inftrees(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
		sym = 0;
		while (sym < 32) state.lens[sym++] = 5;
		inftrees(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
		virgin = false;
	}
	state.lencode = lenfix;
	state.lenbits = 9;
	state.distcode = distfix;
	state.distbits = 5;
};
const updatewindow = (strm, src, end, copy) => {
	let dist;
	const state = strm.state;
	if (state.window === null) state.window = new Uint8Array(1 << state.wbits);
	if (state.wsize === 0) {
		state.wsize = 1 << state.wbits;
		state.wnext = 0;
		state.whave = 0;
	}
	if (copy >= state.wsize) {
		state.window.set(src.subarray(end - state.wsize, end), 0);
		state.wnext = 0;
		state.whave = state.wsize;
	} else {
		dist = state.wsize - state.wnext;
		if (dist > copy) dist = copy;
		state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
		copy -= dist;
		if (copy) {
			state.window.set(src.subarray(end - copy, end), 0);
			state.wnext = copy;
			state.whave = state.wsize;
		} else {
			state.wnext += dist;
			if (state.wnext === state.wsize) state.wnext = 0;
			if (state.whave < state.wsize) state.whave += dist;
		}
	}
	return 0;
};
const inflate$2 = (strm, flush) => {
	let state;
	let input, output;
	let next;
	let put;
	let have, left;
	let hold;
	let bits;
	let _in, _out;
	let copy;
	let from;
	let from_source;
	let here = 0;
	let here_bits, here_op, here_val;
	let last_bits, last_op, last_val;
	let len;
	let ret;
	const hbuf = /* @__PURE__ */ new Uint8Array(4);
	let opts;
	let n;
	const order = new Uint8Array([
		16,
		17,
		18,
		0,
		8,
		7,
		9,
		6,
		10,
		5,
		11,
		4,
		12,
		3,
		13,
		2,
		14,
		1,
		15
	]);
	if (inflateStateCheck(strm) || !strm.output || !strm.input && strm.avail_in !== 0) return Z_STREAM_ERROR$1;
	state = strm.state;
	if (state.mode === TYPE) state.mode = TYPEDO;
	put = strm.next_out;
	output = strm.output;
	left = strm.avail_out;
	next = strm.next_in;
	input = strm.input;
	have = strm.avail_in;
	hold = state.hold;
	bits = state.bits;
	_in = have;
	_out = left;
	ret = Z_OK$1;
	inf_leave: for (;;) switch (state.mode) {
		case HEAD:
			if (state.wrap === 0) {
				state.mode = TYPEDO;
				break;
			}
			while (bits < 16) {
				if (have === 0) break inf_leave;
				have--;
				hold += input[next++] << bits;
				bits += 8;
			}
			if (state.wrap & 2 && hold === 35615) {
				if (state.wbits === 0) state.wbits = 15;
				state.check = 0;
				hbuf[0] = hold & 255;
				hbuf[1] = hold >>> 8 & 255;
				state.check = crc32_1(state.check, hbuf, 2, 0);
				hold = 0;
				bits = 0;
				state.mode = FLAGS;
				break;
			}
			if (state.head) state.head.done = false;
			if (!(state.wrap & 1) || (((hold & 255) << 8) + (hold >> 8)) % 31) {
				strm.msg = "incorrect header check";
				state.mode = BAD;
				break;
			}
			if ((hold & 15) !== Z_DEFLATED) {
				strm.msg = "unknown compression method";
				state.mode = BAD;
				break;
			}
			hold >>>= 4;
			bits -= 4;
			len = (hold & 15) + 8;
			if (state.wbits === 0) state.wbits = len;
			if (len > 15 || len > state.wbits) {
				strm.msg = "invalid window size";
				state.mode = BAD;
				break;
			}
			state.dmax = 1 << state.wbits;
			state.flags = 0;
			strm.adler = state.check = 1;
			state.mode = hold & 512 ? DICTID : TYPE;
			hold = 0;
			bits = 0;
			break;
		case FLAGS:
			while (bits < 16) {
				if (have === 0) break inf_leave;
				have--;
				hold += input[next++] << bits;
				bits += 8;
			}
			state.flags = hold;
			if ((state.flags & 255) !== Z_DEFLATED) {
				strm.msg = "unknown compression method";
				state.mode = BAD;
				break;
			}
			if (state.flags & 57344) {
				strm.msg = "unknown header flags set";
				state.mode = BAD;
				break;
			}
			if (state.head) state.head.text = hold >> 8 & 1;
			if (state.flags & 512 && state.wrap & 4) {
				hbuf[0] = hold & 255;
				hbuf[1] = hold >>> 8 & 255;
				state.check = crc32_1(state.check, hbuf, 2, 0);
			}
			hold = 0;
			bits = 0;
			state.mode = TIME;
		case TIME:
			while (bits < 32) {
				if (have === 0) break inf_leave;
				have--;
				hold += input[next++] << bits;
				bits += 8;
			}
			if (state.head) state.head.time = hold;
			if (state.flags & 512 && state.wrap & 4) {
				hbuf[0] = hold & 255;
				hbuf[1] = hold >>> 8 & 255;
				hbuf[2] = hold >>> 16 & 255;
				hbuf[3] = hold >>> 24 & 255;
				state.check = crc32_1(state.check, hbuf, 4, 0);
			}
			hold = 0;
			bits = 0;
			state.mode = OS;
		case OS:
			while (bits < 16) {
				if (have === 0) break inf_leave;
				have--;
				hold += input[next++] << bits;
				bits += 8;
			}
			if (state.head) {
				state.head.xflags = hold & 255;
				state.head.os = hold >> 8;
			}
			if (state.flags & 512 && state.wrap & 4) {
				hbuf[0] = hold & 255;
				hbuf[1] = hold >>> 8 & 255;
				state.check = crc32_1(state.check, hbuf, 2, 0);
			}
			hold = 0;
			bits = 0;
			state.mode = EXLEN;
		case EXLEN:
			if (state.flags & 1024) {
				while (bits < 16) {
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				state.length = hold;
				if (state.head) state.head.extra_len = hold;
				if (state.flags & 512 && state.wrap & 4) {
					hbuf[0] = hold & 255;
					hbuf[1] = hold >>> 8 & 255;
					state.check = crc32_1(state.check, hbuf, 2, 0);
				}
				hold = 0;
				bits = 0;
			} else if (state.head) state.head.extra = null;
			state.mode = EXTRA;
		case EXTRA:
			if (state.flags & 1024) {
				copy = state.length;
				if (copy > have) copy = have;
				if (copy) {
					if (state.head) {
						len = state.head.extra_len - state.length;
						if (!state.head.extra) state.head.extra = new Uint8Array(state.head.extra_len);
						state.head.extra.set(input.subarray(next, next + copy), len);
					}
					if (state.flags & 512 && state.wrap & 4) state.check = crc32_1(state.check, input, copy, next);
					have -= copy;
					next += copy;
					state.length -= copy;
				}
				if (state.length) break inf_leave;
			}
			state.length = 0;
			state.mode = NAME;
		case NAME:
			if (state.flags & 2048) {
				if (have === 0) break inf_leave;
				copy = 0;
				do {
					len = input[next + copy++];
					if (state.head && len && state.length < 65536) state.head.name += String.fromCharCode(len);
				} while (len && copy < have);
				if (state.flags & 512 && state.wrap & 4) state.check = crc32_1(state.check, input, copy, next);
				have -= copy;
				next += copy;
				if (len) break inf_leave;
			} else if (state.head) state.head.name = null;
			state.length = 0;
			state.mode = COMMENT;
		case COMMENT:
			if (state.flags & 4096) {
				if (have === 0) break inf_leave;
				copy = 0;
				do {
					len = input[next + copy++];
					if (state.head && len && state.length < 65536) state.head.comment += String.fromCharCode(len);
				} while (len && copy < have);
				if (state.flags & 512 && state.wrap & 4) state.check = crc32_1(state.check, input, copy, next);
				have -= copy;
				next += copy;
				if (len) break inf_leave;
			} else if (state.head) state.head.comment = null;
			state.mode = HCRC;
		case HCRC:
			if (state.flags & 512) {
				while (bits < 16) {
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				if (state.wrap & 4 && hold !== (state.check & 65535)) {
					strm.msg = "header crc mismatch";
					state.mode = BAD;
					break;
				}
				hold = 0;
				bits = 0;
			}
			if (state.head) {
				state.head.hcrc = state.flags >> 9 & 1;
				state.head.done = true;
			}
			strm.adler = state.check = 0;
			state.mode = TYPE;
			break;
		case DICTID:
			while (bits < 32) {
				if (have === 0) break inf_leave;
				have--;
				hold += input[next++] << bits;
				bits += 8;
			}
			strm.adler = state.check = zswap32(hold);
			hold = 0;
			bits = 0;
			state.mode = DICT;
		case DICT:
			if (state.havedict === 0) {
				strm.next_out = put;
				strm.avail_out = left;
				strm.next_in = next;
				strm.avail_in = have;
				state.hold = hold;
				state.bits = bits;
				return Z_NEED_DICT$1;
			}
			strm.adler = state.check = 1;
			state.mode = TYPE;
		case TYPE: if (flush === Z_BLOCK || flush === Z_TREES) break inf_leave;
		case TYPEDO:
			if (state.last) {
				hold >>>= bits & 7;
				bits -= bits & 7;
				state.mode = CHECK;
				break;
			}
			while (bits < 3) {
				if (have === 0) break inf_leave;
				have--;
				hold += input[next++] << bits;
				bits += 8;
			}
			state.last = hold & 1;
			hold >>>= 1;
			bits -= 1;
			switch (hold & 3) {
				case 0:
					state.mode = STORED;
					break;
				case 1:
					fixedtables(state);
					state.mode = LEN_;
					if (flush === Z_TREES) {
						hold >>>= 2;
						bits -= 2;
						break inf_leave;
					}
					break;
				case 2:
					state.mode = TABLE;
					break;
				case 3:
					strm.msg = "invalid block type";
					state.mode = BAD;
			}
			hold >>>= 2;
			bits -= 2;
			break;
		case STORED:
			hold >>>= bits & 7;
			bits -= bits & 7;
			while (bits < 32) {
				if (have === 0) break inf_leave;
				have--;
				hold += input[next++] << bits;
				bits += 8;
			}
			if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
				strm.msg = "invalid stored block lengths";
				state.mode = BAD;
				break;
			}
			state.length = hold & 65535;
			hold = 0;
			bits = 0;
			state.mode = COPY_;
			if (flush === Z_TREES) break inf_leave;
		case COPY_: state.mode = COPY;
		case COPY:
			copy = state.length;
			if (copy) {
				if (copy > have) copy = have;
				if (copy > left) copy = left;
				if (copy === 0) break inf_leave;
				output.set(input.subarray(next, next + copy), put);
				have -= copy;
				next += copy;
				left -= copy;
				put += copy;
				state.length -= copy;
				break;
			}
			state.mode = TYPE;
			break;
		case TABLE:
			while (bits < 14) {
				if (have === 0) break inf_leave;
				have--;
				hold += input[next++] << bits;
				bits += 8;
			}
			state.nlen = (hold & 31) + 257;
			hold >>>= 5;
			bits -= 5;
			state.ndist = (hold & 31) + 1;
			hold >>>= 5;
			bits -= 5;
			state.ncode = (hold & 15) + 4;
			hold >>>= 4;
			bits -= 4;
			if (state.nlen > 286 || state.ndist > 30) {
				strm.msg = "too many length or distance symbols";
				state.mode = BAD;
				break;
			}
			state.have = 0;
			state.mode = LENLENS;
		case LENLENS:
			while (state.have < state.ncode) {
				while (bits < 3) {
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				state.lens[order[state.have++]] = hold & 7;
				hold >>>= 3;
				bits -= 3;
			}
			while (state.have < 19) state.lens[order[state.have++]] = 0;
			state.lencode = state.lendyn;
			state.lenbits = 7;
			opts = { bits: state.lenbits };
			ret = inftrees(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
			state.lenbits = opts.bits;
			if (ret) {
				strm.msg = "invalid code lengths set";
				state.mode = BAD;
				break;
			}
			state.have = 0;
			state.mode = CODELENS;
		case CODELENS:
			while (state.have < state.nlen + state.ndist) {
				for (;;) {
					here = state.lencode[hold & (1 << state.lenbits) - 1];
					here_bits = here >>> 24;
					here_op = here >>> 16 & 255;
					here_val = here & 65535;
					if (here_bits <= bits) break;
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				if (here_val < 16) {
					hold >>>= here_bits;
					bits -= here_bits;
					state.lens[state.have++] = here_val;
				} else {
					if (here_val === 16) {
						n = here_bits + 2;
						while (bits < n) {
							if (have === 0) break inf_leave;
							have--;
							hold += input[next++] << bits;
							bits += 8;
						}
						hold >>>= here_bits;
						bits -= here_bits;
						if (state.have === 0) {
							strm.msg = "invalid bit length repeat";
							state.mode = BAD;
							break;
						}
						len = state.lens[state.have - 1];
						copy = 3 + (hold & 3);
						hold >>>= 2;
						bits -= 2;
					} else if (here_val === 17) {
						n = here_bits + 3;
						while (bits < n) {
							if (have === 0) break inf_leave;
							have--;
							hold += input[next++] << bits;
							bits += 8;
						}
						hold >>>= here_bits;
						bits -= here_bits;
						len = 0;
						copy = 3 + (hold & 7);
						hold >>>= 3;
						bits -= 3;
					} else {
						n = here_bits + 7;
						while (bits < n) {
							if (have === 0) break inf_leave;
							have--;
							hold += input[next++] << bits;
							bits += 8;
						}
						hold >>>= here_bits;
						bits -= here_bits;
						len = 0;
						copy = 11 + (hold & 127);
						hold >>>= 7;
						bits -= 7;
					}
					if (state.have + copy > state.nlen + state.ndist) {
						strm.msg = "invalid bit length repeat";
						state.mode = BAD;
						break;
					}
					while (copy--) state.lens[state.have++] = len;
				}
			}
			if (state.mode === BAD) break;
			if (state.lens[256] === 0) {
				strm.msg = "invalid code -- missing end-of-block";
				state.mode = BAD;
				break;
			}
			state.lenbits = 9;
			opts = { bits: state.lenbits };
			ret = inftrees(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
			state.lenbits = opts.bits;
			if (ret) {
				strm.msg = "invalid literal/lengths set";
				state.mode = BAD;
				break;
			}
			state.distbits = 6;
			state.distcode = state.distdyn;
			opts = { bits: state.distbits };
			ret = inftrees(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
			state.distbits = opts.bits;
			if (ret) {
				strm.msg = "invalid distances set";
				state.mode = BAD;
				break;
			}
			state.mode = LEN_;
			if (flush === Z_TREES) break inf_leave;
		case LEN_: state.mode = LEN;
		case LEN:
			if (have >= 6 && left >= 258) {
				strm.next_out = put;
				strm.avail_out = left;
				strm.next_in = next;
				strm.avail_in = have;
				state.hold = hold;
				state.bits = bits;
				inffast(strm, _out);
				put = strm.next_out;
				output = strm.output;
				left = strm.avail_out;
				next = strm.next_in;
				input = strm.input;
				have = strm.avail_in;
				hold = state.hold;
				bits = state.bits;
				if (state.mode === TYPE) state.back = -1;
				break;
			}
			state.back = 0;
			for (;;) {
				here = state.lencode[hold & (1 << state.lenbits) - 1];
				here_bits = here >>> 24;
				here_op = here >>> 16 & 255;
				here_val = here & 65535;
				if (here_bits <= bits) break;
				if (have === 0) break inf_leave;
				have--;
				hold += input[next++] << bits;
				bits += 8;
			}
			if (here_op && (here_op & 240) === 0) {
				last_bits = here_bits;
				last_op = here_op;
				last_val = here_val;
				for (;;) {
					here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
					here_bits = here >>> 24;
					here_op = here >>> 16 & 255;
					here_val = here & 65535;
					if (last_bits + here_bits <= bits) break;
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				hold >>>= last_bits;
				bits -= last_bits;
				state.back += last_bits;
			}
			hold >>>= here_bits;
			bits -= here_bits;
			state.back += here_bits;
			state.length = here_val;
			if (here_op === 0) {
				state.mode = LIT;
				break;
			}
			if (here_op & 32) {
				state.back = -1;
				state.mode = TYPE;
				break;
			}
			if (here_op & 64) {
				strm.msg = "invalid literal/length code";
				state.mode = BAD;
				break;
			}
			state.extra = here_op & 15;
			state.mode = LENEXT;
		case LENEXT:
			if (state.extra) {
				n = state.extra;
				while (bits < n) {
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				state.length += hold & (1 << state.extra) - 1;
				hold >>>= state.extra;
				bits -= state.extra;
				state.back += state.extra;
			}
			state.was = state.length;
			state.mode = DIST;
		case DIST:
			for (;;) {
				here = state.distcode[hold & (1 << state.distbits) - 1];
				here_bits = here >>> 24;
				here_op = here >>> 16 & 255;
				here_val = here & 65535;
				if (here_bits <= bits) break;
				if (have === 0) break inf_leave;
				have--;
				hold += input[next++] << bits;
				bits += 8;
			}
			if ((here_op & 240) === 0) {
				last_bits = here_bits;
				last_op = here_op;
				last_val = here_val;
				for (;;) {
					here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
					here_bits = here >>> 24;
					here_op = here >>> 16 & 255;
					here_val = here & 65535;
					if (last_bits + here_bits <= bits) break;
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				hold >>>= last_bits;
				bits -= last_bits;
				state.back += last_bits;
			}
			hold >>>= here_bits;
			bits -= here_bits;
			state.back += here_bits;
			if (here_op & 64) {
				strm.msg = "invalid distance code";
				state.mode = BAD;
				break;
			}
			state.offset = here_val;
			state.extra = here_op & 15;
			state.mode = DISTEXT;
		case DISTEXT:
			if (state.extra) {
				n = state.extra;
				while (bits < n) {
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				state.offset += hold & (1 << state.extra) - 1;
				hold >>>= state.extra;
				bits -= state.extra;
				state.back += state.extra;
			}
			if (state.offset > state.dmax) {
				strm.msg = "invalid distance too far back";
				state.mode = BAD;
				break;
			}
			state.mode = MATCH;
		case MATCH:
			if (left === 0) break inf_leave;
			copy = _out - left;
			if (state.offset > copy) {
				copy = state.offset - copy;
				if (copy > state.whave) {
					if (state.sane) {
						strm.msg = "invalid distance too far back";
						state.mode = BAD;
						break;
					}
				}
				if (copy > state.wnext) {
					copy -= state.wnext;
					from = state.wsize - copy;
				} else from = state.wnext - copy;
				if (copy > state.length) copy = state.length;
				from_source = state.window;
			} else {
				from_source = output;
				from = put - state.offset;
				copy = state.length;
			}
			if (copy > left) copy = left;
			left -= copy;
			state.length -= copy;
			do
				output[put++] = from_source[from++];
			while (--copy);
			if (state.length === 0) state.mode = LEN;
			break;
		case LIT:
			if (left === 0) break inf_leave;
			output[put++] = state.length;
			left--;
			state.mode = LEN;
			break;
		case CHECK:
			if (state.wrap) {
				while (bits < 32) {
					if (have === 0) break inf_leave;
					have--;
					hold |= input[next++] << bits;
					bits += 8;
				}
				_out -= left;
				strm.total_out += _out;
				state.total += _out;
				if (state.wrap & 4 && _out) strm.adler = state.check = state.flags ? crc32_1(state.check, output, _out, put - _out) : adler32_1(state.check, output, _out, put - _out);
				_out = left;
				if (state.wrap & 4 && (state.flags ? hold : zswap32(hold)) !== state.check) {
					strm.msg = "incorrect data check";
					state.mode = BAD;
					break;
				}
				hold = 0;
				bits = 0;
			}
			state.mode = LENGTH;
		case LENGTH:
			if (state.wrap && state.flags) {
				while (bits < 32) {
					if (have === 0) break inf_leave;
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				if (state.wrap & 4 && hold !== (state.total & 4294967295)) {
					strm.msg = "incorrect length check";
					state.mode = BAD;
					break;
				}
				hold = 0;
				bits = 0;
			}
			state.mode = DONE;
		case DONE:
			ret = Z_STREAM_END$1;
			break inf_leave;
		case BAD:
			ret = Z_DATA_ERROR$1;
			break inf_leave;
		case MEM: return Z_MEM_ERROR$1;
		case SYNC:
		default: return Z_STREAM_ERROR$1;
	}
	strm.next_out = put;
	strm.avail_out = left;
	strm.next_in = next;
	strm.avail_in = have;
	state.hold = hold;
	state.bits = bits;
	if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH$1)) {
		if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out));
	}
	_in -= strm.avail_in;
	_out -= strm.avail_out;
	strm.total_in += _in;
	strm.total_out += _out;
	state.total += _out;
	if (state.wrap & 4 && _out) strm.adler = state.check = state.flags ? crc32_1(state.check, output, _out, strm.next_out - _out) : adler32_1(state.check, output, _out, strm.next_out - _out);
	strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
	if ((_in === 0 && _out === 0 || flush === Z_FINISH$1) && ret === Z_OK$1) ret = Z_BUF_ERROR$1;
	return ret;
};
const inflateEnd = (strm) => {
	if (inflateStateCheck(strm)) return Z_STREAM_ERROR$1;
	let state = strm.state;
	if (state.window) state.window = null;
	strm.state = null;
	return Z_OK$1;
};
const inflateGetHeader = (strm, head) => {
	if (inflateStateCheck(strm)) return Z_STREAM_ERROR$1;
	const state = strm.state;
	if ((state.wrap & 2) === 0) return Z_STREAM_ERROR$1;
	state.head = head;
	head.done = false;
	return Z_OK$1;
};
const inflateSetDictionary = (strm, dictionary) => {
	const dictLength = dictionary.length;
	let state;
	let dictid;
	let ret;
	if (inflateStateCheck(strm)) return Z_STREAM_ERROR$1;
	state = strm.state;
	if (state.wrap !== 0 && state.mode !== DICT) return Z_STREAM_ERROR$1;
	if (state.mode === DICT) {
		dictid = 1;
		dictid = adler32_1(dictid, dictionary, dictLength, 0);
		if (dictid !== state.check) return Z_DATA_ERROR$1;
	}
	ret = updatewindow(strm, dictionary, dictLength, dictLength);
	if (ret) {
		state.mode = MEM;
		return Z_MEM_ERROR$1;
	}
	state.havedict = 1;
	return Z_OK$1;
};
var inflate_1$2 = {
	inflateReset,
	inflateReset2,
	inflateResetKeep,
	inflateInit,
	inflateInit2,
	inflate: inflate$2,
	inflateEnd,
	inflateGetHeader,
	inflateSetDictionary,
	inflateInfo: "pako inflate (from Nodeca project)"
};
function GZheader() {
	this.text = 0;
	this.time = 0;
	this.xflags = 0;
	this.os = 0;
	this.extra = null;
	this.extra_len = 0;
	this.name = "";
	this.comment = "";
	this.hcrc = 0;
	this.done = false;
}
var gzheader = GZheader;
const toString = Object.prototype.toString;
const { Z_NO_FLUSH, Z_FINISH, Z_OK, Z_STREAM_END, Z_NEED_DICT, Z_STREAM_ERROR, Z_DATA_ERROR, Z_MEM_ERROR, Z_BUF_ERROR } = constants$2;
const defaultOptions = {
	chunkSize: 1024 * 64,
	windowBits: 15,
	to: ""
};
/**
* class Inflate
*
* Generic JS-style wrapper for zlib calls. If you don't need
* streaming behaviour - use more simple functions: [[inflate]]
* and [[inflateRaw]].
**/
/**
* Inflate.result -> Uint8Array|String
*
* Uncompressed result, generated by default [[Inflate#onData]]
* and [[Inflate#onEnd]] handlers. Filled after you push last chunk
* (call [[Inflate#push]] with `Z_FINISH` / `true` param).
**/
/**
* Inflate.err -> Number
*
* Error code after inflate finished. 0 (Z_OK) on success.
* Should be checked if broken data possible.
**/
/**
* Inflate.msg -> String
*
* Error message, if [[Inflate.err]] != 0
**/
/**
* new Inflate(options)
* - options (Object): zlib inflate options.
*
* Creates new inflator instance with specified params. Throws exception
* on bad params. Supported options:
*
* - `windowBits`
* - `dictionary`
*
* [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
* for more information on these.
*
* Additional options, for internal needs:
*
* - `chunkSize` - size of generated data chunks (16K by default)
* - `raw` (Boolean) - do raw inflate
* - `to` (String) - if equal to 'string', then result will be converted
*   from utf8 to utf16 (javascript) string. When string output requested,
*   chunk length can differ from `chunkSize`, depending on content.
*
* By default, when no options set, autodetect deflate/gzip data format via
* wrapper header.
*
* ##### Example:
*
* ```javascript
* const pako = require('pako')
* const chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
* const chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
*
* const inflate = new pako.Inflate({ level: 3});
*
* inflate.push(chunk1, false);
* inflate.push(chunk2, true);  // true -> last chunk
*
* if (inflate.err) { throw new Error(inflate.err); }
*
* console.log(inflate.result);
* ```
**/
function Inflate$1(options) {
	this.options = common.assign({}, defaultOptions, options || {});
	const opt = this.options;
	if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
		opt.windowBits = -opt.windowBits;
		if (opt.windowBits === 0) opt.windowBits = -15;
	}
	if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) opt.windowBits += 32;
	if (opt.windowBits > 15 && opt.windowBits < 48) {
		if ((opt.windowBits & 15) === 0) opt.windowBits |= 15;
	}
	this.err = 0;
	this.msg = "";
	this.ended = false;
	this.chunks = [];
	this.strm = new zstream();
	this.strm.avail_out = 0;
	let status = inflate_1$2.inflateInit2(this.strm, opt.windowBits);
	if (status !== Z_OK) throw new Error(messages[status]);
	this.header = new gzheader();
	inflate_1$2.inflateGetHeader(this.strm, this.header);
	if (opt.dictionary) {
		if (typeof opt.dictionary === "string") opt.dictionary = strings.string2buf(opt.dictionary);
		else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") opt.dictionary = new Uint8Array(opt.dictionary);
		if (opt.raw) {
			status = inflate_1$2.inflateSetDictionary(this.strm, opt.dictionary);
			if (status !== Z_OK) throw new Error(messages[status]);
		}
	}
}
/**
* Inflate#push(data[, flush_mode]) -> Boolean
* - data (Uint8Array|ArrayBuffer): input data
* - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE
*   flush modes. See constants. Skipped or `false` means Z_NO_FLUSH,
*   `true` means Z_FINISH.
*
* Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
* new output chunks. Returns `true` on success. If end of stream detected,
* [[Inflate#onEnd]] will be called.
*
* `flush_mode` is not needed for normal operation, because end of stream
* detected automatically. You may try to use it for advanced things, but
* this functionality was not tested.
*
* On fail call [[Inflate#onEnd]] with error code and return false.
*
* ##### Example
*
* ```javascript
* push(chunk, false); // push one of data chunks
* ...
* push(chunk, true);  // push last chunk
* ```
**/
Inflate$1.prototype.push = function(data, flush_mode) {
	const strm = this.strm;
	const chunkSize = this.options.chunkSize;
	const dictionary = this.options.dictionary;
	let status, _flush_mode, last_avail_out;
	if (this.ended) return false;
	if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
	else _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;
	if (toString.call(data) === "[object ArrayBuffer]") strm.input = new Uint8Array(data);
	else strm.input = data;
	strm.next_in = 0;
	strm.avail_in = strm.input.length;
	for (;;) {
		if (strm.avail_out === 0) {
			strm.output = new Uint8Array(chunkSize);
			strm.next_out = 0;
			strm.avail_out = chunkSize;
		}
		status = inflate_1$2.inflate(strm, _flush_mode);
		if (status === Z_NEED_DICT && dictionary) {
			status = inflate_1$2.inflateSetDictionary(strm, dictionary);
			if (status === Z_OK) status = inflate_1$2.inflate(strm, _flush_mode);
			else if (status === Z_DATA_ERROR) status = Z_NEED_DICT;
		}
		while (strm.avail_in > 0 && status === Z_STREAM_END && strm.state.wrap & 2 && strm.state.flags !== 0 && strm.input[strm.next_in] !== 0) {
			inflate_1$2.inflateReset(strm);
			status = inflate_1$2.inflate(strm, _flush_mode);
		}
		switch (status) {
			case Z_STREAM_ERROR:
			case Z_DATA_ERROR:
			case Z_NEED_DICT:
			case Z_MEM_ERROR:
				this.onEnd(status);
				this.ended = true;
				return false;
		}
		last_avail_out = strm.avail_out;
		if (strm.next_out) {
			if (strm.avail_out === 0 || status === Z_STREAM_END || _flush_mode > 0) if (this.options.to === "string") {
				let next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
				let tail = strm.next_out - next_out_utf8;
				let utf8str = strings.buf2string(strm.output, next_out_utf8);
				strm.next_out = tail;
				strm.avail_out = chunkSize - tail;
				if (tail) strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);
				this.onData(utf8str);
			} else {
				this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
				strm.avail_out = 0;
				strm.next_out = 0;
			}
		}
		if ((status === Z_OK || status === Z_BUF_ERROR) && last_avail_out === 0) continue;
		if (status === Z_STREAM_END) {
			status = inflate_1$2.inflateEnd(this.strm);
			this.onEnd(status);
			this.ended = true;
			return true;
		}
		if (strm.avail_in === 0) {
			if (_flush_mode === Z_FINISH) {
				status = inflate_1$2.inflateEnd(this.strm);
				this.onEnd(status === Z_OK ? Z_BUF_ERROR : status);
				this.ended = true;
				return false;
			}
			break;
		}
	}
	return true;
};
/**
* Inflate#onData(chunk) -> Void
* - chunk (Uint8Array|String): output data. When string output requested,
*   each chunk will be string.
*
* By default, stores data blocks in `chunks[]` property and glue
* those in `onEnd`. Override this handler, if you need another behaviour.
**/
Inflate$1.prototype.onData = function(chunk) {
	this.chunks.push(chunk);
};
/**
* Inflate#onEnd(status) -> Void
* - status (Number): inflate status. 0 (Z_OK) on success,
*   other if not.
*
* Called either after you tell inflate that the input stream is
* complete (Z_FINISH). By default - join collected chunks,
* free memory and fill `results` / `err` properties.
**/
Inflate$1.prototype.onEnd = function(status) {
	if (status === Z_OK) if (this.options.to === "string") this.result = this.chunks.join("");
	else this.result = common.flattenChunks(this.chunks);
	this.chunks = [];
	this.err = status;
	this.msg = this.strm.msg;
};
/**
* inflate(data[, options]) -> Uint8Array|String
* - data (Uint8Array|ArrayBuffer): input data to decompress.
* - options (Object): zlib inflate options.
*
* Decompress `data` with inflate/ungzip and `options`. Autodetect
* format via wrapper header by default. That's why we don't provide
* separate `ungzip` method.
*
* Supported options are:
*
* - windowBits
*
* [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
* for more information.
*
* Sugar (options):
*
* - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
*   negative windowBits implicitly.
* - `to` (String) - if equal to 'string', then result will be converted
*   from utf8 to utf16 (javascript) string. When string output requested,
*   chunk length can differ from `chunkSize`, depending on content.
*
*
* ##### Example:
*
* ```javascript
* const pako = require('pako');
* const input = pako.deflate(new Uint8Array([1,2,3,4,5,6,7,8,9]));
* let output;
*
* try {
*   output = pako.inflate(input);
* } catch (err) {
*   console.log(err);
* }
* ```
**/
function inflate$1(input, options) {
	const inflator = new Inflate$1(options);
	inflator.push(input, true);
	if (inflator.err) throw inflator.msg || messages[inflator.err];
	return inflator.result;
}
/**
* inflateRaw(data[, options]) -> Uint8Array|String
* - data (Uint8Array|ArrayBuffer): input data to decompress.
* - options (Object): zlib inflate options.
*
* The same as [[inflate]], but creates raw data, without wrapper
* (header and adler32 crc).
**/
function inflateRaw$1(input, options) {
	options = options || {};
	options.raw = true;
	return inflate$1(input, options);
}
var inflate_1$1 = {
	Inflate: Inflate$1,
	inflate: inflate$1,
	inflateRaw: inflateRaw$1,
	ungzip: inflate$1,
	constants: constants$2
};
const { Deflate, deflate, deflateRaw, gzip } = deflate_1$1;
const { Inflate, inflate, inflateRaw, ungzip } = inflate_1$1;
var pako = {
	Deflate,
	deflate,
	deflateRaw,
	gzip,
	Inflate,
	inflate,
	inflateRaw,
	ungzip,
	constants: constants$2
};
//#endregion
//#region node_modules/zca-js/dist/context.js
var import_spark_md5 = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(factory) {
		if (typeof exports === "object") module.exports = factory();
		else if (typeof define === "function" && define.amd) define(factory);
		else {
			var glob;
			try {
				glob = window;
			} catch (e) {
				glob = self;
			}
			glob.SparkMD5 = factory();
		}
	})(function(undefined) {
		"use strict";
		var hex_chr = [
			"0",
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
			"9",
			"a",
			"b",
			"c",
			"d",
			"e",
			"f"
		];
		function md5cycle(x, k) {
			var a = x[0], b = x[1], c = x[2], d = x[3];
			a += (b & c | ~b & d) + k[0] - 680876936 | 0;
			a = (a << 7 | a >>> 25) + b | 0;
			d += (a & b | ~a & c) + k[1] - 389564586 | 0;
			d = (d << 12 | d >>> 20) + a | 0;
			c += (d & a | ~d & b) + k[2] + 606105819 | 0;
			c = (c << 17 | c >>> 15) + d | 0;
			b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
			b = (b << 22 | b >>> 10) + c | 0;
			a += (b & c | ~b & d) + k[4] - 176418897 | 0;
			a = (a << 7 | a >>> 25) + b | 0;
			d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
			d = (d << 12 | d >>> 20) + a | 0;
			c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
			c = (c << 17 | c >>> 15) + d | 0;
			b += (c & d | ~c & a) + k[7] - 45705983 | 0;
			b = (b << 22 | b >>> 10) + c | 0;
			a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
			a = (a << 7 | a >>> 25) + b | 0;
			d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
			d = (d << 12 | d >>> 20) + a | 0;
			c += (d & a | ~d & b) + k[10] - 42063 | 0;
			c = (c << 17 | c >>> 15) + d | 0;
			b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
			b = (b << 22 | b >>> 10) + c | 0;
			a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
			a = (a << 7 | a >>> 25) + b | 0;
			d += (a & b | ~a & c) + k[13] - 40341101 | 0;
			d = (d << 12 | d >>> 20) + a | 0;
			c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
			c = (c << 17 | c >>> 15) + d | 0;
			b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
			b = (b << 22 | b >>> 10) + c | 0;
			a += (b & d | c & ~d) + k[1] - 165796510 | 0;
			a = (a << 5 | a >>> 27) + b | 0;
			d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
			d = (d << 9 | d >>> 23) + a | 0;
			c += (d & b | a & ~b) + k[11] + 643717713 | 0;
			c = (c << 14 | c >>> 18) + d | 0;
			b += (c & a | d & ~a) + k[0] - 373897302 | 0;
			b = (b << 20 | b >>> 12) + c | 0;
			a += (b & d | c & ~d) + k[5] - 701558691 | 0;
			a = (a << 5 | a >>> 27) + b | 0;
			d += (a & c | b & ~c) + k[10] + 38016083 | 0;
			d = (d << 9 | d >>> 23) + a | 0;
			c += (d & b | a & ~b) + k[15] - 660478335 | 0;
			c = (c << 14 | c >>> 18) + d | 0;
			b += (c & a | d & ~a) + k[4] - 405537848 | 0;
			b = (b << 20 | b >>> 12) + c | 0;
			a += (b & d | c & ~d) + k[9] + 568446438 | 0;
			a = (a << 5 | a >>> 27) + b | 0;
			d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
			d = (d << 9 | d >>> 23) + a | 0;
			c += (d & b | a & ~b) + k[3] - 187363961 | 0;
			c = (c << 14 | c >>> 18) + d | 0;
			b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
			b = (b << 20 | b >>> 12) + c | 0;
			a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
			a = (a << 5 | a >>> 27) + b | 0;
			d += (a & c | b & ~c) + k[2] - 51403784 | 0;
			d = (d << 9 | d >>> 23) + a | 0;
			c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
			c = (c << 14 | c >>> 18) + d | 0;
			b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
			b = (b << 20 | b >>> 12) + c | 0;
			a += (b ^ c ^ d) + k[5] - 378558 | 0;
			a = (a << 4 | a >>> 28) + b | 0;
			d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
			d = (d << 11 | d >>> 21) + a | 0;
			c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
			c = (c << 16 | c >>> 16) + d | 0;
			b += (c ^ d ^ a) + k[14] - 35309556 | 0;
			b = (b << 23 | b >>> 9) + c | 0;
			a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
			a = (a << 4 | a >>> 28) + b | 0;
			d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
			d = (d << 11 | d >>> 21) + a | 0;
			c += (d ^ a ^ b) + k[7] - 155497632 | 0;
			c = (c << 16 | c >>> 16) + d | 0;
			b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
			b = (b << 23 | b >>> 9) + c | 0;
			a += (b ^ c ^ d) + k[13] + 681279174 | 0;
			a = (a << 4 | a >>> 28) + b | 0;
			d += (a ^ b ^ c) + k[0] - 358537222 | 0;
			d = (d << 11 | d >>> 21) + a | 0;
			c += (d ^ a ^ b) + k[3] - 722521979 | 0;
			c = (c << 16 | c >>> 16) + d | 0;
			b += (c ^ d ^ a) + k[6] + 76029189 | 0;
			b = (b << 23 | b >>> 9) + c | 0;
			a += (b ^ c ^ d) + k[9] - 640364487 | 0;
			a = (a << 4 | a >>> 28) + b | 0;
			d += (a ^ b ^ c) + k[12] - 421815835 | 0;
			d = (d << 11 | d >>> 21) + a | 0;
			c += (d ^ a ^ b) + k[15] + 530742520 | 0;
			c = (c << 16 | c >>> 16) + d | 0;
			b += (c ^ d ^ a) + k[2] - 995338651 | 0;
			b = (b << 23 | b >>> 9) + c | 0;
			a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
			a = (a << 6 | a >>> 26) + b | 0;
			d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
			d = (d << 10 | d >>> 22) + a | 0;
			c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
			c = (c << 15 | c >>> 17) + d | 0;
			b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
			b = (b << 21 | b >>> 11) + c | 0;
			a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
			a = (a << 6 | a >>> 26) + b | 0;
			d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
			d = (d << 10 | d >>> 22) + a | 0;
			c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
			c = (c << 15 | c >>> 17) + d | 0;
			b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
			b = (b << 21 | b >>> 11) + c | 0;
			a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
			a = (a << 6 | a >>> 26) + b | 0;
			d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
			d = (d << 10 | d >>> 22) + a | 0;
			c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
			c = (c << 15 | c >>> 17) + d | 0;
			b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
			b = (b << 21 | b >>> 11) + c | 0;
			a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
			a = (a << 6 | a >>> 26) + b | 0;
			d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
			d = (d << 10 | d >>> 22) + a | 0;
			c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
			c = (c << 15 | c >>> 17) + d | 0;
			b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
			b = (b << 21 | b >>> 11) + c | 0;
			x[0] = a + x[0] | 0;
			x[1] = b + x[1] | 0;
			x[2] = c + x[2] | 0;
			x[3] = d + x[3] | 0;
		}
		function md5blk(s) {
			var md5blks = [], i;
			for (i = 0; i < 64; i += 4) md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
			return md5blks;
		}
		function md5blk_array(a) {
			var md5blks = [], i;
			for (i = 0; i < 64; i += 4) md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
			return md5blks;
		}
		function md51(s) {
			var n = s.length, state = [
				1732584193,
				-271733879,
				-1732584194,
				271733878
			], i, length, tail, tmp, lo, hi;
			for (i = 64; i <= n; i += 64) md5cycle(state, md5blk(s.substring(i - 64, i)));
			s = s.substring(i - 64);
			length = s.length;
			tail = [
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			];
			for (i = 0; i < length; i += 1) tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
			tail[i >> 2] |= 128 << (i % 4 << 3);
			if (i > 55) {
				md5cycle(state, tail);
				for (i = 0; i < 16; i += 1) tail[i] = 0;
			}
			tmp = n * 8;
			tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
			lo = parseInt(tmp[2], 16);
			hi = parseInt(tmp[1], 16) || 0;
			tail[14] = lo;
			tail[15] = hi;
			md5cycle(state, tail);
			return state;
		}
		function md51_array(a) {
			var n = a.length, state = [
				1732584193,
				-271733879,
				-1732584194,
				271733878
			], i, length, tail, tmp, lo, hi;
			for (i = 64; i <= n; i += 64) md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
			a = i - 64 < n ? a.subarray(i - 64) : /* @__PURE__ */ new Uint8Array(0);
			length = a.length;
			tail = [
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			];
			for (i = 0; i < length; i += 1) tail[i >> 2] |= a[i] << (i % 4 << 3);
			tail[i >> 2] |= 128 << (i % 4 << 3);
			if (i > 55) {
				md5cycle(state, tail);
				for (i = 0; i < 16; i += 1) tail[i] = 0;
			}
			tmp = n * 8;
			tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
			lo = parseInt(tmp[2], 16);
			hi = parseInt(tmp[1], 16) || 0;
			tail[14] = lo;
			tail[15] = hi;
			md5cycle(state, tail);
			return state;
		}
		function rhex(n) {
			var s = "", j;
			for (j = 0; j < 4; j += 1) s += hex_chr[n >> j * 8 + 4 & 15] + hex_chr[n >> j * 8 & 15];
			return s;
		}
		function hex(x) {
			var i;
			for (i = 0; i < x.length; i += 1) x[i] = rhex(x[i]);
			return x.join("");
		}
		if (hex(md51("hello")) !== "5d41402abc4b2a76b9719d911017c592");
		/**
		* ArrayBuffer slice polyfill.
		*
		* @see https://github.com/ttaubert/node-arraybuffer-slice
		*/
		if (typeof ArrayBuffer !== "undefined" && !ArrayBuffer.prototype.slice) (function() {
			function clamp(val, length) {
				val = val | 0 || 0;
				if (val < 0) return Math.max(val + length, 0);
				return Math.min(val, length);
			}
			ArrayBuffer.prototype.slice = function(from, to) {
				var length = this.byteLength, begin = clamp(from, length), end = length, num, target, targetArray, sourceArray;
				if (to !== undefined) end = clamp(to, length);
				if (begin > end) return /* @__PURE__ */ new ArrayBuffer(0);
				num = end - begin;
				target = new ArrayBuffer(num);
				targetArray = new Uint8Array(target);
				sourceArray = new Uint8Array(this, begin, num);
				targetArray.set(sourceArray);
				return target;
			};
		})();
		/**
		* Helpers.
		*/
		function toUtf8(str) {
			if (/[\u0080-\uFFFF]/.test(str)) str = unescape(encodeURIComponent(str));
			return str;
		}
		function utf8Str2ArrayBuffer(str, returnUInt8Array) {
			var length = str.length, buff = new ArrayBuffer(length), arr = new Uint8Array(buff), i;
			for (i = 0; i < length; i += 1) arr[i] = str.charCodeAt(i);
			return returnUInt8Array ? arr : buff;
		}
		function arrayBuffer2Utf8Str(buff) {
			return String.fromCharCode.apply(null, new Uint8Array(buff));
		}
		function concatenateArrayBuffers(first, second, returnUInt8Array) {
			var result = new Uint8Array(first.byteLength + second.byteLength);
			result.set(new Uint8Array(first));
			result.set(new Uint8Array(second), first.byteLength);
			return returnUInt8Array ? result : result.buffer;
		}
		function hexToBinaryString(hex) {
			var bytes = [], length = hex.length, x;
			for (x = 0; x < length - 1; x += 2) bytes.push(parseInt(hex.substr(x, 2), 16));
			return String.fromCharCode.apply(String, bytes);
		}
		/**
		* SparkMD5 OOP implementation.
		*
		* Use this class to perform an incremental md5, otherwise use the
		* static methods instead.
		*/
		function SparkMD5() {
			this.reset();
		}
		/**
		* Appends a string.
		* A conversion will be applied if an utf8 string is detected.
		*
		* @param {String} str The string to be appended
		*
		* @return {SparkMD5} The instance itself
		*/
		SparkMD5.prototype.append = function(str) {
			this.appendBinary(toUtf8(str));
			return this;
		};
		/**
		* Appends a binary string.
		*
		* @param {String} contents The binary string to be appended
		*
		* @return {SparkMD5} The instance itself
		*/
		SparkMD5.prototype.appendBinary = function(contents) {
			this._buff += contents;
			this._length += contents.length;
			var length = this._buff.length, i;
			for (i = 64; i <= length; i += 64) md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
			this._buff = this._buff.substring(i - 64);
			return this;
		};
		/**
		* Finishes the incremental computation, reseting the internal state and
		* returning the result.
		*
		* @param {Boolean} raw True to get the raw string, false to get the hex string
		*
		* @return {String} The result
		*/
		SparkMD5.prototype.end = function(raw) {
			var buff = this._buff, length = buff.length, i, tail = [
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			], ret;
			for (i = 0; i < length; i += 1) tail[i >> 2] |= buff.charCodeAt(i) << (i % 4 << 3);
			this._finish(tail, length);
			ret = hex(this._hash);
			if (raw) ret = hexToBinaryString(ret);
			this.reset();
			return ret;
		};
		/**
		* Resets the internal state of the computation.
		*
		* @return {SparkMD5} The instance itself
		*/
		SparkMD5.prototype.reset = function() {
			this._buff = "";
			this._length = 0;
			this._hash = [
				1732584193,
				-271733879,
				-1732584194,
				271733878
			];
			return this;
		};
		/**
		* Gets the internal state of the computation.
		*
		* @return {Object} The state
		*/
		SparkMD5.prototype.getState = function() {
			return {
				buff: this._buff,
				length: this._length,
				hash: this._hash.slice()
			};
		};
		/**
		* Gets the internal state of the computation.
		*
		* @param {Object} state The state
		*
		* @return {SparkMD5} The instance itself
		*/
		SparkMD5.prototype.setState = function(state) {
			this._buff = state.buff;
			this._length = state.length;
			this._hash = state.hash;
			return this;
		};
		/**
		* Releases memory used by the incremental buffer and other additional
		* resources. If you plan to use the instance again, use reset instead.
		*/
		SparkMD5.prototype.destroy = function() {
			delete this._hash;
			delete this._buff;
			delete this._length;
		};
		/**
		* Finish the final calculation based on the tail.
		*
		* @param {Array}  tail   The tail (will be modified)
		* @param {Number} length The length of the remaining buffer
		*/
		SparkMD5.prototype._finish = function(tail, length) {
			var i = length, tmp, lo, hi;
			tail[i >> 2] |= 128 << (i % 4 << 3);
			if (i > 55) {
				md5cycle(this._hash, tail);
				for (i = 0; i < 16; i += 1) tail[i] = 0;
			}
			tmp = this._length * 8;
			tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
			lo = parseInt(tmp[2], 16);
			hi = parseInt(tmp[1], 16) || 0;
			tail[14] = lo;
			tail[15] = hi;
			md5cycle(this._hash, tail);
		};
		/**
		* Performs the md5 hash on a string.
		* A conversion will be applied if utf8 string is detected.
		*
		* @param {String}  str The string
		* @param {Boolean} [raw] True to get the raw string, false to get the hex string
		*
		* @return {String} The result
		*/
		SparkMD5.hash = function(str, raw) {
			return SparkMD5.hashBinary(toUtf8(str), raw);
		};
		/**
		* Performs the md5 hash on a binary string.
		*
		* @param {String}  content The binary string
		* @param {Boolean} [raw]     True to get the raw string, false to get the hex string
		*
		* @return {String} The result
		*/
		SparkMD5.hashBinary = function(content, raw) {
			var ret = hex(md51(content));
			return raw ? hexToBinaryString(ret) : ret;
		};
		/**
		* SparkMD5 OOP implementation for array buffers.
		*
		* Use this class to perform an incremental md5 ONLY for array buffers.
		*/
		SparkMD5.ArrayBuffer = function() {
			this.reset();
		};
		/**
		* Appends an array buffer.
		*
		* @param {ArrayBuffer} arr The array to be appended
		*
		* @return {SparkMD5.ArrayBuffer} The instance itself
		*/
		SparkMD5.ArrayBuffer.prototype.append = function(arr) {
			var buff = concatenateArrayBuffers(this._buff.buffer, arr, true), length = buff.length, i;
			this._length += arr.byteLength;
			for (i = 64; i <= length; i += 64) md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
			this._buff = i - 64 < length ? new Uint8Array(buff.buffer.slice(i - 64)) : /* @__PURE__ */ new Uint8Array(0);
			return this;
		};
		/**
		* Finishes the incremental computation, reseting the internal state and
		* returning the result.
		*
		* @param {Boolean} raw True to get the raw string, false to get the hex string
		*
		* @return {String} The result
		*/
		SparkMD5.ArrayBuffer.prototype.end = function(raw) {
			var buff = this._buff, length = buff.length, tail = [
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			], i, ret;
			for (i = 0; i < length; i += 1) tail[i >> 2] |= buff[i] << (i % 4 << 3);
			this._finish(tail, length);
			ret = hex(this._hash);
			if (raw) ret = hexToBinaryString(ret);
			this.reset();
			return ret;
		};
		/**
		* Resets the internal state of the computation.
		*
		* @return {SparkMD5.ArrayBuffer} The instance itself
		*/
		SparkMD5.ArrayBuffer.prototype.reset = function() {
			this._buff = /* @__PURE__ */ new Uint8Array(0);
			this._length = 0;
			this._hash = [
				1732584193,
				-271733879,
				-1732584194,
				271733878
			];
			return this;
		};
		/**
		* Gets the internal state of the computation.
		*
		* @return {Object} The state
		*/
		SparkMD5.ArrayBuffer.prototype.getState = function() {
			var state = SparkMD5.prototype.getState.call(this);
			state.buff = arrayBuffer2Utf8Str(state.buff);
			return state;
		};
		/**
		* Gets the internal state of the computation.
		*
		* @param {Object} state The state
		*
		* @return {SparkMD5.ArrayBuffer} The instance itself
		*/
		SparkMD5.ArrayBuffer.prototype.setState = function(state) {
			state.buff = utf8Str2ArrayBuffer(state.buff, true);
			return SparkMD5.prototype.setState.call(this, state);
		};
		SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy;
		SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish;
		/**
		* Performs the md5 hash on an array buffer.
		*
		* @param {ArrayBuffer} arr The array buffer
		* @param {Boolean}     [raw] True to get the raw string, false to get the hex one
		*
		* @return {String} The result
		*/
		SparkMD5.ArrayBuffer.hash = function(arr, raw) {
			var ret = hex(md51_array(new Uint8Array(arr)));
			return raw ? hexToBinaryString(ret) : ret;
		};
		return SparkMD5;
	});
})))(), 1);
const _5_MINUTES = 300 * 1e3;
var CallbacksMap = class extends Map {
	/**
	* @param ttl Time to live in milliseconds. Default is 5 minutes.
	*/
	set(key, value, ttl = _5_MINUTES) {
		setTimeout(() => {
			this.delete(key);
		}, ttl);
		return super.set(key, value);
	}
};
const createContext = (apiType = 30, apiVersion = 671) => ({
	API_TYPE: apiType,
	API_VERSION: apiVersion,
	uploadCallbacks: new CallbacksMap(),
	options: {
		selfListen: false,
		checkUpdate: true,
		logging: true,
		polyfill: global.fetch
	},
	secretKey: null
});
function isContextSession(ctx) {
	return !!ctx.secretKey;
}
//#endregion
//#region node_modules/zca-js/dist/utils.js
const isBun = typeof Bun !== "undefined";
function hasOwn(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}
/**
* Get signed key for API requests.
*
* @param type
* @param params
* @returns MD5 hash
*
*/
function getSignKey(type, params) {
	const n = [];
	for (const s in params) if (hasOwn(params, s)) n.push(s);
	n.sort();
	let a = "zsecure" + type;
	for (let s = 0; s < n.length; s++) a += params[n[s]];
	return import_crypto_js.default.MD5(a).toString();
}
/**
*
* @param baseURL
* @param params
* @param apiVersion automatically add zalo api version to url params
* @returns
*
*/
function makeURL(ctx, baseURL, params = {}, apiVersion = true) {
	const url = new URL(baseURL);
	for (const key in params) if (hasOwn(params, key)) url.searchParams.append(key, params[key].toString());
	if (apiVersion) {
		if (!url.searchParams.has("zpw_ver")) url.searchParams.set("zpw_ver", ctx.API_VERSION.toString());
		if (!url.searchParams.has("zpw_type")) url.searchParams.set("zpw_type", ctx.API_TYPE.toString());
	}
	return url.toString();
}
var ParamsEncryptor = class ParamsEncryptor {
	constructor({ type, imei, firstLaunchTime }) {
		this.zcid = null;
		this.enc_ver = "v2";
		this.zcid = null;
		this.encryptKey = null;
		this.createZcid(type, imei, firstLaunchTime);
		this.zcid_ext = ParamsEncryptor.randomString();
		this.createEncryptKey();
	}
	getEncryptKey() {
		if (!this.encryptKey) throw new ZaloApiError("getEncryptKey: didn't create encryptKey yet");
		return this.encryptKey;
	}
	createZcid(type, imei, firstLaunchTime) {
		if (!type || !imei || !firstLaunchTime) throw new ZaloApiError("createZcid: missing params");
		const msg = `${type},${imei},${firstLaunchTime}`;
		const s = ParamsEncryptor.encodeAES("3FC4F0D2AB50057BCE0D90D9187A22B1", msg, "hex", true);
		this.zcid = s;
	}
	createEncryptKey(e = 0) {
		const t = (e, t) => {
			const { even: n } = ParamsEncryptor.processStr(e), { even: a, odd: s } = ParamsEncryptor.processStr(t);
			if (!n || !a || !s) return !1;
			const i = n.slice(0, 8).join("") + a.slice(0, 12).join("") + s.reverse().slice(0, 12).join("");
			return this.encryptKey = i, !0;
		};
		if (!this.zcid || !this.zcid_ext) throw new ZaloApiError("createEncryptKey: zcid or zcid_ext is null");
		try {
			if (t(import_crypto_js.default.MD5(this.zcid_ext).toString().toUpperCase(), this.zcid) || !(e < 3)) return !1;
			this.createEncryptKey(e + 1);
		} catch (_a) {
			if (e < 3) this.createEncryptKey(e + 1);
		}
		return !0;
	}
	getParams() {
		return this.zcid ? {
			zcid: this.zcid,
			zcid_ext: this.zcid_ext,
			enc_ver: this.enc_ver
		} : null;
	}
	static processStr(e) {
		if (!e || "string" != typeof e) return {
			even: null,
			odd: null
		};
		const [t, n] = [...e].reduce((e, t, n) => (e[n % 2].push(t), e), [[], []]);
		return {
			even: t,
			odd: n
		};
	}
	static randomString(e, t) {
		const n = e || 6;
		let s = Math.floor(Math.random() * ((t && e && t > e ? t : 12) - n + 1)) + n;
		if (s > 12) {
			let e = "";
			for (; s > 0;) {
				e += Math.random().toString(16).substr(2, s > 12 ? 12 : s);
				s -= 12;
			}
			return e;
		}
		return Math.random().toString(16).substr(2, s);
	}
	static encodeAES(e, message, type, uppercase, s = 0) {
		if (!message) return null;
		try {
			{
				const encoder = "hex" == type ? import_crypto_js.default.enc.Hex : import_crypto_js.default.enc.Base64;
				const key = import_crypto_js.default.enc.Utf8.parse(e);
				const encrypted = import_crypto_js.default.AES.encrypt(message, key, {
					iv: {
						words: [
							0,
							0,
							0,
							0
						],
						sigBytes: 16
					},
					mode: import_crypto_js.default.mode.CBC,
					padding: import_crypto_js.default.pad.Pkcs7
				}).ciphertext.toString(encoder);
				return uppercase ? encrypted.toUpperCase() : encrypted;
			}
		} catch (_a) {
			return s < 3 ? ParamsEncryptor.encodeAES(e, message, type, uppercase, s + 1) : null;
		}
	}
};
function decryptResp(key, data) {
	let n = null;
	try {
		n = decodeRespAES(key, data);
		return JSON.parse(n);
	} catch (_a) {
		return n;
	}
}
function decodeRespAES(key, data) {
	data = decodeURIComponent(data);
	const parsedKey = import_crypto_js.default.enc.Utf8.parse(key);
	return import_crypto_js.default.AES.decrypt({ ciphertext: import_crypto_js.default.enc.Base64.parse(data) }, parsedKey, {
		iv: {
			words: [
				0,
				0,
				0,
				0
			],
			sigBytes: 16
		},
		mode: import_crypto_js.default.mode.CBC,
		padding: import_crypto_js.default.pad.Pkcs7
	}).toString(import_crypto_js.default.enc.Utf8);
}
function decodeBase64ToBuffer(data) {
	return Buffer.from(data, "base64");
}
function decodeUnit8Array(data) {
	try {
		return new TextDecoder().decode(data);
	} catch (_a) {
		return null;
	}
}
function encodeAES(secretKey, data, t = 0) {
	try {
		const key = import_crypto_js.default.enc.Base64.parse(secretKey);
		return import_crypto_js.default.AES.encrypt(data, key, {
			iv: import_crypto_js.default.enc.Hex.parse("00000000000000000000000000000000"),
			mode: import_crypto_js.default.mode.CBC,
			padding: import_crypto_js.default.pad.Pkcs7
		}).ciphertext.toString(import_crypto_js.default.enc.Base64);
	} catch (_a) {
		return t < 3 ? encodeAES(secretKey, data, t + 1) : null;
	}
}
function decodeAES(secretKey, data, t = 0) {
	try {
		data = decodeURIComponent(data);
		const key = import_crypto_js.default.enc.Base64.parse(secretKey);
		return import_crypto_js.default.AES.decrypt({ ciphertext: import_crypto_js.default.enc.Base64.parse(data) }, key, {
			iv: import_crypto_js.default.enc.Hex.parse("00000000000000000000000000000000"),
			mode: import_crypto_js.default.mode.CBC,
			padding: import_crypto_js.default.pad.Pkcs7
		}).toString(import_crypto_js.default.enc.Utf8);
	} catch (_a) {
		return t < 3 ? decodeAES(secretKey, data, t + 1) : null;
	}
}
async function getDefaultHeaders(ctx, origin = "https://chat.zalo.me") {
	if (!ctx.cookie) throw new ZaloApiError("Cookie is not available");
	if (!ctx.userAgent) throw new ZaloApiError("User agent is not available");
	return {
		Accept: "application/json, text/plain, */*",
		"Accept-Encoding": "gzip, deflate, br, zstd",
		"Accept-Language": "en-US,en;q=0.9",
		"content-type": "application/x-www-form-urlencoded",
		Cookie: await ctx.cookie.getCookieString(origin),
		Origin: "https://chat.zalo.me",
		Referer: "https://chat.zalo.me/",
		"User-Agent": ctx.userAgent
	};
}
async function request(ctx, url, options, raw = false) {
	var _a, _b;
	if (!ctx.cookie) ctx.cookie = new import_cookie.CookieJar();
	const origin = new URL(url).origin;
	const defaultHeaders = await getDefaultHeaders(ctx, origin);
	if (!raw) if (options) options.headers = Object.assign(defaultHeaders, options.headers || {});
	else options = { headers: defaultHeaders };
	const _options = Object.assign(Object.assign({}, options !== null && options !== void 0 ? options : {}), isBun ? { proxy: (_b = (_a = ctx.options.agent) === null || _a === void 0 ? void 0 : _a.proxy) === null || _b === void 0 ? void 0 : _b.href } : { agent: ctx.options.agent });
	const response = await ctx.options.polyfill(url, _options);
	const setCookieRaw = response.headers.get("set-cookie");
	if (setCookieRaw && !raw) {
		let cookieStrings;
		if (typeof response.headers.getSetCookie === "function") cookieStrings = response.headers.getSetCookie();
		else cookieStrings = setCookieRaw.split(", ");
		for (const cookie of cookieStrings) {
			const parsed = import_cookie.Cookie.parse(cookie);
			try {
				if (parsed) await ctx.cookie.setCookie(parsed, parsed.domain != "zalo.me" ? `https://${parsed.domain}` : origin);
			} catch (error) {
				logger(ctx).error(error);
			}
		}
	}
	const redirectURL = response.headers.get("location");
	if (redirectURL) {
		const redirectOptions = Object.assign({}, options);
		redirectOptions.method = "GET";
		if (!raw) {
			redirectOptions.headers = new Headers(redirectOptions.headers);
			redirectOptions.headers.set("Referer", "https://id.zalo.me/");
		}
		return await request(ctx, redirectURL, redirectOptions);
	}
	return response;
}
async function getImageMetaData(ctx, filePath) {
	if (!ctx.options.imageMetadataGetter) throw new ZaloApiMissingImageMetadataGetter();
	const imageData = await ctx.options.imageMetadataGetter(filePath);
	if (!imageData) throw new ZaloApiError("Failed to get image metadata");
	return {
		fileName: filePath.split("/").pop(),
		totalSize: imageData.size,
		width: imageData.width,
		height: imageData.height
	};
}
async function getFileSize(filePath) {
	return fs.promises.stat(filePath).then((s) => s.size);
}
async function getGifMetaData(ctx, filePath) {
	if (!ctx.options.imageMetadataGetter) throw new ZaloApiMissingImageMetadataGetter();
	const gifData = await ctx.options.imageMetadataGetter(filePath);
	if (!gifData) throw new ZaloApiError("Failed to get gif metadata");
	return {
		fileName: path.basename(filePath),
		totalSize: gifData.size,
		width: gifData.width,
		height: gifData.height
	};
}
async function decodeEventData(parsed, cipherKey) {
	if (typeof parsed.data !== "string") throw new ZaloApiError(`Invalid data, expected string but got ${typeof parsed.data}`);
	if (typeof parsed.encrypt !== "number") throw new ZaloApiError(`Invalid encrypt type, expected number but got ${typeof parsed.encrypt}`);
	if (parsed.encrypt < 0 || parsed.encrypt > 3) throw new ZaloApiError(`Invalid encrypt type, expected 0-3 but got ${parsed.encrypt}`);
	const rawData = parsed.data;
	const encryptType = parsed.encrypt;
	if (encryptType === 0) return JSON.parse(rawData);
	const decodedBuffer = decodeBase64ToBuffer(encryptType === 1 ? rawData : decodeURIComponent(rawData));
	let decryptedBuffer = decodedBuffer;
	if (encryptType !== 1) if (cipherKey && decodedBuffer.length >= 48) {
		const algorithm = {
			name: "AES-GCM",
			iv: decodedBuffer.subarray(0, 16),
			tagLength: 128,
			additionalData: decodedBuffer.subarray(16, 32)
		};
		const dataSource = decodedBuffer.subarray(32);
		const cryptoKey = await crypto.subtle.importKey("raw", decodeBase64ToBuffer(cipherKey), algorithm, false, ["decrypt"]);
		decryptedBuffer = await crypto.subtle.decrypt(algorithm, cryptoKey, dataSource);
	} else throw new ZaloApiError("Invalid data length or missing cipher key");
	const decodedData = decodeUnit8Array(encryptType === 3 ? new Uint8Array(decryptedBuffer) : pako.inflate(decryptedBuffer));
	if (!decodedData) return;
	return import_json_bigint.default.parse(decodedData);
}
async function getMd5LargeFileObject(source, fileSize) {
	const buffer = typeof source == "string" ? await fs.promises.readFile(source) : source.data;
	return new Promise((resolve) => {
		let currentChunk = 0;
		const chunkSize = 2097152, chunks = Math.ceil(fileSize / chunkSize), spark = new import_spark_md5.default.ArrayBuffer();
		function loadNext() {
			const start = currentChunk * chunkSize, end = start + chunkSize >= fileSize ? fileSize : start + chunkSize;
			spark.append(new Uint8Array(buffer.subarray(start, end)).buffer);
			currentChunk++;
			if (currentChunk < chunks) loadNext();
			else resolve({
				currentChunk,
				data: spark.end()
			});
		}
		loadNext();
	});
}
const logger = (ctx) => ({
	verbose: (...args) => {
		if (ctx.options.logging) console.log("\x1B[35m🚀 VERBOSE\x1B[0m", ...args);
	},
	info: (...args) => {
		if (ctx.options.logging) console.log("\x1B[34mINFO\x1B[0m", ...args);
	},
	warn: (...args) => {
		if (ctx.options.logging) console.log("\x1B[33mWARN\x1B[0m", ...args);
	},
	error: (...args) => {
		if (ctx.options.logging) console.log("\x1B[31mERROR\x1B[0m", ...args);
	},
	success: (...args) => {
		if (ctx.options.logging) console.log("\x1B[32mSUCCESS\x1B[0m", ...args);
	},
	timestamp: (...args) => {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		if (ctx.options.logging) console.log(`\x1b[90m[${now}]\x1b[0m`, ...args);
	}
});
function getClientMessageType(msgType) {
	if (msgType === "webchat") return 1;
	if (msgType === "chat.voice") return 31;
	if (msgType === "chat.photo") return 32;
	if (msgType === "chat.sticker") return 36;
	if (msgType === "chat.doodle") return 37;
	if (msgType === "chat.recommended") return 38;
	if (msgType === "chat.link") return 38;
	if (msgType === "chat.video.msg") return 44;
	if (msgType === "share.file") return 46;
	if (msgType === "chat.gif") return 49;
	if (msgType === "chat.location.new") return 43;
	return 1;
}
function strPadLeft(e, t, n) {
	const a = (e = "" + e).length;
	return a === n ? e : a > n ? e.slice(-n) : t.repeat(n - a) + e;
}
function formatTime(format, timestamp = Date.now()) {
	const date = new Date(timestamp);
	const formatted = new Intl.DateTimeFormat("vi-VN", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	}).format(date);
	if (format.includes("%H") || format.includes("%d")) return format.replace("%H", date.getHours().toString().padStart(2, "0")).replace("%M", date.getMinutes().toString().padStart(2, "0")).replace("%S", date.getSeconds().toString().padStart(2, "0")).replace("%d", date.getDate().toString().padStart(2, "0")).replace("%m", (date.getMonth() + 1).toString().padStart(2, "0")).replace("%Y", date.getFullYear().toString());
	return formatted;
}
function getFullTimeFromMillisecond(e) {
	const t = new Date(e);
	return strPadLeft(t.getHours(), "0", 2) + ":" + strPadLeft(t.getMinutes(), "0", 2) + " " + strPadLeft(t.getDate(), "0", 2) + "/" + strPadLeft(t.getMonth() + 1, "0", 2) + "/" + t.getFullYear();
}
function getFileExtension(e) {
	return path.extname(e).slice(1);
}
function getFileName(e) {
	return path.basename(e);
}
function removeUndefinedKeys(e) {
	for (const t in e) if (e[t] === void 0) delete e[t];
	return e;
}
function getGroupEventType(act) {
	if (act == "join_request") return GroupEventType.JOIN_REQUEST;
	if (act == "join") return GroupEventType.JOIN;
	if (act == "leave") return GroupEventType.LEAVE;
	if (act == "remove_member") return GroupEventType.REMOVE_MEMBER;
	if (act == "block_member") return GroupEventType.BLOCK_MEMBER;
	if (act == "update_setting") return GroupEventType.UPDATE_SETTING;
	if (act == "update_avatar") return GroupEventType.UPDATE_AVATAR;
	if (act == "update") return GroupEventType.UPDATE;
	if (act == "new_link") return GroupEventType.NEW_LINK;
	if (act == "add_admin") return GroupEventType.ADD_ADMIN;
	if (act == "remove_admin") return GroupEventType.REMOVE_ADMIN;
	if (act == "new_pin_topic") return GroupEventType.NEW_PIN_TOPIC;
	if (act == "update_pin_topic") return GroupEventType.UPDATE_PIN_TOPIC;
	if (act == "update_topic") return GroupEventType.UPDATE_TOPIC;
	if (act == "update_board") return GroupEventType.UPDATE_BOARD;
	if (act == "remove_board") return GroupEventType.REMOVE_BOARD;
	if (act == "reorder_pin_topic") return GroupEventType.REORDER_PIN_TOPIC;
	if (act == "unpin_topic") return GroupEventType.UNPIN_TOPIC;
	if (act == "remove_topic") return GroupEventType.REMOVE_TOPIC;
	if (act == "accept_remind") return GroupEventType.ACCEPT_REMIND;
	if (act == "reject_remind") return GroupEventType.REJECT_REMIND;
	if (act == "remind_topic") return GroupEventType.REMIND_TOPIC;
	return GroupEventType.UNKNOWN;
}
function getFriendEventType(act) {
	if (act == "add") return FriendEventType.ADD;
	if (act == "remove") return FriendEventType.REMOVE;
	if (act == "block") return FriendEventType.BLOCK;
	if (act == "unblock") return FriendEventType.UNBLOCK;
	if (act == "block_call") return FriendEventType.BLOCK_CALL;
	if (act == "unblock_call") return FriendEventType.UNBLOCK_CALL;
	if (act == "req_v2") return FriendEventType.REQUEST;
	if (act == "reject") return FriendEventType.REJECT_REQUEST;
	if (act == "undo_req") return FriendEventType.UNDO_REQUEST;
	if (act == "seen_fr_req") return FriendEventType.SEEN_FRIEND_REQUEST;
	if (act == "pin_unpin") return FriendEventType.PIN_UNPIN;
	if (act == "pin_create") return FriendEventType.PIN_CREATE;
	return FriendEventType.UNKNOWN;
}
async function handleZaloResponse(ctx, response, isEncrypted = true) {
	const result = {
		data: null,
		error: null
	};
	if (!response.ok) {
		result.error = { message: "Request failed with status code " + response.status };
		return result;
	}
	try {
		const jsonData = await response.json();
		if (jsonData.error_code != 0) {
			result.error = {
				message: jsonData.error_message,
				code: jsonData.error_code
			};
			return result;
		}
		const decodedData = isEncrypted ? JSON.parse(decodeAES(ctx.secretKey, jsonData.data)) : jsonData;
		if (decodedData.error_code != 0) {
			result.error = {
				message: decodedData.error_message,
				code: decodedData.error_code
			};
			return result;
		}
		result.data = decodedData.data;
	} catch (error) {
		logger(ctx).error("Failed to parse response data:", error);
		result.error = { message: "Failed to parse response data" };
	}
	return result;
}
async function resolveResponse(ctx, res, cb, isEncrypted) {
	const result = await handleZaloResponse(ctx, res, isEncrypted);
	if (result.error) throw new ZaloApiError(result.error.message, result.error.code);
	if (cb) return cb(result);
	return result.data;
}
function apiFactory() {
	return (callback) => {
		return (ctx, api) => {
			if (!isContextSession(ctx)) throw new ZaloApiError("Invalid context " + JSON.stringify(ctx, null, 2));
			return callback(api, ctx, {
				makeURL(baseURL, params, apiVersion) {
					return makeURL(ctx, baseURL, params, apiVersion);
				},
				encodeAES(data, t) {
					return encodeAES(ctx.secretKey, data, t);
				},
				request(url, options, raw) {
					return request(ctx, url, options, raw);
				},
				logger: logger(ctx),
				resolve: (res, cb, isEncrypted) => resolveResponse(ctx, res, cb, isEncrypted)
			});
		};
	};
}
function generateZaloUUID(userAgent) {
	return crypto.randomUUID() + "-" + import_crypto_js.default.MD5(userAgent).toString();
}
/**
* Encrypts a 4-digit PIN to a 32-character hex string
* @param pin 4-digit PIN number
* @returns 32-character hex string
*/
function encryptPin(pin) {
	return crypto.createHash("md5").update(pin).digest("hex");
}
//#endregion
//#region node_modules/zca-js/dist/apis/loginQR.js
var LoginQRCallbackEventType;
(function(LoginQRCallbackEventType) {
	LoginQRCallbackEventType[LoginQRCallbackEventType["QRCodeGenerated"] = 0] = "QRCodeGenerated";
	LoginQRCallbackEventType[LoginQRCallbackEventType["QRCodeExpired"] = 1] = "QRCodeExpired";
	LoginQRCallbackEventType[LoginQRCallbackEventType["QRCodeScanned"] = 2] = "QRCodeScanned";
	LoginQRCallbackEventType[LoginQRCallbackEventType["QRCodeDeclined"] = 3] = "QRCodeDeclined";
	LoginQRCallbackEventType[LoginQRCallbackEventType["GotLoginInfo"] = 4] = "GotLoginInfo";
})(LoginQRCallbackEventType || (LoginQRCallbackEventType = {}));
async function loadLoginPage(ctx) {
	const match = (await (await request(ctx, "https://id.zalo.me/account?continue=https%3A%2F%2Fchat.zalo.me%2F", {
		headers: {
			accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
			"accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
			"cache-control": "max-age=0",
			priority: "u=0, i",
			"sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "document",
			"sec-fetch-mode": "navigate",
			"sec-fetch-site": "same-site",
			"sec-fetch-user": "?1",
			"upgrade-insecure-requests": "1",
			Referer: "https://chat.zalo.me/",
			"Referrer-Policy": "strict-origin-when-cross-origin"
		},
		method: "GET"
	})).text()).match(/https:\/\/stc-zlogin\.zdn\.vn\/main-([\d.]+)\.js/);
	return match === null || match === void 0 ? void 0 : match[1];
}
async function getLoginInfo(ctx, version) {
	const form = new URLSearchParams();
	form.append("continue", "https://zalo.me/pc");
	form.append("v", version);
	return await request(ctx, "https://id.zalo.me/account/logininfo", {
		headers: {
			accept: "*/*",
			"accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
			"content-type": "application/x-www-form-urlencoded",
			priority: "u=1, i",
			"sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			Referer: "https://id.zalo.me/account?continue=https%3A%2F%2Fzalo.me%2Fpc",
			"Referrer-Policy": "strict-origin-when-cross-origin"
		},
		body: form,
		method: "POST"
	}).then((res) => res.json()).catch(logger(ctx).error);
}
async function verifyClient(ctx, version) {
	const form = new URLSearchParams();
	form.append("type", "device");
	form.append("continue", "https://zalo.me/pc");
	form.append("v", version);
	return await request(ctx, "https://id.zalo.me/account/verify-client", {
		headers: {
			accept: "*/*",
			"accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
			"content-type": "application/x-www-form-urlencoded",
			priority: "u=1, i",
			"sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			Referer: "https://id.zalo.me/account?continue=https%3A%2F%2Fzalo.me%2Fpc",
			"Referrer-Policy": "strict-origin-when-cross-origin"
		},
		body: form,
		method: "POST"
	}).then((res) => res.json()).catch(logger(ctx).error);
}
async function generate(ctx, version) {
	const form = new URLSearchParams();
	form.append("continue", "https://zalo.me/pc");
	form.append("v", version);
	return await request(ctx, "https://id.zalo.me/account/authen/qr/generate", {
		headers: {
			accept: "*/*",
			"accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
			"content-type": "application/x-www-form-urlencoded",
			priority: "u=1, i",
			"sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			Referer: "https://id.zalo.me/account?continue=https%3A%2F%2Fzalo.me%2Fpc",
			"Referrer-Policy": "strict-origin-when-cross-origin"
		},
		body: form,
		method: "POST"
	}).then((res) => res.json()).catch(logger(ctx).error);
}
async function saveQRCodeToFile(filepath, imageData) {
	await writeFile(filepath, imageData, "base64");
}
async function waitingScan(ctx, version, code, signal) {
	const form = new URLSearchParams();
	form.append("code", code);
	form.append("continue", "https://chat.zalo.me/");
	form.append("v", version);
	return await request(ctx, "https://id.zalo.me/account/authen/qr/waiting-scan", {
		headers: {
			accept: "*/*",
			"accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
			"content-type": "application/x-www-form-urlencoded",
			priority: "u=1, i",
			"sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			Referer: "https://id.zalo.me/account?continue=https%3A%2F%2Fchat.zalo.me%2F",
			"Referrer-Policy": "strict-origin-when-cross-origin"
		},
		body: form,
		method: "POST",
		signal
	}).then((res) => res.json()).then((data) => {
		if (data.error_code == 8) return waitingScan(ctx, version, code, signal);
		return data;
	}).catch((e) => {
		if (!signal.aborted) logger(ctx).error(e);
	});
}
async function waitingConfirm(ctx, version, code, signal) {
	const form = new URLSearchParams();
	form.append("code", code);
	form.append("gToken", "");
	form.append("gAction", "CONFIRM_QR");
	form.append("continue", "https://chat.zalo.me/");
	form.append("v", version);
	logger(ctx).info("Please confirm on your phone");
	return await request(ctx, "https://id.zalo.me/account/authen/qr/waiting-confirm", {
		headers: {
			accept: "*/*",
			"accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
			"content-type": "application/x-www-form-urlencoded",
			priority: "u=1, i",
			"sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			Referer: "https://id.zalo.me/account?continue=https%3A%2F%2Fchat.zalo.me%2F",
			"Referrer-Policy": "strict-origin-when-cross-origin"
		},
		body: form,
		method: "POST",
		signal
	}).then((res) => res.json()).then((data) => {
		if (data.error_code == 8) return waitingConfirm(ctx, version, code, signal);
		return data;
	}).catch((e) => {
		if (!signal.aborted) logger(ctx).error(e);
	});
}
async function checkSession(ctx) {
	return await request(ctx, "https://id.zalo.me/account/checksession?continue=https%3A%2F%2Fchat.zalo.me%2Findex.html", {
		headers: {
			accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
			"accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
			priority: "u=0, i",
			"sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "document",
			"sec-fetch-mode": "navigate",
			"sec-fetch-site": "same-origin",
			"upgrade-insecure-requests": "1",
			Referer: "https://id.zalo.me/account?continue=https%3A%2F%2Fchat.zalo.me%2F",
			"Referrer-Policy": "strict-origin-when-cross-origin"
		},
		redirect: "manual",
		method: "GET"
	}).catch(logger(ctx).error);
}
async function getUserInfo(ctx) {
	return await request(ctx, "https://jr.chat.zalo.me/jr/userinfo", {
		headers: {
			accept: "*/*",
			"accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
			priority: "u=1, i",
			"sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-site",
			Referer: "https://chat.zalo.me/",
			"Referrer-Policy": "strict-origin-when-cross-origin"
		},
		method: "GET"
	}).then((res) => res.json()).catch(logger(ctx).error);
}
async function loginQR(ctx, options, callback) {
	ctx.cookie = new import_cookie.CookieJar();
	ctx.userAgent = options.userAgent;
	return new Promise(async (resolve, reject) => {
		var _a;
		const controller = new AbortController();
		let qrTimeout = null;
		function cleanUp() {
			controller.abort();
			if (qrTimeout) {
				clearTimeout(qrTimeout);
				qrTimeout = null;
			}
		}
		try {
			function retry() {
				cleanUp();
				return resolve(loginQR(ctx, options, callback));
			}
			function abort() {
				cleanUp();
				return reject(new ZaloApiLoginQRAborted());
			}
			if (ctx.options.logging) console.log();
			const loginVersion = await loadLoginPage(ctx);
			if (!loginVersion) throw new ZaloApiError("Cannot get API login version");
			logger(ctx).info("Got login version:", loginVersion);
			await getLoginInfo(ctx, loginVersion);
			await verifyClient(ctx, loginVersion);
			const qrGenResult = await generate(ctx, loginVersion);
			if (!qrGenResult || !qrGenResult.data) throw new ZaloApiError(`Unable to generate QRCode\nResponse: ${JSON.stringify(qrGenResult, null, 2)}`);
			const qrData = qrGenResult.data;
			if (callback) callback({
				type: LoginQRCallbackEventType.QRCodeGenerated,
				data: Object.assign(Object.assign({}, qrGenResult.data), { image: qrGenResult.data.image.replace(/^data:image\/png;base64,/, "") }),
				actions: {
					async saveToFile(qrPath) {
						var _a;
						if (qrPath === void 0) qrPath = (_a = options.qrPath) !== null && _a !== void 0 ? _a : "qr.png";
						await saveQRCodeToFile(qrPath, qrData.image.replace(/^data:image\/png;base64,/, ""));
						logger(ctx).info("Scan the QR code at", `'${qrPath}'`, "to proceed with login");
					},
					retry,
					abort
				}
			});
			else {
				const qrPath = (_a = options.qrPath) !== null && _a !== void 0 ? _a : "qr.png";
				await saveQRCodeToFile(qrPath, qrData.image.replace(/^data:image\/png;base64,/, ""));
				logger(ctx).info("Scan the QR code at", `'${qrPath}'`, "to proceed with login");
			}
			qrTimeout = setTimeout(() => {
				cleanUp();
				logger(ctx).info("QR expired!");
				if (callback) callback({
					type: LoginQRCallbackEventType.QRCodeExpired,
					data: null,
					actions: {
						retry,
						abort
					}
				});
				else retry();
			}, 1e5);
			const scanResult = await waitingScan(ctx, loginVersion, qrGenResult.data.code, controller.signal);
			if (!scanResult || !scanResult.data) throw new ZaloApiError("Cannot get scan result");
			if (callback) callback({
				type: LoginQRCallbackEventType.QRCodeScanned,
				data: scanResult.data,
				actions: {
					retry,
					abort
				}
			});
			const confirmResult = await waitingConfirm(ctx, loginVersion, qrGenResult.data.code, controller.signal);
			if (!confirmResult) throw new ZaloApiError("Cannot get confirm result");
			clearTimeout(qrTimeout);
			if (confirmResult.error_code == -13) {
				if (callback) callback({
					type: LoginQRCallbackEventType.QRCodeDeclined,
					data: { code: qrData.code },
					actions: {
						retry,
						abort
					}
				});
				else {
					logger(ctx).error("QRCode login declined");
					throw new ZaloApiLoginQRDeclined();
				}
				return;
			} else if (confirmResult.error_code != 0) throw new ZaloApiError(`An error has occurred.\nResponse: ${JSON.stringify(confirmResult, null, 2)}`);
			if (!await checkSession(ctx)) throw new ZaloApiError("Cannot get session, login failed");
			logger(ctx).info("Successfully logged into the account", scanResult.data.display_name);
			const userInfo = await getUserInfo(ctx);
			if (!userInfo || !userInfo.data) throw new ZaloApiError("Can't get account info");
			if (!userInfo.data.logged) throw new ZaloApiError("Can't login");
			resolve({
				cookies: ctx.cookie.toJSON().cookies,
				userInfo: userInfo.data.info
			});
		} catch (error) {
			cleanUp();
			reject(error);
		}
	});
}
//#endregion
//#region node_modules/zca-js/dist/apis/login.js
async function login(ctx, encryptParams) {
	const encryptedParams = await getEncryptParam(ctx, encryptParams, "getlogininfo");
	try {
		const response = await request(ctx, makeURL(ctx, "https://wpa.chat.zalo.me/api/login/getLoginInfo", Object.assign(Object.assign({}, encryptedParams.params), { nretry: 0 })));
		if (!response.ok) throw new ZaloApiError("Failed to fetch login info: " + response.statusText);
		const data = await response.json();
		if (encryptedParams.enk) {
			const decryptedData = decryptResp(encryptedParams.enk, data.data);
			return decryptedData != null && typeof decryptedData != "string" ? decryptedData : null;
		}
		return null;
	} catch (error) {
		logger(ctx).error("Login failed:", error);
		throw error;
	}
}
async function getServerInfo(ctx, encryptParams) {
	const encryptedParams = await getEncryptParam(ctx, encryptParams, "getserverinfo");
	if (!encryptedParams.params.signkey || typeof encryptedParams.params.signkey !== "string") throw new ZaloApiError("Missing signkey");
	const response = await request(ctx, makeURL(ctx, "https://wpa.chat.zalo.me/api/login/getServerInfo", {
		imei: ctx.imei,
		type: ctx.API_TYPE,
		client_version: ctx.API_VERSION,
		computer_name: "Web",
		signkey: encryptedParams.params.signkey
	}, false));
	if (!response.ok) throw new ZaloApiError("Failed to fetch server info: " + response.statusText);
	const data = await response.json();
	if (data.data == null) throw new ZaloApiError("Failed to fetch server info: " + data.error_message);
	return data.data;
}
async function getEncryptParam(ctx, encryptParams, type) {
	const params = {};
	const data = {
		computer_name: "Web",
		imei: ctx.imei,
		language: ctx.language,
		ts: Date.now()
	};
	const encryptedData = await _encryptParam(ctx, data, encryptParams);
	if (encryptedData == null) Object.assign(params, data);
	else {
		const { encrypted_params, encrypted_data } = encryptedData;
		Object.assign(params, encrypted_params);
		params.params = encrypted_data;
	}
	params.type = ctx.API_TYPE;
	params.client_version = ctx.API_VERSION;
	params.signkey = type == "getserverinfo" ? getSignKey(type, {
		imei: ctx.imei,
		type: ctx.API_TYPE,
		client_version: ctx.API_VERSION,
		computer_name: "Web"
	}) : getSignKey(type, params);
	return {
		params,
		enk: encryptedData ? encryptedData.enk : null
	};
}
async function _encryptParam(ctx, data, encryptParams) {
	if (encryptParams) {
		const encryptor = new ParamsEncryptor({
			type: ctx.API_TYPE,
			imei: data.imei,
			firstLaunchTime: Date.now()
		});
		try {
			const stringifiedData = JSON.stringify(data);
			const encryptedKey = encryptor.getEncryptKey();
			const encodedData = ParamsEncryptor.encodeAES(encryptedKey, stringifiedData, "base64", false);
			const params = encryptor.getParams();
			return params ? {
				encrypted_data: encodedData,
				encrypted_params: params,
				enk: encryptedKey
			} : null;
		} catch (error) {
			throw new ZaloApiError("Failed to encrypt params: " + error);
		}
	}
	return null;
}
//#endregion
//#region node_modules/zca-js/dist/update.js
const VERSION = "2.1.2";
const NPM_REGISTRY = "https://registry.npmjs.org/zca-js";
async function checkUpdate(ctx) {
	var _a, _b;
	if (!ctx.options.checkUpdate) return;
	const _options = Object.assign({}, isBun ? { proxy: (_b = (_a = ctx.options.agent) === null || _a === void 0 ? void 0 : _a.proxy) === null || _b === void 0 ? void 0 : _b.href } : { agent: ctx.options.agent });
	const response = await ctx.options.polyfill(NPM_REGISTRY, _options).catch(() => null);
	if (!response || !response.ok) return;
	const data = await response.json().catch(() => null);
	if (!data) return;
	const latestVersion = data["dist-tags"].latest;
	if (compare(VERSION, latestVersion) === -1) logger(ctx).info(`A new version of zca-js is available: ${latestVersion}`);
	else logger(ctx).info("zca-js is up to date");
}
//#endregion
//#region node_modules/zca-js/dist/apis/listen.js
var CloseReason;
(function(CloseReason) {
	CloseReason[CloseReason["ManualClosure"] = 1e3] = "ManualClosure";
	CloseReason[CloseReason["AbnormalClosure"] = 1006] = "AbnormalClosure";
	CloseReason[CloseReason["DuplicateConnection"] = 3e3] = "DuplicateConnection";
	CloseReason[CloseReason["KickConnection"] = 3003] = "KickConnection";
})(CloseReason || (CloseReason = {}));
var Listener = class extends EventEmitter {
	constructor(ctx, urls) {
		super();
		this.ctx = ctx;
		this.urls = urls;
		this.id = 0;
		if (!ctx.cookie) throw new ZaloApiError("Cookie is not available");
		if (!ctx.userAgent) throw new ZaloApiError("User agent is not available");
		this.wsURL = makeURL(this.ctx, this.urls[0], { t: Date.now() });
		this.retryCount = {};
		this.rotateCount = 0;
		for (const retry in ctx.settings.features.socket.retries) {
			const { times, max } = ctx.settings.features.socket.retries[retry];
			this.retryCount[retry] = {
				count: 0,
				max: max || 0,
				times: typeof times === "number" ? [times] : times
			};
		}
		this.cookie = ctx.cookie.getCookieStringSync("https://chat.zalo.me");
		this.userAgent = ctx.userAgent;
		this.selfListen = ctx.options.selfListen;
		this.ws = null;
		this.onConnectedCallback = () => {};
		this.onClosedCallback = () => {};
		this.onErrorCallback = () => {};
		this.onMessageCallback = () => {};
	}
	/**
	* @deprecated Use `on` method instead
	*/
	onConnected(cb) {
		this.onConnectedCallback = cb;
	}
	/**
	* @deprecated Use `on` method instead
	*/
	onClosed(cb) {
		this.onClosedCallback = cb;
	}
	/**
	* @deprecated Use `on` method instead
	*/
	onError(cb) {
		this.onErrorCallback = cb;
	}
	/**
	* @deprecated Use `on` method instead
	*/
	onMessage(cb) {
		this.onMessageCallback = cb;
	}
	canRetry(code) {
		if (!this.ctx.settings.features.socket.close_and_retry_codes.includes(code)) return false;
		if (this.retryCount[code.toString()].count >= this.retryCount[code.toString()].max) return false;
		this.retryCount[code.toString()].count++;
		const { count, max, times } = this.retryCount[code.toString()];
		const retryTime = count - 1 < times.length ? times[count - 1] : times[times.length - 1];
		logger(this.ctx).verbose(`Retry for code ${code} in ${retryTime}ms (${count}/${max})`);
		return retryTime;
	}
	shouldRotate(code) {
		if (!this.ctx.settings.features.socket.rotate_error_codes.includes(code)) return false;
		if (this.rotateCount >= this.urls.length - 1) return false;
		return true;
	}
	rotateEndpoint() {
		this.rotateCount++;
		this.wsURL = makeURL(this.ctx, this.urls[this.rotateCount], { t: Date.now() });
		logger(this.ctx).verbose(`Rotating endpoint to ${this.wsURL}`);
	}
	start({ retryOnClose = false } = {}) {
		if (this.ws) throw new ZaloApiError("Already started");
		const ws = new WebSocket$1(this.wsURL, {
			headers: {
				"accept-encoding": "gzip, deflate, br, zstd",
				"accept-language": "en-US,en;q=0.9",
				"cache-control": "no-cache",
				connection: "Upgrade",
				host: new URL(this.wsURL).host,
				origin: "https://chat.zalo.me",
				prgama: "no-cache",
				"sec-websocket-extensions": "permessage-deflate; client_max_window_bits",
				"sec-websocket-version": "13",
				upgrade: "websocket",
				"user-agent": this.userAgent,
				cookie: this.cookie
			},
			agent: this.ctx.options.agent
		});
		this.ws = ws;
		ws.onopen = () => {
			this.onConnectedCallback();
			this.emit("connected");
		};
		ws.onclose = (event) => {
			this.reset();
			this.emit("disconnected", event.code, event.reason);
			const retry = retryOnClose && this.canRetry(event.code);
			if (retry && retryOnClose) {
				if (this.shouldRotate(event.code)) this.rotateEndpoint();
				setTimeout(() => {
					this.start({ retryOnClose: true });
				}, retry);
			} else {
				this.onClosedCallback(event.code, event.reason);
				this.emit("closed", event.code, event.reason);
			}
		};
		ws.onerror = (event) => {
			this.onErrorCallback(event);
			this.emit("error", event);
		};
		ws.onmessage = async (event) => {
			const { data } = event;
			if (!(data instanceof Buffer)) return;
			const [version, cmd, subCmd] = getHeader(data.subarray(0, 4));
			try {
				const dataToDecode = data.subarray(4);
				const decodedData = new TextDecoder("utf-8").decode(dataToDecode);
				if (decodedData.length == 0) return;
				const parsed = JSON.parse(decodedData);
				if (version == 1 && cmd == 1 && subCmd == 1 && hasOwn(parsed, "key")) {
					this.cipherKey = parsed.key;
					this.emit("cipher_key", parsed.key);
					if (this.pingInterval) clearInterval(this.pingInterval);
					const ping = () => {
						const payload = {
							version: 1,
							cmd: 2,
							subCmd: 1,
							data: { eventId: Date.now() }
						};
						this.sendWs(payload, false);
					};
					this.pingInterval = setInterval(() => {
						ping();
					}, this.ctx.settings.features.socket.ping_interval);
				}
				if (version == 1 && cmd == 501 && subCmd == 0) {
					const { msgs } = (await decodeEventData(parsed, this.cipherKey)).data;
					for (const msg of msgs) if (typeof msg.content == "object" && hasOwn(msg.content, "deleteMsg")) {
						const undoObject = new Undo(this.ctx.uid, msg, false);
						if (undoObject.isSelf && !this.selfListen) continue;
						this.emit("undo", undoObject);
					} else {
						const messageObject = new UserMessage(this.ctx.uid, msg);
						if (messageObject.isSelf && !this.selfListen) continue;
						this.onMessageCallback(messageObject);
						this.emit("message", messageObject);
					}
				}
				if (version == 1 && cmd == 521 && subCmd == 0) {
					const { groupMsgs } = (await decodeEventData(parsed, this.cipherKey)).data;
					for (const msg of groupMsgs) if (typeof msg.content == "object" && hasOwn(msg.content, "deleteMsg")) {
						const undoObject = new Undo(this.ctx.uid, msg, true);
						if (undoObject.isSelf && !this.selfListen) continue;
						this.emit("undo", undoObject);
					} else {
						const messageObject = new GroupMessage(this.ctx.uid, msg);
						if (messageObject.isSelf && !this.selfListen) continue;
						this.onMessageCallback(messageObject);
						this.emit("message", messageObject);
					}
				}
				if (version == 1 && cmd == 601 && subCmd == 0) {
					const { controls } = (await decodeEventData(parsed, this.cipherKey)).data;
					for (const control of controls) if (control.content.act_type == "file_done") {
						const data = {
							fileUrl: control.content.data.url,
							fileId: control.content.fileId
						};
						const uploadCallback = this.ctx.uploadCallbacks.get(String(control.content.fileId));
						if (uploadCallback) uploadCallback(data);
						this.ctx.uploadCallbacks.delete(String(control.content.fileId));
						this.emit("upload_attachment", data);
					} else if (control.content.act_type == "group") {
						if (control.content.act == "join_reject") continue;
						const groupEventData = typeof control.content.data == "string" ? JSON.parse(control.content.data) : control.content.data;
						const groupEvent = initializeGroupEvent(this.ctx.uid, groupEventData, getGroupEventType(control.content.act), control.content.act);
						if (groupEvent.isSelf && !this.selfListen) continue;
						this.emit("group_event", groupEvent);
					} else if (control.content.act_type == "fr") {
						if (control.content.act == "req") continue;
						const friendEventData = typeof control.content.data == "string" ? JSON.parse(control.content.data) : control.content.data;
						if (typeof friendEventData == "object" && "topic" in friendEventData && typeof friendEventData.topic == "object" && "params" in friendEventData.topic) friendEventData.topic.params = JSON.parse(`${friendEventData.topic.params}`);
						const friendEvent = initializeFriendEvent(this.ctx.uid, typeof friendEventData == "number" ? control.content.data : friendEventData, getFriendEventType(control.content.act));
						if (friendEvent.isSelf && !this.selfListen) continue;
						this.emit("friend_event", friendEvent);
					}
				}
				if (cmd == 612) {
					const { reacts, reactGroups } = (await decodeEventData(parsed, this.cipherKey)).data;
					for (const react of reacts) {
						react.content = JSON.parse(react.content);
						const reactionObject = new Reaction(this.ctx.uid, react, false);
						if (reactionObject.isSelf && !this.selfListen) continue;
						this.emit("reaction", reactionObject);
					}
					for (const reactGroup of reactGroups) {
						reactGroup.content = JSON.parse(reactGroup.content);
						const reactionObject = new Reaction(this.ctx.uid, reactGroup, true);
						if (reactionObject.isSelf && !this.selfListen) continue;
						this.emit("reaction", reactionObject);
					}
				}
				if (cmd == 610 || cmd == 611) {
					const parsedData = (await decodeEventData(parsed, this.cipherKey)).data;
					const isGroup = cmd == 611;
					const reactionObjects = parsedData[isGroup ? "reactGroups" : "reacts"].map((react) => new Reaction(this.ctx.uid, react, isGroup));
					this.emit("old_reactions", reactionObjects, isGroup);
				}
				if (cmd == 510 && subCmd == 1) {
					const responseMsgs = (await decodeEventData(parsed, this.cipherKey)).data.msgs.map((msg) => new UserMessage(this.ctx.uid, msg));
					this.emit("old_messages", responseMsgs, ThreadType.User);
				}
				if (cmd == 511 && subCmd == 1) {
					const responseMsgs = (await decodeEventData(parsed, this.cipherKey)).data.groupMsgs.map((msg) => new GroupMessage(this.ctx.uid, msg));
					this.emit("old_messages", responseMsgs, ThreadType.Group);
				}
				if (cmd == 602 && subCmd == 0) {
					const { actions } = (await decodeEventData(parsed, this.cipherKey)).data;
					for (const action of actions) if (action.act_type == "typing") {
						const data = JSON.parse(`{${action.data}}`);
						if (action.act == "typing") {
							const typingObject = new UserTyping(data);
							this.emit("typing", typingObject);
						} else if (action.act == "gtyping") {
							const typingObject = new GroupTyping(data);
							this.emit("typing", typingObject);
						}
					}
				}
				if (cmd == 502 && subCmd == 0) {
					const { delivereds: deliveredMsgs, seens: seenMsgs } = (await decodeEventData(parsed, this.cipherKey)).data;
					if (Array.isArray(deliveredMsgs) && deliveredMsgs.length > 0) {
						const deliveredObjects = deliveredMsgs.map((delivered) => new UserDeliveredMessage(delivered));
						this.emit("delivered_messages", deliveredObjects);
					}
					if (Array.isArray(seenMsgs) && seenMsgs.length > 0) {
						const seenObjects = seenMsgs.map((seen) => new UserSeenMessage(seen));
						this.emit("seen_messages", seenObjects);
					}
				}
				if (cmd == 522 && subCmd == 0) {
					const { delivereds: deliveredMsgs, groupSeens: groupSeenMsgs } = (await decodeEventData(parsed, this.cipherKey)).data;
					if (Array.isArray(deliveredMsgs) && deliveredMsgs.length > 0) {
						let deliveredObjects = deliveredMsgs.map((delivered) => new GroupDeliveredMessage(this.ctx.uid, delivered));
						if (!this.selfListen) deliveredObjects = deliveredObjects.filter((delivered) => !delivered.isSelf);
						this.emit("delivered_messages", deliveredObjects);
					}
					if (Array.isArray(groupSeenMsgs) && groupSeenMsgs.length > 0) {
						let seenObjects = groupSeenMsgs.map((seen) => new GroupSeenMessage(this.ctx.uid, seen));
						if (!this.selfListen) seenObjects = seenObjects.filter((seen) => !seen.isSelf);
						this.emit("seen_messages", seenObjects);
					}
				}
				if (version == 1 && cmd == 3e3 && subCmd == 0) {
					logger(this.ctx).error();
					logger(this.ctx).error("Another connection is opened, closing this one");
					logger(this.ctx).error();
					if (ws.readyState !== WebSocket$1.CLOSED) ws.close(CloseReason.DuplicateConnection);
				}
			} catch (error) {
				this.onErrorCallback(error);
				this.emit("error", error);
			}
		};
	}
	stop() {
		if (this.ws) {
			this.ws.close(CloseReason.ManualClosure);
			this.reset();
		}
	}
	sendWs(payload, requireId = true) {
		if (this.ws) {
			if (requireId) payload.data["req_id"] = `req_${this.id++}`;
			const encodedData = new TextEncoder().encode(JSON.stringify(payload.data));
			const dataLength = encodedData.length;
			const data = new DataView(Buffer.alloc(4 + dataLength).buffer);
			data.setUint8(0, payload.version);
			data.setInt32(1, payload.cmd, true);
			data.setInt8(3, payload.subCmd);
			encodedData.forEach((e, i) => {
				data.setUint8(4 + i, e);
			});
			this.ws.send(data);
		}
	}
	/**
	* Request old messages
	*
	* @param lastMsgId
	*/
	requestOldMessages(threadType, lastMsgId = null) {
		const payload = {
			version: 1,
			cmd: threadType === ThreadType.User ? 510 : 511,
			subCmd: 1,
			data: {
				first: true,
				lastId: lastMsgId,
				preIds: []
			}
		};
		this.sendWs(payload);
	}
	/**
	* Request old messages
	*
	* @param lastMsgId
	*/
	requestOldReactions(threadType, lastMsgId = null) {
		const payload = {
			version: 1,
			cmd: threadType === ThreadType.User ? 610 : 611,
			subCmd: 1,
			data: {
				first: true,
				lastId: lastMsgId,
				preIds: []
			}
		};
		this.sendWs(payload);
	}
	reset() {
		this.ws = null;
		this.cipherKey = void 0;
		if (this.pingInterval) clearInterval(this.pingInterval);
	}
};
function getHeader(buffer) {
	if (buffer.byteLength < 4) throw new ZaloApiError("Invalid header");
	return [
		buffer[0],
		buffer.readUInt16LE(1),
		buffer[3]
	];
}
//#endregion
//#region node_modules/zca-js/dist/apis/acceptFriendRequest.js
const acceptFriendRequestFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.friend[0]}/api/friend/accept`);
	/**
	* Accept a friend request from a User
	*
	* @param friendId The friend ID to user request is accept
	*
	* @throws {ZaloApiError}
	*/
	return async function acceptFriendRequest(friendId) {
		const params = {
			fid: friendId,
			language: ctx.language
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/addGroupBlockedMember.js
const addGroupBlockedMemberFactory = apiFactory()((api, _, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/blockedmems/add`);
	/**
	* Add group blocked member
	*
	* @param memberId member id(s)
	* @param groupId group id
	*
	* @throws {ZaloApiError}
	*/
	return async function addGroupBlockedMember(memberId, groupId) {
		if (!Array.isArray(memberId)) memberId = [memberId];
		const params = {
			grid: groupId,
			members: memberId
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/addGroupDeputy.js
const addGroupDeputyFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/admins/add`);
	/**
	* Add group deputy
	*
	* @param memberId user Id or list of user Ids
	* @param groupId group Id
	*
	* @throws {ZaloApiError}
	*
	*/
	return async function addGroupDeputy(memberId, groupId) {
		if (!Array.isArray(memberId)) memberId = [memberId];
		const params = {
			grid: groupId,
			members: memberId,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/addPollOptions.js
const addPollOptionsFactory = apiFactory()((api, _ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/poll/option/add`);
	/**
	* Add new option to poll
	*
	* @param payload
	*
	* @throws {ZaloApiError}
	*/
	return async function addPollOptions(payload) {
		const params = {
			poll_id: payload.pollId,
			new_options: JSON.stringify(payload.options),
			voted_option_ids: payload.votedOptionIds
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/addQuickMessage.js
const addQuickMessageFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.quick_message[0]}/api/quickmessage/create`);
	/**
	* Add quick message
	*
	* @param addPayload - The payload containing data to add the quick message
	*
	* @note Zalo might throw an error with code 821 if you have reached the limit of quick messages.
	*
	* @throws {ZaloApiError}
	*/
	return async function addQuickMessage(addPayload) {
		const isType = !addPayload.media ? 0 : 1;
		const params = {
			keyword: addPayload.keyword,
			message: {
				title: addPayload.title,
				params: ""
			},
			type: isType,
			imei: ctx.imei
		};
		if (isType === 1) {
			if (!addPayload.media) throw new ZaloApiError("Media is required");
			const uploadMedia = await api.uploadProductPhoto({ file: addPayload.media });
			const photoId = uploadMedia.photoId;
			const thumbUrl = uploadMedia.thumbUrl;
			const normalUrl = uploadMedia.normalUrl;
			const hdUrl = uploadMedia.hdUrl;
			params.media = { items: [{
				type: 0,
				photoId,
				title: "",
				width: "",
				height: "",
				previewThumb: thumbUrl,
				rawUrl: normalUrl || hdUrl,
				thumbUrl,
				normalUrl: normalUrl || hdUrl,
				hdUrl: hdUrl || normalUrl
			}] };
		}
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/addReaction.js
const addReactionFactory = apiFactory()((api, ctx, utils) => {
	const serviceURLs = {
		[ThreadType.User]: utils.makeURL(`${api.zpwServiceMap.reaction[0]}/api/message/reaction`),
		[ThreadType.Group]: utils.makeURL(`${api.zpwServiceMap.reaction[0]}/api/group/reaction`)
	};
	/**
	* Add reaction to a message
	*
	* @param icon Reaction icon
	* @param dest Destination data including message IDs and thread information
	*
	* @throws {ZaloApiError}
	*/
	return async function addReaction(icon, dest) {
		const serviceURL = serviceURLs[dest.type];
		let rType, source;
		if (typeof icon == "object") {
			rType = icon.rType;
			source = icon.source;
		} else switch (icon) {
			case Reactions.HAHA:
				rType = 0;
				source = 6;
				break;
			case Reactions.LIKE:
				rType = 3;
				source = 6;
				break;
			case Reactions.HEART:
				rType = 5;
				source = 6;
				break;
			case Reactions.WOW:
				rType = 32;
				source = 6;
				break;
			case Reactions.CRY:
				rType = 2;
				source = 6;
				break;
			case Reactions.ANGRY:
				rType = 20;
				source = 6;
				break;
			case Reactions.KISS:
				rType = 8;
				source = 6;
				break;
			case Reactions.TEARS_OF_JOY:
				rType = 7;
				source = 6;
				break;
			case Reactions.SHIT:
				rType = 66;
				source = 6;
				break;
			case Reactions.ROSE:
				rType = 120;
				source = 6;
				break;
			case Reactions.BROKEN_HEART:
				rType = 65;
				source = 6;
				break;
			case Reactions.DISLIKE:
				rType = 4;
				source = 6;
				break;
			case Reactions.LOVE:
				rType = 29;
				source = 6;
				break;
			case Reactions.CONFUSED:
				rType = 51;
				source = 6;
				break;
			case Reactions.WINK:
				rType = 45;
				source = 6;
				break;
			case Reactions.FADE:
				rType = 121;
				source = 6;
				break;
			case Reactions.SUN:
				rType = 67;
				source = 6;
				break;
			case Reactions.BIRTHDAY:
				rType = 126;
				source = 6;
				break;
			case Reactions.BOMB:
				rType = 127;
				source = 6;
				break;
			case Reactions.OK:
				rType = 68;
				source = 6;
				break;
			case Reactions.PEACE:
				rType = 69;
				source = 6;
				break;
			case Reactions.THANKS:
				rType = 70;
				source = 6;
				break;
			case Reactions.PUNCH:
				rType = 71;
				source = 6;
				break;
			case Reactions.SHARE:
				rType = 72;
				source = 6;
				break;
			case Reactions.PRAY:
				rType = 73;
				source = 6;
				break;
			case Reactions.NO:
				rType = 131;
				source = 6;
				break;
			case Reactions.BAD:
				rType = 132;
				source = 6;
				break;
			case Reactions.LOVE_YOU:
				rType = 133;
				source = 6;
				break;
			case Reactions.SAD:
				rType = 1;
				source = 6;
				break;
			case Reactions.VERY_SAD:
				rType = 16;
				source = 6;
				break;
			case Reactions.COOL:
				rType = 21;
				source = 6;
				break;
			case Reactions.NERD:
				rType = 22;
				source = 6;
				break;
			case Reactions.BIG_SMILE:
				rType = 23;
				source = 6;
				break;
			case Reactions.SUNGLASSES:
				rType = 26;
				source = 6;
				break;
			case Reactions.NEUTRAL:
				rType = 30;
				source = 6;
				break;
			case Reactions.SAD_FACE:
				rType = 35;
				source = 6;
				break;
			case Reactions.BYE:
				rType = 36;
				source = 6;
				break;
			case Reactions.SLEEPY:
				rType = 38;
				source = 6;
				break;
			case Reactions.WIPE:
				rType = 39;
				source = 6;
				break;
			case Reactions.DIG:
				rType = 42;
				source = 6;
				break;
			case Reactions.ANGUISH:
				rType = 44;
				source = 6;
				break;
			case Reactions.HANDCLAP:
				rType = 46;
				source = 6;
				break;
			case Reactions.ANGRY_FACE:
				rType = 47;
				source = 6;
				break;
			case Reactions.F_CHAIR:
				rType = 48;
				source = 6;
				break;
			case Reactions.L_CHAIR:
				rType = 49;
				source = 6;
				break;
			case Reactions.R_CHAIR:
				rType = 50;
				source = 6;
				break;
			case Reactions.SILENT:
				rType = 52;
				source = 6;
				break;
			case Reactions.SURPRISE:
				rType = 53;
				source = 6;
				break;
			case Reactions.EMBARRASSED:
				rType = 54;
				source = 6;
				break;
			case Reactions.AFRAID:
				rType = 60;
				source = 6;
				break;
			case Reactions.SAD2:
				rType = 61;
				source = 6;
				break;
			case Reactions.BIG_LAUGH:
				rType = 62;
				source = 6;
				break;
			case Reactions.RICH:
				rType = 63;
				source = 6;
				break;
			case Reactions.BEER:
				rType = 99;
				source = 6;
				break;
			default:
				rType = -1;
				source = 6;
		}
		const rIcon = typeof icon == "object" ? icon.icon : icon;
		if (rType == void 0 || source == void 0 || rIcon == void 0) throw new ZaloApiError("Invalid reaction");
		const params = { react_list: [{
			message: JSON.stringify({
				rMsg: [{
					gMsgID: parseInt(dest.data.msgId),
					cMsgID: parseInt(dest.data.cliMsgId),
					msgType: 1
				}],
				rIcon,
				rType,
				source
			}),
			clientId: Date.now()
		}] };
		if (dest.type == ThreadType.User) params.toid = dest.threadId;
		else {
			params.grid = dest.threadId;
			params.imei = ctx.imei;
		}
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt message");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response, (result) => {
			if (typeof result.data.msgIds === "string") return { msgIds: JSON.parse(result.data.msgIds) };
			return result.data;
		});
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/addUnreadMark.js
const addUnreadMarkFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.conversation[0]}/api/conv/addUnreadMark`);
	/**
	* Add unread mark to conversation
	*
	* @param threadId Thread ID
	* @param type Thread type (User/Group)
	*
	* @throws {ZaloApiError}
	*/
	return async function addUnreadMark(threadId, type = ThreadType.User) {
		const timestamp = Date.now();
		const timestampString = timestamp.toString();
		const isGroup = type === ThreadType.Group;
		const requestParams = { param: JSON.stringify({
			[isGroup ? "convsGroup" : "convsUser"]: [{
				id: threadId,
				cliMsgId: timestampString,
				fromUid: "0",
				ts: timestamp
			}],
			[isGroup ? "convsUser" : "convsGroup"]: [],
			imei: ctx.imei
		}) };
		const encryptedParams = utils.encodeAES(JSON.stringify(requestParams));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response, (result) => {
			const data = result.data;
			if (typeof data.data === "string") return {
				data: JSON.parse(data.data),
				status: data.status
			};
			return result.data;
		});
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/addUserToGroup.js
const addUserToGroupFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/invite/v2`);
	/**
	* Add user to existing group
	*
	* @param memberId User ID or list of user IDs to add
	* @param groupId Group ID
	*
	* @throws {ZaloApiError}
	*/
	return async function addUserToGroup(memberId, groupId) {
		if (!Array.isArray(memberId)) memberId = [memberId];
		const params = {
			grid: groupId,
			members: memberId,
			memberTypes: memberId.map(() => -1),
			imei: ctx.imei,
			clientLang: ctx.language
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/blockUser.js
const blockUserFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.friend[0]}/api/friend/block`);
	/**
	* Block a User
	*
	* @param userId The ID of the User to block
	*
	* @throws {ZaloApiError}
	*/
	return async function blockUser(userId) {
		const params = {
			fid: userId,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/blockViewFeed.js
const blockViewFeedFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.friend[0]}/api/friend/feed/block`);
	/**
	* Block/Unblock friend view feed by ID
	*
	* @param isBlockFeed Boolean to block/unblock view feed
	* @param userId User ID to block/unblock view feed
	*
	* @throws {ZaloApiError}
	*/
	return async function blockViewFeed(isBlockFeed, userId) {
		const params = {
			fid: userId,
			isBlockFeed: isBlockFeed ? 1 : 0,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/changeAccountAvatar.js
var import_form_data = /* @__PURE__ */ __toESM(require_form_data(), 1);
const changeAccountAvatarFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.file[0]}/api/profile/upavatar`);
	/**
	* Change account avatar
	*
	* @param avatarSource Attachment source, can be a file path or an Attachment object
	*
	* @throws {ZaloApiError | ZaloApiMissingImageMetadataGetter}
	*/
	return async function changeAccountAvatar(avatarSource) {
		const isSourceFilePath = typeof avatarSource == "string";
		const imageMetaData = isSourceFilePath ? await getImageMetaData(ctx, avatarSource) : avatarSource.metadata;
		const fileSize = imageMetaData.totalSize || 0;
		const params = {
			avatarSize: 120,
			clientId: String(ctx.uid + formatTime("%H:%M %d/%m/%Y")),
			language: ctx.language,
			metaData: JSON.stringify({
				origin: {
					width: imageMetaData.width || 1080,
					height: imageMetaData.height || 1080
				},
				processed: {
					width: imageMetaData.width || 1080,
					height: imageMetaData.height || 1080,
					size: fileSize
				}
			})
		};
		const avatarData = isSourceFilePath ? fs.readFileSync(avatarSource) : avatarSource.data;
		const formData = new import_form_data.default();
		formData.append("fileContent", avatarData, {
			filename: "blob",
			contentType: "image/jpeg"
		});
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), {
			method: "POST",
			headers: formData.getHeaders(),
			body: formData.getBuffer()
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/changeFriendAlias.js
const changeFriendAliasFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.alias[0]}/api/alias/update`);
	/**
	* Change friend's alias
	*
	* @param alias new alias (nickname - bietdanh)
	* @param friendId friend id
	*
	* @throws {ZaloApiError}
	*/
	return async function changeFriendAlias(alias, friendId) {
		const params = {
			friendId,
			alias,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/changeGroupAvatar.js
const changeGroupAvatarFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.file[0]}/api/group/upavatar`);
	/**
	* Change group avatar
	*
	* @param avatarSource Attachment source, can be a file path or an Attachment object
	* @param groupId Group ID
	*
	* @throws {ZaloApiError | ZaloApiMissingImageMetadataGetter}
	*/
	return async function changeGroupAvatar(avatarSource, groupId) {
		const params = {
			grid: groupId,
			avatarSize: 120,
			clientId: `g${groupId}${getFullTimeFromMillisecond((/* @__PURE__ */ new Date()).getTime())}`,
			imei: ctx.imei
		};
		const isSourceFilePath = typeof avatarSource == "string";
		const imageMetaData = isSourceFilePath ? await getImageMetaData(ctx, avatarSource) : avatarSource.metadata;
		params.originWidth = imageMetaData.width || 1080;
		params.originHeight = imageMetaData.height || 1080;
		const avatarData = isSourceFilePath ? fs.readFileSync(avatarSource) : avatarSource.data;
		const formData = new import_form_data.default();
		formData.append("fileContent", avatarData, {
			filename: "blob",
			contentType: "image/jpeg"
		});
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), {
			method: "POST",
			headers: formData.getHeaders(),
			body: formData.getBuffer()
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/changeGroupName.js
const changeGroupNameFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/updateinfo`);
	/**
	* Change group name
	*
	* @param name New group name
	* @param groupId Group ID
	*
	* @throws {ZaloApiError}
	*/
	return async function changeGroupName(name, groupId) {
		if (name.length == 0) name = Date.now().toString();
		const params = {
			grid: groupId,
			gname: name,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/changeGroupOwner.js
const changeGroupOwnerFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/change-owner`);
	/**
	* Change group owner
	*
	* @param memberId User Id of new group owner
	* @param groupId Group Id
	* @note Be careful when changing the key, as it will result in losing group admin rights
	*
	* @throws {ZaloApiError}
	*
	*/
	return async function changeGroupOwner(memberId, groupId) {
		const params = {
			grid: groupId,
			newAdminId: memberId,
			imei: ctx.imei,
			language: ctx.language
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/createAutoReply.js
const createAutoReplyFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.auto_reply[0]}/api/autoreply/create`);
	/**
	* Create auto reply
	*
	* @param payload payload
	*
	* @note this API used for zBusiness
	* @throws {ZaloApiError}
	*/
	return async function createAutoReply(payload) {
		const uids = Array.isArray(payload.uids) ? payload.uids : [payload.uids];
		const resultUids = payload.scope === 2 || payload.scope === 3 ? uids : [];
		const params = {
			cliLang: ctx.language,
			enable: payload.isEnable,
			content: payload.content,
			startTime: payload.startTime,
			endTime: payload.endTime,
			recurrence: ["RRULE:FREQ=DAILY;"],
			scope: payload.scope,
			uids: resultUids
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/createCatalog.js
const createCatalogFactory = apiFactory()((api, _, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.catalog[0]}/api/prodcatalog/catalog/create`);
	/**
	* Create catalog?
	*
	* @param catalogName catalog name
	*
	* @note this API is used for zBusiness
	* @throws {ZaloApiError}
	*/
	return async function createCatalog(catalogName) {
		const params = {
			catalog_name: catalogName,
			catalog_photo: ""
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/createGroup.js
const createGroupFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/create/v2`);
	/**
	* Create a new group
	*
	* @param options Group options
	*
	* @throws {ZaloApiError}
	*/
	return async function createGroup(options) {
		if (options.members.length == 0) throw new ZaloApiError("Group must have at least one member");
		const params = {
			clientId: Date.now(),
			gname: String(Date.now()),
			gdesc: null,
			members: options.members,
			membersTypes: options.members.map(() => -1),
			nameChanged: 0,
			createLink: 1,
			clientLang: ctx.language,
			imei: ctx.imei,
			zsource: 601
		};
		if (options.name && options.name.length > 0) {
			params.gname = options.name;
			params.nameChanged = 1;
		}
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt message");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "POST" });
		const data = await utils.resolve(response);
		options.avatarSource = options.avatarSource || options.avatarPath;
		if (options.avatarSource) await api.changeGroupAvatar(options.avatarSource, data.groupId).catch(utils.logger.error);
		return data;
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/createNote.js
const createNoteFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group_board[0]}/api/board/topic/createv2`);
	/**
	* Create a note in a group
	*
	* @param options note options
	* @param options.title note title
	* @param options.pinAct pin action (pin note)
	* @param groupId group id
	*
	* @throws {ZaloApiError}
	*/
	return async function createNote(options, groupId) {
		const params = {
			grid: groupId,
			type: 0,
			color: -16777216,
			emoji: "",
			startTime: -1,
			duration: -1,
			params: JSON.stringify({ title: options.title }),
			repeat: 0,
			src: 1,
			imei: ctx.imei,
			pinAct: options.pinAct ? 1 : 0
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response, (result) => {
			if (typeof result.data.params === "string") result.data.params = JSON.parse(result.data.params);
			return result.data;
		});
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/createPoll.js
const createPollFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/poll/create`);
	/**
	* Create a poll in a group.
	*
	* @param options Poll options
	* @param groupId Group ID to create poll from
	*
	* @throws {ZaloApiError}
	*/
	return async function createPoll(options, groupId) {
		var _a;
		const params = {
			group_id: groupId,
			question: options.question,
			options: options.options,
			expired_time: (_a = options.expiredTime) !== null && _a !== void 0 ? _a : 0,
			pinAct: false,
			allow_multi_choices: !!options.allowMultiChoices,
			allow_add_new_option: !!options.allowAddNewOption,
			is_hide_vote_preview: !!options.hideVotePreview,
			is_anonymous: !!options.isAnonymous,
			poll_type: 0,
			src: 1,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/createProductCatalog.js
const createProductCatalogFactory = apiFactory()((api, _, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.catalog[0]}/api/prodcatalog/product/create`);
	/**
	* Create product catalog?
	*
	* @param payload payload
	*
	* @note this API is used for zBussiness - Maximum 5 media files are supported
	* @throws {ZaloApiError}
	*/
	return async function createProductCatalog(payload) {
		const productPhoto = payload.product_photos || [];
		if (payload.files && payload.files.length == 0) {
			if (payload.files.length > 5) throw new ZaloApiError("Maximum 5 media files are allowed");
			for (const mediaFile of payload.files) {
				const uploadMedia = await api.uploadProductPhoto({ file: mediaFile });
				const url = uploadMedia.normalUrl || uploadMedia.hdUrl;
				productPhoto.push(url);
			}
		}
		if (productPhoto.length > 5) throw new ZaloApiError("Maximum 5 media files are allowed");
		const params = {
			product_name: payload.productName,
			price: payload.price,
			description: payload.description,
			product_photos: productPhoto,
			catalog_id: payload.catalogId,
			currency_unit: "₫",
			create_time: Date.now()
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/createReminder.js
const createReminderFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = {
		[ThreadType.User]: utils.makeURL(`${api.zpwServiceMap.group_board[0]}/api/board/oneone/create`),
		[ThreadType.Group]: utils.makeURL(`${api.zpwServiceMap.group_board[0]}/api/board/topic/createv2`)
	};
	/**
	* Create a reminder in a group
	*
	* @param options reminder options
	* @param threadId Group ID to create note from
	* @param type Thread type (User or Group)
	*
	* @throws {ZaloApiError}
	*/
	return async function createReminder(options, threadId, type = ThreadType.User) {
		var _a, _b, _c, _d, _e, _f;
		const params = type === ThreadType.User ? {
			objectData: JSON.stringify({
				toUid: threadId,
				type: 0,
				color: -16245706,
				emoji: (_a = options.emoji) !== null && _a !== void 0 ? _a : "⏰",
				startTime: (_b = options.startTime) !== null && _b !== void 0 ? _b : Date.now(),
				duration: -1,
				params: { title: options.title },
				needPin: false,
				repeat: (_c = options.repeat) !== null && _c !== void 0 ? _c : ReminderRepeatMode.None,
				creatorUid: ctx.uid,
				src: 1
			}),
			imei: ctx.imei
		} : {
			grid: threadId,
			type: 0,
			color: -16245706,
			emoji: (_d = options.emoji) !== null && _d !== void 0 ? _d : "⏰",
			startTime: (_e = options.startTime) !== null && _e !== void 0 ? _e : Date.now(),
			duration: -1,
			params: JSON.stringify({ title: options.title }),
			repeat: (_f = options.repeat) !== null && _f !== void 0 ? _f : ReminderRepeatMode.None,
			src: 1,
			imei: ctx.imei,
			pinAct: 0
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL[type], {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/deleteAutoReply.js
const deleteAutoReplyFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.auto_reply[0]}/api/autoreply/delete`);
	/**
	* Delete auto reply
	*
	* @param id id of auto reply
	*
	* @note this API used for zBusiness
	* @throws {ZaloApiError}
	*/
	return async function deleteAutoReply(id) {
		const params = {
			cliLang: ctx.language,
			id
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/deleteAvatar.js
const deleteAvatarFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.profile[0]}/api/social/del-avatars`);
	/**
	* Delete avatar from avatar list
	*
	* @param photoId avatar photo ID(s) to delete - can be a single string or array of strings
	*
	* @throws {ZaloApiError}
	*/
	return async function deleteAvatar(photoId) {
		const delPhotos = (Array.isArray(photoId) ? photoId : [photoId]).map((id) => ({ photoId: id }));
		const params = {
			delPhotos: JSON.stringify(delPhotos),
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/deleteCatalog.js
const deleteCatalogFactory = apiFactory()((api, _, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.catalog[0]}/api/prodcatalog/catalog/delete`);
	/**
	* Delete catalog?
	*
	* @param catalogId catalog id
	*
	* @note this API is used for zBusiness
	* @throws {ZaloApiError}
	*/
	return async function deleteCatalog(catalogId) {
		const params = { catalog_id: catalogId };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/deleteChat.js
const deleteChatFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = {
		[ThreadType.User]: utils.makeURL(`${api.zpwServiceMap.chat[0]}/api/message/deleteconver`, { nretry: 0 }),
		[ThreadType.Group]: utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/deleteconver`, { nretry: 0 })
	};
	/**
	* Delete chat
	*
	* @param lastMessage Last message info
	* @param threadId Thread ID
	* @param type Thread type
	*
	* @throws {ZaloApiError}
	*/
	return async function deleteChat(lastMessage, threadId, type = ThreadType.User) {
		const timestampString = Date.now().toString();
		const params = type === ThreadType.User ? {
			toid: threadId,
			cliMsgId: timestampString,
			conver: lastMessage,
			onlyMe: 1,
			imei: ctx.imei
		} : {
			grid: threadId,
			cliMsgId: timestampString,
			conver: lastMessage,
			onlyMe: 1,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL[type], {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/deleteGroupInviteBox.js
const deleteGroupInviteBoxFactory = apiFactory()((api, _, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/inv-box/mdel-inv`);
	/**
	* Delete group invite box
	*
	* @param groupId - The group id
	* @param blockFutureInvite - Whether to block future invites from this group
	*
	* @throws {ZaloApiError}
	*/
	return async function deleteGroupInviteBox(groupId, blockFutureInvite = false) {
		const params = {
			invitations: JSON.stringify((Array.isArray(groupId) ? groupId : [groupId]).map((grid) => ({ grid }))),
			block: blockFutureInvite ? 1 : 0
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/deleteMessage.js
const deleteMessageFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = {
		[ThreadType.User]: utils.makeURL(`${api.zpwServiceMap.chat[0]}/api/message/delete`),
		[ThreadType.Group]: utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/deletemsg`)
	};
	/**
	* Delete a message
	*
	* @param dest Delete target
	* @param onlyMe Delete message for only you
	*
	* @throws {ZaloApiError}
	*/
	return async function deleteMessage(dest, onlyMe = false) {
		const { threadId, type = ThreadType.User, data } = dest;
		const isGroup = type === ThreadType.Group;
		if (ctx.uid == data.uidFrom && onlyMe === false) throw new ZaloApiError("To delete your message for everyone, use undo api instead");
		if (!isGroup && onlyMe === false) throw new ZaloApiError("Can't delete message for everyone in a private chat");
		const params = {
			[isGroup ? "grid" : "toid"]: threadId,
			cliMsgId: Date.now(),
			msgs: [{
				cliMsgId: data.cliMsgId,
				globalMsgId: data.msgId,
				ownerId: data.uidFrom,
				destId: threadId
			}],
			onlyMe: onlyMe ? 1 : 0
		};
		if (!isGroup) params.imei = ctx.imei;
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt message");
		const response = await utils.request(serviceURL[type], {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/deleteProductCatalog.js
const deleteProductCatalogFactory = apiFactory()((api, _, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.catalog[0]}/api/prodcatalog/product/mdelete`);
	/**
	* Delete product catalog?
	*
	* @param payload payload
	*
	* @note this API is used for zBusiness
	* @throws {ZaloApiError}
	*/
	return async function deleteProductCatalog(payload) {
		if (!Array.isArray(payload.productIds)) payload.productIds = [payload.productIds];
		const params = {
			product_ids: payload.productIds,
			catalog_id: payload.catalogId
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/disableGroupLink.js
const disableGroupLinkFactory = apiFactory()((api, _ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/link/disable`);
	/**
	* Disable group link
	*
	* @param groupId The group id
	*
	* @throws {ZaloApiError}
	*/
	return async function disableGroupLink(groupId) {
		const params = { grid: groupId };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/disperseGroup.js
const disperseGroupFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/disperse`);
	/**
	* Disperse Group
	*
	* @param groupId Group ID to disperse Group from
	*
	* @throws {ZaloApiError}
	*/
	return async function disperseGroup(groupId) {
		const params = {
			grid: groupId,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/editNote.js
const editNoteFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group_board[0]}/api/board/topic/updatev2`);
	/**
	* Edit an existing note in a group
	*
	* @param options Options for editing the note
	* @param groupId Group ID to create note from
	*
	* @throws {ZaloApiError}
	*/
	return async function editNote(options, groupId) {
		const params = {
			grid: groupId,
			type: 0,
			color: -16777216,
			emoji: "",
			startTime: -1,
			duration: -1,
			params: JSON.stringify({ title: options.title }),
			topicId: options.topicId,
			repeat: 0,
			imei: ctx.imei,
			pinAct: options.pinAct ? 1 : 2
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response, (result) => {
			const data = result.data;
			if (typeof data.params == "string") data.params = JSON.parse(data.params);
			return data;
		});
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/editReminder.js
const editReminderFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = {
		[ThreadType.User]: utils.makeURL(`${api.zpwServiceMap.group_board[0]}/api/board/oneone/update`),
		[ThreadType.Group]: utils.makeURL(`${api.zpwServiceMap.group_board[0]}/api/board/topic/updatev2`)
	};
	/**
	* Edit an existing reminder
	*
	* @param options Reminder parameters
	* @param threadId Thread ID
	* @param type Thread type (User/Group)
	*
	* @throws {ZaloApiError}
	*/
	return async function editReminder(options, threadId, type = ThreadType.User) {
		var _a, _b, _c, _d, _e, _f;
		const requestParams = type === ThreadType.User ? { objectData: JSON.stringify({
			toUid: threadId,
			type: 0,
			color: -16777216,
			emoji: (_a = options.emoji) !== null && _a !== void 0 ? _a : "",
			startTime: (_b = options.startTime) !== null && _b !== void 0 ? _b : Date.now(),
			duration: -1,
			params: { title: options.title },
			needPin: false,
			reminderId: options.topicId,
			repeat: (_c = options.repeat) !== null && _c !== void 0 ? _c : 0
		}) } : {
			grid: threadId,
			type: 0,
			color: -16777216,
			emoji: (_d = options.emoji) !== null && _d !== void 0 ? _d : "",
			startTime: (_e = options.startTime) !== null && _e !== void 0 ? _e : Date.now(),
			duration: -1,
			params: JSON.stringify({ title: options.title }),
			topicId: options.topicId,
			repeat: (_f = options.repeat) !== null && _f !== void 0 ? _f : 0,
			imei: ctx.imei,
			pinAct: 2
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(requestParams));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL[type], {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/enableGroupLink.js
const enableGroupLinkFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/link/new`);
	/**
	* Enable and create new group link
	*
	* @param groupId The group id
	*
	* @throws {ZaloApiError}
	*/
	return async function enableGroupLink(groupId) {
		const params = {
			grid: groupId,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/fetchAccountInfo.js
const fetchAccountInfoFactory = apiFactory()((api, _, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.profile[0]}/api/social/profile/me-v2`);
	return async function fetchAccountInfo() {
		const response = await utils.request(serviceURL, { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/findUser.js
const findUserFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.friend[0]}/api/friend/profile/get`);
	/**
	* Find user by phone number
	*
	* @param phoneNumber Phone number
	* @param avatarSize Avatar size (default: AvatarSize.Large)
	*
	* @throws {ZaloApiError}
	*/
	return async function findUser(phoneNumber, avatarSize = AvatarSize.Large) {
		if (!phoneNumber) throw new ZaloApiError("Missing phoneNumber");
		if (phoneNumber.startsWith("0")) {
			if (ctx.language == "vi") phoneNumber = "84" + phoneNumber.slice(1);
		}
		const params = {
			phone: phoneNumber,
			avatar_size: avatarSize,
			language: ctx.language,
			imei: ctx.imei,
			reqSrc: 40
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt message");
		const finalServiceUrl = new URL(serviceURL);
		finalServiceUrl.searchParams.append("params", encryptedParams);
		const response = await utils.request(utils.makeURL(finalServiceUrl.toString(), { params: encryptedParams }));
		return utils.resolve(response, (result) => {
			if (result.error && result.error.code != 216) throw new ZaloApiError(result.error.message, result.error.code);
			return result.data;
		});
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/findUserByUsername.js
const findUserByUsernameFactory = apiFactory()((api, _ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.friend[0]}/api/friend/search/by-user-name`);
	/**
	* Find user by username
	*
	* @param username username for find
	* @param avatarSize Avatar size (default: AvatarSize.Large)
	*
	* @throws {ZaloApiError}
	*/
	return async function findUserByUsername(username, avatarSize = AvatarSize.Large) {
		const params = {
			user_name: username,
			avatar_size: avatarSize
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/forwardMessage.js
const forwardMessageFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = {
		[ThreadType.User]: utils.makeURL(`${api.zpwServiceMap.file[0]}/api/message/mforward`),
		[ThreadType.Group]: utils.makeURL(`${api.zpwServiceMap.file[0]}/api/group/mforward`)
	};
	/**
	* Forward message to multiple threads
	*
	* @param payload Forward message payload
	* @param threadId Thread ID(s)
	* @param type Thread type (User/Group)
	*
	* @throws {ZaloApiError}
	*/
	return async function forwardMessage(payload, threadIds, type = ThreadType.User) {
		var _a, _b;
		if (!payload.message) throw new ZaloApiError("Missing message content");
		if (!threadIds || threadIds.length === 0) throw new ZaloApiError("Missing thread IDs");
		const clientId = Date.now().toString();
		const msgInfo = {
			message: payload.message,
			reference: payload.reference ? JSON.stringify({
				type: 3,
				data: JSON.stringify(payload.reference)
			}) : void 0
		};
		const decorLog = payload.reference ? { fw: {
			pmsg: {
				st: 1,
				ts: payload.reference.ts,
				id: payload.reference.id
			},
			rmsg: {
				st: 1,
				ts: payload.reference.ts,
				id: payload.reference.id
			},
			fwLvl: payload.reference.fwLvl
		} } : null;
		let params;
		if (type === ThreadType.User) params = {
			toIds: threadIds.map((threadId) => {
				var _a;
				return {
					clientId,
					toUid: threadId,
					ttl: (_a = payload.ttl) !== null && _a !== void 0 ? _a : 0
				};
			}),
			imei: ctx.imei,
			ttl: (_a = payload.ttl) !== null && _a !== void 0 ? _a : 0,
			msgType: "1",
			totalIds: threadIds.length,
			msgInfo: JSON.stringify(msgInfo),
			decorLog: JSON.stringify(decorLog)
		};
		else params = {
			grids: threadIds.map((threadId) => {
				var _a;
				return {
					clientId,
					grid: threadId,
					ttl: (_a = payload.ttl) !== null && _a !== void 0 ? _a : 0
				};
			}),
			ttl: (_b = payload.ttl) !== null && _b !== void 0 ? _b : 0,
			msgType: "1",
			totalIds: threadIds.length,
			msgInfo: JSON.stringify(msgInfo),
			decorLog: JSON.stringify(decorLog)
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL[type], {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getAliasList.js
const getAliasListFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.alias[0]}/api/alias/list`);
	/**
	* Get alias list
	*
	* @param count Page size (default: 100)
	* @param page Page number (default: 1)
	*
	* @throws {ZaloApiError}
	*/
	return async function getAliasList(count = 100, page = 1) {
		const params = {
			page,
			count,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getAllFriends.js
const getAllFriendsFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.profile[0]}/api/social/friend/getfriends`);
	/**
	* Get all friends
	*
	* @param count Page size (default: 20000)
	* @param page Page number (default: 1)
	* @param avatarSize Avatar size (default: AvatarSize.Small)
	*
	* @throws {ZaloApiError}
	*/
	return async function getAllFriends(count = 2e4, page = 1, avatarSize = AvatarSize.Small) {
		const params = {
			incInvalid: 1,
			page,
			count,
			avatar_size: avatarSize,
			actiontime: 0,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt message");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getAllGroups.js
const getAllGroupsFactory = apiFactory()((api, _, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group_poll[0]}/api/group/getlg/v4`);
	return async function getAllGroups() {
		const response = await utils.request(serviceURL, { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getArchivedChatList.js
const getArchivedChatListFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.label[0]}/api/archivedchat/list`);
	/**
	* Get arcnived chat list
	*
	* @throws {ZaloApiError}
	*/
	return async function getArchivedChatList() {
		const params = {
			version: 1,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getAutoDeleteChat.js
const getAutoDeleteChatFactory = apiFactory()((api, _ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.conversation[0]}/api/conv/autodelete/getConvers`);
	/**
	* Get auto delete chat
	*
	* @throws {ZaloApiError}
	*
	*/
	return async function getAutoDeleteChat() {
		const encryptedParams = utils.encodeAES(JSON.stringify({}));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getAutoReplyList.js
const getAutoReplyListFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.auto_reply[0]}/api/autoreply/list`);
	/**
	* Get auto reply list
	*
	* @note this API used for zBusiness
	* @throws {ZaloApiError}
	*/
	return async function getAutoReplyList() {
		const params = {
			version: 0,
			cliLang: ctx.language
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getAvatarList.js
const getAvatarListFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.profile[0]}/api/social/avatar-list`);
	/**
	* Get avatar list
	*
	* @param count The number of avatars to fetch (default: 50)
	* @param page The page number to fetch (default: 1)
	*
	* @throws {ZaloApiError}
	*/
	return async function getAvatarList(count = 50, page = 1) {
		const params = {
			page,
			albumId: "0",
			count,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getAvatarUrlProfile.js
const getAvatarUrlProfileFactory = apiFactory()((api, _ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.profile[0]}/api/social/profile/avatar-url`);
	/**
	* Get avatar url profile
	*
	* @param friendId friend id(s)
	* @param avatarSize Avatar size (default: AvatarSize.Large)
	*
	* @throws {ZaloApiError}
	*/
	return async function getAvatarUrlProfile(friendIds, avatarSize = AvatarSize.Large) {
		if (!Array.isArray(friendIds)) friendIds = [friendIds];
		const params = {
			friend_ids: friendIds,
			avatar_size: avatarSize,
			srcReq: -1
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getBizAccount.js
const getBizAccountFactory = apiFactory()((api, _ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.profile[0]}/api/social/friend/get-bizacc`);
	/**
	* Get biz account
	*
	* @param friendId The friend ID to get biz account
	*
	* @throws {ZaloApiError}
	*/
	return async function getBizAccount(friendId) {
		const params = { fid: friendId };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getCatalogList.js
const getCatalogListFactory = apiFactory()((api, _, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.catalog[0]}/api/prodcatalog/catalog/list`);
	/**
	* Get catalog list?
	*
	* @param payload payload
	*
	* @note this API is used for zBusiness
	* @throws {ZaloApiError}
	*/
	return async function getCatalogList(payload) {
		var _a, _b, _c;
		const params = {
			version_list_catalog: 0,
			limit: (_a = payload === null || payload === void 0 ? void 0 : payload.limit) !== null && _a !== void 0 ? _a : 20,
			last_product_id: (_b = payload === null || payload === void 0 ? void 0 : payload.lastProductId) !== null && _b !== void 0 ? _b : -1,
			page: (_c = payload === null || payload === void 0 ? void 0 : payload.page) !== null && _c !== void 0 ? _c : 0
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getCloseFriends.js
const getCloseFriendsFactory = apiFactory()((api, _ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.profile[0]}/api/social/friend/getclosedfriends`);
	/**
	* Get close friends
	*
	* @throws {ZaloApiError}
	*/
	return async function getCloseFriends() {
		const encryptedParams = utils.encodeAES(JSON.stringify({}));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getContext.js
const getContextFactory = apiFactory()((_, ctx) => {
	return () => ctx;
});
//#endregion
//#region node_modules/zca-js/dist/apis/getCookie.js
const getCookieFactory = apiFactory()((_, ctx) => {
	/**
	* Get the current cookie string
	*/
	return function getCookie() {
		return ctx.cookie;
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getFriendBoardList.js
const getFriendBoardListFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.friend_board[0]}/api/friendboard/list`);
	/**
	* Get friend board list
	*
	* @param conversationId conversation id
	*
	* @throws {ZaloApiError}
	*/
	return async function getFriendBoardList(conversationId) {
		const params = {
			conversationId,
			version: 0,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getFriendOnlines.js
const getFriendOnlinesFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.profile[0]}/api/social/friend/onlines`);
	/**
	* Get friend onlines?
	*
	* @throws {ZaloApiError}
	*/
	return async function getFriendOnlines() {
		const params = { imei: ctx.imei };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response, (result) => {
			const data = result.data;
			if (Array.isArray(data.onlines)) {
				for (const online of data.onlines) if (typeof online.status === "string") {
					const parsed = JSON.parse(online.status);
					if (parsed && typeof parsed.status === "string") online.status = parsed.status;
				}
			}
			return data;
		});
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getFriendRecommendations.js
var FriendRecommendationsType;
(function(FriendRecommendationsType) {
	FriendRecommendationsType[FriendRecommendationsType["RecommendedFriend"] = 1] = "RecommendedFriend";
	FriendRecommendationsType[FriendRecommendationsType["ReceivedFriendRequest"] = 2] = "ReceivedFriendRequest";
})(FriendRecommendationsType || (FriendRecommendationsType = {}));
const getFriendRecommendationsFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.friend[0]}/api/friend/recommendsv2/list`);
	/**
	* Get friend recommendations/received friend requests
	*
	* @throws {ZaloApiError}
	*/
	return async function getFriendRecommendations() {
		const params = { imei: ctx.imei };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getFriendRequestStatus.js
const getFriendRequestStatusFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.friend[0]}/api/friend/reqstatus`);
	/**
	* Get friend request status
	*
	* @param friendId friend id
	*
	* @throws {ZaloApiError}
	*/
	return async function getFriendRequestStatus(friendId) {
		const params = {
			fid: friendId,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getFullAvatar.js
const getFullAvatarFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.profile[0]}/api/social/profile/avatar`);
	/**
	* Get full avatar
	*
	* @param friendId friend id
	*
	* @throws {ZaloApiError}
	*/
	return async function getFullAvatar(friendId) {
		const params = {
			fid: friendId,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getGroupBlockedMember.js
const getGroupBlockedMemberFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/blockedmems/list`);
	/**
	* Get group blocked member
	*
	* @param payload payload
	* @param groupId group id
	*
	* @throws {ZaloApiError}
	*/
	return async function getGroupBlockedMember(payload, groupId) {
		var _a, _b;
		const params = {
			grid: groupId,
			page: (_a = payload.page) !== null && _a !== void 0 ? _a : 1,
			count: (_b = payload.count) !== null && _b !== void 0 ? _b : 50,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getGroupChatHistory.js
const getGroupChatHistoryFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/history`);
	/**
	* Get group chat history
	*
	* @param groupId group id
	* @param count count of messages to return (default: 50)
	*
	* @throws {ZaloApiError}
	*/
	return async function getGroupChatHistory(groupId, count = 50) {
		const params = {
			grid: groupId,
			count
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response, (result) => {
			let data = result.data;
			if (typeof data === "string") data = JSON.parse(data);
			for (let i = 0; i < data.groupMsgs.length; i++) data.groupMsgs[i] = new GroupMessage(ctx.uid, data.groupMsgs[i]);
			return data;
		});
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getGroupInfo.js
const getGroupInfoFactory = apiFactory()((api, _, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/getmg-v2`);
	/**
	* Get group information
	*
	* @param groupId Group ID or list of group IDs
	*
	* @throws {ZaloApiError}
	*/
	return async function getGroupInfo(groupId) {
		if (!Array.isArray(groupId)) groupId = [groupId];
		const params = { gridVerMap: JSON.stringify(groupId.reduce((acc, id) => {
			acc[id] = 0;
			return acc;
		}, {})) };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt message");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getGroupInviteBoxInfo.js
const getGroupInviteBoxInfoFactory = apiFactory()((api, _, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/inv-box/inv-info`);
	/**
	* Get group invite box info
	*
	* @param payload - The payload of the request
	*
	* @throws {ZaloApiError}
	*/
	return async function getGroupInviteBoxInfo(payload) {
		var _a, _b;
		const params = {
			grId: payload.groupId,
			mcount: (_a = payload.mcount) !== null && _a !== void 0 ? _a : 10,
			mpage: (_b = payload.mpage) !== null && _b !== void 0 ? _b : 1
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response, (result) => {
			const data = result.data;
			const topic = data.groupInfo.topic;
			if (typeof topic.params == "string") {
				const params = JSON.parse(topic.params);
				if (typeof params.extra == "string") params.extra = JSON.parse(params.extra);
				topic.params = params;
			}
			return data;
		});
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getGroupInviteBoxList.js
const getGroupInviteBoxListFactory = apiFactory()((api, _, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/inv-box/list`);
	/**
	* Get group invite box list
	*
	* @param payload - The payload of the request
	*
	* @throws {ZaloApiError}
	*/
	return async function getGroupInviteBoxList(payload) {
		var _a, _b, _c, _d;
		const params = {
			mpage: (_a = payload === null || payload === void 0 ? void 0 : payload.mpage) !== null && _a !== void 0 ? _a : 1,
			page: (_b = payload === null || payload === void 0 ? void 0 : payload.page) !== null && _b !== void 0 ? _b : 0,
			invPerPage: (_c = payload === null || payload === void 0 ? void 0 : payload.invPerPage) !== null && _c !== void 0 ? _c : 12,
			mcount: (_d = payload === null || payload === void 0 ? void 0 : payload.mcount) !== null && _d !== void 0 ? _d : 10,
			lastGroupId: null,
			avatar_size: 120,
			member_avatar_size: 120
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getGroupLinkDetail.js
const getGroupLinkDetailFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/link/detail`);
	/**
	* Get group link detail
	*
	* @param groupId The group id
	*
	* @throws {ZaloApiError}
	*/
	return async function getGroupLinkDetail(groupId) {
		const params = {
			grid: groupId,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getGroupLinkInfo.js
const getGroupLinkInfoFactory = apiFactory()((api, _ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/link/ginfo`);
	/**
	* Get group link info
	*
	* @param payload - The payload of the request
	*
	* @throws {ZaloApiError}
	*/
	return async function getGroupLinkInfo(payload) {
		var _a;
		const params = {
			link: payload.link,
			avatar_size: 120,
			member_avatar_size: 120,
			mpage: (_a = payload.memberPage) !== null && _a !== void 0 ? _a : 1
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getGroupMembersInfo.js
const getGroupMembersInfoFactory = apiFactory()((api, _, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.profile[0]}/api/social/group/members`);
	/**
	* Get group information
	*
	* @param memberId member id or array of member ids
	*
	* @throws {ZaloApiError}
	*/
	return async function getGroupMembersInfo(memberId) {
		if (!Array.isArray(memberId)) memberId = [memberId];
		const params = { friend_pversion_map: memberId.map((id) => id.endsWith("_0") ? id : `${id}_0`) };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt message");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }));
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getHiddenConversations.js
const getHiddenConversationsFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.conversation[0]}/api/hiddenconvers/get-all`);
	/**
	* Get hidden conversations
	*
	* @throws {ZaloApiError}
	*
	*/
	return async function getHiddenConversations() {
		const params = { imei: ctx.imei };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getLabels.js
const getLabelsFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.label[0]}/api/convlabel/get`);
	/**
	* Get all labels
	*
	* @throws {ZaloApiError}
	*/
	return async function getLabels() {
		const params = { imei: ctx.imei };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt message");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }));
		return utils.resolve(response, (result) => {
			const data = result.data;
			return {
				labelData: JSON.parse(data.labelData),
				version: data.version,
				lastUpdateTime: data.lastUpdateTime
			};
		});
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getListBoard.js
const getListBoardFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group_board[0]}/api/board/list`);
	/**
	* Get list board items in a group
	*
	* @param options - The options for the request
	* @param groupId - The ID of the group
	*
	* @throws {ZaloApiError}
	*
	*/
	return async function getListBoard(options, groupId) {
		var _a, _b;
		const requestParams = {
			group_id: groupId,
			board_type: 0,
			page: (_a = options.page) !== null && _a !== void 0 ? _a : 1,
			count: (_b = options.count) !== null && _b !== void 0 ? _b : 20,
			last_id: 0,
			last_type: 0,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(requestParams));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response, (result) => {
			const data = result.data;
			data.items.forEach((item) => {
				if (item.boardType != BoardType.Poll) {
					const detailData = item.data;
					if (typeof detailData.params === "string") detailData.params = JSON.parse(detailData.params);
				}
			});
			return data;
		});
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getListReminder.js
const getListReminderFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = {
		[ThreadType.User]: utils.makeURL(`${api.zpwServiceMap.group_board[0]}/api/board/oneone/list`),
		[ThreadType.Group]: utils.makeURL(`${api.zpwServiceMap.group_board[0]}/api/board/listReminder`)
	};
	/**
	* Get list reminder
	*
	* @param options - The options for the request
	* @param threadId - The ID of the thread
	* @param type - The type of the thread (User or Group)
	*
	* @throws {ZaloApiError}
	*/
	return async function getListReminder(options, threadId, type = ThreadType.User) {
		var _a, _b, _c, _d;
		const requestParams = Object.assign({ objectData: JSON.stringify(type === ThreadType.User ? {
			uid: threadId,
			board_type: 1,
			page: (_a = options.page) !== null && _a !== void 0 ? _a : 1,
			count: (_b = options.count) !== null && _b !== void 0 ? _b : 20,
			last_id: 0,
			last_type: 0
		} : {
			group_id: threadId,
			board_type: 1,
			page: (_c = options.page) !== null && _c !== void 0 ? _c : 1,
			count: (_d = options.count) !== null && _d !== void 0 ? _d : 20,
			last_id: 0,
			last_type: 0
		}) }, type === ThreadType.Group && { imei: ctx.imei });
		const encryptedParams = utils.encodeAES(JSON.stringify(requestParams));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL[type], { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response, (result) => {
			return JSON.parse(result.data);
		});
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getMultiUsersByPhones.js
const getMultiUsersByPhonesFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.friend[0]}/api/friend/profile/multiget`);
	/**
	* Get multiple user(s) by their phone numbers.
	*
	* @param phoneNumbers Phone number(s)
	* @param avatarSize Avatar size (default: AvatarSize.Large)
	*
	* @throws {ZaloApiError}
	*/
	return async function getMultiUsersByPhones(phoneNumbers, avatarSize = AvatarSize.Large) {
		if (!phoneNumbers) throw new ZaloApiError("Missing phoneNumbers");
		if (!Array.isArray(phoneNumbers)) phoneNumbers = [phoneNumbers];
		phoneNumbers = phoneNumbers.map((phone) => {
			if (phone.startsWith("0")) {
				if (ctx.language == "vi") phone = "84" + phone.slice(1);
			}
			return phone;
		});
		const params = {
			phones: phoneNumbers,
			avatar_size: avatarSize,
			language: ctx.language
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getMute.js
const getMuteFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.profile[0]}/api/social/profile/getmute`);
	/**
	* Get mute
	*
	* @throws {ZaloApiError}
	*/
	return async function getMute() {
		const params = { imei: ctx.imei };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getOwnId.js
const getOwnIdFactory = apiFactory()((_, ctx) => {
	return () => ctx.uid;
});
//#endregion
//#region node_modules/zca-js/dist/apis/getPendingGroupMembers.js
const getPendingGroupMembersFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/pending-mems/list`);
	/**
	* Get pending group members
	*
	* @param groupId - The id of the group to get the pending members
	*
	* @note Only the group leader and deputy group leader can view
	*
	* @throws {ZaloApiError}
	*/
	return async function getPendingGroupMembers(groupId) {
		const params = {
			grid: groupId,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getPinConversations.js
const getPinConversationsFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.conversation[0]}/api/pinconvers/list`);
	/**
	* Get pin conversations
	*
	* @throws {ZaloApiError}
	*/
	return async function getPinConversations() {
		const params = { imei: ctx.imei };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getPollDetail.js
const getPollDetailFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/poll/detail`);
	/**
	* Get poll detail
	*
	* @param pollId Poll ID
	*
	* @throws {ZaloApiError}
	*/
	return async function getPollDetail(pollId) {
		if (!pollId) throw new ZaloApiError("Missing poll id");
		const params = {
			poll_id: pollId,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt message");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getProductCatalogList.js
const getProductCatalogListFactory = apiFactory()((api, _, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.catalog[0]}/api/prodcatalog/product/list`);
	/**
	* Get product catalog list?
	*
	* @param payload payload
	*
	* @note this API is used for zBusiness
	* @throws {ZaloApiError}
	*/
	return async function getProductCatalogList(payload) {
		var _a, _b, _c, _d;
		const params = {
			catalog_id: payload.catalogId,
			limit: (_a = payload.limit) !== null && _a !== void 0 ? _a : 100,
			version_catalog: (_b = payload.versionCatalog) !== null && _b !== void 0 ? _b : 0,
			last_product_id: (_c = payload.lastProductId) !== null && _c !== void 0 ? _c : -1,
			page: (_d = payload.page) !== null && _d !== void 0 ? _d : 0
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getQR.js
const getQRFactory = apiFactory()((api, _, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.friend[0]}/api/friend/mget-qr`);
	/**
	* Get QR code for users
	*
	* @param userId User ID or list of user IDs
	*
	* @throws {ZaloApiError}
	*/
	return async function getQR(userId) {
		if (typeof userId == "string") userId = [userId];
		const params = { fids: userId };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getQuickMessageList.js
const getQuickMessageListFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.quick_message[0]}/api/quickmessage/list`);
	/**
	* Get quick message list
	*
	* @throws {ZaloApiError}
	*/
	return async function getQuickMessageList() {
		const params = {
			version: 0,
			lang: 0,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getRelatedFriendGroup.js
const getRelatedFriendGroupFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.friend[0]}/api/friend/group/related`);
	/**
	* Get related friend group
	*
	* @param friendId friend ids
	*
	* @note this API is used for zBusiness
	* @throws {ZaloApiError}
	*/
	return async function getRelatedFriendGroup(friendId) {
		const params = {
			friend_ids: JSON.stringify(Array.isArray(friendId) ? friendId : [friendId]),
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getReminder.js
const getReminderFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group_board[0]}/api/board/topic/getReminder`);
	/**
	* Get reminder details from a group
	*
	* @param reminderId Reminder ID
	*
	* @throws {ZaloApiError}
	*/
	return async function getReminder(reminderId) {
		const params = {
			eventId: reminderId,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getReminderResponses.js
const getReminderResponsesFactory = apiFactory()((api, _ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group_board[0]}/api/board/topic/listResponseEvent`);
	/**
	* Get reminder responses
	*
	* @param reminderId reminder id
	*
	* @throws {ZaloApiError}
	*/
	return async function getReminderResponses(reminderId) {
		const params = { eventId: reminderId };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getSentFriendRequest.js
const getSentFriendRequestFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.friend[0]}/api/friend/requested/list`);
	/**
	* Get friend requested
	*
	* @note Zalo might throw an error with code 112 if you have no friend requests.
	*
	* @throws {ZaloApiError}
	*/
	return async function getSentFriendRequest() {
		const params = { imei: ctx.imei };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getSettings.js
const getSettingsFactory = apiFactory()((_api, _ctx, utils) => {
	const serviceURL = utils.makeURL(`https://wpa.chat.zalo.me/api/setting/me`);
	/**
	* Get my account settings
	*
	* @throws {ZaloApiError}
	*/
	return async function getSettings() {
		const encryptedParams = utils.encodeAES(JSON.stringify({}));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getStickerCategoryDetail.js
const getStickerCategoryDetailFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.sticker[0]}/api/message/sticker/category/sticker_detail`);
	/**
	* Get sticker category detail
	*
	* @param cateId Sticker category ID
	*
	* @throws {ZaloApiError}
	*/
	return async function getStickerCategoryDetail(cateId) {
		const params = { cid: cateId };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getStickers.js
const getStickersFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.sticker}/api/message/sticker`);
	/**
	* Get stickers by keyword
	*
	* @param keyword Keyword to search for
	* @returns Sticker IDs
	*
	* @throws {ZaloApiError}
	*/
	return async function getStickers(keyword) {
		if (!keyword) throw new ZaloApiError("Missing keyword");
		const params = {
			keyword,
			gif: 1,
			guggy: 0,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt message");
		const finalServiceUrl = new URL(serviceURL);
		finalServiceUrl.pathname = finalServiceUrl.pathname + "/suggest/stickers";
		const response = await utils.request(utils.makeURL(finalServiceUrl.toString(), { params: encryptedParams }));
		return utils.resolve(response, (result) => {
			const suggestions = result.data;
			const stickerIds = [];
			if (suggestions.sugg_sticker) suggestions.sugg_sticker.forEach((sticker) => stickerIds.push(sticker.sticker_id));
			return stickerIds;
		});
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getStickersDetail.js
const getStickersDetailFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.sticker}/api/message/sticker/sticker_detail`);
	/**
	* Get stickers detail by sticker IDs
	*
	* @param stickerIds Sticker IDs to search for
	*
	* @throws {ZaloApiError}
	*/
	return async function getStickersDetail(stickerIds) {
		if (!stickerIds) throw new ZaloApiError("Missing sticker id");
		if (!Array.isArray(stickerIds)) stickerIds = [stickerIds];
		if (stickerIds.length == 0) throw new ZaloApiError("Missing sticker id");
		const stickers = [];
		const tasks = stickerIds.map((stickerId) => getStickerDetail(stickerId));
		(await Promise.allSettled(tasks)).forEach((result) => {
			if (result.status === "fulfilled") stickers.push(result.value);
		});
		return stickers;
	};
	async function getStickerDetail(stickerId) {
		const params = { sid: stickerId };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt message");
		return resolveResponse(ctx, await utils.request(utils.makeURL(serviceURL, { params: encryptedParams })));
	}
});
//#endregion
//#region node_modules/zca-js/dist/apis/getUnreadMark.js
const getUnreadMarkFactory = apiFactory()((api, _, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.conversation[0]}/api/conv/getUnreadMark`);
	/**
	* Get unread mark
	*
	* @throws {ZaloApiError}
	*
	*/
	return async function getUnreadMark() {
		const encryptedParams = utils.encodeAES(JSON.stringify({}));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response, (result) => {
			const data = result.data;
			if (typeof data.data === "string") return {
				data: JSON.parse(data.data),
				status: data.status
			};
			return data;
		});
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/getUserInfo.js
const getUserInfoFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.profile[0]}/api/social/friend/getprofiles/v2`);
	/**
	* Get user info using user id
	*
	* @param userId User id(s)
	* @param avatarSize Avatar size (default: AvatarSize.Small)
	*
	* @throws {ZaloApiError}
	*/
	return async function getUserInfo(userId, avatarSize = AvatarSize.Small) {
		if (!userId) throw new ZaloApiError("Missing user id");
		if (!Array.isArray(userId)) userId = [userId];
		userId = userId.map((id) => {
			if (id.split("_").length > 1) return id;
			return `${id}_0`;
		});
		const params = {
			phonebook_version: ctx.extraVer.phonebook,
			friend_pversion_map: userId,
			avatar_size: avatarSize,
			language: ctx.language,
			show_online_status: 1,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/inviteUserToGroups.js
const inviteUserToGroupsFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/invite/multi`);
	/**
	* Invite user to group
	*
	* @param groupId group ID(s)
	* @param memberId member ID
	*
	* @throws {ZaloApiError}
	*
	*/
	return async function inviteUserToGroups(userId, groupId) {
		const params = {
			grids: Array.isArray(groupId) ? groupId : [groupId],
			member: userId,
			memberType: -1,
			srcInteraction: 2,
			clientLang: ctx.language
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/joinGroupInviteBox.js
const joinGroupInviteBoxFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/inv-box/join`);
	/**
	* Join group invite box
	*
	* @param groupId - The group id
	*
	* @throws {ZaloApiError}
	*/
	return async function joinGroupInviteBox(groupId) {
		const params = {
			grid: groupId,
			lang: ctx.language
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/joinGroupLink.js
const joinGroupLinkFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/link/join`);
	/**
	* Join group via invite link
	*
	* @note Zalo might throw an error with code 240 if the group enabled membership approval, 178 if you are already a member.
	*
	* @param link - The link join group
	*
	* @throws {ZaloApiError}
	*/
	return async function joinGroupLink(link) {
		const params = {
			link,
			clientLang: ctx.language
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/keepAlive.js
const keepAliveFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.chat[0]}/keepalive`);
	/**
	* Keep Alive?
	*
	* @throws {ZaloApiError}
	*/
	return async function keepAlive() {
		const params = { imei: ctx.imei };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response, void 0, false);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/lastOnline.js
const lastOnlineFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.profile[0]}/api/social/profile/lastOnline`);
	/**
	* Get last online
	*
	* @param uid User ID
	*
	* @throws {ZaloApiError}
	*/
	return async function lastOnline(uid) {
		const params = {
			uid,
			conv_type: 1,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/leaveGroup.js
const leaveGroupFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/leave`);
	/**
	* Leave group
	*
	* @param groupId - groupId to leave
	* @param silent - Turn on/off silent leave group
	*
	* @note Zalo might throw an error with code 166 if you are not a member of the group
	*
	* @throws {ZaloApiError}
	*/
	return async function leaveGroup(groupId, silent = false) {
		const requestParams = {
			grids: [groupId],
			imei: ctx.imei,
			silent: silent ? 1 : 0,
			language: ctx.language
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(requestParams));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/lockPoll.js
const lockPollFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/poll/end`);
	/**
	* Lock a poll, preventing further votes.
	*
	* @param pollId Poll id to lock
	*
	* @throws {ZaloApiError}
	*/
	return async function lockPoll(pollId) {
		const params = {
			poll_id: pollId,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/parseLink.js
const parseLinkFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.file[0]}/api/message/parselink`);
	/**
	* Parse link
	*
	* @param link link to parse
	*
	* @throws {ZaloApiError}
	*
	*/
	return async function parseLink(link) {
		const params = {
			link,
			version: 1,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/rejectFriendRequest.js
const rejectFriendRequestFactory = apiFactory()((api, _ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.friend[0]}/api/friend/reject`);
	/**
	* Reject a friend request from a User
	*
	* @param friendId
	*
	* @throws {ZaloApiError}
	*/
	return async function rejectFriendRequest(friendId) {
		const params = { fid: friendId };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/removeFriend.js
const removeFriendFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.friend[0]}/api/friend/remove`);
	/**
	* Remove friend
	*
	* @param friendId - ID of the friend to remove
	*
	* @throws {ZaloApiError}
	*/
	return async function removeFriend(friendId) {
		const params = {
			fid: friendId,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/removeFriendAlias.js
const removeFriendAliasFactory = apiFactory()((api, _ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.alias[0]}/api/alias/remove`);
	/**
	* Remove friend's alias
	*
	* @param friendId friend id
	*
	* @throws {ZaloApiError}
	*/
	return async function removeFriendAlias(friendId) {
		const params = { friendId };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/removeGroupBlockedMember.js
const removeGroupBlockedMemberFactory = apiFactory()((api, _, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/blockedmems/remove`);
	/**
	* Remove group blocked member
	*
	* @param memberId member id(s)
	* @param groupId group id
	*
	* @throws {ZaloApiError}
	*/
	return async function removeGroupBlockedMember(memberId, groupId) {
		if (!Array.isArray(memberId)) memberId = [memberId];
		const params = {
			grid: groupId,
			members: memberId
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/removeGroupDeputy.js
const removeGroupDeputyFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/admins/remove`);
	/**
	* Remove group deputy
	*
	* @param memberId user Id or list of user Ids
	* @param groupId group Id
	*
	* @throws {ZaloApiError}
	*
	*/
	return async function removeGroupDeputy(memberId, groupId) {
		if (!Array.isArray(memberId)) memberId = [memberId];
		const params = {
			grid: groupId,
			members: memberId,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/removeQuickMessage.js
const removeQuickMessageFactory = apiFactory()((api, _ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.quick_message[0]}/api/quickmessage/delete`);
	/**
	* Remove quick message
	*
	* @param itemIds - The id(s) of the quick message(s) to remove (number or number[])
	*
	* @note Zalo might throw an error with code 212 if the item does not exist
	*
	* @throws {ZaloApiError}
	*/
	return async function removeQuickMessage(itemIds) {
		const params = { itemIds: Array.isArray(itemIds) ? itemIds : [itemIds] };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/removeReminder.js
const removeReminderFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = {
		[ThreadType.User]: utils.makeURL(`${api.zpwServiceMap.group_board[0]}/api/board/oneone/remove`),
		[ThreadType.Group]: utils.makeURL(`${api.zpwServiceMap.group_board[0]}/api/board/topic/remove`)
	};
	/**
	* Remove a reminder in a (user/group)
	*
	* @param reminderId Reminder ID to remove reminder from
	* @param threadId (User/Group) ID to remove reminder from
	* @param type Thread type (User or Group)
	*
	* @throws {ZaloApiError}
	*/
	return async function removeReminder(reminderId, threadId, type = ThreadType.User) {
		const params = type === ThreadType.User ? {
			uid: threadId,
			reminderId
		} : {
			grid: threadId,
			topicId: reminderId,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL[type], {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/removeUnreadMark.js
const removeUnreadMarkFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.conversation[0]}/api/conv/removeUnreadMark`);
	/**
	* Remove unread mark from conversation
	*
	* @param threadId Thread ID
	* @param type Thread type (User/Group)
	*
	* @throws {ZaloApiError}
	*/
	return async function removeUnreadMark(threadId, type = ThreadType.User) {
		const timestamp = Date.now();
		const isGroup = type === ThreadType.Group;
		const requestParams = { param: JSON.stringify({
			[isGroup ? "convsGroup" : "convsUser"]: [threadId],
			[isGroup ? "convsUser" : "convsGroup"]: [],
			[isGroup ? "convsGroupData" : "convsUserData"]: [{
				id: threadId,
				ts: timestamp
			}],
			[isGroup ? "convsUserData" : "convsGroupData"]: []
		}) };
		const encryptedParams = utils.encodeAES(JSON.stringify(requestParams));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response, (result) => {
			const data = result.data;
			if (typeof data.data === "string") return {
				data: JSON.parse(data.data),
				status: data.status
			};
			return result.data;
		});
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/removeUserFromGroup.js
const removeUserFromGroupFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/kickout`);
	/**
	* Remove user from existing group
	*
	* @param memberId User ID or list of user IDs to remove
	* @param groupId Group ID
	*
	* @note Zalo might throw an error with code 165 if the user is not in the group, 166 if you don't have enough permissions or is not in the group
	*
	* @throws {ZaloApiError}
	*/
	return async function removeUserFromGroup(memberId, groupId) {
		if (!Array.isArray(memberId)) memberId = [memberId];
		const params = {
			grid: groupId,
			members: memberId,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/resetHiddenConversPin.js
const resetHiddenConversPinFactory = apiFactory()((api, _ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.conversation[0]}/api/hiddenconvers/reset`);
	/**
	* Reset hidden conversation pin
	*
	* @throws {ZaloApiError}
	*/
	return async function resetHiddenConversPin() {
		const encryptedParams = utils.encodeAES(JSON.stringify({}));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/reuseAvatar.js
const reuseAvatarFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.profile[0]}/api/social/reuse-avatar`);
	/**
	* Reuse avatar
	*
	* @param photoId photo id from getAvatarList api
	*
	* @throws {ZaloApiError}
	*/
	return async function reuseAvatar(photoId) {
		const params = {
			photoId,
			isPostSocial: 0,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/reviewPendingMemberRequest.js
var ReviewPendingMemberRequestStatus;
(function(ReviewPendingMemberRequestStatus) {
	ReviewPendingMemberRequestStatus[ReviewPendingMemberRequestStatus["SUCCESS"] = 0] = "SUCCESS";
	ReviewPendingMemberRequestStatus[ReviewPendingMemberRequestStatus["NOT_IN_PENDING_LIST"] = 170] = "NOT_IN_PENDING_LIST";
	ReviewPendingMemberRequestStatus[ReviewPendingMemberRequestStatus["ALREADY_IN_GROUP"] = 178] = "ALREADY_IN_GROUP";
	ReviewPendingMemberRequestStatus[ReviewPendingMemberRequestStatus["INSUFFICIENT_PERMISSION"] = 166] = "INSUFFICIENT_PERMISSION";
})(ReviewPendingMemberRequestStatus || (ReviewPendingMemberRequestStatus = {}));
const reviewPendingMemberRequestFactory = apiFactory()((api, _, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/pending-mems/review`);
	/**
	* Review pending member(s) request
	*
	* @param payload - The payload containing data to review the pending member(s) request
	* @param groupId - The id of the group to review the pending member(s) request
	*
	* @note Only the group leader and deputy group leader can review
	*
	* @throws {ZaloApiError}
	*/
	return async function reviewPendingMemberRequest(payload, groupId) {
		if (!Array.isArray(payload.members)) payload.members = [payload.members];
		const params = {
			grid: groupId,
			members: payload.members,
			isApprove: payload.isApprove ? 1 : 0
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/searchSticker.js
const searchStickerFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.sticker[0]}/api/message/sticker/search`);
	/**
	* Search stickers
	*
	* @param keyword Keyword to search stickers
	* @param limit Limit of stickers to return (default: 50)
	*
	* @throws {ZaloApiError}
	*/
	return async function searchSticker(keyword, limit = 50) {
		const params = {
			keyword,
			limit,
			srcType: 0,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/sendBankCard.js
const sendBankCardFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.zimsg[0]}/api/transfer/card`);
	/**
	* Send bank card
	*
	* @param payload The payload containing the bank card information
	* @param threadId The ID of the thread to send the bank card to
	* @param type The type of thread to send the bank card to
	*
	* @throws {ZaloApiError}
	*/
	return async function sendBankCard(payload, threadId, type = ThreadType.User) {
		var _a;
		const params = {
			binBank: payload.binBank,
			numAccBank: payload.numAccBank,
			nameAccBank: ((_a = payload.nameAccBank) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || "---",
			cliMsgId: Date.now().toString(),
			tsMsg: Date.now(),
			destUid: threadId,
			destType: type === ThreadType.Group ? 1 : 0
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/sendCard.js
const sendCardFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = {
		[ThreadType.User]: utils.makeURL(`${api.zpwServiceMap.file[0]}/api/message/forward`),
		[ThreadType.Group]: utils.makeURL(`${api.zpwServiceMap.file[0]}/api/group/forward`)
	};
	/**
	* Send a card to a User - Group
	*
	* @param userId Unique ID for Card
	* @param phoneNumber Optional phone number for sending card to a User
	* @param ttl Time to live in milliseconds (default: 0)
	* @param threadId ID of the conversation
	* @param type Message type (User or GroupMessage)
	*
	* @throws {ZaloApiError}
	*
	*/
	return async function sendCard(options, threadId, type = ThreadType.User) {
		var _a;
		const QRCodeURL = (await api.getQR(options.userId))[options.userId];
		const clientId = Date.now().toString();
		const params = {
			ttl: (_a = options.ttl) !== null && _a !== void 0 ? _a : 0,
			msgType: 6,
			clientId,
			msgInfo: {
				contactUid: options.userId,
				qrCodeUrl: QRCodeURL
			}
		};
		if (options.phoneNumber) params.msgInfo.phone = options.phoneNumber;
		if (type == ThreadType.Group) {
			params.visibility = 0;
			params.grid = threadId;
		} else {
			params.toId = threadId;
			params.imei = ctx.imei;
		}
		params.msgInfo = JSON.stringify(params.msgInfo);
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL[type], {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/sendDeliveredEvent.js
const sendDeliveredEventFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = {
		[ThreadType.User]: utils.makeURL(`${api.zpwServiceMap.chat[0]}/api/message/deliveredv2`),
		[ThreadType.Group]: utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/deliveredv2`)
	};
	/**
	* Send message delivered event
	*
	* @param isSeen Whether the message is seen or not
	* @param messages List of messages to send delivered event
	* @param type Messages type (User or Group), defaults to User
	*
	* @throws {ZaloApiError}
	*/
	return async function sendDeliveredEvent(isSeen, messages, type = ThreadType.User) {
		if (!messages) throw new ZaloApiError("messages are missing or not in a valid array format.");
		if (!Array.isArray(messages)) messages = [messages];
		if (messages.length === 0 || messages.length > 50) throw new ZaloApiError("messages must contain between 1 and 50 messages.");
		const idTo = messages[0].idTo;
		if (type === ThreadType.Group && !messages.every((msg) => msg.idTo === idTo)) throw new ZaloApiError("All messages must have the same idTo for Group thread");
		const msgInfos = Object.assign({
			seen: isSeen ? 1 : 0,
			data: messages.map((msg) => ({
				cmi: msg.cliMsgId,
				gmi: msg.msgId,
				si: msg.uidFrom,
				di: msg.idTo === ctx.uid ? "0" : msg.idTo,
				mt: msg.msgType,
				st: msg.st || 0 === msg.st ? 0 : -1,
				at: msg.at || 0 === msg.at ? 0 : -1,
				cmd: msg.cmd || 0 === msg.cmd ? 0 : -1,
				ts: parseInt(`${msg.ts}`) || 0 === parseInt(`${msg.ts}`) ? 0 : -1
			}))
		}, type === ThreadType.User ? {} : { grid: idTo });
		const params = Object.assign({ msgInfos: JSON.stringify(msgInfos) }, type === ThreadType.User ? {} : { imei: ctx.imei });
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL[type], {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/sendFriendRequest.js
const sendFriendRequestFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.friend[0]}/api/friend/sendreq`);
	/**
	* Send a friend request to a user.
	*
	* @param msg message sent with friend request
	* @param userId User ID to send friend request to
	*
	* @note Zalo might throw an error with code 225 if the user is already friends with you,
	*          215 if the user might have blocked you,
	*          222 if user has already sent you a friend request, your request will be treated as acceptance instead.
	*
	* @throws {ZaloApiError}
	*/
	return async function sendFriendRequest(msg, userId) {
		const params = {
			toid: userId,
			msg,
			reqsrc: 30,
			imei: ctx.imei,
			language: ctx.language,
			srcParams: JSON.stringify({ uidTo: userId })
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/sendLink.js
const sendLinkFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = {
		[ThreadType.User]: utils.makeURL(`${api.zpwServiceMap.chat[0]}/api/message/link`, { nretry: 0 }),
		[ThreadType.Group]: utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/sendlink`, { nretry: 0 })
	};
	/**
	* Send link
	*
	* @param options Link and ttl
	* @param threadId Thread ID
	* @param type Thread type
	*
	* @throws {ZaloApiError}
	*/
	return async function sendLink(options, threadId, type = ThreadType.User) {
		var _a;
		const res = await api.parseLink(options.link);
		const params = {
			msg: options.msg && options.msg.trim() ? options.msg.includes(options.link) ? options.msg : options.msg + " " + options.link : options.link,
			href: res.data.href,
			src: res.data.src,
			title: res.data.title,
			desc: res.data.desc,
			thumb: res.data.thumb,
			type: 2,
			media: JSON.stringify(res.data.media),
			ttl: (_a = options.ttl) !== null && _a !== void 0 ? _a : 0,
			clientId: Date.now()
		};
		if (type == ThreadType.Group) {
			params.grid = threadId;
			params.imei = ctx.imei;
		} else {
			params.toId = threadId;
			params.mentionInfo = "";
		}
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL[type], {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/sendMessage.js
const attachmentUrlType = {
	image: "photo_original/send?",
	gif: "gif?",
	video: "asyncfile/msg?",
	others: "asyncfile/msg?"
};
function prepareQMSGAttach(quote) {
	const quoteData = quote;
	if (typeof quoteData.content == "string") return quoteData.propertyExt;
	if (quoteData.msgType == "chat.todo") return { properties: {
		color: 0,
		size: 0,
		type: 0,
		subType: 0,
		ext: "{\"shouldParseLinkOrContact\":0}"
	} };
	return Object.assign(Object.assign({}, quoteData.content), {
		thumbUrl: quoteData.content.thumb,
		oriUrl: quoteData.content.href,
		normalUrl: quoteData.content.href
	});
}
function prepareQMSG(quote) {
	const quoteData = quote;
	if (quoteData.msgType == "chat.todo" && typeof quoteData.content == "object" && typeof quoteData.content.params == "string") return JSON.parse(quoteData.content.params).item.content;
	return "";
}
var TextStyle;
(function(TextStyle) {
	TextStyle["Bold"] = "b";
	TextStyle["Italic"] = "i";
	TextStyle["Underline"] = "u";
	TextStyle["StrikeThrough"] = "s";
	TextStyle["Red"] = "c_db342e";
	TextStyle["Orange"] = "c_f27806";
	TextStyle["Yellow"] = "c_f7b503";
	TextStyle["Green"] = "c_15a85f";
	TextStyle["Small"] = "f_13";
	TextStyle["Big"] = "f_18";
	TextStyle["UnorderedList"] = "lst_1";
	TextStyle["OrderedList"] = "lst_2";
	TextStyle["Indent"] = "ind_$";
})(TextStyle || (TextStyle = {}));
var Urgency;
(function(Urgency) {
	Urgency[Urgency["Default"] = 0] = "Default";
	Urgency[Urgency["Important"] = 1] = "Important";
	Urgency[Urgency["Urgent"] = 2] = "Urgent";
})(Urgency || (Urgency = {}));
const sendMessageFactory = apiFactory()((api, ctx, utils) => {
	const serviceURLs = {
		message: {
			[ThreadType.User]: utils.makeURL(`${api.zpwServiceMap.chat[0]}/api/message`, { nretry: 0 }),
			[ThreadType.Group]: utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group`, { nretry: 0 })
		},
		attachment: {
			[ThreadType.User]: `${api.zpwServiceMap.file[0]}/api/message/`,
			[ThreadType.Group]: `${api.zpwServiceMap.file[0]}/api/group/`
		}
	};
	const { sharefile } = ctx.settings.features;
	function isExceedMaxFile(totalFile) {
		return totalFile > sharefile.max_file;
	}
	function isExceedMaxFileSize(fileSize) {
		return fileSize > sharefile.max_size_share_file_v3 * 1024 * 1024;
	}
	function getGroupLayoutId() {
		return Date.now();
	}
	async function send(data) {
		if (!Array.isArray(data)) data = [data];
		const requests = [];
		for (const each of data) requests.push((async () => {
			return await resolveResponse(ctx, await utils.request(each.url, {
				method: "POST",
				body: each.body,
				headers: each.headers
			}));
		})());
		return await Promise.all(requests);
	}
	async function upthumb(source, url) {
		const formData = new import_form_data.default();
		const buffer = typeof source == "string" ? await fs$1.readFile(source) : source.data;
		formData.append("fileContent", buffer, {
			filename: "blob",
			contentType: "image/png"
		});
		const params = {
			clientId: Date.now(),
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt message");
		return await resolveResponse(ctx, await utils.request(utils.makeURL(url + "upthumb?", { params: encryptedParams }), {
			method: "POST",
			headers: formData.getHeaders(),
			body: formData.getBuffer()
		}));
	}
	function handleMentions(type, msg, mentions) {
		let totalMentionLen = 0;
		const mentionsFinal = Array.isArray(mentions) && type == ThreadType.Group ? mentions.filter((m) => m.pos >= 0 && m.uid && m.len > 0).map((m) => {
			totalMentionLen += m.len;
			return {
				pos: m.pos,
				uid: m.uid,
				len: m.len,
				type: m.uid == "-1" ? 1 : 0
			};
		}) : [];
		if (totalMentionLen > msg.length) throw new ZaloApiError("Invalid mentions: total mention characters exceed message length");
		return {
			mentionsFinal,
			msgFinal: msg
		};
	}
	function handleStyles(params, styles) {
		if (styles) Object.assign(params, { textProperties: JSON.stringify({
			styles: styles.map((e) => {
				var _a;
				const styleFinal = Object.assign(Object.assign({}, e), {
					indentSize: void 0,
					st: e.st == TextStyle.Indent ? TextStyle.Indent.replace(/\$/g, `${(_a = e.indentSize) !== null && _a !== void 0 ? _a : 1}0`) : e.st
				});
				removeUndefinedKeys(styleFinal);
				return styleFinal;
			}),
			ver: 0
		}) });
	}
	function handleUrgency(params, urgency) {
		if (urgency == Urgency.Important || urgency == Urgency.Urgent) Object.assign(params, { metaData: { urgency } });
	}
	async function handleMessage({ msg, styles, urgency, mentions, quote, ttl }, threadId, type) {
		if (!msg || msg.length == 0) throw new ZaloApiError("Missing message content");
		const isGroupMessage = type == ThreadType.Group;
		const { mentionsFinal, msgFinal } = handleMentions(type, msg, mentions);
		msg = msgFinal;
		if (quote) {
			if (typeof quote.content != "string" && quote.msgType == "webchat") throw new ZaloApiError("This kind of `webchat` quote type is not available");
			if (quote.msgType == "group.poll") throw new ZaloApiError("The `group.poll` quote type is not available");
		}
		const isMentionsValid = mentionsFinal.length > 0 && isGroupMessage;
		const params = quote ? {
			toid: isGroupMessage ? void 0 : threadId,
			grid: isGroupMessage ? threadId : void 0,
			message: msg,
			clientId: Date.now(),
			mentionInfo: isMentionsValid ? JSON.stringify(mentionsFinal) : void 0,
			qmsgOwner: quote.uidFrom,
			qmsgId: quote.msgId,
			qmsgCliId: quote.cliMsgId,
			qmsgType: getClientMessageType(quote.msgType),
			qmsgTs: quote.ts,
			qmsg: typeof quote.content == "string" ? quote.content : prepareQMSG(quote),
			imei: isGroupMessage ? void 0 : ctx.imei,
			visibility: isGroupMessage ? 0 : void 0,
			qmsgAttach: isGroupMessage ? JSON.stringify(prepareQMSGAttach(quote)) : void 0,
			qmsgTTL: quote.ttl,
			ttl: ttl !== null && ttl !== void 0 ? ttl : 0
		} : {
			message: msg,
			clientId: Date.now(),
			mentionInfo: isMentionsValid ? JSON.stringify(mentionsFinal) : void 0,
			imei: isGroupMessage ? void 0 : ctx.imei,
			ttl: ttl !== null && ttl !== void 0 ? ttl : 0,
			visibility: isGroupMessage ? 0 : void 0,
			toid: isGroupMessage ? void 0 : threadId,
			grid: isGroupMessage ? threadId : void 0
		};
		handleStyles(params, styles);
		handleUrgency(params, urgency);
		removeUndefinedKeys(params);
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt message");
		const finalServiceUrl = new URL(serviceURLs.message[type]);
		if (quote) finalServiceUrl.pathname = finalServiceUrl.pathname + "/quote";
		else finalServiceUrl.pathname = finalServiceUrl.pathname + "/" + (isGroupMessage ? params.mentionInfo ? "mention" : "sendmsg" : "sms");
		return {
			url: finalServiceUrl.toString(),
			body: new URLSearchParams({ params: encryptedParams })
		};
	}
	async function handleAttachment({ msg, attachments, mentions, quote, ttl, urgency }, threadId, type) {
		if (!attachments) throw new ZaloApiError("Missing attachments");
		if (!Array.isArray(attachments)) attachments = [attachments];
		if (attachments.length == 0) throw new ZaloApiError("Missing attachments");
		const firstSource = attachments[0];
		const firstExtFile = getFileExtension(typeof firstSource == "string" ? firstSource : firstSource.filename);
		const isSingleFile = attachments.length == 1;
		const isGroupMessage = type == ThreadType.Group;
		const canBeDesc = isSingleFile && [
			"jpg",
			"jpeg",
			"png",
			"webp"
		].includes(firstExtFile);
		const gifFiles = attachments.filter((e) => getFileExtension(typeof e == "string" ? e : e.filename) == "gif");
		attachments = attachments.filter((e) => getFileExtension(typeof e == "string" ? e : e.filename) != "gif");
		const uploadAttachment = attachments.length == 0 ? [] : await api.uploadAttachment(attachments, threadId, type);
		const attachmentsData = [];
		let indexInGroupLayout = 0;
		const groupLayoutId = getGroupLayoutId().toString();
		const { mentionsFinal, msgFinal } = handleMentions(type, msg, mentions);
		msg = msgFinal;
		const isMentionsValid = mentionsFinal.length > 0 && isGroupMessage && attachments.length == 1;
		const isMultiFile = attachments.length > 1;
		let clientId = Date.now();
		for (const attachment of uploadAttachment) {
			let data;
			switch (attachment.fileType) {
				case "image":
					data = {
						fileType: attachment.fileType,
						params: {
							photoId: attachment.photoId,
							clientId: (clientId++).toString(),
							desc: msg,
							width: attachment.width,
							height: attachment.height,
							toid: isGroupMessage ? void 0 : String(threadId),
							grid: isGroupMessage ? String(threadId) : void 0,
							rawUrl: attachment.normalUrl,
							hdUrl: attachment.hdUrl,
							thumbUrl: attachment.thumbUrl,
							oriUrl: isGroupMessage ? attachment.normalUrl : void 0,
							normalUrl: isGroupMessage ? void 0 : attachment.normalUrl,
							hdSize: String(attachment.totalSize),
							zsource: -1,
							ttl: ttl !== null && ttl !== void 0 ? ttl : 0,
							jcp: "{\"convertible\":\"jxl\"}",
							groupLayoutId: isMultiFile ? groupLayoutId : void 0,
							isGroupLayout: isMultiFile ? 1 : void 0,
							idInGroup: isMultiFile ? indexInGroupLayout++ : void 0,
							totalItemInGroup: isMultiFile ? uploadAttachment.length : void 0,
							extMsgProp: isMultiFile ? `{"groupMediaMsg":{"groupLayoutId":"${groupLayoutId}"}}` : void 0,
							mentionInfo: isMentionsValid && canBeDesc && !quote ? JSON.stringify(mentionsFinal) : void 0
						},
						body: new URLSearchParams()
					};
					break;
				case "video":
					data = {
						fileType: attachment.fileType,
						params: {
							fileId: attachment.fileId,
							checksum: attachment.checksum,
							checksumSha: "",
							extention: getFileExtension(attachment.fileName),
							totalSize: attachment.totalSize,
							fileName: attachment.fileName,
							clientId: attachment.clientFileId,
							fType: 1,
							fileCount: 0,
							fdata: "{}",
							toid: isGroupMessage ? void 0 : String(threadId),
							grid: isGroupMessage ? String(threadId) : void 0,
							fileUrl: attachment.fileUrl,
							zsource: -1,
							ttl: ttl !== null && ttl !== void 0 ? ttl : 0
						},
						body: new URLSearchParams()
					};
					break;
				case "others":
					data = {
						fileType: attachment.fileType,
						params: {
							fileId: attachment.fileId,
							checksum: attachment.checksum,
							checksumSha: "",
							extention: getFileExtension(attachment.fileName),
							totalSize: attachment.totalSize,
							fileName: attachment.fileName,
							clientId: attachment.clientFileId,
							fType: 1,
							fileCount: 0,
							fdata: "{}",
							toid: isGroupMessage ? void 0 : String(threadId),
							grid: isGroupMessage ? String(threadId) : void 0,
							fileUrl: attachment.fileUrl,
							zsource: -1,
							ttl: ttl !== null && ttl !== void 0 ? ttl : 0
						},
						body: new URLSearchParams()
					};
					break;
			}
			handleUrgency(data.params, urgency);
			removeUndefinedKeys(data.params);
			const encryptedParams = utils.encodeAES(JSON.stringify(data.params));
			if (!encryptedParams) throw new ZaloApiError("Failed to encrypt message");
			data.body.append("params", encryptedParams);
			attachmentsData.push(data);
		}
		for (const gif of gifFiles) {
			const isFilePath = typeof gif == "string";
			const gifData = isFilePath ? await getGifMetaData(ctx, gif) : Object.assign(Object.assign({}, gif.metadata), { fileName: gif.filename });
			if (isExceedMaxFileSize(gifData.totalSize)) throw new ZaloApiError(`File ${isFilePath ? getFileName(gif) : gif.filename} size exceed maximum size of ${sharefile.max_size_share_file_v3}MB`);
			const _upthumb = await upthumb(gif, serviceURLs.attachment[ThreadType.User]);
			const formData = new import_form_data.default();
			formData.append("chunkContent", isFilePath ? await fs$1.readFile(gif) : gif.data, {
				filename: isFilePath ? getFileName(gif) : gif.filename,
				contentType: "application/octet-stream"
			});
			const params = {
				clientId: Date.now().toString(),
				fileName: gifData.fileName,
				totalSize: gifData.totalSize,
				width: gifData.width,
				height: gifData.height,
				msg,
				type: 1,
				ttl: ttl !== null && ttl !== void 0 ? ttl : 0,
				visibility: isGroupMessage ? 0 : void 0,
				toid: isGroupMessage ? void 0 : threadId,
				grid: isGroupMessage ? threadId : void 0,
				thumb: _upthumb.url,
				checksum: (await getMd5LargeFileObject(gif, gifData.totalSize)).data,
				totalChunk: 1,
				chunkId: 1
			};
			handleUrgency(params, urgency);
			removeUndefinedKeys(params);
			const encryptedParams = utils.encodeAES(JSON.stringify(params));
			if (!encryptedParams) throw new ZaloApiError("Failed to encrypt message");
			attachmentsData.push({
				query: {
					params: encryptedParams,
					type: "1"
				},
				body: formData.getBuffer(),
				headers: formData.getHeaders(),
				fileType: "gif"
			});
		}
		const responses = [];
		for (const data of attachmentsData) responses.push({
			url: utils.makeURL(serviceURLs.attachment[type] + attachmentUrlType[data.fileType], Object.assign({ nretry: "0" }, data.query || {})),
			body: data.body,
			headers: data.fileType == "gif" ? data.headers : {}
		});
		return responses;
	}
	/**
	* Send a message to a thread
	*
	* @param message Message content
	* @param threadId group or user id
	* @param type Message type (User or Group)
	* @param quote Message or GroupMessage instance (optional), used for quoting
	*
	* @throws {ZaloApiError | ZaloApiMissingImageMetadataGetter}
	*/
	return async function sendMessage(message, threadId, type = ThreadType.User) {
		if (!message) throw new ZaloApiError("Missing message content");
		if (!threadId) throw new ZaloApiError("Missing threadId");
		if (typeof message == "string") message = { msg: message };
		let { msg, attachments, mentions } = message;
		const { quote, ttl, styles, urgency } = message;
		if (attachments && !Array.isArray(attachments)) attachments = [attachments];
		if (!msg && (!attachments || attachments && attachments.length == 0)) throw new ZaloApiError("Missing message content");
		if (attachments && isExceedMaxFile(attachments.length)) throw new ZaloApiError("Exceed maximum file of " + sharefile.max_file);
		const responses = {
			message: null,
			attachment: []
		};
		if (attachments && attachments.length > 0) {
			const firstExtFile = getFileExtension(typeof attachments[0] == "string" ? attachments[0] : attachments[0].filename);
			if (!(attachments.length == 1 && [
				"jpg",
				"jpeg",
				"png",
				"webp"
			].includes(firstExtFile)) && msg.length > 0 || msg.length > 0 && quote) {
				await handleMessage(message, threadId, type).then(async (data) => {
					responses.message = (await send(data))[0];
				});
				msg = "";
				mentions = void 0;
			}
			responses.attachment = await send(await handleAttachment({
				msg,
				mentions,
				attachments,
				quote,
				ttl,
				styles,
				urgency
			}, threadId, type));
			msg = "";
		}
		if (msg.length > 0) responses.message = (await send(await handleMessage(message, threadId, type)))[0];
		return responses;
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/sendReport.js
var ReportReason;
(function(ReportReason) {
	ReportReason[ReportReason["Sensitive"] = 1] = "Sensitive";
	ReportReason[ReportReason["Annoy"] = 2] = "Annoy";
	ReportReason[ReportReason["Fraud"] = 3] = "Fraud";
	ReportReason[ReportReason["Other"] = 0] = "Other";
})(ReportReason || (ReportReason = {}));
const sendReportFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = {
		[ThreadType.User]: utils.makeURL(`${api.zpwServiceMap.profile[0]}/api/report/abuse-v2`),
		[ThreadType.Group]: utils.makeURL(`${api.zpwServiceMap.profile[0]}/api/social/profile/reportabuse`)
	};
	/**
	* Send report to Zalo
	*
	* @param options Report options
	* @param threadId The threadID to report
	* @param type Thread type, default direct
	*
	* @throws {ZaloApiError}
	*
	*/
	return async function sendReport(options, threadId, type = ThreadType.User) {
		const params = type == ThreadType.User ? {
			idTo: threadId,
			objId: "person.profile",
			reason: options.reason.toString(),
			content: options.reason == ReportReason.Other ? options.content : void 0
		} : {
			uidTo: threadId,
			type: 14,
			reason: options.reason,
			content: options.reason == ReportReason.Other ? options.content : "",
			imei: ctx.imei
		};
		removeUndefinedKeys(params);
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL[type], {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/sendSeenEvent.js
const sendSeenEventFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = {
		[ThreadType.User]: utils.makeURL(`${api.zpwServiceMap.chat[0]}/api/message/seenv2`, { nretry: 0 }),
		[ThreadType.Group]: utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/seenv2`, { nretry: 0 })
	};
	/**
	* Send message seen event
	*
	* @param messages List of messages to send seen event
	* @param type Messages type (User or Group), defaults to User
	*
	* @throws {ZaloApiError}
	*/
	return async function sendSeenEvent(messages, type = ThreadType.User) {
		if (!messages) throw new ZaloApiError("messages are missing or not in a valid array format.");
		if (!Array.isArray(messages)) messages = [messages];
		if (messages.length === 0 || messages.length > 50) throw new ZaloApiError("messages must contain between 1 and 50 messages.");
		const isGroup = type === ThreadType.Group;
		const threadId = isGroup ? messages[0].idTo : messages[0].uidFrom;
		const msgInfos = {
			data: messages.map((msg) => {
				if ((isGroup ? msg.idTo : msg.uidFrom) !== threadId) throw new ZaloApiError("All messages must belong to the same thread.");
				return {
					cmi: msg.cliMsgId,
					gmi: msg.msgId,
					si: msg.uidFrom,
					di: msg.idTo === ctx.uid ? "0" : msg.idTo,
					mt: msg.msgType,
					st: msg.st || 0 === msg.st ? 0 : -1,
					at: msg.at || 0 === msg.at ? 0 : -1,
					cmd: msg.cmd || 0 === msg.cmd ? 0 : -1,
					ts: parseInt(`${msg.ts}`) || 0 === parseInt(`${msg.ts}`) ? 0 : -1
				};
			}),
			[isGroup ? "grid" : "senderId"]: threadId
		};
		const params = Object.assign({ msgInfos: JSON.stringify(msgInfos) }, isGroup ? { imei: ctx.imei } : {});
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL[type], {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/sendSticker.js
const sendStickerFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = {
		[ThreadType.User]: utils.makeURL(`${api.zpwServiceMap.chat[0]}/api/message/sticker`, { nretry: "0" }),
		[ThreadType.Group]: utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/sticker`, { nretry: "0" })
	};
	/**
	* Send a sticker to a thread
	*
	* @param sticker Sticker object
	* @param threadId group or user id
	* @param type Message type (User or GroupMessage)
	*
	* @throws {ZaloApiError}
	*/
	return async function sendSticker(sticker, threadId, type = ThreadType.User) {
		if (!sticker) throw new ZaloApiError("Missing sticker");
		if (!threadId) throw new ZaloApiError("Missing threadId");
		if (!sticker.id) throw new ZaloApiError("Missing sticker id");
		if (sticker.cateId === void 0 || sticker.cateId === null) throw new ZaloApiError("Missing sticker cateId");
		if (!sticker.type) throw new ZaloApiError("Missing sticker type");
		const isGroupMessage = type === ThreadType.Group;
		const params = {
			stickerId: sticker.id,
			cateId: sticker.cateId,
			type: sticker.type,
			clientId: Date.now(),
			imei: ctx.imei,
			zsource: 101,
			toid: isGroupMessage ? void 0 : threadId,
			grid: isGroupMessage ? threadId : void 0
		};
		removeUndefinedKeys(params);
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt message");
		const response = await utils.request(serviceURL[type], {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/sendTypingEvent.js
const sendTypingEventFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = {
		[ThreadType.User]: utils.makeURL(`${api.zpwServiceMap.chat[0]}/api/message/typing`),
		[ThreadType.Group]: utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/typing`)
	};
	/**
	* Send typing event
	*
	* @param threadId The ID of the User or Group to send the typing event to
	* @param type The type of thread (User or Group)
	* @param destType The destination type (User or Page), for User threads only, defaults to User
	*
	* @throws {ZaloApiError}
	*/
	return async function sendTypingEvent(threadId, type = ThreadType.User, destType = DestType.User) {
		if (!threadId) throw new ZaloApiError("Missing threadId");
		const params = Object.assign(Object.assign({ [type === ThreadType.User ? "toid" : "grid"]: threadId }, type === ThreadType.User ? { destType } : {}), { imei: ctx.imei });
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL[type], {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/sendVideo.js
const sendVideoFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = {
		[ThreadType.User]: utils.makeURL(`${api.zpwServiceMap.file[0]}/api/message/forward`),
		[ThreadType.Group]: utils.makeURL(`${api.zpwServiceMap.file[0]}/api/group/forward`)
	};
	/**
	* Send a video to a User - Group
	*
	* @param options send video options
	* @param threadId ID of the user or group to send the video to
	* @param type Type of thread (USER or GROUP)
	*
	* @throws {ZaloApiError}
	*
	* @examples Example Video Resolutions:
	*   - **Standard Videos**:
	*       - 3840x2160 (4K UHD): Width 3840px, Height 2160px.
	*       - 1920x1080 (Full HD): Width 1920px, Height 1080px.
	*       - 1280x720 (HD): Width 1280px, Height 720px.
	*   - **Document-Oriented Videos** (Portrait):
	*       - 3840x2160 (4K UHD): Width 3840px, Height 2160px.
	*       - 720x1280 (HD): Width 720px, Height 1280px.
	*       - 1440x2560 (2K): Width 1440px, Height 2560px.
	*
	*/
	return async function sendVideo(options, threadId, type = ThreadType.User) {
		var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
		let fileSize = 0;
		const clientId = Date.now();
		try {
			const headResponse = await utils.request(options.videoUrl, { method: "HEAD" }, true);
			if (headResponse.ok) fileSize = parseInt(headResponse.headers.get("content-length") || "0");
		} catch (error) {
			throw new ZaloApiError(`Unable to get video content: ${error instanceof Error ? error.message : String(error)}`);
		}
		const params = type === ThreadType.User ? {
			toId: threadId,
			clientId: String(clientId),
			ttl: (_a = options.ttl) !== null && _a !== void 0 ? _a : 0,
			zsource: 704,
			msgType: 5,
			msgInfo: JSON.stringify({
				videoUrl: options.videoUrl,
				thumbUrl: options.thumbnailUrl,
				duration: (_b = options.duration) !== null && _b !== void 0 ? _b : 0,
				width: (_c = options.width) !== null && _c !== void 0 ? _c : 1280,
				height: (_d = options.height) !== null && _d !== void 0 ? _d : 720,
				fileSize,
				properties: {
					color: -1,
					size: -1,
					type: 1003,
					subType: 0,
					ext: {
						sSrcType: -1,
						sSrcStr: "",
						msg_warning_type: 0
					}
				},
				title: (_e = options.msg) !== null && _e !== void 0 ? _e : ""
			}),
			imei: ctx.imei
		} : {
			grid: threadId,
			visibility: 0,
			clientId: String(clientId),
			ttl: (_f = options.ttl) !== null && _f !== void 0 ? _f : 0,
			zsource: 704,
			msgType: 5,
			msgInfo: JSON.stringify({
				videoUrl: options.videoUrl,
				thumbUrl: options.thumbnailUrl,
				duration: (_g = options.duration) !== null && _g !== void 0 ? _g : 0,
				width: (_h = options.width) !== null && _h !== void 0 ? _h : 1280,
				height: (_j = options.height) !== null && _j !== void 0 ? _j : 720,
				fileSize,
				properties: {
					color: -1,
					size: -1,
					type: 1003,
					subType: 0,
					ext: {
						sSrcType: -1,
						sSrcStr: "",
						msg_warning_type: 0
					}
				},
				title: (_k = options.msg) !== null && _k !== void 0 ? _k : ""
			}),
			imei: ctx.imei
		};
		if (type !== ThreadType.User && type !== ThreadType.Group) throw new ZaloApiError("Thread type is invalid");
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL[type], {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/sendVoice.js
const sendVoiceFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = {
		[ThreadType.User]: utils.makeURL(`${api.zpwServiceMap.file[0]}/api/message/forward`),
		[ThreadType.Group]: utils.makeURL(`${api.zpwServiceMap.file[0]}/api/group/forward`)
	};
	/**
	* Send a voice to a User - Group
	*
	* @param options voice options
	* @param threadId ID of the user or group to send the voice to
	* @param type Type of thread, default user
	*
	* @throws {ZaloApiError}
	*/
	return async function sendVoice(options, threadId, type = ThreadType.User) {
		var _a, _b;
		let fileSize = null;
		const clientId = Date.now().toString();
		try {
			const headResponse = await utils.request(options.voiceUrl, { method: "HEAD" }, true);
			if (headResponse.ok) fileSize = parseInt(headResponse.headers.get("content-length") || "0");
		} catch (error) {
			throw new ZaloApiError(`Unable to get voice content: ${error instanceof Error ? error.message : String(error)}`);
		}
		const params = type === ThreadType.User ? {
			toId: threadId,
			ttl: (_a = options.ttl) !== null && _a !== void 0 ? _a : 0,
			zsource: -1,
			msgType: 3,
			clientId,
			msgInfo: JSON.stringify({
				voiceUrl: options.voiceUrl,
				m4aUrl: options.voiceUrl,
				fileSize: fileSize !== null && fileSize !== void 0 ? fileSize : 0
			}),
			imei: ctx.imei
		} : {
			grid: threadId,
			visibility: 0,
			ttl: (_b = options.ttl) !== null && _b !== void 0 ? _b : 0,
			zsource: -1,
			msgType: 3,
			clientId,
			msgInfo: JSON.stringify({
				voiceUrl: options.voiceUrl,
				m4aUrl: options.voiceUrl,
				fileSize: fileSize !== null && fileSize !== void 0 ? fileSize : 0
			}),
			imei: ctx.imei
		};
		if (type !== ThreadType.User && type !== ThreadType.Group) throw new ZaloApiError("Thread type is invalid");
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL[type], {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/setHiddenConversations.js
const setHiddenConversationsFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.conversation[0]}/api/hiddenconvers/add-remove`);
	/**
	* Set hidden conversations
	*
	* @param hidden - Hide or unhide conversations
	* @param threadId Thread ID(s)
	* @param type Thread type (User/Group)
	*
	* @throws {ZaloApiError}
	*/
	return async function setHiddenConversations(hidden, threadId, type = ThreadType.User) {
		threadId = Array.isArray(threadId) ? threadId : [threadId];
		if (threadId.length === 0) throw new ZaloApiError("threadId is required");
		const is_group = type === ThreadType.Group ? 1 : 0;
		const params = {
			[hidden ? "add_threads" : "del_threads"]: JSON.stringify(threadId.map((id) => ({
				thread_id: id,
				is_group
			}))),
			[hidden ? "del_threads" : "add_threads"]: "[]",
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/setMute.js
var MuteDuration;
(function(MuteDuration) {
	MuteDuration[MuteDuration["ONE_HOUR"] = 3600] = "ONE_HOUR";
	MuteDuration[MuteDuration["FOUR_HOURS"] = 14400] = "FOUR_HOURS";
	MuteDuration[MuteDuration["FOREVER"] = -1] = "FOREVER";
	MuteDuration["UNTIL_8AM"] = "until8AM";
})(MuteDuration || (MuteDuration = {}));
var MuteAction;
(function(MuteAction) {
	MuteAction[MuteAction["MUTE"] = 1] = "MUTE";
	MuteAction[MuteAction["UNMUTE"] = 3] = "UNMUTE";
})(MuteAction || (MuteAction = {}));
const setMuteFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.profile[0]}/api/social/profile/setmute`);
	/**
	* Set mute
	*
	* @param params - Mute parameters
	* @param threadID - ID of the thread to mute
	* @param type - Type of thread (User or Group)
	*
	* @throws {ZaloApiError}
	*/
	return async function setMute(params = {}, threadID, type = ThreadType.User) {
		const { duration = MuteDuration.FOREVER, action = MuteAction.MUTE } = params;
		let muteDuration;
		if (action === MuteAction.UNMUTE) muteDuration = -1;
		else if (duration === MuteDuration.FOREVER) muteDuration = -1;
		else if (duration === MuteDuration.UNTIL_8AM) {
			const now = /* @__PURE__ */ new Date();
			const next8AM = new Date(now);
			next8AM.setHours(8, 0, 0, 0);
			if (now.getHours() >= 8) next8AM.setDate(next8AM.getDate() + 1);
			muteDuration = Math.floor((next8AM.getTime() - now.getTime()) / 1e3);
		} else muteDuration = duration;
		const requestParams = {
			toid: threadID,
			duration: muteDuration,
			action,
			startTime: Math.floor(Date.now() / 1e3),
			muteType: type === ThreadType.User ? 1 : 2,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(requestParams));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/setPinnedConversations.js
const setPinnedConversationsFactory = apiFactory()((api, _, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.conversation[0]}/api/pinconvers/updatev2`);
	/**
	* Pin and unpin conversations of threads)
	*
	* @param pinned Should pin conversations
	* @param threadId The ID(s) of the thread
	* @param type Type of thread, default User
	*
	* @throws {ZaloApiError}
	*
	*/
	return async function setPinnedConversations(pinned, threadId, type = ThreadType.User) {
		if (typeof threadId == "string") threadId = [threadId];
		const params = {
			actionType: pinned ? 1 : 2,
			conversations: type == ThreadType.Group ? threadId.map((id) => `g${id}`) : threadId.map((id) => `u${id}`)
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/sharePoll.js
const sharePollFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/poll/share`);
	/**
	* Share a poll
	*
	* @param pollId poll id to share
	*
	* @throws {ZaloApiError}
	*/
	return async function sharePoll(pollId) {
		const params = {
			poll_id: pollId,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/unblockUser.js
const unblockUserFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.friend[0]}/api/friend/unblock`);
	/**
	* Unblock a User
	*
	* @param userId The ID of the User to unblock
	*
	* @throws {ZaloApiError}
	*/
	return async function unblockUser(userId) {
		const params = {
			fid: userId,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/undo.js
const undoFactory = apiFactory()((api, ctx, utils) => {
	const URLType = {
		[ThreadType.User]: utils.makeURL(`${api.zpwServiceMap.chat[0]}/api/message/undo`),
		[ThreadType.Group]: utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/undomsg`)
	};
	/**
	* Undo a message
	*
	* @param payload Undo payload containing message ID and client message ID
	* @param threadId group or user id
	* @param type Message type (User or Group), default is User
	*
	* @throws {ZaloApiError}
	*/
	return async function undo(payload, threadId, type = ThreadType.User) {
		const params = {
			msgId: payload.msgId,
			clientId: Date.now(),
			cliMsgIdUndo: payload.cliMsgId
		};
		if (type == ThreadType.Group) {
			params["grid"] = threadId;
			params["visibility"] = 0;
			params["imei"] = ctx.imei;
		} else params["toid"] = threadId;
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt message");
		const response = await utils.request(URLType[type], {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/undoFriendRequest.js
const undoFriendRequestFactory = apiFactory()((api, _ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.friend[0]}/api/friend/undo`);
	/**
	* Undo send a friend request to a user.
	*
	* @param options
	*
	* @throws {ZaloApiError}
	*/
	return async function undoFriendRequest(friendId) {
		const params = { fid: friendId };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/updateActiveStatus.js
const updateActiveStatusFactory = apiFactory()((api, ctx, utils) => {
	const pingURL = utils.makeURL(`${api.zpwServiceMap.profile[0]}/api/social/profile/ping`);
	const deactiveURL = utils.makeURL(`${api.zpwServiceMap.profile[0]}/api/social/profile/deactive`);
	/**
	* Update active status?
	*
	* @param active
	*
	* @throws {ZaloApiError}
	*/
	return async function updateActiveStatus(active) {
		const params = {
			status: active ? 1 : 0,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const targetURL = active ? pingURL : deactiveURL;
		const response = await utils.request(utils.makeURL(targetURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/updateArchivedChatList.js
const updateArchivedChatListFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.label[0]}/api/archivedchat/update`);
	/**
	* Archive conversations
	*
	* @param isArchived - true to archive, false to unarchive
	* @param conversations - List of conversations to archive/unarchive
	*
	* @throws {ZaloApiError}
	*/
	return async function updateArchivedChatList(isArchived, conversations) {
		if (!Array.isArray(conversations)) conversations = [conversations];
		const params = {
			actionType: isArchived ? 0 : 1,
			ids: conversations,
			imei: ctx.imei,
			version: Date.now()
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt message");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/updateAutoDeleteChat.js
var ChatTTL;
(function(ChatTTL) {
	ChatTTL[ChatTTL["NO_DELETE"] = 0] = "NO_DELETE";
	ChatTTL[ChatTTL["ONE_DAY"] = 864e5] = "ONE_DAY";
	ChatTTL[ChatTTL["SEVEN_DAYS"] = 6048e5] = "SEVEN_DAYS";
	ChatTTL[ChatTTL["FOURTEEN_DAYS"] = 12096e5] = "FOURTEEN_DAYS";
})(ChatTTL || (ChatTTL = {}));
const updateAutoDeleteChatFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.conversation[0]}/api/conv/autodelete/updateConvers`);
	/**
	* Auto delete chat
	*
	* @param ttl The time to live of the chat
	* @param threadId The thread ID to auto delete chat
	* @param type Type of thread (User or Group)
	*
	* @throws {ZaloApiError}
	*/
	return async function updateAutoDeleteChat(ttl, threadId, type = ThreadType.User) {
		const params = {
			threadId,
			isGroup: type === ThreadType.Group ? 1 : 0,
			ttl,
			clientLang: ctx.language
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/updateAutoReply.js
const updateAutoReplyFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.auto_reply[0]}/api/autoreply/update`);
	/**
	* Update auto reply
	*
	* @param payload payload
	*
	* @note this API used for zBusiness
	* @throws {ZaloApiError}
	*/
	return async function updateAutoReply(payload) {
		const uids = Array.isArray(payload.uids) ? payload.uids : [payload.uids];
		const resultUids = payload.scope === 2 || payload.scope === 3 ? uids : [];
		const params = {
			cliLang: ctx.language,
			id: payload.id,
			enable: payload.isEnable,
			content: payload.content,
			startTime: payload.startTime,
			endTime: payload.endTime,
			recurrence: ["RRULE:FREQ=DAILY;"],
			scope: payload.scope,
			uids: resultUids
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/updateCatalog.js
const updateCatalogFactory = apiFactory()((api, _, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.catalog[0]}/api/prodcatalog/catalog/update`);
	/**
	* Update catalog?
	*
	* @param payload payload
	*
	* @note this API is used for zBusiness
	* @throws {ZaloApiError}
	*/
	return async function updateCatalog(payload) {
		const params = {
			catalog_id: payload.catalogId,
			catalog_name: payload.catalogName,
			catalog_photo: ""
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/updateGroupSettings.js
const updateGroupSettingsFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/setting/update`);
	/**
	* Update group settings
	*
	* @param options Options
	* @param groupId Group ID
	*
	* @note Zalo might throw an error with code 166 if you don't have enough permissions to change the settings.
	*
	* @throws {ZaloApiError}
	*/
	return async function updateGroupSettings(options, groupId) {
		const params = {
			blockName: options.blockName ? 1 : 0,
			signAdminMsg: options.signAdminMsg ? 1 : 0,
			setTopicOnly: options.setTopicOnly ? 1 : 0,
			enableMsgHistory: options.enableMsgHistory ? 1 : 0,
			joinAppr: options.joinAppr ? 1 : 0,
			lockCreatePost: options.lockCreatePost ? 1 : 0,
			lockCreatePoll: options.lockCreatePoll ? 1 : 0,
			lockSendMsg: options.lockSendMsg ? 1 : 0,
			lockViewMember: options.lockViewMember ? 1 : 0,
			bannFeature: 0,
			dirtyMedia: 0,
			banDuration: 0,
			blocked_members: [],
			grid: groupId,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/updateHiddenConversPin.js
const updateHiddenConversPinFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.conversation[0]}/api/hiddenconvers/update-pin`);
	const pinRegex = /^\d{4}$/;
	/**
	* Update hidden conversation pin
	*
	* @param pin The pin to update (must be a 4-digit number between 0000-9999)
	*
	* @throws {ZaloApiError}
	*/
	return async function updateHiddenConversPin(pin) {
		if (!pinRegex.test(pin)) throw new ZaloApiError("Pin must be a 4-digit number between 0000-9999");
		const params = {
			new_pin: encryptPin(pin),
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/updateLabels.js
const updateLabelsFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.label[0]}/api/convlabel/update`);
	/**
	* Update labels
	*
	* @param label label data
	*
	* @throws {ZaloApiError}
	*/
	return async function updateLabels(payload) {
		const params = {
			labelData: JSON.stringify(payload.labelData),
			version: payload.version,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt message");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		const unFormatted = await utils.resolve(response);
		return {
			labelData: JSON.parse(unFormatted.labelData),
			version: unFormatted.version,
			lastUpdateTime: unFormatted.lastUpdateTime
		};
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/updateLang.js
var UpdateLangAvailableLanguages;
(function(UpdateLangAvailableLanguages) {
	UpdateLangAvailableLanguages["VI"] = "VI";
	UpdateLangAvailableLanguages["EN"] = "EN";
})(UpdateLangAvailableLanguages || (UpdateLangAvailableLanguages = {}));
const updateLangFactory = apiFactory()((api, _, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.profile[0]}/api/social/profile/updatelang`);
	/**
	* Update language?
	*
	* @param language language to update (VI, EN)
	*
	* @note Calling this API alone will not update the user's language.
	* @throws {ZaloApiError}
	*/
	return async function updateLang(language = UpdateLangAvailableLanguages.VI) {
		const params = { language };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/updateProductCatalog.js
const updateProductCatalogFactory = apiFactory()((api, _, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.catalog[0]}/api/prodcatalog/product/update`);
	/**
	* Update product catalog?
	*
	* @param payload payload
	*
	* @note this API is used for zBusiness - Maximum 5 media files are supported
	* @throws {ZaloApiError}
	*/
	return async function updateProductCatalog(payload) {
		const productPhoto = payload.product_photos || [];
		if (payload.files && payload.files.length == 0) {
			if (payload.files.length > 5) throw new ZaloApiError("Maximum 5 media files are allowed");
			for (const mediaFile of payload.files) {
				const uploadMedia = await api.uploadProductPhoto({ file: mediaFile });
				const url = uploadMedia.normalUrl || uploadMedia.hdUrl;
				productPhoto.push(url);
			}
		}
		if (productPhoto.length > 5) throw new ZaloApiError("Maximum 5 media files are allowed");
		const params = {
			product_id: payload.productId,
			product_name: payload.productName,
			price: payload.price,
			description: payload.description,
			product_photos: productPhoto,
			catalog_id: payload.catalogId,
			currency_unit: "₫",
			create_time: payload.createTime
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/updateProfile.js
const updateProfileFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.profile[0]}/api/social/profile/update`);
	/**
	* Change account setting information
	*
	* @param payload payload
	*
	* @note If your account is a Business Account, include the biz.cate field; otherwise the category will be removed.
	* You may leave the other biz fields empty if you don’t want to change them.
	*
	* @throws {ZaloApiError}
	*/
	return async function updateProfile(payload) {
		var _a, _b, _c, _d, _e;
		const params = {
			profile: JSON.stringify({
				name: payload.profile.name,
				dob: payload.profile.dob,
				gender: payload.profile.gender
			}),
			biz: JSON.stringify({
				desc: (_a = payload.biz) === null || _a === void 0 ? void 0 : _a.description,
				cate: (_b = payload.biz) === null || _b === void 0 ? void 0 : _b.cate,
				addr: (_c = payload.biz) === null || _c === void 0 ? void 0 : _c.address,
				website: (_d = payload.biz) === null || _d === void 0 ? void 0 : _d.website,
				email: (_e = payload.biz) === null || _e === void 0 ? void 0 : _e.email
			}),
			language: ctx.language
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(serviceURL, {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/updateProfileBio.js
const updateProfileBioFactory = apiFactory()((api, _ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.profile[0]}/api/social/profile/status`);
	/**
	* Update profile bio
	*
	* @param status status for update bio
	*
	* @throws {ZaloApiError}
	*/
	return async function updateProfileBio(status) {
		const params = { status };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), {
			method: "POST",
			body: new URLSearchParams({ params: encryptedParams })
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/updateQuickMessage.js
const updateQuickMessageFactory = apiFactory()((api, _ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.quick_message[0]}/api/quickmessage/update`);
	/**
	* Update quick message
	*
	* @param updatePayload - The payload containing data to update the quick message
	* @param itemId - The id of the quick message to update
	*
	* @note Zalo might throw an error with code 212 if the itemId does not exist.
	*
	* @throws {ZaloApiError}
	*/
	return async function updateQuickMessage(updatePayload, itemId) {
		const isType = !updatePayload.media ? 0 : 1;
		const params = {
			itemId,
			keyword: updatePayload.keyword,
			message: {
				title: updatePayload.title,
				params: ""
			},
			type: isType
		};
		if (isType === 1) {
			if (!updatePayload.media) throw new ZaloApiError("Media is required");
			const uploadMedia = await api.uploadProductPhoto({ file: updatePayload.media });
			const photoId = uploadMedia.photoId;
			const thumbUrl = uploadMedia.thumbUrl;
			const normalUrl = uploadMedia.normalUrl;
			const hdUrl = uploadMedia.hdUrl;
			params.media = { items: [{
				type: 0,
				photoId,
				title: "",
				width: "",
				height: "",
				previewThumb: thumbUrl,
				rawUrl: normalUrl || hdUrl,
				thumbUrl,
				normalUrl: normalUrl || hdUrl,
				hdUrl: hdUrl || normalUrl
			}] };
		}
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/updateSettings.js
var UpdateSettingsType;
(function(UpdateSettingsType) {
	UpdateSettingsType["ViewBirthday"] = "view_birthday";
	UpdateSettingsType["ShowOnlineStatus"] = "show_online_status";
	UpdateSettingsType["DisplaySeenStatus"] = "display_seen_status";
	UpdateSettingsType["ReceiveMessage"] = "receive_message";
	UpdateSettingsType["AcceptCall"] = "accept_stranger_call";
	UpdateSettingsType["AddFriendViaPhone"] = "add_friend_via_phone";
	UpdateSettingsType["AddFriendViaQR"] = "add_friend_via_qr";
	UpdateSettingsType["AddFriendViaGroup"] = "add_friend_via_group";
	UpdateSettingsType["AddFriendViaContact"] = "add_friend_via_contact";
	UpdateSettingsType["DisplayOnRecommendFriend"] = "display_on_recommend_friend";
	UpdateSettingsType["ArchivedChat"] = "archivedChatStatus";
	UpdateSettingsType["QuickMessage"] = "quickMessageStatus";
})(UpdateSettingsType || (UpdateSettingsType = {}));
const updateSettingsFactory = apiFactory()((_api, _ctx, utils) => {
	const serviceURL = utils.makeURL(`https://wpa.chat.zalo.me/api/setting/update`);
	/**
	* Set account settings
	*
	* @param type The type of setting to update
	* @param value
	*
	* ViewBirthday
	* * 0: hide
	* * 1: show full day/month/year
	* * 2: show day/month
	*
	* ShowOnlineStatus
	* * 0: hide
	* * 1: show
	*
	* DisplaySeenStatus
	* * 0: hide
	* * 1: show
	*
	* ReceiveMessage
	* * 1: everyone
	* * 2: only friends
	*
	* AcceptCall
	* * 2: only friends
	* * 3: everyone
	* * 4: friends and person who contacted
	*
	* AddFriendViaPhone
	* * 0: disable
	* * 1: enable
	*
	* AddFriendViaQR
	* * 0: disable
	* * 1: enable
	*
	* AddFriendViaGroup
	* * 0: disable
	* * 1: enable
	*
	* AddFriendViaContact
	* * 0: disable
	* * 1: enable
	*
	* DisplayOnRecommendFriend
	* * 0: disable
	* * 1: enable
	*
	* ArchivedChat
	* * 0: disable
	* * 1: enable
	*
	* QuickMessage
	* * 0: disable
	* * 1: enable
	*
	* @throws {ZaloApiError}
	*/
	return async function updateSettings(type, value) {
		const params = { [type]: value };
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/upgradeGroupToCommunity.js
const upgradeGroupToCommunityFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/upgrade/community`);
	/**
	* Upgrade group to community
	*
	* @param groupId Group ID upgrade
	*
	* @note Zalo account identity must be verified and the account must be over 18 to use
	* @code 185 The limit on the number of communities that can own has been reached
	* @throws {ZaloApiError}
	*/
	return async function upgradeGroupToCommunity(groupId) {
		const params = {
			grId: groupId,
			language: ctx.language
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/uploadAttachment.js
const urlType = {
	image: "photo_original/upload",
	video: "asyncfile/upload",
	others: "asyncfile/upload"
};
const uploadAttachmentFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = `${api.zpwServiceMap.file[0]}/api`;
	const { sharefile } = ctx.settings.features;
	function isExceedMaxFile(totalFile) {
		return totalFile > sharefile.max_file;
	}
	function isExceedMaxFileSize(fileSize) {
		return fileSize > sharefile.max_size_share_file_v3 * 1024 * 1024;
	}
	function isExtensionValid(ext) {
		return sharefile.restricted_ext_file.indexOf(ext) == -1;
	}
	/**
	* Upload an attachment to a thread
	*
	* @param sources path to files or attachment sources
	* @param threadId Group or User ID
	* @param type Message type (User or Group)
	*
	* @throws {ZaloApiError | ZaloApiMissingImageMetadataGetter}
	*/
	return async function uploadAttachment(sources, threadId, type = ThreadType.User) {
		if (!sources) throw new ZaloApiError("Missing sources");
		if (!Array.isArray(sources)) sources = [sources];
		if (sources.length == 0) throw new ZaloApiError("Missing sources");
		if (isExceedMaxFile(sources.length)) throw new ZaloApiError("Exceed maximum file of " + sharefile.max_file);
		if (!threadId) throw new ZaloApiError("Missing threadId");
		const chunkSize = ctx.settings.features.sharefile.chunk_size_file;
		const isGroupMessage = type == ThreadType.Group;
		const attachmentsData = [];
		const url = `${serviceURL}/${isGroupMessage ? "group" : "message"}/`;
		const typeParam = isGroupMessage ? "11" : "2";
		let clientId = Date.now();
		for (const source of sources) {
			const isFilePath = typeof source == "string";
			const isBuffer = typeof source == "object" && source.data instanceof Buffer;
			if (!isFilePath && !isBuffer) throw new ZaloApiError("Invalid source type");
			if (!isFilePath && !source.filename) throw new ZaloApiError("Missing filename");
			if (isFilePath && !fs.existsSync(source)) throw new ZaloApiError("File not found");
			const extFile = getFileExtension(isFilePath ? source : source.filename).toLowerCase();
			const fileName = isFilePath ? getFileName(source) : source.filename;
			if (isExtensionValid(extFile) == false) throw new ZaloApiError(`File extension "${extFile}" is not allowed`);
			const data = {
				filePath: isFilePath ? source : source.filename,
				chunkContent: [],
				params: {},
				source
			};
			if (isGroupMessage) data.params.grid = threadId;
			else data.params.toid = threadId;
			switch (extFile) {
				case "jpg":
				case "jpeg":
				case "png":
				case "webp": {
					const imageData = isFilePath ? await getImageMetaData(ctx, source) : Object.assign(Object.assign({}, source.metadata), { fileName });
					if (isExceedMaxFileSize(imageData.totalSize)) throw new ZaloApiError(`File ${fileName} size exceed maximum size of ${sharefile.max_size_share_file_v3}MB`);
					data.fileData = imageData;
					data.fileType = "image";
					data.params.totalChunk = Math.ceil(data.fileData.totalSize / chunkSize);
					data.params.fileName = fileName;
					data.params.clientId = clientId++;
					data.params.totalSize = imageData.totalSize;
					data.params.imei = ctx.imei;
					data.params.isE2EE = 0;
					data.params.jxl = 0;
					data.params.chunkId = 1;
					break;
				}
				case "mp4": {
					const videoSize = isFilePath ? await getFileSize(source) : source.metadata.totalSize;
					if (isExceedMaxFileSize(videoSize)) throw new ZaloApiError(`File ${fileName} size exceed maximum size of ${sharefile.max_size_share_file_v3}MB`);
					data.fileType = "video";
					data.fileData = {
						fileName,
						totalSize: videoSize
					};
					data.params.totalChunk = Math.ceil(data.fileData.totalSize / chunkSize);
					data.params.fileName = fileName;
					data.params.clientId = clientId++;
					data.params.totalSize = videoSize;
					data.params.imei = ctx.imei;
					data.params.isE2EE = 0;
					data.params.jxl = 0;
					data.params.chunkId = 1;
					break;
				}
				default: {
					const fileSize = isFilePath ? await getFileSize(source) : source.metadata.totalSize;
					if (isExceedMaxFileSize(fileSize)) throw new ZaloApiError(`File ${fileName} size exceed maximum size of ${sharefile.max_size_share_file_v3}MB`);
					data.fileType = "others";
					data.fileData = {
						fileName,
						totalSize: fileSize
					};
					data.params.totalChunk = Math.ceil(data.fileData.totalSize / chunkSize);
					data.params.fileName = fileName;
					data.params.clientId = clientId++;
					data.params.totalSize = fileSize;
					data.params.imei = ctx.imei;
					data.params.isE2EE = 0;
					data.params.jxl = 0;
					data.params.chunkId = 1;
					break;
				}
			}
			const fileBuffer = isFilePath ? await fs.promises.readFile(source) : source.data;
			for (let i = 0; i < data.params.totalChunk; i++) {
				const formData = new import_form_data.default();
				const slicedBuffer = fileBuffer.subarray(i * chunkSize, (i + 1) * chunkSize);
				formData.append("chunkContent", slicedBuffer, {
					filename: fileName,
					contentType: "application/octet-stream"
				});
				data.chunkContent[i] = formData;
			}
			attachmentsData.push(data);
		}
		const requests = [], results = [];
		for (let atmIndex = 0; atmIndex < attachmentsData.length; atmIndex++) {
			const data = attachmentsData[atmIndex];
			for (let i = 0; i < data.params.totalChunk; i++) {
				const encryptedParams = utils.encodeAES(JSON.stringify(data.params));
				if (!encryptedParams) throw new ZaloApiError("Failed to encrypt message");
				requests.push(utils.request(utils.makeURL(url + urlType[data.fileType], {
					type: typeParam,
					params: encryptedParams
				}), {
					method: "POST",
					headers: data.chunkContent[i].getHeaders(),
					body: data.chunkContent[i].getBuffer()
				}).then(async (response) => {
					/**
					* @TODO: better type rather than any
					*/
					const resData = await resolveResponse(ctx, response);
					if (resData && resData.fileId != "-1" && resData.photoId != "-1") await new Promise((resolve) => {
						if (data.fileType == "video" || data.fileType == "others") {
							const uploadCallback = async (wsData) => {
								const result = Object.assign(Object.assign(Object.assign({ fileType: data.fileType }, resData), wsData), {
									totalSize: data.fileData.totalSize,
									fileName: data.fileData.fileName,
									checksum: (await getMd5LargeFileObject(data.source, data.fileData.totalSize)).data
								});
								results[atmIndex] = result;
								resolve();
							};
							ctx.uploadCallbacks.set(resData.fileId.toString(), uploadCallback);
						}
						if (data.fileType == "image") {
							const result = {
								fileType: "image",
								width: data.fileData.width,
								height: data.fileData.height,
								totalSize: data.fileData.totalSize,
								hdSize: data.fileData.totalSize,
								finished: resData.finished,
								normalUrl: resData.normalUrl,
								hdUrl: resData.hdUrl,
								thumbUrl: resData.thumbUrl,
								chunkId: resData.chunkId,
								photoId: resData.photoId,
								clientFileId: resData.clientFileId
							};
							results[atmIndex] = result;
							resolve();
						}
					});
				}));
				data.params.chunkId++;
			}
		}
		await Promise.all(requests);
		return results;
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/uploadProductPhoto.js
const uploadProductPhotoFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.file[0]}/api/product/upload/photo`);
	/**
	* Upload product photo for api quick message, product catalog or custom local storage
	*
	* @param payload file path or attachment source
	*
	* @throws {ZaloApiError | ZaloApiMissingImageMetadataGetter}
	*/
	return async function uploadProductPhoto(payload) {
		const isSourceFilePath = typeof payload.file == "string";
		const fileSize = (isSourceFilePath ? await getImageMetaData(ctx, payload.file) : payload.file.metadata).totalSize || 0;
		const fileBuffer = isSourceFilePath ? await fs.promises.readFile(payload.file) : payload.file.data;
		const formData = new import_form_data.default();
		formData.append("chunkContent", fileBuffer, {
			filename: "undefined",
			contentType: "application/octet-stream"
		});
		const params = {
			totalChunk: 1,
			fileName: `Base64_Img_Picker_${Date.now()}.jpg`,
			clientId: Date.now(),
			totalSize: fileSize,
			imei: ctx.imei,
			chunkId: 1,
			toid: ctx.loginInfo.send2me_id,
			featureId: 1
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), {
			method: "POST",
			headers: formData.getHeaders(),
			body: formData.getBuffer()
		});
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/votePoll.js
const votePollFactory = apiFactory()((api, ctx, utils) => {
	const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/poll/vote`);
	/**
	* Vote on a poll
	*
	* @param pollId The ID of the poll to vote on
	* @param optionId The ID(s) of the option to vote on
	*
	* @throws ZaloApiError
	*/
	return async function votePoll(pollId, optionId) {
		if (!Array.isArray(optionId)) optionId = [optionId];
		const params = {
			poll_id: pollId,
			option_ids: optionId,
			imei: ctx.imei
		};
		const encryptedParams = utils.encodeAES(JSON.stringify(params));
		if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");
		const response = await utils.request(utils.makeURL(serviceURL, { params: encryptedParams }), { method: "GET" });
		return utils.resolve(response);
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis/custom.js
const customFactory = apiFactory()((api, ctx, utils) => {
	return function custom(name, callback) {
		Object.defineProperty(api, name, {
			value: function(props) {
				return callback({
					ctx,
					utils,
					props
				});
			},
			writable: false,
			enumerable: false,
			configurable: false
		});
	};
});
//#endregion
//#region node_modules/zca-js/dist/apis.js
var API = class {
	constructor(ctx, zpwServiceMap, wsUrls) {
		this.zpwServiceMap = zpwServiceMap;
		this.listener = new Listener(ctx, wsUrls);
		this.acceptFriendRequest = acceptFriendRequestFactory(ctx, this);
		this.addGroupBlockedMember = addGroupBlockedMemberFactory(ctx, this);
		this.addGroupDeputy = addGroupDeputyFactory(ctx, this);
		this.addPollOptions = addPollOptionsFactory(ctx, this);
		this.addQuickMessage = addQuickMessageFactory(ctx, this);
		this.addReaction = addReactionFactory(ctx, this);
		this.addUnreadMark = addUnreadMarkFactory(ctx, this);
		this.addUserToGroup = addUserToGroupFactory(ctx, this);
		this.blockUser = blockUserFactory(ctx, this);
		this.blockViewFeed = blockViewFeedFactory(ctx, this);
		this.changeAccountAvatar = changeAccountAvatarFactory(ctx, this);
		this.changeFriendAlias = changeFriendAliasFactory(ctx, this);
		this.changeGroupAvatar = changeGroupAvatarFactory(ctx, this);
		this.changeGroupName = changeGroupNameFactory(ctx, this);
		this.changeGroupOwner = changeGroupOwnerFactory(ctx, this);
		this.createAutoReply = createAutoReplyFactory(ctx, this);
		this.createCatalog = createCatalogFactory(ctx, this);
		this.createGroup = createGroupFactory(ctx, this);
		this.createNote = createNoteFactory(ctx, this);
		this.createPoll = createPollFactory(ctx, this);
		this.createProductCatalog = createProductCatalogFactory(ctx, this);
		this.createReminder = createReminderFactory(ctx, this);
		this.deleteAutoReply = deleteAutoReplyFactory(ctx, this);
		this.deleteAvatar = deleteAvatarFactory(ctx, this);
		this.deleteCatalog = deleteCatalogFactory(ctx, this);
		this.deleteChat = deleteChatFactory(ctx, this);
		this.deleteGroupInviteBox = deleteGroupInviteBoxFactory(ctx, this);
		this.deleteMessage = deleteMessageFactory(ctx, this);
		this.deleteProductCatalog = deleteProductCatalogFactory(ctx, this);
		this.disableGroupLink = disableGroupLinkFactory(ctx, this);
		this.disperseGroup = disperseGroupFactory(ctx, this);
		this.editNote = editNoteFactory(ctx, this);
		this.editReminder = editReminderFactory(ctx, this);
		this.enableGroupLink = enableGroupLinkFactory(ctx, this);
		this.fetchAccountInfo = fetchAccountInfoFactory(ctx, this);
		this.findUser = findUserFactory(ctx, this);
		this.findUserByUsername = findUserByUsernameFactory(ctx, this);
		this.forwardMessage = forwardMessageFactory(ctx, this);
		this.getAliasList = getAliasListFactory(ctx, this);
		this.getAllFriends = getAllFriendsFactory(ctx, this);
		this.getAllGroups = getAllGroupsFactory(ctx, this);
		this.getArchivedChatList = getArchivedChatListFactory(ctx, this);
		this.getAutoDeleteChat = getAutoDeleteChatFactory(ctx, this);
		this.getAutoReplyList = getAutoReplyListFactory(ctx, this);
		this.getAvatarList = getAvatarListFactory(ctx, this);
		this.getAvatarUrlProfile = getAvatarUrlProfileFactory(ctx, this);
		this.getBizAccount = getBizAccountFactory(ctx, this);
		this.getCatalogList = getCatalogListFactory(ctx, this);
		this.getCloseFriends = getCloseFriendsFactory(ctx, this);
		this.getContext = getContextFactory(ctx, this);
		this.getCookie = getCookieFactory(ctx, this);
		this.getFriendBoardList = getFriendBoardListFactory(ctx, this);
		this.getFriendOnlines = getFriendOnlinesFactory(ctx, this);
		this.getFriendRecommendations = getFriendRecommendationsFactory(ctx, this);
		this.getFriendRequestStatus = getFriendRequestStatusFactory(ctx, this);
		this.getFullAvatar = getFullAvatarFactory(ctx, this);
		this.getGroupBlockedMember = getGroupBlockedMemberFactory(ctx, this);
		this.getGroupChatHistory = getGroupChatHistoryFactory(ctx, this);
		this.getGroupInfo = getGroupInfoFactory(ctx, this);
		this.getGroupInviteBoxInfo = getGroupInviteBoxInfoFactory(ctx, this);
		this.getGroupInviteBoxList = getGroupInviteBoxListFactory(ctx, this);
		this.getGroupLinkDetail = getGroupLinkDetailFactory(ctx, this);
		this.getGroupLinkInfo = getGroupLinkInfoFactory(ctx, this);
		this.getGroupMembersInfo = getGroupMembersInfoFactory(ctx, this);
		this.getHiddenConversations = getHiddenConversationsFactory(ctx, this);
		this.getLabels = getLabelsFactory(ctx, this);
		this.getListBoard = getListBoardFactory(ctx, this);
		this.getListReminder = getListReminderFactory(ctx, this);
		this.getMultiUsersByPhones = getMultiUsersByPhonesFactory(ctx, this);
		this.getMute = getMuteFactory(ctx, this);
		this.getOwnId = getOwnIdFactory(ctx, this);
		this.getPendingGroupMembers = getPendingGroupMembersFactory(ctx, this);
		this.getPinConversations = getPinConversationsFactory(ctx, this);
		this.getPollDetail = getPollDetailFactory(ctx, this);
		this.getProductCatalogList = getProductCatalogListFactory(ctx, this);
		this.getQR = getQRFactory(ctx, this);
		this.getQuickMessageList = getQuickMessageListFactory(ctx, this);
		this.getRelatedFriendGroup = getRelatedFriendGroupFactory(ctx, this);
		this.getReminder = getReminderFactory(ctx, this);
		this.getReminderResponses = getReminderResponsesFactory(ctx, this);
		this.getSentFriendRequest = getSentFriendRequestFactory(ctx, this);
		this.getSettings = getSettingsFactory(ctx, this);
		this.getStickerCategoryDetail = getStickerCategoryDetailFactory(ctx, this);
		this.getStickers = getStickersFactory(ctx, this);
		this.getStickersDetail = getStickersDetailFactory(ctx, this);
		this.getUnreadMark = getUnreadMarkFactory(ctx, this);
		this.getUserInfo = getUserInfoFactory(ctx, this);
		this.inviteUserToGroups = inviteUserToGroupsFactory(ctx, this);
		this.joinGroupInviteBox = joinGroupInviteBoxFactory(ctx, this);
		this.joinGroupLink = joinGroupLinkFactory(ctx, this);
		this.keepAlive = keepAliveFactory(ctx, this);
		this.lastOnline = lastOnlineFactory(ctx, this);
		this.leaveGroup = leaveGroupFactory(ctx, this);
		this.lockPoll = lockPollFactory(ctx, this);
		this.parseLink = parseLinkFactory(ctx, this);
		this.rejectFriendRequest = rejectFriendRequestFactory(ctx, this);
		this.removeFriend = removeFriendFactory(ctx, this);
		this.removeFriendAlias = removeFriendAliasFactory(ctx, this);
		this.removeGroupBlockedMember = removeGroupBlockedMemberFactory(ctx, this);
		this.removeGroupDeputy = removeGroupDeputyFactory(ctx, this);
		this.removeQuickMessage = removeQuickMessageFactory(ctx, this);
		this.removeReminder = removeReminderFactory(ctx, this);
		this.removeUnreadMark = removeUnreadMarkFactory(ctx, this);
		this.removeUserFromGroup = removeUserFromGroupFactory(ctx, this);
		this.resetHiddenConversPin = resetHiddenConversPinFactory(ctx, this);
		this.reuseAvatar = reuseAvatarFactory(ctx, this);
		this.reviewPendingMemberRequest = reviewPendingMemberRequestFactory(ctx, this);
		this.searchSticker = searchStickerFactory(ctx, this);
		this.sendBankCard = sendBankCardFactory(ctx, this);
		this.sendCard = sendCardFactory(ctx, this);
		this.sendDeliveredEvent = sendDeliveredEventFactory(ctx, this);
		this.sendFriendRequest = sendFriendRequestFactory(ctx, this);
		this.sendLink = sendLinkFactory(ctx, this);
		this.sendMessage = sendMessageFactory(ctx, this);
		this.sendReport = sendReportFactory(ctx, this);
		this.sendSeenEvent = sendSeenEventFactory(ctx, this);
		this.sendSticker = sendStickerFactory(ctx, this);
		this.sendTypingEvent = sendTypingEventFactory(ctx, this);
		this.sendVideo = sendVideoFactory(ctx, this);
		this.sendVoice = sendVoiceFactory(ctx, this);
		this.setHiddenConversations = setHiddenConversationsFactory(ctx, this);
		this.setMute = setMuteFactory(ctx, this);
		this.setPinnedConversations = setPinnedConversationsFactory(ctx, this);
		this.sharePoll = sharePollFactory(ctx, this);
		this.unblockUser = unblockUserFactory(ctx, this);
		this.undo = undoFactory(ctx, this);
		this.undoFriendRequest = undoFriendRequestFactory(ctx, this);
		this.updateActiveStatus = updateActiveStatusFactory(ctx, this);
		this.updateArchivedChatList = updateArchivedChatListFactory(ctx, this);
		this.updateAutoDeleteChat = updateAutoDeleteChatFactory(ctx, this);
		this.updateAutoReply = updateAutoReplyFactory(ctx, this);
		this.updateCatalog = updateCatalogFactory(ctx, this);
		this.updateGroupSettings = updateGroupSettingsFactory(ctx, this);
		this.updateHiddenConversPin = updateHiddenConversPinFactory(ctx, this);
		this.updateLabels = updateLabelsFactory(ctx, this);
		this.updateLang = updateLangFactory(ctx, this);
		this.updateProductCatalog = updateProductCatalogFactory(ctx, this);
		this.updateProfile = updateProfileFactory(ctx, this);
		this.updateProfileBio = updateProfileBioFactory(ctx, this);
		this.updateQuickMessage = updateQuickMessageFactory(ctx, this);
		this.updateSettings = updateSettingsFactory(ctx, this);
		this.upgradeGroupToCommunity = upgradeGroupToCommunityFactory(ctx, this);
		this.uploadAttachment = uploadAttachmentFactory(ctx, this);
		this.uploadProductPhoto = uploadProductPhotoFactory(ctx, this);
		this.votePoll = votePollFactory(ctx, this);
		this.custom = customFactory(ctx, this);
	}
};
//#endregion
//#region node_modules/zca-js/dist/zalo.js
var Zalo = class {
	constructor(options = {}) {
		this.options = options;
		this.enableEncryptParam = true;
	}
	parseCookies(cookie) {
		const cookieArr = Array.isArray(cookie) ? cookie : cookie.cookies;
		cookieArr.forEach((e, i) => {
			if (typeof e.domain == "string" && e.domain.startsWith(".")) cookieArr[i].domain = e.domain.slice(1);
		});
		const jar = new import_cookie.CookieJar();
		for (const each of cookieArr) try {
			const cookieObj = import_cookie.Cookie.fromJSON(Object.assign(Object.assign({}, each), { key: each.key || each.name }));
			if (cookieObj) {
				const domain = cookieObj.domain || "chat.zalo.me";
				const url = `https://${domain.startsWith(".") ? domain.slice(1) : domain}`;
				jar.setCookieSync(cookieObj, url);
			}
		} catch (error) {
			logger({ options: { logging: this.options.logging } }).error("Failed to set cookie:", error);
		}
		return jar;
	}
	validateParams(credentials) {
		if (!credentials.imei || !credentials.cookie || !credentials.userAgent) throw new ZaloApiError("Missing required params");
	}
	async login(credentials) {
		const ctx = createContext(this.options.apiType, this.options.apiVersion);
		Object.assign(ctx.options, this.options);
		return this.loginCookie(ctx, credentials);
	}
	async loginCookie(ctx, credentials) {
		await checkUpdate(ctx);
		this.validateParams(credentials);
		ctx.imei = credentials.imei;
		ctx.cookie = this.parseCookies(credentials.cookie);
		ctx.userAgent = credentials.userAgent;
		ctx.language = credentials.language || "vi";
		const loginData = await login(ctx, this.enableEncryptParam);
		const serverInfo = await getServerInfo(ctx, this.enableEncryptParam);
		const loginInfo = loginData === null || loginData === void 0 ? void 0 : loginData.data;
		if (!loginData || !loginInfo || !serverInfo) throw new ZaloApiError("Đăng nhập thất bại");
		ctx.secretKey = loginInfo.zpw_enk;
		ctx.uid = loginInfo.uid;
		ctx.settings = serverInfo.setttings || serverInfo.settings;
		ctx.extraVer = serverInfo.extra_ver;
		ctx.loginInfo = loginInfo;
		if (!isContextSession(ctx)) throw new ZaloApiError("Khởi tạo ngữ cảnh thất bại.");
		logger(ctx).info("Logged in as", loginInfo.uid);
		return new API(ctx, loginInfo.zpw_service_map_v3, loginInfo.zpw_ws);
	}
	async loginQR(options, callback) {
		if (!options) options = {};
		if (!options.userAgent) options.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0";
		if (!options.language) options.language = "vi";
		const ctx = createContext(this.options.apiType, this.options.apiVersion);
		Object.assign(ctx.options, this.options);
		const loginQRResult = await loginQR(ctx, options, callback);
		if (!loginQRResult) throw new ZaloApiError("Unable to login with QRCode");
		const imei = generateZaloUUID(options.userAgent);
		if (callback) callback({
			type: LoginQRCallbackEventType.GotLoginInfo,
			data: {
				cookie: loginQRResult.cookies,
				imei,
				userAgent: options.userAgent
			},
			actions: null
		});
		return this.loginCookie(ctx, {
			cookie: loginQRResult.cookies,
			imei,
			userAgent: options.userAgent,
			language: options.language
		});
	}
};
//#endregion
export { API, AutoReplyScope, AvatarSize, BinBankCard, BoardType, BusinessCategory, BusinessCategoryName, ChatTTL, CloseReason, DestType, FriendEventType, FriendRecommendationsType, Gender, GroupDeliveredMessage, GroupEventType, GroupMessage, GroupSeenMessage, GroupTopicType, GroupType, GroupTyping, LoginQRCallbackEventType, MuteAction, MuteDuration, Reaction, Reactions, ReminderRepeatMode, ReportReason, ReviewPendingMemberRequestStatus, TextStyle, ThreadType, Undo, UpdateLangAvailableLanguages, UpdateSettingsType, Urgency, UserDeliveredMessage, UserMessage, UserSeenMessage, UserTyping, Zalo, ZaloApiError, ZaloApiLoginQRAborted, ZaloApiLoginQRDeclined, ZaloApiMissingImageMetadataGetter, initializeFriendEvent, initializeGroupEvent };
