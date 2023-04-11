# ServerSideFinalProject (Eric, please read)

Welcome to the repository for my Server Side Programming final project. This repo contains a trivia react app call TriviaTime.

## How the app works
This app is constructed with the MERN stack. When a player browses to the app, they are presented with the option to start a game or view their all-time stats.
If they start a game, they are presented with 5 questions pulled from a mongo database. At the end of answering the questions they are presented with their score
and can then view their all-time stats again. If they return to the home screen they are presented with a message that says to return tomorrow to play again.

## Administration
There is an administration route located at /admin. This is a protected route and you must login first at /login. I did not feel it was necessary to link to these routes from within the app so you will have to navigate to them manually. Eric, your credentials will be in the dropbox
along with some sample JSON files for use in the administration route.

### Overwriting the database
One of the options in the admin route will be to overwrite the database with new questions. I have provided a file to demonstrate that this route works.
The file is called overwrite_or_append.json and is included in the dropbox. It simply contains some dummy questions to demonstrate the functioning route.

### Appending to the database
This operation is similar except it simply appends questions rather than overwriting the existing database.

# IMPORTANT 

## When you are done testing the routes, please run the overwrite route with the questions.json file to reset the actual questions. If you complete a game but want to test that the routes worked, set "lastGameDate" in LOCAL STORAGE to be any date but today and set "canPlay" in LOCAL STORAGE to "true" and reload the app.

# If you have any issues with the testing, please get in touch.
