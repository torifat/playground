import { until, pstring, pchar } from '@playground/parser';
import { Comment } from './schema';

export const comment = pstring('//')
  .andThenRight(until('\n').many().andThenLeft(pchar('\n')))
  .setLabel('Comment')
  .map(chars => Comment.of(chars.join('')));
