import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Patient } from "@/domain/models/Patient";
import { Doctor } from "@/domain/models/Doctor";
import { Appointment } from "@/domain/models/Appointment";
import { Navbar, NavItem } from "../ui/navbar";

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
};

const initialAppointments: Appointment[] = [
  {
    id: "a1",
    date: new Date(),
    time: "10:00 AM",
    patientId: "p1",
    doctorId: "d1",
  },
  {
    id: "a2",
    date: new Date(),
    time: "11:30 AM",
    patientId: "p2",
    doctorId: "d1",
  },
];

export default function DoctorPage() {
  const [doctor, setDoctor] = useState<Doctor>(initialDoctor);
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);
  const [isViewingDoctorDetails, setIsViewingDoctorDetails] = useState(false);

  const [editingAppointmentId, setEditingAppointmentId] = useState<
    string | null
  >(null);
  const [editingAppointmentTime, setEditingAppointmentTime] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [isEditingDoctor, setIsEditingDoctor] = useState(false);
  const [doctorFirstName, setDoctorFirstName] = useState(doctor.firstName);
  const [doctorLastName, setDoctorLastName] = useState(doctor.lastName);
  const [doctorSpecialization, setDoctorSpecialization] = useState(
    doctor.specialization
  );

  const navbarItems: NavItem[] = [
    { label: "Home", href: "home" },
    { label: "Doctor Details", href: "doctor-details" },
  ];

  const handleNavigation = (href: string) => {
    setIsViewingDoctorDetails(href === "doctor-details");
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointmentId(appointment.id);
    setEditingAppointmentTime(appointment.time);
    setSelectedPatientId(appointment.patientId);
  };

  const handleUpdateAppointment = () => {
    if (!selectedPatientId || !editingAppointmentTime) return;

    const updatedAppointments = appointments.map((appt) =>
      appt.id === editingAppointmentId
        ? {
            ...appt,
            time: editingAppointmentTime,
            patientId: selectedPatientId,
          }
        : appt
    );

    setAppointments(updatedAppointments);
    setEditingAppointmentId(null);
    setEditingAppointmentTime("");
    setSelectedPatientId(null);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    const updatedAppointments = appointments.filter(
      (appointment) => appointment.id !== appointmentId
    );
    setAppointments(updatedAppointments);
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

  const getPatientById = (patientId: string) =>
    patients.find((p) => p.id === patientId);

  const renderDoctorProfile = () => (
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
  );

  const renderHome = () => (
    <>
      {/* Welcome Message */}
      <h1 className="text-4xl font-bold text-center my-8">
        Welcome to the Doctor Portal
      </h1>

      {/* Patients Section */}
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Patients List</CardTitle>
        </CardHeader>
        <CardContent className="text-left">
          {patients.length > 0 ? (
            <ul>
              {patients.map((patient, index) => (
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
                  <Button variant="link">View Patient Page</Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No patients available.</p>
          )}
        </CardContent>
      </Card>

      {/* Appointments Section */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {editingAppointmentId && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <Input
                  type="time"
                  value={editingAppointmentTime}
                  onChange={(e) => setEditingAppointmentTime(e.target.value)}
                />
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
                <Button onClick={handleUpdateAppointment}>
                  Update Appointment
                </Button>
              </div>
            </div>
          )}
          <ul>
            {appointments.map((appointment) => {
              const patient = getPatientById(appointment.patientId);
              return (
                <li
                  key={appointment.id}
                  className="flex justify-between p-2 bg-white max-w-[800px] mx-auto"
                >
                  <span>
                    {appointment.time} -{" "}
                    {patient
                      ? `${patient.firstName} ${patient.lastName}`
                      : "Unknown Patient"}
                  </span>
                  <Button
                    variant="secondary"
                    onClick={() => handleEditAppointment(appointment)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleCancelAppointment(appointment.id)}
                  >
                    Cancel
                  </Button>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </>
  );

  return (
    <div>
      <Navbar
        title="Doctor Portal"
        items={navbarItems}
        onNavigate={handleNavigation}
      />
      <div className="p-6 space-y-6">
        {isViewingDoctorDetails ? renderDoctorProfile() : renderHome()}
      </div>
    </div>
  );
}
