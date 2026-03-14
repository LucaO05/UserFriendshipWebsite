export type StoredUser = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  createdAt: string;
};

export type Friend = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  createdAt: string;
};

export type FriendsResponse = {
  success: boolean;
  friends?: Friend[];
  message?: string;
};

export type SettingsResponse = {
  success: boolean;
  message: string;
  user?: StoredUser;
};

export type IncomingRequest = {
  id: string;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
  };
};

export type IncomingRequestsResponse = {
  success: boolean;
  requests?: IncomingRequest[];
  message?: string;
};

export type SendRequestResponse = {
  success: boolean;
  message: string;
};
