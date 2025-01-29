const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const csv = require('csv-parser');

// Connect to the SQLite database
const db = new sqlite3.Database('./db/customers.db', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Read and parse the CSV file
fs.createReadStream('./data/customers.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Insert each row into the database
    const query = `
            INSERT INTO customers (full_name, dob, contact_info, email_address, postal_address)
            VALUES (?, ?, ?, ?, ?)
        `;
    const params = [
      row.full_name,
      row.dob,
      row.contact_info,
      row.email_address,
      row.postal_address,
    ];

    db.run(query, params, (err) => {
      if (err) {
        console.error('Error inserting row:', err.message);
      } else {
        console.log(`Inserted row: ${row.full_name}`);
      }
    });
  })
  .on('end', () => {
    console.log('CSV file successfully processed.');
    db.close((err) => {
      if (err) {
        console.error('Error closing the database:', err.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  });
