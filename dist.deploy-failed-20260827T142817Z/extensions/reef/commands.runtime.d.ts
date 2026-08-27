//#region extensions/reef/src/commands.d.ts
declare function handleReefCommand({
  args,
  senderIsOwner
}: {
  args?: string;
  senderIsOwner?: boolean;
}): Promise<{
  text: string;
}>;
//#endregion
export { handleReefCommand };