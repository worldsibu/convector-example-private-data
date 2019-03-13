import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core-controller';
import * as yup from 'yup';
import { marble, marblePrivateDetails, marbleTransientInput } from '../src/product.model';
import { ChaincodeTx } from '@worldsibu/convector-core-chaincode';
import { Transform } from 'stream';
import { ControllerAdapter } from '@worldsibu/convector-core-adapter';


export class ProductControllerClient extends ConvectorController<ChaincodeTx> {
  public name = 'product';

  constructor(public adapter: ControllerAdapter, public user?: string) {
    super()
  }

  
  public async initMarble(): Promise<any> {

          return await this.adapter.invoke(this.name, 'initMarble', this.user, );
        
  }
  
  public async readMarble(id: string): Promise<any> {

          return await this.adapter.invoke(this.name, 'readMarble', this.user, id);
        
  }
  
  public async readMarblePrivateDetails(id: string): Promise<any> {

          return await this.adapter.invoke(this.name, 'readMarblePrivateDetails', this.user, id);
        
  }
}