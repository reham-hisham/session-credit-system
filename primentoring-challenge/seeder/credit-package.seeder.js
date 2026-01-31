
const packages = require('./credit-packages.json');

async function seedCreditPackages(dataSource) {
  const repo = dataSource.getRepository('CreditPackage');
  for (const pkg of packages) {
    const exists = await repo.findOneBy({ name: pkg.name });
    if (!exists) {
      await repo.save(pkg);
    }
  }
}

module.exports = { seedCreditPackages };
