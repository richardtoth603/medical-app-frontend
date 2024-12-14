import { Card, CardContent, CardFooter } from "@/components/ui/card"

type QuoteCardProps = {
  text: string
  author: string
}

export function QuoteCard({ text, author }: QuoteCardProps) {
  return (
    <Card className="w-[300px] h-[200px] flex flex-col justify-between">
      <CardContent className="pt-6">
        <p className="text-lg font-medium text-center">{text}</p>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground text-center">
        - {author}
      </CardFooter>
    </Card>
  )
}

