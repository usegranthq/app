import * as subscription from './subscription';
import * as getInstance from './get-instance';

export const paddle = {
  ...subscription,
  ...getInstance,
};

export default paddle;
