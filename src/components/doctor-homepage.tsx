import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Patient } from "@/domain/models/Patient";
import { Doctor } from "@/domain/models/Doctor";
import { Appointment } from "@/domain/Appointment";

// Initial Fake Data
const initialPatients: Patient[] = [
  {
    id: "p1",
    firstName: "Alice",
    lastName: "Smith",
    dateOfBirth: new Date("1980-05-15"),
  },
  {
    id: "p2",
    firstName: "Bob",
    lastName: "Jones",
    dateOfBirth: new Date("1992-11-22"),
  },
];

const initialDoctor: Doctor = {
  id: "d1",
  firstName: "Dr. John",
  lastName: "Doe",
  specialization: "Cardiology",
  patients: initialPatients,
  appointments: [],
};

const initialAppointments: Appointment[] = [
  {
    id: "a1",
    date: new Date(),
    time: "10:00 AM",
    patient: initialPatients[0],
    doctor: initialDoctor,
  },
  {
    id: "a2",
    date: new Date(),
    time: "11:30 AM",
    patient: initialPatients[1],
    doctor: initialDoctor,
  },
];

initialDoctor.appointments = initialAppointments;

export default function DoctorPage() {
  const [doctor, setDoctor] = useState<Doctor>(initialDoctor);
  const [newPatientFirstName, setNewPatientFirstName] = useState("");
  const [newPatientLastName, setNewPatientLastName] = useState("");
  const [newPatientDob, setNewPatientDob] = useState("");
  const [newAppointmentTime, setNewAppointmentTime] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [isEditingDoctor, setIsEditingDoctor] = useState(false);
  const [doctorFirstName, setDoctorFirstName] = useState(doctor.firstName);
  const [doctorLastName, setDoctorLastName] = useState(doctor.lastName);
  const [doctorSpecialization, setDoctorSpecialization] = useState(
    doctor.specialization
  );

  // For editing appointments
  const [editingAppointmentId, setEditingAppointmentId] = useState<
    string | null
  >(null);
  const [editingAppointmentTime, setEditingAppointmentTime] = useState("");

  const handleAddPatient = () => {
    if (newPatientFirstName && newPatientLastName && newPatientDob) {
      const newPatient: Patient = {
        id: `p${doctor.patients.length + 1}`,
        firstName: newPatientFirstName,
        lastName: newPatientLastName,
        dateOfBirth: new Date(newPatientDob),
      };
      setDoctor({ ...doctor, patients: [...doctor.patients, newPatient] });
      setNewPatientFirstName("");
      setNewPatientLastName("");
      setNewPatientDob("");
    }
  };

  const handleAddOrUpdateAppointment = () => {
    if (!selectedPatient || !newAppointmentTime) return;

    const conflictingAppointment = doctor.appointments.some(
      (appt) =>
        appt.time === newAppointmentTime &&
        appt.date.toDateString() === new Date().toDateString()
    );

    if (conflictingAppointment) {
      alert("This time slot is already taken. Please choose a different time.");
      return;
    }

    const newAppointment: Appointment = {
      id: editingAppointmentId || `a${doctor.appointments.length + 1}`,
      date: new Date(),
      time: newAppointmentTime,
      patient: selectedPatient,
      doctor,
    };

    const updatedAppointments = editingAppointmentId
      ? doctor.appointments.map((appt) =>
          appt.id === editingAppointmentId ? newAppointment : appt
        )
      : [...doctor.appointments, newAppointment];

    setDoctor({ ...doctor, appointments: updatedAppointments });
    setNewAppointmentTime("");
    setSelectedPatient(null);
    setEditingAppointmentId(null);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointmentId(appointment.id);
    setEditingAppointmentTime(appointment.time);
    setSelectedPatient(appointment.patient);
  };

  const handleRemovePatient = (patientId: string) => {
    const updatedPatients = doctor.patients.filter(
      (patient) => patient.id !== patientId
    );
    setDoctor({ ...doctor, patients: updatedPatients });
    setConfirmationVisible(false);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    const updatedAppointments = doctor.appointments.filter(
      (appointment) => appointment.id !== appointmentId
    );
    setDoctor({ ...doctor, appointments: updatedAppointments });
    setConfirmationVisible(false);
  };

  const showConfirmation = (action: () => void) => {
    setConfirmAction(() => action);
    setConfirmationVisible(true);
  };

  const saveDoctorChanges = () => {
    setDoctor({
      ...doctor,
      firstName: doctorFirstName,
      lastName: doctorLastName,
      specialization: doctorSpecialization,
    });
    setIsEditingDoctor(false);
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-2xl">Doctor Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {isEditingDoctor ? (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="First Name"
                value={doctorFirstName}
                onChange={(e) => setDoctorFirstName(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Last Name"
                value={doctorLastName}
                onChange={(e) => setDoctorLastName(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Specialization"
                value={doctorSpecialization}
                onChange={(e) => setDoctorSpecialization(e.target.value)}
              />
              <Button onClick={saveDoctorChanges}>Save</Button>
              <Button
                variant="secondary"
                onClick={() => setIsEditingDoctor(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <p className="text-lg">
                <strong>Name:</strong> {doctor.firstName} {doctor.lastName}
              </p>
              <p className="text-lg">
                <strong>Specialization:</strong> {doctor.specialization}
              </p>
              <Button onClick={() => setIsEditingDoctor(true)}>
                Edit Doctor Information
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Patients Section */}
      <div className="flex space-x-6">
        <div className="flex-1 min-h-[300px]">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Patients List</CardTitle>
            </CardHeader>
            <CardContent className="h-full text-left">
              {doctor.patients.length > 0 ? (
                <ul>
                  {doctor.patients.map((patient, index) => (
                    <li
                      key={patient.id}
                      className={`flex justify-between p-2 ${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <span>
                        {patient.firstName} {patient.lastName} - DOB:{" "}
                        {patient.dateOfBirth.toLocaleDateString()}
                      </span>
                      <div className="flex space-x-2">
                        <Button
                          variant="destructive"
                          onClick={() =>
                            showConfirmation(() =>
                              handleRemovePatient(patient.id)
                            )
                          }
                        >
                          Remove
                        </Button>
                        <Button variant="link">View Patient Page</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>You have no patients.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add Patient Form */}
        <div className="flex-none w-[300px] min-h-[300px]">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Add New Patient</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="First Name"
                  value={newPatientFirstName}
                  onChange={(e) => setNewPatientFirstName(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={newPatientLastName}
                  onChange={(e) => setNewPatientLastName(e.target.value)}
                />
                <Input
                  type="date"
                  value={newPatientDob}
                  onChange={(e) => setNewPatientDob(e.target.value)}
                />
                <Button onClick={handleAddPatient}>Add Patient</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Appointments Section */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="flex-1">
                <Input
                  type="time"
                  value={newAppointmentTime}
                  onChange={(e) => setNewAppointmentTime(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <select
                  onChange={(e) =>
                    setSelectedPatient(
                      doctor.patients.find(
                        (patient) => patient.id === e.target.value
                      ) || null
                    )
                  }
                  value={selectedPatient ? selectedPatient.id : ""}
                >
                  <option value="">Select a Patient</option>
                  {doctor.patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleAddOrUpdateAppointment}>
                Add Appointment
              </Button>
            </div>

            {doctor.appointments.length > 0 && (
              <ul>
                {doctor.appointments.map((appointment) => (
                  <li
                    key={appointment.id}
                    className="flex justify-between p-2 bg-white"
                  >
                    <div className="flex space-x-4">
                      <span>{appointment.time}</span>
                      <span>
                        {appointment.patient.firstName}{" "}
                        {appointment.patient.lastName}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleEditAppointment(appointment)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          showConfirmation(() =>
                            handleCancelAppointment(appointment.id)
                          )
                        }
                      >
                        Cancel
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
