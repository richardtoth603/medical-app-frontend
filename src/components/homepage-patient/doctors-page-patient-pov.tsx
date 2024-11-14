import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Doctor } from "@/domain/models/Doctor";
import { useFetchDoctorById } from "@/hooks/patientHooks";
import { stat } from "fs";

interface DoctorDetailsProps {
  doctorId: string;
  onBack: () => void;
}

export function DoctorDetails({ doctorId, onBack }: DoctorDetailsProps) {
  const [chatMessages, setChatMessages] = useState<
    { sender: string; message: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const { data, isLoading, status } = useFetchDoctorById(doctorId);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        { sender: "You", message: newMessage },
      ]);
      setNewMessage("");
      // simulate doctor's response
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

  const handleBookAppointment = () => {
    if (selectedDate && selectedTime) {
      alert(
        `Appointment booked with Dr. ${data?.lastName} on ${selectedDate} at ${selectedTime}`
      );
      setSelectedDate("");
      setSelectedTime("");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Doctor Details */}
        {/* Doctor Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Doctor Details</CardTitle>
          </CardHeader>
          {isLoading && <div>Loading...</div>}
          {status === "error" && <div>Error fetching data</div>}
          {status === "success" && data &&
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                {/* Doctor Info Section */}
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

                {/* Image Section */}
                <div className="w-36 h-36 rounded-lg overflow-hidden">
                  <img
                    src="src\components\homepage-patient\doctor_profiles\doctor.jpg"
                    alt={`Dr. ${data.firstName} ${data.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* About Section */}
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
            </CardContent>}
        </Card>

        {/* Chat */}
        <Card>
          {isLoading && <div>Loading...</div>}
          {status === "error" && <div>Error fetching data</div>}
          {status === "success" && data &&
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
                  className={`mb-2 ${msg.sender === "You" ? "text-right" : "text-left"
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
          </>}
        </Card>
      </div>

      {/* Appointment Booking */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Book an Appointment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Select Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="time">Select Time</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="14:00">02:00 PM</SelectItem>
                  <SelectItem value="15:00">03:00 PM</SelectItem>
                  <SelectItem value="16:00">04:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox id="terms" />
            <Label htmlFor="terms">I agree to the terms and conditions</Label>
          </div>
          <Button onClick={handleBookAppointment} className="mt-4">
            Book Appointment
          </Button>
        </CardContent>
      </Card>

      <CardFooter>
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
      </CardFooter>
    </div>
  );
}
