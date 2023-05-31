import moment from "moment";
import visitType from "../types/visit";
import { modifyDate } from "../helpers/helpers";
import classes, { Appointments, staffData } from "../types/classes";

export const staffPerformanceAnalysis = (
  monthClasses: classes[],
  monthClassesVisits: visitType[],
  staffAppointments: Appointments[],
  previousMonthBegin: string,
  monthBegin: string
) => {
  const staffClasses = monthClasses
    .filter((classes) => {
      const modFilterDate = modifyDate(classes?.StartDateTime as string);
      const response =
        !classes.IsCanceled && moment(modFilterDate).isSameOrAfter(previousMonthBegin, "hour") && moment(monthBegin).isAfter(modFilterDate, "hour");

      return response;
    })
    .map((monthClass) => {
      const duration = moment(monthClass?.EndDateTime).diff(moment(monthClass?.StartDateTime), "minutes");
      return { staffId: monthClass?.Staff?.Id, name: monthClass?.Staff?.DisplayName, duration: duration, attendance: monthClass?.TotalSignedIn };
    })
    .reduce((group, classes) => {
      const staffId = classes.staffId as number;
      group[staffId] = group[staffId] ?? [];
      group[staffId].push(classes);

      return group;
    }, {} as { [x: string | number]: staffData[] });

  const staffs = Object.keys(staffClasses);

  const staffsPerormance = staffs.map((staff) => {
    const staffId = staffClasses[staff][0]?.staffId;
    const staffName = staffClasses[staff][0]?.name;
    let numberOfClasses = 0;
    let classDuration = 0;
    let totalAttendance = 0;
    (staffClasses[staff] as staffData[]).forEach((currentValue: staffData) => {
      const attendance = currentValue.attendance as number;
      classDuration += currentValue.duration;
      totalAttendance += attendance;
      numberOfClasses += 1;
    });

    const staffVisitsors = monthClassesVisits.reduce((accumulator, currentValue) => {
      const modFilterDate = modifyDate(currentValue?.StartDateTime as string);
      if (
        currentValue.StaffId === staffId &&
        !currentValue.Missed &&
        moment(modFilterDate).isSameOrAfter(previousMonthBegin, "hour") &&
        moment(monthBegin).isAfter(modFilterDate, "hour")
      ) {
        return [...accumulator, currentValue.ClientId as string];
      }
      return accumulator;
    }, [] as string[]);

    const staffUniqueVisitors = Array.from(new Set(staffVisitsors)).length;

    let appointmentNumber = 0;
    const staffAppointmentsDuration = staffAppointments.reduce((accumulator, currentValue) => {
      if (currentValue.StaffId === staffId && currentValue.Duration) {
        appointmentNumber += 1;
        return (accumulator += currentValue.Duration);
      }

      return accumulator;
    }, 0);

    return {
      staffId,
      staffName: staffName,
      appointments: appointmentNumber,
      appointmentsHours: Number(staffAppointmentsDuration / 60).toFixed(2),
      classes: numberOfClasses,
      classHours: Number(classDuration / 60).toFixed(2),
      totalAttendance,
      attendance: staffVisitsors.length,
      totalHours: Number((staffAppointmentsDuration + classDuration) / 60).toFixed(2),
      uniqueClients: staffUniqueVisitors,
      retentionFactor: Number(staffVisitsors.length / staffUniqueVisitors).toFixed(2),
      averageAttendance: Number(staffVisitsors.length / numberOfClasses).toFixed(0),
    };
  });

  return { staffClasses, staffsPerormance };
};
