import "google-apps-script";

const url = "https://schedule.somervillebikekitchen.org/notifications";

function sundayReminder() {
  Logger.log("Sending sunday reminder...");
  try {
    UrlFetchApp.fetch(url, {
      method: "post",
      payload: { notificationType: "weeklyShiftUpdate" }
    });
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
