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
    
    const [isProcessing, setIsProcessing] = useState(false);
    
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
            
            // 1. Resize/Normalize full photo
            const normalized = await manipulateAsync(
                getSafeUri(photo.path),
                [{ resize: { width: 1200 } }], 
                { compress: 0.8, format: SaveFormat.JPEG }
            );

            // 2. Perform Cropping Logic
            const { x, y, w, h } = boxState.current;
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
            
            // 4. Return result
            onCapture(formatPlateNumber(bestCandidate || ''), normalized.uri);
            onClose();
        } catch (e) {
            Alert.alert('Error', 'Gagal mengambil atau memproses gambar');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!device) return null;

    return (
        <Modal visible={visible} animationType="fade" transparent={false}>
            <View style={styles.container}>
                <Camera 
                    ref={cameraRef} 
                    style={StyleSheet.absoluteFill} 
                    device={device} 
                    isActive={visible} 
                    photo={true} 
                />
                
                {/* Crop Overlay */}
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

                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.iconButton}>
                        <MaterialIcons name="close" size={30} color={Colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Ambil Foto Kendaraan</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.cropHeader}>
                    <Text style={styles.cropInstruction}>Geser area ke Plat Nomor lalu tekan tombol capture</Text>
                </View>

                <View style={styles.cameraBottom}>
                    <TouchableOpacity 
                        style={[styles.captureButton, isProcessing && { opacity: 0.5 }]} 
                        onPress={handleTakePhoto} 
                        disabled={isProcessing}
                    >
                        <View style={styles.captureInner} />
                    </TouchableOpacity>
                </View>

                {isProcessing && (
                    <View style={styles.processingOverlay}>
                        <ActivityIndicator size="large" color={Colors.primary || Colors.white} />
                        <Text style={styles.processingText}>Tahan Kamera...</Text>
                        <Text style={styles.processingSubText}>Sedang memproses plat nomor</Text>
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
    cropHeader: { position: 'absolute', top: 100, left: 0, right: 0, alignItems: 'center', zIndex: 10 },
    cropInstruction: { color: Colors.white, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, fontSize: 14, textAlign: 'center', marginHorizontal: 20 },
    processingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', zIndex: 20 },
    processingText: { color: Colors.white, fontSize: 18, fontWeight: 'bold', marginTop: 20, textAlign: 'center' },
    processingSubText: { color: Colors.lightGray || '#ccc', fontSize: 14, marginTop: 10, textAlign: 'center', paddingHorizontal: 40 },
});

export default PlateOCRModal;
