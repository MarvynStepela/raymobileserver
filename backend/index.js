import { db } from "./config/Database.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./router/route.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import RedisStore from "connect-redis";
import { createClient } from "redis";

const app = express();
dotenv.config();

const redisClient = createClient();
redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "prefix:",
});

const csp = {
  defaultSrc: [`'none'`],
  styleSrc: [`'self'`, `'unsafe-inline'`],
  scriptSrc: [`'self'`],
  imgSrc: [`'self'`],
  connectSrc: [`'self'`],
  frameSrc: [`'self'`],
  fontSrc: [`'self'`, "data:"],
  objectSrc: [`'self'`],
  mediaSrc: [`'self'`],
};
const PORT = process.env.PORT || 4000;
const SESSION_SECRET = process.env.SESSION_SECRET;
const sixtyDaysInSeconds = 5184000; // 60 * 24 * 60 * 60
const ALLOWED_DOMAINS =
  process.env.NODE_ENV === "production"
    ? [process.env.REMOTE_CLIENT_APP, process.env.REMOTE_SERVER_API]
    : [process.env.LOCAL_CLIENT_APP, process.env.LOCAL_SERVER_API];



app.use(
  cors({
    origin: "https://raymobileci.com",
    credentials: true,
  })
);

app.set("trust proxy", 1); // trust first proxy
app.disable("x-powered-by");


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cookieParser()); // any string ex: 'keyboard cat'

app.use(
  session({
    name: "session_id",
    saveUninitialized: true,
    resave: false,
    secret: SESSION_SECRET, // Secret key,
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: 1 * 60 * 1000,
      sameSite: "none",
      secure: true,
    },
  })
);

// app middleware
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://raymobileci.com");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});




//const app = express().use("*", cors(corsOptions));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join("/public")));

const sessionConfig = {
  // ... other methods
  cookie: {
    sameSite: "none",
  },
};

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sessionConfig.cookie.secure = true; // serve secure cookies
}

app.use(session(sessionConfig));


// app middleware
app.use(
	express.urlencoded({
		extended: true,
	}),
);

app.use(express.json());


app.get("/", function (req, res, next) {
  // Handle the get for this route
});

app.post("/", function (req, res, next) {
  // Handle the post for this route
});

app.options("*", cors());

app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	}),
);
app.use(cookieParser(SESSION_SECRET)); // any string ex: 'keyboard cat'




const storageCar = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `public/uploads/vehicules`);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const storageDriver = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/drivers/avatars");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const storageContrat = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/drivers/contrats");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const uploadCar = multer({ storage: storageCar });
const uploadDriver = multer({ storage: storageDriver });
const uploadContrat = multer({ storage: storageContrat });

app.post("/api/upload-car", uploadCar.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.post("/api/upload-driver", uploadDriver.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.post("/api/upload-contrat", uploadContrat.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/", route);

app.use("/", express.static(path.join(__dirname, "/")));


app.get("/", (req, res) => {
  res.send("Route pour le backend");
});


try {
  await db.authenticate();
  console.log("Base de donnée connectée");
} catch (error) {
  console.error();
}

app.listen(PORT, () => console.log(`Serveur fonctionne sur le port ${PORT}`));

function initial() {
  Role.create({
    id: 1,
    name: "Administrateur",
  });

  Role.create({
    id: 2,
    name: "Comptabilité",
  });

  Role.create({
    id: 3,
    name: "Logistique",
  });
}
