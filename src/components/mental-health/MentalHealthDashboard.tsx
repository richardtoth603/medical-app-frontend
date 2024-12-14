import { useQuotes } from "./UseQuotes"
import { QuoteCard } from "./QuoteCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function MentalHealthDashboard() {
  const quotes = useQuotes()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Mental Health Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Affirmations</CardTitle>
          </CardHeader>
          <CardContent>
            <Carousel className="w-full max-w-xs mx-auto">
              <CarouselContent>
                {quotes.map((quote: { id: number; text: string; author: string }) => (
                  <CarouselItem key={quote.id}>
                    <QuoteCard text={quote.text} author={quote.author} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mindfulness Reminder</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">Take a moment to breathe deeply and center yourself. Remember, you are doing your best, and that is enough.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

