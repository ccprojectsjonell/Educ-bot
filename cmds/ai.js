const axios = require('axios');

module.exports = {
    name: "ai",
    usedby: 0,
    dmUser: false,
    dev: "Jonell Magallanes",
    nickName: ["chatgpt", "gpt"],
    info: "EDUCATIONAL",
    onPrefix: false,
    cooldowns: 6,

    onReply: async function ({ reply, api, event }) {
        const { threadID, senderID } = event;

        const followUpApiUrl = `https://ccprojectsjonellapis-production.up.railway.app/api/gpt4o?ask=${encodeURIComponent(reply)}&id=${senderID}`;
        api.setMessageReaction("⏱️", event.messageID, () => {}, true);
        try {
            const response = await axios.get(followUpApiUrl);
            const { status, response: followUpResult } = response.data;

            if (status) {
                api.setMessageReaction("✅", event.messageID, () => {}, true);
                api.sendMessage(`𝗖𝗛𝗔𝗧𝗚𝗣𝗧\n━━━━━━━━━━━━━━━━━━\n ${followUpResult}\n━━━━━━━━━━━━━━━━━━`, threadID, event.messageID);
            } else {
                throw new Error("Failed to get a valid response from the server.");
            }
        } catch (error) {
            console.error(error);
            api.sendMessage(error.message, threadID);
        }
    },

    onLaunch: async function ({ event, actions, target, api }) {
        const { messageID, threadID } = event;
        const id = event.senderID;

        if (!target[0]) return api.sendMessage("Please provide your question.\n\nExample: ai what is the solar system?", threadID, messageID);

        const apiUrl = `https://ccprojectsjonellapis-production.up.railway.app/api/gpt4o?ask=${encodeURIComponent(target.join(" "))}&id=${id}`;

        const lad = await actions.reply("🔎 Searching for an answer. Please wait...", threadID, messageID);

        try {
            const response = await axios.get(apiUrl);
            const { status, response: result } = response.data;

            if (status) {
                const responseMessage = `𝗖𝗛𝗔𝗧𝗚𝗣𝗧\n━━━━━━━━━━━━━━━━━━\n${result}\n━━━━━━━━━━━━━━━━━━`;
                api.editMessage(responseMessage, lad.messageID, event.threadID, messageID);

                global.client.onReply.push({
                    name: this.name,
                    messageID: lad.messageID,
                    author: event.senderID,
                });
            } else {
                throw new Error("Failed to get a valid response from the server.");
            }

        } catch (error) {
            console.error(error);
            api.sendMessage(error.message, threadID, messageID);
        }
    }
};
