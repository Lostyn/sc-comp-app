import { IService } from '../../interfaces/services/services';
import { createDecorator } from '../../../commun/decorators';

export interface ITitleService extends IService {
}

export const ITitleService = createDecorator<ITitleService>('titleService');