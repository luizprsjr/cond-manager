import React, {useCallback, useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Alert, useColorScheme} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';

import themes from '../../themes';
import IReservation from '../../interfaces/ReservationItem';

import S from './style';
import api from '../../services/api';

type ParamList = {
  Reservation: IReservation;
};

const ReservationAddScreen: React.FC = () => {
  const deviceTheme = useColorScheme();
  const theme = deviceTheme ? themes[deviceTheme] : themes.dark;

  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'Reservation'>>();

  const [loading, setLoading] = useState(true);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeList, setTimeList] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  const handleDateChange = useCallback(() => {}, []);

  const getDisabledDates = useCallback(async () => {
    setDisabledDates([]);
    setTimeList([]);
    setSelectedDate(null);
    setSelectedTime(null);

    setLoading(true);

    const {data: response} = await api.get(
      `/reservation/${route.params.id}/disableddates`,
    );

    setLoading(false);

    if (!response.error) {
      let dateList: Date[] = [];

      response.list.map((date: string) => {
        dateList.push(new Date(date));
      });

      setDisabledDates(dateList);
    } else {
      Alert.alert('Erro', `${response.error}`);
    }
  }, [route]);

  useEffect(() => {
    if (route.params) {
      navigation.setOptions({
        headerTitle: `Reservar ${route.params.title}`,
      });
    }
    getDisabledDates();
  }, [getDisabledDates, navigation, route]);

  return (
    <S.Container>
      <S.Scroller>
        <S.CoverImage source={{uri: route.params.cover}} resizeMode="cover" />

        {loading && <S.LoadingIcon size="large" color={theme.purple} />}

        {!loading && (
          <S.CalendarContainer>
            <CalendarPicker
              onDateChange={handleDateChange}
              disabledDates={disabledDates}
              minDate={minDate}
              maxDate={maxDate}
              weekdays={['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']}
              months={[
                'Janeiro',
                'Fevereiro',
                'Março',
                'Abril',
                'Maio',
                'Junho',
                'Julho',
                'Agosto',
                'Setembro',
                'Outubro',
                'Novembro',
                'Dezembro',
              ]}
              previousTitle="Anterior"
              nextTitle="Próximo"
              textStyle={{color: theme.text}}
              disabledDatesTextStyle={{color: theme.disabledDatesText}}
              selectedDayColor={theme.purple}
              selectedDayTextColor={theme.buttonText}
              todayBackgroundColor={theme.black}
              todayTextStyle={{color: theme.buttonText}}
            />
          </S.CalendarContainer>
        )}
      </S.Scroller>
    </S.Container>
  );
};

export default ReservationAddScreen;
