Provo music scene chart
=======================

```bash
npm install
npm start
npm run-script deploy
```

Suggested connections can be sent here: https://docs.google.com/forms/d/1JMhILbfUKz1V63tRwhyRYKvYo_N8_-JJaoigd1c26Ow/viewform

You can see the data source here: https://docs.google.com/spreadsheet/pub?key=0Ai29bxvOdvgjdDZuOEk0eWRGRUQ4ZmEwNnFEb3owVEE&output=html

To-Do
=====
Since disk read time is consistently < 500ms and a HEAD request to determine the last-modification is >1s serve existing cache immediately and render d3. Once requests complete, update graph if changes are found.