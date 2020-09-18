let connection = null;

module.exports = {
  connectDB: function (environment) {
    if(!connection){
      const mongoose = require('mongoose');
      const database = {
        production: 'Production',
        test: 'IntegrationTests'
      };
      const databaseName = environment === 'test'? database.test: database.production;
      connection = mongoose.connect(`mongodb+srv://Pavlo:654321bonic@clustercapadastr.wlma4.mongodb.net/${databaseName}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      });
    }
    return connection;
  }
};
