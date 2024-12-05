import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Button } from "@/components/ui/button";
import { PeriodData } from "@/domain/models/PeriodData";

const mockPeriods: PeriodData[] = [
  {
    startDate: new Date(2024, 11, 1),
    endDate: new Date(2024, 11, 5), 
    patientId: "p1",
  },
  {
    startDate: new Date(2025, 0, 2),
    endDate: new Date(2025, 0, 5),
    patientId: "p1",
  },
]; // Mock period data for frontend testing


const PeriodTrackingCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [periodDates, setPeriodDates] = useState<PeriodData[]>(mockPeriods);
  const [dateRange, setDateRange] = useState<Date[]>([]); 
  const [isSelectingPeriod, setIsSelectingPeriod] = useState<boolean>(false); 
  const patientId = "p1"; // Mock patient ID for frontend testing needs to be replaced with actual data from the backend

  useEffect(() => {
    setPeriodDates(mockPeriods);
    //needs to be replaced with actual data from the backend
  }, []);

  const handleDateClick = (date: Date) => {
    if (isSelectingPeriod) {
      if (dateRange.length === 0) {
        setDateRange([date]);
      } else if (dateRange.length === 1) {
        setDateRange([dateRange[0], date]);

      }
    } else {
      setSelectedDate(date);
    }
  };

  const isPeriodDay = (date: Date) => {
    return periodDates.some(
      (period) => date >= period.startDate && date <= period.endDate
    );
  };

  const isOvulationDay = (date: Date) => {
    return periodDates.some((period) => {
      const ovulationDay = new Date(period.startDate);
      ovulationDay.setDate(ovulationDay.getDate() + 14); 
      return ovulationDay.toDateString() === date.toDateString();
    });
  };

  const getPregnancyChances = (date: Date) => {
    let nextPeriodStart = new Date();
    for (const period of periodDates.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())) {
      if (date >= period.endDate) {
        nextPeriodStart = new Date(period.startDate);
      }
    }
  
    const ovulationDay = new Date(nextPeriodStart);
    ovulationDay.setDate(ovulationDay.getDate() + 14);
  
    const fertileWindowStart = new Date(ovulationDay);
    fertileWindowStart.setDate(fertileWindowStart.getDate() - 5);
  
    const fertileWindowEnd = new Date(ovulationDay);
    fertileWindowEnd.setDate(fertileWindowEnd.getDate() + 2);
  
    if (date >= fertileWindowStart && date <= fertileWindowEnd) {
      if (date.toDateString() === ovulationDay.toDateString()) {
        return "High chance of pregnancy (Ovulation day)";
      }
      return "Medium chance of pregnancy (Fertile window)";
    }
  
    return "Low chance of pregnancy";
  };
  

  const calculateCycleDay = (date: Date) => {
    for (const period of periodDates) {
      if (date >= period.startDate && date <= period.endDate) {
        const cycleStart = new Date(period.startDate);
        const diffTime = date.getTime() - cycleStart.getTime();
        return Math.floor(diffTime / (1000 * 3600 * 24)) + 1; 
      }
    }
    return null;
  };

  const handleAddNewPeriod = () => {
    if (dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
  
      if (startDate > endDate) {
        alert("The start date cannot be after the end date.");
        setDateRange([]);
        setSelectedDate(null);
        setIsSelectingPeriod(false);
        return;
      }
  
      const newPeriod: PeriodData = { startDate, endDate, patientId };

      setPeriodDates([...periodDates, newPeriod]);
      setDateRange([]);
      setSelectedDate(null);
      setIsSelectingPeriod(false);
      
    }
  };
  

  const getNextPeriodStart = () => {
    if (periodDates.length === 0) {
      return "No data available for predicting the next period.";
    }
    const latestPeriod = periodDates.sort((a, b) => b.startDate.getTime() - a.startDate.getTime())[0];
    const nextPeriodStart = new Date(latestPeriod.endDate);
    nextPeriodStart.setDate(nextPeriodStart.getDate() + 28); 
    return nextPeriodStart;
  };
  

  const tileClassName = ({ date }: { date: Date }) => {
      if (date.toDateString() === selectedDate?.toDateString()) {
        return "selected-day"; 
      }  

    if (isPeriodDay(date)) {
      return "period-day";
    }
    if (isOvulationDay(date)) {
      return "ovulation-day";
    }
    const nextPeriodStart = getNextPeriodStart();
    if (nextPeriodStart instanceof Date && date.toDateString() === nextPeriodStart.toDateString()) {
      return "next-period-start";
    }
    
    if (dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      if (date >= startDate && date <= endDate) {
        return "selected-range";
      }
    }

    return "";
  };

  const handleStartNewPeriodSelection = () => {
    setIsSelectingPeriod(true);
    setSelectedDate(null);
    setDateRange([]);
  };
  
  const handleModifyPeriod = (date: Date) => {
    const updatedPeriods = periodDates
      .flatMap((period) => {
        if (date >= period.startDate && date <= period.endDate) {
          if (period.startDate.toDateString() === period.endDate.toDateString()) {
            return null;
          }
          if (date.toDateString() === period.startDate.toDateString()) {
            return {
              startDate: new Date(period.startDate.getTime() + 24 * 60 * 60 * 1000), 
              endDate: period.endDate,
            };
          }
          if (date.toDateString() === period.endDate.toDateString()) {
            return {
              startDate: period.startDate,
              endDate: new Date(period.endDate.getTime() - 24 * 60 * 60 * 1000),
            };
          }
          return [
            {
              startDate: period.startDate,
              endDate: new Date(date.getTime() - 24 * 60 * 60 * 1000), 
            },
            {
              startDate: new Date(date.getTime() + 24 * 60 * 60 * 1000), 
              endDate: period.endDate,
            },
          ];
        }
        return period; 
      })
      .filter(Boolean) as PeriodData[];
  
    setPeriodDates(updatedPeriods);
  };
  const handleCancelPeriodSelection = () => {
    setIsSelectingPeriod(false); 
    setDateRange([]);
  }

  return (
    <div style={{ padding: "1rem", textAlign: "center", fontFamily: "'Poppins', sans-serif", color: "#6C757D", marginBottom: "2rem" }}>
      <h1 style={{ color: "#FF6F91", fontWeight: 700 }}>Period Tracking Calendar 🌸</h1>
      <p>
        Log and track your periods, ovulation days, and fertility windows.
      </p>

      <div
        style={{
          display: "inline-block",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          padding: "20px",
        }}
      >

      <Calendar
        onClickDay={handleDateClick}
        tileClassName={tileClassName}
        value={selectedDate}
      />
      </div>

      <div style={{ marginTop: "1rem" }}>
        {selectedDate && (
          <>
            <h3>Details for {selectedDate.toDateString()}</h3>
            {isPeriodDay(selectedDate) ? (
              <div>
                <p>It is day {calculateCycleDay(selectedDate)} of your cycle.</p>
                <p>{getPregnancyChances(selectedDate)}</p>
                <Button variant="pink" onClick={() => handleModifyPeriod(selectedDate)}>
                  Remove from Period
                </Button>
              </div>
            ) : (
              <div>
                <p>{getPregnancyChances(selectedDate)}</p>
              </div>
            )
            }
          </>
        )}

        <Button
          variant="pink"
          onClick={handleStartNewPeriodSelection}
          style={{
            marginTop: "1rem",
            background: "linear-gradient(135deg, #FF6F91, #FFA6C1)",
            color: "white",
            border: "none",
            borderRadius: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
          disabled={isSelectingPeriod}
        >
          Start Selecting New Period Days
        </Button>


        {dateRange.length === 2 && (
          <div>
            <p>Selected Period: {dateRange[0].toDateString()} - {dateRange[1].toDateString()}</p>
            <Button variant="pink" onClick={handleAddNewPeriod}>Add Period</Button>
            <Button variant="pink" onClick={handleCancelPeriodSelection }>Cancel</Button>
          </div>
        )}
      </div>

 
      <style>
        {`
        .react-calendar {
          border: none;
        }

        .react-calendar__tile {
          background-color: #f8f9fa;
          color: #333;
          border-radius: 50%;
          padding: 10px;
          margin: 2px;
        }

        .react-calendar__tile--active {
          background: linear-gradient(135deg, #FFA6C1, #FF6F91);
          color: white;
          font-weight: bold;
          border-radius: 50%;
        }

        .react-calendar__tile:hover {
          background-color: #FFD1DC;
          color: #333;
          cursor: pointer;
        }

        .period-day {
          background-color: #FF6F91 !important;
          border-radius: 50%;
          color: white;
          font-weight: bold;
        }

        .ovulation-day {
          background-color: #FFCCF5 !important;
          border-radius: 50%;
          color: white;
        }

        .selected-day {
          background-color: #f68fc2 !important; /* Choose your color */
          color: white !important; /* Text color */
          font-weight: bold;
          border-radius: 50%;
        }


        .next-period-start {
          background-color: #ea1d5e !important;
          border-radius: 50%;
          font-weight: bold;
        }

        .selected-range {
          background-color: #dd9aec !important;
          border-radius: 50%;
          color: white;
        }

        h1, h3 {
          font-family: "Poppins", sans-serif;
        }
        `}
      </style>
    </div>
  );
};

export default PeriodTrackingCalendar;