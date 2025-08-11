import { StatusEvent } from "@/lib/const"
import { EventType } from "@/types/EventType"

export const getEventId = async (events: EventType, status: StatusEvent) => {
    return events[status]
}