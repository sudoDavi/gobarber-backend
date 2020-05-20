import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAppointmentsInMonthDTO from '@modules/appointments/dtos/IFindAppointmentsInMonthDTO';

import IFindAppointmentsInDayDTO from '@modules/appointments/dtos/IFindAppointmentsInDayDTO';
import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findAppointmentsInMonth({
    provider_id,
    month,
    year,
  }: IFindAppointmentsInMonthDTO): Promise<Appointment[]> {
    const appointmentsInMonth = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'FMMM-YYYY') = '${month}-${year}'`,
        ),
      },
    });

    return appointmentsInMonth;
  }

  public async findAppointmentsInDay({
    provider_id,
    month,
    year,
    day,
  }: IFindAppointmentsInDayDTO): Promise<Appointment[]> {
    const appointmentsInDay = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'FMDD-FMMM-YYYY') = '${day}-${month}-${year}'`,
        ),
      },
    });

    return appointmentsInDay;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date },
    });

    return findAppointment;
  }

  public async create({
    date,
    provider_id,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ provider_id, date });

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
