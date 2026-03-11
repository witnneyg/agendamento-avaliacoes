import { BookingDetails } from "@/app/_components/scheduling";
import { parse } from "date-fns";

export function GetTimeRange(details: BookingDetails) {
  const slots = details.time.split(",").map((slot) => slot.trim());

  let earliestStartTime: Date | null = null;
  let latestEndTime: Date | null = null;

  for (const slot of slots) {
    const [startStr, endStr] = slot.split(" - ");

    const startTime = parse(startStr, "HH:mm", new Date(details.date));
    const endTime = parse(endStr, "HH:mm", new Date(details.date));

    if (!earliestStartTime || startTime < earliestStartTime) {
      earliestStartTime = startTime;
    }

    if (!latestEndTime || endTime > latestEndTime) {
      latestEndTime = endTime;
    }
  }

  return { earliestStartTime, latestEndTime, slots };
}
