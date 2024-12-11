import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Doctor } from "@/domain/models/Doctor";
import { useFetchDoctorById } from "@/hooks/patientHooks";
import AppointmentTimetable from "@/components/homepage-patient/appt-table";

interface DoctorDetailsProps {
  doctorId: string;
  onBack: () => void;
}

export function DoctorDetails({ doctorId, onBack }: DoctorDetailsProps) {
  const [chatMessages, setChatMessages] = useState<
    { sender: string; message: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const { data, isLoading, status } = useFetchDoctorById(doctorId);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [appointmentConfirmation, setAppointmentConfirmation] = useState("");
  const [newlyBookedAppointment, setNewlyBookedAppointment] = useState<{
    date: string;
    time: string;
  } | null>(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        { sender: "You", message: newMessage },
      ]);
      setNewMessage("");
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "Doctor",
            message: "Thank you for your message. How can I help you today?",
          },
        ]);
      }, 1000);
    }
  };

  const handleBookAppointment = (date: string, time: string) => {
    setAppointmentConfirmation(
      `Appointment booked with Dr. ${data?.lastName} on ${date} at ${time}`
    );
    setShowConfirmation(true);
    setNewlyBookedAppointment({ date, time });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Doctor Details</CardTitle>
          </CardHeader>
          {isLoading && <div>Loading...</div>}
          {status === "error" && <div>Error fetching data</div>}
          {status === "success" && data && (
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-grow space-y-4">
                  <div>
                    <h3 className="font-semibold">Name:</h3>
                    <p>
                      {data.firstName} {data.lastName}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Specialization:</h3>
                    <p>{data.specialization}</p>
                  </div>
                </div>
                <div className="w-36 h-36 rounded-lg overflow-hidden">
                  <img
                    src="/placeholder.svg?height=144&width=144"
                    alt={`Dr. ${data.firstName} ${data.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">About:</h3>
                <p className="text-muted-foreground">
                  Dr. {data.firstName} {data.lastName} is a highly skilled{" "}
                  {data.specialization.toLowerCase()} specialist with years of
                  experience in the field. They are dedicated to providing the
                  best care for their patients and staying up-to-date with the
                  latest medical advancements.
                </p>
              </div>
            </CardContent>
          )}
        </Card>

        <Card>
          {isLoading && <div>Loading...</div>}
          {status === "error" && <div>Error fetching data</div>}
          {status === "success" && data && (
            <>
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Chat with Dr. {data.lastName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 overflow-y-auto mb-4 p-4 border rounded-md">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-2 ${
                        msg.sender === "You" ? "text-right" : "text-left"
                      }`}
                    >
                      <span className="font-semibold">{msg.sender}: </span>
                      {msg.message}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-grow"
                  />
                  <Button onClick={handleSendMessage}>Send</Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>

      <AppointmentTimetable
        doctorId={doctorId}
        onBookAppointment={handleBookAppointment}
        newlyBookedAppointment={newlyBookedAppointment}
      />

      <CardFooter>
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
      </CardFooter>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full m-4">
            <h3 className="text-lg font-semibold mb-4">
              Appointment Confirmed
            </h3>
            <p>{appointmentConfirmation}</p>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setShowConfirmation(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
