import * as yup from 'yup';
import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';

import { Marble, MarblePrivateDetails, MarbleTransientInput } from './product.model';

@Controller('product')
export class ProductController extends ConvectorController<ChaincodeTx> {

  @Invokable()
  public async initMarble(): Promise<any> {
    const req = await this.tx.getTransientValue<MarbleTransientInput>('marble', MarbleTransientInput);

    // Let's split the input data into 2 models in two different collections
    const col1Data = new Marble({
      id: req.name,
      color: req.color,
      name: req.name,
      owner: req.owner,
      size: req.size
    });

    await col1Data.save({ privateCollection: 'collectionMarbles' });

    const col2Data = new MarblePrivateDetails({
      id: req.name,
      name: req.name,
      price: req.price
    });

    await col2Data.save({ privateCollection: 'collectionMarblePrivateDetails' });
  }

  @Invokable()
  public async readMarble(@Param(yup.string()) id: string): Promise<any> {
    const marble = await Marble.getOne(id, Marble, { privateCollection: 'collectionMarbles' });

    if (!marble.id) {
      throw new Error(`No marble with id ${id}`);
    }

    return marble.toJSON();
  }

  @Invokable()
  public async readMarblePrivateDetails(@Param(yup.string()) id: string): Promise<any> {
    const marblePrivate = await MarblePrivateDetails.getOne(id, MarblePrivateDetails, {
      privateCollection: 'collectionMarblePrivateDetails'
    });

    if (!marblePrivate.id) {
      throw new Error(`No marble private data with id ${id}`);
    }

    return marblePrivate.toJSON();
  }
}