# SFSX Trading Book Visualization

1. Name - Malkesh Nakrani
2. Email - nakranimalkesh54@gmail.com
3. Phone no. - +91 8128742585

## Steps to run app.

1. Install required modules by using command - `npm i`
2. Add your mongodb url in .env MONGODB_URI
3. Run command `npm run dev` to start the app.

## Details of app.

I've used MVC structure in code to separates application into Model, View and Controller components enhance code organization and maintainability.

For DB Design of Trading book I've create 3 models

1. Stock (For storing stock details like name and ticker).
2. Book (For storing order details)
3. Transaction (For storing executed transaction details)

### API Description

1. Get Stocks list - GET /stocks
2. Create stock - POST /stock <br/>
   Payload Example
   ```{
   "name": "google",
   "ticker": "FIJK"
   }
   ```
3. Create order - POST /order <br />

   ```
   {
   stock: '',
   side: '',
   price: '',
   quantity: '',
   }
   ```

4. Get Transaction Details - GET /transactions
5. Get Stock details - GET /stock/:id
