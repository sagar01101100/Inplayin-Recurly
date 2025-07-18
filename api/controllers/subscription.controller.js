import recurlyClient from "../recurlyClient.js";
import recurly from "recurly"

export const listSubscriptions = async (req, res) => {
  const subscriptions = recurlyClient.listSubscriptions({ params: { limit: 200 } })

  const mySubscriptions = []

  for await (const subscription of subscriptions.each()) {
    console.log(subscription.uuid)
    mySubscriptions.push(subscription);
  }

  res.status(200).json(mySubscriptions);
}

export const listSubscriptionsAccountCode = async (req, res) => {
  const { accountCode } = req.body;

  const subscriptions = recurlyClient.listSubscriptions({ params: { limit: 200 } })

  const mySubscriptions = []

  for await (const subscription of subscriptions.each()) {
    // console.log(subscription)
    if(subscription.account.code === accountCode) mySubscriptions.push(subscription);
  }

  console.log("My Subscriptions: ", mySubscriptions);

  res.status(200).json(mySubscriptions);
}

export const createSubscription = async (req, res) => {

  // const {currency, planCode, account} = req.body

  const purchaseReq = req.body;
  console.log(purchaseReq);

  // console.log(currency, planCode, account);

  try {

    // const purchaseReq = {
    //   planCode,
    //   currency,
    //   account
    // }

    let sub = await recurlyClient.createSubscription(purchaseReq)
    console.log('Created subscription: ', sub.uuid)

    res.status(200).json(sub);
  } catch (err) {
    if (err instanceof recurly.errors.ValidationError) {
      // If the request was not valid, you may want to tell your user
      // why. You can find the invalid params and reasons in err.params
      console.log('Failed validation (Subscription): ', err.params)
      res.status(400).json(err.params[0])
    } else {
      // If we don't know what to do with the err, we should
      // probably re-raise and let our web framework and logger handle it
      console.log('Unknown Error: ', err)
    }
  }
}

export const getSubscription = async(req, res) => {
  const subscriptionId = req.params.id;

  try {
    const subscription = await recurlyClient.getSubscription(subscriptionId)
    console.log('Fetched subscription: ', subscription.uuid)

    res.status(200).json(subscription)
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

export const updateSubscription = async(req, res) => {
  const subscriptionId = req.params.id;
  const update = req.body;

  try {
    // const update = {
    //   termsAndConditions: "Some new terms and conditions",
    //   customerNotes: "Some new customer notes"
    // }
    const subscription = await recurlyClient.updateSubscription(subscriptionId, update)
    console.log('Modified subscription: ', subscription.uuid)

    res.status(200).json(subscription);
  } catch(err) {
  
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

export const terminateSubscription = async(req, res) => {
  const subscriptionId = req.params.id;

  try {
    const subscription = await recurlyClient.terminateSubscription(subscriptionId)
    console.log('Terminated subscription: ', subscription.uuid)

    res.status(200).json({
      message: "Subscription terminated!"
    })
  } catch (err) {
    if (err instanceof recurly.errors.ValidationError) {
      // If the request was not valid, you may want to tell your user
      // why. You can find the invalid params and reasons in err.params
      console.log('Failed validation: No Active Subscription exsists', err.params)
      // Send a 400 Bad Request response with specific error details

      res.status(400).json({
        message: 'No Active Subscription exists',
        details: err.params || null
      });
    } else {
      // If we don't know what to do with the err, we should
      // probably re-raise and let our web framework and logger handle it
      console.log('Unknown Error: ', err)

      // Send a 500 Internal Server Error response for unknown errors
      res.status(500).json({
        message: 'An unknown error occurred while terminating the subscription.',
        error: err.message || 'Server error'
      });
    }
  }
}

export const cancelSubscription = async(req, res) => {
  const subscriptionId = req.params.id;

  try {
    let expiredSub = await recurlyClient.cancelSubscription(subscriptionId)
    console.log('Canceled Subscription: ', expiredSub.uuid)

    res.status(200).json({
      message: "Subscription Cancelled!"
    })
  } catch (err) {
    if (err instanceof recurly.errors.ValidationError) {
      // If the request was not valid, you may want to tell your user
      // why. You can find the invalid params and reasons in err.params
      console.log('Failed validation', err)
    } else {
      // If we don't know what to do with the err, we should
      // probably re-raise and let our web framework and logger handle it
      console.log('Unknown Error: ', err)
    }
  }
}

export const reactivateSubscription = async(req, res) => {
  const subscriptionId = req.params.id;

  try {
    const subscription = await recurlyClient.reactivateSubscription(subscriptionId)
    console.log('Reactivated subscription: ', subscription.uuid)

    res.status(200).json({
      message: "Subscription Reactivated!"
    })
  } catch(err) {
  
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

export const pauseSubscription = async(req, res) => {
  const subscriptionId = req.params.id;
  const pauseReq = req.body;

  try {
    // let pauseReq = {
    //   remaining_pause_cycles: 2,
    // }

    const subscription = await recurlyClient.pauseSubscription(subscriptionId, pauseReq)
    console.log('Paused subscription: ', subscription.id)

    res.status(200).json({
      message: "Subscription Paused!"
    })
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

export const resumeSubscription = async(req, res) => {
  const subscriptionId = req.params.id;

  try {
    const subscription = await recurlyClient.resumeSubscription(subscriptionId)
    console.log('Resumed subscription: ', subscription.id)

    res.status(200).json({
      message: "Subscription resumed!"
    })
  } catch (err) {
    if (err instanceof recurly.errors.ValidationError) {
      // If the request was not valid, you may want to tell your user
      // why. You can find the invalid params and reasons in err.params
      console.log('Failed validation', err.params);

      res.status(404).json({
        message: "Ivalid request... please ensure the subscription that you want to resume is paused."
      })
    } else {
      // If we don't know what to do with the err, we should
      // probably re-raise and let our web framework and logger handle it
      console.log('Unknown Error: ', err)
    }
  }
}

export const createSubscriptionChange = async (req, res) => {
  try {
    const subscriptionChangeCreate = req.body;
    const subscriptionId = req.params.id;
  
    const change = await recurlyClient.createSubscriptionChange(subscriptionId, subscriptionChangeCreate)
    console.log('Created subscription change: ', change.id)

    res.status(200).json(change);
  } catch (err) {
    if (err instanceof recurly.errors.ValidationError) {
      // If the request was not valid, you may want to tell your user
      // why. You can find the invalid params and reasons in err.params
      console.log('Failed validation', err)
    } else {
      // If we don't know what to do with the err, we should
      // probably re-raise and let our web framework and logger handle it
      console.log('Unknown Error: ', err)
    }
  }
}
