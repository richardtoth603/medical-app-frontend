import { useEffect, useState } from "react";
import { Navbar, NavItem } from "../ui/navbar";
import { PatientDetails } from "./patient-details";
import DoctorDetails from "./doctors-page-patient-pov";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Medicine } from "@/domain/models/Medicine";
import { useNavigate, useParams } from "react-router-dom";
import {MentalHealthDashboard} from "@/components/mental-health/MentalHealthDashboard.tsx";
import {
  useFetchDoctors,
  useFetchAppointmentsByPatientId,
} from "@/hooks/patientHooks";
import { useApplicationContext } from "@/context/ApplicationContext";

const dummyMedicines: Medicine[] = [
  {
    id: "M001",
    name: "Aspirin",
    description: "Pain reliever",
    frequency: "Once a day",
    dosage: "500mg",
  },
  {
    id: "M002",
    name: "Paracetamol",
    description: "Pain and fever reducer",
    frequency: "Twice a day",
    dosage: "500mg",
  },
  {
    id: "M003",
    name: "Amoxicillin",
    description: "Antibiotic",
    frequency: "Three times a day",
    dosage: "250mg",
  },
  {
    id: "M004",
    name: "Ibuprofen",
    description: "Anti-inflammatory",
    frequency: "Once a day",
    dosage: "200mg",
  },
  {
    id: "M005",
    name: "Metformin",
    description: "Blood sugar regulator",
    frequency: "Twice a day",
    dosage: "500mg",
  },
];

const navItems: NavItem[] = [
  { label: "Home", href: "home" },
  { label: "Patient Details", href: "patient" },
  { label: "Mental Health", href: "mental-health" },
  {label: "Logout", href: "logout"}
];

export default function PatientPortal() {
  const { data, status, isLoading } = useFetchDoctors();
  const [currentPage, setCurrentPage] = useState("home");
  const [medicines] = useState<Medicine[]>(dummyMedicines);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const params = useParams();
  const appContext = useApplicationContext();
  const navigate = useNavigate();

  // Fetch appointments using the patient's ID
  const patientId = localStorage.getItem("role_id") || "";
  const {
    data: appointments,
    status: appointmentsStatus,
    isLoading: appointmentsLoading,
  } = useFetchAppointmentsByPatientId(patientId);

  // check if the user is authorized to view this page
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/signup");
    }

    const roleIdFromPath = params.roleId;
    const roleIdFromStorage = localStorage.getItem("role_id");

    if (roleIdFromPath !== roleIdFromStorage) {
      navigate("/signin");
    }
  }, []);

  const handleNavigation = (href: string) => {
    if(href === "logout") {
      appContext.logout();
      navigate("/signin");
    }
    setCurrentPage(href);
    setSelectedDoctor("");
  };

  const handleViewDoctor = (doctor: string) => {
    setSelectedDoctor(doctor);
  };

  const handleBackToList = () => {
    setSelectedDoctor("");
  };

  const renderContent = () => {
    if (selectedDoctor) {
      return (
        <DoctorDetails doctorId={selectedDoctor} onBack={handleBackToList} />
      );
    }

    switch (currentPage) {
      case "patient":
        return (
          <PatientDetails patientId={patientId} />
        );
      case "mental-health":
        return <MentalHealthDashboard />;
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              Welcome to the Patient Portal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Doctors Card */}
              <Card className="shadow-md h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Your Doctors:
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] overflow-y-auto pr-4">
                    {isLoading && <p>Loading...</p>}
                    {status === "error" && <p>Error fetching doctors</p>}
                    {status === "success" && data && data.length === 0 && (
                      <p>No doctors found</p>
                    )}
                    {status === "success" &&
                      data.map((doctor) => (
                        <div
                          key={doctor.id}
                          className="mb-4 p-3 bg-secondary rounded-lg"
                        >
                          <h3 className="font-medium">
                            {doctor.firstName} {doctor.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Specialization: {doctor.specialization}
                          </p>
                          <div className="mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => handleViewDoctor(doctor.id)}
                            >
                              View Doctor Page
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Medicine Card */}
              <Card className="shadow-md h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Medicine that's been prescribed to you:
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] overflow-y-auto pr-4">
                    {medicines.map((medicine) => (
                      <div
                        key={medicine.id}
                        className="mb-4 p-3 bg-secondary rounded-lg"
                      >
                        <h3 className="font-medium">{medicine.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {medicine.description}
                        </p>
                        <p className="text-sm">
                          Frequency: {medicine.frequency}
                        </p>
                        <p className="text-sm">Dosage: {medicine.dosage}</p>
                        <div className="mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            View Prescription
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      Upload a new Prescription
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timetable Section */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Your Appointments</h3>
              <table className="table-auto w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border">Date</th>
                    <th className="px-4 py-2 border">Time</th>
                    <th className="px-4 py-2 border">Doctor</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentsLoading && (
                    <tr>
                      <td colSpan={3}>Loading appointments...</td>
                    </tr>
                  )}
                  {appointmentsStatus === "error" && (
                    <tr>
                      <td colSpan={3}>Error fetching appointments</td>
                    </tr>
                  )}
                  {appointmentsStatus === "success" &&
                    appointments?.length === 0 && (
                      <tr>
                        <td colSpan={3}>No appointments found</td>
                      </tr>
                    )}
                  {appointmentsStatus === "success" &&
                    appointments?.map((appointment) => {
                      const doctor = data?.find(
                        (doc) => doc.id === appointment.doctorId
                      );
                      return (
                        <tr key={appointment.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border">
                            {appointment.date.toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2 border">
                            {appointment.time}
                          </td>
                          <td className="px-4 py-2 border">
                            {doctor
                              ? `${doctor.firstName} ${doctor.lastName}`
                              : "Unknown"}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        title="Patient Portal"
        items={navItems}
        onNavigate={handleNavigation}
      />
      <main className="flex-grow container mx-auto p-4">{renderContent()}</main>
    </div>
  );
}
