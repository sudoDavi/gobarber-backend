import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();

    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
    );
  });
  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 1, 11).getTime();
    });

    const appointment = await createAppointmentService.execute({
      date: new Date(2020, 4, 1, 15),
      recipient_id: 'test-id',
      provider_id: 'provider-test-id_123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider-test-id_123');
  });

  it('should not be able to create two appointments in the same time', async () => {
    const sameDate = new Date(2020, 4, 10, 11);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 1, 11).getTime();
    });

    const firstAppointment = await createAppointmentService.execute({
      date: sameDate,
      recipient_id: 'test-id',
      provider_id: 'provider-test-id_123',
    });

    expect(firstAppointment).toHaveProperty('id');
    expect(firstAppointment.provider_id).toBe('provider-test-id_123');
    await expect(
      createAppointmentService.execute({
        date: sameDate,
        recipient_id: 'test-id',
        provider_id: 'provider-test-id_321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment in the past', async () => {
    const pastDate = new Date(2020, 4, 20, 10);
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: pastDate,
        provider_id: 'test-provider-id',
        recipient_id: 'test-recipient-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with himself', async () => {
    const validDate = new Date(2020, 4, 20, 10);
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 11).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: validDate,
        provider_id: 'test-provider-id',
        recipient_id: 'test-provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create before 8AM and past 5PM', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 10, 11).getTime();
    });
    const before8AM = new Date(2020, 4, 20, 7);
    const after5PM = new Date(2020, 4, 20, 18);

    await expect(
      createAppointmentService.execute({
        date: before8AM,
        provider_id: 'test-provider-id',
        recipient_id: 'test-recipient-id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        date: after5PM,
        provider_id: 'test-provider-id',
        recipient_id: 'test-recipient-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
