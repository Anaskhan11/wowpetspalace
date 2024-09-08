// const stripe = require('stripe')(' sk_test_51Jn8daH8TsHWSDoWqTNC3fvCVl5bfx1JVCiujw46V50ZduF9aDVpmUZh0rG5KxPhcL21IhP33jgsmnrcy2gDFXlG00szN74p6N');
   const stripe = require('stripe')('sk_test_51PpuAJGaz8KfBafwJc5pGzjsQDXVTKMWrr29fq0Pr7K9QITWQ8TPW2ZVgweNwCONHSPKjauJgSvNrKZ3PucZLHQ900NBJ5poKe');
const logTransaction = require('../../middleware/logTransaction');


exports.createPaymentIntent = async (req, res) => {
  const { paymentMethodType, currency, amount, user_id, order_id ,totalAmount } = req.body;


  console.log(currency, amount, "Change currency -=---------------------------=-=-=-")

  try {
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseFloat(amount),
      currency: currency,
      payment_method_types: [paymentMethodType],
      metadata: { user_id, order_id  },
    });

    console.log("Payment Intent Created:", paymentIntent);

    // Log the transaction
    await logTransaction({
      order_id, 
      user_id,
      totalAmount,
      currency,
      payment_method: paymentMethodType,
      payment_status: paymentIntent.status,
      transaction_date: new Date(),
      gateway_response: paymentIntent.id,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error in createPaymentIntent:", error);
    res.status(400).json({ error: error.message });
  }
};



// const stripe = require('stripe')('sk_test_51PpuAJGaz8KfBafwJc5pGzjsQDXVTKMWrr29fq0Pr7K9QITWQ8TPW2ZVgweNwCONHSPKjauJgSvNrKZ3PucZLHQ900NBJ5poKe');

// exports.createPaymentIntent = async (req, res) => {
//   const { paymentMethodType, currency, amount } = req.body;
//   console.log(req.body,"payment")
  
//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount,
//       currency: currency,
//       payment_method_types: [paymentMethodType],
//     });

//     console.log("Payment Intent Created:", paymentIntent);

//     res.json({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };