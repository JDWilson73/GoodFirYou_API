const { UserInputError } = require('apollo-server-express');
const { getDb, getNextSequence } = require('./db.js');
const { mustBeSignedIn } = require('./auth.js');

async function get(_, { id }) {
  const db = getDb();
  const branch = await db.collection('branches').findOne({ id });
  return branch;
}

async function list(_, { owner }) {
  const db = getDb();
  const cursor = await db.collection('branches').find({ owner });
  return cursor.toArray();
}

function validate(branch) {
  const errors = [];
  if (branch.title.length < 3) {
    errors.push('Field "title" must be at least 3 characters long');
  }
  if (!branch.owner) {
    errors.push('Field "owner" is required');
  }
  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', {
      errors,
    });
  }
}

async function add(_, {
  branch,
}) {
  const db = getDb();
  validate(branch);
  const newBranch = Object.assign({}, branch);
  newBranch.created = new Date();
  newBranch.id = await getNextSequence('branches');
  const result = await db.collection('branches').insertOne(newBranch);
  const savedBranch = await db.collection('branches').findOne({
    _id: result.insertedId,
  });
  return savedBranch;
}

async function update(_, { id, changes }) {
  const db = getDb();
  if (changes.title || changes.status || changes.owner) {
    const branch = await db.collection('branches').findOne({ id });
    Object.assign(branch, changes);
    validate(branch);
  }
  await db.collection('branches').updateOne({ id }, { $set: changes });
  const savedbranch = await db.collection('branches').findOne({ id });
  return savedbranch;
}

async function remove(_, { id }) {
  const db = getDb();
  const branch = await db.collection('branches').findOne({ id });
  if (!branch) return false;
  branch.deleted = new Date();

  let result = await db.collection('deleted_branches').insertOne(branch);
  if (result.insertedId) {
    result = await db.collection('branches').removeOne({ id });
    return result.deletedCount === 1;
  }
  return false;
}

async function restore(_, { id }) {
  const db = getDb();
  const branch = await db.collection('deleted_branches').findOne({ id });
  if (!branch) return false;
  branch.deleted = new Date();

  let result = await db.collection('branches').insertOne(branch);
  if (result.insertedId) {
    result = await db.collection('deleted_branches').removeOne({ id });
    return result.deletedCount === 1;
  }
  return false;
}

async function counts(_, { status, effortMin, effortMax }) {
  const db = getDb();
  const filter = {};

  if (status) filter.status = status;

  if (effortMin !== undefined || effortMax !== undefined) {
    filter.effort = {};
    if (effortMin !== undefined) filter.effort.$gte = effortMin;
    if (effortMax !== undefined) filter.effort.$lte = effortMax;
  }

  const results = await db.collection('branches').aggregate([
    { $match: filter },
    {
      $group: {
        _id: { owner: '$owner', status: '$status' },
        count: { $sum: 1 },
      },
    },
  ]).toArray();

  const stats = {};
  results.forEach((result) => {
    // eslint-disable-next-line no-underscore-dangle
    const { owner, status: statusKey } = result._id;
    if (!stats[owner]) stats[owner] = { owner };
    stats[owner][statusKey] = result.count;
  });
  return Object.values(stats);
}

module.exports = {
  list,
  add: mustBeSignedIn(add),
  get,
  update: mustBeSignedIn(update),
  delete: mustBeSignedIn(remove),
  restore: mustBeSignedIn(restore),
  counts,
};
