# GroupProject_GoodFirYou_API

## Iteration 2

API largely untouched save for some attempts to resolve DB connection issues

---


## Iteration 1

### Steve Swanton Contribution

Reworked book project code to suit our needs for the project. Changes made include:

init.mongo.js:
  - reworked database initialization to suit our needs for more user granularity and replacing issues with our 'branches'

about.js:
  - Largely untouched other than changing the about message to our project name

api_handler.js:
  - Resolvers updated for new schema to allow retrieval of users and branches. Will need to be expanded as we narrow down what the UI will need to retrieve/update etc.

branch.js:
  - reworked issue.js. Focus was primarily on get and list to make sure I properly understood graphQL queries and syntax in the project. Tested with lots of graphQL playground usage and successfully can access user and branch data from the database. Other functionality will need to be tested and modified in future iterations.

db.js:
  - only change is the default localhost location of our database rather than the issuetracker

schema.graphql:
  - Updated book project schema to relevant enums, types, queries, mutations etc. Spent a lot of time trying to get this arranged correctly. Ended up simplifying scalar types to avoid overcomplicating the database calls. Should be smoother sailing for future iterations after all the trial and error.
