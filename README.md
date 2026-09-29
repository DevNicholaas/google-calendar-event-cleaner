# Google Calendar Event Cleaner

A Google Apps Script tool that deletes Google Calendar events matching a keyword (whole word) in their title or description. Includes a web UI served directly from Apps Script.

## Features

- **Whole-word matching** — won't delete events where the keyword appears as part of another word
- **Case-insensitive** search
- **Configurable date range** — defaults to ±1 year from today, adjustable via parameters
- **Descriptive error reporting** — returns clear messages if the calendar isn't found or no events match
- **Input validation** on both the backend and form handler
- **Web UI** for non-technical users via Apps Script HTML Service

## Setup

1. Go to [script.google.com](https://script.google.com) and create a new project
2. Paste the contents of `Code.gs` into the editor
3. Create a new file called `Index.html` and add your front-end form there
4. Click **Deploy** → **New deployment** → **Web app**
5. Set access to **"Only myself"** (or your org)
6. Click **Deploy** and authorize the permissions
7. Open the web app URL to access the UI

## Usage

Call `deleteEventsByKeyword` directly or through the web form:

```javascript
// Delete events matching "standup" within the default ±1 year window
deleteEventsByKeyword('your-calendar-id@group.calendar.google.com', 'standup');

// Custom date range — 30 days back, 60 days forward
deleteEventsByKeyword('your-calendar-id@group.calendar.google.com', 'standup', 30, 60);
```

### Return value

```javascript
{ success: true, deletedCount: 4 }
// or
{ success: false, deletedCount: 0, error: 'Calendar not found: ...' }
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `calendarId` | string | required | The Google Calendar ID |
| `keyword` | string | required | Word to match in event title or description |
| `daysBefore` | number | 365 | How many days back to search |
| `daysAfter` | number | 365 | How many days forward to search |

## Tech

Google Apps Script · Google Calendar API · HTML Service
