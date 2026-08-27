import { n as PluginStateKeyedStore } from "./plugin-state-store.types-Bw8X6IMk.js";
//#region ../../../../../../openclaw/node_modules/discord-api-types/globals.d.ts
/**
 * @see {@link https://discord.com/developers/docs/reference#snowflakes}
 */
type Snowflake = string;
/**
 * @see {@link https://discord.com/developers/docs/topics/permissions}
 */
type Permissions = string;
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/rest/common.d.ts
/**
 * @see {@link https://discord.com/developers/docs/reference#locales}
 */
declare enum Locale {
  Indonesian = "id",
  EnglishUS = "en-US",
  EnglishGB = "en-GB",
  Bulgarian = "bg",
  ChineseCN = "zh-CN",
  ChineseTW = "zh-TW",
  Croatian = "hr",
  Czech = "cs",
  Danish = "da",
  Dutch = "nl",
  Finnish = "fi",
  French = "fr",
  German = "de",
  Greek = "el",
  Hindi = "hi",
  Hungarian = "hu",
  Italian = "it",
  Japanese = "ja",
  Korean = "ko",
  Lithuanian = "lt",
  Norwegian = "no",
  Polish = "pl",
  PortugueseBR = "pt-BR",
  Romanian = "ro",
  Russian = "ru",
  SpanishES = "es-ES",
  SpanishLATAM = "es-419",
  Swedish = "sv-SE",
  Thai = "th",
  Turkish = "tr",
  Ukrainian = "uk",
  Vietnamese = "vi"
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/common.d.ts
type LocalizationMap = Partial<Record<Locale, string | null>>;
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/utils/internals.d.ts
type _NonNullableFields<T> = { [P in keyof T]: NonNullable<T[P]> };
type _AddUndefinedToPossiblyUndefinedPropertiesOfInterface<Base> = { [K in keyof Base]: Base[K] extends Exclude<Base[K], undefined> ? _AddUndefinedToPossiblyUndefinedPropertiesOfInterface<Base[K]> : _AddUndefinedToPossiblyUndefinedPropertiesOfInterface<Base[K]> | undefined };
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/permissions.d.ts
/**
 * @see {@link https://discord.com/developers/docs/topics/permissions#role-object}
 */
interface APIRole {
  /**
   * Role id
   */
  id: Snowflake;
  /**
   * Role name
   */
  name: string;
  /**
   * Integer representation of hexadecimal color code
   *
   * @deprecated Use `colors` instead.
   * @remarks `color` will still be returned by the API, but using the `colors` field is recommended when doing requests.
   */
  color: number;
  /**
   * The role's colors
   */
  colors: APIRoleColors;
  /**
   * If this role is pinned in the user listing
   */
  hoist: boolean;
  /**
   * The role icon hash
   */
  icon?: string | null;
  /**
   * The role unicode emoji as a standard emoji
   */
  unicode_emoji?: string | null;
  /**
   * Position of this role
   */
  position: number;
  /**
   * Permission bit set
   *
   * @see {@link https://en.wikipedia.org/wiki/Bit_field}
   */
  permissions: Permissions;
  /**
   * Whether this role is managed by an integration
   */
  managed: boolean;
  /**
   * Whether this role is mentionable
   */
  mentionable: boolean;
  /**
   * The tags this role has
   */
  tags?: APIRoleTags;
  /**
   * Role flags
   */
  flags: RoleFlags;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/permissions#role-object-role-tags-structure}
 */
interface APIRoleTags {
  /**
   * The id of the bot this role belongs to
   */
  bot_id?: Snowflake;
  /**
   * Whether this is the guild's premium subscriber role
   */
  premium_subscriber?: null;
  /**
   * The id of the integration this role belongs to
   */
  integration_id?: Snowflake;
  /**
   * The id of this role's subscription sku and listing
   */
  subscription_listing_id?: Snowflake;
  /**
   * Whether this role is available for purchase
   */
  available_for_purchase?: null;
  /**
   * Whether this role is a guild's linked role
   */
  guild_connections?: null;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/permissions#role-object-role-flags}
 */
declare enum RoleFlags {
  /**
   * Role can be selected by members in an onboarding prompt
   */
  InPrompt = 1
}
/**
 * @see {@link https://discord.com/developers/docs/topics/permissions#role-colors-object}
 */
interface APIRoleColors {
  /**
   * The primary color for the role
   */
  primary_color: number;
  /**
   * The secondary color for the role, this will make the role a gradient between the other provided colors
   */
  secondary_color: number | null;
  /**
   * The tertiary color for the role, this will turn the gradient into a holographic style
   *
   * @remarks When sending `tertiary_color` the API enforces the role color to be a holographic style with values of `primary_color = 11127295`, `secondary_color = 16759788`, and `tertiary_color = 16761760`.
   */
  tertiary_color: number | null;
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/user.d.ts
/**
 * @see {@link https://discord.com/developers/docs/resources/user#user-object}
 */
interface APIUser {
  /**
   * The user's id
   */
  id: Snowflake;
  /**
   * The user's username, not unique across the platform
   */
  username: string;
  /**
   * The user's Discord-tag
   */
  discriminator: string;
  /**
   * The user's display name, if it is set
   */
  global_name: string | null;
  /**
   * The user's avatar hash
   *
   * @see {@link https://discord.com/developers/docs/reference#image-formatting}
   */
  avatar: string | null;
  /**
   * Whether the user belongs to an OAuth2 application
   */
  bot?: boolean;
  /**
   * Whether the user is an Official Discord System user (part of the urgent message system)
   */
  system?: boolean;
  /**
   * Whether the user has two factor enabled on their account
   */
  mfa_enabled?: boolean;
  /**
   * The user's banner hash
   *
   * @see {@link https://discord.com/developers/docs/reference#image-formatting}
   */
  banner?: string | null;
  /**
   * The user's banner color encoded as an integer representation of hexadecimal color code
   */
  accent_color?: number | null;
  /**
   * The user's chosen language option
   */
  locale?: string;
  /**
   * Whether the email on this account has been verified
   */
  verified?: boolean;
  /**
   * The user's email
   */
  email?: string | null;
  /**
   * The flags on a user's account
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object-user-flags}
   */
  flags?: UserFlags;
  /**
   * The type of Nitro subscription on a user's account
   *
   * @remarks This field will return `0` for applications that have not been approved for the {@link OAuth2Scopes.IdentifyPremium} scope.
   * @see {@link https://discord.com/developers/docs/resources/user#user-object-premium-types}
   */
  premium_type?: UserPremiumType;
  /**
   * The public flags on a user's account
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object-user-flags}
   */
  public_flags?: UserFlags;
  /**
   * The user's avatar decoration hash
   *
   * @see {@link https://discord.com/developers/docs/reference#image-formatting}
   * @deprecated Use {@link APIUser.avatar_decoration_data} instead
   */
  avatar_decoration?: string | null;
  /**
   * The data for the user's avatar decoration
   *
   * @see {@link https://discord.com/developers/docs/resources/user#avatar-decoration-data-object}
   */
  avatar_decoration_data?: APIAvatarDecorationData | null;
  /**
   * The data for the user's collectibles
   *
   * @see {@link https://discord.com/developers/docs/resources/user#collectibles}
   */
  collectibles?: APICollectibles | null;
  /**
   * The user's primary guild
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object-user-primary-guild}
   */
  primary_guild?: APIUserPrimaryGuild | null;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/user#user-object-user-flags}
 */
declare enum UserFlags {
  /**
   * Discord Employee
   */
  Staff = 1,
  /**
   * Partnered Server Owner
   */
  Partner = 2,
  /**
   * HypeSquad Events Member
   */
  Hypesquad = 4,
  /**
   * Bug Hunter Level 1
   */
  BugHunterLevel1 = 8,
  /**
   * @unstable This user flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   */
  MFASMS = 16,
  /**
   * @unstable This user flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   */
  PremiumPromoDismissed = 32,
  /**
   * House Bravery Member
   */
  HypeSquadOnlineHouse1 = 64,
  /**
   * House Brilliance Member
   */
  HypeSquadOnlineHouse2 = 128,
  /**
   * House Balance Member
   */
  HypeSquadOnlineHouse3 = 256,
  /**
   * Early Nitro Supporter
   */
  PremiumEarlySupporter = 512,
  /**
   * User is a {@link https://discord.com/developers/docs/topics/teams | team}
   */
  TeamPseudoUser = 1024,
  /**
   * @unstable This user flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   */
  HasUnreadUrgentMessages = 8192,
  /**
   * Bug Hunter Level 2
   */
  BugHunterLevel2 = 16384,
  /**
   * Verified Bot
   */
  VerifiedBot = 65536,
  /**
   * Early Verified Bot Developer
   */
  VerifiedDeveloper = 131072,
  /**
   * Moderator Programs Alumni
   */
  CertifiedModerator = 262144,
  /**
   * Bot uses only {@link https://discord.com/developers/docs/interactions/receiving-and-responding#receiving-an-interaction | HTTP interactions} and is shown in the online member list
   */
  BotHTTPInteractions = 524288,
  /**
   * User has been identified as spammer
   *
   * @unstable This user flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   */
  Spammer = 1048576,
  /**
   * @unstable This user flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   */
  DisablePremium = 2097152,
  /**
   * User is an {@link https://support-dev.discord.com/hc/articles/10113997751447 | Active Developer}
   *
   * @deprecated This user flag is no longer available. See {@link https://support-dev.discord.com/hc/articles/10113997751447-Active-Developer-Badge} for more information.
   */
  ActiveDeveloper = 4194304,
  /**
   * User's account has been {@link https://support.discord.com/hc/articles/6461420677527 | quarantined} based on recent activity
   *
   * @unstable This user flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   * @privateRemarks
   *
   * This value would be `1 << 44`, but bit shifting above `1 << 30` requires bigints
   */
  Quarantined = 17592186044416,
  /**
   * @unstable This user flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   * @privateRemarks
   *
   * This value would be `1 << 50`, but bit shifting above `1 << 30` requires bigints
   */
  Collaborator = 1125899906842624,
  /**
   * @unstable This user flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   * @privateRemarks
   *
   * This value would be `1 << 51`, but bit shifting above `1 << 30` requires bigints
   */
  RestrictedCollaborator = 2251799813685248
}
/**
 * @see {@link https://discord.com/developers/docs/resources/user#user-object-premium-types}
 */
declare enum UserPremiumType {
  None = 0,
  NitroClassic = 1,
  Nitro = 2,
  NitroBasic = 3
}
/**
 * @see {@link https://discord.com/developers/docs/resources/user#avatar-decoration-data-object}
 */
interface APIAvatarDecorationData {
  /**
   * The avatar decoration hash
   *
   * @see {@link https://discord.com/developers/docs/reference#image-formatting}
   */
  asset: string;
  /**
   * The id of the avatar decoration's SKU
   */
  sku_id: Snowflake;
}
/**
 * The collectibles the user has, excluding Avatar Decorations and Profile Effects.
 *
 * @see {@link https://discord.com/developers/docs/resources/user#collectibles}
 */
interface APICollectibles {
  /**
   * Object mapping of {@link APINameplateData}
   */
  nameplate?: APINameplateData;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/user#nameplate}
 */
interface APINameplateData {
  /**
   * ID of the nameplate SKU
   */
  sku_id: Snowflake;
  /**
   * Path to the nameplate asset
   *
   * @example `nameplates/nameplates/twilight/`
   */
  asset: string;
  /**
   * The label of this nameplate. Currently unused
   */
  label: string;
  /**
   * Background color of the nameplate
   */
  palette: NameplatePalette;
}
/**
 * Background color of a nameplate.
 */
declare enum NameplatePalette {
  Berry = "berry",
  BubbleGum = "bubble_gum",
  Clover = "clover",
  Cobalt = "cobalt",
  Crimson = "crimson",
  Forest = "forest",
  Lemon = "lemon",
  Sky = "sky",
  Teal = "teal",
  Violet = "violet",
  White = "white"
}
/**
 * @see {@link https://discord.com/developers/docs/resources/user#user-object-user-primary-guild}
 */
interface APIUserPrimaryGuild {
  /**
   * The id of the user's primary guild
   */
  identity_guild_id: Snowflake | null;
  /**
   * Whether the user is displaying the primary guild's server tag.
   * This can be `null` if the system clears the identity, e.g. because the server no longer supports tags
   */
  identity_enabled: boolean | null;
  /**
   * The text of the user's server tag. Limited to 4 characters
   */
  tag: string | null;
  /**
   * The server tag badge hash
   *
   * @see {@link https://discord.com/developers/docs/reference#image-formatting}
   */
  badge: string | null;
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/emoji.d.ts
/**
 * Not documented but mentioned
 */
interface APIPartialEmoji {
  /**
   * Emoji id
   */
  id: Snowflake | null;
  /**
   * Emoji name (can be null only in reaction emoji objects)
   */
  name: string | null;
  /**
   * Whether this emoji is animated
   */
  animated?: boolean;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/emoji#emoji-object-emoji-structure}
 */
interface APIEmoji extends APIPartialEmoji {
  /**
   * Roles this emoji is whitelisted to
   */
  roles?: APIRole['id'][];
  /**
   * User that created this emoji
   */
  user?: APIUser;
  /**
   * Whether this emoji must be wrapped in colons
   */
  require_colons?: boolean;
  /**
   * Whether this emoji is managed
   */
  managed?: boolean;
  /**
   * Whether this emoji can be used, may be false due to loss of Server Boosts
   */
  available?: boolean;
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/channel.d.ts
interface APIBasePartialChannel {
  /**
   * The id of the channel
   */
  id: Snowflake;
  /**
   * The type of the channel
   *
   * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-channel-types}
   */
  type: ChannelType;
}
interface APINameableChannel {
  /**
   * The name of the channel (1-100 characters)
   */
  name?: string | null;
}
/**
 * Not documented, but partial only includes id, name, and type
 */
interface APIPartialChannel extends APIBasePartialChannel, APINameableChannel {}
/**
 * This interface is used to allow easy extension for other channel types. While
 * also allowing `APIPartialChannel` to be used without breaking.
 */
interface APIChannelBase<T extends ChannelType> extends APIBasePartialChannel {
  type: T;
  flags?: ChannelFlags;
}
type TextChannelType = ChannelType.AnnouncementThread | ChannelType.DM | ChannelType.GroupDM | ChannelType.GuildAnnouncement | ChannelType.GuildStageVoice | ChannelType.GuildText | ChannelType.GuildVoice | ChannelType.PrivateThread | ChannelType.PublicThread;
type GuildChannelType = Exclude<ChannelType, ChannelType.DM | ChannelType.GroupDM>;
type ApplicationCommandOptionAllowedChannelType = Exclude<ChannelType, ChannelType.DM | ChannelType.GroupDM | ChannelType.GuildDirectory>;
interface APISlowmodeChannel<T extends ChannelType> extends APIChannelBase<T> {
  /**
   * Amount of seconds a user has to wait before sending another message (0-21600);
   * bots, as well as users with the permission `BYPASS_SLOWMODE`, are unaffected
   *
   * `rate_limit_per_user` also applies to thread creation. Users can send one message and create one thread during each `rate_limit_per_user` interval.
   *
   * For thread channels, `rate_limit_per_user` is only returned if the field is set to a non-zero and non-null value.
   * The absence of this field in API calls and Gateway events should indicate that slowmode has been reset to the default value.
   */
  rate_limit_per_user?: number;
}
interface APISortableChannel {
  /**
   * Sorting position of the channel
   */
  position: number;
}
interface APITextBasedChannel<T extends ChannelType> extends APIChannelBase<T>, APISlowmodeChannel<T> {
  /**
   * The id of the last message sent in this channel (may not point to an existing or valid message)
   */
  last_message_id?: Snowflake | null;
}
interface APIPinChannel<T extends ChannelType> extends APIChannelBase<T> {
  /**
   * When the last pinned message was pinned.
   * This may be `null` in events such as `GUILD_CREATE` when a message is not pinned
   */
  last_pin_timestamp?: string | null;
}
interface APIGuildChannel<T extends GuildChannelType = GuildChannelType> extends APIChannelBase<T> {
  /**
   * The name of the channel (1-100 characters)
   */
  name: string;
  /**
   * The id of the guild (may be missing for some channel objects received over gateway guild dispatches)
   */
  guild_id?: Snowflake;
  /**
   * Explicit permission overwrites for members and roles
   *
   * @see {@link https://discord.com/developers/docs/resources/channel#overwrite-object}
   */
  permission_overwrites?: APIOverwrite[];
  /**
   * ID of the parent category for a channel (each parent category can contain up to 50 channels)
   */
  parent_id?: Snowflake | null;
  /**
   * Whether the channel is nsfw
   */
  nsfw?: boolean;
}
type GuildTextChannelType = Exclude<TextChannelType, ChannelType.DM | ChannelType.GroupDM>;
interface APIGuildTextChannel<T extends ChannelType.GuildForum | ChannelType.GuildMedia | GuildTextChannelType> extends APITextBasedChannel<T>, APIGuildChannel<T>, APISortableChannel, APIPinChannel<T> {
  /**
   * Default duration for newly created threads, in minutes, to automatically archive the thread after recent activity
   */
  default_auto_archive_duration?: ThreadAutoArchiveDuration;
  /**
   * The initial `rate_limit_per_user` to set on newly created threads.
   * This field is copied to the thread at creation time and does not live update
   */
  default_thread_rate_limit_per_user?: number;
  /**
   * The channel topic (0-1024 characters)
   */
  topic?: string | null;
}
type APITextChannel = APIGuildTextChannel<ChannelType.GuildText>;
type APINewsChannel = APIGuildTextChannel<ChannelType.GuildAnnouncement>;
interface APIGuildCategoryChannel extends APIGuildChannel<ChannelType.GuildCategory>, APISortableChannel {
  parent_id?: null;
}
interface APIVoiceChannelBase<T extends GuildChannelType> extends APIGuildChannel<T>, APISortableChannel, APITextBasedChannel<T>, APISlowmodeChannel<T> {
  /**
   * The bitrate (in bits) of the voice or stage channel
   */
  bitrate?: number;
  /**
   * The user limit of the voice or stage channel
   */
  user_limit?: number;
  /**
   * Voice region id for the voice or stage channel, automatic when set to `null`
   *
   * @see {@link https://discord.com/developers/docs/resources/voice#voice-region-object}
   */
  rtc_region?: string | null;
  /**
   * The camera video quality mode of the voice or stage channel, `1` when not present
   *
   * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes}
   */
  video_quality_mode?: VideoQualityMode;
}
type APIGuildVoiceChannel = APIVoiceChannelBase<ChannelType.GuildVoice>;
type APIGuildStageVoiceChannel = APIVoiceChannelBase<ChannelType.GuildStageVoice>;
interface APIDMChannelBase<T extends ChannelType> extends APITextBasedChannel<T>, APIPinChannel<T> {
  /**
   * The recipients of the DM
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object}
   */
  recipients?: APIUser[];
}
interface APIDMChannel extends APIDMChannelBase<ChannelType.DM> {
  /**
   * The name of the channel (always null for DM channels)
   */
  name: null;
}
interface APIGroupDMChannel extends APIDMChannelBase<ChannelType.GroupDM> {
  /**
   * The name of the channel (1-100 characters)
   */
  name: string | null;
  /**
   * Application id of the group DM creator if it is bot-created
   */
  application_id?: Snowflake;
  /**
   * Icon hash
   */
  icon?: string | null;
  /**
   * ID of the DM creator
   */
  owner_id?: Snowflake;
  /**
   * The id of the last message sent in this channel (may not point to an existing or valid message)
   */
  last_message_id?: Snowflake | null;
  /**
   * Whether the channel is managed by an OAuth2 application
   */
  managed?: boolean;
}
type ThreadChannelType = ChannelType.AnnouncementThread | ChannelType.PrivateThread | ChannelType.PublicThread;
interface APIThreadChannel<Type extends ThreadChannelType = ThreadChannelType> extends APITextBasedChannel<Type>, APIGuildChannel<Type>, APIPinChannel<Type> {
  /**
   * The client users member for the thread, only included in select endpoints
   */
  member?: APIThreadMember;
  /**
   * The metadata for a thread channel not shared by other channels
   */
  thread_metadata?: APIThreadMetadata;
  /**
   * Number of messages (not including the initial message or deleted messages) in a thread
   *
   * If the thread was created before July 1, 2022, it stops counting at 50 messages
   */
  message_count?: number;
  /**
   * The approximate member count of the thread, does not count above 50 even if there are more members
   */
  member_count?: number;
  /**
   * ID of the thread creator
   */
  owner_id?: Snowflake;
  /**
   * Number of messages ever sent in a thread
   *
   * Similar to `message_count` on message creation, but won't decrement when a message is deleted
   */
  total_message_sent?: number;
  /**
   * The IDs of the set of tags that have been applied to a thread in a thread-only channel
   */
  applied_tags?: Snowflake[];
  /**
   * ID of the parent channel for the thread
   */
  parent_id?: Snowflake;
}
type APIPublicThreadChannel = APIThreadChannel<ChannelType.PublicThread>;
type APIPrivateThreadChannel = APIThreadChannel<ChannelType.PrivateThread>;
type APIAnnouncementThreadChannel = APIThreadChannel<ChannelType.AnnouncementThread>;
/**
 * @see {@link https://discord.com/developers/docs/resources/channel#forum-tag-object-forum-tag-structure}
 */
interface APIGuildForumTag {
  /**
   * The id of the tag
   */
  id: Snowflake;
  /**
   * The name of the tag (0-20 characters)
   */
  name: string;
  /**
   * Whether this tag can only be added to or removed from threads by a member with the `MANAGE_THREADS` permission
   */
  moderated: boolean;
  /**
   * The id of a guild's custom emoji
   */
  emoji_id: Snowflake | null;
  /**
   * The unicode character of the emoji
   */
  emoji_name: string | null;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/channel#default-reaction-object-default-reaction-structure}
 */
interface APIGuildForumDefaultReactionEmoji {
  /**
   * The id of a guild's custom emoji
   */
  emoji_id: Snowflake | null;
  /**
   * The unicode character of the emoji
   */
  emoji_name: string | null;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/channel/#channel-object-sort-order-types}
 */
declare enum SortOrderType {
  /**
   * Sort forum posts by activity
   */
  LatestActivity = 0,
  /**
   * Sort forum posts by creation time (from most recent to oldest)
   */
  CreationDate = 1
}
/**
 * @see {@link https://discord.com/developers/docs/resources/channel/#channel-object-forum-layout-types}
 */
declare enum ForumLayoutType {
  /**
   * No default has been set for forum channel
   */
  NotSet = 0,
  /**
   * Display posts as a list
   */
  ListView = 1,
  /**
   * Display posts as a collection of tiles
   */
  GalleryView = 2
}
interface APIThreadOnlyChannel<T extends ChannelType.GuildForum | ChannelType.GuildMedia> extends APIGuildChannel<T>, APISortableChannel {
  /**
   * The channel topic (0-4096 characters)
   */
  topic?: string | null;
  /**
   * The id of the last thread created in this channel (may not point to an existing or valid thread)
   */
  last_message_id?: Snowflake | null;
  /**
   * Amount of seconds a user has to wait before creating another thread (0-21600);
   * bots, as well as users with the permission `BYPASS_SLOWMODE`, are unaffected
   *
   * The absence of this field in API calls and Gateway events should indicate that slowmode has been reset to the default value.
   */
  rate_limit_per_user?: number;
  /**
   * When the last pinned message was pinned.
   * This may be `null` in events such as `GUILD_CREATE` when a message is not pinned
   */
  last_pin_timestamp?: string | null;
  /**
   * Default duration for newly created threads, in minutes, to automatically archive the thread after recent activity
   */
  default_auto_archive_duration?: ThreadAutoArchiveDuration;
  /**
   * The set of tags that can be used in a thread-only channel
   */
  available_tags: APIGuildForumTag[];
  /**
   * The initial `rate_limit_per_user` to set on newly created threads.
   * This field is copied to the thread at creation time and does not live update
   */
  default_thread_rate_limit_per_user?: number;
  /**
   * The emoji to show in the add reaction button on a thread in a thread-only channel
   */
  default_reaction_emoji: APIGuildForumDefaultReactionEmoji | null;
  /**
   * The default sort order type used to order posts in a thread-only channel
   */
  default_sort_order: SortOrderType | null;
}
interface APIGuildForumChannel extends APIThreadOnlyChannel<ChannelType.GuildForum> {
  /**
   * The default layout type used to display posts in a forum channel
   *
   * @defaultValue `ForumLayoutType.NotSet` which indicates a layout view has not been set by a channel admin
   */
  default_forum_layout: ForumLayoutType;
}
type APIGuildMediaChannel = APIThreadOnlyChannel<ChannelType.GuildMedia>;
/**
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-channel-structure}
 */
type APIChannel = APIAnnouncementThreadChannel | APIDMChannel | APIGroupDMChannel | APIGuildCategoryChannel | APIGuildForumChannel | APIGuildMediaChannel | APIGuildStageVoiceChannel | APIGuildVoiceChannel | APINewsChannel | APIPrivateThreadChannel | APIPublicThreadChannel | APITextChannel;
/**
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-channel-types}
 */
declare enum ChannelType {
  /**
   * A text channel within a guild
   */
  GuildText = 0,
  /**
   * A direct message between users
   */
  DM = 1,
  /**
   * A voice channel within a guild
   */
  GuildVoice = 2,
  /**
   * A direct message between multiple users
   */
  GroupDM = 3,
  /**
   * An organizational category that contains up to 50 channels
   *
   * @see {@link https://support.discord.com/hc/articles/115001580171}
   */
  GuildCategory = 4,
  /**
   * A channel that users can follow and crosspost into their own guild
   *
   * @see {@link https://support.discord.com/hc/articles/360032008192}
   */
  GuildAnnouncement = 5,
  /**
   * A temporary sub-channel within a Guild Announcement channel
   */
  AnnouncementThread = 10,
  /**
   * A temporary sub-channel within a Guild Text or Guild Forum channel
   */
  PublicThread = 11,
  /**
   * A temporary sub-channel within a Guild Text channel that is only viewable by those invited and those with the Manage Threads permission
   */
  PrivateThread = 12,
  /**
   * A voice channel for hosting events with an audience
   *
   * @see {@link https://support.discord.com/hc/articles/1500005513722}
   */
  GuildStageVoice = 13,
  /**
   * The channel in a Student Hub containing the listed servers
   *
   * @see {@link https://support.discord.com/hc/articles/4406046651927}
   */
  GuildDirectory = 14,
  /**
   * A channel that can only contain threads
   */
  GuildForum = 15,
  /**
   * A channel like forum channels but contains media for server subscriptions
   *
   * @see {@link https://creator-support.discord.com/hc/articles/14346342766743}
   */
  GuildMedia = 16,
  /**
   * A channel that users can follow and crosspost into their own guild
   *
   * @deprecated This is the old name for {@link ChannelType.GuildAnnouncement}
   * @see {@link https://support.discord.com/hc/articles/360032008192}
   */
  GuildNews = 5,
  /**
   * A temporary sub-channel within a Guild Announcement channel
   *
   * @deprecated This is the old name for {@link ChannelType.AnnouncementThread}
   */
  GuildNewsThread = 10,
  /**
   * A temporary sub-channel within a Guild Text channel
   *
   * @deprecated This is the old name for {@link ChannelType.PublicThread}
   */
  GuildPublicThread = 11,
  /**
   * A temporary sub-channel within a Guild Text channel that is only viewable by those invited and those with the Manage Threads permission
   *
   * @deprecated This is the old name for {@link ChannelType.PrivateThread}
   */
  GuildPrivateThread = 12
}
declare enum VideoQualityMode {
  /**
   * Discord chooses the quality for optimal performance
   */
  Auto = 1,
  /**
   * 720p
   */
  Full = 2
}
/**
 * @see {@link https://discord.com/developers/docs/resources/channel#overwrite-object-overwrite-structure}
 */
interface APIOverwrite {
  /**
   * Role or user id
   */
  id: Snowflake;
  /**
   * Either 0 (role) or 1 (member)
   */
  type: OverwriteType;
  /**
   * Permission bit set
   *
   * @see {@link https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags}
   * @see {@link https://en.wikipedia.org/wiki/Bit_field}
   */
  allow: Permissions;
  /**
   * Permission bit set
   *
   * @see {@link https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags}
   * @see {@link https://en.wikipedia.org/wiki/Bit_field}
   */
  deny: Permissions;
}
declare enum OverwriteType {
  Role = 0,
  Member = 1
}
/**
 * @see {@link https://discord.com/developers/docs/resources/channel#thread-metadata-object-thread-metadata-structure}
 */
interface APIThreadMetadata {
  /**
   * Whether the thread is archived
   */
  archived: boolean;
  /**
   * Duration in minutes to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080
   */
  auto_archive_duration: ThreadAutoArchiveDuration;
  /**
   * An ISO8601 timestamp when the thread's archive status was last changed, used for calculating recent activity
   */
  archive_timestamp: string;
  /**
   * Whether the thread is locked; when a thread is locked, only users with `MANAGE_THREADS` can unarchive it
   */
  locked: boolean;
  /**
   * Whether non-moderators can add other non-moderators to the thread; only available on private threads
   */
  invitable?: boolean;
  /**
   * Timestamp when the thread was created; only populated for threads created after 2022-01-09
   */
  create_timestamp?: string;
}
declare enum ThreadAutoArchiveDuration {
  OneHour = 60,
  OneDay = 1440,
  ThreeDays = 4320,
  OneWeek = 10080
}
/**
 * @see {@link https://discord.com/developers/docs/resources/channel#thread-member-object-thread-member-structure}
 */
interface APIThreadMember {
  /**
   * The id of the thread
   *
   * **This field is omitted on the member sent within each thread in the `GUILD_CREATE` event**
   */
  id?: Snowflake;
  /**
   * The id of the member
   *
   * **This field is omitted on the member sent within each thread in the `GUILD_CREATE` event**
   */
  user_id?: Snowflake;
  /**
   * An ISO8601 timestamp for when the member last joined
   */
  join_timestamp: string;
  /**
   * Member flags combined as a bitfield
   *
   * @see {@link https://en.wikipedia.org/wiki/Bit_field}
   */
  flags: ThreadMemberFlags;
  /**
   * Additional information about the user
   *
   * **This field is omitted on the member sent within each thread in the `GUILD_CREATE` event**
   *
   * **This field is only present when `with_member` is set to true when calling `List Thread Members` or `Get Thread Member`**
   */
  member?: APIGuildMember;
}
declare enum ThreadMemberFlags {
  /**
   * @unstable This thread member flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   */
  HasInteracted = 1,
  /**
   * @unstable This thread member flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   */
  AllMessages = 2,
  /**
   * @unstable This thread member flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   */
  OnlyMentions = 4,
  /**
   * @unstable This thread member flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   */
  NoMessages = 8
}
/**
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-channel-flags}
 */
declare enum ChannelFlags {
  /**
   * @unstable This channel flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   */
  GuildFeedRemoved = 1,
  /**
   * This thread is pinned to the top of its parent forum channel
   */
  Pinned = 2,
  /**
   * @unstable This channel flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   */
  ActiveChannelsRemoved = 4,
  /**
   * Whether a tag is required to be specified when creating a thread in a forum channel.
   * Tags are specified in the `applied_tags` field
   */
  RequireTag = 16,
  /**
   * @unstable This channel flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   */
  IsSpam = 32,
  /**
   * @unstable This channel flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   */
  IsGuildResourceChannel = 128,
  /**
   * @unstable This channel flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   */
  ClydeAI = 256,
  /**
   * @unstable This channel flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   */
  IsScheduledForDeletion = 512,
  /**
   * Whether media download options are hidden.
   */
  HideMediaDownloadOptions = 32768,
  /**
   * This channel is a Spoiler Channel i.e. users must opt in to view its contents.
   */
  IsSpoilerChannel = 2097152
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/gateway.d.ts
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway#get-gateway}
 */
interface APIGatewayInfo {
  /**
   * The WSS URL that can be used for connecting to the gateway
   */
  url: string;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway#get-gateway-bot}
 */
interface APIGatewayBotInfo extends APIGatewayInfo {
  /**
   * The recommended number of shards to use when connecting
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway#sharding}
   */
  shards: number;
  /**
   * Information on the current session start limit
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway#session-start-limit-object}
   */
  session_start_limit: APIGatewaySessionStartLimit;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway#session-start-limit-object}
 */
interface APIGatewaySessionStartLimit {
  /**
   * The total number of session starts the current user is allowed
   */
  total: number;
  /**
   * The remaining number of session starts the current user is allowed
   */
  remaining: number;
  /**
   * The number of milliseconds after which the limit resets
   */
  reset_after: number;
  /**
   * The number of identify requests allowed per 5 seconds
   */
  max_concurrency: number;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#update-presence}
 */
interface GatewayGuildMembersChunkPresence {
  /**
   * The user presence is being updated for
   *
   * **The user object within this event can be partial, the only field which must be sent is the `id` field,
   * everything else is optional.**
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object}
   */
  user: Partial<APIUser> & Pick<APIUser, 'id'>;
  /**
   * Either "idle", "dnd", "online", or "offline"
   */
  status?: PresenceUpdateReceiveStatus;
  /**
   * User's current activities
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object}
   */
  activities?: GatewayActivity[];
  /**
   * User's platform-dependent status
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#client-status-object}
   */
  client_status?: GatewayPresenceClientStatus;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#presence-update-presence-update-event-fields}
 */
interface GatewayPresenceUpdate extends GatewayGuildMembersChunkPresence {
  /**
   * ID of the guild
   */
  guild_id: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#update-presence-status-types}
 */
declare enum PresenceUpdateStatus {
  Online = "online",
  DoNotDisturb = "dnd",
  Idle = "idle",
  /**
   * Invisible and shown as offline
   */
  Invisible = "invisible",
  Offline = "offline"
}
type PresenceUpdateReceiveStatus = Exclude<PresenceUpdateStatus, PresenceUpdateStatus.Invisible>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#client-status-object}
 */
interface GatewayPresenceClientStatus {
  /**
   * The user's status set for an active desktop (Windows, Linux, Mac) application session
   */
  desktop?: PresenceUpdateReceiveStatus;
  /**
   * The user's status set for an active mobile (iOS, Android) application session
   */
  mobile?: PresenceUpdateReceiveStatus;
  /**
   * The user's status set for an active web (browser, bot account) application session
   */
  web?: PresenceUpdateReceiveStatus;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-structure}
 */
interface GatewayActivity {
  /**
   * The activity's id
   *
   * @unstable
   */
  id: string;
  /**
   * The activity's name
   */
  name: string;
  /**
   * Activity type
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-types}
   */
  type: ActivityType;
  /**
   * Stream url, is validated when type is `1`
   */
  url?: string | null;
  /**
   * Unix timestamp of when the activity was added to the user's session
   */
  created_at: number;
  /**
   * Unix timestamps for start and/or end of the game
   */
  timestamps?: GatewayActivityTimestamps;
  /**
   * The Spotify song id
   *
   * @unstable
   */
  sync_id?: string;
  /**
   * The platform this activity is being done on
   *
   * @unstable You can use {@link ActivityPlatform} as a stepping stone, but this might be inaccurate
   */
  platform?: string;
  /**
   * Application id for the game
   */
  application_id?: Snowflake;
  /**
   * Controls which field is displayed in the user's status text in the member list
   *
   * @see {@link https://discord.com/developers/docs/events/gateway-events#activity-object-status-display-types}
   */
  status_display_type?: StatusDisplayType | null;
  /**
   * What the player is currently doing
   */
  details?: string | null;
  /**
   * URL that is linked when clicking on the details text
   */
  details_url?: string | null;
  /**
   * The user's current party status, or the text used for a custom status
   */
  state?: string | null;
  /**
   * URL that is linked when clicking on the state text
   */
  state_url?: string | null;
  /**
   * The emoji used for a custom status
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-emoji}
   */
  emoji?: GatewayActivityEmoji;
  /**
   * @unstable
   */
  session_id?: string;
  /**
   * Information for the current party of the player
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-party}
   */
  party?: GatewayActivityParty;
  /**
   * Images for the presence and their hover texts
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-assets}
   */
  assets?: GatewayActivityAssets;
  /**
   * Secrets for Rich Presence joining and spectating
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-secrets}
   */
  secrets?: GatewayActivitySecrets;
  /**
   * Whether or not the activity is an instanced game session
   */
  instance?: boolean;
  /**
   * Activity flags `OR`d together, describes what the payload includes
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-flags}
   * @see {@link https://en.wikipedia.org/wiki/Bit_field}
   */
  flags?: ActivityFlags;
  /**
   * The custom buttons shown in the Rich Presence (max 2)
   */
  buttons?: GatewayActivityButton[] | string[];
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-types}
 */
declare enum ActivityType {
  /**
   * Playing \{game\}
   */
  Playing = 0,
  /**
   * Streaming \{details\}
   */
  Streaming = 1,
  /**
   * Listening to \{name\}
   */
  Listening = 2,
  /**
   * Watching \{details\}
   */
  Watching = 3,
  /**
   * \{emoji\} \{state\}
   */
  Custom = 4,
  /**
   * Competing in \{name\}
   */
  Competing = 5
}
/**
 * Controls which field is used in the user's status message
 *
 * @see {@link https://discord.com/developers/docs/events/gateway-events#activity-object-status-display-types}
 */
declare enum StatusDisplayType {
  /**
   * Playing \{name\}
   */
  Name = 0,
  /**
   * Playing \{state\}
   */
  State = 1,
  /**
   * Playing \{details\}
   */
  Details = 2
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-timestamps}
 */
interface GatewayActivityTimestamps {
  /**
   * Unix time (in milliseconds) of when the activity started
   */
  start?: number;
  /**
   * Unix time (in milliseconds) of when the activity ends
   */
  end?: number;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-emoji}
 */
type GatewayActivityEmoji = Partial<Pick<APIEmoji, 'animated' | 'id'>> & Pick<APIEmoji, 'name'>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-party}
 */
interface GatewayActivityParty {
  /**
   * The id of the party
   */
  id?: string;
  /**
   * Used to show the party's current and maximum size
   */
  size?: [current_size: number, max_size: number];
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-assets}
 */
interface GatewayActivityAssets {
  /**
   * @see {@link https://discord.com/developers/docs/events/gateway-events#activity-object-activity-asset-image}
   */
  large_image?: string;
  /**
   * Text displayed when hovering over the large image of the activity
   */
  large_text?: string;
  /**
   * URL that is opened when clicking on the large image
   */
  large_url?: string;
  /**
   * @see {@link https://discord.com/developers/docs/events/gateway-events#activity-object-activity-asset-image}
   */
  small_image?: string;
  /**
   * Text displayed when hovering over the small image of the activity
   */
  small_text?: string;
  /**
   * URL that is opened when clicking on the small image
   */
  small_url?: string;
  /**
   * Displayed as a banner on a Game Invite.
   *
   * @see {@link https://discord.com/developers/docs/events/gateway-events#activity-object-activity-asset-image | Activity Asset Image}
   * @see {@link https://discord.com/developers/docs/discord-social-sdk/development-guides/managing-game-invites | Game Invite}
   */
  invite_cover_image?: string;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-secrets}
 */
interface GatewayActivitySecrets {
  /**
   * The secret for joining a party
   */
  join?: string;
  /**
   * The secret for spectating a game
   */
  spectate?: string;
  /**
   * The secret for a specific instance of a match
   */
  match?: string;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-flags}
 */
declare enum ActivityFlags {
  Instance = 1,
  Join = 2,
  Spectate = 4,
  JoinRequest = 8,
  Sync = 16,
  Play = 32,
  PartyPrivacyFriends = 64,
  PartyPrivacyVoiceChannel = 128,
  Embedded = 256
}
interface GatewayActivityButton {
  /**
   * The text shown on the button (1-32 characters)
   */
  label: string;
  /**
   * The url opened when clicking the button (1-512 characters)
   */
  url: string;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-list-sync-thread-list-sync-event-fields}
 */
interface GatewayThreadListSync {
  /**
   * ID of the guild
   */
  guild_id: Snowflake;
  /**
   * The ids of all the parent channels whose threads are being synced, otherwise the entire guild
   */
  channel_ids?: Snowflake[];
  /**
   * Array of the synced threads
   */
  threads: APIThreadChannel[];
  /**
   * The member objects for the client user in each joined thread that was synced
   */
  members: APIThreadMember[];
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-members-update-thread-members-update-event-fields}
 */
interface GatewayThreadMembersUpdate {
  /**
   * The id of the thread for which members are being synced
   */
  id: Snowflake;
  /**
   * The id of the guild that the thread is in
   */
  guild_id: Snowflake;
  /**
   * The approximate member count of the thread, does not count above 50 even if there are more members
   */
  member_count: number;
  /**
   * The members that were added to the thread
   */
  added_members?: APIThreadMember[];
  /**
   * The ids of the members that were removed from the thread
   */
  removed_member_ids?: Snowflake[];
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/oauth2.d.ts
/**
 * Types extracted from https://discord.com/developers/docs/topics/oauth2
 */
declare enum OAuth2Scopes {
  /**
   * For oauth2 bots, this puts the bot in the user's selected guild by default
   */
  Bot = "bot",
  /**
   * Allows {@link https://discord.com/developers/docs/resources/user#get-user-connections | `/users/@me/connections`}
   * to return linked third-party accounts
   *
   * @see {@link https://discord.com/developers/docs/resources/user#get-user-connections}
   */
  Connections = "connections",
  /**
   * Allows your app to see information about the user's DMs and group DMs - requires Discord approval
   */
  DMChannelsRead = "dm_channels.read",
  /**
   * Enables {@link https://discord.com/developers/docs/resources/user#get-current-user | `/users/@me`} to return an `email`
   *
   * @see {@link https://discord.com/developers/docs/resources/user#get-current-user}
   */
  Email = "email",
  /**
   * Allows {@link https://discord.com/developers/docs/resources/user#get-current-user | `/users/@me`} without `email`
   *
   * @see {@link https://discord.com/developers/docs/resources/user#get-current-user}
   */
  Identify = "identify",
  /**
   * Allows your app to read a user's Nitro subscription type as defined by `premium_type` on the
   * {@link https://docs.discord.com/developers/resources/user#user-object-user-structure | User object} - only available to approved partners
   *
   * @see {@link https://docs.discord.com/developers/resources/user#user-object-user-structure}
   */
  IdentifyPremium = "identify.premium",
  /**
   * Allows {@link https://discord.com/developers/docs/resources/user#get-current-user-guilds | `/users/@me/guilds`}
   * to return basic information about all of a user's guilds
   *
   * @see {@link https://discord.com/developers/docs/resources/user#get-current-user-guilds}
   */
  Guilds = "guilds",
  /**
   * Allows {@link https://discord.com/developers/docs/resources/guild#add-guild-member | `/guilds/[guild.id]/members/[user.id]`}
   * to be used for joining users to a guild
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#add-guild-member}
   */
  GuildsJoin = "guilds.join",
  /**
   * Allows /users/\@me/guilds/\{guild.id\}/member to return a user's member information in a guild
   *
   * @see {@link https://discord.com/developers/docs/resources/user#get-current-user-guild-member}
   */
  GuildsMembersRead = "guilds.members.read",
  /**
   * Allows your app to join users to a group dm
   *
   * @see {@link https://discord.com/developers/docs/resources/channel#group-dm-add-recipient}
   */
  GroupDMJoins = "gdm.join",
  /**
   * For local rpc server api access, this allows you to read messages from all client channels
   * (otherwise restricted to channels/guilds your app creates)
   */
  MessagesRead = "messages.read",
  /**
   * Allows your app to update a user's connection and metadata for the app
   */
  RoleConnectionsWrite = "role_connections.write",
  /**
   * For local rpc server access, this allows you to control a user's local Discord client - requires Discord approval
   */
  RPC = "rpc",
  /**
   * For local rpc server access, this allows you to update a user's activity - requires Discord approval
   */
  RPCActivitiesWrite = "rpc.activities.write",
  /**
   * For local rpc server access, this allows you to read a user's voice settings and listen for voice events - requires Discord approval
   */
  RPCVoiceRead = "rpc.voice.read",
  /**
   * For local rpc server access, this allows you to update a user's voice settings - requires Discord approval
   */
  RPCVoiceWrite = "rpc.voice.write",
  /**
   * For local rpc server api access, this allows you to receive notifications pushed out to the user - requires Discord approval
   */
  RPCNotificationsRead = "rpc.notifications.read",
  /**
   * This generates a webhook that is returned in the oauth token response for authorization code grants
   */
  WebhookIncoming = "webhook.incoming",
  /**
   * Allows your app to connect to voice on user's behalf and see all the voice members - requires Discord approval
   */
  Voice = "voice",
  /**
   * Allows your app to upload/update builds for a user's applications - requires Discord approval
   */
  ApplicationsBuildsUpload = "applications.builds.upload",
  /**
   * Allows your app to read build data for a user's applications
   */
  ApplicationsBuildsRead = "applications.builds.read",
  /**
   * Allows your app to read and update store data (SKUs, store listings, achievements, etc.) for a user's applications
   */
  ApplicationsStoreUpdate = "applications.store.update",
  /**
   * Allows your app to read entitlements for a user's applications
   */
  ApplicationsEntitlements = "applications.entitlements",
  /**
   * Allows your app to know a user's friends and implicit relationships - requires Discord approval
   */
  RelationshipsRead = "relationships.read",
  /**
   * Allows your app to fetch data from a user's "Now Playing/Recently Played" list - requires Discord approval
   */
  ActivitiesRead = "activities.read",
  /**
   * Allows your app to update a user's activity - requires Discord approval (NOT REQUIRED FOR GAMESDK ACTIVITY MANAGER)
   *
   * @see {@link https://discord.com/developers/docs/game-sdk/activities}
   */
  ActivitiesWrite = "activities.write",
  /**
   * Allows your app to use Application Commands in a guild
   *
   * @see {@link https://discord.com/developers/docs/interactions/application-commands}
   */
  ApplicationsCommands = "applications.commands",
  /**
   * Allows your app to update its Application Commands via this bearer token - client credentials grant only
   *
   * @see {@link https://discord.com/developers/docs/interactions/application-commands}
   */
  ApplicationsCommandsUpdate = "applications.commands.update",
  /**
   * Allows your app to update permissions for its commands using a Bearer token - client credentials grant only
   *
   * @see {@link https://discord.com/developers/docs/interactions/application-commands}
   */
  ApplicationCommandsPermissionsUpdate = "applications.commands.permissions.update"
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/sticker.d.ts
/**
 * @see {@link https://discord.com/developers/docs/resources/sticker#sticker-object}
 */
interface APISticker {
  /**
   * ID of the sticker
   */
  id: Snowflake;
  /**
   * For standard stickers, ID of the pack the sticker is from
   */
  pack_id?: Snowflake;
  /**
   * Name of the sticker
   */
  name: string;
  /**
   * Description of the sticker
   */
  description: string | null;
  /**
   * For guild stickers, the Discord name of a unicode emoji representing the sticker's expression. for standard stickers, a comma-separated list of related expressions.
   */
  tags: string;
  /**
   * Previously the sticker asset hash, now an empty string
   *
   * @deprecated This field is no longer documented by Discord and will be removed in v11
   * @unstable This field is no longer documented by Discord and will be removed in v11
   */
  asset?: '';
  /**
   * Type of sticker
   *
   * @see {@link https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-types}
   */
  type: StickerType;
  /**
   * Type of sticker format
   *
   * @see {@link https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-format-types}
   */
  format_type: StickerFormatType;
  /**
   * Whether this guild sticker can be used, may be false due to loss of Server Boosts
   */
  available?: boolean;
  /**
   * ID of the guild that owns this sticker
   */
  guild_id?: Snowflake;
  /**
   * The user that uploaded the guild sticker
   */
  user?: APIUser;
  /**
   * The standard sticker's sort order within its pack
   */
  sort_value?: number;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-types}
 */
declare enum StickerType {
  /**
   * An official sticker in a pack
   */
  Standard = 1,
  /**
   * A sticker uploaded to a guild for the guild's members
   */
  Guild = 2
}
/**
 * @see {@link https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-format-types}
 */
declare enum StickerFormatType {
  PNG = 1,
  APNG = 2,
  Lottie = 3,
  GIF = 4
}
/**
 * @see {@link https://discord.com/developers/docs/resources/sticker#sticker-item-object}
 */
type APIStickerItem = Pick<APISticker, 'format_type' | 'id' | 'name'>;
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/guild.d.ts
interface APIBaseGuild {
  /**
   * Guild id
   */
  id: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#unavailable-guild-object}
 */
interface APIUnavailableGuild extends APIBaseGuild {
  /**
   * `true` if this guild is unavailable due to an outage
   */
  unavailable: boolean;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-guild-structure}
 */
interface APIPartialGuild extends APIBaseGuild {
  /**
   * Guild name (2-100 characters, excluding trailing and leading whitespace)
   */
  name: string;
  /**
   * Icon hash
   *
   * @see {@link https://discord.com/developers/docs/reference#image-formatting}
   */
  icon: string | null;
  /**
   * Splash hash
   *
   * @see {@link https://discord.com/developers/docs/reference#image-formatting}
   */
  splash: string | null;
  /**
   * Banner hash
   *
   * @see {@link https://discord.com/developers/docs/reference#image-formatting}
   */
  banner?: string | null;
  /**
   * The description for the guild
   */
  description?: string | null;
  /**
   * Enabled guild features
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-guild-features}
   */
  features?: GuildFeature[];
  /**
   * Verification level required for the guild
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-verification-level}
   */
  verification_level?: GuildVerificationLevel;
  /**
   * The vanity url code for the guild
   */
  vanity_url_code?: string | null;
  /**
   * The welcome screen of a Community guild, shown to new members
   *
   * Returned in the invite object
   */
  welcome_screen?: APIGuildWelcomeScreen;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-guild-structure}
 */
interface APIGuild extends APIPartialGuild {
  /**
   * Icon hash, returned when in the template object
   *
   * @see {@link https://discord.com/developers/docs/reference#image-formatting}
   */
  icon_hash?: string | null;
  /**
   * Discovery splash hash; only present for guilds with the "DISCOVERABLE" feature
   *
   * @see {@link https://discord.com/developers/docs/reference#image-formatting}
   */
  discovery_splash: string | null;
  /**
   * `true` if the user is the owner of the guild
   *
   * **This field is only received from https://discord.com/developers/docs/resources/user#get-current-user-guilds**
   */
  owner?: boolean;
  /**
   * ID of owner
   */
  owner_id: Snowflake;
  /**
   * Total permissions for the user in the guild (excludes overrides)
   *
   * **This field is only received from https://discord.com/developers/docs/resources/user#get-current-user-guilds**
   *
   * @see {@link https://en.wikipedia.org/wiki/Bit_field}
   */
  permissions?: Permissions;
  /**
   * Voice region id for the guild
   *
   * @see {@link https://discord.com/developers/docs/resources/voice#voice-region-object}
   * @deprecated This field has been deprecated in favor of `rtc_region` on the channel.
   */
  region?: string | null;
  /**
   * ID of afk channel
   */
  afk_channel_id: Snowflake | null;
  /**
   * afk timeout in seconds, can be set to: `60`, `300`, `900`, `1800`, `3600`
   */
  afk_timeout: 1800 | 3600 | 60 | 300 | 900;
  /**
   * `true` if the guild widget is enabled
   */
  widget_enabled?: boolean;
  /**
   * The channel id that the widget will generate an invite to, or `null` if set to no invite
   */
  widget_channel_id?: Snowflake | null;
  /**
   * Verification level required for the guild
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-verification-level}
   */
  verification_level: GuildVerificationLevel;
  /**
   * Default message notifications level
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-default-message-notification-level}
   */
  default_message_notifications: GuildDefaultMessageNotifications;
  /**
   * Explicit content filter level
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-explicit-content-filter-level}
   */
  explicit_content_filter: GuildExplicitContentFilter;
  /**
   * Roles in the guild
   *
   * @see {@link https://discord.com/developers/docs/topics/permissions#role-object}
   */
  roles: APIRole[];
  /**
   * Custom guild emojis
   *
   * @see {@link https://discord.com/developers/docs/resources/emoji#emoji-object}
   */
  emojis: APIEmoji[];
  /**
   * Enabled guild features
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-guild-features}
   */
  features: GuildFeature[];
  /**
   * Required MFA level for the guild
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-mfa-level}
   */
  mfa_level: GuildMFALevel;
  /**
   * Application id of the guild creator if it is bot-created
   */
  application_id: Snowflake | null;
  /**
   * The id of the channel where guild notices such as welcome messages and boost events are posted
   */
  system_channel_id: Snowflake | null;
  /**
   * System channel flags
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-system-channel-flags}
   */
  system_channel_flags: GuildSystemChannelFlags;
  /**
   * The id of the channel where Community guilds can display rules and/or guidelines
   */
  rules_channel_id: Snowflake | null;
  /**
   * The maximum number of presences for the guild (`null` is always returned, apart from the largest of guilds)
   */
  max_presences?: number | null;
  /**
   * The maximum number of members for the guild
   */
  max_members?: number;
  /**
   * The vanity url code for the guild
   */
  vanity_url_code: string | null;
  /**
   * The description for the guild
   */
  description: string | null;
  /**
   * Banner hash
   *
   * @see {@link https://discord.com/developers/docs/reference#image-formatting}
   */
  banner: string | null;
  /**
   * Premium tier (Server Boost level)
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-premium-tier}
   */
  premium_tier: GuildPremiumTier;
  /**
   * The number of boosts this guild currently has
   */
  premium_subscription_count?: number;
  /**
   * The preferred locale of a Community guild; used in guild discovery and notices from Discord
   *
   * @defaultValue `"en-US"`
   */
  preferred_locale: Locale;
  /**
   * The id of the channel where admins and moderators of Community guilds receive notices from Discord
   */
  public_updates_channel_id: Snowflake | null;
  /**
   * The maximum amount of users in a video channel
   */
  max_video_channel_users?: number;
  /**
   * The maximum amount of users in a stage video channel
   */
  max_stage_video_channel_users?: number;
  /**
   * Approximate number of members in this guild,
   * returned from the `GET /guilds/<id>` and `/users/@me/guilds` (OAuth2) endpoints when `with_counts` is `true`
   */
  approximate_member_count?: number;
  /**
   * Approximate number of non-offline members in this guild,
   * returned from the `GET /guilds/<id>` and `/users/@me/guilds` (OAuth2) endpoints when `with_counts` is `true`
   */
  approximate_presence_count?: number;
  /**
   * The nsfw level of the guild
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-guild-nsfw-level}
   */
  nsfw_level: GuildNSFWLevel;
  /**
   * Custom guild stickers
   *
   * @see {@link https://discord.com/developers/docs/resources/sticker#sticker-object}
   */
  stickers?: APISticker[];
  /**
   * Whether the guild has the boost progress bar enabled.
   */
  premium_progress_bar_enabled: boolean;
  /**
   * The type of Student Hub the guild is
   */
  hub_type: GuildHubType | null;
  /**
   * The id of the channel where admins and moderators of Community guilds receive safety alerts from Discord
   */
  safety_alerts_channel_id: Snowflake | null;
  /**
   * The incidents data for this guild
   */
  incidents_data: APIIncidentsData | null;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-guild-structure}
 */
interface APIPartialInteractionGuild extends Pick<APIGuild, 'features' | 'id'> {
  /**
   * The preferred locale of a Community guild; used in guild discovery and notices from Discord
   *
   * @unstable https://github.com/discord/discord-api-docs/issues/6938
   * @defaultValue `"en-US"`
   */
  locale: Locale;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-default-message-notification-level}
 */
declare enum GuildDefaultMessageNotifications {
  AllMessages = 0,
  OnlyMentions = 1
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-explicit-content-filter-level}
 */
declare enum GuildExplicitContentFilter {
  Disabled = 0,
  MembersWithoutRoles = 1,
  AllMembers = 2
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-mfa-level}
 */
declare enum GuildMFALevel {
  None = 0,
  Elevated = 1
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-guild-nsfw-level}
 */
declare enum GuildNSFWLevel {
  Default = 0,
  Explicit = 1,
  Safe = 2,
  AgeRestricted = 3
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-verification-level}
 */
declare enum GuildVerificationLevel {
  /**
   * Unrestricted
   */
  None = 0,
  /**
   * Must have verified email on account
   */
  Low = 1,
  /**
   * Must be registered on Discord for longer than 5 minutes
   */
  Medium = 2,
  /**
   * Must be a member of the guild for longer than 10 minutes
   */
  High = 3,
  /**
   * Must have a verified phone number
   */
  VeryHigh = 4
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-premium-tier}
 */
declare enum GuildPremiumTier {
  None = 0,
  Tier1 = 1,
  Tier2 = 2,
  Tier3 = 3
}
declare enum GuildHubType {
  Default = 0,
  HighSchool = 1,
  College = 2
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-system-channel-flags}
 */
declare enum GuildSystemChannelFlags {
  /**
   * Suppress member join notifications
   */
  SuppressJoinNotifications = 1,
  /**
   * Suppress server boost notifications
   */
  SuppressPremiumSubscriptions = 2,
  /**
   * Suppress server setup tips
   */
  SuppressGuildReminderNotifications = 4,
  /**
   * Hide member join sticker reply buttons
   */
  SuppressJoinNotificationReplies = 8,
  /**
   * Suppress role subscription purchase and renewal notifications
   */
  SuppressRoleSubscriptionPurchaseNotifications = 16,
  /**
   * Hide role subscription sticker reply buttons
   */
  SuppressRoleSubscriptionPurchaseNotificationReplies = 32
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-guild-features}
 */
declare enum GuildFeature {
  /**
   * Guild has access to set an animated guild banner image
   */
  AnimatedBanner = "ANIMATED_BANNER",
  /**
   * Guild has access to set an animated guild icon
   */
  AnimatedIcon = "ANIMATED_ICON",
  /**
   * Guild is using the old permissions configuration behavior
   *
   * @see {@link https://discord.com/developers/docs/change-log#upcoming-application-command-permission-changes}
   */
  ApplicationCommandPermissionsV2 = "APPLICATION_COMMAND_PERMISSIONS_V2",
  /**
   * Guild has set up auto moderation rules
   */
  AutoModeration = "AUTO_MODERATION",
  /**
   * Guild has access to set a guild banner image
   */
  Banner = "BANNER",
  /**
   * Guild can enable welcome screen, Membership Screening and discovery, and receives community updates
   */
  Community = "COMMUNITY",
  /**
   * Guild has enabled monetization
   */
  CreatorMonetizableProvisional = "CREATOR_MONETIZABLE_PROVISIONAL",
  /**
   * Guild has enabled the role subscription promo page
   */
  CreatorStorePage = "CREATOR_STORE_PAGE",
  /**
   * Guild has been set as a support server on the App Directory
   */
  DeveloperSupportServer = "DEVELOPER_SUPPORT_SERVER",
  /**
   * Guild is able to be discovered in the directory
   */
  Discoverable = "DISCOVERABLE",
  /**
   * Guild is able to be featured in the directory
   */
  Featurable = "FEATURABLE",
  /**
   * Guild is listed in a directory channel
   */
  HasDirectoryEntry = "HAS_DIRECTORY_ENTRY",
  /**
   * Guild is a Student Hub
   *
   * @see {@link https://support.discord.com/hc/articles/4406046651927}
   * @unstable This feature is currently not documented by Discord, but has known value
   */
  Hub = "HUB",
  /**
   * Guild has disabled invite usage, preventing users from joining
   */
  InvitesDisabled = "INVITES_DISABLED",
  /**
   * Guild has access to set an invite splash background
   */
  InviteSplash = "INVITE_SPLASH",
  /**
   * Guild is in a Student Hub
   *
   * @see {@link https://support.discord.com/hc/articles/4406046651927}
   * @unstable This feature is currently not documented by Discord, but has known value
   */
  LinkedToHub = "LINKED_TO_HUB",
  /**
   * Guild has enabled Membership Screening
   */
  MemberVerificationGateEnabled = "MEMBER_VERIFICATION_GATE_ENABLED",
  /**
   * Guild has increased custom soundboard sound slots
   */
  MoreSoundboard = "MORE_SOUNDBOARD",
  /**
   * Guild has enabled monetization
   *
   * @unstable This feature is no longer documented by Discord
   */
  MonetizationEnabled = "MONETIZATION_ENABLED",
  /**
   * Guild has increased custom sticker slots
   */
  MoreStickers = "MORE_STICKERS",
  /**
   * Guild has access to create news channels
   */
  News = "NEWS",
  /**
   * Guild is partnered
   */
  Partnered = "PARTNERED",
  /**
   * Guild can be previewed before joining via Membership Screening or the directory
   */
  PreviewEnabled = "PREVIEW_ENABLED",
  /**
   * Guild has access to create private threads
   */
  PrivateThreads = "PRIVATE_THREADS",
  /**
   * Guild has disabled alerts for join raids in the configured safety alerts channel
   */
  RaidAlertsDisabled = "RAID_ALERTS_DISABLED",
  RelayEnabled = "RELAY_ENABLED",
  /**
   * Guild is able to set role icons
   */
  RoleIcons = "ROLE_ICONS",
  /**
   * Guild has role subscriptions that can be purchased
   */
  RoleSubscriptionsAvailableForPurchase = "ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE",
  /**
   * Guild has enabled role subscriptions
   */
  RoleSubscriptionsEnabled = "ROLE_SUBSCRIPTIONS_ENABLED",
  /**
   * Guild has created soundboard sounds
   */
  Soundboard = "SOUNDBOARD",
  /**
   * Guild has enabled ticketed events
   */
  TicketedEventsEnabled = "TICKETED_EVENTS_ENABLED",
  /**
   * Guild has access to set a vanity URL
   */
  VanityURL = "VANITY_URL",
  /**
   * Guild is verified
   */
  Verified = "VERIFIED",
  /**
   * Guild has access to set 384kbps bitrate in voice (previously VIP voice servers)
   */
  VIPRegions = "VIP_REGIONS",
  /**
   * Guild has enabled the welcome screen
   */
  WelcomeScreenEnabled = "WELCOME_SCREEN_ENABLED",
  /**
   * Guild has access to set guild tags
   */
  GuildTags = "GUILD_TAGS",
  /**
   * Guild is able to set gradient colors to roles
   */
  EnhancedRoleColors = "ENHANCED_ROLE_COLORS",
  /**
   * Guild has access to guest invites
   */
  GuestsEnabled = "GUESTS_ENABLED",
  /**
   * Guild has migrated to the new pin messages permission
   *
   * @unstable This feature is currently not documented by Discord, but has known value
   */
  PinPermissionMigrationComplete = "PIN_PERMISSION_MIGRATION_COMPLETE"
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
 */
interface APIBaseGuildMember {
  /**
   * This users guild nickname
   */
  nick?: string | null;
  /**
   * Array of role object ids
   *
   * @see {@link https://discord.com/developers/docs/topics/permissions#role-object}
   */
  roles: Snowflake[];
  /**
   * When the user started boosting the guild
   *
   * @see {@link https://support.discord.com/hc/articles/360028038352}
   */
  premium_since?: string | null;
  /**
   * Whether the user has not yet passed the guild's Membership Screening requirements
   *
   * @remarks If this field is not present, it can be assumed as `false`.
   */
  pending?: boolean;
  /**
   * Timestamp of when the time out will be removed; until then, they cannot interact with the guild
   */
  communication_disabled_until?: string | null;
  /**
   * The data for the member's guild avatar decoration
   *
   * @see {@link https://discord.com/developers/docs/resources/user#avatar-decoration-data-object}
   */
  avatar_decoration_data?: APIAvatarDecorationData | null;
  /**
   * The data for the member's collectibles
   *
   * @see {@link https://discord.com/developers/docs/resources/user#collectibles}
   */
  collectibles?: APICollectibles | null;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
 */
interface APIFlaggedGuildMember {
  /**
   * Guild member flags represented as a bit set
   *
   * @defaultValue `0`
   */
  flags: GuildMemberFlags;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
 */
interface APIGuildMemberJoined {
  /**
   * When the user joined the guild
   */
  joined_at: string | null;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
 */
interface APIGuildMemberAvatar {
  /**
   * The member's guild avatar hash
   */
  avatar?: string | null;
  /**
   * The member's guild banner hash
   */
  banner?: string | null;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
 */
interface APIBaseVoiceGuildMember {
  /**
   * Whether the user is deafened in voice channels
   */
  deaf: boolean;
  /**
   * Whether the user is muted in voice channels
   */
  mute: boolean;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
 */
interface APIGuildMemberUser {
  /**
   * The user this guild member represents
   *
   * **This field won't be included in the member object attached to `MESSAGE_CREATE` and `MESSAGE_UPDATE` gateway events.**
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object}
   */
  user: APIUser;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
 */
interface APIGuildMember extends APIBaseGuildMember, APIBaseVoiceGuildMember, APIFlaggedGuildMember, APIGuildMemberAvatar, APIGuildMemberJoined, APIGuildMemberUser {}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-flags}
 */
declare enum GuildMemberFlags {
  /**
   * Member has left and rejoined the guild
   */
  DidRejoin = 1,
  /**
   * Member has completed onboarding
   */
  CompletedOnboarding = 2,
  /**
   * Member is exempt from guild verification requirements
   */
  BypassesVerification = 4,
  /**
   * Member has started onboarding
   */
  StartedOnboarding = 8,
  /**
   * Member is a guest and can only access the voice channel they were invited to
   */
  IsGuest = 16,
  /**
   * Member has started Server Guide new member actions
   */
  StartedHomeActions = 32,
  /**
   * Member has completed Server Guide new member actions
   */
  CompletedHomeActions = 64,
  /**
   * Member's username, display name, or nickname is blocked by AutoMod
   */
  AutomodQuarantinedUsernameOrGuildNickname = 128,
  /**
   * @deprecated
   * {@link https://github.com/discord/discord-api-docs/pull/7113 | discord-api-docs#7113}
   */
  AutomodQuarantinedBio = 256,
  /**
   * Member has dismissed the DM settings upsell
   */
  DmSettingsUpsellAcknowledged = 512,
  /**
   * Member's guild tag is blocked by AutoMod
   */
  AutoModQuarantinedGuildTag = 1024
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#integration-object}
 */
interface APIGuildIntegration {
  /**
   * Integration id
   */
  id: Snowflake;
  /**
   * Integration name
   */
  name: string;
  /**
   * Integration type
   */
  type: APIGuildIntegrationType;
  /**
   * Is this integration enabled
   */
  enabled: boolean;
  /**
   * Is this integration syncing
   *
   * **This field is not provided for `discord` bot integrations.**
   */
  syncing?: boolean;
  /**
   * ID that this integration uses for "subscribers"
   *
   * **This field is not provided for `discord` bot integrations.**
   */
  role_id?: Snowflake;
  /**
   * Whether emoticons should be synced for this integration (`twitch` only currently)
   *
   * **This field is not provided for `discord` bot integrations.**
   */
  enable_emoticons?: boolean;
  /**
   * The behavior of expiring subscribers
   *
   * **This field is not provided for `discord` bot integrations.**
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#integration-object-integration-expire-behaviors}
   */
  expire_behavior?: IntegrationExpireBehavior;
  /**
   * The grace period (in days) before expiring subscribers
   *
   * **This field is not provided for `discord` bot integrations.**
   */
  expire_grace_period?: number;
  /**
   * User for this integration
   *
   * **Some older integrations may not have an attached user.**
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object}
   */
  user?: APIUser;
  /**
   * Integration account information
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#integration-account-object}
   */
  account: APIIntegrationAccount;
  /**
   * When this integration was last synced
   *
   * **This field is not provided for `discord` bot integrations.**
   */
  synced_at?: string;
  /**
   * How many subscribers this integration has
   *
   * **This field is not provided for `discord` bot integrations.**
   */
  subscriber_count?: number;
  /**
   * Has this integration been revoked
   *
   * **This field is not provided for `discord` bot integrations.**
   */
  revoked?: boolean;
  /**
   * The bot/OAuth2 application for discord integrations
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#integration-application-object}
   *
   * **This field is not provided for `discord` bot integrations.**
   */
  application?: APIGuildIntegrationApplication;
  /**
   * The scopes the application has been authorized for
   */
  scopes?: OAuth2Scopes[];
}
type APIGuildIntegrationType = 'discord' | 'guild_subscription' | 'twitch' | 'youtube';
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#integration-object-integration-expire-behaviors}
 */
declare enum IntegrationExpireBehavior {
  RemoveRole = 0,
  Kick = 1
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#integration-account-object}
 */
interface APIIntegrationAccount {
  /**
   * ID of the account
   */
  id: string;
  /**
   * Name of the account
   */
  name: string;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#integration-application-object}
 */
interface APIGuildIntegrationApplication {
  /**
   * The id of the app
   */
  id: Snowflake;
  /**
   * The name of the app
   */
  name: string;
  /**
   * The icon hash of the app
   *
   * @see {@link https://discord.com/developers/docs/reference#image-formatting}
   */
  icon: string | null;
  /**
   * The description of the app
   */
  description: string;
  /**
   * The bot associated with this application
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object}
   */
  bot?: APIUser;
}
interface APIGuildWelcomeScreen {
  /**
   * The welcome screen short message
   */
  description: string | null;
  /**
   * Array of suggested channels
   */
  welcome_channels: APIGuildWelcomeScreenChannel[];
}
interface APIGuildWelcomeScreenChannel {
  /**
   * The channel id that is suggested
   */
  channel_id: Snowflake;
  /**
   * The description shown for the channel
   */
  description: string;
  /**
   * The emoji id of the emoji that is shown on the left of the channel
   */
  emoji_id: Snowflake | null;
  /**
   * The emoji name of the emoji that is shown on the left of the channel
   */
  emoji_name: string | null;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#incidents-data-object}
 */
interface APIIncidentsData {
  /**
   * When invites get enabled again
   */
  invites_disabled_until: string | null;
  /**
   * When direct messages get enabled again
   */
  dms_disabled_until: string | null;
  /**
   * When the dm spam was detected
   */
  dm_spam_detected_at?: string | null;
  /**
   * When the raid was detected
   */
  raid_detected_at?: string | null;
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/poll.d.ts
interface APIBasePoll {
  /**
   * The question of the poll
   */
  question: APIPollMedia;
}
interface APIPollDefaults {
  /**
   * Whether a user can select multiple answers
   *
   * @defaultValue `false`
   */
  allow_multiselect: boolean;
  /**
   * The layout type of the poll
   *
   * @defaultValue `PollLayoutType.Default`
   */
  layout_type: PollLayoutType;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/poll#poll-object-poll-object-structure}
 */
interface APIPoll extends APIBasePoll, APIPollDefaults {
  /**
   * Each of the answers available in the poll, up to 10
   */
  answers: APIPollAnswer[];
  /**
   * The time when the poll ends (IS08601 timestamp)
   */
  expiry: string | null;
  /**
   * The results of the poll
   */
  results?: APIPollResults;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/poll#layout-type}
 */
declare enum PollLayoutType {
  /**
   * The, uhm, default layout type
   */
  Default = 1
}
/**
 * @see {@link https://discord.com/developers/docs/resources/poll#poll-media-object-poll-media-object-structure}
 */
interface APIPollMedia {
  /**
   * The text of the field
   *
   * The maximum length is `300` for the question, and `55` for any answer
   */
  text?: string;
  /**
   * The emoji of the field
   */
  emoji?: APIPartialEmoji;
}
interface APIBasePollAnswer {
  /**
   * The data of the answer
   */
  poll_media: APIPollMedia;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/poll#poll-answer-object-poll-answer-object-structure}
 */
interface APIPollAnswer extends APIBasePollAnswer {
  /**
   * The ID of the answer. Starts at `1` for the first answer and goes up sequentially
   */
  answer_id: number;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/poll#poll-results-object-poll-results-object-structure}
 */
interface APIPollResults {
  /**
   * Whether the votes have been precisely counted
   */
  is_finalized: boolean;
  /**
   * The counts for each answer
   */
  answer_counts: APIPollAnswerCount[];
}
/**
 * @see {@link https://discord.com/developers/docs/resources/poll#poll-results-object-poll-answer-count-object-structure}
 */
interface APIPollAnswerCount {
  /**
   * The `answer_id`
   */
  id: number;
  /**
   * The number of votes for this answer
   */
  count: number;
  /**
   * Whether the current user voted for this answer
   */
  me_voted: boolean;
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/message.d.ts
interface APIMessageMentions {
  /**
   * Users specifically mentioned in the message
   *
   * The `member` field is only present in `MESSAGE_CREATE` and `MESSAGE_UPDATE` events
   * from text-based guild channels
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object}
   * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
   */
  mentions: APIUser[];
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-object-message-structure}
 */
interface APIBaseMessageNoChannel {
  /**
   * ID of the message
   */
  id: Snowflake;
  /**
   * The author of this message (only a valid user in the case where the message is generated by a user or bot user)
   *
   * If the message is generated by a webhook, the author object corresponds to the webhook's id,
   * username, and avatar. You can tell if a message is generated by a webhook by checking for the `webhook_id` property
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object}
   */
  author: APIUser;
  /**
   * Contents of the message
   *
   * The `MESSAGE_CONTENT` privileged gateway intent is required for verified applications to receive a non-empty value from this field
   *
   * In the Discord Developers Portal, you need to enable the toggle of this intent of your application in **Bot \> Privileged Gateway Intents**.
   * You also need to specify the intent bit value (`1 << 15`) if you are connecting to the gateway
   *
   * @see {@link https://support-dev.discord.com/hc/articles/6207308062871}
   */
  content: string;
  /**
   * When this message was sent
   */
  timestamp: string;
  /**
   * When this message was edited (or null if never)
   */
  edited_timestamp: string | null;
  /**
   * Whether this was a TTS message
   */
  tts: boolean;
  /**
   * Whether this message mentions everyone
   */
  mention_everyone: boolean;
  /**
   * Roles specifically mentioned in this message
   *
   * @see {@link https://discord.com/developers/docs/topics/permissions#role-object}
   */
  mention_roles: APIRole['id'][];
  /**
   * Channels specifically mentioned in this message
   *
   * Not all channel mentions in a message will appear in `mention_channels`.
   * - Only textual channels that are visible to everyone in a public guild will ever be included
   * - Only crossposted messages (via Channel Following) currently include `mention_channels` at all
   *
   * If no mentions in the message meet these requirements, this field will not be sent
   *
   * @see {@link https://discord.com/developers/docs/resources/message#channel-mention-object}
   */
  mention_channels?: APIChannelMention[];
  /**
   * Any attached files that are not referenced in embeds or components
   *
   * @see {@link https://discord.com/developers/docs/resources/message#attachment-object-attachment-structure}
   *
   * The `MESSAGE_CONTENT` privileged gateway intent is required for verified applications to receive a non-empty value from this field
   *
   * In the Discord Developers Portal, you need to enable the toggle of this intent of your application in **Bot \> Privileged Gateway Intents**.
   * You also need to specify the intent bit value (`1 << 15`) if you are connecting to the gateway
   * @see {@link https://support-dev.discord.com/hc/articles/6207308062871}
   */
  attachments: APIAttachment[];
  /**
   * Any embedded content
   *
   * @see {@link https://discord.com/developers/docs/resources/message#embed-object}
   *
   * The `MESSAGE_CONTENT` privileged gateway intent is required for verified applications to receive a non-empty value from this field
   *
   * In the Discord Developers Portal, you need to enable the toggle of this intent of your application in **Bot \> Privileged Gateway Intents**.
   * You also need to specify the intent bit value (`1 << 15`) if you are connecting to the gateway
   * @see {@link https://support-dev.discord.com/hc/articles/6207308062871}
   */
  embeds: APIEmbed[];
  /**
   * Reactions to the message
   *
   * @see {@link https://discord.com/developers/docs/resources/message#reaction-object}
   */
  reactions?: APIReaction[];
  /**
   * A nonce that can be used for optimistic message sending (up to 25 characters)
   *
   * **You will not receive this from further fetches. This is received only once from a `MESSAGE_CREATE`
   * event to ensure it got sent**
   */
  nonce?: number | string;
  /**
   * Whether this message is pinned
   */
  pinned: boolean;
  /**
   * If the message is generated by a webhook, this is the webhook's id
   */
  webhook_id?: Snowflake;
  /**
   * Type of message
   *
   * @see {@link https://discord.com/developers/docs/resources/message#message-object-message-types}
   */
  type: MessageType;
  /**
   * Sent with Rich Presence-related chat embeds
   *
   * @see {@link https://discord.com/developers/docs/resources/message#message-object-message-activity-structure}
   */
  activity?: APIMessageActivity;
  /**
   * Sent with Rich Presence-related chat embeds
   *
   * @see {@link https://docs.discord.com/developers/resources/application#application-object}
   */
  application?: Partial<APIApplication>;
  /**
   * If the message is a response to an Interaction, this is the id of the interaction's application
   */
  application_id?: Snowflake;
  /**
   * Reference data sent with crossposted messages, replies, pins, and thread starter messages
   *
   * @see {@link https://discord.com/developers/docs/resources/message#message-reference-structure}
   */
  message_reference?: APIMessageReference;
  /**
   * Message flags combined as a bitfield
   *
   * @see {@link https://discord.com/developers/docs/resources/message#message-object-message-flags}
   * @see {@link https://en.wikipedia.org/wiki/Bit_field}
   */
  flags?: MessageFlags;
  /**
   * The message associated with the `message_reference`
   *
   * This field is only returned for messages with a `type` of `19` (REPLY).
   *
   * If the message is a reply but the `referenced_message` field is not present,
   * the backend did not attempt to fetch the message that was being replied to,
   * so its state is unknown.
   *
   * If the field exists but is `null`, the referenced message was deleted
   *
   * @see {@link https://discord.com/developers/docs/resources/message#message-object}
   */
  referenced_message?: APIMessage | null;
  /**
   * Sent if the message is sent as a result of an interaction
   */
  interaction_metadata?: APIMessageInteractionMetadata;
  /**
   * Sent if the message is a response to an Interaction
   *
   * @deprecated In favor of `interaction_metadata`
   */
  interaction?: APIMessageInteraction;
  /**
   * Sent if a thread was started from this message
   */
  thread?: APIChannel;
  /**
   * Sent if the message contains components like buttons, action rows, or other interactive components
   *
   * The `MESSAGE_CONTENT` privileged gateway intent is required for verified applications to receive a non-empty value from this field
   *
   * In the Discord Developers Portal, you need to enable the toggle of this intent of your application in **Bot \> Privileged Gateway Intents**.
   * You also need to specify the intent bit value (`1 << 15`) if you are connecting to the gateway
   *
   * @see {@link https://support-dev.discord.com/hc/articles/6207308062871}
   */
  components?: APIMessageTopLevelComponent[];
  /**
   * Sent if the message contains stickers
   *
   * @see {@link https://discord.com/developers/docs/resources/sticker#sticker-item-object}
   */
  sticker_items?: APIStickerItem[];
  /**
   * The stickers sent with the message
   *
   * @see {@link https://discord.com/developers/docs/resources/sticker#sticker-object}
   * @deprecated Use {@link APIBaseMessageNoChannel.sticker_items} instead
   */
  stickers?: APISticker[];
  /**
   * A generally increasing integer (there may be gaps or duplicates) that represents the approximate position of the message in a thread
   *
   * It can be used to estimate the relative position of the message in a thread in company with `total_message_sent` on parent thread
   */
  position?: number;
  /**
   * Data of the role subscription purchase or renewal that prompted this `ROLE_SUBSCRIPTION_PURCHASE` message
   */
  role_subscription_data?: APIMessageRoleSubscriptionData;
  /**
   * Data for users, members, channels, and roles referenced in this message
   *
   * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-resolved-data-structure}
   */
  resolved?: APIInteractionDataResolved;
  /**
   * A poll!
   *
   * The `MESSAGE_CONTENT` privileged gateway intent is required for verified applications to receive a non-empty value from this field
   *
   * In the Discord Developers Portal, you need to enable the toggle of this intent of your application in **Bot \> Privileged Gateway Intents**.
   * You also need to specify the intent bit value (`1 << 15`) if you are connecting to the gateway
   *
   * @see {@link https://support-dev.discord.com/hc/articles/6207308062871}
   */
  poll?: APIPoll;
  /**
   * The message associated with the message_reference. This is a minimal subset of fields in a message (e.g. author is excluded.)
   */
  message_snapshots?: APIMessageSnapshot[];
  /**
   * The call associated with the message
   */
  call?: APIMessageCall;
  /**
   * The custom client-side theme shared via the message
   */
  shared_client_theme?: APIMessageSharedClientTheme;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-object-message-structure}
 */
interface APIBaseMessage extends APIBaseMessageNoChannel {
  /**
   * ID of the channel the message was sent in
   */
  channel_id: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-object-message-structure}
 */
interface APIMessage extends APIBaseMessage, APIMessageMentions {}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-object-message-types}
 */
declare enum MessageType {
  Default = 0,
  RecipientAdd = 1,
  RecipientRemove = 2,
  Call = 3,
  ChannelNameChange = 4,
  ChannelIconChange = 5,
  ChannelPinnedMessage = 6,
  UserJoin = 7,
  GuildBoost = 8,
  GuildBoostTier1 = 9,
  GuildBoostTier2 = 10,
  GuildBoostTier3 = 11,
  ChannelFollowAdd = 12,
  GuildDiscoveryDisqualified = 14,
  GuildDiscoveryRequalified = 15,
  GuildDiscoveryGracePeriodInitialWarning = 16,
  GuildDiscoveryGracePeriodFinalWarning = 17,
  ThreadCreated = 18,
  Reply = 19,
  ChatInputCommand = 20,
  ThreadStarterMessage = 21,
  GuildInviteReminder = 22,
  ContextMenuCommand = 23,
  AutoModerationAction = 24,
  RoleSubscriptionPurchase = 25,
  InteractionPremiumUpsell = 26,
  StageStart = 27,
  StageEnd = 28,
  StageSpeaker = 29,
  /**
   * @unstable https://github.com/discord/discord-api-docs/pull/5927#discussion_r1107678548
   */
  StageRaiseHand = 30,
  StageTopic = 31,
  GuildApplicationPremiumSubscription = 32,
  GuildIncidentAlertModeEnabled = 36,
  GuildIncidentAlertModeDisabled = 37,
  GuildIncidentReportRaid = 38,
  GuildIncidentReportFalseAlarm = 39,
  PurchaseNotification = 44,
  PollResult = 46
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-object-message-activity-structure}
 */
interface APIMessageActivity {
  /**
   * Type of message activity
   *
   * @see {@link https://discord.com/developers/docs/resources/message#message-object-message-activity-types}
   */
  type: MessageActivityType;
  /**
   * `party_id` from a Rich Presence event
   *
   * @see {@link https://discord.com/developers/docs/rich-presence/how-to#updating-presence-update-presence-payload-fields}
   */
  party_id?: string;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-reference-structure}
 */
interface APIMessageReference {
  /**
   * Type of reference
   */
  type?: MessageReferenceType;
  /**
   * ID of the originating message
   */
  message_id?: Snowflake;
  /**
   * ID of the originating message's channel
   */
  channel_id: Snowflake;
  /**
   * ID of the originating message's guild
   */
  guild_id?: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-object-message-activity-types}
 */
declare enum MessageActivityType {
  Join = 1,
  Spectate = 2,
  Listen = 3,
  JoinRequest = 5
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-reference-types}
 */
declare enum MessageReferenceType {
  /**
   * A standard reference used by replies
   */
  Default = 0,
  /**
   * Reference used to point to a message at a point in time
   */
  Forward = 1
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-object-message-flags}
 */
declare enum MessageFlags {
  /**
   * This message has been published to subscribed channels (via Channel Following)
   */
  Crossposted = 1,
  /**
   * This message originated from a message in another channel (via Channel Following)
   */
  IsCrosspost = 2,
  /**
   * Do not include any embeds when serializing this message
   */
  SuppressEmbeds = 4,
  /**
   * The source message for this crosspost has been deleted (via Channel Following)
   */
  SourceMessageDeleted = 8,
  /**
   * This message came from the urgent message system
   */
  Urgent = 16,
  /**
   * This message has an associated thread, which shares its id
   */
  HasThread = 32,
  /**
   * This message is only visible to the user who invoked the Interaction
   */
  Ephemeral = 64,
  /**
   * This message is an Interaction Response and the bot is "thinking"
   */
  Loading = 128,
  /**
   * This message failed to mention some roles and add their members to the thread
   */
  FailedToMentionSomeRolesInThread = 256,
  /**
   * @unstable This message flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   */
  ShouldShowLinkNotDiscordWarning = 1024,
  /**
   * This message will not trigger push and desktop notifications
   */
  SuppressNotifications = 4096,
  /**
   * This message is a voice message
   */
  IsVoiceMessage = 8192,
  /**
   * This message has a snapshot (via Message Forwarding)
   */
  HasSnapshot = 16384,
  /**
   * Allows you to create fully component-driven messages
   *
   * @see {@link https://discord.com/developers/docs/components/overview}
   */
  IsComponentsV2 = 32768
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-call-object-message-call-object-structure}
 */
interface APIMessageCall {
  /**
   * Array of user ids that participated in the call
   */
  participants: Snowflake[];
  /**
   * ISO8601 timestamp when the call ended
   */
  ended_timestamp?: string | null;
}
/**
 * @see https://docs.discord.com/developers/resources/message#base-theme-types
 */
declare enum BaseThemeType {
  Unset = 0,
  Dark = 1,
  Light = 2,
  Darker = 3,
  Midnight = 4
}
/**
 * @see https://docs.discord.com/developers/resources/message#shared-client-theme-object
 */
interface APIMessageSharedClientTheme {
  /**
   * The hexadecimal-encoded colors of the theme (max of 5)
   */
  colors: string[];
  /**
   * The direction of the theme's colors (max of 360)
   */
  gradient_angle: number;
  /**
   * The intensity of the theme's colors (max of 100)
   */
  base_mix: number;
  /**
   * The mode of the theme
   */
  base_theme?: BaseThemeType | null;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#role-subscription-data-object-role-subscription-data-object-structure}
 */
interface APIMessageRoleSubscriptionData {
  /**
   * The id of the SKU and listing the user is subscribed to
   */
  role_subscription_listing_id: Snowflake;
  /**
   * The name of the tier the user is subscribed to
   */
  tier_name: string;
  /**
   * The number of months the user has been subscribed for
   */
  total_months_subscribed: number;
  /**
   * Whether this notification is for a renewal
   */
  is_renewal: boolean;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#reaction-object-reaction-structure}
 */
interface APIReaction {
  /**
   * Total number of times this emoji has been used to react (including super reacts)
   */
  count: number;
  /**
   * An object detailing the individual reaction counts for different types of reactions
   */
  count_details: APIReactionCountDetails;
  /**
   * Whether the current user reacted using this emoji
   */
  me: boolean;
  /**
   * Whether the current user super-reacted using this emoji
   */
  me_burst: boolean;
  /**
   * Emoji information
   *
   * @see {@link https://discord.com/developers/docs/resources/emoji#emoji-object}
   */
  emoji: APIPartialEmoji;
  /**
   * Hexadecimal colors used for this super reaction
   */
  burst_colors: string[];
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#reaction-count-details-object-reaction-count-details-structure}
 */
interface APIReactionCountDetails {
  /**
   * Count of super reactions
   */
  burst: number;
  /**
   * Count of normal reactions
   */
  normal: number;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#embed-object-embed-structure}
 *
 * Length limit: 6000 characters
 */
interface APIEmbed {
  /**
   * Title of embed
   *
   * Length limit: 256 characters
   */
  title?: string;
  /**
   * Type of embed (always "rich" for webhook embeds)
   */
  type?: EmbedType;
  /**
   * Description of embed
   *
   * Length limit: 4096 characters
   */
  description?: string;
  /**
   * URL of embed
   */
  url?: string;
  /**
   * Timestamp of embed content
   */
  timestamp?: string;
  /**
   * Color code of the embed
   */
  color?: number;
  /**
   * Footer information
   *
   * @see {@link https://discord.com/developers/docs/resources/message#embed-object-embed-footer-structure}
   */
  footer?: APIEmbedFooter;
  /**
   * Image information
   *
   * @see {@link https://discord.com/developers/docs/resources/message#embed-object-embed-image-structure}
   */
  image?: APIEmbedImage;
  /**
   * Thumbnail information
   *
   * @see {@link https://docs.discord.com/developers/resources/message#embed-object-embed-image-structure}
   */
  thumbnail?: APIEmbedImage;
  /**
   * Video information
   *
   * @see {@link https://discord.com/developers/docs/resources/message#embed-object-embed-video-structure}
   */
  video?: APIEmbedVideo;
  /**
   * Provider information
   *
   * @see {@link https://discord.com/developers/docs/resources/message#embed-object-embed-provider-structure}
   */
  provider?: APIEmbedProvider;
  /**
   * Author information
   *
   * @see {@link https://discord.com/developers/docs/resources/message#embed-object-embed-author-structure}
   */
  author?: APIEmbedAuthor;
  /**
   * Fields information
   *
   * Length limit: 25 field objects
   *
   * @see {@link https://discord.com/developers/docs/resources/message#embed-object-embed-field-structure}
   */
  fields?: APIEmbedField[];
  /**
   * Embed flags combined as a bitfield
   *
   * @see {@link https://docs.discord.com/developers/resources/message#embed-object-embed-flags}
   * @see {@link https://en.wikipedia.org/wiki/Bit_field}
   */
  flags?: EmbedFlags;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#embed-object-embed-types}
 */
declare enum EmbedType {
  /**
   * Generic embed rendered from embed attributes
   */
  Rich = "rich",
  /**
   * Image embed
   */
  Image = "image",
  /**
   * Video embed
   */
  Video = "video",
  /**
   * Animated gif image embed rendered as a video embed
   */
  GIFV = "gifv",
  /**
   * Article embed
   */
  Article = "article",
  /**
   * Link embed
   */
  Link = "link",
  /**
   * Auto moderation alert embed
   *
   * @unstable This embed type is currently not documented by Discord, but it is returned in the auto moderation system messages.
   */
  AutoModerationMessage = "auto_moderation_message",
  /**
   * Poll result embed
   */
  PollResult = "poll_result"
}
/**
 * @see {@link https://docs.discord.com/developers/resources/message#embed-object-embed-flags}
 */
declare enum EmbedFlags {
  /**
   * This embed is a fallback for a reply to an activity card
   */
  IsContentInventoryEntry = 32
}
/**
 * @see {@link https://docs.discord.com/developers/resources/message#embed-object-embed-media-flags}
 */
declare enum EmbedMediaFlags {
  /**
   * This image is animated
   */
  IsAnimated = 32
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#embed-object-embed-video-structure}
 */
interface APIEmbedVideo {
  /**
   * Source url of video
   */
  url?: string;
  /**
   * A proxied url of the video
   */
  proxy_url?: string;
  /**
   * Height of video
   */
  height?: number;
  /**
   * Width of video
   */
  width?: number;
  /**
   * The video's media type
   *
   * @see {@link https://en.wikipedia.org/wiki/Media_type}
   */
  content_type?: string;
  /**
   * ThumbHash placeholder of the video
   *
   * @see {@link https://evanw.github.io/thumbhash/}
   */
  placeholder?: string;
  /**
   * Version of the placeholder
   */
  placeholder_version?: number;
  /**
   * Description (alt text) for the video
   */
  description?: string;
  /**
   * Embed media flags combined as a bitfield
   *
   * @see {@link https://docs.discord.com/developers/resources/message#embed-object-embed-media-flags}
   * @see {@link https://en.wikipedia.org/wiki/Bit_field}
   */
  flags?: EmbedMediaFlags;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#embed-object-embed-image-structure}
 */
interface APIEmbedImage {
  /**
   * Source url of image (only supports http(s) and attachments)
   */
  url: string;
  /**
   * A proxied url of the image
   */
  proxy_url?: string;
  /**
   * Height of image
   */
  height?: number;
  /**
   * Width of image
   */
  width?: number;
  /**
   * The image's media type
   *
   * @see {@link https://en.wikipedia.org/wiki/Media_type}
   */
  content_type?: string;
  /**
   * ThumbHash placeholder of the image
   *
   * @see {@link https://evanw.github.io/thumbhash/}
   */
  placeholder?: string;
  /**
   * Version of the placeholder
   */
  placeholder_version?: number;
  /**
   * Description (alt text) for the image
   */
  description?: string;
  /**
   * Embed media flags combined as a bitfield
   *
   * @see {@link https://docs.discord.com/developers/resources/message#embed-object-embed-media-flags}
   * @see {@link https://en.wikipedia.org/wiki/Bit_field}
   */
  flags?: EmbedMediaFlags;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#embed-object-embed-provider-structure}
 */
interface APIEmbedProvider {
  /**
   * Name of provider
   */
  name?: string;
  /**
   * URL of provider
   */
  url?: string;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#embed-object-embed-author-structure}
 */
interface APIEmbedAuthor {
  /**
   * Name of author
   *
   * Length limit: 256 characters
   */
  name: string;
  /**
   * URL of author
   */
  url?: string;
  /**
   * URL of author icon (only supports http(s) and attachments)
   */
  icon_url?: string;
  /**
   * A proxied url of author icon
   */
  proxy_icon_url?: string;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#embed-object-embed-footer-structure}
 */
interface APIEmbedFooter {
  /**
   * Footer text
   *
   * Length limit: 2048 characters
   */
  text: string;
  /**
   * URL of footer icon (only supports http(s) and attachments)
   */
  icon_url?: string;
  /**
   * A proxied url of footer icon
   */
  proxy_icon_url?: string;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#embed-object-embed-field-structure}
 */
interface APIEmbedField {
  /**
   * Name of the field
   *
   * Length limit: 256 characters
   */
  name: string;
  /**
   * Value of the field
   *
   * Length limit: 1024 characters
   */
  value: string;
  /**
   * Whether or not this field should display inline
   */
  inline?: boolean;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#attachment-object-attachment-structure}
 */
interface APIAttachment {
  /**
   * Attachment id
   */
  id: Snowflake;
  /**
   * Name of file attached
   */
  filename: string;
  /**
   * The original filename of the upload with special characters preserved
   *
   * This will be present when the filename contains special characters (e.g. Cyrillic),
   * in which case the `filename` field will be a sanitized version without those characters
   */
  title?: string;
  /**
   * Description (alt text) for the file (max 1024 characters)
   */
  description?: string;
  /**
   * The attachment's media type
   *
   * @see {@link https://en.wikipedia.org/wiki/Media_type}
   */
  content_type?: string;
  /**
   * Size of file in bytes
   */
  size: number;
  /**
   * Source url of file
   */
  url: string;
  /**
   * A proxied url of file
   */
  proxy_url: string;
  /**
   * Height of file (if image or video)
   */
  height?: number | null;
  /**
   * Width of file (if image or video)
   */
  width?: number | null;
  /**
   * ThumbHash placeholder (if image or video)
   *
   * @see {@link https://evanw.github.io/thumbhash/}
   */
  placeholder?: string;
  /**
   * Version of the placeholder (if image or video)
   */
  placeholder_version?: number;
  /**
   * Whether this attachment is ephemeral
   *
   * @remarks Ephemeral attachments will automatically be removed after a set period of time. Ephemeral attachments on messages are guaranteed to be available as long as the message itself exists.
   */
  ephemeral?: boolean;
  /**
   * The duration of the audio or video file
   */
  duration_secs?: number;
  /**
   * Base64 encoded bytearray representing a sampled waveform (currently for voice messages)
   */
  waveform?: string;
  /**
   * Attachment flags combined as a bitfield
   */
  flags?: AttachmentFlags;
  /**
   * For Clips, array of users who were in the stream
   */
  clip_participants?: APIUser[];
  /**
   * For Clips, when the clip was created
   */
  clip_created_at?: string;
  /**
   * For Clips, the application in the stream, if recognized
   */
  application?: APIApplication | null;
}
/**
 * @see {@link https://docs.discord.com/developers/resources/message#attachment-object-attachment-flags}
 */
declare enum AttachmentFlags {
  /**
   * This attachment is a Clip from a stream
   *
   * @see {@link https://support.discord.com/hc/en-us/articles/16861982215703}
   */
  IsClip = 1,
  /**
   * This attachment is the thumbnail of a thread in a media channel, displayed in the grid but not on the message
   */
  IsThumbnail = 2,
  /**
   * This attachment has been edited using the remix feature on mobile
   *
   * @deprecated
   */
  IsRemix = 4,
  /**
   * This attachment was marked as a spoiler and is blurred until clicked
   */
  IsSpoiler = 8,
  /**
   * This attachment is an animated image
   */
  IsAnimated = 32
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#channel-mention-object-channel-mention-structure}
 */
interface APIChannelMention {
  /**
   * ID of the channel
   */
  id: Snowflake;
  /**
   * ID of the guild containing the channel
   */
  guild_id: Snowflake;
  /**
   * The type of channel
   *
   * @see {@link https://discord.com/developers/docs/resources/message#channel-object-channel-types}
   */
  type: ChannelType;
  /**
   * The name of the channel
   */
  name: string;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#allowed-mentions-object-allowed-mention-types}
 */
declare enum AllowedMentionsTypes {
  /**
   * Controls `@everyone` and `@here` mentions
   */
  Everyone = "everyone",
  /**
   * Controls role mentions
   */
  Role = "roles",
  /**
   * Controls user mentions
   */
  User = "users"
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#allowed-mentions-object-allowed-mentions-structure}
 */
interface APIAllowedMentions {
  /**
   * An array of allowed mention types to parse from the content
   *
   * @see {@link https://discord.com/developers/docs/resources/message#allowed-mentions-object-allowed-mention-types}
   */
  parse?: AllowedMentionsTypes[];
  /**
   * Array of role_ids to mention (Max size of 100)
   */
  roles?: Snowflake[];
  /**
   * Array of user_ids to mention (Max size of 100)
   */
  users?: Snowflake[];
  /**
   * For replies, whether to mention the author of the message being replied to
   *
   * @defaultValue `false`
   */
  replied_user?: boolean;
}
/**
 * @see {@link https://discord.com/developers/docs/components/reference#anatomy-of-a-component}
 */
interface APIBaseComponent<T extends ComponentType> {
  /**
   * The type of the component
   */
  type: T;
  /**
   * 32 bit integer used as an optional identifier for component
   *
   * The id field is optional and is used to identify components in the response from an interaction that aren't interactive components. The id must be unique within the message and is generated sequentially if left empty. Generation of ids won't use another id that exists in the message if you have one defined for another component.
   */
  id?: number;
}
/**
 * @see {@link https://discord.com/developers/docs/components/reference#component-object-component-types}
 */
declare enum ComponentType {
  /**
   * Container to display a row of interactive components
   */
  ActionRow = 1,
  /**
   * Button component
   */
  Button = 2,
  /**
   * Select menu for picking from defined text options
   */
  StringSelect = 3,
  /**
   * Text Input component
   */
  TextInput = 4,
  /**
   * Select menu for users
   */
  UserSelect = 5,
  /**
   * Select menu for roles
   */
  RoleSelect = 6,
  /**
   * Select menu for users and roles
   */
  MentionableSelect = 7,
  /**
   * Select menu for channels
   */
  ChannelSelect = 8,
  /**
   * Container to display text alongside an accessory component
   */
  Section = 9,
  /**
   * Markdown text
   */
  TextDisplay = 10,
  /**
   * Small image that can be used as an accessory
   */
  Thumbnail = 11,
  /**
   * Display images and other media
   */
  MediaGallery = 12,
  /**
   * Displays an attached file
   */
  File = 13,
  /**
   * Component to add vertical padding between other components
   */
  Separator = 14,
  /**
   * @unstable This component type is currently not documented by Discord but has a known value which we will try to keep up to date.
   */
  ContentInventoryEntry = 16,
  /**
   * Container that visually groups a set of components
   */
  Container = 17,
  /**
   * Container associating a label and description with a component
   */
  Label = 18,
  /**
   * Component for uploading files
   */
  FileUpload = 19,
  /**
   * Single-choice set of radio group option
   */
  RadioGroup = 21,
  /**
   * Multi-select group of checkboxes
   */
  CheckboxGroup = 22,
  /**
   * Single checkbox for binary choice
   */
  Checkbox = 23,
  /**
   * Select menu for picking from defined text options
   *
   * @deprecated This is the old name for {@link ComponentType.StringSelect}
   */
  SelectMenu = 3
}
/**
 * An Action Row is a top-level layout component used in messages. Use in modals is deprecated.
 *
 * @see {@link https://discord.com/developers/docs/components/reference#action-row}
 */
interface APIActionRowComponent<T extends APIComponentInActionRow> extends APIBaseComponent<ComponentType.ActionRow> {
  /**
   * The components in the ActionRow
   */
  components: T[];
}
interface APIButtonBase<Style extends ButtonStyle> extends APIBaseComponent<ComponentType.Button> {
  /**
   * The style of the button
   */
  style: Style;
  /**
   * The status of the button
   */
  disabled?: boolean;
}
/**
 * @see {@link https://discord.com/developers/docs/components/reference#button}
 */
interface APIButtonComponentBase<Style extends ButtonStyle> extends APIButtonBase<Style> {
  /**
   * The label to be displayed on the button
   */
  label?: string;
  /**
   * The emoji to display to the left of the text
   */
  emoji?: APIMessageComponentEmoji;
}
interface APIMessageComponentEmoji {
  /**
   * Emoji id
   */
  id?: Snowflake;
  /**
   * Emoji name
   */
  name?: string;
  /**
   * Whether this emoji is animated
   */
  animated?: boolean;
}
/**
 * @see {@link https://discord.com/developers/docs/components/reference#button}
 */
interface APIButtonComponentWithCustomId extends APIButtonComponentBase<ButtonStyle.Danger | ButtonStyle.Primary | ButtonStyle.Secondary | ButtonStyle.Success> {
  /**
   * The custom_id to be sent in the interaction when clicked
   */
  custom_id: string;
}
/**
 * @see {@link https://discord.com/developers/docs/components/reference#button}
 */
interface APIButtonComponentWithURL extends APIButtonComponentBase<ButtonStyle.Link> {
  /**
   * The URL to direct users to when clicked for Link buttons
   */
  url: string;
}
/**
 * @see {@link https://discord.com/developers/docs/components/reference#button}
 */
interface APIButtonComponentWithSKUId extends APIButtonBase<ButtonStyle.Premium> {
  /**
   * The id for a purchasable SKU
   */
  sku_id: Snowflake;
}
/**
 * A Button is an interactive component that can only be used in messages. It creates clickable elements that users can interact with, sending an interaction to your app when clicked.
 *
 * Buttons must be placed inside an Action Row or a Section's accessory field.
 *
 * @see {@link https://discord.com/developers/docs/components/reference#button}
 */
type APIButtonComponent = APIButtonComponentWithCustomId | APIButtonComponentWithSKUId | APIButtonComponentWithURL;
/**
 * @see {@link https://discord.com/developers/docs/components/reference#button-button-styles}
 */
declare enum ButtonStyle {
  /**
   * The most important or recommended action in a group of options
   */
  Primary = 1,
  /**
   * Alternative or supporting actions
   */
  Secondary = 2,
  /**
   * Positive confirmation or completion actions
   */
  Success = 3,
  /**
   * An action with irreversible consequences
   */
  Danger = 4,
  /**
   * Navigates to a URL
   */
  Link = 5,
  /**
   * Purchase
   */
  Premium = 6
}
/**
 * @see {@link https://discord.com/developers/docs/components/reference#text-input-text-input-styles}
 */
declare enum TextInputStyle {
  /**
   * Single-line input
   */
  Short = 1,
  /**
   * Multi-line input
   */
  Paragraph = 2
}
/**
 * @see {@link https://discord.com/developers/docs/components/reference}
 */
interface APIBaseSelectMenuComponent<T extends ComponentType.ChannelSelect | ComponentType.MentionableSelect | ComponentType.RoleSelect | ComponentType.StringSelect | ComponentType.UserSelect> extends APIBaseComponent<T> {
  /**
   * A developer-defined identifier for the select menu, max 100 characters
   */
  custom_id: string;
  /**
   * Custom placeholder text if nothing is selected, max 150 characters
   */
  placeholder?: string;
  /**
   * The minimum number of items that must be chosen; min 0, max 25
   *
   * @defaultValue `1`
   */
  min_values?: number;
  /**
   * The maximum number of items that can be chosen; max 25
   *
   * @defaultValue `1`
   */
  max_values?: number;
  /**
   * Disable the select
   *
   * @defaultValue `false`
   */
  disabled?: boolean;
  /**
   * Whether the component is required to answer in a modal.
   *
   * @defaultValue `true`
   */
  required?: boolean;
}
/**
 * @see {@link https://discord.com/developers/docs/components/reference}
 */
interface APIBaseAutoPopulatedSelectMenuComponent<T extends ComponentType.ChannelSelect | ComponentType.MentionableSelect | ComponentType.RoleSelect | ComponentType.UserSelect, D extends SelectMenuDefaultValueType> extends APIBaseSelectMenuComponent<T> {
  /**
   * List of default values for auto-populated select menu components
   */
  default_values?: APISelectMenuDefaultValue<D>[];
}
/**
 * A String Select is an interactive component that allows users to select one or more provided options in a message.
 *
 * String Selects can be configured for both single-select and multi-select behavior. When a user finishes making their choice(s) your app receives an interaction.
 *
 * An Action Row can contain only one select menu and cannot contain buttons if it has a select menu.
 *
 * @see {@link https://discord.com/developers/docs/components/reference#string-select}
 */
interface APIStringSelectComponent extends APIBaseSelectMenuComponent<ComponentType.StringSelect> {
  /**
   * Specified choices in a select menu; max 25
   */
  options: APISelectMenuOption[];
}
/**
 * A User Select is an interactive component that allows users to select one or more users in a message. Options are automatically populated based on the server's available users.
 *
 * User Selects can be configured for both single-select and multi-select behavior. When a user finishes making their choice(s) your app receives an interaction.
 *
 * User Selects must be placed inside an Action Row and are only available in messages. An Action Row can contain only one select menu and cannot contain buttons if it has a select menu.
 *
 * @see {@link https://discord.com/developers/docs/components/reference#user-select}
 */
type APIUserSelectComponent = APIBaseAutoPopulatedSelectMenuComponent<ComponentType.UserSelect, SelectMenuDefaultValueType.User>;
/**
 * A Role Select is an interactive component that allows users to select one or more roles in a message. Options are automatically populated based on the server's available roles.
 *
 * Role Selects can be configured for both single-select and multi-select behavior. When a user finishes making their choice(s) your app receives an interaction.
 *
 * Role Selects must be placed inside an Action Row and are only available in messages. An Action Row can contain only one select menu and cannot contain buttons if it has a select menu.
 *
 * @see {@link https://discord.com/developers/docs/components/reference#role-select}
 */
type APIRoleSelectComponent = APIBaseAutoPopulatedSelectMenuComponent<ComponentType.RoleSelect, SelectMenuDefaultValueType.Role>;
/**
 * A Mentionable Select is an interactive component that allows users to select one or more mentionables in a message. Options are automatically populated based on available mentionables in the server.
 *
 * Mentionable Selects can be configured for both single-select and multi-select behavior. When a user finishes making their choice(s), your app receives an interaction.
 *
 * Mentionable Selects must be placed inside an Action Row and are only available in messages. An Action Row can contain only one select menu and cannot contain buttons if it has a select menu.
 *
 * @see {@link https://discord.com/developers/docs/components/reference#mentionable-select}
 */
type APIMentionableSelectComponent = APIBaseAutoPopulatedSelectMenuComponent<ComponentType.MentionableSelect, SelectMenuDefaultValueType.Role | SelectMenuDefaultValueType.User>;
/**
 * A Channel Select is an interactive component that allows users to select one or more channels in a message. Options are automatically populated based on available channels in the server and can be filtered by channel types.
 *
 * Channel Selects can be configured for both single-select and multi-select behavior. When a user finishes making their choice(s) your app receives an interaction.
 *
 * Channel Selects must be placed inside an Action Row and are only available in messages. An Action Row can contain only one select menu and cannot contain buttons if it has a select menu.
 *
 * @see {@link https://discord.com/developers/docs/components/reference#channel-select}
 */
interface APIChannelSelectComponent extends APIBaseAutoPopulatedSelectMenuComponent<ComponentType.ChannelSelect, SelectMenuDefaultValueType.Channel> {
  /**
   * List of channel types to include in the ChannelSelect component
   */
  channel_types?: ChannelType[];
}
/**
 * @see {@link https://discord.com/developers/docs/components/reference#user-select-select-default-value-structure}
 */
declare enum SelectMenuDefaultValueType {
  Channel = "channel",
  Role = "role",
  User = "user"
}
/**
 * @see {@link https://discord.com/developers/docs/components/reference#user-select-select-default-value-structure}
 */
interface APISelectMenuDefaultValue<T extends SelectMenuDefaultValueType> {
  type: T;
  id: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/components/reference}
 */
type APISelectMenuComponent = APIChannelSelectComponent | APIMentionableSelectComponent | APIRoleSelectComponent | APIStringSelectComponent | APIUserSelectComponent;
/**
 * @see {@link https://discord.com/developers/docs/components/reference#string-select-select-option-structure}
 */
interface APISelectMenuOption {
  /**
   * The user-facing name of the option (max 100 chars)
   */
  label: string;
  /**
   * The dev-defined value of the option (max 100 chars)
   */
  value: string;
  /**
   * An additional description of the option (max 100 chars)
   */
  description?: string;
  /**
   * The emoji to display to the left of the option
   */
  emoji?: APIMessageComponentEmoji;
  /**
   * Whether this option should be already-selected by default
   */
  default?: boolean;
}
/**
 * Text input is an interactive component that allows users to enter free-form text responses in modals. It supports both short, single-line inputs and longer, multi-line paragraph inputs.
 *
 * Text inputs can only be used within modals.
 *
 * When defining a text input component, you can set attributes to customize the behavior and appearance of it. However, not all attributes will be returned in the text input interaction payload.
 *
 * @see {@link https://discord.com/developers/docs/components/reference#text-input}
 */
interface APITextInputComponent extends APIBaseComponent<ComponentType.TextInput> {
  /**
   * One of text input styles
   */
  style: TextInputStyle;
  /**
   * The custom id for the text input
   */
  custom_id: string;
  /**
   * Text that appears on top of the text input field, max 45 characters.
   *
   * @remarks Cannot be used in a label component.
   */
  label?: string;
  /**
   * Placeholder for the text input
   */
  placeholder?: string;
  /**
   * The pre-filled text in the text input
   */
  value?: string;
  /**
   * Minimal length of text input
   */
  min_length?: number;
  /**
   * Maximal length of text input
   */
  max_length?: number;
  /**
   * Whether this text input is required
   */
  required?: boolean;
}
/**
 * @unstable This enum is currently not documented by Discord
 */
declare enum UnfurledMediaItemLoadingState {
  Unknown = 0,
  Loading = 1,
  LoadedSuccess = 2,
  LoadedNotFound = 3
}
/**
 * @see {@link https://discord.com/developers/docs/components/reference#unfurled-media-item-structure}
 */
interface APIUnfurledMediaItem {
  /**
   * Supports arbitrary urls and `attachment://<filename>` references
   */
  url: string;
  /**
   * The proxied url of the media item
   *
   * @remarks This field is ignored and provided by the API as part of the response.
   */
  proxy_url?: string;
  /**
   * The width of the media item (if image or video)
   *
   * @remarks This field is ignored and provided by the API as part of the response.
   */
  width?: number | null;
  /**
   * The height of the media item (if image or video)
   *
   * @remarks This field is ignored and provided by the API as part of the response.
   */
  height?: number | null;
  /**
   * ThumbHash placeholder (if image or video)
   *
   * @remarks This field is ignored and provided by the API as part of the response.
   * @see {@link https://evanw.github.io/thumbhash/}
   */
  placeholder?: string | null;
  /**
   * Version of the placeholder (if image or video)
   *
   * @remarks This field is ignored and provided by the API as part of the response.
   */
  placeholder_version?: number | null;
  /**
   * The media type of the content
   *
   * @remarks This field is ignored and provided by the API as part of the response.
   * @see {@link https://en.wikipedia.org/wiki/Media_type}
   */
  content_type?: string | null;
  /**
   * @unstable This field is currently not documented by Discord
   */
  loading_state?: UnfurledMediaItemLoadingState;
  /**
   * Unfurled media item flags combined as a bitfield
   *
   * @remarks This field is ignored and provided by the API as part of the response.
   * @see {@link https://docs.discord.com/developers/components/reference#unfurled-media-item-unfurled-media-item-flags}
   * @see {@link https://en.wikipedia.org/wiki/Bit_field}
   */
  flags?: UnfurledMediaItemFlags;
  /**
   * The id of the uploaded attachment.
   *
   * @remarks This field is ignored and provided by the API as part of the response.
   * @remarks Only present if the media item was uploaded as an attachment.
   */
  attachment_id?: Snowflake;
}
/**
 * @see {@link https://docs.discord.com/developers/components/reference#unfurled-media-item-unfurled-media-item-flags}
 */
declare enum UnfurledMediaItemFlags {
  /**
   * This image is animated
   */
  IsAnimated = 1
}
/**
 * A Section is a top-level layout component that allows you to join text contextually with an accessory.
 *
 * Sections are only available in messages.
 *
 * @see {@link https://discord.com/developers/docs/components/reference#section}
 */
interface APISectionComponent extends APIBaseComponent<ComponentType.Section> {
  /**
   * One to three text components
   */
  components: APITextDisplayComponent[];
  /**
   * A thumbnail or a button component, with a future possibility of adding more compatible components
   */
  accessory: APISectionAccessoryComponent;
}
/**
 * A Text Display is a top-level content component that allows you to add text to your message formatted with markdown and mention users and roles. This is similar to the content field of a message, but allows you to add multiple text components, controlling the layout of your message.
 *
 * Text Displays are only available in messages.
 *
 * @see {@link https://discord.com/developers/docs/components/reference#text-display}
 */
interface APITextDisplayComponent extends APIBaseComponent<ComponentType.TextDisplay> {
  /**
   * Text that will be displayed similar to a message
   */
  content: string;
}
/**
 * A Thumbnail is a content component that is a small image only usable as an accessory in a section. The preview comes from an url or attachment through the unfurled media item structure.
 *
 * Thumbnails are only available in messages as an accessory in a section.
 *
 * @see {@link https://discord.com/developers/docs/components/reference#thumbnail}
 */
interface APIThumbnailComponent extends APIBaseComponent<ComponentType.Thumbnail> {
  /**
   * A url or attachment
   */
  media: APIUnfurledMediaItem;
  /**
   * Alt text for the media
   */
  description?: string | null;
  /**
   * Whether the thumbnail should be a spoiler (or blurred out)
   *
   * @defaultValue `false`
   */
  spoiler?: boolean;
}
/**
 * @see {@link https://discord.com/developers/docs/components/reference#media-gallery-media-gallery-item-structure}
 */
interface APIMediaGalleryItem {
  /**
   * A url or attachment
   */
  media: APIUnfurledMediaItem;
  /**
   * Alt text for the media
   */
  description?: string | null;
  /**
   * Whether the media should be a spoiler (or blurred out)
   *
   * @defaultValue `false`
   */
  spoiler?: boolean;
}
/**
 * A Media Gallery is a top-level content component that allows you to display 1-10 media attachments in an organized gallery format. Each item can have optional descriptions and can be marked as spoilers.
 *
 * Media Galleries are only available in messages.
 *
 * @see {@link https://discord.com/developers/docs/components/reference#media-gallery}
 */
interface APIMediaGalleryComponent extends APIBaseComponent<ComponentType.MediaGallery> {
  /**
   * 1 to 10 media gallery items
   */
  items: APIMediaGalleryItem[];
}
/**
 * A File is a top-level component that allows you to display an uploaded file as an attachment to the message and reference it in the component.
 *
 * Each file component can only display 1 attached file, but you can upload multiple files and add them to different file components within your payload.
 *
 * Files are only available in messages.
 *
 * @see {@link https://discord.com/developers/docs/components/reference#file}
 */
interface APIFileComponent extends APIBaseComponent<ComponentType.File> {
  /**
   * This unfurled media item is unique in that it **only** support attachment references using the `attachment://<filename>` syntax
   */
  file: APIUnfurledMediaItem;
  /**
   * Whether the media should be a spoiler (or blurred out)
   *
   * @defaultValue `false`
   */
  spoiler?: boolean;
  /**
   * The name of the file. This field is ignored and provided by the API as part of the response
   */
  name?: string;
  /**
   * The size of the file in bytes. This field is ignored and provided by the API as part of the response
   */
  size?: number;
}
/**
 * @see {@link https://discord.com/developers/docs/components/reference#separator}
 */
declare enum SeparatorSpacingSize {
  Small = 1,
  Large = 2
}
/**
 * A Separator is a top-level layout component that adds vertical padding and visual division between other components.
 *
 * Separators are only available in messages.
 *
 * @see {@link https://discord.com/developers/docs/components/reference#separator}
 */
interface APISeparatorComponent extends APIBaseComponent<ComponentType.Separator> {
  /**
   * Whether a visual divider should be displayed in the component
   *
   * @defaultValue `true`
   */
  divider?: boolean;
  /**
   * Size of separator padding
   *
   * @defaultValue `SeparatorSpacingSize.Small`
   */
  spacing?: SeparatorSpacingSize;
}
/**
 * A Container is a top-level layout component that holds up to 10 components. Containers are visually distinct from surrounding components and has an optional customizable color bar.
 *
 * Containers are only available in messages.
 *
 * @see {@link https://discord.com/developers/docs/components/reference#container}
 */
interface APIContainerComponent extends APIBaseComponent<ComponentType.Container> {
  /**
   * Color for the accent on the container as RGB from `0x000000` to `0xFFFFFF`
   */
  accent_color?: number | null;
  /**
   * Whether the container should be a spoiler (or blurred out)
   *
   * @defaultValue `false`
   */
  spoiler?: boolean;
  /**
   * Up to 10 components of the type action row, text display, section, media gallery, separator, or file
   */
  components: APIComponentInContainer[];
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-snapshot-object}
 */
interface APIMessageSnapshot {
  /**
   * Subset of the message object fields
   */
  message: APIMessageSnapshotFields;
  /**
   * Id of the origin message's guild
   *
   * @deprecated This field doesn't accurately reflect the Discord API as it doesn't exist nor is documented and will
   * be removed in the next major version.
   *
   * It was added in {@link https://github.com/discord/discord-api-docs/pull/6833/commits/d18f72d06d62e6b1d51ca2c1ef308ddc29ff3348 | d18f72d}
   * but was later removed before the PR ({@link https://github.com/discord/discord-api-docs/pull/6833 | discord-api-docs#6833}) was merged.
   * @see {@link https://github.com/discordjs/discord-api-types/pull/1084 | discord-api-types#1084} for more information.
   */
  guild_id?: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/components/reference}
 */
type APIMessageTopLevelComponent = APIActionRowComponent<APIComponentInMessageActionRow> | APIContainerComponent | APIFileComponent | APIMediaGalleryComponent | APISectionComponent | APISeparatorComponent | APITextDisplayComponent;
/**
 * @see {@link https://discord.com/developers/docs/components/reference#action-row}
 */
type APIComponentInActionRow = APIComponentInMessageActionRow | APIComponentInModalActionRow;
/**
 * @see {@link https://discord.com/developers/docs/components/reference#action-row}
 */
type APIComponentInMessageActionRow = APIButtonComponent | APISelectMenuComponent;
/**
 * @see {@link https://discord.com/developers/docs/components/reference#action-row}
 * @deprecated
 */
type APIComponentInModalActionRow = APITextInputComponent;
/**
 * @see {@link https://discord.com/developers/docs/components/reference#section}
 */
type APISectionAccessoryComponent = APIButtonComponent | APIThumbnailComponent;
/**
 * @see {@link https://discord.com/developers/docs/components/reference#container}
 */
type APIComponentInContainer = APIActionRowComponent<APIComponentInMessageActionRow> | APIFileComponent | APIMediaGalleryComponent | APISectionComponent | APISeparatorComponent | APITextDisplayComponent;
/**
 * https://discord.com/developers/docs/resources/message#message-snapshot-object
 */
type APIMessageSnapshotFields = Pick<APIMessage, 'attachments' | 'components' | 'content' | 'edited_timestamp' | 'embeds' | 'flags' | 'mention_roles' | 'mentions' | 'sticker_items' | 'stickers' | 'timestamp' | 'type'>;
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/monetization.d.ts
/**
 * @see {@link https://discord.com/developers/docs/monetization/entitlements#entitlement-object-entitlement-structure}
 */
interface APIEntitlement {
  /**
   * ID of the entitlement
   */
  id: Snowflake;
  /**
   * ID of the SKU
   */
  sku_id: Snowflake;
  /**
   * ID of the user that is granted access to the entitlement's sku
   */
  user_id?: Snowflake;
  /**
   * ID of the guild that is granted access to the entitlement's sku
   */
  guild_id?: Snowflake;
  /**
   * ID of the parent application
   */
  application_id: Snowflake;
  /**
   * Type of entitlement
   */
  type: EntitlementType;
  /**
   * Whether the entitlement was deleted
   */
  deleted: boolean;
  /**
   * Start date at which the entitlement is valid.
   */
  starts_at: string | null;
  /**
   * Date at which the entitlement is no longer valid.
   */
  ends_at: string | null;
  /**
   * For consumable items, whether or not the entitlement has been consumed
   */
  consumed?: boolean;
}
/**
 * @see {@link https://discord.com/developers/docs/monetization/entitlements#entitlement-object-entitlement-types}
 */
declare enum EntitlementType {
  /**
   * Entitlement was purchased by user
   */
  Purchase = 1,
  /**
   * Entitlement for Discord Nitro subscription
   */
  PremiumSubscription = 2,
  /**
   * Entitlement was gifted by developer
   */
  DeveloperGift = 3,
  /**
   * Entitlement was purchased by a dev in application test mode
   */
  TestModePurchase = 4,
  /**
   * Entitlement was granted when the SKU was free
   */
  FreePurchase = 5,
  /**
   * Entitlement was gifted by another user
   */
  UserGift = 6,
  /**
   * Entitlement was claimed by user for free as a Nitro Subscriber
   */
  PremiumPurchase = 7,
  /**
   * Entitlement was purchased as an app subscription
   */
  ApplicationSubscription = 8
}
/**
 * @see {@link https://discord.com/developers/docs/resources/subscription#subscription-object}
 */
interface APISubscription {
  /**
   * ID of the subscription
   */
  id: Snowflake;
  /**
   * ID of the user who is subscribed
   */
  user_id: Snowflake;
  /**
   * List of SKUs subscribed to
   */
  sku_ids: Snowflake[];
  /**
   * List of entitlements granted for this subscription
   */
  entitlement_ids: Snowflake[];
  /**
   * List of SKUs that this user will be subscribed to at renewal
   */
  renewal_sku_ids: Snowflake[] | null;
  /**
   * Start of the current subscription period
   */
  current_period_start: string;
  /**
   * End of the current subscription period
   */
  current_period_end: string;
  /**
   * Current status of the subscription
   */
  status: SubscriptionStatus;
  /**
   * When the subscription was canceled
   */
  canceled_at: string | null;
  /**
   * ISO3166-1 alpha-2 country code of the payment source used to purchase the subscription. Missing unless queried with a private OAuth scope.
   */
  country?: string;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/subscription#subscription-statuses}
 */
declare enum SubscriptionStatus {
  /**
   * Subscription is active and scheduled to renew.
   */
  Active = 0,
  /**
   * Subscription is inactive and not being charged.
   */
  Inactive = 1,
  /**
   * Subscription is active but will not renew.
   */
  Ending = 2
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/responses.d.ts
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type}
 */
declare enum InteractionType {
  Ping = 1,
  ApplicationCommand = 2,
  MessageComponent = 3,
  ApplicationCommandAutocomplete = 4,
  ModalSubmit = 5
}
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type}
 */
declare enum InteractionResponseType {
  /**
   * ACK a `Ping`
   */
  Pong = 1,
  /**
   * Respond to an interaction with a message
   */
  ChannelMessageWithSource = 4,
  /**
   * ACK an interaction and edit to a response later, the user sees a loading state
   */
  DeferredChannelMessageWithSource = 5,
  /**
   * ACK a button interaction and update it to a loading state
   */
  DeferredMessageUpdate = 6,
  /**
   * ACK a button interaction and edit the message to which the button was attached
   */
  UpdateMessage = 7,
  /**
   * For autocomplete interactions
   */
  ApplicationCommandAutocompleteResult = 8,
  /**
   * Respond to an interaction with an modal for a user to fill-out
   */
  Modal = 9,
  /**
   * Respond to an interaction with an upgrade button, only available for apps with monetization enabled
   *
   * @deprecated Send a button with Premium type instead.
   * {@link https://discord.com/developers/docs/change-log#premium-apps-new-premium-button-style-deep-linking-url-schemes | Learn more here}
   */
  PremiumRequired = 10,
  /**
   * Launch the Activity associated with the app.
   *
   * @remarks
   * Only available for apps with Activities enabled
   */
  LaunchActivity = 12
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/base.d.ts
/**
 * @see {@link https://discord.com/developers/docs/resources/channel#message-interaction-metadata-object}
 */
type APIMessageInteractionMetadata = APIApplicationCommandInteractionMetadata | APIMessageComponentInteractionMetadata | APIModalSubmitInteractionMetadata;
interface APIBaseInteractionMetadata<Type extends InteractionType> {
  /**
   * ID of the interaction
   */
  id: Snowflake;
  /**
   * Type of interaction
   */
  type: Type;
  /**
   * User who triggered the interaction
   */
  user: APIUser;
  /**
   * IDs for installation context(s) related to an interaction
   */
  authorizing_integration_owners: APIAuthorizingIntegrationOwnersMap;
  /**
   * ID of the original response message, present only on follow-up messages
   */
  original_response_message_id?: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-interaction-metadata-object-application-command-interaction-metadata-structure}
 */
interface APIApplicationCommandInteractionMetadata extends APIBaseInteractionMetadata<InteractionType.ApplicationCommand> {
  /**
   * The user the command was run on, present only on user commands interactions
   */
  target_user?: APIUser;
  /**
   * The ID of the message the command was run on, present only on message command interactions.
   * The original response message will also have `message_reference` and `referenced_message` pointing to this message.
   */
  target_message_id?: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-interaction-metadata-object-message-command-interaction-metadata-structure}
 */
interface APIMessageComponentInteractionMetadata extends APIBaseInteractionMetadata<InteractionType.MessageComponent> {
  /**
   * ID of the message that contained the interactive component
   */
  interacted_message_id: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/message#message-interaction-metadata-object-modal-submit-interaction-metadata-structure}
 */
interface APIModalSubmitInteractionMetadata extends APIBaseInteractionMetadata<InteractionType.ModalSubmit> {
  /**
   * Metadata for the interaction that was used to open the modal
   */
  triggering_interaction_metadata: APIApplicationCommandInteractionMetadata | APIMessageComponentInteractionMetadata;
}
type PartialAPIMessageInteractionGuildMember = Pick<APIGuildMember, 'avatar' | 'communication_disabled_until' | 'deaf' | 'joined_at' | 'mute' | 'nick' | 'pending' | 'premium_since' | 'roles'>;
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#message-interaction-object}
 */
interface APIMessageInteraction {
  /**
   * ID of the interaction
   */
  id: Snowflake;
  /**
   * The type of interaction
   */
  type: InteractionType;
  /**
   * The name of the application command, including subcommands and subcommand groups
   */
  name: string;
  /**
   * The user who invoked the interaction
   */
  user: APIUser;
  /**
   * The guild member who invoked the interaction, only sent in MESSAGE_CREATE events
   */
  member?: PartialAPIMessageInteractionGuildMember;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
 */
interface APIInteractionGuildMember extends APIGuildMember {
  permissions: Permissions;
  user: APIUser;
}
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object}
 */
interface APIBaseInteraction<Type extends InteractionType, Data> {
  /**
   * ID of the interaction
   */
  id: Snowflake;
  /**
   * ID of the application this interaction is for
   */
  application_id: Snowflake;
  /**
   * The type of interaction
   */
  type: Type;
  /**
   * The command data payload
   */
  data?: Data;
  /**
   * Guild that the interaction was sent from
   */
  guild?: APIPartialInteractionGuild;
  /**
   * Guild that the interaction was sent from
   */
  guild_id?: Snowflake;
  /**
   * The channel it was sent from
   */
  channel?: Partial<APIChannel> & Pick<APIChannel, 'id' | 'type'>;
  /**
   * The id of the channel it was sent from
   *
   * @deprecated Use {@link APIBaseInteraction.channel} instead
   */
  channel_id?: Snowflake;
  /**
   * Guild member data for the invoking user, including permissions
   *
   * **This is only sent when an interaction is invoked in a guild**
   */
  member?: APIInteractionGuildMember;
  /**
   * User object for the invoking user, if invoked in a DM
   */
  user?: APIUser;
  /**
   * A continuation token for responding to the interaction
   */
  token: string;
  /**
   * Read-only property, always `1`
   */
  version: 1;
  /**
   * For components, the message they were attached to
   */
  message?: APIMessage;
  /**
   * Bitwise set of permissions the app or bot has within the channel the interaction was sent from
   */
  app_permissions: Permissions;
  /**
   * The selected language of the invoking user
   */
  locale: Locale;
  /**
   * The guild's preferred locale, if invoked in a guild
   */
  guild_locale?: Locale;
  /**
   * For monetized apps, any entitlements for the invoking user, representing access to premium SKUs
   */
  entitlements: APIEntitlement[];
  /**
   * Mapping of installation contexts that the interaction was authorized for to related user or guild IDs.
   */
  authorizing_integration_owners: APIAuthorizingIntegrationOwnersMap;
  /**
   * Context where the interaction was triggered from
   */
  context?: InteractionContextType;
  /**
   * Attachment size limit in bytes
   */
  attachment_size_limit: number;
}
type APIAuthorizingIntegrationOwnersMap = { [key in ApplicationIntegrationType]?: Snowflake };
interface APIInteractionDataResolvedChannelBase<T extends ChannelType> extends Required<APIPartialChannel> {
  type: T;
  permissions: Permissions;
  app_permissions?: Permissions;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object}
 */
type APIInteractionDataResolvedChannel = APIInteractionDataResolvedChannelBase<Exclude<ChannelType, ThreadChannelType>> | (APIInteractionDataResolvedChannelBase<ThreadChannelType> & Pick<APIThreadChannel, 'parent_id' | 'thread_metadata'>);
/**
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
 */
interface APIInteractionDataResolvedGuildMember extends APIBaseGuildMember, APIFlaggedGuildMember, APIGuildMemberAvatar, APIGuildMemberJoined {
  permissions: Permissions;
}
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-resolved-data-structure}
 */
interface APIInteractionDataResolved {
  users?: Record<Snowflake, APIUser>;
  roles?: Record<Snowflake, APIRole>;
  members?: Record<Snowflake, APIInteractionDataResolvedGuildMember>;
  channels?: Record<Snowflake, APIInteractionDataResolvedChannel>;
  attachments?: Record<Snowflake, APIAttachment>;
}
/**
 * `users` and optional `members` from APIInteractionDataResolved, for user commands and user selects
 */
type APIUserInteractionDataResolved = Pick<APIInteractionDataResolved, 'members'> & Required<Pick<APIInteractionDataResolved, 'users'>>;
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/shared.d.ts
/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type}
 */
declare enum ApplicationCommandOptionType {
  Subcommand = 1,
  SubcommandGroup = 2,
  String = 3,
  Integer = 4,
  Boolean = 5,
  User = 6,
  Channel = 7,
  Role = 8,
  Mentionable = 9,
  Number = 10,
  Attachment = 11
}
/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-choice-structure}
 */
interface APIApplicationCommandOptionChoice<ValueType = number | string> {
  name: string;
  name_localizations?: LocalizationMap | null;
  value: ValueType;
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/base.d.ts
interface APIApplicationCommandOptionBase<Type extends ApplicationCommandOptionType> {
  type: Type;
  name: string;
  name_localizations?: LocalizationMap | null;
  description: string;
  description_localizations?: LocalizationMap | null;
  required?: boolean;
}
interface APIInteractionDataOptionBase<T extends ApplicationCommandOptionType, D> {
  name: string;
  type: T;
  value: D;
}
type APIApplicationCommandOptionWithAutocompleteOrChoicesWrapper<Base extends APIApplicationCommandOptionBase<ApplicationCommandOptionType>, ChoiceType extends APIApplicationCommandOptionChoice> = (Base & {
  autocomplete: true;
  choices?: [];
}) | (Base & {
  autocomplete?: false;
  choices?: ChoiceType[];
});
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/attachment.d.ts
type FileUploadType = 'audio' | 'image' | 'video' | `.${string}`;
interface APIApplicationCommandAttachmentOption extends APIApplicationCommandOptionBase<ApplicationCommandOptionType.Attachment> {
  file_types?: FileUploadType[];
}
type APIApplicationCommandInteractionDataAttachmentOption = APIInteractionDataOptionBase<ApplicationCommandOptionType.Attachment, Snowflake>;
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/boolean.d.ts
type APIApplicationCommandBooleanOption = APIApplicationCommandOptionBase<ApplicationCommandOptionType.Boolean>;
type APIApplicationCommandInteractionDataBooleanOption = APIInteractionDataOptionBase<ApplicationCommandOptionType.Boolean, boolean>;
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/channel.d.ts
interface APIApplicationCommandChannelOption extends APIApplicationCommandOptionBase<ApplicationCommandOptionType.Channel> {
  channel_types?: ApplicationCommandOptionAllowedChannelType[];
}
type APIApplicationCommandInteractionDataChannelOption = APIInteractionDataOptionBase<ApplicationCommandOptionType.Channel, Snowflake>;
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/integer.d.ts
interface APIApplicationCommandIntegerOptionBase extends APIApplicationCommandOptionBase<ApplicationCommandOptionType.Integer> {
  /**
   * If the option is an `INTEGER` or `NUMBER` type, the minimum value permitted.
   */
  min_value?: number;
  /**
   * If the option is an `INTEGER` or `NUMBER` type, the maximum value permitted.
   */
  max_value?: number;
}
type APIApplicationCommandIntegerOption = APIApplicationCommandOptionWithAutocompleteOrChoicesWrapper<APIApplicationCommandIntegerOptionBase, APIApplicationCommandOptionChoice<number>>;
interface APIApplicationCommandInteractionDataIntegerOption<Type extends InteractionType = InteractionType> extends APIInteractionDataOptionBase<ApplicationCommandOptionType.Integer, Type extends InteractionType.ApplicationCommandAutocomplete ? string : number> {
  focused?: boolean;
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/mentionable.d.ts
type APIApplicationCommandMentionableOption = APIApplicationCommandOptionBase<ApplicationCommandOptionType.Mentionable>;
type APIApplicationCommandInteractionDataMentionableOption = APIInteractionDataOptionBase<ApplicationCommandOptionType.Mentionable, Snowflake>;
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/number.d.ts
interface APIApplicationCommandNumberOptionBase extends APIApplicationCommandOptionBase<ApplicationCommandOptionType.Number> {
  /**
   * If the option is an `INTEGER` or `NUMBER` type, the minimum value permitted.
   */
  min_value?: number;
  /**
   * If the option is an `INTEGER` or `NUMBER` type, the maximum value permitted.
   */
  max_value?: number;
}
type APIApplicationCommandNumberOption = APIApplicationCommandOptionWithAutocompleteOrChoicesWrapper<APIApplicationCommandNumberOptionBase, APIApplicationCommandOptionChoice<number>>;
interface APIApplicationCommandInteractionDataNumberOption<Type extends InteractionType = InteractionType> extends APIInteractionDataOptionBase<ApplicationCommandOptionType.Number, Type extends InteractionType.ApplicationCommandAutocomplete ? string : number> {
  focused?: boolean;
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/role.d.ts
type APIApplicationCommandRoleOption = APIApplicationCommandOptionBase<ApplicationCommandOptionType.Role>;
type APIApplicationCommandInteractionDataRoleOption = APIInteractionDataOptionBase<ApplicationCommandOptionType.Role, Snowflake>;
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/string.d.ts
interface APIApplicationCommandStringOptionBase extends APIApplicationCommandOptionBase<ApplicationCommandOptionType.String> {
  /**
   * For option type `STRING`, the minimum allowed length (minimum of `0`, maximum of `6000`).
   */
  min_length?: number;
  /**
   * For option type `STRING`, the maximum allowed length (minimum of `1`, maximum of `6000`).
   */
  max_length?: number;
}
type APIApplicationCommandStringOption = APIApplicationCommandOptionWithAutocompleteOrChoicesWrapper<APIApplicationCommandStringOptionBase, APIApplicationCommandOptionChoice<string>>;
interface APIApplicationCommandInteractionDataStringOption extends APIInteractionDataOptionBase<ApplicationCommandOptionType.String, string> {
  focused?: boolean;
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/subcommand.d.ts
interface APIApplicationCommandSubcommandOption extends APIApplicationCommandOptionBase<ApplicationCommandOptionType.Subcommand> {
  options?: APIApplicationCommandBasicOption[];
}
interface APIApplicationCommandInteractionDataSubcommandOption<Type extends InteractionType = InteractionType> {
  name: string;
  type: ApplicationCommandOptionType.Subcommand;
  options?: APIApplicationCommandInteractionDataBasicOption<Type>[];
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/subcommandGroup.d.ts
interface APIApplicationCommandSubcommandGroupOption extends APIApplicationCommandOptionBase<ApplicationCommandOptionType.SubcommandGroup> {
  options?: APIApplicationCommandSubcommandOption[];
}
interface APIApplicationCommandInteractionDataSubcommandGroupOption<Type extends InteractionType = InteractionType> {
  name: string;
  type: ApplicationCommandOptionType.SubcommandGroup;
  options: APIApplicationCommandInteractionDataSubcommandOption<Type>[];
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/user.d.ts
type APIApplicationCommandUserOption = APIApplicationCommandOptionBase<ApplicationCommandOptionType.User>;
type APIApplicationCommandInteractionDataUserOption = APIInteractionDataOptionBase<ApplicationCommandOptionType.User, Snowflake>;
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/internals.d.ts
interface APIBaseApplicationCommandInteractionData<Type extends ApplicationCommandType> {
  id: Snowflake;
  type: Type;
  name: string;
  guild_id?: Snowflake;
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/chatInput.d.ts
/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure}
 */
type APIApplicationCommandBasicOption = APIApplicationCommandAttachmentOption | APIApplicationCommandBooleanOption | APIApplicationCommandChannelOption | APIApplicationCommandIntegerOption | APIApplicationCommandMentionableOption | APIApplicationCommandNumberOption | APIApplicationCommandRoleOption | APIApplicationCommandStringOption | APIApplicationCommandUserOption;
/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure}
 */
type APIApplicationCommandOption = APIApplicationCommandBasicOption | APIApplicationCommandSubcommandGroupOption | APIApplicationCommandSubcommandOption;
/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-interaction-data-option-structure}
 */
type APIApplicationCommandInteractionDataOption<Type extends InteractionType = InteractionType> = APIApplicationCommandInteractionDataBasicOption<Type> | APIApplicationCommandInteractionDataSubcommandGroupOption<Type> | APIApplicationCommandInteractionDataSubcommandOption<Type>;
type APIApplicationCommandInteractionDataBasicOption<Type extends InteractionType = InteractionType> = APIApplicationCommandInteractionDataAttachmentOption | APIApplicationCommandInteractionDataBooleanOption | APIApplicationCommandInteractionDataChannelOption | APIApplicationCommandInteractionDataIntegerOption<Type> | APIApplicationCommandInteractionDataMentionableOption | APIApplicationCommandInteractionDataNumberOption<Type> | APIApplicationCommandInteractionDataRoleOption | APIApplicationCommandInteractionDataStringOption | APIApplicationCommandInteractionDataUserOption;
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-data}
 */
interface APIChatInputApplicationCommandInteractionData extends APIBaseApplicationCommandInteractionData<ApplicationCommandType.ChatInput> {
  options?: APIApplicationCommandInteractionDataOption<InteractionType.ApplicationCommand>[];
  resolved?: APIInteractionDataResolved;
}
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-data}
 */
interface APIAutocompleteApplicationCommandInteractionData extends APIBaseApplicationCommandInteractionData<ApplicationCommandType.ChatInput> {
  options?: APIApplicationCommandInteractionDataOption<InteractionType.ApplicationCommandAutocomplete>[];
  resolved?: APIInteractionDataResolved;
}
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object}
 */
type APIChatInputApplicationCommandInteraction = APIApplicationCommandInteractionWrapper<APIChatInputApplicationCommandInteractionData>;
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/contextMenu.d.ts
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-data}
 */
interface APIUserApplicationCommandInteractionData extends APIBaseApplicationCommandInteractionData<ApplicationCommandType.User> {
  target_id: Snowflake;
  resolved: APIUserInteractionDataResolved;
}
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-data}
 */
interface APIMessageApplicationCommandInteractionData extends APIBaseApplicationCommandInteractionData<ApplicationCommandType.Message> {
  target_id: Snowflake;
  resolved: APIMessageApplicationCommandInteractionDataResolved;
}
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-resolved-data-structure}
 */
interface APIMessageApplicationCommandInteractionDataResolved {
  messages: Record<Snowflake, APIMessage>;
}
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-data}
 */
type APIContextMenuInteractionData = APIMessageApplicationCommandInteractionData | APIUserApplicationCommandInteractionData;
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object}
 */
type APIUserApplicationCommandInteraction = APIApplicationCommandInteractionWrapper<APIUserApplicationCommandInteractionData>;
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object}
 */
type APIMessageApplicationCommandInteraction = APIApplicationCommandInteractionWrapper<APIMessageApplicationCommandInteractionData>;
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object}
 */
type APIContextMenuInteraction = APIMessageApplicationCommandInteraction | APIUserApplicationCommandInteraction;
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/entryPoint.d.ts
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-data}
 */
type APIPrimaryEntryPointCommandInteractionData = APIBaseApplicationCommandInteractionData<ApplicationCommandType.PrimaryEntryPoint>;
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object}
 */
type APIPrimaryEntryPointCommandInteraction = APIApplicationCommandInteractionWrapper<APIPrimaryEntryPointCommandInteractionData>;
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/permissions.d.ts
/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-application-command-permissions-structure}
 */
interface APIApplicationCommandPermission {
  /**
   * The id of the role, user or channel. Can also be a permission constant
   */
  id: Snowflake;
  /**
   * Role, user or channel
   */
  type: ApplicationCommandPermissionType;
  /**
   * `true` to allow, `false`, to disallow
   */
  permission: boolean;
}
/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-application-command-permission-type}
 */
declare enum ApplicationCommandPermissionType {
  Role = 1,
  User = 2,
  Channel = 3
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/applicationCommands.d.ts
/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object}
 */
interface APIApplicationCommand {
  /**
   * Unique id of the command
   */
  id: Snowflake;
  /**
   * Type of the command
   */
  type: ApplicationCommandType;
  /**
   * Unique id of the parent application
   */
  application_id: Snowflake;
  /**
   * Guild id of the command, if not global
   */
  guild_id?: Snowflake;
  /**
   * 1-32 character name; `CHAT_INPUT` command names must be all lowercase matching `^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$`
   */
  name: string;
  /**
   * Localization dictionary for the name field. Values follow the same restrictions as name
   */
  name_localizations?: LocalizationMap | null;
  /**
   * The localized name
   */
  name_localized?: string;
  /**
   * 1-100 character description for `CHAT_INPUT` commands, empty string for `USER` and `MESSAGE` commands
   */
  description: string;
  /**
   * Localization dictionary for the description field. Values follow the same restrictions as description
   */
  description_localizations?: LocalizationMap | null;
  /**
   * The localized description
   */
  description_localized?: string;
  /**
   * The parameters for the `CHAT_INPUT` command, max 25
   */
  options?: APIApplicationCommandOption[];
  /**
   * Set of permissions represented as a bitset
   */
  default_member_permissions: Permissions | null;
  /**
   * Indicates whether the command is available in DMs with the app, only for globally-scoped commands. By default, commands are visible
   *
   * @deprecated Use {@link APIApplicationCommand.contexts} instead
   */
  dm_permission?: boolean;
  /**
   * Whether the command is enabled by default when the app is added to a guild
   *
   * If missing, this property should be assumed as `true`
   *
   * @deprecated Use {@link APIApplicationCommand.dm_permission} and/or {@link APIApplicationCommand.default_member_permissions} instead
   */
  default_permission?: boolean;
  /**
   * Indicates whether the command is age-restricted
   *
   * @defaultValue `false`
   */
  nsfw?: boolean;
  /**
   * Installation context(s) where the command is available, only for globally-scoped commands
   *
   * @defaultValue `[ApplicationIntegrationType.GuildInstall]`
   */
  integration_types?: ApplicationIntegrationType[];
  /**
   * Interaction context(s) where the command can be used, only for globally-scoped commands
   *
   * @defaultValue `[InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel]`
   */
  contexts?: InteractionContextType[] | null;
  /**
   * Autoincrementing version identifier updated during substantial record changes
   */
  version: Snowflake;
  /**
   * Determines whether the interaction is handled by the app's interactions handler or by Discord
   *
   * @remarks
   * This is only available for {@link ApplicationCommandType.PrimaryEntryPoint} commands
   */
  handler?: EntryPointCommandHandlerType;
}
/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types}
 */
declare enum ApplicationCommandType {
  /**
   * Slash commands; a text-based command that shows up when a user types `/`
   */
  ChatInput = 1,
  /**
   * A UI-based command that shows up when you right click or tap on a user
   */
  User = 2,
  /**
   * A UI-based command that shows up when you right click or tap on a message
   */
  Message = 3,
  /**
   * A UI-based command that represents the primary way to invoke an app's Activity
   */
  PrimaryEntryPoint = 4
}
/**
 * @see {@link https://discord.com/developers/docs/resources/application#application-object-application-integration-types}
 */
declare enum ApplicationIntegrationType {
  /**
   * App is installable to servers
   */
  GuildInstall = 0,
  /**
   * App is installable to users
   */
  UserInstall = 1
}
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-context-types}
 */
declare enum InteractionContextType {
  /**
   * Interaction can be used within servers
   */
  Guild = 0,
  /**
   * Interaction can be used within DMs with the app's bot user
   */
  BotDM = 1,
  /**
   * Interaction can be used within Group DMs and DMs other than the app's bot user
   */
  PrivateChannel = 2
}
/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object-entry-point-command-handler-types}
 */
declare enum EntryPointCommandHandlerType {
  /**
   * The app handles the interaction using an interaction token
   */
  AppHandler = 1,
  /**
   * Discord handles the interaction by launching an Activity and sending a follow-up message without coordinating with
   * the app
   */
  DiscordLaunchActivity = 2
}
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-data}
 */
type APIApplicationCommandInteractionData = APIChatInputApplicationCommandInteractionData | APIContextMenuInteractionData | APIPrimaryEntryPointCommandInteractionData;
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object}
 */
type APIApplicationCommandInteractionWrapper<Data extends APIApplicationCommandInteractionData> = APIBaseInteraction<InteractionType.ApplicationCommand, Data> & Required<Pick<APIBaseInteraction<InteractionType.ApplicationCommand, Data>, 'app_permissions' | 'channel_id' | 'channel' | 'data'>>;
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object}
 */
type APIApplicationCommandInteraction = APIChatInputApplicationCommandInteraction | APIContextMenuInteraction | APIPrimaryEntryPointCommandInteraction;
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/autocomplete.d.ts
type APIApplicationCommandAutocompleteInteraction = APIBaseInteraction<InteractionType.ApplicationCommandAutocomplete, APIAutocompleteApplicationCommandInteractionData> & Required<Pick<APIBaseInteraction<InteractionType.ApplicationCommandAutocomplete, Required<Pick<APIAutocompleteApplicationCommandInteractionData, 'options'>>>, 'data'>>;
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/messageComponents.d.ts
type APIMessageComponentInteraction = APIBaseInteraction<InteractionType.MessageComponent, APIMessageComponentInteractionData> & Required<Pick<APIBaseInteraction<InteractionType.MessageComponent, APIMessageComponentInteractionData>, 'app_permissions' | 'channel_id' | 'channel' | 'data' | 'message'>>;
type APIMessageComponentInteractionData = APIMessageButtonInteractionData | APIMessageSelectMenuInteractionData;
interface APIMessageComponentBaseInteractionData<CType extends ComponentType> {
  /**
   * The `custom_id` of the component
   */
  custom_id: string;
  /**
   * The type of the component
   */
  component_type: CType;
}
type APIMessageButtonInteractionData = APIMessageComponentBaseInteractionData<ComponentType.Button>;
interface APIMessageStringSelectInteractionData extends APIMessageComponentBaseInteractionData<ComponentType.StringSelect> {
  values: string[];
}
interface APIMessageUserSelectInteractionData extends APIMessageComponentBaseInteractionData<ComponentType.UserSelect> {
  values: Snowflake[];
  resolved: APIUserInteractionDataResolved;
}
interface APIMessageRoleSelectInteractionData extends APIMessageComponentBaseInteractionData<ComponentType.RoleSelect> {
  values: Snowflake[];
  resolved: Required<Pick<APIInteractionDataResolved, 'roles'>>;
}
interface APIMessageMentionableSelectInteractionData extends APIMessageComponentBaseInteractionData<ComponentType.MentionableSelect> {
  values: Snowflake[];
  resolved: Pick<APIInteractionDataResolved, 'members' | 'roles' | 'users'>;
}
interface APIMessageChannelSelectInteractionData extends APIMessageComponentBaseInteractionData<ComponentType.ChannelSelect> {
  values: Snowflake[];
  resolved: Required<Pick<APIInteractionDataResolved, 'channels'>>;
}
type APIMessageSelectMenuInteractionData = APIMessageChannelSelectInteractionData | APIMessageMentionableSelectInteractionData | APIMessageRoleSelectInteractionData | APIMessageStringSelectInteractionData | APIMessageUserSelectInteractionData;
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/modalSubmit.d.ts
interface APIBaseModalSubmitComponent<T extends ComponentType> extends APIBaseComponent<T> {
  custom_id: string;
}
interface APIModalSubmitTextInputComponent extends APIBaseModalSubmitComponent<ComponentType.TextInput> {
  value: string;
}
interface APIModalSubmitStringSelectComponent extends APIBaseModalSubmitComponent<ComponentType.StringSelect> {
  values: string[];
}
interface APIModalSubmitUserSelectComponent extends APIBaseModalSubmitComponent<ComponentType.UserSelect> {
  values: string[];
}
interface APIModalSubmitRoleSelectComponent extends APIBaseModalSubmitComponent<ComponentType.RoleSelect> {
  values: string[];
}
interface APIModalSubmitMentionableSelectComponent extends APIBaseModalSubmitComponent<ComponentType.MentionableSelect> {
  values: string[];
}
interface APIModalSubmitChannelSelectComponent extends APIBaseModalSubmitComponent<ComponentType.ChannelSelect> {
  values: string[];
}
interface APIModalSubmitFileUploadComponent extends APIBaseModalSubmitComponent<ComponentType.FileUpload> {
  values: string[];
}
interface APIModalSubmitRadioGroupComponent extends APIBaseModalSubmitComponent<ComponentType.RadioGroup> {
  value: string | null;
}
interface APIModalSubmitCheckboxGroupComponent extends APIBaseModalSubmitComponent<ComponentType.CheckboxGroup> {
  values: string[];
}
interface APIModalSubmitCheckboxComponent extends APIBaseModalSubmitComponent<ComponentType.Checkbox> {
  value: boolean;
}
type ModalSubmitComponent = APIModalSubmitChannelSelectComponent | APIModalSubmitCheckboxComponent | APIModalSubmitCheckboxGroupComponent | APIModalSubmitFileUploadComponent | APIModalSubmitMentionableSelectComponent | APIModalSubmitRadioGroupComponent | APIModalSubmitRoleSelectComponent | APIModalSubmitStringSelectComponent | APIModalSubmitTextInputComponent | APIModalSubmitUserSelectComponent;
interface ModalSubmitActionRowComponent extends APIBaseComponent<ComponentType.ActionRow> {
  components: APIModalSubmitTextInputComponent[];
}
interface ModalSubmitTextDisplayComponent extends APIBaseComponent<ComponentType.TextDisplay> {}
interface ModalSubmitLabelComponent extends APIBaseComponent<ComponentType.Label> {
  component: ModalSubmitComponent;
}
type APIModalSubmissionComponent = ModalSubmitActionRowComponent | ModalSubmitLabelComponent | ModalSubmitTextDisplayComponent;
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-modal-submit-data-structure}
 */
interface APIModalSubmission {
  /**
   * Data for users, members, channels, and roles in the modal's auto-populated select menus
   *
   * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-resolved-data-structure}
   */
  resolved?: APIInteractionDataResolved;
  /**
   * A developer-defined identifier for the component, max 100 characters
   */
  custom_id: string;
  /**
   * A list of child components
   */
  components: APIModalSubmissionComponent[];
}
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object}
 */
type APIModalSubmitInteraction = APIBaseInteraction<InteractionType.ModalSubmit, APIModalSubmission> & Required<Pick<APIBaseInteraction<InteractionType.ModalSubmit, APIModalSubmission>, 'data'>>;
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/_interactions/ping.d.ts
type APIPingInteraction = Omit<APIBaseInteraction<InteractionType.Ping, undefined>, 'locale'>;
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/interactions.d.ts
/**
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object}
 */
type APIInteraction = APIApplicationCommandAutocompleteInteraction | APIApplicationCommandInteraction | APIMessageComponentInteraction | APIModalSubmitInteraction | APIPingInteraction;
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/teams.d.ts
/**
 * @see {@link https://discord.com/developers/docs/topics/teams#data-models-team-object}
 */
interface APITeam {
  /**
   * A hash of the image of the team's icon
   */
  icon: string | null;
  /**
   * The unique id of the team
   */
  id: Snowflake;
  /**
   * The members of the team
   */
  members: APITeamMember[];
  /**
   * The name of the team
   */
  name: string;
  /**
   * The user id of the current team owner
   */
  owner_user_id: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/teams#data-models-team-member-object}
 */
interface APITeamMember {
  /**
   * The user's membership state on the team
   *
   * @see {@link https://discord.com/developers/docs/topics/teams#data-models-membership-state-enum}
   */
  membership_state: TeamMemberMembershipState;
  /**
   * Will always be `["*"]`
   *
   * @deprecated Use {@link APITeamMember.role} instead.
   */
  permissions: ['*'];
  /**
   * The id of the parent team of which they are a member
   */
  team_id: Snowflake;
  /**
   * The avatar, discriminator, id, and username of the user
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object}
   */
  user: APIUser;
  /**
   * The user's role in the team.
   *
   * @see {@link https://discord.com/developers/docs/topics/teams#team-member-roles}
   */
  role: TeamMemberRole;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/teams#data-models-membership-state-enum}
 */
declare enum TeamMemberMembershipState {
  Invited = 1,
  Accepted = 2
}
/**
 * @see {@link https://discord.com/developers/docs/topics/teams#team-member-roles-team-member-role-types}
 */
declare enum TeamMemberRole {
  Admin = "admin",
  Developer = "developer",
  ReadOnly = "read_only"
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/webhook.d.ts
/**
 * @see {@link https://discord.com/developers/docs/events/webhook-events#event-types}
 */
declare enum ApplicationWebhookEventType {
  /**
   * Sent when an app was authorized by a user to a server or their account
   */
  ApplicationAuthorized = "APPLICATION_AUTHORIZED",
  /**
   * Sent when an app was deauthorized by a user
   */
  ApplicationDeauthorized = "APPLICATION_DEAUTHORIZED",
  /**
   * Entitlement was created
   */
  EntitlementCreate = "ENTITLEMENT_CREATE",
  /**
   * Entitlement was updated
   */
  EntitlementUpdate = "ENTITLEMENT_UPDATE",
  /**
   * Entitlement was deleted
   */
  EntitlementDelete = "ENTITLEMENT_DELETE",
  /**
   * User was added to a Quest (currently unavailable)
   */
  QuestUserEnrollment = "QUEST_USER_ENROLLMENT"
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/application.d.ts
/**
 * @see {@link https://docs.discord.com/developers/resources/application#application-object}
 */
interface APIApplication {
  /**
   * The id of the app
   */
  id: Snowflake;
  /**
   * The name of the app
   */
  name: string;
  /**
   * The icon hash of the app
   */
  icon: string | null;
  /**
   * The description of the app
   */
  description: string;
  /**
   * An array of rpc origin urls, if rpc is enabled
   */
  rpc_origins?: string[];
  /**
   * When `false` only app owner can join the app's bot to guilds
   */
  bot_public: boolean;
  /**
   * When `true` the app's bot will only join upon completion of the full oauth2 code grant flow
   */
  bot_require_code_grant: boolean;
  /**
   * Partial user object for the bot user associated with the application
   */
  bot?: APIUser;
  /**
   * The url of the application's terms of service
   */
  terms_of_service_url?: string;
  /**
   * The url of the application's privacy policy
   */
  privacy_policy_url?: string;
  /**
   * Partial user object containing info on the owner of the application
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object}
   */
  owner?: APIUser;
  /**
   * An empty string
   *
   * @deprecated This field will be removed in v11
   * @unstable This field is no longer documented by Discord and will be removed in v11
   */
  summary: '';
  /**
   * The hexadecimal encoded key for verification in interactions and the GameSDK's GetTicket function
   *
   * @see {@link https://discord.com/developers/docs/game-sdk/applications#getticket}
   */
  verify_key: string;
  /**
   * The team this application belongs to
   *
   * @see {@link https://discord.com/developers/docs/topics/teams#data-models-team-object}
   */
  team: APITeam | null;
  /**
   * If this application is a game sold on Discord, this field will be the guild to which it has been linked
   */
  guild_id?: Snowflake;
  /**
   * A partial object of the associated guild
   */
  guild?: APIPartialGuild;
  /**
   * If this application is a game sold on Discord, this field will be the id of the "Game SKU" that is created, if exists
   */
  primary_sku_id?: Snowflake;
  /**
   * If this application is a game sold on Discord, this field will be the URL slug that links to the store page
   */
  slug?: string;
  /**
   * If this application is a game sold on Discord, this field will be the hash of the image on store embeds
   */
  cover_image?: string;
  /**
   * The application's public flags
   *
   * @see {@link https://docs.discord.com/developers/resources/application#application-object-application-flags}
   */
  flags: ApplicationFlags;
  /**
   * The application's public flags
   *
   * @see {@link https://docs.discord.com/developers/resources/application#application-object-application-flags}
   */
  flags_new: string;
  /**
   * Approximate count of guilds the application has been added to
   */
  approximate_guild_count?: number;
  /**
   * Approximate count of users that have installed the app (authorized with `application.commands` as a scope)
   */
  approximate_user_install_count?: number;
  /**
   * Approximate count of users that have OAuth2 authorizations for the app
   */
  approximate_user_authorization_count?: number;
  /**
   * Array of redirect URIs for the application
   */
  redirect_uris?: string[];
  /**
   * The interactions endpoint URL for the application
   */
  interactions_endpoint_url?: string | null;
  /**
   * The application's role connection verification entry point,
   * which when configured will render the app as a verification method in the guild role verification configuration
   */
  role_connections_verification_url?: string | null;
  /**
   * Up to 5 tags of max 20 characters each describing the content and functionality of the application
   */
  tags?: [string, string?, string?, string?, string?];
  /**
   * Settings for the application's default in-app authorization link, if enabled
   */
  install_params?: APIApplicationInstallParams;
  /**
   * Default scopes and permissions for each supported installation context. Value for each key is an integration type configuration object
   */
  integration_types_config?: APIApplicationIntegrationTypesConfigMap;
  /**
   * The application's default custom authorization link, if enabled
   */
  custom_install_url?: string;
  /**
   * Event webhook URL for the app to receive webhook events
   */
  event_webhooks_url?: string | null;
  /**
   * If webhook events are enabled for the app
   */
  event_webhooks_status?: ApplicationWebhookEventStatus;
  /**
   * List of webhook event types the app subscribes to
   */
  event_webhooks_types?: ApplicationWebhookEventType[];
}
interface APIApplicationInstallParams {
  scopes: OAuth2Scopes[];
  permissions: Permissions;
}
interface APIApplicationIntegrationTypeConfiguration {
  oauth2_install_params?: APIApplicationInstallParams;
}
type APIApplicationIntegrationTypesConfigMap = { [key in ApplicationIntegrationType]?: APIApplicationIntegrationTypeConfiguration };
/**
 * @see {@link https://docs.discord.com/developers/resources/application#application-object-application-flags}
 */
declare enum ApplicationFlags {
  /**
   * @unstable This application flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   */
  EmbeddedReleased = 2,
  /**
   * @unstable This application flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   */
  ManagedEmoji = 4,
  /**
   * @unstable This application flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   */
  EmbeddedIAP = 8,
  /**
   * @unstable This application flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   */
  GroupDMCreate = 16,
  /**
   * Indicates if an app uses the Auto Moderation API
   */
  ApplicationAutoModerationRuleCreateBadge = 64,
  /**
   * @unstable This application flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   */
  RPCHasConnected = 2048,
  /**
   * Intent required for bots in 100 or more servers to receive `presence_update` events
   */
  GatewayPresence = 4096,
  /**
   * Intent required for bots in under 100 servers to receive `presence_update` events, found in Bot Settings
   */
  GatewayPresenceLimited = 8192,
  /**
   * Intent required for bots in 100 or more servers to receive member-related events like `guild_member_add`.
   *
   * @see List of member-related events {@link https://discord.com/developers/docs/topics/gateway#list-of-intents | under `GUILD_MEMBERS`}
   */
  GatewayGuildMembers = 16384,
  /**
   * Intent required for bots in under 100 servers to receive member-related events like `guild_member_add`, found in Bot Settings.
   *
   * @see List of member-related events {@link https://discord.com/developers/docs/topics/gateway#list-of-intents | under `GUILD_MEMBERS`}
   */
  GatewayGuildMembersLimited = 32768,
  /**
   * Indicates unusual growth of an app that prevents verification
   */
  VerificationPendingGuildLimit = 65536,
  /**
   * Indicates if an app is embedded within the Discord client (currently unavailable publicly)
   */
  Embedded = 131072,
  /**
   * Intent required for bots in 100 or more servers to receive {@link https://support-dev.discord.com/hc/articles/6207308062871 | message content}
   */
  GatewayMessageContent = 262144,
  /**
   * Intent required for bots in under 100 servers to receive {@link https://support-dev.discord.com/hc/articles/6207308062871 | message content},
   * found in Bot Settings
   */
  GatewayMessageContentLimited = 524288,
  /**
   * @unstable This application flag is currently not documented by Discord but has a known value which we will try to keep up to date.
   */
  EmbeddedFirstParty = 1048576,
  /**
   * Indicates if an app has registered global {@link https://discord.com/developers/docs/interactions/application-commands | application commands}
   */
  ApplicationCommandBadge = 8388608
}
/**
 * @see {@link https://discord.com/developers/docs/resources/application#application-object-application-event-webhook-status}
 */
declare enum ApplicationWebhookEventStatus {
  /**
   * Webhook events are disabled by developer
   */
  Disabled = 1,
  /**
   * Webhook events are enabled by developer
   */
  Enabled = 2,
  /**
   * Webhook events are disabled by Discord, usually due to inactivity
   */
  DisabledByDiscord = 3
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/autoModeration.d.ts
/**
 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-auto-moderation-rule-structure}
 */
interface APIAutoModerationRule {
  /**
   * The id of this rule
   */
  id: Snowflake;
  /**
   * The guild which this rule belongs to
   */
  guild_id: Snowflake;
  /**
   * The rule name
   */
  name: string;
  /**
   * The user id who created this rule
   */
  creator_id: Snowflake;
  /**
   * The rule event type
   */
  event_type: AutoModerationRuleEventType;
  /**
   * The rule trigger type
   */
  trigger_type: AutoModerationRuleTriggerType;
  /**
   * The rule trigger metadata
   */
  trigger_metadata: APIAutoModerationRuleTriggerMetadata;
  /**
   * The actions which will execute when this rule is triggered
   */
  actions: APIAutoModerationAction[];
  /**
   * Whether this rule is enabled
   */
  enabled: boolean;
  /**
   * The role ids that shouldn't be affected by this rule (Maximum of 20)
   */
  exempt_roles: Snowflake[];
  /**
   * The channel ids that shouldn't be affected by this rule (Maximum of 50)
   */
  exempt_channels: Snowflake[];
}
/**
 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-types}
 */
declare enum AutoModerationRuleTriggerType {
  /**
   * Check if content contains words from a user defined list of keywords (Maximum of 6 per guild)
   */
  Keyword = 1,
  /**
   * Check if content represents generic spam (Maximum of 1 per guild)
   */
  Spam = 3,
  /**
   * Check if content contains words from internal pre-defined wordsets (Maximum of 1 per guild)
   */
  KeywordPreset = 4,
  /**
   * Check if content contains more mentions than allowed (Maximum of 1 per guild)
   */
  MentionSpam = 5,
  /**
   * Check if member profile contains words from a user defined list of keywords (Maximum of 1 per guild)
   */
  MemberProfile = 6
}
/**
 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-metadata}
 */
interface APIAutoModerationRuleTriggerMetadata {
  /**
   * Substrings which will be searched for in content (Maximum of 1000)
   *
   * A keyword can be a phrase which contains multiple words. Wildcard symbols can be used to customize how each string will be matched. Each keyword must be 60 characters or less
   *
   * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-keyword-matching-strategies | Keyword matching strategies}
   *
   * Associated trigger types: {@link AutoModerationRuleTriggerType.Keyword}, {@link AutoModerationRuleTriggerType.MemberProfile}
   */
  keyword_filter?: string[];
  /**
   * The internally pre-defined wordsets which will be searched for in content
   *
   * Associated trigger type: {@link AutoModerationRuleTriggerType.KeywordPreset}
   */
  presets?: AutoModerationRuleKeywordPresetType[];
  /**
   * Substrings which will be exempt from triggering the preset trigger type (Maximum of 1000)
   *
   * A allowed-word can be a phrase which contains multiple words. Wildcard symbols can be used to customize how each string will be matched. Each keyword must be 60 characters or less
   *
   * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-keyword-matching-strategies | Keyword matching strategies}
   *
   * Associated trigger types: {@link AutoModerationRuleTriggerType.Keyword}, {@link AutoModerationRuleTriggerType.KeywordPreset}, {@link AutoModerationRuleTriggerType.MemberProfile}
   */
  allow_list?: string[];
  /**
   * Regular expression patterns which will be matched against content (Maximum of 10)
   *
   * Only Rust flavored regex is currently supported (Maximum of 260 characters)
   *
   * Associated trigger types: {@link AutoModerationRuleTriggerType.Keyword}, {@link AutoModerationRuleTriggerType.MemberProfile}
   */
  regex_patterns?: string[];
  /**
   * Total number of mentions (role & user) allowed per message (Maximum of 50)
   *
   * Associated trigger type: {@link AutoModerationRuleTriggerType.MentionSpam}
   */
  mention_total_limit?: number;
  /**
   * Whether to automatically detect mention raids
   *
   * Associated trigger type: {@link AutoModerationRuleTriggerType.MentionSpam}
   */
  mention_raid_protection_enabled?: boolean;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-keyword-preset-types}
 */
declare enum AutoModerationRuleKeywordPresetType {
  /**
   * Words that may be considered forms of swearing or cursing
   */
  Profanity = 1,
  /**
   * Words that refer to sexually explicit behavior or activity
   */
  SexualContent = 2,
  /**
   * Personal insults or words that may be considered hate speech
   */
  Slurs = 3
}
/**
 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-event-types}
 */
declare enum AutoModerationRuleEventType {
  /**
   * When a member sends or edits a message in the guild
   */
  MessageSend = 1,
  /**
   * When a member edits their profile
   */
  MemberUpdate = 2
}
/**
 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-action-object-auto-moderation-action-structure}
 */
interface APIAutoModerationAction {
  /**
   * The action type
   */
  type: AutoModerationActionType;
  /**
   * Additional metadata needed during execution for this specific action type
   *
   * Will only be omitted if the action type is {@link AutoModerationActionType.BlockMessage}
   */
  metadata?: APIAutoModerationActionMetadata;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-action-object-action-types}
 */
declare enum AutoModerationActionType {
  /**
   * Blocks a member's message and prevents it from being posted.
   * A custom explanation can be specified and shown to members whenever their message is blocked
   */
  BlockMessage = 1,
  /**
   * Logs user content to a specified channel
   */
  SendAlertMessage = 2,
  /**
   * Timeout user for specified duration, this action type can be set if the bot has `MODERATE_MEMBERS` permission
   */
  Timeout = 3,
  /**
   * Prevents a member from using text, voice, or other interactions
   */
  BlockMemberInteraction = 4
}
/**
 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-action-object-action-metadata}
 */
interface APIAutoModerationActionMetadata {
  /**
   * Channel to which user content should be logged
   *
   * Associated action type: {@link AutoModerationActionType.SendAlertMessage}
   */
  channel_id?: Snowflake;
  /**
   * Timeout duration in seconds (Maximum of 4 weeks - 2419200 seconds)
   *
   * Only available if using {@link AutoModerationRuleTriggerType.Keyword}
   *
   * Associated action type: {@link AutoModerationActionType.Timeout}
   */
  duration_seconds?: number;
  /**
   * Additional explanation that will be shown to members whenever their message is blocked (Maximum 150 characters)
   *
   * Associated action type {@link AutoModerationActionType.BlockMessage}
   */
  custom_message?: string;
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/guildScheduledEvent.d.ts
interface APIGuildScheduledEventBase<Type extends GuildScheduledEventEntityType> {
  /**
   * The id of the guild event
   */
  id: Snowflake;
  /**
   * The guild id which the scheduled event belongs to
   */
  guild_id: Snowflake;
  /**
   * The channel id in which the scheduled event will be hosted, or `null` if entity type is `EXTERNAL`
   */
  channel_id: Snowflake | null;
  /**
   * The id of the user that created the scheduled event
   */
  creator_id?: Snowflake | null;
  /**
   * The name of the scheduled event
   */
  name: string;
  /**
   * The description of the scheduled event
   */
  description?: string | null;
  /**
   * The time the scheduled event will start
   */
  scheduled_start_time: string;
  /**
   * The time at which the guild event will end, or `null` if the event does not have a scheduled time to end
   */
  scheduled_end_time: string | null;
  /**
   * The privacy level of the scheduled event
   */
  privacy_level: GuildScheduledEventPrivacyLevel;
  /**
   * The status of the scheduled event
   */
  status: GuildScheduledEventStatus;
  /**
   * The type of hosting entity associated with the scheduled event
   */
  entity_type: Type;
  /**
   * The id of the hosting entity associated with the scheduled event
   */
  entity_id: Snowflake | null;
  /**
   * The entity metadata for the scheduled event
   */
  entity_metadata: APIGuildScheduledEventEntityMetadata | null;
  /**
   * The user that created the scheduled event
   */
  creator?: APIUser;
  /**
   * The number of users subscribed to the scheduled event
   */
  user_count?: number;
  /**
   * The cover image of the scheduled event
   */
  image?: string | null;
  /**
   * The definition for how often this event should recur
   */
  recurrence_rule: APIGuildScheduledEventRecurrenceRule | null;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-recurrence-rule-object-guild-scheduled-event-recurrence-rule-structure}
 */
interface APIGuildScheduledEventRecurrenceRule {
  /**
   * Starting time of the recurrence interval
   */
  start: string;
  /**
   * Ending time of the recurrence interval
   */
  end: string | null;
  /**
   * How often the event occurs
   */
  frequency: GuildScheduledEventRecurrenceRuleFrequency;
  /**
   * The spacing between the events, defined by `frequency`.
   * For example, `frequency` of {@link GuildScheduledEventRecurrenceRuleFrequency.Weekly} and an `interval` of `2`
   * would be "every-other week"
   */
  interval: number;
  /**
   * Set of specific days within a week for the event to recur on
   */
  by_weekday: GuildScheduledEventRecurrenceRuleWeekday[] | null;
  /**
   * List of specific days within a specific week (1-5) to recur on
   */
  by_n_weekday: APIGuildScheduledEventRecurrenceRuleNWeekday[] | null;
  /**
   * Set of specific months to recur on
   */
  by_month: GuildScheduledEventRecurrenceRuleMonth[] | null;
  /**
   * Set of specific dates within a month to recur on
   */
  by_month_day: number[] | null;
  /**
   * Set of days within a year to recur on (1-364)
   */
  by_year_day: number[] | null;
  /**
   * The total amount of times that the event is allowed to recur before stopping
   */
  count: number | null;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-recurrence-rule-object-guild-scheduled-event-recurrence-rule-frequency}
 */
declare enum GuildScheduledEventRecurrenceRuleFrequency {
  Yearly = 0,
  Monthly = 1,
  Weekly = 2,
  Daily = 3
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-recurrence-rule-object-guild-scheduled-event-recurrence-rule-weekday}
 */
declare enum GuildScheduledEventRecurrenceRuleWeekday {
  Monday = 0,
  Tuesday = 1,
  Wednesday = 2,
  Thursday = 3,
  Friday = 4,
  Saturday = 5,
  Sunday = 6
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-recurrence-rule-object-guild-scheduled-event-recurrence-rule-month}
 */
declare enum GuildScheduledEventRecurrenceRuleMonth {
  January = 1,
  February = 2,
  March = 3,
  April = 4,
  May = 5,
  June = 6,
  July = 7,
  August = 8,
  September = 9,
  October = 10,
  November = 11,
  December = 12
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-recurrence-rule-object-guild-scheduled-event-recurrence-rule-nweekday-structure}
 */
interface APIGuildScheduledEventRecurrenceRuleNWeekday {
  /**
   * The week to reoccur on.
   */
  n: 1 | 2 | 3 | 4 | 5;
  /**
   * The day within the week to reoccur on
   */
  day: GuildScheduledEventRecurrenceRuleWeekday;
}
interface APIStageInstanceGuildScheduledEvent extends APIGuildScheduledEventBase<GuildScheduledEventEntityType.StageInstance> {
  channel_id: Snowflake;
  entity_metadata: null;
}
interface APIVoiceGuildScheduledEvent extends APIGuildScheduledEventBase<GuildScheduledEventEntityType.Voice> {
  channel_id: Snowflake;
  entity_metadata: null;
}
interface APIExternalGuildScheduledEvent extends APIGuildScheduledEventBase<GuildScheduledEventEntityType.External> {
  channel_id: null;
  entity_metadata: Required<APIGuildScheduledEventEntityMetadata>;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-structure}
 */
type APIGuildScheduledEvent = APIExternalGuildScheduledEvent | APIStageInstanceGuildScheduledEvent | APIVoiceGuildScheduledEvent;
/**
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-entity-metadata}
 */
interface APIGuildScheduledEventEntityMetadata {
  /**
   * The location of the scheduled event
   */
  location?: string;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-entity-types}
 */
declare enum GuildScheduledEventEntityType {
  StageInstance = 1,
  Voice = 2,
  External = 3
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-status}
 */
declare enum GuildScheduledEventStatus {
  Scheduled = 1,
  Active = 2,
  Completed = 3,
  Canceled = 4
}
/**
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-privacy-level}
 */
declare enum GuildScheduledEventPrivacyLevel {
  /**
   * The scheduled event is only accessible to guild members
   */
  GuildOnly = 2
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/stageInstance.d.ts
/**
 * @see {@link https://discord.com/developers/docs/resources/stage-instance#stage-instance-object}
 */
interface APIStageInstance {
  /**
   * The id of the stage instance
   */
  id: Snowflake;
  /**
   * The guild id of the associated stage channel
   */
  guild_id: Snowflake;
  /**
   * The id of the associated stage channel
   */
  channel_id: Snowflake;
  /**
   * The topic of the stage instance (1-120 characters)
   */
  topic: string;
  /**
   * The privacy level of the stage instance
   *
   * @see {@link https://discord.com/developers/docs/resources/stage-instance#stage-instance-object-privacy-level}
   */
  privacy_level: StageInstancePrivacyLevel;
  /**
   * Whether or not stage discovery is disabled
   *
   * @deprecated
   * {@link https://github.com/discord/discord-api-docs/pull/4296 | discord-api-docs#4296}
   */
  discoverable_disabled: boolean;
  /**
   * The id of the scheduled event for this stage instance
   */
  guild_scheduled_event_id?: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/stage-instance#stage-instance-object-privacy-level}
 */
declare enum StageInstancePrivacyLevel {
  /**
   * The stage instance is visible publicly, such as on stage discovery
   *
   * @deprecated
   * {@link https://github.com/discord/discord-api-docs/pull/4296 | discord-api-docs#4296}
   */
  Public = 1,
  /**
   * The stage instance is visible to only guild members
   */
  GuildOnly = 2
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/auditLog.d.ts
/**
 * @see {@link https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object-audit-log-entry-structure}
 */
interface APIAuditLogEntry {
  /**
   * ID of the affected entity (webhook, user, role, etc.)
   */
  target_id: string | null;
  /**
   * Changes made to the `target_id`
   *
   * @see {@link https://discord.com/developers/docs/resources/audit-log#audit-log-change-object}
   */
  changes?: APIAuditLogChange[];
  /**
   * The user who made the changes
   *
   * This can be `null` in some cases (webhooks deleting themselves by using their own token, for example)
   */
  user_id: Snowflake | null;
  /**
   * ID of the entry
   */
  id: Snowflake;
  /**
   * Type of action that occurred
   *
   * @see {@link https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object-audit-log-events}
   */
  action_type: AuditLogEvent;
  /**
   * Additional info for certain action types
   *
   * @see {@link https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object-optional-audit-entry-info}
   */
  options?: APIAuditLogOptions;
  /**
   * The reason for the change (0-512 characters)
   */
  reason?: string;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object-audit-log-events}
 */
declare enum AuditLogEvent {
  GuildUpdate = 1,
  ChannelCreate = 10,
  ChannelUpdate = 11,
  ChannelDelete = 12,
  ChannelOverwriteCreate = 13,
  ChannelOverwriteUpdate = 14,
  ChannelOverwriteDelete = 15,
  MemberKick = 20,
  MemberPrune = 21,
  MemberBanAdd = 22,
  MemberBanRemove = 23,
  MemberUpdate = 24,
  MemberRoleUpdate = 25,
  MemberMove = 26,
  MemberDisconnect = 27,
  BotAdd = 28,
  RoleCreate = 30,
  RoleUpdate = 31,
  RoleDelete = 32,
  InviteCreate = 40,
  InviteUpdate = 41,
  InviteDelete = 42,
  WebhookCreate = 50,
  WebhookUpdate = 51,
  WebhookDelete = 52,
  EmojiCreate = 60,
  EmojiUpdate = 61,
  EmojiDelete = 62,
  MessageDelete = 72,
  MessageBulkDelete = 73,
  MessagePin = 74,
  MessageUnpin = 75,
  IntegrationCreate = 80,
  IntegrationUpdate = 81,
  IntegrationDelete = 82,
  StageInstanceCreate = 83,
  StageInstanceUpdate = 84,
  StageInstanceDelete = 85,
  StickerCreate = 90,
  StickerUpdate = 91,
  StickerDelete = 92,
  GuildScheduledEventCreate = 100,
  GuildScheduledEventUpdate = 101,
  GuildScheduledEventDelete = 102,
  ThreadCreate = 110,
  ThreadUpdate = 111,
  ThreadDelete = 112,
  ApplicationCommandPermissionUpdate = 121,
  SoundboardSoundCreate = 130,
  SoundboardSoundUpdate = 131,
  SoundboardSoundDelete = 132,
  AutoModerationRuleCreate = 140,
  AutoModerationRuleUpdate = 141,
  AutoModerationRuleDelete = 142,
  AutoModerationBlockMessage = 143,
  AutoModerationFlagToChannel = 144,
  AutoModerationUserCommunicationDisabled = 145,
  AutoModerationQuarantineUser = 146,
  CreatorMonetizationRequestCreated = 150,
  CreatorMonetizationTermsAccepted = 151,
  OnboardingPromptCreate = 163,
  OnboardingPromptUpdate = 164,
  OnboardingPromptDelete = 165,
  OnboardingCreate = 166,
  OnboardingUpdate = 167,
  HomeSettingsCreate = 190,
  HomeSettingsUpdate = 191,
  VoiceChannelStatusCreate = 192,
  VoiceChannelStatusDelete = 193
}
/**
 * @see {@link https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object-optional-audit-entry-info}
 */
interface APIAuditLogOptions {
  /**
   * Name of the Auto Moderation rule that was triggered
   *
   * Present from:
   * - AUTO_MODERATION_BLOCK_MESSAGE
   * - AUTO_MODERATION_FLAG_TO_CHANNEL
   * - AUTO_MODERATION_USER_COMMUNICATION_DISABLED
   * - AUTO_MODERATION_QUARANTINE_USER
   */
  auto_moderation_rule_name?: string;
  /**
   * Trigger type of the Auto Moderation rule that was triggered
   *
   * Present from:
   * - AUTO_MODERATION_BLOCK_MESSAGE
   * - AUTO_MODERATION_FLAG_TO_CHANNEL
   * - AUTO_MODERATION_USER_COMMUNICATION_DISABLED
   * - AUTO_MODERATION_QUARANTINE_USER
   */
  auto_moderation_rule_trigger_type?: AuditLogRuleTriggerType;
  /**
   * Number of days after which inactive members were kicked
   *
   * Present from:
   * - MEMBER_PRUNE
   */
  delete_member_days?: string;
  /**
   * Number of members removed by the prune
   *
   * Present from:
   * - MEMBER_PRUNE
   */
  members_removed?: string;
  /**
   * Channel in which the entities were targeted
   *
   * Present from:
   * - MEMBER_MOVE
   * - MESSAGE_PIN
   * - MESSAGE_UNPIN
   * - MESSAGE_DELETE
   * - STAGE_INSTANCE_CREATE
   * - STAGE_INSTANCE_UPDATE
   * - STAGE_INSTANCE_DELETE
   * - AUTO_MODERATION_BLOCK_MESSAGE
   * - AUTO_MODERATION_FLAG_TO_CHANNEL
   * - AUTO_MODERATION_USER_COMMUNICATION_DISABLED
   * - AUTO_MODERATION_QUARANTINE_USER
   * - VOICE_CHANNEL_STATUS_CREATE
   * - VOICE_CHANNEL_STATUS_DELETE
   */
  channel_id?: Snowflake;
  /**
   * ID of the message that was targeted
   *
   * Present from:
   * - MESSAGE_PIN
   * - MESSAGE_UNPIN
   */
  message_id?: Snowflake;
  /**
   * Number of entities that were targeted
   *
   * Present from:
   * - MESSAGE_DELETE
   * - MESSAGE_BULK_DELETE
   * - MEMBER_DISCONNECT
   * - MEMBER_MOVE
   */
  count?: string;
  /**
   * ID of the overwritten entity
   *
   * Present from:
   * - CHANNEL_OVERWRITE_CREATE
   * - CHANNEL_OVERWRITE_UPDATE
   * - CHANNEL_OVERWRITE_DELETE
   */
  id?: Snowflake;
  /**
   * Type of overwritten entity - "0" for "role" or "1" for "member"
   *
   * Present from:
   * - CHANNEL_OVERWRITE_CREATE
   * - CHANNEL_OVERWRITE_UPDATE
   * - CHANNEL_OVERWRITE_DELETE
   *
   * {@link AuditLogOptionsType}
   */
  type?: AuditLogOptionsType;
  /**
   * Name of the role
   *
   * Present from:
   * - CHANNEL_OVERWRITE_CREATE
   * - CHANNEL_OVERWRITE_UPDATE
   * - CHANNEL_OVERWRITE_DELETE
   *
   * **Present only if the {@link APIAuditLogOptions."type" | entry type} is "0"**
   */
  role_name?: string;
  /**
   * Type of integration which performed the action
   *
   * Present from:
   * - MEMBER_KICK
   * - MEMBER_ROLE_UPDATE
   */
  integration_type?: APIGuildIntegrationType;
  /**
   * ID of the app whose permissions were targeted
   *
   * Present from:
   * - APPLICATION_COMMAND_PERMISSION_UPDATE
   */
  application_id?: Snowflake;
  /**
   * The new voice channel status
   *
   * Present from:
   * - VOICE_CHANNEL_STATUS_CREATE
   */
  status?: string;
}
declare enum AuditLogOptionsType {
  Role = "0",
  Member = "1"
}
type AuditLogRuleTriggerType = `${AutoModerationRuleTriggerType}`;
/**
 * @see {@link https://discord.com/developers/docs/resources/audit-log#audit-log-change-object-audit-log-change-structure}
 */
type APIAuditLogChange = APIAuditLogChangeKey$Add | APIAuditLogChangeKey$Remove | APIAuditLogChangeKeyActions | APIAuditLogChangeKeyAFKChannelId | APIAuditLogChangeKeyAFKTimeout | APIAuditLogChangeKeyAllow | APIAuditLogChangeKeyApplicationId | APIAuditLogChangeKeyArchived | APIAuditLogChangeKeyAsset | APIAuditLogChangeKeyAutoArchiveDuration | APIAuditLogChangeKeyAvailable | APIAuditLogChangeKeyAvailableTags | APIAuditLogChangeKeyAvatarHash | APIAuditLogChangeKeyBannerHash | APIAuditLogChangeKeyBitrate | APIAuditLogChangeKeyChannelId | APIAuditLogChangeKeyCode | APIAuditLogChangeKeyColor | APIAuditLogChangeKeyCommunicationDisabledUntil | APIAuditLogChangeKeyDeaf | APIAuditLogChangeKeyDefaultAutoArchiveDuration | APIAuditLogChangeKeyDefaultMessageNotifications | APIAuditLogChangeKeyDefaultReactionEmoji | APIAuditLogChangeKeyDefaultThreadRateLimitPerUser | APIAuditLogChangeKeyDeny | APIAuditLogChangeKeyDescription | APIAuditLogChangeKeyDiscoverySplashHash | APIAuditLogChangeKeyEmojiId | APIAuditLogChangeKeyEmojiName | APIAuditLogChangeKeyEnabled | APIAuditLogChangeKeyEnableEmoticons | APIAuditLogChangeKeyEntityType | APIAuditLogChangeKeyEventType | APIAuditLogChangeKeyExemptChannels | APIAuditLogChangeKeyExemptRoles | APIAuditLogChangeKeyExpireBehavior | APIAuditLogChangeKeyExpireGracePeriod | APIAuditLogChangeKeyExplicitContentFilter | APIAuditLogChangeKeyFlags | APIAuditLogChangeKeyFormatType | APIAuditLogChangeKeyGuildId | APIAuditLogChangeKeyHoist | APIAuditLogChangeKeyIconHash | APIAuditLogChangeKeyId | APIAuditLogChangeKeyImageHash | APIAuditLogChangeKeyInviterId | APIAuditLogChangeKeyLocation | APIAuditLogChangeKeyLocked | APIAuditLogChangeKeyMaxAge | APIAuditLogChangeKeyMaxUses | APIAuditLogChangeKeyMentionable | APIAuditLogChangeKeyMFALevel | APIAuditLogChangeKeyMute | APIAuditLogChangeKeyName | APIAuditLogChangeKeyNick | APIAuditLogChangeKeyNSFW | APIAuditLogChangeKeyOwnerId | APIAuditLogChangeKeyPermissionOverwrites | APIAuditLogChangeKeyPermissions | APIAuditLogChangeKeyPosition | APIAuditLogChangeKeyPreferredLocale | APIAuditLogChangeKeyPremiumProgressBarEnabled | APIAuditLogChangeKeyPrivacyLevel | APIAuditLogChangeKeyPruneDeleteDays | APIAuditLogChangeKeyPublicUpdatesChannelId | APIAuditLogChangeKeyRateLimitPerUser | APIAuditLogChangeKeyRecurrenceRule | APIAuditLogChangeKeyRegion | APIAuditLogChangeKeyRTCRegion | APIAuditLogChangeKeyRulesChannelId | APIAuditLogChangeKeySafetyAlertsChannelId | APIAuditLogChangeKeySoundId | APIAuditLogChangeKeySplashHash | APIAuditLogChangeKeyStatus | APIAuditLogChangeKeySystemChannelFlags | APIAuditLogChangeKeySystemChannelId | APIAuditLogChangeKeyTags | APIAuditLogChangeKeyTemporary | APIAuditLogChangeKeyTopic | APIAuditLogChangeKeyTriggerMetadata | APIAuditLogChangeKeyTriggerType | APIAuditLogChangeKeyType | APIAuditLogChangeKeyUserId | APIAuditLogChangeKeyUserLimit | APIAuditLogChangeKeyUses | APIAuditLogChangeKeyVanityURLCode | APIAuditLogChangeKeyVerificationLevel | APIAuditLogChangeKeyVideoQualityMode | APIAuditLogChangeKeyVolume | APIAuditLogChangeKeyWidgetChannelId | APIAuditLogChangeKeyWidgetEnabled;
/**
 * Returned when an entity's name is changed
 */
type APIAuditLogChangeKeyName = APIAuditLogChangeData<'name', string>;
/**
 * Returned when a guild's or sticker's or guild scheduled event's description is changed
 */
type APIAuditLogChangeKeyDescription = APIAuditLogChangeData<'description', string>;
/**
 * Returned when a guild's icon is changed
 */
type APIAuditLogChangeKeyIconHash = APIAuditLogChangeData<'icon_hash', string>;
/**
 * Returned when a guild's scheduled event's cover image is changed
 */
type APIAuditLogChangeKeyImageHash = APIAuditLogChangeData<'image_hash', string>;
/**
 * Returned when a guild's splash is changed
 */
type APIAuditLogChangeKeySplashHash = APIAuditLogChangeData<'splash_hash', string>;
/**
 * Returned when a guild's discovery splash is changed
 */
type APIAuditLogChangeKeyDiscoverySplashHash = APIAuditLogChangeData<'discovery_splash_hash', string>;
/**
 * Returned when a guild's banner hash is changed
 */
type APIAuditLogChangeKeyBannerHash = APIAuditLogChangeData<'banner_hash', string>;
/**
 * Returned when a guild's owner_id is changed
 */
type APIAuditLogChangeKeyOwnerId = APIAuditLogChangeData<'owner_id', Snowflake>;
/**
 * Returned when a guild's region is changed
 */
type APIAuditLogChangeKeyRegion = APIAuditLogChangeData<'region', string>;
/**
 * Returned when a channel's rtc_region is changed
 */
type APIAuditLogChangeKeyRTCRegion = APIAuditLogChangeData<'rtc_region', string>;
/**
 * Returned when a guild's preferred_locale is changed
 */
type APIAuditLogChangeKeyPreferredLocale = APIAuditLogChangeData<'preferred_locale', string>;
/**
 * Returned when a guild's afk_channel_id is changed
 */
type APIAuditLogChangeKeyAFKChannelId = APIAuditLogChangeData<'afk_channel_id', Snowflake>;
/**
 * Returned when a guild's afk_timeout is changed
 */
type APIAuditLogChangeKeyAFKTimeout = APIAuditLogChangeData<'afk_timeout', number>;
/**
 * Returned when a guild's rules_channel_id is changed
 */
type APIAuditLogChangeKeyRulesChannelId = APIAuditLogChangeData<'rules_channel_id', string>;
/**
 * Returned when a guild's public_updates_channel_id is changed
 */
type APIAuditLogChangeKeyPublicUpdatesChannelId = APIAuditLogChangeData<'public_updates_channel_id', string>;
/**
 * Returned when a guild's safety_alerts_channel_id is changed
 */
type APIAuditLogChangeKeySafetyAlertsChannelId = APIAuditLogChangeData<'safety_alerts_channel_id', string>;
/**
 * Returned when a guild's mfa_level is changed
 */
type APIAuditLogChangeKeyMFALevel = APIAuditLogChangeData<'mfa_level', GuildMFALevel>;
/**
 * Returned when a guild's verification_level is changed
 */
type APIAuditLogChangeKeyVerificationLevel = APIAuditLogChangeData<'verification_level', GuildVerificationLevel>;
/**
 * Returned when a channel's video_quality_mode is changed
 */
type APIAuditLogChangeKeyVideoQualityMode = APIAuditLogChangeData<'video_quality_mode', VideoQualityMode>;
/**
 * Returned when a guild's explicit_content_filter is changed
 */
type APIAuditLogChangeKeyExplicitContentFilter = APIAuditLogChangeData<'explicit_content_filter', GuildExplicitContentFilter>;
/**
 * Returned when a guild's default_message_notifications is changed
 */
type APIAuditLogChangeKeyDefaultMessageNotifications = APIAuditLogChangeData<'default_message_notifications', GuildDefaultMessageNotifications>;
/**
 * Returned when a guild's vanity_url_code is changed
 */
type APIAuditLogChangeKeyVanityURLCode = APIAuditLogChangeData<'vanity_url_code', string>;
/**
 * Returned when a guild's boost progress bar is enabled
 */
type APIAuditLogChangeKeyPremiumProgressBarEnabled = APIAuditLogChangeData<'premium_progress_bar_enabled', boolean>;
/**
 * Returned when new role(s) are added
 */
type APIAuditLogChangeKey$Add = APIAuditLogChangeData<'$add', Pick<APIRole, 'id' | 'name'>[]>;
/**
 * Returned when role(s) are removed
 */
type APIAuditLogChangeKey$Remove = APIAuditLogChangeData<'$remove', Pick<APIRole, 'id' | 'name'>[]>;
/**
 * Returned when there is a change in number of days after which inactive and role-unassigned members are kicked
 */
type APIAuditLogChangeKeyPruneDeleteDays = APIAuditLogChangeData<'prune_delete_days', number>;
/**
 * Returned when a guild's widget is enabled
 */
type APIAuditLogChangeKeyWidgetEnabled = APIAuditLogChangeData<'widget_enabled', boolean>;
/**
 * Returned when a guild's widget_channel_id is changed
 */
type APIAuditLogChangeKeyWidgetChannelId = APIAuditLogChangeData<'widget_channel_id', Snowflake>;
/**
 * Returned when a guild's system_channel_flags is changed
 */
type APIAuditLogChangeKeySystemChannelFlags = APIAuditLogChangeData<'system_channel_flags', GuildSystemChannelFlags>;
/**
 * Returned when a guild's system_channel_id is changed
 */
type APIAuditLogChangeKeySystemChannelId = APIAuditLogChangeData<'system_channel_id', Snowflake>;
/**
 * Returned when a channel's position is changed
 */
type APIAuditLogChangeKeyPosition = APIAuditLogChangeData<'position', number>;
/**
 * Returned when a channel's topic is changed
 */
type APIAuditLogChangeKeyTopic = APIAuditLogChangeData<'topic', string>;
/**
 * Returned when a voice channel's bitrate is changed
 */
type APIAuditLogChangeKeyBitrate = APIAuditLogChangeData<'bitrate', number>;
/**
 * Returned when a channel's permission overwrites is changed
 */
type APIAuditLogChangeKeyPermissionOverwrites = APIAuditLogChangeData<'permission_overwrites', APIOverwrite[]>;
/**
 * Returned when a channel's NSFW restriction is changed
 */
type APIAuditLogChangeKeyNSFW = APIAuditLogChangeData<'nsfw', boolean>;
/**
 * The application ID of the added or removed Webhook or Bot
 */
type APIAuditLogChangeKeyApplicationId = APIAuditLogChangeData<'application_id', Snowflake>;
/**
 * Returned when a channel's amount of seconds a user has to wait before sending another message
 * is changed
 */
type APIAuditLogChangeKeyRateLimitPerUser = APIAuditLogChangeData<'rate_limit_per_user', number>;
/**
 * Returned when a guild scheduled event's recurrence_rule is changed
 */
type APIAuditLogChangeKeyRecurrenceRule = APIAuditLogChangeData<'recurrence_rule', APIGuildScheduledEventRecurrenceRule>;
/**
 * Returned when a permission bitfield is changed
 */
type APIAuditLogChangeKeyPermissions = APIAuditLogChangeData<'permissions', string>;
/**
 * Returned when a role's color is changed
 */
type APIAuditLogChangeKeyColor = APIAuditLogChangeData<'color', number>;
/**
 * Returned when a role's hoist status is changed
 */
type APIAuditLogChangeKeyHoist = APIAuditLogChangeData<'hoist', boolean>;
/**
 * Returned when a role's mentionable status is changed
 */
type APIAuditLogChangeKeyMentionable = APIAuditLogChangeData<'mentionable', boolean>;
/**
 * Returned when an overwrite's allowed permissions bitfield is changed
 */
type APIAuditLogChangeKeyAllow = APIAuditLogChangeData<'allow', string>;
/**
 * Returned when an overwrite's denied permissions bitfield is changed
 */
type APIAuditLogChangeKeyDeny = APIAuditLogChangeData<'deny', string>;
/**
 * Returned when an invite's code is changed
 */
type APIAuditLogChangeKeyCode = APIAuditLogChangeData<'code', string>;
/**
 * Returned when an invite's or guild scheduled event's channel_id is changed
 */
type APIAuditLogChangeKeyChannelId = APIAuditLogChangeData<'channel_id', Snowflake>;
/**
 * Returned when an invite's inviter_id is changed
 */
type APIAuditLogChangeKeyInviterId = APIAuditLogChangeData<'inviter_id', Snowflake>;
/**
 * Returned when an invite's max_uses is changed
 */
type APIAuditLogChangeKeyMaxUses = APIAuditLogChangeData<'max_uses', number>;
/**
 * Returned when an invite's uses is changed
 */
type APIAuditLogChangeKeyUses = APIAuditLogChangeData<'uses', number>;
/**
 * Returned when an invite's max_age is changed
 */
type APIAuditLogChangeKeyMaxAge = APIAuditLogChangeData<'max_age', number>;
/**
 * Returned when an invite's temporary status is changed
 */
type APIAuditLogChangeKeyTemporary = APIAuditLogChangeData<'temporary', boolean>;
/**
 * Returned when a user's deaf status is changed
 */
type APIAuditLogChangeKeyDeaf = APIAuditLogChangeData<'deaf', boolean>;
/**
 * Returned when a user's mute status is changed
 */
type APIAuditLogChangeKeyMute = APIAuditLogChangeData<'mute', boolean>;
/**
 * Returned when a user's nick is changed
 */
type APIAuditLogChangeKeyNick = APIAuditLogChangeData<'nick', string>;
/**
 * Returned when a user's avatar_hash is changed
 */
type APIAuditLogChangeKeyAvatarHash = APIAuditLogChangeData<'avatar_hash', string>;
/**
 * The ID of the changed entity - sometimes used in conjunction with other keys
 */
type APIAuditLogChangeKeyId = APIAuditLogChangeData<'id', Snowflake>;
/**
 * The type of entity created
 */
type APIAuditLogChangeKeyType = APIAuditLogChangeData<'type', number | string>;
/**
 * Returned when an integration's enable_emoticons is changed
 */
type APIAuditLogChangeKeyEnableEmoticons = APIAuditLogChangeData<'enable_emoticons', boolean>;
/**
 * Returned when an integration's expire_behavior is changed
 */
type APIAuditLogChangeKeyExpireBehavior = APIAuditLogChangeData<'expire_behavior', IntegrationExpireBehavior>;
/**
 * Returned when an integration's expire_grace_period is changed
 */
type APIAuditLogChangeKeyExpireGracePeriod = APIAuditLogChangeData<'expire_grace_period', number>;
/**
 * Returned when a voice channel's user_limit is changed
 */
type APIAuditLogChangeKeyUserLimit = APIAuditLogChangeData<'user_limit', number>;
/**
 * Returned when privacy level of a stage instance or guild scheduled event is changed
 */
type APIAuditLogChangeKeyPrivacyLevel = APIAuditLogChangeData<'privacy_level', StageInstancePrivacyLevel>;
/**
 * Returned when a sticker's related emoji is changed
 */
type APIAuditLogChangeKeyTags = APIAuditLogChangeData<'tags', string>;
/**
 * Returned when a sticker's format_type is changed
 */
type APIAuditLogChangeKeyFormatType = APIAuditLogChangeData<'format_type', StickerFormatType>;
/**
 * Empty string
 */
type APIAuditLogChangeKeyAsset = APIAuditLogChangeData<'asset', ''>;
/**
 * Returned when a sticker's availability is changed
 */
type APIAuditLogChangeKeyAvailable = APIAuditLogChangeData<'available', boolean>;
/**
 * Returned when a sticker's guild_id is changed
 */
type APIAuditLogChangeKeyGuildId = APIAuditLogChangeData<'guild_id', Snowflake>;
/**
 * Returned when a thread's archive status is changed
 */
type APIAuditLogChangeKeyArchived = APIAuditLogChangeData<'archived', boolean>;
/**
 * Returned when a thread's lock status is changed
 */
type APIAuditLogChangeKeyLocked = APIAuditLogChangeData<'locked', boolean>;
/**
 * Returned when a thread's auto archive duration is changed
 */
type APIAuditLogChangeKeyAutoArchiveDuration = APIAuditLogChangeData<'auto_archive_duration', number>;
/**
 * Returned when a channel's default auto archive duration for newly created threads is changed
 */
type APIAuditLogChangeKeyDefaultAutoArchiveDuration = APIAuditLogChangeData<'default_auto_archive_duration', number>;
/**
 * Returned when entity type of a guild scheduled event is changed
 */
type APIAuditLogChangeKeyEntityType = APIAuditLogChangeData<'entity_type', GuildScheduledEventEntityType>;
/**
 * Returned when status of a guild scheduled event is changed
 */
type APIAuditLogChangeKeyStatus = APIAuditLogChangeData<'status', GuildScheduledEventStatus>;
/**
 * Returned when location of a guild scheduled event is changed
 */
type APIAuditLogChangeKeyLocation = APIAuditLogChangeData<'location', string>;
/**
 * Returned when a user's timeout is changed
 */
type APIAuditLogChangeKeyCommunicationDisabledUntil = APIAuditLogChangeData<'communication_disabled_until', string>;
/**
 * Returned when an auto moderation rule's trigger type is changed (only in rule creation or deletion)
 */
type APIAuditLogChangeKeyTriggerType = APIAuditLogChangeData<'trigger_type', AutoModerationRuleTriggerType>;
/**
 * Returned when an auto moderation rule's event type is changed
 */
type APIAuditLogChangeKeyEventType = APIAuditLogChangeData<'event_type', AutoModerationRuleEventType>;
/**
 * Returned when an auto moderation rule's trigger metadata is changed
 */
type APIAuditLogChangeKeyTriggerMetadata = APIAuditLogChangeData<'trigger_metadata', APIAutoModerationRuleTriggerMetadata>;
/**
 * Returned when an auto moderation rule's actions is changed
 */
type APIAuditLogChangeKeyActions = APIAuditLogChangeData<'actions', APIAutoModerationAction[]>;
/**
 * Returned when an auto moderation rule's enabled status is changed
 */
type APIAuditLogChangeKeyEnabled = APIAuditLogChangeData<'enabled', boolean>;
/**
 * Returned when an auto moderation rule's exempt roles is changed
 */
type APIAuditLogChangeKeyExemptRoles = APIAuditLogChangeData<'exempt_roles', Snowflake[]>;
/**
 * Returned when an auto moderation rule's exempt channels is changed
 */
type APIAuditLogChangeKeyExemptChannels = APIAuditLogChangeData<'exempt_channels', Snowflake[]>;
/**
 * Returned when a guild forum's available tags gets changed
 */
type APIAuditLogChangeKeyAvailableTags = APIAuditLogChangeData<'available_tags', APIGuildForumTag[]>;
/**
 * Returned when a guild forum's default reaction emoji gets changed
 */
type APIAuditLogChangeKeyDefaultReactionEmoji = APIAuditLogChangeData<'default_reaction_emoji', APIGuildForumDefaultReactionEmoji>;
/**
 * Returned when a channel flag gets changed
 */
type APIAuditLogChangeKeyFlags = APIAuditLogChangeData<'flags', number>;
/**
 * Returned when a thread's amount of seconds a user has to wait before creating another thread
 * gets changed
 */
type APIAuditLogChangeKeyDefaultThreadRateLimitPerUser = APIAuditLogChangeData<'default_thread_rate_limit_per_user', number>;
/**
 * Returned when a soundboard is create or deleted
 */
type APIAuditLogChangeKeySoundId = APIAuditLogChangeData<'sound_id', Snowflake>;
/**
 * Returned when a soundboard's volume is changed
 */
type APIAuditLogChangeKeyVolume = APIAuditLogChangeData<'volume', number>;
/**
 * Returned when a soundboard's custom emoji is changed
 */
type APIAuditLogChangeKeyEmojiId = APIAuditLogChangeData<'emoji_id', Snowflake>;
/**
 * Returned when a soundboard's unicode emoji is changed
 */
type APIAuditLogChangeKeyEmojiName = APIAuditLogChangeData<'emoji_name', string>;
/**
 * Returned when a sounboard is created
 */
type APIAuditLogChangeKeyUserId = APIAuditLogChangeData<'user_id', Snowflake>;
interface APIAuditLogChangeData<K extends string, D> {
  key: K;
  /**
   * The new value
   *
   * If `new_value` is not present in the change object, while `old_value` is,
   * that means the property that was changed has been reset, or set to `null`
   */
  new_value?: D;
  old_value?: D;
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/invite.d.ts
/**
 * @see {@link https://discord.com/developers/docs/resources/invite#invite-object-invite-target-types}
 */
declare enum InviteTargetType {
  Stream = 1,
  EmbeddedApplication = 2
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/soundboard.d.ts
/**
 * @see {@link https://discord.com/developers/docs/resources/soundboard#soundboard-sound-object}
 */
interface APISoundboardSound {
  /**
   * The name of this sound
   */
  name: string;
  /**
   * The id of this sound
   */
  sound_id: Snowflake;
  /**
   * The volume of this sound, from 0 to 1
   */
  volume: number;
  /**
   * The id of this sound's custom emoji
   */
  emoji_id: Snowflake | null;
  /**
   * The unicode character of this sound's standard emoji
   */
  emoji_name: string | null;
  /**
   * The id of the guild that this sound is in
   */
  guild_id?: Snowflake;
  /**
   * Whether this sound can be used (for guild sounds), may be false due to loss of Server Boosts
   */
  available: boolean;
  /**
   * The user who created this sound
   */
  user?: APIUser;
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/rest/v10/channel.d.ts
/**
 * @see {@link https://discord.com/developers/docs/resources/channel#get-reactions-reaction-types}
 */
declare enum ReactionType {
  Normal = 0,
  Burst = 1,
  /**
   * @deprecated Use {@link ReactionType.Burst} instead
   */
  Super = 1
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/rest/v10/interactions.d.ts
interface RESTPostAPIBaseApplicationCommandsJSONBody extends _AddUndefinedToPossiblyUndefinedPropertiesOfInterface<Omit<APIApplicationCommand, 'application_id' | 'contexts' | 'default_member_permissions' | 'description_localized' | 'description' | 'guild_id' | 'id' | 'integration_types' | 'name_localized' | 'type' | 'version'>>, _AddUndefinedToPossiblyUndefinedPropertiesOfInterface<Partial<_NonNullableFields<Pick<APIApplicationCommand, 'contexts'>> & Pick<APIApplicationCommand, 'default_member_permissions' | 'integration_types'>>> {}
/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#create-global-application-command}
 */
interface RESTPostAPIChatInputApplicationCommandsJSONBody extends RESTPostAPIBaseApplicationCommandsJSONBody {
  type?: ApplicationCommandType.ChatInput | undefined;
  description: string;
}
/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#create-global-application-command}
 */
interface RESTPostAPIContextMenuApplicationCommandsJSONBody extends RESTPostAPIBaseApplicationCommandsJSONBody {
  type: ApplicationCommandType.Message | ApplicationCommandType.User;
}
/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#create-global-application-command}
 */
interface RESTPostAPIPrimaryEntryPointApplicationCommandJSONBody extends RESTPostAPIBaseApplicationCommandsJSONBody {
  type: ApplicationCommandType.PrimaryEntryPoint;
}
/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#create-global-application-command}
 */
type RESTPostAPIApplicationCommandsJSONBody = RESTPostAPIChatInputApplicationCommandsJSONBody | RESTPostAPIContextMenuApplicationCommandsJSONBody | RESTPostAPIPrimaryEntryPointApplicationCommandJSONBody;
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/payloads/v10/voice.d.ts
/**
 * @see {@link https://discord.com/developers/docs/resources/voice#voice-state-object}
 */
interface APIBaseVoiceState {
  /**
   * The channel id this user is connected to
   */
  channel_id: Snowflake | null;
  /**
   * The user id this voice state is for
   */
  user_id: Snowflake;
  /**
   * The guild member this voice state is for
   *
   * @remarks The member field will have `joined_at` set to `null` if the member was invited as a guest.
   * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
   */
  member?: APIGuildMember;
  /**
   * The session id for this voice state
   */
  session_id: string;
  /**
   * Whether this user is deafened by the server
   */
  deaf: boolean;
  /**
   * Whether this user is muted by the server
   */
  mute: boolean;
  /**
   * Whether this user is locally deafened
   */
  self_deaf: boolean;
  /**
   * Whether this user is locally muted
   */
  self_mute: boolean;
  /**
   * Whether this user is streaming using "Go Live"
   */
  self_stream?: boolean;
  /**
   * Whether this user's camera is enabled
   */
  self_video: boolean;
  /**
   * Whether this user is muted by the current user
   */
  suppress: boolean;
  /**
   * The time at which the user requested to speak
   */
  request_to_speak_timestamp: string | null;
}
/**
 * @see {@link https://discord.com/developers/docs/resources/voice#voice-state-object}
 */
interface APIVoiceState extends APIBaseVoiceState {
  /**
   * The guild id this voice state is for
   */
  guild_id?: Snowflake;
}
//#endregion
//#region ../../../../../../openclaw/node_modules/discord-api-types/gateway/v10.d.ts
/**
 * @see {@link https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-opcodes}
 */
declare enum GatewayOpcodes {
  /**
   * An event was dispatched
   */
  Dispatch = 0,
  /**
   * A bidirectional opcode to maintain an active gateway connection.
   * Fired periodically by the client, or fired by the gateway to request an immediate heartbeat from the client.
   */
  Heartbeat = 1,
  /**
   * Starts a new session during the initial handshake
   */
  Identify = 2,
  /**
   * Update the client's presence
   */
  PresenceUpdate = 3,
  /**
   * Used to join/leave or move between voice channels
   */
  VoiceStateUpdate = 4,
  /**
   * Resume a previous session that was disconnected
   */
  Resume = 6,
  /**
   * You should attempt to reconnect and resume immediately
   */
  Reconnect = 7,
  /**
   * Request information about offline guild members in a large guild
   */
  RequestGuildMembers = 8,
  /**
   * The session has been invalidated. You should reconnect and identify/resume accordingly
   */
  InvalidSession = 9,
  /**
   * Sent immediately after connecting, contains the `heartbeat_interval` to use
   */
  Hello = 10,
  /**
   * Sent in response to receiving a heartbeat to acknowledge that it has been received
   */
  HeartbeatAck = 11,
  /**
   * Request information about soundboard sounds in a set of guilds
   */
  RequestSoundboardSounds = 31,
  /**
   * Request ephemeral channel data for channels in a guild.
   */
  RequestChannelInfo = 43
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#receive-events}
 */
declare enum GatewayDispatchEvents {
  ApplicationCommandPermissionsUpdate = "APPLICATION_COMMAND_PERMISSIONS_UPDATE",
  AutoModerationActionExecution = "AUTO_MODERATION_ACTION_EXECUTION",
  AutoModerationRuleCreate = "AUTO_MODERATION_RULE_CREATE",
  AutoModerationRuleDelete = "AUTO_MODERATION_RULE_DELETE",
  AutoModerationRuleUpdate = "AUTO_MODERATION_RULE_UPDATE",
  ChannelCreate = "CHANNEL_CREATE",
  ChannelDelete = "CHANNEL_DELETE",
  ChannelInfo = "CHANNEL_INFO",
  ChannelPinsUpdate = "CHANNEL_PINS_UPDATE",
  ChannelUpdate = "CHANNEL_UPDATE",
  EntitlementCreate = "ENTITLEMENT_CREATE",
  EntitlementDelete = "ENTITLEMENT_DELETE",
  EntitlementUpdate = "ENTITLEMENT_UPDATE",
  GuildAuditLogEntryCreate = "GUILD_AUDIT_LOG_ENTRY_CREATE",
  GuildBanAdd = "GUILD_BAN_ADD",
  GuildBanRemove = "GUILD_BAN_REMOVE",
  GuildCreate = "GUILD_CREATE",
  GuildDelete = "GUILD_DELETE",
  GuildEmojisUpdate = "GUILD_EMOJIS_UPDATE",
  GuildIntegrationsUpdate = "GUILD_INTEGRATIONS_UPDATE",
  GuildMemberAdd = "GUILD_MEMBER_ADD",
  GuildMemberRemove = "GUILD_MEMBER_REMOVE",
  GuildMembersChunk = "GUILD_MEMBERS_CHUNK",
  GuildMemberUpdate = "GUILD_MEMBER_UPDATE",
  GuildRoleCreate = "GUILD_ROLE_CREATE",
  GuildRoleDelete = "GUILD_ROLE_DELETE",
  GuildRoleUpdate = "GUILD_ROLE_UPDATE",
  GuildScheduledEventCreate = "GUILD_SCHEDULED_EVENT_CREATE",
  GuildScheduledEventDelete = "GUILD_SCHEDULED_EVENT_DELETE",
  GuildScheduledEventUpdate = "GUILD_SCHEDULED_EVENT_UPDATE",
  GuildScheduledEventUserAdd = "GUILD_SCHEDULED_EVENT_USER_ADD",
  GuildScheduledEventUserRemove = "GUILD_SCHEDULED_EVENT_USER_REMOVE",
  GuildSoundboardSoundCreate = "GUILD_SOUNDBOARD_SOUND_CREATE",
  GuildSoundboardSoundDelete = "GUILD_SOUNDBOARD_SOUND_DELETE",
  GuildSoundboardSoundsUpdate = "GUILD_SOUNDBOARD_SOUNDS_UPDATE",
  GuildSoundboardSoundUpdate = "GUILD_SOUNDBOARD_SOUND_UPDATE",
  SoundboardSounds = "SOUNDBOARD_SOUNDS",
  GuildStickersUpdate = "GUILD_STICKERS_UPDATE",
  GuildUpdate = "GUILD_UPDATE",
  IntegrationCreate = "INTEGRATION_CREATE",
  IntegrationDelete = "INTEGRATION_DELETE",
  IntegrationUpdate = "INTEGRATION_UPDATE",
  InteractionCreate = "INTERACTION_CREATE",
  InviteCreate = "INVITE_CREATE",
  InviteDelete = "INVITE_DELETE",
  MessageCreate = "MESSAGE_CREATE",
  MessageDelete = "MESSAGE_DELETE",
  MessageDeleteBulk = "MESSAGE_DELETE_BULK",
  MessagePollVoteAdd = "MESSAGE_POLL_VOTE_ADD",
  MessagePollVoteRemove = "MESSAGE_POLL_VOTE_REMOVE",
  MessageReactionAdd = "MESSAGE_REACTION_ADD",
  MessageReactionRemove = "MESSAGE_REACTION_REMOVE",
  MessageReactionRemoveAll = "MESSAGE_REACTION_REMOVE_ALL",
  MessageReactionRemoveEmoji = "MESSAGE_REACTION_REMOVE_EMOJI",
  MessageUpdate = "MESSAGE_UPDATE",
  PresenceUpdate = "PRESENCE_UPDATE",
  RateLimited = "RATE_LIMITED",
  Ready = "READY",
  Resumed = "RESUMED",
  StageInstanceCreate = "STAGE_INSTANCE_CREATE",
  StageInstanceDelete = "STAGE_INSTANCE_DELETE",
  StageInstanceUpdate = "STAGE_INSTANCE_UPDATE",
  SubscriptionCreate = "SUBSCRIPTION_CREATE",
  SubscriptionDelete = "SUBSCRIPTION_DELETE",
  SubscriptionUpdate = "SUBSCRIPTION_UPDATE",
  ThreadCreate = "THREAD_CREATE",
  ThreadDelete = "THREAD_DELETE",
  ThreadListSync = "THREAD_LIST_SYNC",
  ThreadMembersUpdate = "THREAD_MEMBERS_UPDATE",
  ThreadMemberUpdate = "THREAD_MEMBER_UPDATE",
  ThreadUpdate = "THREAD_UPDATE",
  TypingStart = "TYPING_START",
  UserUpdate = "USER_UPDATE",
  VoiceChannelEffectSend = "VOICE_CHANNEL_EFFECT_SEND",
  VoiceChannelStartTimeUpdate = "VOICE_CHANNEL_START_TIME_UPDATE",
  VoiceChannelStatusUpdate = "VOICE_CHANNEL_STATUS_UPDATE",
  VoiceServerUpdate = "VOICE_SERVER_UPDATE",
  VoiceStateUpdate = "VOICE_STATE_UPDATE",
  WebhooksUpdate = "WEBHOOKS_UPDATE"
}
type GatewaySendPayload = GatewayHeartbeat | GatewayIdentify | GatewayRequestChannelInfo | GatewayRequestGuildMembers | GatewayRequestSoundboardSounds | GatewayResume | GatewayUpdatePresence | GatewayVoiceStateUpdate;
type GatewayReceivePayload = GatewayDispatchPayload | GatewayHeartbeatAck | GatewayHeartbeatRequest | GatewayHello | GatewayInvalidSession | GatewayReconnect;
type GatewayDispatchPayload = GatewayApplicationCommandPermissionsUpdateDispatch | GatewayAutoModerationActionExecutionDispatch | GatewayAutoModerationRuleCreateDispatch | GatewayAutoModerationRuleDeleteDispatch | GatewayAutoModerationRuleUpdateDispatch | GatewayChannelCreateDispatch | GatewayChannelDeleteDispatch | GatewayChannelInfoDispatch | GatewayChannelPinsUpdateDispatch | GatewayChannelUpdateDispatch | GatewayEntitlementCreateDispatch | GatewayEntitlementDeleteDispatch | GatewayEntitlementUpdateDispatch | GatewayGuildAuditLogEntryCreateDispatch | GatewayGuildBanAddDispatch | GatewayGuildBanRemoveDispatch | GatewayGuildCreateDispatch | GatewayGuildDeleteDispatch | GatewayGuildEmojisUpdateDispatch | GatewayGuildIntegrationsUpdateDispatch | GatewayGuildMemberAddDispatch | GatewayGuildMemberRemoveDispatch | GatewayGuildMembersChunkDispatch | GatewayGuildMemberUpdateDispatch | GatewayGuildModifyDispatch | GatewayGuildRoleCreateDispatch | GatewayGuildRoleDeleteDispatch | GatewayGuildRoleUpdateDispatch | GatewayGuildScheduledEventCreateDispatch | GatewayGuildScheduledEventDeleteDispatch | GatewayGuildScheduledEventUpdateDispatch | GatewayGuildScheduledEventUserAddDispatch | GatewayGuildScheduledEventUserRemoveDispatch | GatewayGuildSoundboardSoundCreateDispatch | GatewayGuildSoundboardSoundDeleteDispatch | GatewayGuildSoundboardSoundsUpdateDispatch | GatewayGuildSoundboardSoundUpdateDispatch | GatewayGuildStickersUpdateDispatch | GatewayIntegrationCreateDispatch | GatewayIntegrationDeleteDispatch | GatewayIntegrationUpdateDispatch | GatewayInteractionCreateDispatch | GatewayInviteCreateDispatch | GatewayInviteDeleteDispatch | GatewayMessageCreateDispatch | GatewayMessageDeleteBulkDispatch | GatewayMessageDeleteDispatch | GatewayMessagePollVoteAddDispatch | GatewayMessagePollVoteRemoveDispatch | GatewayMessageReactionAddDispatch | GatewayMessageReactionRemoveAllDispatch | GatewayMessageReactionRemoveDispatch | GatewayMessageReactionRemoveEmojiDispatch | GatewayMessageUpdateDispatch | GatewayPresenceUpdateDispatch | GatewayRateLimitedDispatch | GatewayReadyDispatch | GatewayResumedDispatch | GatewaySoundboardSoundsDispatch | GatewayStageInstanceCreateDispatch | GatewayStageInstanceDeleteDispatch | GatewayStageInstanceUpdateDispatch | GatewaySubscriptionCreateDispatch | GatewaySubscriptionDeleteDispatch | GatewaySubscriptionUpdateDispatch | GatewayThreadCreateDispatch | GatewayThreadDeleteDispatch | GatewayThreadListSyncDispatch | GatewayThreadMembersUpdateDispatch | GatewayThreadMemberUpdateDispatch | GatewayThreadUpdateDispatch | GatewayTypingStartDispatch | GatewayUserUpdateDispatch | GatewayVoiceChannelEffectSendDispatch | GatewayVoiceChannelStartTimeUpdateDispatch | GatewayVoiceChannelStatusUpdateDispatch | GatewayVoiceServerUpdateDispatch | GatewayVoiceStateUpdateDispatch | GatewayWebhooksUpdateDispatch;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#hello}
 */
interface GatewayHello extends _NonDispatchPayload {
  op: GatewayOpcodes.Hello;
  d: GatewayHelloData;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#hello}
 */
interface GatewayHelloData {
  /**
   * The interval (in milliseconds) the client should heartbeat with
   */
  heartbeat_interval: number;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway#sending-heartbeats}
 */
interface GatewayHeartbeatRequest extends _NonDispatchPayload {
  op: GatewayOpcodes.Heartbeat;
  d: undefined;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#heartbeat}
 */
interface GatewayHeartbeatAck extends _NonDispatchPayload {
  op: GatewayOpcodes.HeartbeatAck;
  d: undefined;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#invalid-session}
 */
interface GatewayInvalidSession extends _NonDispatchPayload {
  op: GatewayOpcodes.InvalidSession;
  d: GatewayInvalidSessionData;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#invalid-session}
 */
type GatewayInvalidSessionData = boolean;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#reconnect}
 */
interface GatewayReconnect extends _NonDispatchPayload {
  op: GatewayOpcodes.Reconnect;
  d: undefined;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#ready}
 */
type GatewayReadyDispatch = _DataPayload<GatewayDispatchEvents.Ready, GatewayReadyDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#ready}
 */
interface GatewayReadyDispatchData {
  /**
   * Gateway version
   *
   * @see {@link https://discord.com/developers/docs/reference#api-versioning}
   */
  v: number;
  /**
   * Information about the user including email
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object}
   */
  user: APIUser;
  /**
   * The guilds the user is in
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#unavailable-guild-object}
   */
  guilds: APIUnavailableGuild[];
  /**
   * Used for resuming connections
   */
  session_id: string;
  /**
   * Gateway url for resuming connections
   */
  resume_gateway_url: string;
  /**
   * The shard information associated with this session, if sent when identifying
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway#sharding}
   */
  shard?: [shard_id: number, shard_count: number];
  /**
   * Contains `id`, `flags`, and `flags_new`
   *
   * @see {@link https://docs.discord.com/developers/resources/application#application-object}
   */
  application: Pick<APIApplication, 'flags_new' | 'flags' | 'id'>;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#resumed}
 */
type GatewayResumedDispatch = _DataPayload<GatewayDispatchEvents.Resumed, undefined>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-rule-create}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-rule-update}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-rule-delete}
 */
type GatewayAutoModerationRuleModifyDispatchData = APIAutoModerationRule;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-rule-create}
 */
type GatewayAutoModerationRuleCreateDispatch = _DataPayload<GatewayDispatchEvents.AutoModerationRuleCreate, GatewayAutoModerationRuleCreateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-rule-create}
 */
type GatewayAutoModerationRuleCreateDispatchData = GatewayAutoModerationRuleModifyDispatchData;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-rule-update}
 */
type GatewayAutoModerationRuleUpdateDispatch = _DataPayload<GatewayDispatchEvents.AutoModerationRuleUpdate, GatewayAutoModerationRuleUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-rule-update}
 */
type GatewayAutoModerationRuleUpdateDispatchData = GatewayAutoModerationRuleModifyDispatchData;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-rule-delete}
 */
type GatewayAutoModerationRuleDeleteDispatch = _DataPayload<GatewayDispatchEvents.AutoModerationRuleDelete, GatewayAutoModerationRuleDeleteDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-rule-delete}
 */
type GatewayAutoModerationRuleDeleteDispatchData = GatewayAutoModerationRuleModifyDispatchData;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-action-execution}
 */
type GatewayAutoModerationActionExecutionDispatch = _DataPayload<GatewayDispatchEvents.AutoModerationActionExecution, GatewayAutoModerationActionExecutionDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#auto-moderation-action-execution}
 */
interface GatewayAutoModerationActionExecutionDispatchData {
  /**
   * The id of the guild in which action was executed
   */
  guild_id: Snowflake;
  /**
   * The action which was executed
   */
  action: APIAutoModerationAction;
  /**
   * The id of the rule which action belongs to
   */
  rule_id: Snowflake;
  /**
   * The trigger type of rule which was triggered
   */
  rule_trigger_type: AutoModerationRuleTriggerType;
  /**
   * The id of the user which generated the content which triggered the rule
   */
  user_id: Snowflake;
  /**
   * The id of the channel in which user content was posted
   */
  channel_id?: Snowflake;
  /**
   * The id of any user message which content belongs to
   *
   * This field will not be present if message was blocked by AutoMod or content was not part of any message
   */
  message_id?: Snowflake;
  /**
   * The id of any system auto moderation messages posted as a result of this action
   *
   * This field will not be present if this event does not correspond to an action with type {@link AutoModerationActionType.SendAlertMessage}
   */
  alert_system_message_id?: Snowflake;
  /**
   * The user generated text content
   *
   * `MESSAGE_CONTENT` (`1 << 15`) gateway intent is required to receive non-empty values from this field
   */
  content: string;
  /**
   * The word or phrase configured in the rule that triggered the rule
   */
  matched_keyword: string | null;
  /**
   * The substring in content that triggered the rule
   *
   * `MESSAGE_CONTENT` (`1 << 15`) gateway intent is required to receive non-empty values from this field
   */
  matched_content: string | null;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#application-command-permissions-update}
 */
type GatewayApplicationCommandPermissionsUpdateDispatch = _DataPayload<GatewayDispatchEvents.ApplicationCommandPermissionsUpdate, GatewayApplicationCommandPermissionsUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#application-command-permissions-update}
 */
interface GatewayApplicationCommandPermissionsUpdateDispatchData {
  /**
   * ID of the command or the application ID
   */
  id: Snowflake;
  /**
   * ID of the application the command belongs to
   */
  application_id: Snowflake;
  /**
   * ID of the guild
   */
  guild_id: Snowflake;
  /**
   * Permissions for the command in the guild, max of 100
   */
  permissions: APIApplicationCommandPermission[];
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#subscription-create}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#subscription-update}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#subscription-delete}
 */
type GatewaySubscriptionModifyDispatchData = APISubscription;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#subscription-create}
 */
type GatewaySubscriptionCreateDispatch = _DataPayload<GatewayDispatchEvents.SubscriptionCreate, GatewaySubscriptionCreateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#subscription-create}
 */
type GatewaySubscriptionCreateDispatchData = GatewaySubscriptionModifyDispatchData;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#subscription-update}
 */
type GatewaySubscriptionUpdateDispatch = _DataPayload<GatewayDispatchEvents.SubscriptionUpdate, GatewaySubscriptionUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#subscription-update}
 */
type GatewaySubscriptionUpdateDispatchData = GatewaySubscriptionModifyDispatchData;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#subscription-delete}
 */
type GatewaySubscriptionDeleteDispatch = _DataPayload<GatewayDispatchEvents.SubscriptionDelete, GatewaySubscriptionDeleteDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#subscription-delete}
 */
type GatewaySubscriptionDeleteDispatchData = GatewaySubscriptionModifyDispatchData;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-create}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-update}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-delete}
 */
type GatewayChannelModifyDispatchData = APIChannel & {
  type: Exclude<GuildChannelType, ThreadChannelType>;
  guild_id: Snowflake;
};
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-create}
 */
type GatewayChannelCreateDispatch = _DataPayload<GatewayDispatchEvents.ChannelCreate, GatewayChannelCreateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-create}
 */
type GatewayChannelCreateDispatchData = GatewayChannelModifyDispatchData;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-update}
 */
type GatewayChannelUpdateDispatch = _DataPayload<GatewayDispatchEvents.ChannelUpdate, GatewayChannelUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-update}
 */
type GatewayChannelUpdateDispatchData = GatewayChannelModifyDispatchData;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-delete}
 */
type GatewayChannelDeleteDispatch = _DataPayload<GatewayDispatchEvents.ChannelDelete, GatewayChannelDeleteDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-delete}
 */
type GatewayChannelDeleteDispatchData = GatewayChannelModifyDispatchData;
/**
 * @see {@link https://docs.discord.com/developers/events/gateway-events#channel-info}
 */
type GatewayChannelInfoDispatch = _DataPayload<GatewayDispatchEvents.ChannelInfo, GatewayChannelInfoDispatchData>;
/**
 * @see {@link https://docs.discord.com/developers/events/gateway-events#channel-info}
 */
interface GatewayChannelInfoDispatchData {
  /**
   * The guild id
   */
  guild_id: Snowflake;
  /**
   * Ephemeral data for channels in the guild
   */
  channels: GatewayChannelInfoChannel[];
}
/**
 * @see {@link https://docs.discord.com/developers/events/gateway-events#channel-info-channel-info-channel-structure}
 */
interface GatewayChannelInfoChannel {
  /**
   * The channel id
   */
  id: Snowflake;
  /**
   * The voice channel status
   */
  status?: string | null;
  /**
   * Unix timestamp (in seconds) of when the voice session started
   */
  voice_start_time?: number | null;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-pins-update}
 */
type GatewayChannelPinsUpdateDispatch = _DataPayload<GatewayDispatchEvents.ChannelPinsUpdate, GatewayChannelPinsUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#channel-pins-update}
 */
interface GatewayChannelPinsUpdateDispatchData {
  /**
   * The id of the guild
   */
  guild_id?: Snowflake;
  /**
   * The id of the channel
   */
  channel_id: Snowflake;
  /**
   * The time at which the most recent pinned message was pinned
   */
  last_pin_timestamp?: string | null;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#entitlement-create}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#entitlement-update}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#entitlement-delete}
 */
type GatewayEntitlementModifyDispatchData = APIEntitlement;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#entitlement-create}
 */
type GatewayEntitlementCreateDispatchData = GatewayEntitlementModifyDispatchData;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#entitlement-create}
 */
type GatewayEntitlementCreateDispatch = _DataPayload<GatewayDispatchEvents.EntitlementCreate, GatewayEntitlementCreateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#entitlement-update}
 */
type GatewayEntitlementUpdateDispatchData = GatewayEntitlementModifyDispatchData;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#entitlement-update}
 */
type GatewayEntitlementUpdateDispatch = _DataPayload<GatewayDispatchEvents.EntitlementUpdate, GatewayEntitlementUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#entitlement-delete}
 */
type GatewayEntitlementDeleteDispatchData = GatewayEntitlementModifyDispatchData;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#entitlement-delete}
 */
type GatewayEntitlementDeleteDispatch = _DataPayload<GatewayDispatchEvents.EntitlementDelete, GatewayEntitlementDeleteDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-update}
 */
type GatewayGuildModifyDispatch = _DataPayload<GatewayDispatchEvents.GuildUpdate, GatewayGuildModifyDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-update}
 */
type GatewayGuildModifyDispatchData = APIGuild;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-create}
 */
type GatewayGuildCreateDispatch = _DataPayload<GatewayDispatchEvents.GuildCreate, GatewayGuildCreateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-create}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-create-guild-create-extra-fields}
 */
interface GatewayGuildCreateDispatchData extends APIGuild {
  /**
   * When this guild was joined at
   *
   * **This field is only sent within the {@link https://discord.com/developers/docs/topics/gateway-events#guild-create | GUILD_CREATE} event**
   */
  joined_at: string;
  /**
   * `true` if this is considered a large guild
   *
   * **This field is only sent within the {@link https://discord.com/developers/docs/topics/gateway-events#guild-create | GUILD_CREATE} event**
   */
  large: boolean;
  /**
   * `true` if this guild is unavailable due to an outage
   */
  unavailable?: boolean;
  /**
   * Total number of members in this guild
   *
   * **This field is only sent within the {@link https://discord.com/developers/docs/topics/gateway-events#guild-create | GUILD_CREATE} event**
   */
  member_count: number;
  /**
   * States of members currently in voice channels; lacks the `guild_id` key
   *
   * **This field is only sent within the {@link https://discord.com/developers/docs/topics/gateway-events#guild-create | GUILD_CREATE} event**
   *
   * @see {@link https://discord.com/developers/docs/resources/voice#voice-state-object}
   */
  voice_states: APIBaseVoiceState[];
  /**
   * Users in the guild
   *
   * **This field is only sent within the {@link https://discord.com/developers/docs/topics/gateway-events#guild-create | GUILD_CREATE} event**
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
   */
  members: APIGuildMember[];
  /**
   * Channels in the guild
   *
   * **This field is only sent within the {@link https://discord.com/developers/docs/topics/gateway-events#guild-create | GUILD_CREATE} event**
   *
   * @see {@link https://discord.com/developers/docs/resources/channel#channel-object}
   */
  channels: (APIChannel & {
    type: Exclude<GuildChannelType, ThreadChannelType>;
  })[];
  /**
   * Threads in the guild
   *
   * **This field is only sent within the {@link https://discord.com/developers/docs/topics/gateway-events#guild-create | GUILD_CREATE} event**
   *
   * @see {@link https://discord.com/developers/docs/resources/channel#channel-object}
   */
  threads: (APIChannel & {
    type: ThreadChannelType;
  })[];
  /**
   * Presences of the members in the guild, will only include non-offline members if the size is greater than `large_threshold`
   *
   * **This field is only sent within the {@link https://discord.com/developers/docs/topics/gateway-events#guild-create | GUILD_CREATE} event**
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#presence-update}
   */
  presences: GatewayPresenceUpdate[];
  /**
   * The stage instances in the guild
   *
   * **This field is only sent within the {@link https://discord.com/developers/docs/topics/gateway-events#guild-create | GUILD_CREATE} event**
   *
   * @see {@link https://discord.com/developers/docs/resources/stage-instance#stage-instance-object-stage-instance-structure}
   */
  stage_instances: APIStageInstance[];
  /**
   * The scheduled events in the guild
   *
   * **This field is only sent within the {@link https://discord.com/developers/docs/topics/gateway-events#guild-create | GUILD_CREATE} event**
   *
   * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object}
   */
  guild_scheduled_events: APIGuildScheduledEvent[];
  /**
   * The soundboard sounds in the guild
   *
   * **This field is only sent within the {@link https://discord.com/developers/docs/topics/gateway-events#guild-create | GUILD_CREATE} event**
   *
   * @see {@link https://discord.com/developers/docs/resources/soundboard#soundboard-sound-object}
   */
  soundboard_sounds: APISoundboardSound[];
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-delete}
 */
type GatewayGuildDeleteDispatch = _DataPayload<GatewayDispatchEvents.GuildDelete, GatewayGuildDeleteDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-delete}
 */
interface GatewayGuildDeleteDispatchData extends APIBaseGuild {
  /**
   * `true` if this guild is unavailable due to an outage
   *
   * If the field is not set, the user was removed from the guild.
   */
  unavailable?: true;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-ban-add}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-ban-remove}
 */
interface GatewayGuildBanModifyDispatchData {
  /**
   * ID of the guild
   */
  guild_id: Snowflake;
  /**
   * The banned user
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object}
   */
  user: APIUser;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-ban-add}
 */
type GatewayGuildBanAddDispatch = _DataPayload<GatewayDispatchEvents.GuildBanAdd, GatewayGuildBanAddDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-ban-add}
 */
type GatewayGuildBanAddDispatchData = GatewayGuildBanModifyDispatchData;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-ban-remove}
 */
type GatewayGuildBanRemoveDispatch = _DataPayload<GatewayDispatchEvents.GuildBanRemove, GatewayGuildBanRemoveDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-ban-remove}
 */
type GatewayGuildBanRemoveDispatchData = GatewayGuildBanModifyDispatchData;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-emojis-update}
 */
type GatewayGuildEmojisUpdateDispatch = _DataPayload<GatewayDispatchEvents.GuildEmojisUpdate, GatewayGuildEmojisUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-emojis-update}
 */
interface GatewayGuildEmojisUpdateDispatchData {
  /**
   * ID of the guild
   */
  guild_id: Snowflake;
  /**
   * Array of emojis
   *
   * @see {@link https://discord.com/developers/docs/resources/emoji#emoji-object}
   */
  emojis: APIEmoji[];
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-stickers-update}
 */
type GatewayGuildStickersUpdateDispatch = _DataPayload<GatewayDispatchEvents.GuildStickersUpdate, GatewayGuildStickersUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-stickers-update}
 */
interface GatewayGuildStickersUpdateDispatchData {
  /**
   * ID of the guild
   */
  guild_id: Snowflake;
  /**
   * Array of stickers
   *
   * @see {@link https://discord.com/developers/docs/resources/sticker#sticker-object}
   */
  stickers: APISticker[];
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-integrations-update}
 */
type GatewayGuildIntegrationsUpdateDispatch = _DataPayload<GatewayDispatchEvents.GuildIntegrationsUpdate, GatewayGuildIntegrationsUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-integrations-update}
 */
interface GatewayGuildIntegrationsUpdateDispatchData {
  /**
   * ID of the guild whose integrations were updated
   */
  guild_id: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-member-add}
 */
type GatewayGuildMemberAddDispatch = _DataPayload<GatewayDispatchEvents.GuildMemberAdd, GatewayGuildMemberAddDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-member-add}
 */
interface GatewayGuildMemberAddDispatchData extends APIGuildMember {
  /**
   * The id of the guild
   */
  guild_id: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-member-remove}
 */
type GatewayGuildMemberRemoveDispatch = _DataPayload<GatewayDispatchEvents.GuildMemberRemove, GatewayGuildMemberRemoveDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-member-remove}
 */
interface GatewayGuildMemberRemoveDispatchData {
  /**
   * The id of the guild
   */
  guild_id: Snowflake;
  /**
   * The user who was removed
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object}
   */
  user: APIUser;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-member-update}
 */
type GatewayGuildMemberUpdateDispatch = _DataPayload<GatewayDispatchEvents.GuildMemberUpdate, GatewayGuildMemberUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-member-update}
 */
interface GatewayGuildMemberUpdateDispatchData extends APIGuildMemberJoined, APIBaseGuildMember, Partial<APIBaseVoiceGuildMember>, Partial<APIFlaggedGuildMember>, Required<APIGuildMemberAvatar>, Required<APIGuildMemberUser> {
  /**
   * The id of the guild
   */
  guild_id: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-members-chunk}
 */
type GatewayGuildMembersChunkDispatch = _DataPayload<GatewayDispatchEvents.GuildMembersChunk, GatewayGuildMembersChunkDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-members-chunk}
 */
interface GatewayGuildMembersChunkDispatchData {
  /**
   * The id of the guild
   */
  guild_id: Snowflake;
  /**
   * Set of guild members
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
   */
  members: APIGuildMember[];
  /**
   * The chunk index in the expected chunks for this response (`0 <= chunk_index < chunk_count`)
   */
  chunk_index: number;
  /**
   * The total number of expected chunks for this response
   */
  chunk_count: number;
  /**
   * If passing an invalid id to `REQUEST_GUILD_MEMBERS`, it will be returned here
   */
  not_found?: unknown[];
  /**
   * If passing true to `REQUEST_GUILD_MEMBERS`, presences of the returned members will be here
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#update-presence}
   */
  presences?: GatewayGuildMembersChunkPresence[];
  /**
   * The nonce used in the Guild Members Request
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#request-guild-members}
   */
  nonce?: string;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-role-create}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-role-update}
 */
interface GatewayGuildRoleModifyDispatchData {
  /**
   * The id of the guild
   */
  guild_id: Snowflake;
  /**
   * The role created or updated
   *
   * @see {@link https://discord.com/developers/docs/topics/permissions#role-object}
   */
  role: APIRole;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-role-create}
 */
type GatewayGuildRoleCreateDispatch = _DataPayload<GatewayDispatchEvents.GuildRoleCreate, GatewayGuildRoleCreateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-role-create}
 */
type GatewayGuildRoleCreateDispatchData = GatewayGuildRoleModifyDispatchData;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-role-update}
 */
type GatewayGuildRoleUpdateDispatch = _DataPayload<GatewayDispatchEvents.GuildRoleUpdate, GatewayGuildRoleUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-role-update}
 */
type GatewayGuildRoleUpdateDispatchData = GatewayGuildRoleModifyDispatchData;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-role-delete}
 */
type GatewayGuildRoleDeleteDispatch = _DataPayload<GatewayDispatchEvents.GuildRoleDelete, GatewayGuildRoleDeleteDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-role-delete}
 */
interface GatewayGuildRoleDeleteDispatchData {
  /**
   * The id of the guild
   */
  guild_id: Snowflake;
  /**
   * The id of the role
   */
  role_id: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-scheduled-event-create}
 */
type GatewayGuildScheduledEventCreateDispatch = _DataPayload<GatewayDispatchEvents.GuildScheduledEventCreate, GatewayGuildScheduledEventCreateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-scheduled-event-create}
 */
type GatewayGuildScheduledEventCreateDispatchData = APIGuildScheduledEvent;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-scheduled-event-update}
 */
type GatewayGuildScheduledEventUpdateDispatch = _DataPayload<GatewayDispatchEvents.GuildScheduledEventUpdate, GatewayGuildScheduledEventUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-scheduled-event-update}
 */
type GatewayGuildScheduledEventUpdateDispatchData = APIGuildScheduledEvent;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-scheduled-event-delete}
 */
type GatewayGuildScheduledEventDeleteDispatch = _DataPayload<GatewayDispatchEvents.GuildScheduledEventDelete, GatewayGuildScheduledEventDeleteDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-scheduled-event-delete}
 */
type GatewayGuildScheduledEventDeleteDispatchData = APIGuildScheduledEvent;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-scheduled-event-user-add}
 */
type GatewayGuildScheduledEventUserAddDispatch = _DataPayload<GatewayDispatchEvents.GuildScheduledEventUserAdd, GatewayGuildScheduledEventUserAddDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-scheduled-event-user-add}
 */
interface GatewayGuildScheduledEventUserAddDispatchData {
  guild_scheduled_event_id: Snowflake;
  user_id: Snowflake;
  guild_id: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-scheduled-event-user-remove}
 */
type GatewayGuildScheduledEventUserRemoveDispatch = _DataPayload<GatewayDispatchEvents.GuildScheduledEventUserRemove, GatewayGuildScheduledEventUserRemoveDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-scheduled-event-user-remove}
 */
interface GatewayGuildScheduledEventUserRemoveDispatchData {
  guild_scheduled_event_id: Snowflake;
  user_id: Snowflake;
  guild_id: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-soundboard-sound-create}
 */
type GatewayGuildSoundboardSoundCreateDispatch = _DataPayload<GatewayDispatchEvents.GuildSoundboardSoundCreate, GatewayGuildSoundboardSoundCreateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-soundboard-sound-create}
 */
type GatewayGuildSoundboardSoundCreateDispatchData = APISoundboardSound;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-soundboard-sound-update}
 */
type GatewayGuildSoundboardSoundUpdateDispatch = _DataPayload<GatewayDispatchEvents.GuildSoundboardSoundUpdate, GatewayGuildSoundboardSoundUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-soundboard-sound-update}
 */
