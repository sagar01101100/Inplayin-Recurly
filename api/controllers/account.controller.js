// AccountController.js
import recurlyClient from "../recurlyClient.js";
import recurly from "recurly"
import { v1 as uuidv1 } from 'uuid';

export const listAccounts = async(req, res) => {
    const accounts = recurlyClient.listAccounts({ params: { limit: 200 } })

    const accountList = [];

    for await (const account of accounts.each()) {
        accountList.push(account);
        console.log(account)
    }
    
    res.status(200).json(accountList);
}

export const getAccountByCode = async (req, res) => {
  const accountCode = req.params.code;

  try {
    const allAccount = recurlyClient.listAccounts();
    const accounts = [];

    for await (const account of allAccount.each()) {
        accounts.push(account);
        console.log(account)
    }

    // Find the account with matching account_code
    const matchedAccount = accounts.find(account => account.code === accountCode);

    if (!matchedAccount) {
      return res.status(200).json({ message: "Account not found" });
    }

    res.status(200).json(matchedAccount);
  } catch (err) {
    console.error("Error fetching account:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getAccount = async (req, res) => {
    const accountId = req.params.id;

    try {
        const account = await recurlyClient.getAccount(accountId)
        console.log('Fetched account: ', account.code)

        res.status(200).json(account)
    } catch (err) {
        if (err instanceof recurly.errors.NotFoundError) {
          // If the request was not found, you may want to alert the user or
          // just return null
          console.log('Resource Not Found')
          return res.status(200).json({
            message: "User not found"
          })
        } else {
          // If we don't know what to do with the err, we should
          // probably re-raise and let our web framework and logger handle it
          console.log('Unknown Error: ', err)
        }
    }
}

// Function to create an account in Recurly
export const createAccount = async (req, res) => {
    const token_id = req.body.billing_info.token_id;
    const code = req.body.code;

    try {
      const accountCreate = {
          code,
          billing_info: {
            token_id
          }
      }
  
      const account = await recurlyClient.createAccount(accountCreate)
      console.log('Created Account: ', account.code)

      res.status(200).json(account)
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
};

export const updateAccount = async(req, res) => {
    const account_code= req.params.code;
    const { tokenId } = req.body

    try {
        const accountUpdate = {
          billing_info: {
            token_id: tokenId
          }
        }

        const account = await recurlyClient.updateAccount(account_code, accountUpdate)
        console.log('Updated account: ', account)

        res.status(200).json(account)
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

export const deactivateAccount = async(req, res) => {
    const accountId = req.params.id;

    try {
        const account = await recurlyClient.deactivateAccount(accountId)
        console.log('Deleted account: ', account.code)

        res.status(200).json({
            message: "Account Deleted!"
        })
    } catch (err) {
        if (err && err.type === 'not-found') {
          // If the request was not found, you may want to alert the user or
          // just return null
          console.log('Resource Not Found')
        }
        // If we don't know what to do with the err, we should
        // probably re-raise and let our web framework and logger handle it
        throw err
    }
}

export const reactivateAccount = async(req, res) => {
    const accountId = req.params.id

    try {
        const account = await recurlyClient.reactivateAccount(accountId)
        console.log('Reactivated account: ', account.code)

        res.status(200).json(account);
      } catch (err) {
        if (err && err.type === 'not_found') {
          // If the request was not found, you may want to alert the user or
          // just return null
          console.log('Resource Not Found')
          res.status(400).json({
            message: "Account not found!"
          })
        }
        // If we don't know what to do with the err, we should
        // probably re-raise and let our web framework and logger handle it
        throw err
      }
}

export const getAccountAcquisition = async(req, res) => {
    const accountId = req.params.id;

    try {
        const acquisition = await recurlyClient.getAccountAcquisition(accountId)
        console.log('Fetched account acquisition: ', acquisition.id)

        res.status(200).json(acquisition)
      } catch (err) {
        if (err instanceof recurly.errors.NotFoundError) {
          // If the request was not found, you may want to alert the user or
          // just return null
          console.log('Resource Not Found')
          res.status(400).json({
            message: "Failed to get account acquisition"
          })
        } else {
          // If we don't know what to do with the err, we should
          // probably re-raise and let our web framework and logger handle it
          console.log('Unknown Error: ', err)
        }
    }
} 

export const updateAccountAcquisition = async(req, res) => {
    const { campaign, channel, subchannel } = req.body;

    const accountId = req.params.id;

    try {
        const acquisitionUpdate = {
          campaign,
          channel,
          subchannel
        }
        const accountAcquisition = await recurlyClient.updateAccountAcquisition(accountId, acquisitionUpdate)
        console.log('Edited Account Acquisition: ', accountAcquisition)

        res.status(200).json(accountAcquisition)
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

export const removeAcquisition = async (req, res) => {
    const accountId = req.params.id;

    try {
        await recurlyClient.removeAccountAcquisition(accountId)
        console.log('Removed account acquisition from account: ', accountId)

        res.status(200).json({
            message: "Removed Acquisition!"
        })
    } catch (err) {
        if (err instanceof recurly.errors.NotFoundError) {
          // If the request was not found, you may want to alert the user or
          // just return null
          console.log('Resource Not Found')
          res.status(404).json({
            message: "No Acquisition found!"
        })
        } else {
          // If we don't know what to do with the err, we should
          // probably re-raise and let our web framework and logger handle it
          console.log('Unknown Error: ', err)
        }
    }
}