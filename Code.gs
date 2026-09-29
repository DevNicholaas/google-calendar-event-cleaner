/**
 * Deletes Google Calendar events that match a keyword (whole word) in their title or description.
 *
 * @param {string} calendarId - The ID of the calendar to search.
 * @param {string} keyword - The keyword to match against event titles and descriptions.
 * @param {number} [daysBefore=365] - How many days back to search.
 * @param {number} [daysAfter=365] - How many days forward to search.
 * @returns {{ success: boolean, deletedCount: number, error?: string }}
 */
function deleteEventsByKeyword(calendarId, keyword, daysBefore = 365, daysAfter = 365) {
  if (!calendarId || !keyword) {
    return { success: false, deletedCount: 0, error: 'calendarId and keyword are required.' };
  }

  const result = { success: false, deletedCount: 0 };

  try {
    const calendar = CalendarApp.getCalendarById(calendarId);
    if (!calendar) {
      return { ...result, error: `Calendar not found: ${calendarId}` };
    }

    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - daysBefore);
    const end = new Date(now);
    end.setDate(now.getDate() + daysAfter);

    const events = calendar.getEvents(start, end);
    if (events.length === 0) {
      return { ...result, error: 'No events found in the specified date range.' };
    }

    const regex = new RegExp(`\\b${keyword}\\b`, 'i');

    for (const event of events) {
      const matchesTitle = regex.test(event.getTitle());
      const matchesDescription = regex.test(event.getDescription() || '');

      if (matchesTitle || matchesDescription) {
        event.deleteEvent();
        result.deletedCount++;
      }
    }

    result.success = result.deletedCount > 0;

  } catch (e) {
    Logger.log(`Error in deleteEventsByKeyword: ${e}`);
    return { ...result, error: e.toString() };
  }

  return result;
}

/**
 * Serves the web app UI.
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}

/**
 * Called from the front end. Validates input before passing to the main function.
 */
function deleteEventsFromForm(calendarId, keyword) {
  if (!calendarId || !keyword) {
    return { success: false, deletedCount: 0, error: 'Calendar ID and keyword are required.' };
  }
  return deleteEventsByKeyword(calendarId, keyword);
}
