import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/Authcontext';
import WaitingIndicator from '@/components/WaitingIndicator/WaitingIndicator';
import { View } from 'react-native';

export default function Index() {
    const { authState } = useAuth();

    console.log('===== INDEX START =====');
    console.log(authState);
    console.log('===== INDEX END =====');

    // Still loading auth state
    if (authState?.authenticated === undefined) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <WaitingIndicator isWaiting={true} />
            </View>
        );
    }

    // Not authenticated
    if (!authState.authenticated) {
        return <Redirect href="/login" />;
    }

    // Authenticated - goto AutoRefresh
    return <Redirect href="/(autorefresh)" />;

    // return <Redirect href="/(checkpoint)" />;

}
