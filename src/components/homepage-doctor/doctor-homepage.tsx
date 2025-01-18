import { useState, useEffect } from "react";
import DoctorProfile from "./doctor-profile";
import AppointmentList from "./doctor-appointmentList";
import { Navbar } from "@/components/ui/navbar";
import { NavItem } from "@/components/ui/navbar";
import { Patient } from "@/domain/models/Patient";
import { Doctor } from "@/domain/models/Doctor";
import { Appointment } from "@/domain/models/Appointment";
import Timetable from "../ui/doctor-timetable";
import { useFetchPatients } from "@/hooks/doctorHooks";
import { useFetchDoctorById } from "@/hooks/patientHooks";
import { useFetchAppointmentsByDoctorId } from "@/hooks/doctorHooks"; // Import the correct hook
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import PatientScreen from "./patient-page";
import { useApplicationContext } from "@/context/ApplicationContext";
import { useNavigate } from "react-router-dom";

export default function DoctorPage() {
  const doctorId = localStorage.getItem("role_id"); // Ensure you have the correct doctor ID
  const [doctor, setDoctor] = useState<Doctor>({} as Doctor);

  const {
    data: fetchedDoctor,
    status: doctorStatus,
    isLoading: isDoctorLoading,
    error: doctorError,
  } = useFetchDoctorById(doctorId || "");

  const {
    data: patients,
    status: patientStatus,
    isLoading: isPatientsLoading,
  } = useFetchPatients();

  // Fetch appointments by doctor ID
  const {
    data: appointments,
    status: appointmentStatus,
    isLoading: isAppointmentsLoading,
  } = useFetchAppointmentsByDoctorId(doctorId || ""); // Use the hook with doctorId

  const [isViewingDoctorDetails, setIsViewingDoctorDetails] = useState(false);
  const [viewedPatient, setViewedPatient] = useState("");
  const [currentPage, setCurrentPage] = useState("home");


  const appContext = useApplicationContext();
  const navigate = useNavigate();

  const navbarItems: NavItem[] = [
    { label: "Home", href: "home" },
    { label: "Doctor Details", href: "doctor-details" },
    { label: "Logout", href: "logout" },
  ];

  const handleNavigation = (href: string) => {
    if (href === "logout") {
      appContext.logout();
      navigate("/signin");
    }
    setIsViewingDoctorDetails(href === "doctor-details");
    setCurrentPage(href);
    setViewedPatient("");
  };

  const handleViewPatient = (patientId: string) => {
    setViewedPatient(patientId);
    setCurrentPage("patient");
  };

  useEffect(() => {
    if (fetchedDoctor) {
      setDoctor(fetchedDoctor); // Update doctor state with fetched data
    }
  }, [fetchedDoctor]);

  if (isDoctorLoading) {
    return <p>Loading doctor details...</p>;
  }

  if (doctorStatus === "error" || doctorError) {
    return <p>Error fetching doctor details</p>;
  }

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
                  appointments={appointments || []} // Appointments filtered by doctorId
                  patients={patients || []}
                  setAppointments={() => {}} // No need to set appointments if fetched from backend
                  currentDoctorId={doctorId || ""}
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
