export default interface IFindAppointmentsInDayDTO {
  day: number;
  month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | number;
  year: number;
  provider_id: string;
}
