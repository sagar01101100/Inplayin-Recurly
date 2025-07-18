import recurlyClient from "../recurlyClient.js";
import recurly from "recurly"

export const listCoupons = async(req, res) => {
    const coupons = recurlyClient.listCoupons({ params: { limit: 200 } })

    const couponList = [];

    for await (const coupon of coupons.each()) {
        couponList.push(coupon);
        console.log(coupon.code)
    }
    console.log(couponList);

    res.status(200).json(couponList);
}

export const validateCouponCode = async (req, res) => {
  const { couponCode } = req.body;
  console.log("Coupon Code: ",couponCode);
  try {
    const coupons = recurlyClient.listCoupons({ params: { limit: 200 } })

    const couponList = [];

    for await (const coupon of coupons.each()) {
        couponList.push(coupon);
        console.log(coupon.code)
    }

    console.log("couponList: ", couponList);

    for (const coupon of couponList) {
      if (coupon.couponType === 'single_code' && coupon.code === couponCode && coupon.state === "redeemable") {
        return res.json({ valid: true, coupon }); // Single code coupon is valid
      }

      if (coupon.couponType === 'bulk') {
        const uniqueCodes = recurlyClient.listUniqueCouponCodes(coupon.id);
        const uniqueCodeList = [];
        
        for await (const couponItr of uniqueCodes.each()) {
          uniqueCodeList.push(couponItr);
        }

        console.log("Unique Codes: ", uniqueCodeList);

        for (const uniqueCode of uniqueCodeList) {
          if (uniqueCode.code === couponCode && uniqueCode.state === "redeemable") {
            return res.json({ valid: true, coupon: uniqueCode });
          }
        }
      }
    }

    res.json({ valid: false, message: 'Invalid coupon code.' });
  } catch (error) {
    console.error('Error validating coupon code:', error);
    res.status(500).json({ error: 'Error validating coupon code.' });
  }
};


export const getCoupon = async(req, res) => {
    const couponId = req.params.id;

    try {
        const coupon = await recurlyClient.getCoupon(couponId);
        console.log('Fetched coupon: ', coupon.code)

        res.status(200).json(coupon);
    } catch (err) {
        if (err instanceof recurly.errors.NotFoundError) {
          // If the request was not found, you may want to alert the user or
          // just return null
          console.log('Resource Not Found')

          res.status(404).json({
            message: "Please enter a valid coupon detail!"
          })
        } else {
          // If we don't know what to do with the err, we should
          // probably re-raise and let our web framework and logger handle it
          console.log('Unknown Error: ', err)
        }
    }
}

export const createCoupon = async(req, res) => {
    const couponCreate = req.body;

    try {
        // const couponCreate = {
        //   name: "Promotional Coupon",
        //   code: couponCode,
        //   discount_type: "fixed",
        //   currencies: [{"currency": "USD", "discount": 10}],
        // }
        const coupon = await recurlyClient.createCoupon(couponCreate)
        console.log('Created coupon: ', coupon.id)

        res.status(200).json(coupon);
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

export const updateCoupon = async(req, res) => {
    const couponUpdate = req.body;
    const couponId = req.params.id;

    try {
        // const couponUpdate = {
        //   name: "New Coupon Name"
        // }
        const coupon = await recurlyClient.updateCoupon(couponId, couponUpdate)
        console.log('Updated coupon: ', coupon)

        res.status(200).json(coupon)
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

export const deactivateCoupon = async(req, res) => {
    const couponId = req.params.id;

    try {
        const coupon = await recurlyClient.deactivateCoupon(couponId)
        console.log('Deactivated coupon: ', coupon.code)

        res.status(200).json({
            message: "Coupon deactivated!"
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
