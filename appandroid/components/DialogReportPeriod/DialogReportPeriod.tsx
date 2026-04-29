import React, {
    useState
} from 'react';
import {
    View,
    Modal,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions
} from 'react-native';

//Packages
import moment from 'moment';

//Components
import FieldDateRange from '@/components/FieldDateRange/FieldDateRange';

//Constants
import { Colors } from '@/constants/Colors';
import Styles from '@/constants/Styles';
import Dates from '@/constants/Dates';

interface IDialogProps {
    visible?: boolean;
    actionView: (dateFrom: string, dateTo: string) => Promise<void>;
    actionPDF: (dateFrom: string, dateTo: string) => Promise<void>;
    actionCancel: () => Promise<void>;
}

const DialogReportPeriod = ({ visible = false, actionView, actionPDF, actionCancel }: IDialogProps) => {
    const [dateFrom, setDateFrom] = useState<string>(moment().format(Dates.format.date));
    const [dateTo, setDateTo] = useState(moment().format(Dates.format.date));
    
    const dlgBoxWidth = Dimensions.get('screen').width * 0.9;
    const dlgBoxHeight = Dimensions.get('screen').height * 0.35;
    const dlgBoxHeaderHeight = dlgBoxHeight * 0.2;
    const dlgBoxBodyHeight = (dlgBoxHeight * 0.5);
    const dlgBoxFooterHeight = dlgBoxHeight * 0.3;

    return (

        <Modal
            animationType='slide'
            transparent={true}
            visible={visible}
        >

            { /** Dialog Box Overlay */ }
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.bgBlueTransparent,
            }}>

                { /** Dialog Box Container */ }
                <View style={{
                    flex: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: dlgBoxWidth,
                    height: dlgBoxHeight,
                    backgroundColor: Colors.white,
                    borderRadius: 10
                }}>

                    { /** Dialog Box Header */ }
                    <View style={{
                        flex: 0,
                        justifyContent: 'center',
                        width: dlgBoxWidth,
                        height: dlgBoxHeaderHeight,
                        backgroundColor: Colors.orange,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        paddingLeft: 20,
                    }}>

                        <Text style={{ color: Colors.white }}>Pilih Periode</Text>

                    </View>

                    { /** Dialog Box Body */ }
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: dlgBoxWidth,
                        height: dlgBoxBodyHeight,
                        padding: 15,
                    }}>

                        <FieldDateRange label="From" currentValue={ dateFrom } onChangeText={(nextText: string) =>setDateFrom(nextText)} />
                        <FieldDateRange label="To" currentValue={ dateTo } onChangeText={(nextText: string) => setDateTo(nextText)} />

                    </View>

                    { /** Dialog Box Footer */ }
                    <View style={{
                            flex: 0,
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            width: dlgBoxWidth,
                            height: dlgBoxFooterHeight,
                            borderBottomLeftRadius: 10,
                            borderBottomRightRadius: 10
                        }}>

                        <TouchableOpacity
                            onPress={() => {
                                setDateFrom(moment().format(Dates.format.date));
                                setDateTo(moment().format(Dates.format.date));
                                actionCancel();
                            }}
                            style={[
                                Styles.btn, styles.DialogButton
                            ]}
                        >
                            <Text style={Styles.btnText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => actionView(dateFrom, dateTo)}
                            style={[
                                Styles.btn, styles.DialogButtonView
                            ]}
                        >
                            <Text style={Styles.btnText}>View</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => actionPDF(dateFrom, dateTo)}
                            style={[
                                Styles.btn, styles.DialogButtonPDF
                            ]}
                        >
                            <Text style={Styles.btnText}>PDF</Text>
                        </TouchableOpacity>

                    </View>



                </View>

            </View>


        </Modal>

    );
};

export default DialogReportPeriod;

const styles = StyleSheet.create({
    DialogButton: {
        width: '30%',
        backgroundColor: Colors.grey,
    },
    DialogButtonView: {
        width: '30%',
        backgroundColor: Colors.success,
    },
    DialogButtonPDF: {
        width: '30%',
        backgroundColor: Colors.danger,
    },

});