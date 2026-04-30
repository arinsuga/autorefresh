
//Core Systems
import {
    ReactNode,
    useState,
    useContext,
    createContext,
    useEffect,
} from 'react'
import { Text } from 'react-native';

//Packages
import { interval, switchMap, from, takeWhile } from 'rxjs';

//Interfaces
import IAuth, { IUser } from '@/interfaces/IAuth';
import { IBranch } from '@/interfaces/IBranch';

//Services
import {
    login,
    logout,
    authSubject,
    initAuth,
    storeAuth,
    getAuth
} from '@/services/AuthService'

interface IProvider {
    authState?: IAuth | null;
    Login?: (username?: string, password?: string, branch_id?: number) => Promise<any | null>;
    Logout?: () => Promise<any | null>;
    Register?: (email?: string, password?: string) => Promise<any | null>;
    Authenticate?: () => Promise<boolean>;
    SetBranch?: (branch: IBranch) => void;
}

const Providercontext = createContext<IProvider>({});


export const useAuth = () => {
    return useContext(Providercontext);
}

const Authprovider = ({ children }: { children: ReactNode }) => {
    const [authdata, setAuthdata] = useState<IAuth | null>(null);


    const handleLogin = async (username?: string, password?: string, branch_id?: number) => {
        let result = false;

        try {
            const auth = await login(username, password, branch_id);
            setAuthdata(auth);
            result = true;

        } catch (error) {
            console.log(error);
        }

        return result;
    }

    const handleLogout = async () => {

        const auth = await logout();
        
        setAuthdata(auth);

        return true;

    }

    const handleRegister = async (email?: string, password?: string) => {

        return true;
    }

    const handleAuthantication = async () => {


        try {

            const auth = await getAuth();

            if (auth) {

                if (!auth.authenticated) {
                    let authTemp: IAuth | null = await logout();
                    setAuthdata({
                        ...authTemp,
                        firstLogin: auth.firstLogin,
                    });

                    // setAuthdata(await logout());
                }

            }

            return auth ? auth.token ? auth.token.status as boolean : false : false;

        } catch (error) {

            console.log(error);
            return false;

        }

    }

    const handleSetBranch = (branch: IBranch) => {
        if (authdata) {
            const newAuth = { 
                ...authdata, 
                selectedBranch: branch,
                user: {
                    ...authdata.user,
                    branch_id: branch.id
                }
            };
            setAuthdata(newAuth);
            storeAuth(newAuth);
        }
    }

    const loadAuth = async () => {

//        setAuthdata(await initAuth());


        const auth = await getAuth();
        setAuthdata(auth);
        authSubject.next(auth);

    }


    //Authentication check 1
    useEffect(() => {

        loadAuth();

    }, []);

    // STEP 2 - Uncomment this code if you want to validate the authentication every 5 seconds (5000ms)
    // useEffect(() => {

    //     const subscription = authSubject.subscribe((newAuth) => {

    //         setAuthdata(newAuth);
    //         newAuth && storeAuth(newAuth);

    //     });
    //     return () => authSubject.unsubscribe();

    // }, []);
    

    // STEP 2 - Uncomment this code if you want to validate the authentication every 5 seconds (5000ms)
    // useEffect(() => {

    //     if (authdata) {

    //         const validateAuth = interval(5000)
    //         .pipe(
    //             switchMap(async () => {

    //                 console.log('Inside switchMap 1...');
    //                 const auth = await getAuth();
    //                 console.log(auth);

    //                 return auth;
    //             }),
    //             takeWhile((result, index) => result?.authenticated as boolean, true)
    //         )
    //         .subscribe((result) => {

    //             const now = new Date();
    //             console.log(`Inside subscribe... ( ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} )`);
    //             console.log(result);

    //             result?.token?.code === 402 && handleLogout();

    //         });

    //         return () => validateAuth.unsubscribe();

    //     }

    // }, [authdata]);

    const value: IProvider = {
        authState: authdata,
        Login: handleLogin,
        Logout: handleLogout,
        Register: handleRegister,
        Authenticate: handleAuthantication,
        SetBranch: handleSetBranch,
    };

    return (
        <Providercontext.Provider value={ value }>

            { children }

        </Providercontext.Provider>
    )
}

export default Authprovider;