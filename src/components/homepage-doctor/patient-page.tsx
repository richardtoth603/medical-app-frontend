import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useFetchPatientById } from '@/hooks/doctorHooks'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileText, Upload } from 'lucide-react'
import { useAddDocument, useFetchDocumentsByPatientId } from '@/hooks/patientHooks'
import { useFetchMessages, useSendMessage } from '@/hooks/chatMessageHooks'
import ReactPDF, { Document, Page, Text, usePDF, View } from '@react-pdf/renderer'
import dayjs from 'dayjs'



interface DocumentData {
  firstName: string;
  lastName: string;
  cnp: string;
  age: string;
  anamnesis: string;
  diagnosis: string;
}

export default function PatientScreen({ patientId }: { patientId: string}) {
  const [newMessage, setNewMessage] = useState('')
  const [documentData, setDocumentData] = useState<DocumentData>({
    firstName: '',
    lastName: '',
    cnp: '',
    age: '',
    anamnesis: '',
    diagnosis: ''
  })

  const MyDocument = (
    <Document>
      <Page size="A4">
        <View>
          <Text>Some text</Text>
        </View>
      </Page>
    </Document>
  );
  const [instance, updateInstance] = usePDF({ document: MyDocument });
  const [pdfs, setPdfs] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const doctorId = localStorage.getItem('role_id') || ''

  const { data: patient, isLoading: isPatientLoading, status: patientStatus } = useFetchPatientById(patientId)
  const { mutate: addDocument } = useAddDocument()
  const { data: documents, isLoading: isDocumentsLoading, status: documentsStatus } = useFetchDocumentsByPatientId(patientId)
  const { data: messages, isLoading: isMessagesLoading } = useFetchMessages(doctorId, patientId)
  const sendMessageMutation = useSendMessage()

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newPdfs = Array.from(files).filter(file => file.type === 'application/pdf')
      newPdfs.forEach(pdf => {
        addDocument({ file: pdf, patientId })
      })
      setPdfs(prevPdfs => [...prevPdfs, ...newPdfs])
    }
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setDocumentData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  useEffect(() => {
    const MedicalLetter = (
      <Document>
        <Page size="A4" style={{flexDirection:"column", margin:"20px"}}>
          <View style={{justifyContent:"center", flexDirection:"column", alignItems: "center", backgroundColor:"#cccccc", margin:"50px", padding: "20px"}}>
            <Text style={{textDecoration:"underline", fontWeight:"extrabold", fontSize:"30px", textAlign:"center"}}>Medical Letter</Text>            
          </View>
          <View style={{flexDirection:"row", justifyContent:"flex-start", marginBottom:"10px"}}>
            <Text style={{fontWeight:"bold", fontSize:"20px", textAlign:"center"}}>First Name: </Text>
            <Text style={{fontSize:"20px", textAlign:"center"}}>{documentData.firstName}</Text>
          </View>
          <View style={{flexDirection:"row", justifyContent:"flex-start", marginBottom:"10px"}}>
            <Text style={{fontWeight:"bold", fontSize:"20px", textAlign:"center"}}>Last Name: </Text>
            <Text style={{fontSize:"20px", textAlign:"center"}}>{documentData.lastName}</Text>
          </View>
          <View style={{flexDirection:"row", justifyContent:"flex-start", marginBottom:"10px"}}>
            <Text style={{fontWeight:"bold", fontSize:"20px", textAlign:"center"}}>CNP: </Text>
            <Text style={{fontSize:"20px", textAlign:"center"}}>{documentData.cnp}</Text>
          </View>
          <View style={{flexDirection:"row", justifyContent:"flex-start", marginBottom:"10px"}}>
            <Text style={{fontWeight:"bold", fontSize:"20px", textAlign:"center"}}>Age: </Text>
            <Text style={{fontSize:"20px", textAlign:"center"}}>{documentData.age}</Text>
          </View>
          <View style={{flexDirection:"row", justifyContent:"flex-start", marginBottom:"10px"}}>
            <Text style={{fontWeight:"bold", fontSize:"20px", textAlign:"center"}}>Anamnesis: </Text>
            <Text style={{fontSize:"20px", textAlign:"center"}}>{documentData.anamnesis}</Text>
          </View>
          <View style={{flexDirection:"row", justifyContent:"flex-start", marginBottom:"10px"}}>
            <Text style={{fontWeight:"bold", fontSize:"20px"}}>Diagnosis: </Text>
            <Text style={{fontSize:"20px", textAlign:"center"}}>{documentData.diagnosis}</Text>
          </View>
        </Page>
      </Document>
    );
    updateInstance(MedicalLetter);
  }
  , [documentData, updateInstance]);

  const handleFileCreationSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    console.log('Document Data:', documentData)

    if(instance.blob) {
      const file = new File([instance.blob], 'test.pdf', { type: 'application/pdf' });
      addDocument({ file, patientId });
    }
    //clear the form
    setDocumentData({
      firstName: '',
      lastName: '',
      cnp: '',
      age: '',
      anamnesis: '',
      diagnosis: ''
    })
  }

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    const files = event.dataTransfer.files
    handleFileUpload(files)
  }


  const handleDownload = (fileName: string) => {
    const file = documents?.find(pdf => pdf.name === fileName)
    if (file) {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(file)
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      sendMessageMutation.mutate({
        sentBy: doctorId,
        sentTo: patientId,
        content: newMessage,
      })
      setNewMessage('')
    }
  }

  const sortedMessages = messages?.sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime())

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Patient Screen</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Details */}
        <Card className="shadow-md overflow-hidden h-full">
          {isPatientLoading && <p>Loading...</p>}
          {patientStatus === "error" && <p>Error fetching patient</p>}
          {patientStatus === "success" && patient && (
            <>
              <CardHeader>
                <CardTitle>Patient Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 font-semibold">First Name:</div>
                  <div className="col-span-2">{patient.firstName}</div>

                  <div className="col-span-1 font-semibold">Last Name:</div>
                  <div className="col-span-2">{patient.lastName}</div>

                  <div className="col-span-1 font-semibold">Date of Birth:</div>
                  <div className="col-span-2">{dayjs(patient.dateOfBirth).format('MMM D, YYYY')}</div>
                </dl>
              </CardContent>
            </>
          )}
        </Card>

        {/* Chat Window */}
        <Card className="shadow-md overflow-hidden h-full">
          <CardHeader>
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <CardContent>
            {isMessagesLoading ? (
              <div>Loading messages...</div>
            ) : (
              <div className="h-64 overflow-y-auto mb-4 p-4 border rounded-md space-y-4">
                {sortedMessages?.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sentBy === doctorId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.sentBy === doctorId
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
              </div>
            )}
            <form onSubmit={handleSendMessage}>
              <Textarea
                placeholder="Type your message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="mb-2"
              />
              <Button type="submit" disabled={sendMessageMutation.isLoading}>
                {sendMessageMutation.isLoading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="m-6" />
      {/* Create Document Form */}
      <Card className="shadow-md overflow-hidden h-full">
        <CardHeader>
          <CardTitle>Create Document</CardTitle>
          <CardDescription>Fill out the form to create a new medical letter</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFileCreationSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="document-firstname">First Name</Label>
                <Input name="firstName" id="document-firstname" type="text" placeholder="Patient's First Name" onChange={handleInputChange} value={documentData.firstName} required/>
              </div>
              <div>
                <Label htmlFor="document-lastname">Last Name</Label>
                <Input name="lastName" onChange={handleInputChange} value={documentData.lastName} id="document-lastname" type="text" placeholder="Patient's Last Name" required />
              </div>
              <div>
                <Label htmlFor="document-cnp">CNP</Label>
                <Input name="cnp" onChange={handleInputChange} value={documentData.cnp} id="document-cnp" type="text" placeholder="Patient's CNP" required />
              </div>
              <div>
                <Label htmlFor="document-age">Age</Label>
                <Input name="age" onChange={handleInputChange} value={documentData.age} id="document-age" type="text" placeholder="Patient's Age" required />
              </div>
              <div>
                <Label htmlFor="document-anamnesis">Anamnesis</Label>
                <Input name="anamnesis" onChange={handleInputChange} value={documentData.anamnesis} id="document-anamnesis" type="text" placeholder="Anamnesis" required />
              </div>
              <div>
                <Label htmlFor="document-diagnosis">Diagnosis</Label>
                <Input name="diagnosis" onChange={handleInputChange} value={documentData.diagnosis} id="document-diagnosis" type="text" placeholder="Diagnosis" required />
              </div>
              <Button type="submit">Create Document</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="m-6" />
      {/* Upload Medical Documents */}
      <Card className="shadow-md overflow-hidden h-full">
        <CardHeader>
          <CardTitle>Upload Medical Documents</CardTitle>
          <CardDescription>Add your medical PDFs here for easy access</CardDescription>
        </CardHeader>
        <CardContent className="shadow-md overflow-hidden h-full">
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground'
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
                {isDocumentsLoading && <div>Loading...</div>}
                {documentsStatus === "error" && <div>Error fetching data</div>}
                {documentsStatus === 'success' && documents && documents.map((pdf, index) => (
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
  )
}

