import React, { useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Dimensions, Alert, Platform, ActivityIndicator, Animated, PanResponder } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { cleanPlateNumber, formatPlateNumber } from '@/utils/PlateUtils';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

import TextRecognition from 'react-native-text-recognition';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const FRAME_WIDTH = SCREEN_WIDTH * 0.8;
const FRAME_HEIGHT = 150;

interface PlateOCRModalProps {
    visible: boolean;
    onClose: () => void;
    onCapture: (plate: string, imagePath?: string) => void;
}

const PlateOCRModal: React.FC<PlateOCRModalProps> = ({ visible, onClose, onCapture }) => {
    const device = useCameraDevice('back');
    const cameraRef = useRef<Camera>(null);
    const [capturedPlate, setCapturedPlate] = useState('');
    const [capturedImagePath, setCapturedImagePath] = useState('');
    const [detectedPlate, setDetectedPlate] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState<'none' | 'capturing' | 'recognizing'>('none');
    
    // Movable & Resizable frame state
    const [frameWidth, setFrameWidth] = useState(SCREEN_WIDTH * 0.8);
    const [frameHeight, setFrameHeight] = useState(120);
    const [currentFrameY, setCurrentFrameY] = useState((SCREEN_HEIGHT - 120) / 2);
    const [currentFrameX, setCurrentFrameX] = useState((SCREEN_WIDTH - (SCREEN_WIDTH * 0.8)) / 2);

    // PanResponder for Moving
    const moveResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            const newY = currentFrameY + gestureState.dy;
            const newX = currentFrameX + gestureState.dx;
            if (newY > 50 && newY < SCREEN_HEIGHT - frameHeight - 100) setCurrentFrameY(newY);
            if (newX > 10 && newX < SCREEN_WIDTH - frameWidth - 10) setCurrentFrameX(newX);
        },
        onPanResponderRelease: (_, gestureState) => {
            setCurrentFrameY(prev => Math.max(50, Math.min(prev + gestureState.dy, SCREEN_HEIGHT - frameHeight - 100)));
            setCurrentFrameX(prev => Math.max(10, Math.min(prev + gestureState.dx, SCREEN_WIDTH - frameWidth - 10)));
        },
    }), [currentFrameY, currentFrameX, frameWidth, frameHeight]);

    // PanResponder for Resizing
    const resizeResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            const newW = frameWidth + gestureState.dx;
            const newH = frameHeight + gestureState.dy;
            if (newW > 150 && newW < SCREEN_WIDTH - currentFrameX - 10) setFrameWidth(newW);
            if (newH > 80 && newH < SCREEN_HEIGHT - currentFrameY - 150) setFrameHeight(newH);
        },
        onPanResponderRelease: (_, gestureState) => {
            setFrameWidth(prev => Math.max(150, Math.min(prev + gestureState.dx, SCREEN_WIDTH - currentFrameX - 10)));
            setFrameHeight(prev => Math.max(80, Math.min(prev + gestureState.dy, SCREEN_HEIGHT - currentFrameY - 150)));
        },
    }), [frameWidth, frameHeight, currentFrameX, currentFrameY]);

    const isBusy = useRef(false);
    const isModalVisible = useRef(visible);

    React.useEffect(() => {
        isModalVisible.current = visible;
        if (!visible) {
            setDetectedPlate('');
            setCapturedPlate('');
            setCapturedImagePath('');
            setIsEditing(false);
            setIsProcessing(false);
            setProcessingStep('none');
            isBusy.current = false;
        }
    }, [visible]);

    const processPhoto = async (photo: any) => {
        try {
            // DIRECT OCR
            const cleanPath = Platform.OS === 'android' 
                ? photo.path.replace('file://', '') 
                : photo.path;

            const result = await TextRecognition.recognize(cleanPath);
            
            if (result && result.length > 0) {
                let bestCandidate = '';
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
                
                return bestCandidate ? formatPlateNumber(bestCandidate) : result[0];
            }
        } catch (e) {
            console.error('OCR Process failed', e);
        }
        return null;
    };

    const handleCapture = async () => {
        if (isProcessing) return;
        
        setIsProcessing(true);
        setProcessingStep('capturing');

        try {
            if (!cameraRef.current) throw new Error('Camera not ready');
            
            const photo = await cameraRef.current.takePhoto({ 
                flash: 'off',
                enableShutterSound: true 
            });

            setCapturedImagePath(photo.path); // SAVE THE FULL IMAGE PATH

            setProcessingStep('recognizing');
            await new Promise(resolve => setTimeout(resolve, 800));

            const result = await processPhoto(photo);
            setCapturedPlate(result || '');
            setIsEditing(true);
        } catch (error) {
            console.error('Manual capture failed', error);
            Alert.alert('Error', 'Gagal mengambil gambar.');
            setIsEditing(false);
        } finally {
            setIsProcessing(false);
            setProcessingStep('none');
        }
    };

    const handleConfirm = () => {
        const formatted = formatPlateNumber(capturedPlate);
        onCapture(formatted, capturedImagePath); // SEND BOTH TEXT AND IMAGE
        setCapturedPlate('');
        setCapturedImagePath('');
        setDetectedPlate('');
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
                            isActive={visible && !isEditing && processingStep !== 'recognizing'}
                            photo={true}
                        />
                        <View style={styles.overlay}>
                            <View style={styles.header}>
                                <TouchableOpacity onPress={() => {
                                    setDetectedPlate('');
                                    onClose();
                                }} style={styles.closeButton}>
                                    <MaterialIcons name="close" size={30} color={Colors.white} />
                                </TouchableOpacity>
                                <Text style={styles.headerTitle}>Scan Plat Nomor</Text>
                                <View style={{ width: 30 }} />
                            </View>
                            
                            <View style={styles.centerContainer}>
                                {/* Crop Masks (Dark Overlays) */}
                                <View style={[styles.mask, { top: 0, left: 0, right: 0, height: currentFrameY }]} />
                                <View style={[styles.mask, { top: currentFrameY + frameHeight, left: 0, right: 0, bottom: 0 }]} />
                                <View style={[styles.mask, { top: currentFrameY, left: 0, width: currentFrameX, height: frameHeight }]} />
                                <View style={[styles.mask, { top: currentFrameY, right: 0, left: currentFrameX + frameWidth, height: frameHeight }]} />

                                {/* Draggable & Resizable Frame */}
                                <View 
                                    style={[
                                        styles.draggableFrame,
                                        { 
                                            top: currentFrameY, 
                                            left: currentFrameX, 
                                            width: frameWidth, 
                                            height: frameHeight 
                                        }
                                    ]}
                                >
                                    <View style={styles.scannerFrame} {...moveResponder.panHandlers}>
                                        <View style={styles.cornerTopLeft} />
                                        <View style={styles.cornerTopRight} />
                                        <View style={styles.cornerBottomLeft} />
                                        <View style={styles.cornerBottomRight} />
                                        
                                        {/* Resize Handle */}
                                        <View 
                                            style={styles.resizeHandle} 
                                            {...resizeResponder.panHandlers}
                                        >
                                            <MaterialIcons name="aspect-ratio" size={24} color={Colors.bgOrange} />
                                        </View>
                                    </View>
                                    <Text style={styles.dragHint}>Tarik tengah untuk geser, pojok untuk ubah ukuran</Text>
                                </View>
                                
                                {detectedPlate && !isProcessing && (
                                    <View style={styles.detectedBadge}>
                                        <MaterialIcons name="check-circle" size={20} color={Colors.bgOrange} />
                                        <Text style={styles.detectedText}>{detectedPlate}</Text>
                                    </View>
                                )}
                            </View>
                            
                            <TouchableOpacity 
                                style={[styles.captureButton, isProcessing && { opacity: 0.5 }]} 
                                onPress={handleCapture}
                                disabled={isProcessing}
                            >
                                <View style={[styles.captureInner, detectedPlate && { backgroundColor: Colors.bgOrange }]} />
                            </TouchableOpacity>
                        </View>

                        {/* Processing Overlay */}
                        {processingStep !== 'none' && (
                            <View style={styles.processingOverlay}>
                                <View style={styles.processingBox}>
                                    <ActivityIndicator size="large" color={Colors.bgOrange} />
                                    <Text style={styles.processingText}>
                                        {processingStep === 'capturing' 
                                            ? 'Mohon Tunggu...\nJangan Gerakkan Kamera' 
                                            : 'Memproses Plat Nomor...'}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </>
                ) : (
                    <View style={styles.editContainer}>
                        <Text style={styles.editTitle}>Confirm Plate Number</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                value={capturedPlate}
                                onChangeText={(text) => setCapturedPlate(cleanPlateNumber(text))}
                                autoCapitalize="characters"
                                placeholder="Masukkan plat nomor"
                                placeholderTextColor="rgba(255,255,255,0.5)"
                            />
                        </View>
                        <Text style={styles.editHint}>OCR result: {capturedPlate}</Text>
                        <Text style={styles.editHint}>Standardized: {cleanPlateNumber(capturedPlate)}</Text>
                        
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
    centerContainer: {
        flex: 1,
        width: '100%',
    },
    mask: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    draggableFrame: {
        position: 'absolute',
        alignItems: 'center',
    },
    scannerFrame: {
        width: '100%',
        height: '100%',
        borderWidth: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resizeHandle: {
        position: 'absolute',
        bottom: -15,
        right: -15,
        backgroundColor: Colors.white,
        borderRadius: 15,
        padding: 5,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    dragHint: {
        color: Colors.white,
        fontSize: 10,
        marginTop: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 8,
        borderRadius: 5,
        position: 'absolute',
        bottom: -35,
        width: 250,
        textAlign: 'center',
    },
    detectedBadge: {
        position: 'absolute',
        top: 40,
        alignSelf: 'center',
        flexDirection: 'row',
        backgroundColor: Colors.white,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
        gap: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    detectedText: {
        color: Colors.black,
        fontSize: 18,
        fontWeight: 'bold',
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
    },
    processingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    processingBox: {
        backgroundColor: Colors.white,
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        width: '80%',
    },
    processingText: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.black,
        textAlign: 'center',
        lineHeight: 22,
    }
});

export default PlateOCRModal;
