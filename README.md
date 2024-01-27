![image](https://cdn.filestackcontent.com/sIllBRIqw6SDoeZddPA8)
## **Login API** ##

 This project has created to applicated knowledges learneds with books kind `"Clean Code"` and `"Clean Archtecture"` also with code examples Medium and Youtube provides.
 
 All knowledge has applicated on my old login api for Nodejs! ( repository: <https://github.com/LuisSky/first-node-login-api> )
 
 This project is not an example of good practices or architecture, it is just a practical application of good content that I have absorbed from great tutorials and tips spread over the internet, so there is still a lot to improve and I intend to update it whenever there is a need.
 
## **Special Thanks**

  - Rodrigo Manguinho - knowledges on Clean Architecture and best pratices
  - Otavio Lemos - tips of Architecture insides
  - Waldemar Neto - tips how to use mocks on jest

## **How to use**

- Rename .env.example to .env
- Configure the .
- run postgres docker aplication with  `docker compose up`
- `npm install`
- `npm start`
- `npx prisma migrate`

## **Tests**
- `npm run dev:integration` - to run integration tests
- `npm run dev:unity` - to run unity tests
- `npm run dev:coverage` - to collect coverage data

- you can use insomnia / postman or any other rest client to acess the endpoints

## **Routes**
/auth/signin - use to login
/auth/signup - use to register 

## **Dependencies that's will installed after npm install**

- bcrypt
- express
- jsonwebtoken
- pg

#### **Development libs**
- jest 
- dotenv 
- prisma  
  
## **ESLint and style guide**  
- standard