type GatewayGuildSoundboardSoundUpdateDispatchData = APISoundboardSound;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-soundboard-sound-delete}
 */
type GatewayGuildSoundboardSoundDeleteDispatch = _DataPayload<GatewayDispatchEvents.GuildSoundboardSoundDelete, GatewayGuildSoundboardSoundDeleteDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-soundboard-sound-delete}
 */
interface GatewayGuildSoundboardSoundDeleteDispatchData {
  /**
   * The id of the sound that was deleted
   */
  sound_id: Snowflake;
  /**
   * The id of the guild the sound was in
   */
  guild_id: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-soundboard-sounds-update}
 */
type GatewayGuildSoundboardSoundsUpdateDispatch = _DataPayload<GatewayDispatchEvents.GuildSoundboardSoundsUpdate, GatewayGuildSoundboardSoundsUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-soundboard-sounds-update}
 */
interface GatewayGuildSoundboardSoundsUpdateDispatchData {
  /**
   * The guild's soundboard sounds
   */
  soundboard_sounds: APISoundboardSound[];
  /**
   * The id of the guild
   */
  guild_id: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/events/gateway-events#soundboard-sounds}
 */
type GatewaySoundboardSoundsDispatch = _DataPayload<GatewayDispatchEvents.SoundboardSounds, GatewaySoundboardSoundsDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/events/gateway-events#soundboard-sounds}
 */
interface GatewaySoundboardSoundsDispatchData {
  /**
   * The guild's soundboard sounds
   */
  soundboard_sounds: APISoundboardSound[];
  /**
   * The id of the guild
   */
  guild_id: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#integration-create}
 */
type GatewayIntegrationCreateDispatch = _DataPayload<GatewayDispatchEvents.IntegrationCreate, GatewayIntegrationCreateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#integration-create}
 */
type GatewayIntegrationCreateDispatchData = APIGuildIntegration & {
  guild_id: Snowflake;
};
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#integration-update}
 */
type GatewayIntegrationUpdateDispatch = _DataPayload<GatewayDispatchEvents.IntegrationUpdate, GatewayIntegrationUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#integration-update}
 */
type GatewayIntegrationUpdateDispatchData = APIGuildIntegration & {
  guild_id: Snowflake;
};
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#integration-update}
 */
type GatewayIntegrationDeleteDispatch = _DataPayload<GatewayDispatchEvents.IntegrationDelete, GatewayIntegrationDeleteDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#integration-delete}
 */
interface GatewayIntegrationDeleteDispatchData {
  /**
   * Integration id
   */
  id: Snowflake;
  /**
   * ID of the guild
   */
  guild_id: Snowflake;
  /**
   * ID of the bot/OAuth2 application for this Discord integration
   */
  application_id?: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#interaction-create}
 */
type GatewayInteractionCreateDispatch = _DataPayload<GatewayDispatchEvents.InteractionCreate, GatewayInteractionCreateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#interaction-create}
 */
type GatewayInteractionCreateDispatchData = APIInteraction;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#invite-create}
 */
type GatewayInviteCreateDispatch = _DataPayload<GatewayDispatchEvents.InviteCreate, GatewayInviteCreateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#invite-create}
 */
interface GatewayInviteCreateDispatchData {
  /**
   * The channel the invite is for
   */
  channel_id: Snowflake;
  /**
   * The unique invite code
   *
   * @see {@link https://discord.com/developers/docs/resources/invite#invite-object}
   */
  code: string;
  /**
   * The time at which the invite was created
   */
  created_at: string;
  /**
   * The guild of the invite
   */
  guild_id?: Snowflake;
  /**
   * The user that created the invite
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object}
   */
  inviter?: APIUser;
  /**
   * How long the invite is valid for (in seconds)
   */
  max_age: number;
  /**
   * The maximum number of times the invite can be used
   */
  max_uses: number;
  /**
   * The type of target for this voice channel invite
   *
   * @see {@link https://discord.com/developers/docs/resources/invite#invite-object-invite-target-types}
   */
  target_type?: InviteTargetType;
  /**
   * The user whose stream to display for this voice channel stream invite
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object}
   */
  target_user?: APIUser;
  /**
   * The embedded application to open for this voice channel embedded application invite
   */
  target_application?: Partial<APIApplication>;
  /**
   * Whether or not the invite is temporary (invited users will be kicked on disconnect unless they're assigned a role)
   */
  temporary: boolean;
  /**
   * How many times the invite has been used (always will be `0`)
   */
  uses: 0;
  /**
   * The expiration date of this invite.
   */
  expires_at: string | null;
  /**
   * The role ID(s) for roles in the guild given to the users that accept this invite
   */
  role_ids?: Snowflake[];
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#invite-delete}
 */
type GatewayInviteDeleteDispatch = _DataPayload<GatewayDispatchEvents.InviteDelete, GatewayInviteDeleteDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#invite-delete}
 */
interface GatewayInviteDeleteDispatchData {
  /**
   * The channel of the invite
   */
  channel_id: Snowflake;
  /**
   * The guild of the invite
   */
  guild_id?: Snowflake;
  /**
   * The unique invite code
   *
   * @see {@link https://discord.com/developers/docs/resources/invite#invite-object}
   */
  code: string;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-create}
 */
type GatewayMessageCreateDispatch = _DataPayload<GatewayDispatchEvents.MessageCreate, GatewayMessageCreateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-create}
 */
interface GatewayMessageCreateDispatchData extends GatewayMessageEventExtraFields, APIBaseMessage {}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-update}
 */
type GatewayMessageUpdateDispatch = _DataPayload<GatewayDispatchEvents.MessageUpdate, GatewayMessageUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-update}
 */
interface GatewayMessageUpdateDispatchData extends GatewayMessageEventExtraFields, APIBaseMessage {}
interface APIGuildMemberNoUser extends APIBaseGuildMember, APIFlaggedGuildMember, APIGuildMemberAvatar, NonNullable<APIGuildMemberJoined>, APIBaseVoiceGuildMember {}
interface APIUserWithMember extends APIUser {
  /**
   * The `member` field is only present in `MESSAGE_CREATE` and `MESSAGE_UPDATE` events
   * from text-based guild channels
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
   */
  member?: APIGuildMemberNoUser;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-create-message-create-extra-fields}
 */
interface GatewayMessageEventExtraFields {
  /**
   * ID of the guild the message was sent in
   */
  guild_id?: Snowflake;
  /**
   * Member properties for this message's author
   *
   * The member object exists in `MESSAGE_CREATE` and `MESSAGE_UPDATE` events
   * from text-based guild channels
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
   */
  member?: APIGuildMemberNoUser;
  /**
   * Users specifically mentioned in the message
   *
   * @see {@link https://discord.com/developers/docs/resources/user#user-object}
   */
  mentions: APIUserWithMember[];
  /**
   * The type of channel the message was sent in
   *
   * @see {@link https://docs.discord.com/developers/resources/channel#channel-object-channel-types}
   */
  channel_type?: TextChannelType;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-delete}
 */
type GatewayMessageDeleteDispatch = _DataPayload<GatewayDispatchEvents.MessageDelete, GatewayMessageDeleteDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-delete}
 */
