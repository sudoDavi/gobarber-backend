// import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthlyAvailabilityService from './ListProviderMonthlyAvailabilityService';

let listProviderMonthlyAvailability: ListProviderMonthlyAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderMonthlyAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthlyAvailability = new ListProviderMonthlyAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the monthly availability from a provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'test-provider-id',
      date: new Date(2020, 4, 20, 8, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'test-provider-id',
      date: new Date(2020, 4, 20, 9, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'test-provider-id',
      date: new Date(2020, 4, 20, 10, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'test-provider-id',
      date: new Date(2020, 4, 20, 11, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'test-provider-id',
      date: new Date(2020, 4, 20, 12, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'test-provider-id',
      date: new Date(2020, 4, 20, 13, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'test-provider-id',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'test-provider-id',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'test-provider-id',
      date: new Date(2020, 4, 20, 16, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'test-provider-id',
      date: new Date(2020, 4, 20, 17, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'test-provider-id',
      date: new Date(2020, 4, 21, 8, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'test-provider-id',
      date: new Date(2020, 4, 19, 10, 0, 0),
    });

    const appointmentsAvailability = await listProviderMonthlyAvailability.execute(
      {
        provider_id: 'test-provider-id',
        month: 5,
        year: 2020,
      },
    );

    expect(appointmentsAvailability).toEqual(
      expect.arrayContaining([
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 19, available: true },
      ]),
    );
  });
});
