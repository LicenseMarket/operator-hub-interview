import { $Enums, PrismaClient, RequestMethod, Role, Route } from '@prisma/client';
import api from '../swagger-spec.json';
import * as bcrypt from 'bcrypt';

// Initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  try {
    const roles = await ensureRolesExist();
    const operators = await createUser(roles);
    const product = await prisma.product.create({
      data: {
        durationTime: 12,
        name: 'main product',
        userId: operators.superAdmin.id,
      }
    });
    await createOrder(operators, product)
    const paths = [];
    const routes = createRouteRecords(paths);
    await prisma.route.createMany({ data: routes });
    const createdRoutes = await prisma.route.findMany({});
    await createAdminPermission(roles, createdRoutes);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    // Close Prisma Client connection
    await prisma.$disconnect();
  }
}

async function createOrder(operators, product) {
  await prisma.order.upsert({
    where: {
      orderNumber: '22',
    },
    create: {
      dueTime: generateRandomDate(new Date(2023, 0, 1), new Date()),
      email: 'saeedgh@gmail.com',
      mobile: '09200003839',
      name: 'majidzx',
      orderNumber: '22',
      orderTime: new Date(),
      status: $Enums.OrderStatus.COMPLETE,
      assignee: operators.superAdmin.id,
      assignedTo: {
        connect: {
          id: operators.superAdmin.id
        }
      },
      Label: {
        connectOrCreate: {
          create: {
            color: 'blue',
            name: 'blue',
          },
          where: {
            color: 'black',
            name: 'black',
          }
        }
      },
      product: {
        connect: {
          id: product.id
        }
      }
    },
    update: {
      dueTime: generateRandomDate(new Date(2023, 0, 1), new Date()),
      email: 'saeedgh@gmail.com',
      mobile: '09200003839',
      name: 'majidzx',
      orderNumber: '22',
      orderTime: new Date(),
      status: $Enums.OrderStatus.COMPLETE,
      assignee: operators.superAdmin.id,
      assignedTo: {
        connect: {
          id: operators.superAdmin.id
        }
      },
      Label: {
        connectOrCreate: {
          create: {
            color: 'black',
            name: 'black',
          },
          where: {
            color: 'blue',
            name: 'blue',
          }
        }
      },
      product: {
        connect: {
          id: product.id
        }
      }
    }
  });
  await prisma.order.upsert({
    where: {
      orderNumber: '33',
    },
    create: {
      dueTime: generateRandomDate(new Date(2023, 0, 1), new Date()),
      email: 'ehsanM@gmail.com',
      mobile: '09200004800',
      name: 'ehsan te',
      orderNumber: '33',
      orderTime: new Date(),
      status: $Enums.OrderStatus.PENDING,
      assignee: operators.admin.id,
      assignedTo: {
        connect: {
          id: operators.admin.id
        }
      },
      Label: {
        connectOrCreate: {
          create: {
            color: 'yellow',
            name: 'yellow',
          },
          where: {
            color: 'black',
            name: 'black',
          }
        }
      },
      product: {
        connect: {
          id: product.id
        }
      }
    },
    update: {
      dueTime: generateRandomDate(new Date(2023, 0, 1), new Date()),
      email: 'ehsanM@gmail.com',
      mobile: '09200004800',
      name: 'ehsan te',
      orderNumber: '33',
      orderTime: new Date(),
      status: $Enums.OrderStatus.PENDING,
      assignee: operators.admin.id,
      assignedTo: {
        connect: {
          id: operators.admin.id
        }
      },
      Label: {
        connectOrCreate: {
          create: {
            color: 'yellow',
            name: 'yellow',
          },
          where: {
            color: 'black',
            name: 'black',
          }
        }
      },
      product: {
        connect: {
          id: product.id
        }
      }
    }
  });
  await prisma.order.upsert({
    where: {
      orderNumber: '44',
    },
    create: {
      dueTime: generateRandomDate(new Date(2023, 0, 1), new Date()),
      email: 'mohammad@gmail.com',
      mobile: '09200003800',
      name: 'mohammad te',
      orderNumber: '44',
      orderTime: new Date(),
      status: $Enums.OrderStatus.PENDING,
      assignee: operators.user.id,
      assignedTo: {
        connect: {
          id: operators.user.id
        }
      },
      Label: {
        connectOrCreate: {
          create: {
            color: 'dark',
            name: 'dark',
          },
          where: {
            color: 'black',
            name: 'black',
          }
        }
      },
      product: {
        connect: {
          id: product.id
        }
      }
    },
    update: {
      dueTime: generateRandomDate(new Date(2023, 0, 1), new Date()),
      email: 'mohammad@gmail.com',
      mobile: '09200003800',
      name: 'mohammad te',
      orderNumber: '44',
      orderTime: new Date(),
      status: $Enums.OrderStatus.PENDING,
      assignee: operators.user.id,
      assignedTo: {
        connect: {
          id: operators.user.id
        }
      },
      Label: {
        connectOrCreate: {
          create: {
            color: 'dark',
            name: 'dark',
          },
          where: {
            color: 'black',
            name: 'black',
          }
        }
      },
      product: {
        connect: {
          id: product.id
        }
      }
    }
  });
}