interface GatewayMessageDeleteDispatchData {
  /**
   * The id of the message
   */
  id: Snowflake;
  /**
   * The id of the channel
   */
  channel_id: Snowflake;
  /**
   * The id of the guild
   */
  guild_id?: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-delete-bulk}
 */
type GatewayMessageDeleteBulkDispatch = _DataPayload<GatewayDispatchEvents.MessageDeleteBulk, GatewayMessageDeleteBulkDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-delete-bulk}
 */
interface GatewayMessageDeleteBulkDispatchData {
  /**
   * The ids of the messages
   */
  ids: Snowflake[];
  /**
   * The id of the channel
   */
  channel_id: Snowflake;
  /**
   * The id of the guild
   */
  guild_id?: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-reaction-add}
 */
interface GatewayMessageReactionAddDispatchData extends GatewayMessageReactionRemoveDispatchData {
  /**
   * The member who reacted if this happened in a guild
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
   */
  member?: APIGuildMember;
  /**
   * The id of the user that posted the message that was reacted to
   */
  message_author_id?: Snowflake;
  /**
   * Colors used for super-reaction animation in "#rrggbb" format
   */
  burst_colors?: string[];
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-reaction-add}
 */
type GatewayMessageReactionAddDispatch = _DataPayload<GatewayDispatchEvents.MessageReactionAdd, GatewayMessageReactionAddDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-reaction-remove}
 */
