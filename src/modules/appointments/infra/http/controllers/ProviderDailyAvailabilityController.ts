import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDailyAvailabilityService from '@modules/appointments/services/ListProviderDailyAvailabilityService';

export default class ProviderMonthlyAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { month, year, day } = request.body;
    const { provider_id } = request.params;

    const listProviderMonthAvailability = container.resolve(
      ListProviderDailyAvailabilityService,
    );

    const providerAvailability = await listProviderMonthAvailability.execute({
      provider_id,
      month,
      year,
      day,
    });

    return response.json(providerAvailability);
  }
}
