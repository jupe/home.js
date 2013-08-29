hoard = require('hoard');

/*
// Create a Hoard file for storing time series data.
// Inside of it there will be two archives with retention periods:
// 1) 1 second per point for a total of 60 points (60 seconds of data)
// 2) 10 second per point for a total of 600 points (100 minutes of data)
hoard.create('./users.hoard', [[1, 60], [10, 600]], 0.5, function(err) {
    if (err) throw err;
    console.log('Hoard file created!');
});*/

/*
// Update an existing Hoard file with value 1337 for timestamp 1311169605
// When doing multiple updates in batch, use updateMany() instead as it's faster
hoard.update('./users.hoard', 1337, parseInt(new Date().getTime() / 1000), function(err) {
    if (err) throw err;
    console.log('Hoard file updated!');
});
// Update multiple values at once in an existing Hoard file.
// This function is much faster when dealing with multiple values
// that need to be written at once.
hoard.updateMany('users.hoard', [[parseInt(new Date().getTime() / 1000), 4976], [parseInt(new Date().getTime() / 1000), 3742]], function(err) {
    if (err) throw err;
    console.log('Hoard file updated!');
});*/
// Retrieve data from a Hoard file between timestamps 1311161605 and 1311179605
hoard.fetch('users.hoard', 1311161605, parseInt(new Date().getTime() / 1000), function(err, timeInfo, values) {
    if (err) throw err;
    console.log('Values', values); // Displays an array of values
});