interface GatewayMessageReactionRemoveDispatchData {
  /**
   * The id of the user
   */
  user_id: Snowflake;
  /**
   * The id of the channel
   */
  channel_id: Snowflake;
  /**
   * The id of the message
   */
  message_id: Snowflake;
  /**
   * The id of the guild
   */
  guild_id?: Snowflake;
  /**
   * The emoji used to react
   *
   * @see {@link https://discord.com/developers/docs/resources/emoji#emoji-object}
   */
  emoji: APIEmoji;
  /**
   * True if this is a super-reaction
   */
  burst: boolean;
  /**
   * The type of reaction
   */
  type: ReactionType;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-reaction-remove}
 */
type GatewayMessageReactionRemoveDispatch = _DataPayload<GatewayDispatchEvents.MessageReactionRemove, GatewayMessageReactionRemoveDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-reaction-remove-all}
 */
type GatewayMessageReactionRemoveAllDispatch = _DataPayload<GatewayDispatchEvents.MessageReactionRemoveAll, GatewayMessageReactionRemoveAllDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-reaction-remove-all}
 */
type GatewayMessageReactionRemoveAllDispatchData = GatewayMessageReactionRemoveData;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-reaction-remove-emoji}
 */
type GatewayMessageReactionRemoveEmojiDispatch = _DataPayload<GatewayDispatchEvents.MessageReactionRemoveEmoji, GatewayMessageReactionRemoveEmojiDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-reaction-remove-emoji}
 */
