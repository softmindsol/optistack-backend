import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create Permissions
    const permissionsData = [
        { name: 'READ_USER' },
        { name: 'WRITE_USER' },
        { name: 'DELETE_USER' },
        { name: 'READ_PRODUCT' },
        { name: 'WRITE_PRODUCT' }
    ];

    for (const p of permissionsData) {
        await prisma.permission.upsert({
            where: { name: p.name },
            update: {},
            create: p,
        });
    }

    // Create Roles
    const adminRole = await prisma.role.upsert({
        where: { name: 'ADMIN' },
        update: {},
        create: {
            name: 'ADMIN',
            permissions: {
                connect: permissionsData.map(p => ({ name: p.name }))
            }
        }
    });

    const userRole = await prisma.role.upsert({
        where: { name: 'USER' },
        update: {},
        create: {
            name: 'USER',
            permissions: {
                connect: [{ name: 'READ_USER' }, { name: 'READ_PRODUCT' }]
            }
        }
    });

    // Create Default Admin User
    await prisma.user.upsert({
        where: { email: 'admin@optistack.com' },
        update: {},
        create: {
            email: 'admin@optistack.com',
            name: 'Super Admin',
            password: 'hashed_password_here', // In real app, hash this!
            roleId: adminRole.id
        }
    });

    console.log('Seeding finished.');
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
