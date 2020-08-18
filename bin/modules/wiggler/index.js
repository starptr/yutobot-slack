const _ = require("lodash");

const axios = require("axios").default;

const wiggler = async app => {
  let pfpsUrls = ["http://cloud-2to2o6psz.vercel.app/cartoony1.png", "http://cloud-2to2o6psz.vercel.app/cartoony2.png", "http://cloud-2to2o6psz.vercel.app/cartoony3.png", "http://cloud-2to2o6psz.vercel.app/cartoony4.png", "http://cloud-2to2o6psz.vercel.app/cartoony5.png", "http://cloud-2to2o6psz.vercel.app/cartoony6.png", "http://cloud-2to2o6psz.vercel.app/cartoony7.png", "http://cloud-2to2o6psz.vercel.app/cartoony8.png"]; // Last minute of execution

  let m = new Date().getMinutes() - 1; // Last pfp's index

  let oldIndex = -1; // Repeated func

  const randomPushPfp = async () => {
    // Choose an index not equal to the last index (this algo makes it impossible to choose last pfp on first iteration)
    let i = oldIndex + 1;

    if (i >= pfpsUrls.length) {
      i = 0;
      pfpsUrls = _.shuffle(pfpsUrls);
    }

    oldIndex = i;

    try {
      // Push pfp
      const res = await axios.get(pfpsUrls[i], {
        responseType: "arraybuffer"
      });
      const result = await app.client.users.setPhoto({
        token: process.env.SLACK_OAUTH_TOKEN,
        image: Buffer.from(res.data)
      });
    } catch (err) {
      fancyLog(err);
    }
  };

  const updateJob = setInterval(async () => {
    let now = new Date();

    if (now.getMinutes() !== m) {
      m = now.getMinutes();
      await randomPushPfp();
    }
  }, 1000 * 10);
};

module.exports = wiggler;