import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Colors } from '@/constants/Colors';
import { IServiceType } from '@/interfaces/IServiceType';
import { MaterialIcons } from '@expo/vector-icons';

interface ServiceSelectorProps {
    services: IServiceType[];
    selectedServiceId?: number | null;
    selectedServiceIds?: number[];
    multiple?: boolean;
    onSelect?: (serviceId: number) => void;
    onToggle?: (serviceId: number) => void;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ 
    services, 
    selectedServiceId, 
    selectedServiceIds = [], 
    multiple = false, 
    onSelect, 
    onToggle 
}) => {
    
    const renderItem = ({ item }: { item: IServiceType }) => {
        const isSelected = multiple ? selectedServiceIds.includes(item.id) : selectedServiceId === item.id;
        
        return (
            <TouchableOpacity 
                style={[styles.item, isSelected && styles.itemSelected]} 
                onPress={() => {
                    if (multiple && onToggle) {
                        onToggle(item.id);
                    } else if (onSelect) {
                        onSelect(item.id);
                    }
                }}
            >
                <View style={styles.itemInfo}>
                    <Text style={[styles.name, isSelected && styles.textSelected]}>{item.service_name}</Text>
                    <Text style={[styles.price, isSelected && styles.textSelected]}>
                        Rp {item.service_price.toLocaleString('id-ID')}
                    </Text>
                </View>
                <MaterialIcons 
                    name={isSelected ? "radio-button-checked" : "radio-button-unchecked"} 
                    size={24} 
                    color={isSelected ? Colors.white : Colors.grey} 
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Pilih Jasa Cuci</Text>
            <FlatList
                data={services}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                scrollEnabled={false}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>No services available for this vehicle type</Text>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: 10,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: Colors.white,
        borderRadius: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: Colors.greyDark,
    },
    itemSelected: {
        backgroundColor: Colors.bgOrange,
        borderColor: Colors.bgOrange,
    },
    itemInfo: {
        flex: 1,
    },
    name: {
        fontSize: 15,
        color: Colors.black,
        fontWeight: '500',
    },
    price: {
        fontSize: 14,
        color: Colors.grey,
        marginTop: 2,
    },
    textSelected: {
        color: Colors.white,
    },
    emptyText: {
        color: Colors.grey,
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 10,
    }
});

export default ServiceSelector;
