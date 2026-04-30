import { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME } from "@/config/variable";

import { hashPassword } from "@/middleware/auth";
import { prisma } from "@/config/prisma";

async function main() {
  const role = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
      title: "Administrator",
    },
  });

  const hashed = await hashPassword(ADMIN_PASSWORD);
  const user = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: hashed,
      roleId: role.id,
    },
  });

  console.log(`✅ Admin seeded: ${user.username} (${user.email})`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
