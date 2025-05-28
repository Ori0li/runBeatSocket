import dayjs, { Dayjs } from "dayjs";
import React, { forwardRef } from "react";
import CalendarStrip from "react-native-calendar-strip";

interface ScheduleMark {
  date: string;
}

interface Props {
  selectedDate: Dayjs;
  onDateSelected: (date: Dayjs) => void;
  markedDates?: ScheduleMark[];
}

const CustomCalendar = forwardRef<CalendarStrip, Props>(
  ({ selectedDate, onDateSelected, markedDates }, ref) => {
    return (
      <CalendarStrip
        ref={ref as any}
        style={{ height: 150, paddingVertical: 20 }}
        calendarHeaderStyle={{
          color: "white",
          fontSize: 20,
          marginBottom: 10,
        }}
        calendarColor={"#3C23D7"}
        dateNumberStyle={{ color: "white", fontSize: 16 }}
        highlightDateContainerStyle={{
          backgroundColor: "#ffffff",
          borderRadius: 9999,
        }}
        iconContainer={{ flex: 0.1 }}
        highlightDateNumberStyle={{ color: "#3C23D7", fontSize: 16 }}
        showDayName={false}
        iconStyle={{ color: "#ffffff", fontSize: 16 }}
        selectedDate={selectedDate.toDate()}
        onDateSelected={(date) =>
          onDateSelected(dayjs(date ? date.toDate() : date))
        }
        markedDates={markedDates?.map((schedule) => ({
          date: schedule.date,
          dots: [
            {
              color: "#ffffff",
              selectedColor:
                selectedDate.format("YYYY-MM-DD") === schedule.date
                  ? "#3C23D7"
                  : "#ffffff",
            },
          ],
        }))}
        scrollable={true}
        scrollerPaging={true}
        useIsoWeekday={false}
        startingDate={dayjs().toDate()}
        onWeekChanged={(start, end) => {
          console.log("Week changed:", start, end);
        }}
      />
    );
  }
);

export default CustomCalendar;
