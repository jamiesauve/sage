export enum Entity {
  User = "user",
  Sage = "sage",
  Api = "api"
}

export type MessageInfo = {
  message: string;
  messageJSX: JSX.Element[];
  from: Entity;
}