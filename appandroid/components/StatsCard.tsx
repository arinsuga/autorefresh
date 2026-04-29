import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: keyof typeof MaterialIcons.glyphMap;
    color: string;
    onPress?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, onPress }) => {
    return (
        <TouchableOpacity 
            style={[styles.card, { borderLeftColor: color }]} 
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={styles.iconContainer}>
                <MaterialIcons name={icon} size={30} color={color} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderLeftWidth: 5,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    iconContainer: {
        backgroundColor: Colors.whiteDark,
        padding: 10,
        borderRadius: 10,
    },
    textContainer: {
        marginLeft: 15,
        flex: 1,
    },
    title: {
        fontSize: 14,
        color: Colors.grey,
        marginBottom: 2,
    },
    value: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.black,
    },
});

export default StatsCard;
