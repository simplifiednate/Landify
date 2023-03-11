import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getUsers(req, res) {
    await prisma.$connect();
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                displayname: true,
                role: true,
                avatarURL: true
                
            }
        })
        res.status(200).send({ data: users })
    } catch (error) {
        res.status(500).send(error)
    } finally {
        await prisma.$disconnect();
    }
}