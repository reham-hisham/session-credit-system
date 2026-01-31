const { DataSource } = require('typeorm');
require('ts-node/register');
const { CreditPackage } = require('../src/modules/credits/creditPackage/entity/credit-package.entity.ts');
const { seedCreditPackages } = require('./credit-package.seeder');
const { seedUsers } = require('./user.seeder');
const ormConfig = require('../ormconfig.js');
const { User } = require('../src/modules/users/entities/user.entity.ts');

async function main() {
  const dataSource = new DataSource({
    ...ormConfig,
    entities: [CreditPackage, User],
  });
  await dataSource.initialize();
  await seedCreditPackages(dataSource);
  await seedUsers(dataSource);
  await dataSource.destroy();
  console.log('Seeding complete');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
