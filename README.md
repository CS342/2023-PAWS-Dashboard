# CS342 2023 PAWS Clinician Dashboard

This repository contains the clinician facing dashboard for the [CS342 2023 PAWS Team Application](https://github.com/CS342/2023-PAWS) which displays the ECG data derived from users of the iOS application.

This application is built using [React](https://react.dev/) and bootstrapped using [Create React App](https://create-react-app.dev/).

## System Requirements

- Node.js & npm
- Firebase account (or emulator)

## Run in Development Mode

1. Update the `.env.sample` file with the required API keys from your Firebase dashboard and rename it to `.env`.
2. Run `npm install` within the project directory.
3. Run `npm start` to start the application in development mode.
4. The application should launch in your browser. If not, browse to `http://localhost:3000` to view it.

## Continuous Delivery Workflows

The application includes continuous integration (CI) and continuous delivery (CD) setup.
- Automatically build and test the application on every pull request before deploying it.
- An automated setup to deploy the application to Firebase every time there is a new commit on the repository's main branch.
- Ensure a coherent code style by checking the conformance to the ESLint rules configured in `.eslint.rc.js` on every pull request and commit.


## Contributors & License

The CS342 2023 PAWS Clinician Dashboard Application is licensed under the MIT license.