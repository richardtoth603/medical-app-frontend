import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Patient } from "@/domain/models/Patient";
import { Doctor } from "@/domain/models/Doctor";
import { Medicine } from "@/domain/models/Medicine";

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

export default function PatientDetailsForm() {
  const [patient, setPatient] = useState<Patient>(dummyPatient);
  const [doctors] = useState<Doctor[]>(dummyDoctors);
  const [medicines] = useState<Medicine[]>(dummyMedicines);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleDateChange = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);
    setPatient({ ...patient, dateOfBirth: new Date(year, month - 1, day) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    console.log("Updated patient:", patient);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-7xl space-y-4">
        {/* Patient Details and Doctors Cards side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Patient Details Card */}
          <div className="h-auto">
            <Card className="shadow-md overflow-hidden h-full">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg font-semibold">
                  Patient Details
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-2">
                  <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                    <Label htmlFor="id">ID</Label>
                    <Input id="id" name="id" value={patient.id} disabled />
                  </div>
                  <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={patient.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={patient.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    {isEditing ? (
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={patient.dateOfBirth.toISOString().split("T")[0]}
                        onChange={(e) => handleDateChange(e.target.value)}
                      />
                    ) : (
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={patient.dateOfBirth.toLocaleDateString()}
                        disabled
                      />
                    )}
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                {isEditing ? (
                  <>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Save</Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>Edit</Button>
                )}
              </CardFooter>
            </Card>
          </div>

          {/* Doctors List Card */}
          <div className="h-auto">
            <Card className="shadow-md h-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Your Doctors:
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] overflow-y-auto pr-4">
                  {doctors.map((doctor) => (
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
                          onClick={() =>
                            console.log(
                              `View doctor ${doctor.firstName} ${doctor.lastName}`
                            )
                          }
                        >
                          View Doctor Page
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Medicine List Card under Patient Details and Doctors Cards */}
        <div className="h-auto">
          <Card className="shadow-md h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Medicine that's been prescribed to you:
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] overflow-y-auto pr-4">
                {medicines.map((medicine) => (
                  <div
                    key={medicine.id}
                    className="mb-4 p-3 bg-secondary rounded-lg"
                  >
                    <h3 className="font-medium">{medicine.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {medicine.description}
                    </p>
                    <p className="text-sm">Frequency: {medicine.frequency}</p>
                    <p className="text-sm">Dosage: {medicine.dosage}</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        View Prescription
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Add Prescription Button */}
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => console.log("Add new medicine")}
                >
                  Upload a new Prescription
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
