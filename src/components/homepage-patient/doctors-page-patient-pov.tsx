import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFetchDoctorById } from "@/hooks/patientHooks";
import { useFetchMessages, useSendMessage } from "@/hooks/chatMessageHooks";
import dayjs from 'dayjs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Doctor } from "@/domain/models/Doctor";
import { useFetchDoctorById } from "@/hooks/patientHooks";
import AppointmentTimetable from "@/components/homepage-patient/appt-table";

interface DoctorDetailsProps {
  doctorId: string;
  patientId: string;
  onBack: () => void;
}

export function DoctorDetails({ doctorId, patientId, onBack }: DoctorDetailsProps) {
  const [newMessage, setNewMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { data: doctor, isLoading: isLoadingDoctor, status: doctorStatus } = useFetchDoctorById(doctorId);
  const { data: messages, isLoading: isLoadingMessages } = useFetchMessages(doctorId, patientId);
  const sendMessageMutation = useSendMessage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, status } = useFetchDoctorById(doctorId);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [appointmentConfirmation, setAppointmentConfirmation] = useState("");
  const [newlyBookedAppointment, setNewlyBookedAppointment] = useState<{
    date: string;
    time: string;
  } | null>(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessageMutation.mutate({
        doctorID: doctorId,
        patientId: patientId,
        content: newMessage,
      });
      setNewMessage("");

  const handleBookAppointment = () => {
    if (selectedDate && selectedTime) {
      setIsConfirmModalOpen(true);
    }
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

  const confirmAppointment = () => {
    alert(`Your appointment with Dr. ${doctor?.lastName} on ${selectedDate} at ${selectedTime} has been confirmed.`);
    setIsConfirmModalOpen(false);
    setSelectedDate("");
    setSelectedTime("");
  };

  const sortedMessages = messages?.sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Doctor Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Doctor Details</CardTitle>
          </CardHeader>
          {isLoadingDoctor && <div>Loading...</div>}
          {doctorStatus === "error" && <div>Error fetching data</div>}
          {doctorStatus === "success" && doctor && (
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-grow space-y-4">
                  <div>
                    <h3 className="font-semibold">Name:</h3>
                    <p>
                      {doctor.firstName} {doctor.lastName}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Specialization:</h3>
                    <p>{doctor.specialization}</p>
                  </div>
                </div>
                <div className="w-36 h-36 rounded-lg overflow-hidden">
                  <img
                    src="/placeholder.svg?height=144&width=144"
                    alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">About:</h3>
                <p className="text-muted-foreground">
                  Dr. {doctor.firstName} {doctor.lastName} is a highly skilled{" "}
                  {doctor.specialization.toLowerCase()} specialist with years of
                  experience in the field. They are dedicated to providing the
                  best care for their patients and staying up-to-date with the
                  latest medical advancements.
                </p>
              </div>
            </CardContent>
          )}
        </Card>

        <Card>
          {isLoadingDoctor && <div>Loading...</div>}
          {doctorStatus === "error" && <div>Error fetching data</div>}
          {doctorStatus === "success" && doctor && (
            <>
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Chat with Dr. {doctor.lastName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingMessages ? (
                  <div>Loading messages...</div>
                ) : (
                  <div className="h-64 overflow-y-auto mb-4 p-4 border rounded-md space-y-4">
                    {sortedMessages?.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.doctorID === doctorId ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            msg.doctorID === doctorId
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground'
                          }`}
                        >
                          <p className="mb-1">{msg.content}</p>
                          <p className="text-xs opacity-70">
                            {dayjs(msg.sentAt).format('MMM D, YYYY HH:mm')}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-grow"
                  />
                  <Button onClick={handleSendMessage} disabled={sendMessageMutation.isLoading}>
                    {sendMessageMutation.isLoading ? 'Sending...' : 'Send'}
                  </Button>
                </div>
                {sendMessageMutation.isError && (
                  <p className="text-destructive mt-2">Error sending message. Please try again.</p>
                )}
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

