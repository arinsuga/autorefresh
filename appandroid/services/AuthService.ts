
//Packages
import { BehaviorSubject, interval } from 'rxjs';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

//Interfaces
import IAuth, { IUser, IToken, IHeader, IPayload, IJWT } from '@/interfaces/IAuth';
import { IRole } from '@/interfaces/IAuth';

//Constants
import StorageKey from '@/constants/StorageKeys';
import Tokens from '@/constants/Tokens'

const API_URL = `${process.env.EXPO_PUBLIC_AUTHAPIURL}/auth`;
export const authSubject = new BehaviorSubject<IAuth | null>(null);
export const authObservable = () => authSubject.asObservable();

export const initAuth = async (): Promise<IAuth | null> => {
  return {
    user: {
      fullname: '',
      username: '',
      roles: [],
      email: '',
    },
    token: {
      token: '',
      status: false,
      code: Tokens.status.undefined.code, /** 0 undefined / 200 valid / 401 invalid / 402 expired */
      message: '',
    },
    jwt: {
      header: {
        typ: '',
        alg: '',
      },
      payload: {
        iss: '',
        iat: null,
        exp: null,
        nbf: null,
        jti: '',
        sub: '',
        username: '',
        roles: [],
        bo: 0,
        branch_id: null,
        prv: {
            name: '',
            email: '',
            dept: '',
            noabsen: '',
        },
      },
    },
    authenticated: false,
    firstLogin: true,
    selectedBranch: null,
  }
}

export const storeAuth = async (auth: IAuth) => {

  const authString = JSON.stringify(auth);

  try {

    await AsyncStorage.setItem(StorageKey.auth, authString);
  
  } catch(e) {

    //throw error

  }


}

export const clearAuth = async () => {

  try {

    await AsyncStorage.removeItem(StorageKey.auth);
      
  } catch(e) {

    //throw error

  }

}

export const getAuth = async (): Promise<IAuth | null> => {

  let result: IAuth | null = await initAuth();

  try {

    const authString = await AsyncStorage.getItem(StorageKey.auth);
    const auth: IAuth = JSON.parse(authString as string);
    const token = auth.token ? auth.token.token as string : '';
    const tokenInfo = await verifyToken(token);


    result = {
      ...auth,
      user: {
          fullname: auth?.jwt?.payload?.prv?.name || '', // Ensure fullname is properly assigned
          username: auth?.user?.username || '',
          roles: auth?.user?.roles || [],
          email: auth?.user?.email || '',
          branch_id: auth?.jwt?.payload?.branch_id || null,
      },      
      token: tokenInfo,
      authenticated: tokenInfo.status,
      firstLogin: tokenInfo.code === Tokens.status.expired.code ? false : auth.firstLogin,
      selectedBranch: auth.selectedBranch || null,
    };

  } catch(e) {

    console.log('===== ERROR: AuthService - getAuth =====');
    console.log(e);
    result = await initAuth();

  }

  return result;
}

export const login = async (username?: string, password?: string, branch_id?: number): Promise<IAuth | null> => {

    await clearAuth();
    authSubject.next(null);

    console.log("===== Authservice - login =====");
    console.log(`${API_URL}/login`);
    console.log(`username : ${username}, password : ${password}, branch_id : ${branch_id}`);

    const response = await axios.post(`${API_URL}/login`, { email: username, password, branch_id });
    const { token }: any = response.data;

    if (token) {

      const tokenString = token;
      const tokenArray = tokenString.split('.');
      const tokenHeader: IHeader = JSON.parse(atob(tokenArray[0]));
      const tokenPayload: IPayload = JSON.parse(atob(tokenArray[1]));
      const jwt: IJWT = {
        header: tokenHeader,
        payload: tokenPayload,
      }

      const fullName: string = jwt.payload?.prv ? jwt.payload?.prv.name as string : '';
      const userRoles: IRole[] = jwt.payload?.roles ? jwt.payload?.roles : [];
      const userEmail: string = jwt.payload?.prv ? jwt.payload?.prv.email as string : '';
      const auth: IAuth = {
        user: {
          fullname: fullName,
          username: username,
          roles: userRoles,
          email: userEmail,
          branch_id: jwt.payload?.branch_id || null,
        },
        token: {
          token: tokenString,
          status: true,
          code: 200,
          message: 'Token is valid',
        },
        jwt: jwt,
        authenticated: true,
        firstLogin: false,
      };

      //Call storeAuth heare
      storeAuth(auth);
      authSubject.next(auth);

      return auth;
    }

    return null;
};

export const logout = async () => {
  await clearAuth();
  const result: IAuth | null = await initAuth();
  authSubject.next(result);
  return result;
};

export const getUsername = async () => {
  const auth = await getAuth();
  const result = auth?.user?.username;
  return result;
};

export const getUser = async (): Promise<IUser> => {

  const auth = await getAuth();
  const result = auth?.user as IUser;

  return result;
};

export const getToken = async () => {

  const auth = await getAuth();
  const result = auth?.token ? auth?.token.token : '';

  return result;
};

export const getRefreshToken = async () => {
  const refreshToken = await AsyncStorage.getItem(StorageKey.refreshToken);
  return refreshToken;
};

export const refreshAuthToken = async () => {

  const auth = await getAuth();
  const tokenString = auth ? auth.token ? auth.token.token : '' : '';

  try {

    const formData = new FormData();
    const response = await axios.post(`${API_URL}/refresh`, formData, {
      headers: {
        'Authorization': `Bearer ${tokenString}`,
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
  
    });
  
    const { token } = response.data as { token: string };
    const tokenCurrent = { ...auth && auth.token, token };
  
    const authNew = { ...auth, token: tokenCurrent };
    
    await AsyncStorage.setItem(StorageKey.auth, JSON.stringify(authNew));
  
    return token;
      
  } catch(e) {
    
    console.log('======= ERROR =======');
    console.log(`${API_URL}/refresh-token`);
    console.log(e);

  }


};

export const verifyToken = (token: string):IToken => {

  try {

    const decoded = jwtDecode(token as string);
    const currentTime = Date.now() / 1000; //Convert ot milliseconds

    if (decoded.exp && decoded.exp < currentTime) {


      //expired
      return {
        token: token,
        status: false,
        code: Tokens.status.expired.code,
        message: Tokens.status.expired.message,
      };

    }

    //valid
    return {
      token: token,
      status: true,
      code: Tokens.status.valid.code,
      message: Tokens.status.valid.message,
    };
  } catch (error) {

    //invalid
    return {
      token: token,
      status: false,
      code: Tokens.status.invalid.code,
      message: Tokens.status.invalid.message,
    };
  }

};

export const isAuthenticated = async () => {

  const token = await getToken();
  if (!token) return false;

  const response = await axios.get(`${API_URL}/status`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',},
  });
  if (!response.data) return false;

  switch (response.data) {
    case 'token_expired':
      try {
        await refreshAuthToken();
        return true;
      } catch (error) {
        await logout();
        return false;
      }
    
    case 'token_invalid':
      await logout();
      return false;

    default:
      break;
  }

  return true;
};
