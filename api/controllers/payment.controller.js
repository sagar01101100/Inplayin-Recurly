import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const checkoutSession = async (req,res) => {
    const { price, plan, description } = req.body;
    console.log("check");
    try {
        // const session2 = await stripe.checkout.sessions.create({
        //     line_items: [
        //       {
        //         // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        //         price: '{{PRICE_ID}}',
        //         quantity: 1,
        //       },
        //     ],
        //     mode: 'payment',
        //     success_url: `${YOUR_DOMAIN}?success=true`,
        //     cancel_url: `${YOUR_DOMAIN}?canceled=true`,
        // });

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
            price_data: {
              currency: 'inr',
              product_data: {
                name: plan,
                description
              },
              unit_amount: price * 100,
            },
            quantity: 1,
          }],
          mode: 'payment',
          success_url: `http://localhost:5173/payment`,
          cancel_url: 'http://localhost:5173/payment',
        });

        console.log(session.id);
      
        res.json({ id: session.id });
      

    } catch (error) {
        res.status(500).json({error, message: "Failed Checkout"}); 
    }
};