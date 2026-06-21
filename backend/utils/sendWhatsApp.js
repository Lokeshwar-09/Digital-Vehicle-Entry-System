const axios = require("axios");

const sendWhatsAppMessage =
    async (
        phone,
        verificationId
    ) => {

        try {

            await axios.post(

                `https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONE_ID}/messages`,

                {

                    messaging_product:
                        "whatsapp",

                    to: `91${phone}`,

                    type: "text",

                    text: {

                        body:

                            `BDL Vehicle Verification Submitted Successfully.

Verification ID: ${verificationId}

Please keep this ID for future tracking.`

                    },

                },

                {

                    headers: {

                        Authorization:
                            `Bearer ${process.env.WHATSAPP_TOKEN}`,

                        "Content-Type":
                            "application/json",

                    },

                }
            );

            console.log(
                "WhatsApp Message Sent Successfully"
            );

        } catch (error) {

            console.log(

                "WhatsApp API Error:",

                error.response?.data ||

                error.message
            );
        }
    };

module.exports =
    sendWhatsAppMessage;