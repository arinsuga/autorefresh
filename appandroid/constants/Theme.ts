import { Colors } from "./Colors";

export const lightTheme = {
    background: Colors.white,
    text: Colors.black,
    primary: Colors.bgOrange,
    secondary: Colors.greyLight,
    surface: Colors.white,
    border: Colors.greyLight,
};

export const darkTheme = {
    background: '#121212',
    text: '#FFFFFF',
    primary: Colors.bgOrange,
    secondary: '#333333',
    surface: '#1E1E1E',
    border: '#333333',
};

export type Theme = typeof lightTheme;
