import React, { useState, useEffect } from 'react';
import {
    View,
    Modal,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
} from 'react-native';
import moment from 'moment';

//Components
import FieldDateRange from '@/components/FieldDateRange/FieldDateRange';
import BranchSelector from '@/components/BranchSelector';
import VehicleTypeSelector from '@/components/VehicleTypeSelector';
import ServiceSelector from '@/components/ServiceSelector';
import Icon from '@/components/Icon/Icon';

//Constants
import { Colors } from '@/constants/Colors';
import Styles from '@/constants/Styles';
import Dates from '@/constants/Dates';

//Interfaces
import { IBranch } from '@/interfaces/IBranch';
import { IVehicleType } from '@/interfaces/IVehicleType';
import { IServiceType } from '@/interfaces/IServiceType';

//Services
import VehicleTypeService from '@/services/VehicleTypeService';
import ServiceTypeService from '@/services/ServiceTypeService';

interface IReportFilterProps {
    visible: boolean;
    initialBranch?: IBranch | null;
    onView: (filters: any) => void;
    onPrint: (filters: any) => void;
    onExportPDF: (filters: any) => void;
    onExportCSV: (filters: any) => void;
    onCancel: () => void;
}

const ALL_VEHICLE_TYPE: IVehicleType = {
    id: 0,
    vehicle_type_name: 'Semua',
    vehicle_type_code: 'ALL',
    is_active: 1
};

