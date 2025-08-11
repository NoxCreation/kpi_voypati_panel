import { queryDb2 } from "../queryDb2";
import { EventType } from "@/types/EventType";

export const getEvents = async (): Promise<EventType> => {
  // ordenes pagas y completadas
  const data = await queryDb2(
    `
      SELECT * FROM public.core_configuration
      ORDER BY id ASC 
    `
  );

  return data[0].events.orders as EventType
}