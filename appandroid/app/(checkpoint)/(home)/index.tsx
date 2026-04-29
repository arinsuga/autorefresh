import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

//Packages
import moment from "moment";
import 'react-native-get-random-values';
import * as Print from 'expo-print'
import { shareAsync } from "expo-sharing";
import * as FileSystem from 'expo-file-system';
import { useRouter, Router } from "expo-router";
import { hideMessage } from 'react-native-flash-message';

//Context
import { useAuth } from "@/contexts/Authcontext";

//Components
import DateInfo from "@/components/DateInfo/DateInfo";
import DatePeriodInfo from "@/components/DatePeriodInfo/DatePeriodInfo";
import Relogin from "@/components/Relogin/Relogin";
import DateList from "@/components/DateList/DateList";
import TimelineList from "@/components/TimelineList/TimelineList";
import DialogReportPeriod from "@/components/DialogReportPeriod/DialogReportPeriod";
import Icon from "@/components/Icon/Icon";
import WaitingIndicator from "@/components/WaitingIndicator/WaitingIndicator";

//Templates
import AttendHistory from "@/templates/attends/AttendHistory";

//Constants
import Styles from "@/constants/Styles";
import { Colors } from "@/constants/Colors";
import Dates from "@/constants/Dates";

//Interfaces
import ITimeLine from "@/interfaces/ITimeLine";
import ICheckpointHistory from "@/interfaces/ICheckpointHistory";

//Serivces
import { getUsername } from "@/services/AuthService";
import TimeLineService from "@/services/TimeLineService";
import {
  check,
  historyByUserIdCheckpointDate,
  historyByUserIdCheckpointPeriod
} from '@/services/CheckpointService';

//Utils
import { useFilePath, useFileName } from "@/utils/Fileutils";

