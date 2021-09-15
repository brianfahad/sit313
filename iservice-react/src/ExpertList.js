const faker = require('faker');

const experts = []

for (var i = 0; i < 8; i++) {
    experts.push({
        id: faker.datatype.uuid(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        image: faker.image.avatar(),
        description: faker.lorem.sentence(),
        stars: Math.floor(Math.random() * (5)) + 1,
    })
}

export default experts