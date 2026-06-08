import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Modal, 
    TouchableOpacity, 
    ScrollView, 
    TextInput, 
    Alert, 
    ActivityIndicator,
    Image,
    Platform,
    Dimensions,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import Styles from '@/constants/Styles';
import { MaterialIcons } from '@expo/vector-icons';
import { ITransaction } from '@/interfaces/ITransaction';
import { IVehicleType } from '@/interfaces/IVehicleType';
import { IServiceType } from '@/interfaces/IServiceType';
import VehicleTypeService from '@/services/VehicleTypeService';
import ServiceTypeService from '@/services/ServiceTypeService';
import TransactionService from '@/services/TransactionService';
import VehicleTypeSelector from '@/components/VehicleTypeSelector';
import ServiceSelector from '@/components/ServiceSelector';
import PlateOCRModal from '@/components/PlateOCRModal';
import { cleanPlateNumber, formatPlateNumber } from '@/utils/PlateUtils';
import Fileutils from '@/utils/Fileutils';
import * as FileSystem from 'expo-file-system';
import TextRecognition from 'react-native-text-recognition';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { showMessage } from 'react-native-flash-message';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface EditTransactionModalProps {
    visible: boolean;
    transaction: ITransaction | null;
    onClose: () => void;
    onSave: () => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ 
    visible, 
    transaction, 
    onClose, 
    onSave 
}) => {
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [vehicleTypes, setVehicleTypes] = useState<IVehicleType[]>([]);
    const [serviceTypes, setServiceTypes] = useState<IServiceType[]>([]);
    
    // Form fields
    const [plateNumber, setPlateNumber] = useState('');
    const [selectedVehicleType, setSelectedVehicleType] = useState<IVehicleType | null>(null);
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isOCRVisible, setIsOCRVisible] = useState(false);

    const resetForm = () => {
        setPlateNumber('');
        setSelectedVehicleType(null);
        setSelectedServiceId(null);
        setCapturedImage(null);
        setVehicleTypes([]);
        setServiceTypes([]);
    };

    useEffect(() => {
        if (visible && transaction) {
            setPlateNumber(transaction.plate_number);
            setCapturedImage(transaction.transaction_photo || null);
            fetchInitialData(transaction);
        } else if (!visible) {
            resetForm();
        }
    }, [visible, transaction]);

    const fetchInitialData = async (trx: ITransaction) => {
        setIsLoading(true);
        setSelectedVehicleType(null);
        setSelectedServiceId(null);
        setVehicleTypes([]);
        setServiceTypes([]);

        try {
            const vTypes = await VehicleTypeService.getActive();
            setVehicleTypes(vTypes);

            // Determine desired service and vehicle from transaction_services if available
            const txServiceObj = trx.transaction_services?.[0]?.service_type ?? null;

            // service id from transaction (may be string)
            const txServiceId = Number(trx.transaction_services?.[0]?.service_type_id ?? txServiceObj?.id ?? 0) || 0;

            // prefer vehicle id referenced by the service_type, otherwise use trx.vehicle_type_id
            const txVehicleIdFromService = Number(txServiceObj?.vehicle_type_id ?? 0) || 0;
            const txVehicleId = txVehicleIdFromService || Number(trx.vehicle_type_id ?? trx.vehicle_type?.id ?? 0) || 0;

            const currentType = vTypes.find(t => Number(t.id) === txVehicleId);

            if (currentType) {
                setSelectedVehicleType(currentType);
                const sTypes = await ServiceTypeService.getByVehicleType(currentType.id);
                setServiceTypes(sTypes);

                // If the transaction's service id exists in the loaded services, select it.
                const selectedId = txServiceId && sTypes.some(s => Number(s.id) === txServiceId)
                    ? txServiceId
                    : (sTypes[0]?.id ?? null);

                setSelectedServiceId(selectedId);
            } else if (vTypes.length > 0) {
                // Fallback: choose first active vehicle type and its first service
                const fallbackType = vTypes[0];
                setSelectedVehicleType(fallbackType);
                const sTypes = await ServiceTypeService.getByVehicleType(fallbackType.id);
                setServiceTypes(sTypes);
                setSelectedServiceId(sTypes[0]?.id ?? null);
            }
        } catch (error) {
            console.error('Failed to fetch data for edit', error);
            Alert.alert('Error', 'Gagal mengambil data referensi');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVehicleTypeSelect = async (type: IVehicleType) => {
        setSelectedVehicleType(type);
        setSelectedServiceId(null);
        try {
            const sTypes = await ServiceTypeService.getByVehicleType(type.id);
            setServiceTypes(sTypes);
            // If the transaction's current service is in the new types, keep it, otherwise reset
            const stillAvailable = sTypes.find(s => s.id === selectedServiceId);
            if (!stillAvailable && sTypes.length > 0) {
                setSelectedServiceId(sTypes[0].id);
            }
        } catch (error) {
            console.error('Failed to fetch service types', error);
        }
    };

    const processOCRCapture = async (imagePath: string, cropData: { x: number; y: number; w: number; h: number }) => {
        const uri = imagePath.startsWith('file://') ? imagePath : `file://${imagePath}`;
        setCapturedImage(uri);
        setIsOCRVisible(false);

        try {
            const normalized = await manipulateAsync(
                uri,
                [{ resize: { width: 1200 } }],
                { compress: 0.8, format: SaveFormat.JPEG }
            );

            const { x, y, w, h } = cropData;
            const pW = normalized.width;
            const pH = normalized.height;
            const screenAspect = SCREEN_WIDTH / SCREEN_HEIGHT;
            const photoAspect = pW / pH;

            let scale: number;
            let offsetX = 0;
            let offsetY = 0;

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
            }
        } catch (error) {
            console.warn('OCR failed for edit capture', error);
        }
    };

    const calculateTotal = () => {
        if (!selectedServiceId) return 0;
        const service = serviceTypes.find(s => s.id === selectedServiceId);
        return service ? service.service_price : 0;
    };

    const handleSave = async () => {
        if (!transaction?.id) return;
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

        setIsSaving(true);
        try {
            const total = calculateTotal();
            const service = serviceTypes.find(s => s.id === selectedServiceId);
            
            const formData = new FormData();
            formData.append('plate_number', cleanPlateNumber(plateNumber));
            formData.append('vehicle_type_id', selectedVehicleType.id.toString());
            formData.append('gross_total', total.toString());
            formData.append('net_total', total.toString());

            if (service) {
                formData.append('services[0][service_type_id]', service.id.toString());
                formData.append('services[0][service_price]', service.service_price.toString());
            }

            // Only upload if it's a new captured image (not the existing URL)
            if (capturedImage && capturedImage.startsWith('file://')) {
                let uploadUri = capturedImage;
                
                // Compress if needed
                const fileInfo = await FileSystem.getInfoAsync(capturedImage);
                if (fileInfo.exists && fileInfo.size > 1024 * 1024) {
                    const compressed = await manipulateAsync(
                        capturedImage,
                        [{ resize: { width: 1024 } }],
                        { compress: 0.6, format: SaveFormat.JPEG }
                    );
                    uploadUri = compressed.uri;
                }

                const filePath = Fileutils.path(uploadUri);
                const fileName = Fileutils.name(filePath) || 'edit_transaction.jpg';
                const fileType = Fileutils.type(filePath) || 'image/jpeg';

                formData.append('upload', {
                    uri: uploadUri,
                    name: fileName,
                    type: fileType,
                } as any);
            }

            await TransactionService.update(transaction.id, formData);
            
            showMessage({
                message: "Success",
                description: "Transaksi berhasil diperbarui",
                type: "success",
            });
            
            onSave();
            onClose();
        } catch (error: any) {
            console.error('Gagal memperbarui transaksi', error);
            Alert.alert('Error', 'Gagal memperbarui transaksi');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Edit Transaksi</Text>
                        <TouchableOpacity onPress={onClose} disabled={isSaving}>
                            <MaterialIcons name="close" size={28} color={Colors.black} />
                        </TouchableOpacity>
                    </View>

                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.bgOrange} />
                        </View>
                    ) : (
                        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
                            <View style={styles.section}>
                                <Text style={styles.label}>Plat Nomor</Text>
                                <View style={styles.plateInputContainer}>
                                    <TextInput
                                        style={styles.plateInput}
                                        value={plateNumber}
                                        onChangeText={(text) => setPlateNumber(cleanPlateNumber(text))}
                                        placeholder="B1234ABC"
                                        autoCapitalize="characters"
                                    />
                                    <TouchableOpacity 
                                        style={styles.cameraIconBtn}
                                        onPress={() => setIsOCRVisible(true)}
                                    >
                                        <MaterialIcons name="camera-alt" size={24} color={Colors.white} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.label}>Foto Kendaraan</Text>
                                {capturedImage ? (
                                    <View style={styles.imagePreviewContainer}>
                                        <Image source={{ uri: capturedImage }} style={styles.imagePreview} />
                                        <TouchableOpacity 
                                            style={styles.retakeBtn}
                                            onPress={() => setIsOCRVisible(true)}
                                        >
                                            <MaterialIcons name="refresh" size={20} color={Colors.white} />
                                            <Text style={styles.retakeText}>Ambil Ulang</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity 
                                        style={styles.placeholderImage}
                                        onPress={() => setIsOCRVisible(true)}
                                    >
                                        <MaterialIcons name="add-a-photo" size={40} color={Colors.grey} />
                                        <Text style={{ color: Colors.grey, marginTop: 10 }}>Tambah Foto</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <VehicleTypeSelector 
                                types={vehicleTypes} 
                                selectedId={selectedVehicleType?.id} 
                                onSelect={(id) => {
                                    const type = vehicleTypes.find((type) => type.id === id);
                                    if (type) {
                                        handleVehicleTypeSelect(type);
                                    }
                                }} 
                            />

                            <ServiceSelector 
                                services={serviceTypes} 
                                selectedServiceId={selectedServiceId} 
                                onSelect={setSelectedServiceId} 
                            />

                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Total Baru</Text>
                                <Text style={styles.totalValue}>
                                    Rp {calculateTotal().toLocaleString('id-ID')}
                                </Text>
                            </View>

                            <View style={{ height: 20 }} />
                        </ScrollView>
                    )}

                    <View style={styles.footer}>
                        <TouchableOpacity 
                            style={[styles.cancelBtn, isSaving && { opacity: 0.5 }]} 
                            onPress={onClose}
                            disabled={isSaving}
                        >
                            <Text style={styles.cancelBtnText}>BATAL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.saveBtn, isSaving && { opacity: 0.7 }]} 
                            onPress={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <ActivityIndicator size="small" color={Colors.white} />
                            ) : (
                                <Text style={styles.saveBtnText}>SIMPAN PERUBAHAN</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <PlateOCRModal 
                visible={isOCRVisible} 
                onClose={() => setIsOCRVisible(false)} 
                onCapture={(imagePath, cropData) => {
                    processOCRCapture(imagePath, cropData);
                }} 
            />
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: '90%',
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.whiteDark,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.black,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    form: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: 8,
    },
    plateInputContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    plateInput: {
        flex: 1,
        height: 50,
        backgroundColor: Colors.whiteDark,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.black,
    },
    cameraIconBtn: {
        width: 50,
        height: 50,
        backgroundColor: Colors.bgOrange,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePreviewContainer: {
        width: '100%',
        height: 180,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    retakeBtn: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    retakeText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    placeholderImage: {
        width: '100%',
        height: 180,
        backgroundColor: Colors.whiteDark,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.greyDark,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: Colors.whiteDark,
    },
    totalLabel: {
        fontSize: 16,
        color: Colors.grey,
    },
    totalValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.bgOrange,
    },
    footer: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.whiteDark,
    },
    cancelBtn: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.greyDark,
    },
    cancelBtnText: {
        fontWeight: 'bold',
        color: Colors.grey,
    },
    saveBtn: {
        flex: 2,
        height: 50,
        backgroundColor: Colors.bgOrange,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    saveBtnText: {
        fontWeight: 'bold',
        color: Colors.white,
    },
});

export default EditTransactionModal;
