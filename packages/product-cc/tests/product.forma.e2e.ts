// tslint:disable:no-unused-expression
import { homedir } from 'os';
import { expect } from 'chai';
import { resolve } from 'path';
import 'mocha';

import { CouchDBStorage } from '@worldsibu/convector-storage-couchdb';
import { FabricControllerAdapter } from '@worldsibu/convector-platform-fabric';
import { BaseStorage, ClientFactory, ConvectorControllerClient } from '@worldsibu/convector-core';

import { ProductController, MarbleTransientInput, Marble, MarblePrivateDetails } from '../src';

const l = console.log;
describe('Product', () => {
    let adapter: FabricControllerAdapter;
    let productCtrl: ConvectorControllerClient<ProductController>;
    const configPath = '../../../config';
    const username = 'gdrtester';
    const channelname = 'public';
    const chaincodename = 'privatedata';
    const couchhost = '34.73.112.77';
    const couchport = '30069';
    const viewname = `${channelname}_${chaincodename}`;
    const marbelId = 'marble3';

    before(async () => {
        const keyStore = resolve(__dirname, configPath);
        const networkProfile = resolve(__dirname, configPath, 'networkprofile.yaml');

        l(keyStore);
        l(networkProfile);

        debugger;
        adapter = new FabricControllerAdapter({
            txTimeout: 300000,
            user: username,
            channel: channelname,
            chaincode: chaincodename,
            keyStore,
            networkProfile,
            // userMsp: orgname,
            userMspPath: keyStore
        });

        productCtrl = ClientFactory(ProductController, adapter);
        await adapter.init();

        BaseStorage.current = new CouchDBStorage({
            host: couchhost,
            protocol: 'http',
            port: couchport
        }, viewname);
    });

    it('should store private data', async () => {
        const transientInput = new MarbleTransientInput({
            name: marbelId,
            color: "blue",
            size: 35,
            owner: "tom",
            price: 99
        });

        console.log('Sending tx with transient:', transientInput.toJSON());
        await productCtrl
            .$config({ transient: { marble: transientInput.toJSON() } })
            .initMarble();

        (BaseStorage.current as CouchDBStorage).updateDefaultDB(`${viewname}$$pcollection$marbles`);
        const marble = await Marble.getOne(marbelId);
        expect(marble.id).to.eql(marbelId);
        expect(marble.size).to.eql(35);

        (BaseStorage.current as CouchDBStorage).updateDefaultDB(`${viewname}$$pcollection$marble$private$details`);
        const marblePrivate = await MarblePrivateDetails.getOne(marbelId);
        expect(marblePrivate.id).to.eql(marbelId);
        expect(marblePrivate.price).to.eql(99);
    });

    it('should query private data', async () => {
        const marble = await productCtrl.$query().readMarble(marbelId);
        console.log('Got private data:', marble);
        expect(marble.id).to.eql(marbelId);
        expect(marble.size).to.eql(35);
    });

    it('should query private data which is present on one peer only', async () => {
        const marblePrivate = await productCtrl.$query().readMarblePrivateDetails(marbelId);
        console.log('Got private data:', marblePrivate);
        expect(marblePrivate.id).to.eql(marbelId);
        expect(marblePrivate.price).to.eql(99);
    });
});