import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDailyAvailability from './ListProviderDailyAvailabilityService';

let listProviderDayAvailability: ListProviderDailyAvailability;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderDailyAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDailyAvailability(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the daily availability from a provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'test-user-id',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'test-user-id',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime();
    });

    const availabilityInDay = await listProviderDayAvailability.execute({
      provider_id: 'test-user-id',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(availabilityInDay).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
        { hour: 17, available: true },
      ]),
    );
  });
});
