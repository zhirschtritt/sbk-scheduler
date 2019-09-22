import "google-apps-script";

const url = "https://schedule.somervillebikekitchen.org/notifications";

// copy pasted from server code
enum NotificationType {
  cancelledShift = "cancelledShift",
  weeklyShiftUpdate = "weeklyShiftUpdate",
  dayOfShiftUpdate = "dayOfShiftUpdate"
}

function sundayReminder() {
  Logger.log("Sending sunday reminder...");
  try {
    UrlFetchApp.fetch(url, {
      method: "post",
      payload: { notificationType: NotificationType.weeklyShiftUpdate }
    });
    Logger.log("Successfully sent sunday reminder job");
  } catch (err) {
    Logger.log(`Error sending sunday reminder job: ${err}`);
  }
}

function dayOfReminder() {
  Logger.log("Sending day of reminder...");
  try {
    UrlFetchApp.fetch(url, {
      method: "post",
      payload: { notificationType: NotificationType.dayOfShiftUpdate }
    });
    Logger.log("Successfully sent dayOf reminder job");
  } catch (err) {
    Logger.log(`Error sending sunday reminder job: ${err}`);
  }
}

function testPost() {
  Logger.log("Sending test reminder...");
  const url = "https://084373bf.ngrok.io/notifications";
  try {
    UrlFetchApp.fetch(url, {
      method: "post",
      payload: { notificationType: "weeklyShiftUpdate" },
      followRedirects: true
    });
  } catch (err) {
    Logger.log(`Error sending sunday reminder job: ${err}`);
  }
}
