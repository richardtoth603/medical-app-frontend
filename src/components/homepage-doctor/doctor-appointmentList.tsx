import React, { useState } from "react";
import { Appointment } from "@/domain/models/Appointment";
import { Patient } from "@/domain/models/Patient";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AppointmentListProps {
  appointments: Appointment[];
  patients: Patient[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  patients,
  setAppointments,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDate, setEditingDate] = useState<string>("");
  const [editingHour, setEditingHour] = useState<string>("8"); // Default to 8 AM
  const [editingMinute, setEditingMinute] = useState<string>("00"); // Default to 00 minute
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(
    null
  );

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingId(appointment.id);
    setEditingDate(appointment.date.toISOString().split("T")[0]); // Extract date part
    const time = appointment.time;
    const hour = time ? time.slice(0, 2) : "8"; // Default hour if time is not available
    const minute = time ? time.slice(3, 5) : "00"; // Default minute if time is not available
    setEditingHour(hour);
    setEditingMinute(minute);
    setSelectedPatientId(appointment.patientId);
  };

  const updateAppointment = () => {
    if (!selectedPatientId || !editingDate || !editingHour || !editingMinute)
      return;
    setAppointments(
      appointments.map((appt) =>
        appt.id === editingId
          ? {
              ...appt,
              date: new Date(editingDate),
              time: `${editingHour}:${editingMinute}`, // Concatenate hour and minute
              patientId: selectedPatientId,
            }
          : appt
      )
    );
    setEditingId(null);
    setEditingDate("");
    setEditingHour("8"); // Reset to default
    setEditingMinute("00"); // Reset to default
    setSelectedPatientId(null);
  };

  const confirmDeleteAppointment = () => {
    if (appointmentToDelete) {
      setAppointments(
        appointments.filter((appt) => appt.id !== appointmentToDelete)
      );
      setDeleteConfirmationVisible(false);
      setAppointmentToDelete(null);
    }
  };

  const cancelDeleteAppointment = () => {
    setDeleteConfirmationVisible(false);
    setAppointmentToDelete(null);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointmentToDelete(id);
    setDeleteConfirmationVisible(true);
  };

  const getPatientById = (id: string) => patients.find((p) => p.id === id);

  return (
    <>
      <Card className="h-[400px] w-[700px] flex-col">
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          {editingId && (
            <div className="space-y-4 mb-4">
              <div className="flex justify-between">
                <Input
                  type="date"
                  value={editingDate}
                  onChange={(e) => setEditingDate(e.target.value)}
                />
                {/* Hour Dropdown */}
                <select
                  value={editingHour}
                  onChange={(e) => setEditingHour(e.target.value)}
                >
                  {[...Array(10)].map((_, index) => {
                    const hour = 8 + index;
                    return (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    );
                  })}
                </select>
                {/* Minute Dropdown */}
                <select
                  value={editingMinute}
                  onChange={(e) => setEditingMinute(e.target.value)}
                >
                  <option value="00">00</option>
                  <option value="30">30</option>
                </select>
                <select
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  value={selectedPatientId || ""}
                >
                  <option value="">Select a Patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
                <Button onClick={updateAppointment}>Update Appointment</Button>
              </div>
            </div>
          )}
          <div className="overflow-y-auto max-h-[300px]">
            {appointments.length > 0 ? (
              <ul className="space-y-2">
                {appointments.map((appointment) => {
                  const patient = getPatientById(appointment.patientId);
                  return (
                    <li
                      key={appointment.id}
                      className="flex justify-between items-center p-2 bg-gray-100 rounded-md"
                    >
                      <div>
                        <span
                          style={{
                            fontSize: "0.8em",
                            color: "gray",
                            display: "block",
                            textAlign: "left",
                          }}
                        >
                          {appointment.date.toLocaleDateString()}{" "}
                          {appointment.time}
                        </span>
                        <span
                          style={{
                            fontSize: "1em",
                            display: "block",
                            textAlign: "left",
                          }}
                        >
                          {patient?.firstName}{" "}
                          {patient?.lastName || "Unknown Patient"}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="link"
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="link"
                          onClick={() =>
                            handleCancelAppointment(appointment.id)
                          }
                        >
                          Cancel Appointment
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>You have no appointments.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {isDeleteConfirmationVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-lg">
              Are you sure you want to delete this appointment?
            </p>
            <div className="flex justify-between mt-4">
              <Button onClick={confirmDeleteAppointment} variant="destructive">
                Confirm
              </Button>
              <Button onClick={cancelDeleteAppointment} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentList;