const ReportFilterDialog = ({ 
    visible, 
    initialBranch,
    onView, 
    onPrint, 
    onExportPDF, 
    onExportCSV, 
    onCancel 
}: IReportFilterProps) => {
    const [reportType, setReportType] = useState<'Summary' | 'Detail'>('Summary');
    const [selectedBranch, setSelectedBranch] = useState<IBranch | null>(initialBranch || null);
    const [dateFrom, setDateFrom] = useState<string>(moment().startOf('month').format(Dates.format.isoDate));
    const [dateTo, setDateTo] = useState<string>(moment().format(Dates.format.isoDate));
    const [vehicleTypes, setVehicleTypes] = useState<IVehicleType[]>([]);
    const [selectedVehicleIds, setSelectedVehicleIds] = useState<number[]>([]);
    const [services, setServices] = useState<IServiceType[]>([]);
    const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const vTypes = await VehicleTypeService.getActive();
                setVehicleTypes([ALL_VEHICLE_TYPE, ...vTypes]);
                setSelectedVehicleIds([0]); // Default to "All"
            } catch (error) {
                console.error('Error fetching metadata', error);
            }
        };
        if (visible) fetchMetadata();
    }, [visible]);

    useEffect(() => {
        const fetchServices = async () => {
            if (selectedVehicleIds.length === 0) return;
            try {
                // Fetch all active services
                const allSTypes = await ServiceTypeService.getActive();
                
                // Filter locally based on selected vehicle types
                const filteredSTypes = selectedVehicleIds.includes(0)
                    ? allSTypes
                    : allSTypes.filter(s => selectedVehicleIds.includes(s.vehicle_type_id));
                
                setServices(filteredSTypes);
                
                // When vehicle selection changes, we should ideally keep previous selections 
                // but for simplicity and correctness in reports, we select all available for the new filter
                setSelectedServiceIds(filteredSTypes.map(s => s.id));
            } catch (error) {
                console.error('Error fetching services', error);
            }
        };
        fetchServices();
    }, [selectedVehicleIds]);

    const getFilters = () => {
        // If "All" vehicles selected or Summary report, don't filter by services
        const effectiveServiceIds = (selectedVehicleIds.includes(0) || reportType === 'Summary')
            ? [] 
            : selectedServiceIds;

        return {
            reportType,
            branch: selectedBranch,
            dateFrom,
            dateTo,
            vehicleIds: selectedVehicleIds,
            serviceIds: effectiveServiceIds
        };
    };

    const handleToggleService = (id: number) => {
        if (id === -1) {
            // Deselect all (keep empty for reports, or just first one if required)
            setSelectedServiceIds([]);
            return;
        }
        if (id === -2) {
            // Select all
            setSelectedServiceIds(services.map(s => s.id));
            return;
        }

        setSelectedServiceIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(i => i !== id);
            }
            return [...prev, id];
        });
    };

    const handleToggleVehicle = (id: number) => {
        setSelectedVehicleIds(prev => {
            if (id === 0) {
                // If "All" is selected, clear others and just keep "All"
                return [0];
            } else {
                // If another type is selected
                let next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
                // Remove "All" if it was there
                next = next.filter(i => i !== 0);
                // If nothing left, default back to "All"
                if (next.length === 0) return [0];
                return next;
            }
        });
    };

    const dlgWidth = Dimensions.get('window').width * 0.95;

    return (
        <Modal animationType='slide' transparent={true} visible={visible}>
            <View style={styles.overlay}>
                <View style={[styles.container, { width: dlgWidth }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Laporan Filter & Ekspor</Text>
                        <TouchableOpacity onPress={onCancel}>
                            <Icon.ArrowDown color={Colors.white} size={24} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                        {/* Report Type */}
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Jenis Laporan</Text>
                            <View style={styles.toggleContainer}>
                                <TouchableOpacity 
                                    style={[styles.toggleButton, reportType === 'Summary' && styles.toggleButtonActive]}
                                    onPress={() => setReportType('Summary')}
                                >
                                    <Text style={[styles.toggleText, reportType === 'Summary' && styles.toggleTextActive]}>Ringkasan</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.toggleButton, reportType === 'Detail' && styles.toggleButtonActive]}
                                    onPress={() => setReportType('Detail')}
                                >
                                    <Text style={[styles.toggleText, reportType === 'Detail' && styles.toggleTextActive]}>Rincian</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Branch */}
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Cabang</Text>
                            <BranchSelector 
                                selectedBranch={selectedBranch} 
                                onSelect={(branch) => setSelectedBranch(branch)} 
                                allowAll={true}
                            />
                        </View>

                        {/* Dates */}
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Periode</Text>
                            <View style={styles.row}>
                                <View style={{ flex: 1, marginRight: 10 }}>
                                    <FieldDateRange label="" currentValue={dateFrom} onChangeText={setDateFrom} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <FieldDateRange label="" currentValue={dateTo} onChangeText={setDateTo} />
                                </View>
                            </View>
                        </View>

                        {/* Vehicle Type */}
                        <View style={styles.section}>
                            <VehicleTypeSelector 
                                types={vehicleTypes} 
                                selectedIds={selectedVehicleIds} 
                                multiple={true}
                                onSelect={handleToggleVehicle} 
                            />
                        </View>
                        
                        {/* Services - Hidden if 'All' vehicle type or 'Summary' report */}
                        {!selectedVehicleIds.includes(0) && reportType !== 'Summary' && (
                            <View style={styles.section}>
                                <ServiceSelector 
                                    services={services} 
                                    selectedServiceIds={selectedServiceIds} 
                                    multiple={true}
                                    onToggle={handleToggleService} 
                                />
                            </View>
                        )}
                        
                        <View style={{ height: 20 }} />
                    </ScrollView>

                    {/* Footer - Action Buttons */}
                    <View style={styles.footer}>
                        <View style={styles.actionRow}>
                            <TouchableOpacity style={[styles.actionBtn, styles.viewBtn]} onPress={() => onView(getFilters())}>
                                <Icon.Eye color={Colors.white} size={20} />
                                <Text style={styles.actionBtnText}>Lihat</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={[styles.actionBtn, styles.printBtn]} onPress={() => onPrint(getFilters())}>
                                <Icon.Sync color={Colors.white} size={20} />
                                <Text style={styles.actionBtnText}>Cetak</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.actionBtn, styles.pdfBtn]} onPress={() => onExportPDF(getFilters())}>
                                <Icon.PDF color={Colors.white} size={20} />
                                <Text style={styles.actionBtnText}>PDF</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.actionBtn, styles.csvBtn]} onPress={() => onExportCSV(getFilters())}>
                                <Icon.Detail color={Colors.white} size={20} />
                                <Text style={styles.actionBtnText}>CSV</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.cancelButtonText}>BATAL</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ReportFilterDialog;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: Colors.white,
        borderRadius: 15,
        maxHeight: '85%',
        overflow: 'hidden',
    },
    header: {
        backgroundColor: Colors.bgOrange,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    body: {
        padding: 15,
    },
    section: {
        marginBottom: 20,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.grey,
        marginBottom: 8,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.whiteDark,
        borderRadius: 10,
        padding: 4,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    toggleButtonActive: {
        backgroundColor: Colors.white,
        elevation: 2,
    },
    toggleText: {
        color: Colors.grey,
        fontWeight: '600',
    },
    toggleTextActive: {
        color: Colors.bgOrange,
    },
    row: {
        flexDirection: 'row',
    },
    footer: {
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: Colors.whiteDark,
    },
    actionRow: {
        flexDirection: 'row',
        columnGap: 5,
        marginBottom: 10,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        columnGap: 5,
    },
    actionBtnText: {
        color: Colors.white,
        fontSize: 11,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: Colors.whiteDark,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.greyDark,
    },
    cancelButtonText: {
        color: Colors.greyDark,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    viewBtn: { backgroundColor: Colors.info },
    printBtn: { backgroundColor: Colors.blue },
    pdfBtn: { backgroundColor: Colors.danger },
    csvBtn: { backgroundColor: Colors.green },
});
