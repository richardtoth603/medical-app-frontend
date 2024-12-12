import { useState } from "react";
import DoctorProfile from "./doctor-profile";
import AppointmentList from "./doctor-appointmentList";
import { Navbar } from "@/components/ui/navbar";
import { NavItem } from "@/components/ui/navbar";
import { Doctor } from "@/domain/models/Doctor";
import Timetable from "../ui/doctor-timetable";
import { useFetchPatients, useFetchAppointments } from "@/hooks/doctorHooks";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import PatientScreen from "./patient-page";

const initialDoctor: Doctor = {
  id: "830085f0-a1af-434a-ace7-0d378fda0937",
  firstName: "Dr. John",
  lastName: "Doe",
  specialization: "Cardiology",
};

export default function DoctorPage() {
  const [doctor, setDoctor] = useState<Doctor>(initialDoctor);
  const {
    data: patients,
    status: patientStatus,
    isLoading: isPatientsLoading,
  } = useFetchPatients();
  const {
    data: appointments,
    status: appointmentStatus,
    isLoading: isAppointmentsLoading,
  } = useFetchAppointments();

  const [isViewingDoctorDetails, setIsViewingDoctorDetails] = useState(false);
  const [viewedPatient, setViewedPatient] = useState("");
  const [currentPage, setCurrentPage] = useState("home");

  const navbarItems: NavItem[] = [
    { label: "Home", href: "home" },
    { label: "Doctor Details", href: "doctor-details" },
  ];

  const handleNavigation = (href: string) => {
    setIsViewingDoctorDetails(href === "doctor-details");
    setCurrentPage(href);
    setViewedPatient("");
  };

  const handleViewPatient = (patientId: string) => {
    setViewedPatient(patientId);
    setCurrentPage("patient");
  };

  switch (currentPage) {
    case "patient":
      return (
        <>
          <Navbar
            title="Doctor Portal"
            items={navbarItems}
            onNavigate={handleNavigation}
          />
          <PatientScreen patientId={viewedPatient} />
        </>
      );
    default:
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
                <Card className="h-[500px] w-[700px] flex-col">
                  <CardHeader>
                    <CardTitle>Patients List</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-hidden">
                    <div className="overflow-y-auto max-h-[370px]">
                      {isPatientsLoading && <p>Loading...</p>}
                      {patientStatus === "error" && (
                        <p>Error fetching patients</p>
                      )}
                      {patientStatus === "success" &&
                        patients?.length === 0 && <p>No patients found</p>}
                      <ul className="space-y-2">
                        {patientStatus === "success" &&
                          patients?.map((patient) => (
                            <li
                              key={patient.id}
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
                                  {patient.dateOfBirth.toLocaleDateString()}
                                </span>
                                <span
                                  style={{
                                    fontSize: "1em",
                                    display: "block",
                                    textAlign: "left",
                                  }}
                                >
                                  {patient.firstName}{" "}
                                  {patient.lastName || "Unknown Patient"}
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="link"
                                  onClick={() => {
                                    handleViewPatient(patient.id);
                                  }}
                                >
                                  View Patient Page
                                </Button>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                <AppointmentList
                  appointments={appointments || []}
                  patients={patients || []}
                  setAppointments={() => {}} // No need to set appointments if fetched from backend
                  currentDoctorId={initialDoctor.id}
                />
              </div>
              <Timetable
                appointments={appointments || []}
                patients={patients || []}
              />
            </div>
          )}
        </div>
      );
  }
}
