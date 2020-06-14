import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthlyAvailabilityService from '@modules/appointments/services/ListProviderMonthlyAvailabilityService';

export default class ProviderMonthlyAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { month, year } = request.query;
    const { provider_id } = request.params;

    const listProviderMonthAvailability = container.resolve(
      ListProviderMonthlyAvailabilityService,
    );

    const providerAvailability = await listProviderMonthAvailability.execute({
      provider_id,
      month: Number(month),
      year: Number(year),
    });

    return response.json(providerAvailability);
  }
}
