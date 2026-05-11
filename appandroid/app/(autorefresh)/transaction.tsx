import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    TextInput, 
    Alert,
    KeyboardAvoidingView,
    Platform,
    Image
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/Authcontext';
import { useTheme } from '@/contexts/ThemeContext';
import VehicleTypeService from '@/services/VehicleTypeService';
import ServiceTypeService from '@/services/ServiceTypeService';
import PaymentMethodService from '@/services/PaymentMethodService';
import TransactionService from '@/services/TransactionService';
import { IVehicleType } from '@/interfaces/IVehicleType';
import { IServiceType } from '@/interfaces/IServiceType';
import { IPaymentMethod } from '@/interfaces/IPaymentMethod';
import { ITransaction } from '@/interfaces/ITransaction';
import { IBranch } from '@/interfaces/IBranch';
import VehicleTypeSelector from '@/components/VehicleTypeSelector';
import ServiceSelector from '@/components/ServiceSelector';
import BranchSelector from '@/components/BranchSelector';
import PlateOCRModal from '@/components/PlateOCRModal';
import { MaterialIcons } from '@expo/vector-icons';
import { cleanPlateNumber } from '@/utils/PlateUtils';
import moment from 'moment';
import { showMessage } from 'react-native-flash-message';

export default function TransactionScreen() {
    const { authState } = useAuth();
    const { theme } = useTheme();
    const router = useRouter();

    // Data states
    const [vehicleTypes, setVehicleTypes] = useState<IVehicleType[]>([]);
    const [serviceTypes, setServiceTypes] = useState<IServiceType[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);

    // Form states
    const [plateNumber, setPlateNumber] = useState('');
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [selectedBranch, setSelectedBranch] = useState<IBranch | null>(authState?.selectedBranch || null);
    const [selectedVehicleType, setSelectedVehicleType] = useState<IVehicleType | null>(null);
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<number | null>(null);
    const [isOCRVisible, setIsOCRVisible] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { autoOpenScanner } = useLocalSearchParams();
    
    useFocusEffect(
        useCallback(() => {
            setIsOCRVisible(true);
        }, [])
    );

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const vTypes = await VehicleTypeService.getActive();
            const pMethods = await PaymentMethodService.getActive();
            setVehicleTypes(vTypes);
            setPaymentMethods(pMethods);
            
            if (vTypes.length > 0) {
                handleVehicleTypeSelect(vTypes[0]);
            }
            if (pMethods.length > 0) {
                setSelectedPaymentMethodId(pMethods[0].id);
            }
        } catch (error) {
            console.error('Failed to fetch initial data', error);
        }
    };

    const handleVehicleTypeSelect = async (type: IVehicleType) => {
        setSelectedVehicleType(type);
        setSelectedServiceId(null); // Reset service when type changes
        try {
            const sTypes = await ServiceTypeService.getByVehicleType(type.id);
            setServiceTypes(sTypes);
        } catch (error) {
            console.error('Failed to fetch service types', error);
        }
    };

    const calculateTotal = () => {
        if (!selectedServiceId) return 0;
        const service = serviceTypes.find(s => s.id === selectedServiceId);
        return service ? service.service_price : 0;
    };

    const handleSubmit = async () => {
        if (!selectedBranch) {
            Alert.alert('Validation Error', 'Silahkan pilih cabang terlebih dahulu');
            return;
        }
        if (!plateNumber) {
            Alert.alert('Error', 'Masukkan Plat Nomor');
            return;
        }
        if (!selectedVehicleType) {
            Alert.alert('Error', 'Pilih Jenis Kendaraan');
            return;
        }
        if (!selectedServiceId) {
            Alert.alert('Error', 'Pilih Jasa');
            return;
        }
        if (!selectedPaymentMethodId) {
            Alert.alert('Error', 'Pilih Metode Pembayaran');
            return;
        }

        setIsSubmitting(true);
        try {
            const total = calculateTotal();
            const service = serviceTypes.find(s => s.id === selectedServiceId);
            
            const formData = new FormData();
            formData.append('branch_id', selectedBranch.id.toString());
            formData.append('transaction_dt', moment().format('YYYY-MM-DD HH:mm:ss'));
            formData.append('plate_number', cleanPlateNumber(plateNumber));
            formData.append('vehicle_type_id', selectedVehicleType.id.toString());
            formData.append('payment_method_id', selectedPaymentMethodId.toString());
            formData.append('gross_total', total.toString());
            formData.append('discount', '0');
            formData.append('net_total', total.toString());

            // Append services as array indices for Laravel multipart/form-data
            if (service) {
                formData.append('services[0][service_type_id]', service.id.toString());
                formData.append('services[0][service_price]', service.service_price.toString());
            }

            if (capturedImage) {
                const fileName = capturedImage.split('/').pop() || 'transaction.jpg';
                formData.append('upload', {
                    uri: capturedImage,
                    name: fileName,
                    type: 'image/jpeg',
                } as any);
            }

            const result = await TransactionService.create(formData);
            
            showMessage({
                message: "Success",
                description: "Transaksi berhasil disimpan",
                type: "success",
            });
            
            router.back();
        } catch (error: any) {
            console.error('Gagal menyimpan transaksi', error);
            
            let errorMsg = 'Gagal menyimpan transaksi';
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                errorMsg = Object.values(errors).flat().join('\n');
            } else if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            }
            
            Alert.alert('Error', errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <Stack.Screen options={{ title: 'Transaksi Baru', headerShadowVisible: false }} />
            
            <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
                {(!authState?.selectedBranch) && (
                    <View style={styles.formSection}>
                        <Text style={[styles.label, !selectedBranch && styles.errorLabel]}>
                            Cabang {!selectedBranch && '(Wajib diisi)'}
                        </Text>
                        <BranchSelector 
                            onSelect={setSelectedBranch} 
                            selectedBranch={selectedBranch} 
                        />
                    </View>
                )}

                <View style={styles.formSection}>
                    <Text style={styles.label}>Plat Nomor</Text>
                    <View style={styles.plateInputContainer}>
                        <TextInput
                            style={[styles.plateInput, { color: theme.text }]}
                            value={plateNumber}
                            onChangeText={(text) => setPlateNumber(cleanPlateNumber(text))}
                            placeholder="contoh input: B1234ABC"
                            placeholderTextColor={Colors.grey}
                            autoCapitalize="characters"
                        />
                        <TouchableOpacity 
                            style={styles.ocrButton}
                            onPress={() => setIsOCRVisible(true)}
                        >
                            <MaterialIcons name="camera-alt" size={24} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.inputHint}>Dapat diedit jika hasil scan kurang akurat</Text>
                </View>

                {capturedImage && (
                    <View style={styles.formSection}>
                        <Text style={styles.label}>Foto Kendaraan</Text>
                        <View style={styles.imagePreviewContainer}>
                            <Image source={{ uri: capturedImage }} style={styles.imagePreview} />
                            <TouchableOpacity 
                                style={styles.removeImageButton}
                                onPress={() => setCapturedImage(null)}
                            >
                                <MaterialIcons name="close" size={20} color={Colors.white} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <View style={styles.formSection}>
                    <VehicleTypeSelector 
                        types={vehicleTypes} 
                        selectedId={selectedVehicleType?.id} 
                        onSelect={() => {}} 
                        onSelectType={handleVehicleTypeSelect} 
                    />
                </View>

                <View style={styles.formSection}>
                    <ServiceSelector 
                        services={serviceTypes} 
                        selectedServiceId={selectedServiceId} 
                        onSelect={setSelectedServiceId} 
                    />
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>Metode Pembayaran</Text>
                    <View style={styles.paymentContainer}>
                        {paymentMethods.map(method => (
                            <TouchableOpacity 
                                key={method.id}
                                style={[
                                    styles.paymentButton, 
                                    selectedPaymentMethodId === method.id && styles.paymentButtonSelected
                                ]}
                                onPress={() => setSelectedPaymentMethodId(method.id)}
                            >
                                <Text style={[
                                    styles.paymentText,
                                    selectedPaymentMethodId === method.id && styles.paymentTextSelected
                                ]}>
                                    {method.payment_method_name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.summarySection}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Pembayaran</Text>
                        <Text style={styles.summaryValue}>
                            Rp {calculateTotal().toLocaleString('id-ID')}
                        </Text>
                    </View>
                    
                    <View style={styles.buttonRow}>
                        <TouchableOpacity 
                            style={styles.cancelButton} 
                            onPress={() => router.back()}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.cancelText}>BATAL</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]} 
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.submitText}>
                                {isSubmitting ? 'Simpan...' : 'SIMPAN'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            <PlateOCRModal 
                visible={isOCRVisible} 
                onClose={() => setIsOCRVisible(false)} 
                onCapture={(plate, imagePath) => {
                    setPlateNumber(plate);
                    if (imagePath) setCapturedImage(imagePath);
                    setIsOCRVisible(false);
                }} 
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    formSection: {
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: 10,
    },
    errorLabel: {
        color: Colors.red,
    },
    plateInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    imagePreviewContainer: {
        position: 'relative',
        width: '100%',
        height: 200,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: Colors.greyDark,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removeImageButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    plateInput: {
        flex: 1,
        height: 55,
        backgroundColor: Colors.white,
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 20,
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: Colors.greyDark,
    },
    ocrButton: {
        width: 55,
        height: 55,
        backgroundColor: Colors.bgOrange,
        borderRadius: 12,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputHint: {
        fontSize: 12,
        color: Colors.grey,
        marginTop: 5,
        fontStyle: 'italic',
    },
    paymentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    paymentButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: Colors.white,
        borderRadius: 10,
        marginRight: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.greyDark,
    },
    paymentButtonSelected: {
        backgroundColor: Colors.bgOrange,
        borderColor: Colors.bgOrange,
    },
    paymentText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.black,
    },
    paymentTextSelected: {
        color: Colors.white,
    },
    summarySection: {
        marginTop: 10,
        padding: 20,
        backgroundColor: Colors.whiteDark,
        borderRadius: 15,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    summaryLabel: {
        fontSize: 16,
        color: Colors.grey,
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.bgOrange,
    },
    submitButton: {
        flex: 2,
        backgroundColor: Colors.bgOrange,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.greyDark,
    },
    cancelText: {
        color: Colors.grey,
        fontSize: 16,
        fontWeight: 'bold',
    }
});
