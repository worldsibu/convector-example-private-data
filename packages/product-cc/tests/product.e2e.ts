// tslint:disable:no-unused-expression
import { homedir } from 'os';
import { expect } from 'chai';
import { resolve } from 'path';
import 'mocha';

import { CouchDBStorage } from '@worldsibu/convector-storage-couchdb';
import { FabricControllerAdapter } from '@worldsibu/convector-platform-fabric';
import { BaseStorage, ClientFactory, ConvectorControllerClient } from '@worldsibu/convector-core';

import { ProductController, MarbleTransientInput, Marble, MarblePrivateDetails } from '../src';

describe('Product', () => {
    let adapter: FabricControllerAdapter;
    let productCtrl: ConvectorControllerClient<ProductController>;

    before(async () => {
        const home = homedir();
        const keyStore = resolve(home, 'hyperledger-fabric-network/.hfc-org1');
        const networkProfile = resolve(home, 'hyperledger-fabric-network',
            'network-profiles/org1.network-profile.yaml');
        const userMspPath = resolve(home, 'hyperledger-fabric-network',
            'artifacts/crypto-config/peerOrganizations/org1.hurley.lab/users/User1@org1.hurley.lab/msp');

        adapter = new FabricControllerAdapter({
            skipInit: true,
            txTimeout: 300000,
            user: 'user1',
            channel: 'ch1',
            chaincode: 'product',
            keyStore,
            networkProfile,
            userMspPath,
            userMsp: 'org1MSP'
        });
        productCtrl = ClientFactory(ProductController, adapter);
        await adapter.init(true);

        BaseStorage.current = new CouchDBStorage({
            host: 'localhost',
            protocol: 'http',
            port: '5084'
        }, 'ch1_product');
    });

    it('should store private data', async () => {
        const transientInput = new MarbleTransientInput({
            name: "marble1",
            color: "blue",
            size: 35,
            owner: "tom",
            price: 99
        });
        
        console.log('Sending tx with transient:', transientInput.toJSON());
        await productCtrl
            .$config({ transient: { marble: transientInput.toJSON() }})
            .initMarble();

        (BaseStorage.current as CouchDBStorage).updateDefaultDB('ch1_product$$pcollection$marbles');
        const marble = await Marble.getOne('marble1');
        expect(marble.id).to.eql('marble1');
        expect(marble.size).to.eql(35);

        (BaseStorage.current as CouchDBStorage).updateDefaultDB('ch1_product$$pcollection$marble$private$details');
        const marblePrivate = await MarblePrivateDetails.getOne('marble1');
        expect(marblePrivate.id).to.eql('marble1');
        expect(marblePrivate.price).to.eql(99);
    });

    it('should query private data', async () => {
        const marble = await productCtrl.$query().readMarble('marble1');
        console.log('Got private data:', marble);
        expect(marble.id).to.eql('marble1');
        expect(marble.size).to.eql(35);
    });

    it('should query private data which is present on one peer only', async () => {
        const marblePrivate = await productCtrl.$query().readMarblePrivateDetails('marble1');
        console.log('Got private data:', marblePrivate);
        expect(marblePrivate.id).to.eql('marble1');
        expect(marblePrivate.price).to.eql(99);
    });
});