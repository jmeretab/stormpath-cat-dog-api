# Cat API Dashboard
An example API and dashboard application using Stormpath.

### Setup

1. Clone this repo to your computer, and cd into the project directory:

  ```bash
  git clone https://github.com/jmeretab/stormpath-cat-api.git
  cd express-stormpath-cat-api
  ```

2. Install the dependencies from package.json:

  ```bash
  npm install
  ```

3. Export your Stormpath API Key ID / Secret and Application HREF Environment Variables:

  ```bash
  export STORMPATH_CLIENT_APIKEY_ID=xxx
  export STORMPATH_CLIENT_APIKEY_SECRET=xxx
  export STORMPATH_APPLICATION_HREF=xxx
  ```

4. Start the server:

  ```bash
  node server.js
  ```

5. Visit [http://localhost:3000/](http://localhost:3000/) in your browser

### Dashboard

To access the Cat API dashboard visit Visit [http://localhost:3000/](http://localhost:3000/) and log in.

From the API dashboard you can do the following:
* **View your API Key** - This the API key used to access the Cat API
* **Edit your `Cat Person` preferences** - This setting determines adds or removes the user from the "Cat People" group in Stormpath and determines whether or not the user can `GET` a cat via the API cat endpoint.





