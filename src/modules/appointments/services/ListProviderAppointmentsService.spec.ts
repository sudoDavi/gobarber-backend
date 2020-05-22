import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let listProviderAppointments: ListProviderAppointmentsService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
    );
  });

  it('it should be able to list the appointments a provider has in a given day', async () => {
    const testProvider = await fakeUsersRepository.create({
      email: 'test@email.com',
      name: 'Test Provider',
      password: '123456',
    });
    const appointment1 = await fakeAppointmentsRepository.create({
      recipient_id: 'test-id',
      provider_id: testProvider.id,
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      recipient_id: 'test-id',
      provider_id: testProvider.id,
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime();
    });

    const availabilityInDay = await listProviderAppointments.execute({
      provider_id: testProvider.id,
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(availabilityInDay).toEqual(
      expect.arrayContaining([appointment1, appointment2]),
    );
  });
});
