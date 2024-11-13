import { useEffect, useState } from "react";
import { Navbar, NavItem } from "../ui/navbar";
import { PatientDetails } from "./patient-details";
import { DoctorDetails } from "./doctors-page-patient-pov";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Patient } from "@/domain/models/Patient";
import { Doctor } from "@/domain/models/Doctor";
import { Medicine } from "@/domain/models/Medicine";
import { useApplicationContext } from "@/context/ApplicationContext";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchDoctors } from "@/hooks/patientHooks";

const dummyPatient: Patient = {
  id: "P12345",
  firstName: "Jane",
  lastName: "Doe",
  dateOfBirth: new Date(1985, 5, 15),
};

const dummyDoctors: Doctor[] = [
  {
    id: "D001",
    firstName: "John",
    lastName: "Smith",
    specialization: "Cardiology",
  },
  {
    id: "D002",
    firstName: "Emma",
    lastName: "Johnson",
    specialization: "Neurology",
  },
  {
    id: "D003",
    firstName: "Michael",
    lastName: "Brown",
    specialization: "Pediatrics",
  },
  {
    id: "D004",
    firstName: "Sarah",
    lastName: "Davis",
    specialization: "Oncology",
  },
  {
    id: "D005",
    firstName: "David",
    lastName: "Wilson",
    specialization: "Orthopedics",
  },
];

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
];

export default function PatientPortal() {
  const { data, status, isLoading} = useFetchDoctors();
  const [currentPage, setCurrentPage] = useState("home");
  const [medicines] = useState<Medicine[]>(dummyMedicines);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const params = useParams();
  const navigate = useNavigate();

  // check if the user is authorized to view this page
  useEffect(() => {
    if (localStorage.getItem("token") === null || localStorage.getItem("token") === undefined) {
      navigate("/signup");
    }
    //TODO: technically we should check for the user ID here, instead of the roleId
    const roleIdFromPath = params.roleId;
    const roleIdFromStorage = localStorage.getItem("role_id");

    if (roleIdFromPath !== roleIdFromStorage) {
      navigate("/signin");
    }
  }, []);

  const handleNavigation = (href: string) => {
    setCurrentPage(href);
    setSelectedDoctor(null);
  };

  const handleViewDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleBackToList = () => {
    setSelectedDoctor(null);
  };

  const renderContent = () => {
    if (selectedDoctor) {
      return (
        <DoctorDetails doctor={selectedDoctor} onBack={handleBackToList} />
      );
    }

    switch (currentPage) {
      case "patient":
        return <PatientDetails initialPatient={dummyPatient} />;
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              Welcome to the Patient Portal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    {status === 'success' && data.map((doctor) => (
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
                            onClick={() => handleViewDoctor(doctor)}
                          >
                            View Doctor Page
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
