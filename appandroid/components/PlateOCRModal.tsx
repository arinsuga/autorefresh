import React, { useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Dimensions, Alert, Platform, ActivityIndicator, PanResponder, Image } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { cleanPlateNumber, formatPlateNumber } from '@/utils/PlateUtils';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

import TextRecognition from 'react-native-text-recognition';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PlateOCRModalProps {
    visible: boolean;
    onClose: () => void;
    onCapture: (plate: string, imagePath?: string) => void;
}

const PlateOCRModal: React.FC<PlateOCRModalProps> = ({ visible, onClose, onCapture }) => {
    const device = useCameraDevice('back');
    const cameraRef = useRef<Camera>(null);
    
    const [step, setStep] = useState<'camera' | 'crop' | 'edit'>('camera');
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [tempImagePath, setTempImagePath] = useState('');
    const [capturedPlate, setCapturedPlate] = useState('');

    // Crop Box State
    const [boxX, setBoxX] = useState((SCREEN_WIDTH - (SCREEN_WIDTH * 0.8)) / 2);
    const [boxY, setBoxY] = useState((SCREEN_HEIGHT - 150) / 2);
    const [boxW, setBoxW] = useState(SCREEN_WIDTH * 0.8);
    const [boxH, setBoxH] = useState(150);

    const boxState = useRef({ x: boxX, y: boxY, w: boxW, h: boxH });
    const gestureType = useRef<'none' | 'move' | 'tl' | 'tr' | 'bl' | 'br'>('none');
    const startState = useRef({ x: 0, y: 0, w: 0, h: 0 });

    const panResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
            const { pageX, pageY } = evt.nativeEvent;
            const { x, y, w, h } = boxState.current;
            const handleSize = 45;
            const hitTL = pageX >= x - handleSize && pageX <= x + handleSize && pageY >= y - handleSize && pageY <= y + handleSize;
            const hitTR = pageX >= x + w - handleSize && pageX <= x + w + handleSize && pageY >= y - handleSize && pageY <= y + handleSize;
            const hitBL = pageX >= x - handleSize && pageX <= x + handleSize && pageY >= y + h - handleSize && pageY <= y + h + handleSize;
            const hitBR = pageX >= x + w - handleSize && pageX <= x + w + handleSize && pageY >= y + h - handleSize && pageY <= y + h + handleSize;

            if (hitTL) gestureType.current = 'tl';
            else if (hitTR) gestureType.current = 'tr';
            else if (hitBL) gestureType.current = 'bl';
            else if (hitBR) gestureType.current = 'br';
            else if (pageX >= x && pageX <= x + w && pageY >= y && pageY <= y + h) gestureType.current = 'move';
            else gestureType.current = 'none';

            startState.current = { x, y, w, h };
        },
        onPanResponderMove: (_, gestureState) => {
            const { dx, dy } = gestureState;
            const { x, y, w, h } = startState.current;
            const type = gestureType.current;
            let nx = x, ny = y, nw = w, nh = h;

            if (type === 'move') {
                nx = Math.max(0, Math.min(x + dx, SCREEN_WIDTH - w));
                ny = Math.max(100, Math.min(y + dy, SCREEN_HEIGHT - h - 180));
            } else if (type === 'br') {
                nw = Math.max(120, Math.min(w + dx, SCREEN_WIDTH - x));
                nh = Math.max(60, Math.min(h + dy, SCREEN_HEIGHT - y - 180));
            } else if (type === 'tl') {
                const fdx = Math.max(-x, Math.min(dx, w - 120));
                const fdy = Math.max(-y + 100, Math.min(dy, h - 60));
                nx = x + fdx; ny = y + fdy; nw = w - fdx; nh = h - fdy;
            } else if (type === 'tr') {
                const fdy = Math.max(-y + 100, Math.min(dy, h - 60));
                ny = y + fdy; nw = Math.max(120, Math.min(w + dx, SCREEN_WIDTH - x)); nh = h - fdy;
            } else if (type === 'bl') {
                const fdx = Math.max(-x, Math.min(dx, w - 120));
                nx = x + fdx; nw = w - fdx; nh = Math.max(60, Math.min(h + dy, SCREEN_HEIGHT - y - 180));
            }

            if (type !== 'none') {
                boxState.current = { x: nx, y: ny, w: nw, h: nh };
                setBoxX(nx); setBoxY(ny); setBoxW(nw); setBoxH(nh);
            }
        },
        onPanResponderRelease: () => { gestureType.current = 'none'; }
    }), []);

    React.useEffect(() => {
        if (!visible) {
            setStep('camera');
            setTempImagePath('');
            setCapturedPlate('');
            setIsProcessing(false);
        }
    }, [visible]);

    const getSafeUri = (path: string) => {
        if (!path) return '';
        return path.startsWith('file://') ? path : 'file://' + path;
    };

    const handleTakePhoto = async () => {
        if (!cameraRef.current) return;
        try {
            setIsProcessing(true);
            const photo = await cameraRef.current.takePhoto({ 
                flash: 'off',
                qualityPrioritization: 'speed'
            });
            
            // OPTIMIZATION: Resize full photo immediately to save space and upload time
            const compressed = await manipulateAsync(
                getSafeUri(photo.path),
                [{ resize: { width: 1200 } }], // Resize to reasonable width
                { compress: 0.6, format: SaveFormat.JPEG }
            );

            setTempImagePath(compressed.uri);
            setStep('crop');
        } catch (e) {
            Alert.alert('Error', 'Gagal mengambil gambar');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleApplyCrop = async () => {
        try {
            setIsProcessing(true);
            const { x, y, w, h } = boxState.current;

            const normalized = await manipulateAsync(
                getSafeUri(tempImagePath),
                [],
                { compress: 0.8, format: SaveFormat.JPEG }
            );

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
            
            setCapturedPlate(bestCandidate || '');
            setStep('edit');
        } catch (e) {
            Alert.alert('Error', 'Gagal mengenali plat nomor');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirm = () => {
        onCapture(formatPlateNumber(capturedPlate), tempImagePath);
        onClose();
    };

    if (!device) return null;

    return (
        <Modal visible={visible} animationType="fade" transparent={false}>
            <View style={styles.container}>
                {step === 'camera' && (
                    <>
                        <Camera ref={cameraRef} style={StyleSheet.absoluteFill} device={device} isActive={visible && step === 'camera'} photo={true} />
                        <View style={styles.header}>
                            <TouchableOpacity onPress={onClose} style={styles.iconButton}>
                                <MaterialIcons name="close" size={30} color={Colors.white} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Ambil Foto Kendaraan</Text>
                            <View style={{ width: 40 }} />
                        </View>
                        <View style={styles.cameraBottom}>
                            <TouchableOpacity style={[styles.captureButton, isProcessing && { opacity: 0.5 }]} onPress={handleTakePhoto} disabled={isProcessing}>
                                <View style={styles.captureInner} />
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {step === 'crop' && (
                    <>
                        <View style={styles.cropContainer}>
                            <Image source={{ uri: getSafeUri(tempImagePath) }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                            <View style={styles.fullOverlay} {...panResponder.panHandlers}>
                                <View style={[styles.mask, { top: 0, left: 0, right: 0, height: boxY }]} />
                                <View style={[styles.mask, { top: boxY + boxH, left: 0, right: 0, bottom: 0 }]} />
                                <View style={[styles.mask, { top: boxY, left: 0, width: boxX, height: boxH }]} />
                                <View style={[styles.mask, { top: boxY, right: 0, left: boxX + boxW, height: boxH }]} />
                                <View style={[styles.draggableFrame, { top: boxY, left: boxX, width: boxW, height: boxH }]} pointerEvents="none">
                                    <View style={styles.scannerFrame}>
                                        <View style={styles.cornerTL} /><View style={styles.cornerTR} /><View style={styles.cornerBL} /><View style={styles.cornerBR} />
                                        <View style={styles.gridV} /><View style={styles.gridV2} /><View style={styles.gridH} /><View style={styles.gridH2} />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.cropHeader}>
                                <Text style={styles.cropInstruction}>Geser & Sesuaikan area ke Plat Nomor</Text>
                            </View>
                            <View style={styles.cropActions}>
                                <TouchableOpacity style={styles.actionButtonCircle} onPress={() => setStep('camera')}>
                                    <MaterialIcons name="close" size={30} color={Colors.white} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.actionButtonCircle, { backgroundColor: Colors.bgOrange }]} onPress={handleApplyCrop} disabled={isProcessing}>
                                    {isProcessing ? <ActivityIndicator color={Colors.white} /> : <MaterialIcons name="check" size={35} color={Colors.white} />}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                )}

                {step === 'edit' && (
                    <View style={styles.editContainer}>
                        <Text style={styles.editTitle}>Konfirmasi Hasil OCR</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput 
                                style={styles.input} 
                                value={capturedPlate} 
                                onChangeText={(text) => setCapturedPlate(cleanPlateNumber(text))} 
                                autoCapitalize="characters" 
                                placeholder="PLAT NOMOR" 
                            />
                        </View>
                        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                            <Text style={styles.confirmText}>TERAPKAN</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.retryButton} onPress={() => setStep('camera')}>
                            <Text style={styles.retryText}>Ulangi Foto</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.black },
    header: { position: 'absolute', top: 40, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, zIndex: 10 },
    headerTitle: { color: Colors.white, fontSize: 18, fontWeight: 'bold' },
    iconButton: { padding: 10 },
    cameraBottom: { position: 'absolute', bottom: 50, alignSelf: 'center' },
    captureButton: { width: 80, height: 80, borderRadius: 40, borderWidth: 5, borderColor: Colors.white, justifyContent: 'center', alignItems: 'center' },
    captureInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.white },
    cropContainer: { flex: 1 },
    fullOverlay: { ...StyleSheet.absoluteFillObject },
    mask: { position: 'absolute', backgroundColor: 'rgba(0,0,0,0.6)' },
    draggableFrame: { position: 'absolute', borderWidth: 1, borderColor: Colors.white },
    scannerFrame: { width: '100%', height: '100%' },
    cornerTL: { position: 'absolute', top: -3, left: -3, width: 30, height: 30, borderTopWidth: 8, borderLeftWidth: 8, borderColor: Colors.white },
    cornerTR: { position: 'absolute', top: -3, right: -3, width: 30, height: 30, borderTopWidth: 8, borderRightWidth: 8, borderColor: Colors.white },
    cornerBL: { position: 'absolute', bottom: -3, left: -3, width: 30, height: 30, borderBottomWidth: 8, borderLeftWidth: 8, borderColor: Colors.white },
    cornerBR: { position: 'absolute', bottom: -3, right: -3, width: 30, height: 30, borderBottomWidth: 8, borderRightWidth: 8, borderColor: Colors.white },
    gridV: { position: 'absolute', left: '33%', top: 0, bottom: 0, width: 0.5, backgroundColor: 'rgba(255,255,255,0.4)' },
    gridV2: { position: 'absolute', left: '66%', top: 0, bottom: 0, width: 0.5, backgroundColor: 'rgba(255,255,255,0.4)' },
    gridH: { position: 'absolute', top: '33%', left: 0, right: 0, height: 0.5, backgroundColor: 'rgba(255,255,255,0.4)' },
    gridH2: { position: 'absolute', top: '66%', left: 0, right: 0, height: 0.5, backgroundColor: 'rgba(255,255,255,0.4)' },
    cropHeader: { position: 'absolute', top: 60, left: 0, right: 0, alignItems: 'center' },
    cropInstruction: { color: Colors.white, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, fontSize: 14 },
    cropActions: { position: 'absolute', bottom: 60, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },
    actionButtonCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' },
    editContainer: { flex: 1, backgroundColor: Colors.white, padding: 30, justifyContent: 'center', alignItems: 'center' },
    editTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 30, color: Colors.black },
    inputWrapper: { width: '100%', borderWidth: 2, borderColor: Colors.bgOrange, borderRadius: 15, paddingHorizontal: 20, marginBottom: 15 },
    input: { fontSize: 36, fontWeight: 'bold', textAlign: 'center', height: 90, color: Colors.black },
    confirmButton: { backgroundColor: Colors.bgOrange, width: '100%', padding: 20, borderRadius: 15, alignItems: 'center' },
    confirmText: { color: Colors.white, fontSize: 18, fontWeight: 'bold' },
    retryButton: { marginTop: 30, padding: 10 },
    retryText: { color: Colors.grey, fontSize: 16, textDecorationLine: 'underline' }
});

export default PlateOCRModal;
