var yandexCheckout = require("yandex-checkout")({
  shopId: "583379",
  secretKey: "live_9b5GFsn6bKE2UTuCqYrZvmzPUCKjpsMI-T77T_4NL6I",
  timeout: 20000
});

var paymentId = "2516c657-000f-5000-a000-1db26504eacc";
yandexCheckout
  .getPayment(paymentId)
  .then(function(result) {
    console.log({ payment: result });
  })
  .catch(function(err) {
    console.error(err);
  });
