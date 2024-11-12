import React, { useState } from "react";
import { Doctor } from "@/domain/models/Doctor";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface DoctorProfileProps {
  doctor: Doctor;
  setDoctor: React.Dispatch<React.SetStateAction<Doctor>>;
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({ doctor, setDoctor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(doctor.firstName);
  const [lastName, setLastName] = useState(doctor.lastName);
  const [specialization, setSpecialization] = useState(doctor.specialization);

  const saveChanges = () => {
    setDoctor({ ...doctor, firstName, lastName, specialization });
    setIsEditing(false);
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-2xl">Doctor Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {isEditing ? (
          <div className="space-y-4">
            <Input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <Input
              placeholder="Specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            />
            <Button onClick={saveChanges}>Save</Button>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <>
            <p>
              <strong>Name:</strong> {doctor.firstName} {doctor.lastName}
            </p>
            <p>
              <strong>Specialization:</strong> {doctor.specialization}
            </p>
            <Button onClick={() => setIsEditing(true)}>
              Edit Doctor Information
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DoctorProfile;
