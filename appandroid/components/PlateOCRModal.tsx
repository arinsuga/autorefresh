import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { cleanPlateNumber } from '@/utils/PlateUtils';

interface PlateOCRModalProps {
    visible: boolean;
    onClose: () => void;
    onCapture: (plate: string) => void;
}

const PlateOCRModal: React.FC<PlateOCRModalProps> = ({ visible, onClose, onCapture }) => {
    const device = useCameraDevice('back');
    const cameraRef = useRef<Camera>(null);
    const [capturedPlate, setCapturedPlate] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCapture = async () => {
        if (!cameraRef.current) return;
        
        setIsProcessing(true);
        try {
            // In a real app, we would use a frame processor or send this image to an OCR service.
            // For now, we simulate a detection or let the user enter it if detection fails.
            const photo = await cameraRef.current.takePhoto({
                flash: 'auto',
            });
            
            // Simulating OCR result
            const simulatedResult = "B 1234 ABC"; 
            setCapturedPlate(simulatedResult);
            setIsEditing(true);
        } catch (error) {
            console.error('Capture failed', error);
            setIsEditing(true); // Allow manual entry on failure
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirm = () => {
        const cleaned = cleanPlateNumber(capturedPlate);
        onCapture(cleaned);
        setCapturedPlate('');
        setIsEditing(false);
        onClose();
    };

    if (!device) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View style={styles.container}>
                {!isEditing ? (
                    <>
                        <Camera
                            ref={cameraRef}
                            style={StyleSheet.absoluteFill}
                            device={device}
                            isActive={visible && !isEditing}
                            photo={true}
                        />
                        <View style={styles.overlay}>
                            <View style={styles.header}>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <MaterialIcons name="close" size={30} color={Colors.white} />
                                </TouchableOpacity>
                                <Text style={styles.headerTitle}>Scan Plate Number</Text>
                                <View style={{ width: 30 }} />
                            </View>
                            
                            <View style={styles.scannerFrame}>
                                <View style={styles.cornerTopLeft} />
                                <View style={styles.cornerTopRight} />
                                <View style={styles.cornerBottomLeft} />
                                <View style={styles.cornerBottomRight} />
                            </View>
                            
                            <Text style={styles.hint}>Align plate number within the frame</Text>
                            
                            <TouchableOpacity 
                                style={[styles.captureButton, isProcessing && { opacity: 0.5 }]} 
                                onPress={handleCapture}
                                disabled={isProcessing}
                            >
                                <View style={styles.captureInner} />
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <View style={styles.editContainer}>
                        <Text style={styles.editTitle}>Confirm Plate Number</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                value={capturedPlate}
                                onChangeText={setCapturedPlate}
                                autoFocus
                                autoCapitalize="characters"
                                placeholder="Input Plat Nomor"
                            />
                        </View>
                        <Text style={styles.editHint}>OCR result: {capturedPlate}</Text>
                        <Text style={styles.editHint}>Trimmed: {cleanPlateNumber(capturedPlate)}</Text>
                        
                        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                            <Text style={styles.confirmText}>TERAPKAN</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.retryButton} onPress={() => setIsEditing(false)}>
                            <Text style={styles.retryText}>Photo Ulang</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 40,
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    headerTitle: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
    },
    scannerFrame: {
        width: '80%',
        height: 150,
        borderWidth: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cornerTopLeft: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 30,
        height: 30,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderColor: Colors.bgOrange,
    },
    cornerTopRight: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 30,
        height: 30,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderColor: Colors.bgOrange,
    },
    cornerBottomLeft: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 30,
        height: 30,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderColor: Colors.bgOrange,
    },
    cornerBottomRight: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 30,
        height: 30,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderColor: Colors.bgOrange,
    },
    hint: {
        color: Colors.white,
        fontSize: 14,
        textAlign: 'center',
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 5,
        borderColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.white,
    },
    editContainer: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: Colors.black,
    },
    inputWrapper: {
        width: '100%',
        borderWidth: 2,
        borderColor: Colors.bgOrange,
        borderRadius: 15,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    input: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        height: 80,
        color: Colors.black,
    },
    editHint: {
        color: Colors.grey,
        fontSize: 14,
        marginBottom: 5,
    },
    confirmButton: {
        backgroundColor: Colors.bgOrange,
        width: '100%',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 40,
    },
    confirmText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    retryButton: {
        marginTop: 20,
        padding: 10,
    },
    retryText: {
        color: Colors.grey,
        fontSize: 16,
    }
});

export default PlateOCRModal;
