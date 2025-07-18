import recurlyClient from './recurlyClient.js';

// Define plan details
const plans = [
  {
    code: 'free-trial',
    name: 'Free Trial Subscription',
    currencies: [
      {
        currency: 'INR',
        unitAmount: 0,
      },
    ],
    trial: {
      unit: 'day',
      length: 15,
    }
  },
  {
    code: 'basic',
    name: 'Basic Subscription',
    currencies: [
      {
        currency: 'INR',
        unitAmount: 100,
      },
    ],
  },
  {
    code: 'pro',
    name: 'Pro Subscription',
    currencies: [
      {
        currency: 'INR',
        unitAmount: 500,
      },
    ],
  },
  {
    code: 'pro-plus',
    name: 'Pro Plus Subscription',
    currencies: [
      {
        currency: 'INR',
        unitAmount: 1000,
      },
    ],
  },
];

const createPlans = async () => {
  try {
    // Fetch existing plans from Recurly
    const existingPlansResponse = recurlyClient.listPlans();
    const existingPlans = [];

    for await (const plan of existingPlansResponse.each()) {
      existingPlans.push(plan);
    }

    // Create each plan if it doesn't already exist
    const createdPlans = await Promise.all(
      plans.map(async (plan) => {
        const planExists = existingPlans.some(existingPlan => existingPlan.code === plan.code);
        if (!planExists) {
          const createdPlan = await recurlyClient.createPlan(plan);
          console.log(`Created Plan: ${createdPlan.code} - ${createdPlan.name}`);
          return createdPlan;
        } else {
          console.log(`Plan already exists: ${plan.code}`);
          return plan;
        }
      })
    );

    return createdPlans;
  } catch (error) {
    console.error('Error creating plans:', error);
    throw error;
  }
};

// createPlans();
export default createPlans;
