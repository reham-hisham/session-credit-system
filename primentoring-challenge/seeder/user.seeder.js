const bcrypt = require('bcryptjs');
const users = require('./users.json');
const { User } = require('../src/modules/users/entities/user.entity.ts');

async function seedUsers(dataSource) {
  const repo = dataSource.getRepository('User');

  for (const u of users) {
    const exists = await repo.findOneBy({ email: u.email });
    if (!exists) {
      const toSave = { ...u };
      // Hash plaintext password before saving
      if (toSave.password) {
        toSave.password = bcrypt.hashSync(toSave.password, 10);
      }
      await repo.save(toSave);
      console.log('Seeded user:', toSave.email, 'id:', toSave.id);
    } else {
      console.log('User already exists, skipping:', u.email);
    }
  }
}

module.exports = { seedUsers };
