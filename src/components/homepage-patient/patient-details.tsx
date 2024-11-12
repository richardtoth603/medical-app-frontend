import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Patient } from "@/domain/models/Patient";

interface PatientDetailsProps {
  initialPatient: Patient;
}

export function PatientDetails({ initialPatient }: PatientDetailsProps) {
  const [patient, setPatient] = useState<Patient>(initialPatient);
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
    <Card className="shadow-md overflow-hidden h-full">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-semibold">Patient Details</CardTitle>
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
            <Button onClick={() => setIsEditing(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        )}
      </CardFooter>
    </Card>
  );
}
