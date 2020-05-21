import { startOfHour, isBefore, getHours } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  recipient_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  private appointmentsRepository: IAppointmentsRepository;

  constructor(
    @inject('AppointmentsRepository')
    appointmentsRepository: IAppointmentsRepository,
  ) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public async execute({
    date,
    provider_id,
    recipient_id,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'You can not make an appointment before 8AM or after 5PM',
      );
    }

    const currentDate = new Date(Date.now());

    const isAppointmentInThePast = isBefore(date, currentDate);

    if (isAppointmentInThePast) {
      throw new AppError('You can not create an appointment in the past');
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    if (provider_id === recipient_id) {
      throw new AppError('You can not create an appointment with yourself');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      recipient_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
