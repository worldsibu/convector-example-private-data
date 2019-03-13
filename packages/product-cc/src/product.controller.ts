import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core-controller';
import * as yup from 'yup';
import { marble, marblePrivateDetails, marbleTransientInput } from './product.model';
import { ChaincodeTx } from '@worldsibu/convector-core-chaincode';
import { Transform } from 'stream';

@Controller('product')
export class ProductController extends ConvectorController<ChaincodeTx> {

  @Invokable()
  public async initMarble(): Promise<any> {
    let transMap = this.tx.stub.getStub().getTransient();

    let strData = transMap.get('marble').toString('utf8')
    let req: marbleTransientInput = new marbleTransientInput(JSON.parse(strData));

    console.log(req.toJSON());

    // Let's split the input data into 2 models in two different collections

    let col1Data = new marble({
      id: req.name,
      color: req.color,
      name: req.name,
      owner: req.owner,
      size: req.size
    });

    await this.tx.stub.putState('test', 'thisworks');

    console.log('passed');

    // await this.tx.stub.getStub().putPrivateData('collectionMarbles', req.name, Buffer.from(JSON.stringify(col1Data)));

    await this.tx.stub.putState(col1Data.name, col1Data, {
      privateCollection: 'collectionMarbles'
    });

    let col2Data = new marblePrivateDetails({
      id: req.name,
      name: req.name,
      price: req.price
    });

    await this.tx.stub.putState(col2Data.name, col2Data, {
      privateCollection: 'collectionMarblePrivateDetails'
    });
    // await this.tx.stub.getStub().putPrivateData('collectionMarblePrivateDetails', req.name, Buffer.from(JSON.stringify(col2Data)));
  }
  @Invokable()
  public async readMarble(@Param(yup.string()) id: string): Promise<any> {
    return this.tx.stub.getStub().getPrivateData('collectionMarbles', id);
  }
  @Invokable()
  public async readMarblePrivateDetails(@Param(yup.string()) id: string): Promise<any> {
    return this.tx.stub.getStub().getPrivateData('collectionMarblePrivateDetails', id);
  }
}