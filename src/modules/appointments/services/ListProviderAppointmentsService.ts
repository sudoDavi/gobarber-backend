import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | number;
  year: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
    day,
  }: IRequest): Promise<Appointment[]> {
    const cacheKey = `provider-appointments-list:${provider_id}:${year}-${month}-${day}`;

    let appointments = await this.cacheProvider.read<Appointment[]>(cacheKey);

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAppointmentsInDay({
        provider_id,
        year,
        month,
        day,
      });

      await this.cacheProvider.save(cacheKey, classToClass(appointments));
    }

    return appointments;
  }
}

export default ListProviderAppointmentsService;
