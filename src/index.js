/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */ 
export default {
  async fetch(request) {
    // Initialize a variable for the response
    let resp;

    // If it is a bot then return a json indicating that it is a blocked request
    if (request.cf.botManagement.score <= 40) {
      // Define JSON result
      let jsonRes = JSON.stringify({
        result: {
          action: "blocked",
          reason: "You are a very bad bot!",
          botScore: request.cf.botManagement.score,
        },
      });
      // Define the INIT object
      let init = {
        status: 403,
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      };
      // Create a response object that has a JSON indicating the request is being blocked and why
      resp = new Response(jsonRes, init);
    } else {
      /*
      Make a subrequest and return its result;
      Make sure to utilize the "resolveOverride" cf property
      capture it's response object in a variable  */
      resp = await fetch(
        new Request("https://http.cat/401", {
          cf: { resolveOverride: "http.cat" },
        })
      );
    }
    return resp;
  },
};