interface GatewayMessageReactionRemoveEmojiDispatchData extends GatewayMessageReactionRemoveData {
  /**
   * The emoji that was removed
   */
  emoji: APIEmoji;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#presence-update}
 */
type GatewayPresenceUpdateDispatch = _DataPayload<GatewayDispatchEvents.PresenceUpdate, GatewayPresenceUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#presence-update}
 */
type GatewayPresenceUpdateDispatchData = GatewayPresenceUpdate;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#stage-instance-create}
 */
type GatewayStageInstanceCreateDispatch = _DataPayload<GatewayDispatchEvents.StageInstanceCreate, GatewayStageInstanceCreateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#stage-instance-create}
 */
type GatewayStageInstanceCreateDispatchData = APIStageInstance;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#stage-instance-delete}
 */
type GatewayStageInstanceDeleteDispatch = _DataPayload<GatewayDispatchEvents.StageInstanceDelete, GatewayStageInstanceDeleteDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#stage-instance-delete}
 */
type GatewayStageInstanceDeleteDispatchData = APIStageInstance;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#stage-instance-update}
 */
type GatewayStageInstanceUpdateDispatch = _DataPayload<GatewayDispatchEvents.StageInstanceUpdate, GatewayStageInstanceUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#stage-instance-update}
 */
type GatewayStageInstanceUpdateDispatchData = APIStageInstance;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-list-sync}
 */
