
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
    return;
  }

  if (Notification.permission !== "denied") {
    try {
      await Notification.requestPermission();
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  }
};

export const sendNotification = (title: string, body: string) => {
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
};
