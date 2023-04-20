const pageSize = 10; // Number of records to be displayed per page
// API endpoint to get paginated data
app.get('/employees/:page', (req, res) => {
  const page = parseInt(req.params.page); // Current page number
  // Calculate the start and end index of the records to be displayed
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  // Extract the records to be displayed from the data array
  const paginatedData = data.data.slice(start, end);
  // Send the paginated data as a response
  res.send(paginatedData);
});
// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});