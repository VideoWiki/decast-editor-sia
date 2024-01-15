const constants = {
  apiUrl: 'https://dev.editor.video.wiki',
  redirect_uri: 'https://beta.editor.video.wiki/callback/',
  client_id: 'beta-editor',
  client_secret: '0VV7Sh06hid1e5kCjldtEyhGGb',
  hydra_ep: 'https://openid.video.wiki',
  hydra_lg: 'https://login.decast.live',
  url: 'https://api.video.wiki',
  challengeUri:
    'https://login.decast.live/oauth2/auth?audience=&max_age=0&prompt=&redirect_uri=https://beta.editor.video.wiki/callback/&response_type=code&scope=openid+offline&client_id=beta-editor&nonce=hognfveoohhddoralbeygsjg&state=imnweycejbfpyrmnahgqzcmm&origin=cast',
  profilingUrl: 'https://openid.video.wiki',
  infuraId: 'f94b1da081a44bc6bd8d10ed26cd0b4e',
  apiKey: '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',
  swarmApi: 'https://dev.cast.video.wiki',
  container: 'vw-public-cloud',
  Account: 'videowikistorage',
  key: 'b5+PEghSCgZEpV/DxQaBv42WBSrdrOL9jYh6wj58lLVPJCqS5Gt25LtAa0USdtwGerD6Vlrxdbj0+ASte2ceiw==',
  suffix: 'core.windows.net',
  StorageKey: 'Api-Key 8QgxKFDm.EX5910iMXZvgOO3dsVPVjzj3H0Hu21Tv',
};
if (process.env.NODE_ENV === 'production') {
  // constants.challengeUri =
  //   'https://login.video.wiki/oauth2/auth?audience=&max_age=0&prompt=&redirect_uri=https://dev.stream.video.wiki/callback/&response_type=code&scope=openid+offline+w&client_id=034ec543-fb7c-4e13-93f7-55af40f1ce4d&nonce=hognfveoohhddoralbeygsjg&state=imnweycejbfpyrmnahgqzcmm';
  // constants.client_id = '034ec543-fb7c-4e13-93f7-55af40f1ce4d';
  // constants.client_secret = 'GXkQhkjxsijknM.yz8-2BJmKM.';
  // constants.redirect_uri = 'https://dev.stream.video.wiki/callback/';
}
export default constants;
