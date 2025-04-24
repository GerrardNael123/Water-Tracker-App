document.addEventListener('DOMContentLoaded', function () {
  if (typeof schedules === 'undefined') return; // Ensure schedules is available

  // Set reminder delays for each activity type (in minutes)
  const reminderDelays = {
    ringan:60,  // Reminder every 60 minutes
    sedang: 45,  // Reminder every 45 minutes
    berat: 30 // Reminder every 30 minutes
  };

  // Request notification permission if not granted yet
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }

  // Function to show the notification
  function showNotification(schedule) {
    new Notification('🚰 Reminder Water Tracker', {
      body: `Aktivitas: ${schedule.name} (${schedule.activityType}) sedang berlangsung.`,
      icon: '/images/water-icon.png' // Ganti path jika perlu
    });
  }
  

  // Function to check reminders
  function checkReminders() {
    // Get current time
    const now = new Date();

    // Loop through each schedule and check for reminder time
    schedules.forEach(schedule => {
      const delayMinutes = reminderDelays[schedule.activityType]; // Get the reminder delay based on activity type

      if (!delayMinutes) return; // Skip if no delay is set for this activity type

      // Calculate the start and end time of the activity
      const startTime = new Date(schedule.startTime);
      const endTime = new Date(schedule.endTime);

      // Only show reminder if current time is within the activity's start and end time
      if (now >= startTime && now <= endTime) {
        // Calculate time passed since the start of the activity in minutes
        const timePassed = Math.floor((now - startTime) / 60000);  // Time passed in minutes

        // Check if the time passed is divisible by the reminder interval (e.g., 45, 60, or 30 minutes)
        if (timePassed % delayMinutes === 0) {
          showNotification(schedule); // Show reminder
        }
      }
    });
  }

  // Check reminders every minute (60000 milliseconds)
  setInterval(checkReminders, 60000); // This will check every 60 seconds
});