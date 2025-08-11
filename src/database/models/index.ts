import OrderByUsers from './OrderByUsers';
import ProductByOrders from './ProductByOrders';
import Sync from './Sync';
import User from './User';

export const initializeModels = () => {
  new User()
  new Sync()
  new OrderByUsers()
  new ProductByOrders()
};