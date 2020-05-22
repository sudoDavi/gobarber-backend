import { getMongoRepository, MongoRepository } from 'typeorm';

import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

import Notification from '../schemas/Notification';

class NotificationsRepository implements INotificationsRepository {
  private odmRepository: MongoRepository<Notification>;

  constructor() {
    this.odmRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    content,
    user_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.odmRepository.create({
      content,
      user_id,
    });

    await this.odmRepository.save(notification);

    return notification;
  }
}

export default NotificationsRepository;
