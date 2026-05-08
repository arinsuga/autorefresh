import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { IVehicleType } from '@/interfaces/IVehicleType';
import { MaterialIcons } from '@expo/vector-icons';

interface VehicleTypeSelectorProps {
    types: IVehicleType[];
    selectedId?: number;
    selectedIds?: number[];
    multiple?: boolean;
    onSelect: (id: number) => void;
    onSelectType?: (type: IVehicleType) => void;
}

const VehicleTypeSelector: React.FC<VehicleTypeSelectorProps> = ({ 
    types, 
    selectedId, 
    selectedIds = [], 
    multiple = false, 
    onSelect,
    onSelectType
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Jenis Kendaraan</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {types.map((type) => {
                    const isSelected = multiple ? selectedIds.includes(type.id) : selectedId === type.id;
                    const iconName = type.vehicle_type_code.toLowerCase().includes('motor') ? 'motorcycle' : 'directions-car';
                    
                    return (
                        <TouchableOpacity 
                            key={type.id} 
                            style={[styles.typeButton, isSelected && styles.typeButtonSelected]}
                            onPress={() => {
                                onSelect(type.id);
                                if (onSelectType) onSelectType(type);
                            }}
                        >
                            <MaterialIcons 
                                name={iconName} 
                                size={32} 
                                color={isSelected ? Colors.white : Colors.bgOrange} 
                            />
                            <Text style={[styles.typeName, isSelected && styles.typeNameSelected]}>
                                {type.vehicle_type_name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: 10,
    },
    scrollContent: {
        paddingRight: 20,
    },
    typeButton: {
        width: 100,
        height: 100,
        backgroundColor: Colors.white,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: Colors.greyDark,
        elevation: 1,
    },
    typeButtonSelected: {
        backgroundColor: Colors.bgOrange,
        borderColor: Colors.bgOrange,
    },
    typeName: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.black,
        marginTop: 8,
        textAlign: 'center',
    },
    typeNameSelected: {
        color: Colors.white,
    },
});

export default VehicleTypeSelector;
