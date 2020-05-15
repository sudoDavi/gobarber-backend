import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: 'provider-test-id_123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider-test-id_123');
  });

  it('should not be able to create two appointments in the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const sameDate = new Date(2020, 4, 10, 11);

    const firstAppointment = await createAppointmentService.execute({
      date: sameDate,
      provider_id: 'provider-test-id_123',
    });

    expect(firstAppointment).toHaveProperty('id');
    expect(firstAppointment.provider_id).toBe('provider-test-id_123');
    await expect(
      createAppointmentService.execute({
        date: sameDate,
        provider_id: 'provider-test-id_321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
