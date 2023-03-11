import { signJWT } from "../middlewares/jwt.js";
import { hash, verify } from "argon2";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function logUser(req, res) {
  const { email, username, password } = req.body;
  await prisma.$connect();
  try {
    const dbUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!dbUser) {
      res
        .status(404)
        .send({ message: "Couldn't find the user you're looking for." });
    }

    const comparedPass = verify(dbUser.password, password);
    if (!comparedPass) {
      res.status(401).send({ message: "Invalid Credentials." });
    }

    const token = await signJWT(req, res);

    res.status(200).send({
      username: dbUser.username,
      token: token,
      message: "Succesfully Logged in."
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Unexpected error occured, please try again later." });
  } finally {
    await prisma.$disconnect();
    return;
  }
}

export async function createUser(req, res) {
  try {
    await prisma.$connect();

    const { username, email, password } = req.body;

    const userExist = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (userExist) {
      return res.send({ err: "User already exists" });
    }

    console.log(password);
    const hashedPass = await hash(password);

    await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPass,
        role: {
          connect: { name: "USER" }
        }
      },
    });

    return res.status(200).send({ message: "Successfully Created" });
  } catch (error) {
    console.log(error);
    return res.send({ err: "Unexpected error occurred, please try again later." });
  } finally {
    await prisma.$disconnect();
  }
}
