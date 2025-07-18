// index.js
import express from 'express';
import cors from 'cors';
import accountRoute from "./routes/account.route.js"
import planRoute from "./routes/plan.route.js"
import subscriptionRoute from "./routes/subscription.route.js"
import couponRoute from "./routes/coupon.route.js"
import paymentRoute from "./routes/payment.route.js"
import invoiceRoute from "./routes/invoice.route.js"


const app = express();
const port = 3000;

// Middleware
app.use(cors({
  origin: true, credential: true
}));

app.use(express.json());

// try {
//     await createPlans();
//     console.log('Recurly subscription plans created successfully.');
//   } catch (error) {
//     console.error('Failed to create Recurly subscription plans:', error);
//     process.exit(1); // Exit the process if plan creation fails
// }


app.use('/account', accountRoute);
app.use('/plan', planRoute);
app.use('/subscription', subscriptionRoute);
app.use('/coupon', couponRoute);
app.use('/payment', paymentRoute);
app.use('/invoice', invoiceRoute);

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
});