export default function History() {
    const [currentDate, setCurrentDate] = useState(moment());
    const [selectedDate, setSelectedDate] = useState(currentDate.clone());
    const [selectedDatePeriod, setSelectedDatePeriod] = useState<{ dateFrom: string, dateTo: string }>({  dateFrom: '', dateTo: '' });
    const [isWaiting, setIsWaiting] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [authenticated, setAuthenticated] = useState(true);
    const [timeLineList, setTimeLineList] = useState<ITimeLine[]>([]);
    const [showPeriod, setShowPeriod] = useState(false);
    const [actionType, setActionType] = useState<'checkin' | 'checkout' | ''>('');
    const { Authenticate, authState } = useAuth();

    const router: Router = useRouter();

    const getStyles = (actionType: string) => {

      const buttonContainerWidth = Dimensions.get('window').width;
      const buttonWidth = buttonContainerWidth*0.92;
      const buttonLeftPosition = (buttonContainerWidth - buttonWidth)/2;
      const styles = StyleSheet.create({

        checkButton: {
          flex: 1,
          flexDirection: 'row',
          position: "absolute",
          justifyContent: 'center',
          alignItems: 'center',
          width: buttonWidth,
          paddingVertical: 15,
          bottom: 10,
          left: buttonLeftPosition,
          backgroundColor: actionType === 'checkin' ? Colors.success : actionType === 'checkout' ? Colors.danger : Colors.greyDark,
        }

      });

      return styles
    }
    
    const handleRefresh = useCallback(async (viewMode: boolean, parDate: moment.Moment, parDateFrom?: string, parDateTo?: string) => {

        console.log('handleRefresh :');
        console.log({
          isViewMode: isViewMode,
          parDate: parDate,
          selectedDatePeriod: selectedDatePeriod,
        });

        const dateFrom = parDateFrom ? parDateFrom as string : '';
        const dateTo = parDateTo ? parDateTo as string : '';

        viewMode ? await handleViewOk(dateFrom, dateTo) :
        await handleSelectedDate(parDate);

    }, []);

    const handleSelectedDate = useCallback(async (date: moment.Moment) => {


        //check Authentication
        Authenticate && Authenticate();

        setIsWaiting(true);
        setTimeLineList([]);

        // const userName = await getUsername() as string
        const userName = authState?.user?.username as string;
        const data = await getTimelineByDate(userName, date);
        
        setIsWaiting(false);
        setTimeLineList(data);
        setSelectedDate(date);

    }, []);

    const getTimelineByDate = async (userName: string, date: moment.Moment): Promise<ITimeLine[]> => {

      try {

        const resultCheck = await check(userName);
        setActionType(resultCheck.action);

        const dataHistory: ICheckpointHistory[] = await historyByUserIdCheckpointDate(userName, date, 'view');
        let data = TimeLineService.fillTimeLine(dataHistory);
        data.sort((a, b) => parseInt(b.milliseconds) - parseInt(a.milliseconds));

        return data
      } catch (error: any) {

        console.error("Error fetching checkpoint history:", error);
        return [];
        
      }

    }

    const getTimelineByDatePeriod = async (userName: string, dateFrom: string, dateTo: string): Promise<ITimeLine[]> => {


      try {

        const resultCheck = await check(userName);
        setActionType(resultCheck.action);

        const dataHistory: ICheckpointHistory[] = await historyByUserIdCheckpointPeriod(userName, dateFrom, dateTo, 'view');
        let data = TimeLineService.fillTimeLine(dataHistory);
        data.sort((a, b) => parseInt(b.milliseconds) - parseInt(a.milliseconds));

        return data
      } catch (error: any) {

        console.error("Error fetching checkpoint history:", error);
        return [];
        
      }

    }

    const createPDF = async (data: ICheckpointHistory[]): Promise<boolean> => {

        try {

          const htmlContent = await AttendHistory(data);
          const { uri } = await Print.printToFileAsync({ html: htmlContent });

          const filePath = useFilePath(uri);
          const fileName = useFileName(filePath);

          const newFileName = authState?.user?.fullname  + '_' + moment().format("YYYYMMDD_HHmmss") + '.pdf';
          const newFileUri = uri.replace(fileName, newFileName.replace(' ', '_'));

          // Move the file to the new location
          await FileSystem.moveAsync({
            from: uri,
            to: newFileUri,
          });
          
          //Share the file
          await shareAsync(newFileUri, { UTI: '.pdf', mimeType: 'application/pdf' });

          return true
        } catch(error) {

          console.error("Error creating PDF:", error);
          return false;
        }


    }

    const handleDialogPeriod = async () => {

      setShowPeriod(true);

    }

    const handleViewOk = async (dateFrom: string, dateTo: string) => {

        setIsViewMode(true);
        setShowPeriod(false);
        setIsWaiting(true);
        setTimeLineList([]);
        setSelectedDatePeriod({ dateFrom: dateFrom, dateTo: dateTo });

        const userName = authState?.user?.username as string;
        const data = await getTimelineByDatePeriod(userName, dateFrom, dateTo);
        
        setIsWaiting(false);
        setTimeLineList(data);

    }

    const handleCreatePDFOk = async (dateFrom: string, dateTo: string) => {

      setShowPeriod(false);
      const userName = authState?.user?.username as string;
      const data = await getHistoryByPeriod(userName, dateFrom, dateTo);
      const result = await createPDF(data);

    }

    const handleCreatePDFCancel = async () => {

      setShowPeriod(false);

    }

    const getHistoryByPeriod = async (userName: string, startdt: string, enddt: string): Promise<ICheckpointHistory[]> => {


      try {

        const data: ICheckpointHistory[] = await historyByUserIdCheckpointPeriod(userName, startdt, enddt, 'view');

        return data
      } catch (error: any) {

        console.error("Error fetching checkpoint history:", error);
        return [];
        
      }

    }

    useEffect(() => {

      const fetchData = async () => {

        setTimeLineList([]);
        setIsWaiting(true);

        // const userName = await getUsername() as string;
        const userName = authState?.user?.username as string;
        const data = await getTimelineByDate(userName, selectedDate);

        setTimeLineList(data);
        setIsWaiting(false);
      };
      fetchData();

    }, []);    

    
    useEffect(() => {
      const fetchData = async () => {

        //const resultCheck = await check(userName);

      }
      fetchData();
    });

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.white,
        }}
      >

        {/* <WaitingIndicator isWaiting={isWaiting} /> */}

        {/* SECTION HEADER */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12}}>

          {
            !isViewMode ?
            <>
                <DateInfo date={selectedDate} currentDate={currentDate} />
                <TouchableOpacity style={[ Styles.btn, localStyles.btnDlgPeriod, { backgroundColor: Colors.orange } ]} onPress={ () => handleDialogPeriod() }>
                  <Text style={[Styles.btnText, { marginLeft: 5 }]}>View / Share</Text>
                </TouchableOpacity>
            </> :

            <>
                <DatePeriodInfo dateFrom={selectedDatePeriod.dateFrom} dateTo={selectedDatePeriod.dateTo} />
                <TouchableOpacity style={[ Styles.btn, localStyles.btnDlgPeriod ]} onPress={ async () => {
                  await handleSelectedDate(selectedDate);
                  setIsViewMode(false);
                } }>

                  <Text style={[Styles.btnText, { marginLeft: 5 }]}>Back</Text>

                </TouchableOpacity>
            </>


          }

        </View>

        {/* DATE LIST FILTER */}
        
        {
          !isViewMode ?
          <DateList date={selectedDate} onSelectedDate={handleSelectedDate}  /> : null
        }
        
        {/* DIVIDER */}
        <View style={{backgroundColor: Colors.white, height: 1}}></View>
        
        {/* DATA LIST */}
        <View style={{paddingHorizontal: 12, height: '89%'}}>

          <TimelineList
            data={timeLineList}
            date={selectedDate}
            datePeriod={selectedDatePeriod}
            isViewMode={isViewMode}
            isRefreshing={isWaiting}
            onRefresh={handleRefresh}
          />
          <Relogin display={ !authenticated && !isWaiting } />
        </View>


        <TouchableOpacity
            onPress={ async() => {
              hideMessage();
              router.push('/pinloc');
            }} 
            style={ getStyles(actionType).checkButton }
        >
          <Icon.Location size={28} color={ Colors.white } />
          <Text style={{color: Colors.white, fontSize: 15, marginLeft: 15}}>
              {  actionType === 'checkin' ? 'Check-In' : actionType === 'checkout' ? 'Check-Out' : 'Loading...' }
          </Text>
        </TouchableOpacity>



        <DialogReportPeriod
          visible={showPeriod}
          actionView={handleViewOk}
          actionPDF={handleCreatePDFOk}
          actionCancel={handleCreatePDFCancel}
        />
      </SafeAreaView>
    );
}


const localStyles = StyleSheet.create({

  btnDlgPeriod: {
              flex: 0.75,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 8,
              paddingHorizontal: 10,
              backgroundColor: Colors.greyDark,
              borderRadius: 0,
  }
  
});