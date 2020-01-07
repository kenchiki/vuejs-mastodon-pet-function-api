export interface TootInfo {
  id: string;
  accounts: Array<AccountInfo>
  // eslint-disable-next-line camelcase
  last_status: {
    account: AccountInfo;
    // eslint-disable-next-line camelcase
    created_at: string;
  };
}

export interface AccountInfo {
  id: string;
  url: string;
  // eslint-disable-next-line camelcase
  display_name: string;
  username: string;
  avatar: string;
}

export enum Status { Free, Delivery }
