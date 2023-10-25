import {config} from "dotenv"
config({ path: `.env.${process.env.NODE_ENV || 'development'}.online` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';


const {DB_HOST, DB_PASSWORD, DB_NAME  } = process.env

export const dbConnection = {
  url: `mongodb+srv://user:NigeriaSecurity240@cluster0.zc4mc02.mongodb.net/momohack`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
};