import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import Customer from '../../Entities/CustomerCore/Customer';
import Token from '../../Entities/TokenCore/Token';
import { CustomerStorageAdapter } from '../../InterfaceAdapters/CustomerStorageInteractorImplementation';

const getCustomers = async () => {
  try {
    const prismaCustomers = await prisma.customer.findMany({
      include: {
        token: {
          include: {
            tokenCategory: true
          }
        }
      }
    });
    if (prismaCustomers.length === 0) {
      throw new Error("No Customer Found");
    }

    const customers: Customer[] = prismaCustomers.map(prismaCustomer => {

      const token: Token = {
        date: new Date(prismaCustomer.token.date),
        tokenId: prismaCustomer.token.tokenId,
        tokenNumber: prismaCustomer.token.tokenNumber,
        tokenCategory: prismaCustomer.token.tokenCategory.category
      }

      const temp: Customer = {
        customerId: prismaCustomer.customerId,
        customerName: prismaCustomer.customerName,
        remarks: prismaCustomer.remarks,
        token: token
      }

      return temp;
    })
    return customers;
  } catch (error) {
    console.log(error.toString());
  }
}


const createCustomer = async (customer: Customer) => {
  try {
    const prismaCustomer = await prisma.customer.create({
      data: {
        customerName: customer.customerName,
        tokenId: customer.token.tokenId,
        remarks: customer.remarks
      }
    });
  } catch (error) {
    console.log(error.toString);
  }

}
const readCustomerById = async (customerId: number) => {
  const prismaCustomer = await prisma.customer.findFirst({
    where: {
      customerId: customerId
    },
    include: {
      token: {
        include: {
          tokenCategory: true
        }
      }
    }
  });

  if (!prismaCustomer) {
    throw new Error('No customer with given ID');
  }

  const customer: Customer = {
    ...prismaCustomer,
    token: {
      tokenCategory: prismaCustomer.token.tokenCategory.category,
      date: new Date(prismaCustomer.token.date),
      tokenId: prismaCustomer.token.tokenId,
      tokenNumber: prismaCustomer.token.tokenNumber
    }
  }

  return customer;
}

const updateCustomer = async (customer: Customer) => {
  try {
    await prisma.customer.update({
      where: {
        customerId: customer.customerId
      },
      data: {
        customerId: customer.customerId,
        customerName: customer.customerName,
        remarks: customer.remarks,
        tokenId: customer.token.tokenId
      }
    });
  } catch (error) {
    console.log(error.toString);
  }
}

const deleteCustomerById = async (customerId: number) => {
  try {
    await prisma.customer.delete({
      where: {
        customerId: customerId
      }
    });
  } catch (error) {
    console.log(error.toString());
  }
}


const getNextAvailableId = async () => {
  try {
    const largestCustomerId = await prisma.customer.count();
    return largestCustomerId + 1;
  } catch (error) {
    console.log(error.toString());
  }
}

const isIdAvailable = async (id: number) => {
  try {
    const customer = await prisma.customer.findFirst({
      where: {
        customerId: id
      }
    });
    return (customer ? false : true);
  } catch (error) {
    console.log(error.toString());
  }
}
const resetCustomers = async () => {
  try {
    await prisma.customer.deleteMany({});
  } catch (error) {
    console.log(error.toString());
  }
}



const CustomerStorageImplementation: CustomerStorageAdapter = {
  getCustomers,
  createCustomer,
  readCustomerById,
  updateCustomer,
  deleteCustomerById,
  getNextAvailableId,
  isIdAvailable,
  resetCustomers
}

export default CustomerStorageImplementation;