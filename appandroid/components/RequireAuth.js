import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { isAuthenticated, logout } from '../services/AuthService';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from '../navigators/AuthNavigator';
import AppNavigator from '../navigators/AppNavigator';

const RequireAuth = () => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated();
      setAuth(isAuth);
      if (!isAuth) {
        await logout();
      }
    };
    checkAuth();
  }, []);

  if (auth === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {auth ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RequireAuth;
