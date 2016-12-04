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

4. Create a group in Stormpath called `Cat People`.
This group is needed to determine who can access certain endpoints of the Cat API

  ```bash
  curl --request POST \
  --user $SP_API_KEY_ID:$SP_API_KEY_SECRET \
  --header 'content-type: application/json' \
  --url "https://api.stormpath.com/v1/directories/$DIRECTORY_ID/groups" \
  --data '{
    "name" : "Cat People"
  }'
  ```

5. Start the server:

  ```bash
  node server.js
  ```

5. Visit [http://localhost:3000/](http://localhost:3000/) in your browser

### Dashboard

To access the Cat API dashboard visit Visit [http://localhost:3000/](http://localhost:3000/) and log in.

From the API dashboard you can do the following:
* **View your API key** - This the API key used to access the Cat API
* **Edit your Cat Person preferences** - This setting determines whether the user belongs to the`Cat People` group in Stormpath. Users must have `Cat People` enabled to retrieve a cat via the API `/cat` endpoint.

### API

The catdog API has the below endpoints:

#### Get dog
```bash
GET  /api/dog
```
This endpoint retrieves a dog, which goes "Woof!"

Example request:
```bash
curl -v --user $DASHBOARD_API_KEY_ID:$DASHBOARD_API_KEY_SECRET http://localhost:3000/api/dog
```
Where: 
* `$DASHBOARD_API_KEY_ID` is the API key id provided in the Cat API dashboard.
* `$DASHBOARD_API_KEY_SECRET` is the API key secret provided in the Cat API dashboard.


#### Get cat
```bash
GET  /api/cat
```
This endpoint retrieves a cat, which goes "Meow!". 
**Users must be in the `Cat People` group to access this endpoint.**

Example request:
```bash
curl -v --user $DASHBOARD_API_KEY_ID:$DASHBOARD_API_KEY_SECRET http://localhost:3000/api/cat
```
Where: 
* `$DASHBOARD_API_KEY_ID` is the API key id provided in the Cat API dashboard.
* `$DASHBOARD_API_KEY_SECRET` is the API key secret provided in the Cat API dashboard.






