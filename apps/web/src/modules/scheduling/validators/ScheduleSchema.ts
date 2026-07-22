import { z } from 'zod';

export const ScheduleEntryCreateSchema = z.object({
  scheduleId: z.string().min(1),
  matchId: z.string().min(1),
  venueId: z.string().min(1),
  playingAreaId: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  participantIds: z.array(z.string())
}).refine(data => new Date(data.startTime) < new Date(data.endTime), {
  message: "End time must be after start time",
  path: ["endTime"]
});
