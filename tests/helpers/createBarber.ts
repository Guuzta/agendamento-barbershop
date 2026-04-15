import { prisma } from "../../src/lib/prisma";

async function createBarber() {
  const barber = await prisma.barber.create({
    data: {
      name: "Marcos",
    },
  });

  const barberId = barber.id;

  return barberId;
}

export default createBarber;
