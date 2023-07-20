const {Merchant} = require("../models/index.js");
const {is_null} = require("locutus/php/var");


module.exports = {
    async validateMerchant(merchantId) {
        let merchant = await Merchant.findOne({
            where: {merchant_id: merchantId}
        });

        if (is_null(merchant)) return false;

        return merchant;
    },
}