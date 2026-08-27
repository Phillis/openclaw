import { Fn as mergeTelegramAccountConfig, d as parseTelegramTopicConversation } from "../../acpx-Bsv7pbza.js";
import { a as normalizeTelegramCommandName, i as normalizeTelegramCommandDescription, o as resolveTelegramCustomCommands, t as TELEGRAM_COMMAND_NAME_PATTERN } from "../../command-config-B5uSKuEF.js";
import { a as buildTelegramModelsProviderChannelData, i as buildCommandsPaginationKeyboard, n as TelegramInteractiveHandlerRegistration, r as TelegramInteractiveHandlerResult, t as TelegramInteractiveHandlerContext } from "../../interactive-dispatch-T9xZ9Dv0.js";
//#region extensions/telegram/src/setup-contract.d.ts
declare const singleAccountKeysToMove: string[];
//#endregion
export { TELEGRAM_COMMAND_NAME_PATTERN, type TelegramInteractiveHandlerContext, type TelegramInteractiveHandlerRegistration, type TelegramInteractiveHandlerResult, buildCommandsPaginationKeyboard, buildTelegramModelsProviderChannelData, mergeTelegramAccountConfig, normalizeTelegramCommandDescription, normalizeTelegramCommandName, parseTelegramTopicConversation, resolveTelegramCustomCommands, singleAccountKeysToMove };