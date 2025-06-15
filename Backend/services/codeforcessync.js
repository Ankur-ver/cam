const cron = require('node-cron');
const Student = require('../model/student');
const { fetchCFData } = require('./codeforces');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "ankurverma7707@gmail.com",
    pass: "Ankur@7707" 
  }
});

async function sendInactivityEmail(student) {
  await transporter.sendMail({
    from: "codeforces7707@gmail.com",
    to: student.email,
    subject: "Reminder: Stay Active on Codeforces!",
    html: `
      <p>Hi ${student.name},</p>
      <p>We noticed that you haven’t submitted any problems on Codeforces in the past 7 days.</p>
      <p>Time to get back to the grind! 🚀</p>
      <p>Good luck!</p>
    `,
  });

  if (!student.inactivityReminders) {
    student.inactivityReminders = {
      count: 0,
      lastReminder: null,
      disabled: false
    };
  }

  student.inactivityReminders.count += 1;
  student.inactivityReminders.lastReminder = new Date();
  await student.save();
}

function scheduleCFDataSync(cronTime = '0 2 * * *') {
  cron.schedule(
    cronTime,
    async () => {
      console.log("⏳ Codeforces sync started...");

      try {
        const students = await Student.find();

        for (const student of students) {
          const cfData = await fetchCFData(student.codeforcesHandle);

          if (!cfData) continue;

          student.currentRating = cfData.currentRating;
          student.maxRating = cfData.maxRating;
          student.lastSynced = new Date();
          if (cfData.contestHistory) student.contestHistory = cfData.contestHistory;
          if (cfData.problemStats) student.problemStats = cfData.problemStats;
          if (cfData.submissions) student.submissions = cfData.submissions;

          const sevenDaysAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;
          const recentSubmissions = (cfData.submissions || []).filter(
            sub => sub.creationTimeSeconds >= sevenDaysAgo
          );

          const isInactive = recentSubmissions.length === 0;
          const reminders = student.inactivityReminders || {
            count: 0,
            lastReminder: null,
            disabled: false
          };

          if (isInactive && !reminders.disabled) {
            await sendInactivityEmail(student);
          } else {
            await student.save();
          }

          console.log(`Synced ${student.codeforcesHandle}`);
        }
      } catch (err) {
        console.error("Error while syncing student data:", err);
      }
    },
    { timezone: "Asia/Kolkata" }
  );
}

module.exports = scheduleCFDataSync;
