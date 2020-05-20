import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAppointmentsInMonthDTO from '../dtos/IFindAppointmentsInMonthDTO';
import IFindAppointmentsInDayDTO from '../dtos/IFindAppointmentsInDayDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findAppointmentsInMonth(
    data: IFindAppointmentsInMonthDTO,
  ): Promise<Appointment[]>;
  findAppointmentsInDay(
    data: IFindAppointmentsInDayDTO,
  ): Promise<Appointment[]>;
}
