import recurlyClient from "../recurlyClient.js";
import recurly from "recurly"

export const getBillingInfo = async(req, res) => {
    const accountId = req.params.id;

    try {
        const billingInfo = await recurlyClient.getBillingInfo(accountId)
        console.log('Fetched Billing Info: ', billingInfo.id)

        res.status(200).json(billingInfo);
      } catch (err) {
        if (err instanceof recurly.errors.NotFoundError) {
          // If the request was not found, you may want to alert the user or
          // just return null
          console.log('Resource Not Founded')

          res.status(404).json({
            message: "Billing info not found"
          });
        } else {
          // If we don't know what to do with the err, we should
          // probably re-raise and let our web framework and logger handle it
          console.log('Unknown Error: ', err)
        }
      }
}

export const updateBillingInfo = async(req, res) => {
    const accountId = req.params.id;
    const billingInfoUpdate = req.body

    try {
        const billingInfo = await recurlyClient.updateBillingInfo(accountId, billingInfoUpdate)
        console.log('Updated billing info: ', billingInfo.id)

        res.status(200).json(billingInfo);
    } catch (err) {
        if (err instanceof recurly.errors.ValidationError) {
          // If the request was not valid, you may want to tell your user
          // why. You can find the invalid params and reasons in err.params
          console.log('Failed validation', err.params)

          res.status(404).json({
            message: "Error from client side..."
          })
        } else if (err instanceof recurly.errors.TransactionError) {
          console.log('Transaction Error: ', err.transactionError);

          res.status(402).json({
              message: "Your transaction was declined. Please use a different card or contact your bank.",
              transactionId: err.transactionError.transactionId,
              declineCode: err.transactionError.declineCode,
              merchantAdvice: err.transactionError.merchantAdvice
          });
        } else {
          // If we don't know what to do with the err, we should
          // probably re-raise and let our web framework and logger handle it
          console.log('Unknown Error: ', err)
        }
    }
}

export const removeBillingInfo = async (req, res) => {
  const accountId = req.params.id;

  try {
    recurlyClient.removeBillingInfo(accountId)
    console.log('Removed billing info from account: ', accountId)

    res.status(200).json({
      message: "Removed Billing Info"
    })
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