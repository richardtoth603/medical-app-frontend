import { useState } from 'react'

type Quote = {
  id: number
  text: string
  author: string
}

const initialQuotes: Quote[] = [
  { id: 1, text: "You are stronger than you think.", author: "Unknown" },
  { id: 2, text: "Every day is a fresh start.", author: "Unknown" },
  { id: 3, text: "Breathe deeply and find peace in this moment.", author: "Unknown" },
  { id: 4, text: "You are worthy of love and respect.", author: "Unknown" },
  { id: 5, text: "Your mental health matters. Take care of yourself.", author: "Unknown" },
]

export const useQuotes = () => {
  const [quotes] = useState<Quote[]>(initialQuotes)
  return quotes
}

