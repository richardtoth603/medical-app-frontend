import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'

interface Patient {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: Date
}

export default function PatientScreen(givenPatient: Patient) {
  const [patient, setPatient] = useState<Patient>(givenPatient)
  const [chatMessage, setChatMessage] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Chat message submitted:', chatMessage)
    setChatMessage('')
  }

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)
    }
  }

  const generatePrescription = () => {
    console.log('Generating prescription...')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Patient Screen</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Details */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                <Input
                  id="firstName"
                  value={patient.firstName}
                  onChange={(e) => setPatient({ ...patient, firstName: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                <Input
                  id="lastName"
                  value={patient.lastName}
                  onChange={(e) => setPatient({ ...patient, lastName: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={patient.dateOfBirth.toISOString().split('T')[0]}
                  onChange={(e) => setPatient({ ...patient, dateOfBirth: new Date(e.target.value) })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card>
          <CardHeader>
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChatSubmit}>
              <Textarea
                placeholder="Type your message here..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="mb-2"
              />
              <Button type="submit">Send Message</Button>
            </form>
          </CardContent>
        </Card>

        {/* Prescription Manager */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Prescription Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
            >
              <p>Drag and drop a PDF file here, or</p>
              <label htmlFor="file-upload" className="cursor-pointer text-blue-500 hover:text-blue-600">
                click to upload
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                className="hidden"
              />
              {pdfFile && <p className="mt-2">File uploaded: {pdfFile.name}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={generatePrescription}>Generate Prescription</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}