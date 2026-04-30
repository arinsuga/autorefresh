import { IBranch } from './IBranch';

export interface IRole {
    code?: string;
    name?: string;
}

export interface IHeader {
    typ: string;
    alg: string;
}

export interface IPayload {
    iss?: string;
    iat?: number | null;
    exp?: number | null;
    nbf?: number | null;
    jti?: string;
    sub?: string,
    username?: string;
    roles?: IRole[];
    bo?: 0 | 1;
    branch_id?: number | null;
    prv?: {
        name?: string;
        email?: string;
        dept?: string;
        noabsen?: string;
    };
}

export interface IUser {
    fullname?: string;
    username?: string;
    roles?: IRole[];
    email?: string;
    branch_id?: number | null;
}

export interface IToken {
    token?: string;
    status?: boolean;
    code?: 0 | 200 | 401 | 402; // 200 valid / 401 invalid / 402 expired
    message?: string;
}

export interface IJWT {
    header?: IHeader;
    payload?: IPayload;
}

export default interface IAuth {
    user?: IUser;
    token?: IToken;
    jwt?: IJWT;
    authenticated?: boolean;
    firstLogin?: boolean;
    selectedBranch?: IBranch | null;
}
  