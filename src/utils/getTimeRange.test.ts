import { GetTimeRange } from "./getTimeRange";
import { BookingDetails } from "@/app/_components/scheduling";

describe("GetTimeRange", () => {
  it("should return earlist start and latest end time", () => {
    const date = new Date("2025-01-01T00:00:00");
    const time = "08:00 - 09:00, 10:00 - 12:00";

    const details: BookingDetails = {
      date,
      name: "",
      time,
    };

    const result = GetTimeRange(details);

    expect(result.earliestStartTime?.getHours()).toBe(8);
    expect(result.latestEndTime?.getHours()).toBe(12);
  });
});
