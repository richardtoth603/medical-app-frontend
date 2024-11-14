import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useFetchPatientById } from '@/hooks/doctorHooks'

interface Patient {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: Date
}

export default function PatientScreen( { patientId }: { patientId: string } ) {
  const [patient] = useState<Patient>({
    id: '12345',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('1990-01-01'),
  })
  const [chatMessage, setChatMessage] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  const { data, isLoading, status } = useFetchPatientById(patientId)

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString(undefined, options)
  }

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
        {isLoading && <p>Loading...</p>}
        {status === "error" && <p>Error fetching patient</p>}
        {status === "success" && data && 
        <Card>
          <CardHeader>
            <CardTitle>Patient Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-3 gap-4">
              <div className="col-span-1 font-semibold">ID:</div>
              <div className="col-span-2">{data.id}</div>

              <div className="col-span-1 font-semibold">First Name:</div>
              <div className="col-span-2">{data.firstName}</div>

              <div className="col-span-1 font-semibold">Last Name:</div>
              <div className="col-span-2">{data.lastName}</div>

              {/* <div className="col-span-1 font-semibold">Date of Birth:</div>
              <div className="col-span-2">{formatDate(data.dateOfBirth)}</div> */}
            </dl>
          </CardContent>
        </Card>}

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