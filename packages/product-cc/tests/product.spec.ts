// tslint:disable:no-unused-expression
import { join } from 'path';
import { expect } from 'chai';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import { ClientFactory, ConvectorControllerClient } from '@worldsibu/convector-core';
import 'mocha';

import { ProductController, MarbleTransientInput, Marble, MarblePrivateDetails } from '../src';

describe('Product', () => {
    let adapter: MockControllerAdapter;
    let productCtrl: ConvectorControllerClient<ProductController>;

    before(async () => {
        // Mocks the blockchain execution environment
        adapter = new MockControllerAdapter();
        productCtrl = ClientFactory(ProductController, adapter);

        await adapter.init([{
            version: '*',
            controller: 'ProductController',
            name: join(__dirname, '..')
        }]);
    });

    it('should store private data', async () => {
        const transientInput = new MarbleTransientInput({
            name: "marble1",
            color: "blue",
            size: 35,
            owner: "tom",
            price: 99
        });
        
        await productCtrl
            .$config({ transient: { marble: transientInput.toJSON() }})
            .initMarble();

        const marbleRaw = await adapter.stub.getPrivateData('collectionMarbles', transientInput.name);
        const marble = new Marble(JSON.parse(marbleRaw.toString('utf8')));
        expect(marble.id).to.eql('marble1');
        expect(marble.size).to.eql(35);

        const marblePrivateRaw = await adapter.stub.getPrivateData('collectionMarblePrivateDetails', transientInput.name);
        const marblePrivate = new MarblePrivateDetails(JSON.parse(marblePrivateRaw.toString('utf8')));
        expect(marblePrivate.id).to.eql('marble1');
        expect(marblePrivate.price).to.eql(99);
    });

    it('should query private data', async () => {
        const marble = await productCtrl.$query().readMarble('marble1');
        expect(marble.id).to.eql('marble1');
        expect(marble.size).to.eql(35);

        const marblePrivate = await productCtrl.$query().readMarblePrivateDetails('marble1');
        expect(marblePrivate.id).to.eql('marble1');
        expect(marblePrivate.price).to.eql(99);
    })
});