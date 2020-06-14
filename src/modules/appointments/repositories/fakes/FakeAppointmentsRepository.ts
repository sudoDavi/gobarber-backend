import { uuid } from 'uuidv4';
import { isEqual, getYear, getMonth, getDate } from 'date-fns';

import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IFindAppointmentsInMonthDTO from '@modules/appointments/dtos/IFindAppointmentsInMonthDTO';
import IFindAppointmentsInDayDTO from '@modules/appointments/dtos/IFindAppointmentsInDayDTO';

class AppointmentsRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  public async findAppointmentsInMonth({
    provider_id,
    month,
    year,
  }: IFindAppointmentsInMonthDTO): Promise<Appointment[]> {
    const appointmentsInMonth = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointmentsInMonth;
  }

  public async findAppointmentsInDay({
    provider_id,
    month,
    year,
    day,
  }: IFindAppointmentsInDayDTO): Promise<Appointment[]> {
    const appointmentsInDay = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointmentsInDay;
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      appointment =>
        isEqual(appointment.date, date) &&
        appointment.provider_id === provider_id,
    );

    return findAppointment;
  }

  public async create({
    date,
    provider_id,
    recipient_id,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    appointment.date = date;
    appointment.provider_id = provider_id;
    appointment.recipient_id = recipient_id;
    appointment.id = uuid();

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
