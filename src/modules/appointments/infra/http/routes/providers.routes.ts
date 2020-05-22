import { Router } from 'express';

import ensureAuthenticaded from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProviderMonthlyAvailabilityController from '../controllers/ProviderMonthlyAvailabilityController';
import ProviderDailyAvailabilityController from '../controllers/ProviderDailyAvailabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerDayAvailabilityController = new ProviderDailyAvailabilityController();
const providerMonthAvailabilityController = new ProviderMonthlyAvailabilityController();

providersRouter.use(ensureAuthenticaded);

providersRouter.get('/', providersController.index);

providersRouter.get(
  '/:provider_id/month-availability',
  providerMonthAvailabilityController.index,
);

providersRouter.get(
  '/:provider_id/day-availability',
  providerDayAvailabilityController.index,
);

export default providersRouter;