async function ensureRolesExist() {
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'super admin' },
    update: {},
    create: { name: 'super admin' },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user', default: true },
  });

  const roles = { superAdminRole, adminRole, userRole };
  return roles;
}

function createRouteRecords(paths) {
  const routes = [];

  for (const path in paths) {
    const pathDetails = paths[path];
    const methodNames = Object.keys(pathDetails);

    for (const method of methodNames) {
      const routeAddress = path;
      const routeMethod = RequestMethod[method.toUpperCase()];
      const routeDescription = pathDetails[method].summary || '';

      routes.push({
        address: routeAddress,
        method: routeMethod,
        description: routeDescription,
      });
    }
  }

  return routes;
}

function filterRoutes(createdRoutes: Route[], condition) {
  return createdRoutes.filter(condition).map((route) => ({ id: route.id }));
}

async function createAdminPermission(roles: { superAdminRole: Role, adminRole: Role, userRole: Role; }, createdRoutes: Route[]) {
  const routeIds = createdRoutes.map((route) => ({ id: route.id }));
  const loginRoutes = filterRoutes(createdRoutes, (item: Route) => item.address.includes('login'));
  const orderRoute = filterRoutes(createdRoutes, (item: Route) => {
    if (item.address === '/api/v1/order' && item.method === $Enums.RequestMethod.GET)
      return item;
  });
  const readApiRoutes = filterRoutes(createdRoutes, (item: Route) => {
    if (item.method === $Enums.RequestMethod.GET && item.address !== '/api/v1/order')
      return item;
  });

  await prisma.permission.upsert({
    where: { name: 'masterAccess' },
    update: {},
    create: {
      name: 'masterAccess',
      read: $Enums.ReadAccess.ANY,
      roles: { connect: { id: roles.superAdminRole.id } },
      routes: { connect: routeIds },
    },
  });

  await prisma.permission.upsert({
    where: { name: 'restrictedAccess' },
    update: {},
    create: {
      name: 'restrictedAccess',
      read: $Enums.ReadAccess.OWN,
      roles: { connect: { id: roles.userRole.id } },
      routes: { connect: readApiRoutes.concat(loginRoutes) },
    },
  });

  await prisma.permission.upsert({
    where: { name: 'orderAccess' },
    update: {},
    create: {
      name: 'orderAccess',
      read: $Enums.ReadAccess.OWN,
      roles: { connect: { id: roles.adminRole.id } },
      routes: { connect: orderRoute },
    },
  });
}

async function createUser(roles: { superAdminRole: Role, adminRole: Role, userRole: Role; }) {
  // Create the user and associate the "admin" role
  const password = await bcrypt.hash("123", 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superAdmin@gmail.com' },
    update: {},
    create: {
      email: 'superAdmin@gmail.com',
      password,
      username: 'superAdmin',
      roles: {
        create: [{
          role: { connect: { id: roles.superAdminRole.id } }
        }]
      }
    }
  });
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      password,
      username: 'admin',
      roles: {
        create: [{
          role: { connect: { id: roles.adminRole.id } }
        }]
      }
    }
  });
  const user = await prisma.user.upsert({
    where: { email: 'user@gmail.com' },
    update: {},
    create: {
      email: 'user@gmail.com',
      password,
      username: 'user',
      roles: {
        create: [{
          role: { connect: { id: roles.userRole.id } }
        },
        {
          role: { connect: { id: roles.adminRole.id } }
        }
        ]
      }
    }
  });
  return { superAdmin, admin, user };
}

// Execute the main function
main();

function generateRandomDate(from, to) {
  return new Date(
    from.getTime() +
    Math.random() * (to.getTime() - from.getTime()),
  );
}