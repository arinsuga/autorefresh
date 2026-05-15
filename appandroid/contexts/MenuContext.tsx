import React, { createContext, useContext, useState, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

interface MenuContextType {
    isMenuOpen: boolean;
    openMenu: () => void;
    closeMenu: () => void;
    toggleMenu: () => void;
    menuAnimation: Animated.Value;
    drawerWidth: number;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuAnimation = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

    const openMenu = () => {
        setIsMenuOpen(true);
        Animated.timing(menuAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeMenu = () => {
        Animated.timing(menuAnimation, {
            toValue: -DRAWER_WIDTH,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setIsMenuOpen(false));
    };

    const toggleMenu = () => {
        if (isMenuOpen) closeMenu();
        else openMenu();
    };

    return (
        <MenuContext.Provider value={{ 
            isMenuOpen, 
            openMenu, 
            closeMenu, 
            toggleMenu, 
            menuAnimation,
            drawerWidth: DRAWER_WIDTH 
        }}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (context === undefined) {
        throw new Error('useMenu must be used within a MenuProvider');
    }
    return context;
};
