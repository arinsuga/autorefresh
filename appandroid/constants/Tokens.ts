import { IToken } from "@/interfaces/IAuth";

export const tokenStatusUndefined: IToken = { code: 0, message: '' };
export const tokenStatusValid: IToken = { code: 200, message: 'Token is valid' };
export const tokenStatusInvalid: IToken = { code: 401, message: 'Token is invalid' };
export const tokenStatusExpired: IToken = {code: 402, message: 'Toekn is expired'};

const Tokens = {
  status: {

    undefined: { code: tokenStatusUndefined.code, message: tokenStatusUndefined.message },
    valid: { code: tokenStatusValid.code, message: tokenStatusValid.message },
    invalid: { code: tokenStatusInvalid.code, message: tokenStatusInvalid.message },
    expired: { code: tokenStatusExpired.code, message: tokenStatusExpired.message },

  },
};

export default Tokens;