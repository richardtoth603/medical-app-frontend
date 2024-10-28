import { useCallback, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { FileText, Upload, Send } from 'lucide-react'

export function MedicalAppComponent() {
  const [pdfs, setPdfs] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (files) {
      const newPdfs = Array.from(files)
        .filter(file => file.type === 'application/pdf')
        .map(file => file.name)
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

  return (
    <div className="flex flex-col">
      <header className="bg-primary text-primary-foreground p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">MediConnect</h1>
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Profile</a></li>
            <li><a href="#" className="hover:underline">Appointments</a></li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <div className="grid gap-6 md:grid-cols-2">
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
                        <span>{pdf}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Your Doctor</CardTitle>
              <CardDescription>Send a message to your healthcare provider</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor">Select Doctor</Label>
                  <select id="doctor" className="w-full p-2 border rounded">
                    <option>Dr. Smith</option>
                    <option>Dr. Johnson</option>
                    <option>Dr. Williams</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Type your message here..." />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Send className="mr-2 h-4 w-4" /> Send Message
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="bg-muted mt-8 py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 MediConnect. All rights reserved.</p>
          <p>For medical emergencies, please call 112.</p>
        </div>
      </footer>
    </div>
  )
}