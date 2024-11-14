import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Patient } from "@/domain/models/Patient";
import { useFetchPatientById } from "@/hooks/doctorHooks";
import { Upload, FileText } from "lucide-react";
import { useAddDocument, useFetchDocumentsByPatientId } from "@/hooks/patientHooks";

interface PatientDetailsProps {
  patientId: string;
}

export function PatientDetails({ patientId }: PatientDetailsProps) {

  const { data, isLoading, status } = useFetchPatientById(patientId);

  const { mutate } = useAddDocument();

  const { data: documents, isLoading: isDocumentsLoading, status: documentsStatus } = useFetchDocumentsByPatientId(patientId);

  const [patient, setPatient] = useState<Patient>(data ? data : { id: "", firstName: "", lastName: "", dateOfBirth: new Date() });
  const [isEditing, setIsEditing] = useState(false);

  const [pdfs, setPdfs] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    console.log("Updated patient:", patient);
  };

  const handleFileUpload = (files: FileList | null) => {
    debugger;
    if (files) {
      const newPdfs = Array.from(files)
        .filter(file => file.type === 'application/pdf')
      newPdfs.forEach(pdf => {
        mutate({ file: pdf, patientId });
      });
      setPdfs(prevPdfs => [...prevPdfs, ...newPdfs])
    }
  }

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave =(event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const onDrop =(event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    const files = event.dataTransfer.files
    handleFileUpload(files)
  }

  const handleDownload = (fileName: string) => {
    const file = documents?.find(pdf => pdf.name === fileName);
    if (file) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  return (
    <div className="container mx-auto p-4 ">
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
      <div className="m-6" />
      <Card className="shadow-md overflow-hidden h-full">
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
  );
}
