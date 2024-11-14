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
import { useFetchPatientById } from "@/hooks/doctorHooks";

interface PatientDetailsProps {
  patientId: string;
}

export function PatientDetails({ patientId }: PatientDetailsProps) {

  const { data, isLoading, status } = useFetchPatientById(patientId);

  const [patient, setPatient] = useState<Patient>(data ? data : { id: "", firstName: "", lastName: "", dateOfBirth: new Date() });
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
      {isLoading && <div>Loading...</div>}
      {status === "error" && <div>Error fetching data</div>}
      {status === "success" && data && <>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-semibold">Patient Details</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={data.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={data.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
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
      </>}
    </Card>
  );
}
