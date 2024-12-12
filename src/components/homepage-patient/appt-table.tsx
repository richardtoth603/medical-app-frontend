import React, { useState, useEffect } from "react";
import { Appointment } from "@/domain/models/Appointment";
import { Button } from "@/components/ui/button";
import { useAddAppointment } from "@/hooks/patientHooks"; // Import the hook

// Helper function to normalize the date (set time to 00:00:00) for comparison
const normalizeDate = (date: Date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0); // Set to midnight to ignore the time
  return normalizedDate;
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

interface AppointmentTimetableProps {
  doctorId: string;
  newlyBookedAppointment: { date: string; time: string } | null;
}

const AppointmentTimetable: React.FC<AppointmentTimetableProps> = ({
  doctorId,
  newlyBookedAppointment,
}) => {
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(
    getMondayOfCurrentWeek(new Date())
  );
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    time: string;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { mutate: addAppointment } = useAddAppointment(); // Get mutate function from hook

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await fetch("/Appointments/GetAllAppointments");
      const allAppointments: Appointment[] = await response.json();
      const doctorAppointments = allAppointments.filter(
        (app) => app.doctorId === doctorId
      );
      setAppointments(doctorAppointments);
    };

    fetchAppointments();
  }, [doctorId]);

  useEffect(() => {
    if (newlyBookedAppointment) {
      setAppointments((prevAppointments) => [
        ...prevAppointments,
        {
          id: Date.now().toString(),
          date: new Date(newlyBookedAppointment.date),
          time: newlyBookedAppointment.time,
          patientId: "7769c180-3377-477b-8661-c8e8748eeecf", // Use the provided patientId
          doctorId: doctorId,
        },
      ]);
    }
  }, [newlyBookedAppointment, doctorId]);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, "0")}:${minute === 0 ? "00" : "30"}`;
  });

  const isSlotAvailable = (date: string, time: string) => {
    return (
      !appointments.some(
        (app) =>
          app.date.toISOString().split("T")[0] === date && app.time === time
      ) &&
      !(
        newlyBookedAppointment?.date === date &&
        newlyBookedAppointment?.time === time
      )
    );
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

  const handleSlotClick = (date: string, time: string) => {
    if (isSlotAvailable(date, time)) {
      setSelectedSlot({ date, time });
      setShowModal(true);
    }
  };

  const handleConfirmAppointment = () => {
    if (selectedSlot) {
      // Use the hook to add the appointment
      addAppointment({
        id: "",
        patientId: "7769c180-3377-477b-8661-c8e8748eeecf", // The patient ID
        doctorId: doctorId,
        date: new Date(selectedSlot.date),
        time: selectedSlot.time,
      });
      setSelectedSlot(null);
      setShowModal(false);
    }
  };

  const nextWeekEndDate = new Date(currentWeekStartDate);
  nextWeekEndDate.setDate(currentWeekStartDate.getDate() + 4);

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Available Appointments</h2>
      <div className="flex justify-between items-center mb-4">
        <Button onClick={goToPreviousWeek} variant="outline">
          Previous Week
        </Button>
        <span className="text-lg font-semibold">
          {currentWeekStartDate.toLocaleDateString()} -{" "}
          {nextWeekEndDate.toLocaleDateString()}
        </span>
        <Button onClick={goToNextWeek} variant="outline">
          Next Week
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Time</th>
              {daysOfWeek.map((day) => (
                <th key={day} className="border p-2">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) => (
              <tr key={time}>
                <td className="border p-2">{time}</td>
                {daysOfWeek.map((_, index) => {
                  const date = getDateForDayOfWeek(
                    index + 1,
                    currentWeekStartDate
                  );
                  const available = isSlotAvailable(date, time);
                  return (
                    <td
                      key={`${date}-${time}`}
                      className={`border p-2 ${
                        available
                          ? "bg-green-100 cursor-pointer hover:bg-green-200"
                          : "bg-red-100"
                      }`}
                      onClick={() => available && handleSlotClick(date, time)}
                    >
                      {available ? "Available" : "Unavailable"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full m-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Appointment</h3>
            <p>
              Are you sure you want to book an appointment on{" "}
              {selectedSlot.date} at {selectedSlot.time}?
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmAppointment}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentTimetable;
