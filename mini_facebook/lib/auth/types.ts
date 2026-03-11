export type RegisterInput = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
};

export type LoginInput = {
    identifier: string;
    password: string;
};

export type UpdateUsernameInput = {
    email: string;
    username: string;
};

export type UpdatePasswordInput = {
    email: string;
    oldPassword: string;
    newPassword: string;
};

export type VerifyCodeInput = {
    email: string;
    code: string;
};

export type ResendVerificationInput = {
    email: string;
};
