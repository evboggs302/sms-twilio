# Scavenger Hunt

- This repo will eventually hold a scavenger hunt app that will utilize the Twilio texting service.

### _Available Scripts_

- `npm start` Runs the app in the development mode.<br />
  _Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
  The page will reload with edits. You will also see any lint errors in the console._

- `npm run serve` // `nodemon` Launches the server file.
- `npm test` starts the test suit; runs all test in the `__tests__` directory
- `firebase deploy` will run `npm run build` and then deploy the app for twilio to work.

### .ENV example content

```txt
ACCT_SID=< provided by Twilio >
AUTH_TOKEN=< provided by Twilio >
TWILIO_NUMBER=< provided by Twilio >
MONGO_CONNECTION=< provided by MongoDB >
SERVER_PORT=< pick a number >
```