type GatewayThreadListSyncDispatch = _DataPayload<GatewayDispatchEvents.ThreadListSync, GatewayThreadListSyncDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-list-sync}
 */
type GatewayThreadListSyncDispatchData = GatewayThreadListSync;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-members-update}
 */
type GatewayThreadMembersUpdateDispatch = _DataPayload<GatewayDispatchEvents.ThreadMembersUpdate, GatewayThreadMembersUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-members-update}
 */
type GatewayThreadMembersUpdateDispatchData = GatewayThreadMembersUpdate;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-member-update}
 */
type GatewayThreadMemberUpdateDispatch = _DataPayload<GatewayDispatchEvents.ThreadMemberUpdate, GatewayThreadMemberUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-member-update}
 */
type GatewayThreadMemberUpdateDispatchData = APIThreadMember & {
  guild_id: Snowflake;
};
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-create}
 */
type GatewayThreadCreateDispatch = _DataPayload<GatewayDispatchEvents.ThreadCreate, GatewayThreadCreateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-create}
 */
interface GatewayThreadCreateDispatchData extends APIThreadChannel {
  /**
   * Whether the thread is newly created or not.
   */
  newly_created?: true;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-update}
 */
type GatewayThreadUpdateDispatch = _DataPayload<GatewayDispatchEvents.ThreadUpdate, GatewayThreadUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-update}
 */
