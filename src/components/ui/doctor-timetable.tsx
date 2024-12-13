import { Appointment } from "@/domain/models/Appointment";
import { Patient } from "@/domain/models/Patient";
import { useState } from "react";
import { Button } from "./button";

// Helper function to normalize the date (set time to 00:00:00) for comparison
const normalizeDate = (date: Date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0); // Set to midnight to ignore the time
  return normalizedDate;
};

// Function to convert time to a 24-hour format to ease comparison
const convertTo24HourFormat = (time: string) => {
  const [hour, minute] = time.split(":");
  const [period] = time.split(" ").slice(-1);
  let hourIn24Format = parseInt(hour);
  if (period === "PM" && hourIn24Format !== 12) {
    hourIn24Format += 12;
  } else if (period === "AM" && hourIn24Format === 12) {
    hourIn24Format = 0;
  }
  return hourIn24Format * 60 + parseInt(minute);
};

// Function to get the date for a specific day of the current week
const getDateForDayOfWeek = (dayOfWeek: number, currentDate: Date) => {
  const date = new Date(currentDate);
  date.setDate(date.getDate() - date.getDay() + dayOfWeek); // Adjust for correct day of week
  return date.toLocaleDateString();
};
const getMondayOfCurrentWeek = (date: Date) => {
  const monday = new Date(date);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Adjust for Sunday (day 0) being treated as the last day
  monday.setDate(monday.getDate() + diff);
  monday.setHours(0, 0, 0, 0); // Normalize to midnight
  return monday;
};

const Timetable = ({
  appointments,
  patients,
}: {
  appointments: Appointment[];
  patients: Patient[];
}) => {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // State to keep track of the current week's Monday
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(
    getMondayOfCurrentWeek(new Date())
  );

  const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8; // Start at 8 AM
    const minute = (i % 2) * 30;
    return `${hour}:${minute === 0 ? "00" : "30"}`;
  });

  const timetable = daysOfWeek.map(() => Array(timeSlots.length).fill(null));

  const getAppointmentsForCurrentWeek = (appointments: Appointment[]) => {
    const startOfWeek = getMondayOfCurrentWeek(currentWeekStartDate);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 4); // Include Friday

    return appointments.filter((appointment) => {
      const appointmentDate = normalizeDate(new Date(appointment.date));
      return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
    });
  };

  const currentWeekAppointments = getAppointmentsForCurrentWeek(appointments);

  currentWeekAppointments.forEach((appointment) => {
    const appointmentTime = convertTo24HourFormat(appointment.time);
    const appointmentDate = new Date(appointment.date);
    const appointmentDay = appointmentDate.getDay();
    const appointmentSlotIndex = timeSlots.findIndex(
      (slot) => convertTo24HourFormat(slot) === appointmentTime
    );

    if (
      appointmentSlotIndex !== -1 &&
      appointmentDay >= 1 &&
      appointmentDay <= 5
    ) {
      timetable[appointmentDay - 1][appointmentSlotIndex] = appointment;
    }
  });

  const getPatientNameById = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : "Unknown";
  };

  const goToPreviousWeek = () => {
    const prevWeekStartDate = new Date(currentWeekStartDate);
    prevWeekStartDate.setDate(currentWeekStartDate.getDate() - 7);
    setCurrentWeekStartDate(getMondayOfCurrentWeek(prevWeekStartDate));
  };

  const goToNextWeek = () => {
    const nextWeekStartDate = new Date(currentWeekStartDate);
    nextWeekStartDate.setDate(currentWeekStartDate.getDate() + 7);
    setCurrentWeekStartDate(getMondayOfCurrentWeek(nextWeekStartDate));
  };

  const nextWeekEndDate = new Date(currentWeekStartDate);
  nextWeekEndDate.setDate(currentWeekStartDate.getDate() + 4);

  return (
    <div className="timetable">
      <h2 className="text-2xl font-bold mb-2 mt-6">Timetable</h2>
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          className="px-4 py-2"
          onClick={goToPreviousWeek}
        >
          Previous Week
        </Button>
        <span className="text-lg font-semibold">
          {currentWeekStartDate.toLocaleDateString()} -{" "}
          {nextWeekEndDate.toLocaleDateString()}
        </span>
        <Button variant="ghost" className="px-4 py-2" onClick={goToNextWeek}>
          Next Week
        </Button>
      </div>
      <hr className="my-4 border-t border-gray-300" />
      <table className="table-auto w-full max-w-4xl mx-auto text-center">
        <thead>
          <tr>
            <th className="px-1 py-2 text-sm">Time</th>
            {daysOfWeek.map((day, index) => (
              <th
                key={day}
                className="px-2 py-2 text-sm"
                style={{ width: "15%" }}
              >
                <div>{day}</div>
                <div className="text-xs text-gray-500">
                  {getDateForDayOfWeek(index + 1, currentWeekStartDate)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot, rowIndex) => (
            <tr key={slot}>
              <td className="border px-1 py-1 text-sm">{slot}</td>
              {timetable.map((day, colIndex) => (
                <td
                  key={daysOfWeek[colIndex]}
                  className="border px-2 py-1 text-sm bg-gray-100"
                >
                  {day[rowIndex] ? (
                    <div>
                      <p>{getPatientNameById(day[rowIndex]?.patientId)}</p>
                      <p>{day[rowIndex]?.time}</p>
                    </div>
                  ) : (
                    <p>-</p>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Timetable;
