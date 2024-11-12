import React from "react";
import { Patient } from "@/domain/models/Patient";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PatientListProps {
  patients: Patient[];
}

const PatientList: React.FC<PatientListProps> = ({ patients }) => (
  <Card className="h-[400px] w-[700px] flex-col">
    <CardHeader>
      <CardTitle>Patients List</CardTitle>
    </CardHeader>
    <CardContent className="flex-1 overflow-hidden">
      {/* Scrollable area for patient list */}
      <div className="overflow-y-auto max-h-[300px]">
        {patients.length > 0 ? (
          <ul className="space-y-2">
            {patients.map((patient) => (
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
                    {patient.firstName} {patient.lastName || "Unknown Patient"}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="link">View Patient Page</Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no patients.</p>
        )}
      </div>
    </CardContent>
  </Card>
);

export default PatientList;