type GatewayThreadUpdateDispatchData = APIThreadChannel;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-delete}
 */
type GatewayThreadDeleteDispatch = _DataPayload<GatewayDispatchEvents.ThreadDelete, GatewayThreadDeleteDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#thread-delete}
 */
interface GatewayThreadDeleteDispatchData {
  /**
   * The id of the channel
   */
  id: Snowflake;
  /**
   * The id of the guild
   */
  guild_id: Snowflake;
  /**
   * The id of the parent channel of the thread
   */
  parent_id: Snowflake;
  /**
   * The type of the channel
   *
   * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-channel-types}
   */
  type: ChannelType;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#typing-start}
 */
type GatewayTypingStartDispatch = _DataPayload<GatewayDispatchEvents.TypingStart, GatewayTypingStartDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#typing-start}
 */
interface GatewayTypingStartDispatchData {
  /**
   * The id of the channel
   */
  channel_id: Snowflake;
  /**
   * The id of the guild
   */
  guild_id?: Snowflake;
  /**
   * The id of the user
   */
  user_id: Snowflake;
  /**
   * Unix time (in seconds) of when the user started typing
   */
  timestamp: number;
  /**
   * The member who started typing if this happened in a guild
   *
   * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
   */
  member?: APIGuildMember;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#user-update}
 */
type GatewayUserUpdateDispatch = _DataPayload<GatewayDispatchEvents.UserUpdate, GatewayUserUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#user-update}
 */
type GatewayUserUpdateDispatchData = APIUser;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#voice-channel-effect-send}
 */
type GatewayVoiceChannelEffectSendDispatch = _DataPayload<GatewayDispatchEvents.VoiceChannelEffectSend, GatewayVoiceChannelEffectSendDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#voice-channel-effect-send}
 */
interface GatewayVoiceChannelEffectSendDispatchData {
  /**
   * ID of the channel the effect was sent in
   */
  channel_id: Snowflake;
  /**
   * ID of the guild the effect was sent in
   */
  guild_id: Snowflake;
  /**
   * ID of the user who sent the effect
   */
  user_id: Snowflake;
  /**
   * The emoji sent, for emoji reaction and soundboard effects
   */
  emoji?: APIEmoji | null;
  /**
   * The type of emoji animation, for emoji reaction and soundboard effects
   */
  animation_type?: VoiceChannelEffectSendAnimationType | null;
  /**
   * The ID of the emoji animation, for emoji reaction and soundboard effects
   */
  animation_id?: number;
  /**
   * The ID of the soundboard sound, for soundboard effects
   */
  sound_id?: Snowflake | number;
  /**
   * The volume of the soundboard sound, from 0 to 1, for soundboard effects
   */
  sound_volume?: number;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#voice-channel-effect-send-animation-types}
 */
declare enum VoiceChannelEffectSendAnimationType {
  /**
   * A fun animation, sent by a Nitro subscriber
   */
  Premium = 0,
  /**
   * The standard animation
   */
  Basic = 1
}
/**
 * @see {@link https://docs.discord.com/developers/events/gateway-events#voice-channel-status-update}
 */
type GatewayVoiceChannelStatusUpdateDispatch = _DataPayload<GatewayDispatchEvents.VoiceChannelStatusUpdate, GatewayVoiceChannelStatusUpdateDispatchData>;
/**
 * @see {@link https://docs.discord.com/developers/events/gateway-events#voice-channel-status-update}
 */
interface GatewayVoiceChannelStatusUpdateDispatchData {
  /**
   * The channel id
   */
  id: Snowflake;
  /**
   * The guild id
   */
  guild_id: Snowflake;
  /**
   * The new voice channel status
   */
  status: string | null;
}
/**
 * @see {@link https://docs.discord.com/developers/events/gateway-events#voice-channel-start-time-update}
 */
type GatewayVoiceChannelStartTimeUpdateDispatch = _DataPayload<GatewayDispatchEvents.VoiceChannelStartTimeUpdate, GatewayVoiceChannelStartTimeUpdateDispatchData>;
/**
 * @see {@link https://docs.discord.com/developers/events/gateway-events#voice-channel-start-time-update}
 */
interface GatewayVoiceChannelStartTimeUpdateDispatchData {
  /**
   * The channel id
   */
  id: Snowflake;
  /**
   * The guild id
   */
  guild_id: Snowflake;
  /**
   * Unix timestamp (in seconds) of when the voice session started
   */
  voice_start_time?: number | null;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#voice-state-update}
 */
type GatewayVoiceStateUpdateDispatch = _DataPayload<GatewayDispatchEvents.VoiceStateUpdate, GatewayVoiceStateUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#voice-state-update}
 */
type GatewayVoiceStateUpdateDispatchData = APIVoiceState;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#voice-server-update}
 */
type GatewayVoiceServerUpdateDispatch = _DataPayload<GatewayDispatchEvents.VoiceServerUpdate, GatewayVoiceServerUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#voice-server-update}
 */
interface GatewayVoiceServerUpdateDispatchData {
  /**
   * Voice connection token
   */
  token: string;
  /**
   * The guild this voice server update is for
   */
  guild_id: Snowflake;
  /**
   * The voice server host
   *
   * A `null` endpoint means that the voice server allocated has gone away and is trying to be reallocated.
   * You should attempt to disconnect from the currently connected voice server, and not attempt to reconnect
   * until a new voice server is allocated
   */
  endpoint: string | null;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#webhooks-update}
 */
type GatewayWebhooksUpdateDispatch = _DataPayload<GatewayDispatchEvents.WebhooksUpdate, GatewayWebhooksUpdateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#webhooks-update}
 */
interface GatewayWebhooksUpdateDispatchData {
  /**
   * The id of the guild
   */
  guild_id: Snowflake;
  /**
   * The id of the channel
   */
  channel_id: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-audit-log-entry-create}
 */
type GatewayGuildAuditLogEntryCreateDispatch = _DataPayload<GatewayDispatchEvents.GuildAuditLogEntryCreate, GatewayGuildAuditLogEntryCreateDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-audit-log-entry-create}
 */
interface GatewayGuildAuditLogEntryCreateDispatchData extends APIAuditLogEntry {
  /**
   * ID of the guild
   */
  guild_id: Snowflake;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-poll-vote-add}
 */
type GatewayMessagePollVoteAddDispatch = _DataPayload<GatewayDispatchEvents.MessagePollVoteAdd, GatewayMessagePollVoteDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-poll-vote-remove}
 */
type GatewayMessagePollVoteRemoveDispatch = _DataPayload<GatewayDispatchEvents.MessagePollVoteRemove, GatewayMessagePollVoteDispatchData>;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-poll-vote-add}
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#message-poll-vote-remove}
 */
interface GatewayMessagePollVoteDispatchData {
  /**
   * ID of the user
   */
  user_id: Snowflake;
  /**
   * ID of the channel
   */
  channel_id: Snowflake;
  /**
   * ID of the message
   */
  message_id: Snowflake;
  /**
   * ID of the guild
   */
  guild_id?: Snowflake;
  /**
   * ID of the answer
   */
  answer_id: number;
}
/**
 * @see {@link https://discord.com/developers/docs/events/gateway-events#rate-limited}
 */
type GatewayRateLimitedDispatch<Opcode extends keyof GatewayOpcodeRateLimitMetadataMap = keyof GatewayOpcodeRateLimitMetadataMap> = _DataPayload<GatewayDispatchEvents.RateLimited, GatewayRateLimitedDispatchData<Opcode>>;
/**
 * @see {@link https://discord.com/developers/docs/events/gateway-events#rate-limited}
 */
interface GatewayRateLimitedDispatchData<Opcode extends keyof GatewayOpcodeRateLimitMetadataMap = keyof GatewayOpcodeRateLimitMetadataMap> {
  /**
   * {@link GatewayOpcodes | Gateway opcode} of the event that was rate limited
   */
  opcode: Opcode;
  /**
   * The number of seconds to wait before submitting another request
   */
  retry_after: number;
  /**
   * Metadata for the event that was rate limited
   */
  meta: GatewayOpcodeRateLimitMetadataMap[Opcode];
}
/**
 * Map of gateway opcodes to their rate limit metadata types
 *
 * @see {@link https://discord.com/developers/docs/events/gateway-events#rate-limited-rate-limit-metadata-for-opcode-structure}
 */
interface GatewayOpcodeRateLimitMetadataMap {
  [GatewayOpcodes.RequestGuildMembers]: GatewayRequestGuildMemberRateLimitMetadata;
}
/**
 * Rate limit metadata for the {@link GatewayOpcodes.RequestGuildMembers} opcode
 */
interface GatewayRequestGuildMemberRateLimitMetadata {
  /**
   * Id of the guild members were requested for
   */
  guild_id: Snowflake;
  /**
   * Nonce used to identify the {@link GatewayGuildMembersChunkDispatch} response
   */
  nonce?: string;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway#sending-heartbeats}
 */
interface GatewayHeartbeat {
  op: GatewayOpcodes.Heartbeat;
  d: GatewayHeartbeatData;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway#sending-heartbeats}
 */
type GatewayHeartbeatData = number | null;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#identify}
 */
interface GatewayIdentify {
  op: GatewayOpcodes.Identify;
  d: GatewayIdentifyData;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#identify}
 */
interface GatewayIdentifyData {
  /**
   * Authentication token
   */
  token: string;
  /**
   * Connection properties
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#identify-identify-connection-properties}
   */
  properties: GatewayIdentifyProperties;
  /**
   * Whether this connection supports compression of packets
   *
   * @defaultValue `false`
   */
  compress?: boolean;
  /**
   * Value between 50 and 250, total number of members where the gateway will stop sending
   * offline members in the guild member list
   *
   * @defaultValue `50`
   */
  large_threshold?: number;
  /**
   * Used for Guild Sharding
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway#sharding}
   */
  shard?: [shard_id: number, shard_count: number];
  /**
   * Presence structure for initial presence information
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#update-presence}
   */
  presence?: GatewayPresenceUpdateData;
  /**
   * The Gateway Intents you wish to receive
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway#gateway-intents}
   */
  intents: number;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#identify-identify-connection-properties}
 */
interface GatewayIdentifyProperties {
  /**
   * Your operating system
   */
  os: string;
  /**
   * Your library name
   */
  browser: string;
  /**
   * Your library name
   */
  device: string;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#resume}
 */
interface GatewayResume {
  op: GatewayOpcodes.Resume;
  d: GatewayResumeData;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#resume}
 */
interface GatewayResumeData {
  /**
   * Session token
   */
  token: string;
  /**
   * Session id
   */
  session_id: string;
  /**
   * Last sequence number received
   */
  seq: number;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#request-guild-members}
 */
interface GatewayRequestGuildMembers {
  op: GatewayOpcodes.RequestGuildMembers;
  d: GatewayRequestGuildMembersData;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#request-guild-members}
 */
interface GatewayRequestGuildMembersDataBase {
  /**
   * ID of the guild to get members for
   */
  guild_id: Snowflake;
  /**
   * Used to specify if we want the presences of the matched members
   */
  presences?: boolean;
  /**
   * Nonce to identify the Guild Members Chunk response
   *
   * Nonce can only be up to 32 bytes. If you send an invalid nonce it will be ignored and the reply member_chunk(s) will not have a `nonce` set.
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#guild-members-chunk}
   */
  nonce?: string;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#request-guild-members}
 */
interface GatewayRequestGuildMembersDataWithUserIds extends GatewayRequestGuildMembersDataBase {
  /**
   * Used to specify which users you wish to fetch
   */
  user_ids: Snowflake | Snowflake[];
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#request-guild-members}
 */
interface GatewayRequestGuildMembersDataWithQuery extends GatewayRequestGuildMembersDataBase {
  /**
   * String that username starts with, or an empty string to return all members
   */
  query: string;
  /**
   * Maximum number of members to send matching the `query`;
   * a limit of `0` can be used with an empty string `query` to return all members
   */
  limit: number;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#request-guild-members}
 */
type GatewayRequestGuildMembersData = GatewayRequestGuildMembersDataWithQuery | GatewayRequestGuildMembersDataWithUserIds;
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#request-soundboard-sounds}
 */
interface GatewayRequestSoundboardSounds {
  op: GatewayOpcodes.RequestSoundboardSounds;
  d: GatewayRequestSoundboardSoundsData;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#request-soundboard-sounds}
 */
interface GatewayRequestSoundboardSoundsData {
  /**
   * The ids of the guilds to get soundboard sounds for
   */
  guild_ids: Snowflake[];
}
/**
 * @see {@link https://docs.discord.com/developers/events/gateway-events#request-channel-info}
 */
interface GatewayRequestChannelInfo {
  op: GatewayOpcodes.RequestChannelInfo;
  d: GatewayRequestChannelInfoData;
}
declare enum GatewayRequestChannelInfoField {
  Status = "status",
  VoiceStartTime = "voice_start_time"
}
/**
 * @see {@link https://docs.discord.com/developers/events/gateway-events#request-channel-info}
 */
interface GatewayRequestChannelInfoData {
  /**
   * The guild id to request channel info for
   */
  guild_id: Snowflake;
  /**
   * The fields to request. The current available fields are `status` and `voice_start_time`
   */
  fields: (GatewayRequestChannelInfoField | (string & {}))[];
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#update-voice-state}
 */
interface GatewayVoiceStateUpdate {
  op: GatewayOpcodes.VoiceStateUpdate;
  d: GatewayVoiceStateUpdateData;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#update-voice-state}
 */
interface GatewayVoiceStateUpdateData {
  /**
   * ID of the guild
   */
  guild_id: Snowflake;
  /**
   * ID of the voice channel client wants to join (`null` if disconnecting)
   */
  channel_id: Snowflake | null;
  /**
   * Is the client muted
   */
  self_mute: boolean;
  /**
   * Is the client deafened
   */
  self_deaf: boolean;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#update-presence}
 */
interface GatewayUpdatePresence {
  op: GatewayOpcodes.PresenceUpdate;
  d: GatewayPresenceUpdateData;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#update-presence-gateway-presence-update-structure}
 */
interface GatewayPresenceUpdateData {
  /**
   * Unix time (in milliseconds) of when the client went idle, or `null` if the client is not idle
   */
  since: number | null;
  /**
   * The user's activities
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object}
   */
  activities: GatewayActivityUpdateData[];
  /**
   * The user's new status
   *
   * @see {@link https://discord.com/developers/docs/topics/gateway-events#update-presence-status-types}
   */
  status: PresenceUpdateStatus;
  /**
   * Whether or not the client is afk
   */
  afk: boolean;
}
/**
 * @see {@link https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-structure}
 */
type GatewayActivityUpdateData = Pick<GatewayActivity, 'name' | 'state' | 'type' | 'url'>;
interface _BaseBasePayload {
  /**
   * Opcode for the payload
   */
  op: GatewayOpcodes;
  /**
   * Event data
   */
  d?: unknown;
}
interface _BasePayload {
  /**
   * Sequence number, used for resuming sessions and heartbeats
   */
  s: number;
  /**
   * The event name for this payload
   */
  t?: string;
}
interface _NonDispatchPayload extends _BaseBasePayload {
  t: null;
  s: null;
}
interface _DataPayload<Event extends GatewayDispatchEvents, D = unknown> extends _BasePayload {
  op: GatewayOpcodes.Dispatch;
  t: Event;
  d: D;
}
interface GatewayMessageReactionRemoveData {
  /**
   * The id of the channel
   */
  channel_id: Snowflake;
  /**
   * The id of the message
   */
  message_id: Snowflake;
  /**
   * The id of the guild
   */
  guild_id?: Snowflake;
}
//#endregion
//#region extensions/discord/src/internal/rest-scheduler.d.ts
type RequestPriority$1 = "critical" | "standard" | "background";
type RequestQuery = Record<string, string | number | boolean>;
//#endregion
//#region extensions/discord/src/internal/rest.d.ts
type RuntimeProfile = "serverless" | "persistent";
type RequestPriority = RequestPriority$1;
type RequestSchedulerOptions = {
  lanes?: Partial<Record<RequestPriority, {
    maxQueueSize?: number;
    staleAfterMs?: number;
    weight?: number;
  }>>;
  maxConcurrency?: number;
  maxRateLimitRetries?: number;
};
type RequestClientOptions = {
  tokenHeader?: "Bot" | "Bearer";
  baseUrl?: string;
  apiVersion?: number;
  userAgent?: string;
  signal?: AbortSignal;
  timeout?: number;
  queueRequests?: boolean;
  maxQueueSize?: number;
  runtimeProfile?: RuntimeProfile;
  scheduler?: RequestSchedulerOptions;
  fetch?: (input: string | URL | Request, init?: RequestInit) => Promise<Response>;
};
type NormalizedRequestClientOptions = RequestClientOptions & {
  apiVersion: number;
  maxQueueSize: number;
  timeout: number;
};
type RequestData = {
  body?: unknown;
  multipartStyle?: "message" | "form";
  rawBody?: boolean;
  headers?: Record<string, string>;
};
type QueuedRequest = {
  method: string;
  path: string;
  data?: RequestData;
  query?: RequestQuery;
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  routeKey: string;
};
declare class RequestClient {
  readonly options: NormalizedRequestClientOptions;
  protected token: string;
  protected customFetch: RequestClientOptions["fetch"];
  protected requestControllers: Set<AbortController>;
  private scheduler;
  constructor(token: string, options?: RequestClientOptions);
  get(path: string, query?: QueuedRequest["query"]): Promise<unknown>;
  post(path: string, data?: RequestData, query?: QueuedRequest["query"]): Promise<unknown>;
  patch(path: string, data?: RequestData, query?: QueuedRequest["query"]): Promise<unknown>;
  put(path: string, data?: RequestData, query?: QueuedRequest["query"]): Promise<unknown>;
  delete(path: string, data?: RequestData, query?: QueuedRequest["query"]): Promise<unknown>;
  protected request(method: string, path: string, params: {
    data?: RequestData;
    query?: QueuedRequest["query"];
  }): Promise<unknown>;
  protected executeRequest(method: string, path: string, params: {
    data?: RequestData;
    query?: QueuedRequest["query"];
  }, routeKey?: string): Promise<unknown>;
  clearQueue(): void;
  get queueSize(): number;
  getSchedulerMetrics(): {
    globalRateLimitUntil: number;
    activeBuckets: number;
    routeBucketMappings: number;
    buckets: {
      key: string;
      active: number;
      bucket: string | undefined;
      invalidRequests: number;
      pending: number;
      pendingByLane: {
        [k: string]: number;
      };
      rateLimitHits: number;
      remaining: number | undefined;
      resetAt: number;
      routeKeyCount: number;
    }[];
    invalidRequestCount: number;
    invalidRequestCountByStatus: Record<number, number>;
    queueSize: number;
    queueSizeByLane: {
      critical: number;
      standard: number;
      background: number;
    };
    droppedByLane: {
      critical: number;
      standard: number;
      background: number;
    };
    oldestQueuedByLane: {
      [k: string]: number;
    };
    activeWorkers: number;
    maxConcurrentWorkers: number;
  };
  abortAllRequests(): void;
}
//#endregion
//#region extensions/discord/src/command-deploy-store.d.ts
type DiscordCommandDeployHashStore = Pick<PluginStateKeyedStore<string>, "lookup" | "register">;
//#endregion
//#region extensions/discord/src/internal/embeds.d.ts
declare class Embed {
  title?: string;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: APIEmbed["footer"];
  image?: string | APIEmbed["image"];
  thumbnail?: string | APIEmbed["thumbnail"];
  author?: APIEmbed["author"];
  fields?: APIEmbed["fields"];
  constructor(embed?: APIEmbed);
  serialize(): APIEmbed;
}
//#endregion
//#region extensions/discord/src/internal/payload.d.ts
type MessagePayloadFile = {
  name: string;
  data: Blob | Uint8Array | ArrayBuffer;
  contentType?: string;
  description?: string;
  duration_secs?: number;
  waveform?: string;
};
type MessagePayloadObject = {
  content?: string;
  embeds?: Array<APIEmbed | Embed>;
  components?: TopLevelComponents[];
  allowedMentions?: unknown;
  allowed_mentions?: unknown;
  flags?: number;
  tts?: boolean;
  files?: MessagePayloadFile[];
  poll?: unknown;
  ephemeral?: boolean;
  stickers?: [string, string, string] | [string, string] | [string];
};
type MessagePayload = string | MessagePayloadObject;
type TopLevelComponents = {
  isV2?: boolean;
  serialize: () => unknown;
};
//#endregion
//#region extensions/discord/src/internal/structures.d.ts
type RawOrId<T> = T | string | {
  id: string;
  channelId?: string;
};
type StructureClient = {
  rest: RequestClient;
  fetchUser(id: string): Promise<User>;
};
declare class Base {
  protected client: StructureClient;
  constructor(client: StructureClient);
}
declare class User<IsPartial extends boolean = false> extends Base {
  protected rawDataValue: APIUser | null;
  readonly id: string;
  constructor(client: StructureClient, rawDataOrId: IsPartial extends true ? string : APIUser);
  get rawData(): Readonly<APIUser>;
  get partial(): IsPartial;
  get username(): string;
  get globalName(): string | null | undefined;
  get discriminator(): string | undefined;
  get bot(): boolean | undefined;
  get avatar(): string | null | undefined;
  get avatarUrl(): string | null;
  toString(): string;
  fetch(): Promise<User>;
  createDm(): Promise<Pick<APIChannel, "id">>;
  send(data: MessagePayload): Promise<Message>;
}
declare class Role<IsPartial extends boolean = false> extends Base {
  protected rawDataValue: APIRole | null;
  readonly id: string;
  constructor(client: StructureClient, rawDataOrId: IsPartial extends true ? string : APIRole);
  get name(): string;
}
declare class Guild<IsPartial extends boolean = false> extends Base {
  protected rawDataValue: APIGuild | null;
  readonly id: string;
  constructor(client: StructureClient, rawDataOrId: IsPartial extends true ? string : APIGuild);
  get name(): string;
}
declare class GuildMember extends Base {
  rawData: APIGuildMember;
  constructor(client: StructureClient, rawData: APIGuildMember);
  get user(): User<false> | null;
  get roles(): Array<string | Role>;
  get nickname(): string | undefined;
}
declare class Message<IsPartial extends boolean = false> extends Base {
  protected rawDataValue: APIMessage | null;
  readonly id: string;
  readonly channelId: string;
  constructor(client: StructureClient, rawDataOrIds: RawOrId<APIMessage>);
  get rawData(): Readonly<APIMessage>;
  get partial(): IsPartial;
  get message(): Message<IsPartial>;
  get channel_id(): string;
  get guild_id(): string | undefined;
  get guild(): Guild<true> | null;
  get webhookId(): string | null;
  get webhook_id(): string | null;
  get member(): GuildMember | null;
  get rawMember(): APIGuildMember | undefined;
  get content(): string;
  get author(): User<false> | null;
  get embeds(): APIEmbed[];
  get attachments(): APIAttachment[];
  get stickers(): APIStickerItem[];
  get mentionedUsers(): User<false>[];
  get mentionedRoles(): string[];
  get mentionedEveryone(): boolean;
  get timestamp(): string | undefined;
  get type(): MessageType | undefined;
  get messageReference(): APIMessageReference | undefined;
  get referencedMessage(): Message<false> | null;
  get thread(): (APIAnnouncementThreadChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIGroupDMChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIGuildCategoryChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIGuildForumChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIGuildMediaChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIGuildStageVoiceChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIGuildVoiceChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APINewsChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIPrivateThreadChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIPublicThreadChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APITextChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | null;
  fetch(): Promise<Message>;
  delete(): Promise<void>;
  edit(data: MessagePayload): Promise<Message>;
  reply(data: MessagePayload): Promise<Message>;
  pin(): Promise<void>;
  unpin(): Promise<void>;
}
type DiscordChannel = APIChannel & {
  rawData?: APIChannel;
  guildId?: string;
  guild?: Guild;
  name?: string;
  parentId?: string | null;
  ownerId?: string | null;
};
//#endregion
//#region extensions/discord/src/internal/interaction-options.d.ts
type OptionsClient = StructureClient & {
  fetchChannel(id: string): Promise<DiscordChannel>;
};
declare class OptionsHandler {
  private rawOptions;
  private client;
  private resolvedChannels;
  constructor(rawOptions: APIApplicationCommandInteractionDataOption[] | undefined, client: OptionsClient, resolvedChannels: Record<string, APIInteractionDataResolvedChannel> | undefined);
  getString(name: string): string | null;
  getNumber(name: string): number | null;
  getBoolean(name: string): boolean | null;
  getChannel(name: string, required?: boolean): Promise<(APIAnnouncementThreadChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIGroupDMChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIGuildCategoryChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIGuildForumChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIGuildMediaChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIGuildStageVoiceChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIGuildVoiceChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APINewsChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIPrivateThreadChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIPublicThreadChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APITextChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | null>;
  getFocused(): APIApplicationCommandInteractionDataBasicOption | undefined;
}
//#endregion
//#region extensions/discord/src/internal/interaction-response.d.ts
type InteractionResponseState = "unacknowledged" | "deferred" | "deferred-update" | "replied";
//#endregion
//#region extensions/discord/src/internal/interactions.d.ts
type InteractionClient = StructureClient & {
  options: {
    clientId: string;
  };
  componentHandler: {
    waitForMessageComponent(message: Message, timeoutMs: number): Promise<{
      success: true;
      customId: string;
      message: Message;
      values?: string[];
    } | {
      success: false;
      message: Message;
      reason: "timed out";
    }>;
  };
  fetchChannel(id: string): Promise<DiscordChannel>;
};
type Modal$1 = {
  serialize: () => unknown;
};
type RawInteraction = APIInteraction & {
  token: string;
  member?: {
    user?: APIUser;
    roles?: string[];
  };
  guild_id?: string;
  channel_id?: string;
  channel?: unknown;
  data?: {
    custom_id?: string;
    component_type?: number;
    values?: string[];
    components?: unknown[];
    options?: APIApplicationCommandInteractionDataOption[];
    resolved?: {
      channels?: Record<string, APIInteractionDataResolvedChannel>;
      roles?: Record<string, {
        id: string;
        name?: string;
      }>;
      users?: Record<string, {
        id: string;
        username?: string;
        discriminator?: string;
      }>;
    };
  };
  message?: unknown;
};
declare class BaseInteraction {
  client: InteractionClient;
  rawData: RawInteraction;
  readonly id: string;
  readonly token: string;
  readonly user: User | null;
  readonly userId: string;
  readonly guild: Guild | null;
  readonly channel: DiscordChannel | null;
  message: Message | null;
  private readonly response;
  private pendingResponse;
  constructor(client: InteractionClient, rawData: RawInteraction);
  get acknowledged(): boolean;
  get responseState(): InteractionResponseState;
  set responseState(nextState: InteractionResponseState);
  private enqueueResponse;
  private performCallback;
  protected callback(type: InteractionResponseType, data?: unknown): Promise<unknown>;
  reply(payload: MessagePayload): Promise<unknown>;
  defer(options?: {
    ephemeral?: boolean;
  }): Promise<unknown>;
  acknowledge(): Promise<unknown>;
  editReply(payload: MessagePayload): Promise<unknown>;
  private performReplyEdit;
  deleteReply(): Promise<unknown>;
  fetchReply(): Promise<unknown>;
  replyAndWaitForComponent(payload: MessagePayload, timeoutMs?: number): Promise<{
    success: true;
    customId: string;
    message: Message;
    values?: string[];
  } | {
    success: false;
    message: Message;
    reason: "timed out";
  }>;
  followUp(payload: MessagePayload): Promise<unknown>;
  private performFollowUp;
}
declare class CommandInteraction extends BaseInteraction {
  readonly options: OptionsHandler;
  constructor(client: InteractionClient, rawData: APIApplicationCommandInteraction & RawInteraction);
}
declare class AutocompleteInteraction extends CommandInteraction {
  respond(choices: Array<{
    name: string;
    value: string | number;
  }>): Promise<unknown>;
}
declare class BaseComponentInteraction extends BaseInteraction {
  readonly values: string[];
  constructor(client: InteractionClient, rawData: APIMessageComponentInteraction & RawInteraction);
  update(payload: MessagePayload): Promise<unknown>;
  acknowledge(): Promise<unknown>;
  showModal(modal: Modal$1): Promise<unknown>;
  launchActivity(): Promise<unknown>;
}
//#endregion
//#region extensions/discord/src/internal/components.base.d.ts
type ComponentParserResult = {
  key: string;
  data: Record<string, string | boolean>;
};
type ComponentData<T extends keyof ComponentParserResult["data"] = keyof ComponentParserResult["data"]> = { [K in T]: ComponentParserResult["data"][K] };
type ConditionalComponentOption = (interaction: BaseComponentInteraction) => boolean;
declare function parseCustomId(id: string): ComponentParserResult;
declare abstract class BaseComponent {
  abstract readonly type: number;
  readonly isV2: boolean;
  abstract serialize(): unknown;
}
declare abstract class BaseMessageInteractiveComponent extends BaseComponent {
  readonly isV2 = false;
  defer: boolean | ConditionalComponentOption;
  ephemeral: boolean | ConditionalComponentOption;
  abstract customId: string;
  customIdParser: typeof parseCustomId;
  run(_interaction: BaseComponentInteraction, _data: ComponentData): unknown;
}
declare abstract class BaseModalComponent extends BaseComponent {
  abstract customId: string;
}
//#endregion
//#region extensions/discord/src/internal/components.message.d.ts
declare abstract class AnySelectMenu extends BaseMessageInteractiveComponent {
  placeholder?: string;
  minValues?: number;
  maxValues?: number;
  disabled: boolean;
  required?: boolean;
  abstract serializeOptions(): Record<string, unknown>;
  serialize(): {
    custom_id: string;
    placeholder: string | undefined;
    min_values: number | undefined;
    max_values: number | undefined;
    disabled: true | undefined;
    required: boolean | undefined;
  };
}
declare class TextDisplay extends BaseComponent {
  content?: string | undefined;
  readonly type = ComponentType.TextDisplay;
  readonly isV2 = true;
  constructor(content?: string | undefined);
  serialize(): APITextDisplayComponent;
}
//#endregion
//#region extensions/discord/src/internal/components.modal.d.ts
declare abstract class TextInput extends BaseModalComponent {
  readonly type = ComponentType.TextInput;
  customIdParser: typeof parseCustomId;
  style: TextInputStyle;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  value?: string;
  placeholder?: string;
  serialize(): APITextInputComponent;
}
declare abstract class CheckboxGroup extends BaseModalComponent {
  readonly type = 22;
  options: Array<{
    value: string;
    label: string;
    description?: string;
    default?: boolean;
  }>;
  required?: boolean;
  minValues?: number;
  maxValues?: number;
  serialize(): {
    type: number;
    custom_id: string;
    options: {
      value: string;
      label: string;
      description?: string;
      default?: boolean;
    }[];
    required: boolean | undefined;
    min_values: number | undefined;
    max_values: number | undefined;
  };
}
declare abstract class RadioGroup extends BaseModalComponent {
  readonly type = 21;
  options: Array<{
    value: string;
    label: string;
    description?: string;
    default?: boolean;
  }>;
  required?: boolean;
  minValues?: number;
  maxValues?: number;
  serialize(): {
    type: number;
    custom_id: string;
    options: {
      value: string;
      label: string;
      description?: string;
      default?: boolean;
    }[];
    required: boolean | undefined;
    min_values: number | undefined;
    max_values: number | undefined;
  };
}
declare abstract class Label extends BaseModalComponent {
  component?: (TextInput | AnySelectMenu | CheckboxGroup | RadioGroup) | undefined;
  readonly type = ComponentType.Label;
  abstract label: string;
  description?: string;
  customId: string;
  constructor(component?: (TextInput | AnySelectMenu | CheckboxGroup | RadioGroup) | undefined);
  serialize(): {
    type: ComponentType;
    label: string;
    description: string | undefined;
    component: {
      custom_id: string;
      placeholder: string | undefined;
      min_values: number | undefined;
      max_values: number | undefined;
      disabled: true | undefined;
      required: boolean | undefined;
    } | APITextInputComponent | {
      type: number;
      custom_id: string;
      options: {
        value: string;
        label: string;
        description?: string;
        default?: boolean;
      }[];
      required: boolean | undefined;
      min_values: number | undefined;
      max_values: number | undefined;
    } | undefined;
  };
}
declare abstract class Modal {
  abstract title: string;
  components: Array<Label | TextDisplay>;
  abstract customId: string;
  customIdParser: typeof parseCustomId;
  abstract run(interaction: unknown, data: ComponentData): unknown;
  serialize(): {
    title: string;
    custom_id: string;
    components: (APITextDisplayComponent | {
      type: ComponentType;
      label: string;
      description: string | undefined;
      component: {
        custom_id: string;
        placeholder: string | undefined;
        min_values: number | undefined;
        max_values: number | undefined;
        disabled: true | undefined;
        required: boolean | undefined;
      } | APITextInputComponent | {
        type: number;
        custom_id: string;
        options: {
          value: string;
          label: string;
          description?: string;
          default?: boolean;
        }[];
        required: boolean | undefined;
        min_values: number | undefined;
        max_values: number | undefined;
      } | undefined;
    })[];
  };
}
//#endregion
//#region extensions/discord/src/internal/commands.d.ts
type ConditionalCommandOption = (interaction: unknown) => boolean;
type CommandOption = Record<string, unknown> & {
  name: string;
  description?: string;
  type: ApplicationCommandOptionType;
  required?: boolean;
  choices?: Array<{
    name: string;
    value: string | number | boolean;
  }>;
  autocomplete?: boolean | ((interaction: AutocompleteInteraction) => Promise<void>);
};
type CommandOptions = CommandOption[];
declare abstract class BaseCommand {
  id?: string;
  abstract name: string;
  description?: string;
  nameLocalizations?: Record<string, string>;
  descriptionLocalizations?: Record<string, string>;
  defer: boolean | ConditionalCommandOption;
  ephemeral: boolean | ConditionalCommandOption;
  abstract type: ApplicationCommandType;
  integrationTypes: number[];
  contexts: InteractionContextType[];
  permission?: bigint | bigint[];
  components?: BaseMessageInteractiveComponent[];
  guildIds?: string[];
  abstract serializeOptions(): unknown[] | undefined;
  serialize(): RESTPostAPIApplicationCommandsJSONBody;
}
declare abstract class Command extends BaseCommand {
  options?: CommandOptions;
  type: ApplicationCommandType;
  abstract run(interaction: unknown): unknown;
  autocomplete(interaction: unknown): Promise<void>;
  serializeOptions(): unknown[];
}
//#endregion
//#region extensions/discord/src/internal/command-deploy.d.ts
type DeployCommandOptions = {
  mode?: "overwrite" | "reconcile";
  force?: boolean;
};
//#endregion
//#region extensions/discord/src/internal/component-registry.d.ts
type OneOffComponentResult = {
  success: true;
  customId: string;
  message: Message;
  values?: string[];
} | {
  success: false;
  message: Message;
  reason: "timed out";
};
declare class ComponentRegistry<T extends {
  customId: string;
  customIdParser?: typeof parseCustomId;
  type?: number;
}> {
  private entries;
  private oneOffComponents;
  private wildcardEntries;
  register(entry: T): void;
  resolve(customId: string, options?: {
    componentType?: number;
  }): T | undefined;
  waitForMessageComponent(message: Message, timeoutMs: number): Promise<OneOffComponentResult>;
  resolveOneOffComponent(params: {
    channelId?: string;
    customId: string;
    messageId?: string;
    values?: string[];
  }): boolean;
}
//#endregion
//#region extensions/discord/src/internal/event-queue.d.ts
type DiscordEventQueueOptions = {
  maxQueueSize?: number;
  maxConcurrency?: number;
  listenerTimeout?: number;
  slowListenerThreshold?: number;
};
//#endregion
//#region extensions/discord/src/internal/client.d.ts
interface Route {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: `/${string}`;
  handler(req: Request, ctx?: Context): Response | Promise<Response>;
  protected?: boolean;
  disabled?: boolean;
}
interface Context {
  waitUntil?(promise: Promise<unknown>): void;
  env?: unknown;
}
declare abstract class Plugin {
  abstract readonly id: string;
  registerClient?(client: Client): Promise<void> | void;
  registerRoutes?(client: Client): Promise<void> | void;
  onRequest?(req: Request, ctx: Context): Promise<Response | undefined> | Response | undefined;
}
type AnyListener = {
  type: string;
  handle(data: unknown, client: Client): Promise<void> | void;
};
interface ClientOptions {
  baseUrl: string;
  clientId: string;
  deploySecret?: string;
  publicKey: string | string[];
  token: string;
  requestOptions?: RequestClientOptions;
  autoDeploy?: boolean;
  disableDeployRoute?: boolean;
  disableInteractionsRoute?: boolean;
  disableEventsRoute?: boolean;
  commandDeployHashStore?: DiscordCommandDeployHashStore;
  devGuilds?: string[];
  eventQueue?: DiscordEventQueueOptions;
  restCacheTtlMs?: number;
}
declare class Client {
  routes: Route[];
  plugins: Array<{
    id: string;
    plugin: Plugin;
  }>;
  options: ClientOptions;
  commands: BaseCommand[];
  listeners: AnyListener[];
  rest: RequestClient;
  componentHandler: ComponentRegistry<BaseMessageInteractiveComponent>;
  private commandDeployer;
  private entityCache;
  private eventQueue?;
  modalHandler: ComponentRegistry<Modal>;
  shardId?: number;
  totalShards?: number;
  constructor(options: ClientOptions, handlers: {
    commands?: BaseCommand[];
    listeners?: AnyListener[];
    components?: BaseMessageInteractiveComponent[];
    modals?: Modal[];
  }, plugins?: Plugin[]);
  getPlugin<T = Plugin>(id: string): T | undefined;
  registerListener(listener: AnyListener): AnyListener;
  unregisterListener(listener: AnyListener): boolean;
  getRuntimeMetrics(): {
    request: {
      globalRateLimitUntil: number;
      activeBuckets: number;
      routeBucketMappings: number;
      buckets: {
        key: string;
        active: number;
        bucket: string | undefined;
        invalidRequests: number;
        pending: number;
        pendingByLane: {
          [k: string]: number;
        };
        rateLimitHits: number;
        remaining: number | undefined;
        resetAt: number;
        routeKeyCount: number;
      }[];
      invalidRequestCount: number;
      invalidRequestCountByStatus: Record<number, number>;
      queueSize: number;
      queueSizeByLane: {
        critical: number;
        standard: number;
        background: number;
      };
      droppedByLane: {
        critical: number;
        standard: number;
        background: number;
      };
      oldestQueuedByLane: {
        [k: string]: number;
      };
      activeWorkers: number;
      maxConcurrentWorkers: number;
    };
    eventQueue: {
      queueSize: number;
      processing: number;
      processed: number;
      dropped: number;
      timeouts: number;
      maxQueueSize: number;
      maxConcurrency: number;
    } | undefined;
  };
  fetchUser(id: string): Promise<User>;
  fetchChannel(id: string): Promise<(APIAnnouncementThreadChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIGroupDMChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIGuildCategoryChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIGuildForumChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIGuildMediaChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIGuildStageVoiceChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIGuildVoiceChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APINewsChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIPrivateThreadChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APIPublicThreadChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  }) | (APITextChannel & {
    rawData?: APIChannel;
    guildId?: string;
    guild?: Guild;
    name?: string;
    parentId?: string | null;
    ownerId?: string | null;
  })>;
  fetchGuild(id: string): Promise<Guild>;
  fetchMember(guildId: string, userId: string): Promise<GuildMember>;
  deployCommands(options?: DeployCommandOptions): Promise<{
    mode: "overwrite" | "reconcile";
    usedDevGuilds: boolean;
  }>;
  handleInteraction(rawData: APIInteraction, _ctx?: Context): Promise<void>;
  dispatchGatewayEvent(type: string, data: unknown): Promise<void>;
}
//#endregion
//#region extensions/discord/src/internal/listeners.d.ts
type DiscordMessageDispatchData = {
  id?: string;
  channel_id: string;
  channelId?: string;
  guild_id?: string;
  message: Message;
  author: User | null;
  member?: {
    roles?: string[];
    nick?: string | null;
    nickname?: string | null;
  };
  rawMember?: {
    roles?: string[];
    nick?: string | null;
    nickname?: string | null;
  };
  guild?: Guild | null;
  channel?: unknown;
};
declare abstract class BaseListener {
  abstract readonly type: string;
  abstract handle(data: unknown, client: Client): Promise<void> | void;
}
declare abstract class MessageCreateListener extends BaseListener {
  readonly type = GatewayDispatchEvents.MessageCreate;
  abstract handle(data: APIMessage, client: Client): Promise<void> | void;
}
//#endregion
export { APIGuildMember as A, APIGuildScheduledEventEntityMetadata as C, APIAllowedMentions as D, GuildScheduledEventPrivacyLevel as E, APIRole as F, Snowflake as I, GatewayPresenceUpdate as M, APIChannel as N, APIEmbed as O, ChannelType as P, APIGuildScheduledEvent as S, GuildScheduledEventEntityType as T, GatewayPresenceUpdateData as _, Command as a, GatewayVoiceStateUpdateData as b, TextDisplay as c, Guild as d, User as f, RequestClient as g, DiscordCommandDeployHashStore as h, Plugin as i, APIGatewayBotInfo as j, APIMessage as k, ComponentData as l, Embed as m, MessageCreateListener as n, Label as o, TopLevelComponents as p, Client as r, Modal as s, DiscordMessageDispatchData as t, ComponentParserResult as u, GatewayReceivePayload as v, APIGuildScheduledEventRecurrenceRule as w, APIVoiceState as x, GatewaySendPayload as y };