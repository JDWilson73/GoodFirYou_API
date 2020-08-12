/*
 * Run using the mongo shell. For remote databases, ensure that the
 * connection string is supplied in the command line. For example:
 * localhost:
 *  mongo issuetracker scripts/init.mongo.js
 * Atlas:
 *  mongo mongodb+srv://user:pwd@xxx.mongodb.net/issuetracker
 *  scripts/init.mongo.js
 * MLab:
 *  mongo mongodb://user:pwd@xxx.mlab.com:33533/issuetracker
 *  scripts/init.mongo.js
 */

/* global db print */
/* eslint no-restricted-globals: "off" */

db.branches.remove({});
db.users.remove({});
db.deleted_issues.remove({});

const testTree = {
  name: 'TreeTrunk',
  textProps: { transform: 'rotate(90)' },
  children: [{
    name: 'Something I want to be better at!',
    textProps: { transform: 'rotate(90)' },
    children: [{
      name: 'Fighting crime', // 'Fighting crime',
      textProps: { transform: 'rotate(90)' },
    }, {
      name: 'Not killing my cacti',
      textProps: { transform: 'rotate(90)' },
    }],
  }, {
    name: 'Hobbies!',
    textProps: { transform: 'rotate(90)' },
    children: [{
      name: 'Violin',
      textProps: { transform: 'rotate(90)' },
    }, {
      name: 'Competitive sheep shearing',
      textProps: { transform: 'rotate(90)' },
    }, {
      name: 'Killing a man before he can scream',
      textProps: { transform: 'rotate(90)' },
    }],
  }, {
    name: 'Taking better care of myself',
    textProps: { transform: 'rotate(90)' },
  }],
};

const toDBTest = JSON.stringify(testTree);

const branchesDB = [{
  id: 1,
  title: 'Health',
  owner: 'Steve',
  status: 'New',
  created: new Date(),
  details: 'TESTImprove physical & mental healthTEST',
  tree: toDBTest,
},
{
  id: 2,
  title: 'Education',
  owner: 'Charlie',
  status: 'InProgress',
  created: new Date(),
  details: 'Learn stuff',
  tree: `{
    exercise: {
      name: 'TreeTrunk',
      completed: true,
      expValue: 10,
      textProps: { transform: 'rotate(90)' },
      children: [{
        name: 'EXAMPLE 1',
        completed: false,
        expValue: 10,
        textProps: { transform: 'rotate(90)' },
      },
      {
        name: 'EXAMPLE 2',
        completed: true,
        expValue: 10,
        textProps: { transform: 'rotate(90)' },
      }],
    },
  }`,
},
{
  id: 3,
  title: 'World Domination',
  owner: 'Dayton',
  status: 'Complete',
  created: new Date(),
  details: 'Same thing we do every night, Pinky.'
    + '\nTry to take over the world!',
  tree: `{
    language: {
      name: 'SpoopTrunk',
      textProps: { transform: 'rotate(90)' },
      children: [{
        name: 'SPOOP 1',
        textProps: { transform: 'rotate(90)' },
      },
      {
        name: 'SPOOP 2',
        textProps: { transform: 'rotate(90)' },
      }],
    },
  }`,
},
];

const usersDB = [{
  name: 'Dayton',
  email: 'wilson.jos@northeastern.edu',
  role: 'Admin',
},
{
  name: 'Charlie',
  email: 'beiser.ch@northeastern.edu',
  role: 'Admin',
},
{
  name: 'Steve',
  email: 'swanton.s@northeastern.edu',
  role: 'Admin',
},
{
  name: 'Test User',
  email: 'thisisfake@email.com',
  role: 'User',
},
];

db.branches.insertMany(branchesDB);
const branchCount = db.branches.count();
print('Inserted', branchCount, 'branches');

db.users.insertMany(usersDB);
const userCount = db.users.count();
print('Inserted', userCount, 'users');

db.counters.remove({
  _id: 'branches',
});
db.counters.remove({
  _id: 'users',
});
db.counters.insert({
  _id: 'branches',
  current: branchCount,
});
db.counters.insert({
  _id: 'users',
  current: userCount,
});

db.branches.createIndex({
  id: 1,
}, {
  unique: true,
});
db.branches.createIndex({
  owner: 1,
});
db.branches.createIndex({
  parent: 1,
});
db.branches.createIndex({
  children: 1,
});


db.deleted_issues.createIndex({ id: 1 }, { unique: true });
