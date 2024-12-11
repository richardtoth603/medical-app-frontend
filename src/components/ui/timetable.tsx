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

const Timetable = ({
  appointments,
  patients,
}: {
  appointments: Appointment[];
  patients: Patient[];
}) => {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // State to keep track of the current week
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(new Date());

  // Time slots from 8:00 AM to 5:00 PM, in 30-minute increments
  const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8; // Start at 8 AM
    const minute = (i % 2) * 30;
    return `${hour}:${minute === 0 ? "00" : "30"}`;
  });

  // Create timetable structure with an array of slots for each weekday
  const timetable = daysOfWeek.map(() => Array(timeSlots.length).fill(null));

  // Helper function to filter appointments for the current week
  const getAppointmentsForCurrentWeek = (appointments: Appointment[]) => {
    return appointments.filter((appointment) => {
      const appointmentDate = normalizeDate(new Date(appointment.date));
      // Check if the appointment falls within the current week
      const startOfWeek = normalizeDate(new Date(currentWeekStartDate));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Set end of week (7 days later)

      // Only include appointments within the current week
      return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
    });
  };

  // Map appointments to timetable slots for the current week
  const currentWeekAppointments = getAppointmentsForCurrentWeek(appointments);

  currentWeekAppointments.forEach((appointment) => {
    const appointmentTime = convertTo24HourFormat(appointment.time);
    const appointmentDay = new Date(appointment.date).getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    const appointmentSlotIndex = timeSlots.findIndex(
      (slot) => convertTo24HourFormat(slot) === appointmentTime
    );

    if (appointmentSlotIndex !== -1 && appointmentDay !== 0) {
      timetable[appointmentDay - 1][appointmentSlotIndex] = appointment;
    }
  });

  // Helper function to get patient name by ID
  const getPatientNameById = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : "Unknown";
  };

  // Helper function to navigate to the previous week
  const goToPreviousWeek = () => {
    const prevWeekStartDate = new Date(currentWeekStartDate);
    prevWeekStartDate.setDate(currentWeekStartDate.getDate() - 7);
    setCurrentWeekStartDate(prevWeekStartDate);
  };

  // Helper function to navigate to the next week
  const goToNextWeek = () => {
    const nextWeekStartDate = new Date(currentWeekStartDate);
    nextWeekStartDate.setDate(currentWeekStartDate.getDate() + 7);
    setCurrentWeekStartDate(nextWeekStartDate);
  };

  const nextWeekEndDate = new Date(currentWeekStartDate);
  nextWeekEndDate.setDate(currentWeekStartDate.getDate() + 4);

  return (
    <div className="timetable">
      <h2 className="text-2xl font-bold mb-2 mt-6">Timetable</h2>
      {/* Navigation buttons for next/previous week */}
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost" // Apply the ghost style
          className="px-4 py-2"
          onClick={goToPreviousWeek}
        >
          Previous Week
        </Button>
        <span className="text-lg font-semibold">
          {currentWeekStartDate.toLocaleDateString()} -{" "}
          {nextWeekEndDate.toLocaleDateString()}{" "}
        </span>
        <Button
          variant="ghost" // Apply the ghost style
          className="px-4 py-2"
          onClick={goToNextWeek}
        >
          Next Week
        </Button>
      </div>
      <hr className="my-4 border-t border-gray-300" />
      <table className="table-auto w-full max-w-4xl mx-auto text-center">
        {/* Limit table width */}
        <thead>
          <tr>
            <th className="px-1 py-2 text-sm">Time</th>{" "}
            {/* Thinner hour column */}
            {daysOfWeek.map((day, index) => (
              <th
                key={day}
                className="px-2 py-2 text-sm"
                style={{ width: "15%" }} // Fixed width for day columns
              >
                <div>{day}</div>
                <div className="text-xs text-gray-500">
                  {getDateForDayOfWeek(index + 1, currentWeekStartDate)}{" "}
                  {/* Display date */}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot, rowIndex) => (
            <tr key={slot}>
              <td className="border px-1 py-1 text-sm">{slot}</td>{" "}
              {/* Thinner hour column */}
              {timetable.map((day, colIndex) => (
                <td
                  key={daysOfWeek[colIndex]}
                  className="border px-2 py-1 text-sm bg-gray-100"
                >
                  {day[rowIndex] ? (
                    <div>
                      <p>{getPatientNameById(day[rowIndex]?.patientId)}</p>
                      {/* Display patient name */}
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
