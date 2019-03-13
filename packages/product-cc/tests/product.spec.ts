// tslint:disable:no-unused-expression
import { join } from 'path';
import { expect } from 'chai';
import * as uuid from 'uuid/v4';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import 'mocha';

import { Product } from '../src/product.model';
import { ProductControllerClient } from '../client';

describe('Product', () => {
    let modelSample: Product;
    let adapter: MockControllerAdapter;
    let productCtrl: ProductControllerClient;

    before(async () => {
        const now = new Date().getTime();
        modelSample = new Product();
        modelSample.id = uuid();
        modelSample.name = 'Test';
        modelSample.created = now;
        modelSample.modified = now;
        // Mocks the blockchain execution environment
        adapter = new MockControllerAdapter();
        productCtrl = new ProductControllerClient(adapter);

        await adapter.init([
            {
            version: '*',
            controller: 'ProductController',
            name: join(__dirname, '..')
            }
        ]);

    });

    it('should create a default model', async () => {
    await productCtrl.create(modelSample);

    const justSavedModel = await adapter.getById<Product>(modelSample.id);

    expect(justSavedModel.id).to.exist;
    });
});