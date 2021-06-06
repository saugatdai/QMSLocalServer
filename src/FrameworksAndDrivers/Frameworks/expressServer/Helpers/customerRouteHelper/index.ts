import Customer from '../../../../../Entities/CustomerCore/Customer';
import { Request } from 'express';
import Token from '../../../../../Entities/TokenCore/Token';
import { createNewCategoryTokenBaseObject, createNewNonCategoryTokenBaseObject } from '../tokenBaseRouteHelper';

export const getCustomerFromReqeust = async (request: Request) => {

  let token: Token;

  if (request.body.tokenCategory) {
    const tokenBaseObject = await createNewCategoryTokenBaseObject(request.body.tokenCategory);
    token = tokenBaseObject.token;
  } else {
    const tokenBaseObject = await createNewNonCategoryTokenBaseObject();
    token = tokenBaseObject.token;
  }
  const customer: Customer = {
    customerId: 0,
    customerName: request.body.name,
    remarks: request.body.remarks,
    token: token
  };

  return customer;
}

