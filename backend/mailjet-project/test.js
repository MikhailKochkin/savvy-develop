const mailjet = require("node-mailjet").connect(
  "36eceb25f77ead8d7de9a80ca92b76a5",
  "7bba030b2d2279145f26f90199d2b98a"
);
const request = mailjet.post("send", { version: "v3.1" }).request({
  Messages: [
    {
      From: {
        Email: "mi.kochkin@ya.ru",
        Name: "Mikhail"
      },
      To: [
        {
          Email: "mi.kochkin@ya.ru",
          Name: "Mikhail"
        }
      ],
      Subject: "Greetings from Mailjet.",
      TextPart: "My first Mailjet email",
      HTMLPart:
        "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
      CustomID: "AppGettingStartedTest"
    }
  ]
});
request
  .then(result => {
    console.log(result.body);
  })
  .catch(err => {
    console.log(err);
  });
