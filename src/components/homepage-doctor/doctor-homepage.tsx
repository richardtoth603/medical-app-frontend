import { useState } from "react";
import DoctorProfile from "./doctor-profile";
import PatientList from "./doctor-patientList";
import AppointmentList from "./doctor-appointmentList";
import { Navbar } from "@/components/ui/navbar";
import { NavItem } from "@/components/ui/navbar";
import { Patient } from "@/domain/models/Patient";
import { Doctor } from "@/domain/models/Doctor";
import { Appointment } from "@/domain/models/Appointment";
import Timetable from "./doctor-timetable";

// Extended Fake Data
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
  {
    id: "p3",
    firstName: "Charlie",
    lastName: "Brown",
    dateOfBirth: new Date("2000-08-30"),
  },
  {
    id: "p4",
    firstName: "David",
    lastName: "White",
    dateOfBirth: new Date("1975-02-10"),
  },
  {
    id: "p5",
    firstName: "Eve",
    lastName: "Williams",
    dateOfBirth: new Date("1985-06-19"),
  },
  {
    id: "p6",
    firstName: "Frank",
    lastName: "Taylor",
    dateOfBirth: new Date("1990-03-11"),
  },
  {
    id: "p7",
    firstName: "Grace",
    lastName: "Harris",
    dateOfBirth: new Date("1995-01-24"),
  },
  {
    id: "p8",
    firstName: "Helen",
    lastName: "Clark",
    dateOfBirth: new Date("1982-12-02"),
  },
  {
    id: "p9",
    firstName: "Ivan",
    lastName: "Lewis",
    dateOfBirth: new Date("1998-07-08"),
  },
  {
    id: "p10",
    firstName: "Jack",
    lastName: "Young",
    dateOfBirth: new Date("2002-11-17"),
  },
  {
    id: "p11",
    firstName: "Kathy",
    lastName: "Adams",
    dateOfBirth: new Date("1973-09-05"),
  },
  {
    id: "p12",
    firstName: "Liam",
    lastName: "Scott",
    dateOfBirth: new Date("1999-02-18"),
  },
  {
    id: "p13",
    firstName: "Mona",
    lastName: "Walker",
    dateOfBirth: new Date("1986-04-12"),
  },
  {
    id: "p14",
    firstName: "Nancy",
    lastName: "Lopez",
    dateOfBirth: new Date("1983-08-14"),
  },
  {
    id: "p15",
    firstName: "Oscar",
    lastName: "Martinez",
    dateOfBirth: new Date("1994-09-23"),
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
  {
    id: "a3",
    date: new Date(),
    time: "02:00 PM",
    patientId: "p3",
    doctorId: "d1",
  },
  {
    id: "a4",
    date: new Date(),
    time: "04:00 PM",
    patientId: "p4",
    doctorId: "d1",
  },
  {
    id: "a5",
    date: new Date(),
    time: "08:30 AM",
    patientId: "p5",
    doctorId: "d1",
  },
  {
    id: "a6",
    date: new Date(),
    time: "12:00 PM",
    patientId: "p6",
    doctorId: "d1",
  },
  {
    id: "a7",
    date: new Date(),
    time: "01:30 PM",
    patientId: "p7",
    doctorId: "d1",
  },
  {
    id: "a8",
    date: new Date(),
    time: "03:00 PM",
    patientId: "p8",
    doctorId: "d1",
  },
  {
    id: "a9",
    date: new Date(),
    time: "09:00 AM",
    patientId: "p9",
    doctorId: "d1",
  },
  {
    id: "a10",
    date: new Date(),
    time: "10:30 AM",
    patientId: "p10",
    doctorId: "d1",
  },
  {
    id: "a11",
    date: new Date(),
    time: "12:15 PM",
    patientId: "p11",
    doctorId: "d1",
  },
  {
    id: "a12",
    date: new Date(),
    time: "02:45 PM",
    patientId: "p12",
    doctorId: "d1",
  },
  {
    id: "a13",
    date: new Date(),
    time: "04:30 PM",
    patientId: "p13",
    doctorId: "d1",
  },
  {
    id: "a14",
    date: new Date(),
    time: "06:00 PM",
    patientId: "p14",
    doctorId: "d1",
  },
  {
    id: "a15",
    date: new Date(),
    time: "07:30 PM",
    patientId: "p15",
    doctorId: "d1",
  },
];

export default function DoctorPage() {
  const [doctor, setDoctor] = useState<Doctor>(initialDoctor);
  const [patients] = useState<Patient[]>(initialPatients);
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);
  const [isViewingDoctorDetails, setIsViewingDoctorDetails] = useState(false);

  const navbarItems: NavItem[] = [
    { label: "Home", href: "home" },
    { label: "Doctor Details", href: "doctor-details" },
  ];

  const handleNavigation = (href: string) => {
    setIsViewingDoctorDetails(href === "doctor-details");
  };

  return (
    <div>
      <Navbar
        title="Doctor Portal"
        items={navbarItems}
        onNavigate={handleNavigation}
      />
      {isViewingDoctorDetails ? (
        <DoctorProfile doctor={doctor} setDoctor={setDoctor} />
      ) : (
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold mb-8">
            Welcome to the Doctor Portal
          </h1>
          <div className="flex justify-center space-x-6">
            <PatientList patients={patients} />
            <AppointmentList
              appointments={appointments}
              patients={patients}
              setAppointments={setAppointments}
            />
          </div>
          <Timetable appointments={appointments} patients={patients} />{" "}
          {/* Pass patients here */}
        </div>
      )}
    </div>
  );
}
