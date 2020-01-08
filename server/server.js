require('newrelic');
/* eslint-disable no-console */
const controller = require('./pg-controller.js');
// const controller = require('./mysql-controller.js');
const app = require('./app');

(async () => {
  // if (process.env.NODE_ENV === 'prod') {
  //   try {
  //     await controller.updateClientBundle();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const port = 80;
  app.listen(port, () => console.log(`server listening on port ${port}`));
})();
