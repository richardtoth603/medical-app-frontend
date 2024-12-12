import React, { useState, useEffect } from "react";
import { Appointment } from "@/domain/models/Appointment";
import { Button } from "@/components/ui/button";

interface AppointmentTimetableProps {
  doctorId: string;
  onBookAppointment: (date: string, time: string) => void;
  newlyBookedAppointment: { date: string; time: string } | null;
}

const AppointmentTimetable: React.FC<AppointmentTimetableProps> = ({
  doctorId,
  onBookAppointment,
  newlyBookedAppointment,
}) => {
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    time: string;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);

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
          patientId: "current-user",
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

  const getDateForDayOfWeek = (dayOfWeek: number) => {
    const date = new Date(currentWeekStartDate);
    date.setDate(date.getDate() - date.getDay() + dayOfWeek);
    return date.toISOString().split("T")[0];
  };

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
    setCurrentWeekStartDate(prevWeekStartDate);
  };

  const goToNextWeek = () => {
    const nextWeekStartDate = new Date(currentWeekStartDate);
    nextWeekStartDate.setDate(currentWeekStartDate.getDate() + 7);
    setCurrentWeekStartDate(nextWeekStartDate);
  };

  const handleSlotClick = (date: string, time: string) => {
    if (isSlotAvailable(date, time)) {
      setSelectedSlot({ date, time });
      setShowModal(true);
    }
  };

  const handleConfirmAppointment = () => {
    if (selectedSlot) {
      onBookAppointment(selectedSlot.date, selectedSlot.time);
      setSelectedSlot(null);
      setShowModal(false);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Available Appointments</h2>
      <div className="flex justify-between items-center mb-4">
        <Button onClick={goToPreviousWeek} variant="outline">
          Previous Week
        </Button>
        <span className="text-lg font-semibold">
          {currentWeekStartDate.toLocaleDateString()} -{" "}
          {new Date(
            currentWeekStartDate.getTime() + 6 * 24 * 60 * 60 * 1000
          ).toLocaleDateString()}
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
                  const date = getDateForDayOfWeek(index + 1);
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
