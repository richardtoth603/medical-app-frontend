import React, { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useFetchPatientById } from '@/hooks/doctorHooks'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { FileText, Upload } from 'lucide-react'

interface Patient {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: Date
}

export default function PatientScreen({ patientId }: { patientId: string }) {
  const [patient] = useState<Patient>({
    id: '12345',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('1990-01-01'),
  })
  const [chatMessage, setChatMessage] = useState('')

  const [pdfs, setPdfs] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (files) {
      const newPdfs = Array.from(files)
        .filter(file => file.type === 'application/pdf')
      setPdfs(prevPdfs => [...prevPdfs, ...newPdfs])
    }
  }, [])

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    const files = event.dataTransfer.files
    handleFileUpload(files)
  }, [handleFileUpload])

  const handleDownload = useCallback((fileName: string) => {
    const file = pdfs.find(pdf => pdf.name === fileName);
    if (file) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [pdfs]);

  const { data, isLoading, status } = useFetchPatientById(patientId)

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Chat message submitted:', chatMessage)
    setChatMessage('')
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
        <Card>
          <CardHeader>
            <CardTitle>Upload Medical Documents</CardTitle>
            <CardDescription>Add your medical PDFs here for easy access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground'
                  }`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  id="pdf-upload"
                  className="hidden"
                  multiple
                />
                <Label htmlFor="pdf-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center space-y-2">
                    <Upload size={40} />
                    <span className="font-semibold">Drag & drop PDFs here or click to select</span>
                    <span className="text-sm text-muted-foreground">Supports multiple files</span>
                  </div>
                </Label>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Uploaded PDFs:</h3>
                <ul className="space-y-2">
                  {pdfs.map((pdf, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <FileText size={20} />
                      <span className="cursor-pointer text-blue-500" onClick={() => handleDownload(pdf.name)}>
                        <span>{pdf.name}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}