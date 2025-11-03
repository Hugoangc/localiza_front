import { Car } from './car';

describe('Car', () => {
  it('should create an instance', () => {
    expect(new Car(1, 'Model S', 'Tesla')).toBeTruthy();
  });
});
