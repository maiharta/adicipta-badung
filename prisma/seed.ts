import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.upsert({
    where: {
      username: "admin",
    },
    create: {
      username: "admin",
      password: await bcrypt.hash("P@ssW0rd", 10),
    },
    update: {},
  });

  console.log(user);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
