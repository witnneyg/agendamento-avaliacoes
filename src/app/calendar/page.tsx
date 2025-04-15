"use client";

import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { NavBar } from "../_components/navbar";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="container mx-auto py-10 flex-1">
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">My Appointments</h1>
          <p className="text-muted-foreground text-center max-w-2xl">
            View and manage your scheduled academic advising appointments.
          </p>

          <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>
                  Select a date to view appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  // modifiers={{
                  //   appointment: (date) => isDayWithAppointment(date),
                  // }}
                  modifiersClassNames={{
                    appointment: "bg-primary/20 font-bold",
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate
                    ? format(selectedDate, "MMMM d, yyyy")
                    : "No date selected"}
                </CardTitle>
                <CardDescription>
                  No appointments scheduled for this date"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">test</h3>
                        <p className="text-sm text-muted-foreground">
                          title time
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Cancel Appointment
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel this appointment?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              Keep Appointment
                            </AlertDialogCancel>
                            <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                              Cancel Appointment
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    <div className="mt-2 pt-2 border-t text-sm">
                      <p>
                        <span className="font-medium">Department:</span> test
                      </p>
                      <p>
                        <span className="font-medium">Semester:</span> test
                      </p>
                      <p>
                        <span className="font-medium">Discipline:</span> test
                      </p>
                      <p>
                        <span className="font-medium">Name:</span> test
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> test
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span> test
                      </p>
                      <p className="mt-1">
                        <span className="font-medium">Notes:</span>{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
