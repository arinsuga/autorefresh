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
    Image,
    Dimensions,
    ActivityIndicator
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
import { cleanPlateNumber, formatPlateNumber } from '@/utils/PlateUtils';
import moment from 'moment';
import { showMessage } from 'react-native-flash-message';
import Fileutils from '@/utils/Fileutils';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import TextRecognition from 'react-native-text-recognition';
import * as FileSystem from 'expo-file-system';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
    const [ocrStatus, setOcrStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
    const [ocrMessage, setOcrMessage] = useState('');

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
            if (sTypes.length > 0) {
                setSelectedServiceId(sTypes[0].id);
            }
        } catch (error) {
            console.error('Failed to fetch service types', error);
        }
    };

    const calculateTotal = () => {
        if (!selectedServiceId) return 0;
        const service = serviceTypes.find(s => s.id === selectedServiceId);
        return service ? service.service_price : 0;
    };

    const processOCR = async (imagePath: string, cropData: { x: number, y: number, w: number, h: number }) => {
        setOcrStatus('processing');
        setOcrMessage('Sedang memproses plat nomor...');
        
        try {
            const uri = imagePath.startsWith('file://') ? imagePath : `file://${imagePath}`;
            
            // 1. Normalize full photo to a consistent size for cropping logic
            const normalized = await manipulateAsync(
                uri,
                [{ resize: { width: 1200 } }], 
                { compress: 0.8, format: SaveFormat.JPEG }
            );

            // 2. Perform Cropping Logic
            const { x, y, w, h } = cropData;
            const pW = normalized.width;
            const pH = normalized.height;
            const screenAspect = SCREEN_WIDTH / SCREEN_HEIGHT;
            const photoAspect = pW / pH;

            let scale, offsetX = 0, offsetY = 0;
            if (photoAspect > screenAspect) {
                scale = pH / SCREEN_HEIGHT;
                offsetX = (pW - (SCREEN_WIDTH * scale)) / 2;
            } else {
                scale = pW / SCREEN_WIDTH;
                offsetY = (pH - (SCREEN_HEIGHT * scale)) / 2;
            }

            const cropX = (x * scale) + offsetX;
            const cropY = (y * scale) + offsetY;
            const cropW = w * scale;
            const cropH = h * scale;

            const cropped = await manipulateAsync(
                normalized.uri,
                [
                    {
                        crop: {
                            originX: Math.max(0, Math.floor(cropX)),
                            originY: Math.max(0, Math.floor(cropY)),
                            width: Math.min(Math.floor(cropW), pW - Math.floor(cropX)),
                            height: Math.min(Math.floor(cropH), pH - Math.floor(cropY)),
                        },
                    },
                ],
                { compress: 1.0, format: SaveFormat.JPEG }
            );

            // 3. OCR
            const cleanPath = Platform.OS === 'android' ? cropped.uri.replace('file://', '') : cropped.uri;
            const result = await TextRecognition.recognize(cleanPath);
            
            let bestCandidate = '';
            if (result && result.length > 0) {
                let highestScore = -1;
                result.forEach(line => {
                    const cleanedLine = cleanPlateNumber(line);
                    if (!cleanedLine) return;
                    let score = 0;
                    if (/^[A-Z]{1,2}\d{1,4}[A-Z]{1,3}$/.test(cleanedLine)) score += 100;
                    else if (/^[A-Z]{1,2}\d{1,4}/.test(cleanedLine)) score += 50;
                    if (cleanedLine.length >= 4 && cleanedLine.length <= 9) score += 20;
                    if (score > highestScore) {
                        highestScore = score;
                        bestCandidate = cleanedLine;
                    }
                });
                if (!bestCandidate) bestCandidate = result[0];
            }
            
            const detectedPlate = formatPlateNumber(bestCandidate || '');
            if (detectedPlate) {
                setPlateNumber(detectedPlate);
                setOcrStatus('success');
                setOcrMessage(`Terdeteksi: ${detectedPlate}`);
            } else {
                setOcrStatus('failed');
                setOcrMessage('Gagal mendeteksi plat nomor');
            }
        } catch (error) {
            console.error('OCR Background Error:', error);
            setOcrStatus('failed');
            setOcrMessage('Gagal memproses gambar');
        }
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

            console.log("===== Inside submit =====");

            if (capturedImage) {
                let uploadUri = capturedImage;
                
                // 1. Check file size and compress if needed (must be under 1MB)
                try {
                    const fileInfo = await FileSystem.getInfoAsync(capturedImage);
                    if (fileInfo.exists && fileInfo.size > 1024 * 1024) {
                        console.log(`Compressing image: ${fileInfo.size} bytes`);
                        const compressed = await manipulateAsync(
                            capturedImage,
                            [{ resize: { width: 1024 } }],
                            { compress: 0.6, format: SaveFormat.JPEG }
                        );
                        uploadUri = compressed.uri;
                        console.log(`Compressed to: ${compressed.width}x${compressed.height}`);
                    }
                } catch (e) {
                    console.warn('Failed to check size or compress', e);
                }

                const filePath = Fileutils.path(uploadUri);
                const fileName = Fileutils.name(filePath) || 'transaction.jpg';
                const fileType = Fileutils.type(filePath) || 'image/jpeg';
                
                console.log("=== Transaction Upload Debug ===");
                console.log("URI:", uploadUri);
                console.log("FileName:", fileName);
                console.log("FileType:", fileType);

                formData.append('upload', {
                    uri: uploadUri,
                    name: fileName,
                    type: fileType,
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
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={[styles.plateInput, { color: theme.text }]}
                                value={plateNumber}
                                onChangeText={(text) => setPlateNumber(cleanPlateNumber(text))}
                                placeholder="contoh input: B1234ABC"
                                placeholderTextColor={Colors.grey}
                                autoCapitalize="characters"
                            />
                            {plateNumber.length > 0 && (
                                <TouchableOpacity 
                                    style={styles.clearButton}
                                    onPress={() => setPlateNumber('')}
                                >
                                    <MaterialIcons name="cancel" size={22} color={Colors.grey} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <TouchableOpacity 
                            style={styles.ocrButton}
                            onPress={() => setIsOCRVisible(true)}
                        >
                            <MaterialIcons name="camera-alt" size={24} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                    {ocrStatus !== 'idle' && (
                        <View style={styles.ocrStatusContainer}>
                            {ocrStatus === 'processing' && <ActivityIndicator size="small" color={Colors.bgOrange} style={{ marginRight: 8 }} />}
                            {ocrStatus === 'success' && <MaterialIcons name="check-circle" size={16} color={Colors.green || '#4CAF50'} style={{ marginRight: 8 }} />}
                            {ocrStatus === 'failed' && <MaterialIcons name="error" size={16} color={Colors.red || '#F44336'} style={{ marginRight: 8 }} />}
                            <Text style={[
                                styles.ocrStatusText,
                                ocrStatus === 'success' && { color: Colors.green || '#4CAF50' },
                                ocrStatus === 'failed' && { color: Colors.red || '#F44336' },
                                ocrStatus === 'processing' && { color: Colors.bgOrange }
                            ]}>
                                {ocrMessage}
                            </Text>
                        </View>
                    )}
                    <Text style={styles.inputHint}>Dapat diedit jika hasil scan kurang akurat</Text>
                </View>

                {capturedImage && (
                    <View style={styles.formSection}>
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>Foto Kendaraan</Text>
                        </View>
                        <View style={styles.imagePreviewContainer}>
                            <Image source={{ uri: capturedImage }} style={styles.imagePreview} />
                            
                            {ocrStatus === 'processing' && (
                                <View style={styles.imageProcessingOverlay}>
                                    <ActivityIndicator size="large" color={Colors.white} />
                                    <Text style={styles.imageProcessingText}>Scanning Plate...</Text>
                                </View>
                            )}

                            <TouchableOpacity 
                                style={styles.removeImageButton}
                                onPress={() => {
                                    setCapturedImage(null);
                                    setOcrStatus('idle');
                                    setOcrMessage('');
                                }}
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
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            <TouchableOpacity 
                style={[styles.fab, isSubmitting && { opacity: 0.7 }]} 
                onPress={handleSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <Text style={styles.submitText}>...</Text>
                ) : (
                    <View style={styles.fabContent}>
                        <MaterialIcons name="save" size={28} color={Colors.white} />
                        <Text style={styles.fabText}>SIMPAN</Text>
                    </View>
                )}
            </TouchableOpacity>

            <PlateOCRModal 
                visible={isOCRVisible} 
                onClose={() => setIsOCRVisible(false)} 
                onCapture={(imagePath, cropData) => {
                    const uri = imagePath.startsWith('file://') ? imagePath : `file://${imagePath}`;
                    setCapturedImage(uri);
                    setIsOCRVisible(false);
                    // Start OCR in next tick to allow modal closing animation to be smooth
                    setTimeout(() => {
                        processOCR(uri, cropData);
                    }, 100);
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
    },
    inputWrapper: {
        flex: 1,
        position: 'relative',
        justifyContent: 'center',
    },
    clearButton: {
        position: 'absolute',
        right: 12,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: Colors.bgOrange,
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 30,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 140,
    },
    fabContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    fabText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    ocrStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    ocrStatusText: {
        fontSize: 13,
        fontWeight: '600',
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    ocrLabelStatus: {
        fontSize: 12,
        color: Colors.bgOrange,
        fontStyle: 'italic',
    },
    imageProcessingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageProcessingText: {
        color: Colors.white,
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 16,
    }
});
