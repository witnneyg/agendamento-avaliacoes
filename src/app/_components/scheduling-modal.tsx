// "use client";

// import { format } from "date-fns";
// import { X, Edit, Trash2, Clock, MapPin } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Appointment, useAppointments } from "../context/appointment";

// interface AppointmentModalProps {
//   appointment: Appointment | null;
//   isOpen: boolean;
//   onClose: () => void;
// }

// // Function to get color for each department (Google Calendar style)
// const getDepartmentColor = (departmentId: string) => {
//   const colors: Record<string, string> = {
//     cs: "#1a73e8", // Google Blue
//     medicine: "#137333", // Google Green
//     math: "#9334e6", // Purple
//     biology: "#f9ab00", // Google Yellow
//     psychology: "#d93025", // Google Red
//     geography: "#ff6d01", // Orange
//   };
//   return colors[departmentId] || "#5f6368";
// };

// export function AppointmentModal({
//   appointment,
//   isOpen,
//   onClose,
// }: AppointmentModalProps) {
//   const { removeAppointment } = useAppointments();

//   if (!appointment) return null;

//   const handleCancelAppointment = () => {
//     if (!appointment.id) return;

//     removeAppointment(appointment.id);
//     onClose();
//   };

//   //   const departmentColor = getDepartmentColor(appointment.course.id);

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-md p-0 gap-0">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b">
//           <div className="flex items-center gap-3">
//             <div
//               className="w-4 h-4 rounded-full flex-shrink-0"
//               style={{ backgroundColor: "red" }}
//             />
//             <h2 className="text-lg font-normal text-gray-900">
//               {appointment.disciplineName}
//             </h2>
//           </div>
//           <div className="flex items-center gap-1">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-8 w-8 text-gray-600 hover:bg-gray-100"
//             >
//               <Edit className="h-4 w-4" />
//             </Button>
//             <AlertDialog>
//               <AlertDialogTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-8 w-8 text-gray-600 hover:bg-gray-100"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </AlertDialogTrigger>
//               <AlertDialogContent>
//                 <AlertDialogHeader>
//                   <AlertDialogTitle>
//                     Delete "{appointment.disciplineName}"?
//                   </AlertDialogTitle>
//                   <AlertDialogDescription>
//                     This appointment will be permanently deleted.
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>
//                 <AlertDialogFooter>
//                   <AlertDialogCancel>Cancel</AlertDialogCancel>
//                   <AlertDialogAction
//                     className="bg-red-600 hover:bg-red-700 text-white"
//                     onClick={handleCancelAppointment}
//                   >
//                     Delete
//                   </AlertDialogAction>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={onClose}
//               className="h-8 w-8 text-gray-600 hover:bg-gray-100"
//             >
//               <X className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-4 space-y-4">
//           {/* Date and Time */}
//           <div className="flex items-start gap-3">
//             <Clock className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
//             <div className="text-sm">
//               <div className="text-gray-900">
//                 {format(appointment.date, "EEEE, MMMM d, yyyy")}
//               </div>
//               <div className="text-gray-600 mt-0.5">
//                 {String(appointment.startTime)} · 1 hour
//               </div>
//             </div>
//           </div>

//           {/* Location */}
//           <div className="flex items-start gap-3">
//             <MapPin className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
//             <div className="text-sm">
//               <div className="text-gray-900">Academic Advising Center</div>
//               <div className="text-gray-600 mt-0.5">
//                 {appointment.courseName} Department
//               </div>
//             </div>
//           </div>

//           {/* Description */}
//           <div className="text-sm text-gray-900">
//             <div className="font-medium mb-2">Appointment Details</div>
//             <div className="space-y-1 text-gray-700">
//               <div>
//                 <span className="font-medium">Student:</span>{" "}
//                 {appointment.details.name}
//               </div>
//               <div>
//                 <span className="font-medium">Email:</span>{" "}
//                 {appointment.details.email}
//               </div>
//               <div>
//                 <span className="font-medium">Phone:</span>{" "}
//                 {appointment.details.phone}
//               </div>
//               <div>
//                 <span className="font-medium">Semester:</span>{" "}
//                 {appointment.semesterName}
//               </div>
//             </div>

//             {appointment.details.notes && (
//               <div className="mt-3">
//                 <div className="font-medium mb-1">Notes</div>
//                 <div className="text-gray-700 bg-gray-50 p-3 rounded text-sm">
//                   {appointment.details.notes}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Calendar info */}
//           <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t">
//             <div
//               className="w-3 h-3 rounded-full"
//               style={{ backgroundColor: "red" }}
//             />
//             <span>{appointment.courseName}</span>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
