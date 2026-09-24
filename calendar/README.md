# Editing the event calendar

Edit **events.js** to update the schedule on both the homepage and `/calendar/`.
You do not need to edit either HTML page.

- `title`: event or session name.
- `week`: label such as `Week 01`.
- `type`: `Session`, `Event`, or `Competition`.
- `date`: `YYYY-MM-DD`, such as `2026-10-03`.
- `time`: 24-hour IST, such as `17:30` (shown as 5:30 PM IST).
- `venue`: room, location, or meeting information.
- `description`: details shown when the session is expanded.
- `icon`: Font Awesome icon class.

Leave date, time, or venue as `""` until confirmed. Dates add markers to the
month grid automatically. Entries display in file order; remove past events
and update week labels when maintaining the next three weeks' schedule.

Copy an existing object to add an entry, keeping commas between objects.
Refresh the page after saving. No build is needed.

`calendar.js` contains the shared layout and behavior. `calendar.css` contains
calendar-specific styling. `index.html` is the standalone page, like Spark
and Phoenix. The homepage still displays the calendar below Alumni.
