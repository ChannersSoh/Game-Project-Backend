Front-end repo: https://github.com/melissa-linsc/SocialGamerApp?tab=readme-ov-file

Recommendations repo: https://github.com/melissa-linsc/FlaskApp

Hosted api: https://us-central1-debugd1vas.cloudfunctions.net/app/api

Welcome to the back-end code for our social app for gamers, Gamerly!
Gamerly is a mobile app for android and ios, that gives personalised recommendations based on game titles picked after log in.

This repository contains the code for the api which Gamerly fetches it's informations from. This api gets the initial data from a different api called RAWG. The data from RAWG is stored using a firestore dataabse and is then used by our api to create custom endpoints. These include the methods GET, PATCH, POST and DELETE.

If you want to run the repository locally follow these steps..

Clone the repository

    git clone https://github.com/ChannersSoh/game-project-be

Install dependencies

    npm install

To be able to create the api, a firestore key is required. This is acquired by creating a firebase project, going into firestore, opening options then creating a service key. Then, transfer the key into the firestore-key folder and change the file path in the export and admin files. Run the file exportDataToFirebase to populate database. Using the command npm test app.test.js will run all the tests related to the api.

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by Northcoders

This project was completed by Charnjeet Sohal, Jack Cowling, Melissa Lin and Mikael Vadi 
