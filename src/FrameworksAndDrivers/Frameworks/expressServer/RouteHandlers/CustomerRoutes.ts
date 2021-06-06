import { Request, Response } from 'express';
import Controller from '../Decorators/Controller';
import CustomerStorageInteractorImplementation from '../../../../InterfaceAdapters/CustomerStorageInteractorImplementation';
import CustomerStorageImplementation from '../../../../FrameworksAndDrivers/Drivers/CustomerStorageImplementation';
import { del, get, patch, post } from '../Decorators/PathAndRequestMethodDecorator';
import use from '../Decorators/MiddlewareDecorator';
import { auth, checkAdminAuthority } from '../Middlewares/UserMiddlewares';
import { checkForAdminOrRegistrator, checkForRegistrator } from '../Middlewares/TokenBaseRoutesMiddleware';
import CustomerManager from '../../../../UseCases/CustomerManagementComponent/CustomerManager';
import Customer from '../../../../Entities/CustomerCore/Customer';
import { getCustomerFromReqeust } from '../Helpers/customerRouteHelper';

@Controller('/customer')
class CustomerRoutes {
  @get('/')
  @use(auth)
  @use(checkForAdminOrRegistrator)
  public async getCustomer(req: Request, res: Response) {
    try {
      const customerStorageInteractorImplementation = new CustomerStorageInteractorImplementation(CustomerStorageImplementation);
      const allCustomers = await customerStorageInteractorImplementation.getAllCustomers();
      res.status(200).send(allCustomers);
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @get('/:id')
  @use(auth)
  @use(checkForAdminOrRegistrator)
  public async getACustomerById(req: Request, res: Response) {
    try {
      const customerStorageInteractorImpelementation = new CustomerStorageInteractorImplementation(CustomerStorageImplementation);
      const customer = await customerStorageInteractorImpelementation.getCustomerById(parseInt(req.params.id));
      res.status(200).send(customer);
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @patch('/:id')
  @use(auth)
  @use(checkForRegistrator)
  public async updateCustomerById(req: Request, res: Response) {
    try {
      const customerStorageInteractorImplementation = new CustomerStorageInteractorImplementation(CustomerStorageImplementation);
      const existingCustomer = await customerStorageInteractorImplementation.getCustomerById(parseInt(req.params.id));

      existingCustomer.customerName = req.body.customerName;
      existingCustomer.remarks = req.body.remarks;

      const customerManager = new CustomerManager(existingCustomer);
      customerManager.customerStorageInteractorAdapter = customerStorageInteractorImplementation;

      await customerManager.update();

      const updatedCustomer = await customerStorageInteractorImplementation.getCustomerById(parseInt(req.params.id));

      res.status(200).send(updatedCustomer);
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @del('/:id')
  @use(auth)
  @use(checkForRegistrator)
  public async deleteCustomerById(req: Request, res: Response) {
    try {
      const customerStorageInteractorImpelementation = new CustomerStorageInteractorImplementation(CustomerStorageImplementation);
      const customer = await customerStorageInteractorImpelementation.getCustomerById(parseInt(req.params.id));

      const customerManager = new CustomerManager(customer);
      customerManager.customerStorageInteractorAdapter = customerStorageInteractorImpelementation;

      await customerManager.delete();

      res.status(200).send();
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }


  @post('/')
  @use(auth)
  @use(checkForRegistrator)
  public async createCustomer(req: Request, res: Response) {
    const customerStorageInteractorImplementation = new CustomerStorageInteractorImplementation(CustomerStorageImplementation);
    const customer: Customer = await getCustomerFromReqeust(req);

    const customerManager = new CustomerManager(customer);
    customerManager.customerStorageInteractorAdapter = customerStorageInteractorImplementation;

    if (req.body.additionalProperty) {
      if (req.body.additionalProperty.propertyDataType === 'string')
        customerManager.addCustomerInfo<string>(req.body.additionalProperty.propertyName, req.body.additionalProperty.propertyValue);
      else if (req.body.additionalProperty.propertyDataType === 'number')
        customerManager.addCustomerInfo<number>(req.body.additionalProperty.propertyName, req.body.additionalProperty.propertyValue);
    }

    await customerManager.store();

    res.status(201).send(customer);
  }

  @del('/delete/allcustomers')
  @use(auth)
  @use(checkForRegistrator)
  public async clearCustomerFromBase(req: Request, res: Response) {
    const customerStorageInteractorImpelementation = new CustomerStorageInteractorImplementation(CustomerStorageImplementation);
    await customerStorageInteractorImpelementation.resetCustomers();
    res.status(200).send();
  }
}