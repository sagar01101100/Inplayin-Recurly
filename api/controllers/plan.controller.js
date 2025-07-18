import recurlyClient from "../recurlyClient.js";
import recurly from "recurly"

export const listPlans = async(req, res) => {
    const plans = recurlyClient.listPlans({ params: { limit: 200 } })

    const myPlans = []

    for await (const plan of plans.each()) {
        console.log(plan.code)
        myPlans.push(plan);
    }

    console.log(myPlans.length);

    res.status(200).json(myPlans);
}

export const createPlan = async (req, res) => {
    const planCreate = req.body;
    console.log(planCreate);

    try {
        // const planCreate = {
        //   name: 'Monthly Coffee Subscription',
        //   code: planCode,
        //   currencies: [
        //     {
        //       currency: 'USD',
        //       unitAmount: 10000
        //     }
        //   ]
        // }

        const plan = await recurlyClient.createPlan(planCreate)
        console.log('Created Plan: ', plan.code)

        res.status(200).json(plan);
      } catch (err) {
        if (err instanceof recurly.errors.ValidationError) {
          // If the request was not valid, you may want to tell your user
          // why. You can find the invalid params and reasons in err.params
          console.log('Failed validation', err.params)

          res.status(404).json({
            message: "Plan already exsists!"
          })
        } else {
          // If we don't know what to do with the err, we should
          // probably re-raise and let our web framework and logger handle it
          console.log('Unknown Error: ', err)
        }
    }
}

export const getPlan = async (req, res) => {
    const planId = req.params.id;

    try {
        const plan = await recurlyClient.getPlan(planId)
        console.log('Fetched plan: ', plan.code)

        res.status(200).json(plan);
      } catch (err) {
        if (err instanceof recurly.errors.NotFoundError) {
          // If the request was not found, you may want to alert the user or
          // just return null
          console.log('Resource Not Found')
        } else {
          // If we don't know what to do with the err, we should
          // probably re-raise and let our web framework and logger handle it
          console.log('Unknown Error: ', err)
        }
    }
}

export const updatePlan = async (req, res) => {
    const planUpdate = req.body;
    const planId = req.params.id;

    try {
        const plan = await recurlyClient.updatePlan(planId, planUpdate)
        console.log('Updated plan: ', plan.code)

        res.status(200).json(plan);
    } catch (err) {
        if (err instanceof recurly.errors.ValidationError) {
          // If the request was not valid, you may want to tell your user
          // why. You can find the invalid params and reasons in err.params
          console.log('Failed validation', err.params)
        } else {
          // If we don't know what to do with the err, we should
          // probably re-raise and let our web framework and logger handle it
          console.log('Unknown Error: ', err)
        }
    }
}

export const deletePlan = async (req, res) => {
    const planId = req.params.id;

    try {
        const plan = await recurlyClient.removePlan(planId)
        console.log('Removed plan: ', plan.code)

        res.status(200).json({
            message: "Plan Deleted!"
        })
      } catch (err) {
        if (err instanceof recurly.errors.NotFoundError) {
          // If the request was not found, you may want to alert the user or
          // just return null
          console.log('Resource Not Found')

            res.status(202).json({
                message: "Plan Not Found!"
            })
        } else {
          // If we don't know what to do with the err, we should
          // probably re-raise and let our web framework and logger handle it
          console.log('Unknown Error: ', err)
        }
      }
}