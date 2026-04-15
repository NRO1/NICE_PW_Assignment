import { faker } from '@faker-js/faker';

// Defining a new type for the random user creation
export interface RandomUser {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  ss: string;
  userName: string;
  password: string;
};

export const generateRandomUser = ():RandomUser => {
  return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      phone: faker.phone.number(),
      ss: faker.helpers.replaceSymbols('###-##-####'),
      userName: faker.internet.username(),
      password: faker.internet.password({ length: 12 }),
    };
};
